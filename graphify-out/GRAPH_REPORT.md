# Graph Report - t3-d9bfcf4d  (2026-11-09)

## Corpus Check
- 331 files · ~311,210 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 10 file(s) not represented in the graph (top: (none) 5, .example 1, .tsv 1)

## Summary
- 2486 nodes · 8614 edges · 166 communities (147 shown, 19 thin omitted)
- Extraction: 97% EXTRACTED · 3% INFERRED · 0% AMBIGUOUS · INFERRED: 242 edges (avg confidence: 0.89)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `14007a85`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- record-editor.tsx
- records/page.tsx
- ledger.e2e.ts
- primitives.tsx
- DemoOffer
- Tests README
- sync/page.tsx
- cn
- data.ts
- dashboard.ts
- command.tsx
- RecordEditorDialog
- lib/motion.ts
- editors.ts
- compilerOptions
- react
- collectTests
- package.json
- dependencies
- db.ts
- suggestions.ts
- budgets/[id]/page.tsx
- routes.ts
- suspicious
- records.ts
- fixtures.ts
- duplicates/page.tsx
- support/motion.ts
- correctness
- vite.config.ts
- README.md
- combobox.tsx
- importer/page.tsx
- test-data.ts
- core/routes.e2e.ts
- CONTEXT.md
- Spec: Insight and drill-down
- components.json
- core/components.e2e.ts
- (month)/page.tsx
- drive-sync.ts
- types.d.ts
- State persistence rule (ephemeral UI state vs IndexedDB)
- auth-vault.ts
- icon.tsx
- export-import.ts
- STYLE.md
- record-columns.tsx
- alert-dialog.tsx
- formatter
- devDependencies
- pagination.tsx
- Commands
- Dashboard
- use-appearance.tsx
- biome.json
- rules
- drilldown.ts
- use-drill.ts
- src/data/* (persistence, migrations, seeding, backup serialization, Drive storage)
- manifest.json
- spending-calendar.tsx
- Next.js agent rules block ("This is NOT the Next.js you know")
- scripts
- 2. New issues
- formatter
- Button
- providers.tsx
- navigation.e2e.ts
- Domain docs (single-context layout)
- optionalDependencies
- tsconfig.e2e.json
- style
- 0002 Forecast pacing
- 0001-drill-down-url-state.md
- Validation rule (ValidationError + Validator)
- Term
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
- logic/settings.ts
- UI layer
- 2. New issues
- 2. New issues
- src/components/*
- 2. New issues
- 2. New issues
- Separator
- item.tsx
- ⚠️ TEMPORARY HANDOFF: DELETE THIS WHOLE `TEMP-HANDOFF/` FOLDER BEFORE THE PR LEAVES DRAFT
- 2. New issues
- pathRecords
- Results
- 2. New issues
- 21 design fixes, round 2
- 1. Earlier findings (F-ids)
- app.tsx
- enrichRecords
- Design review: `ai/insight-drilldown` (PR #48) vs `main`
- Final review (Opus, by hand) — 2026-11-08
- 02 forecast pacing
- 15 mobile
- 09 terms and copy
- 10 biggest changes words
- 17 retire monthly records
- 18 allocate rename and statement tabs
- 20 design fixes (from Sonnet design review)
- 24 statement pivot keeps the old total and header
- 25 pending reason is not stated, and its caption repeats
- 26 Statements rows are not clickable except the chevron
- 27 forecast chart draws last month's line with no key
- 28 compare panel columns are uneven and unexplained
- 29 a refund shows as a plain amount in the Spending list
- 31 stale "Back to October 2026" on the Dashboard, and "Clear 1" with no filter
- 33 Drill-down opens as side peek, center peek or full page (user picks)
- 34 Drill-down hover, press and focus polish
- 35 Records and Statements filter widths consistent across screens
- 36 Show at a glance which filters are active
- 38 Dashboard cards in a row have different heights
- 40 Closing the full-page drill leaves it in Back history
- 41 Income drill-down shows the Spending caption and a bare $0.00
- buildProjection
- 00 prototype
- 04 category trend drilldowns
- 05 budget drilldown
- 06 record statement pivot
- 07 edit from panel
- 08 summary band
- 11 headline attention
- 12 largest records
- 13 remove charts
- 16 reconciliation
- 23 mobile sheet polish + flaky drill test
- 37 Categories card: names render centered
- 42 Plain-words pass on what's left of the jargon
- Priya (29, nurse, mobile 390x844) — insight drill-down acceptance test
- Tyrone — usability test report
- 43 Unslop pass: 20 rules from the user's reference reel
- 39 Acceptance 2: 10 mimo-v2.6-flash personas
- next.config.ts
- AGENT-BRIEF.md
- run.sh

## God Nodes (most connected - your core abstractions)
1. `cn()` - 327 edges
2. `PrimitivesSection()` - 181 edges
3. `Button()` - 128 edges
4. `react` - 100 edges
5. `formatCurrency()` - 84 edges
6. `RecordEditorDialog()` - 67 edges
7. `UiIcon()` - 61 edges
8. `RecordCreatorDialog()` - 58 edges
9. `round2()` - 48 edges
10. `pluralize()` - 47 edges

## Surprising Connections (you probably didn't know these)
- `Month context stays separate from Back targets and Record filters` --conceptually_related_to--> `MonthLayout()`  [INFERRED]
  README.md → app/(month)/layout.tsx
- `Polish` --references--> `AllocationProgress()`  [INFERRED]
  TEMP-HANDOFF/design-review-REPORT.md → src/components/allocation-progress.tsx
- `3. Findings ledger: keep, change, drop` --references--> `AllocationProgress()`  [INFERRED]
  TEMP-HANDOFF/spec.md → src/components/allocation-progress.tsx
- `4.4 Records, Statements and the Allocation links between them` --references--> `AllocationProgress()`  [INFERRED]
  TEMP-HANDOFF/spec.md → src/components/allocation-progress.tsx
- `Forecast dotted comparison names the previous month` --conceptually_related_to--> `CashflowChart()`  [INFERRED]
  README.md → src/components/charts/cashflow-chart.tsx

## Import Cycles
- None detected.

## Communities (166 total, 19 thin omitted)

### Community 0 - "record-editor.tsx"
Cohesion: 0.08
Nodes (97): sonner, @tanstack/react-form, AccountDialog(), BudgetCreatorDialog(), BudgetEditorDialog(), CategoryDialog(), CategoryFormValues, EMPTY_FORM_VALUES (+89 more)

### Community 1 - "records/page.tsx"
Cohesion: 0.17
Nodes (38): AccountPage(), AccountCard(), AccountRow, AccountsPage(), AllocatorPage(), RecordCreatorHost(), RecordFilters(), RecordsPage() (+30 more)

### Community 2 - "ledger.e2e.ts"
Cohesion: 0.11
Nodes (25): behaviourCoverage, componentInventory, facetNotApplicable, InventoryEntry, modalAnimationCoverage, notApplicable, openFacets, RouteEntry (+17 more)

### Community 3 - "primitives.tsx"
Cohesion: 0.13
Nodes (25): radix-ui, DrillModeMenu(), MODES, DropdownMenu(), DropdownMenuCheckboxItem(), DropdownMenuContent(), DropdownMenuGroup(), DropdownMenuItem() (+17 more)

### Community 4 - "DemoOffer"
Cohesion: 0.25
Nodes (7): DemoOffer(), 14 empty states, Acceptance, Comments, Exact design (Opus, 2026-11-07) — implement literally, decide nothing, Final verification — 2026-11-07, commit 11632a19298f22824e06f89b01bc1256895f8848, What

### Community 5 - "Tests README"
Cohesion: 0.06
Nodes (41): Build harness step (vite build tests/harness), Playwright browser cache keyed on bun.lock, blob report merge, Committed graph artifacts (graph.json, GRAPH_REPORT.md, manifest.json, .graphify_labels.json), Graph health warnings and refresh failure reporting, graphify-out/graph.json, graphify skill (--update), graphify update . (+33 more)

### Community 6 - "sync/page.tsx"
Cohesion: 0.10
Nodes (33): COUNT_ROWS, DataSettingsPage(), StateRow(), STATUS_TONES, StatusTone, WorkspaceRow(), wasVaultProven(), useSyncStatus() (+25 more)

### Community 7 - "cn"
Cohesion: 0.10
Nodes (45): AppearanceSwitch(), AlertAction(), CardFooter(), EmptyContent(), FieldContent(), FieldLegend(), FieldSet(), FieldTitle() (+37 more)

### Community 8 - "data.ts"
Cohesion: 0.09
Nodes (21): AccountRow, AnalyticsMonthRow, BudgetRecordRow, BudgetRow, DuplicateDismissalRow, MonthlyBudgetAmountRow, MonthlyBudgetDefaultRow, DBS_VALID (+13 more)

### Community 9 - "dashboard.ts"
Cohesion: 0.16
Nodes (27): avg(), buildCashflowHistory(), buildCategories(), buildComparison(), buildMonthlyBudgets(), buildSeries(), buildSpendingHistory(), buildTrend() (+19 more)

### Community 10 - "command.tsx"
Cohesion: 0.15
Nodes (12): lucide-react, ICONS, CategoryFilterItem(), Command(), CommandEmpty(), CommandGroup(), CommandInput(), CommandItem() (+4 more)

### Community 11 - "RecordEditorDialog"
Cohesion: 0.17
Nodes (34): metadata, PrivacyPage(), SECTIONS, RecordPage(), StatementPage(), MethodHeader(), metadata, SECTIONS (+26 more)

### Community 12 - "lib/motion.ts"
Cohesion: 0.09
Nodes (50): framer-motion, @tanstack/react-table, bar(), BarChart(), BarSeries, PAD, ChartFrame(), ChartSize (+42 more)

### Community 13 - "editors.ts"
Cohesion: 0.13
Nodes (21): editors, containedFooter(), editors, longName, expectHeldRead(), expectRetainedRows(), expectSilentSheet(), expectVisibleBackdrop() (+13 more)

### Community 14 - "compilerOptions"
Cohesion: 0.06
Nodes (33): compilerOptions, allowJs, allowSyntheticDefaultImports, allowUnusedLabels, esModuleInterop, forceConsistentCasingInFileNames, incremental, isolatedModules (+25 more)

### Community 15 - "react"
Cohesion: 0.13
Nodes (44): AttentionList(), dexie-react-hooks, react, AllocationProgress(), AllocationExpansion(), AllocationRows(), AllocationSource, DrillPanel() (+36 more)

### Community 16 - "collectTests"
Cohesion: 0.28
Nodes (16): collectTests(), conditionBranch(), detailsTags(), disabled(), mentionsMotion(), record(), splitTestCallee(), tagValues() (+8 more)

### Community 17 - "package.json"
Cohesion: 0.07
Nodes (27): private, $schema, type, babel-plugin-react-compiler, @biomejs/biome, clsx, cmdk, @fontsource-variable/inter (+19 more)

### Community 18 - "dependencies"
Cohesion: 0.07
Nodes (30): dependencies, @base-ui/react, class-variance-authority, clsx, cmdk, dexie, dexie-react-hooks, @fontsource-variable/inter (+22 more)

### Community 19 - "db.ts"
Cohesion: 0.08
Nodes (22): dexie, fake-indexeddb, xlsx, DB_NAME, DB_VERSION, FinpointDB, MetaRow, SettingsRow (+14 more)

### Community 20 - "suggestions.ts"
Cohesion: 0.09
Nodes (40): AllocationRow, CategoryRow, MonthlyBudgetRow, allocatedStatements(), asOf(), byDate(), CHIP_LIMIT, CHOICES (+32 more)

### Community 21 - "budgets/[id]/page.tsx"
Cohesion: 0.17
Nodes (21): BudgetPage(), getBudgetAnalytics(), getCategoryData(), Legend(), AllocateBar(), BudgetProgressChart(), BudgetProgressPoint, buildSeries() (+13 more)

### Community 22 - "routes.ts"
Cohesion: 0.22
Nodes (23): AppearanceOption, APPEARANCES, AppSidebar(), SyncDot(), SYSTEM_APPEARANCE, useSyncIndicator(), TITLES, pathAccounts() (+15 more)

### Community 23 - "suspicious"
Cohesion: 0.07
Nodes (28): suspicious, noAssignInExpressions, noAsyncPromiseExecutor, noCatchAssign, noClassAssign, noCompareNegZero, noControlCharactersInRegex, noDebugger (+20 more)

### Community 24 - "records.ts"
Cohesion: 0.16
Nodes (15): RecordRow, resolveRecordChoices(), inferRecordDatetime(), analyticsValues(), budgetCovers(), ConflictError, createMatchingRecords(), createRecord() (+7 more)

### Community 25 - "fixtures.ts"
Cohesion: 0.14
Nodes (18): cardTitles, card(), chartTooltip, overview, overviewCharts, themedRgb(), ScenarioName, WorkspaceDataset (+10 more)

### Community 26 - "duplicates/page.tsx"
Cohesion: 0.17
Nodes (36): ScopeSelect(), SettingsPage(), CARD_MOTION, DuplicateGroupCard(), FixDuplicatesPage(), GroupHeader(), highlightDifferences(), VIEWS (+28 more)

### Community 27 - "support/motion.ts"
Cohesion: 0.17
Nodes (20): denseCardConsumers, denseRowConsumers, expectConsumerEntrance(), populatedConsumers, attachSamplingFailure(), expectModalEntrance(), expectModalExit(), expectPopupEntrance() (+12 more)

### Community 28 - "correctness"
Cohesion: 0.08
Nodes (26): noConstantCondition, noConstAssign, noEmptyCharacterClassInRegex, noEmptyPattern, noGlobalObjectCalls, noInvalidBuiltinInstantiation, noInvalidConstructorSuper, noNonoctalDecimalEscape (+18 more)

### Community 29 - "vite.config.ts"
Cohesion: 0.29
Nodes (4): vite, @vitejs/plugin-react, harnessDir, repoRoot

### Community 30 - "README.md"
Cohesion: 0.08
Nodes (24): Allocate workspace, Allocations, Backup and restore, Categories, Custom-period Budgets, Demo data, Financial terms definitions, Finpoint (+16 more)

### Community 31 - "combobox.tsx"
Cohesion: 0.10
Nodes (26): @base-ui/react, class-variance-authority, Props, ComboboxChip(), ComboboxChips(), ComboboxChipsInput(), ComboboxClear(), ComboboxCollection() (+18 more)

### Community 32 - "importer/page.tsx"
Cohesion: 0.06
Nodes (78): ACCEPT, BANKS_REQUIRING_ADDITIONAL_INFO, ImporterPage(), Step(), asPending(), BANKS, ensureAccount(), updateAccount() (+70 more)

### Community 33 - "test-data.ts"
Cohesion: 0.13
Nodes (20): db, DEFAULT_CATEGORIES, DEFAULT_MONTHLY_BUDGETS, EXPORT_VERSION, migrateRecordChoices(), SEED_HASH_KEY, BANK_BLURB, between() (+12 more)

### Community 34 - "core/routes.e2e.ts"
Cohesion: 0.18
Nodes (13): @playwright/test, Child, october, september, PREMATURE, routeReady, titles, installDateOnly() (+5 more)

### Community 35 - "CONTEXT.md"
Cohesion: 0.12
Nodes (21): Account, Allocate, Budget, Category, Drill-down, Duplicate Statement, Irregular, Left over (+13 more)

### Community 36 - "Spec: Insight and drill-down"
Cohesion: 0.05
Nodes (36): 32 Attention rows leave the Dashboard, and Spent rows are not grouped, Acceptance, Comments, Evidence, Fix, 0. How to use this plan, 10. Vocabulary (D5), 11. Task step counts: today vs target (+28 more)

### Community 37 - "components.json"
Cohesion: 0.09
Nodes (21): aliases, components, hooks, lib, ui, utils, iconLibrary, menuAccent (+13 more)

### Community 38 - "core/components.e2e.ts"
Cohesion: 0.14
Nodes (11): desktopOnly, bounds(), contained(), expectWheelScrollsPageWhileOpen(), expectDropdownPreservesScroll(), expectPointerCursor(), scrollWithInput(), settledOverlayAlpha() (+3 more)

### Community 39 - "(month)/page.tsx"
Cohesion: 0.09
Nodes (41): Largest selection preserves amount order before pagination, Comparison, comparisonText(), ComparisonValue, DashboardData, DashboardMonthlyBudget, DashboardPage(), DashboardView (+33 more)

### Community 40 - "drive-sync.ts"
Cohesion: 0.17
Nodes (31): exportData(), AuthNeededError, cacheToken(), CodeResponse, disconnectDrive(), downloadBackupFile(), driveFetch(), DriveFileMeta (+23 more)

### Community 41 - "types.d.ts"
Cohesion: 0.10
Nodes (20): Account, Allocation, AnalyticsSummary, AnalyticsTreatment, Appearance, Budget, Category, CategoryWithChildren (+12 more)

### Community 42 - "State persistence rule (ephemeral UI state vs IndexedDB)"
Cohesion: 0.22
Nodes (6): app/**/page.tsx, Interactive routes are "use client" (search params via next/navigation), Pages take no props, Root Suspense (keeps routes static), URL search params (filters and pagination), useLiveQuery

### Community 43 - "auth-vault.ts"
Cohesion: 0.29
Nodes (14): POST(), POST(), POST(), jose, AUTH_COOKIE_NAME, authCookie(), authCookieConfig(), clientIp() (+6 more)

### Community 44 - "icon.tsx"
Cohesion: 0.16
Nodes (22): CategoriesPage(), CategoryDialogState, CategoryTile(), SECTIONS, learnedSignals(), Rule, RuleSentence(), StatementRulesPage() (+14 more)

### Community 45 - "export-import.ts"
Cohesion: 0.15
Nodes (21): MODES, clearAllData(), downloadExport(), FinpointExport, importData(), monthlyBudgetFields(), parseImportFile(), SYNC_TABLES (+13 more)

### Community 46 - "STYLE.md"
Cohesion: 0.16
Nodes (14): Allocation, APIs, Arguments, And Props, Code Style, Consistency, Copy, Core, Earning Its Place, Finpoint Style Additions (+6 more)

### Community 47 - "record-columns.tsx"
Cohesion: 0.17
Nodes (20): formatRowTime(), RecordActions(), RecordActionsCell(), RecordAllocationProgress(), RecordAmountCell(), RecordEditButton(), RecordMonthlyBudget(), RecordRow (+12 more)

### Community 48 - "alert-dialog.tsx"
Cohesion: 0.34
Nodes (12): DriveOverwriteConfirmation(), AlertDialog(), AlertDialogAction(), AlertDialogCancel(), AlertDialogContent(), AlertDialogDescription(), AlertDialogFooter(), AlertDialogHeader() (+4 more)

### Community 49 - "formatter"
Cohesion: 0.15
Nodes (13): arrowParentheses, bracketSameLine, bracketSpacing, jsxQuoteStyle, quoteProperties, quoteStyle, semicolons, trailingCommas (+5 more)

### Community 50 - "devDependencies"
Cohesion: 0.15
Nodes (13): devDependencies, babel-plugin-react-compiler, @biomejs/biome, fake-indexeddb, @playwright/test, @tailwindcss/postcss, @types/luxon, @types/node (+5 more)

### Community 51 - "pagination.tsx"
Cohesion: 0.38
Nodes (11): pageHref(), pageWindow(), PaginationFooter(), Pagination(), PaginationContent(), PaginationEllipsis(), PaginationItem(), PaginationLink() (+3 more)

### Community 52 - "Commands"
Cohesion: 0.38
Nodes (7): Biome (biome check --write), bun install, bun lint (write-mode), bun lint:check, bun run build, bun types:check, Commands

### Community 53 - "Dashboard"
Cohesion: 0.11
Nodes (16): Comparison columns share ordering and show the average arithmetic, Dashboard, Forecast dotted comparison names the previous month, Month context stays separate from Back targets and Record filters, Past empty months show one dated message and import action, Pending Record reasons visible before expansion, Spending Drill-down refund signs, labels and gross arithmetic, Spent Drill-down category subtotals and compact half-height metadata (+8 more)

### Community 54 - "use-appearance.tsx"
Cohesion: 0.23
Nodes (15): Toaster(), Appearance, applyAppearance(), getStoredAppearance(), handleSystemThemeChange(), initializeAppearance(), isDarkMode(), listeners (+7 more)

### Community 55 - "biome.json"
Cohesion: 0.18
Nodes (10): source, assist, actions, files, includes, linter, enabled, overrides (+2 more)

### Community 56 - "rules"
Cohesion: 0.18
Nodes (11): noAdjacentSpacesInRegex, noBannedTypes, noExtraBooleanCast, noUselessCatch, noUselessThisAlias, noUselessTypeConstraint, rules, noFloatingPromises (+3 more)

### Community 57 - "drilldown.ts"
Cohesion: 0.24
Nodes (13): AnalyticsRecord, AnalyticsSummary, contribution(), summarize(), summaryMeasure(), getDrilldown(), getMonthlyRecords(), MonthlyFilters (+5 more)

### Community 58 - "use-drill.ts"
Cohesion: 0.22
Nodes (12): DrillPage(), DrillReturn, labelOf(), readReturn(), useDrill(), writeReturn(), SELECTION_KINDS, pathDashboard() (+4 more)

### Community 59 - "src/data/* (persistence, migrations, seeding, backup serialization, Drive storage)"
Cohesion: 0.36
Nodes (7): Background Drive sync, bun test, src/data/* (persistence, migrations, seeding, backup serialization, Drive storage), IndexedDB (Dexie), Domain and importer tests (Dexie with in-memory IndexedDB), src/logic/* (domain reads and operations), Workspace backup/reset operations

### Community 60 - "manifest.json"
Cohesion: 0.20
Nodes (9): background_color, description, display, icons, name, scope, short_name, start_url (+1 more)

### Community 61 - "spending-calendar.tsx"
Cohesion: 0.29
Nodes (9): compact(), heat(), INK, LEVELS, quantile(), rampCap(), SpendingCalendar(), STRENGTH (+1 more)

### Community 62 - "Next.js agent rules block ("This is NOT the Next.js you know")"
Cohesion: 0.22
Nodes (7): app/api/auth/* Route Handlers, node_modules/next/dist/server/lib/generate-agent-files.js, Google OAuth broker (exchange/token/logout), Next.js App Router app (mostly client-side), node_modules/next/dist/docs/, npm run dev (port 5173), Verification

### Community 63 - "scripts"
Cohesion: 0.22
Nodes (9): scripts, build, dev, lint, lint:check, start, test:e2e, types:check (+1 more)

### Community 64 - "2. New issues"
Cohesion: 0.14
Nodes (13): 1. Earlier findings (F9, F10), 2. New issues, 3. Would I keep using this?, Aiden (20, student, easily overwhelmed, on his phone) — acceptance round 2, F10 — past empty month, F9 — earlier overload, Issue 1 — confusing — Month change briefly shows the old month's numbers under the new month's title, Issue 2 — nit — The month picker stays open after you pick a month (+5 more)

### Community 65 - "formatter"
Cohesion: 0.25
Nodes (8): formatter, attributePosition, enabled, formatWithErrors, indentStyle, indentWidth, lineEnding, lineWidth

### Community 66 - "Button"
Cohesion: 0.08
Nodes (48): BUDGET_STATES, BudgetCard(), BudgetsPage(), BudgetState, formatBudgetDateWindow(), MonthLayout(), luxon, next (+40 more)

### Community 67 - "providers.tsx"
Cohesion: 0.18
Nodes (15): metadata, RootLayout(), viewport, Boot(), Providers(), @vercel/analytics, @vercel/speed-insights, getStoredHistory() (+7 more)

### Community 69 - "Domain docs (single-context layout)"
Cohesion: 0.33
Nodes (7): Agent skills, CONTEXT.md, Domain docs (single-context layout), Domain Language, Issue tracker (local specs and tickets), .scratch/ local work tracking, String primary keys (not auto-increment)

### Community 70 - "optionalDependencies"
Cohesion: 0.29
Nodes (7): optionalDependencies, lightningcss-linux-x64-gnu, lightningcss-win32-x64-msvc, @rollup/rollup-linux-x64-gnu, @rollup/rollup-win32-x64-msvc, @tailwindcss/oxide-linux-x64-gnu, @tailwindcss/oxide-win32-x64-msvc

### Community 71 - "tsconfig.e2e.json"
Cohesion: 0.29
Nodes (6): ./tsconfig.json, compilerOptions, incremental, exclude, extends, include

### Community 72 - "style"
Cohesion: 0.33
Nodes (6): style, noNamespace, noNonNullAssertion, useArrayLiterals, useAsConstAssertion, useBlockStatements

### Community 73 - "0002 Forecast pacing"
Cohesion: 0.33
Nodes (5): 0002 Forecast pacing, Consequences, Context, Decision, Rejected option

### Community 74 - "0001-drill-down-url-state.md"
Cohesion: 0.40
Nodes (4): Compare selection uses included comparison months and title-based uniqueness, Gross and net category selection URL, Comparison window, Drill-down URL state

### Community 75 - "Validation rule (ValidationError + Validator)"
Cohesion: 0.50
Nodes (4): Old Laravel Api/*Controller mapping, Laravel-shaped { field: string[] } error maps, ValidationError, Validator

### Community 76 - "Term"
Cohesion: 0.36
Nodes (9): IconTip(), DEFINITIONS, Term(), SidebarMenuButton(), sidebarMenuButtonVariants, Tooltip(), TooltipContent(), TooltipProvider() (+1 more)

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

### Community 104 - "logic/settings.ts"
Cohesion: 0.27
Nodes (10): Drill-down opens as a peek or a page, never docked, DRILL_MODES, DrillMode, FinpointSettings, readDrillMode(), readSettings(), replaceSettings(), writeDrillMode() (+2 more)

### Community 105 - "UI layer"
Cohesion: 0.31
Nodes (8): Domain logic, Dashboard month route-group shell, Persistence, Project Shape, React Compiler (enabled), src/routes.ts (centralized route paths), Static content pages (privacy, terms) are server components, UI layer

### Community 106 - "2. New issues"
Cohesion: 0.15
Nodes (12): 1. Earlier persona findings (F-ids), 2. New issues, 3. Would I keep using this?, Drill-down behaviour I checked for this session (supports the F-list follow-up), F5 — "Income $0" next to a red shortfall read as debt: **FIXED**, Filters: what I could and could not check (budget note), Issue 1 — Clicking a day in the Spending calendar doesn't show that day (broken), Issue 2 — Income drill-down still leads with a bare "$0.00" (nit) (+4 more)

### Community 107 - "2. New issues"
Cohesion: 0.15
Nodes (12): 1. Earlier findings (F3, F7, F9), 2. New issues, 3. Would I keep using it?, Coverage limits (honest gaps, not app findings), F3 — "no biggest expenses answer" — FIXED, F7 — jargon — PARTLY, F9 — too much on screen — PARTLY, Margaret — acceptance test report (insight drill-down) (+4 more)

### Community 108 - "src/components/*"
Cohesion: 0.40
Nodes (4): Agent Behavior, Generated / Ignored Files, src/components/*, src/components/ui/**/*

### Community 109 - "2. New issues"
Cohesion: 0.15
Nodes (12): 1. Earlier findings (F-ids), 2.1 broken — Clicking a day in the Spending calendar does nothing, 2.2 confusing — "Open as" is a menu *and* a separate button, and it loses its label, 2.3 broken — the tab went to a blank white page mid-session, 2.4 confusing — the theme selector disagrees with itself between pages, 2.5 confusing — Filters on Records: state is readable, but there are a lot of them and I couldn't confirm clearing, 2. New issues, 3. Would I keep using it? (+4 more)

### Community 110 - "2. New issues"
Cohesion: 0.15
Nodes (12): 1. Persona findings (F-ids), 2. New issues, 3. Would I keep using it?, F4 — "a green down-arrow on $0 read as good news" — **FIXED** (one residual nit), F8 — same finding elsewhere — **PARTLY** (could not verify the original screen), Filters: the two questions I was asked, answered honestly, Issue 1 — **confusing** — browser Back does not take me back to the Dashboard, Issue 2 — **confusing** — the "Clear" control in the filter bars looks disabled (+4 more)

### Community 111 - "Separator"
Cohesion: 0.26
Nodes (9): AppHeader(), ButtonGroup(), ButtonGroupSeparator(), ButtonGroupText(), buttonGroupVariants, FieldSeparator(), ItemSeparator(), Separator() (+1 more)

### Community 112 - "item.tsx"
Cohesion: 0.20
Nodes (11): Item(), ItemActions(), ItemContent(), ItemDescription(), ItemFooter(), ItemGroup(), ItemHeader(), ItemMedia() (+3 more)

### Community 113 - "⚠️ TEMPORARY HANDOFF: DELETE THIS WHOLE `TEMP-HANDOFF/` FOLDER BEFORE THE PR LEAVES DRAFT"
Cohesion: 0.17
Nodes (11): 1. Where things stand, 2. Every standing instruction from the user (follow all of these), 3. What was done in this stretch (tickets 33–42 and fixes), 4. Findings worth knowing, 5. Files in this folder (all temporary), Design direction the user has set on this branch, Git, PRs and CI, Open items (+3 more)

### Community 114 - "2. New issues"
Cohesion: 0.17
Nodes (11): 1. Persona earlier findings (F-ids), 2.1 — "Open as" menu options not reachable / not visible — severity: **confusing**, 2.2 — Records result count says "3 of 3" while many more rows are listed — severity: **confusing**, 2.3 — The Travel budget isn't on the Budgets page — severity: **nit**, 2.4 — Filter observations on Records and Statements (asked directly), 2.5 — Drill-down open/close behaviour (asked directly), 2. New issues, 3. Would I keep using this? (+3 more)

### Community 115 - "pathRecords"
Cohesion: 0.20
Nodes (9): NotFound(), ShellHeader(), buildAttention(), pathRecords(), 22 design fixes, round 3, Comments, Findings, Opus findings (from review/11-panel-branch-dark-1440) (+1 more)

### Community 116 - "Results"
Cohesion: 0.18
Nodes (10): §11 task step counts, 19 acceptance, Acceptance, Comments, Flaky-test classification, New findings, Personas (re-run from §3 ledger), Results (+2 more)

### Community 117 - "2. New issues"
Cohesion: 0.18
Nodes (10): 1. Earlier findings (F-ids), 2. New issues, 3. Would I keep using this?, Dana — Insight drill-down acceptance test (acceptance-2), F12 — two totals disagreed: FIXED (verified in side peek), F2 — drilling lost my place: PARTLY, Issue 1 — severity: broken — clicking a calendar day or a category row never opens a drill-down, Issue 2 — severity: broken — browser Back returns the URL to the Dashboard but leaves the drill-down open (+2 more)

### Community 118 - "21 design fixes, round 2"
Cohesion: 0.22
Nodes (8): 21 design fixes, round 2, Acceptance, Comments, Completion review (2026-11-07), Final evidence, Implementation evidence (2026-11-07), Opus findings (from 20-dashboard-branch-dark-1440 and 20-panel-branch-dark-1440), Sonnet findings

### Community 119 - "1. Earlier findings (F-ids)"
Cohesion: 0.22
Nodes (8): 1. Earlier findings (F-ids), 2. New issues, 3. Would I keep using this?, F21 — "Workflows was vague" → **FIXED**, Jen (45) — Insight drill-down & filters acceptance test, Standing check A — "Can I see at a glance which filters are on?" → **FIXED**, Standing check B — "Can I clear them one by one?" → **FIXED**, Standing check C — "Do filter widths stay the same across Records, Statements and Allocate?" → **FIXED**

### Community 120 - "app.tsx"
Cohesion: 0.32
Nodes (5): react-dom, App(), HarnessSection, sectionFromLocation(), root

### Community 121 - "enrichRecords"
Cohesion: 0.36
Nodes (7): loadDashboardTables(), AllocationTally, isPendingRecord(), pendingStatementIds(), tallyAllocations(), enrichRecords(), subtitle()

### Community 122 - "Design review: `ai/insight-drilldown` (PR #48) vs `main`"
Cohesion: 0.29
Nodes (6): Design review: `ai/insight-drilldown` (PR #48) vs `main`, Method and limits (read first), Not verified, Polish, Regressions, Things that look good

### Community 123 - "Final review (Opus, by hand) — 2026-11-08"
Cohesion: 0.29
Nodes (6): Apple design, Break-ui (worst-case data, dev toggle), Code review (standards), Decisions for the user, Final review (Opus, by hand) — 2026-11-08, Spec

### Community 124 - "02 forecast pacing"
Cohesion: 0.29
Nodes (6): 02 forecast pacing, Acceptance, Comments, Implementation handoff, 2026-11-07, Verification closure, 2026-11-07, What

### Community 125 - "15 mobile"
Cohesion: 0.29
Nodes (6): 15 mobile, Acceptance, Comments, Evidence, Implementation (D8: no drag yet), What

### Community 126 - "09 terms and copy"
Cohesion: 0.33
Nodes (5): 09 terms and copy, Acceptance, Comments, Verification closure, 2026-11-07, What

### Community 127 - "10 biggest changes words"
Cohesion: 0.33
Nodes (5): 10 biggest changes words, Acceptance, Comments, Implementation and verification, 2026-11-07, What

### Community 128 - "17 retire monthly records"
Cohesion: 0.33
Nodes (5): 17 retire monthly records, Acceptance, Comments, Resolution (follow-up agent), What

### Community 129 - "18 allocate rename and statement tabs"
Cohesion: 0.33
Nodes (5): 18 allocate rename and statement tabs, Acceptance, Comments, Verification closure, 2026-11-07, What

### Community 130 - "20 design fixes (from Sonnet design review)"
Cohesion: 0.33
Nodes (5): 20 design fixes (from Sonnet design review), Acceptance, Comments, Final verification — 2026-11-07, commit 11632a19298f22824e06f89b01bc1256895f8848, Opus decisions that override the report where they differ

### Community 131 - "24 statement pivot keeps the old total and header"
Cohesion: 0.33
Nodes (5): 24 statement pivot keeps the old total and header, Acceptance, Comments, Evidence, Fix

### Community 132 - "25 pending reason is not stated, and its caption repeats"
Cohesion: 0.33
Nodes (5): 25 pending reason is not stated, and its caption repeats, Acceptance, Comments, Evidence, Fix

### Community 133 - "26 Statements rows are not clickable except the chevron"
Cohesion: 0.33
Nodes (5): 26 Statements rows are not clickable except the chevron, Acceptance, Comments, Evidence, Fix

### Community 134 - "27 forecast chart draws last month's line with no key"
Cohesion: 0.33
Nodes (5): 27 forecast chart draws last month's line with no key, Acceptance, Comments, Evidence, Fix

### Community 135 - "28 compare panel columns are uneven and unexplained"
Cohesion: 0.33
Nodes (5): 28 compare panel columns are uneven and unexplained, Acceptance, Comments, Evidence, Fix

### Community 136 - "29 a refund shows as a plain amount in the Spending list"
Cohesion: 0.33
Nodes (5): 29 a refund shows as a plain amount in the Spending list, Acceptance, Comments, Evidence, Fix

### Community 137 - "31 stale "Back to October 2026" on the Dashboard, and "Clear 1" with no filter"
Cohesion: 0.33
Nodes (5): 31 stale "Back to October 2026" on the Dashboard, and "Clear 1" with no filter, Acceptance, Comments, Evidence, Fix

### Community 138 - "33 Drill-down opens as side peek, center peek or full page (user picks)"
Cohesion: 0.33
Nodes (5): 33 Drill-down opens as side peek, center peek or full page (user picks), Acceptance, Comments, What, Why (user, 2026-11-08)

### Community 139 - "34 Drill-down hover, press and focus polish"
Cohesion: 0.33
Nodes (5): 34 Drill-down hover, press and focus polish, Acceptance, Comments, What, Why

### Community 140 - "35 Records and Statements filter widths consistent across screens"
Cohesion: 0.33
Nodes (5): 35 Records and Statements filter widths consistent across screens, Acceptance, Comments, What, Why

### Community 141 - "36 Show at a glance which filters are active"
Cohesion: 0.33
Nodes (5): 36 Show at a glance which filters are active, Acceptance, Comments, What, Why

### Community 142 - "38 Dashboard cards in a row have different heights"
Cohesion: 0.33
Nodes (5): 38 Dashboard cards in a row have different heights, Acceptance, Comments, What, Why

### Community 143 - "40 Closing the full-page drill leaves it in Back history"
Cohesion: 0.33
Nodes (5): 40 Closing the full-page drill leaves it in Back history, Acceptance, Bug (reproduced by Opus with Playwright on the production build), Comments, Fix

### Community 144 - "41 Income drill-down shows the Spending caption and a bare $0.00"
Cohesion: 0.33
Nodes (5): 41 Income drill-down shows the Spending caption and a bare $0.00, Acceptance, Bug, Comments, Fix

### Community 145 - "buildProjection"
Cohesion: 0.40
Nodes (5): buildProjection(), 7.2 URL schema (ADR), 7.3 Largest Records, amount sort, reconciliation, 7.4 Forecast pacing (ADR, D3), 7. Data and logic

### Community 146 - "00 prototype"
Cohesion: 0.40
Nodes (4): 00 prototype, Acceptance, Comments, What

### Community 147 - "04 category trend drilldowns"
Cohesion: 0.40
Nodes (4): 04 category trend drilldowns, Acceptance, Comments, What

### Community 148 - "05 budget drilldown"
Cohesion: 0.40
Nodes (4): 05 budget drilldown, Acceptance, Comments, What

### Community 149 - "06 record statement pivot"
Cohesion: 0.40
Nodes (4): 06 record statement pivot, Acceptance, Comments, What

### Community 150 - "07 edit from panel"
Cohesion: 0.40
Nodes (4): 07 edit from panel, Acceptance, Comments, What

### Community 151 - "08 summary band"
Cohesion: 0.40
Nodes (4): 08 summary band, Acceptance, Comments, What

### Community 152 - "11 headline attention"
Cohesion: 0.40
Nodes (4): 11 headline attention, Acceptance, Comments, What

### Community 153 - "12 largest records"
Cohesion: 0.40
Nodes (4): 12 largest records, Acceptance, Comments, What

### Community 154 - "13 remove charts"
Cohesion: 0.40
Nodes (4): 13 remove charts, Acceptance, Comments, What

### Community 155 - "16 reconciliation"
Cohesion: 0.40
Nodes (4): 16 reconciliation, Acceptance, Comments, What

### Community 156 - "23 mobile sheet polish + flaky drill test"
Cohesion: 0.40
Nodes (4): 23 mobile sheet polish + flaky drill test, Acceptance, Comments, Opus findings

### Community 157 - "37 Categories card: names render centered"
Cohesion: 0.40
Nodes (4): 37 Categories card: names render centered, Acceptance, Comments, Why

### Community 158 - "42 Plain-words pass on what's left of the jargon"
Cohesion: 0.40
Nodes (4): 42 Plain-words pass on what's left of the jargon, Acceptance, Comments, What

### Community 159 - "Priya (29, nurse, mobile 390x844) — insight drill-down acceptance test"
Cohesion: 0.40
Nodes (4): 1. Earlier findings (F-ids), 2. New issues, 3. Would I keep using this?, Priya (29, nurse, mobile 390x844) — insight drill-down acceptance test

### Community 160 - "Tyrone — usability test report"
Cohesion: 0.40
Nodes (4): 1. Earlier findings, 2. New issues, 3. Would I keep using it?, Tyrone — usability test report

### Community 161 - "43 Unslop pass: 20 rules from the user's reference reel"
Cohesion: 0.50
Nodes (3): 43 Unslop pass: 20 rules from the user's reference reel, Deliverable, Rules, applied to Finpoint (Dashboard, drill-down, Records, Statements, Allocate, Budgets, Settings; dark + light; 1440 + 390)

## Knowledge Gaps
- **122 isolated node(s):** `@fontsource-variable/inter`, `shadcn`, `tailwindcss`, `tw-animate-css`, `@biomejs/biome` (+117 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 958 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **19 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `react` to `record-editor.tsx`, `records/page.tsx`, `primitives.tsx`, `sync/page.tsx`, `cn`, `command.tsx`, `RecordEditorDialog`, `lib/motion.ts`, `package.json`, `budgets/[id]/page.tsx`, `routes.ts`, `duplicates/page.tsx`, `combobox.tsx`, `importer/page.tsx`, `(month)/page.tsx`, `icon.tsx`, `export-import.ts`, `record-columns.tsx`, `alert-dialog.tsx`, `pagination.tsx`, `use-appearance.tsx`, `use-drill.ts`, `spending-calendar.tsx`, `Button`, `providers.tsx`, `Term`, `Separator`, `item.tsx`, `app.tsx`?**
  _High betweenness centrality (0.071) - this node is a cross-community bridge._
- **What connects `@fontsource-variable/inter`, `shadcn`, `tailwindcss` to the rest of the system?**
  _122 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `record-editor.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.07603346456692914 - nodes in this community are weakly interconnected._
- **Why does `cn()` connect `cn` to `record-editor.tsx`, `records/page.tsx`, `primitives.tsx`, `sync/page.tsx`, `command.tsx`, `RecordEditorDialog`, `lib/motion.ts`, `react`, `budgets/[id]/page.tsx`, `duplicates/page.tsx`, `combobox.tsx`, `importer/page.tsx`, `(month)/page.tsx`, `icon.tsx`, `record-columns.tsx`, `alert-dialog.tsx`, `pagination.tsx`, `spending-calendar.tsx`, `Button`, `Term`, `Separator`, `item.tsx`?**
  _High betweenness centrality (0.064) - this node is a cross-community bridge._
- **Should `ledger.e2e.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.10837438423645321 - nodes in this community are weakly interconnected._
- **Why does `src/data/* (persistence, migrations, seeding, backup serialization, Drive storage)` connect `src/data/* (persistence, migrations, seeding, backup serialization, Drive storage)` to `UI layer`, `providers.tsx`?**
  _High betweenness centrality (0.058) - this node is a cross-community bridge._
- **Should `primitives.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.12701612903225806 - nodes in this community are weakly interconnected._