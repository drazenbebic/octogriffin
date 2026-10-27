# Organization member access

- **Status:** design approved, spec awaiting review
- **Date:** 2026-10-27
- **Scope:** `apps/web` only
- **Issue:** [#229](https://github.com/drazenbebic/octogriffin/issues/229), "add support for github organizations"
- **Builds on:** `fix(web): let you add Octogriffin to more than one GitHub account or organization` (one user, several installations)

## 1. Why

Octogriffin can already be installed on an organization, but only the person who clicked Install is linked to it. Everyone else in the org can't sign in, and even if they could, the Reward Policy only pays the installation's owner.

The case to support:

> Ryan plays Habitica privately. His company's GitHub org has his personal GitHub account as a member. The company installs Octogriffin on the org. Ryan signs in with his personal account, sees the org repos he has access to, adds them to his triggers, and earns XP for his work.

## 2. Behaviour

- **Members join by signing in.** There is no separate "join" step. When someone signs in, we ask GitHub which Octogriffin installations they can access. Each **organization** installation we know about becomes a membership.
- **Members only see repos they can see on GitHub.** Of the repos selected in the installation, a member gets the ones GitHub lists for them. Private repos limited to teams they aren't in stay hidden.
- **Access is checked at sign-in.** Every sign-in replaces the member's memberships and repo access with what GitHub reports now. Nothing is checked in the background.
- **New public repos reach members right away.** When the installation gains a public repo (`installation_repositories.added` or `repository.created`), every member of that installation gets access. New private repos show up after the member's next sign-in, for which the dashboard offers a **Refresh access** button.
- **Losing access removes the repo from triggers.** When a sign-in shows a member can no longer see a repo, it is removed from their triggers and stops rewarding them. A trigger can be left without repos, as already happens when an installation drops a repo.
- **The installer stays the owner.** Owning an installation works exactly as today: the owner sees every selected repo and is never a member of their own installation. Only org owners can install apps on an org, and they can see every repo anyway.
- **Personal installations aren't shared.** Collaborators on someone's personal repos also show up in GitHub's list, but we only create memberships for `Organization` accounts. Someone installing on their own account didn't agree to reward others.
- **Outside collaborators of an org count as members**, limited to the repos they collaborate on. The org chose to give them access.
- **No installation, no data.** A user who owns no installation and is a member of none is deleted with everything we keep about them, as today. This now also happens when the org uninstalls the app, or when a sign-in shows they left their last org.

### Known limitation

Someone who leaves the org keeps their membership until they sign in again or the org uninstalls. GitHub already stops them pushing to the org's repos or opening PRs on its private ones, so what's left is activity on public repos (which anyone can do), old commits of theirs pushed by someone else, and org repo names on their dashboard that they could already see.

### Rejected alternatives

- **Add every org member at install time.** Needs the org "Members" permission, and each person still has to sign in and enter their Habitica token before earning anything.
- **Members permission and `organization.member_removed`.** Removes leavers right away, but every existing installation would have to approve a new permission.
- **Store GitHub user tokens to refresh in the background.** Undoes the decision to stop storing GitHub tokens, and GitHub App user tokens expire after 8 hours, so we'd store refresh tokens too.
- **Installation-wide access for members.** Simpler, but shows members the names of private repos they can't see on GitHub.
- **Share personal installations with collaborators.** The installer didn't ask for it, and it isn't what issue #229 is about.

## 3. Data

One Prisma migration.

On `GithubInstallations`, which account the app is installed on:

```prisma
accountLogin     String?                     @map("account_login") @db.VarChar(255)
accountType      String?                     @map("account_type") @db.VarChar(255) // "User", "Organization", "Enterprise"
accountAvatarUrl String?                     @map("account_avatar_url") @db.VarChar(255)
members          GithubInstallationMembers[] @relation("GithubInstallationsMembers")
```

A new model for people who get in through an org:

```prisma
model GithubInstallationMembers {
  id             BigInt                       @id @default(autoincrement()) @map("id") @db.BigInt
  uuid           String                       @unique @default(uuid()) @map("uuid") @db.VarChar(36)
  installation   GithubInstallations          @relation("GithubInstallationsMembers", fields: [installationId], references: [id], onDelete: Cascade)
  installationId BigInt                       @map("installation_id") @db.BigInt
  githubUser     GithubUsers                  @relation("GithubUsersMemberships", fields: [githubUserId], references: [id], onDelete: Cascade)
  githubUserId   BigInt                       @map("github_user_id") @db.BigInt
  // The installation's selected repositories this member can see on GitHub
  repositories   GithubSelectedRepositories[] @relation("GithubInstallationMembersRepositories")
  createdAt      DateTime                     @default(now()) @map("created_at")
  updatedAt      DateTime                     @updatedAt @map("updated_at")

  @@unique([installationId, githubUserId])
  @@index([githubUserId])
  @@map("github_installation_members")
}
```

Plus the back relations: `GithubUsers.memberships` and `GithubSelectedRepositories.members`.

- Repo access is an implicit many-to-many, like `Triggers.repositories`. Deleting a selected repository removes its access rows, so `installation_repositories.removed` and `repository.deleted` need no changes.
- The account columns are nullable. Existing installations get them from a member's sign-in (`GET /user/installations` includes the account). Nothing else backfills them, because we have no app private key to ask GitHub ourselves.
- The migration only adds nullable columns and new tables, so it is safe to run before or after the code.

## 4. Sign-in

The NextAuth GitHub provider uses the GitHub App's client ID (`GITHUB_CLIENT_ID`), so `account.access_token` in the `signIn` callback is a GitHub App user token. It can list the app's installations the user can access, with no new permissions. **Verify this in production before building:** with a separate OAuth App, `GET /user/installations` answers 403.

### GitHub client

`src/lib/GithubUserApi.ts`, in the style of `HabiticaApi.ts`, built from the access token and never stored:

- `getInstallations()`: `GET /user/installations?per_page=100`, following pages, returning `{ id, account: { avatarUrl, login, type } }[]`. Enterprise accounts have a `slug` instead of a `login`; use it.
- `getInstallationRepositoryIds(installationId)`: `GET /user/installations/{id}/repositories?per_page=100`, following pages, returning repository IDs.
- Sends `Accept: application/vnd.github+json` and `X-GitHub-Api-Version: 2022-11-28`, and throws a `GithubApiError` with the status for anything that isn't 2xx.

### Syncing access

`syncInstallationAccess(profile, api)` in `src/accessors/installationMembership.ts`:

1. Fetch the installations. For each one we store, update its account columns.
2. Keep the ones that are `Organization` accounts and not owned by this user. For each, fetch the repository IDs and keep those selected in our installation.
3. In one transaction:
   - `releaseGithubLogin`, then create the `github_users` row from the profile if there is none (members never had an `installation.created` to create it).
   - Upsert a membership per kept installation and `set` its repositories.
   - Delete memberships for installations no longer in the list.
   - Disconnect repositories the user lost access to from their triggers.
   - If the user now owns no installation and is a member of none, delete them and resolve to "no access".
4. Resolve to whether the user has access.

The `signIn` callback runs this before anything else, replacing today's "no `github_users` row" check:

- **No access:** redirect with `error=GithubAppNotInstalled`, as today.
- **GitHub fails and the user already exists:** log the error, keep their stored access and let them in. Owners are never locked out by a GitHub hiccup.
- **GitHub fails and the user is new:** redirect with a new `error=GithubAccessCheckFailed`.
- **Access:** the existing profile update follows, unchanged.

Only GitHub's answer to the user's own token decides memberships. Nothing comes from client input.

## 5. Webhooks

The handlers live in `src/webhooks/handlers/`, and `src/webhooks/dispatchWebhook.ts` runs exactly one of them per delivery.

- **`installation.created`:** also save `accountLogin`, `accountType` and `accountAvatarUrl` from `installation.account`.
- **`installation_repositories.added`:** after adding the repositories, give every member of the installation access to the **public** ones.
- **`repository.created`:** same, when the new repository is public. It gets its own `handleRepositoryCreated` in the dispatch table in place of `handleRewardableEvent`. It selects the repository (the step `handleRewardableEvent` does today), grants access, then calls `handleRewardableEvent`, so the event is still rewarded.
- **`repository.deleted`:** gets its own `handleRepositoryDeleted` the same way. It calls `handleRewardableEvent`, then deselects the repository, which also moves out of `handleRewardableEvent`. `handleRewardableEvent` is then left with only rewarding, and all repository selection sits in the four repository handlers next to each other in the dispatch table.
- **`installation.deleted`:** see §8.
- Removing repositories needs no change for memberships (see §3).

Add an accessor `grantPublicRepositoriesToMembers(installationId, githubRepositoryIds)` that connects the matching public `github_selected_repositories` rows to every membership of the installation. A redelivery connects nothing new.

## 6. Rewards

- **`LinkedUser`** (`src/rewards/types.ts`) gets `memberships: { installationId: number; repositoryIds: number[] }[]`, loaded by `prismaRewardDirectory.findLinkedUsers` alongside `installationIds`.
- **`evaluateRewards`** replaces the owner-only filter. A user qualifies when they own the event's installation **or** have a membership in it whose `repositoryIds` include the event's repository. The comment changes from "Only the owner of the installation" to "Only the owner, or members who can see the repository".
- Trigger repos already come from repos the user can see (§7), but the policy checks access itself, so a stale trigger never pays out.
- `deliverRewards`, the reward log, cooldowns and caps don't change. They already handle several recipients per delivery.

## 7. Repositories and triggers

`src/accessors/repository.ts`:

- `getAllRepositories(githubUserId)` returns repositories of installations the user owns **or** that their memberships list: `OR: [{ installation: { githubUserId } }, { members: { some: { githubUserId } } }]`.
- `ownsRepositories(githubUserId, uuids)` uses the same condition. Rename it to `canUseRepositories`, since members don't own them.
- Both feed every action that lists or checks repositories (`getConnectedReposAction`, `getRepositoriesAction`, `createTriggerAction`, `updateTriggerAction`), so the trigger modal and its checks need no other changes.
- `getConnectedReposAction` also returns each repository's `account` (login and avatar of its installation), for grouping.

## 8. Deletion

`deleteGithubInstallation`, in its transaction:

1. Collect the owner and every member of the installation.
2. Delete the installation. Memberships, repo access, selected repositories and trigger links cascade.
3. Delete each collected user who now owns no installation and is a member of none.

Members who still own an installation or belong to another org keep their account, and only lose that org's repos. The sign-in sync applies the same rule (§4, step 3).

## 9. UI

- **Profile** (`getUserProfileAction`, `src/app/profile/page.tsx`): `hasInstallation` is also true with a membership in an unsuspended installation. The status reads **Installed** when the user owns one, otherwise **Through acme** (the logins of their orgs, comma-separated).
- **Dashboard repositories** (`RepositoryListCard`): group repositories under their account's avatar and login, falling back to the owner part of `fullName` when the account isn't known yet. Below the list: _"Missing a repository from your organization? Private ones show up after you sign in again."_ with a **Refresh access** button that calls `signIn('github', { callbackUrl: window.location.href })`.
- **Errors** (`src/components/errorMap.ts`):
  - `GithubAppNotInstalled`: _"Install the GitHub App, or ask your organization to, before signing in."_
  - `GithubAccessCheckFailed`: _"We couldn't check your GitHub access. Please try again."_

## 10. Testing

- **`GithubUserApi`** (mocked `fetch`): follows pages; maps Enterprise `slug` to `login`; throws `GithubApiError` with the status.
- **`syncInstallationAccess`** (fake API, mocked Prisma):
  - Creates the user and a membership for an org installation we know; ignores installations we don't know.
  - Skips `User` installations and installations the user owns.
  - Keeps only repositories selected in our installation.
  - Removes memberships the user lost, and disconnects lost repositories from their triggers.
  - Deletes a user left with nothing and reports no access; keeps an owner who has no memberships.
  - Updates account columns.
- **`signIn` callback:** no access redirects with `GithubAppNotInstalled`; a GitHub failure lets an existing user in and sends a new one to `GithubAccessCheckFailed`.
- **`rewardPolicy` / `deliverRewards.test.ts`:** a member with access is rewarded; a member without access to that repository isn't; a member of another installation isn't; an owner and a member on the same push are both rewarded once.
- **Webhooks:** `installation.created` saves the account; `installation_repositories.added` and `repository.created` grant public repositories to members and skip private ones; a redelivery grants nothing twice. In `dispatchWebhook.test.ts`, a `repository.created` delivery both grants access and is still rewarded. The select-before-reward and deselect-after-reward ordering tests move from `handleRewardableEvent.test.ts` to the tests of the two new handlers.
- **`deleteGithubInstallation`** (extend `handleInstallationDeleted.test.ts`): deletes members left with nothing, keeps members with another installation or membership, keeps the owner if they still own another.
- **Repository accessors:** members see only their repositories; `canUseRepositories` rejects a selected repository the member can't see.
- **UI:** profile status for owners and members; repositories grouped by account; the refresh button signs in again.
- **Manual (ngrok, a test org):** install on the org as one account, sign in as a second member, add an org repo to a trigger, push, and see the reward. Remove the second account from a team that owns a private repo, sign in again, and see the repo leave the list and the trigger.

## 11. Docs and copy

- **Installation page:** step 1 says the app can be installed on your account or your organization, and that org members then just sign in.
- **FAQ:**
  - _"Can my company install it for our organization?"_ Yes. Everyone in the org signs in with their own account and only sees the repos they can see on GitHub.
  - _"Why don't my commits earn anything?"_ Push rewards need the commit email linked to your GitHub account. Common with work emails on personal accounts.
- **Privacy policy:** we store which organization installations and repositories you can access, checked each time you sign in, and delete your data when your last organization removes Octogriffin and you have no installation of your own.
- **Roadmap** (`src/config/roadmap.ts`): an **Organizations** item, _"Install it on your organization and everyone in it can earn."_

## 12. Out of scope

- Noticing that someone left the org before they sign in again (Members permission and `organization.member_removed`).
- Background access refresh with stored tokens.
- Sharing personal installations with collaborators.
- Org admins choosing which members may use the installation.
- Marketplace plans or seat limits per organization.
- The installer of an org installation keeps its repos after leaving the org, as today.

## 13. Rollout

- Branch `feat/org-members` from `main`, squash-merged into `main`.
- Changelog subject: `feat(web): let everyone in an organization earn from its installation`.
