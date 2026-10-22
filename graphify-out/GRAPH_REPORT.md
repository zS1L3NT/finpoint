# Graph Report - t3-9755e75b  (2026-10-22)

## Corpus Check
- cluster-only mode — file stats not available

## Summary
- 1780 nodes · 7044 edges · 87 communities (77 shown, 10 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 97 edges (avg confidence: 0.84)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `ee5cadf6`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- Button
- sync/page.tsx
- daily-spending-chart.tsx
- category-history-chart.tsx
- cn
- total-spending-chart.tsx
- src/data/* (persistence, migrations, seeding, backup serialization, Drive storage)
- Validator
- dashboard.ts
- compilerOptions
- package.json
- dependencies
- src/data/* (persistence, migrations, seeding, backup serialization, Drive storage)
- budgets/page.tsx
- suspicious
- correctness
- export-import.ts
- auto-sync.ts
- (month)/page.tsx
- components.json
- Commands
- app-sidebar.tsx
- combobox.tsx
- shared.ts
- assertions.ts
- test
- IDS
- coverage.e2e.ts
- react
- STYLE.md
- Monthly Budget
- auth-vault.ts
- duplicates/page.tsx
- next
- AGENTS.md
- utils.ts
- types.d.ts
- monthly-budget-usage.tsx
- db.ts
- formatter
- editors.e2e.ts
- luxon
- pagination.tsx
- biome.json
- rules
- workflows.e2e.ts
- devDependencies
- manifest.json
- duplicates.test.ts
- Next.js agent rules block ("This is NOT the Next.js you know")
- Validation rule (ValidationError + Validator)
- Project Graph
- formatter
- Commit Guide
- Records
- google-drive.ts
- optionalDependencies
- scripts
- widgets.e2e.ts
- style
- sheet-loading.e2e.ts
- Finpoint icon concept
- Finpoint icon with charcoal shadow
- fixtures.ts
- vite.config.ts
- Finpoint
- Local Markdown Issue Tracker
- Google Drive sync
- tsconfig.web.json
- F monogram icon
- JPG favicon icon
- PNG favicon icon
- SVG favicon icon
- F monogram icon
- F monogram icon
- Finpoint app icon
- Domain Documentation Conflicts
- Unrestricted crawler policy
- Generated demo data
- Progressive Web Application
- Issue tracker: Local Markdown
- Domain docs
- collectTests
- What to run

## God Nodes (most connected - your core abstractions)
1. `cn()` - 309 edges
2. `PrimitivesSection()` - 184 edges
3. `Button()` - 119 edges
4. `react` - 92 edges
5. `formatCurrency()` - 79 edges
6. `RecordEditorDialog()` - 63 edges
7. `UiIcon()` - 49 edges
8. `RecordCreatorDialog()` - 47 edges
9. `round2()` - 46 edges
10. `Card()` - 41 edges

## Surprising Connections (you probably didn't know these)
- `Finpoint Style Additions` --references--> `ValidationError`  [INFERRED]
  STYLE.md → src/logic/validate.ts
- `Finpoint Style Additions` --references--> `useApiFormErrors()`  [INFERRED]
  STYLE.md → src/hooks/use-api-form-errors.ts
- `What to run` --references--> `SelectItem()`  [INFERRED]
  tests/web/README.md → src/components/ui/select.tsx
- `Copy` --references--> `pluralize()`  [INFERRED]
  STYLE.md → src/lib/utils.ts
- `Fixtures` --references--> `seedWorkspace()`  [INFERRED]
  tests/web/README.md → tests/web/support/fixtures.ts

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **Project graph refresh workflow** — agents_graph_refresh_rule, agents_graphify_update, agents_graphify_skill, agents_graph_artifacts_committed, agents_graph_local_only_rule [EXTRACTED 1.00]
- **UI / logic / data layer segregation** — agents_ui_layer, agents_logic_layer, agents_data_layer, agents_data_import_boundary [EXTRACTED 1.00]
- **Laravel-shaped validation pipeline** — agents_validation_rule, agents_validation_error, agents_validator, src_logic_validate, agents_laravel_shaped_error_maps [EXTRACTED 1.00]

## Communities (87 total, 10 thin omitted)

### Community 0 - "Button"
Cohesion: 0.05
Nodes (143): AllocatorPendingPage(), CandidatePage, CandidateResults(), countSuggestions(), PendingCard(), getBudgetAnalytics(), getCategoryData(), sonner (+135 more)

### Community 1 - "sync/page.tsx"
Cohesion: 0.05
Nodes (109): BudgetPage(), Legend(), CategoriesPage(), CategoryDialogState, CategoryTile(), SECTIONS, ACCEPT, BANKS_REQUIRING_ADDITIONAL_INFO (+101 more)

### Community 2 - "daily-spending-chart.tsx"
Cohesion: 0.14
Nodes (27): recharts, BudgetActiveDot(), BudgetProgressChart(), BudgetProgressPoint, buildSeries(), colorChange(), CHART_INTRO_MS, useChartIntro() (+19 more)

### Community 3 - "category-history-chart.tsx"
Cohesion: 0.24
Nodes (11): aggregateSeries(), CategoryHistoryChart(), ChartMonth, ChartSeries, HistoryTooltip(), MonthTick(), prepareMonths(), prepareSeries() (+3 more)

### Community 4 - "cn"
Cohesion: 0.08
Nodes (80): class-variance-authority, AppHeader(), AlertAction(), AlertDialogTrigger(), ButtonGroup(), ButtonGroupSeparator(), ButtonGroupText(), buttonGroupVariants (+72 more)

### Community 5 - "total-spending-chart.tsx"
Cohesion: 0.18
Nodes (18): CashflowChart(), CashflowPoint, colorChange(), currencyOrDash(), LegendItem(), mobileAmount, seriesLabel(), StatefulActiveDot() (+10 more)

### Community 7 - "src/data/* (persistence, migrations, seeding, backup serialization, Drive storage)"
Cohesion: 0.38
Nodes (8): Background Drive sync, src/data/* (persistence, migrations, seeding, backup serialization, Drive storage), src/logic/* (domain reads and operations), (month) route-group shell (Overview + Monthly Records), src/routes.ts (centralized route paths), Static content pages (privacy, terms) are server components, UI layer (app pages + components), Workspace backup/reset operations

### Community 8 - "Validator"
Cohesion: 0.28
Nodes (15): updateAccount(), validateBudget(), cleanInput(), fixDuplicates(), createMonthlyBudget(), MONTHLY_BUDGET_GROUPS, PACE_KINDS, setMonthlyBudgetAmount() (+7 more)

### Community 9 - "dashboard.ts"
Cohesion: 0.11
Nodes (43): db, AnalyticsRecord, AnalyticsSummary, contribution(), summarize(), avg(), buildCashflowHistory(), buildCategories() (+35 more)

### Community 11 - "compilerOptions"
Cohesion: 0.06
Nodes (33): compilerOptions, allowJs, allowSyntheticDefaultImports, allowUnusedLabels, esModuleInterop, forceConsistentCasingInFileNames, incremental, isolatedModules (+25 more)

### Community 13 - "package.json"
Cohesion: 0.07
Nodes (28): private, $schema, type, babel-plugin-react-compiler, @biomejs/biome, clsx, cmdk, @fontsource-variable/inter (+20 more)

### Community 14 - "dependencies"
Cohesion: 0.07
Nodes (30): dependencies, @base-ui/react, class-variance-authority, clsx, cmdk, dexie, dexie-react-hooks, @fontsource-variable/inter (+22 more)

### Community 15 - "src/data/* (persistence, migrations, seeding, backup serialization, Drive storage)"
Cohesion: 0.18
Nodes (9): app/**/page.tsx, IndexedDB (Dexie), Interactive routes are "use client" (search params via next/navigation), Pages take no props, Project Shape, React Compiler (enabled), Root Suspense (keeps routes static), URL search params (filters and pagination) (+1 more)

### Community 17 - "budgets/page.tsx"
Cohesion: 0.07
Nodes (62): AccountCard(), AccountRow, AccountsPage(), BUDGET_STATES, BudgetCard(), BudgetsPage(), BudgetState, formatBudgetDateWindow() (+54 more)

### Community 18 - "suspicious"
Cohesion: 0.07
Nodes (28): suspicious, noAssignInExpressions, noAsyncPromiseExecutor, noCatchAssign, noClassAssign, noCompareNegZero, noControlCharactersInRegex, noDebugger (+20 more)

### Community 21 - "correctness"
Cohesion: 0.08
Nodes (26): noConstantCondition, noConstAssign, noEmptyCharacterClassInRegex, noEmptyPattern, noGlobalObjectCalls, noInvalidBuiltinInstantiation, noInvalidConstructorSuper, noNonoctalDecimalEscape (+18 more)

### Community 22 - "export-import.ts"
Cohesion: 0.21
Nodes (15): clearAllData(), downloadExport(), importData(), parseImportFile(), SYNC_TABLES, tableCounts(), TableName, TABLES (+7 more)

### Community 23 - "auto-sync.ts"
Cohesion: 0.12
Nodes (41): exportData(), downloadBackupFile(), driveFetch(), findBackupFile(), getClockSkewMs(), getFileMeta(), isDriveConfigured(), uploadBackupFile() (+33 more)

### Community 24 - "(month)/page.tsx"
Cohesion: 0.13
Nodes (30): Comparison, comparisonRateText(), comparisonText(), ComparisonValue, DashboardData, DashboardMonthlyBudget, DashboardPage(), DashboardView (+22 more)

### Community 26 - "components.json"
Cohesion: 0.09
Nodes (21): aliases, components, hooks, lib, ui, utils, iconLibrary, menuAccent (+13 more)

### Community 27 - "Commands"
Cohesion: 0.38
Nodes (7): Biome (biome check --write), bun install, bun lint (write-mode), bun lint:check, bun run build, bun types:check, Commands

### Community 28 - "app-sidebar.tsx"
Cohesion: 0.07
Nodes (59): metadata, RootLayout(), viewport, NotFound(), Boot(), Providers(), Template(), @vercel/analytics (+51 more)

### Community 29 - "combobox.tsx"
Cohesion: 0.10
Nodes (24): @base-ui/react, Props, ComboboxChip(), ComboboxChips(), ComboboxChipsInput(), ComboboxClear(), ComboboxCollection(), ComboboxContent() (+16 more)

### Community 30 - "shared.ts"
Cohesion: 0.14
Nodes (19): DEFAULT_CATEGORIES, DEFAULT_MONTHLY_BUDGETS, EXPORT_VERSION, FinpointExport, seedIfEmpty(), BANK_BLURB, between(), CATEGORIES (+11 more)

### Community 31 - "assertions.ts"
Cohesion: 0.15
Nodes (15): denseConsumers, MotionConsumer, populatedConsumers, ready, titles, attachSamplingFailure(), expectDropdownPreservesScroll(), expectPointerCursor() (+7 more)

### Community 32 - "test"
Cohesion: 0.13
Nodes (9): @playwright/test, cardTitles, Child, october, september, installDateOnly(), revisions, setDateOnly() (+1 more)

### Community 33 - "IDS"
Cohesion: 0.20
Nodes (5): containedFooter(), longName, expectBackAboveHeading(), keyboardBack(), IDS

### Community 34 - "coverage.e2e.ts"
Cohesion: 0.16
Nodes (16): typescript, behaviourCoverage, componentInventory, facetNotApplicable, InventoryEntry, notApplicable, openFacets, RouteEntry (+8 more)

### Community 35 - "react"
Cohesion: 0.20
Nodes (28): react, PendingStatementConfirmationSheet(), RecordOption(), RecordSearchSheet(), StatementOption(), StatementSearchSheet(), AmountFilter(), AmountRange (+20 more)

### Community 37 - "STYLE.md"
Cohesion: 0.17
Nodes (13): APIs, Arguments, And Props, Code Style, Consistency, Copy, Core, Earning Its Place, Finpoint Style Additions, Grouping And Order (+5 more)

### Community 38 - "Monthly Budget"
Cohesion: 0.18
Nodes (16): CONTEXT.md (domain vocabulary), Account, Allocation, Budget, Category, Duplicate Statement, Finpoint Domain Glossary, Monthly Budget (+8 more)

### Community 39 - "auth-vault.ts"
Cohesion: 0.32
Nodes (13): POST(), POST(), POST(), AUTH_COOKIE_NAME, authCookie(), authCookieConfig(), clientIp(), encryptionKey() (+5 more)

### Community 40 - "duplicates/page.tsx"
Cohesion: 0.09
Nodes (74): AccountPage(), CARD_MOTION, DuplicateGroupCard(), FixDuplicatesPage(), GroupHeader(), highlightDifferences(), VIEWS, AllocatorPage() (+66 more)

### Community 41 - "next"
Cohesion: 0.26
Nodes (9): nextConfig, next, getStoredHistory(), getValidHistory(), HistoryContext, HistoryItem, HistoryProvider(), normaliseUrl() (+1 more)

### Community 42 - "AGENTS.md"
Cohesion: 0.18
Nodes (12): Agent Behavior, Agent skills, CONTEXT.md, Conventions, Domain docs (single-context layout), Domain Language, Generated / Ignored Files, Issue tracker (local specs and tickets) (+4 more)

### Community 43 - "utils.ts"
Cohesion: 0.11
Nodes (32): MonthLayout(), lucide-react, radix-ui, DateField(), Props, Props, CategoryFilter(), CategoryFilterItem() (+24 more)

### Community 44 - "types.d.ts"
Cohesion: 0.13
Nodes (14): Account, Allocation, AnalyticsSummary, AnalyticsTreatment, Appearance, Budget, Category, CategoryWithChildren (+6 more)

### Community 45 - "monthly-budget-usage.tsx"
Cohesion: 0.39
Nodes (6): arc(), centerCurrency(), MonthlyBudgetUsage(), MonthlyBudgetUsageItem, compactAmount, formatChartCurrency()

### Community 46 - "db.ts"
Cohesion: 0.10
Nodes (30): AccountRow, AllocationRow, AnalyticsMonthRow, BudgetRecordRow, BudgetRow, CategoryRow, DB_NAME, DB_VERSION (+22 more)

### Community 47 - "formatter"
Cohesion: 0.15
Nodes (13): arrowParentheses, bracketSameLine, bracketSpacing, jsxQuoteStyle, quoteProperties, quoteStyle, semicolons, trailingCommas (+5 more)

### Community 48 - "editors.e2e.ts"
Cohesion: 0.12
Nodes (11): account, budget, deleted, editors, imported, kept, longText, openEditor() (+3 more)

### Community 49 - "luxon"
Cohesion: 0.21
Nodes (10): luxon, compact(), INK, LEVELS, quantile(), rampCap(), SpendingCalendar(), WEEKDAYS (+2 more)

### Community 50 - "pagination.tsx"
Cohesion: 0.38
Nodes (11): pageHref(), pageWindow(), PaginationFooter(), Pagination(), PaginationContent(), PaginationEllipsis(), PaginationItem(), PaginationLink() (+3 more)

### Community 51 - "biome.json"
Cohesion: 0.18
Nodes (10): source, assist, actions, files, includes, linter, enabled, overrides (+2 more)

### Community 52 - "rules"
Cohesion: 0.18
Nodes (11): noAdjacentSpacesInRegex, noBannedTypes, noExtraBooleanCast, noUselessCatch, noUselessThisAlias, noUselessTypeConstraint, rules, noFloatingPromises (+3 more)

### Community 54 - "devDependencies"
Cohesion: 0.15
Nodes (13): devDependencies, babel-plugin-react-compiler, @biomejs/biome, fake-indexeddb, @playwright/test, @tailwindcss/postcss, @types/luxon, @types/node (+5 more)

### Community 55 - "manifest.json"
Cohesion: 0.20
Nodes (9): background_color, description, display, icons, name, scope, short_name, start_url (+1 more)

### Community 56 - "duplicates.test.ts"
Cohesion: 0.15
Nodes (8): dexie, fake-indexeddb, FinpointDB, StatementRow, digestSnapshot(), hashLegacySnapshot(), hashSnapshot(), Snapshot

### Community 57 - "Next.js agent rules block ("This is NOT the Next.js you know")"
Cohesion: 0.18
Nodes (9): app/api/auth/* Route Handlers, bun test, node_modules/next/dist/server/lib/generate-agent-files.js, Google OAuth broker (exchange/token/logout), Domain and importer tests (Dexie with in-memory IndexedDB), Next.js App Router app (mostly client-side), node_modules/next/dist/docs/, npm run dev (port 5173) (+1 more)

### Community 58 - "Validation rule (ValidationError + Validator)"
Cohesion: 0.50
Nodes (4): Old Laravel Api/*Controller mapping, Laravel-shaped { field: string[] } error maps, ValidationError, Validator

### Community 59 - "Project Graph"
Cohesion: 0.39
Nodes (6): Committed graph artifacts (graph.json, GRAPH_REPORT.md, manifest.json, .graphify_labels.json), Graph health warnings and refresh failure reporting, graphify-out/graph.json, graphify skill (--update), graphify update ., Project Graph

### Community 61 - "formatter"
Cohesion: 0.25
Nodes (8): formatter, attributePosition, enabled, formatWithErrors, indentStyle, indentWidth, lineEnding, lineWidth

### Community 62 - "Commit Guide"
Cohesion: 0.25
Nodes (4): Branches, Commit Guide, Commits, Pull Requests

### Community 63 - "Records"
Cohesion: 0.32
Nodes (8): Allocator, Budgets, Categories, Dashboard, Statement-allocation-record model, Monthly Budgets, Records, Statement importer

### Community 64 - "google-drive.ts"
Cohesion: 0.24
Nodes (12): AuthNeededError, cacheToken(), CodeResponse, disconnectDrive(), DriveFileMeta, ensureDriveToken(), ensureDriveTokenSilent(), googleClientId() (+4 more)

### Community 65 - "optionalDependencies"
Cohesion: 0.29
Nodes (7): optionalDependencies, lightningcss-linux-x64-gnu, lightningcss-win32-x64-msvc, @rollup/rollup-linux-x64-gnu, @rollup/rollup-win32-x64-msvc, @tailwindcss/oxide-linux-x64-gnu, @tailwindcss/oxide-win32-x64-msvc

### Community 66 - "scripts"
Cohesion: 0.14
Nodes (14): scripts, build, dev, lint, lint:check, start, test:web, test:web:harness (+6 more)

### Community 68 - "style"
Cohesion: 0.33
Nodes (6): style, noNamespace, noNonNullAssertion, useArrayLiterals, useAsConstAssertion, useBlockStatements

### Community 69 - "sheet-loading.e2e.ts"
Cohesion: 0.28
Nodes (3): expectHeldRead(), expectRetainedRows(), expectSilentSheet()

### Community 70 - "Finpoint icon concept"
Cohesion: 0.40
Nodes (5): Finpoint icon concept, Charcoal shadow halo, Circular point, Rounded F monogram, Off-white icon fill

### Community 71 - "Finpoint icon with charcoal shadow"
Cohesion: 0.40
Nodes (5): Finpoint icon with charcoal shadow, Charcoal shadow halo, Circular point, Rounded F monogram, Off-white icon fill

### Community 72 - "fixtures.ts"
Cohesion: 0.16
Nodes (14): overviewCharts, bounds(), contained(), PREMATURE, ScenarioName, WorkspaceDataset, assertSeeded(), checkSeededMarker() (+6 more)

### Community 73 - "vite.config.ts"
Cohesion: 0.29
Nodes (4): vite, @vitejs/plugin-react, harnessDir, repoRoot

### Community 74 - "Finpoint"
Cohesion: 0.50
Nodes (4): Finpoint, Circular point, Rounded F monogram, Off-white icon fill

### Community 75 - "Local Markdown Issue Tracker"
Cohesion: 0.50
Nodes (4): Local Tracker Operations, Spec and Ticket Files, Ticket Lifecycle, Local Markdown Issue Tracker

### Community 77 - "Google Drive sync"
Cohesion: 0.50
Nodes (4): Google Drive sync, JSON backup and restore, Local-first finance tracking, Sync conflict handling

### Community 78 - "tsconfig.web.json"
Cohesion: 0.29
Nodes (6): ./tsconfig.json, compilerOptions, incremental, exclude, extends, include

### Community 79 - "F monogram icon"
Cohesion: 0.67
Nodes (3): Circular dot beside F, Rounded F letterform, F monogram icon

### Community 80 - "JPG favicon icon"
Cohesion: 0.67
Nodes (3): JPG favicon dot, JPG favicon F letterform, JPG favicon icon

### Community 81 - "PNG favicon icon"
Cohesion: 0.67
Nodes (3): PNG favicon dot, PNG favicon F letterform, PNG favicon icon

### Community 82 - "SVG favicon icon"
Cohesion: 0.67
Nodes (3): SVG favicon dot, SVG favicon F letterform, SVG favicon icon

### Community 83 - "F monogram icon"
Cohesion: 0.67
Nodes (3): Circular dot beside F, Rounded F letterform, F monogram icon

### Community 84 - "F monogram icon"
Cohesion: 0.67
Nodes (3): Circular dot beside F, Rounded F letterform, F monogram icon

### Community 91 - "Issue tracker: Local Markdown"
Cohesion: 0.40
Nodes (4): Files, Issue tracker: Local Markdown, Skill operations, Status and dependencies

### Community 92 - "Domain docs"
Cohesion: 0.50
Nodes (3): Before exploration, Domain docs, Writing

### Community 93 - "collectTests"
Cohesion: 0.67
Nodes (6): collectTests(), disabled(), record(), value(), visit(), visitCallback()

### Community 94 - "What to run"
Cohesion: 0.22
Nodes (8): Browser regression tests, Static behaviour coverage ledger, Fixtures, Shared-fixture test step groups, Native motion frames and zero retries, Rendered assertions, Scoped affected browser checks, What to run

## Knowledge Gaps
- **76 isolated node(s):** `React Compiler (enabled)`, `Root Suspense (keeps routes static)`, `bun install`, `bun run build`, `bun types:check` (+71 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 579 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **10 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `cn()` connect `cn` to `Button`, `sync/page.tsx`, `daily-spending-chart.tsx`, `react`, `total-spending-chart.tsx`, `duplicates/page.tsx`, `utils.ts`, `monthly-budget-usage.tsx`, `budgets/page.tsx`, `luxon`, `pagination.tsx`, `(month)/page.tsx`, `app-sidebar.tsx`, `combobox.tsx`?**
  _High betweenness centrality (0.081) - this node is a cross-community bridge._
- **What connects `React Compiler (enabled)`, `Root Suspense (keeps routes static)`, `bun install` to the rest of the system?**
  _76 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Button` be split into smaller, more focused modules?**
  _Cohesion score 0.05344155844155844 - nodes in this community are weakly interconnected._
- **Why does `@playwright/test` connect `test` to `IDS`, `coverage.e2e.ts`, `widgets.e2e.ts`, `sheet-loading.e2e.ts`, `fixtures.ts`, `package.json`, `editors.e2e.ts`, `workflows.e2e.ts`, `assertions.ts`?**
  _High betweenness centrality (0.073) - this node is a cross-community bridge._
- **Should `sync/page.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.05486918604651163 - nodes in this community are weakly interconnected._
- **Why does `react` connect `react` to `Button`, `sync/page.tsx`, `daily-spending-chart.tsx`, `cn`, `total-spending-chart.tsx`, `duplicates/page.tsx`, `next`, `utils.ts`, `package.json`, `monthly-budget-usage.tsx`, `budgets/page.tsx`, `pagination.tsx`, `luxon`, `auto-sync.ts`, `(month)/page.tsx`, `app-sidebar.tsx`, `combobox.tsx`?**
  _High betweenness centrality (0.070) - this node is a cross-community bridge._
- **Should `daily-spending-chart.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.1361344537815126 - nodes in this community are weakly interconnected._