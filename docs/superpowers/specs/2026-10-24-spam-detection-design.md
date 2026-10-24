# Spam detection

- **Status:** design approved, spec awaiting review
- **Date:** 2026-10-24
- **Scope:** `apps/web` only
- **Roadmap:** Anti-Cheese phase, "Spam detection"
- **Builds on:** `docs/superpowers/specs/2026-10-24-trigger-cooldowns-design.md`, `docs/superpowers/specs/2026-10-24-daily-caps-design.md`

## 1. Why

Cooldowns limit how often a trigger scores and daily caps limit how much. Spam detection stops rewards for work that isn't work at all: empty commits, and pull requests opened and closed straight away. It closes the last cheap loophole of the Anti-Cheese phase.

## 2. Behaviour

- **One "Skip spam" switch per trigger.** Shown only for events with a spam rule: `push` and `pull_request.closed`. Other events have no rule, so the switch would do nothing and isn't shown.
- **On by default, for new and existing triggers.** The migration turns it on everywhere. This is the one Anti-Cheese change that alters existing triggers on deploy; it belongs in the release notes.
- **Push rule:** an empty commit (no files added, removed or modified) doesn't count. A push of 5 commits with 2 empty scores 3.
- **Pull request rule:** a pull request closed by its own author within a minute of opening doesn't count, **merged or not**. `pull_request.closed` fires for both, and opening then closing straight away would otherwise farm the trigger. A quick merge by someone else is a teammate approving fast and still counts.
- **Spam comes first.** Per trigger, the order is: spam, the 10-per-event limit (`MAX_REWARDS_PER_EVENT`), cooldown, daily cap. 12 commits with 4 empty score 8. A trigger left with nothing doesn't score, so it never starts a cooldown or uses cap slots.
- **Switched off**, a trigger counts everything, as today.
- The earlier `pull_request.opened` reward for a quickly closed pull request isn't taken back; cooldowns and caps already limit it.

### Rejected alternatives

- **Always on, no setting.** Simpler, but the owner wants a per-trigger choice.
- **Two switches** ("Skip empty commits", "Skip quick self-merges"). Each only applies to one event, so they never appear together; one switch says the same.
- **On for new triggers only.** Leaves the loophole open on most existing triggers.
- **Only quick self-merges** (the roadmap's wording). Leaves open-and-close farming open.
- **An event flag plus an empty-commit count.** Two concepts for one idea.
- **Passing the raw GitHub payload to the policy.** Ties the policy to payload shapes, which `RewardableEvent` exists to avoid.

## 3. Data

One Prisma migration on `Triggers`:

```prisma
skipSpam Boolean @default(true) @map("skip_spam")
```

`ADD COLUMN "skip_spam" BOOLEAN NOT NULL DEFAULT true` sets every existing trigger to on. Safe before or after the code: old code ignores the column.

## 4. Validation and saving

- `src/schemas/triggerSchema.ts`: `skipSpam: z.boolean().optional()`.
- `createTriggerAction` and `updateTriggerAction` save `skipSpam: trigger.skipSpam ?? true`, so a request without it (a recipe, an older client) stays on.
- When editing, the form keeps the saved value even while the chosen event doesn't show the switch, so changing the event back and forth never flips it.

## 5. Spam rules

`src/utils/spam.ts`, pure, taking plain fields (so the dialog can import it too):

```ts
export const spamRules: Partial<Record<string, string>> = {
  'pull_request.closed': "Pull requests you close within a minute of opening don't count.",
  push: "Empty commits don't count.",
};
isEmptyCommit(commit: { added?: string[]; modified?: string[]; removed?: string[] }): boolean
isQuickSelfClose(pullRequest: { closed_at: null | string; created_at: string; user: { id: number } | null }, senderId: number): boolean
```

- `isEmptyCommit`: `added`, `removed` and `modified` are all present and empty. A missing list means we can't tell, so the commit counts: GitHub always sends them, and treating missing as empty would quietly stop rewarding every push if it ever didn't. A **merge commit always counts**: GitHub sends merge commits without file lists, so they're recognised by their message (`Merge pull request #…`, `Merge branch …`, `Merge remote-tracking branch …`) and never treated as empty. A merge with a custom message falls back to the file lists.
- `isQuickSelfClose`: `user.id === senderId` and `closed_at − created_at < 60 000` ms. A missing `closed_at` or `user` is not spam.
- `spamRules` lists the events with a rule and the description the dialog and preview show.

## 6. Event model and handlers

`src/rewards/types.ts`:

```ts
export type Contribution = {
  actor: Actor;
  count: number;
  /** How many of `count` are spam, e.g. empty commits. Triggers with Skip spam on leave them out. */
  spamCount: number;
};
```

`spamCount` is required, so every handler states it.

- `handlePush.ts`: the per-author count also counts that author's empty commits: `{ actor: { login }, count, spamCount }`. Bot and non-distinct commits are skipped first, as today, so they're never counted.
- `handleUniversal.ts`: `spamCount: event === 'pull_request.closed' && isQuickSelfClose(payload.pull_request, sender.id) ? 1 : 0`. Every other event sends `0`.

## 7. Policy

`src/rewards/rewardPolicy.ts` works out `times` per trigger instead of once per user:

```ts
const counted = sum of (count - (trigger.skipSpam ? spamCount : 0)) over the user's contributions;
const times = Math.min(counted, getMaxTimesPerEvent());
```

A trigger with `times === 0` is skipped with `Ignored: Only spam.` (logged with the trigger uuid), before the cooldown check, so `deliverRewards` never claims anything for it. `TriggerRule` gains `skipSpam: boolean`; `prismaRewardDirectory` spreads the full row, so it needs no change.

## 8. UI

- **Trigger modal** (`src/components/dashboard/TriggerModal.tsx`): a **Skip spam** `FormSwitch` at the bottom of "How it counts", rendered only when `spamRules[event]` exists, with that rule as its description. `defaultValues` and `recipeToTriggerValues` set `skipSpam: true`; `triggerToValues` uses the saved value.
- **Preview sentence** (`src/utils/describeTrigger.ts`): when the rule applies and the switch is on, the rule is the last clause, e.g. _"…It scores at most 10 times a day. Empty commits don't count."_
- **Trigger list:** no chip. Skip spam is on for almost every push trigger, so a chip would say nothing.

## 9. Testing

- **`spam.ts`:** `isEmptyCommit` true for three empty lists, false when any file changed, false when a list is missing; `isQuickSelfClose` true at 59 s by the author (merged or not), false at exactly 60 s, false for another sender, false without `closed_at` or `user`.
- **`handlePush.test.ts`:** empty commits go into each author's `spamCount`; bot and non-distinct commits are still skipped entirely.
- **`handleUniversal.test.ts`:** a quick self-close sends `spamCount: 1`; a slow close, or someone else's, sends `0`; other events send `0`.
- **`deliverRewards.test.ts`:** 5 commits with 2 empty score 3 with Skip spam on and 5 with it off; 12 with 4 empty score 8 (spam before the per-event limit); an all-empty push scores nothing, logs `Ignored: Only spam.`, and never claims a cooldown or looks up the day (throwing fakes); two triggers with different settings in one delivery each get their own count.
- **Schema and actions:** `skipSpam` saved; missing saves `true`.
- **Modal and sentence:** the switch shows for `push` and `pull_request.closed` and not for `issues.opened`; it's on for new triggers and recipes; editing shows a saved "off"; the clause follows the event and only appears when on.
- Every existing test `Contribution` gains `spamCount: 0`.
- **Manual (ngrok):** an empty commit (`git commit --allow-empty`) scores nothing; with Skip spam off it scores. A merge with the "Create a merge commit" button still scores on a push trigger.

## 10. Docs and copy

- `src/config/roadmap.ts`: "Spam detection" description _"Skip empty commits, and pull requests you close yourself within a minute of opening."_, status in progress.
- FAQ ("What prevents me from spamming commits for infinite Gold?"): describe spam detection; only bot accounts remain "next".
- Supported events page: the Pushes item mentions empty commits; the `pull_request.closed` note mentions quick self-closes.
- `README.md` "Fair rewards": one sentence.

## 11. Out of scope

- Other spam rules (whitespace-only commits, trivially small diffs, reopen loops).
- Taking back the `pull_request.opened` reward of a quickly closed pull request.
- Bot accounts: a separate roadmap item.

## 12. Rollout

- Branch `feat/spam-detection` from `main`, squash-merged into `main`.
- Changelog subject: `feat(web): skip empty commits and pull requests closed straight away`.
- Release note: Skip spam is on for every existing trigger; switch it off per trigger to count everything again.
