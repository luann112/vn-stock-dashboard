# Audit Report — VN Stock Dashboard

**Date**: 2026-04-20
**Context**: Solo dev, MVP stage, pain point = slow API
**Codebase**: 83 files, ~4,385 lines in `src/`
**Overall grade**: B — Code quality xuất sắc, nhưng thiếu hoàn toàn quality gates (test, CI, pre-commit)

## Executive Summary

- **Điểm mạnh nhất**: Type safety flawless (strict mode, zero `any`, zero `@ts-ignore`), architecture sạch với dependency direction đúng chiều, file size discipline tốt
- **Điểm yếu nhất**: Zero test coverage, không có CI/CD, không có pre-commit hooks — code đẹp nhưng không có gì bảo vệ nó khỏi regression
- **Performance gap**: `lightweight-charts` (heavy lib) được import static, không có dynamic import; không dùng `next/image`
- **Accessibility**: Gần như không có — chỉ 4 ARIA attributes trong toàn bộ codebase
- **Verdict**: Codebase chất lượng cao cho MVP solo. Cần bổ sung quality gates trước khi ship production hoặc onboard thêm người

---

## Findings by Category

### 1. Architecture & Code Organization

**Grade**: A

**Strengths**:

- Folder structure feature-based, mỗi component có folder riêng + barrel `index.ts` (21/21 folders)
- Cross-feature imports luôn qua `@/` alias và `index.ts` — không có direct import vào internal files
- Dependency direction đúng chiều: `app → components → hooks → lib → constants → types` (acyclic)
- `lib/utils.ts` chỉ 20 dòng, 4 pure functions — không phải dumping ground
- Không có file > 300 dòng. Max = `constants/index.ts` (172 dòng)

**Issues**:

- [MED] `src/constants/index.ts:1-172` — 172 dòng, vượt soft limit 150 dòng. Chứa symbols, UI config, RS params, company names — nên split theo domain (`constants/symbols.ts`, `constants/rs-config.ts`)
- [LOW] `src/lib/api.ts:1-165` — 165 dòng. Chứa cả error class, fetchers, URL builders, helpers. Acceptable cho MVP nhưng sẽ cần split khi thêm endpoints
- [LOW] `src/contexts/` — Folder rỗng, không dùng. Xóa hoặc giữ nếu có plan dùng custom context

---

### 2. Type Safety & Data Contracts

**Grade**: A+

**Strengths**:

- `tsconfig.json`: `strict: true`, `noUncheckedIndexedAccess: true`, `incremental: true` — tất cả bật
- Zero `any` trong toàn bộ codebase
- Zero `@ts-ignore` và `@ts-expect-error`
- Tất cả `as` assertions chỉ là `as const` (19 instances) — không có unsafe cast
- SWR hooks luôn typed: `useSWR<PriceData>(...)`, không bao giờ generic trống
- Props interfaces named đúng convention: `[ComponentName]Props`
- API types tổ chức tốt trong `src/types/index.ts` với comment chỉ rõ endpoint tương ứng

**Issues**:

- [MED] Không có runtime validation cho API responses (Zod/Valibot). `res.json() as Promise<T>` tin tưởng backend hoàn toàn. Nếu FastAPI schema thay đổi, TypeScript sẽ không bắt được ở runtime
- [LOW] localStorage parse dùng `JSON.parse(saved) as unknown` rồi `Array.isArray()` — OK nhưng không validate shape từng element

---

### 3. State Management & Data Flow

**Grade**: A-

**Strengths**:

- SWR dùng đúng cách: 5 hooks, typed generics, refresh intervals từ constants
- Không duplicate server state vào useState — SWR là single source of truth
- `useRSParams` pattern xuất sắc: tách `uiParams` (instant) vs `apiParams` (debounced 600ms) — optimistic UI cho sliders
- Token caching thông minh: module-level `_cachedToken` sync qua `AuthSync`, tránh per-fetch `getSession()` roundtrip
- Không prop drilling — data flows qua hooks, không qua 5 tầng props

**Issues**:

- [MED] `src/app/(dashboard)/alerts/page.tsx` — Alert filter state (`useState`) mất khi refresh page. Nên persist vào URL `?filter=BUY`
- [LOW] `selectedSymbol` trong watchlist page persist qua localStorage nhưng không reflect trong URL — không thể share link trực tiếp
- [LOW] Form state (login, register) dùng manual `useState` — acceptable cho 2 forms đơn giản, nhưng nếu thêm form phức tạp thì nên xài React Hook Form

---

### 4. Developer Experience

**Grade**: C

**Strengths**:

- `CLAUDE.md` và `AGENTS.md` cực kỳ chi tiết — agent-facing documentation tốt nhất tôi từng thấy trong solo project
- `.prettierrc` configured đúng
- `tsconfig.json` strict + incremental
- Design system rules trong `.claude/rules/web/` rất comprehensive

**Issues**:

- [HIGH] Không có `.env.example` — dev mới (hoặc chính bạn sau 3 tháng) không biết cần env vars gì. Hiện tại `.env` và `.env.local` chứa secrets nhưng không có template
- [HIGH] `README.md` — vẫn là generic Next.js bootstrap template, không describe VN Stock Dashboard
- [MED] `.husky/` folder tồn tại nhưng rỗng — pre-commit hooks chưa setup. Không có lint-staged
- [MED] Không có `format` script trong `package.json` — Prettier config tồn tại nhưng không enforce
- [LOW] `next.config.ts` hoàn toàn trống — không có security headers, image optimization config, hay bất kỳ production optimization nào

---

### 5. Quality Gates

**Grade**: D

**Strengths**:

- `npm run typecheck` chạy `tsc --noEmit` — TypeScript là quality gate duy nhất đang hoạt động
- `npm run lint` chạy `next lint` — baseline linting

**Issues**:

- [CRITICAL] Zero test files trong toàn bộ codebase. Không có Jest, Vitest, hay Playwright config. 0% coverage
- [CRITICAL] Không có CI/CD — không `.github/workflows/`. Build có thể break mà không ai biết
- [HIGH] ESLint chỉ dùng default `next lint` — không có `eslint-plugin-jsx-a11y`, không có custom rules
- [HIGH] Không có pre-commit hooks enforce linting/formatting trước commit
- [MED] Không có `test` script trong `package.json`

---

### 6. Performance & Observability

**Grade**: C-

**Strengths**:

- SWR cache = stale-while-revalidate built-in, giảm perceived latency cho slow API
- Font loading đúng: 2 families (Outfit + IBM Plex Mono) qua `<link>` trong layout — không block render
- Design tokens dùng CSS variables — không runtime overhead

**Issues**:

- [HIGH] `lightweight-charts` (v5.1.0, ~150kb) imported static trong `CandlestickChart.tsx`. Nên `next/dynamic` hoặc `import()` — chart không cần cho initial page load
- [HIGH] Không dùng `next/image` ở bất kỳ đâu — mất optimization (WebP/AVIF, lazy loading, size optimization)
- [MED] Không có error monitoring (Sentry hoặc tương đương) — production errors sẽ silent
- [MED] Không có bundle analyzer — không biết JS budget có đạt target < 300kb hay không
- [LOW] `next.config.ts` không có security headers (CSP, HSTS, X-Frame-Options)
- [LOW] Accessibility gần như zero: chỉ 4 `aria-*` attributes trong `RSComponentTooltip.tsx`. Sidebar navigation không có `aria-label`, form inputs không có labels semantic

---

## Priority Action List

| #   | Item                                                                | Category     | Severity | Effort | Impact |
| --- | ------------------------------------------------------------------- | ------------ | -------- | ------ | ------ |
| 1   | Setup Vitest + test utilities (`formatPrice`, `formatVolume`, `cn`) | Quality      | CRITICAL | 2h     | HIGH   |
| 2   | Dynamic import `lightweight-charts`                                 | Performance  | HIGH     | 30min  | HIGH   |
| 3   | Tạo `.env.example` với tất cả required vars                         | DX           | HIGH     | 15min  | HIGH   |
| 4   | Setup GitHub Actions: typecheck + build on push                     | Quality      | CRITICAL | 1h     | HIGH   |
| 5   | Update `README.md` — setup instructions, architecture, env vars     | DX           | HIGH     | 1h     | MED    |
| 6   | Husky + lint-staged: format + typecheck on pre-commit               | Quality      | HIGH     | 30min  | MED    |
| 7   | Add `next/image` cho bất kỳ image nào (nếu có)                      | Performance  | HIGH     | 30min  | MED    |
| 8   | Split `constants/index.ts` thành domain files                       | Architecture | MED      | 30min  | MED    |
| 9   | Persist alert filter vào URL `?filter=BUY`                          | State        | MED      | 20min  | LOW    |
| 10  | Add security headers trong `next.config.ts`                         | Security     | MED      | 30min  | MED    |

---

## Things NOT to Fix

- **Không cần React Hook Form** — 2 simple forms với 2-3 fields, manual useState hoàn toàn OK
- **Không cần Zustand/Jotai** — SWR + useState + localStorage đủ cho scope hiện tại
- **Không cần Storybook** — solo dev, MVP, components không nhiều
- **Không cần monorepo** — single dashboard app, 83 files
- **Không cần Zod validation ngay** — backend là first-party FastAPI do bạn control, type trust OK cho MVP. Thêm khi scale hoặc khi backend team tách ra
- **`lib/api.ts` 165 dòng** — hơi quá limit nhưng cohesive, tất cả đều API-related. Split khi thêm 5+ endpoints mới
- **`design-tokens.ts` 152 dòng** — edge case, chứa TradingView theme config. OK giữ nguyên
- **Empty `contexts/` folder** — xóa cũng được, giữ cũng không hại gì

---

## Clarifications (answered 2026-04-20)

1. **API chậm** — Cả initial load lẫn real-time refresh đều chậm. Cần optimize backend (FastAPI). Frontend đã có SWR cache giúp giảm perceived latency, nhưng bottleneck là backend response time.
2. **Image assets** — Chỉ dùng Lucide icons (SVG inline). Không có raster images → `next/image` gap **không áp dụng**. Đã loại khỏi priority list.
3. **Deploy target** — Vercel. CI/CD nên dùng GitHub Actions + Vercel auto-deploy. Security headers có thể config qua `next.config.ts` hoặc `vercel.json`.
4. **Auth flow** — Plan upgrade `next-auth` lên stable release. Cần track khi v5 stable ra.
