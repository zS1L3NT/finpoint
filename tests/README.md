# Tests

Install dependencies with `bun install`, then install Chromium with `bunx playwright install chromium`.
On a Linux machine missing browser libraries, use `bunx playwright install --with-deps chromium`.

Domain and importer tests live in `tests/domain/` and run with `bun test` (Dexie with
in-memory IndexedDB). Everything else here is the Playwright browser suite.

## Two tiers: core and animations

The folder names the tier. `tests/core/` holds mandatory tests: what renders,
what persists, and what navigation, keyboard, validation, and workflow flows do.
`tests/animations/` holds animation tests: anything that asserts how something
animates (entrances, cascades, fades, frame-by-frame opacity or geometry, reduced-motion
branches). Animation tests run one at a time. Core tests run in parallel.

A test that checks animation behaviour with a frame sampler belongs in animations. Waiting
for animations to finish before reading a value, or polling a functional condition
with `requestAnimationFrame`, belongs in core.

## Areas

Each tier has one file per area. A file exists only if it has tests.

| Area | Covers | Server |
| --- | --- | --- |
| `routes` | Page and route rendering, empty, invalid, static, and detail pages, layout sweeps, loading reveal, card grids and page fades (animations) | app |
| `tables` | Record, Statement, and Allocate tables: filters, pagination, selection, grouping, row entrances (animations) | app |
| `editors` | Create and update dialogs and their fields, long content, archiving edits | app |
| `sheets` | Search and confirmation sheets, held-IndexedDB loading, pending queue search | app |
| `modals` | App modal surfaces, backdrops, dropdown and select scroll behaviour, exit fades (animations) | app |
| `navigation` | Back button, history, browser traversal, workflow tabs | app |
| `keyboard` | Keyboard-only flows, sidebar rail, chrome buttons | app |
| `workflows` | Allocation, duplicates, importer, settings, sync, backup and reset | app |
| `charts` | Chart values, tooltips, drills, containment, chart transitions (animations) | app |
| `components` | Everything served by the Vite component harness | harness |
| `helpers` | Self-tests of test helpers (`date-only` in core, `assertion-probes` in animations) | both |
| `ledger` | The behaviour ledger (`ledger.e2e.ts`), core only | none |

Harness tests and app tests never share a file. Every harness-based test goes in
`components` (or `helpers`).

## What to run

Local runs use the dev servers (app on 5173, harness on 5174, reused when already running):

- `bun run test:e2e` — core tests, 1 worker. All Playwright arguments pass through: file
  paths, `--grep`, `--project`, `--workers`, `--headed`.
- `PLAYWRIGHT_ANIMATIONS=1 bun run test:e2e -- tests/animations/<file> --workers=1` —
  animation tests, always one worker.

Run the files and projects that exercise what you changed. The whole suite runs in CI.

## CI

`.github/workflows/ci.yml` runs on every pull request, on pushes to `main`, and on demand.
Its first job, `changes`, lists the changed files and skips what they cannot affect:
Markdown, `graphify-out/`, `docs/` and `.scratch/` changes run nothing, and
`tests/domain/` changes skip the browser tests. A skipped job still reports as passing, so
required checks never wait. When the changed files cannot be worked out (a manual run, or
a push whose previous commit is unknown), everything runs. Each job is a GitHub check:

- `checks`: `bun lint:check`, `bun types:check`, `bun run types:e2e`.
- `domain`: `bun test`.
- `core (<group>)`: one job per group of core files, on all five projects with two
  workers, against frozen production bundles (app on 5273, harness on 5274).
- `animations (<group>)`: the same for animation files, with one worker.
- `core` and `animations`: pass only if every group of their tier passed. They merge the
  groups' blob reports into one HTML report, uploaded as the `playwright-report-core` or
  `playwright-report-animations` artifact, and annotate failures on their lines.

Groups are named by area so a red job says what broke, and balanced by run time so no
job holds up the rest. Each job spends about 1.5 minutes on setup (dependencies, Chromium,
builds) before its tests. A whole run took 6.5 minutes (25 October 2026):

| Tier | Group | Files | Runs | Tests |
| --- | --- | --- | --- | --- |
| core | `pages` | routes | 74 | 4.4 min |
| core | `flows` | navigation, workflows | 90 | 4.7 min |
| core | `editing` | editors, modals, keyboard | 57 | 3.0 min |
| core | `data` | charts, tables | 60 | 3.3 min |
| core | `components` | components, sheets, helpers, ledger | 99 | 4.2 min |
| animations | `tables` | tables | 40 | 4.5 min |
| animations | `editing` | editors, modals, sheets | 24 | 3.9 min |
| animations | `display` | charts, routes, components, helpers | 38 | 4.4 min |

A new browser test file must join exactly one group in `ci.yml`; the ledger fails
otherwise. Rebalance when a group's job runs clearly longer than the others: the
per-file run times are in each job's log.

Core is 380 runs on all five projects and animations 102 (25 October 2026).

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
and `@reduced-motion` if it asserts a reduced-motion branch. The ledger coverage check
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
`component-inventory.ts` too; the ledger fails otherwise. There are no
`test.describe` wrappers except to scope `test.use` (for example a harness section);
the folder already names the tier and the file names the area.

The behaviour ledger is `tests/component-inventory.ts` plus the checks in
`tests/core/ledger.e2e.ts`. It parses static `test` and `test.step` titles,
including ones generated by static `for…of` loops, and requires every mapped test ID
to resolve to exactly one executable test. The tier guard fails if a `core/` file
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

Frame samplers live in `support/motion.ts` and must never be imported from `core/`:

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

Area helpers shared by one area's files live in `tests/support/<area>.ts`
(`charts`, `editors`, `sheets`, `tables`). Helpers used by a single destination file
stay local to that file.

Sheet loading tests hold real IndexedDB transactions and observe the application's pending native
read requests. Dexie can answer a warm query from memory, so these tests invalidate its table cache
through the installed storage-mutation protocol before requiring a delayed read. The fixture changes
no stored values or rendered results. A blocked independent probe alone does not prove the UI is waiting.

Run `bun run types:e2e` to check browser tests, shared assertions, the Vite harness, and Playwright configuration.
Run `bun lint:check` for a read-only Biome check, including browser tests.
The application type check remains `bun types:check`.

Configuration follows the [Playwright configuration guide](https://playwright.dev/docs/test-configuration)
and [web server lifecycle guide](https://playwright.dev/docs/test-webserver), plus the installed Next.js
Playwright guide under `node_modules/next/dist/docs/01-app/02-guides/testing/playwright.md`.

Keep cases under `tests/core/` and `tests/animations/` with the `.e2e.ts` suffix. Bun's unit test discovery must not collect them.
Playwright records failure screenshots and retains failure traces under `test-results/adhoc`,
and writes the HTML report to `playwright-report/adhoc`; both directories are ignored. Open the
report with `bunx playwright show-report playwright-report/adhoc`, or download a CI report
artifact and open its folder the same way. Open a trace with
`bunx playwright show-trace test-results/adhoc/<case>/trace.zip`.

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

For a local run against frozen production bundles, as CI does, run `bun run build` and
`bunx vite build --config tests/harness/vite.config.ts`, then start `bun run start --port 5273` and
`bunx vite preview --config tests/harness/vite.config.ts --host 127.0.0.1 --port 5274 --strictPort`
in separate terminals. Run the matrix with
`PLAYWRIGHT_SERVER=production PLAYWRIGHT_EXTERNAL_SERVERS=1 bun run test:e2e` for core tests, adding
`PLAYWRIGHT_ANIMATIONS=1` and `--workers=1` for animation tests. Stop those two servers after
the run.
This avoids development reloads changing source while animation frames are sampled.
