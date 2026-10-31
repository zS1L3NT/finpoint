# AGENTS.md

## Project Shape
- Next.js App Router app; mostly client-side, plus a tiny auth broker. `npm run dev` is the only thing needed to start.
- `app/layout.tsx` renders the shell (metadata, theme/sidebar cookies, `app/providers.tsx`) while IndexedDB (Dexie) opens and seeds in the background. No boot gate: live queries populate the UI as data arrives.
- Layer segregation (UI must not cross it):
  - `app/**/page.tsx` + `src/components/*` are UI only: render, read domain data via `useLiveQuery`, and call `logic/*`. Tables fed by a live query receive `loading={query === undefined}`; reserve silent `?? []` fallbacks for auxiliary lookup lists. Local reads show no spinner or loading copy. While a live query is still `undefined`, render nothing (no `Skeleton` placeholders, no empty-state or "not found" copy) and let the content's reveal animation play once the data arrives; never use blocking loaders. Interactive routes are `"use client"` (search params via `next/navigation`, covered by the root `Suspense` so routes stay static); static content pages (privacy, terms) stay server components.
  - `src/logic/*` holds domain reads and operations, retaining the old Laravel `Api/*Controller` mapping where applicable. Workspace backup/reset operations and background Drive sync also belong here.
  - `src/data/*` holds persistence, versioned migrations, seeding, backup serialization, and Drive storage. Outside this layer, only `src/logic/*` imports `@/data/*`, except `app/providers.tsx` for database boot and seeding.
  - `src/routes.ts` centralizes all route paths; `app/api/auth/*` are Route Handlers for the Google OAuth broker only (exchange/token/logout) — financial data never touches them.
  - Overview + Monthly Records share the `(month)` route-group shell (title, month nav, tabs mount once, content swaps below), so tab switches never remount the header.
- React Compiler is enabled in `next.config.ts`.
- Keep validation errors as `ValidationError` with Laravel-shaped `{ field: string[] }` maps so forms keep working unchanged. Validate input shape through `Validator` in `src/logic/validate.ts`; a single-field rule failure after a read may throw `ValidationError({ field: [msg] })` directly. Aggregate failures through `Validator`, never a hand-built `errors` map.
- For Dexie schema changes, bump the version and add an `upgrade` block; never rewrite old migration blocks.
- Ephemeral UI state stays in component state or search params; anything that must survive reloads belongs in IndexedDB. Pages take no props; filters and pagination live in URL search params so views stay shareable.

## Conventions
- Code style lives in `STYLE.md`: read it before writing code, and add new style rules there.
- Commit, branch, and pull request rules live in `COMMIT.md`: read it before any commit, branch, or PR.

## Commands
- Use `bun install` for a fresh clone.
- Use `npm run dev` for normal local work (Next.js on port 5173, preserving the Google OAuth origin).
- `bun lint` is write-mode (`biome check --write`); read-only checks are `bun lint:check` and `bun types:check`; `bun run build` builds the app.

## Generated / Ignored Files
- Biome ignores `src/components/ui/**/*`.

## Project Graph
- Use `graphify-out/graph.json` to locate relevant symbols and dependencies before architecture or change-impact investigations; verify findings against current source.
- After every task that changes code, tests, or configuration (including renames and deletions), refresh the graph after the final edits and verification, before committing, updating a PR, or reporting completion. One refresh may cover the task's batch of edits.
- Run `graphify update .` for structural code changes. If documents or images changed, or the command reports pending semantic extraction, use the graphify skill with `--update` to refresh those too. Use the graphify skill for initial setup when the tool or graph is missing; no API key is required.
- Include updated `graph.json`, `GRAPH_REPORT.md`, `manifest.json`, and `.graphify_labels.json` from `graphify-out/` with the source changes. Review graph health warnings and report any unresolved refresh failure explicitly.
- Keep graph caches, machine-specific paths, and HTML visualizations local. The graph belongs in repository tooling, outside `public/` and application routes.

## Domain Language
- Read `CONTEXT.md` for canonical domain terms and avoided aliases.
- Most domain tables use string primary keys, not auto-increment integers.

## Agent Behavior
- Before changing the shape of a shared helper API in a meaningful way, such as converting a plain column factory into a hook, consult the user first unless they explicitly asked for that refactor.

## Verification
- Run `bun test` for the domain and importer tests (`tests/domain/`), which use Dexie with in-memory IndexedDB.
- Browser tests (`tests/core/`, `tests/animations/`, Playwright) are scoped to what you change: run the files and projects that exercise the components, routes, or helpers you touched, and make them pass. Core tests run in parallel; animation tests run alone, one at a time. Local runs use the dev servers: `bun run test:e2e -- <files> --project=desktop --project=mobile` for core, `PLAYWRIGHT_ANIMATIONS=1 bun run test:e2e -- <files> --workers=1` for animations. CI (`.github/workflows/ci.yml`) runs the whole suite on every pull request in named, time-balanced groups; a new browser test file must join exactly one group there. See `tests/README.md` for the area layout, the CI groups, and how to pick cases.
- When asked to verify with `npm run dev`, run it directly, smoke-test the relevant local route, and stop the dev server afterwards.
- A failing test your change was not meant to affect is a regression: fix the code and keep the test exactly as it was. Edit a test only where its behaviour changed on purpose, and name each edited test in your report. A test you loosen must still go red when the feature is broken on purpose. Before calling a failure flaky, repeat it on the branch and on `main` and report both counts.

## Agent skills

### Issue tracker

Before creating, reading, or resolving specs and tickets, read
`docs/agents/issue-tracker.md`. Work is tracked locally under `.scratch/`.

### Domain docs

Before domain exploration, read `docs/agents/domain.md`.
This repo uses a single-context layout with `CONTEXT.md` as its vocabulary authority.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
