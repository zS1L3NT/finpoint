# Graph Report - t3-1f6a7061-9fbc82090c645f6b  (2026-11-27)

## Corpus Check
- 284 files · ~256,646 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 9 file(s) not represented in the graph (top: (none) 5, .example 1, .lock 1)

## Summary
- 2104 nodes · 8342 edges · 103 communities (93 shown, 10 thin omitted)
- Extraction: 98% EXTRACTED · 2% INFERRED · 0% AMBIGUOUS · INFERRED: 138 edges (avg confidence: 0.84)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `d3f17327`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- dashboard.ts
- react
- data.ts
- Tests README
- (month)/page.tsx
- duplicates/page.tsx
- cn
- trend-chart.tsx
- @playwright/test
- db.ts
- lib/motion.ts
- compilerOptions
- editors.ts
- importer/page.tsx
- Validator
- icon.tsx
- dependencies
- collectTests
- combobox.tsx
- utils.ts
- vite.config.ts
- Button
- records.ts
- suspicious
- package.json
- ledger.e2e.ts
- correctness
- suggestions.ts
- core/components.e2e.ts
- spending-calendar.tsx
- support/motion.ts
- displays.tsx
- primitives.tsx
- src/data/* (persistence, migrations, seeding, backup serialization, Drive storage)
- google-drive.ts
- components.json
- allocator/page.tsx
- statement-rules.ts
- transaction-checks.test.ts
- types.d.ts
- Monthly Budget
- app-sidebar.tsx
- scripts
- sync/page.tsx
- export-import.ts
- record-columns.tsx
- core/routes.e2e.ts
- formatter
- devDependencies
- pagination.tsx
- statements.ts
- Commands
- Next.js agent rules block ("This is NOT the Next.js you know")
- themeColor
- optionalDependencies
- biome.json
- rules
- manifest.json
- category-filter.tsx
- lucide-react
- auth-vault.ts
- fixtures.ts
- formatter
- Records
- Validation rule (ValidationError + Validator)
- Domain docs (single-context layout)
- auto-sync.test.ts
- next
- tsconfig.e2e.json
- style
- drive-sync.ts
- tests_support_fixtures_expect
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
- alert-dialog.tsx
- app.tsx
- (month)/layout.tsx
- auto-sync.ts
- STYLE.md
- core/editors.e2e.ts
- radix-ui
- icon.tsx
- playwright.config.ts

## God Nodes (most connected - your core abstractions)
1. `cn()` - 320 edges
2. `PrimitivesSection()` - 181 edges
3. `Button()` - 123 edges
4. `react` - 99 edges
5. `formatCurrency()` - 79 edges
6. `RecordEditorDialog()` - 60 edges
7. `UiIcon()` - 60 edges
8. `RecordCreatorDialog()` - 57 edges
9. `round2()` - 46 edges
10. `ValidationError` - 46 edges

## Surprising Connections (you probably didn't know these)
- `Finpoint Style Additions` --references--> `useApiFormErrors()`  [INFERRED]
  STYLE.md → src/hooks/use-api-form-errors.ts
- `Copy` --references--> `pluralize()`  [INFERRED]
  STYLE.md → src/lib/utils.ts
- `Finpoint Style Additions` --references--> `ValidationError`  [INFERRED]
  STYLE.md → src/logic/validate.ts
- `SECTIONS` --calls--> `treatmentLabel()`  [EXTRACTED]
  app/categories/page.tsx → src/lib/analytics.ts
- `Boot()` --indirect_call--> `preloadCategoryIcons()`  [INFERRED]
  app/providers.tsx → src/components/icon.tsx

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

## Communities (103 total, 10 thin omitted)

### Community 0 - "dashboard.ts"
Cohesion: 0.13
Nodes (36): AnalyticsRecord, AnalyticsSummary, contribution(), summarize(), avg(), buildCashflowHistory(), buildCategories(), buildComparison() (+28 more)

### Community 1 - "react"
Cohesion: 0.06
Nodes (131): BudgetPage(), getCategoryData(), Legend(), outsideKey(), metadata, PrivacyPage(), SECTIONS, StatementPage() (+123 more)

### Community 2 - "data.ts"
Cohesion: 0.12
Nodes (23): AccountRow, AnalyticsMonthRow, BudgetRecordRow, BudgetRow, DuplicateDismissalRow, MonthlyBudgetAmountRow, MonthlyBudgetDefaultRow, buildDense() (+15 more)

### Community 3 - "Tests README"
Cohesion: 0.05
Nodes (45): Build harness step (vite build tests/harness), Playwright browser cache keyed on bun.lock, blob report merge, Committed graph artifacts (graph.json, GRAPH_REPORT.md, manifest.json, .graphify_labels.json), Graph health warnings and refresh failure reporting, graphify-out/graph.json, graphify skill (--update), graphify update . (+37 more)

### Community 4 - "(month)/page.tsx"
Cohesion: 0.12
Nodes (26): Comparison, comparisonRateText(), comparisonText(), ComparisonValue, DashboardData, DashboardMonthlyBudget, DashboardPage(), DashboardView (+18 more)

### Community 5 - "duplicates/page.tsx"
Cohesion: 0.22
Nodes (26): CARD_MOTION, DuplicateGroupCard(), FixDuplicatesPage(), GroupHeader(), highlightDifferences(), VIEWS, ScopeSelect(), RecordCreatorHost() (+18 more)

### Community 6 - "cn"
Cohesion: 0.13
Nodes (30): AppearanceSwitch(), SidebarContent(), SidebarContext, SidebarContextProps, SidebarFooter(), SidebarGroup(), SidebarGroupAction(), SidebarGroupContent() (+22 more)

### Community 7 - "trend-chart.tsx"
Cohesion: 0.15
Nodes (18): bar(), BarChart(), BarSeries, PAD, ChartFrame(), ChartSize, ReadoutRows(), arc() (+10 more)

### Community 8 - "@playwright/test"
Cohesion: 0.23
Nodes (7): @playwright/test, cardTitles, card(), chartTooltip, overview, overviewCharts, themedRgb()

### Community 9 - "db.ts"
Cohesion: 0.05
Nodes (36): dexie, fake-indexeddb, luxon, CategoryRow, DB_NAME, DB_VERSION, FinpointDB, MetaRow (+28 more)

### Community 10 - "lib/motion.ts"
Cohesion: 0.20
Nodes (28): @tanstack/react-table, DataTable(), PaginatedDataTable(), PaginationHeader(), GroupHeaderRow(), groupStarts(), GroupTotal(), isInteractiveTarget() (+20 more)

### Community 11 - "compilerOptions"
Cohesion: 0.06
Nodes (33): compilerOptions, allowJs, allowSyntheticDefaultImports, allowUnusedLabels, esModuleInterop, forceConsistentCasingInFileNames, incremental, isolatedModules (+25 more)

### Community 12 - "editors.ts"
Cohesion: 0.15
Nodes (14): editors, expectHeldRead(), expectRetainedRows(), expectSilentSheet(), account, budget, chooseCategory(), deleted (+6 more)

### Community 13 - "importer/page.tsx"
Cohesion: 0.14
Nodes (26): ACCEPT, BANKS_REQUIRING_ADDITIONAL_INFO, ImporterPage(), Step(), xlsx, BANKS, ensureAccount(), combine() (+18 more)

### Community 14 - "Validator"
Cohesion: 0.26
Nodes (17): updateAccount(), validateBudget(), cleanInput(), dismissDuplicatePair(), fixDuplicates(), restoreDuplicatePair(), createMonthlyBudget(), setMonthlyBudgetAmount() (+9 more)

### Community 15 - "icon.tsx"
Cohesion: 0.23
Nodes (13): aggregateSeries(), CategoryHistoryChart(), ChartMonth, ChartSeries, MonthBreakdown(), MonthTick(), monthTotal(), prepareMonths() (+5 more)

### Community 16 - "dependencies"
Cohesion: 0.07
Nodes (30): dependencies, @base-ui/react, class-variance-authority, clsx, cmdk, dexie, dexie-react-hooks, @fontsource-variable/inter (+22 more)

### Community 17 - "collectTests"
Cohesion: 0.28
Nodes (16): collectTests(), conditionBranch(), detailsTags(), disabled(), mentionsMotion(), record(), splitTestCallee(), tagValues() (+8 more)

### Community 18 - "combobox.tsx"
Cohesion: 0.11
Nodes (24): @base-ui/react, ComboboxChip(), ComboboxChips(), ComboboxChipsInput(), ComboboxClear(), ComboboxCollection(), ComboboxContent(), ComboboxEmpty() (+16 more)

### Community 19 - "utils.ts"
Cohesion: 0.20
Nodes (26): AllocatorPendingPage(), CandidatePage, CandidateResults(), PendingCard(), AllocateBar(), Amount(), dateDifferenceLabel(), ReplacementReview (+18 more)

### Community 20 - "vite.config.ts"
Cohesion: 0.29
Nodes (4): vite, @vitejs/plugin-react, harnessDir, repoRoot

### Community 21 - "Button"
Cohesion: 0.14
Nodes (33): BUDGET_STATES, BudgetCard(), BudgetsPage(), BudgetState, formatBudgetDateWindow(), CategoriesPage(), CategoryDialogState, CategoryGroup() (+25 more)

### Community 22 - "records.ts"
Cohesion: 0.10
Nodes (34): round2(), compareRecords(), flagParam(), listParam(), looseFlagParam(), numberParam(), ParamSource, textParam() (+26 more)

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
Nodes (32): AllocationRow, MonthlyBudgetRow, allocatedStatements(), asOf(), byDate(), CHIP_LIMIT, CHOICES, Clue (+24 more)

### Community 28 - "core/components.e2e.ts"
Cohesion: 0.18
Nodes (9): bounds(), contained(), expectWheelScrollsPageWhileOpen(), containedFooter(), expectDropdownPreservesScroll(), expectPointerCursor(), scrollWithInput(), settledOverlayAlpha() (+1 more)

### Community 29 - "spending-calendar.tsx"
Cohesion: 0.29
Nodes (9): compact(), heat(), INK, LEVELS, quantile(), rampCap(), SpendingCalendar(), STRENGTH (+1 more)

### Community 30 - "support/motion.ts"
Cohesion: 0.26
Nodes (13): expectVisibleBackdrop(), attachSamplingFailure(), expectModalEntrance(), expectModalExit(), expectPopupEntrance(), matrixIsIdentity(), MotionFrame, MotionPose (+5 more)

### Community 31 - "displays.tsx"
Cohesion: 0.23
Nodes (13): framer-motion, Sparkline(), DetailSummary(), DetailSummaryItem(), Delta, Metric(), ValueSwap(), DURATION (+5 more)

### Community 32 - "primitives.tsx"
Cohesion: 0.10
Nodes (46): AlertAction(), CardFooter(), DropdownMenu(), DropdownMenuCheckboxItem(), DropdownMenuContent(), DropdownMenuGroup(), DropdownMenuItem(), DropdownMenuLabel() (+38 more)

### Community 33 - "src/data/* (persistence, migrations, seeding, backup serialization, Drive storage)"
Cohesion: 0.15
Nodes (17): app/**/page.tsx, Background Drive sync, src/data/* (persistence, migrations, seeding, backup serialization, Drive storage), IndexedDB (Dexie), Interactive routes are "use client" (search params via next/navigation), src/logic/* (domain reads and operations), (month) route-group shell (Overview + Monthly Records), Pages take no props (+9 more)

### Community 34 - "google-drive.ts"
Cohesion: 0.09
Nodes (29): AuthNeededError, AuthRedirectError, cacheToken(), CodeResponse, completeDriveRedirect(), disconnectDrive(), DriveAction, DriveFileMeta (+21 more)

### Community 35 - "components.json"
Cohesion: 0.09
Nodes (21): aliases, components, hooks, lib, ui, utils, iconLibrary, menuAccent (+13 more)

### Community 36 - "allocator/page.tsx"
Cohesion: 0.20
Nodes (25): AccountPage(), AccountCard(), AccountRow, AccountsPage(), AllocatorPage(), RecordsPage(), StatementsPage(), SelectionBar() (+17 more)

### Community 37 - "statement-rules.ts"
Cohesion: 0.20
Nodes (14): byCreation(), conditionPattern(), deleteStatementRule(), listStatementRules(), matchesStatement(), NAME_ORDER, previewStatementRule(), recommendationAutofill() (+6 more)

### Community 38 - "transaction-checks.test.ts"
Cohesion: 0.22
Nodes (3): HELD, raceGap(), reset()

### Community 39 - "types.d.ts"
Cohesion: 0.10
Nodes (20): Account, Allocation, AnalyticsSummary, AnalyticsTreatment, Appearance, Budget, Category, CategoryWithChildren (+12 more)

### Community 40 - "Monthly Budget"
Cohesion: 0.18
Nodes (16): CONTEXT.md (domain vocabulary), Account, Allocation, Budget, Category, Duplicate Statement, Finpoint Domain Glossary, Monthly Budget (+8 more)

### Community 41 - "app-sidebar.tsx"
Cohesion: 0.07
Nodes (60): metadata, RootLayout(), viewport, Boot(), Providers(), @vercel/analytics, @vercel/speed-insights, AppearanceOption (+52 more)

### Community 42 - "scripts"
Cohesion: 0.22
Nodes (9): scripts, build, dev, lint, lint:check, start, test:e2e, types:check (+1 more)

### Community 43 - "sync/page.tsx"
Cohesion: 0.14
Nodes (27): COUNT_ROWS, DataSettingsPage(), LINK_TONES, LinkTone, STATUS_TONES, StatusTone, SyncEndpoint(), WorkspaceRow() (+19 more)

### Community 44 - "export-import.ts"
Cohesion: 0.11
Nodes (26): db, DEFAULT_CATEGORIES, DEFAULT_MONTHLY_BUDGETS, EXPORT_VERSION, FinpointExport, TableName, TABLES, DEFAULT_SETTINGS (+18 more)

### Community 45 - "record-columns.tsx"
Cohesion: 0.12
Nodes (47): dexie-react-hooks, BudgetRecordsSheet(), byRecordDay, Shown, PendingStatementConfirmationSheet(), RecordOption(), RecordSearchSheet(), WIDEN (+39 more)

### Community 46 - "core/routes.e2e.ts"
Cohesion: 0.12
Nodes (23): denseCardConsumers, denseRowConsumers, expectConsumerEntrance(), populatedConsumers, Child, october, september, PREMATURE (+15 more)

### Community 47 - "formatter"
Cohesion: 0.15
Nodes (13): arrowParentheses, bracketSameLine, bracketSpacing, jsxQuoteStyle, quoteProperties, quoteStyle, semicolons, trailingCommas (+5 more)

### Community 48 - "devDependencies"
Cohesion: 0.15
Nodes (13): devDependencies, babel-plugin-react-compiler, @biomejs/biome, fake-indexeddb, @playwright/test, @tailwindcss/postcss, @types/luxon, @types/node (+5 more)

### Community 49 - "pagination.tsx"
Cohesion: 0.38
Nodes (11): pageHref(), pageWindow(), PaginationFooter(), Pagination(), PaginationContent(), PaginationEllipsis(), PaginationItem(), PaginationLink() (+3 more)

### Community 50 - "statements.ts"
Cohesion: 0.09
Nodes (45): asPending(), StatementRow, descriptionAnchors(), descriptionIdentity(), dismissedDuplicatePairs(), DuplicateGroup, duplicateGroups(), duplicateReview() (+37 more)

### Community 51 - "Commands"
Cohesion: 0.20
Nodes (11): Agent Behavior, Biome (biome check --write), bun install, bun lint (write-mode), bun lint:check, bun run build, bun types:check, Commands (+3 more)

### Community 52 - "Next.js agent rules block ("This is NOT the Next.js you know")"
Cohesion: 0.18
Nodes (9): app/api/auth/* Route Handlers, bun test, node_modules/next/dist/server/lib/generate-agent-files.js, Google OAuth broker (exchange/token/logout), Domain and importer tests (Dexie with in-memory IndexedDB), Next.js App Router app (mostly client-side), node_modules/next/dist/docs/, npm run dev (port 5173) (+1 more)

### Community 53 - "themeColor"
Cohesion: 0.21
Nodes (15): CashflowChart(), CashflowPoint, CategorySpendingMix(), DailySpendingChart(), MonthlyBudgetLine, SurplusPoint, TotalSpendingChart(), TrendChart() (+7 more)

### Community 54 - "optionalDependencies"
Cohesion: 0.29
Nodes (7): optionalDependencies, lightningcss-linux-x64-gnu, lightningcss-win32-x64-msvc, @rollup/rollup-linux-x64-gnu, @rollup/rollup-win32-x64-msvc, @tailwindcss/oxide-linux-x64-gnu, @tailwindcss/oxide-win32-x64-msvc

### Community 55 - "biome.json"
Cohesion: 0.18
Nodes (10): source, assist, actions, files, includes, linter, enabled, overrides (+2 more)

### Community 56 - "rules"
Cohesion: 0.18
Nodes (11): noAdjacentSpacesInRegex, noBannedTypes, noExtraBooleanCast, noUselessCatch, noUselessThisAlias, noUselessTypeConstraint, rules, noFloatingPromises (+3 more)

### Community 57 - "manifest.json"
Cohesion: 0.20
Nodes (9): background_color, description, display, icons, name, scope, short_name, start_url (+1 more)

### Community 58 - "category-filter.tsx"
Cohesion: 0.19
Nodes (19): DateField(), Props, CategoryFilter(), CategoryFilterItem(), Command(), CommandEmpty(), CommandGroup(), CommandInput() (+11 more)

### Community 59 - "lucide-react"
Cohesion: 0.24
Nodes (10): lucide-react, buttonVariants, Calendar(), CalendarDayButton(), ButtonVariant, Month, MonthCal(), MonthCalProps (+2 more)

### Community 60 - "auth-vault.ts"
Cohesion: 0.29
Nodes (14): POST(), POST(), POST(), jose, AUTH_COOKIE_NAME, authCookie(), authCookieConfig(), clientIp() (+6 more)

### Community 61 - "fixtures.ts"
Cohesion: 0.14
Nodes (9): DBS_VALID, assertSeeded(), checkSeededMarker(), countStore(), seedInBrowser(), seedWorkspace(), STORE_NAMES, waitForBoot() (+1 more)

### Community 62 - "formatter"
Cohesion: 0.25
Nodes (8): formatter, attributePosition, enabled, formatWithErrors, indentStyle, indentWidth, lineEnding, lineWidth

### Community 63 - "Records"
Cohesion: 0.32
Nodes (8): Allocator, Budgets, Categories, Dashboard, Statement-allocation-record model, Monthly Budgets, Records, Statement importer

### Community 64 - "Validation rule (ValidationError + Validator)"
Cohesion: 0.50
Nodes (4): Old Laravel Api/*Controller mapping, Laravel-shaped { field: string[] } error maps, ValidationError, Validator

### Community 65 - "Domain docs (single-context layout)"
Cohesion: 0.33
Nodes (7): Agent skills, CONTEXT.md, Domain docs (single-context layout), Domain Language, Issue tracker (local specs and tickets), .scratch/ local work tracking, String primary keys (not auto-increment)

### Community 66 - "auto-sync.test.ts"
Cohesion: 0.18
Nodes (7): drive, listeners, nav, realDrive, realSync, timers, win

### Community 67 - "next"
Cohesion: 0.21
Nodes (12): nextConfig, next, amountTone(), formatRowTime(), StatementActions(), StatementActionsCell(), StatementAmount(), StatementBadges() (+4 more)

### Community 68 - "tsconfig.e2e.json"
Cohesion: 0.29
Nodes (6): ./tsconfig.json, compilerOptions, incremental, exclude, extends, include

### Community 69 - "style"
Cohesion: 0.33
Nodes (6): style, noNamespace, noNonNullAssertion, useArrayLiterals, useAsConstAssertion, useBlockStatements

### Community 70 - "drive-sync.ts"
Cohesion: 0.33
Nodes (15): downloadBackupFile(), driveFetch(), findBackupFile(), getClockSkewMs(), getFileMeta(), uploadBackupFile(), SEED_HASH_KEY, baselineHash() (+7 more)

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

### Community 94 - "alert-dialog.tsx"
Cohesion: 0.34
Nodes (12): DriveOverwriteConfirmation(), AlertDialog(), AlertDialogAction(), AlertDialogCancel(), AlertDialogContent(), AlertDialogDescription(), AlertDialogFooter(), AlertDialogHeader() (+4 more)

### Community 95 - "app.tsx"
Cohesion: 0.38
Nodes (4): App(), HarnessSection, sectionFromLocation(), root

### Community 96 - "(month)/layout.tsx"
Cohesion: 0.23
Nodes (11): MonthLayout(), react-dom, MonthHeaderPortal(), MonthHeaderSlot, MonthHeaderSlotProvider, MonthHeaderSlots, useMonthParams(), armMonthTransition() (+3 more)

### Community 97 - "auto-sync.ts"
Cohesion: 0.12
Nodes (33): SYNC_TABLES, isDriveConfigured(), useSyncStatus(), armPushTimer(), cycle(), emit(), eventListeners, exclusive() (+25 more)

### Community 98 - "STYLE.md"
Cohesion: 0.17
Nodes (13): APIs, Arguments, And Props, Code Style, Consistency, Copy, Core, Earning Its Place, Finpoint Style Additions, Grouping And Order (+5 more)

### Community 99 - "core/editors.e2e.ts"
Cohesion: 0.15
Nodes (3): editors, longName, select()

### Community 100 - "radix-ui"
Cohesion: 0.17
Nodes (13): class-variance-authority, radix-ui, AppHeader(), ButtonGroup(), ButtonGroupSeparator(), ButtonGroupText(), buttonGroupVariants, FieldSeparator() (+5 more)

### Community 101 - "icon.tsx"
Cohesion: 0.25
Nodes (9): DynamicUiIcon(), ICON_NAMES, iconNameSet, loadedIcons, loadIcon(), loadingIcons, normalize(), preloadCategoryIcons() (+1 more)

### Community 102 - "playwright.config.ts"
Cohesion: 0.33
Nodes (3): desktopOnly, APP_URL, HARNESS_URL

## Knowledge Gaps
- **84 isolated node(s):** `@fontsource-variable/inter`, `shadcn`, `tailwindcss`, `tw-animate-css`, `@biomejs/biome` (+79 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 658 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **10 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `cn()` connect `cn` to `react`, `(month)/page.tsx`, `duplicates/page.tsx`, `trend-chart.tsx`, `lib/motion.ts`, `importer/page.tsx`, `icon.tsx`, `combobox.tsx`, `utils.ts`, `Button`, `spending-calendar.tsx`, `displays.tsx`, `primitives.tsx`, `allocator/page.tsx`, `app-sidebar.tsx`, `sync/page.tsx`, `record-columns.tsx`, `pagination.tsx`, `themeColor`, `category-filter.tsx`, `lucide-react`, `next`, `alert-dialog.tsx`, `radix-ui`, `icon.tsx`?**
  _High betweenness centrality (0.101) - this node is a cross-community bridge._
- **What connects `@fontsource-variable/inter`, `shadcn`, `tailwindcss` to the rest of the system?**
  _84 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `dashboard.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.13229018492176386 - nodes in this community are weakly interconnected._
- **Why does `react` connect `react` to `(month)/page.tsx`, `duplicates/page.tsx`, `cn`, `trend-chart.tsx`, `lib/motion.ts`, `importer/page.tsx`, `icon.tsx`, `combobox.tsx`, `utils.ts`, `Button`, `package.json`, `spending-calendar.tsx`, `displays.tsx`, `primitives.tsx`, `allocator/page.tsx`, `app-sidebar.tsx`, `sync/page.tsx`, `record-columns.tsx`, `pagination.tsx`, `category-filter.tsx`, `lucide-react`, `next`, `alert-dialog.tsx`, `app.tsx`, `(month)/layout.tsx`, `auto-sync.ts`, `radix-ui`, `icon.tsx`?**
  _High betweenness centrality (0.069) - this node is a cross-community bridge._
- **Should `react` be split into smaller, more focused modules?**
  _Cohesion score 0.06019533585808252 - nodes in this community are weakly interconnected._
- **Why does `src/data/* (persistence, migrations, seeding, backup serialization, Drive storage)` connect `src/data/* (persistence, migrations, seeding, backup serialization, Drive storage)` to `app-sidebar.tsx`?**
  _High betweenness centrality (0.061) - this node is a cross-community bridge._
- **Should `data.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.12318840579710146 - nodes in this community are weakly interconnected._