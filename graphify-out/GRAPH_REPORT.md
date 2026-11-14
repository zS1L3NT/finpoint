# Graph Report - t3-6b4fc13c-8de3ddf0f021ed8e  (2026-11-14)

## Corpus Check
- 265 files · ~240,292 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 9 file(s) not represented in the graph (top: (none) 5, .example 1, .lock 1)

## Summary
- 1989 nodes · 7886 edges · 100 communities (89 shown, 11 thin omitted)
- Extraction: 98% EXTRACTED · 2% INFERRED · 0% AMBIGUOUS · INFERRED: 129 edges (avg confidence: 0.84)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `eb713375`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- dashboard.ts
- react
- ref_bun_test
- Tests README
- budgets/[id]/page.tsx
- primitives.tsx
- auth-vault.ts
- statements.ts
- @playwright/test
- command.tsx
- lib/motion.ts
- compilerOptions
- editors.ts
- sidebar.tsx
- Validator
- export-import.ts
- dependencies
- Button
- workflows.e2e.ts
- next
- cn
- app.tsx
- snapshot-hash.ts
- suspicious
- package.json
- ledger.e2e.ts
- correctness
- suggestions.ts
- core/components.e2e.ts
- drive-sync.ts
- support/motion.ts
- core/routes.e2e.ts
- amount-filter.tsx
- src/data/* (persistence, migrations, seeding, backup serialization, Drive storage)
- test-data.ts
- components.json
- app-sidebar.tsx
- auto-sync.ts
- animations/tables.e2e.ts
- types.d.ts
- STYLE.md
- collectTests
- statement-rules.ts
- ValidationError
- use-appearance.tsx
- providers.tsx
- navigation.e2e.ts
- formatter
- devDependencies
- pagination.tsx
- records.ts
- Commands
- Next.js agent rules block ("This is NOT the Next.js you know")
- spending-calendar.tsx
- date-range.tsx
- biome.json
- rules
- manifest.json
- fixtures.ts
- scripts
- (month)/page.tsx
- utils.ts
- formatter
- Records
- Project Shape
- Domain docs (single-context layout)
- optionalDependencies
- luxon
- tsconfig.e2e.json
- style
- duplicates/page.tsx
- vite.config.ts
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
- history.tsx
- src/components/*
- app/layout.tsx
- workflow-tabs.tsx
- State persistence rule (ephemeral UI state vs IndexedDB)
- db.ts

## God Nodes (most connected - your core abstractions)
1. `cn()` - 320 edges
2. `PrimitivesSection()` - 181 edges
3. `Button()` - 123 edges
4. `react` - 100 edges
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
- `SECTIONS` --calls--> `treatmentLabel()`  [EXTRACTED]
  app/categories/page.tsx → src/lib/analytics.ts
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

## Communities (100 total, 11 thin omitted)

### Community 0 - "dashboard.ts"
Cohesion: 0.16
Nodes (32): AnalyticsRecord, AnalyticsSummary, contribution(), summarize(), avg(), buildCashflowHistory(), buildCategories(), buildComparison() (+24 more)

### Community 1 - "react"
Cohesion: 0.08
Nodes (105): CandidateResults(), @base-ui/react, react, sonner, @tanstack/react-form, AccountDialog(), BudgetCreatorDialog(), BudgetEditorDialog() (+97 more)

### Community 2 - "ref_bun_test"
Cohesion: 0.07
Nodes (17): dexie, fake-indexeddb, xlsx, drive, listeners, nav, realDrive, realSync (+9 more)

### Community 3 - "Tests README"
Cohesion: 0.06
Nodes (41): Build harness step (vite build tests/harness), Playwright browser cache keyed on bun.lock, blob report merge, Committed graph artifacts (graph.json, GRAPH_REPORT.md, manifest.json, .graphify_labels.json), Graph health warnings and refresh failure reporting, graphify-out/graph.json, graphify skill (--update), graphify update . (+33 more)

### Community 4 - "budgets/[id]/page.tsx"
Cohesion: 0.14
Nodes (45): BudgetPage(), getBudgetAnalytics(), getCategoryData(), Legend(), ACCEPT, BANKS_REQUIRING_ADDITIONAL_INFO, ImporterPage(), Step() (+37 more)

### Community 5 - "primitives.tsx"
Cohesion: 0.09
Nodes (55): DriveOverwriteConfirmation(), AlertAction(), AlertDialog(), AlertDialogAction(), AlertDialogCancel(), AlertDialogContent(), AlertDialogDescription(), AlertDialogFooter() (+47 more)

### Community 6 - "auth-vault.ts"
Cohesion: 0.29
Nodes (14): POST(), POST(), POST(), jose, AUTH_COOKIE_NAME, authCookie(), authCookieConfig(), clientIp() (+6 more)

### Community 7 - "statements.ts"
Cohesion: 0.10
Nodes (39): asPending(), StatementRow, descriptionAnchors(), descriptionIdentity(), DuplicateGroup, duplicateGroups(), DuplicateStatement, duplicateStatementIds() (+31 more)

### Community 8 - "@playwright/test"
Cohesion: 0.23
Nodes (7): @playwright/test, cardTitles, card(), chartTooltip, overview, overviewCharts, themedRgb()

### Community 9 - "command.tsx"
Cohesion: 0.16
Nodes (21): CategoryFilter(), CategoryFilterItem(), ComboboxClear(), ComboboxInput(), ComboboxTrigger(), Command(), CommandEmpty(), CommandGroup() (+13 more)

### Community 10 - "lib/motion.ts"
Cohesion: 0.09
Nodes (49): framer-motion, @tanstack/react-table, bar(), BarChart(), BarSeries, PAD, ChartFrame(), ChartSize (+41 more)

### Community 11 - "compilerOptions"
Cohesion: 0.06
Nodes (33): compilerOptions, allowJs, allowSyntheticDefaultImports, allowUnusedLabels, esModuleInterop, forceConsistentCasingInFileNames, incremental, isolatedModules (+25 more)

### Community 12 - "editors.ts"
Cohesion: 0.12
Nodes (19): editors, editors, longName, expectHeldRead(), expectRetainedRows(), expectSilentSheet(), expectVisibleBackdrop(), account (+11 more)

### Community 13 - "sidebar.tsx"
Cohesion: 0.08
Nodes (32): Providers(), AppearanceSwitch(), SidebarContent(), SidebarContext, SidebarContextProps, SidebarFooter(), SidebarGroup(), SidebarGroupAction() (+24 more)

### Community 14 - "Validator"
Cohesion: 0.28
Nodes (16): updateAccount(), validateBudget(), cleanInput(), dismissDuplicatePair(), fixDuplicates(), restoreDuplicatePair(), createMonthlyBudget(), setMonthlyBudgetAmount() (+8 more)

### Community 15 - "export-import.ts"
Cohesion: 0.16
Nodes (21): clearAllData(), downloadExport(), exportData(), importData(), monthlyBudgetFields(), parseImportFile(), tableCounts(), TableName (+13 more)

### Community 16 - "dependencies"
Cohesion: 0.07
Nodes (30): dependencies, @base-ui/react, class-variance-authority, clsx, cmdk, dexie, dexie-react-hooks, @fontsource-variable/inter (+22 more)

### Community 17 - "Button"
Cohesion: 0.11
Nodes (33): AccountCard(), AccountRow, AccountsPage(), BUDGET_STATES, BudgetCard(), BudgetsPage(), BudgetState, formatBudgetDateWindow() (+25 more)

### Community 19 - "next"
Cohesion: 0.15
Nodes (17): nextConfig, next, aggregateSeries(), CategoryHistoryChart(), ChartMonth, ChartSeries, MonthBreakdown(), MonthTick() (+9 more)

### Community 20 - "cn"
Cohesion: 0.14
Nodes (26): class-variance-authority, radix-ui, AppHeader(), ButtonGroup(), ButtonGroupSeparator(), ButtonGroupText(), buttonGroupVariants, FieldSeparator() (+18 more)

### Community 21 - "app.tsx"
Cohesion: 0.32
Nodes (5): react-dom, App(), HarnessSection, sectionFromLocation(), root

### Community 22 - "snapshot-hash.ts"
Cohesion: 0.33
Nodes (5): FinpointDB, withoutActionModes(), digestSnapshot(), hashLegacySnapshot(), Snapshot

### Community 23 - "suspicious"
Cohesion: 0.07
Nodes (28): suspicious, noAssignInExpressions, noAsyncPromiseExecutor, noCatchAssign, noClassAssign, noCompareNegZero, noControlCharactersInRegex, noDebugger (+20 more)

### Community 24 - "package.json"
Cohesion: 0.07
Nodes (29): private, $schema, type, babel-plugin-react-compiler, @biomejs/biome, clsx, cmdk, @fontsource-variable/inter (+21 more)

### Community 25 - "ledger.e2e.ts"
Cohesion: 0.11
Nodes (25): behaviourCoverage, componentInventory, facetNotApplicable, InventoryEntry, modalAnimationCoverage, notApplicable, openFacets, RouteEntry (+17 more)

### Community 26 - "correctness"
Cohesion: 0.08
Nodes (26): noConstantCondition, noConstAssign, noEmptyCharacterClassInRegex, noEmptyPattern, noGlobalObjectCalls, noInvalidBuiltinInstantiation, noInvalidConstructorSuper, noNonoctalDecimalEscape (+18 more)

### Community 27 - "suggestions.ts"
Cohesion: 0.10
Nodes (37): allocatedStatements(), asOf(), byDate(), CHIP_LIMIT, CHOICES, Clue, createModel(), DEFAULT_WEIGHTS (+29 more)

### Community 28 - "core/components.e2e.ts"
Cohesion: 0.15
Nodes (9): desktopOnly, bounds(), contained(), expectWheelScrollsPageWhileOpen(), expectDropdownPreservesScroll(), scrollWithInput(), settledOverlayAlpha(), APP_URL (+1 more)

### Community 29 - "drive-sync.ts"
Cohesion: 0.16
Nodes (33): AuthNeededError, cacheToken(), CodeResponse, disconnectDrive(), downloadBackupFile(), driveFetch(), DriveFileMeta, ensureDriveToken() (+25 more)

### Community 30 - "support/motion.ts"
Cohesion: 0.27
Nodes (12): attachSamplingFailure(), expectModalEntrance(), expectModalExit(), expectPopupEntrance(), matrixIsIdentity(), MotionFrame, MotionPose, poseIsIdentity() (+4 more)

### Community 31 - "core/routes.e2e.ts"
Cohesion: 0.22
Nodes (9): containedFooter(), PREMATURE, routeReady, titles, expectPointerCursor(), IDS, fits(), patchRows() (+1 more)

### Community 32 - "amount-filter.tsx"
Cohesion: 0.22
Nodes (24): PendingStatementConfirmationSheet(), RecordSearchSheet(), RecordsSheet(), StatementSearchSheet(), AmountFilter(), AmountRange, COMPARISONS, describe() (+16 more)

### Community 33 - "src/data/* (persistence, migrations, seeding, backup serialization, Drive storage)"
Cohesion: 0.38
Nodes (8): Background Drive sync, src/data/* (persistence, migrations, seeding, backup serialization, Drive storage), src/logic/* (domain reads and operations), (month) route-group shell (Overview + Monthly Records), src/routes.ts (centralized route paths), Static content pages (privacy, terms) are server components, UI layer (app pages + components), Workspace backup/reset operations

### Community 34 - "test-data.ts"
Cohesion: 0.13
Nodes (20): DEFAULT_CATEGORIES, DEFAULT_MONTHLY_BUDGETS, EXPORT_VERSION, FinpointExport, migrateRecordChoices(), SEED_HASH_KEY, BANK_BLURB, between() (+12 more)

### Community 35 - "components.json"
Cohesion: 0.09
Nodes (21): aliases, components, hooks, lib, ui, utils, iconLibrary, menuAccent (+13 more)

### Community 36 - "app-sidebar.tsx"
Cohesion: 0.21
Nodes (20): ReviewLinks(), AppearanceOption, APPEARANCES, AppSidebar(), SyncDot(), SYSTEM_APPEARANCE, useSyncIndicator(), ShellHeader() (+12 more)

### Community 37 - "auto-sync.ts"
Cohesion: 0.11
Nodes (26): SYNC_TABLES, useSyncStatus(), armPushTimer(), emit(), eventListeners, exclusive(), finishCycle(), getSyncSnapshot() (+18 more)

### Community 38 - "animations/tables.e2e.ts"
Cohesion: 0.18
Nodes (16): denseCardConsumers, denseRowConsumers, expectConsumerEntrance(), populatedConsumers, Child, october, september, installDateOnly() (+8 more)

### Community 39 - "types.d.ts"
Cohesion: 0.10
Nodes (20): Account, Allocation, AnalyticsSummary, AnalyticsTreatment, Appearance, Budget, Category, CategoryWithChildren (+12 more)

### Community 40 - "STYLE.md"
Cohesion: 0.09
Nodes (29): CONTEXT.md (domain vocabulary), Account, Allocation, Budget, Category, Duplicate Statement, Finpoint Domain Glossary, Monthly Budget (+21 more)

### Community 41 - "collectTests"
Cohesion: 0.28
Nodes (16): collectTests(), conditionBranch(), detailsTags(), disabled(), mentionsMotion(), record(), splitTestCallee(), tagValues() (+8 more)

### Community 42 - "statement-rules.ts"
Cohesion: 0.22
Nodes (13): byCreation(), conditionPattern(), deleteStatementRule(), listStatementRules(), matchesStatement(), NAME_ORDER, previewStatementRule(), recommendationAutofill() (+5 more)

### Community 43 - "ValidationError"
Cohesion: 0.23
Nodes (22): ensureAccount(), combine(), dbsDescriptionKey(), debitCreditAmount(), descriptionKey(), importDbs(), importFiles(), importOcbc() (+14 more)

### Community 44 - "use-appearance.tsx"
Cohesion: 0.26
Nodes (14): Appearance, applyAppearance(), getStoredAppearance(), handleSystemThemeChange(), initializeAppearance(), isDarkMode(), listeners, mediaQuery() (+6 more)

### Community 45 - "providers.tsx"
Cohesion: 0.42
Nodes (7): Boot(), preloadCategoryIcons(), seedIfEmpty(), useSyncToasts(), startAutoSync(), subscribeSyncEvents(), listCategoryIconNames()

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
Cohesion: 0.12
Nodes (31): db, round2(), BudgetDetail, BudgetFilters, createBudget(), getBudget(), listBudgets(), getMonthlyRecords() (+23 more)

### Community 51 - "Commands"
Cohesion: 0.38
Nodes (7): Biome (biome check --write), bun install, bun lint (write-mode), bun lint:check, bun run build, bun types:check, Commands

### Community 52 - "Next.js agent rules block ("This is NOT the Next.js you know")"
Cohesion: 0.22
Nodes (7): app/api/auth/* Route Handlers, node_modules/next/dist/server/lib/generate-agent-files.js, Google OAuth broker (exchange/token/logout), Next.js App Router app (mostly client-side), node_modules/next/dist/docs/, npm run dev (port 5173), Verification

### Community 53 - "spending-calendar.tsx"
Cohesion: 0.29
Nodes (9): compact(), heat(), INK, LEVELS, quantile(), rampCap(), SpendingCalendar(), STRENGTH (+1 more)

### Community 54 - "date-range.tsx"
Cohesion: 0.10
Nodes (29): MonthLayout(), lucide-react, react-day-picker, DateField(), Props, DateRangeValue, formatRange(), Props (+21 more)

### Community 55 - "biome.json"
Cohesion: 0.18
Nodes (10): source, assist, actions, files, includes, linter, enabled, overrides (+2 more)

### Community 56 - "rules"
Cohesion: 0.18
Nodes (11): noAdjacentSpacesInRegex, noBannedTypes, noExtraBooleanCast, noUselessCatch, noUselessThisAlias, noUselessTypeConstraint, rules, noFloatingPromises (+3 more)

### Community 57 - "manifest.json"
Cohesion: 0.20
Nodes (9): background_color, description, display, icons, name, scope, short_name, start_url (+1 more)

### Community 58 - "fixtures.ts"
Cohesion: 0.33
Nodes (9): getScenario(), assertSeeded(), checkSeededMarker(), countStore(), seedInBrowser(), seedWorkspace(), STORE_NAMES, waitForBoot() (+1 more)

### Community 59 - "scripts"
Cohesion: 0.22
Nodes (9): scripts, build, dev, lint, lint:check, start, test:e2e, types:check (+1 more)

### Community 60 - "(month)/page.tsx"
Cohesion: 0.11
Nodes (28): Comparison, comparisonRateText(), comparisonText(), ComparisonValue, DashboardData, DashboardMonthlyBudget, DashboardPage(), DashboardView (+20 more)

### Community 61 - "utils.ts"
Cohesion: 0.08
Nodes (59): PendingCard(), RecordPage(), AllocateBar(), CategoryMovers(), Mover, Sparkline(), DetailSummary(), DetailSummaryItem() (+51 more)

### Community 62 - "formatter"
Cohesion: 0.25
Nodes (8): formatter, attributePosition, enabled, formatWithErrors, indentStyle, indentWidth, lineEnding, lineWidth

### Community 63 - "Records"
Cohesion: 0.32
Nodes (8): Allocator, Budgets, Categories, Dashboard, Statement-allocation-record model, Monthly Budgets, Records, Statement importer

### Community 64 - "Project Shape"
Cohesion: 0.33
Nodes (6): Old Laravel Api/*Controller mapping, Laravel-shaped { field: string[] } error maps, Project Shape, React Compiler (enabled), ValidationError, Validator

### Community 65 - "Domain docs (single-context layout)"
Cohesion: 0.33
Nodes (7): Agent skills, CONTEXT.md, Domain docs (single-context layout), Domain Language, Issue tracker (local specs and tickets), .scratch/ local work tracking, String primary keys (not auto-increment)

### Community 66 - "optionalDependencies"
Cohesion: 0.29
Nodes (7): optionalDependencies, lightningcss-linux-x64-gnu, lightningcss-win32-x64-msvc, @rollup/rollup-linux-x64-gnu, @rollup/rollup-win32-x64-msvc, @tailwindcss/oxide-linux-x64-gnu, @tailwindcss/oxide-win32-x64-msvc

### Community 67 - "luxon"
Cohesion: 0.19
Nodes (16): luxon, BudgetProgressChart(), BudgetProgressPoint, buildSeries(), CashflowChart(), CashflowPoint, DailySpendingChart(), MonthlyBudgetLine (+8 more)

### Community 68 - "tsconfig.e2e.json"
Cohesion: 0.29
Nodes (6): ./tsconfig.json, compilerOptions, incremental, exclude, extends, include

### Community 69 - "style"
Cohesion: 0.33
Nodes (6): style, noNamespace, noNonNullAssertion, useArrayLiterals, useAsConstAssertion, useBlockStatements

### Community 70 - "duplicates/page.tsx"
Cohesion: 0.18
Nodes (42): AccountPage(), CARD_MOTION, DuplicateGroupCard(), FixDuplicatesPage(), GroupHeader(), highlightDifferences(), VIEWS, AllocatorPage() (+34 more)

### Community 71 - "vite.config.ts"
Cohesion: 0.29
Nodes (4): vite, @vitejs/plugin-react, harnessDir, repoRoot

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

### Community 94 - "history.tsx"
Cohesion: 0.39
Nodes (7): getStoredHistory(), getValidHistory(), HistoryContext, HistoryItem, HistoryProvider(), normaliseUrl(), withoutTrailingSelf()

### Community 95 - "src/components/*"
Cohesion: 0.25
Nodes (5): Agent Behavior, Generated / Ignored Files, src/components/*, src/components/ui/**/*, useLiveQuery

### Community 96 - "app/layout.tsx"
Cohesion: 0.25
Nodes (6): bun test, IndexedDB (Dexie), Domain and importer tests (Dexie with in-memory IndexedDB), metadata, RootLayout(), viewport

### Community 97 - "workflow-tabs.tsx"
Cohesion: 0.54
Nodes (6): WorkflowTabs(), useDefaultFilterEndDateToday(), useDefaultFilterStartDate(), useSettings(), pathAllocatorDuplicates(), pathAllocatorPending()

### Community 98 - "State persistence rule (ephemeral UI state vs IndexedDB)"
Cohesion: 0.33
Nodes (5): app/**/page.tsx, Interactive routes are "use client" (search params via next/navigation), Pages take no props, Root Suspense (keeps routes static), URL search params (filters and pagination)

### Community 99 - "db.ts"
Cohesion: 0.10
Nodes (29): AccountRow, AllocationRow, AnalyticsMonthRow, BudgetRecordRow, BudgetRow, CategoryRow, DB_NAME, DB_VERSION (+21 more)

## Knowledge Gaps
- **83 isolated node(s):** `@fontsource-variable/inter`, `shadcn`, `tailwindcss`, `tw-animate-css`, `@biomejs/biome` (+78 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 614 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **11 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `cn()` connect `cn` to `amount-filter.tsx`, `react`, `workflow-tabs.tsx`, `budgets/[id]/page.tsx`, `primitives.tsx`, `duplicates/page.tsx`, `command.tsx`, `lib/motion.ts`, `sidebar.tsx`, `Button`, `pagination.tsx`, `next`, `spending-calendar.tsx`, `date-range.tsx`, `(month)/page.tsx`, `utils.ts`?**
  _High betweenness centrality (0.104) - this node is a cross-community bridge._
- **What connects `@fontsource-variable/inter`, `shadcn`, `tailwindcss` to the rest of the system?**
  _83 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `react` be split into smaller, more focused modules?**
  _Cohesion score 0.07584789311408016 - nodes in this community are weakly interconnected._
- **Why does `react` connect `react` to `budgets/[id]/page.tsx`, `primitives.tsx`, `command.tsx`, `lib/motion.ts`, `sidebar.tsx`, `Button`, `next`, `cn`, `app.tsx`, `package.json`, `amount-filter.tsx`, `app-sidebar.tsx`, `auto-sync.ts`, `use-appearance.tsx`, `providers.tsx`, `pagination.tsx`, `spending-calendar.tsx`, `date-range.tsx`, `(month)/page.tsx`, `utils.ts`, `luxon`, `duplicates/page.tsx`, `history.tsx`, `app/layout.tsx`?**
  _High betweenness centrality (0.072) - this node is a cross-community bridge._
- **Should `ref_bun_test` be split into smaller, more focused modules?**
  _Cohesion score 0.06648936170212766 - nodes in this community are weakly interconnected._
- **Why does `src/data/* (persistence, migrations, seeding, backup serialization, Drive storage)` connect `src/data/* (persistence, migrations, seeding, backup serialization, Drive storage)` to `app/layout.tsx`, `providers.tsx`?**
  _High betweenness centrality (0.068) - this node is a cross-community bridge._
- **Should `Tests README` be split into smaller, more focused modules?**
  _Cohesion score 0.05928614640048397 - nodes in this community are weakly interconnected._