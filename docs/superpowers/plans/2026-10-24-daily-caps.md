# Daily caps Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Let a trigger score at most N times per Habitica day, counting only Octogriffin's scores.

**Architecture:** Three columns on `Triggers` (`dailyCap`, `capDay`, `capCount`). `deliverRewards` claims cooldowns first, then, only when a capped reward is left, looks up the recipient's Habitica day through a `HabiticaDays` port, then claims cap slots under a row lock through a `TriggerCaps` port, trimming each reward to what was granted. The sink reports how often each trigger scored, so unused cooldowns and cap slots are given back.

**Tech Stack:** Next.js 16 App Router, Prisma 7 (Postgres), Zod 4, Ariakit forms, Jest 30, pnpm.

**Spec:** `docs/superpowers/specs/2026-10-24-daily-caps-design.md`

## Global Constraints

- Paths are relative to `apps/web/` unless they start with `docs/` or `README.md` (repo root).
- Run tests from `apps/web`: `pnpm test -- <path>`. Lint: `pnpm lint`. Types: `pnpm exec tsc --noEmit`. After any `prisma/schema.prisma` change: `pnpm prisma:generate`.
- ESLint (perfectionist) sorts literal arrays and object keys on commit. Never rely on the order of a literal array; `it.each` tables get reordered too, so a test that depends on order must call things explicitly in sequence.
- Cap: whole number, 1 to 1,000 (`MAX_DAILY_CAP = 1000`). Empty (`''` or `undefined`) = no cap = `null` in the database.
- Validation copy: `Please use a whole number.`, `Please use a number above 0.`, `Please keep the daily cap to 1,000 or less.`
- Log line when a cap stops a trigger: `Ignored: Trigger reached its daily cap.`
- The Habitica day follows Habitica's `startOfDay`: local time is `now - timezoneOffset` minutes; before `dayStart` it's the previous day. Offset outside -840..720 → 0 (Habitica checks -720..840 on the negated value). `dayStart` outside 0–24 or not a number → 0 (Habitica's `sanitizeOptions`, not a clamp). Format `YYYY-MM-DD`.
- Day settings come from `GET /user?userFields=preferences.dayStart,preferences.timezoneOffset`; a missing field counts as 0.
- Triggers without a cap never call `days.today` or `caps.claim`.
- Commits: conventional, plain-English subjects; the branch is squash-merged as `feat(web): limit how often a trigger can score each day`. End every commit message with `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`. Commit body lines ≤ 100 characters (commitlint).

## Review Focus

1. **The cap is lowered below today's usage** (cap 5, 8 already used): the claim must grant 0, never a negative number, and must not lower `capCount`. Pinned in Task 5.
2. **Yesterday's count is high and a new Habitica day starts:** the claim grants from 0 and overwrites `capDay`/`capCount`. Pinned in Tasks 5 and 6.
3. **Users far from UTC near midnight, and a custom day start:** the day must match Habitica's, not UTC's. Pinned in Task 1.
4. **A trigger with both a cooldown and a reached cap:** it doesn't score, so its cooldown claim is released and `lastScoredAt` stays put. Pinned in Task 6.
5. **Habitica returns no `preferences`, or partial ones:** treated as offset 0 and day start 0, no crash. Pinned in Task 2.

---

### Task 1: Habitica day

**Files:**

- Create: `src/utils/habiticaDay.ts`
- Test: `src/utils/habiticaDay.test.ts`

**Interfaces:**

- Produces: `type DayPreferences = { dayStart: number; timezoneOffset: number }`; `getHabiticaDay(now: Date, prefs: DayPreferences): string`.

- [ ] **Step 1: Write the failing tests** (one `it` per case, so lint sorting can't change meaning)

```ts
const utc = (iso: string) => new Date(iso);

it('uses the UTC date without an offset', () => {
  expect(
    getHabiticaDay(utc('2026-10-24T23:59:00Z'), {
      dayStart: 0,
      timezoneOffset: 0,
    }),
  ).toBe('2026-10-24');
});
it('is already tomorrow in Vienna in summer', () => {
  expect(
    getHabiticaDay(utc('2026-07-01T22:30:00Z'), {
      dayStart: 0,
      timezoneOffset: -120,
    }),
  ).toBe('2026-07-02');
});
it('is still yesterday in California', () => {
  expect(
    getHabiticaDay(utc('2026-10-24T05:00:00Z'), {
      dayStart: 0,
      timezoneOffset: 420,
    }),
  ).toBe('2026-10-23');
});
it('is still yesterday before a custom day start', () => {
  expect(
    getHabiticaDay(utc('2026-10-24T03:00:00Z'), {
      dayStart: 4,
      timezoneOffset: 0,
    }),
  ).toBe('2026-10-23');
});
it('starts the day at the custom day start', () => {
  expect(
    getHabiticaDay(utc('2026-10-24T04:00:00Z'), {
      dayStart: 4,
      timezoneOffset: 0,
    }),
  ).toBe('2026-10-24');
});
it('crosses a year boundary', () => {
  expect(
    getHabiticaDay(utc('2027-01-01T02:00:00Z'), {
      dayStart: 4,
      timezoneOffset: 0,
    }),
  ).toBe('2026-12-31');
});
it('falls back to UTC for an offset Habitica would reject', () => {
  expect(
    getHabiticaDay(utc('2026-10-24T23:00:00Z'), {
      dayStart: 0,
      timezoneOffset: -900,
    }),
  ).toBe('2026-10-24');
});
it('treats a day start Habitica would reject as midnight', () => {
  expect(
    getHabiticaDay(utc('2026-10-24T23:00:00Z'), {
      dayStart: 30,
      timezoneOffset: 0,
    }),
  ).toBe('2026-10-24');
});
it('treats a day start that is not a number as midnight', () => {
  expect(
    getHabiticaDay(utc('2026-10-24T00:30:00Z'), {
      dayStart: Number.NaN,
      timezoneOffset: 0,
    }),
  ).toBe('2026-10-24');
});
```

- [ ] **Step 2: Run them to verify they fail**

Run: `pnpm test -- src/utils/habiticaDay.test.ts`
Expected: FAIL, `Cannot find module './habiticaDay'`

- [ ] **Step 3: Implement `getHabiticaDay`**

Shift by `-timezoneOffset` minutes with plain `Date` arithmetic and read the shifted date with the `getUTC*` methods. No date library: only UTC getters on a shifted timestamp.

- [ ] **Step 4: Run them to verify they pass**

Run: `pnpm test -- src/utils/habiticaDay.test.ts`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/utils/habiticaDay.ts src/utils/habiticaDay.test.ts
git commit -m "feat(web): work out the user's Habitica day"
```

---

### Task 2: Look up the Habitica day for a user

**Files:**

- Modify: `src/lib/HabiticaApi.ts` (next to `getUserStats`)
- Modify: `src/rewards/types.ts`
- Create: `src/rewards/habiticaDays.ts`
- Test: `src/lib/HabiticaApi.test.ts`, create `src/rewards/habiticaDays.test.ts`

**Interfaces:**

- Consumes: `DayPreferences`, `getHabiticaDay` (Task 1).
- Produces:
  - `HabiticaApi.getDayPreferences(): Promise<DayPreferences>`
  - In `types.ts`: `type HabiticaDays = { /** The recipient's current Habitica day, "YYYY-MM-DD". */ today: (credentials: UserCredentials, now: Date) => Promise<string> }`
  - `habiticaDays: HabiticaDays`

- [ ] **Step 1: Write the failing tests**

`HabiticaApi.test.ts` (use its `mockSuccessResponse`):

```ts
describe('getDayPreferences', () => {
  it('asks only for the day settings', async () => {
    mockSuccessResponse({ preferences: { dayStart: 4, timezoneOffset: -120 } });
    await expect(api.getDayPreferences()).resolves.toEqual({
      dayStart: 4,
      timezoneOffset: -120,
    });
    expect(mockFetch.mock.calls[0][0]).toContain(
      '/user?userFields=preferences.dayStart,preferences.timezoneOffset',
    );
  });
  it('counts missing settings as 0', async () => {
    mockSuccessResponse({});
    await expect(api.getDayPreferences()).resolves.toEqual({
      dayStart: 0,
      timezoneOffset: 0,
    });
  });
});
```

`habiticaDays.test.ts` (mock `@/lib/HabiticaApi` like `habiticaRewardSink.test.ts` does, with `getDayPreferences` resolving `{ dayStart: 0, timezoneOffset: 420 }`):

```ts
it("builds the day from the user's settings", async () => {
  await expect(
    habiticaDays.today(
      { apiToken: 'token', userId: 'user' },
      new Date('2026-10-24T05:00:00Z'),
    ),
  ).resolves.toBe('2026-10-23');
  expect(MockHabiticaApi).toHaveBeenCalledWith('user', 'token');
});
```

- [ ] **Step 2: Run them to verify they fail**

Run: `pnpm test -- src/lib/HabiticaApi.test.ts src/rewards/habiticaDays.test.ts`
Expected: FAIL: `getDayPreferences is not a function`, and module not found

- [ ] **Step 3: Implement**

`getDayPreferences` requests `/user?userFields=preferences.dayStart,preferences.timezoneOffset` with `GET` and maps each field through `Number.isFinite(value) ? value : 0`. `habiticaDays.today` builds a `HabiticaApi` from the credentials, fetches the settings and returns `getHabiticaDay(now, prefs)`.

- [ ] **Step 4: Run them to verify they pass**

Run: `pnpm test -- src/lib/HabiticaApi.test.ts src/rewards/habiticaDays.test.ts`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/lib src/rewards/types.ts src/rewards/habiticaDays.ts src/rewards/habiticaDays.test.ts
git commit -m "feat(web): look up when a user's Habitica day starts"
```

---

### Task 3: Store and validate the cap

**Files:**

- Modify: `prisma/schema.prisma` (model `Triggers`, after `lastScoredAt`)
- Create: `prisma/migrations/20261024120000_add_trigger_daily_caps/migration.sql`
- Modify: `src/schemas/triggerSchema.ts`, `src/actions/triggers/createTriggerAction.ts`, `src/actions/triggers/updateTriggerAction.ts`
- Test: `src/schemas/triggerSchema.test.ts`, `src/actions/triggers/createTriggerAction.test.ts`, `src/actions/triggers/updateTriggerAction.test.ts`

**Interfaces:**

- Produces:
  - Prisma `Triggers.dailyCap: number | null`, `capDay: string | null`, `capCount: number`.
  - `MAX_DAILY_CAP = 1000`, exported from `triggerSchema.ts`.
  - `TriggerSchema.dailyCap?: number`.

- [ ] **Step 1: Add the columns and migration, then regenerate**

```prisma
dailyCap        Int?      @map("daily_cap")
capDay          String?   @map("cap_day") @db.VarChar(10)
capCount        Int       @default(0) @map("cap_count")
```

```sql
-- Let a trigger score at most a set number of times per Habitica day

-- AlterTable
ALTER TABLE "triggers" ADD COLUMN "cap_count" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN "cap_day" VARCHAR(10),
ADD COLUMN "daily_cap" INTEGER;
```

Run: `pnpm prisma:generate`
Expected: `Generated Prisma Client`

- [ ] **Step 2: Write the failing tests**

`triggerSchema.test.ts`, a new `describe('triggerSchema daily cap')` using `validTrigger`:

- `it.each([undefined, ''])('accepts an empty cap (%p) as no cap', …)`: `success` is true and `data.dailyCap` is `undefined`.
- `it('coerces the cap from the form', …)`: `'10'` → `10`.
- `it.each([['0', 'Please use a number above 0.'], ['-3', 'Please use a number above 0.'], ['1.5', 'Please use a whole number.']])`: exactly one issue, `{ message, path: ['dailyCap'] }`.
- `it('accepts 1,000', …)`, and `it('rejects 1,001', …)` with one issue: `'Please keep the daily cap to 1,000 or less.'`, `path: ['dailyCap']`.

Action tests, in the style of the cooldown tests already in both files:

- `'saves the daily cap'`: `dailyCap: 10` → `objectContaining({ dailyCap: 10 })`.
- `'saves no daily cap when the field is empty'` → `objectContaining({ dailyCap: null })`, in both files.

- [ ] **Step 3: Run them to verify they fail**

Run: `pnpm test -- src/schemas/triggerSchema.test.ts src/actions/triggers`
Expected: FAIL on the new tests

- [ ] **Step 4: Implement**

- `dailyCap`: the same `z.preprocess('' → undefined, z.coerce.number().int(…).positive(…).max(MAX_DAILY_CAP, 'Please keep the daily cap to 1,000 or less.').optional()).optional()` shape as `cooldownAmount`.
- Both actions save `dailyCap: trigger.dailyCap ?? null`.

- [ ] **Step 5: Run tests and types**

Run: `pnpm test -- src/schemas src/actions/triggers && pnpm exec tsc --noEmit`
Expected: PASS, no type errors

- [ ] **Step 6: Commit**

```bash
git add prisma src/schemas src/actions/triggers
git commit -m "feat(web): save a daily cap with each trigger"
```

---

### Task 4: The sink reports how often each trigger scored

**Files:**

- Modify: `src/rewards/types.ts` (`RewardSink`), `src/rewards/habiticaRewardSink.ts`, `src/rewards/deliverRewards.ts`
- Modify: `src/rewards/deliverRewards.test.ts` (`recordingSink` and the inline sinks)
- Test: `src/rewards/habiticaRewardSink.test.ts`

**Interfaces:**

- Produces: `RewardSink.apply: (recipientRewards: RecipientRewards) => Promise<Record<string, number>>`. It resolves to the number of successful scores per `triggerUuid`, only for triggers that scored at least once, and still rejects with `RewardDeliveryError` when nothing scored.

- [ ] **Step 1: Change the three sink tests that assert uuid lists to assert counts**

```ts
// 'reports every trigger that scored'
.resolves.toEqual({ Code: 1, Review: 1 })
// 'leaves out triggers that failed'
.resolves.toEqual({ Code: 1 })
// 'reports a trigger that scored only partly' (3 wanted, 1 succeeded)
.resolves.toEqual({ Code: 1 })
```

Add: `it('counts every time a trigger scored', …)`, where `reward('Code', 3)` resolves to `{ Code: 3 }`.

- [ ] **Step 2: Run them to verify they fail**

Run: `pnpm test -- src/rewards/habiticaRewardSink.test.ts`
Expected: FAIL: received an array

- [ ] **Step 3: Implement**

The sink keeps a `Record<string, number>` and increments it after each successful `scoreTask`. In `deliverRewards`, the cooldown release keeps triggers where `!scored[triggerUuid]`. `recordingSink` in the test returns `Object.fromEntries(rewards.map(({ times, triggerUuid }) => [triggerUuid, times]))`, and the inline `{ apply: async () => ['trigger-2'] }` becomes `{ 'trigger-2': 1 }`.

- [ ] **Step 4: Run the reward tests and types**

Run: `pnpm test -- src/rewards && pnpm exec tsc --noEmit`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/rewards
git commit -m "refactor(web): report how often Habitica scored each trigger"
```

---

### Task 5: `TriggerCaps` port and Prisma implementation

**Files:**

- Modify: `src/rewards/types.ts`
- Create: `src/rewards/prismaTriggerCaps.ts`
- Test: `src/rewards/prismaTriggerCaps.test.ts`

**Interfaces:**

- Consumes: the Task 3 columns.
- Produces, in `types.ts`:

  ```ts
  /** How often each trigger with a daily cap scored on a Habitica day. Claims wait for each other, so a cap is never overshot. */
  export type TriggerCaps = {
    /** Resolves to how many of `wanted` scores fit under the cap today. */
    claim: (
      triggerUuid: string,
      day: string,
      wanted: number,
    ) => Promise<number>;
    /** Gives back `count` unused scores claimed on `day`. */
    release: (triggerUuid: string, day: string, count: number) => Promise<void>;
  };
  ```

  `prismaTriggerCaps: TriggerCaps`.

- [ ] **Step 1: Write the failing tests**

Mock `@/lib/prisma` as `{ $transaction: jest.fn(callback => callback(tx)), triggers: { updateMany } }`, where `tx = { $queryRaw: jest.fn(), triggers: { update: jest.fn() } }`. `row(dailyCap, capDay, capCount)` returns `[{ cap_count, cap_day, daily_cap }]`.

```ts
const day = '2026-10-24';

it('grants everything on a new day', …)          // row(10, '2026-10-23', 9), wanted 7 → 7; update data { capCount: 7, capDay: day }
it('grants what is left today', …)               // row(10, day, 7), wanted 5 → 3; update data { capCount: 10, capDay: day }
it('grants nothing once the cap is reached', …)  // row(10, day, 10), wanted 1 → 0; update not called
it('grants nothing when the cap was lowered below today', …) // row(5, day, 8), wanted 2 → 0; update not called
it('grants everything when the cap was cleared, and still counts', …) // row(null, day, 4), wanted 3 → 3; update data { capCount: 7, capDay: day }
it('grants nothing for a trigger that no longer exists', …) // $queryRaw → [] → 0
it('locks the trigger while it counts', …)       // the $queryRaw template contains 'FOR UPDATE'
it('gives back unused scores on the same day', …) // release(uuid, day, 4) → updateMany({ data: { capCount: { decrement: 4 } }, where: { capCount: { gte: 4 }, capDay: day, uuid } })
it('gives back nothing for no scores', …)        // release(uuid, day, 0) → updateMany not called
```

- [ ] **Step 2: Run them to verify they fail**

Run: `pnpm test -- src/rewards/prismaTriggerCaps.test.ts`
Expected: FAIL, module not found

- [ ] **Step 3: Implement**

`claim` runs inside `prisma.$transaction(async tx => …)`:

1. ``tx.$queryRaw<{ cap_count: number; cap_day: null | string; daily_cap: null | number }[]>`SELECT daily_cap, cap_day, cap_count FROM triggers WHERE uuid = ${triggerUuid} FOR UPDATE` ``
2. `used = cap_day === day ? cap_count : 0`
3. `granted = daily_cap === null ? wanted : Math.max(0, Math.min(wanted, daily_cap - used))`
4. If `granted > 0`, `tx.triggers.update({ data: { capCount: used + granted, capDay: day }, where: { uuid } })`.

`release` skips `count <= 0`, otherwise uses the `updateMany` above.

- [ ] **Step 4: Run them to verify they pass**

Run: `pnpm test -- src/rewards/prismaTriggerCaps.test.ts`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/rewards/types.ts src/rewards/prismaTriggerCaps.ts src/rewards/prismaTriggerCaps.test.ts
git commit -m "feat(web): count each trigger's scores against its daily cap"
```

---

### Task 6: Claim caps when rewarding

**Files:**

- Modify: `src/rewards/types.ts` (`TriggerRule`, `Reward`), `src/rewards/rewardPolicy.ts`, `src/rewards/deliverRewards.ts`, `src/rewards/rewardDeps.ts`
- Test: `src/rewards/deliverRewards.test.ts`

**Interfaces:**

- Consumes: `HabiticaDays`, `habiticaDays` (Task 2); `TriggerCaps`, `prismaTriggerCaps` (Task 5); `RewardSink.apply` returning counts (Task 4).
- Produces:
  - `TriggerRule` gains `dailyCap: null | number`. `prismaRewardDirectory` spreads the row, so it needs no change.
  - `Reward` gains `hasDailyCap?: true`, set by `toReward` when `dailyCap !== null`.
  - `RewardDeps` gains `caps: TriggerCaps; days: HabiticaDays`. `rewardDeps` wires `prismaTriggerCaps` and `habiticaDays`.

- [ ] **Step 1: Add test helpers to `deliverRewards.test.ts`**

- `makeTrigger` gains `dailyCap: null`.
- `noCaps` and `noDays`: fakes that throw `'Only triggers with a daily cap …'` on any call. Add `caps: noCaps, days: noDays` to every existing `deliverRewards` call.
- `inMemoryCaps(users)`: keeps `Map<uuid, { count, day }>`, reads `dailyCap` from the users' trigger objects, applies the Task 5 rules, and records `released` calls as `{ count, uuid }`.
- `fixedDays(day)`: `{ days: { today: async () => day }, lookups }`, where `lookups` counts calls.

- [ ] **Step 2: Write the failing tests** (in a `describe('deliverRewards with daily caps')`, with explicit sequential calls)

```ts
it('stops a trigger at its daily cap', …)
// cap 10, day '2026-10-24': push 7 → 7 applied; push 5 → 3 applied; push 4 → nothing applied
it('starts again on a new Habitica day', …)
// cap 2: push 2 on '2026-10-24' → 2; push 2 on '2026-10-24' → none; push 2 on '2026-10-25' → 2
it('gives back cap slots that were not scored', …)
// cap 10, sink resolves { 'trigger-1': 3 } for 7 granted → released [{ count: 4, uuid: 'trigger-1' }]
it("doesn't start a cooldown when the cap is reached", …)
// cooldown 600 + cap 1, first push scores (lastScoredAt = at(0)); at(20) push → cap 0 → nothing applied, lastScoredAt still at(0)
it('looks up the Habitica day once per recipient', …)
// two capped triggers in one delivery → lookups === 1
it('never looks up the day for triggers without a cap', …)
// default trigger with noCaps/noDays → applied, no throw
it('gives everything back when the Habitica day cannot be looked up', …)
// days.today rejects → rejects 'Some rewards could not be delivered.'; cooldown claim released; log.recorded empty
it('gives everything back when a cap cannot be claimed', …)
// caps.claim rejects for trigger-2; trigger-1 granted → released includes trigger-1's grant; log.recorded empty
```

- [ ] **Step 3: Run them to verify they fail**

Run: `pnpm test -- src/rewards/deliverRewards.test.ts`
Expected: FAIL in the new describe

- [ ] **Step 4: Implement**

- **Policy:** `toReward` adds `...(trigger.dailyCap !== null && { hasDailyCap: true as const })`.
- **`deliverRewards`:** move the existing cooldown claiming into a local `claimCooldowns(rewards)` helper and add a `claimCaps(rewards, credentials)` helper, so the per-recipient body reads as these steps:
  1. Cooldowns.
  2. If any kept reward `hasDailyCap`: `day = await days.today(credentials, processedAt)`.
  3. `Promise.allSettled` cap claims, recording `{ day, granted, triggerUuid }` grants.
  4. Drop rewards granted 0 (log `Ignored: Trigger reached its daily cap.`) and release their cooldown claims right away, removing them from `claims`. Trim the others to `granted`.
  5. Score.
  6. Release cooldowns where `!scored[uuid]`, and cap slots `granted - (scored[uuid] ?? 0)` where that is above 0.
- **`releaseEverything(claims, grants, recipient)`** also releases every grant (each independently via `Promise.allSettled`, logging failures). It runs when the day lookup fails, any cap claim rejects, or the sink throws.

- [ ] **Step 5: Run all tests and types**

Run: `pnpm test && pnpm exec tsc --noEmit`
Expected: PASS

- [ ] **Step 6: Commit**

```bash
git add src/rewards
git commit -m "feat(web): stop triggers at their daily cap"
```

---

### Task 7: Daily cap field and preview

**Files:**

- Modify: `src/components/dashboard/TriggerModal.tsx`, `src/utils/describeTrigger.ts`
- Test: `src/utils/describeTrigger.test.ts`, `src/components/dashboard/TriggerModal.test.tsx`

**Interfaces:**

- Consumes: `MAX_DAILY_CAP`, `TriggerSchema.dailyCap` (Task 3); `isWithinMaxCooldown` (`src/utils/cooldown.ts`); `TriggerWithRepos.dailyCap`.

- [ ] **Step 1: Write the failing tests**

`describeTrigger.test.ts`:

- `'says how often the trigger may score a day'`: `dailyCap: 10` → text ends `It scores at most 10 times a day.`
- `'says "once" for a cap of 1'` → ends `It scores at most once a day.`
- `'puts the cap after the cooldown'`: cooldown 10 minutes plus cap 3 → ends `After scoring, it rests for 10 minutes. It scores at most 3 times a day.`
- `it.each(['-5', '1.5', '0'])('says nothing about resting for a cooldown of %s', …)`: no `rests` (the deferred cooldown minor).
- `it.each(['-3', '1.5', '1001'])('says nothing about a cap of %s', …)`: no `at most`.

`TriggerModal.test.tsx` (inside `describe('cooldown')`, or a sibling `describe('daily cap')` with the same `beforeEach`; extend `savedTrigger` with a `dailyCap` argument defaulting to `null`, found by placeholder `No cap`):

- `'shows the daily cap of a trigger you edit'`: `dailyCap: 10` → input value `'10'`.
- `'explains a daily cap that is too high'`: type `1001`, save → `Please keep the daily cap to 1,000 or less.`, and `mockUpdateTrigger` not called.
- `'saves a trigger with a daily cap'`: type `5`, save → `mockUpdateTrigger('trigger-uuid', objectContaining({ dailyCap: 5 }))`.

- [ ] **Step 2: Run them to verify they fail**

Run: `pnpm test -- src/utils/describeTrigger.test.ts src/components/dashboard/TriggerModal.test.tsx`
Expected: FAIL

- [ ] **Step 3: Implement**

- `describeTrigger`: a local `toWholeNumber(value): number | undefined` that returns `n` only when `Number.isInteger(n) && n > 0`.
  - **Cooldown clause:** only when the whole number passes `isWithinMaxCooldown(amount, unit ?? 'minutes')`.
  - **Cap clause:** only when it is `<= MAX_DAILY_CAP`. It appends `text(' It scores at most ')`, a `value` part (`'once'` for 1, otherwise `` `${cap} times` ``), and `text(' a day.')`.
- `TriggerModal`:
  - `triggerToValues` adds `dailyCap: trigger.dailyCap ?? undefined`.
  - Below the cooldown grid, add a `grid gap-3.5 sm:grid-cols-[8rem_1fr]` containing `FormInput` (`label="Daily cap"`, `name="dailyCap"`, `type="number"`, `min={1}`, `placeholder="No cap"`, `description="The most this trigger can score in a Habitica day. Leave empty for no cap."`).

- [ ] **Step 4: Run them to verify they pass**

Run: `pnpm test -- src/utils/describeTrigger.test.ts src/components/dashboard/TriggerModal.test.tsx`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/components/dashboard src/utils
git commit -m "feat(web): set a daily cap when creating or editing a trigger"
```

---

### Task 8: Daily cap chip

**Files:**

- Modify: `src/components/dashboard/TriggerRow.tsx`
- Test: `src/components/dashboard/TriggerRow.test.tsx`

- [ ] **Step 1: Write the failing tests** (extend `savedTrigger` with `dailyCap`)

- `'shows the daily cap of a trigger'`: `dailyCap: 10` → `screen.getByText('10/day')`.
- `'shows no daily cap chip without a cap'` → `queryByText(/\/day/)` is `null`.

- [ ] **Step 2: Run them to verify they fail**

Run: `pnpm test -- src/components/dashboard/TriggerRow.test.tsx`
Expected: FAIL

- [ ] **Step 3: Render the chip**

Add a chip after the cooldown chip, styled the same way (`tone="neutral"`, `shrink-0 gap-1 text-[11px]`, fades when inactive), with `Calendar03Icon` at size 12 and `` `${trigger.dailyCap}/day` ``. Only render it when `trigger.dailyCap` is set.

- [ ] **Step 4: Run tests, lint and types**

Run: `pnpm test -- src/components/dashboard && pnpm lint && pnpm exec tsc --noEmit`
Expected: PASS, no lint or type errors

- [ ] **Step 5: Commit**

```bash
git add src/components/dashboard
git commit -m "feat(web): show each trigger's daily cap in the list"
```

---

### Task 9: Docs, FAQ and roadmap copy

**Files:**

- Modify: `src/config/roadmap.ts`, `src/app/faq/page.tsx`, `src/app/docs/supported-github-events/page.tsx`, `README.md`

- [ ] **Step 1: Update the copy**

- **Roadmap item:** `title: 'Daily caps'`, `description: 'Set the most a trigger can score in a Habitica day, to prevent burnout.'`, `status: 'in-progress'`.
- **FAQ answer:** after the cooldown sentence, add `A daily cap sets the most a trigger can score in a Habitica day.` Then change the next sentence to `Spam detection comes next in the Anti-Cheese update, to help keep you honest.` (keep the `<Link>`).
- **Supported events, Pushes item:** append `A daily cap stops a trigger once it has scored that many times in your Habitica day.`
- **README "Fair rewards":** append `A daily cap sets the most a trigger can score in a Habitica day.`

- [ ] **Step 2: Run tests and lint**

Run: `pnpm test -- src/config src/json-ld && pnpm lint`
Expected: PASS

- [ ] **Step 3: Commit**

```bash
git add src/config/roadmap.ts src/app/faq/page.tsx src/app/docs/supported-github-events/page.tsx ../../README.md
git commit -m "docs(web): explain daily caps"
```

---

### Task 10: Full check and local migration

**Files:** none

- [ ] **Step 1: Run the full suite**

Run: `pnpm test && pnpm lint && pnpm exec tsc --noEmit`
Expected: all green

- [ ] **Step 2: Note the manual checks for the user** (they need the user's GitHub sign-in and App)

- **The dialog:** the Daily cap field sits under Cooldown, and the preview clause appears.
- **The list:** the chip shows.
- **A push through ngrok:** set a cap of 2, push 3 commits (2 score), then push again (nothing scores).

The migration is applied locally only when the user asks, as part of merging.
