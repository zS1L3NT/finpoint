# Graph Report - t3-69efe8e6  (2026-11-07)

## Corpus Check
- 265 files · ~237,961 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 9 file(s) not represented in the graph (top: (none) 5, .example 1, .lock 1)

## Summary
- 1978 nodes · 7931 edges · 101 communities (88 shown, 13 thin omitted)
- Extraction: 98% EXTRACTED · 2% INFERRED · 0% AMBIGUOUS · INFERRED: 132 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `b4acd7f3`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- record-editor.tsx
- statements/duplicates/page.tsx
- db.ts
- Tests README
- suggestions.ts
- primitives.tsx
- importer/page.tsx
- dashboard.ts
- sidebar.tsx
- categories/page.tsx
- icon.tsx
- records.ts
- react
- statements.ts
- cn
- amount-filter.tsx
- editors.ts
- compilerOptions
- Button
- lib/motion.ts
- package.json
- dependencies
- combobox.tsx
- auto-sync.ts
- ledger.e2e.ts
- ValidationError
- (month)/page.tsx
- suspicious
- test
- test-data.ts
- Validator
- support/motion.ts
- correctness
- export-import.ts
- data.ts
- sync/page.tsx
- components.json
- drive-sync.ts
- types.d.ts
- accounts/page.tsx
- auth-vault.ts
- statement-rules.ts
- core/routes.e2e.ts
- Statement
- alert-dialog.tsx
- providers.tsx
- core/components.e2e.ts
- google-drive.ts
- STYLE.md
- IndexedDB (Dexie)
- formatter
- devDependencies
- pagination.tsx
- Commands
- Next.js agent rules block ("This is NOT the Next.js you know")
- biome.json
- rules
- workflows.e2e.ts
- src/data/* (persistence, migrations, seeding, backup serialization, Drive storage)
- manifest.json
- spending-calendar.tsx
- 0001-drill-down-url-state.md
- scripts
- formatter
- Records
- navigation.e2e.ts
- Domain docs (single-context layout)
- optionalDependencies
- lucide-react
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
- Google Drive sync
- Forecast pacing decision
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
- Calendar and forecast daily views
- Generated demo data
- Progressive Web Application
- Dashboard summary metrics
- app.tsx
- monthly-budgets.test.ts
- HistoryProvider

## God Nodes (most connected - your core abstractions)
1. `cn()` - 324 edges
2. `PrimitivesSection()` - 181 edges
3. `Button()` - 127 edges
4. `react` - 99 edges
5. `formatCurrency()` - 78 edges
6. `RecordEditorDialog()` - 65 edges
7. `RecordCreatorDialog()` - 58 edges
8. `UiIcon()` - 56 edges
9. `round2()` - 48 edges
10. `pluralize()` - 44 edges

## Surprising Connections (you probably didn't know these)
- `Largest Records and absolute amount sorting` --documents--> `LargestRecords()`  [INFERRED]
  README.md → src/components/charts/largest-records.tsx
- `Edit Records within the Drill-down` --documents--> `DrillPanel()`  [INFERRED]
  README.md → src/components/drill/panel.tsx
- `Finpoint Style Additions` --references--> `useApiFormErrors()`  [INFERRED]
  STYLE.md → src/hooks/use-api-form-errors.ts
- `Copy` --references--> `pluralize()`  [INFERRED]
  STYLE.md → src/lib/utils.ts
- `Largest selection preserves amount order before pagination` --documents--> `Selection`  [INFERRED]
  docs/adr/0001-drill-down-url-state.md → src/logic/drilldown.ts

## Import Cycles
- None detected.

## Communities (101 total, 13 thin omitted)

### Community 0 - "record-editor.tsx"
Cohesion: 0.06
Nodes (118): SECTIONS, CandidateResults(), PendingCard(), @base-ui/react, sonner, @tanstack/react-form, AccountDialog(), BudgetCreatorDialog() (+110 more)

### Community 1 - "statements/duplicates/page.tsx"
Cohesion: 0.15
Nodes (49): AccountPage(), AllocatorPage(), ScopeSelect(), byRecordDay, FILTER_KEYS, Filters, MonthlyRecordFilters(), MonthlyRecordsPage() (+41 more)

### Community 2 - "db.ts"
Cohesion: 0.08
Nodes (22): dexie, fake-indexeddb, xlsx, AccountRow, AnalyticsMonthRow, asPending(), BudgetRecordRow, BudgetRow (+14 more)

### Community 3 - "Tests README"
Cohesion: 0.06
Nodes (41): Build harness step (vite build tests/harness), Playwright browser cache keyed on bun.lock, blob report merge, Committed graph artifacts (graph.json, GRAPH_REPORT.md, manifest.json, .graphify_labels.json), Graph health warnings and refresh failure reporting, graphify-out/graph.json, graphify skill (--update), graphify update . (+33 more)

### Community 4 - "suggestions.ts"
Cohesion: 0.10
Nodes (32): AllocationRow, MonthlyBudgetRow, allocatedStatements(), asOf(), byDate(), CHIP_LIMIT, CHOICES, Clue (+24 more)

### Community 5 - "primitives.tsx"
Cohesion: 0.09
Nodes (47): AlertAction(), Command(), CommandEmpty(), CommandGroup(), CommandItem(), CommandList(), CommandSeparator(), CommandShortcut() (+39 more)

### Community 6 - "importer/page.tsx"
Cohesion: 0.19
Nodes (33): ACCEPT, BANKS_REQUIRING_ADDITIONAL_INFO, ImporterPage(), Step(), EmptyRecords(), metadata, PrivacyPage(), SECTIONS (+25 more)

### Community 7 - "dashboard.ts"
Cohesion: 0.11
Nodes (46): db, AnalyticsRecord, AnalyticsSummary, contribution(), summarize(), summaryMeasure(), avg(), buildCashflowHistory() (+38 more)

### Community 8 - "sidebar.tsx"
Cohesion: 0.11
Nodes (33): AppearanceOption, APPEARANCES, AppearanceSwitch(), AppSidebar(), SyncDot(), SYSTEM_APPEARANCE, useSyncIndicator(), SidebarContent() (+25 more)

### Community 9 - "categories/page.tsx"
Cohesion: 0.11
Nodes (28): Largest selection preserves amount order before pagination, CategoriesPage(), CategoryDialogState, CategoryTile(), CashflowChart(), CashflowPoint, aggregateSeries(), CategoryHistoryChart() (+20 more)

### Community 10 - "icon.tsx"
Cohesion: 0.13
Nodes (24): Rule, RuleSentence(), StatementRulesPage(), framer-motion, AllocateBar(), Sparkline(), DetailSummaryItem(), DynamicUiIcon() (+16 more)

### Community 11 - "records.ts"
Cohesion: 0.15
Nodes (17): createBudget(), inferRecordDatetime(), analyticsValues(), budgetCovers(), ConflictError, createMatchingRecords(), createRecord(), RecordFilters (+9 more)

### Community 12 - "react"
Cohesion: 0.08
Nodes (58): BudgetPage(), getBudgetAnalytics(), getCategoryData(), Legend(), comparisonText(), SummaryBand(), Edit Records within the Drill-down, react (+50 more)

### Community 13 - "statements.ts"
Cohesion: 0.12
Nodes (33): allocationOutcome(), descriptionAnchors(), descriptionIdentity(), DuplicateGroup, duplicateGroups(), DuplicateStatement, duplicateStatementIds(), eligible() (+25 more)

### Community 14 - "cn"
Cohesion: 0.14
Nodes (26): class-variance-authority, radix-ui, AppHeader(), ButtonGroup(), ButtonGroupSeparator(), ButtonGroupText(), buttonGroupVariants, FieldSeparator() (+18 more)

### Community 15 - "amount-filter.tsx"
Cohesion: 0.26
Nodes (20): PendingStatementConfirmationSheet(), RecordSearchSheet(), StatementSearchSheet(), AmountFilter(), AmountRange, COMPARISONS, describe(), Draft (+12 more)

### Community 16 - "editors.ts"
Cohesion: 0.14
Nodes (20): editors, editors, longName, expectHeldRead(), expectRetainedRows(), expectSilentSheet(), expectVisibleBackdrop(), account (+12 more)

### Community 17 - "compilerOptions"
Cohesion: 0.06
Nodes (33): compilerOptions, allowJs, allowSyntheticDefaultImports, allowUnusedLabels, esModuleInterop, forceConsistentCasingInFileNames, incremental, isolatedModules (+25 more)

### Community 18 - "Button"
Cohesion: 0.22
Nodes (22): MonthLayout(), luxon, react-day-picker, DateField(), Props, DateRange(), formatRange(), Props (+14 more)

### Community 19 - "lib/motion.ts"
Cohesion: 0.19
Nodes (29): @tanstack/react-table, DataTable(), PaginatedDataTable(), GroupHeaderRow(), groupStarts(), GroupTotal(), isInteractiveTarget(), LeavingRows() (+21 more)

### Community 20 - "package.json"
Cohesion: 0.07
Nodes (28): private, $schema, type, babel-plugin-react-compiler, @biomejs/biome, clsx, cmdk, @fontsource-variable/inter (+20 more)

### Community 21 - "dependencies"
Cohesion: 0.07
Nodes (30): dependencies, @base-ui/react, class-variance-authority, clsx, cmdk, dexie, dexie-react-hooks, @fontsource-variable/inter (+22 more)

### Community 22 - "combobox.tsx"
Cohesion: 0.13
Nodes (21): ComboboxChip(), ComboboxChips(), ComboboxChipsInput(), ComboboxClear(), ComboboxCollection(), ComboboxEmpty(), ComboboxGroup(), ComboboxInput() (+13 more)

### Community 23 - "auto-sync.ts"
Cohesion: 0.14
Nodes (24): SYNC_TABLES, isDriveConfigured(), useSyncToasts(), cycle(), emit(), eventListeners, finishCycle(), flushOnHide() (+16 more)

### Community 24 - "ledger.e2e.ts"
Cohesion: 0.05
Nodes (60): typescript, vite, @vitejs/plugin-react, bar(), BarChart(), BarSeries, PAD, ChartFrame() (+52 more)

### Community 25 - "ValidationError"
Cohesion: 0.23
Nodes (22): ensureAccount(), combine(), dbsDescriptionKey(), debitCreditAmount(), descriptionKey(), importDbs(), importFiles(), importOcbc() (+14 more)

### Community 26 - "(month)/page.tsx"
Cohesion: 0.09
Nodes (46): RedirectPage(), RedirectPage(), Comparison, ComparisonValue, DashboardData, DashboardMonthlyBudget, DashboardPage(), DashboardView (+38 more)

### Community 27 - "suspicious"
Cohesion: 0.07
Nodes (28): suspicious, noAssignInExpressions, noAsyncPromiseExecutor, noCatchAssign, noClassAssign, noCompareNegZero, noControlCharactersInRegex, noDebugger (+20 more)

### Community 28 - "test"
Cohesion: 0.24
Nodes (8): cardTitles, card(), chartTooltip, overview, overviewCharts, themedRgb(), seedWorkspace(), test

### Community 29 - "test-data.ts"
Cohesion: 0.12
Nodes (23): Boot(), DEFAULT_CATEGORIES, DEFAULT_MONTHLY_BUDGETS, EXPORT_VERSION, FinpointExport, tableCounts(), SEED_HASH_KEY, seedIfEmpty() (+15 more)

### Community 30 - "Validator"
Cohesion: 0.26
Nodes (17): updateAccount(), validateBudget(), cleanInput(), dismissDuplicatePair(), restoreDuplicatePair(), amountFor(), createMonthlyBudget(), defaultAmountFor() (+9 more)

### Community 31 - "support/motion.ts"
Cohesion: 0.17
Nodes (20): denseCardConsumers, denseRowConsumers, expectConsumerEntrance(), populatedConsumers, attachSamplingFailure(), expectModalEntrance(), expectModalExit(), expectPopupEntrance() (+12 more)

### Community 32 - "correctness"
Cohesion: 0.08
Nodes (26): noConstantCondition, noConstAssign, noEmptyCharacterClassInRegex, noEmptyPattern, noGlobalObjectCalls, noInvalidBuiltinInstantiation, noInvalidConstructorSuper, noNonoctalDecimalEscape (+18 more)

### Community 33 - "export-import.ts"
Cohesion: 0.16
Nodes (17): FinpointDB, withoutActionModes(), clearAllData(), downloadExport(), importData(), monthlyBudgetFields(), parseImportFile(), TableName (+9 more)

### Community 34 - "data.ts"
Cohesion: 0.13
Nodes (23): buildDense(), buildEmpty(), buildPopulated(), cycle(), DEFAULT_SETTINGS, emptyTables(), getScenario(), learnedCoffee() (+15 more)

### Community 35 - "sync/page.tsx"
Cohesion: 0.17
Nodes (19): COUNT_ROWS, DataSettingsPage(), StateRow(), STATUS_TONES, StatusTone, WorkspaceRow(), wasVaultProven(), useSyncStatus() (+11 more)

### Community 36 - "components.json"
Cohesion: 0.09
Nodes (21): aliases, components, hooks, lib, ui, utils, iconLibrary, menuAccent (+13 more)

### Community 37 - "drive-sync.ts"
Cohesion: 0.34
Nodes (16): exportData(), downloadBackupFile(), driveFetch(), findBackupFile(), getClockSkewMs(), getFileMeta(), uploadBackupFile(), hashSnapshot() (+8 more)

### Community 38 - "types.d.ts"
Cohesion: 0.10
Nodes (20): Account, Allocation, AnalyticsSummary, AnalyticsTreatment, Appearance, Budget, Category, CategoryWithChildren (+12 more)

### Community 39 - "accounts/page.tsx"
Cohesion: 0.16
Nodes (17): AccountCard(), AccountRow, AccountsPage(), BUDGET_STATES, BudgetCard(), BudgetsPage(), BudgetState, formatBudgetDateWindow() (+9 more)

### Community 40 - "auth-vault.ts"
Cohesion: 0.29
Nodes (14): POST(), POST(), POST(), jose, AUTH_COOKIE_NAME, authCookie(), authCookieConfig(), clientIp() (+6 more)

### Community 41 - "statement-rules.ts"
Cohesion: 0.19
Nodes (15): StatementRow, byCreation(), conditionPattern(), deleteStatementRule(), listStatementRules(), matchesStatement(), NAME_ORDER, previewStatementRule() (+7 more)

### Community 42 - "core/routes.e2e.ts"
Cohesion: 0.18
Nodes (13): @playwright/test, Child, october, september, PREMATURE, routeReady, titles, installDateOnly() (+5 more)

### Community 43 - "Statement"
Cohesion: 0.16
Nodes (15): CONTEXT.md (domain vocabulary), Account, Allocation, Budget, Category, Duplicate Statement, Monthly Budget, Pending Record (+7 more)

### Community 44 - "alert-dialog.tsx"
Cohesion: 0.34
Nodes (12): DriveOverwriteConfirmation(), AlertDialog(), AlertDialogAction(), AlertDialogCancel(), AlertDialogContent(), AlertDialogDescription(), AlertDialogFooter(), AlertDialogHeader() (+4 more)

### Community 45 - "providers.tsx"
Cohesion: 0.15
Nodes (22): metadata, RootLayout(), viewport, Providers(), SidebarInset(), SidebarProvider(), Toaster(), TooltipProvider() (+14 more)

### Community 46 - "core/components.e2e.ts"
Cohesion: 0.14
Nodes (11): desktopOnly, bounds(), contained(), expectWheelScrollsPageWhileOpen(), containedFooter(), expectDropdownPreservesScroll(), expectPointerCursor(), scrollWithInput() (+3 more)

### Community 47 - "google-drive.ts"
Cohesion: 0.24
Nodes (12): AuthNeededError, cacheToken(), CodeResponse, disconnectDrive(), DriveFileMeta, ensureDriveToken(), ensureDriveTokenSilent(), googleClientId() (+4 more)

### Community 48 - "STYLE.md"
Cohesion: 0.18
Nodes (12): APIs, Arguments, And Props, Code Style, Consistency, Core, Earning Its Place, Finpoint Style Additions, Grouping And Order, Motion and polish (+4 more)

### Community 49 - "IndexedDB (Dexie)"
Cohesion: 0.18
Nodes (9): app/**/page.tsx, IndexedDB (Dexie), Interactive routes are "use client" (search params via next/navigation), Pages take no props, Project Shape, React Compiler (enabled), Root Suspense (keeps routes static), URL search params (filters and pagination) (+1 more)

### Community 50 - "formatter"
Cohesion: 0.15
Nodes (13): arrowParentheses, bracketSameLine, bracketSpacing, jsxQuoteStyle, quoteProperties, quoteStyle, semicolons, trailingCommas (+5 more)

### Community 51 - "devDependencies"
Cohesion: 0.15
Nodes (13): devDependencies, babel-plugin-react-compiler, @biomejs/biome, fake-indexeddb, @playwright/test, @tailwindcss/postcss, @types/luxon, @types/node (+5 more)

### Community 52 - "pagination.tsx"
Cohesion: 0.38
Nodes (11): pageHref(), pageWindow(), PaginationFooter(), Pagination(), PaginationContent(), PaginationEllipsis(), PaginationItem(), PaginationLink() (+3 more)

### Community 53 - "Commands"
Cohesion: 0.20
Nodes (11): Agent Behavior, Biome (biome check --write), bun install, bun lint (write-mode), bun lint:check, bun run build, bun types:check, Commands (+3 more)

### Community 54 - "Next.js agent rules block ("This is NOT the Next.js you know")"
Cohesion: 0.18
Nodes (9): app/api/auth/* Route Handlers, bun test, node_modules/next/dist/server/lib/generate-agent-files.js, Google OAuth broker (exchange/token/logout), Domain and importer tests (Dexie with in-memory IndexedDB), Next.js App Router app (mostly client-side), node_modules/next/dist/docs/, npm run dev (port 5173) (+1 more)

### Community 55 - "biome.json"
Cohesion: 0.18
Nodes (10): source, assist, actions, files, includes, linter, enabled, overrides (+2 more)

### Community 56 - "rules"
Cohesion: 0.18
Nodes (11): noAdjacentSpacesInRegex, noBannedTypes, noExtraBooleanCast, noUselessCatch, noUselessThisAlias, noUselessTypeConstraint, rules, noFloatingPromises (+3 more)

### Community 58 - "src/data/* (persistence, migrations, seeding, backup serialization, Drive storage)"
Cohesion: 0.38
Nodes (8): Background Drive sync, src/data/* (persistence, migrations, seeding, backup serialization, Drive storage), src/logic/* (domain reads and operations), (month) route-group shell (Overview + Monthly Records), src/routes.ts (centralized route paths), Static content pages (privacy, terms) are server components, UI layer (app pages + components), Workspace backup/reset operations

### Community 59 - "manifest.json"
Cohesion: 0.20
Nodes (9): background_color, description, display, icons, name, scope, short_name, start_url (+1 more)

### Community 60 - "spending-calendar.tsx"
Cohesion: 0.29
Nodes (9): compact(), heat(), INK, LEVELS, quantile(), rampCap(), SpendingCalendar(), STRENGTH (+1 more)

### Community 61 - "0001-drill-down-url-state.md"
Cohesion: 0.25
Nodes (8): Record focus, Statement pivot, Gross and net category selection URL, Drill-down, Drill-down URL state, Forecast and Monthly Budget Drill-down with explicit scope, Category and trend Drill-down, Calendar day Drill-down

### Community 62 - "scripts"
Cohesion: 0.22
Nodes (9): scripts, build, dev, lint, lint:check, start, test:e2e, types:check (+1 more)

### Community 63 - "formatter"
Cohesion: 0.25
Nodes (8): formatter, attributePosition, enabled, formatWithErrors, indentStyle, indentWidth, lineEnding, lineWidth

### Community 64 - "Records"
Cohesion: 0.32
Nodes (8): Allocator, Budgets, Categories, Dashboard, Statement-allocation-record model, Monthly Budgets, Records, Statement importer

### Community 66 - "Domain docs (single-context layout)"
Cohesion: 0.33
Nodes (7): Agent skills, CONTEXT.md, Domain docs (single-context layout), Domain Language, Issue tracker (local specs and tickets), .scratch/ local work tracking, String primary keys (not auto-increment)

### Community 67 - "optionalDependencies"
Cohesion: 0.29
Nodes (7): optionalDependencies, lightningcss-linux-x64-gnu, lightningcss-win32-x64-msvc, @rollup/rollup-linux-x64-gnu, @rollup/rollup-win32-x64-msvc, @tailwindcss/oxide-linux-x64-gnu, @tailwindcss/oxide-win32-x64-msvc

### Community 68 - "lucide-react"
Cohesion: 0.29
Nodes (7): lucide-react, ButtonVariant, Month, MonthCal(), MonthCalProps, MonthPicker(), MONTHS

### Community 69 - "tsconfig.e2e.json"
Cohesion: 0.29
Nodes (6): ./tsconfig.json, compilerOptions, incremental, exclude, extends, include

### Community 70 - "style"
Cohesion: 0.33
Nodes (6): style, noNamespace, noNonNullAssertion, useArrayLiterals, useAsConstAssertion, useBlockStatements

### Community 71 - "0002 Forecast pacing"
Cohesion: 0.33
Nodes (5): 0002 Forecast pacing, Consequences, Context, Decision, Rejected option

### Community 72 - "Validation rule (ValidationError + Validator)"
Cohesion: 0.50
Nodes (4): Old Laravel Api/*Controller mapping, Laravel-shaped { field: string[] } error maps, ValidationError, Validator

### Community 73 - "Finpoint icon concept"
Cohesion: 0.40
Nodes (5): Finpoint icon concept, Charcoal shadow halo, Circular point, Rounded F monogram, Off-white icon fill

### Community 74 - "Finpoint icon with charcoal shadow"
Cohesion: 0.40
Nodes (5): Finpoint icon with charcoal shadow, Charcoal shadow halo, Circular point, Rounded F monogram, Off-white icon fill

### Community 75 - "Issue tracker: Local Markdown"
Cohesion: 0.40
Nodes (4): Files, Issue tracker: Local Markdown, Skill operations, Status and dependencies

### Community 76 - "Finpoint"
Cohesion: 0.50
Nodes (4): Finpoint, Circular point, Rounded F monogram, Off-white icon fill

### Community 77 - "Domain docs"
Cohesion: 0.50
Nodes (3): Before exploration, Domain docs, Writing

### Community 78 - "Local Markdown Issue Tracker"
Cohesion: 0.50
Nodes (4): Local Tracker Operations, Spec and Ticket Files, Ticket Lifecycle, Local Markdown Issue Tracker

### Community 80 - "Google Drive sync"
Cohesion: 0.50
Nodes (4): Google Drive sync, JSON backup and restore, Local-first finance tracking, Sync conflict handling

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

### Community 98 - "app.tsx"
Cohesion: 0.32
Nodes (5): react-dom, App(), HarnessSection, sectionFromLocation(), root

### Community 99 - "monthly-budgets.test.ts"
Cohesion: 0.29
Nodes (6): digestSnapshot(), hashLegacySnapshot(), Snapshot, input, legacyPaceKey, today

### Community 100 - "HistoryProvider"
Cohesion: 0.60
Nodes (5): getStoredHistory(), getValidHistory(), HistoryProvider(), normaliseUrl(), withoutTrailingSelf()

## Knowledge Gaps
- **95 isolated node(s):** `@fontsource-variable/inter`, `shadcn`, `tailwindcss`, `tw-animate-css`, `@biomejs/biome` (+90 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 608 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **13 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `cn()` connect `cn` to `record-editor.tsx`, `statements/duplicates/page.tsx`, `primitives.tsx`, `importer/page.tsx`, `sidebar.tsx`, `categories/page.tsx`, `icon.tsx`, `react`, `amount-filter.tsx`, `Button`, `lib/motion.ts`, `combobox.tsx`, `ledger.e2e.ts`, `(month)/page.tsx`, `sync/page.tsx`, `accounts/page.tsx`, `alert-dialog.tsx`, `providers.tsx`, `pagination.tsx`, `spending-calendar.tsx`, `lucide-react`?**
  _High betweenness centrality (0.109) - this node is a cross-community bridge._
- **What connects `@fontsource-variable/inter`, `shadcn`, `tailwindcss` to the rest of the system?**
  _95 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `record-editor.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.06490066225165562 - nodes in this community are weakly interconnected._
- **Why does `react` connect `react` to `record-editor.tsx`, `statements/duplicates/page.tsx`, `primitives.tsx`, `importer/page.tsx`, `sidebar.tsx`, `categories/page.tsx`, `icon.tsx`, `cn`, `amount-filter.tsx`, `Button`, `lib/motion.ts`, `package.json`, `combobox.tsx`, `auto-sync.ts`, `ledger.e2e.ts`, `(month)/page.tsx`, `sync/page.tsx`, `accounts/page.tsx`, `alert-dialog.tsx`, `providers.tsx`, `pagination.tsx`, `spending-calendar.tsx`, `lucide-react`, `app.tsx`?**
  _High betweenness centrality (0.078) - this node is a cross-community bridge._
- **Should `db.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.07682926829268293 - nodes in this community are weakly interconnected._
- **Why does `src/data/* (persistence, migrations, seeding, backup serialization, Drive storage)` connect `src/data/* (persistence, migrations, seeding, backup serialization, Drive storage)` to `IndexedDB (Dexie)`, `providers.tsx`?**
  _High betweenness centrality (0.070) - this node is a cross-community bridge._
- **Should `Tests README` be split into smaller, more focused modules?**
  _Cohesion score 0.05928614640048397 - nodes in this community are weakly interconnected._