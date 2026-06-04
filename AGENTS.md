# AGENTS.md

## Project Shape
- Single Laravel 13 app with an Inertia React frontend; not a monorepo.
- Vite entrypoints are `resources/css/app.css` and `resources/js/app.tsx`.
- `routes/web.php` + `app/Http/Controllers/*` serve Inertia GET pages in `resources/js/pages`.
- `routes/api.php` + `app/Http/Controllers/Api/*` handle JSON mutations; frontend imports generated helpers from `@/wayfinder/*`.
- React Compiler is enabled in `vite.config.ts`.

## Code Style
- Read `STYLE.md` for code style rules.
- Put future code-style changes in `STYLE.md`, not `AGENTS.md`.

## Commands
- Use `composer setup` for a fresh clone.
- Use `composer dev` for normal local work; it starts `artisan serve` and Vite together.
- JS/TS: `bun lint` is write-mode (`biome check --write`); read-only checks are `bun lint:check` and `bun types:check`; `bun run build` builds the frontend.
- PHP: `composer lint` auto-fixes with Pint; `composer lint:check` is read-only.

## Generated / Ignored Files
- `resources/js/wayfinder` is generated and gitignored. After changing Laravel routes or controller signatures used by the frontend, regenerate with `php artisan wayfinder:generate --path=resources/js/wayfinder --with-form`.
- Biome ignores `resources/js/wayfinder/**/*` and `resources/js/components/ui/**/*`.

## Domain Language
- Read `CONTEXT.md` for canonical domain terms and avoided aliases.
- Most domain tables use string primary keys, not auto-increment integers.

## Verification
- This project does not have an automated test suite.
- When asked to verify with `composer dev`, run it directly, smoke-test the relevant local route, and stop the dev server afterwards.
