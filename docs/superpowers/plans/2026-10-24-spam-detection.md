# Spam detection Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** A per-trigger "Skip spam" switch, on by default, that stops empty commits and pull requests closed by their author within a minute from scoring.

**Architecture:** Webhook handlers mark spam in a new required `Contribution.spamCount`, using pure rules in `src/utils/spam.ts`. The reward policy works out each trigger's `times` as the sum of `count − (skipSpam ? spamCount : 0)`, before the per-event limit, and drops triggers left with 0 before any cooldown or cap claim. A `skip_spam` column defaults to true, and the dialog shows the switch only for events with a rule.

**Tech Stack:** Next.js 16 App Router, Prisma 7 (Postgres), Zod 4, Ariakit forms, Jest 30, pnpm.

**Spec:** `docs/superpowers/specs/2026-10-24-spam-detection-design.md`

## Global Constraints

- Paths are relative to `apps/web/` unless they start with `docs/` or `README.md` (repo root).
- Run tests from `apps/web`: `pnpm test -- <path>`. Lint: `pnpm lint`. Types: `pnpm exec tsc --noEmit`. After any `prisma/schema.prisma` change: `pnpm prisma:generate`.
- ESLint (perfectionist) sorts literal arrays and object keys on commit. Never depend on the order of a literal array or `it.each` table.
- Events with a spam rule: `push` and `pull_request.closed`, nothing else.
- Rule copy, used verbatim in the switch and the preview: push `Empty commits don't count.`; pull_request.closed `Pull requests you close within a minute of opening don't count.`
- Empty commit: `added`, `removed` and `modified` all **present and empty**. A missing list means the commit counts, and so does a merge commit (message starts `Merge pull request #`, `Merge branch ` or `Merge remote-tracking branch `), which GitHub sends without file lists.
- Quick self-close: `pull_request.user.id === sender.id` and `closed_at − created_at < 60 000` ms, merged or not. A missing `closed_at` or `user` is not spam.
- Order per trigger: spam, then `MAX_REWARDS_PER_EVENT`, then cooldown, then daily cap.
- Log line when spam leaves nothing: `Ignored: Only spam.`
- `skipSpam` defaults to `true` everywhere: the column, `defaultValues`, `recipeToTriggerValues`, and the actions (`?? true`).
- Commits: conventional, plain-English subjects; squash-merged as `feat(web): skip empty commits and pull requests closed straight away`. End every message with `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`. Body lines ≤ 100 characters.

## Review Focus

1. **Two linked users in one push**: one wrote only empty commits, the other real ones. The first scores nothing and the second scores normally. Pinned in Task 4.
2. **A closed pull request whose author account is gone** (`user: null`): not spam, no crash. Pinned in Task 1.
3. **A spam-only push on a trigger with a cooldown and a cap**: no cooldown claim, no day lookup, no cap claim. Pinned in Task 4 with throwing fakes.
4. **Editing a trigger saved with Skip spam off**: the switch shows off, and saving keeps it off, also after switching the event away and back. Pinned in Task 5.
5. **Commits without file lists**: they count, never as spam. Pinned in Task 1.

---

### Task 1: Spam rules

**Files:**

- Create: `src/utils/spam.ts`
- Test: `src/utils/spam.test.ts`

**Interfaces:**

- Produces:
  - `spamRules: Partial<Record<string, string>>`, keyed by event name with the rule copy from Global Constraints.
  - `isEmptyCommit(commit: { added?: string[]; modified?: string[]; removed?: string[] }): boolean`
  - `isQuickSelfClose(pullRequest: { closed_at?: null | string; created_at: string; user?: { id: number } | null }, senderId: number): boolean`

- [ ] **Step 1: Write the failing tests** (one `it` per case)

```ts
const opened = '2026-10-24T10:00:00Z';
const pr = (closedAfterSeconds: null | number, authorId = 1) => ({
  closed_at:
    closedAfterSeconds === null
      ? null
      : new Date(Date.parse(opened) + closedAfterSeconds * 1000).toISOString(),
  created_at: opened,
  user: { id: authorId },
});

it('treats a commit that changes nothing as empty', () =>
  expect(isEmptyCommit({ added: [], modified: [], removed: [] })).toBe(true));
it('counts a commit that changes a file', () =>
  expect(isEmptyCommit({ added: [], modified: ['a.ts'], removed: [] })).toBe(
    false,
  ));
it('counts a commit whose file lists are missing', () =>
  expect(isEmptyCommit({ added: [], removed: [] })).toBe(false));
it('flags a pull request its author closed within a minute', () =>
  expect(isQuickSelfClose(pr(59), 1)).toBe(true));
it('counts a pull request closed after exactly a minute', () =>
  expect(isQuickSelfClose(pr(60), 1)).toBe(false));
it('counts a pull request someone else closed quickly', () =>
  expect(isQuickSelfClose(pr(5, 2), 1)).toBe(false));
it('counts a pull request without a closing time', () =>
  expect(isQuickSelfClose(pr(null), 1)).toBe(false));
it('counts a pull request whose author account is gone', () =>
  expect(isQuickSelfClose({ ...pr(5), user: null }, 1)).toBe(false));
it('has a rule for pushes and closed pull requests only', () =>
  expect(Object.keys(spamRules).sort()).toEqual([
    'pull_request.closed',
    'push',
  ]));
```

- [ ] **Step 2: Run them to verify they fail**

Run: `pnpm test -- src/utils/spam.test.ts`
Expected: FAIL, `Cannot find module './spam'`

- [ ] **Step 3: Implement `src/utils/spam.ts`** (a `QUICK_CLOSE_MS = 60_000` constant, plus the rule copy verbatim)

- [ ] **Step 4: Run them to verify they pass**

Run: `pnpm test -- src/utils/spam.test.ts`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/utils/spam.ts src/utils/spam.test.ts
git commit -m "feat(web): recognise empty commits and pull requests closed straight away"
```

---

### Task 2: Mark spam in the webhook handlers

**Files:**

- Modify: `src/rewards/types.ts` (`Contribution`)
- Modify: `src/app/api/v1/webhook/handlers/handlePush.ts`, `src/app/api/v1/webhook/handlers/handleUniversal.ts`
- Modify: every test that builds a `Contribution` (`src/rewards/deliverRewards.test.ts`, the handler tests): add `spamCount: 0`
- Test: `src/app/api/v1/webhook/handlers/handlePush.test.ts`, `src/app/api/v1/webhook/handlers/handleUniversal.test.ts`

**Interfaces:**

- Consumes: `isEmptyCommit`, `isQuickSelfClose` (Task 1).
- Produces: `Contribution = { actor: Actor; count: number; /** How many of `count` are spam, e.g. empty commits. Triggers with Skip spam on leave them out. */ spamCount: number }`.

- [ ] **Step 1: Write the failing tests**

`handlePush.test.ts`: extend `commit(username, distinct = true, files = { added: [], modified: ['a.ts'], removed: [] })` so it spreads `files` into the commit. Update the existing expectations to include `spamCount: 0`, then add:

- `'counts the empty commits of each author as spam'`: octocat with two real commits and one empty (`files = { added: [], modified: [], removed: [] }`), and hubot with one empty, gives `[{ actor: { login: 'octocat' }, count: 3, spamCount: 1 }, { actor: { login: 'hubot' }, count: 1, spamCount: 1 }]`.
- `'never counts bot commits, empty or not'`: an empty `dependabot[bot]` commit gives `[]`.

`handleUniversal.test.ts`: a `closed(closedAfterSeconds, authorId = 1)` helper builds the event with `payload.pull_request = { closed_at, created_at, user: { id: authorId } }` and `sender: { id: 1 }`. Then:

- `'marks a pull request its author closed straight away as spam'`: `handleUniversal(closed(5), 'pull_request.closed')` sends `contributions: [{ actor: { githubId: 1 }, count: 1, spamCount: 1 }]`.
- `'counts a pull request closed later'`: `closed(120)` gives `spamCount: 0`.
- `'counts a pull request someone else closed'`: `closed(5, 2)` gives `spamCount: 0`.
- `'never marks other events as spam'`: the existing `event` with `'issues.opened'` gives `spamCount: 0`.

- [ ] **Step 2: Run them to verify they fail**

Run: `pnpm test -- src/app/api/v1/webhook/handlers`
Expected: FAIL: the received contributions have no `spamCount`

- [ ] **Step 3: Implement**

- **`types.ts`:** add the required `spamCount`.
- **`handlePush`:** keep the per-author map as `{ count, spamCount }`, adding 1 to `spamCount` when `isEmptyCommit(commit)`. The bot and non-distinct skips stay first.
- **`handleUniversal`:** the destructuring keeps `payload` whole for the pull request. `spamCount` is `event === 'pull_request.closed' && 'pull_request' in payload && isQuickSelfClose(payload.pull_request, sender.id) ? 1 : 0`.
- **Existing tests:** add `spamCount: 0` to every contribution (`makeEvent`, `push()` helpers, and the inline ones in `deliverRewards.test.ts`).

- [ ] **Step 4: Run tests and types**

Run: `pnpm test && pnpm exec tsc --noEmit`
Expected: PASS, no type errors

- [ ] **Step 5: Commit**

```bash
git add src/rewards src/app/api/v1/webhook/handlers
git commit -m "feat(web): mark empty commits and quickly closed pull requests as spam"
```

---

### Task 3: Store the switch

**Files:**

- Modify: `prisma/schema.prisma` (model `Triggers`, after `capCount`)
- Create: `prisma/migrations/20261024140000_add_trigger_skip_spam/migration.sql`
- Modify: `src/schemas/triggerSchema.ts`, `src/actions/triggers/createTriggerAction.ts`, `src/actions/triggers/updateTriggerAction.ts`
- Test: `src/schemas/triggerSchema.test.ts`, both action tests

**Interfaces:**

- Produces: Prisma `Triggers.skipSpam: boolean`, and `TriggerSchema.skipSpam?: boolean`.

- [ ] **Step 1: Add the column and migration, then regenerate**

```prisma
skipSpam        Boolean                      @default(true) @map("skip_spam")
```

```sql
-- Let a trigger leave out empty commits and pull requests closed straight away

-- AlterTable
ALTER TABLE "triggers" ADD COLUMN "skip_spam" BOOLEAN NOT NULL DEFAULT true;
```

Run: `pnpm prisma:generate`, then the read-only check `npx prisma migrate diff --from-config-datasource --to-schema prisma/schema.prisma --script`.
Expected: the diff is exactly the `ALTER TABLE` above. The local database is at the daily-caps migration.

- [ ] **Step 2: Write the failing tests**

- **Schema:** `'accepts the spam switch'`, where `skipSpam: false` parses to `false`; and `'rejects a spam switch that is not true or false'`, where `skipSpam: 'yes'` fails.
- **Both actions:**
  - `'saves the spam switch'`: `skipSpam: false` gives `objectContaining({ skipSpam: false })`.
  - `'skips spam when the switch is missing'`: gives `objectContaining({ skipSpam: true })`.

- [ ] **Step 3: Run them to verify they fail**

Run: `pnpm test -- src/schemas src/actions/triggers`
Expected: FAIL on the new tests

- [ ] **Step 4: Implement** `skipSpam: z.boolean().optional()`, and `skipSpam: trigger.skipSpam ?? true` in both actions

- [ ] **Step 5: Run tests and types**

Run: `pnpm test -- src/schemas src/actions/triggers && pnpm exec tsc --noEmit`
Expected: PASS

- [ ] **Step 6: Commit**

```bash
git add prisma src/schemas src/actions/triggers
git commit -m "feat(web): save a spam switch with each trigger, on by default"
```

---

### Task 4: Leave spam out when rewarding

**Files:**

- Modify: `src/rewards/types.ts` (`TriggerRule`), `src/rewards/rewardPolicy.ts`
- Test: `src/rewards/deliverRewards.test.ts`

**Interfaces:**

- Consumes: `Contribution.spamCount` (Task 2), and the Prisma `skipSpam` column (Task 3).
- Produces: `TriggerRule.skipSpam: boolean`. `makeTrigger` defaults it to `true`.

- [ ] **Step 1: Write the failing tests** (a `describe('deliverRewards with spam')`, using `noCooldowns`/`noCaps`/`noDays` unless stated)

```ts
it('leaves empty commits out', …)              // count 5, spamCount 2 → times 3
it('counts empty commits with the switch off', …) // skipSpam false → times 5
it('leaves spam out before the per-event limit', …) // count 12, spamCount 4 → times 8
it('scores nothing for a push of only empty commits', …)
// count 2, spamCount 2, trigger with cooldownSeconds 600 and dailyCap 5, deps use noCooldowns, noCaps, noDays (they throw)
// → resolves, nothing applied, log.recorded empty
it('counts each trigger with its own switch', …)
// triggers 'trigger-1' (skipSpam true) and 'trigger-2' (skipSpam false), count 4, spamCount 1 → times [3, 4]
it('rewards a user with real commits next to one with only empty ones', …)
// users octocat (count 2, spamCount 2) and hubot (count 2, spamCount 0), both linked → only hubot applied, times 2
```

- [ ] **Step 2: Run them to verify they fail**

Run: `pnpm test -- src/rewards/deliverRewards.test.ts`
Expected: FAIL in the new describe

- [ ] **Step 3: Implement**

- **`TriggerRule`** gains `skipSpam: boolean`.
- **Policy:** keep the user's contributions (`isSameActor`) per user. For each matching trigger, `times = Math.min(sum(count - (trigger.skipSpam ? spamCount : 0)), getMaxTimesPerEvent())`. Skip triggers with `times === 0`, logging `{ trigger: uuid }` with `Ignored: Only spam.`, **before** the cooldown filter. Users left with no rewards drop out as today.

- [ ] **Step 4: Run all tests and types**

Run: `pnpm test && pnpm exec tsc --noEmit`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/rewards
git commit -m "feat(web): leave spam out when a trigger skips it"
```

---

### Task 5: Skip spam switch and preview

**Files:**

- Modify: `src/components/dashboard/TriggerModal.tsx`, `src/utils/describeTrigger.ts`, `src/utils/recipes.ts`
- Test: `src/components/dashboard/TriggerModal.test.tsx`, `src/utils/describeTrigger.test.ts`, `src/utils/recipes.test.ts`

**Interfaces:**

- Consumes: `spamRules` (Task 1); `TriggerSchema.skipSpam` (Task 3); `TriggerWithRepos.skipSpam`.

- [ ] **Step 1: Write the failing tests**

- **`describeTrigger.test.ts`:**
  - `'says empty commits don't count'`: a push with `skipSpam: true` ends `Empty commits don't count.`
  - `'says quickly closed pull requests don't count'`: `pull_request.closed`, on, ends with that rule.
  - `'says nothing about spam with the switch off'`: no `don't count`.
  - `'says nothing about spam for events without a rule'`: `issues.opened`, on, no `don't count`.
- **`recipes.test.ts`:** the exact-match test gains `skipSpam: true`.
- **`TriggerModal.test.tsx`:** extend `savedTrigger` with `skipSpam = true` and an `event` override. Find the switch with `screen.queryByRole('checkbox', { name: /Skip spam/ })`.
  - `'offers Skip spam for pushes'`: a saved push shows the switch, checked.
  - `'hides Skip spam for events without a rule'`: a saved `issues.opened` trigger shows no switch.
  - `'shows Skip spam switched off when it was saved off'`: `skipSpam: false` shows it unchecked.
  - `'keeps Skip spam off when saving'`: `skipSpam: false`, then save, calls `mockUpdateTrigger('trigger-uuid', objectContaining({ skipSpam: false }))`.

- [ ] **Step 2: Run them to verify they fail**

Run: `pnpm test -- src/utils src/components/dashboard/TriggerModal.test.tsx`
Expected: FAIL on the new tests

- [ ] **Step 3: Implement**

- **`describeTrigger`:** after the cap clause, when `values.skipSpam !== false` and `spamRules[values.event ?? '']` exists, append `text(' ')` and `text(rule)`.
- **`recipeToTriggerValues`:** add `skipSpam: true`.
- **`TriggerModal`:**
  - `defaultValues` gets `skipSpam: true`, and `triggerToValues` adds `skipSpam: trigger.skipSpam`.
  - At the end of "How it counts", render `<FormSwitch description={rule} label="Skip spam" name="skipSpam" />` only when `spamRules[formValues.event]` exists.
  - The value stays in the form state while hidden, which covers Review Focus 4.

- [ ] **Step 4: Run them to verify they pass, plus lint**

Run: `pnpm test -- src/utils src/components/dashboard && pnpm lint && pnpm exec tsc --noEmit`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/components/dashboard src/utils
git commit -m "feat(web): switch spam detection on or off per trigger"
```

---

### Task 6: Docs, FAQ and roadmap copy

**Files:**

- Modify: `src/config/roadmap.ts`, `src/app/faq/page.tsx`, `src/app/docs/supported-github-events/page.tsx`, `README.md`

- [ ] **Step 1: Update the copy**

- **Roadmap "Spam detection":** `description: 'Skip empty commits, and pull requests you close yourself within a minute of opening.'`, `status: 'in-progress'`.
- **FAQ answer:** replace `Spam detection comes next in the Anti-Cheese update, to help keep you honest.` with `Spam detection leaves out empty commits and pull requests you close straight away. Ignoring bot accounts comes next in the` + `<Link href="/roadmap">Anti-Cheese</Link>` + ` update.`
- **Supported events:**
  - **Pushes item:** append `Empty commits don't count, unless you switch Skip spam off.`
  - **The note on "Closed":** append `A pull request you close within a minute of opening doesn't count, unless you switch Skip spam off.`
- **README "Fair rewards":** append `Skip spam, on by default, leaves out empty commits and pull requests closed straight away.`

- [ ] **Step 2: Run tests and lint**

Run: `pnpm test -- src/config src/json-ld && pnpm lint`
Expected: PASS

- [ ] **Step 3: Commit**

```bash
git add src/config/roadmap.ts src/app/faq/page.tsx src/app/docs/supported-github-events/page.tsx ../../README.md
git commit -m "docs(web): explain spam detection"
```

---

### Task 7: Full check

**Files:** none

- [ ] **Step 1: Run the full suite**

Run: `pnpm test && pnpm lint && pnpm exec tsc --noEmit`
Expected: all green

- [ ] **Step 2: Note the manual checks for the user**

- **The dialog:** the switch shows for push and `pull_request.closed` triggers only.
- **A push through ngrok:** `git commit --allow-empty` scores nothing. Switch Skip spam off, push again, and it scores.
- **A pull request:** open one and close it within a minute; it doesn't score on a `pull_request.closed` trigger.
