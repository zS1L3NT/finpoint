# Graph Report - t3-69efe8e6  (2026-11-08)

## Corpus Check
- cluster-only mode — file stats not available

## Summary
- 2009 nodes · 7964 edges · 104 communities (87 shown, 17 thin omitted)
- Extraction: 98% EXTRACTED · 2% INFERRED · 0% AMBIGUOUS · INFERRED: 129 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `aabad3b8`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- record-editor.tsx
- export-import.ts
- auto-sync.ts
- duplicates/page.tsx
- Tests README
- providers.tsx
- sidebar.tsx
- dashboard.ts
- primitives.tsx
- utils.ts
- Button
- lib/motion.ts
- records.ts
- statements.ts
- cn
- db.ts
- suggestions.ts
- react
- editors.ts
- compilerOptions
- ref_types
- dependencies
- cashflow-chart.tsx
- ledger.e2e.ts
- suspicious
- package.json
- fixtures.ts
- (month)/page.tsx
- importer.ts
- Validator
- support/motion.ts
- correctness
- README.md
- ui/field.tsx
- importer/page.tsx
- routes.ts
- budgets/[id]/page.tsx
- core/routes.e2e.ts
- components.json
- core/components.e2e.ts
- CONTEXT.md
- types.d.ts
- auth-vault.ts
- statement-rules.ts
- collectTests
- STYLE.md
- alert-dialog.tsx
- BudgetPage
- formatter
- devDependencies
- category-history-chart.tsx
- pagination.tsx
- sync/page.tsx
- biome.json
- rules
- workflows.e2e.ts
- Next.js agent rules block ("This is NOT the Next.js you know")
- manifest.json
- spending-calendar.tsx
- State persistence rule (ephemeral UI state vs IndexedDB)
- src/data/* (persistence, migrations, seeding, backup serialization, Drive storage)
- UI layer
- scripts
- formatter
- navigation.e2e.ts
- Domain docs (single-context layout)
- Commands
- optionalDependencies
- Dashboard
- vite.config.ts
- tsconfig.e2e.json
- style
- 0002 Forecast pacing
- 0001-drill-down-url-state.md
- src/components/*
- Validation rule (ValidationError + Validator)
- next
- Finpoint icon concept
- Finpoint icon with charcoal shadow
- Issue tracker: Local Markdown
- Finpoint
- Domain docs
- Local Markdown Issue Tracker
- Forecast pacing decision
- F monogram icon
- JPG favicon icon
- PNG favicon icon
- SVG favicon icon
- F monogram icon
- F monogram icon
- Finpoint app icon
- Dashboard Attention
- Domain Documentation Conflicts
- Conventions
- Dashboard shell
- Legacy Monthly Records redirects
- Records month navigation
- Versioned migrations
- Money out / Money in
- Unrestricted crawler policy
- Calendar day Drill-down

## God Nodes (most connected - your core abstractions)
1. `cn()` - 325 edges
2. `PrimitivesSection()` - 181 edges
3. `Button()` - 125 edges
4. `react` - 99 edges
5. `formatCurrency()` - 84 edges
6. `RecordEditorDialog()` - 65 edges
7. `UiIcon()` - 59 edges
8. `RecordCreatorDialog()` - 58 edges
9. `round2()` - 48 edges
10. `pluralize()` - 46 edges

## Surprising Connections (you probably didn't know these)
- `Largest selection preserves amount order before pagination` --documents--> `Selection`  [INFERRED]
  docs/adr/0001-drill-down-url-state.md → src/logic/drilldown.ts
- `Copy` --references--> `pluralize()`  [INFERRED]
  STYLE.md → src/lib/utils.ts
- `Finpoint Style Additions` --references--> `ValidationError`  [INFERRED]
  STYLE.md → src/logic/validate.ts
- `Finpoint Style Additions` --references--> `useApiFormErrors()`  [INFERRED]
  STYLE.md → src/hooks/use-api-form-errors.ts
- `record()` --indirect_call--> `path()`  [INFERRED]
  tests/core/ledger.e2e.ts → src/components/charts/trend-chart.tsx

## Import Cycles
- None detected.

## Communities (104 total, 17 thin omitted)

### Community 0 - "record-editor.tsx"
Cohesion: 0.07
Nodes (115): SECTIONS, CandidateResults(), @base-ui/react, sonner, @tanstack/react-form, AccountDialog(), BudgetCreatorDialog(), BudgetEditorDialog() (+107 more)

### Community 1 - "export-import.ts"
Cohesion: 0.06
Nodes (48): dexie, fake-indexeddb, withoutActionModes(), DEFAULT_CATEGORIES, DEFAULT_MONTHLY_BUDGETS, clearAllData(), downloadExport(), EXPORT_VERSION (+40 more)

### Community 2 - "auto-sync.ts"
Cohesion: 0.09
Nodes (57): exportData(), AuthNeededError, cacheToken(), CodeResponse, disconnectDrive(), downloadBackupFile(), driveFetch(), DriveFileMeta (+49 more)

### Community 3 - "duplicates/page.tsx"
Cohesion: 0.16
Nodes (47): AllocatorPage(), ScopeSelect(), RecordCreatorHost(), RecordFilters(), RecordsPage(), learnedSignals(), SettingsPage(), Rule (+39 more)

### Community 4 - "Tests README"
Cohesion: 0.06
Nodes (41): Build harness step (vite build tests/harness), Playwright browser cache keyed on bun.lock, blob report merge, Committed graph artifacts (graph.json, GRAPH_REPORT.md, manifest.json, .graphify_labels.json), Graph health warnings and refresh failure reporting, graphify-out/graph.json, graphify skill (--update), graphify update . (+33 more)

### Community 5 - "providers.tsx"
Cohesion: 0.07
Nodes (39): metadata, RootLayout(), viewport, Boot(), Providers(), react-dom, @vercel/analytics, @vercel/speed-insights (+31 more)

### Community 6 - "sidebar.tsx"
Cohesion: 0.09
Nodes (43): AppearanceOption, APPEARANCES, AppearanceSwitch(), AppSidebar(), SyncDot(), SYSTEM_APPEARANCE, useSyncIndicator(), DEFINITIONS (+35 more)

### Community 7 - "dashboard.ts"
Cohesion: 0.11
Nodes (42): db, summarize(), avg(), buildCashflowHistory(), buildCategories(), buildComparison(), buildHeadline(), buildMonthlyBudgets() (+34 more)

### Community 8 - "primitives.tsx"
Cohesion: 0.10
Nodes (43): AlertAction(), ComboboxCollection(), ComboboxValue(), DropdownMenu(), DropdownMenuCheckboxItem(), DropdownMenuContent(), DropdownMenuGroup(), DropdownMenuItem() (+35 more)

### Community 9 - "utils.ts"
Cohesion: 0.11
Nodes (30): CategoriesPage(), CategoryDialogState, CategoryTile(), lucide-react, AllocateBar(), CategoryMovers(), Mover, CategorySpendingMix() (+22 more)

### Community 10 - "Button"
Cohesion: 0.13
Nodes (32): BUDGET_STATES, BudgetCard(), BudgetsPage(), BudgetState, formatBudgetDateWindow(), MonthLayout(), NotFound(), react-day-picker (+24 more)

### Community 11 - "lib/motion.ts"
Cohesion: 0.14
Nodes (34): framer-motion, @tanstack/react-table, DataTable(), PaginatedDataTable(), GroupHeaderRow(), groupStarts(), GroupTotal(), isInteractiveTarget() (+26 more)

### Community 12 - "records.ts"
Cohesion: 0.11
Nodes (31): Largest selection preserves amount order before pagination, luxon, AllocationExpansion(), AllocationRows(), AllocationSource, MonthlyBudgetUsageItem, round2(), AnalyticsRecord (+23 more)

### Community 13 - "statements.ts"
Cohesion: 0.11
Nodes (36): asPending(), descriptionAnchors(), descriptionIdentity(), DuplicateGroup, duplicateGroups(), DuplicateStatement, duplicateStatementIds(), eligible() (+28 more)

### Community 14 - "cn"
Cohesion: 0.13
Nodes (33): CategoryFilter(), CategoryFilterItem(), ComboboxChip(), ComboboxChips(), ComboboxChipsInput(), ComboboxClear(), ComboboxContent(), ComboboxEmpty() (+25 more)

### Community 15 - "db.ts"
Cohesion: 0.09
Nodes (33): AccountRow, AllocationRow, AnalyticsMonthRow, BudgetRecordRow, BudgetRow, CategoryRow, DB_NAME, DB_VERSION (+25 more)

### Community 16 - "suggestions.ts"
Cohesion: 0.11
Nodes (36): allocatedStatements(), asOf(), byDate(), CHIP_LIMIT, CHOICES, Clue, createModel(), DEFAULT_WEIGHTS (+28 more)

### Community 17 - "react"
Cohesion: 0.23
Nodes (27): PendingCard(), react, PendingStatementConfirmationSheet(), RecordOption(), RecordSearchSheet(), StatementOption(), StatementSearchSheet(), AmountFilter() (+19 more)

### Community 18 - "editors.ts"
Cohesion: 0.14
Nodes (20): editors, editors, longName, expectHeldRead(), expectRetainedRows(), expectSilentSheet(), expectVisibleBackdrop(), account (+12 more)

### Community 19 - "compilerOptions"
Cohesion: 0.06
Nodes (33): compilerOptions, allowJs, allowSyntheticDefaultImports, allowUnusedLabels, esModuleInterop, forceConsistentCasingInFileNames, incremental, isolatedModules (+25 more)

### Community 20 - "ref_types"
Cohesion: 0.17
Nodes (22): AccountPage(), AccountCard(), AccountRow, AccountsPage(), RecordPage(), dayLabel(), StatementActions(), StatementActionsCell() (+14 more)

### Community 21 - "dependencies"
Cohesion: 0.07
Nodes (30): dependencies, @base-ui/react, class-variance-authority, clsx, cmdk, dexie, dexie-react-hooks, @fontsource-variable/inter (+22 more)

### Community 22 - "cashflow-chart.tsx"
Cohesion: 0.13
Nodes (21): bar(), BarChart(), BarSeries, PAD, BudgetProgressChart(), BudgetProgressPoint, buildSeries(), CashflowChart() (+13 more)

### Community 23 - "ledger.e2e.ts"
Cohesion: 0.11
Nodes (25): behaviourCoverage, componentInventory, facetNotApplicable, InventoryEntry, modalAnimationCoverage, notApplicable, openFacets, RouteEntry (+17 more)

### Community 24 - "suspicious"
Cohesion: 0.07
Nodes (28): suspicious, noAssignInExpressions, noAsyncPromiseExecutor, noCatchAssign, noClassAssign, noCompareNegZero, noControlCharactersInRegex, noDebugger (+20 more)

### Community 25 - "package.json"
Cohesion: 0.07
Nodes (27): private, $schema, type, babel-plugin-react-compiler, @biomejs/biome, clsx, cmdk, @fontsource-variable/inter (+19 more)

### Community 26 - "fixtures.ts"
Cohesion: 0.16
Nodes (15): cardTitles, card(), chartTooltip, overview, overviewCharts, themedRgb(), assertSeeded(), checkSeededMarker() (+7 more)

### Community 27 - "(month)/page.tsx"
Cohesion: 0.13
Nodes (23): AttentionList(), Comparison, comparisonText(), ComparisonValue, DashboardData, DashboardMonthlyBudget, DashboardPage(), DashboardView (+15 more)

### Community 28 - "importer.ts"
Cohesion: 0.16
Nodes (20): xlsx, ensureAccount(), combine(), dbsDescriptionKey(), debitCreditAmount(), descriptionKey(), importDbs(), importFiles() (+12 more)

### Community 29 - "Validator"
Cohesion: 0.27
Nodes (17): updateAccount(), validateBudget(), cleanInput(), dismissDuplicatePair(), fixDuplicates(), restoreDuplicatePair(), createMonthlyBudget(), setMonthlyBudgetAmount() (+9 more)

### Community 30 - "support/motion.ts"
Cohesion: 0.17
Nodes (20): denseCardConsumers, denseRowConsumers, expectConsumerEntrance(), populatedConsumers, attachSamplingFailure(), expectModalEntrance(), expectModalExit(), expectPopupEntrance() (+12 more)

### Community 31 - "correctness"
Cohesion: 0.08
Nodes (26): noConstantCondition, noConstAssign, noEmptyCharacterClassInRegex, noEmptyPattern, noGlobalObjectCalls, noInvalidBuiltinInstantiation, noInvalidConstructorSuper, noNonoctalDecimalEscape (+18 more)

### Community 32 - "README.md"
Cohesion: 0.08
Nodes (25): Allocate workspace, Allocations, Backup and restore, Categories, Custom-period Budgets, Demo data, Financial terms definitions, Finpoint (+17 more)

### Community 33 - "ui/field.tsx"
Cohesion: 0.11
Nodes (20): class-variance-authority, radix-ui, AppHeader(), ButtonGroup(), ButtonGroupSeparator(), ButtonGroupText(), buttonGroupVariants, FieldContent() (+12 more)

### Community 34 - "importer/page.tsx"
Cohesion: 0.23
Nodes (20): ACCEPT, BANKS_REQUIRING_ADDITIONAL_INFO, ImporterPage(), Step(), metadata, PrivacyPage(), SECTIONS, StatementPage() (+12 more)

### Community 35 - "routes.ts"
Cohesion: 0.21
Nodes (20): ShellHeader(), TITLES, StatementTabs(), useDrill(), useDefaultFilterEndDateToday(), useDefaultFilterStartDate(), useSettings(), buildAttention() (+12 more)

### Community 36 - "budgets/[id]/page.tsx"
Cohesion: 0.24
Nodes (19): AllocationProgress(), DrillPanel(), Icon(), amountTone(), formatRowTime(), PendingBadge(), RecordActions(), RecordActionsCell() (+11 more)

### Community 37 - "core/routes.e2e.ts"
Cohesion: 0.13
Nodes (17): containedFooter(), Child, october, september, PREMATURE, routeReady, titles, expectPointerCursor() (+9 more)

### Community 38 - "components.json"
Cohesion: 0.09
Nodes (21): aliases, components, hooks, lib, ui, utils, iconLibrary, menuAccent (+13 more)

### Community 39 - "core/components.e2e.ts"
Cohesion: 0.14
Nodes (11): desktopOnly, @playwright/test, bounds(), contained(), expectWheelScrollsPageWhileOpen(), expectDropdownPreservesScroll(), scrollWithInput(), settledOverlayAlpha() (+3 more)

### Community 40 - "CONTEXT.md"
Cohesion: 0.12
Nodes (20): Account, Allocate, Budget, Category, Drill-down, Duplicate Statement, Irregular, Left over (+12 more)

### Community 41 - "types.d.ts"
Cohesion: 0.10
Nodes (20): Account, Allocation, AnalyticsSummary, AnalyticsTreatment, Appearance, Budget, Category, CategoryWithChildren (+12 more)

### Community 42 - "auth-vault.ts"
Cohesion: 0.29
Nodes (14): POST(), POST(), POST(), jose, AUTH_COOKIE_NAME, authCookie(), authCookieConfig(), clientIp() (+6 more)

### Community 43 - "statement-rules.ts"
Cohesion: 0.20
Nodes (14): TREATMENT_VALUES, byCreation(), conditionPattern(), deleteStatementRule(), listStatementRules(), matchesStatement(), NAME_ORDER, previewStatementRule() (+6 more)

### Community 44 - "collectTests"
Cohesion: 0.28
Nodes (16): collectTests(), conditionBranch(), detailsTags(), disabled(), mentionsMotion(), record(), splitTestCallee(), tagValues() (+8 more)

### Community 45 - "STYLE.md"
Cohesion: 0.16
Nodes (13): Allocation, APIs, Arguments, And Props, Code Style, Consistency, Copy, Core, Earning Its Place, Grouping And Order (+5 more)

### Community 46 - "alert-dialog.tsx"
Cohesion: 0.34
Nodes (12): DriveOverwriteConfirmation(), AlertDialog(), AlertDialogAction(), AlertDialogCancel(), AlertDialogContent(), AlertDialogDescription(), AlertDialogFooter(), AlertDialogHeader() (+4 more)

### Community 47 - "BudgetPage"
Cohesion: 0.18
Nodes (11): BudgetPage(), getBudgetAnalytics(), getCategoryData(), Legend(), attachBudgetRecord(), BudgetDetail, BudgetFilters, createBudget() (+3 more)

### Community 48 - "formatter"
Cohesion: 0.15
Nodes (13): arrowParentheses, bracketSameLine, bracketSpacing, jsxQuoteStyle, quoteProperties, quoteStyle, semicolons, trailingCommas (+5 more)

### Community 49 - "devDependencies"
Cohesion: 0.15
Nodes (13): devDependencies, babel-plugin-react-compiler, @biomejs/biome, fake-indexeddb, @playwright/test, @tailwindcss/postcss, @types/luxon, @types/node (+5 more)

### Community 50 - "category-history-chart.tsx"
Cohesion: 0.24
Nodes (12): aggregateSeries(), CategoryHistoryChart(), ChartMonth, ChartSeries, MonthBreakdown(), MonthTick(), monthTotal(), prepareMonths() (+4 more)

### Community 51 - "pagination.tsx"
Cohesion: 0.38
Nodes (11): pageHref(), pageWindow(), PaginationFooter(), Pagination(), PaginationContent(), PaginationEllipsis(), PaginationItem(), PaginationLink() (+3 more)

### Community 52 - "sync/page.tsx"
Cohesion: 0.27
Nodes (11): COUNT_ROWS, DataSettingsPage(), StateRow(), STATUS_TONES, StatusTone, WorkspaceRow(), formatRelativeTime(), exportWorkspace() (+3 more)

### Community 53 - "biome.json"
Cohesion: 0.18
Nodes (10): source, assist, actions, files, includes, linter, enabled, overrides (+2 more)

### Community 54 - "rules"
Cohesion: 0.18
Nodes (11): noAdjacentSpacesInRegex, noBannedTypes, noExtraBooleanCast, noUselessCatch, noUselessThisAlias, noUselessTypeConstraint, rules, noFloatingPromises (+3 more)

### Community 56 - "Next.js agent rules block ("This is NOT the Next.js you know")"
Cohesion: 0.22
Nodes (7): app/api/auth/* Route Handlers, node_modules/next/dist/server/lib/generate-agent-files.js, Google OAuth broker (exchange/token/logout), Next.js App Router app (mostly client-side), node_modules/next/dist/docs/, npm run dev (port 5173), Verification

### Community 57 - "manifest.json"
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

### Community 63 - "formatter"
Cohesion: 0.25
Nodes (8): formatter, attributePosition, enabled, formatWithErrors, indentStyle, indentWidth, lineEnding, lineWidth

### Community 65 - "Domain docs (single-context layout)"
Cohesion: 0.33
Nodes (7): Agent skills, CONTEXT.md, Domain docs (single-context layout), Domain Language, Issue tracker (local specs and tickets), .scratch/ local work tracking, String primary keys (not auto-increment)

### Community 66 - "Commands"
Cohesion: 0.38
Nodes (7): Biome (biome check --write), bun install, bun lint (write-mode), bun lint:check, bun run build, bun types:check, Commands

### Community 67 - "optionalDependencies"
Cohesion: 0.29
Nodes (7): optionalDependencies, lightningcss-linux-x64-gnu, lightningcss-win32-x64-msvc, @rollup/rollup-linux-x64-gnu, @rollup/rollup-win32-x64-msvc, @tailwindcss/oxide-linux-x64-gnu, @tailwindcss/oxide-win32-x64-msvc

### Community 68 - "Dashboard"
Cohesion: 0.29
Nodes (7): Comparison columns share ordering and show the average arithmetic, Dashboard, Forecast dotted comparison names the previous month, Pending Record reasons visible before expansion, Spending Drill-down refund signs, labels and gross arithmetic, Statement pivot amount, account and timestamp, Statement titles open their funded Records

### Community 69 - "vite.config.ts"
Cohesion: 0.29
Nodes (4): vite, @vitejs/plugin-react, harnessDir, repoRoot

### Community 70 - "tsconfig.e2e.json"
Cohesion: 0.29
Nodes (6): ./tsconfig.json, compilerOptions, incremental, exclude, extends, include

### Community 71 - "style"
Cohesion: 0.33
Nodes (6): style, noNamespace, noNonNullAssertion, useArrayLiterals, useAsConstAssertion, useBlockStatements

### Community 72 - "0002 Forecast pacing"
Cohesion: 0.33
Nodes (5): 0002 Forecast pacing, Consequences, Context, Decision, Rejected option

### Community 73 - "0001-drill-down-url-state.md"
Cohesion: 0.40
Nodes (4): Compare selection uses included comparison months and title-based uniqueness, Gross and net category selection URL, Comparison window, Drill-down URL state

### Community 74 - "src/components/*"
Cohesion: 0.40
Nodes (4): Agent Behavior, Generated / Ignored Files, src/components/*, src/components/ui/**/*

### Community 75 - "Validation rule (ValidationError + Validator)"
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

### Community 84 - "Forecast pacing decision"
Cohesion: 0.67
Nodes (3): Forecast pacing decision, Remaining historical spending scaled by remaining days, Median daily spending fallback including zero days

### Community 85 - "F monogram icon"
Cohesion: 0.67
Nodes (3): Circular dot beside F, Rounded F letterform, F monogram icon

### Community 86 - "JPG favicon icon"
Cohesion: 0.67
Nodes (3): JPG favicon dot, JPG favicon F letterform, JPG favicon icon

### Community 87 - "PNG favicon icon"
Cohesion: 0.67
Nodes (3): PNG favicon dot, PNG favicon F letterform, PNG favicon icon

### Community 88 - "SVG favicon icon"
Cohesion: 0.67
Nodes (3): SVG favicon dot, SVG favicon F letterform, SVG favicon icon

### Community 89 - "F monogram icon"
Cohesion: 0.67
Nodes (3): Circular dot beside F, Rounded F letterform, F monogram icon

### Community 90 - "F monogram icon"
Cohesion: 0.67
Nodes (3): Circular dot beside F, Rounded F letterform, F monogram icon

## Knowledge Gaps
- **128 isolated node(s):** `Build app step`, `Build harness step (tests/harness/vite.config.ts)`, `Playwright browser cache (keyed on bun.lock)`, `Graph health warnings and refresh failure reporting`, `gitmoji.dev` (+123 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 641 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **17 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `cn()` connect `cn` to `record-editor.tsx`, `duplicates/page.tsx`, `sidebar.tsx`, `primitives.tsx`, `utils.ts`, `Button`, `lib/motion.ts`, `records.ts`, `react`, `ref_types`, `cashflow-chart.tsx`, `(month)/page.tsx`, `ui/field.tsx`, `importer/page.tsx`, `routes.ts`, `budgets/[id]/page.tsx`, `alert-dialog.tsx`, `category-history-chart.tsx`, `pagination.tsx`, `sync/page.tsx`, `spending-calendar.tsx`?**
  _High betweenness centrality (0.097) - this node is a cross-community bridge._
- **What connects `Build app step`, `Build harness step (tests/harness/vite.config.ts)`, `Playwright browser cache (keyed on bun.lock)` to the rest of the system?**
  _128 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `record-editor.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.06784083496412263 - nodes in this community are weakly interconnected._
- **Why does `react` connect `react` to `record-editor.tsx`, `auto-sync.ts`, `duplicates/page.tsx`, `providers.tsx`, `sidebar.tsx`, `primitives.tsx`, `utils.ts`, `Button`, `lib/motion.ts`, `records.ts`, `cn`, `ref_types`, `cashflow-chart.tsx`, `package.json`, `(month)/page.tsx`, `ui/field.tsx`, `importer/page.tsx`, `routes.ts`, `budgets/[id]/page.tsx`, `alert-dialog.tsx`, `category-history-chart.tsx`, `pagination.tsx`, `sync/page.tsx`, `spending-calendar.tsx`?**
  _High betweenness centrality (0.077) - this node is a cross-community bridge._
- **Should `export-import.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.059076682316118935 - nodes in this community are weakly interconnected._
- **Why does `pluralize()` connect `duplicates/page.tsx` to `record-editor.tsx`, `importer/page.tsx`, `routes.ts`, `budgets/[id]/page.tsx`, `dashboard.ts`, `utils.ts`, `STYLE.md`, `suggestions.ts`, `react`, `ref_types`, `(month)/page.tsx`?**
  _High betweenness centrality (0.064) - this node is a cross-community bridge._
- **Should `auto-sync.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.09095716552088842 - nodes in this community are weakly interconnected._