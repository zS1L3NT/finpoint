# Graph Report - t3-69efe8e6  (2026-11-07)

## Corpus Check
- 265 files · ~240,070 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 9 file(s) not represented in the graph (top: (none) 5, .example 1, .lock 1)

## Summary
- 1996 nodes · 7970 edges · 95 communities (85 shown, 10 thin omitted)
- Extraction: 98% EXTRACTED · 2% INFERRED · 0% AMBIGUOUS · INFERRED: 129 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `854a48f5`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- Button
- importer/page.tsx
- (month)/page.tsx
- sidebar.tsx
- auto-sync.ts
- Tests README
- statements.ts
- category-history-chart.tsx
- sync/page.tsx
- lucide-react
- use-appearance.tsx
- db.ts
- dashboard.ts
- primitives.tsx
- records.ts
- editors.ts
- compilerOptions
- suggestions.ts
- lib/motion.ts
- package.json
- dependencies
- combobox.tsx
- framer-motion
- ledger.e2e.ts
- suspicious
- fixtures.ts
- alert-dialog.tsx
- support/motion.ts
- correctness
- duplicates.ts
- README.md
- Validator
- react
- utils.ts
- test-data.ts
- components.json
- CONTEXT.md
- types.d.ts
- category-filter.tsx
- round2
- auth-vault.ts
- cn
- core/routes.e2e.ts
- core/components.e2e.ts
- collectTests
- src/data/* (persistence, migrations, seeding, backup serialization, Drive storage)
- formatter
- devDependencies
- spending-calendar.tsx
- pagination.tsx
- biome.json
- rules
- workflows.e2e.ts
- IndexedDB (Dexie)
- manifest.json
- Next.js agent rules block ("This is NOT the Next.js you know")
- STYLE.md
- scripts
- formatter
- icon.tsx
- navigation.e2e.ts
- Domain docs (single-context layout)
- Commands
- optionalDependencies
- providers.tsx
- tsconfig.e2e.json
- style
- 0002 Forecast pacing
- Validation rule (ValidationError + Validator)
- Finpoint icon concept
- Finpoint icon with charcoal shadow
- Issue tracker: Local Markdown
- Finpoint
- Domain docs
- Local Markdown Issue Tracker
- Forecast pacing decision
- Comparison window
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
- trend-chart.tsx
- export-import.ts
- drive-sync.ts
- vite.config.ts

## God Nodes (most connected - your core abstractions)
1. `cn()` - 322 edges
2. `PrimitivesSection()` - 181 edges
3. `Button()` - 128 edges
4. `react` - 100 edges
5. `formatCurrency()` - 78 edges
6. `RecordEditorDialog()` - 65 edges
7. `RecordCreatorDialog()` - 58 edges
8. `UiIcon()` - 56 edges
9. `round2()` - 48 edges
10. `pluralize()` - 44 edges

## Surprising Connections (you probably didn't know these)
- `Finpoint Style Additions` --references--> `useApiFormErrors()`  [INFERRED]
  STYLE.md → src/hooks/use-api-form-errors.ts
- `Copy` --references--> `pluralize()`  [INFERRED]
  STYLE.md → src/lib/utils.ts
- `Largest selection preserves amount order before pagination` --documents--> `Selection`  [INFERRED]
  docs/adr/0001-drill-down-url-state.md → src/logic/drilldown.ts
- `Finpoint Style Additions` --references--> `ValidationError`  [INFERRED]
  STYLE.md → src/logic/validate.ts
- `Boot()` --indirect_call--> `preloadCategoryIcons()`  [INFERRED]
  app/providers.tsx → src/components/icon.tsx

## Import Cycles
- None detected.

## Communities (95 total, 10 thin omitted)

### Community 0 - "Button"
Cohesion: 0.06
Nodes (122): AccountPage(), AccountCard(), AccountRow, AccountsPage(), AllocatorPage(), BUDGET_STATES, BudgetCard(), BudgetsPage() (+114 more)

### Community 1 - "importer/page.tsx"
Cohesion: 0.20
Nodes (25): ACCEPT, BANKS_REQUIRING_ADDITIONAL_INFO, ImporterPage(), Step(), BANKS, ensureAccount(), combine(), dbsDescriptionKey() (+17 more)

### Community 2 - "(month)/page.tsx"
Cohesion: 0.16
Nodes (19): Comparison, comparisonText(), ComparisonValue, DashboardData, DashboardMonthlyBudget, DashboardPage(), DashboardView, DemoOffer() (+11 more)

### Community 3 - "sidebar.tsx"
Cohesion: 0.09
Nodes (32): AppearanceSwitch(), DEFINITIONS, Term(), SidebarContent(), SidebarContext, SidebarContextProps, SidebarFooter(), SidebarGroup() (+24 more)

### Community 4 - "auto-sync.ts"
Cohesion: 0.13
Nodes (23): useSyncStatus(), emit(), eventListeners, finishCycle(), getSyncSnapshot(), ingestManualResult(), markDirty(), refreshSyncDisplay() (+15 more)

### Community 5 - "Tests README"
Cohesion: 0.06
Nodes (41): Build harness step (vite build tests/harness), Playwright browser cache keyed on bun.lock, blob report merge, Committed graph artifacts (graph.json, GRAPH_REPORT.md, manifest.json, .graphify_labels.json), Graph health warnings and refresh failure reporting, graphify-out/graph.json, graphify skill (--update), graphify update . (+33 more)

### Community 6 - "statements.ts"
Cohesion: 0.15
Nodes (26): asPending(), duplicateStatementIds(), removeStatementDismissals(), dayDifference(), ensureCanReplace(), maskDescription(), ReplacementAllocation, replacementComparison() (+18 more)

### Community 7 - "category-history-chart.tsx"
Cohesion: 0.13
Nodes (23): Largest selection preserves amount order before pagination, CashflowChart(), CashflowPoint, aggregateSeries(), CategoryHistoryChart(), ChartMonth, ChartSeries, MonthBreakdown() (+15 more)

### Community 8 - "sync/page.tsx"
Cohesion: 0.17
Nodes (31): EmptyRecords(), metadata, PrivacyPage(), SECTIONS, RecordPage(), StatementPage(), COUNT_ROWS, DataSettingsPage() (+23 more)

### Community 9 - "lucide-react"
Cohesion: 0.28
Nodes (8): lucide-react, buttonVariants, ButtonVariant, Month, MonthCal(), MonthCalProps, MonthPicker(), MONTHS

### Community 10 - "use-appearance.tsx"
Cohesion: 0.23
Nodes (15): Toaster(), Appearance, applyAppearance(), getStoredAppearance(), handleSystemThemeChange(), initializeAppearance(), isDarkMode(), listeners (+7 more)

### Community 11 - "db.ts"
Cohesion: 0.06
Nodes (37): dexie, fake-indexeddb, luxon, xlsx, AccountRow, AllocationRow, AnalyticsMonthRow, BudgetRecordRow (+29 more)

### Community 12 - "dashboard.ts"
Cohesion: 0.13
Nodes (38): contribution(), summarize(), avg(), BREAKDOWN_MONTHS, buildCashflowHistory(), buildCategories(), buildComparison(), buildMonthlyBudgets() (+30 more)

### Community 13 - "primitives.tsx"
Cohesion: 0.11
Nodes (39): AlertAction(), CardAction(), CardFooter(), DropdownMenu(), DropdownMenuCheckboxItem(), DropdownMenuContent(), DropdownMenuGroup(), DropdownMenuItem() (+31 more)

### Community 14 - "records.ts"
Cohesion: 0.10
Nodes (27): db, AnalyticsRecord, AnalyticsSummary, summaryMeasure(), BudgetDetail, BudgetFilters, createBudget(), updateBudget() (+19 more)

### Community 15 - "editors.ts"
Cohesion: 0.14
Nodes (20): editors, editors, longName, expectHeldRead(), expectRetainedRows(), expectSilentSheet(), expectVisibleBackdrop(), account (+12 more)

### Community 16 - "compilerOptions"
Cohesion: 0.06
Nodes (33): compilerOptions, allowJs, allowSyntheticDefaultImports, allowUnusedLabels, esModuleInterop, forceConsistentCasingInFileNames, incremental, isolatedModules (+25 more)

### Community 17 - "suggestions.ts"
Cohesion: 0.07
Nodes (53): Rule, RuleSentence(), StatementRulesPage(), byCreation(), conditionPattern(), deleteStatementRule(), listStatementRules(), matchesStatement() (+45 more)

### Community 18 - "lib/motion.ts"
Cohesion: 0.18
Nodes (29): @tanstack/react-table, DataTable(), PaginatedDataTable(), PaginationHeader(), GroupHeaderRow(), groupStarts(), GroupTotal(), isInteractiveTarget() (+21 more)

### Community 19 - "package.json"
Cohesion: 0.07
Nodes (28): private, $schema, type, babel-plugin-react-compiler, @biomejs/biome, clsx, cmdk, @fontsource-variable/inter (+20 more)

### Community 20 - "dependencies"
Cohesion: 0.07
Nodes (30): dependencies, @base-ui/react, class-variance-authority, clsx, cmdk, dexie, dexie-react-hooks, @fontsource-variable/inter (+22 more)

### Community 21 - "combobox.tsx"
Cohesion: 0.14
Nodes (20): @base-ui/react, ComboboxField(), Props, ComboboxChip(), ComboboxChips(), ComboboxChipsInput(), ComboboxClear(), ComboboxCollection() (+12 more)

### Community 22 - "framer-motion"
Cohesion: 0.24
Nodes (11): framer-motion, AllocateBar(), Sparkline(), Delta, Metric(), ValueSwap(), DURATION, EASE_OUT (+3 more)

### Community 23 - "ledger.e2e.ts"
Cohesion: 0.11
Nodes (25): behaviourCoverage, componentInventory, facetNotApplicable, InventoryEntry, modalAnimationCoverage, notApplicable, openFacets, RouteEntry (+17 more)

### Community 24 - "suspicious"
Cohesion: 0.07
Nodes (28): suspicious, noAssignInExpressions, noAsyncPromiseExecutor, noCatchAssign, noClassAssign, noCompareNegZero, noControlCharactersInRegex, noDebugger (+20 more)

### Community 25 - "fixtures.ts"
Cohesion: 0.16
Nodes (15): cardTitles, card(), chartTooltip, overview, overviewCharts, themedRgb(), assertSeeded(), checkSeededMarker() (+7 more)

### Community 26 - "alert-dialog.tsx"
Cohesion: 0.34
Nodes (12): DriveOverwriteConfirmation(), AlertDialog(), AlertDialogAction(), AlertDialogCancel(), AlertDialogContent(), AlertDialogDescription(), AlertDialogFooter(), AlertDialogHeader() (+4 more)

### Community 27 - "support/motion.ts"
Cohesion: 0.16
Nodes (21): denseCardConsumers, denseRowConsumers, expectConsumerEntrance(), populatedConsumers, statementRules(), attachSamplingFailure(), expectModalEntrance(), expectModalExit() (+13 more)

### Community 28 - "correctness"
Cohesion: 0.08
Nodes (26): noConstantCondition, noConstAssign, noEmptyCharacterClassInRegex, noEmptyPattern, noGlobalObjectCalls, noInvalidBuiltinInstantiation, noInvalidConstructorSuper, noNonoctalDecimalEscape (+18 more)

### Community 29 - "duplicates.ts"
Cohesion: 0.24
Nodes (12): allocationOutcome(), descriptionAnchors(), descriptionIdentity(), DuplicateGroup, duplicateGroups(), DuplicateStatement, FixDuplicatesInput, GENERIC (+4 more)

### Community 30 - "README.md"
Cohesion: 0.08
Nodes (24): Allocate workspace, Allocations, Backup and restore, Categories, Custom-period Budgets, Dashboard, Demo data, Financial terms definitions (+16 more)

### Community 31 - "Validator"
Cohesion: 0.24
Nodes (19): updateAccount(), validateBudget(), cleanInput(), dismissDuplicatePair(), eligible(), fixDuplicates(), restoreDuplicatePair(), amountFor() (+11 more)

### Community 32 - "react"
Cohesion: 0.06
Nodes (129): BudgetState, SECTIONS, CandidateResults(), react, react-day-picker, react-dom, sonner, @tanstack/react-form (+121 more)

### Community 33 - "utils.ts"
Cohesion: 0.14
Nodes (34): BudgetPage(), Legend(), MonthlyRecordsPage(), AllocationProgress(), AllocationExpansion(), AllocationRows(), AllocationSource, DrillPanel() (+26 more)

### Community 34 - "test-data.ts"
Cohesion: 0.18
Nodes (14): migrateRecordChoices(), BANK_BLURB, between(), CATEGORIES, DAILY, generateTestData(), IRREGULAR, Meal (+6 more)

### Community 35 - "components.json"
Cohesion: 0.09
Nodes (21): aliases, components, hooks, lib, ui, utils, iconLibrary, menuAccent (+13 more)

### Community 36 - "CONTEXT.md"
Cohesion: 0.09
Nodes (21): Account, Allocate, Budget, Category, Drill-down, Duplicate Statement, Irregular, Left over (+13 more)

### Community 37 - "types.d.ts"
Cohesion: 0.10
Nodes (20): Account, Allocation, AnalyticsSummary, AnalyticsTreatment, Appearance, Budget, Category, CategoryWithChildren (+12 more)

### Community 38 - "category-filter.tsx"
Cohesion: 0.21
Nodes (16): CategoryFilter(), CategoryFilterItem(), Command(), CommandEmpty(), CommandGroup(), CommandInput(), CommandItem(), CommandList() (+8 more)

### Community 39 - "round2"
Cohesion: 0.18
Nodes (31): getBudgetAnalytics(), getCategoryData(), PendingCard(), PendingStatementConfirmationSheet(), RecordOption(), RecordSearchSheet(), StatementOption(), StatementSearchSheet() (+23 more)

### Community 40 - "auth-vault.ts"
Cohesion: 0.32
Nodes (13): POST(), POST(), POST(), AUTH_COOKIE_NAME, authCookie(), authCookieConfig(), clientIp(), encryptionKey() (+5 more)

### Community 41 - "cn"
Cohesion: 0.16
Nodes (24): class-variance-authority, radix-ui, AppHeader(), ButtonGroup(), ButtonGroupSeparator(), ButtonGroupText(), buttonGroupVariants, FieldSeparator() (+16 more)

### Community 42 - "core/routes.e2e.ts"
Cohesion: 0.13
Nodes (17): containedFooter(), Child, october, september, PREMATURE, routeReady, titles, expectPointerCursor() (+9 more)

### Community 44 - "core/components.e2e.ts"
Cohesion: 0.14
Nodes (11): desktopOnly, @playwright/test, bounds(), contained(), expectWheelScrollsPageWhileOpen(), expectDropdownPreservesScroll(), scrollWithInput(), settledOverlayAlpha() (+3 more)

### Community 45 - "collectTests"
Cohesion: 0.28
Nodes (16): collectTests(), conditionBranch(), detailsTags(), disabled(), mentionsMotion(), record(), splitTestCallee(), tagValues() (+8 more)

### Community 46 - "src/data/* (persistence, migrations, seeding, backup serialization, Drive storage)"
Cohesion: 0.28
Nodes (10): Background Drive sync, src/data/* (persistence, migrations, seeding, backup serialization, Drive storage), src/logic/* (domain reads and operations), (month) route-group shell (Overview + Monthly Records), Project Shape, React Compiler (enabled), src/routes.ts (centralized route paths), Static content pages (privacy, terms) are server components (+2 more)

### Community 47 - "formatter"
Cohesion: 0.15
Nodes (13): arrowParentheses, bracketSameLine, bracketSpacing, jsxQuoteStyle, quoteProperties, quoteStyle, semicolons, trailingCommas (+5 more)

### Community 48 - "devDependencies"
Cohesion: 0.15
Nodes (13): devDependencies, babel-plugin-react-compiler, @biomejs/biome, fake-indexeddb, @playwright/test, @tailwindcss/postcss, @types/luxon, @types/node (+5 more)

### Community 49 - "spending-calendar.tsx"
Cohesion: 0.29
Nodes (9): compact(), heat(), INK, LEVELS, quantile(), rampCap(), SpendingCalendar(), STRENGTH (+1 more)

### Community 50 - "pagination.tsx"
Cohesion: 0.38
Nodes (11): pageHref(), pageWindow(), PaginationFooter(), Pagination(), PaginationContent(), PaginationEllipsis(), PaginationItem(), PaginationLink() (+3 more)

### Community 51 - "biome.json"
Cohesion: 0.18
Nodes (10): source, assist, actions, files, includes, linter, enabled, overrides (+2 more)

### Community 52 - "rules"
Cohesion: 0.18
Nodes (11): noAdjacentSpacesInRegex, noBannedTypes, noExtraBooleanCast, noUselessCatch, noUselessThisAlias, noUselessTypeConstraint, rules, noFloatingPromises (+3 more)

### Community 54 - "IndexedDB (Dexie)"
Cohesion: 0.15
Nodes (11): app/**/page.tsx, bun test, IndexedDB (Dexie), Domain and importer tests (Dexie with in-memory IndexedDB), Interactive routes are "use client" (search params via next/navigation), Pages take no props, Root Suspense (keeps routes static), String primary keys (not auto-increment) (+3 more)

### Community 55 - "manifest.json"
Cohesion: 0.20
Nodes (9): background_color, description, display, icons, name, scope, short_name, start_url (+1 more)

### Community 56 - "Next.js agent rules block ("This is NOT the Next.js you know")"
Cohesion: 0.25
Nodes (6): app/api/auth/* Route Handlers, node_modules/next/dist/server/lib/generate-agent-files.js, Google OAuth broker (exchange/token/logout), Next.js App Router app (mostly client-side), node_modules/next/dist/docs/, npm run dev (port 5173)

### Community 57 - "STYLE.md"
Cohesion: 0.16
Nodes (14): Allocation, APIs, Arguments, And Props, Code Style, Consistency, Copy, Core, Earning Its Place, Finpoint Style Additions (+6 more)

### Community 58 - "scripts"
Cohesion: 0.22
Nodes (9): scripts, build, dev, lint, lint:check, start, test:e2e, types:check (+1 more)

### Community 60 - "formatter"
Cohesion: 0.25
Nodes (8): formatter, attributePosition, enabled, formatWithErrors, indentStyle, indentWidth, lineEnding, lineWidth

### Community 61 - "icon.tsx"
Cohesion: 0.25
Nodes (9): DynamicUiIcon(), ICON_NAMES, iconNameSet, loadedIcons, loadIcon(), loadingIcons, normalize(), preloadCategoryIcons() (+1 more)

### Community 63 - "Domain docs (single-context layout)"
Cohesion: 0.40
Nodes (6): Agent skills, CONTEXT.md, Domain docs (single-context layout), Domain Language, Issue tracker (local specs and tickets), .scratch/ local work tracking

### Community 64 - "Commands"
Cohesion: 0.20
Nodes (11): Agent Behavior, Biome (biome check --write), bun install, bun lint (write-mode), bun lint:check, bun run build, bun types:check, Commands (+3 more)

### Community 65 - "optionalDependencies"
Cohesion: 0.29
Nodes (7): optionalDependencies, lightningcss-linux-x64-gnu, lightningcss-win32-x64-msvc, @rollup/rollup-linux-x64-gnu, @rollup/rollup-win32-x64-msvc, @tailwindcss/oxide-linux-x64-gnu, @tailwindcss/oxide-win32-x64-msvc

### Community 66 - "providers.tsx"
Cohesion: 0.23
Nodes (11): metadata, RootLayout(), viewport, Boot(), Providers(), @vercel/analytics, @vercel/speed-insights, ShellHeader() (+3 more)

### Community 67 - "tsconfig.e2e.json"
Cohesion: 0.29
Nodes (6): ./tsconfig.json, compilerOptions, incremental, exclude, extends, include

### Community 68 - "style"
Cohesion: 0.33
Nodes (6): style, noNamespace, noNonNullAssertion, useArrayLiterals, useAsConstAssertion, useBlockStatements

### Community 69 - "0002 Forecast pacing"
Cohesion: 0.33
Nodes (5): 0002 Forecast pacing, Consequences, Context, Decision, Rejected option

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

### Community 80 - "Comparison window"
Cohesion: 0.33
Nodes (5): Compare selection uses included comparison months and title-based uniqueness, Gross and net category selection URL, Comparison window, Drill-down URL state, Biggest changes compares same-period net Spending Records

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

### Community 94 - "trend-chart.tsx"
Cohesion: 0.16
Nodes (18): bar(), BarChart(), BarSeries, PAD, BudgetProgressChart(), BudgetProgressPoint, buildSeries(), ChartFrame() (+10 more)

### Community 95 - "export-import.ts"
Cohesion: 0.10
Nodes (33): FinpointDB, withoutActionModes(), DEFAULT_CATEGORIES, DEFAULT_MONTHLY_BUDGETS, clearAllData(), downloadExport(), EXPORT_VERSION, exportData() (+25 more)

### Community 96 - "drive-sync.ts"
Cohesion: 0.16
Nodes (32): AuthNeededError, cacheToken(), CodeResponse, disconnectDrive(), downloadBackupFile(), driveFetch(), DriveFileMeta, ensureDriveToken() (+24 more)

### Community 99 - "vite.config.ts"
Cohesion: 0.29
Nodes (4): vite, @vitejs/plugin-react, harnessDir, repoRoot

## Knowledge Gaps
- **120 isolated node(s):** `@fontsource-variable/inter`, `shadcn`, `tailwindcss`, `tw-animate-css`, `@biomejs/biome` (+115 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 636 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **10 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `cn()` connect `cn` to `Button`, `importer/page.tsx`, `(month)/page.tsx`, `sidebar.tsx`, `category-history-chart.tsx`, `sync/page.tsx`, `lucide-react`, `primitives.tsx`, `suggestions.ts`, `lib/motion.ts`, `combobox.tsx`, `framer-motion`, `alert-dialog.tsx`, `react`, `utils.ts`, `category-filter.tsx`, `round2`, `spending-calendar.tsx`, `pagination.tsx`, `icon.tsx`, `trend-chart.tsx`?**
  _High betweenness centrality (0.112) - this node is a cross-community bridge._
- **What connects `@fontsource-variable/inter`, `shadcn`, `tailwindcss` to the rest of the system?**
  _120 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Button` be split into smaller, more focused modules?**
  _Cohesion score 0.06385551882609046 - nodes in this community are weakly interconnected._
- **Why does `src/data/* (persistence, migrations, seeding, backup serialization, Drive storage)` connect `src/data/* (persistence, migrations, seeding, backup serialization, Drive storage)` to `providers.tsx`, `IndexedDB (Dexie)`?**
  _High betweenness centrality (0.083) - this node is a cross-community bridge._
- **Should `sidebar.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.08888888888888889 - nodes in this community are weakly interconnected._
- **Why does `react` connect `react` to `Button`, `importer/page.tsx`, `(month)/page.tsx`, `sidebar.tsx`, `auto-sync.ts`, `category-history-chart.tsx`, `sync/page.tsx`, `lucide-react`, `use-appearance.tsx`, `primitives.tsx`, `suggestions.ts`, `lib/motion.ts`, `package.json`, `combobox.tsx`, `framer-motion`, `alert-dialog.tsx`, `utils.ts`, `category-filter.tsx`, `round2`, `cn`, `spending-calendar.tsx`, `pagination.tsx`, `icon.tsx`, `providers.tsx`, `trend-chart.tsx`?**
  _High betweenness centrality (0.070) - this node is a cross-community bridge._
- **Should `auto-sync.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.13 - nodes in this community are weakly interconnected._