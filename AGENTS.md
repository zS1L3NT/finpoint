# AGENTS.md

## Project Shape
- Fully client-side React + Vite app; no backend. `npm run dev` is the only thing needed to start.
- `index.html` loads `resources/js/app.tsx`, which boots IndexedDB (Dexie), seeds defaults, and mounts the react-router tree from `resources/js/router.tsx` inside `resources/js/layout.tsx`.
- Layer segregation (UI must not cross it):
  - `resources/js/components/*` + `resources/js/pages/*` are UI only: render, read via `useLiveQuery`/`useFetch`, and call `logic/*`. No direct Dexie imports.
  - `resources/js/logic/*` holds domain operations and mirrors the old Laravel `Api/*Controller` surface 1:1 (accounts, statements, records, budgets, categories, buckets, importer, dashboard, monthly) so domain knowledge transfers.
  - `resources/js/data/*` holds persistence: Dexie instance + versioned migrations (`db.ts`), first-run seed (`seed.ts`), JSON export/import (`exportImport.ts`).
  - `resources/js/stores/*` holds ephemeral global UI state (Zustand). Persisted state lives in IndexedDB, not here.
  - `resources/js/routes.ts` centralizes all route paths (replaces Wayfinder).
- React Compiler is enabled in `vite.config.ts`.

## Code Style
- Read `STYLE.md` for code style rules.
- Put future code-style changes in `STYLE.md`, not `AGENTS.md`.

## Commands
- Use `bun install` for a fresh clone.
- Use `npm run dev` for normal local work (pure Vite, no server).
- `bun lint` is write-mode (`biome check --write`); read-only checks are `bun lint:check` and `bun types:check`; `bun run build` builds the app.

## Generated / Ignored Files
- Biome ignores `resources/js/components/ui/**/*`.

## Domain Language
- Read `CONTEXT.md` for canonical domain terms and avoided aliases.
- Most domain tables use string primary keys, not auto-increment integers.

## Verification
- This project does not have an automated test suite.
- When asked to verify with `npm run dev`, run it directly, smoke-test the relevant local route, and stop the dev server afterwards.
