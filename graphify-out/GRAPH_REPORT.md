# Graph Report - t3-6b4fc13c-8de3ddf0f021ed8e  (2026-11-14)

## Corpus Check
- 259 files · ~238,560 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 9 file(s) not represented in the graph (top: (none) 5, .example 1, .lock 1)

## Summary
- 1977 nodes · 7807 edges · 99 communities (90 shown, 9 thin omitted)
- Extraction: 98% EXTRACTED · 2% INFERRED · 0% AMBIGUOUS · INFERRED: 127 edges (avg confidence: 0.84)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `4864e3da`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- dashboard.ts
- RecordEditorDialog
- db.ts
- Tests README
- auto-sync.ts
- primitives.tsx
- ui/field.tsx
- ValidationError
- @playwright/test
- duplicates.ts
- lib/motion.ts
- compilerOptions
- editors.ts
- app-sidebar.tsx
- Validator
- export-import.ts
- dependencies
- ref_types
- statements.ts
- accounts/page.tsx
- command.tsx
- providers.tsx
- monthly-budgets.test.ts
- suspicious
- package.json
- ledger.e2e.ts
- correctness
- suggestions.ts
- core/components.e2e.ts
- auto-sync.ts
- support/motion.ts
- fixtures.ts
- alert-dialog.tsx
- src/data/* (persistence, migrations, seeding, backup serialization, Drive storage)
- test-data.ts
- components.json
- icon.tsx
- Button
- category-history-chart.tsx
- types.d.ts
- Monthly Budget
- app/layout.tsx
- statement-rules.ts
- utils.ts
- cn
- categories.ts
- tests_support_fixtures_expect
- formatter
- devDependencies
- pagination.tsx
- records.ts
- Commands
- Next.js agent rules block ("This is NOT the Next.js you know")
- src/components/*
- spending-calendar.tsx
- biome.json
- rules
- manifest.json
- amount-filter.tsx
- scripts
- (month)/page.tsx
- collectTests
- formatter
- Records
- STYLE.md
- Domain docs (single-context layout)
- optionalDependencies
- luxon
- tsconfig.e2e.json
- style
- duplicates/page.tsx
- combobox.tsx
- Finpoint icon concept
- Finpoint icon with charcoal shadow
- Issue tracker: Local Markdown
- Finpoint
- Domain docs
- Local Markdown Issue Tracker
- Google Drive sync
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
- Generated demo data
- Progressive Web Application
- State persistence rule (ephemeral UI state vs IndexedDB)
- vite.config.ts
- monthly-budget-usage.tsx
- data.ts
- trend-chart.tsx

## God Nodes (most connected - your core abstractions)
1. `cn()` - 320 edges
2. `PrimitivesSection()` - 181 edges
3. `Button()` - 123 edges
4. `react` - 99 edges
5. `formatCurrency()` - 74 edges
6. `RecordEditorDialog()` - 62 edges
7. `RecordCreatorDialog()` - 58 edges
8. `UiIcon()` - 56 edges
9. `round2()` - 45 edges
10. `pluralize()` - 44 edges

## Surprising Connections (you probably didn't know these)
- `Finpoint Style Additions` --references--> `useApiFormErrors()`  [INFERRED]
  STYLE.md → src/hooks/use-api-form-errors.ts
- `Copy` --references--> `pluralize()`  [INFERRED]
  STYLE.md → src/lib/utils.ts
- `Finpoint Style Additions` --references--> `ValidationError`  [INFERRED]
  STYLE.md → src/logic/validate.ts
- `DataSettingsPage()` --indirect_call--> `syncDrive()`  [INFERRED]
  app/sync/page.tsx → src/logic/drive-sync.ts
- `record()` --indirect_call--> `path()`  [INFERRED]
  tests/core/ledger.e2e.ts → src/components/charts/trend-chart.tsx

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **Change-scoped required checks that always report** — github_workflows_ci_changes, github_workflows_ci_checks, github_workflows_ci_domain, github_workflows_ci_core, github_workflows_ci_animations [EXTRACTED 0.95]
- **Group matrix to gate and merged HTML report flow** — github_workflows_ci_core_group, github_workflows_ci_animations_group, github_workflows_ci_blob_report_merge, github_workflows_ci_core, github_workflows_ci_animations [EXTRACTED 0.95]
- **Test file to CI group membership enforced by the ledger** — tests_readme_behaviour_ledger, tests_readme_ci_groups, tests_readme_areas, github_workflows_ci_ci [EXTRACTED 0.95]
- **CI browser test pipeline: setup, grouped runs, gated report merge** — github_actions_setup_action_setup, github_workflows_ci_core_group, github_workflows_ci_animations_group, github_workflows_ci_core, github_workflows_ci_animations, _github_workflows_ci_blob_report_merge [EXTRACTED 1.00]
- **Change-scoped job skipping with required checks still reporting** — github_workflows_ci_changes, github_workflows_ci_checks, github_workflows_ci_domain, github_workflows_ci_core, github_workflows_ci_animations, github_workflows_ci_required_checks [EXTRACTED 1.00]
- **Test group to gate to merged report flow** — github_workflows_ci_core_group, github_workflows_ci_animations_group, github_workflows_ci_core, github_workflows_ci_animations, github_workflows_ci_blob_report_merge [EXTRACTED 1.00]
- **Every browser test file joins exactly one CI group, enforced by the ledger** — tests_readme_behaviour_ledger, tests_readme_ci_groups, github_workflows_ci_core_group, github_workflows_ci_animations_group, agents_verification_rules [INFERRED 0.95]

## Communities (99 total, 9 thin omitted)

### Community 0 - "dashboard.ts"
Cohesion: 0.13
Nodes (35): AnalyticsRecord, AnalyticsSummary, contribution(), summarize(), avg(), buildCashflowHistory(), buildCategories(), buildComparison() (+27 more)

### Community 1 - "RecordEditorDialog"
Cohesion: 0.22
Nodes (37): sonner, AccountDialog(), BudgetCreatorDialog(), BudgetEditorDialog(), COLOURS, MonthlyBudgetDialog(), PendingStatementDialog(), PendingStatementValues (+29 more)

### Community 2 - "db.ts"
Cohesion: 0.07
Nodes (21): dexie, fake-indexeddb, xlsx, DB_NAME, DB_VERSION, MetaRow, SettingsRow, drive (+13 more)

### Community 3 - "Tests README"
Cohesion: 0.06
Nodes (41): Build harness step (vite build tests/harness), Playwright browser cache keyed on bun.lock, blob report merge, Committed graph artifacts (graph.json, GRAPH_REPORT.md, manifest.json, .graphify_labels.json), Graph health warnings and refresh failure reporting, graphify-out/graph.json, graphify skill (--update), graphify update . (+33 more)

### Community 4 - "auto-sync.ts"
Cohesion: 0.60
Nodes (4): useSyncStatus(), getSyncSnapshot(), subscribeSync(), SyncSnapshot

### Community 5 - "primitives.tsx"
Cohesion: 0.09
Nodes (49): Providers(), AlertAction(), DropdownMenu(), DropdownMenuCheckboxItem(), DropdownMenuContent(), DropdownMenuGroup(), DropdownMenuItem(), DropdownMenuLabel() (+41 more)

### Community 6 - "ui/field.tsx"
Cohesion: 0.20
Nodes (15): Props, AUTOPOPULATED_BORDER, FormField(), FormFieldProps, MotionFieldDescription, RecordAnalyticsFields(), Props, SelectField() (+7 more)

### Community 7 - "ValidationError"
Cohesion: 0.24
Nodes (21): papaparse, ensureAccount(), combine(), dbsDescriptionKey(), debitCreditAmount(), descriptionKey(), importDbs(), importFiles() (+13 more)

### Community 8 - "@playwright/test"
Cohesion: 0.23
Nodes (7): @playwright/test, cardTitles, card(), chartTooltip, overview, overviewCharts, themedRgb()

### Community 9 - "duplicates.ts"
Cohesion: 0.23
Nodes (15): allocationOutcome(), descriptionAnchors(), descriptionIdentity(), dismissDuplicatePair(), DuplicateGroup, duplicateGroups(), DuplicateStatement, eligible() (+7 more)

### Community 10 - "lib/motion.ts"
Cohesion: 0.10
Nodes (42): react-dom, @tanstack/react-table, Sparkline(), DetailSummary(), DetailSummaryItem(), Delta, Metric(), DataTable() (+34 more)

### Community 11 - "compilerOptions"
Cohesion: 0.06
Nodes (33): compilerOptions, allowJs, allowSyntheticDefaultImports, allowUnusedLabels, esModuleInterop, forceConsistentCasingInFileNames, incremental, isolatedModules (+25 more)

### Community 12 - "editors.ts"
Cohesion: 0.12
Nodes (22): editors, editors, longName, expectHeldRead(), expectRetainedRows(), expectSilentSheet(), expectVisibleBackdrop(), IDS (+14 more)

### Community 13 - "app-sidebar.tsx"
Cohesion: 0.07
Nodes (60): POST(), POST(), POST(), ReviewLinks(), NotFound(), nextConfig, next, AppearanceOption (+52 more)

### Community 14 - "Validator"
Cohesion: 0.25
Nodes (18): updateAccount(), createBudget(), validateBudget(), restoreDuplicatePair(), amountFor(), createMonthlyBudget(), defaultAmountFor(), setMonthlyBudgetAmount() (+10 more)

### Community 15 - "export-import.ts"
Cohesion: 0.20
Nodes (18): db, clearAllData(), downloadExport(), exportData(), importData(), monthlyBudgetFields(), parseImportFile(), tableCounts() (+10 more)

### Community 16 - "dependencies"
Cohesion: 0.07
Nodes (30): dependencies, @base-ui/react, class-variance-authority, clsx, cmdk, dexie, dexie-react-hooks, @fontsource-variable/inter (+22 more)

### Community 17 - "ref_types"
Cohesion: 0.18
Nodes (19): CategoriesPage(), CategoryDialogState, CategoryTile(), SECTIONS, CategoryDialog(), CategoryFormValues, EMPTY_FORM_VALUES, iconLabel() (+11 more)

### Community 18 - "statements.ts"
Cohesion: 0.15
Nodes (25): asPending(), removeStatementDismissals(), dayDifference(), ensureCanReplace(), maskDescription(), ReplacementAllocation, replacementComparison(), replacementReason() (+17 more)

### Community 19 - "accounts/page.tsx"
Cohesion: 0.11
Nodes (27): AccountCard(), AccountRow, BUDGET_STATES, BudgetCard(), BudgetsPage(), BudgetState, formatBudgetDateWindow(), PaginationHeader() (+19 more)

### Community 20 - "command.tsx"
Cohesion: 0.33
Nodes (11): CategoryFilter(), CategoryFilterItem(), Command(), CommandEmpty(), CommandGroup(), CommandInput(), CommandItem(), CommandList() (+3 more)

### Community 21 - "providers.tsx"
Cohesion: 0.33
Nodes (8): Boot(), @vercel/analytics, @vercel/speed-insights, preloadCategoryIcons(), useSyncToasts(), startAutoSync(), subscribeSyncEvents(), listCategoryIconNames()

### Community 22 - "monthly-budgets.test.ts"
Cohesion: 0.23
Nodes (9): FinpointDB, withoutActionModes(), digestSnapshot(), hashLegacySnapshot(), hashSnapshot(), Snapshot, input, legacyPaceKey (+1 more)

### Community 23 - "suspicious"
Cohesion: 0.07
Nodes (28): suspicious, noAssignInExpressions, noAsyncPromiseExecutor, noCatchAssign, noClassAssign, noCompareNegZero, noControlCharactersInRegex, noDebugger (+20 more)

### Community 24 - "package.json"
Cohesion: 0.07
Nodes (27): private, $schema, type, babel-plugin-react-compiler, @biomejs/biome, clsx, cmdk, @fontsource-variable/inter (+19 more)

### Community 25 - "ledger.e2e.ts"
Cohesion: 0.11
Nodes (25): behaviourCoverage, componentInventory, facetNotApplicable, InventoryEntry, modalAnimationCoverage, notApplicable, openFacets, RouteEntry (+17 more)

### Community 26 - "correctness"
Cohesion: 0.08
Nodes (26): noConstantCondition, noConstAssign, noEmptyCharacterClassInRegex, noEmptyPattern, noGlobalObjectCalls, noInvalidBuiltinInstantiation, noInvalidConstructorSuper, noNonoctalDecimalEscape (+18 more)

### Community 27 - "suggestions.ts"
Cohesion: 0.10
Nodes (37): AllocationRow, allocatedStatements(), asOf(), byDate(), CHIP_LIMIT, CHOICES, Clue, createModel() (+29 more)

### Community 28 - "core/components.e2e.ts"
Cohesion: 0.19
Nodes (8): bounds(), contained(), expectWheelScrollsPageWhileOpen(), containedFooter(), expectDropdownPreservesScroll(), expectPointerCursor(), scrollWithInput(), settledOverlayAlpha()

### Community 29 - "auto-sync.ts"
Cohesion: 0.10
Nodes (51): SYNC_TABLES, AuthNeededError, cacheToken(), CodeResponse, disconnectDrive(), downloadBackupFile(), driveFetch(), DriveFileMeta (+43 more)

### Community 30 - "support/motion.ts"
Cohesion: 0.17
Nodes (19): denseCardConsumers, denseRowConsumers, expectConsumerEntrance(), populatedConsumers, pickOption(), attachSamplingFailure(), expectPopupEntrance(), expectReducedRowMovement() (+11 more)

### Community 31 - "fixtures.ts"
Cohesion: 0.14
Nodes (21): Child, october, september, PREMATURE, routeReady, titles, installDateOnly(), revisions (+13 more)

### Community 32 - "alert-dialog.tsx"
Cohesion: 0.34
Nodes (12): DriveOverwriteConfirmation(), AlertDialog(), AlertDialogAction(), AlertDialogCancel(), AlertDialogContent(), AlertDialogDescription(), AlertDialogFooter(), AlertDialogHeader() (+4 more)

### Community 33 - "src/data/* (persistence, migrations, seeding, backup serialization, Drive storage)"
Cohesion: 0.28
Nodes (10): Background Drive sync, src/data/* (persistence, migrations, seeding, backup serialization, Drive storage), src/logic/* (domain reads and operations), (month) route-group shell (Overview + Monthly Records), Project Shape, React Compiler (enabled), src/routes.ts (centralized route paths), Static content pages (privacy, terms) are server components (+2 more)

### Community 34 - "test-data.ts"
Cohesion: 0.13
Nodes (20): DEFAULT_CATEGORIES, DEFAULT_MONTHLY_BUDGETS, EXPORT_VERSION, FinpointExport, migrateRecordChoices(), SEED_HASH_KEY, BANK_BLURB, between() (+12 more)

### Community 35 - "components.json"
Cohesion: 0.09
Nodes (21): aliases, components, hooks, lib, ui, utils, iconLibrary, menuAccent (+13 more)

### Community 36 - "icon.tsx"
Cohesion: 0.24
Nodes (9): lucide-react, DynamicUiIcon(), ICON_NAMES, iconNameSet, loadedIcons, loadIcon(), loadingIcons, normalize() (+1 more)

### Community 37 - "Button"
Cohesion: 0.13
Nodes (32): MonthLayout(), react, react-day-picker, DateField(), Props, DateRange(), DateRangeValue, formatRange() (+24 more)

### Community 38 - "category-history-chart.tsx"
Cohesion: 0.18
Nodes (17): aggregateSeries(), CategoryHistoryChart(), ChartMonth, ChartSeries, MonthBreakdown(), MonthTick(), monthTotal(), prepareMonths() (+9 more)

### Community 39 - "types.d.ts"
Cohesion: 0.10
Nodes (20): Account, Allocation, AnalyticsSummary, AnalyticsTreatment, Appearance, Budget, Category, CategoryWithChildren (+12 more)

### Community 40 - "Monthly Budget"
Cohesion: 0.18
Nodes (16): CONTEXT.md (domain vocabulary), Account, Allocation, Budget, Category, Duplicate Statement, Finpoint Domain Glossary, Monthly Budget (+8 more)

### Community 41 - "app/layout.tsx"
Cohesion: 0.22
Nodes (8): bun test, IndexedDB (Dexie), Domain and importer tests (Dexie with in-memory IndexedDB), String primary keys (not auto-increment), Verification, metadata, RootLayout(), viewport

### Community 42 - "statement-rules.ts"
Cohesion: 0.23
Nodes (13): StatementRow, byCreation(), conditionPattern(), deleteStatementRule(), listStatementRules(), matchesStatement(), NAME_ORDER, previewStatementRule() (+5 more)

### Community 43 - "utils.ts"
Cohesion: 0.14
Nodes (31): ACCEPT, BANKS_REQUIRING_ADDITIONAL_INFO, Rule, RuleSentence(), StatementRulesPage(), dexie-react-hooks, framer-motion, @tanstack/react-form (+23 more)

### Community 44 - "cn"
Cohesion: 0.10
Nodes (41): radix-ui, AppHeader(), AppearanceSwitch(), ButtonGroup(), ButtonGroupSeparator(), ButtonGroupText(), buttonGroupVariants, FieldSeparator() (+33 more)

### Community 45 - "categories.ts"
Cohesion: 0.33
Nodes (7): CategoryInput, checkReferences(), cleanInput(), createCategory(), deleteCategory(), updateCategory(), TREATMENT_VALUES

### Community 46 - "tests_support_fixtures_expect"
Cohesion: 0.15
Nodes (5): desktopOnly, expectBackAboveHeadingFromKeyboardNavigation(), keyboardBack(), APP_URL, HARNESS_URL

### Community 47 - "formatter"
Cohesion: 0.15
Nodes (13): arrowParentheses, bracketSameLine, bracketSpacing, jsxQuoteStyle, quoteProperties, quoteStyle, semicolons, trailingCommas (+5 more)

### Community 48 - "devDependencies"
Cohesion: 0.15
Nodes (13): devDependencies, babel-plugin-react-compiler, @biomejs/biome, fake-indexeddb, @playwright/test, @tailwindcss/postcss, @types/luxon, @types/node (+5 more)

### Community 49 - "pagination.tsx"
Cohesion: 0.38
Nodes (11): pageHref(), pageWindow(), PaginationFooter(), Pagination(), PaginationContent(), PaginationEllipsis(), PaginationItem(), PaginationLink() (+3 more)

### Community 50 - "records.ts"
Cohesion: 0.13
Nodes (21): CategoryRow, RecordRow, canUseMonthlyBudget(), duplicateStatementIds(), resolveRecordChoices(), inferRecordDatetime(), analyticsValues(), budgetCovers() (+13 more)

### Community 51 - "Commands"
Cohesion: 0.38
Nodes (7): Biome (biome check --write), bun install, bun lint (write-mode), bun lint:check, bun run build, bun types:check, Commands

### Community 52 - "Next.js agent rules block ("This is NOT the Next.js you know")"
Cohesion: 0.25
Nodes (6): app/api/auth/* Route Handlers, node_modules/next/dist/server/lib/generate-agent-files.js, Google OAuth broker (exchange/token/logout), Next.js App Router app (mostly client-side), node_modules/next/dist/docs/, npm run dev (port 5173)

### Community 53 - "src/components/*"
Cohesion: 0.25
Nodes (5): Agent Behavior, Generated / Ignored Files, src/components/*, src/components/ui/**/*, useLiveQuery

### Community 54 - "spending-calendar.tsx"
Cohesion: 0.29
Nodes (9): compact(), heat(), INK, LEVELS, quantile(), rampCap(), SpendingCalendar(), STRENGTH (+1 more)

### Community 55 - "biome.json"
Cohesion: 0.18
Nodes (10): source, assist, actions, files, includes, linter, enabled, overrides (+2 more)

### Community 56 - "rules"
Cohesion: 0.18
Nodes (11): noAdjacentSpacesInRegex, noBannedTypes, noExtraBooleanCast, noUselessCatch, noUselessThisAlias, noUselessTypeConstraint, rules, noFloatingPromises (+3 more)

### Community 57 - "manifest.json"
Cohesion: 0.20
Nodes (9): background_color, description, display, icons, name, scope, short_name, start_url (+1 more)

### Community 58 - "amount-filter.tsx"
Cohesion: 0.18
Nodes (27): class-variance-authority, PendingStatementConfirmationSheet(), RecordSearchSheet(), byRecordDay, RecordsSheet(), StatementSearchSheet(), AmountFilter(), AmountRange (+19 more)

### Community 59 - "scripts"
Cohesion: 0.22
Nodes (9): scripts, build, dev, lint, lint:check, start, test:e2e, types:check (+1 more)

### Community 60 - "(month)/page.tsx"
Cohesion: 0.12
Nodes (26): Comparison, comparisonRateText(), comparisonText(), ComparisonValue, DashboardData, DashboardMonthlyBudget, DashboardPage(), DashboardView (+18 more)

### Community 61 - "collectTests"
Cohesion: 0.28
Nodes (16): collectTests(), conditionBranch(), detailsTags(), disabled(), mentionsMotion(), record(), splitTestCallee(), tagValues() (+8 more)

### Community 62 - "formatter"
Cohesion: 0.25
Nodes (8): formatter, attributePosition, enabled, formatWithErrors, indentStyle, indentWidth, lineEnding, lineWidth

### Community 63 - "Records"
Cohesion: 0.32
Nodes (8): Allocator, Budgets, Categories, Dashboard, Statement-allocation-record model, Monthly Budgets, Records, Statement importer

### Community 64 - "STYLE.md"
Cohesion: 0.13
Nodes (17): Old Laravel Api/*Controller mapping, Laravel-shaped { field: string[] } error maps, ValidationError, Validator, APIs, Arguments, And Props, Code Style, Consistency, Copy (+9 more)

### Community 65 - "Domain docs (single-context layout)"
Cohesion: 0.40
Nodes (6): Agent skills, CONTEXT.md, Domain docs (single-context layout), Domain Language, Issue tracker (local specs and tickets), .scratch/ local work tracking

### Community 66 - "optionalDependencies"
Cohesion: 0.29
Nodes (7): optionalDependencies, lightningcss-linux-x64-gnu, lightningcss-win32-x64-msvc, @rollup/rollup-linux-x64-gnu, @rollup/rollup-win32-x64-msvc, @tailwindcss/oxide-linux-x64-gnu, @tailwindcss/oxide-win32-x64-msvc

### Community 67 - "luxon"
Cohesion: 0.21
Nodes (14): luxon, CashflowChart(), CashflowPoint, DailySpendingChart(), MonthlyBudgetLine, SurplusPoint, TotalSpendingChart(), MonthlyBudgetBadge() (+6 more)

### Community 68 - "tsconfig.e2e.json"
Cohesion: 0.29
Nodes (6): ./tsconfig.json, compilerOptions, incremental, exclude, extends, include

### Community 69 - "style"
Cohesion: 0.33
Nodes (6): style, noNamespace, noNonNullAssertion, useArrayLiterals, useAsConstAssertion, useBlockStatements

### Community 70 - "duplicates/page.tsx"
Cohesion: 0.06
Nodes (133): AccountPage(), AccountsPage(), CARD_MOTION, DuplicateGroupCard(), FixDuplicatesPage(), GroupHeader(), highlightDifferences(), VIEWS (+125 more)

### Community 71 - "combobox.tsx"
Cohesion: 0.11
Nodes (26): @base-ui/react, ComboboxField(), Props, ComboboxChip(), ComboboxChips(), ComboboxChipsInput(), ComboboxClear(), ComboboxCollection() (+18 more)

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

### Community 79 - "Google Drive sync"
Cohesion: 0.50
Nodes (4): Google Drive sync, JSON backup and restore, Local-first finance tracking, Sync conflict handling

### Community 80 - "F monogram icon"
Cohesion: 0.67
Nodes (3): Circular dot beside F, Rounded F letterform, F monogram icon

### Community 81 - "JPG favicon icon"
Cohesion: 0.67
Nodes (3): JPG favicon dot, JPG favicon F letterform, JPG favicon icon

### Community 82 - "PNG favicon icon"
Cohesion: 0.67
Nodes (3): PNG favicon dot, PNG favicon F letterform, PNG favicon icon

### Community 83 - "SVG favicon icon"
Cohesion: 0.67
Nodes (3): SVG favicon dot, SVG favicon F letterform, SVG favicon icon

### Community 84 - "F monogram icon"
Cohesion: 0.67
Nodes (3): Circular dot beside F, Rounded F letterform, F monogram icon

### Community 85 - "F monogram icon"
Cohesion: 0.67
Nodes (3): Circular dot beside F, Rounded F letterform, F monogram icon

### Community 94 - "State persistence rule (ephemeral UI state vs IndexedDB)"
Cohesion: 0.33
Nodes (5): app/**/page.tsx, Interactive routes are "use client" (search params via next/navigation), Pages take no props, Root Suspense (keeps routes static), URL search params (filters and pagination)

### Community 95 - "vite.config.ts"
Cohesion: 0.29
Nodes (4): vite, @vitejs/plugin-react, harnessDir, repoRoot

### Community 96 - "monthly-budget-usage.tsx"
Cohesion: 0.60
Nodes (4): arc(), centerCurrency(), MonthlyBudgetUsage(), MonthlyBudgetUsageItem

### Community 99 - "data.ts"
Cohesion: 0.08
Nodes (25): AccountRow, AnalyticsMonthRow, BudgetRecordRow, BudgetRow, DuplicateDismissalRow, MonthlyBudgetAmountRow, MonthlyBudgetDefaultRow, MonthlyBudgetRow (+17 more)

### Community 100 - "trend-chart.tsx"
Cohesion: 0.16
Nodes (18): bar(), BarChart(), BarSeries, PAD, BudgetProgressChart(), BudgetProgressPoint, buildSeries(), ChartFrame() (+10 more)

## Knowledge Gaps
- **83 isolated node(s):** `@fontsource-variable/inter`, `shadcn`, `tailwindcss`, `tw-animate-css`, `@biomejs/biome` (+78 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 609 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **9 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `cn()` connect `cn` to `RecordEditorDialog`, `primitives.tsx`, `ui/field.tsx`, `lib/motion.ts`, `app-sidebar.tsx`, `ref_types`, `accounts/page.tsx`, `command.tsx`, `alert-dialog.tsx`, `icon.tsx`, `Button`, `category-history-chart.tsx`, `utils.ts`, `pagination.tsx`, `spending-calendar.tsx`, `amount-filter.tsx`, `(month)/page.tsx`, `luxon`, `duplicates/page.tsx`, `combobox.tsx`, `monthly-budget-usage.tsx`, `trend-chart.tsx`?**
  _High betweenness centrality (0.106) - this node is a cross-community bridge._
- **What connects `@fontsource-variable/inter`, `shadcn`, `tailwindcss` to the rest of the system?**
  _83 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `dashboard.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.1346153846153846 - nodes in this community are weakly interconnected._
- **Why does `react` connect `Button` to `RecordEditorDialog`, `auto-sync.ts`, `primitives.tsx`, `ui/field.tsx`, `lib/motion.ts`, `app-sidebar.tsx`, `ref_types`, `accounts/page.tsx`, `command.tsx`, `providers.tsx`, `package.json`, `alert-dialog.tsx`, `icon.tsx`, `category-history-chart.tsx`, `app/layout.tsx`, `utils.ts`, `cn`, `pagination.tsx`, `spending-calendar.tsx`, `amount-filter.tsx`, `(month)/page.tsx`, `duplicates/page.tsx`, `combobox.tsx`, `monthly-budget-usage.tsx`, `trend-chart.tsx`?**
  _High betweenness centrality (0.073) - this node is a cross-community bridge._
- **Should `db.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.07149758454106281 - nodes in this community are weakly interconnected._
- **Why does `src/data/* (persistence, migrations, seeding, backup serialization, Drive storage)` connect `src/data/* (persistence, migrations, seeding, backup serialization, Drive storage)` to `app/layout.tsx`, `providers.tsx`?**
  _High betweenness centrality (0.073) - this node is a cross-community bridge._
- **Should `Tests README` be split into smaller, more focused modules?**
  _Cohesion score 0.05928614640048397 - nodes in this community are weakly interconnected._