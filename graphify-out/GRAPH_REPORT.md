# Graph Report - t3-69efe8e6  (2026-11-07)

## Corpus Check
- 254 files · ~235,998 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 9 file(s) not represented in the graph (top: (none) 5, .example 1, .lock 1)

## Summary
- 1957 nodes · 7809 edges · 103 communities (92 shown, 11 thin omitted)
- Extraction: 98% EXTRACTED · 2% INFERRED · 0% AMBIGUOUS · INFERRED: 126 edges (avg confidence: 0.84)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `3609d851`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- primitives.tsx
- Button
- monthly-budgets.test.ts
- Tests README
- suggestions.ts
- app/layout.tsx
- cn
- importer.ts
- core/charts.e2e.ts
- importer/page.tsx
- budgets/page.tsx
- compilerOptions
- editors.ts
- app-sidebar.tsx
- budgets/[id]/page.tsx
- collectTests
- dependencies
- db.ts
- statements.ts
- use-appearance.tsx
- STYLE.md
- records.ts
- Validator
- suspicious
- package.json
- ledger.e2e.ts
- correctness
- dashboard.ts
- core/components.e2e.ts
- auto-sync.ts
- support/motion.ts
- core/routes.e2e.ts
- alert-dialog.tsx
- src/data/* (persistence, migrations, seeding, backup serialization, Drive storage)
- test-data.ts
- components.json
- fixtures.ts
- next
- useHistory
- types.d.ts
- Monthly Budget
- auth-vault.ts
- history.tsx
- vite.config.ts
- src/components/*
- duplicates.ts
- navigation.e2e.ts
- formatter
- devDependencies
- pagination.tsx
- utils.ts
- Commands
- Next.js agent rules block ("This is NOT the Next.js you know")
- luxon
- spending-calendar.tsx
- biome.json
- rules
- manifest.json
- providers.tsx
- scripts
- icon.tsx
- 0002 Forecast pacing
- formatter
- Records
- export-import.ts
- IndexedDB (Dexie)
- optionalDependencies
- (month)/page.tsx
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
- statement-rules.ts
- PrimitivesSection
- category-filter.tsx
- hashSnapshot
- lucide-react
- workflows.e2e.ts
- trend-chart.tsx
- use-sync-status.ts
- Forecast pacing decision

## God Nodes (most connected - your core abstractions)
1. `cn()` - 324 edges
2. `PrimitivesSection()` - 181 edges
3. `Button()` - 126 edges
4. `react` - 97 edges
5. `formatCurrency()` - 75 edges
6. `RecordEditorDialog()` - 63 edges
7. `RecordCreatorDialog()` - 58 edges
8. `UiIcon()` - 56 edges
9. `round2()` - 45 edges
10. `next` - 43 edges

## Surprising Connections (you probably didn't know these)
- `Finpoint Style Additions` --references--> `useApiFormErrors()`  [INFERRED]
  STYLE.md → src/hooks/use-api-form-errors.ts
- `Copy` --references--> `pluralize()`  [INFERRED]
  STYLE.md → src/lib/utils.ts
- `Finpoint Style Additions` --references--> `ValidationError`  [INFERRED]
  STYLE.md → src/logic/validate.ts
- `Boot()` --indirect_call--> `preloadCategoryIcons()`  [INFERRED]
  app/providers.tsx → src/components/icon.tsx
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

## Communities (103 total, 11 thin omitted)

### Community 0 - "primitives.tsx"
Cohesion: 0.10
Nodes (38): Providers(), AppearanceSwitch(), FieldSet(), Label(), PopoverHeader(), SheetClose(), SidebarContent(), SidebarContext (+30 more)

### Community 1 - "Button"
Cohesion: 0.07
Nodes (114): CandidateResults(), CategoriesPage(), CategoryDialogState, CategoryTile(), SECTIONS, sonner, @tanstack/react-form, AccountDialog() (+106 more)

### Community 2 - "monthly-budgets.test.ts"
Cohesion: 0.12
Nodes (11): dexie, fake-indexeddb, xlsx, input, legacyPaceKey, today, decided(), live() (+3 more)

### Community 3 - "Tests README"
Cohesion: 0.06
Nodes (41): Build harness step (vite build tests/harness), Playwright browser cache keyed on bun.lock, blob report merge, Committed graph artifacts (graph.json, GRAPH_REPORT.md, manifest.json, .graphify_labels.json), Graph health warnings and refresh failure reporting, graphify-out/graph.json, graphify skill (--update), graphify update . (+33 more)

### Community 4 - "suggestions.ts"
Cohesion: 0.11
Nodes (31): allocatedStatements(), asOf(), byDate(), CHIP_LIMIT, CHOICES, Clue, DEFAULT_WEIGHTS, descriptionTokens() (+23 more)

### Community 5 - "app/layout.tsx"
Cohesion: 0.25
Nodes (5): metadata, RootLayout(), viewport, react-dom, root

### Community 6 - "cn"
Cohesion: 0.09
Nodes (36): class-variance-authority, radix-ui, AppHeader(), AlertAction(), ButtonGroup(), ButtonGroupSeparator(), ButtonGroupText(), buttonGroupVariants (+28 more)

### Community 7 - "importer.ts"
Cohesion: 0.29
Nodes (16): ensureAccount(), combine(), dbsDescriptionKey(), debitCreditAmount(), descriptionKey(), importDbs(), importOcbc(), ImportResult (+8 more)

### Community 8 - "core/charts.e2e.ts"
Cohesion: 0.22
Nodes (6): cardTitles, card(), chartTooltip, overview, overviewCharts, themedRgb()

### Community 9 - "importer/page.tsx"
Cohesion: 0.18
Nodes (33): ACCEPT, BANKS_REQUIRING_ADDITIONAL_INFO, ImporterPage(), Step(), EmptyRecords(), metadata, PrivacyPage(), SECTIONS (+25 more)

### Community 10 - "budgets/page.tsx"
Cohesion: 0.13
Nodes (38): BUDGET_STATES, BudgetCard(), BudgetsPage(), formatBudgetDateWindow(), framer-motion, @tanstack/react-table, DataTable(), PaginatedDataTable() (+30 more)

### Community 11 - "compilerOptions"
Cohesion: 0.06
Nodes (33): compilerOptions, allowJs, allowSyntheticDefaultImports, allowUnusedLabels, esModuleInterop, forceConsistentCasingInFileNames, incremental, isolatedModules (+25 more)

### Community 12 - "editors.ts"
Cohesion: 0.13
Nodes (21): editors, containedFooter(), editors, longName, expectHeldRead(), expectRetainedRows(), expectSilentSheet(), expectPointerCursor() (+13 more)

### Community 13 - "app-sidebar.tsx"
Cohesion: 0.20
Nodes (25): ReviewLinks(), AppearanceOption, APPEARANCES, AppSidebar(), SyncDot(), SYSTEM_APPEARANCE, useSyncIndicator(), TITLES (+17 more)

### Community 14 - "budgets/[id]/page.tsx"
Cohesion: 0.12
Nodes (32): BudgetPage(), getBudgetAnalytics(), getCategoryData(), Legend(), MonthlyRecordsPage(), BudgetProgressChart(), BudgetProgressPoint, buildSeries() (+24 more)

### Community 15 - "collectTests"
Cohesion: 0.28
Nodes (16): collectTests(), conditionBranch(), detailsTags(), disabled(), mentionsMotion(), record(), splitTestCallee(), tagValues() (+8 more)

### Community 16 - "dependencies"
Cohesion: 0.07
Nodes (30): dependencies, @base-ui/react, class-variance-authority, clsx, cmdk, dexie, dexie-react-hooks, @fontsource-variable/inter (+22 more)

### Community 17 - "db.ts"
Cohesion: 0.10
Nodes (30): AccountRow, AllocationRow, AnalyticsMonthRow, BudgetRecordRow, BudgetRow, CategoryRow, DB_NAME, DB_VERSION (+22 more)

### Community 18 - "statements.ts"
Cohesion: 0.13
Nodes (30): asPending(), removeStatementDismissals(), readFile(), dayDifference(), ensureCanReplace(), maskDescription(), ReplacementAllocation, replacementComparison() (+22 more)

### Community 19 - "use-appearance.tsx"
Cohesion: 0.26
Nodes (14): Appearance, applyAppearance(), getStoredAppearance(), handleSystemThemeChange(), initializeAppearance(), isDarkMode(), listeners, mediaQuery() (+6 more)

### Community 20 - "STYLE.md"
Cohesion: 0.13
Nodes (17): Old Laravel Api/*Controller mapping, Laravel-shaped { field: string[] } error maps, ValidationError, Validator, APIs, Arguments, And Props, Code Style, Consistency, Copy (+9 more)

### Community 21 - "records.ts"
Cohesion: 0.12
Nodes (28): round2(), BudgetDetail, BudgetFilters, getBudget(), duplicateStatementIds(), AllocationTally, isPendingRecord(), pendingStatementIds() (+20 more)

### Community 22 - "Validator"
Cohesion: 0.23
Nodes (21): updateAccount(), createBudget(), validateBudget(), cleanInput(), dismissDuplicatePair(), eligible(), fixDuplicates(), restoreDuplicatePair() (+13 more)

### Community 23 - "suspicious"
Cohesion: 0.07
Nodes (28): suspicious, noAssignInExpressions, noAsyncPromiseExecutor, noCatchAssign, noClassAssign, noCompareNegZero, noControlCharactersInRegex, noDebugger (+20 more)

### Community 24 - "package.json"
Cohesion: 0.06
Nodes (30): private, $schema, type, babel-plugin-react-compiler, @biomejs/biome, clsx, cmdk, @fontsource-variable/inter (+22 more)

### Community 25 - "ledger.e2e.ts"
Cohesion: 0.11
Nodes (25): behaviourCoverage, componentInventory, facetNotApplicable, InventoryEntry, modalAnimationCoverage, notApplicable, openFacets, RouteEntry (+17 more)

### Community 26 - "correctness"
Cohesion: 0.08
Nodes (26): noConstantCondition, noConstAssign, noEmptyCharacterClassInRegex, noEmptyPattern, noGlobalObjectCalls, noInvalidBuiltinInstantiation, noInvalidConstructorSuper, noNonoctalDecimalEscape (+18 more)

### Community 27 - "dashboard.ts"
Cohesion: 0.15
Nodes (33): AnalyticsRecord, AnalyticsSummary, contribution(), summarize(), avg(), buildCashflowHistory(), buildCategories(), buildComparison() (+25 more)

### Community 28 - "core/components.e2e.ts"
Cohesion: 0.15
Nodes (9): desktopOnly, bounds(), contained(), expectWheelScrollsPageWhileOpen(), expectDropdownPreservesScroll(), scrollWithInput(), settledOverlayAlpha(), APP_URL (+1 more)

### Community 29 - "auto-sync.ts"
Cohesion: 0.10
Nodes (50): SYNC_TABLES, AuthNeededError, cacheToken(), CodeResponse, disconnectDrive(), downloadBackupFile(), driveFetch(), DriveFileMeta (+42 more)

### Community 30 - "support/motion.ts"
Cohesion: 0.16
Nodes (21): denseCardConsumers, denseRowConsumers, expectConsumerEntrance(), populatedConsumers, pickOption(), attachSamplingFailure(), expectModalEntrance(), expectModalExit() (+13 more)

### Community 31 - "core/routes.e2e.ts"
Cohesion: 0.17
Nodes (14): @playwright/test, Child, october, september, PREMATURE, routeReady, titles, IDS (+6 more)

### Community 32 - "alert-dialog.tsx"
Cohesion: 0.34
Nodes (12): DriveOverwriteConfirmation(), AlertDialog(), AlertDialogAction(), AlertDialogCancel(), AlertDialogContent(), AlertDialogDescription(), AlertDialogFooter(), AlertDialogHeader() (+4 more)

### Community 33 - "src/data/* (persistence, migrations, seeding, backup serialization, Drive storage)"
Cohesion: 0.18
Nodes (15): app/**/page.tsx, Background Drive sync, src/data/* (persistence, migrations, seeding, backup serialization, Drive storage), Interactive routes are "use client" (search params via next/navigation), src/logic/* (domain reads and operations), (month) route-group shell (Overview + Monthly Records), Pages take no props, Project Shape (+7 more)

### Community 34 - "test-data.ts"
Cohesion: 0.14
Nodes (19): DEFAULT_CATEGORIES, DEFAULT_MONTHLY_BUDGETS, EXPORT_VERSION, FinpointExport, SEED_HASH_KEY, BANK_BLURB, between(), CATEGORIES (+11 more)

### Community 35 - "components.json"
Cohesion: 0.09
Nodes (21): aliases, components, hooks, lib, ui, utils, iconLibrary, menuAccent (+13 more)

### Community 36 - "fixtures.ts"
Cohesion: 0.29
Nodes (10): getScenario(), assertSeeded(), checkSeededMarker(), countStore(), seedInBrowser(), seedWorkspace(), STORE_NAMES, test (+2 more)

### Community 37 - "next"
Cohesion: 0.24
Nodes (11): MonthLayout(), NotFound(), Template(), nextConfig, next, ShellHeader(), SearchInit, useMonthParams() (+3 more)

### Community 38 - "useHistory"
Cohesion: 0.14
Nodes (26): CashflowChart(), CashflowPoint, aggregateSeries(), CategoryHistoryChart(), ChartMonth, ChartSeries, MonthBreakdown(), MonthTick() (+18 more)

### Community 39 - "types.d.ts"
Cohesion: 0.10
Nodes (20): Account, Allocation, AnalyticsSummary, AnalyticsTreatment, Appearance, Budget, Category, CategoryWithChildren (+12 more)

### Community 40 - "Monthly Budget"
Cohesion: 0.18
Nodes (16): CONTEXT.md (domain vocabulary), Account, Allocation, Budget, Category, Duplicate Statement, Finpoint Domain Glossary, Monthly Budget (+8 more)

### Community 41 - "auth-vault.ts"
Cohesion: 0.32
Nodes (13): POST(), POST(), POST(), AUTH_COOKIE_NAME, authCookie(), authCookieConfig(), clientIp(), encryptionKey() (+5 more)

### Community 42 - "history.tsx"
Cohesion: 0.39
Nodes (7): getStoredHistory(), getValidHistory(), HistoryContext, HistoryItem, HistoryProvider(), normaliseUrl(), withoutTrailingSelf()

### Community 43 - "vite.config.ts"
Cohesion: 0.29
Nodes (4): vite, @vitejs/plugin-react, harnessDir, repoRoot

### Community 44 - "src/components/*"
Cohesion: 0.25
Nodes (5): Agent Behavior, Generated / Ignored Files, src/components/*, src/components/ui/**/*, useLiveQuery

### Community 45 - "duplicates.ts"
Cohesion: 0.27
Nodes (11): descriptionAnchors(), descriptionIdentity(), DuplicateGroup, duplicateGroups(), DuplicateStatement, FixDuplicatesInput, GENERIC, pairIds() (+3 more)

### Community 47 - "formatter"
Cohesion: 0.15
Nodes (13): arrowParentheses, bracketSameLine, bracketSpacing, jsxQuoteStyle, quoteProperties, quoteStyle, semicolons, trailingCommas (+5 more)

### Community 48 - "devDependencies"
Cohesion: 0.15
Nodes (13): devDependencies, babel-plugin-react-compiler, @biomejs/biome, fake-indexeddb, @playwright/test, @tailwindcss/postcss, @types/luxon, @types/node (+5 more)

### Community 49 - "pagination.tsx"
Cohesion: 0.38
Nodes (11): pageHref(), pageWindow(), PaginationFooter(), Pagination(), PaginationContent(), PaginationEllipsis(), PaginationItem(), PaginationLink() (+3 more)

### Community 50 - "utils.ts"
Cohesion: 0.15
Nodes (36): PendingCard(), react, AllocateBar(), Amount(), RecordAmount(), PendingStatementConfirmationSheet(), RecordOption(), RecordSearchSheet() (+28 more)

### Community 51 - "Commands"
Cohesion: 0.38
Nodes (7): Biome (biome check --write), bun install, bun lint (write-mode), bun lint:check, bun run build, bun types:check, Commands

### Community 52 - "Next.js agent rules block ("This is NOT the Next.js you know")"
Cohesion: 0.25
Nodes (6): app/api/auth/* Route Handlers, node_modules/next/dist/server/lib/generate-agent-files.js, Google OAuth broker (exchange/token/logout), Next.js App Router app (mostly client-side), node_modules/next/dist/docs/, npm run dev (port 5173)

### Community 53 - "luxon"
Cohesion: 0.18
Nodes (18): BudgetState, luxon, react-day-picker, DateField(), Props, DateRangeValue, formatRange(), Props (+10 more)

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

### Community 58 - "providers.tsx"
Cohesion: 0.39
Nodes (7): Boot(), seedIfEmpty(), useSyncToasts(), markDirty(), startAutoSync(), subscribeSyncEvents(), listCategoryIconNames()

### Community 59 - "scripts"
Cohesion: 0.22
Nodes (9): scripts, build, dev, lint, lint:check, start, test:e2e, types:check (+1 more)

### Community 60 - "icon.tsx"
Cohesion: 0.10
Nodes (31): AccountCard(), AccountRow, AccountsPage(), Rule, RuleSentence(), StatementRulesPage(), Sparkline(), RuleSuggestions() (+23 more)

### Community 61 - "0002 Forecast pacing"
Cohesion: 0.33
Nodes (5): 0002 Forecast pacing, Consequences, Context, Decision, Rejected option

### Community 62 - "formatter"
Cohesion: 0.25
Nodes (8): formatter, attributePosition, enabled, formatWithErrors, indentStyle, indentWidth, lineEnding, lineWidth

### Community 63 - "Records"
Cohesion: 0.32
Nodes (8): Allocator, Budgets, Categories, Dashboard, Statement-allocation-record model, Monthly Budgets, Records, Statement importer

### Community 64 - "export-import.ts"
Cohesion: 0.18
Nodes (19): db, clearAllData(), downloadExport(), exportData(), importData(), monthlyBudgetFields(), parseImportFile(), tableCounts() (+11 more)

### Community 65 - "IndexedDB (Dexie)"
Cohesion: 0.20
Nodes (11): Agent skills, bun test, CONTEXT.md, IndexedDB (Dexie), Domain docs (single-context layout), Domain Language, Domain and importer tests (Dexie with in-memory IndexedDB), Issue tracker (local specs and tickets) (+3 more)

### Community 66 - "optionalDependencies"
Cohesion: 0.29
Nodes (7): optionalDependencies, lightningcss-linux-x64-gnu, lightningcss-win32-x64-msvc, @rollup/rollup-linux-x64-gnu, @rollup/rollup-win32-x64-msvc, @tailwindcss/oxide-linux-x64-gnu, @tailwindcss/oxide-win32-x64-msvc

### Community 67 - "(month)/page.tsx"
Cohesion: 0.13
Nodes (25): Comparison, comparisonRateText(), comparisonText(), ComparisonValue, DashboardData, DashboardMonthlyBudget, DashboardPage(), DashboardView (+17 more)

### Community 68 - "tsconfig.e2e.json"
Cohesion: 0.29
Nodes (6): ./tsconfig.json, compilerOptions, incremental, exclude, extends, include

### Community 69 - "style"
Cohesion: 0.33
Nodes (6): style, noNamespace, noNonNullAssertion, useArrayLiterals, useAsConstAssertion, useBlockStatements

### Community 70 - "duplicates/page.tsx"
Cohesion: 0.15
Nodes (53): AccountPage(), CARD_MOTION, DuplicateGroupCard(), FixDuplicatesPage(), GroupHeader(), highlightDifferences(), VIEWS, AllocatorPage() (+45 more)

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

### Community 94 - "statement-rules.ts"
Cohesion: 0.20
Nodes (14): byCreation(), conditionPattern(), deleteStatementRule(), listStatementRules(), matchesStatement(), NAME_ORDER, previewStatementRule(), recommendationAutofill() (+6 more)

### Community 95 - "PrimitivesSection"
Cohesion: 0.22
Nodes (16): DropdownMenu(), DropdownMenuCheckboxItem(), DropdownMenuContent(), DropdownMenuGroup(), DropdownMenuItem(), DropdownMenuLabel(), DropdownMenuPortal(), DropdownMenuRadioGroup() (+8 more)

### Community 96 - "category-filter.tsx"
Cohesion: 0.33
Nodes (11): CategoryFilter(), CategoryFilterItem(), Command(), CommandEmpty(), CommandGroup(), CommandInput(), CommandItem(), CommandList() (+3 more)

### Community 97 - "hashSnapshot"
Cohesion: 0.23
Nodes (7): FinpointDB, withoutActionModes(), migrateRecordChoices(), digestSnapshot(), hashLegacySnapshot(), hashSnapshot(), Snapshot

### Community 98 - "lucide-react"
Cohesion: 0.22
Nodes (9): lucide-react, buttonVariants, ButtonVariant, Month, MonthCal(), MonthCalProps, MonthPicker(), MONTHS (+1 more)

### Community 100 - "trend-chart.tsx"
Cohesion: 0.16
Nodes (19): bar(), BarChart(), BarSeries, PAD, ChartFrame(), ChartSize, ReadoutRows(), arc() (+11 more)

### Community 101 - "use-sync-status.ts"
Cohesion: 0.60
Nodes (4): useSyncStatus(), getSyncSnapshot(), subscribeSync(), SyncSnapshot

### Community 102 - "Forecast pacing decision"
Cohesion: 0.67
Nodes (3): Forecast pacing decision, Remaining historical spending scaled by remaining days, Median daily spending fallback including zero days

## Knowledge Gaps
- **85 isolated node(s):** `@fontsource-variable/inter`, `shadcn`, `tailwindcss`, `tw-animate-css`, `@biomejs/biome` (+80 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 600 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **11 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `cn()` connect `cn` to `primitives.tsx`, `Button`, `importer/page.tsx`, `budgets/page.tsx`, `app-sidebar.tsx`, `budgets/[id]/page.tsx`, `alert-dialog.tsx`, `next`, `useHistory`, `pagination.tsx`, `utils.ts`, `luxon`, `spending-calendar.tsx`, `icon.tsx`, `(month)/page.tsx`, `duplicates/page.tsx`, `combobox.tsx`, `PrimitivesSection`, `category-filter.tsx`, `lucide-react`, `trend-chart.tsx`?**
  _High betweenness centrality (0.099) - this node is a cross-community bridge._
- **What connects `@fontsource-variable/inter`, `shadcn`, `tailwindcss` to the rest of the system?**
  _85 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `primitives.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.09523809523809523 - nodes in this community are weakly interconnected._
- **Why does `src/data/* (persistence, migrations, seeding, backup serialization, Drive storage)` connect `src/data/* (persistence, migrations, seeding, backup serialization, Drive storage)` to `IndexedDB (Dexie)`, `providers.tsx`?**
  _High betweenness centrality (0.080) - this node is a cross-community bridge._
- **Should `Button` be split into smaller, more focused modules?**
  _Cohesion score 0.0725095785440613 - nodes in this community are weakly interconnected._
- **Why does `react` connect `utils.ts` to `primitives.tsx`, `Button`, `app/layout.tsx`, `cn`, `importer/page.tsx`, `budgets/page.tsx`, `app-sidebar.tsx`, `budgets/[id]/page.tsx`, `use-appearance.tsx`, `package.json`, `alert-dialog.tsx`, `next`, `useHistory`, `history.tsx`, `pagination.tsx`, `luxon`, `spending-calendar.tsx`, `providers.tsx`, `icon.tsx`, `(month)/page.tsx`, `duplicates/page.tsx`, `combobox.tsx`, `PrimitivesSection`, `category-filter.tsx`, `lucide-react`, `trend-chart.tsx`, `use-sync-status.ts`?**
  _High betweenness centrality (0.073) - this node is a cross-community bridge._
- **Should `monthly-budgets.test.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.11692307692307692 - nodes in this community are weakly interconnected._