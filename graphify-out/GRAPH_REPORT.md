# Graph Report - t3-9755e75b  (2026-10-24)

## Corpus Check
- 247 files · ~220,200 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 9 file(s) not represented in the graph (top: (none) 5, .example 1, .lock 1)

## Summary
- 1934 nodes · 7612 edges · 102 communities (93 shown, 9 thin omitted)
- Extraction: 98% EXTRACTED · 2% INFERRED · 0% AMBIGUOUS · INFERRED: 131 edges (avg confidence: 0.86)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `753fd3d3`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- Button
- importer/page.tsx
- total-spending-chart.tsx
- statements.ts
- sidebar.tsx
- cn
- sync/page.tsx
- utils.ts
- Validator
- dashboard.ts
- ValidationError
- compilerOptions
- history.tsx
- package.json
- dependencies
- src/data/* (persistence, migrations, seeding, backup serialization, Drive storage)
- statement-columns.tsx
- budgets/page.tsx
- suspicious
- primitives.tsx
- allocator/page.tsx
- correctness
- export-import.ts
- google-drive.ts
- STYLE.md
- records.ts
- components.json
- Commands
- test-web.ts
- app-sidebar.tsx
- test-data.ts
- lucide-react
- PaginationFooter
- db.ts
- auto-sync.ts
- pending/page.tsx
- fixtures.ts
- (month)/page.tsx
- Monthly Budget
- auth-vault.ts
- duplicates/page.tsx
- collectTests
- AGENTS.md
- amount-filter.tsx
- types.d.ts
- @playwright/test
- editors.ts
- formatter
- data.ts
- ledger.e2e.ts
- support/motion.ts
- biome.json
- rules
- providers.tsx
- devDependencies
- manifest.json
- gate/components.e2e.ts
- Next.js agent rules block ("This is NOT the Next.js you know")
- budgets/[id]/page.tsx
- Project Graph
- icon.tsx
- formatter
- Commit Guide
- Records
- Opus 5.5 medium review — pending queue race fix (a364cb8 vs cf72d4c)
- optionalDependencies
- scripts
- radix-ui
- style
- category-history-chart.tsx
- Finpoint icon concept
- Finpoint icon with charcoal shadow
- gate/routes.e2e.ts
- category-filter.tsx
- Finpoint
- Local Markdown Issue Tracker
- Google Drive sync
- accounts/page.tsx
- F monogram icon
- JPG favicon icon
- PNG favicon icon
- SVG favicon icon
- F monogram icon
- F monogram icon
- Finpoint app icon
- Domain Documentation Conflicts
- Unrestricted crawler policy
- Generated demo data
- Progressive Web Application
- Issue tracker: Local Markdown
- Domain docs
- monthly-budget-usage.tsx
- navigation.e2e.ts
- spending-calendar.tsx
- tests_web_support_fixtures_expect
- vite.config.ts
- tsconfig.web.json
- hashSnapshot
- use-sync-status.ts

## God Nodes (most connected - your core abstractions)
1. `cn()` - 320 edges
2. `PrimitivesSection()` - 184 edges
3. `Button()` - 124 edges
4. `react` - 94 edges
5. `formatCurrency()` - 81 edges
6. `RecordEditorDialog()` - 63 edges
7. `UiIcon()` - 56 edges
8. `RecordCreatorDialog()` - 52 edges
9. `round2()` - 44 edges
10. `PageContent()` - 43 edges

## Surprising Connections (you probably didn't know these)
- `2a. `tests/web/chart-motion.e2e.ts:199-217` — PASS` --references--> `PageContent()`  [INFERRED]
  reviews/opus-pending-race-oct23.md → src/components/layout/page-content.tsx
- `1a. OBJECTION (Medium): `latestParams` is never invalidated by navigation outside `pushParams`` --references--> `PaginationFooter()`  [INFERRED]
  reviews/opus-pending-race-oct23.md → src/components/table/pagination-footer.tsx
- `Rendered assertions` --references--> `SelectItem()`  [INFERRED]
  tests/web/README.md → src/components/ui/select.tsx
- `1. Restructure fidelity — PASS` --references--> `unwrap()`  [INFERRED]
  reviews/opus-restructure-oct23.md → tests/web/gate/ledger.e2e.ts
- `Verdict` --references--> `seedWorkspace()`  [INFERRED]
  reviews/opus-restructure-oct23.md → tests/web/support/fixtures.ts

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **Project graph refresh workflow** — agents_graph_refresh_rule, agents_graphify_update, agents_graphify_skill, agents_graph_artifacts_committed, agents_graph_local_only_rule [EXTRACTED 1.00]
- **UI / logic / data layer segregation** — agents_ui_layer, agents_logic_layer, agents_data_layer, agents_data_import_boundary [EXTRACTED 1.00]
- **Laravel-shaped validation pipeline** — agents_validation_rule, agents_validation_error, agents_validator, src_logic_validate, agents_laravel_shaped_error_maps [EXTRACTED 1.00]

## Communities (102 total, 9 thin omitted)

### Community 0 - "Button"
Cohesion: 0.08
Nodes (102): CandidateResults(), react, react-day-picker, sonner, @tanstack/react-form, AccountDialog(), BudgetCreatorDialog(), BudgetEditorDialog() (+94 more)

### Community 1 - "importer/page.tsx"
Cohesion: 0.24
Nodes (26): ACCEPT, BANKS_REQUIRING_ADDITIONAL_INFO, ImporterPage(), Step(), EmptyRecords(), metadata, PrivacyPage(), SECTIONS (+18 more)

### Community 2 - "total-spending-chart.tsx"
Cohesion: 0.10
Nodes (43): recharts, BudgetActiveDot(), BudgetProgressChart(), BudgetProgressPoint, buildSeries(), colorChange(), CashflowChart(), CashflowPoint (+35 more)

### Community 3 - "statements.ts"
Cohesion: 0.11
Nodes (37): countSuggestions(), asPending(), allocationOutcome(), descriptionAnchors(), descriptionIdentity(), duplicateGroups(), duplicateStatementIds(), eligible() (+29 more)

### Community 4 - "sidebar.tsx"
Cohesion: 0.09
Nodes (31): Providers(), AppearanceSwitch(), SidebarContent(), SidebarContext, SidebarContextProps, SidebarFooter(), SidebarGroup(), SidebarGroupAction() (+23 more)

### Community 5 - "cn"
Cohesion: 0.18
Nodes (23): ComboboxChip(), ComboboxChips(), ComboboxChipsInput(), ComboboxClear(), ComboboxContent(), ComboboxEmpty(), ComboboxGroup(), ComboboxInput() (+15 more)

### Community 6 - "sync/page.tsx"
Cohesion: 0.15
Nodes (26): COUNT_ROWS, DataSettingsPage(), StateRow(), STATUS_TONES, StatusTone, WorkspaceRow(), AlertDialog(), AlertDialogAction() (+18 more)

### Community 7 - "utils.ts"
Cohesion: 0.20
Nodes (14): framer-motion, AllocateBar(), Sparkline(), Metric(), RecordAmount(), StatementOption(), ValueSwap(), DURATION (+6 more)

### Community 8 - "Validator"
Cohesion: 0.25
Nodes (18): updateAccount(), validateBudget(), cleanInput(), dismissDuplicatePair(), restoreDuplicatePair(), createMonthlyBudget(), MONTHLY_BUDGET_GROUPS, PACE_KINDS (+10 more)

### Community 9 - "dashboard.ts"
Cohesion: 0.12
Nodes (40): db, AnalyticsRecord, AnalyticsSummary, contribution(), summarize(), avg(), buildCashflowHistory(), buildCategories() (+32 more)

### Community 10 - "ValidationError"
Cohesion: 0.18
Nodes (25): ensureAccount(), CategoryInput, createCategory(), deleteCategory(), updateCategory(), combine(), dbsDescriptionKey(), debitCreditAmount() (+17 more)

### Community 11 - "compilerOptions"
Cohesion: 0.06
Nodes (33): compilerOptions, allowJs, allowSyntheticDefaultImports, allowUnusedLabels, esModuleInterop, forceConsistentCasingInFileNames, incremental, isolatedModules (+25 more)

### Community 12 - "history.tsx"
Cohesion: 0.39
Nodes (7): getStoredHistory(), getValidHistory(), HistoryContext, HistoryItem, HistoryProvider(), normaliseUrl(), withoutTrailingSelf()

### Community 13 - "package.json"
Cohesion: 0.07
Nodes (26): private, $schema, type, babel-plugin-react-compiler, @biomejs/biome, clsx, cmdk, @fontsource-variable/inter (+18 more)

### Community 14 - "dependencies"
Cohesion: 0.07
Nodes (30): dependencies, @base-ui/react, class-variance-authority, clsx, cmdk, dexie, dexie-react-hooks, @fontsource-variable/inter (+22 more)

### Community 15 - "src/data/* (persistence, migrations, seeding, backup serialization, Drive storage)"
Cohesion: 0.14
Nodes (18): app/**/page.tsx, Background Drive sync, src/data/* (persistence, migrations, seeding, backup serialization, Drive storage), IndexedDB (Dexie), Interactive routes are "use client" (search params via next/navigation), src/logic/* (domain reads and operations), (month) route-group shell (Overview + Monthly Records), Pages take no props (+10 more)

### Community 16 - "statement-columns.tsx"
Cohesion: 0.36
Nodes (10): amountTone(), formatRowTime(), StatementActions(), StatementActionsCell(), StatementAmount(), StatementBadges(), StatementRow, StatementTableOptions (+2 more)

### Community 17 - "budgets/page.tsx"
Cohesion: 0.14
Nodes (36): BUDGET_STATES, BudgetCard(), BudgetsPage(), BudgetState, formatBudgetDateWindow(), @tanstack/react-table, rangeFromValue(), DataTable() (+28 more)

### Community 18 - "suspicious"
Cohesion: 0.07
Nodes (28): suspicious, noAssignInExpressions, noAsyncPromiseExecutor, noCatchAssign, noClassAssign, noCompareNegZero, noControlCharactersInRegex, noDebugger (+20 more)

### Community 19 - "primitives.tsx"
Cohesion: 0.10
Nodes (44): AlertAction(), AlertDialogTrigger(), ComboboxCollection(), ComboboxValue(), DropdownMenu(), DropdownMenuCheckboxItem(), DropdownMenuContent(), DropdownMenuGroup() (+36 more)

### Community 20 - "allocator/page.tsx"
Cohesion: 0.23
Nodes (28): AllocatorPage(), ScopeSelect(), byRecordDay, FILTER_KEYS, Filters, MonthlyRecordFilters(), RecordFilters(), StatementsPage() (+20 more)

### Community 21 - "correctness"
Cohesion: 0.08
Nodes (26): noConstantCondition, noConstAssign, noEmptyCharacterClassInRegex, noEmptyPattern, noGlobalObjectCalls, noInvalidBuiltinInstantiation, noInvalidConstructorSuper, noNonoctalDecimalEscape (+18 more)

### Community 22 - "export-import.ts"
Cohesion: 0.21
Nodes (15): clearAllData(), downloadExport(), importData(), parseImportFile(), SYNC_TABLES, tableCounts(), TableName, TABLES (+7 more)

### Community 23 - "google-drive.ts"
Cohesion: 0.24
Nodes (12): AuthNeededError, cacheToken(), CodeResponse, disconnectDrive(), DriveFileMeta, ensureDriveToken(), ensureDriveTokenSilent(), googleClientId() (+4 more)

### Community 24 - "STYLE.md"
Cohesion: 0.13
Nodes (17): Old Laravel Api/*Controller mapping, Laravel-shaped { field: string[] } error maps, ValidationError, Validator, APIs, Arguments, And Props, Code Style, Consistency, Copy (+9 more)

### Community 25 - "records.ts"
Cohesion: 0.12
Nodes (26): round2(), AccountActivity, NO_ACTIVITY, BudgetDetail, BudgetFilters, createBudget(), getBudget(), updateBudget() (+18 more)

### Community 26 - "components.json"
Cohesion: 0.09
Nodes (21): aliases, components, hooks, lib, ui, utils, iconLibrary, menuAccent (+13 more)

### Community 27 - "Commands"
Cohesion: 0.38
Nodes (7): Biome (biome check --write), bun install, bun lint (write-mode), bun lint:check, bun run build, bun types:check, Commands

### Community 28 - "test-web.ts"
Cohesion: 0.09
Nodes (35): describeHolder(), LOCK_DIR, readHolder(), refuse(), releaseLock(), takeLock(), flags, paths (+27 more)

### Community 29 - "app-sidebar.tsx"
Cohesion: 0.12
Nodes (38): MonthLayout(), NotFound(), Template(), nextConfig, luxon, next, AppearanceOption, APPEARANCES (+30 more)

### Community 30 - "test-data.ts"
Cohesion: 0.16
Nodes (16): DEFAULT_CATEGORIES, DEFAULT_MONTHLY_BUDGETS, EXPORT_VERSION, FinpointExport, BANK_BLURB, between(), CATEGORIES, DAILY (+8 more)

### Community 31 - "lucide-react"
Cohesion: 0.22
Nodes (8): lucide-react, ButtonVariant, Month, MonthCal(), MonthCalProps, MonthPicker(), MONTHS, Toaster()

### Community 32 - "PaginationFooter"
Cohesion: 0.38
Nodes (11): pageHref(), pageWindow(), PaginationFooter(), Pagination(), PaginationContent(), PaginationEllipsis(), PaginationItem(), PaginationLink() (+3 more)

### Community 33 - "db.ts"
Cohesion: 0.07
Nodes (29): dexie, fake-indexeddb, xlsx, AllocationRow, AnalyticsMonthRow, CategoryRow, DB_NAME, DB_VERSION (+21 more)

### Community 34 - "auto-sync.ts"
Cohesion: 0.15
Nodes (35): exportData(), downloadBackupFile(), driveFetch(), findBackupFile(), getClockSkewMs(), getFileMeta(), isDriveConfigured(), uploadBackupFile() (+27 more)

### Community 35 - "pending/page.tsx"
Cohesion: 0.21
Nodes (21): AccountPage(), AllocatorPendingPage(), CandidatePage, PendingCard(), StatementTile(), Amount(), dateDifferenceLabel(), ReplacementReview (+13 more)

### Community 36 - "fixtures.ts"
Cohesion: 0.13
Nodes (11): DBS_VALID, ScenarioName, WorkspaceTables, assertSeeded(), checkSeededMarker(), countStore(), seedInBrowser(), seedWorkspace() (+3 more)

### Community 37 - "(month)/page.tsx"
Cohesion: 0.13
Nodes (31): Comparison, comparisonRateText(), comparisonText(), ComparisonValue, DashboardData, DashboardMonthlyBudget, DashboardPage(), DashboardView (+23 more)

### Community 38 - "Monthly Budget"
Cohesion: 0.18
Nodes (16): CONTEXT.md (domain vocabulary), Account, Allocation, Budget, Category, Duplicate Statement, Finpoint Domain Glossary, Monthly Budget (+8 more)

### Community 39 - "auth-vault.ts"
Cohesion: 0.29
Nodes (14): POST(), POST(), POST(), jose, AUTH_COOKIE_NAME, authCookie(), authCookieConfig(), clientIp() (+6 more)

### Community 40 - "duplicates/page.tsx"
Cohesion: 0.25
Nodes (13): CARD_MOTION, DuplicateGroupCard(), FixDuplicatesPage(), GroupHeader(), highlightDifferences(), VIEWS, TRANSITION, dismissedDuplicatePairs() (+5 more)

### Community 41 - "collectTests"
Cohesion: 0.28
Nodes (16): collectTests(), conditionBranch(), detailsTags(), disabled(), mentionsMotion(), record(), splitTestCallee(), tagValues() (+8 more)

### Community 42 - "AGENTS.md"
Cohesion: 0.19
Nodes (11): Agent Behavior, Agent skills, CONTEXT.md, Conventions, Domain docs (single-context layout), Domain Language, Generated / Ignored Files, Issue tracker (local specs and tickets) (+3 more)

### Community 43 - "amount-filter.tsx"
Cohesion: 0.24
Nodes (22): PendingStatementConfirmationSheet(), RecordSearchSheet(), StatementSearchSheet(), AmountFilter(), AmountRange, COMPARISONS, describe(), Draft (+14 more)

### Community 44 - "types.d.ts"
Cohesion: 0.08
Nodes (28): Account, Allocation, AnalyticsSummary, AnalyticsTreatment, Appearance, Budget, Category, CategoryWithChildren (+20 more)

### Community 45 - "@playwright/test"
Cohesion: 0.17
Nodes (12): @playwright/test, cardTitles, Child, october, september, card(), overview, overviewCharts (+4 more)

### Community 46 - "editors.ts"
Cohesion: 0.13
Nodes (20): editors, longName, expectHeldRead(), expectRetainedRows(), expectSilentSheet(), editors, expectVisibleBackdrop(), account (+12 more)

### Community 47 - "formatter"
Cohesion: 0.15
Nodes (13): arrowParentheses, bracketSameLine, bracketSpacing, jsxQuoteStyle, quoteProperties, quoteStyle, semicolons, trailingCommas (+5 more)

### Community 48 - "data.ts"
Cohesion: 0.18
Nodes (17): AccountRow, BudgetRecordRow, BudgetRow, DuplicateDismissalRow, buildDense(), buildEmpty(), buildPopulated(), cycle() (+9 more)

### Community 49 - "ledger.e2e.ts"
Cohesion: 0.11
Nodes (25): 2. Gate integrity — PASS with notes, behaviourCoverage, componentInventory, facetNotApplicable, InventoryEntry, notApplicable, openFacets, RouteEntry (+17 more)

### Community 50 - "support/motion.ts"
Cohesion: 0.12
Nodes (21): desktopOnly, denseCardConsumers, denseRowConsumers, expectConsumerEntrance(), populatedConsumers, attachSamplingFailure(), expectPopupEntrance(), expectReducedRowMovement() (+13 more)

### Community 51 - "biome.json"
Cohesion: 0.18
Nodes (10): source, assist, actions, files, includes, linter, enabled, overrides (+2 more)

### Community 52 - "rules"
Cohesion: 0.18
Nodes (11): noAdjacentSpacesInRegex, noBannedTypes, noExtraBooleanCast, noUselessCatch, noUselessThisAlias, noUselessTypeConstraint, rules, noFloatingPromises (+3 more)

### Community 53 - "providers.tsx"
Cohesion: 0.10
Nodes (26): metadata, RootLayout(), viewport, Boot(), react-dom, @vercel/analytics, @vercel/speed-insights, seedIfEmpty() (+18 more)

### Community 54 - "devDependencies"
Cohesion: 0.15
Nodes (13): devDependencies, babel-plugin-react-compiler, @biomejs/biome, fake-indexeddb, @playwright/test, @tailwindcss/postcss, @types/luxon, @types/node (+5 more)

### Community 55 - "manifest.json"
Cohesion: 0.20
Nodes (9): background_color, description, display, icons, name, scope, short_name, start_url (+1 more)

### Community 56 - "gate/components.e2e.ts"
Cohesion: 0.23
Nodes (6): bounds(), contained(), expectWheelScrollsPageWhileOpen(), expectDropdownPreservesScroll(), scrollWithInput(), settledOverlayAlpha()

### Community 57 - "Next.js agent rules block ("This is NOT the Next.js you know")"
Cohesion: 0.18
Nodes (9): app/api/auth/* Route Handlers, bun test, node_modules/next/dist/server/lib/generate-agent-files.js, Google OAuth broker (exchange/token/logout), Domain and importer tests (Dexie with in-memory IndexedDB), Next.js App Router app (mostly client-side), node_modules/next/dist/docs/, npm run dev (port 5173) (+1 more)

### Community 58 - "budgets/[id]/page.tsx"
Cohesion: 0.13
Nodes (32): BudgetPage(), getBudgetAnalytics(), getCategoryData(), Legend(), CategoriesPage(), CategoryDialogState, CategoryTile(), SECTIONS (+24 more)

### Community 59 - "Project Graph"
Cohesion: 0.39
Nodes (6): Committed graph artifacts (graph.json, GRAPH_REPORT.md, manifest.json, .graphify_labels.json), Graph health warnings and refresh failure reporting, graphify-out/graph.json, graphify skill (--update), graphify update ., Project Graph

### Community 60 - "icon.tsx"
Cohesion: 0.18
Nodes (15): Rule, RuleCard(), StatementRulesPage(), RuleSuggestions(), ruleValueLabel(), DynamicUiIcon(), ICON_NAMES, iconNameSet (+7 more)

### Community 61 - "formatter"
Cohesion: 0.25
Nodes (8): formatter, attributePosition, enabled, formatWithErrors, indentStyle, indentWidth, lineEnding, lineWidth

### Community 62 - "Commit Guide"
Cohesion: 0.25
Nodes (4): Branches, Commit Guide, Commits, Pull Requests

### Community 63 - "Records"
Cohesion: 0.32
Nodes (8): Allocator, Budgets, Categories, Dashboard, Statement-allocation-record model, Monthly Budgets, Records, Statement importer

### Community 64 - "Opus 5.5 medium review — pending queue race fix (a364cb8 vs cf72d4c)"
Cohesion: 0.11
Nodes (18): 1. Product fix — `app/allocator/pending/page.tsx`, 1a. OBJECTION (Medium): `latestParams` is never invalidated by navigation outside `pushParams`, 1b. OBJECTION (Low–Medium): the identical-URL skip compares against the committed URL, not the last intent, 1c. PASS (Low note): `setCandidateQuery("")` per keystroke still allows one mid-typing push, 2. Test fixes, 2a. `tests/web/chart-motion.e2e.ts:199-217` — PASS, 2b. `tests/web/navigation-motion.e2e.ts:123-130` — PASS (Low note), 2c. `tests/web/pending-search.e2e.ts:112-120` (mobile settled wait) — PASS with a Low note (+10 more)

### Community 65 - "optionalDependencies"
Cohesion: 0.29
Nodes (7): optionalDependencies, lightningcss-linux-x64-gnu, lightningcss-win32-x64-msvc, @rollup/rollup-linux-x64-gnu, @rollup/rollup-win32-x64-msvc, @tailwindcss/oxide-linux-x64-gnu, @tailwindcss/oxide-win32-x64-msvc

### Community 66 - "scripts"
Cohesion: 0.12
Nodes (17): scripts, build, dev, lint, lint:check, start, test:web, test:web:full (+9 more)

### Community 67 - "radix-ui"
Cohesion: 0.18
Nodes (12): class-variance-authority, radix-ui, AppHeader(), ButtonGroup(), ButtonGroupSeparator(), ButtonGroupText(), buttonGroupVariants, FieldSeparator() (+4 more)

### Community 68 - "style"
Cohesion: 0.33
Nodes (6): style, noNamespace, noNonNullAssertion, useArrayLiterals, useAsConstAssertion, useBlockStatements

### Community 69 - "category-history-chart.tsx"
Cohesion: 0.24
Nodes (11): aggregateSeries(), CategoryHistoryChart(), ChartMonth, ChartSeries, HistoryTooltip(), MonthTick(), prepareMonths(), prepareSeries() (+3 more)

### Community 70 - "Finpoint icon concept"
Cohesion: 0.40
Nodes (5): Finpoint icon concept, Charcoal shadow halo, Circular point, Rounded F monogram, Off-white icon fill

### Community 71 - "Finpoint icon with charcoal shadow"
Cohesion: 0.40
Nodes (5): Finpoint icon with charcoal shadow, Charcoal shadow halo, Circular point, Rounded F monogram, Off-white icon fill

### Community 72 - "gate/routes.e2e.ts"
Cohesion: 0.22
Nodes (9): containedFooter(), PREMATURE, routeReady, titles, expectPointerCursor(), IDS, fits(), patchRows() (+1 more)

### Community 73 - "category-filter.tsx"
Cohesion: 0.20
Nodes (17): @base-ui/react, CategoryFilter(), CategoryFilterItem(), Command(), CommandEmpty(), CommandGroup(), CommandInput(), CommandItem() (+9 more)

### Community 74 - "Finpoint"
Cohesion: 0.50
Nodes (4): Finpoint, Circular point, Rounded F monogram, Off-white icon fill

### Community 75 - "Local Markdown Issue Tracker"
Cohesion: 0.50
Nodes (4): Local Tracker Operations, Spec and Ticket Files, Ticket Lifecycle, Local Markdown Issue Tracker

### Community 77 - "Google Drive sync"
Cohesion: 0.50
Nodes (4): Google Drive sync, JSON backup and restore, Local-first finance tracking, Sync conflict handling

### Community 78 - "accounts/page.tsx"
Cohesion: 0.36
Nodes (7): AccountCard(), AccountRow, AccountsPage(), dayLabel(), bankMeta(), BANKS, pathAccount()

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

### Community 91 - "Issue tracker: Local Markdown"
Cohesion: 0.40
Nodes (4): Files, Issue tracker: Local Markdown, Skill operations, Status and dependencies

### Community 92 - "Domain docs"
Cohesion: 0.50
Nodes (3): Before exploration, Domain docs, Writing

### Community 93 - "monthly-budget-usage.tsx"
Cohesion: 0.39
Nodes (6): arc(), centerCurrency(), MonthlyBudgetUsage(), MonthlyBudgetUsageItem, compactAmount, formatChartCurrency()

### Community 94 - "navigation.e2e.ts"
Cohesion: 0.24
Nodes (9): 1. Restructure fidelity — PASS, 3. Sidebar hardening (d1ba358) — OBJECTION, Medium, 4. Evidence audit — CONDITIONAL, Graph, Opus 5.5 review — browser-suite restructure (c45b246) and mobile sidebar hardening (d1ba358), Required follow-ups (in order), Summary table, Verdict (+1 more)

### Community 95 - "spending-calendar.tsx"
Cohesion: 0.36
Nodes (7): compact(), INK, LEVELS, quantile(), rampCap(), SpendingCalendar(), WEEKDAYS

### Community 97 - "vite.config.ts"
Cohesion: 0.29
Nodes (4): vite, @vitejs/plugin-react, harnessDir, repoRoot

### Community 98 - "tsconfig.web.json"
Cohesion: 0.29
Nodes (6): ./tsconfig.json, compilerOptions, incremental, exclude, extends, include

### Community 100 - "hashSnapshot"
Cohesion: 0.43
Nodes (5): FinpointDB, digestSnapshot(), hashLegacySnapshot(), hashSnapshot(), Snapshot

### Community 101 - "use-sync-status.ts"
Cohesion: 0.60
Nodes (4): useSyncStatus(), getSyncSnapshot(), subscribeSync(), SyncSnapshot

## Knowledge Gaps
- **72 isolated node(s):** `@fontsource-variable/inter`, `shadcn`, `tailwindcss`, `tw-animate-css`, `@biomejs/biome` (+67 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 606 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **9 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `cn()` connect `cn` to `Button`, `importer/page.tsx`, `total-spending-chart.tsx`, `sidebar.tsx`, `sync/page.tsx`, `utils.ts`, `statement-columns.tsx`, `budgets/page.tsx`, `primitives.tsx`, `allocator/page.tsx`, `app-sidebar.tsx`, `lucide-react`, `PaginationFooter`, `pending/page.tsx`, `(month)/page.tsx`, `duplicates/page.tsx`, `amount-filter.tsx`, `budgets/[id]/page.tsx`, `icon.tsx`, `radix-ui`, `category-filter.tsx`, `accounts/page.tsx`, `monthly-budget-usage.tsx`, `spending-calendar.tsx`?**
  _High betweenness centrality (0.095) - this node is a cross-community bridge._
- **What connects `@fontsource-variable/inter`, `shadcn`, `tailwindcss` to the rest of the system?**
  _72 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Button` be split into smaller, more focused modules?**
  _Cohesion score 0.07997461123452872 - nodes in this community are weakly interconnected._
- **Why does `@playwright/test` connect `@playwright/test` to `tests_web_support_fixtures_expect`, `fixtures.ts`, `gate/routes.e2e.ts`, `package.json`, `editors.ts`, `ledger.e2e.ts`, `support/motion.ts`, `gate/components.e2e.ts`?**
  _High betweenness centrality (0.071) - this node is a cross-community bridge._
- **Should `total-spending-chart.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.10087082728592163 - nodes in this community are weakly interconnected._
- **Why does `react` connect `Button` to `importer/page.tsx`, `total-spending-chart.tsx`, `sidebar.tsx`, `cn`, `sync/page.tsx`, `utils.ts`, `history.tsx`, `package.json`, `statement-columns.tsx`, `budgets/page.tsx`, `primitives.tsx`, `allocator/page.tsx`, `app-sidebar.tsx`, `lucide-react`, `PaginationFooter`, `pending/page.tsx`, `(month)/page.tsx`, `duplicates/page.tsx`, `amount-filter.tsx`, `providers.tsx`, `budgets/[id]/page.tsx`, `icon.tsx`, `radix-ui`, `category-filter.tsx`, `accounts/page.tsx`, `monthly-budget-usage.tsx`, `use-sync-status.ts`?**
  _High betweenness centrality (0.061) - this node is a cross-community bridge._
- **Should `statements.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.10569105691056911 - nodes in this community are weakly interconnected._