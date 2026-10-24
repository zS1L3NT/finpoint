# Browser regression tests

Install dependencies with `bun install`, then install Chromium with `bunx playwright install chromium`.
On a Linux machine missing browser libraries, use `bunx playwright install --with-deps chromium`.

## Two tiers: gate and motion

The folder names the tier. `tests/web/gate/` holds mandatory tests: what renders,
what persists, and what navigation, keyboard, validation, and workflow flows do.
`tests/web/motion/` holds animation tests: anything that asserts how something
animates (entrances, cascades, fades, frame-by-frame opacity or geometry, reduced-motion
branches). Motion tests run only in the full suite, one at a time. Gate tests run in
every suite run, in parallel.

A test that checks animation behaviour with a frame sampler belongs in motion. Waiting
for animations to finish before reading a value, or polling a functional condition
with `requestAnimationFrame`, belongs in gate.

## Areas

Each tier has one file per area. A file exists only if it has tests.

| Area | Covers | Server |
| --- | --- | --- |
| `routes` | Page and route rendering, empty, invalid, static, and detail pages, layout sweeps, loading reveal, card grids and page fades (motion) | app |
| `tables` | Record, Statement, and Allocate tables: filters, pagination, selection, grouping, row entrances (motion) | app |
| `editors` | Create and update dialogs and their fields, long content, archiving edits | app |
| `sheets` | Search and confirmation sheets, held-IndexedDB loading, pending queue search | app |
| `modals` | App modal surfaces, backdrops, dropdown and select scroll behaviour, exit fades (motion) | app |
| `navigation` | Back button, history, browser traversal, workflow tabs | app |
| `keyboard` | Keyboard-only flows, sidebar rail, chrome buttons | app |
| `workflows` | Allocation, duplicates, importer, settings, sync, backup and reset | app |
| `charts` | Chart values, tooltips, drills, containment, chart transitions (motion) | app |
| `components` | Everything served by the Vite component harness | harness |
| `helpers` | Self-tests of test helpers (`date-only` in gate, `assertion-probes` in motion) | both |
| `ledger` | The behaviour-ledger gate (`ledger.e2e.ts`), gate only | none |

Harness tests and app tests never share a file. Every harness-based test goes in
`components` (or `helpers`).

## What to run

Ad-hoc runs use the dev servers (app on 5173, harness on 5174, reused when already
running). Runner commands build frozen production bundles first and serve them on
dedicated ports (app on 5273, harness on 5274), so a running dev server is never reused.

- `bun run test:web` — ad-hoc gate run: dev servers, gate tests only, 1 worker.
  All Playwright arguments pass through: file paths, `--grep`, `--project`, `--workers`.
- `bun run test:web:motion` — ad-hoc motion run: `tests/web/motion` only, serial
  (`--workers=1` is forced, even if appended). Greps and projects pass through. A path
  must be inside `tests/web/motion` and replaces the folder (Playwright would otherwise
  run every motion file); any other path is refused.
- `bun run test:web:gate` — runner gate phase: production build, gate tests on
  `desktop` and `mobile`, parallel at 50% of cores unless `--workers=N` is given.
  Report in `playwright-report/gate`, output in `test-results/gate`.
- `bun run test:web:full` — runner full run: phase 1 is the gate on all five projects
  in parallel; phase 2 is motion on all five projects with 1 worker. Phase 2 runs even
  if phase 1 fails, and the exit code is non-zero if either fails. Reports in
  `playwright-report/full-gate` and `playwright-report/full-motion`.

The runner accepts only `--grep`, `--grep-invert`, `--workers` (gate phase only),
and `--project`. `--project` replaces the phase defaults and applies to both phases
of `full`. Anything else (positional paths, `--config`, `--shard`) is refused; run
single files ad-hoc with `bun run test:web -- <path>` instead.

The gate is 346 runs (desktop and mobile); a full run is 369 gate runs on all five projects,
then 102 motion runs (`bunx playwright test --list`, 24 October 2026). On a 12-core Linux host
without a GPU a full run took about 27 min (13 min gate phase on 6 workers, 13 min motion
phase); the 313-run gate before the merge took about 11 min including the production build.
After the merge, a full run (365 + 102) on the developer's Mac took about 16 min (7 min gate
phase, 9 min motion phase). The
pre-reorganisation suite (354 runs, 1 worker) took 36 min on that Mac.

Only one runner at a time: it takes a lock at `test-results/.suite-lock/pid` and refuses
to start while that file exists. A lock left by a crashed run is never cleared
automatically; the refusal says whether its holder is still alive and how to remove it.
Ad-hoc runs take no lock and write to `test-results/adhoc`, so they cannot delete runner
output, but running both at once slows animation sampling.

## Sign-off

`--signoff` refuses to start unless the `basecamp/gh-signoff` extension is installed and the
tree is clean (Next's generated `next-env.d.ts` is ignored). It records `HEAD` and posts every
status on that commit. A passing context is signed green (`gh signoff --commit <HEAD> gate`)
only if the tree is still clean at the same commit. A failing context is posted red
(`gh signoff fail`), so a required check shows the failure instead of waiting forever.
Each run also writes one pull-request comment (updated in place on later runs) listing every
phase's pass count and duration and, for each failure, its project, file and line, and the
start of its error. Each status's **Details** link opens that comment, and a failed status's
description holds the counts. The full HTML reports stay local under `playwright-report/`.
`gate` mode posts `signoff/gate`. `full` mode posts `signoff/gate` from its gate phase (which
covers every gate project) and `signoff/full` from both phases. With `--signoff`, no
pass-through argument is allowed: only complete runs are reported. gh-signoff also requires
the commit to be pushed, so commit and push before a signed run. `--signoff-dry-run` prints
the extension, tree, HEAD and sign-off commands without running anything.
`gh signoff install gate` makes `signoff/gate` a required check for merging.

## Projects and tags

The projects are `desktop` (1440×900, dark), `mobile` (390×844 with touch, dark),
`tall-desktop` (1920×1440, dark), `light` (1440×900, light), and `reduced-motion`
(1440×900, dark, reduce). Desktop and mobile run every case except the ones tagged
away from them. Tall-desktop, light, and reduced-motion run only cases tagged for
them. `helpers` and `ledger` files run in desktop only. `PLAYWRIGHT_FULL_MATRIX=1`
drops the tag filters for a release run. `PLAYWRIGHT_BROWSERS=all` adds `firefox`
and `webkit` (install them first with `bunx playwright install --with-deps firefox webkit`).

Tags, and nothing else: `@tall`, `@tall-only`, `@light`, `@reduced-motion`,
`@mobile-only`, `@desktop-only`. Tag a test `@light` if it asserts painted colour
and `@reduced-motion` if it asserts a reduced-motion branch. The ledger coverage gate
fails if a test carries an unknown tag or if a test opts out of both desktop and
mobile at once. A CLI `--grep` combines with (not instead of) each project's tag
filter, so running an untagged case on light or reduced-motion needs
`PLAYWRIGHT_FULL_MATRIX=1`.

OAuth on port 5273 is not supported and not needed: the suite runs signed out, and
financial data never touches the auth broker.

## Titles and tags

Test and step titles read `<subject>: <behaviour>`. The subject is a short lowercase
noun phrase naming the component, page, or flow under test, using CONTEXT.md domain
terms (`Record`, `Statement`, `Budget`, `Monthly Budget`, `Account`, `Category`,
`Pending Statement`, `Allocation`) with their capitals everywhere else lowercase.
Quoted labels keep their on-screen spelling. The behaviour is a present-tense
lowercase sentence saying what is proven. Grouped tests (several steps, one seed)
use `<subject>: <present-tense summary of the steps>`. Titles carry no bracketed
codes, no dotted prefixes, and no implementation phrasing. Loop-generated titles keep
their template variables and stay unique across the suite; a loop value that becomes the
subject follows the same rules (`Account editor`, `Records table`), with a separate display
field when assertions need a different spelling. Renaming a title means renaming its ID in
`component-inventory.ts` too; the ledger gate fails otherwise. There are no
`test.describe` wrappers except to scope `test.use` (for example a harness section);
the folder already names the tier and the file names the area.

The behaviour ledger is `tests/web/component-inventory.ts` plus the gate in
`tests/web/gate/ledger.e2e.ts`. It parses static `test` and `test.step` titles,
including ones generated by static `for…of` loops, and requires every mapped test ID
to resolve to exactly one executable test. The tier guard fails if a `gate/` file
imports `support/motion`.

## Fixtures

Import `test`, `expect`, and `seedWorkspace` from `../support/fixtures`. Request the `workspace` fixture
for automatic seeding, with `test.use({ workspaceScenario: "dense" })` when needed. Alternatively call
`await seedWorkspace(page, "empty")` explicitly. Scenarios are `empty`, `populated`, and `dense`;
`support/data.ts` exports stable `IDS`. Seeding replaces real IndexedDB data in the test context after
application boot and reloads. It does not add a production endpoint or use Google services.

The test clock pins `Date` while browser timers, `performance`, and `requestAnimationFrame` remain native.
Use the shared Date-only helper to change the calendar date, including before navigation or reload.
Do not use Playwright's clock in these tests. Its replacement animation callbacks run on timers instead of browser paint frames.
Motion assertions need native frames to measure the rendered entrance.

## Rendered assertions

Functional helpers live in `support/assertions.ts`:

- `expectVisibleBackdrop(page)` checks viewport coverage and the rendered background's alpha and opacity.
- `expectPointerCursor(button)` checks that a visible, enabled control computes to `cursor: pointer`.
  Test keyboard activation and the resulting behaviour separately.
- `expectDropdownPreservesScroll(page, open, scrollContainer?)` checks existing overflow styles, layout
  width and real pointer scrolling after opening the menu. Desktop uses wheel input; mobile uses a
  trusted touch swipe. The fixture must have enough content to scroll.
  Pass the app's existing scroll container when it owns scrolling instead of the document.

Frame samplers live in `support/motion.ts` and must never be imported from `gate/`:

- `sampleVisibleRowAnimations(page, selector, reveal)` collects every matching element occupying the
  viewport during requestAnimationFrame samples, including initially transparent rows. It returns text
  labels, opacity, transforms, overflow and animation start times for diagnostics.
- `expectVisibleRowCascade(samples, minimumRows)` requires every sampled row to enter and settle, with
  staggered progress. Pass at least `13` for the tall-desktop regression. Never slice the rows to twelve.
- `expectReducedRowMovement(samples, minimumRows)` is for reduced-motion rows. It requires real laid-out content, settled opacity, no native positional animation, and no interpolated or replayed movement. Motion may snap the initial positional pose to its final pose while retaining an opacity fade.
- `expectPopupEntrance(page, open)` installs frame sampling before `open()`. It checks the whole popup's
  entrance, stable initial child transforms/opacity, and transient overflow against settled overflow.
  Tall mobile content may remain scrollable. Use it for opening an editor before revealing conditional fields.

Sampling callbacks must act in the current document: click a client-side navigation link, open a popup,
or reveal data. A full `page.goto` or reload destroys the sampler and fails the test. Choose a selector
whose matching rows are absent before reveal, so existing content is not mistaken for a new entrance.
Row sampling observes at least 400ms; popup sampling observes at least 1 second to catch delayed initial children. Both require 200ms of stable rendered values after active animations finish.
After the action completes, a 10-second deadline fails if content never appears or never settles.
Wait for hydration and relevant live data before calling a helper. The helper waits for fonts and existing finite animations before sampling.
Frame sampling starts before the action. Missing, disappearing, and undersampled elements fail the assertion.
The sampler records CSS `transform`, `translate`, `scale`, and `rotate` separately and normalises identity transforms.
It excludes elements hidden by CSS clipping, including Base UI native selects. It keeps opacity-zero entrances observable and leaves application animations enabled.
The popup helper checks that reduced motion suppresses movement and leaves the popup fully visible.
Attach returned samples with `test.info().attach` when diagnosing a failure.

Area helpers shared by one area's files live in `tests/web/support/<area>.ts`
(`charts`, `editors`, `sheets`, `tables`). Helpers used by a single destination file
stay local to that file.

Sheet loading tests hold real IndexedDB transactions and observe the application's pending native
read requests. Dexie can answer a warm query from memory, so these tests invalidate its table cache
through the installed storage-mutation protocol before requiring a delayed read. The fixture changes
no stored values or rendered results. A blocked independent probe alone does not prove the UI is waiting.

Run `bun run types:web` to check browser tests, shared assertions, the Vite harness, and Playwright configuration.
Run `bun lint:check` for a read-only Biome check, including browser tests.
The application type check remains `bun types:check`.

Configuration follows the [Playwright configuration guide](https://playwright.dev/docs/test-configuration)
and [web server lifecycle guide](https://playwright.dev/docs/test-webserver), plus the installed Next.js
Playwright guide under `node_modules/next/dist/docs/01-app/02-guides/testing/playwright.md`.

Keep cases under `tests/web/gate/` and `tests/web/motion/` with the `.e2e.ts` suffix. Bun's unit test discovery must not collect them.
Playwright records failure screenshots and retains failure traces under `test-results/`:
`test-results/adhoc` for ad-hoc runs, and `test-results/gate`, `test-results/full-gate` and
`test-results/full-motion` for the runner. HTML reports live in the matching folders under
`playwright-report/`. Both directories are ignored. `bun run test:web:report` opens the ad-hoc
report; open a runner report with `bunx playwright show-report playwright-report/gate` (or
`full-gate`, `full-motion`). Open a trace with
`bunx playwright show-trace test-results/<folder>/<case>/trace.zip`.

Grouped tests trade per-case isolation for wall-clock time. Each group keeps one seed and one
browser context; steps re-navigate only where state would leak (documented per group), and
history-dependent groups reset `localStorage` between steps. Destructive paths, held-IDB races,
and differing history/fixture contracts stay standalone. A step failure aborts its group's later steps, so a red group
may hide additional failures behind the first; re-run the containing test after fixing the
first failure. Per-group timeouts are bounded sums of the steps' legitimate waits;
the global timeout, single ad-hoc worker, and zero-retry policy are unchanged.

The shared Select adapter discovers labels from literal `SelectItem` descendants, including groups
and arrays. Custom components wrapping items and Radix-only content properties are not supported;
current application consumers use plain items and the adapter's supported placement properties.

For a verification run against frozen production bundles without the runner, run `bun run build` and
`bun run test:web:harness:build`, then start `bun run start --port 5273` and
`bun run test:web:harness:preview --port 5274 --strictPort` in separate terminals. Run the matrix with
`PLAYWRIGHT_SERVER=production PLAYWRIGHT_EXTERNAL_SERVERS=1 bun run test:web` for gate tests, or
the same variables with `bun run test:web:motion` for motion tests. Stop those two servers after
the run.
This avoids development reloads changing source while animation frames are sampled.
