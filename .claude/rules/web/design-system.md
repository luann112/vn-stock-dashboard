# Design System — TailAdmin v3

Reference: [demo.tailadmin.com/stocks](https://demo.tailadmin.com/stocks)
Source of truth: `src/app/globals.css`

## Direction

Clean, professional, solid surfaces. No glassmorphism, no backdrop-filter, no gradient meshes.
Light mode is the default. Dark mode uses TailAdmin gray-900 base.

## Typography

| Role | Family | Weight | Notes |
|------|--------|--------|-------|
| UI text | **Outfit** | 400–700 | Loaded via `<link>` in `layout.tsx` |
| Prices, data | **IBM Plex Mono** | 400–600 | Tabular nums, `font-numeric` utility |

Never use Inter — it was replaced by Outfit.

### Text Scale

| Token | Size | Use |
|-------|------|-----|
| `text-xs` | 12px | Labels, captions, footnotes |
| `text-sm` / `--font-size` | 14px | Body text, table cells, buttons |
| `text-base` | 16px | Headings (h3), emphasis |
| `text-lg` | 18px | Section headings |
| `text-xl` | 20px | Page titles |

Price display uses `.text-price-xs` through `.text-price-xl` (mono font, specific weights).

## Color Palette

### Core UI

| Token | Light | Dark | Use |
|-------|-------|------|-----|
| `--background` | gray-50 `#f9fafb` | gray-900 `#101828` | Page background |
| `--foreground` | gray-900 `#101828` | `#f2f4f7` | Primary text |
| `--card` | `#ffffff` | gray-800 `#1d2939` | Card/panel surfaces |
| `--border` | gray-200 `#e4e7ec` | gray-700 `#344054` | Dividers, borders |
| `--muted` | gray-100 `#f2f4f7` | gray-700 `#344054` | Subtle backgrounds |
| `--muted-foreground` | gray-500 `#667085` | gray-400 `#98a2b3` | Secondary text |
| `--primary` | brand-500 `#465fff` | brand-400 `#6172f3` | Accent, active states |
| `--primary-hover` | brand-700 `#3641f5` | brand-500 `#465fff` | Button hover |
| `--input-border` | gray-300 `#d0d5dd` | gray-600 `#475467` | Form borders |

### Stock Semantic

| Token | Light | Dark | Use |
|-------|-------|------|-----|
| `--bull` | success-500 `#12b76a` | success-300 `#32d583` | Positive / BUY |
| `--bear` | error-500 `#f04438` | error-300 `#f97066` | Negative / SELL |
| `--signal-hold` | warning-500 `#f79009` | inherited | Neutral / HOLD |
| `--*-muted` | 10–12% opacity tint | 12% opacity tint | Badge/cell backgrounds |
| `--*-foreground` | dark shade for on-muted text | light shade | Badge text |

### Gray Scale

TailAdmin gray palette from `--gray-25` (#fcfcfd) through `--gray-950` (#0c111d).
Available as Tailwind utilities: `bg-gray-100`, `text-gray-500`, etc.

## Shadows

| Level | Use | Tailwind class |
|-------|-----|----------------|
| `--ta-shadow-xs` | Buttons, subtle elevation | `shadow-xs` |
| `--ta-shadow-sm` | Cards, panels (default) | `shadow-sm` |
| `--ta-shadow-md` | Elevated cards, popovers | `shadow-md` |
| `--ta-shadow-lg` | Modals, dropdowns | `shadow-lg` |
| `--ta-shadow-xl` | Overlays | `shadow-xl` |
| `--ta-shadow-focus-ring` | Focus state | via `.btn-primary:focus-visible` |

Never use Tailwind's built-in shadow-2xl or custom blue-tinted shadows.

## Border Radius

| Token | Value | Tailwind | Use |
|-------|-------|----------|-----|
| `--radius` | 8px | `rounded-lg` | Buttons, cards, inputs |
| calc - 4px | 4px | `rounded-sm` | Small chips |
| calc - 2px | 6px | `rounded-md` | Inline elements |
| calc + 4px | 12px | `rounded-xl` | Panels, dropdowns, alerts |
| calc + 8px | 16px | `rounded-2xl` | Modals |
| — | 9999px | `rounded-full` | Badges, avatars, pills |

## Component Patterns

### Cards

```tsx
<div className="rounded-xl border overflow-hidden card-surface">
```

- Use `.card-surface` utility (solid bg + border + shadow-sm)
- Prefer `rounded-xl` for standalone panels
- `rounded-lg` for nested or smaller cards

### Buttons

**Primary:**
```tsx
<button className="btn-primary px-4 py-3 rounded-lg">Label</button>
```
- Small: `px-4 py-3` — Medium: `px-5 py-3.5`
- `font-medium` and `text-sm` built into `.btn-primary`
- Full-width modals: `btn-primary w-full py-3 rounded-lg`

**Outline:**
```tsx
<button className="btn-outline px-4 py-3 rounded-lg">Label</button>
```

**Ghost / Muted:**
```tsx
<button
  className="px-4 py-2 rounded-lg text-sm font-medium transition-colors"
  style={{ background: "var(--muted)", color: "var(--muted-foreground)" }}
>
```

### Badges

```tsx
<span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium badge-buy">
```

- Always `rounded-full`
- Padding: `px-2.5 py-0.5`
- Use `.badge-buy`, `.badge-sell`, `.badge-hold`

### Inputs

```tsx
<input className="w-full px-3 py-2.5 rounded-lg text-sm border outline-none transition-colors" />
```

- `rounded-lg` (8px)
- Border: `var(--input-border)` (gray-300 light, gray-600 dark)
- Background: `var(--input)` (white light, gray-800 dark)

### Modals

```tsx
<div style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>     {/* overlay */}
  <div className="rounded-2xl border p-6 shadow-lg"       {/* modal */}
    style={{ backgroundColor: "var(--card)", borderColor: "var(--border)" }}>
```

- Overlay: `rgba(0,0,0,0.5)` — no backdrop-filter
- Modal panel: `rounded-2xl`, `shadow-lg`, `p-6`

### Tables

```tsx
<thead>
  <tr style={{ background: "var(--muted)" }}>
    <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide"
        style={{ color: "var(--muted-foreground)" }}>
```

- Header bg: `var(--muted)` (gray-100)
- Cell padding: `px-4 py-3`
- Dividers: `divide-y` with `borderColor: var(--border)`

### Sidebar

```tsx
<aside className="sidebar-surface">
```

- Solid background + border-right + shadow-xs
- Nav items: `px-3 py-2.5 rounded-lg text-sm font-medium`
- Active: `background: var(--accent)`, `color: var(--accent-foreground)`

### Pill Toggles / Chips

```tsx
<button className={`rounded-full px-3 py-1.5 text-sm font-medium transition-colors ${
  isActive
    ? "bg-[color:var(--primary)] text-[color:var(--primary-foreground)]"
    : "bg-[color:var(--muted)] text-[color:var(--muted-foreground)]"
}`}>
```

## Spacing Patterns

| Context | Padding | Gap |
|---------|---------|-----|
| Page layout | `p-6` | — |
| Card content | `p-4` to `p-6` | `gap-3` to `gap-6` |
| Table cells | `px-4 py-3` | — |
| Modal content | `p-6` | `gap-5` |
| Sidebar nav items | `px-3 py-2.5` | `space-y-1` |
| Section between cards | — | `gap-4` |
| Button icon + label | — | `gap-2` |

## Forbidden

- `backdrop-filter`, `-webkit-backdrop-filter` on cards or panels
- Gradient mesh backgrounds on `<html>` or `<body>`
- `Inter` font
- Classes: `.card-glass`, `.glass-sidebar`, `.glass-panel`, `.card-terminal`
- Hardcoded hex in JSX `style={{}}` — always use `var(--token)`
- Tailwind's `shadow-2xl` — use the `shadow-xs` through `shadow-xl` scale
- `color-mix()` in inline styles — define a CSS variable with dark override instead
