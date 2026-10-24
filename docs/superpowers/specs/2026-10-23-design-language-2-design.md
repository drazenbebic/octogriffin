# Design language 2.0 ("Crest & Grain")

- **Status:** approved direction, spec awaiting review
- **Date:** 2026-10-23
- **Scope:** `apps/web` only
- **Mockups:** [Octogriffin Redesign canvas](https://claude.ai/artifact/VPqJuRXrTDhmGHchQ5rNmM) (private to the owner)

## 1. Why

The current UI works, but it has drifted:

- **The product purple isn't the brand purple.** The logo is `#432879`. The UI uses Tailwind `violet-600` (`#7c3aed`): same hue, much brighter and more saturated. The logo sits in a `violet-600` tile in the header and looks pasted on.
- **Six container widths.** Header and footer use `max-w-5xl`, the hero `3xl`, "How it works" `6xl`, the roadmap `4xl`, dashboard and docs `7xl`. Nothing aligns with the header's left edge.
- **Dark-mode dialogs disappear.** `Dialog` is `bg-slate-950` on a `bg-slate-950` page, with shadows that don't show on black.
- **Colour as decoration.** Blue, violet and emerald on the three steps, green/amber/red difficulty badges, a violet-to-rose gradient on the hero headline.
- **Radius and motion have no rules.** `rounded-3xl` cards next to `rounded-lg` buttons and `rounded-xl` rows. The logo scales on hover, buttons and cards lift.
- **No tooltips.** Icon-only buttons rely on native `title` attributes (UserMenu, TriggersListItem, RepositoryListCard, WebhookLogsListItem).
- **Every class is written twice.** 738 `slate-*` and 379 `violet-*` utilities across 79 files, mostly as `x dark:y` pairs.

## 2. Goals

1. Every brand colour derives from the logo purple. The logo stays exactly as it is.
2. One semantic token layer. Components say `bg-surface`, not `bg-white dark:bg-slate-900`.
3. One page shell. Every route shares the header's left and right edges.
4. Dark mode with real elevation: dialogs and menus are visibly above the page.
5. Ariakit tooltips on every icon-only control and on Habitica jargon (STR/INT/CON/PER, difficulty).
6. Recipes become actions: "Add to dashboard" opens a pre-filled trigger dialog.
7. Redesigned header, footer, homepage, roadmap, dashboard (Triggers, History, Settings), trigger dialog, recipes, FAQ and legal pages, as mocked on the canvas.

### Success criteria

- No `slate-*`, `violet-*` or `dark:` colour utilities remain in `src/` outside `globals.css` (checked by a grep in CI, see §9).
- Every `ButtonIcon` without visible text has a tooltip; no `title=` attribute remains on interactive elements.
- Light and dark text contrast is at least 4.5:1 for body text and 3:1 for 24px+ text (values in §4 were checked).
- `/dashboard?recipe=ship-pull-requests` opens the trigger dialog pre-filled; signing in from a recipe returns to the same state.
- Existing tests pass, and the new pure functions have tests (§9).

## 3. Non-goals

- No logo or wordmark change.
- No backend changes. Features that need the backend are drawn on the canvas but are **out of scope** here (§8).
- No new component library. Ariakit, Tailwind v4, Hugeicons and sonner stay.
- No content rewrite beyond microcopy (sentence case, button labels). Legal text is not changed.

## 4. Tokens

All tokens live in `src/app/globals.css`. Raw scales are CSS variables. Semantic tokens point at them and are redefined under `.dark`. Tailwind v4 exposes them through `@theme inline`, so utilities switch with the theme automatically.

### 4.1 Griffin, the brand scale (hue ≈ 260°)

| Step | Hex       | Role                                          |
| ---- | --------- | --------------------------------------------- |
| 50   | `#F5F2FB` | page tint                                     |
| 100  | `#EBE4F7` | soft fill                                     |
| 200  | `#D6C9EF` | soft border                                   |
| 300  | `#B9A3E3` |                                               |
| 400  | `#9677D2` | dark-mode focus ring, links                   |
| 500  | `#7853BE` | dark-mode primary                             |
| 600  | `#6040A6` | light-mode primary (7.5:1 against white text) |
| 700  | `#4F3290` | light-mode primary hover                      |
| 800  | `#432879` | **the logo**                                  |
| 900  | `#2E1B55` | grain shadow                                  |
| 950  | `#1C1036` | grain deep                                    |

### 4.2 Ink, the neutrals (faintly tinted toward the brand hue)

`0 #FFFFFF`, `25 #FAF9FC`, `50 #F4F2F8`, `100 #ECE9F2`, `200 #E3DFEB`, `300 #C9C3D6`, `400 #9A93AB`, `500 #6F6882`, `600 #4A4459`, `800 #241F30`, `900 #19161F`, `950 #0D0B12`.

### 4.3 Semantic tokens

| Token                                      | Light                             | Dark                              | Use                                           |
| ------------------------------------------ | --------------------------------- | --------------------------------- | --------------------------------------------- |
| `--bg`                                     | `#FAF9FC`                         | `#0D0B12`                         | page                                          |
| `--surface`                                | `#FFFFFF`                         | `#14111B`                         | cards, tables                                 |
| `--sunken`                                 | `#F4F2F8`                         | `#100E16`                         | inputs, table headers, segmented track        |
| `--raised`                                 | `#FFFFFF`                         | `#1C1826`                         | dialogs, menus, popovers, selected segment    |
| `--fill`                                   | `#ECE9F2`                         | `#241F30`                         | hover, neutral chips                          |
| `--border`                                 | `#E3DFEB`                         | `#2A2536`                         | default hairline                              |
| `--line`                                   | `#ECE9F2`                         | `#221E2C`                         | row dividers                                  |
| `--border-strong`                          | `#C9C3D6`                         | `#3B3449`                         | inputs, secondary buttons, dialog edge (dark) |
| `--text`                                   | `#19161F`                         | `#EEEBF4`                         | primary text                                  |
| `--text-2`                                 | `#4A4459`                         | `#C2BBD1`                         | secondary text                                |
| `--muted`                                  | `#6F6882`                         | `#8E879D`                         | captions (≥ 5.2:1 on surface in both themes)  |
| `--faint`                                  | `#9A93AB`                         | `#5A5368`                         | placeholders, disabled                        |
| `--accent`                                 | griffin-600                       | griffin-500                       | primary buttons, switches                     |
| `--accent-hover`                           | griffin-700                       | `#8A66CF`                         |                                               |
| `--accent-text`                            | `#5A3B9E`                         | `#B49CEB`                         | links, active nav                             |
| `--accent-soft`                            | `#EFEAF8`                         | `#231C33`                         | icon tiles, selected rows                     |
| `--ring`                                   | `rgb(96 64 166 / .28)`            | `rgb(150 119 210 / .45)`          | focus ring                                    |
| `--scrim`                                  | `rgb(25 22 31 / .32)`             | `rgb(5 4 8 / .66)`                | dialog backdrop                               |
| `--tip-bg` / `--tip-text` / `--tip-border` | `#19161F` / `#F4F2F8` / `#19161F` | `#2A2438` / `#EEEBF4` / `#3B3449` | tooltips                                      |

### 4.4 Game colours (meaning, not decoration)

| Token | Light     | Dark      | Soft light | Soft dark | Use                              |
| ----- | --------- | --------- | ---------- | --------- | -------------------------------- |
| `hp`  | `#D6364A` | `#FF6B7A` | `#FBE9EC`  | `#2E1820` | Punish, errors, destructive, STR |
| `xp`  | `#A86700` | `#F5B544` | `#FBF1DE`  | `#2B2214` | XP bar, difficulty stars, CON    |
| `mp`  | `#2F6FD0` | `#6AA6FF` | `#E7F0FC`  | `#16213A` | mana bar, info, INT              |
| `gp`  | `#8A6A00` | `#E9C65A` | `#FBF4D9`  | `#2A2410` | gold                             |
| `ok`  | `#187A50` | `#4CC38A` | `#E3F3EA`  | `#14261E` | Reward, connected, shipped       |

PER uses `accent-text` / `accent-soft`. These colours replace Tailwind `red`, `rose`, `amber`, `emerald`, `blue`, `sky` and `indigo` everywhere.

### 4.5 Typography

Loaded with `next/font/google` in `app/layout.tsx` as CSS variables:

| Family              | Variable         | Weights              | Use                                             |
| ------------------- | ---------------- | -------------------- | ----------------------------------------------- |
| Bricolage Grotesque | `--font-display` | 500–800, `opsz` axis | headings 20px and up                            |
| Inter (kept)        | `--font-sans`    | 400–700              | body, UI, headings under 20px                   |
| JetBrains Mono      | `--font-mono`    | 400, 500             | event IDs, delivery IDs, aliases, versions only |

Scale (major third, 16px base). `Heading` maps levels to these by default:

| Token        | Spec                                              |
| ------------ | ------------------------------------------------- |
| `display-xl` | Bricolage 800, 64/1.0, clamp down to 40 on mobile |
| `display`    | Bricolage 800, 48/1.05                            |
| `h1`         | Bricolage 700, 36/1.1                             |
| `h2`         | Bricolage 700, 28/1.15                            |
| `h3`         | Bricolage 700, 20/1.3                             |
| `h4`         | Inter 600, 16/1.4                                 |
| `body`       | Inter 400, 16/1.6                                 |
| `small`      | Inter 400, 14/1.5                                 |
| `code`       | JetBrains 500, 13/1.4                             |

Display headings use `letter-spacing: -0.02em` and `text-wrap: balance`. Labels are sentence case; the uppercase, wide-tracked labels (trigger dialog sections, recipe `dt`s, roadmap status) are removed.

### 4.6 Radius

| Token          | px  | Use                                          |
| -------------- | --- | -------------------------------------------- |
| `--radius-sm`  | 6   | chips, badges, tooltips, kbd                 |
| `--radius-md`  | 10  | buttons, inputs, menu items, icon tiles      |
| `--radius-lg`  | 14  | cards, table containers, list rows           |
| `--radius-xl`  | 20  | dialogs, feature panels, character sheet     |
| `--radius-2xl` | 24  | hero and roadmap "Now" panel                 |
| `full`         |     | avatars, status dots, switches, status pills |

### 4.7 Elevation

| Level                       | Light                                   | Dark                                              |
| --------------------------- | --------------------------------------- | ------------------------------------------------- |
| `e1` (card)                 | `0 1px 2px rgb(25 22 31 / .06)`         | none, uses `--border`                             |
| `e2` (menu, popover, toast) | `0 10px 30px -10px rgb(46 27 85 / .25)` | `0 16px 40px -8px rgb(0 0 0 / .7)` + highlight    |
| `e3` (dialog)               | `0 30px 80px -20px rgb(46 27 85 / .40)` | `0 40px 100px -20px rgb(0 0 0 / .75)` + highlight |

The dark-mode highlight is `inset 0 1px 0 rgb(255 255 255 / .06)` on `--raised` surfaces, plus `--border-strong` edges on dialogs.

### 4.8 Motion

- `--dur-fast: 120ms` for colour and background only.
- `--dur-base: 200ms` for popover, tooltip and menu entry.
- `--ease-out: cubic-bezier(.2, .8, .2, 1)`. Dialogs go from `scale(.98)`, opacity 0 to 1.
- **Removed:** logo hover scale, `hover:-translate-y-*` on buttons and cards, `animate-breathe` and the glowing gradient text, the spinning conic "shiny" pill, the `animate-ping` dots (except the "in progress" roadmap dot, which is static).
- `prefers-reduced-motion: reduce` turns off all transforms.

### 4.9 Layout

- `--shell: 1200px`, horizontal padding 16px (below 640px), 24px (below 1024px), 32px. A `Shell` component replaces every `mx-auto max-w-* px-*` wrapper, header and footer included.
- 12-column grid with 24px gaps for page sections. Narrow sections span columns, they don't get their own container.
- `--measure: 68ch` caps prose: docs articles, legal pages, FAQ answers.

### 4.10 Grain (noise gradients)

Two utilities in `globals.css`:

- `arcane`: a stack of three radial gradients over a 155° linear gradient (griffin-600 → 800 → 900, plus a 22% warm `xp` glow top-right). An `::after` tiles `/noise.webp` (256×256 grayscale, about 4 KB, 180px tile) with `mix-blend-mode: overlay` at 32%, at `z-index: -1` inside an `isolation: isolate` parent. The same in both themes.
- `mist`: light lavender and parchment radials over `--surface`, with the noise at `multiply` 10%. Light theme only; in dark mode it falls back to `--surface`.

**Rule: grain means magic.** Only these may use it: home hero, dashboard character sheet, roadmap "Now" panel, the 4px reward strip on success toasts, the roadmap teaser on home (`mist`). Never on controls, tables, forms, dialogs or the header.

The noise is a static image, not an SVG `feTurbulence` data URI: it's cheaper to paint while scrolling. It goes in `public/noise.webp`.

## 5. Components

Under `src/components/ui/` unless noted. Props stay compatible where possible; a removal means every call site is migrated in the same PR.

| Component                                        | Change                                                                                                                                                                                                                                                                                                                                                                            |
| ------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Shell** (new)                                  | `<Shell as="section">` puts the §4.9 width and padding on any element.                                                                                                                                                                                                                                                                                                            |
| **Button**                                       | Variants `primary`, `secondary`, `ghost`, `danger`, `onGrain` (white with griffin-800 text, only on `arcane` surfaces). The `black` variant is removed; its call sites become `secondary` or `onGrain`. Sizes `sm` 32px, `md` 40px, `lg` 48px. Radius md. No lift: `active:translate-y-px` only. Focus: 2px `--bg` gap and a 2px `--accent` ring.                                 |
| **ButtonIcon**                                   | Requires a `label` prop. It renders the Tooltip and sets `aria-label` from it. Shapes reduce to `rounded` (md) and `circle`.                                                                                                                                                                                                                                                      |
| **Tooltip** (new)                                | Ariakit `TooltipProvider` / `TooltipAnchor` / `Tooltip`. `--tip-*` colours, 12px/500, radius sm, 6px/8px padding, arrow, `e2`. A 500ms show delay, and 0ms when moving from one tooltip to the next (Ariakit `skipTimeout`). Optional `shortcut` (renders a `Kbd`) and `title` + `description` for "rich" tips. Not shown on touch: essential info never lives only in a tooltip. |
| **Kbd** (new)                                    | Mono 11px, radius 4, 1px border.                                                                                                                                                                                                                                                                                                                                                  |
| **Menu** (new)                                   | Ariakit `Menu*` with `--raised` and `e2`. Items 13px with radius 8 and a `--fill` hover; a `danger` item variant.                                                                                                                                                                                                                                                                 |
| **SegmentedControl** (new)                       | Ariakit `RadioProvider` + `Radio`, rendered as a `--sunken` track with a `--raised` selected segment. Works inside forms via `FormRadio`. Used for difficulty, attribute, counter reset and dashboard tabs.                                                                                                                                                                       |
| **ChoiceCard** (new)                             | A large radio option (icon, title, description). Used for Reward/Punish.                                                                                                                                                                                                                                                                                                          |
| **Badge** + **Pill**                             | Merged into **Chip**: variants `neutral`, `accent`, `ok`, `hp`, `xp`, `mp`; shapes `square` (radius sm, default) and `pill` (status only); optional dot. `Pill`'s `shiny` variant is removed. `DismissableBadge` becomes `Chip` with `onDismiss`.                                                                                                                                 |
| **AttributeChip** (new)                          | Mono STR/INT/CON/PER chip with a rich tooltip explaining the attribute.                                                                                                                                                                                                                                                                                                           |
| **DifficultyLabel** (new)                        | "Easy ★" with stars in `xp`. Replaces the coloured difficulty badges.                                                                                                                                                                                                                                                                                                             |
| **EventId** (new)                                | A mono chip for `pull_request.opened`-style IDs.                                                                                                                                                                                                                                                                                                                                  |
| **FormInput / FormTextarea / Select / Combobox** | `--sunken` fill, `--border-strong` edge, radius md, height 40. Focus: `--accent` border with a 3px `--ring`. Error: `hp` border and `hp-soft` fill, with an icon and message in `FormFeedback`. Textarea gets an optional character counter.                                                                                                                                      |
| **Switch**                                       | 40×24, `--accent` when on, `--fill` with a `--border-strong` edge when off.                                                                                                                                                                                                                                                                                                       |
| **Card**                                         | Variants `surface` (default: `--surface`, `--border`, `e1`, radius lg), `sunken` and `outlined` (dashed, for "later" content). `isHoverable` lift removed.                                                                                                                                                                                                                        |
| **Dialog** + **DialogBackdrop**                  | `--raised`, `--border` (light) or `--border-strong` (dark), radius xl, `e3`, dark highlight. Backdrop `--scrim` with a 4px blur. Gets `DialogHeader`, `DialogBody`, `DialogFooter` slots (the footer is sticky, with a top border).                                                                                                                                               |
| **Accordion**                                    | Rows inside one `Card`, separated by `--line`, instead of separate rounded boxes. The open row gets a `--sunken` tint and a rotated chevron.                                                                                                                                                                                                                                      |
| **Tabs** (dashboard)                             | `TabList` rendered as a segmented control, with an optional count chip.                                                                                                                                                                                                                                                                                                           |
| **Toaster** (`Providers.tsx`)                    | `--raised` with `e2`. Success toasts get the 4px reward strip. Icon tile colours from §4.4.                                                                                                                                                                                                                                                                                       |
| **Heading / Content**                            | Use the type scale. `Heading` levels 1–3 use the display font. The `color="violet"` options become `accent`.                                                                                                                                                                                                                                                                      |
| **TextAccent**                                   | Removed.                                                                                                                                                                                                                                                                                                                                                                          |
| **Skeleton**                                     | `--fill`, plus a shimmer gradient in `--sunken` (disabled for reduced motion).                                                                                                                                                                                                                                                                                                    |
| **Avatar**                                       | Radius md.                                                                                                                                                                                                                                                                                                                                                                        |
| **Callout, Alert, Pagination, Code, CardImage**  | Restyled with tokens; their API is unchanged.                                                                                                                                                                                                                                                                                                                                     |

## 6. Pages and organisms

### 6.1 Header (`Header`, `Navigation`, `UserMenu`, `ThemeSwitcher`, `MobileMenu`)

- The logo is `/octogriffin_logo_square.png` at 32px with radius 8. No tile behind it, no hover effect. The wordmark is Bricolage 700 at 18px.
- Nav: Docs, **Recipes** (→ `/docs/coding-habits`), Roadmap, Sponsors, FAQ. The active link gets an inset 2px `--accent-text` bar on the header's bottom edge and `--text` colour.
- Right side: GitHub icon link (tooltip "Octogriffin on GitHub"), theme toggle (tooltip "Switch to light/dark mode"), a divider, then:
  - Signed out: "Sign in" (secondary, GitHub icon) and **Install app** (primary, → `/installation`).
  - Signed in: "Dashboard" (ghost, filled when active) and an avatar button that opens a `Menu` with a name and username header, Profile, Habitica settings (`/dashboard/settings`), History (`/dashboard/history`), and Sign out (danger). The separate sign-out icon goes away.
- 64px, sticky, `--bg` at 82% with backdrop blur. The bottom border appears only after scrolling 8px (a small `useScrolled` hook).
- Mobile menu: full-width rows, display font at 22px with a description on the right, and Install and Sign in buttons at the bottom. The dot grid, blur blob and slide arrows are removed. Tap targets are at least 44px.

### 6.2 Footer

Same structure as today: brand block with the sponsor button, Product / Resources / Legal columns, and a bottom bar.

- `--sunken` background, inside the shell, on a 12-column grid (5 / 2 / 3 / 2).
- Column headings are 13px/600 Inter in sentence case.
- The version is a mono chip linking to the release.
- "Made in Vienna by Drazen Bebic", and the social icons get tooltips.

### 6.3 Homepage (`app/page.tsx`)

1. **Hero:** an `arcane` panel (radius 2xl) inside the shell, with the white griffin at 7% opacity bleeding off the bottom right.
   - Left: release pill (a mono `xp` version chip and "See what's new"), the H1 "Turn your GitHub commits into Habitica gold and XP" (display-xl, no gradient text), the existing description, and two buttons: **Install the GitHub App** (white on grain) and **Read the docs** (outline).
   - Right: an illustrative "event → reward" pair. A dark glass card shows `pull_request.opened`, then an arrow, then a white card "Habit scored: Opened a pull request" with + XP, + Gold, Easy ★ and STR chips. It's decorative and hidden from assistive tech, labelled as an example.
2. **Set up once, then just code:** three steps in an `<ol>`, left-aligned, with a 2px accent tick on a top rule. No coloured icon tiles.
3. **You write the rules:** a checklist on the left, and on the right a card with the trigger sentence (§6.6) rendered with chips.
4. **Start from a recipe:** three recipe cards from the recipes config, each with "Add to dashboard" (§6.7), plus an "All recipes" link.
5. **Roadmap teaser:** a `mist` panel showing the current phase and its first three items from the roadmap config.

`RewardRow` and the "We are just getting started" card are removed.

### 6.4 Roadmap (`app/roadmap/page.tsx`)

The content moves to `src/config/roadmap.ts`:

```ts
type RoadmapStatus = 'shipped' | 'now' | 'next' | 'later' | 'exploring';
type RoadmapItem = {
  title: string;
  description: string;
  issue?: number;
  status?: 'in-progress' | 'planned';
};
type RoadmapPhase = {
  codename: string;
  status: RoadmapStatus;
  summary: string;
  shippedAt?: string;
  release?: string;
  items: RoadmapItem[];
};
```

Layout, top to bottom:

- Header with a legend.
- A quest line: one node per phase, filled up to the current one.
- The "Now" phase in an `arcane` panel. Each item has a status chip and "Vote on GitHub" (→ `/issues/{issue}`, hidden when there's no issue).
- "Next" phases as cards.
- "Later" and "Exploring" as dashed outlined cards.
- "Shipped" as a dated list with release links.
- A "Request a feature" panel.

The roadmap JSON-LD (`json-ld/roadmap.ts`) is generated from the same config.

Initial content (from the canvas; issue numbers to be filled in):

| Phase         | Status           | Items                                                                                   |
| ------------- | ---------------- | --------------------------------------------------------------------------------------- |
| Field Guide   | shipped Oct 2026 | recipes, event catalogue, token guide, App permissions guide, stricter encryption       |
| Dark mode     | shipped Mar 2026 | full dark theme                                                                         |
| Control Freak | shipped Jan 2026 | custom triggers, repository scope                                                       |
| Foundations   | shipped Jan 2026 | GitHub App, encrypted tokens, webhook history, dashboard                                |
| Anti-Cheese   | now              | per-trigger cooldowns (in progress), daily XP caps, ignore bot accounts, spam detection |
| Ledger        | next             | reward ledger, test a trigger, token health alerts, trigger stats                       |
| Fine Print    | next             | branch filters, label and size filters, only my activity, import/export                 |
| Quest Log     | later            | To-Dos from issues, Dailies, coding streaks, critical hits                              |
| Beyond GitHub | exploring        | GitLab and Gitea, public API, party quests, starter packs                               |

### 6.5 Dashboard (`app/dashboard/**`, `components/dashboard/**`)

- `layout.tsx`: shell, then an H1 "Dashboard" with the summary "{n} triggers across {m} repositories" (from the existing stores). Below it, a flex row: main column (`flex: 999 1 640px`) and aside (`flex: 1 1 320px`), which stack on mobile. `IsConnected` moves into the character sheet.
- **MainPanel:** the segmented `TabList` (Triggers with a count, History, Settings). The toolbar to its right changes per tab. No `Card` wraps the whole panel any more.
- **Triggers tab (`TriggersList` → `TriggersTable`):**
  - A `surface` card with a `sunken` header row. Columns: Trigger (event icon tile, title, `EventId`), Repositories ("All 3 repos" / name / "2 repos", with a tooltip listing the names), Difficulty (`DifficultyLabel`), Attr. (`AttributeChip`), Effect (Reward/Punish chip), Active (`Switch`, plus a ⋯ `Menu` with Edit and Delete).
  - Paused rows sit at 55% opacity without a strikethrough.
  - The table scrolls horizontally below 720px.
  - The toolbar has a filter input (client-side, by title or event), a refresh `ButtonIcon`, and **New trigger**.
  - The empty state uses `mist` and shows three recipe buttons alongside "Create trigger".
- **History tab (`WebhookLogsList`):**
  - Rows grouped by day ("Today", "Yesterday", then dates) with a `sunken` day header.
  - Each row: event icon tile, readable event label, `EventId`, truncated delivery UUID (tooltip "Copy delivery ID", click copies), and time.
  - The outcome column and the All/Scored/Not scored filter are **out of scope** (they need Ledger data, §8).
  - Pagination is unchanged.
- **Settings tab (`HabiticaUserForm`):**
  - A "Habitica connection" card: header with a Connected/Not connected chip, a two-column form (User ID in mono, an API token password field with a show/hide `ButtonIcon`), and help text ("Encrypted before it's stored. It never comes back to your browser.").
  - A footer bar with a "Where do I find these?" link (→ `/docs/habitica-api-token`) and **Save connection**.
  - "Test connection" and "Disconnect" are out of scope (§8).
- **Character sheet (`HabiticaStatsCard`):**
  - An `arcane` card with the class name, "Level {lvl}", and a "Linked" chip (from `IsConnected`).
  - Bars: health (`hp`), experience (`xp`), mana (`mp`), using `hp/maxHealth`, `exp/toNextLevel`, `mp/maxMP`.
  - A stat row: STR, INT, CON, PER and GOLD (`gp`, rounded). All of these fields already exist in `UserStats`.
  - The loading skeleton takes the same shape. The "not connected" state is a `mist` card with a link to Settings.
- **Repositories (`RepositoryListCard`):** a compact list with a lock or globe icon (aria-label), the name, and a trigger count per repo (from triggers already in the store). A "Manage on GitHub" link in the header replaces the dashed "+ Manage" box. The fold above 3 items stays.

### 6.6 Trigger dialog (`TriggerModal`)

- `Dialog` at 920px with header, body and footer slots.
  - Header: an icon tile, "New trigger" / "Edit trigger", a **Start from a recipe** menu (lists recipes; picking one fills the form), and close (tooltip "Close").
- **Trigger sentence:** a `sunken` strip under the header, `aria-live="polite"`, rendered by a pure function:

  ```ts
  describeTrigger(values: Partial<TriggerSchema>, ctx: { eventLabel?: string; repoNames: string[] }): TriggerSentencePart[]
  ```

  It returns text and highlighted parts, so the same sentence shows in the dialog, the homepage and recipe cards. Missing values render as muted placeholders ("an event", "your repositories").

- Body, two columns (stacked under 760px):
  - **Form (left):**
    - Fieldsets with display-font legends: "When this happens on GitHub" (event combobox with the `EventId` under it, repositories multi-combobox), "Score this habit in Habitica" (title, notes with a counter), and "How it counts" (Effect as two `ChoiceCard`s, Difficulty segmented with stars, Attribute segmented with `AttributeChip` tooltips, Counter resets segmented).
    - "Advanced: task alias" stays a disclosure.
  - **Preview (right, 280px):** "How it looks in Habitica", an approximate habit card (+ and − sides, with − dimmed for Reward triggers), labelled as an approximation.
- Footer: "* Required" on the left; Cancel and Create trigger / Save changes on the right.
- No uppercase section labels and no numbered headings.
- The form store, schema and actions are unchanged. Only the inputs that render difficulty, attribute, direction and frequency change (Select → SegmentedControl/ChoiceCard, all `FormControl`-bound).

### 6.7 Recipes as actions

- `src/config/recipes.ts` becomes the single source:

  ```ts
  type Recipe = {
    slug: string;
    title: string;
    summary: string;
    icon: IconSvgElement;
    preset: Omit<TriggerSchema, 'repositories' | 'taskAlias' | 'taskTags'>;
  };
  ```

  `/docs/coding-habits`, the homepage section, the dialog's recipe menu and the dashboard empty state all read from it.

- **Recipe card:** icon tile, title, summary, the trigger sentence for the preset, and an action:
  - Signed in: **Add to dashboard**, a link to `/dashboard?recipe={slug}`.
  - Signed out: **Sign in to add**, which calls `signIn('github', { callbackUrl: '/dashboard?recipe={slug}' })`.
  - Already present: an "In your dashboard" chip instead. A trigger matches when `event` and `taskTitle` are equal (signed in only; the docs page stays static for crawlers).
- **Dashboard handling:** the triggers page reads `recipe` from `useSearchParams` (wrapped in a `Suspense` boundary, as Next.js requires), opens `TriggerModal` with the preset merged into the initial values, then `router.replace('/dashboard')`. An unknown slug is ignored.
  - With exactly one connected repository, it's pre-selected, so "Add trigger" is one click.
  - Otherwise the repository combobox is focused.
  - The dialog title is "Add “{recipe title}”". Title, difficulty and attribute sit behind "Change title, difficulty or attribute".
- Success toast: "Trigger added", "Open a pull request in {repo} to score it." The new row shows a "New" chip until the page reloads.

### 6.8 FAQ (`app/faq/page.tsx`)

- Left-aligned header in the shell with the existing H1 and description. The centred icon tile is removed.
- Two columns: a topic nav (Setup, Data privacy, Gameplay, Troubleshooting with counts; anchor links, not sticky) and the main column at max 780px.
- Each section has a display-font H2 and one `Card` holding the accordion rows (§5). The first question is open by default. Answer text is capped at `--measure`.
- The anti-cheese answer links to the roadmap "Now" phase with a small status card.
- The footer panel "Still stuck?" has **Open an issue** and **Email support**.
- The FAQ search shown on the canvas is **out of scope** for now (§8).

### 6.9 Legal pages (`LegalPage`, privacy, terms, imprint)

- `LegalPage` gets:
  - a segmented link group (Privacy policy · Terms · Imprint) above the H1;
  - "Last updated" as a `<time>`;
  - a two-column layout: an "On this page" table of contents built from a `sections` prop (numbers kept, since legal numbering is a real sequence), and prose at `--measure`.
- Body text 16/1.75 in `--text-2` with `--text` for `strong`. H2s get a mono section number.
- The "short version" summary box on the canvas is **not** added: legal copy is out of scope (§3). If wanted, it needs a separate copy review.

### 6.10 Docs (`app/docs/**`)

Not mocked separately. The docs get the same treatment as everything else:

- shell width;
- sidebar links styled like the FAQ topic nav;
- article prose at `--measure`;
- `DocsCard` with one icon tile style (`accent-soft`), no per-topic rainbow (`DocsCardColor` removed), and no hover lift;
- `.top-docs-sidebar` reworked to the 64px header.

## 7. Approaches considered

1. **Semantic tokens with `@theme inline` (chosen).** CSS variables switch under `.dark`, and components lose most `dark:` pairs. It's the most work up front, but it's the only option that fixes dark-mode elevation centrally and stops the class bloat.
2. **Recolour Tailwind's `violet` and `slate` in `@theme`.** Instantly shifts the whole site with zero class changes. Cheap, but it keeps the misleading names and every `dark:` pair, and it can't express raised versus page surfaces. **Used only as a temporary bridge in phase 1**, so the site looks coherent while components migrate. It's removed in the last phase.
3. **A component library (shadcn/Radix).** Rejected: Ariakit already covers dialogs, menus, tooltips and radios, and swapping libraries is out of proportion.

## 8. Out of scope (drawn on the canvas, needs its own work)

| Item                                                | Why                                                                                            |
| --------------------------------------------------- | ---------------------------------------------------------------------------------------------- |
| History outcome column and Scored/Not scored filter | Needs a reward ledger relating deliveries to triggers and Habitica responses (roadmap: Ledger) |
| "Test connection" in Settings                       | New server action                                                                              |
| "Disconnect Habitica"                               | New server action and data deletion semantics                                                  |
| FAQ search                                          | Small, but not requested; add later if wanted                                                  |
| Legal "short version" summary                       | Legal copy change                                                                              |
| Last-scored column, per-trigger stats               | Ledger                                                                                         |
| Roadmap issue numbers                               | Content for the maintainer to fill in                                                          |

## 9. Testing and verification

**Unit tests (Jest):**

- `describeTrigger` (all fields, missing fields, punish, one versus many repos);
- the recipe lookup and preset-to-form merge (`getRecipe`, `recipeToTriggerValues`);
- the day-grouping helper for History;
- `isRecipeInDashboard` (event + title match);
- roadmap config invariants (exactly one `now` phase, shipped phases have dates).

**Component tests:** `ButtonIcon` renders a tooltip and `aria-label` from `label`. `SegmentedControl` is keyboard-operable (arrow keys).

**CI guard:** a `pnpm --filter @octogriffin/web lint:tokens` script that fails on `slate-`, `violet-`, `rose-`, `indigo-`, `sky-` or `dark:(bg|text|border|ring|shadow)-` in `src/**/*.tsx`. It's enabled in the last phase.

**Manual check per phase, in both themes, at 390px and 1280px:** home, roadmap, FAQ, privacy, docs page, dashboard (three tabs, empty and populated), trigger dialog (create, edit, from recipe), mobile menu, keyboard focus on every control, reduced motion.

## 10. Delivery

One PR per phase, each releasable on its own. Commit subjects follow the project's release-please convention: `feat(web)` / `fix(web)` in plain English for user-visible changes, and `refactor(web)` for internals, kept separate.

1. **Tokens and fonts:** `globals.css` scales, semantic tokens, `@theme inline`, radius, shadows, motion, the `arcane` and `mist` utilities, `noise.webp`, `next/font` for the three families, and the temporary violet/slate bridge (§7.2).
2. **Atoms:** Shell, Button, ButtonIcon + Tooltip + Kbd, Menu, SegmentedControl, ChoiceCard, Chip family, form controls, Switch, Card, Dialog, Accordion, Toaster, Heading/Content; remove TextAccent and Pill.
3. **Chrome:** header, user menu, mobile menu, footer.
4. **Marketing pages:** homepage, roadmap (with config and JSON-LD), FAQ, legal pages, docs.
5. **Dashboard:** layout, tabs, triggers table, character sheet, repositories, History, Settings.
6. **Trigger dialog and recipes:** `describeTrigger`, `recipes.ts`, the redesigned modal, `?recipe=` handling, recipe cards everywhere.
7. **Clean-up:** remove the bridge, enable the `lint:tokens` guard, delete unused components (`RewardRow`, `TextAccent`, `Pill`, `DismissableBadge`, `RoadmapPhase` / `RoadmapFeatureItem` if replaced).

## 11. Open questions for the maintainer

- Roadmap issue numbers and the release tags for older shipped phases.
- Should the phase names (Ledger, Fine Print, Quest Log, Beyond GitHub) be kept as public codenames?
- "Recipes" in the main nav points at `/docs/coding-habits`. Should it get its own `/recipes` route later?
