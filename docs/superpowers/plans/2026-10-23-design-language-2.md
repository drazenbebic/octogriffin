# Design Language 2.0 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Restyle `apps/web` onto a logo-derived, semantic-token design system. Redesign the chrome, the marketing and content pages, the dashboard and the trigger dialog, and make recipes create triggers.

**Architecture:**

- Raw colour scales and semantic tokens are CSS variables in `globals.css`, redefined under `.dark` and exposed to Tailwind v4 via `@theme inline`. Components use `bg-surface` / `text-muted` instead of `x dark:y` pairs.
- New Ariakit-based atoms: Tooltip, Menu, SegmentedControl.
- Page content (recipes, roadmap) moves into typed config files, driven by pure functions that carry the tests.

**Tech Stack:** Next.js 16 (App Router), React 19, Tailwind CSS v4, Ariakit 0.4, Hugeicons, sonner, zustand, Jest + Testing Library.

**Spec:** `docs/superpowers/specs/2026-10-23-design-language-2-design.md`. Read it first; section numbers (§) below refer to it. Mockups: the canvas linked in the spec header.

## Global Constraints

- All colours, radii, shadows, fonts and durations come from spec §4. Copy hex values exactly; don't invent new ones.
- Brand primary: light `#6040A6` (griffin-600), dark `#7853BE` (griffin-500). The logo colour `#432879` is griffin-800.
- Fonts: Bricolage Grotesque (`--font-display`, headings 20px and up), Inter (`--font-sans`), JetBrains Mono (`--font-mono`, code-like identifiers only).
- One page shell: 1200px, with padding 16 / 24 / 32px below 640 / below 1024 / from 1024. Prose is capped at `68ch`.
- Grain (`arcane`, `mist`) is only allowed where §4.10 lists it.
- No `hover:-translate-y-*`, `animate-ping`, `animate-breathe` or `group-hover:scale-*` anywhere. Respect `prefers-reduced-motion`.
- Copy is in sentence case. No uppercase, wide-tracked labels.
- Every icon-only control uses `ButtonIcon` with `label`, which supplies both the tooltip and `aria-label`. No `title=` on interactive elements.
- Commits follow release-please: `feat(web): …` / `fix(web): …` in plain English for user-visible changes, `refactor(web): …` for internals. Never mix the two in one commit.
- Out of scope (§8): History outcome column and filters, Test connection, Disconnect, FAQ search, legal summary box, per-trigger stats.
- Tests: `cd apps/web && pnpm test -- <path>`. Lint: `pnpm lint`. Type check: `pnpm exec tsc --noEmit`.

## Review Focus

1. **Unknown or tampered `?recipe=` slug:** the dashboard ignores it, opens no dialog and strips the param (test in Task 22).
2. **Using a recipe with zero connected repositories:** the dialog opens with an empty repository field, an "Install the GitHub App on a repository first" link and a disabled submit (test in Task 22).
3. **Edited trigger whose event has no label** (removed from `rewardableWebhooks`): the sentence and table fall back to the raw event ID and don't crash (test in Task 10).
4. **New Habitica accounts with `toNextLevel`, `maxHealth` or `maxMP` of 0:** stat bars clamp to 0–100 and never render `NaN%` (test in Task 18).
5. **History deliveries near midnight and across years:** day groups follow the viewer's local date, and older years show the year (test in Task 19).

---

## Phase 1: Tokens

### Task 1: Tokens, fonts, grain and the temporary bridge

**Files:**

- Modify: `src/app/globals.css`
- Modify: `src/app/layout.tsx`
- Create: `public/noise.webp`, `scripts/generate-noise.mjs`

**Interfaces:**

- Produces these Tailwind utilities:
  - colours: `bg|text|border|ring-{bg,surface,sunken,raised,fill,border,line,border-strong,text,text-2,muted,faint,accent,accent-hover,accent-text,accent-soft,hp,hp-soft,xp,xp-soft,mp,mp-soft,gp,gp-soft,ok,ok-soft,tip-bg,tip-text,tip-border}` and `griffin-{50…950}`;
  - radius: `rounded-{sm,md,lg,xl,2xl}` at 6 / 10 / 14 / 20 / 24px;
  - shadows: `shadow-e1|e2|e3` and `shadow-highlight` (the dark top highlight; none in light);
  - fonts: `font-display`, `font-sans`, `font-mono`;
  - layout: `max-w-shell` and `max-w-measure`;
  - surfaces: the `arcane` and `mist` utilities;
  - CSS variables `--dur-fast`, `--dur-base` and `--ease-out`.

- [ ] **Step 1:** In `globals.css`:
  - define `:root` and `.dark` blocks with every token from §4.1–4.4 and §4.6–4.8;
  - add `@theme inline` mapping each `--color-*` / `--radius-*` / `--shadow-*` / `--font-*` to them;
  - add `@utility arcane` and `@utility mist` exactly as §4.10 describes (gradient stops, `::after` with `url(/noise.webp)` `0 0 / 180px`, overlay at .32 and multiply at .10; `mist` falls back to `background: var(--surface)` under `.dark`);
  - add a `@media (prefers-reduced-motion: reduce)` block that sets `transition-duration: 0ms` and `animation: none` on `*`.
  - Body: `bg-bg text-text font-sans`.
- [ ] **Step 2: Bridge (§7.2).** In `@theme`, override `--color-violet-50…950` with griffin-50…950 and `--color-slate-50…950` with ink 25/50/100/200/300/400/500/600/800/900/950. Mark the block `/* BRIDGE: removed in Task 24 */`.
- [ ] **Step 3:** In `layout.tsx`, load `Bricolage_Grotesque` (`weight: ['500','600','700','800']`, `axes: ['opsz']`, `variable: '--font-display'`), `Inter` (`variable: '--font-sans'`) and `JetBrains_Mono` (`weight: ['400','500']`, `variable: '--font-mono'`) from `next/font/google`. Put all three variables on `<html>`, and replace the body's slate classes with `bg-bg text-text`.
- [ ] **Step 4:** Write `scripts/generate-noise.mjs`, a Node script with only `zlib` that writes a 256×256 8-bit grayscale PNG of uniform random noise (seeded, so it's reproducible). Run it, convert with `cwebp -q 50 noise.png -o public/noise.webp`, and commit only the `.webp` (target under 12 KB).
- [ ] **Step 5: Verify.** `pnpm dev`. The home page now shows the logo purple, tinted neutrals and the Inter body, with no console errors. Toggle dark mode: the page background is `#0D0B12`. Then run `pnpm lint && pnpm exec tsc --noEmit`.
- [ ] **Step 6: Commit.** `refactor(web): add design tokens, fonts and grain texture`

---

## Phase 2: Atoms

### Task 2: Shell, type and Card

**Files:**

- Create: `src/components/ui/Shell.tsx`
- Modify: `src/components/ui/Heading.tsx`, `Content.tsx`, `Card.tsx`, `CardBody.tsx`
- Test: `src/components/ui/Heading.test.tsx`

**Interfaces:**

- Produces:
  - `Shell: FC<{ as?: ElementType; className?: string; children: ReactNode }>`.
  - `Heading` sizes are `'display-xl' | 'display' | 'h1' | 'h2' | 'h3' | 'h4'`, defaulting by level 1→h1, 2→h2, 3→h3, 4–6→h4. Colours are `'text' | 'accent' | 'inherit'`.
  - `Content` colours are `'text' | 'text-2' | 'muted' | 'accent'` (default `text-2`).
  - `Card` variants are `'surface' | 'sunken' | 'outlined'` (default `surface`). `isHoverable` is removed.

- [ ] **Step 1: Write a failing test.** `Heading` level 1 renders an `h1` with the classes `font-display` and `text-[36px]`. The `size="h4"` variant renders `font-sans font-semibold`.
- [ ] **Step 2:** Run it and confirm it fails.
- [ ] **Step 3: Implement** the size map from §4.5. Display sizes get `tracking-[-0.02em] text-balance`, and `display-xl` uses `text-[clamp(40px,5.4vw,64px)]`. Map the old size names at their call sites: `4xl`→`display`, `3xl`→`h1`, `2xl`→`h2`, `xl`/`lg`→`h3`, `base`/`sm`→`h4`. Then update every call site (grep `size="`).
- [ ] **Step 4:** Restyle `Card` per §5. Remove `isHoverable` and its call sites (home steps, DocsCard). Card radius is `rounded-lg`. The default `CardBody` padding is `p-6`.
- [ ] **Step 5: Verify.** Run the test, `pnpm lint` and `tsc`.
- [ ] **Step 6: Commit.** `refactor(web): add Shell and the new type scale`

### Task 3: Button, ButtonIcon, Tooltip, Kbd

**Files:**

- Create: `src/components/ui/Tooltip.tsx`, `src/components/ui/Kbd.tsx`
- Modify: `src/components/ui/Button.tsx`, `src/components/ui/ButtonIcon.tsx`, `src/components/Providers.tsx`
- Test: `src/components/ui/ButtonIcon.test.tsx`

**Interfaces:**

- Produces:
  - `Tooltip: FC<{ content: ReactNode; title?: string; shortcut?: string; children: ReactElement; placement?: 'top'|'bottom'|'left'|'right' }>`. It wraps the child in Ariakit `TooltipAnchor`.
  - `TooltipGroup` sets `showTimeout={500}` and `skipTimeout={300}`, and is mounted once in `Providers`.
  - `Kbd: FC<{ children: string }>`.
  - `ButtonIcon` props: `{ label: string; icon: IconSvgElement; variant?: 'ghost'|'secondary'|'primary'|'danger'; size?: 'sm'|'md'|'lg'; shape?: 'rounded'|'circle'; tooltip?: Omit<TooltipProps,'children'|'content'> } & ComponentProps<'button'>`. `label` is required and becomes the tooltip content and the `aria-label`.
  - `Button` variants: `'primary'|'secondary'|'ghost'|'danger'|'onGrain'`.

- [ ] **Step 1: Write failing tests.**
  - `render(<ButtonIcon label="Refresh triggers" icon={RefreshIcon} />)`: `getByRole('button', { name: 'Refresh triggers' })` exists, and after `userEvent.hover` plus `jest.advanceTimersByTime(500)`, `findByRole('tooltip')` has the text "Refresh triggers".
  - A second test: `ButtonIcon` sets no `title` attribute.
- [ ] **Step 2:** Run them and confirm they fail.
- [ ] **Step 3: Implement.**
  - Button sizes: `sm` h-8, `md` h-10, `lg` h-12. Radius md. `active:translate-y-px`.
  - Focus: `focus-visible:ring-2 ring-accent ring-offset-2 ring-offset-bg`.
  - Tooltip: `--tip-*` colours, 12px/500, `rounded-sm`, `px-2 py-1.5`, `TooltipArrow`, `shadow-e2`, and `data-enter` fade over `--dur-base`.
  - Migrate the call sites: `black` → `secondary` (home "Open source") or `onGrain` (hero). Every `ButtonIcon` gets a `label` (ThemeSwitcher, TriggersList refresh, WebhookLogsList refresh, DialogDismiss, FormInput's password toggle).
- [ ] **Step 4: Verify.** The tests pass, `tsc` reports no missing `label`, and `pnpm lint` passes.
- [ ] **Step 5: Commit.** `feat(web): show tooltips on icon buttons`

### Task 4: Menu

**Files:**

- Create: `src/components/ui/Menu.tsx`
- Test: `src/components/ui/Menu.test.tsx`

**Interfaces:**

- Produces:
  - `Menu: FC<{ trigger: ReactElement; label: string; children: ReactNode; header?: ReactNode }>`, built on Ariakit `MenuProvider`/`MenuButton`/`Menu`.
  - `MenuItem: FC<{ href?: string; onClick?: () => void; icon?: IconSvgElement; tone?: 'default'|'danger'; children: ReactNode }>`.
  - `MenuSeparator`.

- [ ] **Step 1: Write a failing test.** Clicking the trigger shows `role="menu"`; ArrowDown moves focus to the second `menuitem`; Escape closes the menu and returns focus to the trigger.
- [ ] **Step 2:** Run it and confirm it fails.
- [ ] **Step 3: Implement.** `bg-raised border border-border rounded-md shadow-e2 shadow-highlight p-1.5`. Items are 13px, `rounded-[8px] px-2.5 py-2`, with `data-active-item:bg-fill`; the danger tone uses `text-hp`.
- [ ] **Step 4:** Run the tests and confirm they pass.
- [ ] **Step 5: Commit.** `refactor(web): add Menu component`

### Task 5: SegmentedControl and ChoiceCard

**Files:**

- Create: `src/components/ui/SegmentedControl.tsx`, `src/components/ui/FormSegmentedControl.tsx`, `src/components/ui/ChoiceCard.tsx`
- Test: `src/components/ui/SegmentedControl.test.tsx`

**Interfaces:**

- Produces:
  - `type SegmentOption<V extends string> = { value: V; label: ReactNode; tooltip?: TooltipContent }`.
  - `SegmentedControl<V>: (props: { label: string; options: SegmentOption<V>[]; value: V; onChange: (v: V) => void; size?: 'md'|'lg' }) => JSX.Element`, using Ariakit `RadioProvider` + `Radio`.
  - `FormSegmentedControl<V>: { name: string; label: string; options: SegmentOption<V>[] }`, which reads and writes `useFormContext()` the way `FormSelect` does, rendering `FormLabel` and `FormFeedback`.
  - `ChoiceCard`: `{ value: string; title: string; description: string; icon: IconSvgElement; tone: 'ok'|'hp' }`, used inside the same `RadioProvider` through `ChoiceCardGroup: { name: string; label: string; children }`.

- [ ] **Step 1: Write a failing test.** With options Daily/Weekly/Monthly and value `weekly`:
  - the `radiogroup` named "Counter resets" exists;
  - the radio "Weekly" has `aria-checked="true"`;
  - pressing ArrowRight calls `onChange('monthly')`.
- [ ] **Step 2:** Run it and confirm it fails.
- [ ] **Step 3: Implement.** Track: `bg-sunken border border-border rounded-[12px] p-1 grid gap-1` with `grid-template-columns: repeat(n, minmax(0,1fr))`. Selected segment: `bg-raised border-border-strong shadow-e1 shadow-highlight font-semibold`. Height 40 (`md`) or 44 (`lg`). A segment with `tooltip` is wrapped in `Tooltip`.
- [ ] **Step 4:** Run the test and confirm it passes.
- [ ] **Step 5: Commit.** `refactor(web): add segmented control and choice cards`

### Task 6: The Chip family

**Files:**

- Create: `src/components/ui/Chip.tsx`, `src/components/ui/AttributeChip.tsx`, `src/components/ui/DifficultyLabel.tsx`, `src/components/ui/EventId.tsx`, `src/utils/difficulty.ts`
- Delete in Task 23: `Badge.tsx`, `Pill.tsx`, `DismissableBadge.tsx` (replace their call sites now)
- Test: `src/utils/difficulty.test.ts`, `src/components/ui/AttributeChip.test.tsx`

**Interfaces:**

- Produces:
  - `Chip: FC<{ tone?: 'neutral'|'accent'|'ok'|'hp'|'xp'|'mp'; shape?: 'square'|'pill'; dot?: boolean; onDismiss?: () => void; dismissLabel?: string; children }>`.
  - `getDifficulty(priority: number): { label: 'Trivial'|'Easy'|'Medium'|'Hard'; stars: 0|1|2|3 }` in `utils/difficulty.ts`, replacing `getDifficultyConfig` in `TriggersListItem`.
  - `DifficultyLabel: FC<{ priority: number }>`.
  - `AttributeChip: FC<{ attribute: 'str'|'int'|'con'|'per' }>`, with a rich tooltip.
  - `EventId: FC<{ event: string }>`.

- [ ] **Step 1: Write failing tests.**
  - `getDifficulty(0.1)` returns Trivial/0, `1` Easy/1, `1.5` Medium/2, `2` Hard/3, and `0.5` falls back to Easy/1.
  - `AttributeChip attribute="int"` shows the text "INT", and its tooltip has the title "Intelligence" and the description "Raises the XP you earn and your maximum mana."
  - Use these exact tooltip copies:
    - STR: "Strength", "Raises damage to bosses and your chance of critical hits."
    - CON: "Constitution", "Reduces the damage you take from missed Dailies and bad habits."
    - PER: "Perception", "Raises the Gold you earn and your chance of finding items."
- [ ] **Step 2:** Run them and confirm they fail.
- [ ] **Step 3: Implement.**
  - Tones from §4.4: `bg-{tone}-soft text-{tone}`, with neutral as `bg-fill text-text-2`.
  - Attribute tones: STR hp, INT mp, CON xp, PER accent.
  - Stars render in `text-xp`, with `·` for 0.
  - Replace every `Badge`, `Pill` and `DismissableBadge` usage (grep). `Pill variant="shiny"` on home is handled in Task 12; leave that call site for now.
- [ ] **Step 4: Verify.** Run the tests, `tsc` and lint.
- [ ] **Step 5: Commit.** `refactor(web): replace badges and pills with chips`

### Task 7: Form controls, Switch, Accordion, Dialog, Toaster, Skeleton

**Files:**

- Modify: `src/components/ui/{FormInput,FormTextarea,FormLabel,FormFeedback,Select,SelectItem,Combobox,ComboboxItem,Switch,Accordion,AccordionGroup,Dialog,DialogBackdrop,DialogDismiss,Skeleton,Avatar,Callout,Alert,Pagination,Code}.tsx`, `src/components/Providers.tsx`
- Create: `src/components/ui/DialogParts.tsx` (`DialogHeader`, `DialogBody`, `DialogFooter`)
- Test: `src/components/ui/FormTextarea.test.tsx`

**Interfaces:**

- Produces:
  - `FormTextarea` gains `showCount?: boolean`, which renders `{length} / {maxLength}` in mono.
  - `DialogHeader: { icon?: IconSvgElement; title: ReactNode; actions?: ReactNode; onCloseLabel: string }`, `DialogBody: { children; className? }`, `DialogFooter: { start?: ReactNode; children }`.
  - The `Dialog` size `xl` is 920px.

- [ ] **Step 1: Write a failing test.** A `FormTextarea` with `maxLength={255} showCount` and value "abc" shows "3 / 255".
- [ ] **Step 2:** Run it and confirm it fails.
- [ ] **Step 3: Implement** the §5 rows for each file.
  - Inputs: `h-10 rounded-md bg-sunken border-border-strong`, focus `border-accent ring-[3px] ring-ring`, error `border-hp bg-hp-soft`.
  - Dialog: `bg-raised rounded-xl shadow-e3 shadow-highlight border border-border dark:border-border-strong`. The one allowed `dark:` (a border swap) gets the comment `/* token: dialog edge */`; the Task 24 guard whitelists it.
  - Backdrop: `bg-[var(--scrim)] backdrop-blur-[4px]`. Dialog entry is scale .98→1 over `--dur-base`.
  - Accordion: rows inside a `Card`, `border-b border-line`, open row `bg-sunken`.
  - Toaster: `bg-raised border-border rounded-md shadow-e2`. Success toasts get the 4px strip via `classNames.success: 'before:...'` (a linear gradient griffin-500 → griffin-800 at 60% → `#F5B544`).
- [ ] **Step 4: Verify.** The test passes. In `pnpm dev`, open the delete-trigger dialog in dark mode: the dialog is visibly lighter than the page and has a top highlight.
- [ ] **Step 5: Commit.** `fix(web): make dialogs stand out from the page in dark mode`

---

## Phase 3: Chrome

### Task 8: Header, account menu, mobile menu

**Files:**

- Create: `src/hooks/useScrolled.ts`
- Modify: `src/components/{Header,Navigation,UserMenu,ThemeSwitcher,MobileMenu}.tsx`
- Test: `src/hooks/useScrolled.test.ts`, `src/components/UserMenu.test.tsx`

**Interfaces:**

- Consumes: `Shell`, `Menu`/`MenuItem`, `ButtonIcon`, `Button`.
- Produces: `useScrolled(threshold = 8): boolean`.

- [ ] **Step 1: Write failing tests.**
  - `useScrolled` returns false at `scrollY=0` and true after `window.scrollY = 9` plus a dispatched `scroll` event.
  - `UserMenu` (session mocked as authenticated) has a button named "Account menu". Clicking it shows the menu items "Profile", "Habitica settings", "History" and "Sign out".
- [ ] **Step 2:** Run them and confirm they fail.
- [ ] **Step 3: Implement §6.1.**
  - Nav links: Docs, Recipes (`/docs/coding-habits`), Roadmap, Sponsors, FAQ. Active link: `text-text font-semibold shadow-[inset_0_-2px_0_var(--accent-text)]` at full header height.
  - Signed out: "Sign in" (secondary) and "Install app" (primary, `/installation`).
  - The header border is `border-transparent` until `useScrolled()`.
  - Mobile menu per §6.1, with rows at least 44px tall.
- [ ] **Step 4: Verify.** The tests pass. Manually check signed in and out at 390px and 1280px: the logo has no hover effect, and the header content lines up with the footer and page edges.
- [ ] **Step 5: Commit.** `feat(web): redesign the header with an account menu`

### Task 9: Footer

**Files:**

- Modify: `src/components/Footer.tsx`, `src/components/FooterLink.tsx`

- [ ] **Step 1: Implement §6.2.** `bg-sunken`, `Shell`, 12-column grid (5 / 2 / 3 / 2). Product column: Install app, Dashboard, Recipes, Roadmap, Sponsors. Resources: Documentation, Supported GitHub events, Habitica API token, Contributing, FAQ, GitHub repo. Legal: Imprint, Privacy policy, Terms.
  - The version chip links to `githubRepositoryUrl('/releases/tag/web-v' + version)`.
  - The social icons are `ButtonIcon`-styled links with tooltips: "GitHub", "X", "Website".
- [ ] **Step 2: Verify** in both themes at 390px and 1280px; the columns stack on mobile.
- [ ] **Step 3: Commit.** `feat(web): refresh the footer`

---

## Phase 4: Content and marketing

### Task 10: `describeTrigger` and `describeRepositories`

**Files:**

- Create: `src/utils/describeTrigger.ts`
- Test: `src/utils/describeTrigger.test.ts`

**Interfaces:**

- Produces:

  ```ts
  type TriggerSentencePart =
    | { kind: 'text'; text: string }
    | { kind: 'event'; text: string }
    | { kind: 'value'; text: string; tone?: 'ok' | 'hp' }
    | { kind: 'difficulty'; label: string; stars: number }
    | { kind: 'attribute'; attribute: 'str' | 'int' | 'con' | 'per' }
    | { kind: 'placeholder'; text: string };
  describeRepositories(selectedNames: string[], totalConnected: number): string;
  describeTrigger(values: Partial<TriggerSchema>, ctx: { repoNames: string[]; totalRepos: number }): TriggerSentencePart[];
  ```

- [ ] **Step 1: Write failing tests.**
  - `describeRepositories(['octogriffin'], 3)` returns `'octogriffin'`, `(['a','b'], 3)` returns `'a and 1 more'`, `(['a','b','c'], 3)` returns `'all 3 repositories'`, and `([], 3)` returns `''`.
  - Full values (`pull_request.opened`, repos `['octogriffin','bebic.dev']` of 3, title "Opened a pull request", priority 1, `str`, up, weekly) join to the text "When pull_request.opened happens in octogriffin and 1 more, score “Opened a pull request” as an Easy STR habit and reward you. The counter resets weekly."
  - `scoreDirection: 'down'` yields a `value` part "take health" with `tone: 'hp'`.
  - Empty values yield `placeholder` parts "an event", "your repositories" and "a habit".
  - Review Focus 3: the event `'some_removed.event'` still renders as an `event` part with that raw text.
- [ ] **Step 2:** Run them and confirm they fail.
- [ ] **Step 3: Implement.** Parts in the order: When, event, "happens in", repos, ", score", “title”, "as a(n)", difficulty, attribute, "habit and", direction, ". The counter resets", frequency, ".". Use the article "an" before "Easy"; otherwise "a".
- [ ] **Step 4:** Run the tests and confirm they pass.
- [ ] **Step 5: Commit.** `refactor(web): describe triggers as plain sentences`

### Task 11: Recipes config, TriggerSentence and RecipeCard

**Files:**

- Create: `src/config/recipes.ts`, `src/components/TriggerSentence.tsx`, `src/components/recipes/RecipeCard.tsx`, `src/utils/recipes.ts`
- Modify: `src/app/docs/coding-habits/page.tsx`
- Test: `src/utils/recipes.test.ts`, `src/config/recipes.test.ts`

**Interfaces:**

- Consumes: `describeTrigger`, `Chip`, `DifficultyLabel`, `AttributeChip`, `EventId`.
- Produces:
  - `type Recipe = { slug: string; title: string; summary: string; successHint: string; icon: IconSvgElement; preset: { event: string; taskTitle: string; taskPriority: number; taskAttribute: 'str'|'int'|'con'|'per'; taskFrequency: 'daily'|'weekly'|'monthly'; scoreDirection: 'up'|'down'; taskNote?: string } }` and `recipes: Recipe[]`.
  - `getRecipe(slug: string | null | undefined): Recipe | undefined`.
  - `isRecipeInDashboard(recipe: Recipe, triggers: Pick<TriggersModel,'event'|'taskTitle'>[]): boolean`.
  - `recipeToTriggerValues(recipe: Recipe, repositoryUuids: string[]): TriggerSchema`, which preselects only when `repositoryUuids.length === 1`.
  - `TriggerSentence: FC<{ parts: TriggerSentencePart[]; size?: 'sm'|'md'|'lg' }>`.
  - `RecipeCard: FC<{ recipe: Recipe; layout?: 'card'|'row' }>`.

- [ ] **Step 1: Write failing tests.**
  - The config has the five existing recipes with slugs `code-every-day`, `ship-pull-requests`, `review-code`, `close-issues` and `ship-a-release`, copying events, titles, difficulties, attributes and frequencies from the current page.
  - `successHint` values: "Push a commit", "Open a pull request", "Review a pull request", "Close an issue" and "Publish a release". Every slug is unique, and every `preset.event` passes `isRewardableWebhook`.
  - `getRecipe('nope')` and `getRecipe(null)` return undefined.
  - `isRecipeInDashboard` is true only when both event and title match.
  - `recipeToTriggerValues(r, ['u1'])` gives `repositories: ['u1']`, `(r, ['u1','u2'])` and `(r, [])` give `[]`, and the result has `taskAlias: ''`, `taskNote: ''` and `taskTags: ''`.
- [ ] **Step 2:** Run them and confirm they fail.
- [ ] **Step 3: Implement the config and helpers.**
- [ ] **Step 4: Implement `TriggerSentence` and `RecipeCard` (§6.7).**
  - The action uses `useSession`:
    - `authenticated` → link "Add to dashboard" to `/dashboard?recipe={slug}`;
    - `unauthenticated` → button "Sign in to add" calling `signIn('github', { callbackUrl: '/dashboard?recipe=' + slug })`;
    - already present → `Chip tone="ok"` "In your dashboard". It reads triggers from `useTriggersStore` and fetches once if the store is empty and the user is signed in.
  - While the session is `loading`, it shows a disabled "Add to dashboard".
- [ ] **Step 5:** Rebuild `/docs/coding-habits` from `recipes` with `RecipeCard` (the "Tips" section stays).
- [ ] **Step 6: Verify** with the tests and a manual check signed in and out.
- [ ] **Step 7: Commit.** `feat(web): add coding habit recipes to your dashboard in one click`

### Task 12: Homepage

**Files:**

- Modify: `src/app/page.tsx`
- Delete: `src/components/RewardRow.tsx`

- [ ] **Step 1: Implement §6.3, sections 1–5,** inside `Shell`. The hero uses `arcane rounded-2xl`, with `/octogriffin_white.png` at 7% opacity and `aria-hidden`.
  - The example pair is a `figure` with `aria-hidden="true"`, plus a visually hidden caption "Example: opening a pull request scores a habit".
  - The rules card renders `<TriggerSentence size="lg" parts={describeTrigger(recipes[2].preset, …)} />`.
  - The recipe grid shows the first three recipes. The roadmap teaser reads `getCurrentPhase()` from Task 13. **Do Task 13 before this task.**
  - Remove `TextAccent`, `Pill variant="shiny"` and `RewardRow` usage.
- [ ] **Step 2: Verify** in both themes at 390px and 1280px: no horizontal scroll, the H1 wraps cleanly, and the hero is the only grain on the page apart from the `mist` teaser.
- [ ] **Step 3: Commit.** `feat(web): redesign the homepage`

### Task 13: Roadmap config, page and JSON-LD

**Files:**

- Create: `src/config/roadmap.ts`, `src/components/roadmap/{QuestLine,NowPhase,PhaseCard,ShippedList}.tsx`
- Modify: `src/app/roadmap/page.tsx`, `src/json-ld/roadmap.ts`
- Delete: `src/components/roadmap/RoadmapPhase.tsx`, `RoadmapFeatureItem.tsx`
- Test: `src/config/roadmap.test.ts`, `src/json-ld/roadmap.test.ts`

**Interfaces:**

- Produces:
  - the types in spec §6.4, and `roadmap: RoadmapPhase[]` (ordered shipped → exploring);
  - `getCurrentPhase(): RoadmapPhase`.
  - `roadmapJsonLd` is built from `roadmap`: one `ListItem` per phase with the name `"{codename} ({status label})"` and the item titles joined into the description.

- [ ] **Step 1: Write failing tests.**
  - Exactly one phase has status `now`. Every `shipped` phase has a `shippedAt` of `YYYY-MM`. Codenames are unique. `getCurrentPhase().codename === 'Anti-Cheese'`.
  - The JSON-LD has `itemListElement.length === roadmap.length`, and its positions are 1…n.
- [ ] **Step 2:** Run them and confirm they fail.
- [ ] **Step 3: Fill the config** with the §6.4 table. Item copy is on the canvas Roadmap board. Leave `issue` undefined (spec §11).
- [ ] **Step 4: Implement the page per §6.4.** The QuestLine is an `<ol>` with `repeat(auto-fit,minmax(130px,1fr))`. "Vote on GitHub" renders only when `issue` is set.
- [ ] **Step 5: Verify** the tests, then check the page at 390px and 1280px in both themes.
- [ ] **Step 6: Commit.** `feat(web): refresh the roadmap with what's shipped and what's next`

### Task 14: FAQ

**Files:**

- Modify: `src/app/faq/page.tsx`

- [ ] **Step 1: Implement §6.8.** Keep the `setup`, `dataPrivacy`, `gameplay` and `troubleshooting` arrays and the JSON-LD.
  - Add `id`s `setup`, `privacy`, `gameplay` and `trouble` for the topic nav, with counts from the array lengths.
  - The anti-cheese answer links to `/roadmap` with a status card from `getCurrentPhase()`.
  - The closing panel has "Open an issue" (`githubRepositoryUrl('/issues/new')`) and "Email support" (`mailto:${supportEmail()}`).
- [ ] **Step 2: Verify** in both themes at 390px; the nav stacks above the content.
- [ ] **Step 3: Commit.** `feat(web): make the FAQ easier to scan`

### Task 15: Legal pages

**Files:**

- Modify: `src/components/LegalPage.tsx`, `src/app/{privacy-policy,terms-and-conditions,imprint}/page.tsx`
- Test: `src/components/LegalPage.test.tsx`

**Interfaces:**

- Produces: `LegalPage: FC<{ title: string; updated: string /* ISO date */; sections?: { id: string; number: string; label: string; level?: 1|2 }[]; children: ReactNode }>`.

- [ ] **Step 1: Write a failing test.**
  - With two sections, the page renders a `nav` named "On this page" with links to `#intro` and `#controller`, and a `nav` named "Legal" whose current link (`aria-current="page"`) matches the pathname.
  - `<time dateTime="2026-10-22">` renders "22 October 2026".
- [ ] **Step 2:** Run it and confirm it fails.
- [ ] **Step 3: Implement §6.9.** Add `id`s to the existing headings, and pass `sections` (privacy: 1–6 with 5.1–5.4 at level 2). The legal text stays unchanged. Convert `LAST_UPDATED` to ISO.
- [ ] **Step 4: Verify** the test and all three pages in both themes.
- [ ] **Step 5: Commit.** `feat(web): add a table of contents to the legal pages`

### Task 16: Docs

**Files:**

- Modify: `src/app/docs/layout.tsx`, `src/components/docs/{DocsCard,DocsSidebar,DocsStep,DocsResourceLink,DocsFeedback}.tsx`, `src/app/docs/page.tsx`, `src/app/globals.css` (`.top-docs-sidebar`)

- [ ] **Step 1: Implement §6.10.** Remove the `DocsCardColor` prop and its call sites. The article column is `max-w-measure`. Sidebar links match the FAQ topic nav. `.top-docs-sidebar` becomes `top: 88px`.
- [ ] **Step 2: Verify** that every `/docs/*` page renders in both themes and code blocks (shiki) still switch theme.
- [ ] **Step 3: Commit.** `feat(web): restyle the documentation`

---

## Phase 5: Dashboard

### Task 17: Dashboard layout and tabs

**Files:**

- Modify: `src/app/dashboard/layout.tsx`, `src/components/dashboard/MainPanel.tsx`, `src/app/dashboard/components/{TabItem,TabList}.tsx`
- Create: `src/components/dashboard/DashboardSummary.tsx`

**Interfaces:**

- Consumes: `Shell`, `SegmentedControl` styling.
- Produces: `TabItem` gains `count?: number`.

- [ ] **Step 1: Implement §6.5 (layout, MainPanel).**
  - `DashboardSummary` reads `useTriggersStore(meta.total)` and `useRepositories().length`, renders "{n} triggers across {m} repositories" (singular forms when 1), and renders nothing while loading.
  - `IsConnected` is removed from the layout and its chip is reused in Task 18.
  - Tabs are a segmented `TabList`; Triggers shows `count={meta.total}`.
- [ ] **Step 2: Verify** that switching tabs keeps the URL routes (`/dashboard`, `/dashboard/history`, `/dashboard/settings`) and that the aside stacks below 1000px.
- [ ] **Step 3: Commit.** `feat(web): reorganise the dashboard layout`

### Task 18: Character sheet and repositories

**Files:**

- Modify: `src/components/dashboard/HabiticaStatsCard.tsx`, `src/components/dashboard/RepositoryListCard.tsx`, `src/components/dashboard/IsConnected.tsx`
- Create: `src/utils/stats.ts`
- Test: `src/utils/stats.test.ts`

**Interfaces:**

- Produces:
  - `barPercent(value: number, max: number): number`, clamped to 0–100, and 0 when `max <= 0` or either value isn't finite.
  - `countTriggersByRepository(triggers: TriggerWithRepos[]): Map<string, number>`, keyed by repository uuid.

- [ ] **Step 1: Write failing tests.**
  - `barPercent(42, 50) === 84`, `barPercent(5, 0) === 0`, `barPercent(-3, 10) === 0`, `barPercent(70, 50) === 100`, and `barPercent(NaN, 10) === 0` (Review Focus 4).
  - `countTriggersByRepository` counts a trigger once per repository it lists.
- [ ] **Step 2:** Run them and confirm they fail.
- [ ] **Step 3: Implement §6.5 (character sheet, repositories).**
  - Bars for health, experience and mana use `barPercent` with `hp`, `xp` and `mp` colours. Use "Experience" rather than XP in the label.
  - The class name is capitalised, e.g. `warrior` → "Warrior". Gold uses `Math.floor(gp).toLocaleString()`.
  - The not-connected state is a `mist` card linking to `/dashboard/settings`.
  - Repository rows show "{n} triggers", or nothing when 0.
- [ ] **Step 4: Verify** the tests and the card's loading, connected and not-connected states.
- [ ] **Step 5: Commit.** `feat(web): show your Habitica character sheet on the dashboard`

### Task 19: History tab

**Files:**

- Modify: `src/components/dashboard/WebhookLogsList.tsx`, `src/components/dashboard/WebhookLogsListItem.tsx`
- Create: `src/utils/groupLogsByDay.ts`
- Test: `src/utils/groupLogsByDay.test.ts`

**Interfaces:**

- Produces: `groupLogsByDay<T extends { createdAt: Date | string }>(logs: T[], now: Date, locale?: string): { label: string; logs: T[] }[]`, with labels "Today", "Yesterday", `"23 Oct"` for the current year and `"23 Oct 2025"` for older years.

- [ ] **Step 1: Write failing tests.** With `now = 2026-10-23T09:00` local time:
  - logs at `2026-10-23T00:05`, `2026-10-22T23:55` and `2025-12-31T12:00` yield the groups Today, Yesterday and "31 Dec 2025", with input order kept inside each group;
  - empty input returns `[]`.
- [ ] **Step 2:** Run them and confirm they fail.
- [ ] **Step 3: Implement §6.5 (History).**
  - The event label comes from the existing `getGroupedGithubEvents()` lookup, falling back to the raw event.
  - The delivery UUID is a button that copies to the clipboard, with the tooltip "Copy delivery ID" and a toast "Delivery ID copied".
  - Time is `HH:mm` using `Timestamp`.
  - No outcome column and no filters (§8).
- [ ] **Step 4: Verify** the tests and the History tab with and without logs (the empty state is `mist`).
- [ ] **Step 5: Commit.** `feat(web): group webhook history by day`

### Task 20: Settings tab

**Files:**

- Modify: `src/components/dashboard/HabiticaUserForm.tsx`, `src/components/ui/FormInput.tsx`

- [ ] **Step 1: Implement §6.5 (Settings).**
  - The card header is "Habitica connection" with a chip from `useHabiticaStore().isHabiticaConnected`.
  - The User ID input gets the `font-mono` class, and the password toggle is a `ButtonIcon` labelled "Show token" / "Hide token".
  - Help text: "Encrypted before it's stored. It never comes back to your browser." The unreadable-token description stays.
  - Footer: the link "Where do I find these?" to `/docs/habitica-api-token`, and a submit button labelled "Save connection".
  - Toast: "Habitica connection saved".
- [ ] **Step 2: Verify** saving with a new token, saving with an empty token (keeps the saved one) and the error path.
- [ ] **Step 3: Commit.** `feat(web): clearer Habitica connection settings`

### Task 21: Triggers table

**Files:**

- Create: `src/components/dashboard/TriggersTable.tsx`, `src/components/dashboard/TriggerRow.tsx`, `src/utils/filterTriggers.ts`
- Modify: `src/components/dashboard/TriggersList.tsx`
- Delete: `src/components/dashboard/TriggersListItem.tsx`
- Test: `src/utils/filterTriggers.test.ts`

**Interfaces:**

- Consumes: `getDifficulty`, `DifficultyLabel`, `AttributeChip`, `EventId`, `Menu`, `describeRepositories`.
- Produces: `filterTriggers<T extends { taskTitle: string; event: string }>(triggers: T[], query: string): T[]`, a case-insensitive substring match on title or event (trimmed; an empty query returns everything).

- [ ] **Step 1: Write failing tests.** `filterTriggers(rows, ' PULL ')` matches the event `pull_request.opened` and the title "Opened a pull request", and `''` returns all rows.
- [ ] **Step 2:** Run them and confirm they fail.
- [ ] **Step 3: Implement §6.5 (Triggers).**
  - Columns as specified. The repositories cell is `describeRepositories(names, total)` with a tooltip listing the full names.
  - The row ⋯ `Menu` has "Edit trigger" and "Delete trigger" (danger).
  - The filter is client-side over the current page.
  - The empty state shows `mist` with three `RecipeCard layout="row"` entries and "Create trigger".
  - The `New` chip shows for uuids in a new store field `recentlyCreated: string[]`, set by `createTrigger`.
- [ ] **Step 4: Verify** the tests, toggling, editing, deleting, pagination, and horizontal scroll at 390px.
- [ ] **Step 5: Commit.** `feat(web): show triggers as a compact table`

---

## Phase 6: Trigger dialog and recipes

### Task 22: Redesigned trigger dialog and `?recipe=` handling

**Files:**

- Modify: `src/components/dashboard/TriggerModal.tsx`, `src/app/dashboard/@tabs/page.tsx`, `src/store/useTriggersStore.ts`
- Create: `src/components/dashboard/HabitPreview.tsx`, `src/hooks/useRecipeParam.ts`
- Test: `src/hooks/useRecipeParam.test.tsx`, `src/components/dashboard/TriggerModal.test.tsx`

**Interfaces:**

- Consumes: `describeTrigger`, `TriggerSentence`, `FormSegmentedControl`, `ChoiceCardGroup`, `DialogHeader`/`DialogBody`/`DialogFooter`, `getRecipe`, `recipeToTriggerValues`, `recipes`.
- Produces:
  - `TriggerModal` props gain `recipe?: Recipe`.
  - `useRecipeParam(): { recipe: Recipe | undefined; clear: () => void }`. It reads `useSearchParams().get('recipe')` and `clear()` calls `router.replace('/dashboard')`.

- [ ] **Step 1: Write failing tests.**
  - `useRecipeParam` with `?recipe=ship-pull-requests` returns that recipe. With `?recipe=../../etc` (Review Focus 1) it returns undefined and has called `router.replace('/dashboard')`.
  - `TriggerModal` with a recipe and **zero** repositories (Review Focus 2) has the title "Add “Ship pull requests”", shows the link "Install the GitHub App on a repository first" (→ `githubAppUrl()`), and the "Add trigger" button is disabled.
  - With a recipe and one repository, the repository chip is preselected and "Add trigger" is enabled.
  - Without a recipe, changing the difficulty segment to "Medium" updates the sentence (`aria-live` region) to contain "Medium".
- [ ] **Step 2:** Run them and confirm they fail.
- [ ] **Step 3: Implement §6.6.**
  - Fields bind to the same form names: `taskPriority` (values `'0.1'|'1'|'1.5'|'2'`), `taskAttribute`, `scoreDirection` and `taskFrequency`.
  - The "Start from a recipe" `Menu` calls `form.setValues({...form.getState().values, ...recipeToTriggerValues(r, current repositories)})` and bumps `resetCount` so the comboboxes remount.
  - In recipe mode (§6.7), title, difficulty and attribute sit inside a disclosure labelled "Change title, difficulty or attribute", and the repository combobox gets `autoFocus` when there's more than one repository.
  - `HabitPreview` is the approximate habit card with the caption "Approximation. Habitica draws the real card."
- [ ] **Step 4:** In the triggers page, wrap the consumer in `<Suspense>`. When `useRecipeParam().recipe` is set, open the modal with it and call `clear()`.
  - Success toast: "Trigger added", "{verb phrase} in {first repo name} to score it.", with the verb phrase from `recipe.successHint` (Task 11). Triggers created without a recipe keep "Trigger created".
- [ ] **Step 5: Verify.** Run the tests. Manually:
  - create, edit, and create from each recipe;
  - follow the signed-out recipe → sign in → dialog flow;
  - in dark mode, confirm the dialog is distinct from the page;
  - below 760px, confirm the preview stacks under the form.
- [ ] **Step 6: Commit.** `feat(web): redesign the trigger dialog with a live summary`

---

## Phase 7: Clean-up

### Task 23: Remove dead components

**Files:**

- Delete: `src/components/ui/{TextAccent,Badge,Pill,DismissableBadge}.tsx` and any other component no longer imported (check with `pnpm knip` from the repo root).

- [ ] **Step 1:** Run `pnpm knip` and delete the unused files and exports it reports that this plan made unused.
- [ ] **Step 2: Verify** with `pnpm knip`, `pnpm lint`, `tsc` and `pnpm test`.
- [ ] **Step 3: Commit.** `refactor(web): remove components replaced by the new design`

### Task 24: Remove the bridge and guard the tokens

**Files:**

- Modify: `src/app/globals.css`, `apps/web/package.json`, `.github/workflows/*` (wherever lint runs)
- Create: `apps/web/scripts/lint-tokens.mjs`

**Interfaces:**

- Produces: the `pnpm --filter @octogriffin/web lint:tokens` script.

- [ ] **Step 1:** Write `lint-tokens.mjs`. It scans `src/**/*.tsx` and exits 1 with `file:line` for every match of `/\b(?:slate|violet|rose|indigo|sky|emerald|amber|red|blue)-\d{2,3}\b/` or `/\bdark:(?:bg|text|border|ring|shadow|from|via|to)-/`. It skips lines containing `/* token: dialog edge */`.
- [ ] **Step 2:** Run it and confirm it reports nothing; fix any leftovers in their owning component.
- [ ] **Step 3:** Delete the `BRIDGE` block from `globals.css`. Run `pnpm dev` and check both themes on every route listed in spec §9 for visual regressions.
- [ ] **Step 4:** Add `lint:tokens` to the web package's `lint` script so CI runs it.
- [ ] **Step 5: Commit.** `refactor(web): remove the colour bridge and enforce design tokens`
