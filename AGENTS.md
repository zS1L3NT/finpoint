# AGENTS.md

## Project Shape
- Fully client-side React + Vite app; no backend. `npm run dev` is the only thing needed to start.
- `index.html` loads `src/app.tsx`, which mounts the react-router tree from `src/router.tsx` inside `src/layout.tsx` immediately while IndexedDB (Dexie) opens and seeds in the background. No boot gate: live queries populate the UI as data arrives.
- Layer segregation (UI must not cross it):
  - `src/components/*` + `src/pages/*` are UI only: render, read via `useLiveQuery`/`useFetch`, and call `logic/*`. No direct Dexie imports. Show `Skeleton` placeholders while live queries resolve, never blocking loaders.
  - `src/logic/*` holds domain operations and mirrors the old Laravel `Api/*Controller` surface 1:1 (accounts, statements, records, budgets, categories, buckets, importer, dashboard, monthly) so domain knowledge transfers.
  - `src/data/*` holds persistence: Dexie instance + versioned migrations (`db.ts`), first-run seed (`seed.ts`), JSON export/import (`export-import.ts`) + generated test data (`test-data.ts`).
  - `src/routes.ts` centralizes all route paths (replaces Wayfinder).
  - Overview + Monthly Records share the `MonthLayout` shell (title, month nav, tabs mount once, content swaps below), so tab switches never remount the header.
- React Compiler is enabled in `vite.config.ts`.

## Code Style
- Read `STYLE.md` for code style rules.
- Put future code-style changes in `STYLE.md`, not `AGENTS.md`.

## Commands
- Use `bun install` for a fresh clone.
- Use `npm run dev` for normal local work (pure Vite, no server).
- `bun lint` is write-mode (`biome check --write`); read-only checks are `bun lint:check` and `bun types:check`; `bun run build` builds the app.

## Generated / Ignored Files
- Biome ignores `src/components/ui/**/*`.

## Domain Language
- Read `CONTEXT.md` for canonical domain terms and avoided aliases.
- Most domain tables use string primary keys, not auto-increment integers.

## Verification
- This project does not have an automated test suite.
- When asked to verify with `npm run dev`, run it directly, smoke-test the relevant local route, and stop the dev server afterwards.
