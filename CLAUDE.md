# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## Project overview

Next.js 16 (App Router) dashboard for Vietnamese stock market (HOSE/HNX).
Backend: FastAPI on Railway — `https://vn-stock-api.railway.app`.

---

## Directory structure

```
src/
  app/                          # Next.js App Router pages
    layout.tsx
    page.tsx                    # redirect → /watchlist
    watchlist/page.tsx
    alerts/page.tsx
    heatmap/page.tsx
  components/
    <component-name>/           # kebab-case folder per component
      ComponentName.tsx         # PascalCase file = one exported component
      index.ts                  # barrel export — re-exports the component
  constants/
    index.ts                    # all project-wide constants
  hooks/
    useHookName.ts              # camelCase, prefix "use"
  lib/
    api.ts                      # fetch wrapper + URL builders
    utils.ts                    # pure helpers (cn, formatPrice, …)
  types/
    index.ts                    # all shared TypeScript types
```

Do **not** put source files in the project root. Everything goes under `src/`.

---

## Naming conventions

### Components
| What | Convention | Example |
|------|-----------|---------|
| File | PascalCase | `WatchlistTable.tsx` |
| Folder | kebab-case | `watchlist-table/` |
| Barrel | `index.ts` in every folder | `export { WatchlistTable } from "./WatchlistTable"` |

### Hooks
- File: camelCase, prefix `use` — `useWatchlist.ts`
- Function name must match file name — `export function useWatchlist()`

### Types & Interfaces
- Interface for object shapes: `PriceData`, `SignalData`, `WatchlistItem`
- Type for unions: `type Signal = "BUY" | "SELL" | "HOLD"`
- No `I` prefix — write `WatchlistItem`, not `IWatchlistItem`
- Props interface placed directly above the component, named `[ComponentName]Props`

### Constants
- `UPPER_SNAKE_CASE` — `REFRESH_INTERVAL`, `API_BASE_URL`
- All project-wide constants live in `src/constants/index.ts`
- Local constants inside a single file may be `UPPER_SNAKE_CASE` const at file scope

### Files
- No abbreviations — `watchlist`, not `wl`; `signal`, not `sig`; `component`, not `comp`
- One responsibility per file, max **150 lines**
- If a file grows beyond 150 lines, split sub-components or helpers into separate files

---

## TypeScript

- `tsconfig.json` must have `"strict": true` and `"noUncheckedIndexedAccess": true`
- No `any` — use proper generics (e.g. `fetcher<T>`) or `unknown` with narrowing
- Array indexed access returns `T | undefined` — always guard: `const item = arr[i]; if (!item) continue`
- Export types with `export type { Foo }` in barrel `index.ts`
- Use `as const` for readonly constant arrays and objects

---

## API & data fetching

```ts
// src/lib/api.ts
export async function fetcher<T>(url: string): Promise<T> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  return res.json() as Promise<T>;
}
```

- `useSWR<T>(url, fetcher, { refreshInterval: REFRESH_INTERVAL })` — always type the generic
- `REFRESH_INTERVAL = 30_000` and `CHART_REFRESH_INTERVAL = 60_000` from `src/constants`
- `API_BASE_URL` read from `process.env.NEXT_PUBLIC_API_URL ?? "https://vn-stock-api.railway.app"`
- Never hardcode the base URL in component files

---

## Tailwind CSS v4

This project uses **Tailwind CSS v4** (`tailwindcss ^4`, `@tailwindcss/postcss ^4`). The v4 API is fundamentally different from v3 — read this section before touching any CSS.

### Key differences from v3

| v3 | v4 |
|----|----|
| `tailwind.config.ts` (primary config) | `@theme inline {}` in CSS (primary config) |
| `plugins: [require("foo")]` | `@plugin "foo"` in CSS |
| `darkMode: ["class"]` in config | `@variant dark (&:where(.dark, .dark *))` in CSS |
| No explicit import needed | `@import "tailwindcss"` **must** be first in CSS |
| `@import url()` anywhere | `@import url()` must precede `@import "tailwindcss"` or use `<link>` |

### globals.css structure (required order)

```css
@import "tailwindcss";          /* MUST be first — activates Tailwind v4 */
@plugin "tailwindcss-animate";  /* plugins go here, not in tailwind.config.ts */
@variant dark (&:where(.dark, .dark *));  /* class-based dark mode */

/* @import url() for external fonts MUST come after, or load via <link> in layout.tsx */

@theme inline {
  /* map CSS vars → Tailwind utility classes */
  --color-primary: var(--primary);
}

@layer base { ... }
@layer utilities { ... }
```

### Dark mode

Dark mode is toggled by adding class `dark` to `<html>`. Controlled by `next-themes` (`ThemeProvider`). Default theme: `light`.

---

## CSS & design tokens

Design system: **TailAdmin v3** — clean solid surfaces, no glassmorphism.
Font: **Outfit** (sans) + **IBM Plex Mono** (numeric).
All colors come from CSS custom properties defined in `src/app/globals.css`. **Never hardcode hex values in JSX.**

```css
/* ── Core UI ── */
--background          /* page bg — gray-50 #f9fafb */
--foreground          /* body text — gray-900 #101828 */
--card                /* solid white #ffffff */
--border              /* gray-200 #e4e7ec */
--muted               /* gray-100 #f2f4f7 */
--muted-foreground    /* gray-500 #667085 */
--primary             /* brand-500 #465fff */
--primary-foreground  /* white */
--input               /* white */
--input-border        /* gray-300 #d0d5dd */

/* ── Stock semantic ── */
--bull                /* success-500 #12b76a — positive / BUY */
--bull-muted          /* rgba(18,183,106,0.10) — subtle bg */
--bull-foreground     /* success-950 #054f31 */
--bear                /* error-500 #f04438 — negative / SELL */
--bear-muted          /* rgba(240,68,56,0.10) */
--bear-foreground     /* error-900 #7a271a */
--signal-buy          /* = --bull */
--signal-sell         /* = --bear */
--signal-hold         /* warning-500 #f79009 */

/* ── TailAdmin Shadow system ── */
--shadow-xs           /* 0px 1px 2px — subtle */
--shadow-sm           /* default card shadow */
--shadow-md           /* elevated elements */
--shadow-lg           /* modals, dropdowns */
--shadow-xl           /* overlays */
--shadow-focus-ring   /* focus state ring */

/* ── Gray scale (TailAdmin) ── */
--gray-25 … --gray-950

/* ── Chart palette ── */
--chart-1 … --chart-10
```

### Utility classes (defined in globals.css `@layer utilities`)

```css
.card-surface    /* solid white card with shadow-sm + border */
.sidebar-surface /* solid sidebar with shadow-xs + border-right */
.btn-primary     /* primary button: brand-500, font-medium, shadow-xs, rounded-lg */
.btn-outline     /* outline button: white bg, gray-300 ring, font-medium */
.badge-buy / .badge-sell / .badge-hold  /* signal badges — rounded-full */
```

Legacy aliases `.card-glass`, `.glass-sidebar`, `.card-terminal` have been **removed**.

Use `style={{ color: "var(--bull)" }}` not `style={{ color: "#12b76a" }}`.

Tailwind utility classes are preferred for spacing, layout, and typography.
Custom overrides use inline `style` with CSS variables only.

---

## Component rules

1. Every component folder has an `index.ts` that re-exports the component and its Props type.
2. Props interface is defined **in the same file** as the component, directly above it.
3. Event handlers inside components are named `handle[Event]` — `handleSelect`, `handleRemove`.
4. Private sub-components (used only within a parent) go in the **same folder**, not a separate one.
   Example: `StatCard.tsx` lives in `chart-panel/` and is not exported from `index.ts`.
5. Page-specific components that would bloat a page file go in `src/components/` with their own folder.

---

## Hooks rules

- One hook = one file = one exported function
- Hooks handle state + side effects; they return plain data and callbacks, no JSX
- Prefer explicit function declarations over arrow functions inside hooks

```ts
// Good
export function useWatchlist(): UseWatchlistReturn { ... }

// Bad
export const useWatchlist = () => { ... }
```

---

## Scripts

```json
{
  "dev":       "next dev",
  "build":     "next build",
  "start":     "next start",
  "typecheck": "tsc --noEmit",
  "lint":      "next lint"
}
```

Run `npm run typecheck` before committing. The build must pass with zero TypeScript errors.

---

## Formatting (.prettierrc)

```json
{
  "semi": true,
  "singleQuote": false,
  "trailingComma": "es5",
  "printWidth": 100,
  "tabWidth": 2,
  "useTabs": false
}
```

---

## What NOT to do

- ❌ Hardcode hex colors in JSX — use CSS variables (`var(--bull)` not `"#12b76a"`)
- ❌ Write `any` — use generics or `unknown`
- ❌ Direct array indexed access without guard when `noUncheckedIndexedAccess` is on
- ❌ Put constants inside components — move to `src/constants/index.ts`
- ❌ Files over 150 lines — split
- ❌ Default exports for components — use named exports
- ❌ Mix logic and markup in the same component when it exceeds 150 lines
- ❌ Import with relative paths across feature boundaries — use `@/` alias
- ❌ Use old token names: `--color-buy`, `--color-sell`, `--sidebar-bg`, `--table-header-bg` — these no longer exist; use `--bull`, `--bear`, `--card`, `--muted`
- ❌ Use removed classes: `.card-glass`, `.glass-sidebar`, `.glass-panel`, `.card-terminal` — use `.card-surface`, `.sidebar-surface`
- ❌ Use `backdrop-filter` or glassmorphism — design is solid surfaces with TailAdmin shadows
- ❌ Reference `Inter` font — use `Outfit`
- ❌ Add `@import url()` after `@import "tailwindcss"` in CSS — use `<link>` in `layout.tsx` for external fonts
- ❌ Add plugins via `require()` in `tailwind.config.ts` — use `@plugin "name"` in `globals.css`
- ❌ Rely on `tailwind.config.ts` for theme tokens — all tokens go in `@theme inline {}` inside `globals.css`
