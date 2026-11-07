# Graph Report - t3-69efe8e6  (2026-11-07)

## Corpus Check
- 264 files · ~238,511 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 9 file(s) not represented in the graph (top: (none) 5, .example 1, .lock 1)

## Summary
- 1988 nodes · 7946 edges · 94 communities (83 shown, 11 thin omitted)
- Extraction: 98% EXTRACTED · 2% INFERRED · 0% AMBIGUOUS · INFERRED: 128 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `afae7a87`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- react
- Button
- (month)/page.tsx
- sidebar.tsx
- auto-sync.ts
- Tests README
- routes.ts
- category-history-chart.tsx
- lib/motion.ts
- monthpicker.tsx
- providers.tsx
- db.ts
- dashboard.ts
- primitives.tsx
- records.ts
- editors.ts
- compilerOptions
- suggestions.ts
- paginated-data-table.tsx
- package.json
- dependencies
- cn
- statements.ts
- ledger.e2e.ts
- suspicious
- test
- sync/page.tsx
- support/motion.ts
- correctness
- monthly-budgets.test.ts
- README.md
- Validator
- displays.tsx
- utils.ts
- export-import.ts
- components.json
- CONTEXT.md
- types.d.ts
- importer.ts
- statement-rules.ts
- auth-vault.ts
- duplicates.ts
- core/routes.e2e.ts
- fixtures.ts
- core/components.e2e.ts
- alert-dialog.tsx
- UI layer (app pages + components)
- formatter
- devDependencies
- luxon
- pagination.tsx
- biome.json
- rules
- workflows.e2e.ts
- src/data/* (persistence, migrations, seeding, backup serialization, Drive storage)
- manifest.json
- Next.js agent rules block ("This is NOT the Next.js you know")
- STYLE.md
- scripts
- src/components/*
- formatter
- animations/tables.e2e.ts
- navigation.e2e.ts
- Domain docs (single-context layout)
- Commands
- optionalDependencies
- app.tsx
- tsconfig.e2e.json
- style
- 0002 Forecast pacing
- Code Style
- Validation rule (ValidationError + Validator)
- Finpoint icon concept
- Finpoint icon with charcoal shadow
- Issue tracker: Local Markdown
- Finpoint
- Domain docs
- Local Markdown Issue Tracker
- Forecast pacing decision
- 0001-drill-down-url-state.md
- F monogram icon
- JPG favicon icon
- PNG favicon icon
- SVG favicon icon
- F monogram icon
- F monogram icon
- Finpoint app icon
- Domain Documentation Conflicts
- Conventions
- Unrestricted crawler policy
- Calendar day Drill-down

## God Nodes (most connected - your core abstractions)
1. `cn()` - 324 edges
2. `PrimitivesSection()` - 181 edges
3. `Button()` - 127 edges
4. `react` - 100 edges
5. `formatCurrency()` - 78 edges
6. `RecordEditorDialog()` - 65 edges
7. `RecordCreatorDialog()` - 58 edges
8. `UiIcon()` - 56 edges
9. `round2()` - 48 edges
10. `pluralize()` - 44 edges

## Surprising Connections (you probably didn't know these)
- `Copy` --references--> `pluralize()`  [INFERRED]
  STYLE.md → src/lib/utils.ts
- `Largest selection preserves amount order before pagination` --documents--> `Selection`  [INFERRED]
  docs/adr/0001-drill-down-url-state.md → src/logic/drilldown.ts
- `Finpoint Style Additions` --references--> `useApiFormErrors()`  [INFERRED]
  STYLE.md → src/hooks/use-api-form-errors.ts
- `Finpoint Style Additions` --references--> `ValidationError`  [INFERRED]
  STYLE.md → src/logic/validate.ts
- `Boot()` --indirect_call--> `preloadCategoryIcons()`  [INFERRED]
  app/providers.tsx → src/components/icon.tsx

## Import Cycles
- None detected.

## Communities (94 total, 11 thin omitted)

### Community 0 - "react"
Cohesion: 0.05
Nodes (143): AccountPage(), AccountCard(), AccountRow, AccountsPage(), AllocatorPage(), BUDGET_STATES, BudgetCard(), BudgetsPage() (+135 more)

### Community 1 - "Button"
Cohesion: 0.06
Nodes (129): CategoryTile(), SECTIONS, ImporterPage(), Step(), EmptyRecords(), metadata, PrivacyPage(), SECTIONS (+121 more)

### Community 2 - "(month)/page.tsx"
Cohesion: 0.19
Nodes (15): Comparison, comparisonText(), ComparisonValue, DashboardData, DashboardMonthlyBudget, DashboardPage(), DashboardView, DemoOffer() (+7 more)

### Community 3 - "sidebar.tsx"
Cohesion: 0.09
Nodes (41): AppearanceOption, APPEARANCES, AppearanceSwitch(), AppSidebar(), SyncDot(), SYSTEM_APPEARANCE, useSyncIndicator(), DEFINITIONS (+33 more)

### Community 4 - "auto-sync.ts"
Cohesion: 0.11
Nodes (49): exportData(), AuthNeededError, cacheToken(), CodeResponse, disconnectDrive(), downloadBackupFile(), driveFetch(), DriveFileMeta (+41 more)

### Community 5 - "Tests README"
Cohesion: 0.06
Nodes (41): Build harness step (vite build tests/harness), Playwright browser cache keyed on bun.lock, blob report merge, Committed graph artifacts (graph.json, GRAPH_REPORT.md, manifest.json, .graphify_labels.json), Graph health warnings and refresh failure reporting, graphify-out/graph.json, graphify skill (--update), graphify update . (+33 more)

### Community 6 - "routes.ts"
Cohesion: 0.19
Nodes (20): ReviewLinks(), NotFound(), Template(), nextConfig, next, ShellHeader(), TITLES, useDrill() (+12 more)

### Community 7 - "category-history-chart.tsx"
Cohesion: 0.13
Nodes (23): Largest selection preserves amount order before pagination, CashflowChart(), CashflowPoint, aggregateSeries(), CategoryHistoryChart(), ChartMonth, ChartSeries, MonthBreakdown() (+15 more)

### Community 8 - "lib/motion.ts"
Cohesion: 0.23
Nodes (12): MonthLayout(), framer-motion, useMonthParams(), armMonthTransition(), STALE_MONTH_CLASS, cascadeDelay(), CHART_INTRO_MS, DRILL_PIVOT (+4 more)

### Community 9 - "monthpicker.tsx"
Cohesion: 0.33
Nodes (6): ButtonVariant, Month, MonthCal(), MonthCalProps, MonthPicker(), MONTHS

### Community 10 - "providers.tsx"
Cohesion: 0.13
Nodes (26): metadata, RootLayout(), viewport, Boot(), Providers(), lucide-react, SidebarInset(), Toaster() (+18 more)

### Community 11 - "db.ts"
Cohesion: 0.09
Nodes (32): AccountRow, AllocationRow, AnalyticsMonthRow, BudgetRecordRow, BudgetRow, CategoryRow, DB_NAME, DB_VERSION (+24 more)

### Community 12 - "dashboard.ts"
Cohesion: 0.14
Nodes (35): contribution(), summarize(), avg(), BREAKDOWN_MONTHS, buildCashflowHistory(), buildCategories(), buildComparison(), buildMonthlyBudgets() (+27 more)

### Community 13 - "primitives.tsx"
Cohesion: 0.07
Nodes (65): class-variance-authority, radix-ui, AppHeader(), AlertAction(), ButtonGroup(), ButtonGroupSeparator(), ButtonGroupText(), buttonGroupVariants (+57 more)

### Community 14 - "records.ts"
Cohesion: 0.12
Nodes (23): db, AnalyticsRecord, AnalyticsSummary, summaryMeasure(), BudgetDetail, BudgetFilters, getDrilldown(), getDrillStatement() (+15 more)

### Community 15 - "editors.ts"
Cohesion: 0.13
Nodes (20): editors, editors, longName, expectHeldRead(), expectRetainedRows(), expectSilentSheet(), IDS, statementRules() (+12 more)

### Community 16 - "compilerOptions"
Cohesion: 0.06
Nodes (33): compilerOptions, allowJs, allowSyntheticDefaultImports, allowUnusedLabels, esModuleInterop, forceConsistentCasingInFileNames, incremental, isolatedModules (+25 more)

### Community 17 - "suggestions.ts"
Cohesion: 0.11
Nodes (31): allocatedStatements(), asOf(), byDate(), CHIP_LIMIT, CHOICES, Clue, DEFAULT_WEIGHTS, descriptionTokens() (+23 more)

### Community 18 - "paginated-data-table.tsx"
Cohesion: 0.22
Nodes (25): @tanstack/react-table, DataTable(), PaginatedDataTable(), GroupHeaderRow(), groupStarts(), GroupTotal(), isInteractiveTarget(), LeavingRows() (+17 more)

### Community 19 - "package.json"
Cohesion: 0.07
Nodes (27): private, $schema, type, babel-plugin-react-compiler, @biomejs/biome, clsx, cmdk, @fontsource-variable/inter (+19 more)

### Community 20 - "dependencies"
Cohesion: 0.07
Nodes (30): dependencies, @base-ui/react, class-variance-authority, clsx, cmdk, dexie, dexie-react-hooks, @fontsource-variable/inter (+22 more)

### Community 21 - "cn"
Cohesion: 0.12
Nodes (34): ComboboxField(), ComboboxChip(), ComboboxChips(), ComboboxChipsInput(), ComboboxClear(), ComboboxCollection(), ComboboxContent(), ComboboxEmpty() (+26 more)

### Community 22 - "statements.ts"
Cohesion: 0.18
Nodes (21): asPending(), removeStatementDismissals(), dayDifference(), ensureCanReplace(), maskDescription(), ReplacementAllocation, replacementComparison(), replacementReason() (+13 more)

### Community 23 - "ledger.e2e.ts"
Cohesion: 0.07
Nodes (46): typescript, vite, @vitejs/plugin-react, behaviourCoverage, componentInventory, facetNotApplicable, InventoryEntry, modalAnimationCoverage (+38 more)

### Community 24 - "suspicious"
Cohesion: 0.07
Nodes (28): suspicious, noAssignInExpressions, noAsyncPromiseExecutor, noCatchAssign, noClassAssign, noCompareNegZero, noControlCharactersInRegex, noDebugger (+20 more)

### Community 25 - "test"
Cohesion: 0.23
Nodes (8): cardTitles, card(), chartTooltip, overview, overviewCharts, themedRgb(), seedWorkspace(), test

### Community 26 - "sync/page.tsx"
Cohesion: 0.12
Nodes (28): COUNT_ROWS, DataSettingsPage(), StateRow(), STATUS_TONES, StatusTone, WorkspaceRow(), clearAllData(), downloadExport() (+20 more)

### Community 27 - "support/motion.ts"
Cohesion: 0.26
Nodes (13): expectVisibleBackdrop(), attachSamplingFailure(), expectModalEntrance(), expectModalExit(), expectPopupEntrance(), matrixIsIdentity(), MotionFrame, MotionPose (+5 more)

### Community 28 - "correctness"
Cohesion: 0.08
Nodes (26): noConstantCondition, noConstAssign, noEmptyCharacterClassInRegex, noEmptyPattern, noGlobalObjectCalls, noInvalidBuiltinInstantiation, noInvalidConstructorSuper, noNonoctalDecimalEscape (+18 more)

### Community 29 - "monthly-budgets.test.ts"
Cohesion: 0.10
Nodes (14): dexie, fake-indexeddb, xlsx, digestSnapshot(), hashLegacySnapshot(), Snapshot, input, legacyPaceKey (+6 more)

### Community 30 - "README.md"
Cohesion: 0.08
Nodes (24): Allocate workspace, Allocations, Backup and restore, Categories, Custom-period Budgets, Dashboard, Demo data, Financial terms definitions (+16 more)

### Community 31 - "Validator"
Cohesion: 0.25
Nodes (18): updateAccount(), createBudget(), validateBudget(), cleanInput(), fixDuplicates(), restoreDuplicatePair(), createMonthlyBudget(), setMonthlyBudgetAmount() (+10 more)

### Community 32 - "displays.tsx"
Cohesion: 0.33
Nodes (9): Sparkline(), DetailSummary(), DetailSummaryItem(), Delta, Metric(), ValueSwap(), Displays(), record (+1 more)

### Community 33 - "utils.ts"
Cohesion: 0.07
Nodes (77): BudgetPage(), getBudgetAnalytics(), getCategoryData(), Legend(), MonthlyRecordsPage(), PendingCard(), AllocateBar(), AllocationProgress() (+69 more)

### Community 34 - "export-import.ts"
Cohesion: 0.10
Nodes (29): DEFAULT_CATEGORIES, DEFAULT_MONTHLY_BUDGETS, EXPORT_VERSION, FinpointExport, monthlyBudgetFields(), SYNC_TABLES, TableName, TABLES (+21 more)

### Community 35 - "components.json"
Cohesion: 0.09
Nodes (21): aliases, components, hooks, lib, ui, utils, iconLibrary, menuAccent (+13 more)

### Community 36 - "CONTEXT.md"
Cohesion: 0.09
Nodes (21): Account, Allocate, Budget, Category, Drill-down, Duplicate Statement, Irregular, Left over (+13 more)

### Community 37 - "types.d.ts"
Cohesion: 0.10
Nodes (20): Account, Allocation, AnalyticsSummary, AnalyticsTreatment, Appearance, Budget, Category, CategoryWithChildren (+12 more)

### Community 38 - "importer.ts"
Cohesion: 0.23
Nodes (20): papaparse, ensureAccount(), combine(), dbsDescriptionKey(), debitCreditAmount(), descriptionKey(), importDbs(), importFiles() (+12 more)

### Community 39 - "statement-rules.ts"
Cohesion: 0.22
Nodes (13): byCreation(), conditionPattern(), deleteStatementRule(), listStatementRules(), matchesStatement(), NAME_ORDER, previewStatementRule(), recommendationAutofill() (+5 more)

### Community 40 - "auth-vault.ts"
Cohesion: 0.29
Nodes (14): POST(), POST(), POST(), jose, AUTH_COOKIE_NAME, authCookie(), authCookieConfig(), clientIp() (+6 more)

### Community 41 - "duplicates.ts"
Cohesion: 0.24
Nodes (14): descriptionAnchors(), descriptionIdentity(), dismissDuplicatePair(), DuplicateGroup, duplicateGroups(), DuplicateStatement, duplicateStatementIds(), eligible() (+6 more)

### Community 42 - "core/routes.e2e.ts"
Cohesion: 0.23
Nodes (9): containedFooter(), PREMATURE, routeReady, titles, expectPointerCursor(), getScenario(), fits(), patchRows() (+1 more)

### Community 43 - "fixtures.ts"
Cohesion: 0.18
Nodes (14): @playwright/test, Child, october, september, installDateOnly(), revisions, setDateOnly(), assertSeeded() (+6 more)

### Community 44 - "core/components.e2e.ts"
Cohesion: 0.15
Nodes (9): desktopOnly, bounds(), contained(), expectWheelScrollsPageWhileOpen(), expectDropdownPreservesScroll(), scrollWithInput(), settledOverlayAlpha(), APP_URL (+1 more)

### Community 45 - "alert-dialog.tsx"
Cohesion: 0.34
Nodes (12): DriveOverwriteConfirmation(), AlertDialog(), AlertDialogAction(), AlertDialogCancel(), AlertDialogContent(), AlertDialogDescription(), AlertDialogFooter(), AlertDialogHeader() (+4 more)

### Community 46 - "UI layer (app pages + components)"
Cohesion: 0.22
Nodes (11): app/**/page.tsx, Interactive routes are "use client" (search params via next/navigation), (month) route-group shell (Overview + Monthly Records), Pages take no props, Project Shape, React Compiler (enabled), Root Suspense (keeps routes static), src/routes.ts (centralized route paths) (+3 more)

### Community 47 - "formatter"
Cohesion: 0.15
Nodes (13): arrowParentheses, bracketSameLine, bracketSpacing, jsxQuoteStyle, quoteProperties, quoteStyle, semicolons, trailingCommas (+5 more)

### Community 48 - "devDependencies"
Cohesion: 0.15
Nodes (13): devDependencies, babel-plugin-react-compiler, @biomejs/biome, fake-indexeddb, @playwright/test, @tailwindcss/postcss, @types/luxon, @types/node (+5 more)

### Community 49 - "luxon"
Cohesion: 0.21
Nodes (11): luxon, compact(), heat(), INK, LEVELS, quantile(), rampCap(), SpendingCalendar() (+3 more)

### Community 50 - "pagination.tsx"
Cohesion: 0.38
Nodes (11): pageHref(), pageWindow(), PaginationFooter(), Pagination(), PaginationContent(), PaginationEllipsis(), PaginationItem(), PaginationLink() (+3 more)

### Community 51 - "biome.json"
Cohesion: 0.18
Nodes (10): source, assist, actions, files, includes, linter, enabled, overrides (+2 more)

### Community 52 - "rules"
Cohesion: 0.18
Nodes (11): noAdjacentSpacesInRegex, noBannedTypes, noExtraBooleanCast, noUselessCatch, noUselessThisAlias, noUselessTypeConstraint, rules, noFloatingPromises (+3 more)

### Community 54 - "src/data/* (persistence, migrations, seeding, backup serialization, Drive storage)"
Cohesion: 0.31
Nodes (8): Background Drive sync, bun test, src/data/* (persistence, migrations, seeding, backup serialization, Drive storage), IndexedDB (Dexie), Domain and importer tests (Dexie with in-memory IndexedDB), src/logic/* (domain reads and operations), Verification, Workspace backup/reset operations

### Community 55 - "manifest.json"
Cohesion: 0.20
Nodes (9): background_color, description, display, icons, name, scope, short_name, start_url (+1 more)

### Community 56 - "Next.js agent rules block ("This is NOT the Next.js you know")"
Cohesion: 0.25
Nodes (6): app/api/auth/* Route Handlers, node_modules/next/dist/server/lib/generate-agent-files.js, Google OAuth broker (exchange/token/logout), Next.js App Router app (mostly client-side), node_modules/next/dist/docs/, npm run dev (port 5173)

### Community 57 - "STYLE.md"
Cohesion: 0.28
Nodes (7): Allocation, Copy, Earning Its Place, Motion and polish, React / TypeScript style (import type, isOpen/setIsOpen), React / TypeScript Style, Style Guide

### Community 58 - "scripts"
Cohesion: 0.22
Nodes (9): scripts, build, dev, lint, lint:check, start, test:e2e, types:check (+1 more)

### Community 59 - "src/components/*"
Cohesion: 0.25
Nodes (5): Agent Behavior, Generated / Ignored Files, src/components/*, src/components/ui/**/*, useLiveQuery

### Community 60 - "formatter"
Cohesion: 0.25
Nodes (8): formatter, attributePosition, enabled, formatWithErrors, indentStyle, indentWidth, lineEnding, lineWidth

### Community 61 - "animations/tables.e2e.ts"
Cohesion: 0.29
Nodes (9): denseCardConsumers, denseRowConsumers, expectConsumerEntrance(), populatedConsumers, pickOption(), expectReducedRowMovement(), expectVisibleRowCascade(), MotionConsumer (+1 more)

### Community 63 - "Domain docs (single-context layout)"
Cohesion: 0.33
Nodes (7): Agent skills, CONTEXT.md, Domain docs (single-context layout), Domain Language, Issue tracker (local specs and tickets), .scratch/ local work tracking, String primary keys (not auto-increment)

### Community 64 - "Commands"
Cohesion: 0.38
Nodes (7): Biome (biome check --write), bun install, bun lint (write-mode), bun lint:check, bun run build, bun types:check, Commands

### Community 65 - "optionalDependencies"
Cohesion: 0.29
Nodes (7): optionalDependencies, lightningcss-linux-x64-gnu, lightningcss-win32-x64-msvc, @rollup/rollup-linux-x64-gnu, @rollup/rollup-win32-x64-msvc, @tailwindcss/oxide-linux-x64-gnu, @tailwindcss/oxide-win32-x64-msvc

### Community 66 - "app.tsx"
Cohesion: 0.32
Nodes (5): react-dom, App(), HarnessSection, sectionFromLocation(), root

### Community 67 - "tsconfig.e2e.json"
Cohesion: 0.29
Nodes (6): ./tsconfig.json, compilerOptions, incremental, exclude, extends, include

### Community 68 - "style"
Cohesion: 0.33
Nodes (6): style, noNamespace, noNonNullAssertion, useArrayLiterals, useAsConstAssertion, useBlockStatements

### Community 69 - "0002 Forecast pacing"
Cohesion: 0.33
Nodes (5): 0002 Forecast pacing, Consequences, Context, Decision, Rejected option

### Community 70 - "Code Style"
Cohesion: 0.33
Nodes (6): APIs, Arguments, And Props, Code Style, Consistency, Core, Grouping And Order, Variables And Names

### Community 71 - "Validation rule (ValidationError + Validator)"
Cohesion: 0.50
Nodes (4): Old Laravel Api/*Controller mapping, Laravel-shaped { field: string[] } error maps, ValidationError, Validator

### Community 72 - "Finpoint icon concept"
Cohesion: 0.40
Nodes (5): Finpoint icon concept, Charcoal shadow halo, Circular point, Rounded F monogram, Off-white icon fill

### Community 73 - "Finpoint icon with charcoal shadow"
Cohesion: 0.40
Nodes (5): Finpoint icon with charcoal shadow, Charcoal shadow halo, Circular point, Rounded F monogram, Off-white icon fill

### Community 74 - "Issue tracker: Local Markdown"
Cohesion: 0.40
Nodes (4): Files, Issue tracker: Local Markdown, Skill operations, Status and dependencies

### Community 75 - "Finpoint"
Cohesion: 0.50
Nodes (4): Finpoint, Circular point, Rounded F monogram, Off-white icon fill

### Community 76 - "Domain docs"
Cohesion: 0.50
Nodes (3): Before exploration, Domain docs, Writing

### Community 77 - "Local Markdown Issue Tracker"
Cohesion: 0.50
Nodes (4): Local Tracker Operations, Spec and Ticket Files, Ticket Lifecycle, Local Markdown Issue Tracker

### Community 79 - "Forecast pacing decision"
Cohesion: 0.67
Nodes (3): Forecast pacing decision, Remaining historical spending scaled by remaining days, Median daily spending fallback including zero days

### Community 81 - "F monogram icon"
Cohesion: 0.67
Nodes (3): Circular dot beside F, Rounded F letterform, F monogram icon

### Community 82 - "JPG favicon icon"
Cohesion: 0.67
Nodes (3): JPG favicon dot, JPG favicon F letterform, JPG favicon icon

### Community 83 - "PNG favicon icon"
Cohesion: 0.67
Nodes (3): PNG favicon dot, PNG favicon F letterform, PNG favicon icon

### Community 84 - "SVG favicon icon"
Cohesion: 0.67
Nodes (3): SVG favicon dot, SVG favicon F letterform, SVG favicon icon

### Community 85 - "F monogram icon"
Cohesion: 0.67
Nodes (3): Circular dot beside F, Rounded F letterform, F monogram icon

### Community 86 - "F monogram icon"
Cohesion: 0.67
Nodes (3): Circular dot beside F, Rounded F letterform, F monogram icon

## Knowledge Gaps
- **120 isolated node(s):** `@fontsource-variable/inter`, `shadcn`, `tailwindcss`, `tw-animate-css`, `@biomejs/biome` (+115 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 634 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **11 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `cn()` connect `cn` to `react`, `Button`, `(month)/page.tsx`, `utils.ts`, `displays.tsx`, `sidebar.tsx`, `routes.ts`, `category-history-chart.tsx`, `lib/motion.ts`, `monthpicker.tsx`, `providers.tsx`, `primitives.tsx`, `alert-dialog.tsx`, `luxon`, `paginated-data-table.tsx`, `pagination.tsx`, `sync/page.tsx`?**
  _High betweenness centrality (0.095) - this node is a cross-community bridge._
- **What connects `@fontsource-variable/inter`, `shadcn`, `tailwindcss` to the rest of the system?**
  _120 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `react` be split into smaller, more focused modules?**
  _Cohesion score 0.0504780727525239 - nodes in this community are weakly interconnected._
- **Why does `src/data/* (persistence, migrations, seeding, backup serialization, Drive storage)` connect `src/data/* (persistence, migrations, seeding, backup serialization, Drive storage)` to `providers.tsx`, `UI layer (app pages + components)`?**
  _High betweenness centrality (0.078) - this node is a cross-community bridge._
- **Should `Button` be split into smaller, more focused modules?**
  _Cohesion score 0.0642586471015077 - nodes in this community are weakly interconnected._
- **Why does `react` connect `react` to `Button`, `(month)/page.tsx`, `sidebar.tsx`, `routes.ts`, `category-history-chart.tsx`, `lib/motion.ts`, `monthpicker.tsx`, `providers.tsx`, `primitives.tsx`, `paginated-data-table.tsx`, `package.json`, `cn`, `sync/page.tsx`, `displays.tsx`, `utils.ts`, `alert-dialog.tsx`, `luxon`, `pagination.tsx`, `app.tsx`?**
  _High betweenness centrality (0.073) - this node is a cross-community bridge._
- **Should `sidebar.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.08788159111933395 - nodes in this community are weakly interconnected._