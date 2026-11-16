# Graph Report - t3-921312b2-87521e3c3b96e93a  (2026-11-17)

## Corpus Check
- 282 files · ~252,535 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 9 file(s) not represented in the graph (top: (none) 5, .example 1, .lock 1)

## Summary
- 2072 nodes · 8244 edges · 101 communities (89 shown, 12 thin omitted)
- Extraction: 98% EXTRACTED · 2% INFERRED · 0% AMBIGUOUS · INFERRED: 138 edges (avg confidence: 0.84)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `65eb907a`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- dashboard.ts
- Button
- db.ts
- Tests README
- luxon
- duplicates/page.tsx
- auth-vault.ts
- statements.ts
- @playwright/test
- ref_bun_test
- lib/motion.ts
- compilerOptions
- core/editors.e2e.ts
- combobox.tsx
- ValidationError
- records/[id]/page.tsx
- dependencies
- utils.ts
- records-sheet.tsx
- app-sidebar.tsx
- src/data/* (persistence, migrations, seeding, backup serialization, Drive storage)
- category-filter.tsx
- records.ts
- suspicious
- package.json
- ledger.e2e.ts
- correctness
- suggestions.ts
- core/components.e2e.ts
- spending-calendar.tsx
- support/motion.ts
- fixtures.ts
- primitives.tsx
- UI layer (app pages + components)
- src/components/*
- components.json
- providers.tsx
- allocator/page.tsx
- transaction-checks.test.ts
- types.d.ts
- STYLE.md
- cn
- scripts
- budgets/[id]/page.tsx
- export-import.ts
- auto-sync.ts
- navigation.e2e.ts
- formatter
- devDependencies
- pagination.tsx
- test-data.ts
- Commands
- Next.js agent rules block ("This is NOT the Next.js you know")
- radix-ui
- optionalDependencies
- biome.json
- rules
- manifest.json
- icon.tsx
- lucide-react
- (month)/page.tsx
- sync/page.tsx
- formatter
- Records
- Validation rule (ValidationError + Validator)
- Domain docs (single-context layout)
- accounts/page.tsx
- trend-chart.tsx
- tsconfig.e2e.json
- style
- statement-rules.ts
- record-columns.tsx
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
- next
- auto-sync.test.ts
- drive-sync.ts
- workflows.e2e.ts
- importer.test.ts
- empty.tsx

## God Nodes (most connected - your core abstractions)
1. `cn()` - 321 edges
2. `PrimitivesSection()` - 181 edges
3. `Button()` - 125 edges
4. `react` - 98 edges
5. `formatCurrency()` - 79 edges
6. `RecordEditorDialog()` - 60 edges
7. `RecordCreatorDialog()` - 57 edges
8. `UiIcon()` - 56 edges
9. `round2()` - 46 edges
10. `pluralize()` - 46 edges

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

## Communities (101 total, 12 thin omitted)

### Community 0 - "dashboard.ts"
Cohesion: 0.13
Nodes (37): contribution(), summarize(), avg(), BREAKDOWN_MONTHS, buildCashflowHistory(), buildCategories(), buildComparison(), buildMonthlyBudgets() (+29 more)

### Community 1 - "Button"
Cohesion: 0.06
Nodes (129): ACCEPT, BANKS_REQUIRING_ADDITIONAL_INFO, MonthLayout(), framer-motion, react, react-day-picker, sonner, @tanstack/react-form (+121 more)

### Community 2 - "db.ts"
Cohesion: 0.09
Nodes (31): AccountRow, AllocationRow, AnalyticsMonthRow, asPending(), BudgetRecordRow, BudgetRow, CategoryRow, DB_NAME (+23 more)

### Community 3 - "Tests README"
Cohesion: 0.06
Nodes (41): Build harness step (vite build tests/harness), Playwright browser cache keyed on bun.lock, blob report merge, Committed graph artifacts (graph.json, GRAPH_REPORT.md, manifest.json, .graphify_labels.json), Graph health warnings and refresh failure reporting, graphify-out/graph.json, graphify skill (--update), graphify update . (+33 more)

### Community 4 - "luxon"
Cohesion: 0.19
Nodes (16): CategoryRow(), luxon, CashflowChart(), CashflowPoint, CategoryMovers(), Mover, DailySpendingChart(), MonthlyBudgetLine (+8 more)

### Community 5 - "duplicates/page.tsx"
Cohesion: 0.18
Nodes (40): CARD_MOTION, DuplicateGroupCard(), FixDuplicatesPage(), GroupHeader(), highlightDifferences(), VIEWS, AllocatorPendingPage(), CandidatePage (+32 more)

### Community 6 - "auth-vault.ts"
Cohesion: 0.29
Nodes (14): POST(), POST(), POST(), jose, AUTH_COOKIE_NAME, authCookie(), authCookieConfig(), clientIp() (+6 more)

### Community 7 - "statements.ts"
Cohesion: 0.17
Nodes (24): round2(), AccountActivity, NO_ACTIVITY, duplicateStatementIds(), getRecord(), dayDifference(), ensureCanReplace(), maskDescription() (+16 more)

### Community 8 - "@playwright/test"
Cohesion: 0.23
Nodes (7): @playwright/test, cardTitles, card(), chartTooltip, overview, overviewCharts, themedRgb()

### Community 9 - "ref_bun_test"
Cohesion: 0.08
Nodes (11): dexie, fake-indexeddb, base, category, Backup, breakers, base, file() (+3 more)

### Community 10 - "lib/motion.ts"
Cohesion: 0.17
Nodes (29): @tanstack/react-table, DataTable(), PaginatedDataTable(), GroupHeaderRow(), groupStarts(), GroupTotal(), isInteractiveTarget(), LeavingRows() (+21 more)

### Community 11 - "compilerOptions"
Cohesion: 0.06
Nodes (33): compilerOptions, allowJs, allowSyntheticDefaultImports, allowUnusedLabels, esModuleInterop, forceConsistentCasingInFileNames, incremental, isolatedModules (+25 more)

### Community 12 - "core/editors.e2e.ts"
Cohesion: 0.09
Nodes (20): editors, editors, longName, expectHeldRead(), expectRetainedRows(), expectSilentSheet(), IDS, account (+12 more)

### Community 13 - "combobox.tsx"
Cohesion: 0.11
Nodes (25): @base-ui/react, Props, ComboboxChip(), ComboboxChips(), ComboboxChipsInput(), ComboboxClear(), ComboboxCollection(), ComboboxContent() (+17 more)

### Community 14 - "ValidationError"
Cohesion: 0.07
Nodes (68): ensureAccount(), updateAccount(), validateBudget(), CategoryInput, checkReferences(), cleanInput(), createCategory(), updateCategory() (+60 more)

### Community 15 - "records/[id]/page.tsx"
Cohesion: 0.11
Nodes (38): ImporterPage(), Step(), metadata, PrivacyPage(), SECTIONS, RecordPage(), StatementPage(), MethodHeader() (+30 more)

### Community 16 - "dependencies"
Cohesion: 0.07
Nodes (30): dependencies, @base-ui/react, class-variance-authority, clsx, cmdk, dexie, dexie-react-hooks, @fontsource-variable/inter (+22 more)

### Community 17 - "utils.ts"
Cohesion: 0.18
Nodes (32): Amount(), StatementRow(), PendingStatementConfirmationSheet(), RecordOption(), RecordSearchSheet(), StatementOption(), StatementSearchSheet(), AmountFilter() (+24 more)

### Community 18 - "records-sheet.tsx"
Cohesion: 0.20
Nodes (11): byRecordDay, RecordsSheet(), MOBILE_BREAKPOINT, useIsMobile(), useMonthParams(), RecordsSheetFilters, Replace, UrlParams (+3 more)

### Community 19 - "app-sidebar.tsx"
Cohesion: 0.18
Nodes (28): ReviewLinks(), NotFound(), AppearanceOption, APPEARANCES, AppSidebar(), SyncDot(), SYSTEM_APPEARANCE, useSyncIndicator() (+20 more)

### Community 20 - "src/data/* (persistence, migrations, seeding, backup serialization, Drive storage)"
Cohesion: 0.31
Nodes (8): Background Drive sync, bun test, src/data/* (persistence, migrations, seeding, backup serialization, Drive storage), IndexedDB (Dexie), Domain and importer tests (Dexie with in-memory IndexedDB), src/logic/* (domain reads and operations), Verification, Workspace backup/reset operations

### Community 21 - "category-filter.tsx"
Cohesion: 0.33
Nodes (11): CategoryFilter(), CategoryFilterItem(), Command(), CommandEmpty(), CommandGroup(), CommandInput(), CommandItem(), CommandList() (+3 more)

### Community 22 - "records.ts"
Cohesion: 0.15
Nodes (20): db, flagParam(), listParam(), looseFlagParam(), numberParam(), ParamSource, textParam(), getMonthlyRecords() (+12 more)

### Community 23 - "suspicious"
Cohesion: 0.07
Nodes (28): suspicious, noAssignInExpressions, noAsyncPromiseExecutor, noCatchAssign, noClassAssign, noCompareNegZero, noControlCharactersInRegex, noDebugger (+20 more)

### Community 24 - "package.json"
Cohesion: 0.07
Nodes (26): private, $schema, type, babel-plugin-react-compiler, @biomejs/biome, clsx, cmdk, @fontsource-variable/inter (+18 more)

### Community 25 - "ledger.e2e.ts"
Cohesion: 0.07
Nodes (46): typescript, vite, @vitejs/plugin-react, behaviourCoverage, componentInventory, facetNotApplicable, InventoryEntry, modalAnimationCoverage (+38 more)

### Community 26 - "correctness"
Cohesion: 0.08
Nodes (26): noConstantCondition, noConstAssign, noEmptyCharacterClassInRegex, noEmptyPattern, noGlobalObjectCalls, noInvalidBuiltinInstantiation, noInvalidConstructorSuper, noNonoctalDecimalEscape (+18 more)

### Community 27 - "suggestions.ts"
Cohesion: 0.11
Nodes (36): allocatedStatements(), asOf(), byDate(), CHIP_LIMIT, CHOICES, Clue, createModel(), DEFAULT_WEIGHTS (+28 more)

### Community 28 - "core/components.e2e.ts"
Cohesion: 0.13
Nodes (11): desktopOnly, bounds(), contained(), expectWheelScrollsPageWhileOpen(), containedFooter(), expectDropdownPreservesScroll(), expectPointerCursor(), scrollWithInput() (+3 more)

### Community 29 - "spending-calendar.tsx"
Cohesion: 0.29
Nodes (9): compact(), heat(), INK, LEVELS, quantile(), rampCap(), SpendingCalendar(), STRENGTH (+1 more)

### Community 30 - "support/motion.ts"
Cohesion: 0.17
Nodes (21): denseCardConsumers, denseRowConsumers, expectConsumerEntrance(), populatedConsumers, expectVisibleBackdrop(), attachSamplingFailure(), expectModalEntrance(), expectModalExit() (+13 more)

### Community 31 - "fixtures.ts"
Cohesion: 0.13
Nodes (23): Child, october, september, PREMATURE, routeReady, titles, getScenario(), statementRules() (+15 more)

### Community 32 - "primitives.tsx"
Cohesion: 0.10
Nodes (45): AlertAction(), CardFooter(), DropdownMenu(), DropdownMenuCheckboxItem(), DropdownMenuContent(), DropdownMenuGroup(), DropdownMenuItem(), DropdownMenuLabel() (+37 more)

### Community 33 - "UI layer (app pages + components)"
Cohesion: 0.22
Nodes (11): app/**/page.tsx, Interactive routes are "use client" (search params via next/navigation), (month) route-group shell (Overview + Monthly Records), Pages take no props, Project Shape, React Compiler (enabled), Root Suspense (keeps routes static), src/routes.ts (centralized route paths) (+3 more)

### Community 34 - "src/components/*"
Cohesion: 0.25
Nodes (5): Agent Behavior, Generated / Ignored Files, src/components/*, src/components/ui/**/*, useLiveQuery

### Community 35 - "components.json"
Cohesion: 0.09
Nodes (21): aliases, components, hooks, lib, ui, utils, iconLibrary, menuAccent (+13 more)

### Community 36 - "providers.tsx"
Cohesion: 0.13
Nodes (25): metadata, RootLayout(), viewport, Boot(), Providers(), @vercel/analytics, @vercel/speed-insights, Toaster() (+17 more)

### Community 37 - "allocator/page.tsx"
Cohesion: 0.20
Nodes (26): AccountPage(), AllocatorPage(), RecordsPage(), StatementsPage(), PageContent(), SelectionBar(), amountTone(), byDay() (+18 more)

### Community 38 - "transaction-checks.test.ts"
Cohesion: 0.22
Nodes (3): HELD, raceGap(), reset()

### Community 39 - "types.d.ts"
Cohesion: 0.10
Nodes (20): Account, Allocation, AnalyticsSummary, AnalyticsTreatment, Appearance, Budget, Category, CategoryWithChildren (+12 more)

### Community 40 - "STYLE.md"
Cohesion: 0.09
Nodes (29): CONTEXT.md (domain vocabulary), Account, Allocation, Budget, Category, Duplicate Statement, Finpoint Domain Glossary, Monthly Budget (+21 more)

### Community 41 - "cn"
Cohesion: 0.12
Nodes (32): AppearanceSwitch(), SidebarContent(), SidebarContext, SidebarContextProps, SidebarFooter(), SidebarGroup(), SidebarGroupAction(), SidebarGroupContent() (+24 more)

### Community 42 - "scripts"
Cohesion: 0.22
Nodes (9): scripts, build, dev, lint, lint:check, start, test:e2e, types:check (+1 more)

### Community 43 - "budgets/[id]/page.tsx"
Cohesion: 0.13
Nodes (25): BudgetPage(), getCategoryData(), Legend(), BudgetProgressChart(), OUTSIDE, Sparkline(), Delta, Metric() (+17 more)

### Community 44 - "export-import.ts"
Cohesion: 0.11
Nodes (30): withoutActionModes(), brokenReferences(), clearAllData(), downloadExport(), exportData(), importData(), monthlyBudgetFields(), parseImportFile() (+22 more)

### Community 45 - "auto-sync.ts"
Cohesion: 0.11
Nodes (26): useSyncStatus(), armPushTimer(), emit(), eventListeners, exclusive(), finishCycle(), flushOnHide(), getSyncSnapshot() (+18 more)

### Community 47 - "formatter"
Cohesion: 0.15
Nodes (13): arrowParentheses, bracketSameLine, bracketSpacing, jsxQuoteStyle, quoteProperties, quoteStyle, semicolons, trailingCommas (+5 more)

### Community 48 - "devDependencies"
Cohesion: 0.15
Nodes (13): devDependencies, babel-plugin-react-compiler, @biomejs/biome, fake-indexeddb, @playwright/test, @tailwindcss/postcss, @types/luxon, @types/node (+5 more)

### Community 49 - "pagination.tsx"
Cohesion: 0.38
Nodes (11): pageHref(), pageWindow(), PaginationFooter(), Pagination(), PaginationContent(), PaginationEllipsis(), PaginationItem(), PaginationLink() (+3 more)

### Community 50 - "test-data.ts"
Cohesion: 0.14
Nodes (18): DEFAULT_CATEGORIES, DEFAULT_MONTHLY_BUDGETS, EXPORT_VERSION, FinpointExport, migrateRecordChoices(), BANK_BLURB, between(), CATEGORIES (+10 more)

### Community 51 - "Commands"
Cohesion: 0.38
Nodes (7): Biome (biome check --write), bun install, bun lint (write-mode), bun lint:check, bun run build, bun types:check, Commands

### Community 52 - "Next.js agent rules block ("This is NOT the Next.js you know")"
Cohesion: 0.25
Nodes (6): app/api/auth/* Route Handlers, node_modules/next/dist/server/lib/generate-agent-files.js, Google OAuth broker (exchange/token/logout), Next.js App Router app (mostly client-side), node_modules/next/dist/docs/, npm run dev (port 5173)

### Community 53 - "radix-ui"
Cohesion: 0.14
Nodes (14): radix-ui, AppHeader(), ButtonGroup(), ButtonGroupSeparator(), ButtonGroupText(), buttonGroupVariants, FieldSeparator(), ItemSeparator() (+6 more)

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

### Community 58 - "icon.tsx"
Cohesion: 0.18
Nodes (16): Rule, RuleSentence(), StatementRulesPage(), ruleValueLabel(), DynamicUiIcon(), ICON_NAMES, iconNameSet, loadedIcons (+8 more)

### Community 59 - "lucide-react"
Cohesion: 0.28
Nodes (8): lucide-react, buttonVariants, ButtonVariant, Month, MonthCal(), MonthCalProps, MonthPicker(), MONTHS

### Community 60 - "(month)/page.tsx"
Cohesion: 0.12
Nodes (25): Comparison, comparisonRateText(), comparisonText(), ComparisonValue, DashboardData, DashboardMonthlyBudget, DashboardPage(), DashboardView (+17 more)

### Community 61 - "sync/page.tsx"
Cohesion: 0.18
Nodes (17): COUNT_ROWS, DataSettingsPage(), LINK_TONES, LinkTone, STATUS_TONES, StatusTone, SyncEndpoint(), WorkspaceRow() (+9 more)

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

### Community 66 - "accounts/page.tsx"
Cohesion: 0.15
Nodes (23): AccountCard(), AccountRow, AccountsPage(), BUDGET_STATES, BudgetCard(), BudgetsPage(), BudgetState, formatBudgetDateWindow() (+15 more)

### Community 67 - "trend-chart.tsx"
Cohesion: 0.16
Nodes (19): bar(), BarChart(), BarSeries, PAD, ChartFrame(), ChartSize, ReadoutRows(), arc() (+11 more)

### Community 68 - "tsconfig.e2e.json"
Cohesion: 0.29
Nodes (6): ./tsconfig.json, compilerOptions, incremental, exclude, extends, include

### Community 69 - "style"
Cohesion: 0.33
Nodes (6): style, noNamespace, noNonNullAssertion, useArrayLiterals, useAsConstAssertion, useBlockStatements

### Community 70 - "statement-rules.ts"
Cohesion: 0.18
Nodes (13): StatementRow, byCreation(), listStatementRules(), matchesStatement(), NAME_ORDER, RULE_OPERATORS, RuleInput, RuleRecommendation (+5 more)

### Community 71 - "record-columns.tsx"
Cohesion: 0.29
Nodes (14): Icon(), formatRowTime(), PendingBadge(), pendingReason(), RecordActions(), RecordActionsCell(), RecordAmountCell(), RecordDetails() (+6 more)

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

### Community 95 - "next"
Cohesion: 0.21
Nodes (9): nextConfig, next, getStoredHistory(), getValidHistory(), HistoryContext, HistoryItem, HistoryProvider(), normaliseUrl() (+1 more)

### Community 96 - "auto-sync.test.ts"
Cohesion: 0.18
Nodes (7): drive, listeners, nav, realDrive, realSync, timers, win

### Community 97 - "drive-sync.ts"
Cohesion: 0.17
Nodes (31): AuthNeededError, cacheToken(), CodeResponse, disconnectDrive(), downloadBackupFile(), driveFetch(), DriveFileMeta, ensureDriveToken() (+23 more)

### Community 100 - "empty.tsx"
Cohesion: 0.50
Nodes (4): class-variance-authority, EmptyContent(), EmptyMedia(), emptyMediaVariants

## Knowledge Gaps
- **83 isolated node(s):** `@fontsource-variable/inter`, `shadcn`, `tailwindcss`, `tw-animate-css`, `@biomejs/biome` (+78 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 644 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **12 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `cn()` connect `cn` to `Button`, `luxon`, `duplicates/page.tsx`, `lib/motion.ts`, `combobox.tsx`, `records/[id]/page.tsx`, `utils.ts`, `app-sidebar.tsx`, `category-filter.tsx`, `spending-calendar.tsx`, `primitives.tsx`, `allocator/page.tsx`, `budgets/[id]/page.tsx`, `pagination.tsx`, `radix-ui`, `icon.tsx`, `lucide-react`, `(month)/page.tsx`, `sync/page.tsx`, `accounts/page.tsx`, `trend-chart.tsx`, `record-columns.tsx`, `alert-dialog.tsx`, `empty.tsx`?**
  _High betweenness centrality (0.087) - this node is a cross-community bridge._
- **What connects `@fontsource-variable/inter`, `shadcn`, `tailwindcss` to the rest of the system?**
  _83 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `dashboard.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.13090418353576247 - nodes in this community are weakly interconnected._
- **Why does `react` connect `Button` to `duplicates/page.tsx`, `lib/motion.ts`, `combobox.tsx`, `records/[id]/page.tsx`, `utils.ts`, `records-sheet.tsx`, `app-sidebar.tsx`, `category-filter.tsx`, `package.json`, `spending-calendar.tsx`, `primitives.tsx`, `providers.tsx`, `allocator/page.tsx`, `cn`, `budgets/[id]/page.tsx`, `auto-sync.ts`, `pagination.tsx`, `radix-ui`, `icon.tsx`, `lucide-react`, `(month)/page.tsx`, `sync/page.tsx`, `accounts/page.tsx`, `trend-chart.tsx`, `record-columns.tsx`, `alert-dialog.tsx`, `next`?**
  _High betweenness centrality (0.074) - this node is a cross-community bridge._
- **Should `Button` be split into smaller, more focused modules?**
  _Cohesion score 0.06494154548046764 - nodes in this community are weakly interconnected._
- **Why does `src/data/* (persistence, migrations, seeding, backup serialization, Drive storage)` connect `src/data/* (persistence, migrations, seeding, backup serialization, Drive storage)` to `UI layer (app pages + components)`, `providers.tsx`?**
  _High betweenness centrality (0.070) - this node is a cross-community bridge._
- **Should `db.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.0944741532976827 - nodes in this community are weakly interconnected._