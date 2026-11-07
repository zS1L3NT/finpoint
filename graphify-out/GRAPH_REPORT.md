# Graph Report - t3-69efe8e6  (2026-11-07)

## Corpus Check
- cluster-only mode — file stats not available

## Summary
- 2007 nodes · 8042 edges · 98 communities (86 shown, 12 thin omitted)
- Extraction: 98% EXTRACTED · 2% INFERRED · 0% AMBIGUOUS · INFERRED: 129 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `5d046fca`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- record-editor.tsx
- react
- db.ts
- Tests README
- (month)/page.tsx
- budgets/[id]/page.tsx
- Button
- budgets/page.tsx
- primitives.tsx
- sidebar.tsx
- dashboard.ts
- utils.ts
- cn
- drive-sync.ts
- editors.ts
- compilerOptions
- icon.tsx
- records.ts
- providers.tsx
- combobox.tsx
- Validator
- suggestions.ts
- package.json
- dependencies
- test-data.ts
- ledger.e2e.ts
- suspicious
- fixtures.ts
- support/motion.ts
- correctness
- statements.ts
- auto-sync.ts
- README.md
- core/routes.e2e.ts
- trend-chart.tsx
- category-filter.tsx
- components.json
- CONTEXT.md
- core/components.e2e.ts
- types.d.ts
- importer.ts
- auth-vault.ts
- export-import.ts
- collectTests
- STYLE.md
- duplicates.ts
- UI layer (app pages + components)
- formatter
- devDependencies
- lucide-react
- pagination.tsx
- biome.json
- rules
- workflows.e2e.ts
- monthly-budgets.test.ts
- src/data/* (persistence, migrations, seeding, backup serialization, Drive storage)
- manifest.json
- spending-calendar.tsx
- Next.js agent rules block ("This is NOT the Next.js you know")
- scripts
- history.tsx
- src/components/*
- formatter
- app.tsx
- navigation.e2e.ts
- Domain docs (single-context layout)
- Commands
- optionalDependencies
- vite.config.ts
- tsconfig.e2e.json
- Comparison window
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
- F monogram icon
- JPG favicon icon
- PNG favicon icon
- SVG favicon icon
- F monogram icon
- F monogram icon
- Dashboard
- Finpoint app icon
- Dashboard Attention
- Domain Documentation Conflicts
- Dashboard Attention
- Conventions
- Unrestricted crawler policy
- Calendar day Drill-down

## God Nodes (most connected - your core abstractions)
1. `cn()` - 329 edges
2. `PrimitivesSection()` - 181 edges
3. `Button()` - 127 edges
4. `react` - 100 edges
5. `formatCurrency()` - 82 edges
6. `RecordEditorDialog()` - 67 edges
7. `UiIcon()` - 60 edges
8. `RecordCreatorDialog()` - 58 edges
9. `round2()` - 48 edges
10. `pluralize()` - 46 edges

## Surprising Connections (you probably didn't know these)
- `Largest selection preserves amount order before pagination` --documents--> `Selection`  [INFERRED]
  docs/adr/0001-drill-down-url-state.md → src/logic/drilldown.ts
- `Finpoint Style Additions` --references--> `ValidationError`  [INFERRED]
  STYLE.md → src/logic/validate.ts
- `Copy` --references--> `pluralize()`  [INFERRED]
  STYLE.md → src/lib/utils.ts
- `Finpoint Style Additions` --references--> `useApiFormErrors()`  [INFERRED]
  STYLE.md → src/hooks/use-api-form-errors.ts
- `record()` --indirect_call--> `path()`  [INFERRED]
  tests/core/ledger.e2e.ts → src/components/charts/trend-chart.tsx

## Import Cycles
- None detected.

## Communities (98 total, 12 thin omitted)

### Community 0 - "record-editor.tsx"
Cohesion: 0.06
Nodes (136): SECTIONS, Rule, RuleSentence(), StatementRulesPage(), CandidateResults(), sonner, @tanstack/react-form, AccountDialog() (+128 more)

### Community 1 - "react"
Cohesion: 0.08
Nodes (99): AccountPage(), AllocatorPage(), getBudgetAnalytics(), getCategoryData(), ScopeSelect(), byRecordDay, FILTER_KEYS, Filters (+91 more)

### Community 2 - "db.ts"
Cohesion: 0.06
Nodes (38): dexie, fake-indexeddb, luxon, xlsx, AccountRow, AllocationRow, AnalyticsMonthRow, BudgetRecordRow (+30 more)

### Community 3 - "Tests README"
Cohesion: 0.06
Nodes (41): Build harness step (vite build tests/harness), Playwright browser cache keyed on bun.lock, blob report merge, Committed graph artifacts (graph.json, GRAPH_REPORT.md, manifest.json, .graphify_labels.json), Graph health warnings and refresh failure reporting, graphify-out/graph.json, graphify skill (--update), graphify update . (+33 more)

### Community 4 - "(month)/page.tsx"
Cohesion: 0.09
Nodes (43): Largest selection preserves amount order before pagination, AttentionList(), Comparison, comparisonText(), ComparisonValue, DashboardData, DashboardMonthlyBudget, DashboardPage() (+35 more)

### Community 5 - "budgets/[id]/page.tsx"
Cohesion: 0.16
Nodes (42): BudgetPage(), Legend(), ACCEPT, BANKS_REQUIRING_ADDITIONAL_INFO, ImporterPage(), Step(), EmptyRecords(), metadata (+34 more)

### Community 6 - "Button"
Cohesion: 0.11
Nodes (36): AccountCard(), AccountRow, AccountsPage(), CategoriesPage(), CategoryDialogState, CategoryTile(), MonthLayout(), EmptyMonthNotice() (+28 more)

### Community 7 - "budgets/page.tsx"
Cohesion: 0.13
Nodes (39): BUDGET_STATES, BudgetCard(), BudgetsPage(), BudgetState, formatBudgetDateWindow(), @tanstack/react-table, DataTable(), PaginatedDataTable() (+31 more)

### Community 8 - "primitives.tsx"
Cohesion: 0.12
Nodes (43): DriveOverwriteConfirmation(), AlertAction(), AlertDialog(), AlertDialogAction(), AlertDialogCancel(), AlertDialogContent(), AlertDialogDescription(), AlertDialogFooter() (+35 more)

### Community 9 - "sidebar.tsx"
Cohesion: 0.11
Nodes (37): AppearanceOption, APPEARANCES, AppearanceSwitch(), AppSidebar(), SyncDot(), SYSTEM_APPEARANCE, useSyncIndicator(), DEFINITIONS (+29 more)

### Community 10 - "dashboard.ts"
Cohesion: 0.11
Nodes (37): db, AnalyticsRecord, summarize(), avg(), BREAKDOWN_MONTHS, buildCashflowHistory(), buildCategories(), buildComparison() (+29 more)

### Community 11 - "utils.ts"
Cohesion: 0.14
Nodes (30): MonthlyRecordsPage(), AllocationProgress(), AllocationExpansion(), AllocationRows(), AllocationSource, LargestRecords(), DrillPanel(), Icon() (+22 more)

### Community 12 - "cn"
Cohesion: 0.12
Nodes (29): class-variance-authority, radix-ui, AppHeader(), ButtonGroup(), ButtonGroupSeparator(), ButtonGroupText(), buttonGroupVariants, EmptyContent() (+21 more)

### Community 13 - "drive-sync.ts"
Cohesion: 0.16
Nodes (33): exportData(), AuthNeededError, cacheToken(), CodeResponse, disconnectDrive(), downloadBackupFile(), driveFetch(), DriveFileMeta (+25 more)

### Community 14 - "editors.ts"
Cohesion: 0.14
Nodes (20): editors, editors, longName, expectHeldRead(), expectRetainedRows(), expectSilentSheet(), expectVisibleBackdrop(), account (+12 more)

### Community 15 - "compilerOptions"
Cohesion: 0.06
Nodes (33): compilerOptions, allowJs, allowSyntheticDefaultImports, allowUnusedLabels, esModuleInterop, forceConsistentCasingInFileNames, incremental, isolatedModules (+25 more)

### Community 16 - "icon.tsx"
Cohesion: 0.13
Nodes (23): framer-motion, AllocateBar(), Sparkline(), DetailSummaryItem(), DynamicUiIcon(), iconNameSet, loadedIcons, loadIcon() (+15 more)

### Community 17 - "records.ts"
Cohesion: 0.13
Nodes (24): AnalyticsSummary, contribution(), summaryMeasure(), getMonthlyBudgetDaily(), loadDashboardTables(), isPendingRecord(), pendingStatementIds(), tallyAllocations() (+16 more)

### Community 18 - "providers.tsx"
Cohesion: 0.13
Nodes (26): metadata, RootLayout(), viewport, Boot(), Providers(), SidebarInset(), SidebarProvider(), Toaster() (+18 more)

### Community 19 - "combobox.tsx"
Cohesion: 0.11
Nodes (25): @base-ui/react, Props, ComboboxChip(), ComboboxChips(), ComboboxChipsInput(), ComboboxClear(), ComboboxCollection(), ComboboxContent() (+17 more)

### Community 20 - "Validator"
Cohesion: 0.22
Nodes (20): updateAccount(), BudgetDetail, BudgetFilters, createBudget(), updateBudget(), validateBudget(), cleanInput(), fixDuplicates() (+12 more)

### Community 21 - "suggestions.ts"
Cohesion: 0.11
Nodes (30): allocatedStatements(), asOf(), byDate(), CHIP_LIMIT, CHOICES, Clue, DEFAULT_WEIGHTS, descriptionTokens() (+22 more)

### Community 22 - "package.json"
Cohesion: 0.07
Nodes (29): private, $schema, type, babel-plugin-react-compiler, @biomejs/biome, clsx, cmdk, @fontsource-variable/inter (+21 more)

### Community 23 - "dependencies"
Cohesion: 0.07
Nodes (30): dependencies, @base-ui/react, class-variance-authority, clsx, cmdk, dexie, dexie-react-hooks, @fontsource-variable/inter (+22 more)

### Community 24 - "test-data.ts"
Cohesion: 0.13
Nodes (24): DEFAULT_CATEGORIES, DEFAULT_MONTHLY_BUDGETS, clearAllData(), downloadExport(), tableCounts(), SEED_HASH_KEY, seedIfEmpty(), BANK_BLURB (+16 more)

### Community 25 - "ledger.e2e.ts"
Cohesion: 0.11
Nodes (25): behaviourCoverage, componentInventory, facetNotApplicable, InventoryEntry, modalAnimationCoverage, notApplicable, openFacets, RouteEntry (+17 more)

### Community 26 - "suspicious"
Cohesion: 0.07
Nodes (28): suspicious, noAssignInExpressions, noAsyncPromiseExecutor, noCatchAssign, noClassAssign, noCompareNegZero, noControlCharactersInRegex, noDebugger (+20 more)

### Community 27 - "fixtures.ts"
Cohesion: 0.16
Nodes (15): cardTitles, card(), chartTooltip, overview, overviewCharts, themedRgb(), assertSeeded(), checkSeededMarker() (+7 more)

### Community 28 - "support/motion.ts"
Cohesion: 0.17
Nodes (20): denseCardConsumers, denseRowConsumers, expectConsumerEntrance(), populatedConsumers, attachSamplingFailure(), expectModalEntrance(), expectModalExit(), expectPopupEntrance() (+12 more)

### Community 29 - "correctness"
Cohesion: 0.08
Nodes (26): noConstantCondition, noConstAssign, noEmptyCharacterClassInRegex, noEmptyPattern, noGlobalObjectCalls, noInvalidBuiltinInstantiation, noInvalidConstructorSuper, noNonoctalDecimalEscape (+18 more)

### Community 30 - "statements.ts"
Cohesion: 0.18
Nodes (22): asPending(), removeStatementDismissals(), dayDifference(), ensureCanReplace(), maskDescription(), ReplacementAllocation, replacementComparison(), replacementReason() (+14 more)

### Community 31 - "auto-sync.ts"
Cohesion: 0.13
Nodes (23): useSyncStatus(), emit(), eventListeners, finishCycle(), getSyncSnapshot(), ingestManualResult(), markDirty(), refreshSyncDisplay() (+15 more)

### Community 32 - "README.md"
Cohesion: 0.08
Nodes (23): Allocate workspace, Detail table allocated portions and drill-down Allocations, Backup and restore, Categories, Custom-period Budgets, Demo data, Inline metric and drill-down term definitions, Finpoint (+15 more)

### Community 33 - "core/routes.e2e.ts"
Cohesion: 0.13
Nodes (17): containedFooter(), Child, october, september, PREMATURE, routeReady, titles, expectPointerCursor() (+9 more)

### Community 34 - "trend-chart.tsx"
Cohesion: 0.17
Nodes (17): bar(), BarChart(), BarSeries, PAD, BudgetProgressChart(), BudgetProgressPoint, buildSeries(), ChartFrame() (+9 more)

### Community 35 - "category-filter.tsx"
Cohesion: 0.19
Nodes (19): DateField(), Props, CategoryFilter(), CategoryFilterItem(), Command(), CommandEmpty(), CommandGroup(), CommandInput() (+11 more)

### Community 36 - "components.json"
Cohesion: 0.09
Nodes (21): aliases, components, hooks, lib, ui, utils, iconLibrary, menuAccent (+13 more)

### Community 37 - "CONTEXT.md"
Cohesion: 0.09
Nodes (21): Account, Allocate, Budget, Category, Drill-down, Duplicate Statement, Irregular, Left over (+13 more)

### Community 38 - "core/components.e2e.ts"
Cohesion: 0.14
Nodes (11): desktopOnly, @playwright/test, bounds(), contained(), expectWheelScrollsPageWhileOpen(), expectDropdownPreservesScroll(), scrollWithInput(), settledOverlayAlpha() (+3 more)

### Community 39 - "types.d.ts"
Cohesion: 0.10
Nodes (20): Account, Allocation, AnalyticsSummary, AnalyticsTreatment, Appearance, Budget, Category, CategoryWithChildren (+12 more)

### Community 40 - "importer.ts"
Cohesion: 0.25
Nodes (19): ensureAccount(), combine(), dbsDescriptionKey(), debitCreditAmount(), descriptionKey(), importDbs(), importFiles(), importOcbc() (+11 more)

### Community 41 - "auth-vault.ts"
Cohesion: 0.29
Nodes (14): POST(), POST(), POST(), jose, AUTH_COOKIE_NAME, authCookie(), authCookieConfig(), clientIp() (+6 more)

### Community 42 - "export-import.ts"
Cohesion: 0.20
Nodes (15): withoutActionModes(), EXPORT_VERSION, FinpointExport, importData(), monthlyBudgetFields(), parseImportFile(), SYNC_TABLES, TableName (+7 more)

### Community 43 - "collectTests"
Cohesion: 0.28
Nodes (16): collectTests(), conditionBranch(), detailsTags(), disabled(), mentionsMotion(), record(), splitTestCallee(), tagValues() (+8 more)

### Community 44 - "STYLE.md"
Cohesion: 0.16
Nodes (14): Allocation, APIs, Arguments, And Props, Code Style, Consistency, Copy, Core, Earning Its Place, Finpoint Style Additions (+6 more)

### Community 45 - "duplicates.ts"
Cohesion: 0.24
Nodes (14): descriptionAnchors(), descriptionIdentity(), dismissDuplicatePair(), DuplicateGroup, duplicateGroups(), DuplicateStatement, duplicateStatementIds(), eligible() (+6 more)

### Community 46 - "UI layer (app pages + components)"
Cohesion: 0.22
Nodes (11): app/**/page.tsx, Interactive routes are "use client" (search params via next/navigation), (month) route-group shell (Overview + Monthly Records), Pages take no props, Project Shape, React Compiler (enabled), Root Suspense (keeps routes static), src/routes.ts (centralized route paths) (+3 more)

### Community 47 - "formatter"
Cohesion: 0.15
Nodes (13): arrowParentheses, bracketSameLine, bracketSpacing, jsxQuoteStyle, quoteProperties, quoteStyle, semicolons, trailingCommas (+5 more)

### Community 48 - "devDependencies"
Cohesion: 0.15
Nodes (13): devDependencies, babel-plugin-react-compiler, @biomejs/biome, fake-indexeddb, @playwright/test, @tailwindcss/postcss, @types/luxon, @types/node (+5 more)

### Community 49 - "lucide-react"
Cohesion: 0.22
Nodes (11): lucide-react, react-day-picker, buttonVariants, Calendar(), CalendarDayButton(), ButtonVariant, Month, MonthCal() (+3 more)

### Community 50 - "pagination.tsx"
Cohesion: 0.38
Nodes (11): pageHref(), pageWindow(), PaginationFooter(), Pagination(), PaginationContent(), PaginationEllipsis(), PaginationItem(), PaginationLink() (+3 more)

### Community 51 - "biome.json"
Cohesion: 0.18
Nodes (10): source, assist, actions, files, includes, linter, enabled, overrides (+2 more)

### Community 52 - "rules"
Cohesion: 0.18
Nodes (11): noAdjacentSpacesInRegex, noBannedTypes, noExtraBooleanCast, noUselessCatch, noUselessThisAlias, noUselessTypeConstraint, rules, noFloatingPromises (+3 more)

### Community 54 - "monthly-budgets.test.ts"
Cohesion: 0.25
Nodes (8): FinpointDB, digestSnapshot(), hashLegacySnapshot(), hashSnapshot(), Snapshot, input, legacyPaceKey, today

### Community 55 - "src/data/* (persistence, migrations, seeding, backup serialization, Drive storage)"
Cohesion: 0.31
Nodes (8): Background Drive sync, bun test, src/data/* (persistence, migrations, seeding, backup serialization, Drive storage), IndexedDB (Dexie), Domain and importer tests (Dexie with in-memory IndexedDB), src/logic/* (domain reads and operations), Verification, Workspace backup/reset operations

### Community 56 - "manifest.json"
Cohesion: 0.20
Nodes (9): background_color, description, display, icons, name, scope, short_name, start_url (+1 more)

### Community 57 - "spending-calendar.tsx"
Cohesion: 0.29
Nodes (9): compact(), heat(), INK, LEVELS, quantile(), rampCap(), SpendingCalendar(), STRENGTH (+1 more)

### Community 58 - "Next.js agent rules block ("This is NOT the Next.js you know")"
Cohesion: 0.25
Nodes (6): app/api/auth/* Route Handlers, node_modules/next/dist/server/lib/generate-agent-files.js, Google OAuth broker (exchange/token/logout), Next.js App Router app (mostly client-side), node_modules/next/dist/docs/, npm run dev (port 5173)

### Community 59 - "scripts"
Cohesion: 0.22
Nodes (9): scripts, build, dev, lint, lint:check, start, test:e2e, types:check (+1 more)

### Community 60 - "history.tsx"
Cohesion: 0.39
Nodes (7): getStoredHistory(), getValidHistory(), HistoryContext, HistoryItem, HistoryProvider(), normaliseUrl(), withoutTrailingSelf()

### Community 61 - "src/components/*"
Cohesion: 0.25
Nodes (5): Agent Behavior, Generated / Ignored Files, src/components/*, src/components/ui/**/*, useLiveQuery

### Community 62 - "formatter"
Cohesion: 0.25
Nodes (8): formatter, attributePosition, enabled, formatWithErrors, indentStyle, indentWidth, lineEnding, lineWidth

### Community 63 - "app.tsx"
Cohesion: 0.32
Nodes (5): react-dom, App(), HarnessSection, sectionFromLocation(), root

### Community 65 - "Domain docs (single-context layout)"
Cohesion: 0.33
Nodes (7): Agent skills, CONTEXT.md, Domain docs (single-context layout), Domain Language, Issue tracker (local specs and tickets), .scratch/ local work tracking, String primary keys (not auto-increment)

### Community 66 - "Commands"
Cohesion: 0.38
Nodes (7): Biome (biome check --write), bun install, bun lint (write-mode), bun lint:check, bun run build, bun types:check, Commands

### Community 67 - "optionalDependencies"
Cohesion: 0.29
Nodes (7): optionalDependencies, lightningcss-linux-x64-gnu, lightningcss-win32-x64-msvc, @rollup/rollup-linux-x64-gnu, @rollup/rollup-win32-x64-msvc, @tailwindcss/oxide-linux-x64-gnu, @tailwindcss/oxide-win32-x64-msvc

### Community 68 - "vite.config.ts"
Cohesion: 0.29
Nodes (4): vite, @vitejs/plugin-react, harnessDir, repoRoot

### Community 69 - "tsconfig.e2e.json"
Cohesion: 0.29
Nodes (6): ./tsconfig.json, compilerOptions, incremental, exclude, extends, include

### Community 70 - "Comparison window"
Cohesion: 0.33
Nodes (5): Compare selection uses included comparison months and title-based uniqueness, Gross and net category selection URL, Comparison window, Drill-down URL state, Biggest changes compares same-period net Spending Records

### Community 71 - "style"
Cohesion: 0.33
Nodes (6): style, noNamespace, noNonNullAssertion, useArrayLiterals, useAsConstAssertion, useBlockStatements

### Community 72 - "0002 Forecast pacing"
Cohesion: 0.33
Nodes (5): 0002 Forecast pacing, Consequences, Context, Decision, Rejected option

### Community 73 - "Validation rule (ValidationError + Validator)"
Cohesion: 0.50
Nodes (4): Old Laravel Api/*Controller mapping, Laravel-shaped { field: string[] } error maps, ValidationError, Validator

### Community 74 - "Finpoint icon concept"
Cohesion: 0.40
Nodes (5): Finpoint icon concept, Charcoal shadow halo, Circular point, Rounded F monogram, Off-white icon fill

### Community 75 - "Finpoint icon with charcoal shadow"
Cohesion: 0.40
Nodes (5): Finpoint icon with charcoal shadow, Charcoal shadow halo, Circular point, Rounded F monogram, Off-white icon fill

### Community 76 - "Issue tracker: Local Markdown"
Cohesion: 0.40
Nodes (4): Files, Issue tracker: Local Markdown, Skill operations, Status and dependencies

### Community 77 - "Finpoint"
Cohesion: 0.50
Nodes (4): Finpoint, Circular point, Rounded F monogram, Off-white icon fill

### Community 78 - "Domain docs"
Cohesion: 0.50
Nodes (3): Before exploration, Domain docs, Writing

### Community 79 - "Local Markdown Issue Tracker"
Cohesion: 0.50
Nodes (4): Local Tracker Operations, Spec and Ticket Files, Ticket Lifecycle, Local Markdown Issue Tracker

### Community 81 - "Forecast pacing decision"
Cohesion: 0.67
Nodes (3): Forecast pacing decision, Remaining historical spending scaled by remaining days, Median daily spending fallback including zero days

### Community 82 - "F monogram icon"
Cohesion: 0.67
Nodes (3): Circular dot beside F, Rounded F letterform, F monogram icon

### Community 83 - "JPG favicon icon"
Cohesion: 0.67
Nodes (3): JPG favicon dot, JPG favicon F letterform, JPG favicon icon

### Community 84 - "PNG favicon icon"
Cohesion: 0.67
Nodes (3): PNG favicon dot, PNG favicon F letterform, PNG favicon icon

### Community 85 - "SVG favicon icon"
Cohesion: 0.67
Nodes (3): SVG favicon dot, SVG favicon F letterform, SVG favicon icon

### Community 86 - "F monogram icon"
Cohesion: 0.67
Nodes (3): Circular dot beside F, Rounded F letterform, F monogram icon

### Community 87 - "F monogram icon"
Cohesion: 0.67
Nodes (3): Circular dot beside F, Rounded F letterform, F monogram icon

### Community 88 - "Dashboard"
Cohesion: 0.67
Nodes (3): Dashboard, Empty month offers latest recorded month, Empty workspace import and demo start state

## Knowledge Gaps
- **125 isolated node(s):** `bun install`, `bun run build`, `bun types:check`, `Conventions`, `.scratch/ local work tracking` (+120 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 640 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **12 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `react` to `record-editor.tsx`, `(month)/page.tsx`, `budgets/[id]/page.tsx`, `Button`, `budgets/page.tsx`, `primitives.tsx`, `sidebar.tsx`, `utils.ts`, `cn`, `icon.tsx`, `providers.tsx`, `combobox.tsx`, `package.json`, `auto-sync.ts`, `trend-chart.tsx`, `category-filter.tsx`, `lucide-react`, `pagination.tsx`, `spending-calendar.tsx`, `history.tsx`, `app.tsx`?**
  _High betweenness centrality (0.075) - this node is a cross-community bridge._
- **What connects `bun install`, `bun run build`, `bun types:check` to the rest of the system?**
  _125 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `record-editor.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.05607600823865524 - nodes in this community are weakly interconnected._
- **Why does `cn()` connect `cn` to `record-editor.tsx`, `react`, `trend-chart.tsx`, `category-filter.tsx`, `(month)/page.tsx`, `budgets/[id]/page.tsx`, `Button`, `budgets/page.tsx`, `primitives.tsx`, `sidebar.tsx`, `utils.ts`, `icon.tsx`, `lucide-react`, `pagination.tsx`, `combobox.tsx`, `providers.tsx`, `spending-calendar.tsx`?**
  _High betweenness centrality (0.073) - this node is a cross-community bridge._
- **Should `react` be split into smaller, more focused modules?**
  _Cohesion score 0.07517460317460317 - nodes in this community are weakly interconnected._
- **Why does `src/data/* (persistence, migrations, seeding, backup serialization, Drive storage)` connect `src/data/* (persistence, migrations, seeding, backup serialization, Drive storage)` to `providers.tsx`, `UI layer (app pages + components)`?**
  _High betweenness centrality (0.060) - this node is a cross-community bridge._
- **Should `db.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.059907834101382486 - nodes in this community are weakly interconnected._