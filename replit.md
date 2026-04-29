# Workspace

## Overview

pnpm workspace monorepo using TypeScript. Each package manages its own dependencies.

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **API framework**: Express 5
- **Database**: PostgreSQL + Drizzle ORM
- **Validation**: Zod (`zod/v4`), `drizzle-zod`
- **API codegen**: Orval (from OpenAPI spec)
- **Build**: esbuild (CJS bundle)

## Key Commands

- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- `pnpm --filter @workspace/api-server run dev` — run API server locally

See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details.

## Cloudflare Pages Deployment (Word Search)

The `word-search` artifact is a fully client-side React + Vite SPA — it has no
backend dependency and can be hosted as a static site on Cloudflare Pages.

**Cloudflare Pages settings (Custom domain: `dailywordsearch.fun`):**

- Framework preset: `None` (or "Vite")
- Build command: `corepack enable && pnpm install --frozen-lockfile && pnpm --filter @workspace/word-search run build`
- Build output directory: `artifacts/word-search/dist/public`
- Root directory: leave empty (use repo root)
- Environment variables:
  - `NODE_VERSION` = `24`
  - `PNPM_VERSION` = `10`
  - (optional) `BASE_PATH` = `/` — defaults to `/` if unset

**SPA routing & headers** are handled by `artifacts/word-search/public/_redirects`
and `_headers`, which Vite copies into the build output automatically.

**Custom domain:** point `dailywordsearch.fun` (and `www`) to the Pages project
via Cloudflare DNS. SSL is automatic.
