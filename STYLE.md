# Style Guide

Code style only. Project commands, setup, verification, domain notes, and agent conduct live in AGENTS.md; commit, branch, and pull request rules live in COMMIT.md.

<!-- setup-conventions:generated-start -->

## Code Style

### Core

Every line earns its place by carrying behavior, clarity, reuse, or a constraint. The local area is the authority on what "clean" means: before changing code, read the equivalent files (siblings, similar screens, shared utilities), the call sites and what callers pass, and the local declaration order. Preserve behavior unless a change is explicit.

### Earning Its Place

- Delete props, branches, imports, wrappers, and helpers that carry nothing.
- Write one-off logic inline. Abstract only for real reuse or where the repo already has a matching shared pattern.
- Keep simple logic simple, free of defensive layers and line-heavy rewrites.
- Treat comments as code with intent. Keep those recording rationale, workflow notes, constraints, temporary options, domain caveats, or non-obvious positioning; remove only the stale, misleading, or boilerplate.

### Grouping And Order

- Group variables, callbacks, derived values, effects, handlers, render blocks, and helpers by feature, with spacing marking each group. Long mixed lists of unrelated state, formatting values, handlers, and config get split by feature.
- Order by dependency and reading flow: inputs, derived values, actions, rendering.
- Declaration order is a first-class convention. Learn it from nearby files and keep equivalent declarations in the same relative order across the file, folder, and project. Typical layers: identity/core inputs, dependencies, state, derived values, operations, primary entry points, extracted helpers, then private/nested support types.
- Hard constraints win: temporal dead zones, hook/lifecycle rules, type inference, initialization order, dependency injection, visibility, compile rules. When exact order is impossible, use the closest valid order and let spacing show the intended grouping.
- Keep framework groups contiguous: decorators/attributes/property wrappers, injection, request validation, query/mutation state, lifecycle hooks, render/body output, route handlers, tests, helpers.

### Variables And Names

- Inline weak variables: those that only rename a short expression, are used once, or add more scope clutter than clarity. Repeating a harmless expression two or three times is fine when it keeps code tighter.
- Keep a variable when it prevents duplicated expensive work, stabilizes a reference, captures a side effect safely, narrows a type, or names a genuinely important concept.
- Names are compact but complete: one word when context makes it clear, longer only when the missing detail would be ambiguous. Short locals (`data`, `item`, `value`, `result`, `props`, `p`, `r`, `x`) suit small scopes like closures, maps, filters, reducers, and tiny helpers.
- Rename only when context fails to identify the concept, and rename toward plain, never clever.

### APIs, Arguments, And Props

- Define only the fields, parameters, props, request values, and options actually needed, with names, types, and order matching equivalent local APIs.
- Order definitions by importance: identity/core data, dependencies, callbacks/actions, then presentation/config/options.
- Order call sites (arguments, named parameters, object fields, JSX props, payloads, test data) to mirror the callee's definition.
- Keep a list on one line while it reads well; past that, one item per line with no blank lines inside the list.

### Consistency

- Match the dominant nearby pattern for imports, types, class/struct/function layout, hook/lifecycle placement, export shape, route/helper usage, and UI/API composition.
- File and module boundaries are style too: follow the repo's existing split.
- Where the repo is inconsistent, follow the local folder/file pattern.
- Call out the scope before changing a shared convention across many files.

## React / TypeScript Style

- Group imports in the local order: external libraries, local components, UI primitives, constants/history/hooks, libs, types, generated routes/helpers.
- Use `type` imports where the repo does, and match its React type style (`React.ReactNode` vs imported `ReactNode`).
- Use small inline prop types for one-off components and named types for reused/shared surfaces, matching nearby files.
- Order props by how the component reads: core data, external data collections, open/state controls, callbacks/actions, then optional trigger/render/config.
- Common component flow: history/navigation helpers, fetch/query hooks, local state, form/error helpers, effects, derived values, form/table setup, handlers, selected JSX fragments, return.
- Reach for `useMemo`, `useCallback`, and extra helper components only when the codebase already does or identity/performance constraints are real.
- A variable holding a JSX fragment earns its place when it makes a large return readable.
- Short callback names suit tight scopes: `s`, `r`, `p`, `row`, `field`, `value`, `prev`, `event`.

<!-- setup-conventions:generated-end -->

## Finpoint Style Additions

Project-specific code style rules preserved from the previous guide.

- Frontend TS/TSX uses tabs via Biome; PHP uses Pint / 4 spaces.
- Inspect equivalent existing flows before implementing. Mirror local controller, route, page, form, dialog, and table patterns.
- Do not reinvent local UI/data patterns. Reuse existing components/helpers, or extract the smallest shared helper that matches the local style.
- When a display rule changes globally, centralize it in the shared table/component/utility path when practical.
- Keep code dense and direct: avoid one-time-use variables, derived structures, extra scopes, callback blocks, and helper names unless they materially improve readability.
- Prefer shorter expressions and fewer lines while preserving clarity.
- Do not deviate from library defaults or use hacky methods unless necessary. Deep-dive into the library before choosing a workaround.
- Code scoped to one component should stay in that component file.
- Generic logic that is not specific to one hook/component/page belongs in an appropriate shared utility.

- Every `.ts`/`.tsx` filename is kebab-case (`export-import.ts`, never `exportImport.ts`). The only exception is `vite-env.d.ts`, which keeps Vite's conventional name.
- Logic functions read in three blocks separated by blank lines: validate input, fetch/persist via Dexie, then return.
