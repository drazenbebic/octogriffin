# Daily caps

- **Status:** design approved, spec awaiting review
- **Date:** 2026-10-24
- **Scope:** `apps/web` only
- **Roadmap:** Anti-Cheese phase, "Daily XP caps" (renamed "Daily caps")
- **Builds on:** `docs/superpowers/specs/2026-10-24-trigger-cooldowns-design.md`

## 1. Why

Anti-Cheese keeps rewards meaningful. Cooldowns (shipped on `main`) limit how _often_ a trigger scores. Daily caps limit how _much_: at most N scores a day per trigger. Together they address three of the phase's problems:

- **Rewards lose meaning** when automation or very granular commits inflate scores.
- **Party fairness:** inflated scoring deals outsized boss damage.
- **Runaway negatives:** capping a score-down trigger at 3 a day bounds the HP it can take.

## 2. Behaviour

- **Optional, per trigger.** Off by default. Existing triggers behave exactly as today.
- **Counts Octogriffin's scores only**, for that trigger. Manual clicks in Habitica and other triggers scoring the same habit don't use it up.
- **Counts scores, not events.** A 7-commit push uses 7.
- **The day is the user's Habitica day:** their timezone and custom day start, the same moment their Dailies reset.
- **Always per day**, independent of the trigger's "Counter resets" setting (which stays a Habitica setting).
- **At the limit, score what's left and drop the rest.** With a cap of 10 and 7 used, a 5-commit push scores 3.
- **Only real scores count.** Slots granted but not scored (Habitica refused, partly scored, delivery failed) are given back.
- **Works with cooldowns.** A trigger can have both. If the cap is reached, the trigger doesn't score, so its cooldown doesn't start.
- **Edits apply at once.** Lowering the cap below today's usage stops the trigger for the rest of the day; raising it frees the difference; clearing it removes the limit.
- **`MAX_REWARDS_PER_EVENT`** (default 10) still applies first.

Example, cap 10, one Habitica day:

| Push      | Granted | Result                                             |
| --------- | ------- | -------------------------------------------------- |
| 7 commits | 7       | Scores 7×                                          |
| 5 commits | 3       | Scores 3×, cap reached                             |
| 4 commits | 0       | Skipped: `Ignored: Trigger reached its daily cap.` |
| next day  | —       | Starts again from 0                                |

### Rejected alternatives

- **Use the habit's own Habitica counter.** No storage, but manual clicks and other triggers would share the cap, and concurrent deliveries could overshoot.
- **Midnight UTC.** Resets at odd local times, e.g. mid-afternoon in California.
- **Rolling 24 hours.** Doesn't line up with any day the user knows.
- **Cap per "Counter resets" period.** Mixes two settings with different jobs, and a weekly cap still allows a burst.
- **Score history table now.** Useful for the Ledger phase, but more to build and still needs a lock. Build it with the Ledger.
- **Compare-and-set with retries.** Under load it gives up and drops rewards while slots are left.

## 3. Data

One Prisma migration on `Triggers`:

```prisma
dailyCap Int?    @map("daily_cap")
capDay   String? @map("cap_day") @db.VarChar(10) // Habitica day, "2026-10-24"
capCount Int     @default(0) @map("cap_count")
```

- `dailyCap` is `null` for no cap. `capDay` and `capCount` are only written for triggers with a cap.
- When `capDay` isn't today, the trigger has used 0 today, whatever `capCount` says. Nothing resets at midnight.
- The migration adds nullable columns and one with a default, so it is safe before or after the code.

## 4. Validation

`src/schemas/triggerSchema.ts` gets `dailyCap`, following `cooldownAmount`:

- `''` → no cap (preprocessed to `undefined`).
- A whole number (`Please use a whole number.`) above 0 (`Please use a number above 0.`), at most 1,000 (`Please keep the daily cap to 1,000 or less.`).
- `createTriggerAction` and `updateTriggerAction` save `dailyCap ?? null`.

## 5. The Habitica day

`src/utils/habiticaDay.ts`, pure:

```ts
getHabiticaDay(now: Date, prefs: { dayStart: number; timezoneOffset: number }): string // "YYYY-MM-DD"
```

It mirrors Habitica's `startOfDay` (`website/common/script/cron.js`):

1. `timezoneOffset` is in minutes with the inverse sign (like JS `getTimezoneOffset`: Vienna in summer is `-120`). Local time is `now - timezoneOffset` minutes.
2. If the local hour is before `dayStart`, it is still the previous day.
3. Return that local date as `YYYY-MM-DD`.

Invalid input is handled the way Habitica does: an offset outside -840..720 falls back to 0 (UTC, the server's offset). Habitica checks -720..840 on the negated offset, so UTC-12 to UTC+14 is 720 to -840 in this sign convention, and a `dayStart` outside 0–24 or not a number falls back to 0, as in Habitica's `sanitizeOptions`.

`HabiticaApi.getDayPreferences()` calls `GET /user?userFields=preferences.dayStart,preferences.timezoneOffset` (Habitica documents `userFields` with dotted paths) and reads both fields defensively: a missing field counts as 0.

## 6. Reward flow

### New pieces

- **`TriggerCaps` port** (`src/rewards/types.ts`), implemented by `src/rewards/prismaTriggerCaps.ts`:
  - `claim(triggerUuid, day, wanted): Promise<number>` returns how many slots were granted. One `prisma.$transaction`: lock the row with `SELECT daily_cap, cap_day, cap_count FROM triggers WHERE uuid = … FOR UPDATE`, count today's usage (0 when `cap_day ≠ day`), grant `min(wanted, daily_cap − used)` (never below 0), save `cap_day = day`, `cap_count = used + granted`. Reads the current `daily_cap` inside the lock. If the cap was cleared since the policy read it, grant `wanted` and count it as usual: without a cap the count is ignored, and a later release stays consistent.
  - `release(triggerUuid, day, count): Promise<void>` atomically decrements `cap_count` by `count`, only while `cap_day = day` and `cap_count ≥ count`.
- **`HabiticaDays` port**, `today(credentials, now): Promise<string>`, implemented with `getDayPreferences()` and `getHabiticaDay()`.
- **Policy:** rewards for triggers with `dailyCap !== null` get `hasDailyCap: true`. No pre-filter, because today's Habitica day isn't known until the lookup.
- **`RewardSink.apply`** resolves to `Record<triggerUuid, number>`: how often each trigger actually scored (including partial scores). The cooldown release keeps its rule, now as `scored === 0`.
- `RewardDeps` gains `caps` and `days`, wired in `rewardDeps.ts`.

### Steps per recipient, after the delivery claim

1. **Cooldown claims**, as today.
2. **Habitica day:** only if a reward with `hasDailyCap` is left, one `days.today()` call for the recipient.
3. **Cap claims:** `granted = caps.claim(uuid, today, reward.times)` per capped reward.
   - `granted === 0`: drop the reward, log `Ignored: Trigger reached its daily cap.`, release its cooldown claim.
   - `granted < times`: score `granted` times.
4. **Score** the remaining rewards.
5. **Release unused:** cooldowns of triggers that scored 0; cap slots `granted − scored` per capped trigger.

### Failures

If the day lookup fails, a cap claim throws, or the sink scores nothing, `releaseEverything` gives back every cooldown claim, every cap grant and the delivery claim, each independently, and the error is rethrown so a retry can reward it. Triggers without a cap never call the lookup or take a lock.

### Safety

- **Concurrent deliveries** wait on the row lock and get the remaining slots in turn: no overshoot, no lost rewards while slots are left.
- **GitHub redeliveries** stop at the delivery claim before any cap claim.

## 7. UI

**Trigger modal** (`src/components/dashboard/TriggerModal.tsx`): a **Daily cap** field under the Cooldown row in "How it counts".

```
Daily cap
[  10  ]
The most this trigger can score in a Habitica day. Leave empty for no cap.
```

- `FormInput`, `type="number"`, `min={1}`, in the same `8rem` column as the cooldown amount. No unit. Its placeholder is `No cap`, distinct from the cooldown's `None`.
- Editing fills the saved value. New triggers and recipes start without a cap.

**Preview sentence** (`src/utils/describeTrigger.ts`): after the cooldown clause, _"It scores at most 10 times a day."_, or _"It scores at most once a day."_ for 1. Both the cap and the cooldown clauses only appear for values that would save (whole numbers above 0 within their limits), which fixes the deferred cooldown minor that showed "-5 minutes".

**Trigger list** (`src/components/dashboard/TriggerRow.tsx`): a neutral chip **"10/day"** with a calendar icon, next to the cooldown chip. Shown only with a cap; it fades with the row when the trigger is off.

No "7 of 10 used today" yet: that belongs to the Ledger phase (Trigger stats).

## 8. Testing

- **`habiticaDay.ts`:** UTC; Vienna summer (`-120`, 22:30 UTC is the next day); California (`420`, 05:00 UTC is the previous day); `dayStart: 4` at 03:00 local is yesterday; month and year boundaries; invalid offset falls back to UTC; an invalid `dayStart` falls back to 0.
- **`triggerSchema.test.ts`:** empty accepted; 0, 1.5 and -3 rejected; 1,000 accepted; 1,001 rejected with the cap message.
- **`prismaTriggerCaps`** (mocked transaction): new day grants all; same day grants the rest; reached grants 0; cleared cap grants all and still counts; release only decrements on the same day. The repo has no real-database tests, so the row lock itself is not exercised against Postgres.
- **`HabiticaDays`:** builds the day from the fetched preferences; missing fields count as 0.
- **`deliverRewards.test.ts`** (fake ports, injected clock): the §2 timeline (7, then 3, then 0 with the log line); a new Habitica day starts fresh; cap and cooldown together, where a reached cap releases the cooldown claim; scored 3 of 7 gives back 4; a failed lookup or cap claim gives everything back; triggers without a cap never call `days` or `caps` (throwing fakes); one lookup per recipient.
- **Sink:** returns scored counts, including partial.
- **Actions, modal, row, sentence:** save `dailyCap` or `null`; the modal fills it on edit and shows the limit error; the chip only with a cap; the sentence for "once" and "10 times", and no clause for invalid cap or cooldown values.
- **Manual (ngrok):** cap 2, push 3 commits (2 score), push again (nothing scores).

## 9. Docs and copy

- `src/config/roadmap.ts`: rename "Daily XP caps" to **"Daily caps"**, description _"Set the most a trigger can score in a Habitica day, to prevent burnout."_ It stays planned until built, then in progress with the phase.
- FAQ ("What prevents me from spamming commits for infinite Gold?"): describe caps next to cooldowns; spam detection stays "next".
- `README.md` "Fair rewards" and the supported events page: one sentence on daily caps.

## 10. Out of scope

- Weekly or monthly caps (a "per" setting can be added later without breaking anything).
- Live usage ("7 of 10 today") and a score history: Ledger phase.
- A real-database test of the row lock.

## 11. Rollout

- Branch `feat/daily-caps` from `main`, squash-merged into `main`.
- Changelog subject: `feat(web): limit how often a trigger can score each day`.
