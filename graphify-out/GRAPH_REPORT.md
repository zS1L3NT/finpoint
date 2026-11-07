# Graph Report - t3-69efe8e6  (2026-11-08)

## Corpus Check
- 265 files · ~240,300 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 9 file(s) not represented in the graph (top: (none) 5, .example 1, .lock 1)

## Summary
- 2011 nodes · 7956 edges · 108 communities (90 shown, 18 thin omitted)
- Extraction: 98% EXTRACTED · 2% INFERRED · 0% AMBIGUOUS · INFERRED: 129 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `4ca0be02`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- record-editor.tsx
- duplicates/page.tsx
- providers.tsx
- lib/motion.ts
- Tests README
- datetime-field.tsx
- auto-sync.ts
- primitives.tsx
- sidebar.tsx
- data.ts
- formatCurrency
- statements.ts
- dashboard.ts
- suggestions.ts
- editors.ts
- compilerOptions
- cn
- icon.tsx
- use-sync-status.ts
- dependencies
- package.json
- Validator
- ledger.e2e.ts
- suspicious
- db.ts
- support/motion.ts
- correctness
- README.md
- sync/page.tsx
- (month)/page.tsx
- Button
- budgets/[id]/page.tsx
- test-data.ts
- components.json
- CONTEXT.md
- types.d.ts
- core/components.e2e.ts
- fixtures.ts
- records.ts
- auth-vault.ts
- routes.ts
- importer.ts
- collectTests
- STYLE.md
- statement-rules.ts
- round2
- logic/settings.ts
- duplicates.ts
- core/routes.e2e.ts
- formatter
- devDependencies
- pagination.tsx
- cashflow-chart.tsx
- biome.json
- rules
- Next.js agent rules block ("This is NOT the Next.js you know")
- manifest.json
- workflows.e2e.ts
- spending-calendar.tsx
- State persistence rule (ephemeral UI state vs IndexedDB)
- src/data/* (persistence, migrations, seeding, backup serialization, Drive storage)
- UI layer
- scripts
- alert-dialog.tsx
- category-history-chart.tsx
- formatter
- navigation.e2e.ts
- Domain docs (single-context layout)
- Commands
- optionalDependencies
- vite.config.ts
- tsconfig.e2e.json
- Comparison window
- style
- 0002 Forecast pacing
- src/components/*
- Validation rule (ValidationError + Validator)
- Finpoint icon concept
- Finpoint icon with charcoal shadow
- Issue tracker: Local Markdown
- Finpoint
- Domain docs
- Local Markdown Issue Tracker
- Dashboard
- Forecast pacing decision
- F monogram icon
- JPG favicon icon
- PNG favicon icon
- SVG favicon icon
- F monogram icon
- F monogram icon
- Legacy Monthly Records redirects
- Finpoint app icon
- Dashboard Attention
- Domain Documentation Conflicts
- Dashboard Attention
- Conventions
- Dashboard shell
- Versioned migrations
- Money out / Money in
- Unrestricted crawler policy
- Calendar day Drill-down
- IndexedDB
- importer.test.ts
- suggestions.test.ts

## God Nodes (most connected - your core abstractions)
1. `cn()` - 325 edges
2. `PrimitivesSection()` - 181 edges
3. `Button()` - 125 edges
4. `react` - 99 edges
5. `formatCurrency()` - 82 edges
6. `RecordEditorDialog()` - 65 edges
7. `UiIcon()` - 59 edges
8. `RecordCreatorDialog()` - 58 edges
9. `round2()` - 48 edges
10. `pluralize()` - 46 edges

## Surprising Connections (you probably didn't know these)
- `Finpoint Style Additions` --references--> `useApiFormErrors()`  [INFERRED]
  STYLE.md → src/hooks/use-api-form-errors.ts
- `Copy` --references--> `pluralize()`  [INFERRED]
  STYLE.md → src/lib/utils.ts
- `Largest selection preserves amount order before pagination` --documents--> `Selection`  [INFERRED]
  docs/adr/0001-drill-down-url-state.md → src/logic/drilldown.ts
- `Finpoint Style Additions` --references--> `ValidationError`  [INFERRED]
  STYLE.md → src/logic/validate.ts
- `Mobile drill-down detents` --documents--> `DrillPanel()`  [EXTRACTED]
  README.md → src/components/drill/panel.tsx

## Import Cycles
- None detected.

## Communities (108 total, 18 thin omitted)

### Community 0 - "record-editor.tsx"
Cohesion: 0.06
Nodes (120): SECTIONS, CandidateResults(), sonner, @tanstack/react-form, AccountDialog(), BudgetCreatorDialog(), BudgetEditorDialog(), CategoryDialog() (+112 more)

### Community 1 - "duplicates/page.tsx"
Cohesion: 0.17
Nodes (47): AccountPage(), AccountsPage(), AllocatorPage(), ScopeSelect(), RecordCreatorHost(), RecordFilters(), RecordsPage(), learnedSignals() (+39 more)

### Community 2 - "providers.tsx"
Cohesion: 0.08
Nodes (36): metadata, RootLayout(), viewport, Boot(), Providers(), react-dom, @vercel/analytics, @vercel/speed-insights (+28 more)

### Community 3 - "lib/motion.ts"
Cohesion: 0.18
Nodes (30): @tanstack/react-table, DataTable(), PaginatedDataTable(), PaginationHeader(), GroupHeaderRow(), groupStarts(), GroupTotal(), isInteractiveTarget() (+22 more)

### Community 4 - "Tests README"
Cohesion: 0.06
Nodes (41): Build harness step (vite build tests/harness), Playwright browser cache keyed on bun.lock, blob report merge, Committed graph artifacts (graph.json, GRAPH_REPORT.md, manifest.json, .graphify_labels.json), Graph health warnings and refresh failure reporting, graphify-out/graph.json, graphify skill (--update), graphify update . (+33 more)

### Community 5 - "datetime-field.tsx"
Cohesion: 0.14
Nodes (24): MonthLayout(), react-day-picker, DateField(), Props, DatetimeField(), parseValue(), Props, toInputValue() (+16 more)

### Community 6 - "auto-sync.ts"
Cohesion: 0.10
Nodes (53): exportData(), SYNC_TABLES, AuthNeededError, cacheToken(), CodeResponse, disconnectDrive(), downloadBackupFile(), driveFetch() (+45 more)

### Community 7 - "primitives.tsx"
Cohesion: 0.07
Nodes (67): class-variance-authority, radix-ui, AlertAction(), ButtonGroup(), ButtonGroupSeparator(), ButtonGroupText(), buttonGroupVariants, ComboboxCollection() (+59 more)

### Community 8 - "sidebar.tsx"
Cohesion: 0.11
Nodes (36): lucide-react, AppHeader(), AppearanceOption, APPEARANCES, AppearanceSwitch(), AppSidebar(), SyncDot(), SYSTEM_APPEARANCE (+28 more)

### Community 9 - "data.ts"
Cohesion: 0.11
Nodes (21): AccountRow, AllocationRow, AnalyticsMonthRow, BudgetRecordRow, BudgetRow, DuplicateDismissalRow, MonthlyBudgetAmountRow, MonthlyBudgetDefaultRow (+13 more)

### Community 10 - "formatCurrency"
Cohesion: 0.12
Nodes (34): nextConfig, dexie-react-hooks, next, AllocationProgress(), AllocationExpansion(), AllocationRows(), AllocationSource, Icon() (+26 more)

### Community 11 - "statements.ts"
Cohesion: 0.19
Nodes (20): asPending(), removeStatementDismissals(), dayDifference(), ensureCanReplace(), maskDescription(), ReplacementAllocation, replacementComparison(), replacementReason() (+12 more)

### Community 12 - "dashboard.ts"
Cohesion: 0.13
Nodes (35): summarize(), avg(), BREAKDOWN_MONTHS, buildCashflowHistory(), buildCategories(), buildComparison(), buildHeadline(), buildMonthlyBudgets() (+27 more)

### Community 13 - "suggestions.ts"
Cohesion: 0.11
Nodes (29): allocatedStatements(), asOf(), byDate(), CHIP_LIMIT, CHOICES, Clue, DEFAULT_WEIGHTS, descriptionTokens() (+21 more)

### Community 14 - "editors.ts"
Cohesion: 0.14
Nodes (20): editors, editors, longName, expectHeldRead(), expectRetainedRows(), expectSilentSheet(), expectVisibleBackdrop(), account (+12 more)

### Community 15 - "compilerOptions"
Cohesion: 0.06
Nodes (33): compilerOptions, allowJs, allowSyntheticDefaultImports, allowUnusedLabels, esModuleInterop, forceConsistentCasingInFileNames, incremental, isolatedModules (+25 more)

### Community 16 - "cn"
Cohesion: 0.14
Nodes (33): CategoryFilter(), CategoryFilterItem(), ComboboxChip(), ComboboxChips(), ComboboxChipsInput(), ComboboxClear(), ComboboxContent(), ComboboxEmpty() (+25 more)

### Community 17 - "icon.tsx"
Cohesion: 0.17
Nodes (16): Largest selection preserves amount order before pagination, CategoryMovers(), Mover, CategorySpendingMix(), MonthlyBudgetUsageItem, DynamicUiIcon(), iconNameSet, loadedIcons (+8 more)

### Community 18 - "use-sync-status.ts"
Cohesion: 0.60
Nodes (4): useSyncStatus(), getSyncSnapshot(), subscribeSync(), SyncSnapshot

### Community 19 - "dependencies"
Cohesion: 0.07
Nodes (30): dependencies, @base-ui/react, class-variance-authority, clsx, cmdk, dexie, dexie-react-hooks, @fontsource-variable/inter (+22 more)

### Community 20 - "package.json"
Cohesion: 0.07
Nodes (28): private, $schema, type, babel-plugin-react-compiler, @base-ui/react, @biomejs/biome, clsx, cmdk (+20 more)

### Community 21 - "Validator"
Cohesion: 0.28
Nodes (16): updateAccount(), validateBudget(), cleanInput(), fixDuplicates(), restoreDuplicatePair(), createMonthlyBudget(), setMonthlyBudgetAmount(), updateMonthlyBudget() (+8 more)

### Community 22 - "ledger.e2e.ts"
Cohesion: 0.11
Nodes (25): behaviourCoverage, componentInventory, facetNotApplicable, InventoryEntry, modalAnimationCoverage, notApplicable, openFacets, RouteEntry (+17 more)

### Community 23 - "suspicious"
Cohesion: 0.07
Nodes (28): suspicious, noAssignInExpressions, noAsyncPromiseExecutor, noCatchAssign, noClassAssign, noCompareNegZero, noControlCharactersInRegex, noDebugger (+20 more)

### Community 24 - "db.ts"
Cohesion: 0.09
Nodes (26): dexie, fake-indexeddb, luxon, CategoryRow, DB_NAME, DB_VERSION, FinpointDB, MetaRow (+18 more)

### Community 25 - "support/motion.ts"
Cohesion: 0.17
Nodes (20): denseCardConsumers, denseRowConsumers, expectConsumerEntrance(), populatedConsumers, attachSamplingFailure(), expectModalEntrance(), expectModalExit(), expectPopupEntrance() (+12 more)

### Community 26 - "correctness"
Cohesion: 0.08
Nodes (26): noConstantCondition, noConstAssign, noEmptyCharacterClassInRegex, noEmptyPattern, noGlobalObjectCalls, noInvalidBuiltinInstantiation, noInvalidConstructorSuper, noNonoctalDecimalEscape (+18 more)

### Community 27 - "README.md"
Cohesion: 0.08
Nodes (24): Allocate workspace, Detail table allocated portions and drill-down Allocations, Backup and restore, Categories, Custom-period Budgets, Demo data, Inline metric and drill-down term definitions, Finpoint (+16 more)

### Community 28 - "sync/page.tsx"
Cohesion: 0.17
Nodes (27): ImporterPage(), Step(), metadata, PrivacyPage(), SECTIONS, COUNT_ROWS, DataSettingsPage(), MethodHeader() (+19 more)

### Community 29 - "(month)/page.tsx"
Cohesion: 0.12
Nodes (25): AttentionList(), Comparison, comparisonText(), ComparisonValue, DashboardData, DashboardMonthlyBudget, DashboardPage(), DashboardView (+17 more)

### Community 30 - "Button"
Cohesion: 0.11
Nodes (34): AccountCard(), AccountRow, BUDGET_STATES, BudgetCard(), BudgetsPage(), BudgetState, formatBudgetDateWindow(), CategoriesPage() (+26 more)

### Community 31 - "budgets/[id]/page.tsx"
Cohesion: 0.10
Nodes (33): BudgetPage(), getBudgetAnalytics(), getCategoryData(), Legend(), RecordPage(), StatementPage(), framer-motion, AllocateBar() (+25 more)

### Community 32 - "test-data.ts"
Cohesion: 0.12
Nodes (25): DEFAULT_CATEGORIES, DEFAULT_MONTHLY_BUDGETS, clearAllData(), downloadExport(), EXPORT_VERSION, FinpointExport, tableCounts(), SEED_HASH_KEY (+17 more)

### Community 33 - "components.json"
Cohesion: 0.09
Nodes (21): aliases, components, hooks, lib, ui, utils, iconLibrary, menuAccent (+13 more)

### Community 34 - "CONTEXT.md"
Cohesion: 0.12
Nodes (21): Account, Allocate, Budget, Category, Drill-down, Duplicate Statement, Irregular, Left over (+13 more)

### Community 35 - "types.d.ts"
Cohesion: 0.10
Nodes (20): Account, Allocation, AnalyticsSummary, AnalyticsTreatment, Appearance, Budget, Category, CategoryWithChildren (+12 more)

### Community 36 - "core/components.e2e.ts"
Cohesion: 0.14
Nodes (11): desktopOnly, @playwright/test, bounds(), contained(), expectWheelScrollsPageWhileOpen(), expectDropdownPreservesScroll(), scrollWithInput(), settledOverlayAlpha() (+3 more)

### Community 37 - "fixtures.ts"
Cohesion: 0.16
Nodes (15): cardTitles, card(), chartTooltip, overview, overviewCharts, themedRgb(), assertSeeded(), checkSeededMarker() (+7 more)

### Community 38 - "records.ts"
Cohesion: 0.11
Nodes (30): AnalyticsRecord, AnalyticsSummary, contribution(), summaryMeasure(), BudgetDetail, BudgetFilters, createBudget(), updateBudget() (+22 more)

### Community 39 - "auth-vault.ts"
Cohesion: 0.29
Nodes (14): POST(), POST(), POST(), jose, AUTH_COOKIE_NAME, authCookie(), authCookieConfig(), clientIp() (+6 more)

### Community 40 - "routes.ts"
Cohesion: 0.19
Nodes (23): NotFound(), ShellHeader(), TITLES, StatementTabs(), useDefaultFilterEndDateToday(), useDefaultFilterStartDate(), useSettings(), buildAttention() (+15 more)

### Community 41 - "importer.ts"
Cohesion: 0.25
Nodes (19): ensureAccount(), combine(), dbsDescriptionKey(), debitCreditAmount(), descriptionKey(), importDbs(), importFiles(), importOcbc() (+11 more)

### Community 42 - "collectTests"
Cohesion: 0.28
Nodes (16): collectTests(), conditionBranch(), detailsTags(), disabled(), mentionsMotion(), record(), splitTestCallee(), tagValues() (+8 more)

### Community 43 - "STYLE.md"
Cohesion: 0.16
Nodes (14): Allocation, APIs, Arguments, And Props, Code Style, Consistency, Copy, Core, Earning Its Place, Finpoint Style Additions (+6 more)

### Community 44 - "statement-rules.ts"
Cohesion: 0.19
Nodes (14): db, StatementRow, TREATMENT_VALUES, byCreation(), conditionPattern(), listStatementRules(), matchesStatement(), NAME_ORDER (+6 more)

### Community 45 - "round2"
Cohesion: 0.21
Nodes (29): PendingCard(), Mobile drill-down detents, DrillPanel(), PendingStatementConfirmationSheet(), RecordOption(), RecordSearchSheet(), StatementOption(), StatementSearchSheet() (+21 more)

### Community 46 - "logic/settings.ts"
Cohesion: 0.48
Nodes (5): DEFAULT_SETTINGS, FinpointSettings, readSettings(), replaceSettings(), getSettings()

### Community 47 - "duplicates.ts"
Cohesion: 0.24
Nodes (14): descriptionAnchors(), descriptionIdentity(), dismissDuplicatePair(), DuplicateGroup, duplicateGroups(), DuplicateStatement, duplicateStatementIds(), eligible() (+6 more)

### Community 48 - "core/routes.e2e.ts"
Cohesion: 0.13
Nodes (17): containedFooter(), Child, october, september, PREMATURE, routeReady, titles, expectPointerCursor() (+9 more)

### Community 49 - "formatter"
Cohesion: 0.15
Nodes (13): arrowParentheses, bracketSameLine, bracketSpacing, jsxQuoteStyle, quoteProperties, quoteStyle, semicolons, trailingCommas (+5 more)

### Community 50 - "devDependencies"
Cohesion: 0.15
Nodes (13): devDependencies, babel-plugin-react-compiler, @biomejs/biome, fake-indexeddb, @playwright/test, @tailwindcss/postcss, @types/luxon, @types/node (+5 more)

### Community 51 - "pagination.tsx"
Cohesion: 0.38
Nodes (11): pageHref(), pageWindow(), PaginationFooter(), Pagination(), PaginationContent(), PaginationEllipsis(), PaginationItem(), PaginationLink() (+3 more)

### Community 52 - "cashflow-chart.tsx"
Cohesion: 0.17
Nodes (17): bar(), BarChart(), BarSeries, PAD, CashflowChart(), CashflowPoint, ChartFrame(), ChartSize (+9 more)

### Community 53 - "biome.json"
Cohesion: 0.18
Nodes (10): source, assist, actions, files, includes, linter, enabled, overrides (+2 more)

### Community 54 - "rules"
Cohesion: 0.18
Nodes (11): noAdjacentSpacesInRegex, noBannedTypes, noExtraBooleanCast, noUselessCatch, noUselessThisAlias, noUselessTypeConstraint, rules, noFloatingPromises (+3 more)

### Community 55 - "Next.js agent rules block ("This is NOT the Next.js you know")"
Cohesion: 0.22
Nodes (7): app/api/auth/* Route Handlers, node_modules/next/dist/server/lib/generate-agent-files.js, Google OAuth broker (exchange/token/logout), Next.js App Router app (mostly client-side), node_modules/next/dist/docs/, npm run dev (port 5173), Verification

### Community 56 - "manifest.json"
Cohesion: 0.20
Nodes (9): background_color, description, display, icons, name, scope, short_name, start_url (+1 more)

### Community 58 - "spending-calendar.tsx"
Cohesion: 0.29
Nodes (9): compact(), heat(), INK, LEVELS, quantile(), rampCap(), SpendingCalendar(), STRENGTH (+1 more)

### Community 59 - "State persistence rule (ephemeral UI state vs IndexedDB)"
Cohesion: 0.22
Nodes (6): app/**/page.tsx, Interactive routes are "use client" (search params via next/navigation), Pages take no props, Root Suspense (keeps routes static), URL search params (filters and pagination), useLiveQuery

### Community 60 - "src/data/* (persistence, migrations, seeding, backup serialization, Drive storage)"
Cohesion: 0.36
Nodes (7): Background Drive sync, bun test, src/data/* (persistence, migrations, seeding, backup serialization, Drive storage), IndexedDB (Dexie), Domain and importer tests (Dexie with in-memory IndexedDB), src/logic/* (domain reads and operations), Workspace backup/reset operations

### Community 61 - "UI layer"
Cohesion: 0.31
Nodes (8): Domain logic, Dashboard month route-group shell, Persistence, Project Shape, React Compiler (enabled), src/routes.ts (centralized route paths), Static content pages (privacy, terms) are server components, UI layer

### Community 62 - "scripts"
Cohesion: 0.22
Nodes (9): scripts, build, dev, lint, lint:check, start, test:e2e, types:check (+1 more)

### Community 63 - "alert-dialog.tsx"
Cohesion: 0.34
Nodes (12): DriveOverwriteConfirmation(), AlertDialog(), AlertDialogAction(), AlertDialogCancel(), AlertDialogContent(), AlertDialogDescription(), AlertDialogFooter(), AlertDialogHeader() (+4 more)

### Community 64 - "category-history-chart.tsx"
Cohesion: 0.31
Nodes (10): aggregateSeries(), CategoryHistoryChart(), ChartMonth, ChartSeries, MonthBreakdown(), MonthTick(), monthTotal(), prepareMonths() (+2 more)

### Community 65 - "formatter"
Cohesion: 0.25
Nodes (8): formatter, attributePosition, enabled, formatWithErrors, indentStyle, indentWidth, lineEnding, lineWidth

### Community 67 - "Domain docs (single-context layout)"
Cohesion: 0.33
Nodes (7): Agent skills, CONTEXT.md, Domain docs (single-context layout), Domain Language, Issue tracker (local specs and tickets), .scratch/ local work tracking, String primary keys (not auto-increment)

### Community 68 - "Commands"
Cohesion: 0.38
Nodes (7): Biome (biome check --write), bun install, bun lint (write-mode), bun lint:check, bun run build, bun types:check, Commands

### Community 69 - "optionalDependencies"
Cohesion: 0.29
Nodes (7): optionalDependencies, lightningcss-linux-x64-gnu, lightningcss-win32-x64-msvc, @rollup/rollup-linux-x64-gnu, @rollup/rollup-win32-x64-msvc, @tailwindcss/oxide-linux-x64-gnu, @tailwindcss/oxide-win32-x64-msvc

### Community 70 - "vite.config.ts"
Cohesion: 0.29
Nodes (4): vite, @vitejs/plugin-react, harnessDir, repoRoot

### Community 71 - "tsconfig.e2e.json"
Cohesion: 0.29
Nodes (6): ./tsconfig.json, compilerOptions, incremental, exclude, extends, include

### Community 72 - "Comparison window"
Cohesion: 0.33
Nodes (5): Compare selection uses included comparison months and title-based uniqueness, Gross and net category selection URL, Comparison window, Drill-down URL state, Biggest changes compares same-period net Spending Records

### Community 73 - "style"
Cohesion: 0.33
Nodes (6): style, noNamespace, noNonNullAssertion, useArrayLiterals, useAsConstAssertion, useBlockStatements

### Community 74 - "0002 Forecast pacing"
Cohesion: 0.33
Nodes (5): 0002 Forecast pacing, Consequences, Context, Decision, Rejected option

### Community 75 - "src/components/*"
Cohesion: 0.40
Nodes (4): Agent Behavior, Generated / Ignored Files, src/components/*, src/components/ui/**/*

### Community 76 - "Validation rule (ValidationError + Validator)"
Cohesion: 0.50
Nodes (4): Old Laravel Api/*Controller mapping, Laravel-shaped { field: string[] } error maps, ValidationError, Validator

### Community 77 - "Finpoint icon concept"
Cohesion: 0.40
Nodes (5): Finpoint icon concept, Charcoal shadow halo, Circular point, Rounded F monogram, Off-white icon fill

### Community 78 - "Finpoint icon with charcoal shadow"
Cohesion: 0.40
Nodes (5): Finpoint icon with charcoal shadow, Charcoal shadow halo, Circular point, Rounded F monogram, Off-white icon fill

### Community 79 - "Issue tracker: Local Markdown"
Cohesion: 0.40
Nodes (4): Files, Issue tracker: Local Markdown, Skill operations, Status and dependencies

### Community 80 - "Finpoint"
Cohesion: 0.50
Nodes (4): Finpoint, Circular point, Rounded F monogram, Off-white icon fill

### Community 81 - "Domain docs"
Cohesion: 0.50
Nodes (3): Before exploration, Domain docs, Writing

### Community 82 - "Local Markdown Issue Tracker"
Cohesion: 0.50
Nodes (4): Local Tracker Operations, Spec and Ticket Files, Ticket Lifecycle, Local Markdown Issue Tracker

### Community 84 - "Dashboard"
Cohesion: 0.50
Nodes (4): Dashboard, Dashboard natural card heights, Empty month offers latest recorded month, Empty workspace import and demo start state

### Community 85 - "Forecast pacing decision"
Cohesion: 0.67
Nodes (3): Forecast pacing decision, Remaining historical spending scaled by remaining days, Median daily spending fallback including zero days

### Community 86 - "F monogram icon"
Cohesion: 0.67
Nodes (3): Circular dot beside F, Rounded F letterform, F monogram icon

### Community 87 - "JPG favicon icon"
Cohesion: 0.67
Nodes (3): JPG favicon dot, JPG favicon F letterform, JPG favicon icon

### Community 88 - "PNG favicon icon"
Cohesion: 0.67
Nodes (3): PNG favicon dot, PNG favicon F letterform, PNG favicon icon

### Community 89 - "SVG favicon icon"
Cohesion: 0.67
Nodes (3): SVG favicon dot, SVG favicon F letterform, SVG favicon icon

### Community 90 - "F monogram icon"
Cohesion: 0.67
Nodes (3): Circular dot beside F, Rounded F letterform, F monogram icon

### Community 91 - "F monogram icon"
Cohesion: 0.67
Nodes (3): Circular dot beside F, Rounded F letterform, F monogram icon

### Community 107 - "suggestions.test.ts"
Cohesion: 0.53
Nodes (4): decided(), live(), record(), statement()

## Knowledge Gaps
- **129 isolated node(s):** `@fontsource-variable/inter`, `shadcn`, `tailwindcss`, `tw-animate-css`, `@biomejs/biome` (+124 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 642 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **18 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `cn()` connect `cn` to `record-editor.tsx`, `duplicates/page.tsx`, `lib/motion.ts`, `datetime-field.tsx`, `primitives.tsx`, `sidebar.tsx`, `formatCurrency`, `icon.tsx`, `sync/page.tsx`, `(month)/page.tsx`, `Button`, `budgets/[id]/page.tsx`, `routes.ts`, `round2`, `pagination.tsx`, `cashflow-chart.tsx`, `spending-calendar.tsx`, `alert-dialog.tsx`, `category-history-chart.tsx`?**
  _High betweenness centrality (0.105) - this node is a cross-community bridge._
- **What connects `@fontsource-variable/inter`, `shadcn`, `tailwindcss` to the rest of the system?**
  _129 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `record-editor.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.06291390728476821 - nodes in this community are weakly interconnected._
- **Why does `src/data/* (persistence, migrations, seeding, backup serialization, Drive storage)` connect `src/data/* (persistence, migrations, seeding, backup serialization, Drive storage)` to `providers.tsx`, `UI layer`?**
  _High betweenness centrality (0.079) - this node is a cross-community bridge._
- **Should `providers.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.080338266384778 - nodes in this community are weakly interconnected._
- **Why does `react` connect `Button` to `record-editor.tsx`, `duplicates/page.tsx`, `providers.tsx`, `lib/motion.ts`, `datetime-field.tsx`, `primitives.tsx`, `sidebar.tsx`, `formatCurrency`, `cn`, `icon.tsx`, `use-sync-status.ts`, `package.json`, `sync/page.tsx`, `(month)/page.tsx`, `budgets/[id]/page.tsx`, `routes.ts`, `round2`, `pagination.tsx`, `cashflow-chart.tsx`, `spending-calendar.tsx`, `alert-dialog.tsx`, `category-history-chart.tsx`?**
  _High betweenness centrality (0.063) - this node is a cross-community bridge._
- **Should `Tests README` be split into smaller, more focused modules?**
  _Cohesion score 0.05928614640048397 - nodes in this community are weakly interconnected._