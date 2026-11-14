# Graph Report - t3-6b4fc13c-8de3ddf0f021ed8e  (2026-11-15)

## Corpus Check
- 269 files · ~243,759 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 9 file(s) not represented in the graph (top: (none) 5, .example 1, .lock 1)

## Summary
- 2019 nodes · 7996 edges · 104 communities (93 shown, 11 thin omitted)
- Extraction: 98% EXTRACTED · 2% INFERRED · 0% AMBIGUOUS · INFERRED: 136 edges (avg confidence: 0.84)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `e7fa8708`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- dashboard.ts
- react
- db.ts
- Tests README
- budgets/[id]/page.tsx
- primitives.tsx
- auth-vault.ts
- statements.ts
- @playwright/test
- ref_bun_test
- paginated-data-table.tsx
- compilerOptions
- editors.ts
- sidebar.tsx
- Validator
- sync/page.tsx
- dependencies
- utils.ts
- workflows.e2e.ts
- themeColor
- item.tsx
- cn
- records.ts
- suspicious
- package.json
- ledger.e2e.ts
- correctness
- suggestions.ts
- core/components.e2e.ts
- auto-sync.test.ts
- support/motion.ts
- core/routes.e2e.ts
- statement-rules.ts
- UI layer (app pages + components)
- export-import.ts
- components.json
- app-sidebar.tsx
- auto-sync.ts
- transaction-checks.test.ts
- types.d.ts
- STYLE.md
- category-history-chart.tsx
- scripts
- ValidationError
- test-data.ts
- providers.tsx
- navigation.e2e.ts
- formatter
- devDependencies
- pagination.tsx
- Button
- Commands
- Next.js agent rules block ("This is NOT the Next.js you know")
- spending-calendar.tsx
- optionalDependencies
- biome.json
- rules
- manifest.json
- suggestions.test.ts
- icon.tsx
- (month)/page.tsx
- lib/motion.ts
- formatter
- Records
- Validation rule (ValidationError + Validator)
- Domain docs (single-context layout)
- luxon
- trend-chart.tsx
- tsconfig.e2e.json
- style
- core/editors.e2e.ts
- importer/page.tsx
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
- src/components/*
- use-appearance.tsx
- fixtures.ts
- src/data/* (persistence, migrations, seeding, backup serialization, Drive storage)
- history.tsx
- monthly-budget-usage.tsx
- lucide-react
- app.tsx
- use-url-params.tsx

## God Nodes (most connected - your core abstractions)
1. `cn()` - 320 edges
2. `PrimitivesSection()` - 181 edges
3. `Button()` - 123 edges
4. `react` - 99 edges
5. `formatCurrency()` - 74 edges
6. `RecordEditorDialog()` - 62 edges
7. `RecordCreatorDialog()` - 59 edges
8. `UiIcon()` - 56 edges
9. `round2()` - 46 edges
10. `pluralize()` - 44 edges

## Surprising Connections (you probably didn't know these)
- `Finpoint Style Additions` --references--> `useApiFormErrors()`  [INFERRED]
  STYLE.md → src/hooks/use-api-form-errors.ts
- `Copy` --references--> `pluralize()`  [INFERRED]
  STYLE.md → src/lib/utils.ts
- `Finpoint Style Additions` --references--> `ValidationError`  [INFERRED]
  STYLE.md → src/logic/validate.ts
- `Boot()` --indirect_call--> `preloadCategoryIcons()`  [INFERRED]
  app/providers.tsx → src/components/icon.tsx
- `DataSettingsPage()` --indirect_call--> `syncDrive()`  [INFERRED]
  app/sync/page.tsx → src/logic/drive-sync.ts

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

## Communities (104 total, 11 thin omitted)

### Community 0 - "dashboard.ts"
Cohesion: 0.13
Nodes (36): AnalyticsRecord, AnalyticsSummary, contribution(), summarize(), avg(), buildCashflowHistory(), buildCategories(), buildComparison() (+28 more)

### Community 1 - "react"
Cohesion: 0.08
Nodes (101): @base-ui/react, react, sonner, @tanstack/react-form, AccountDialog(), BudgetCreatorDialog(), BudgetEditorDialog(), CategoryDialog() (+93 more)

### Community 2 - "db.ts"
Cohesion: 0.10
Nodes (31): AccountRow, AllocationRow, AnalyticsMonthRow, asPending(), BudgetRecordRow, BudgetRow, CategoryRow, DB_NAME (+23 more)

### Community 3 - "Tests README"
Cohesion: 0.06
Nodes (41): Build harness step (vite build tests/harness), Playwright browser cache keyed on bun.lock, blob report merge, Committed graph artifacts (graph.json, GRAPH_REPORT.md, manifest.json, .graphify_labels.json), Graph health warnings and refresh failure reporting, graphify-out/graph.json, graphify skill (--update), graphify update . (+33 more)

### Community 4 - "budgets/[id]/page.tsx"
Cohesion: 0.23
Nodes (28): BudgetPage(), Legend(), ImporterPage(), metadata, PrivacyPage(), SECTIONS, RecordPage(), learnedSignals() (+20 more)

### Community 5 - "primitives.tsx"
Cohesion: 0.11
Nodes (41): ComboboxChip(), ComboboxChips(), ComboboxChipsInput(), ComboboxCollection(), ComboboxContent(), ComboboxEmpty(), ComboboxGroup(), ComboboxItem() (+33 more)

### Community 6 - "auth-vault.ts"
Cohesion: 0.29
Nodes (14): POST(), POST(), POST(), jose, AUTH_COOKIE_NAME, authCookie(), authCookieConfig(), clientIp() (+6 more)

### Community 7 - "statements.ts"
Cohesion: 0.10
Nodes (40): descriptionAnchors(), descriptionIdentity(), DuplicateGroup, DuplicateStatement, duplicateStatementIds(), eligible(), FixDuplicatesInput, GENERIC (+32 more)

### Community 8 - "@playwright/test"
Cohesion: 0.23
Nodes (7): @playwright/test, cardTitles, card(), chartTooltip, overview, overviewCharts, themedRgb()

### Community 9 - "ref_bun_test"
Cohesion: 0.12
Nodes (4): dexie, fake-indexeddb, xlsx, input

### Community 10 - "paginated-data-table.tsx"
Cohesion: 0.22
Nodes (25): @tanstack/react-table, DataTable(), PaginatedDataTable(), GroupHeaderRow(), groupStarts(), GroupTotal(), isInteractiveTarget(), LeavingRows() (+17 more)

### Community 11 - "compilerOptions"
Cohesion: 0.06
Nodes (33): compilerOptions, allowJs, allowSyntheticDefaultImports, allowUnusedLabels, esModuleInterop, forceConsistentCasingInFileNames, incremental, isolatedModules (+25 more)

### Community 12 - "editors.ts"
Cohesion: 0.15
Nodes (14): editors, expectHeldRead(), expectRetainedRows(), expectSilentSheet(), account, budget, chooseCategory(), deleted (+6 more)

### Community 13 - "sidebar.tsx"
Cohesion: 0.11
Nodes (29): AppearanceSwitch(), AppSidebar(), Sidebar(), SidebarContent(), SidebarContext, SidebarContextProps, SidebarFooter(), SidebarGroup() (+21 more)

### Community 14 - "Validator"
Cohesion: 0.25
Nodes (18): updateAccount(), validateBudget(), cleanInput(), dismissDuplicatePair(), fixDuplicates(), pairIds(), restoreDuplicatePair(), createMonthlyBudget() (+10 more)

### Community 15 - "sync/page.tsx"
Cohesion: 0.26
Nodes (12): COUNT_ROWS, DataSettingsPage(), MethodHeader(), StateRow(), STATUS_TONES, StatusTone, WorkspaceRow(), wasVaultProven() (+4 more)

### Community 16 - "dependencies"
Cohesion: 0.07
Nodes (30): dependencies, @base-ui/react, class-variance-authority, clsx, cmdk, dexie, dexie-react-hooks, @fontsource-variable/inter (+22 more)

### Community 17 - "utils.ts"
Cohesion: 0.06
Nodes (122): AccountPage(), CARD_MOTION, DuplicateGroupCard(), FixDuplicatesPage(), GroupHeader(), highlightDifferences(), VIEWS, AllocatorPage() (+114 more)

### Community 19 - "themeColor"
Cohesion: 0.18
Nodes (16): CashflowChart(), CashflowPoint, CategoryMovers(), Mover, CategorySpendingMix(), DailySpendingChart(), MonthlyBudgetLine, SurplusPoint (+8 more)

### Community 20 - "item.tsx"
Cohesion: 0.11
Nodes (23): class-variance-authority, radix-ui, AppHeader(), ButtonGroup(), ButtonGroupSeparator(), ButtonGroupText(), buttonGroupVariants, FieldSeparator() (+15 more)

### Community 21 - "cn"
Cohesion: 0.13
Nodes (31): CategoryFilter(), CategoryFilterItem(), AlertAction(), ComboboxClear(), ComboboxInput(), ComboboxTrigger(), Command(), CommandEmpty() (+23 more)

### Community 22 - "records.ts"
Cohesion: 0.13
Nodes (25): flagParam(), listParam(), looseFlagParam(), numberParam(), ParamSource, textParam(), MonthlyFilters, parseMonthlyFilters() (+17 more)

### Community 23 - "suspicious"
Cohesion: 0.07
Nodes (28): suspicious, noAssignInExpressions, noAsyncPromiseExecutor, noCatchAssign, noClassAssign, noCompareNegZero, noControlCharactersInRegex, noDebugger (+20 more)

### Community 24 - "package.json"
Cohesion: 0.07
Nodes (28): private, $schema, type, babel-plugin-react-compiler, @biomejs/biome, clsx, cmdk, @fontsource-variable/inter (+20 more)

### Community 25 - "ledger.e2e.ts"
Cohesion: 0.07
Nodes (46): typescript, vite, @vitejs/plugin-react, behaviourCoverage, componentInventory, facetNotApplicable, InventoryEntry, modalAnimationCoverage (+38 more)

### Community 26 - "correctness"
Cohesion: 0.08
Nodes (26): noConstantCondition, noConstAssign, noEmptyCharacterClassInRegex, noEmptyPattern, noGlobalObjectCalls, noInvalidBuiltinInstantiation, noInvalidConstructorSuper, noNonoctalDecimalEscape (+18 more)

### Community 27 - "suggestions.ts"
Cohesion: 0.10
Nodes (37): allocatedStatements(), asOf(), byDate(), CHIP_LIMIT, CHOICES, Clue, createModel(), DEFAULT_WEIGHTS (+29 more)

### Community 28 - "core/components.e2e.ts"
Cohesion: 0.15
Nodes (9): desktopOnly, bounds(), contained(), expectWheelScrollsPageWhileOpen(), expectDropdownPreservesScroll(), scrollWithInput(), settledOverlayAlpha(), APP_URL (+1 more)

### Community 29 - "auto-sync.test.ts"
Cohesion: 0.18
Nodes (7): drive, listeners, nav, realDrive, realSync, timers, win

### Community 30 - "support/motion.ts"
Cohesion: 0.26
Nodes (13): expectVisibleBackdrop(), attachSamplingFailure(), expectModalEntrance(), expectModalExit(), expectPopupEntrance(), matrixIsIdentity(), MotionFrame, MotionPose (+5 more)

### Community 31 - "core/routes.e2e.ts"
Cohesion: 0.12
Nodes (23): denseCardConsumers, denseRowConsumers, expectConsumerEntrance(), populatedConsumers, Child, october, september, PREMATURE (+15 more)

### Community 32 - "statement-rules.ts"
Cohesion: 0.20
Nodes (14): TREATMENT_VALUES, byCreation(), conditionPattern(), deleteStatementRule(), listStatementRules(), matchesStatement(), NAME_ORDER, previewStatementRule() (+6 more)

### Community 33 - "UI layer (app pages + components)"
Cohesion: 0.22
Nodes (11): app/**/page.tsx, Interactive routes are "use client" (search params via next/navigation), (month) route-group shell (Overview + Monthly Records), Pages take no props, Project Shape, React Compiler (enabled), Root Suspense (keeps routes static), src/routes.ts (centralized route paths) (+3 more)

### Community 34 - "export-import.ts"
Cohesion: 0.12
Nodes (30): db, FinpointDB, withoutActionModes(), clearAllData(), downloadExport(), exportData(), importData(), monthlyBudgetFields() (+22 more)

### Community 35 - "components.json"
Cohesion: 0.09
Nodes (21): aliases, components, hooks, lib, ui, utils, iconLibrary, menuAccent (+13 more)

### Community 36 - "app-sidebar.tsx"
Cohesion: 0.17
Nodes (21): NotFound(), nextConfig, next, AppearanceOption, APPEARANCES, SyncDot(), SYSTEM_APPEARANCE, useSyncIndicator() (+13 more)

### Community 37 - "auto-sync.ts"
Cohesion: 0.08
Nodes (60): SYNC_TABLES, AuthNeededError, cacheToken(), CodeResponse, disconnectDrive(), downloadBackupFile(), driveFetch(), DriveFileMeta (+52 more)

### Community 38 - "transaction-checks.test.ts"
Cohesion: 0.22
Nodes (3): HELD, raceGap(), reset()

### Community 39 - "types.d.ts"
Cohesion: 0.10
Nodes (20): Account, Allocation, AnalyticsSummary, AnalyticsTreatment, Appearance, Budget, Category, CategoryWithChildren (+12 more)

### Community 40 - "STYLE.md"
Cohesion: 0.09
Nodes (29): CONTEXT.md (domain vocabulary), Account, Allocation, Budget, Category, Duplicate Statement, Finpoint Domain Glossary, Monthly Budget (+21 more)

### Community 41 - "category-history-chart.tsx"
Cohesion: 0.24
Nodes (12): aggregateSeries(), CategoryHistoryChart(), ChartMonth, ChartSeries, MonthBreakdown(), MonthTick(), monthTotal(), prepareMonths() (+4 more)

### Community 42 - "scripts"
Cohesion: 0.22
Nodes (9): scripts, build, dev, lint, lint:check, start, test:e2e, types:check (+1 more)

### Community 43 - "ValidationError"
Cohesion: 0.26
Nodes (20): ensureAccount(), combine(), dbsDescriptionKey(), debitCreditAmount(), descriptionKey(), importDbs(), importFiles(), importOcbc() (+12 more)

### Community 44 - "test-data.ts"
Cohesion: 0.14
Nodes (18): DEFAULT_CATEGORIES, DEFAULT_MONTHLY_BUDGETS, EXPORT_VERSION, FinpointExport, BANK_BLURB, between(), CATEGORIES, DAILY (+10 more)

### Community 45 - "providers.tsx"
Cohesion: 0.25
Nodes (11): metadata, RootLayout(), viewport, Boot(), Providers(), ShellHeader(), SidebarInset(), SidebarProvider() (+3 more)

### Community 47 - "formatter"
Cohesion: 0.15
Nodes (13): arrowParentheses, bracketSameLine, bracketSpacing, jsxQuoteStyle, quoteProperties, quoteStyle, semicolons, trailingCommas (+5 more)

### Community 48 - "devDependencies"
Cohesion: 0.15
Nodes (13): devDependencies, babel-plugin-react-compiler, @biomejs/biome, fake-indexeddb, @playwright/test, @tailwindcss/postcss, @types/luxon, @types/node (+5 more)

### Community 49 - "pagination.tsx"
Cohesion: 0.38
Nodes (11): pageHref(), pageWindow(), PaginationFooter(), Pagination(), PaginationContent(), PaginationEllipsis(), PaginationItem(), PaginationLink() (+3 more)

### Community 50 - "Button"
Cohesion: 0.23
Nodes (16): BUDGET_STATES, BudgetCard(), BudgetsPage(), BudgetState, formatBudgetDateWindow(), CategoriesPage(), CategoryDialogState, CategoryTile() (+8 more)

### Community 51 - "Commands"
Cohesion: 0.38
Nodes (7): Biome (biome check --write), bun install, bun lint (write-mode), bun lint:check, bun run build, bun types:check, Commands

### Community 52 - "Next.js agent rules block ("This is NOT the Next.js you know")"
Cohesion: 0.25
Nodes (6): app/api/auth/* Route Handlers, node_modules/next/dist/server/lib/generate-agent-files.js, Google OAuth broker (exchange/token/logout), Next.js App Router app (mostly client-side), node_modules/next/dist/docs/, npm run dev (port 5173)

### Community 53 - "spending-calendar.tsx"
Cohesion: 0.29
Nodes (9): compact(), heat(), INK, LEVELS, quantile(), rampCap(), SpendingCalendar(), STRENGTH (+1 more)

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

### Community 58 - "suggestions.test.ts"
Cohesion: 0.53
Nodes (4): decided(), live(), record(), statement()

### Community 59 - "icon.tsx"
Cohesion: 0.18
Nodes (16): Rule, RuleSentence(), StatementRulesPage(), RuleSuggestions(), ruleValueLabel(), DynamicUiIcon(), ICON_NAMES, iconNameSet (+8 more)

### Community 60 - "(month)/page.tsx"
Cohesion: 0.11
Nodes (27): Comparison, comparisonRateText(), comparisonText(), ComparisonValue, DashboardData, DashboardMonthlyBudget, DashboardPage(), DashboardView (+19 more)

### Community 61 - "lib/motion.ts"
Cohesion: 0.19
Nodes (17): framer-motion, AllocateBar(), Sparkline(), DetailSummaryItem(), Delta, Metric(), RecordAmount(), ValueSwap() (+9 more)

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

### Community 66 - "luxon"
Cohesion: 0.17
Nodes (20): MonthLayout(), luxon, react-day-picker, DateField(), Props, DateRangeValue, formatRange(), Props (+12 more)

### Community 67 - "trend-chart.tsx"
Cohesion: 0.16
Nodes (18): bar(), BarChart(), BarSeries, PAD, BudgetProgressChart(), BudgetProgressPoint, buildSeries(), ChartFrame() (+10 more)

### Community 68 - "tsconfig.e2e.json"
Cohesion: 0.29
Nodes (6): ./tsconfig.json, compilerOptions, incremental, exclude, extends, include

### Community 69 - "style"
Cohesion: 0.33
Nodes (6): style, noNamespace, noNonNullAssertion, useArrayLiterals, useAsConstAssertion, useBlockStatements

### Community 70 - "core/editors.e2e.ts"
Cohesion: 0.13
Nodes (5): containedFooter(), editors, longName, expectPointerCursor(), select()

### Community 71 - "importer/page.tsx"
Cohesion: 0.20
Nodes (13): AccountCard(), AccountRow, AccountsPage(), ACCEPT, BANKS_REQUIRING_ADDITIONAL_INFO, Step(), dexie-react-hooks, PaginationHeader() (+5 more)

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

### Community 95 - "src/components/*"
Cohesion: 0.25
Nodes (5): Agent Behavior, Generated / Ignored Files, src/components/*, src/components/ui/**/*, useLiveQuery

### Community 96 - "use-appearance.tsx"
Cohesion: 0.26
Nodes (14): Appearance, applyAppearance(), getStoredAppearance(), handleSystemThemeChange(), initializeAppearance(), isDarkMode(), listeners, mediaQuery() (+6 more)

### Community 97 - "fixtures.ts"
Cohesion: 0.32
Nodes (10): getScenario(), assertSeeded(), checkSeededMarker(), countStore(), seedInBrowser(), seedWorkspace(), STORE_NAMES, test (+2 more)

### Community 98 - "src/data/* (persistence, migrations, seeding, backup serialization, Drive storage)"
Cohesion: 0.31
Nodes (8): Background Drive sync, bun test, src/data/* (persistence, migrations, seeding, backup serialization, Drive storage), IndexedDB (Dexie), Domain and importer tests (Dexie with in-memory IndexedDB), src/logic/* (domain reads and operations), Verification, Workspace backup/reset operations

### Community 99 - "history.tsx"
Cohesion: 0.39
Nodes (7): getStoredHistory(), getValidHistory(), HistoryContext, HistoryItem, HistoryProvider(), normaliseUrl(), withoutTrailingSelf()

### Community 100 - "monthly-budget-usage.tsx"
Cohesion: 0.60
Nodes (4): arc(), centerCurrency(), MonthlyBudgetUsage(), MonthlyBudgetUsageItem

### Community 101 - "lucide-react"
Cohesion: 0.28
Nodes (8): lucide-react, buttonVariants, ButtonVariant, Month, MonthCal(), MonthCalProps, MonthPicker(), MONTHS

### Community 102 - "app.tsx"
Cohesion: 0.32
Nodes (5): react-dom, App(), HarnessSection, sectionFromLocation(), root

### Community 103 - "use-url-params.tsx"
Cohesion: 0.67
Nodes (3): UrlParams, UrlParamsContext, UrlParamsProvider()

## Knowledge Gaps
- **83 isolated node(s):** `@fontsource-variable/inter`, `shadcn`, `tailwindcss`, `tw-animate-css`, `@biomejs/biome` (+78 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 624 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **11 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `cn()` connect `cn` to `react`, `budgets/[id]/page.tsx`, `primitives.tsx`, `paginated-data-table.tsx`, `sidebar.tsx`, `sync/page.tsx`, `utils.ts`, `themeColor`, `item.tsx`, `category-history-chart.tsx`, `providers.tsx`, `pagination.tsx`, `Button`, `spending-calendar.tsx`, `icon.tsx`, `(month)/page.tsx`, `lib/motion.ts`, `luxon`, `trend-chart.tsx`, `importer/page.tsx`, `alert-dialog.tsx`, `monthly-budget-usage.tsx`, `lucide-react`?**
  _High betweenness centrality (0.101) - this node is a cross-community bridge._
- **What connects `@fontsource-variable/inter`, `shadcn`, `tailwindcss` to the rest of the system?**
  _83 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `dashboard.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.13360323886639677 - nodes in this community are weakly interconnected._
- **Why does `react` connect `react` to `budgets/[id]/page.tsx`, `primitives.tsx`, `paginated-data-table.tsx`, `sidebar.tsx`, `sync/page.tsx`, `utils.ts`, `item.tsx`, `cn`, `package.json`, `app-sidebar.tsx`, `auto-sync.ts`, `category-history-chart.tsx`, `providers.tsx`, `pagination.tsx`, `Button`, `spending-calendar.tsx`, `icon.tsx`, `(month)/page.tsx`, `lib/motion.ts`, `luxon`, `trend-chart.tsx`, `importer/page.tsx`, `alert-dialog.tsx`, `use-appearance.tsx`, `history.tsx`, `monthly-budget-usage.tsx`, `lucide-react`, `app.tsx`, `use-url-params.tsx`?**
  _High betweenness centrality (0.081) - this node is a cross-community bridge._
- **Should `react` be split into smaller, more focused modules?**
  _Cohesion score 0.08313985627418463 - nodes in this community are weakly interconnected._
- **Why does `src/data/* (persistence, migrations, seeding, backup serialization, Drive storage)` connect `src/data/* (persistence, migrations, seeding, backup serialization, Drive storage)` to `UI layer (app pages + components)`, `providers.tsx`?**
  _High betweenness centrality (0.058) - this node is a cross-community bridge._
- **Should `db.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.0962566844919786 - nodes in this community are weakly interconnected._