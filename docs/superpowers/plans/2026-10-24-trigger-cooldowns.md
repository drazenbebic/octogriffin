# Per-trigger cooldowns Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Let a trigger rest for a configurable time after it scores, skipping every event for it until the cooldown has passed.

**Architecture:** Two nullable columns on `Triggers` (`cooldownSeconds`, `lastScoredAt`). The reward policy skips triggers that are cooling down. `deliverRewards` claims each cooldown with a compare-and-set on `lastScoredAt` through a new `TriggerCooldowns` port, and releases the claim when the sink reports the trigger scored nothing. The modal takes a number plus a unit, and the server stores seconds.

**Tech Stack:** Next.js 16 App Router, Prisma 7 (Postgres), Zod 4, Ariakit forms, Jest 30, pnpm.

**Spec:** `docs/superpowers/specs/2026-10-24-trigger-cooldowns-design.md`

## Global Constraints

- All paths below are relative to `apps/web/` unless they start with `docs/` or `README.md` (repo root).
- Run tests from `apps/web`: `pnpm test -- <path>`. Lint: `pnpm lint`. Types: `pnpm exec tsc --noEmit`.
- Units: `seconds`, `minutes`, `hours`, `days`. Form default unit: `minutes`.
- Maximum cooldown: 365 days = 31,536,000 s. Per-unit maximums: 31,536,000 seconds, 525,600 minutes, 8,760 hours, 365 days. Never multiply before comparing.
- Empty amount = no cooldown = `null` in the database. 0, negatives and decimals are rejected.
- A trigger is ready again when `now - lastScoredAt >= cooldownSeconds` (exactly at the boundary scores).
- `lastScoredAt` is only written for triggers with a cooldown.
- "Now" is when Octogriffin processes the event, never commit timestamps.
- `MAX_REWARDS_PER_EVENT` (default 10) still applies on top of the cooldown.
- Log line for a skip: `Ignored: Trigger is cooling down.`
- Validation copy: `Please use a whole number.`, `Please use a number above 0.`, `Please keep the cooldown to 365 days or less.`
- Commits: conventional, plain-English subjects; the branch is squash-merged as `feat(web): let triggers rest for a while after they score`. End every commit message with `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`.

## Review Focus

1. **The form sends an empty amount as `''`**: it must validate and save `null`, not fail as "0". Pinned in Task 2.
2. **Clearing the cooldown when editing** must save `null`, not keep the old value. Pinned in Task 3.
3. **A trigger's first ever score** (`lastScoredAt` is `null`) must score and claim with `previousScoredAt: null`. Pinned in Tasks 4 and 6.
4. **One delivery with two triggers, one cooling down**: only that one is skipped, and the other scores and records as usual. Pinned in Task 6.
5. **The sink scores one trigger and fails another**: only the failed trigger's claim is released, and the delivery stays recorded. Pinned in Task 6.

---

### Task 1: Cooldown conversion utilities

**Files:**

- Create: `src/utils/cooldown.ts`
- Test: `src/utils/cooldown.test.ts`

**Interfaces:**

- Produces:
  - `cooldownUnits = ['seconds', 'minutes', 'hours', 'days'] as const`
  - `type CooldownUnit = (typeof cooldownUnits)[number]`
  - `SECONDS_PER_UNIT: Record<CooldownUnit, number>` (1, 60, 3600, 86400)
  - `MAX_COOLDOWN_SECONDS = 31_536_000`
  - `isWithinMaxCooldown(amount: number, unit: CooldownUnit): boolean`, true when `amount <= MAX_COOLDOWN_SECONDS / SECONDS_PER_UNIT[unit]`
  - `toCooldownSeconds(amount: number | undefined, unit: CooldownUnit = 'minutes'): number | null`
  - `fromCooldownSeconds(seconds: number): { amount: number; unit: CooldownUnit }`, in the largest unit that divides evenly
  - `formatCooldown(seconds: number, style: 'long' | 'short' = 'long'): string`

- [ ] **Step 1: Write the failing tests**

```ts
describe('toCooldownSeconds', () => {
  it.each([
    [90, 'seconds', 90],
    [10, 'minutes', 600],
    [2, 'hours', 7200],
    [365, 'days', 31_536_000],
  ] as const)('turns %d %s into %d seconds', (amount, unit, seconds) => {
    expect(toCooldownSeconds(amount, unit)).toBe(seconds);
  });
  it('is null without an amount', () => {
    expect(toCooldownSeconds(undefined, 'hours')).toBeNull();
  });
  it('defaults to minutes', () => {
    expect(toCooldownSeconds(5)).toBe(300);
  });
});

describe('fromCooldownSeconds', () => {
  it.each([
    [90, { amount: 90, unit: 'seconds' }],
    [600, { amount: 10, unit: 'minutes' }],
    [3600, { amount: 1, unit: 'hours' }],
    [5400, { amount: 90, unit: 'minutes' }],
    [86_400, { amount: 1, unit: 'days' }],
    [31_536_000, { amount: 365, unit: 'days' }],
  ])('turns %d seconds into %o', (seconds, expected) => {
    expect(fromCooldownSeconds(seconds)).toEqual(expected);
  });
});

describe('isWithinMaxCooldown', () => {
  it.each([
    [31_536_000, 'seconds', true],
    [31_536_001, 'seconds', false],
    [525_600, 'minutes', true],
    [525_601, 'minutes', false],
    [8_760, 'hours', true],
    [8_761, 'hours', false],
    [365, 'days', true],
    [366, 'days', false],
    [1_000_000_000, 'days', false],
  ] as const)('%d %s → %s', (amount, unit, expected) => {
    expect(isWithinMaxCooldown(amount, unit)).toBe(expected);
  });
});

describe('formatCooldown', () => {
  it.each([
    [1, 'long', '1 second'],
    [90, 'long', '90 seconds'],
    [600, 'long', '10 minutes'],
    [3600, 'long', '1 hour'],
    [172_800, 'long', '2 days'],
    [90, 'short', '90 sec'],
    [600, 'short', '10 min'],
    [7200, 'short', '2 hr'],
    [86_400, 'short', '1 day'],
    [172_800, 'short', '2 days'],
  ] as const)('formats %d (%s) as "%s"', (seconds, style, text) => {
    expect(formatCooldown(seconds, style)).toBe(text);
  });
});
```

- [ ] **Step 2: Run the tests to verify they fail**

Run: `pnpm test -- src/utils/cooldown.test.ts`
Expected: FAIL, `Cannot find module './cooldown'`

- [ ] **Step 3: Implement `src/utils/cooldown.ts`**

`fromCooldownSeconds` checks units from `days` down to `seconds` and takes the first that divides evenly. `formatCooldown` builds on `fromCooldownSeconds`. Long labels are singular for 1 and plural otherwise (`second(s)`, `minute(s)`, `hour(s)`, `day(s)`). Short labels are `sec`, `min`, `hr`, and `day`/`days`.

- [ ] **Step 4: Run the tests to verify they pass**

Run: `pnpm test -- src/utils/cooldown.test.ts`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/utils/cooldown.ts src/utils/cooldown.test.ts
git commit -m "feat(web): convert trigger cooldowns between units and seconds"
```

---

### Task 2: Cooldown fields in the trigger schema

**Files:**

- Modify: `src/schemas/triggerSchema.ts`
- Test: `src/schemas/triggerSchema.test.ts`

**Interfaces:**

- Consumes: `cooldownUnits`, `isWithinMaxCooldown` from Task 1.
- Produces: `TriggerSchema` gains `cooldownAmount?: number` and `cooldownUnit?: CooldownUnit`. Both are optional, so existing `TriggerSchema` fixtures and `recipeToTriggerValues` keep compiling.

- [ ] **Step 1: Write the failing tests** (reuse the file's `validTrigger`)

```ts
describe('cooldown', () => {
  it.each([undefined, ''])(
    'accepts an empty amount (%p) as no cooldown',
    cooldownAmount => {
      const result = triggerSchema.safeParse({
        ...validTrigger,
        cooldownAmount,
      });
      expect(result.success).toBe(true);
      expect(result.data?.cooldownAmount).toBeUndefined();
    },
  );

  it('coerces the amount from the form', () => {
    const result = triggerSchema.safeParse({
      ...validTrigger,
      cooldownAmount: '10',
      cooldownUnit: 'minutes',
    });
    expect(result.data?.cooldownAmount).toBe(10);
  });

  it.each([
    ['0', 'Please use a number above 0.'],
    ['-5', 'Please use a number above 0.'],
    ['1.5', 'Please use a whole number.'],
  ])('rejects %s', (cooldownAmount, message) => {
    const result = triggerSchema.safeParse({
      ...validTrigger,
      cooldownAmount,
      cooldownUnit: 'hours',
    });
    expect(result.error?.issues).toEqual([
      expect.objectContaining({ message, path: ['cooldownAmount'] }),
    ]);
  });

  it('accepts 365 days', () => {
    expect(
      triggerSchema.safeParse({
        ...validTrigger,
        cooldownAmount: 365,
        cooldownUnit: 'days',
      }).success,
    ).toBe(true);
  });

  it.each([
    [366, 'days'],
    [525_601, 'minutes'],
    [1_000_000_000, 'days'],
  ])('rejects %d %s', (cooldownAmount, cooldownUnit) => {
    const result = triggerSchema.safeParse({
      ...validTrigger,
      cooldownAmount,
      cooldownUnit,
    });
    expect(result.error?.issues).toEqual([
      expect.objectContaining({
        message: 'Please keep the cooldown to 365 days or less.',
        path: ['cooldownAmount'],
      }),
    ]);
  });

  it('checks the maximum in minutes when no unit is given', () => {
    expect(
      triggerSchema.safeParse({ ...validTrigger, cooldownAmount: 525_601 })
        .success,
    ).toBe(false);
  });

  it('rejects an unknown unit', () => {
    expect(
      triggerSchema.safeParse({
        ...validTrigger,
        cooldownAmount: 1,
        cooldownUnit: 'weeks',
      }).success,
    ).toBe(false);
  });
});
```

- [ ] **Step 2: Run the tests to verify they fail**

Run: `pnpm test -- src/schemas/triggerSchema.test.ts`
Expected: FAIL in the new `cooldown` block

- [ ] **Step 3: Add the fields**

- `cooldownAmount`: a `z.preprocess` that turns `''` into `undefined`, around `z.coerce.number().int('Please use a whole number.').positive('Please use a number above 0.').optional()`.
- `cooldownUnit`: `z.enum(cooldownUnits).optional()`.
- A `.superRefine` on the object adds `Please keep the cooldown to 365 days or less.` with `path: ['cooldownAmount']` when an amount is set and `!isWithinMaxCooldown(amount, unit ?? 'minutes')`. The `path` matters, because `TriggerModal` maps errors by `issue.path[0]`.

- [ ] **Step 4: Run the tests to verify they pass**

Run: `pnpm test -- src/schemas/triggerSchema.test.ts`
Expected: PASS, including the existing tests

- [ ] **Step 5: Commit**

```bash
git add src/schemas/triggerSchema.ts src/schemas/triggerSchema.test.ts
git commit -m "feat(web): validate trigger cooldowns up to 365 days"
```

---

### Task 3: Store the cooldown on triggers

**Files:**

- Modify: `prisma/schema.prisma` (model `Triggers`, after `scoreDirection`)
- Create: `prisma/migrations/20261024100000_add_trigger_cooldowns/migration.sql`
- Modify: `src/actions/triggers/createTriggerAction.ts`, `src/actions/triggers/updateTriggerAction.ts`
- Test: `src/actions/triggers/createTriggerAction.test.ts`; create `src/actions/triggers/updateTriggerAction.test.ts` in the same style

**Interfaces:**

- Consumes: `toCooldownSeconds` (Task 1); `cooldownAmount`, `cooldownUnit` (Task 2).
- Produces: Prisma `Triggers.cooldownSeconds: number | null` and `Triggers.lastScoredAt: Date | null`. `TriggerWithRepos` picks both up automatically.

- [ ] **Step 1: Add the columns and migration**

```prisma
cooldownSeconds Int?      @map("cooldown_seconds")
lastScoredAt    DateTime? @map("last_scored_at")
```

```sql
-- Let a trigger rest for a while after it scores

-- AlterTable
ALTER TABLE "triggers" ADD COLUMN "cooldown_seconds" INTEGER,
ADD COLUMN "last_scored_at" TIMESTAMP(3);
```

Run: `pnpm prisma:generate`
Expected: `Generated Prisma Client`. With the local database running (`docker compose up -d` at the repo root), `pnpm prisma:migrate:status` lists the new migration as not yet applied. Then `pnpm prisma:migrate:deploy` applies it.

- [ ] **Step 2: Write the failing action tests**

In `createTriggerAction.test.ts`:

```ts
it('saves the cooldown in seconds', async () => {
  mockOwnsRepositories.mockResolvedValue(true);
  await createTriggerAction({
    ...trigger,
    cooldownAmount: 10,
    cooldownUnit: 'minutes',
  });
  expect(mockCreateTrigger).toHaveBeenCalledWith(
    expect.objectContaining({ cooldownSeconds: 600 }),
  );
});

it('saves no cooldown when the amount is empty', async () => {
  mockOwnsRepositories.mockResolvedValue(true);
  await createTriggerAction(trigger);
  expect(mockCreateTrigger).toHaveBeenCalledWith(
    expect.objectContaining({ cooldownSeconds: null }),
  );
});
```

In `updateTriggerAction.test.ts`, mock `getTrigger` to resolve `{ id: BigInt(3) }`, then test:

```ts
it('saves a changed cooldown', ...)        // 2 hours → updateTrigger({ id: BigInt(3) }, objectContaining({ cooldownSeconds: 7200 }))
it('clears the cooldown', ...)             // no amount → objectContaining({ cooldownSeconds: null })
it("refuses a trigger that isn't yours", ...) // getTrigger → null → { success: false }, updateTrigger not called
```

- [ ] **Step 3: Run the tests to verify they fail**

Run: `pnpm test -- src/actions/triggers`
Expected: FAIL on the `cooldownSeconds` assertions

- [ ] **Step 4: Save `cooldownSeconds: toCooldownSeconds(trigger.cooldownAmount, trigger.cooldownUnit)` in both actions**

- [ ] **Step 5: Run the tests and type check**

Run: `pnpm test -- src/actions/triggers && pnpm exec tsc --noEmit`
Expected: PASS, no type errors

- [ ] **Step 6: Commit**

```bash
git add prisma src/actions/triggers
git commit -m "feat(web): save a cooldown with each trigger"
```

---

### Task 4: `TriggerCooldowns` port and Prisma implementation

**Files:**

- Modify: `src/rewards/types.ts`
- Create: `src/rewards/prismaTriggerCooldowns.ts`
- Test: `src/rewards/prismaTriggerCooldowns.test.ts`

**Interfaces:**

- Consumes: the Task 3 columns.
- Produces, in `types.ts`:

  ```ts
  /** When each trigger with a cooldown last scored. A claim only succeeds once per cooldown, even for deliveries arriving at the same time. */
  export type TriggerCooldowns = {
    /** Resolves to `false` when another delivery claimed the trigger since `previousScoredAt` was read. */
    claim: (
      triggerUuid: string,
      previousScoredAt: Date | null,
      now: Date,
    ) => Promise<boolean>;
    /** Gives up a claim made at `claimedAt`, putting `previousScoredAt` back. */
    release: (
      triggerUuid: string,
      claimedAt: Date,
      previousScoredAt: Date | null,
    ) => Promise<void>;
  };
  ```

  `prismaTriggerCooldowns: TriggerCooldowns`.

- [ ] **Step 1: Write the failing tests** (mock `@/lib/prisma` as `{ __esModule: true, default: { triggers: { updateMany: jest.fn() } } }`)

```ts
const now = new Date('2026-10-24T10:00:00.000Z');
const previous = new Date('2026-10-24T09:00:00.000Z');

it('claims a trigger nobody claimed since it was read', async () => {
  updateMany.mockResolvedValue({ count: 1 });
  await expect(
    prismaTriggerCooldowns.claim('trigger-1', previous, now),
  ).resolves.toBe(true);
  expect(updateMany).toHaveBeenCalledWith({
    data: { lastScoredAt: now },
    where: { lastScoredAt: previous, uuid: 'trigger-1' },
  });
});

it('claims a trigger that never scored', async () => {
  updateMany.mockResolvedValue({ count: 1 });
  await prismaTriggerCooldowns.claim('trigger-1', null, now);
  expect(updateMany).toHaveBeenCalledWith({
    data: { lastScoredAt: now },
    where: { lastScoredAt: null, uuid: 'trigger-1' },
  });
});

it('loses the claim to a delivery that got there first', async () => {
  updateMany.mockResolvedValue({ count: 0 });
  await expect(
    prismaTriggerCooldowns.claim('trigger-1', previous, now),
  ).resolves.toBe(false);
});

it('releases only its own claim', async () => {
  await prismaTriggerCooldowns.release('trigger-1', now, previous);
  expect(updateMany).toHaveBeenCalledWith({
    data: { lastScoredAt: previous },
    where: { lastScoredAt: now, uuid: 'trigger-1' },
  });
});
```

- [ ] **Step 2: Run the tests to verify they fail**

Run: `pnpm test -- src/rewards/prismaTriggerCooldowns.test.ts`
Expected: FAIL, module not found

- [ ] **Step 3: Add the type, and implement `prismaTriggerCooldowns.ts` with `prisma.triggers.updateMany`**

Match the `prismaRewardLog.ts` layout.

- [ ] **Step 4: Run the tests to verify they pass**

Run: `pnpm test -- src/rewards/prismaTriggerCooldowns.test.ts`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/rewards/types.ts src/rewards/prismaTriggerCooldowns.ts src/rewards/prismaTriggerCooldowns.test.ts
git commit -m "feat(web): claim trigger cooldowns so parallel deliveries can't both score"
```

---

### Task 5: The sink reports which triggers scored

**Files:**

- Modify: `src/rewards/types.ts` (`RewardSink`), `src/rewards/habiticaRewardSink.ts`
- Modify: `src/rewards/deliverRewards.test.ts` (`recordingSink` returns the uuids it got)
- Test: `src/rewards/habiticaRewardSink.test.ts`

**Interfaces:**

- Produces: `RewardSink.apply: (recipientRewards: RecipientRewards) => Promise<string[]>`. It resolves to the `triggerUuid`s that scored at least once, and still rejects with `RewardDeliveryError` when nothing scored. Update the doc comment.

- [ ] **Step 1: Write the failing tests** (in `habiticaRewardSink.test.ts`; the `reward` helper sets `triggerUuid` to the title or similar, so check it and adapt the uuids)

```ts
it('reports every trigger that scored', async () => {
  mockHabitica([]);
  await expect(
    habiticaRewardSink.apply(
      recipientRewards([reward('Code'), reward('Review')]),
    ),
  ).resolves.toEqual([uuidOf('Code'), uuidOf('Review')]);
});

it('leaves out triggers that failed', async () => {
  mockHabitica(['Review']);
  await expect(
    habiticaRewardSink.apply(
      recipientRewards([reward('Code'), reward('Review')]),
    ),
  ).resolves.toEqual([uuidOf('Code')]);
});

it('reports a trigger that scored only partly', async () => {
  // scoreTask resolves once, then rejects
  await expect(
    habiticaRewardSink.apply(recipientRewards([reward('Code', 3)])),
  ).resolves.toEqual([uuidOf('Code')]);
});
```

- [ ] **Step 2: Run the tests to verify they fail**

Run: `pnpm test -- src/rewards/habiticaRewardSink.test.ts`
Expected: FAIL, resolves to `undefined`

- [ ] **Step 3: Collect the uuid of each reward after its first successful `scoreTask` and return them in reward order**

Keep the existing "partly scored rewards aren't retried" behaviour. Note the queue runs with `concurrency: 4`, so sort by the input order before returning.

- [ ] **Step 4: Run the reward tests**

Run: `pnpm test -- src/rewards`
Expected: PASS (after `recordingSink` in `deliverRewards.test.ts` returns `recipientRewards.rewards.map(({ triggerUuid }) => triggerUuid)`)

- [ ] **Step 5: Commit**

```bash
git add src/rewards
git commit -m "refactor(web): report which triggers Habitica scored"
```

---

### Task 6: Skip, claim and release cooldowns when rewarding

**Files:**

- Modify: `src/rewards/types.ts` (`TriggerRule`, `Reward`), `src/rewards/rewardPolicy.ts`, `src/rewards/deliverRewards.ts`, `src/rewards/rewardDeps.ts`
- Test: `src/rewards/deliverRewards.test.ts`

**Interfaces:**

- Consumes: `TriggerCooldowns`, `prismaTriggerCooldowns` (Task 4); `RewardSink.apply` returning scored uuids (Task 5).
- Produces:
  - `TriggerRule` gains `cooldownSeconds: number | null; lastScoredAt: Date | null`. `prismaRewardDirectory` spreads the full row, so it needs no change.
  - `Reward` gains `cooldown?: { previousScoredAt: Date | null }`, set only for triggers with a cooldown.
  - `evaluateRewards(event: RewardableEvent, directory: RewardDirectory, now: Date): Promise<RecipientRewards[]>`
  - `RewardDeps = { cooldowns: TriggerCooldowns; directory; log; now?: () => Date; sink }`. `now` defaults to `() => new Date()`, and `rewardDeps` wires `cooldowns: prismaTriggerCooldowns`.

- [ ] **Step 1: Add test helpers to `deliverRewards.test.ts`**

`makeTrigger` gains `cooldownSeconds: null, lastScoredAt: null`. Add `inMemoryCooldowns(directoryUsers)`: a fake `TriggerCooldowns` that compare-and-sets the `lastScoredAt` of the matching `TriggerRule` object in the users passed to `inMemoryDirectory`, and records `released` calls. That way, consecutive deliveries in one test see the updated time. Add `cooldowns` to every existing `deliverRewards` call.

- [ ] **Step 2: Write the failing tests**

```ts
const at = (minutes: number) => new Date(Date.UTC(2026, 9, 24, 10, minutes));

it('scores triggers without a cooldown every time', ...)
// two deliveries a minute apart → both applied, lastScoredAt stays null

it('rests a trigger for its cooldown after it scores', async () => {
  // trigger cooldownSeconds 600; deliveries (distinct delivery ids) at 0, 3, 6, 10 with 7, 7, 8, 20 commits
  // applied times: [7, 10]; trigger.lastScoredAt === at(10)
});

it("doesn't move the cooldown for skipped events", ...)
// score at 0, skipped event at 9 → lastScoredAt still at(0)

it('scores a trigger with a cooldown for the first time', ...)
// lastScoredAt null → applied; reward.cooldown = { previousScoredAt: null }

it('only skips the trigger that is cooling down', ...)
// user with two push triggers, one cooling down → applied rewards contain only the other; delivery recorded in log

it('drops a reward another delivery claimed first', ...)
// cooldowns.claim resolves false → nothing applied, delivery claim released (log.recorded empty)

it('gives the cooldown back when the trigger scored nothing', ...)
// sink resolves ['trigger-2'] for rewards of trigger-1 and trigger-2 → release('trigger-1', now, previous) only; log keeps the delivery

it('gives every cooldown back when nothing could be scored', ...)
// failingSink → rejects, released for every claimed trigger, log.recorded empty
```

- [ ] **Step 3: Run the tests to verify they fail**

Run: `pnpm test -- src/rewards/deliverRewards.test.ts`
Expected: FAIL in the new tests

- [ ] **Step 4: Implement**

- `rewardPolicy.ts`: in the trigger filter, skip triggers where `cooldownSeconds !== null && lastScoredAt !== null && now - lastScoredAt < cooldownSeconds * 1000`, logging `{ trigger: uuid }` with `Ignored: Trigger is cooling down.` `toReward` adds `cooldown: { previousScoredAt: trigger.lastScoredAt }` when `cooldownSeconds !== null`.
- `deliverRewards.ts`: per recipient, after `log.claim` succeeds:
  1. Claim every reward with `cooldown` via `cooldowns.claim(uuid, previousScoredAt, now)` and keep the rewards whose claim succeeded or that have no cooldown.
  2. If none are left, call `log.release` and return.
  3. `const scored = await sink.apply({ ...recipientRewards, rewards: kept })`, then release each claimed trigger not in `scored`.
  4. In the existing `catch`, release every claimed trigger before `log.release`.
     Compute `now` once per delivery, so the claim and release use the same `Date`.

- [ ] **Step 5: Run all tests and the type check**

Run: `pnpm test && pnpm exec tsc --noEmit`
Expected: PASS, no type errors

- [ ] **Step 6: Commit**

```bash
git add src/rewards
git commit -m "feat(web): skip triggers that are cooling down"
```

---

### Task 7: Cooldown field and preview in the trigger modal

**Files:**

- Modify: `src/components/ui/FormInput.tsx` (optional `min?: number`, passed to the input)
- Modify: `src/components/dashboard/TriggerModal.tsx`
- Modify: `src/utils/describeTrigger.ts`
- Test: `src/utils/describeTrigger.test.ts`, `src/components/dashboard/TriggerModal.test.tsx`

**Interfaces:**

- Consumes: `cooldownUnits`, `CooldownUnit`, `toCooldownSeconds`, `fromCooldownSeconds`, `formatCooldown` (Task 1); the schema fields (Task 2); `TriggerWithRepos.cooldownSeconds` (Task 3).

- [ ] **Step 1: Write the failing tests**

`describeTrigger.test.ts` (use the file's `toText`):

```ts
it('says how long the trigger rests', () => {
  expect(
    toText(
      describeTrigger(
        { ...complete, cooldownAmount: 10, cooldownUnit: 'minutes' },
        ctx,
      ),
    ),
  ).toMatch(
    /The counter resets daily\. After scoring, it rests for 10 minutes\.$/,
  );
});
it('says nothing about resting without a cooldown', () => {
  expect(toText(describeTrigger(complete, ctx))).not.toMatch(/rests/);
});
```

`TriggerModal.test.tsx` (follow the existing render helpers):

- `'shows the cooldown of a trigger you edit'`: a trigger with `cooldownSeconds: 7200` shows `2` in the Cooldown input and selects `hours`.
- `'explains a cooldown that is too long'`: type `400`, pick `days`, submit, and see `Please keep the cooldown to 365 days or less.` The store's `createTrigger` is not called.
- `'creates a trigger with a cooldown'`: type `10` with the default unit, submit, and `createTrigger` gets `objectContaining({ cooldownAmount: 10, cooldownUnit: 'minutes' })`.

- [ ] **Step 2: Run the tests to verify they fail**

Run: `pnpm test -- src/utils/describeTrigger.test.ts src/components/dashboard/TriggerModal.test.tsx`
Expected: FAIL

- [ ] **Step 3: Implement**

- `describeTrigger`: when `toCooldownSeconds(Number(values.cooldownAmount) || undefined, values.cooldownUnit)` is set, append `text(' After scoring, it rests for ')`, `{ kind: 'value', text: formatCooldown(seconds) }`, `text('.')`.
- `TriggerModal`:
  - `defaultValues` gets `cooldownUnit: 'minutes'` (and no amount).
  - `triggerToValues` fills both fields from `fromCooldownSeconds` when `trigger.cooldownSeconds` is set, and `cooldownUnit: 'minutes'` otherwise.
  - Add the row as the last child of the "How it counts" fieldset: a `grid gap-3.5 sm:grid-cols-[8rem_1fr]` holding `FormInput` (`label="Cooldown"`, `name="cooldownAmount"`, `type="number"`, `min={1}`, `placeholder="None"`) and `FormSegmentedControl` (`label="Unit"`, `name="cooldownUnit"`, options `sec`/`min`/`hours`/`days` for `cooldownUnits`).
  - Put the description `After it scores, this trigger rests for this long. Leave empty for no cooldown.` on the `FormInput`.

- [ ] **Step 4: Run the tests to verify they pass**

Run: `pnpm test -- src/utils/describeTrigger.test.ts src/components/dashboard/TriggerModal.test.tsx`
Expected: PASS

- [ ] **Step 5: Check it in the browser**

Start the dev server with the `preview_start` tool (or `pnpm dev`). Open the dashboard and create a trigger with a 10-minute cooldown, and check the preview sentence. Edit it, change it to 2 hours, save, and reopen. Try `400 days` and check the error. Check both light and dark mode.

- [ ] **Step 6: Commit**

```bash
git add src/components src/utils
git commit -m "feat(web): set a cooldown when creating or editing a trigger"
```

---

### Task 8: Cooldown chip in the trigger list

**Files:**

- Modify: `src/components/dashboard/TriggerRow.tsx`
- Test: `src/components/dashboard/TriggersList.test.tsx`

**Interfaces:**

- Consumes: `formatCooldown(seconds, 'short')` (Task 1); `TriggerWithRepos.cooldownSeconds` (Task 3).

- [ ] **Step 1: Write the failing tests** (extend the file's trigger fixture with `cooldownSeconds: null, lastScoredAt: null`)
- `'shows the cooldown of a trigger'`: `cooldownSeconds: 600` shows the text `10 min cooldown`.
- `'shows no cooldown chip without a cooldown'`: no element matches `/cooldown/i`.

- [ ] **Step 2: Run the tests to verify they fail**

Run: `pnpm test -- src/components/dashboard/TriggersList.test.tsx`
Expected: FAIL

- [ ] **Step 3: Render the chip**

Render `<Chip className="text-[11px]" tone="neutral">` with a `HugeiconsIcon` timer icon (e.g. `Timer02Icon` from `@hugeicons/core-free-icons`, size 12) and `{formatCooldown(trigger.cooldownSeconds, 'short')} cooldown`. Put it next to the "New" chip in the title row, only when `trigger.cooldownSeconds` is set. Wrap it in `cn(!trigger.isActive && 'opacity-55')`, like the other cells.

- [ ] **Step 4: Run the tests, lint and the type check**

Run: `pnpm test -- src/components/dashboard && pnpm lint && pnpm exec tsc --noEmit`
Expected: PASS, no lint or type errors (`lint:tokens` included)

- [ ] **Step 5: Commit**

```bash
git add src/components/dashboard
git commit -m "feat(web): show each trigger's cooldown in the list"
```

---

### Task 9: Docs, FAQ and roadmap copy

**Files:**

- Modify: `src/config/roadmap.ts` (Anti-Cheese → "Per-trigger cooldowns" description)
- Modify: `src/app/faq/page.tsx` (answer to "What prevents me from spamming commits for infinite Gold?")
- Modify: `src/app/docs/supported-github-events/page.tsx` ("How events are counted", Pushes item)
- Modify: `README.md` (repo root, "Fair rewards" bullet)

- [ ] **Step 1: Update the copy**

- Roadmap description: `Let a trigger rest for a while after it scores, so a burst of pushes counts once.` Keep `status: 'in-progress'`.
- FAQ: after the 10-per-push sentence, add `You can also give a trigger a cooldown, so it rests for a while after it scores.` Then replace "Smart Spam Detection and Daily Caps are top priorities" with "Daily caps and spam detection are next".
- Supported events, Pushes item: add `A trigger with a cooldown skips every push until its cooldown has passed.`
- README "Fair rewards": add `Triggers can also have a cooldown, from seconds up to 365 days, so they rest for a while after they score.`

- [ ] **Step 2: Run the tests and lint**

Run: `pnpm test -- src/config src/json-ld && pnpm lint`
Expected: PASS

- [ ] **Step 3: Commit**

```bash
git add src/config/roadmap.ts src/app/faq/page.tsx src/app/docs/supported-github-events/page.tsx ../../README.md
git commit -m "docs(web): explain trigger cooldowns"
```

---

### Task 10: End-to-end check with a real push

**Files:** none

- [ ] **Step 1: Run the full suite**

Run: `pnpm test && pnpm lint && pnpm exec tsc --noEmit`
Expected: all green

- [ ] **Step 2: Push through ngrok**

Follow `src/app/docs/setting-up-ngrok/page.tsx`. On a test repository, give a push trigger a 2-minute cooldown.

1. Push 2 commits: the habit scores 2×, and `last_scored_at` is set (`pnpm prisma:studio`).
2. Push again within 2 minutes: no score, and the dev server log shows `Ignored: Trigger is cooling down.`
3. Push after 2 minutes: it scores, and `last_scored_at` moves forward.

- [ ] **Step 3: Note any failure as a new task before finishing the branch**
