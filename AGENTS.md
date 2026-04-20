<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Agent Rules — VN Stock Dashboard

Read these rules before touching any file. They are non-negotiable.

---

## Before writing any code

1. Run `cat node_modules/next/dist/docs/index.md` and check the relevant guide for the feature you are about to implement.
2. Read `CLAUDE.md` in full to understand naming conventions, file structure, and CSS rules.
3. Run `npm run typecheck` before and after your changes. The build must pass with **zero TypeScript errors**.

---

## File & folder rules

- All source files live under `src/`. Never create files in the project root.
- Component folders: **kebab-case** (`watchlist-table/`). Component files: **PascalCase** (`WatchlistTable.tsx`).
- Every component folder must have an `index.ts` that barrel-exports the component and its Props type.
- One file = one responsibility. Hard limit: **150 lines**. Split if exceeded.
- No abbreviations in file or variable names (`watchlist` not `wl`, `signal` not `sig`).

---

## TypeScript rules

- `strict: true` and `noUncheckedIndexedAccess: true` are always on — do not disable them.
- Never use `any`. Use generics (`fetcher<T>`) or `unknown` with type narrowing.
- Guard every array index access: `const item = arr[i]; if (!item) continue;`
- Named exports only for components — never `export default function MyComponent`.
- Props interface directly above the component, named `[ComponentName]Props`.

---

## Imports

- Cross-folder imports use the `@/` alias (maps to `src/`): `import { X } from "@/components/signal-badge"`.
- Relative imports (`./Foo`) only within the same component folder.
- Never import from a sibling component's internal file — always go through its `index.ts`.

---

## Constants & config

- All project-wide constants in `src/constants/index.ts`, `UPPER_SNAKE_CASE`.
- Use `REFRESH_INTERVAL` and `CHART_REFRESH_INTERVAL` — never hardcode `30000` or `60000`.
- Use `API_BASE_URL` from constants — never hardcode the Railway URL in components.

---

## CSS / colors

This project uses **Tailwind CSS v4** — the config model is completely different from v3.

### Tailwind v4 rules
- `@import "tailwindcss"` **must** be the first line in `globals.css` — without it nothing works.
- Plugins go via `@plugin "name"` in `globals.css`, **not** `require()` in `tailwind.config.ts`.
- Dark mode variant: `@variant dark (&:where(.dark, .dark *))` in CSS (not `darkMode: ["class"]` in config).
- Theme tokens go in `@theme inline {}` in `globals.css` — `tailwind.config.ts` is legacy/unused for tokens.
- External font `@import url()` must come **before** `@import "tailwindcss"`, or use `<link>` in `layout.tsx`.

### Design system: TailAdmin v3
- **Font**: Outfit (sans) + IBM Plex Mono (numeric). Not Inter.
- **Style**: Clean solid surfaces, no glassmorphism / backdrop-filter / gradient mesh.
- **Shadows**: Use `--shadow-xs` through `--shadow-xl` (TailAdmin scale), not custom blue-tinted shadows.
- **Cards**: Use `.card-surface` or `.card-glass` (legacy alias). Solid white bg + `shadow-sm`.
- **Gray scale**: TailAdmin palette `--gray-25` through `--gray-950`.

### Color tokens
- Never hardcode hex colors in JSX (`style={{ color: "#12b76a" }}` is forbidden).
- Always use CSS variables: `style={{ color: "var(--bull)" }}`.
- Primary: `--primary` = `#465fff` (TailAdmin brand-500). Not blue-500.
- Stock semantic: `--bull` (#12b76a), `--bear` (#f04438), `--signal-hold` (#f79009).
- Muted variants: `--bull-muted`, `--bear-muted` for badge backgrounds.
- Old tokens `--color-buy`, `--color-sell`, `--sidebar-bg`, `--table-header-bg`, `--glass-blur`, `--glass-shadow`, `--glass-border` **no longer exist**.
- All CSS variables are defined in `src/app/globals.css` with dark-mode overrides in `.dark {}`.

---

## Hooks

- One hook per file, file name = function name (`useWatchlist.ts` → `export function useWatchlist()`).
- Use explicit function declarations, not arrow functions.
- Hooks return plain data + callbacks — no JSX, no side-effect-only hooks exported from pages.

---

## SWR data fetching

```ts
// Always type the generic — never call useSWR without <T>
const { data } = useSWR<PriceData>(api.price(symbol), fetcher, {
  refreshInterval: REFRESH_INTERVAL,
});
```

---

## What will break the build — fix before committing

| Violation | Fix |
|-----------|-----|
| `any` type | Replace with generic or `unknown` + narrowing |
| `arr[i].prop` without guard | `const x = arr[i]; if (!x) continue;` |
| Hex color in `style={{}}` | Use CSS variable: `var(--bull)`, `var(--bear)`, etc. |
| Old token name `--color-buy` / `--sidebar-bg` / `--glass-*` | Use `--bull` / `--card` / `--ta-shadow-sm` — old tokens don't exist |
| Removed class `.card-glass` / `.glass-sidebar` / `.card-terminal` | Use `.card-surface` / `.sidebar-surface` — legacy aliases removed |
| `backdrop-filter` or glassmorphism styles | Use solid surfaces with `shadow-sm` — no glass effects |
| Using `Inter` font | Use `Outfit` — Inter has been replaced |
| Constant defined inside component | Move to `src/constants/index.ts` |
| File over 150 lines | Split into sub-component or helper file |
| Missing `index.ts` in component folder | Add barrel export |
| `export default` for a component | Change to named export |
| Missing `@import "tailwindcss"` at top of CSS | Add as first line — v4 won't process without it |
| `@import url()` after `@import "tailwindcss"` | Move font to `<link>` in `layout.tsx` |
| `plugins: [require("foo")]` in `tailwind.config.ts` | Use `@plugin "foo"` in `globals.css` |
