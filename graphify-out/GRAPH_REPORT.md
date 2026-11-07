# Graph Report - t3-69efe8e6  (2026-11-07)

## Corpus Check
- 262 files · ~237,224 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 9 file(s) not represented in the graph (top: (none) 5, .example 1, .lock 1)

## Summary
- 1969 nodes · 7878 edges · 105 communities (93 shown, 12 thin omitted)
- Extraction: 98% EXTRACTED · 2% INFERRED · 0% AMBIGUOUS · INFERRED: 129 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `d2148458`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- record-editor.tsx
- utils.ts
- lib/motion.ts
- Tests README
- ledger.e2e.ts
- use-sync-status.ts
- monthly/page.tsx
- sidebar.tsx
- dashboard.ts
- primitives.tsx
- data.ts
- suggestions.ts
- compilerOptions
- editors.ts
- use-appearance.tsx
- round2
- cn
- dependencies
- test
- react
- records.ts
- support/motion.ts
- suspicious
- record-creator.tsx
- package.json
- duplicates.ts
- correctness
- sync/page.tsx
- date-range.tsx
- core/components.e2e.ts
- export-import.ts
- components.json
- core/routes.e2e.ts
- types.d.ts
- importer/page.tsx
- auth-vault.ts
- duplicates/page.tsx
- db.ts
- radix-ui
- alert-dialog.tsx
- statements.ts
- app/layout.tsx
- ref_types
- State persistence rule (ephemeral UI state vs IndexedDB)
- formatter
- devDependencies
- category.tsx
- app.tsx
- Commands
- Next.js agent rules block ("This is NOT the Next.js you know")
- Validator
- biome.json
- rules
- src/data/* (persistence, migrations, seeding, backup serialization, Drive storage)
- manifest.json
- spending-calendar.tsx
- scripts
- auto-sync.ts
- formatter
- Records
- navigation.e2e.ts
- Domain docs (single-context layout)
- optionalDependencies
- tsconfig.e2e.json
- 0001-drill-down-url-state.md
- style
- 0002 Forecast pacing
- Project Shape
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
- pagination.tsx
- Conventions
- Unrestricted crawler policy
- Generated demo data
- Progressive Web Application
- Button
- ledger.e2e.ts
- lucide-react
- Statement
- (month)/page.tsx
- ledger.e2e.ts
- duplicate-review.tsx
- icon.tsx
- luxon
- providers.tsx
- src/components/*
- Calendar and forecast daily views
- Dashboard summary metrics

## God Nodes (most connected - your core abstractions)
1. `cn()` - 324 edges
2. `PrimitivesSection()` - 181 edges
3. `Button()` - 125 edges
4. `react` - 99 edges
5. `formatCurrency()` - 76 edges
6. `RecordEditorDialog()` - 63 edges
7. `RecordCreatorDialog()` - 58 edges
8. `UiIcon()` - 56 edges
9. `round2()` - 48 edges
10. `pluralize()` - 44 edges

## Surprising Connections (you probably didn't know these)
- `Finpoint Style Additions` --references--> `useApiFormErrors()`  [INFERRED]
  STYLE.md → src/hooks/use-api-form-errors.ts
- `Copy` --references--> `pluralize()`  [INFERRED]
  STYLE.md → src/lib/utils.ts
- `Finpoint Style Additions` --references--> `ValidationError`  [INFERRED]
  STYLE.md → src/logic/validate.ts
- `BudgetState` --calls--> `parseDate()`  [EXTRACTED]
  app/budgets/page.tsx → src/lib/utils.ts
- `record()` --indirect_call--> `path()`  [INFERRED]
  tests/core/ledger.e2e.ts → src/components/charts/trend-chart.tsx

## Import Cycles
- None detected.

## Communities (105 total, 12 thin omitted)

### Community 0 - "record-editor.tsx"
Cohesion: 0.23
Nodes (34): sonner, @tanstack/react-form, AccountDialog(), BudgetCreatorDialog(), BudgetEditorDialog(), COLOURS, MonthlyBudgetDialog(), PendingStatementDialog() (+26 more)

### Community 1 - "utils.ts"
Cohesion: 0.14
Nodes (33): AllocationProgress(), AllocationExpansion(), AllocationRows(), AllocationSource, DrillPanel(), RecordAmount(), amountTone(), formatRowTime() (+25 more)

### Community 2 - "lib/motion.ts"
Cohesion: 0.09
Nodes (48): framer-motion, @tanstack/react-table, bar(), BarChart(), BarSeries, PAD, ChartFrame(), ChartSize (+40 more)

### Community 3 - "Tests README"
Cohesion: 0.06
Nodes (41): Build harness step (vite build tests/harness), Playwright browser cache keyed on bun.lock, blob report merge, Committed graph artifacts (graph.json, GRAPH_REPORT.md, manifest.json, .graphify_labels.json), Graph health warnings and refresh failure reporting, graphify-out/graph.json, graphify skill (--update), graphify update . (+33 more)

### Community 4 - "ledger.e2e.ts"
Cohesion: 0.11
Nodes (25): behaviourCoverage, componentInventory, facetNotApplicable, InventoryEntry, modalAnimationCoverage, notApplicable, openFacets, RouteEntry (+17 more)

### Community 5 - "use-sync-status.ts"
Cohesion: 0.60
Nodes (4): useSyncStatus(), getSyncSnapshot(), subscribeSync(), SyncSnapshot

### Community 6 - "monthly/page.tsx"
Cohesion: 0.19
Nodes (33): BudgetPage(), Legend(), byRecordDay, EmptyRecords(), FILTER_KEYS, Filters, MonthlyRecordsPage(), metadata (+25 more)

### Community 7 - "sidebar.tsx"
Cohesion: 0.10
Nodes (38): Providers(), AppearanceOption, APPEARANCES, AppearanceSwitch(), AppSidebar(), SyncDot(), SYSTEM_APPEARANCE, useSyncIndicator() (+30 more)

### Community 8 - "dashboard.ts"
Cohesion: 0.11
Nodes (41): AnalyticsRecord, AnalyticsSummary, contribution(), summarize(), avg(), BREAKDOWN_MONTHS, buildCashflowHistory(), buildCategories() (+33 more)

### Community 9 - "primitives.tsx"
Cohesion: 0.09
Nodes (48): AlertAction(), CardFooter(), ComboboxCollection(), ComboboxValue(), DropdownMenu(), DropdownMenuCheckboxItem(), DropdownMenuContent(), DropdownMenuGroup() (+40 more)

### Community 10 - "data.ts"
Cohesion: 0.09
Nodes (22): AccountRow, AllocationRow, AnalyticsMonthRow, BudgetRecordRow, BudgetRow, DuplicateDismissalRow, MonthlyBudgetAmountRow, MonthlyBudgetDefaultRow (+14 more)

### Community 11 - "suggestions.ts"
Cohesion: 0.11
Nodes (31): MonthlyBudgetRow, allocatedStatements(), asOf(), byDate(), CHIP_LIMIT, CHOICES, Clue, DEFAULT_WEIGHTS (+23 more)

### Community 12 - "compilerOptions"
Cohesion: 0.06
Nodes (33): compilerOptions, allowJs, allowSyntheticDefaultImports, allowUnusedLabels, esModuleInterop, forceConsistentCasingInFileNames, incremental, isolatedModules (+25 more)

### Community 13 - "editors.ts"
Cohesion: 0.14
Nodes (20): editors, editors, longName, expectHeldRead(), expectRetainedRows(), expectSilentSheet(), expectVisibleBackdrop(), account (+12 more)

### Community 14 - "use-appearance.tsx"
Cohesion: 0.26
Nodes (14): Appearance, applyAppearance(), getStoredAppearance(), handleSystemThemeChange(), initializeAppearance(), isDarkMode(), listeners, mediaQuery() (+6 more)

### Community 15 - "round2"
Cohesion: 0.14
Nodes (35): getBudgetAnalytics(), getCategoryData(), BudgetProgressChart(), BudgetProgressPoint, buildSeries(), PendingStatementConfirmationSheet(), RecordOption(), RecordSearchSheet() (+27 more)

### Community 16 - "cn"
Cohesion: 0.14
Nodes (33): CategoryFilter(), CategoryFilterItem(), ComboboxChip(), ComboboxChips(), ComboboxChipsInput(), ComboboxClear(), ComboboxContent(), ComboboxEmpty() (+25 more)

### Community 17 - "dependencies"
Cohesion: 0.07
Nodes (30): dependencies, @base-ui/react, class-variance-authority, clsx, cmdk, dexie, dexie-react-hooks, @fontsource-variable/inter (+22 more)

### Community 18 - "test"
Cohesion: 0.14
Nodes (18): cardTitles, card(), chartTooltip, overview, overviewCharts, themedRgb(), ScenarioName, WorkspaceDataset (+10 more)

### Community 19 - "react"
Cohesion: 0.14
Nodes (28): MonthLayout(), ReviewLinks(), NotFound(), Template(), nextConfig, next, react, ShellHeader() (+20 more)

### Community 20 - "records.ts"
Cohesion: 0.17
Nodes (18): asPending(), CategoryRow, RecordRow, canUseMonthlyBudget(), resolveRecordChoices(), analyticsValues(), budgetCovers(), ConflictError (+10 more)

### Community 21 - "support/motion.ts"
Cohesion: 0.17
Nodes (20): denseCardConsumers, denseRowConsumers, expectConsumerEntrance(), populatedConsumers, attachSamplingFailure(), expectModalEntrance(), expectModalExit(), expectPopupEntrance() (+12 more)

### Community 22 - "suspicious"
Cohesion: 0.07
Nodes (28): suspicious, noAssignInExpressions, noAsyncPromiseExecutor, noCatchAssign, noClassAssign, noCompareNegZero, noControlCharactersInRegex, noDebugger (+20 more)

### Community 23 - "record-creator.tsx"
Cohesion: 0.11
Nodes (39): Rule, RuleSentence(), StatementRulesPage(), RecordCreatorDialog(), highlight(), Rule, StatementRuleDialog(), CategoryField() (+31 more)

### Community 24 - "package.json"
Cohesion: 0.07
Nodes (29): private, $schema, type, babel-plugin-react-compiler, @biomejs/biome, clsx, cmdk, @fontsource-variable/inter (+21 more)

### Community 25 - "duplicates.ts"
Cohesion: 0.27
Nodes (11): allocationOutcome(), descriptionAnchors(), descriptionIdentity(), DuplicateGroup, duplicateGroups(), DuplicateStatement, GENERIC, pairIds() (+3 more)

### Community 26 - "correctness"
Cohesion: 0.08
Nodes (26): noConstantCondition, noConstAssign, noEmptyCharacterClassInRegex, noEmptyPattern, noGlobalObjectCalls, noInvalidBuiltinInstantiation, noInvalidConstructorSuper, noNonoctalDecimalEscape (+18 more)

### Community 27 - "sync/page.tsx"
Cohesion: 0.15
Nodes (25): COUNT_ROWS, DataSettingsPage(), StateRow(), STATUS_TONES, StatusTone, WorkspaceRow(), clearAllData(), downloadExport() (+17 more)

### Community 28 - "date-range.tsx"
Cohesion: 0.13
Nodes (31): @base-ui/react, Props, ComboboxField(), Props, DateField(), Props, DateRange(), DateRangeValue (+23 more)

### Community 29 - "core/components.e2e.ts"
Cohesion: 0.13
Nodes (12): desktopOnly, bounds(), contained(), expectWheelScrollsPageWhileOpen(), containedFooter(), expectDropdownPreservesScroll(), expectPointerCursor(), scrollWithInput() (+4 more)

### Community 30 - "export-import.ts"
Cohesion: 0.12
Nodes (22): EXPORT_VERSION, FinpointExport, TableName, TABLES, migrateRecordChoices(), DEFAULT_SETTINGS, FinpointSettings, readSettings() (+14 more)

### Community 31 - "components.json"
Cohesion: 0.09
Nodes (21): aliases, components, hooks, lib, ui, utils, iconLibrary, menuAccent (+13 more)

### Community 32 - "core/routes.e2e.ts"
Cohesion: 0.18
Nodes (13): @playwright/test, Child, october, september, PREMATURE, routeReady, titles, installDateOnly() (+5 more)

### Community 33 - "types.d.ts"
Cohesion: 0.10
Nodes (20): Account, Allocation, AnalyticsSummary, AnalyticsTreatment, Appearance, Budget, Category, CategoryWithChildren (+12 more)

### Community 34 - "importer/page.tsx"
Cohesion: 0.18
Nodes (27): ACCEPT, BANKS_REQUIRING_ADDITIONAL_INFO, ImporterPage(), Step(), FieldError(), BANKS, ensureAccount(), combine() (+19 more)

### Community 35 - "auth-vault.ts"
Cohesion: 0.29
Nodes (14): POST(), POST(), POST(), jose, AUTH_COOKIE_NAME, authCookie(), authCookieConfig(), clientIp() (+6 more)

### Community 36 - "duplicates/page.tsx"
Cohesion: 0.16
Nodes (46): CARD_MOTION, DuplicateGroupCard(), FixDuplicatesPage(), GroupHeader(), highlightDifferences(), VIEWS, AllocatorPage(), AllocatorPendingPage() (+38 more)

### Community 37 - "db.ts"
Cohesion: 0.09
Nodes (22): dexie, fake-indexeddb, xlsx, DB_NAME, DB_VERSION, FinpointDB, MetaRow, SettingsRow (+14 more)

### Community 38 - "radix-ui"
Cohesion: 0.15
Nodes (14): class-variance-authority, radix-ui, AppHeader(), ButtonGroup(), ButtonGroupSeparator(), ButtonGroupText(), buttonGroupVariants, FieldSeparator() (+6 more)

### Community 39 - "alert-dialog.tsx"
Cohesion: 0.34
Nodes (12): DriveOverwriteConfirmation(), AlertDialog(), AlertDialogAction(), AlertDialogCancel(), AlertDialogContent(), AlertDialogDescription(), AlertDialogFooter(), AlertDialogHeader() (+4 more)

### Community 40 - "statements.ts"
Cohesion: 0.17
Nodes (22): duplicateStatementIds(), removeStatementDismissals(), dayDifference(), ensureCanReplace(), maskDescription(), ReplacementAllocation, replacementComparison(), replacementReason() (+14 more)

### Community 41 - "app/layout.tsx"
Cohesion: 0.25
Nodes (6): bun test, IndexedDB (Dexie), Domain and importer tests (Dexie with in-memory IndexedDB), metadata, RootLayout(), viewport

### Community 42 - "ref_types"
Cohesion: 0.24
Nodes (6): NO_ACTIVITY, BudgetDetail, BudgetFilters, deleteBudget(), updateBudget(), FieldErrors

### Community 43 - "State persistence rule (ephemeral UI state vs IndexedDB)"
Cohesion: 0.33
Nodes (5): app/**/page.tsx, Interactive routes are "use client" (search params via next/navigation), Pages take no props, Root Suspense (keeps routes static), URL search params (filters and pagination)

### Community 44 - "formatter"
Cohesion: 0.15
Nodes (13): arrowParentheses, bracketSameLine, bracketSpacing, jsxQuoteStyle, quoteProperties, quoteStyle, semicolons, trailingCommas (+5 more)

### Community 45 - "devDependencies"
Cohesion: 0.15
Nodes (13): devDependencies, babel-plugin-react-compiler, @biomejs/biome, fake-indexeddb, @playwright/test, @tailwindcss/postcss, @types/luxon, @types/node (+5 more)

### Community 46 - "category.tsx"
Cohesion: 0.21
Nodes (16): SECTIONS, CategoryDialog(), CategoryFormValues, EMPTY_FORM_VALUES, iconLabel(), isChildCategory(), RecordAnalyticsFields(), SelectField() (+8 more)

### Community 47 - "app.tsx"
Cohesion: 0.32
Nodes (5): react-dom, App(), HarnessSection, sectionFromLocation(), root

### Community 48 - "Commands"
Cohesion: 0.38
Nodes (7): Biome (biome check --write), bun install, bun lint (write-mode), bun lint:check, bun run build, bun types:check, Commands

### Community 49 - "Next.js agent rules block ("This is NOT the Next.js you know")"
Cohesion: 0.22
Nodes (7): app/api/auth/* Route Handlers, node_modules/next/dist/server/lib/generate-agent-files.js, Google OAuth broker (exchange/token/logout), Next.js App Router app (mostly client-side), node_modules/next/dist/docs/, npm run dev (port 5173), Verification

### Community 50 - "Validator"
Cohesion: 0.26
Nodes (17): updateAccount(), validateBudget(), cleanInput(), dismissDuplicatePair(), eligible(), fixDuplicates(), restoreDuplicatePair(), createMonthlyBudget() (+9 more)

### Community 51 - "biome.json"
Cohesion: 0.18
Nodes (10): source, assist, actions, files, includes, linter, enabled, overrides (+2 more)

### Community 52 - "rules"
Cohesion: 0.18
Nodes (11): noAdjacentSpacesInRegex, noBannedTypes, noExtraBooleanCast, noUselessCatch, noUselessThisAlias, noUselessTypeConstraint, rules, noFloatingPromises (+3 more)

### Community 54 - "src/data/* (persistence, migrations, seeding, backup serialization, Drive storage)"
Cohesion: 0.38
Nodes (8): Background Drive sync, src/data/* (persistence, migrations, seeding, backup serialization, Drive storage), src/logic/* (domain reads and operations), (month) route-group shell (Overview + Monthly Records), src/routes.ts (centralized route paths), Static content pages (privacy, terms) are server components, UI layer (app pages + components), Workspace backup/reset operations

### Community 55 - "manifest.json"
Cohesion: 0.20
Nodes (9): background_color, description, display, icons, name, scope, short_name, start_url (+1 more)

### Community 56 - "spending-calendar.tsx"
Cohesion: 0.29
Nodes (9): compact(), heat(), INK, LEVELS, quantile(), rampCap(), SpendingCalendar(), STRENGTH (+1 more)

### Community 57 - "scripts"
Cohesion: 0.22
Nodes (9): scripts, build, dev, lint, lint:check, start, test:e2e, types:check (+1 more)

### Community 59 - "auto-sync.ts"
Cohesion: 0.11
Nodes (45): SYNC_TABLES, AuthNeededError, cacheToken(), CodeResponse, disconnectDrive(), downloadBackupFile(), driveFetch(), DriveFileMeta (+37 more)

### Community 60 - "formatter"
Cohesion: 0.25
Nodes (8): formatter, attributePosition, enabled, formatWithErrors, indentStyle, indentWidth, lineEnding, lineWidth

### Community 61 - "Records"
Cohesion: 0.32
Nodes (8): Allocator, Budgets, Categories, Dashboard, Statement-allocation-record model, Monthly Budgets, Records, Statement importer

### Community 63 - "Domain docs (single-context layout)"
Cohesion: 0.33
Nodes (7): Agent skills, CONTEXT.md, Domain docs (single-context layout), Domain Language, Issue tracker (local specs and tickets), .scratch/ local work tracking, String primary keys (not auto-increment)

### Community 64 - "optionalDependencies"
Cohesion: 0.29
Nodes (7): optionalDependencies, lightningcss-linux-x64-gnu, lightningcss-win32-x64-msvc, @rollup/rollup-linux-x64-gnu, @rollup/rollup-win32-x64-msvc, @tailwindcss/oxide-linux-x64-gnu, @tailwindcss/oxide-win32-x64-msvc

### Community 65 - "tsconfig.e2e.json"
Cohesion: 0.29
Nodes (6): ./tsconfig.json, compilerOptions, incremental, exclude, extends, include

### Community 66 - "0001-drill-down-url-state.md"
Cohesion: 0.25
Nodes (8): Record focus, Statement pivot, Gross and net category selection URL, Drill-down, Drill-down URL state, Forecast and Monthly Budget Drill-down with explicit scope, Category and trend Drill-down, Calendar day Drill-down

### Community 67 - "style"
Cohesion: 0.33
Nodes (6): style, noNamespace, noNonNullAssertion, useArrayLiterals, useAsConstAssertion, useBlockStatements

### Community 68 - "0002 Forecast pacing"
Cohesion: 0.33
Nodes (5): 0002 Forecast pacing, Consequences, Context, Decision, Rejected option

### Community 69 - "Project Shape"
Cohesion: 0.33
Nodes (6): Old Laravel Api/*Controller mapping, Laravel-shaped { field: string[] } error maps, Project Shape, React Compiler (enabled), ValidationError, Validator

### Community 70 - "Finpoint icon concept"
Cohesion: 0.40
Nodes (5): Finpoint icon concept, Charcoal shadow halo, Circular point, Rounded F monogram, Off-white icon fill

### Community 71 - "Finpoint icon with charcoal shadow"
Cohesion: 0.40
Nodes (5): Finpoint icon with charcoal shadow, Charcoal shadow halo, Circular point, Rounded F monogram, Off-white icon fill

### Community 72 - "Issue tracker: Local Markdown"
Cohesion: 0.40
Nodes (4): Files, Issue tracker: Local Markdown, Skill operations, Status and dependencies

### Community 73 - "Finpoint"
Cohesion: 0.50
Nodes (4): Finpoint, Circular point, Rounded F monogram, Off-white icon fill

### Community 74 - "Domain docs"
Cohesion: 0.50
Nodes (3): Before exploration, Domain docs, Writing

### Community 75 - "Local Markdown Issue Tracker"
Cohesion: 0.50
Nodes (4): Local Tracker Operations, Spec and Ticket Files, Ticket Lifecycle, Local Markdown Issue Tracker

### Community 77 - "Google Drive sync"
Cohesion: 0.50
Nodes (4): Google Drive sync, JSON backup and restore, Local-first finance tracking, Sync conflict handling

### Community 78 - "Forecast pacing decision"
Cohesion: 0.67
Nodes (3): Forecast pacing decision, Remaining historical spending scaled by remaining days, Median daily spending fallback including zero days

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

### Community 87 - "pagination.tsx"
Cohesion: 0.38
Nodes (11): pageHref(), pageWindow(), PaginationFooter(), Pagination(), PaginationContent(), PaginationEllipsis(), PaginationItem(), PaginationLink() (+3 more)

### Community 94 - "Button"
Cohesion: 0.13
Nodes (26): AccountCard(), AccountRow, AccountsPage(), BUDGET_STATES, BudgetCard(), BudgetsPage(), BudgetState, formatBudgetDateWindow() (+18 more)

### Community 95 - "ledger.e2e.ts"
Cohesion: 0.28
Nodes (16): collectTests(), conditionBranch(), detailsTags(), disabled(), mentionsMotion(), record(), splitTestCallee(), tagValues() (+8 more)

### Community 96 - "lucide-react"
Cohesion: 0.18
Nodes (12): lucide-react, react-day-picker, buttonVariants, Calendar(), CalendarDayButton(), ButtonVariant, Month, MonthCal() (+4 more)

### Community 99 - "Statement"
Cohesion: 0.09
Nodes (26): CONTEXT.md (domain vocabulary), Account, Allocation, Budget, Category, Duplicate Statement, Monthly Budget, Pending Record (+18 more)

### Community 100 - "(month)/page.tsx"
Cohesion: 0.10
Nodes (37): Comparison, comparisonText(), ComparisonValue, DashboardData, DashboardMonthlyBudget, DashboardPage(), DashboardView, DemoOffer() (+29 more)

### Community 101 - "ledger.e2e.ts"
Cohesion: 0.29
Nodes (4): vite, @vitejs/plugin-react, harnessDir, repoRoot

### Community 102 - "duplicate-review.tsx"
Cohesion: 0.26
Nodes (19): CandidateResults(), PendingCard(), DuplicateReviewDialog(), StatementTile(), Amount(), dateDifferenceLabel(), ReplacementReview, ReviewAllocation (+11 more)

### Community 103 - "icon.tsx"
Cohesion: 0.14
Nodes (22): AccountPage(), AllocateBar(), Sparkline(), DetailSummaryItem(), DynamicUiIcon(), Icon(), iconNameSet, loadedIcons (+14 more)

### Community 104 - "luxon"
Cohesion: 0.23
Nodes (12): luxon, CashflowPoint, dayTicks(), summaryMeasure(), getDrilldown(), getDrillStatement(), enrichRecords(), expandCategoryIds() (+4 more)

### Community 106 - "providers.tsx"
Cohesion: 0.16
Nodes (15): Boot(), preloadCategoryIcons(), db, DEFAULT_CATEGORIES, DEFAULT_MONTHLY_BUDGETS, SEED_HASH_KEY, CATEGORIES, useSyncToasts() (+7 more)

### Community 107 - "src/components/*"
Cohesion: 0.25
Nodes (5): Agent Behavior, Generated / Ignored Files, src/components/*, src/components/ui/**/*, useLiveQuery

## Knowledge Gaps
- **92 isolated node(s):** `@fontsource-variable/inter`, `shadcn`, `tailwindcss`, `tw-animate-css`, `@biomejs/biome` (+87 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 605 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **12 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `cn()` connect `cn` to `record-editor.tsx`, `utils.ts`, `lib/motion.ts`, `monthly/page.tsx`, `sidebar.tsx`, `primitives.tsx`, `round2`, `react`, `record-creator.tsx`, `sync/page.tsx`, `date-range.tsx`, `importer/page.tsx`, `duplicates/page.tsx`, `radix-ui`, `alert-dialog.tsx`, `category.tsx`, `spending-calendar.tsx`, `pagination.tsx`, `Button`, `lucide-react`, `(month)/page.tsx`, `duplicate-review.tsx`, `icon.tsx`?**
  _High betweenness centrality (0.095) - this node is a cross-community bridge._
- **What connects `@fontsource-variable/inter`, `shadcn`, `tailwindcss` to the rest of the system?**
  _92 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `utils.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.13937282229965156 - nodes in this community are weakly interconnected._
- **Why does `src/data/* (persistence, migrations, seeding, backup serialization, Drive storage)` connect `src/data/* (persistence, migrations, seeding, backup serialization, Drive storage)` to `app/layout.tsx`, `providers.tsx`?**
  _High betweenness centrality (0.081) - this node is a cross-community bridge._
- **Should `lib/motion.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.08978174603174603 - nodes in this community are weakly interconnected._
- **Why does `react` connect `react` to `record-editor.tsx`, `utils.ts`, `lib/motion.ts`, `use-sync-status.ts`, `monthly/page.tsx`, `sidebar.tsx`, `primitives.tsx`, `use-appearance.tsx`, `round2`, `cn`, `record-creator.tsx`, `package.json`, `sync/page.tsx`, `date-range.tsx`, `importer/page.tsx`, `duplicates/page.tsx`, `radix-ui`, `alert-dialog.tsx`, `app/layout.tsx`, `category.tsx`, `app.tsx`, `spending-calendar.tsx`, `pagination.tsx`, `Button`, `lucide-react`, `(month)/page.tsx`, `duplicate-review.tsx`, `icon.tsx`, `providers.tsx`?**
  _High betweenness centrality (0.078) - this node is a cross-community bridge._
- **Should `Tests README` be split into smaller, more focused modules?**
  _Cohesion score 0.05928614640048397 - nodes in this community are weakly interconnected._