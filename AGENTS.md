# AGENTS.md

## Stack
- Single Laravel 13 app with an Inertia React frontend; not a monorepo.
- Vite entrypoints are `resources/css/app.css` and `resources/js/app.tsx`.
- `routes/web.php` + `app/Http/Controllers/*` serve Inertia GET pages in `resources/js/pages`.
- `routes/api.php` + `app/Http/Controllers/Api/*` handle JSON mutations; frontend imports generated helpers from `@/wayfinder/*`.
- React Compiler is enabled in `vite.config.ts`.

## Commands
- Use `composer setup` for a fresh clone.
- Use `composer dev` for normal local work; it starts `artisan serve` and Vite together.
- JS/TS:
- `bun lint` is write-mode (`biome check --write`).
- Read-only checks are `bun lint:check` and `bun types:check`.
- `bun run build` builds the frontend.
- PHP:
- `composer lint` auto-fixes with Pint; `composer lint:check` is read-only.

## Generated / Formatting
- `resources/js/wayfinder` is generated and gitignored. After changing Laravel routes or controller signatures used by the frontend, regenerate with `php artisan wayfinder:generate --path=resources/js/wayfinder --with-form`.
- Biome ignores `resources/js/wayfinder/**/*` and `resources/js/components/ui/**/*`.
- Frontend TS/TSX uses tabs via Biome; PHP uses Pint / 4 spaces.

## Code Style
- Don't create unnecessary one-time-use variables
- Don't deviate from library defaults / use hacky methods to accomplish what I ask unless absolutely necessary. Deep dive into the library before doing this
- If the library provides something or if we have a component for something, use it
- Code scoped to a specific component should stay within that specific component file

## Domain
- Most domain tables use string primary keys, not auto-increment integers.
- `statements` are imported bank rows. `records` are user-managed entries linked through the `allocations` pivot. The allocator page shows statements whose allocated total still differs from `statements.amount`.
- `budgets` and `recurrences` attach to `records` through `budget_records` and `recurrence_records`.
- `categories` strictly nest only one layer down

## Test / Env Gotchas
- This project does not do any form of tests
