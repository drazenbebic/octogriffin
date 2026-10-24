# Per-trigger cooldowns

- **Status:** design approved, spec awaiting review
- **Date:** 2026-10-24
- **Scope:** `apps/web` only
- **Roadmap:** Anti-Cheese phase, "Per-trigger cooldowns"

## 1. Why

The Anti-Cheese phase exists so rewards stay meaningful. Four problems sit underneath it:

1. **Rewards lose meaning** when automation or very granular commits inflate scores.
2. **Party fairness:** inflated scoring deals outsized boss damage in a Habitica party.
3. **Runaway negatives:** a score-down trigger firing in a burst drains HP or kills the character.
4. **Habitica API load:** bursts of scores hit Habitica's rate limit.

Cooldowns address the _pace_ of rewards: after a trigger scores, it rests. Daily caps (a separate roadmap item) address the _total_. API load is an internal fix and out of scope here (see §9).

Deliberate cheating is not a design goal. Octogriffin rewards the user in their own Habitica, and Habitica lets anyone click "+" on a habit as often as they like.

## 2. Behaviour

A trigger may have an optional cooldown. When it scores, it scores exactly as it does today. Every later event for that trigger is skipped until the cooldown has passed since the last score that actually happened.

Example with a 10 minute cooldown:

| Time | Push       | Result                                                  |
| ---- | ---------- | ------------------------------------------------------- |
| 0:00 | 7 commits  | Scores 7×, cooldown starts                              |
| 0:03 | 7 commits  | Skipped, cooling down                                   |
| 0:06 | 8 commits  | Skipped, cooling down                                   |
| 0:10 | 20 commits | Scores 10× (`MAX_REWARDS_PER_EVENT`), cooldown restarts |

Rules:

- **No cooldown is the default.** Existing and new triggers without one behave exactly as today.
- **The clock starts at the last real score.** If Habitica scores nothing for the trigger, or the delivery fails and will be retried, the cooldown does not start.
- **Skipped events don't restart the cooldown.** Otherwise steady activity would keep a trigger cooling down forever.
- **Ready at exactly the cooldown.** A trigger scores again once `now - lastScoredAt >= cooldownSeconds`.
- **One cooldown per trigger, across all its repositories.** Split repositories into separate triggers for separate cooldowns.
- **Time is when Octogriffin processes the event**, not commit timestamps.
- **The per-event limit still applies** on top of the cooldown.
- **Partly scored triggers keep their cooldown.** If a trigger scored 3 of 7 times before Habitica failed, it did score, and the existing "never retry part-scored rewards" rule stays.

This variant favours batching: commits pushed one by one during a cooldown score nothing, while the same commits in one push all score. That is accepted as predictable and easy to explain.

### Rejected alternatives

- **A push scores once when a cooldown is set.** Penalises people who batch pushes rather than people who work in bursts.
- **Cooldown follows commit timestamps.** Fairer to batching, but timestamps come from the committer's machine and the logic is much harder to explain. Not worth it once the push-time variant above was chosen.
- **Drop cooldowns in favour of daily caps.** Daily caps cover the total, but the owner wants a true cooldown as well.

## 3. Data

One Prisma migration on `Triggers`, adding nullable columns only:

```prisma
cooldownSeconds Int?      @map("cooldown_seconds")
lastScoredAt    DateTime? @map("last_scored_at")
```

- `cooldownSeconds` is `null` for no cooldown. The maximum, 365 days (31,536,000 s), fits a Postgres `Int`.
- `lastScoredAt` is only written for triggers with a cooldown. Triggers without one never write it.
- Changing or removing a cooldown doesn't reset `lastScoredAt`. The check always uses the current `cooldownSeconds`, so a shorter cooldown takes effect immediately.
- The migration is safe to deploy before or after the code.

## 4. Validation and conversion

`src/schemas/triggerSchema.ts` gets two form-shaped fields:

```ts
cooldownAmount: z.coerce.number().int().positive().optional(), // empty or "" = no cooldown (preprocessed to undefined)
cooldownUnit: z.enum(['seconds', 'minutes', 'hours', 'days']), // default 'minutes'
```

plus a check on the pair against the per-unit maximum, with the message _"Please keep the cooldown to 365 days or less."_

| Unit    | Maximum    |
| ------- | ---------- |
| seconds | 31,536,000 |
| minutes | 525,600    |
| hours   | 8,760      |
| days    | 365        |

The check compares the amount to its unit's maximum, never multiplies first, so huge input can't overflow. The form and the server actions run the same schema.

New `src/utils/cooldown.ts`, pure and unit-tested:

- `toCooldownSeconds(amount, unit)`, used by `createTriggerAction` and `updateTriggerAction` before saving. An empty amount saves `null`.
- `fromCooldownSeconds(seconds)` → `{ amount, unit }` in the largest unit that divides evenly (600 → 10 minutes, 90 → 90 seconds, 86400 → 1 day). Used to fill the edit form and to label the chip. Someone who typed "60 minutes" sees "1 hour" when editing; the value is the same.

## 5. Reward flow

### Compare-and-set claim

The trigger's `lastScoredAt` is already loaded with the trigger. The claim succeeds only if it is unchanged since it was read, so concurrent deliveries can't both win. Plain Prisma, no raw SQL:

```ts
// claim
updateMany({
  where: { uuid, lastScoredAt: previous },
  data: { lastScoredAt: now },
}); // count === 1
// release: undo only our own claim
updateMany({
  where: { uuid, lastScoredAt: now },
  data: { lastScoredAt: previous },
});
```

### Steps

1. **Policy** (`src/rewards/rewardPolicy.ts`): `evaluateRewards` receives `now`. It skips triggers where `lastScoredAt + cooldownSeconds > now` and logs `Ignored: Trigger is cooling down.` Rewards for triggers with a cooldown carry the `lastScoredAt` they were read with.
2. **Claim** (`src/rewards/deliverRewards.ts`): after the existing delivery claim (`RewardLog.claim`), each cooldown reward is claimed with the compare-and-set. A lost claim means a parallel delivery got there first, so that reward is dropped. If no rewards remain, the delivery claim is released and the recipient is done.
3. **Score:** `RewardSink.apply` scores as today, and now **returns the uuids of the triggers that scored at least once**.
4. **Release:**
   - A claimed trigger that scored nothing gets its previous `lastScoredAt` back.
   - If `apply` throws (nothing scored at all), every cooldown claim is released along with the delivery claim, so GitHub's retry gets a fair chance.
   - A partly scored trigger keeps its claim.

### New pieces

- `TriggerCooldowns` port (`claim`, `release`) in `src/rewards/types.ts`, mirroring `RewardLog`.
- `src/rewards/prismaTriggerCooldowns.ts`, the Prisma implementation.
- `rewardDeps` gains `cooldowns` and `now: () => Date`, so tests control the clock.
- `TriggerRule` gains `cooldownSeconds` and `lastScoredAt`. `prismaRewardDirectory` already loads full trigger rows, so it needs no query change.

### Safety

- **Concurrent deliveries** read the same `lastScoredAt`; only one compare-and-set succeeds.
- **GitHub redeliveries** are caught by the existing delivery claim before any cooldown claim.

## 6. UI

**Trigger modal** (`src/components/dashboard/TriggerModal.tsx`): a **Cooldown** row at the bottom of the "How it counts" fieldset, under Attribute and Counter resets.

```
Cooldown
[  10  ]  [ sec | min | hours | days ]
After it scores, this trigger rests for this long. Leave empty for no cooldown.
```

- Number: `FormInput`, `type="number"`, `min=1`, placeholder "None". Unit: `FormSegmentedControl`, default **min**, always enabled so the row doesn't shift while typing.
- Validation errors show under the row through the existing form feedback.
- Editing a trigger fills both fields with `fromCooldownSeconds`.

**Preview sentence** (`src/utils/describeTrigger.ts`): with a cooldown set, the live preview adds a clause such as _"After scoring, it rests for 10 minutes."_ (a push can still score up to 10×, so not "at most once")

**Trigger list** (`src/components/dashboard/TriggerRow.tsx`): a neutral `Chip` with a timer icon, e.g. **"10 min cooldown"**, next to the title where the "New" chip sits. No new column. Shown only when a cooldown is set; it fades with the row when the trigger is off.

There is no live countdown and no "skipped" history. Both belong to the Ledger phase ("see exactly why you got rewarded, or why you didn't").

## 7. Testing

- **`cooldown.ts`:** conversions in both directions, the largest-unit rule, each unit's maximum.
- **`triggerSchema.test.ts`:** empty accepted; 0, decimals and negatives rejected; 365 days accepted; 366 days, 525,601 minutes and 1,000,000,000 days rejected without overflow.
- **`deliverRewards.test.ts`** with fake ports and an injected clock:
  - no cooldown behaves as today
  - the §2 timeline: 7 scored, skip, skip, 10 scored at exactly 10:00
  - a skipped event doesn't move `lastScoredAt`
  - a lost compare-and-set drops the reward
  - a claimed trigger that scored nothing is released
  - a sink failure releases every claim
  - a partly scored trigger keeps its claim
- **`prismaTriggerCooldowns`:** mocked-Prisma test (like `src/accessors/githubUser.test.ts`) asserting the `where` and `data` of claim and release. The repo has no real-database tests, so concurrent deliveries are covered through the `count === 1` logic, not real parallel requests.
- **Actions:** `createTriggerAction` and `updateTriggerAction` save seconds, or `null` for empty.
- **Components:** the modal fills values on edit and shows the 365-day error; the list shows the chip only when a cooldown is set.
- **Manual:** a local push through ngrok: push, push again inside the cooldown, push after it.

## 8. Docs and copy

- `src/config/roadmap.ts`: change the cooldown item's description to _"Let a trigger rest for a while after it scores, so a burst of pushes counts once."_ It stays in progress until the phase ships.
- FAQ, "What prevents me from spamming commits for infinite Gold?": add a sentence about cooldowns.
- `README.md` "Fair rewards" and the supported events page's note on the 10-per-event limit: mention cooldowns.

## 9. Out of scope

- **Daily caps:** separate roadmap item in the same phase.
- **Live "cooling down" status and skipped-event history:** Ledger phase.
- **Pacing requests to Habitica's rate limit.** Today a `429` partway through a reward keeps the scores already made and silently drops the rest (`src/rewards/habiticaRewardSink.ts`). Worth a separate internal fix.

## 10. Rollout

- Branch `feat/trigger-cooldowns`, squash-merged into `main`.
- Changelog subject: `feat(web): let triggers rest for a while after they score`.
