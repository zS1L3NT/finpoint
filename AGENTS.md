# AGENTS.md

## Project Shape
- Next.js App Router app; mostly client-side, plus a tiny auth broker. `npm run dev` is the only thing needed to start.
- `app/layout.tsx` renders the shell (metadata, theme/sidebar cookies, `app/providers.tsx`) while IndexedDB (Dexie) opens and seeds in the background. No boot gate: live queries populate the UI as data arrives.
- Layer segregation (UI must not cross it):
  - `app/**/page.tsx` + `src/components/*` are UI only: render, read via `useLiveQuery`/`useFetch`, and call `logic/*`. No direct Dexie imports. Show `Skeleton` placeholders while live queries resolve, never blocking loaders. Interactive routes are `"use client"` + `force-dynamic` (search params); static content pages (privacy, terms) stay server components.
  - `src/logic/*` holds domain operations and mirrors the old Laravel `Api/*Controller` surface 1:1 (accounts, statements, records, budgets, categories, buckets, importer, dashboard, monthly) so domain knowledge transfers. `src/logic/auto-sync.ts` is the background Drive engine.
  - `src/data/*` holds persistence: Dexie instance + versioned migrations (`db.ts`), first-run seed (`seed.ts`), JSON export/import (`export-import.ts`) + generated test data (`test-data.ts`).
  - `src/routes.ts` centralizes all route paths; `app/api/auth/*` are Route Handlers for the Google OAuth broker only (exchange/token/logout) — financial data never touches them.
  - Overview + Monthly Records share the `(month)` route-group shell (title, month nav, tabs mount once, content swaps below), so tab switches never remount the header.
- React Compiler is enabled in `next.config.ts`.

## Code Style
- Read `STYLE.md` for code style rules.
- Put future code-style changes in `STYLE.md`, not `AGENTS.md`.

## Commands
- Use `bun install` for a fresh clone.
- Use `npm run dev` for normal local work (Next.js on port 5173, preserving the Google OAuth origin).
- `bun lint` is write-mode (`biome check --write`); read-only checks are `bun lint:check` and `bun types:check`; `bun run build` builds the app.

## Generated / Ignored Files
- Biome ignores `src/components/ui/**/*`.

## Domain Language
- Read `CONTEXT.md` for canonical domain terms and avoided aliases.
- Most domain tables use string primary keys, not auto-increment integers.

## Verification
- This project does not have an automated test suite.
- When asked to verify with `npm run dev`, run it directly, smoke-test the relevant local route, and stop the dev server afterwards.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
