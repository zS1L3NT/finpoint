# AGENTS.md

## Project Shape
- Single Laravel 13 app with an Inertia React frontend; not a monorepo.
- Vite entrypoints are `resources/css/app.css` and `resources/js/app.tsx`.
- `routes/web.php` + `app/Http/Controllers/*` serve Inertia GET pages in `resources/js/pages`.
- `routes/api.php` + `app/Http/Controllers/Api/*` handle JSON mutations; frontend imports generated helpers from `@/wayfinder/*`.
- React Compiler is enabled in `vite.config.ts`.

## Commands
- Use `composer setup` for a fresh clone.
- Use `composer dev` for normal local work; it starts `artisan serve` and Vite together.
- JS/TS: `bun lint` is write-mode (`biome check --write`); read-only checks are `bun lint:check` and `bun types:check`; `bun run build` builds the frontend.
- PHP: `composer lint` auto-fixes with Pint; `composer lint:check` is read-only.

## Generated / Formatting
- `resources/js/wayfinder` is generated and gitignored. After changing Laravel routes or controller signatures used by the frontend, regenerate with `php artisan wayfinder:generate --path=resources/js/wayfinder --with-form`.
- Biome ignores `resources/js/wayfinder/**/*` and `resources/js/components/ui/**/*`.
- Frontend TS/TSX uses tabs via Biome; PHP uses Pint / 4 spaces.

## Implementation Style
- Inspect equivalent existing flows before implementing. Mirror local controller, route, page, form, dialog, and table patterns.
- Do not reinvent local UI/data patterns. Reuse existing components/helpers, or extract the smallest shared helper that matches the local style.
- When a display rule changes globally, centralize it in the shared table/component/utility path when practical.
- Keep code dense and direct: avoid one-time-use variables, derived structures, extra scopes, callback blocks, and helper names unless they materially improve readability.
- Do not pad simple logic with defensive abstractions or line-heavy rewrites.
- Prefer shorter expressions and fewer lines while preserving clarity.
- Do not deviate from library defaults or use hacky methods unless necessary. Deep-dive into the library before choosing a workaround.
- Code scoped to one component should stay in that component file.
- Generic logic that is not specific to one hook/component/page belongs in an appropriate shared utility.
- Before changing the shape of a shared helper API in a meaningful way, such as converting a plain column factory into a hook, consult the user first unless they explicitly asked for that refactor.

## Domain Language
- Read `CONTEXT.md` for canonical domain terms and avoided aliases.
- Most domain tables use string primary keys, not auto-increment integers.

## Verification
- This project does not have an automated test suite.
- When asked to verify with `composer dev`, run it directly, smoke-test the relevant local route, and stop the dev server afterwards.
