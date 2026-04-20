# VN Stock Dashboard

Real-time Vietnamese stock market dashboard (HOSE/HNX) with technical signals, RS composite scoring, and heatmap visualization.

## Tech Stack

- **Frontend**: Next.js 16 (App Router), React 19, Tailwind CSS v4
- **Design System**: TailAdmin v3 (Outfit + IBM Plex Mono)
- **Data Fetching**: SWR with auto-refresh
- **Auth**: NextAuth v5 (JWT)
- **Backend**: FastAPI on Railway
- **Deploy**: Vercel

## Setup

```bash
# 1. Clone and install
git clone <repo-url>
cd vn-stock-dashboard
npm install

# 2. Configure environment
cp .env.example .env.local
# Edit .env.local with your values (see .env.example for details)

# 3. Run dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Scripts

| Script               | Description             |
| -------------------- | ----------------------- |
| `npm run dev`        | Start dev server        |
| `npm run build`      | Production build        |
| `npm run typecheck`  | TypeScript strict check |
| `npm run test`       | Run Vitest tests        |
| `npm run test:watch` | Vitest in watch mode    |
| `npm run lint`       | ESLint                  |

## Project Structure

```
src/
  app/                # Next.js App Router pages
  components/         # Feature components (kebab-case folders)
  constants/          # Project-wide constants
  hooks/              # Custom React hooks (SWR-based)
  lib/                # API client, utilities
  types/              # Shared TypeScript types
```

## Environment Variables

See [`.env.example`](.env.example) for all required variables.

| Variable              | Description             |
| --------------------- | ----------------------- |
| `NEXT_PUBLIC_API_URL` | FastAPI backend URL     |
| `NEXTAUTH_SECRET`     | NextAuth encryption key |
| `NEXTAUTH_URL`        | App base URL            |
