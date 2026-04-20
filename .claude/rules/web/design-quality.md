> This file extends [common/patterns.md](../common/patterns.md) with web-specific design-quality guidance.
> For exact tokens, components, and spacing specs see [design-system.md](design-system.md).

# Web Design Quality Standards

## Style Direction

TailAdmin — clean, professional, solid surfaces with intentional depth through the shadow scale.
Not glassmorphism. Not generic gray-on-white. Every surface should feel structured and purposeful.

## Anti-Template Policy

Do not ship generic template-looking UI. Frontend output should look intentional, opinionated, and specific to the product.

### Banned Patterns

- Default card grids with uniform spacing and no hierarchy
- Unmodified library defaults passed off as finished design
- Flat layouts with no layering, depth, or motion
- Uniform radius, spacing, and shadows across every component
- Dashboard-by-numbers layouts with sidebar + cards + charts and no point of view
- Glassmorphism, gradient meshes, or backdrop-filter blur on panels
- Default font stacks used without a deliberate reason

### Required Qualities

Every meaningful frontend surface should demonstrate at least four of these:

1. Clear hierarchy through scale contrast
2. Intentional rhythm in spacing, not uniform padding everywhere
3. Depth through shadow scale (xs → xl), not transparency or blur
4. Typography with character — Outfit for UI, IBM Plex Mono for data
5. Color used semantically — bull/bear/hold, not just decoratively
6. Hover, focus, and active states that feel designed
7. Data visualization treated as part of the design system, not an afterthought
8. Motion that clarifies flow instead of distracting from it

## Before Writing Frontend Code

1. Read [design-system.md](design-system.md) for exact tokens and patterns
2. Use `var(--token)` — never hardcode hex in JSX
3. Pick the right shadow level for the component's elevation
4. Choose the right radius: `rounded-lg` for buttons/inputs, `rounded-xl` for panels, `rounded-2xl` for modals, `rounded-full` for badges
5. Both light and dark themes must look intentional

## Component Checklist

- [ ] Uses `.card-surface` or `.sidebar-surface` — not legacy glass classes
- [ ] Has intentional hover/focus/active states
- [ ] Uses hierarchy rather than uniform emphasis
- [ ] Shadow level matches the component's elevation (xs for flat, sm for cards, lg for modals)
- [ ] Would this look believable in a real product screenshot?
- [ ] Both light and dark themes feel intentional
- [ ] No hardcoded hex in inline styles
- [ ] Badge uses `rounded-full`, button uses `rounded-lg`, modal uses `rounded-2xl`
