# Graph Report - t3-69efe8e6  (2026-11-08)

## Corpus Check
- cluster-only mode — file stats not available

## Summary
- 2004 nodes · 7949 edges · 103 communities (88 shown, 15 thin omitted)
- Extraction: 98% EXTRACTED · 2% INFERRED · 0% AMBIGUOUS · INFERRED: 129 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `5a8148cd`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- record-editor.tsx
- Button
- suggestions.ts
- primitives.tsx
- Tests README
- utils.ts
- ledger.e2e.ts
- dashboard.ts
- db.ts
- formatCurrency
- cn
- importer/page.tsx
- drive-sync.ts
- data.ts
- editors.ts
- compilerOptions
- luxon
- paginated-data-table.tsx
- records.ts
- dependencies
- fixtures.ts
- (month)/page.tsx
- app-sidebar.tsx
- suspicious
- package.json
- README.md
- auto-sync.ts
- support/motion.ts
- correctness
- command.tsx
- statements.ts
- core/components.e2e.ts
- trend-chart.tsx
- test-data.ts
- Validator
- budgets/[id]/page.tsx
- components.json
- export-import.ts
- types.d.ts
- CONTEXT.md
- core/routes.e2e.ts
- Input
- importer.ts
- auth-vault.ts
- use-appearance.tsx
- duplicates.ts
- alert-dialog.tsx
- providers.tsx
- formatter
- devDependencies
- pagination.tsx
- STYLE.md
- biome.json
- rules
- Next.js agent rules block ("This is NOT the Next.js you know")
- manifest.json
- spending-calendar.tsx
- SidebarMenuButton
- State persistence rule (ephemeral UI state vs IndexedDB)
- src/data/* (persistence, migrations, seeding, backup serialization, Drive storage)
- UI layer
- scripts
- formatter
- app.tsx
- navigation.e2e.ts
- Domain docs (single-context layout)
- Commands
- optionalDependencies
- tsconfig.e2e.json
- style
- 0002 Forecast pacing
- suggestions.test.ts
- 0001-drill-down-url-state.md
- src/components/*
- Validation rule (ValidationError + Validator)
- Finpoint icon concept
- Finpoint icon with charcoal shadow
- Issue tracker: Local Markdown
- Finpoint
- Allocation
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

## God Nodes (most connected - your core abstractions)
1. `cn()` - 325 edges
2. `PrimitivesSection()` - 181 edges
3. `Button()` - 125 edges
4. `react` - 99 edges
5. `formatCurrency()` - 82 edges
6. `RecordEditorDialog()` - 65 edges
7. `UiIcon()` - 59 edges
8. `RecordCreatorDialog()` - 58 edges
9. `round2()` - 48 edges
10. `pluralize()` - 46 edges

## Surprising Connections (you probably didn't know these)
- `Largest selection preserves amount order before pagination` --documents--> `Selection`  [INFERRED]
  docs/adr/0001-drill-down-url-state.md → src/logic/drilldown.ts
- `Copy` --references--> `pluralize()`  [INFERRED]
  STYLE.md → src/lib/utils.ts
- `Finpoint Style Additions` --references--> `ValidationError`  [INFERRED]
  STYLE.md → src/logic/validate.ts
- `Finpoint Style Additions` --references--> `useApiFormErrors()`  [INFERRED]
  STYLE.md → src/hooks/use-api-form-errors.ts
- `Boot()` --indirect_call--> `preloadCategoryIcons()`  [INFERRED]
  app/providers.tsx → src/components/icon.tsx

## Import Cycles
- None detected.

## Communities (103 total, 15 thin omitted)

### Community 0 - "record-editor.tsx"
Cohesion: 0.06
Nodes (119): SECTIONS, @base-ui/react, framer-motion, sonner, @tanstack/react-form, AccountDialog(), BudgetCreatorDialog(), BudgetEditorDialog() (+111 more)

### Community 1 - "Button"
Cohesion: 0.06
Nodes (115): AccountPage(), AccountCard(), AccountRow, AccountsPage(), AllocatorPage(), BUDGET_STATES, BudgetCard(), BudgetsPage() (+107 more)

### Community 2 - "suggestions.ts"
Cohesion: 0.07
Nodes (56): Rule, RuleSentence(), StatementRulesPage(), ruleValueLabel(), StatementRow, TREATMENT_VALUES, byCreation(), conditionPattern() (+48 more)

### Community 3 - "primitives.tsx"
Cohesion: 0.08
Nodes (55): AlertAction(), ComboboxChip(), ComboboxChips(), ComboboxChipsInput(), ComboboxCollection(), ComboboxEmpty(), ComboboxGroup(), ComboboxLabel() (+47 more)

### Community 4 - "Tests README"
Cohesion: 0.06
Nodes (41): Build harness step (vite build tests/harness), Playwright browser cache keyed on bun.lock, blob report merge, Committed graph artifacts (graph.json, GRAPH_REPORT.md, manifest.json, .graphify_labels.json), Graph health warnings and refresh failure reporting, graphify-out/graph.json, graphify skill (--update), graphify update . (+33 more)

### Community 5 - "utils.ts"
Cohesion: 0.10
Nodes (37): MonthLayout(), class-variance-authority, lucide-react, radix-ui, react, react-day-picker, DateField(), Props (+29 more)

### Community 6 - "ledger.e2e.ts"
Cohesion: 0.07
Nodes (46): typescript, vite, @vitejs/plugin-react, behaviourCoverage, componentInventory, facetNotApplicable, InventoryEntry, modalAnimationCoverage (+38 more)

### Community 7 - "dashboard.ts"
Cohesion: 0.12
Nodes (38): db, contribution(), summarize(), avg(), BREAKDOWN_MONTHS, buildCashflowHistory(), buildCategories(), buildComparison() (+30 more)

### Community 8 - "db.ts"
Cohesion: 0.09
Nodes (17): dexie, fake-indexeddb, xlsx, DB_NAME, DB_VERSION, FinpointDB, MetaRow, SettingsRow (+9 more)

### Community 9 - "formatCurrency"
Cohesion: 0.15
Nodes (31): AllocationProgress(), AllocationExpansion(), AllocationRows(), AllocationSource, DrillPanel(), Icon(), RecordAmount(), RecordOption() (+23 more)

### Community 10 - "cn"
Cohesion: 0.11
Nodes (33): AppHeader(), ButtonGroupSeparator(), FieldSeparator(), ItemSeparator(), ScrollArea(), ScrollBar(), Separator(), SidebarContent() (+25 more)

### Community 11 - "importer/page.tsx"
Cohesion: 0.17
Nodes (30): ACCEPT, BANKS_REQUIRING_ADDITIONAL_INFO, ImporterPage(), Step(), metadata, PrivacyPage(), SECTIONS, RecordPage() (+22 more)

### Community 12 - "drive-sync.ts"
Cohesion: 0.16
Nodes (33): exportData(), AuthNeededError, cacheToken(), CodeResponse, disconnectDrive(), downloadBackupFile(), driveFetch(), DriveFileMeta (+25 more)

### Community 13 - "data.ts"
Cohesion: 0.08
Nodes (24): AccountRow, AllocationRow, AnalyticsMonthRow, BudgetRecordRow, BudgetRow, CategoryRow, DuplicateDismissalRow, MonthlyBudgetAmountRow (+16 more)

### Community 14 - "editors.ts"
Cohesion: 0.14
Nodes (20): editors, editors, longName, expectHeldRead(), expectRetainedRows(), expectSilentSheet(), expectVisibleBackdrop(), account (+12 more)

### Community 15 - "compilerOptions"
Cohesion: 0.06
Nodes (33): compilerOptions, allowJs, allowSyntheticDefaultImports, allowUnusedLabels, esModuleInterop, forceConsistentCasingInFileNames, incremental, isolatedModules (+25 more)

### Community 16 - "luxon"
Cohesion: 0.14
Nodes (23): Largest selection preserves amount order before pagination, CategoryTile(), luxon, CashflowChart(), CashflowPoint, aggregateSeries(), CategoryHistoryChart(), ChartMonth (+15 more)

### Community 17 - "paginated-data-table.tsx"
Cohesion: 0.20
Nodes (27): @tanstack/react-table, DataTable(), PaginatedDataTable(), PaginationHeader(), GroupHeaderRow(), groupStarts(), GroupTotal(), isInteractiveTarget() (+19 more)

### Community 18 - "records.ts"
Cohesion: 0.15
Nodes (26): RecordRow, canUseMonthlyBudget(), round2(), summaryMeasure(), getBudget(), getDrilldown(), AllocationTally, pendingStatementIds() (+18 more)

### Community 19 - "dependencies"
Cohesion: 0.07
Nodes (30): dependencies, @base-ui/react, class-variance-authority, clsx, cmdk, dexie, dexie-react-hooks, @fontsource-variable/inter (+22 more)

### Community 20 - "fixtures.ts"
Cohesion: 0.14
Nodes (18): cardTitles, card(), chartTooltip, overview, overviewCharts, themedRgb(), ScenarioName, WorkspaceDataset (+10 more)

### Community 21 - "(month)/page.tsx"
Cohesion: 0.13
Nodes (25): AttentionList(), Comparison, comparisonText(), ComparisonValue, DashboardData, DashboardMonthlyBudget, DashboardPage(), DashboardView (+17 more)

### Community 22 - "app-sidebar.tsx"
Cohesion: 0.20
Nodes (26): AppearanceOption, APPEARANCES, AppearanceSwitch(), AppSidebar(), SyncDot(), SYSTEM_APPEARANCE, useSyncIndicator(), ShellHeader() (+18 more)

### Community 23 - "suspicious"
Cohesion: 0.07
Nodes (28): suspicious, noAssignInExpressions, noAsyncPromiseExecutor, noCatchAssign, noClassAssign, noCompareNegZero, noControlCharactersInRegex, noDebugger (+20 more)

### Community 24 - "package.json"
Cohesion: 0.07
Nodes (26): private, $schema, type, babel-plugin-react-compiler, @biomejs/biome, clsx, cmdk, @fontsource-variable/inter (+18 more)

### Community 25 - "README.md"
Cohesion: 0.07
Nodes (26): Allocate workspace, Allocations, Backup and restore, Categories, Custom-period Budgets, Dashboard, Demo data, Financial terms definitions (+18 more)

### Community 26 - "auto-sync.ts"
Cohesion: 0.12
Nodes (25): SYNC_TABLES, useSyncStatus(), emit(), eventListeners, finishCycle(), flushOnHide(), getSyncSnapshot(), ingestManualResult() (+17 more)

### Community 27 - "support/motion.ts"
Cohesion: 0.17
Nodes (20): denseCardConsumers, denseRowConsumers, expectConsumerEntrance(), populatedConsumers, attachSamplingFailure(), expectModalEntrance(), expectModalExit(), expectPopupEntrance() (+12 more)

### Community 28 - "correctness"
Cohesion: 0.08
Nodes (26): noConstantCondition, noConstAssign, noEmptyCharacterClassInRegex, noEmptyPattern, noGlobalObjectCalls, noInvalidBuiltinInstantiation, noInvalidConstructorSuper, noNonoctalDecimalEscape (+18 more)

### Community 29 - "command.tsx"
Cohesion: 0.16
Nodes (21): CategoryFilter(), CategoryFilterItem(), ComboboxClear(), ComboboxInput(), ComboboxTrigger(), Command(), CommandEmpty(), CommandGroup() (+13 more)

### Community 30 - "statements.ts"
Cohesion: 0.17
Nodes (21): asPending(), AnalyticsRecord, AnalyticsSummary, dayDifference(), ensureCanReplace(), maskDescription(), ReplacementAllocation, replacementComparison() (+13 more)

### Community 31 - "core/components.e2e.ts"
Cohesion: 0.13
Nodes (12): desktopOnly, bounds(), contained(), expectWheelScrollsPageWhileOpen(), containedFooter(), expectDropdownPreservesScroll(), expectPointerCursor(), scrollWithInput() (+4 more)

### Community 32 - "trend-chart.tsx"
Cohesion: 0.16
Nodes (18): bar(), BarChart(), BarSeries, PAD, BudgetProgressChart(), BudgetProgressPoint, buildSeries(), ChartFrame() (+10 more)

### Community 33 - "test-data.ts"
Cohesion: 0.13
Nodes (20): DEFAULT_CATEGORIES, DEFAULT_MONTHLY_BUDGETS, EXPORT_VERSION, FinpointExport, SEED_HASH_KEY, seedIfEmpty(), BANK_BLURB, between() (+12 more)

### Community 34 - "Validator"
Cohesion: 0.29
Nodes (15): updateAccount(), validateBudget(), cleanInput(), dismissDuplicatePair(), restoreDuplicatePair(), createMonthlyBudget(), setMonthlyBudgetAmount(), updateMonthlyBudget() (+7 more)

### Community 35 - "budgets/[id]/page.tsx"
Cohesion: 0.19
Nodes (17): BudgetPage(), getBudgetAnalytics(), getCategoryData(), Legend(), AllocateBar(), Sparkline(), DetailSummary(), DetailSummaryItem() (+9 more)

### Community 36 - "components.json"
Cohesion: 0.09
Nodes (21): aliases, components, hooks, lib, ui, utils, iconLibrary, menuAccent (+13 more)

### Community 37 - "export-import.ts"
Cohesion: 0.20
Nodes (17): clearAllData(), downloadExport(), importData(), monthlyBudgetFields(), parseImportFile(), tableCounts(), TableName, TABLES (+9 more)

### Community 38 - "types.d.ts"
Cohesion: 0.10
Nodes (20): Account, Allocation, AnalyticsSummary, AnalyticsTreatment, Appearance, Budget, Category, CategoryWithChildren (+12 more)

### Community 39 - "CONTEXT.md"
Cohesion: 0.13
Nodes (19): Allocate, Budget, Category, Drill-down, Duplicate Statement, Irregular, Left over, Monthly Budget (+11 more)

### Community 40 - "core/routes.e2e.ts"
Cohesion: 0.18
Nodes (13): @playwright/test, Child, october, september, PREMATURE, routeReady, titles, installDateOnly() (+5 more)

### Community 41 - "Input"
Cohesion: 0.37
Nodes (14): PendingStatementConfirmationSheet(), RecordSearchSheet(), StatementOption(), StatementSearchSheet(), Input(), Sheet(), SheetContent(), SheetDescription() (+6 more)

### Community 42 - "importer.ts"
Cohesion: 0.25
Nodes (19): ensureAccount(), combine(), dbsDescriptionKey(), debitCreditAmount(), descriptionKey(), importDbs(), importFiles(), importOcbc() (+11 more)

### Community 43 - "auth-vault.ts"
Cohesion: 0.29
Nodes (14): POST(), POST(), POST(), jose, AUTH_COOKIE_NAME, authCookie(), authCookieConfig(), clientIp() (+6 more)

### Community 44 - "use-appearance.tsx"
Cohesion: 0.23
Nodes (15): Toaster(), Appearance, applyAppearance(), getStoredAppearance(), handleSystemThemeChange(), initializeAppearance(), isDarkMode(), listeners (+7 more)

### Community 45 - "duplicates.ts"
Cohesion: 0.21
Nodes (16): allocationOutcome(), descriptionAnchors(), descriptionIdentity(), DuplicateGroup, duplicateGroups(), DuplicateStatement, duplicateStatementIds(), eligible() (+8 more)

### Community 46 - "alert-dialog.tsx"
Cohesion: 0.34
Nodes (12): DriveOverwriteConfirmation(), AlertDialog(), AlertDialogAction(), AlertDialogCancel(), AlertDialogContent(), AlertDialogDescription(), AlertDialogFooter(), AlertDialogHeader() (+4 more)

### Community 47 - "providers.tsx"
Cohesion: 0.24
Nodes (10): metadata, RootLayout(), viewport, Boot(), Providers(), @vercel/analytics, @vercel/speed-insights, useSyncToasts() (+2 more)

### Community 48 - "formatter"
Cohesion: 0.15
Nodes (13): arrowParentheses, bracketSameLine, bracketSpacing, jsxQuoteStyle, quoteProperties, quoteStyle, semicolons, trailingCommas (+5 more)

### Community 49 - "devDependencies"
Cohesion: 0.15
Nodes (13): devDependencies, babel-plugin-react-compiler, @biomejs/biome, fake-indexeddb, @playwright/test, @tailwindcss/postcss, @types/luxon, @types/node (+5 more)

### Community 50 - "pagination.tsx"
Cohesion: 0.38
Nodes (11): pageHref(), pageWindow(), PaginationFooter(), Pagination(), PaginationContent(), PaginationEllipsis(), PaginationItem(), PaginationLink() (+3 more)

### Community 51 - "STYLE.md"
Cohesion: 0.18
Nodes (11): APIs, Arguments, And Props, Code Style, Consistency, Core, Earning Its Place, Grouping And Order, Motion and polish, React / TypeScript style (import type, isOpen/setIsOpen) (+3 more)

### Community 52 - "biome.json"
Cohesion: 0.18
Nodes (10): source, assist, actions, files, includes, linter, enabled, overrides (+2 more)

### Community 53 - "rules"
Cohesion: 0.18
Nodes (11): noAdjacentSpacesInRegex, noBannedTypes, noExtraBooleanCast, noUselessCatch, noUselessThisAlias, noUselessTypeConstraint, rules, noFloatingPromises (+3 more)

### Community 54 - "Next.js agent rules block ("This is NOT the Next.js you know")"
Cohesion: 0.22
Nodes (7): app/api/auth/* Route Handlers, node_modules/next/dist/server/lib/generate-agent-files.js, Google OAuth broker (exchange/token/logout), Next.js App Router app (mostly client-side), node_modules/next/dist/docs/, npm run dev (port 5173), Verification

### Community 55 - "manifest.json"
Cohesion: 0.20
Nodes (9): background_color, description, display, icons, name, scope, short_name, start_url (+1 more)

### Community 56 - "spending-calendar.tsx"
Cohesion: 0.29
Nodes (9): compact(), heat(), INK, LEVELS, quantile(), rampCap(), SpendingCalendar(), STRENGTH (+1 more)

### Community 57 - "SidebarMenuButton"
Cohesion: 0.38
Nodes (8): DEFINITIONS, Term(), SidebarMenuButton(), sidebarMenuButtonVariants, Tooltip(), TooltipContent(), TooltipProvider(), TooltipTrigger()

### Community 58 - "State persistence rule (ephemeral UI state vs IndexedDB)"
Cohesion: 0.22
Nodes (6): app/**/page.tsx, Interactive routes are "use client" (search params via next/navigation), Pages take no props, Root Suspense (keeps routes static), URL search params (filters and pagination), useLiveQuery

### Community 59 - "src/data/* (persistence, migrations, seeding, backup serialization, Drive storage)"
Cohesion: 0.36
Nodes (7): Background Drive sync, bun test, src/data/* (persistence, migrations, seeding, backup serialization, Drive storage), IndexedDB (Dexie), Domain and importer tests (Dexie with in-memory IndexedDB), src/logic/* (domain reads and operations), Workspace backup/reset operations

### Community 60 - "UI layer"
Cohesion: 0.31
Nodes (8): Domain logic, Dashboard month route-group shell, Persistence, Project Shape, React Compiler (enabled), src/routes.ts (centralized route paths), Static content pages (privacy, terms) are server components, UI layer

### Community 61 - "scripts"
Cohesion: 0.22
Nodes (9): scripts, build, dev, lint, lint:check, start, test:e2e, types:check (+1 more)

### Community 62 - "formatter"
Cohesion: 0.25
Nodes (8): formatter, attributePosition, enabled, formatWithErrors, indentStyle, indentWidth, lineEnding, lineWidth

### Community 63 - "app.tsx"
Cohesion: 0.32
Nodes (5): react-dom, App(), HarnessSection, sectionFromLocation(), root

### Community 65 - "Domain docs (single-context layout)"
Cohesion: 0.33
Nodes (7): Agent skills, CONTEXT.md, Domain docs (single-context layout), Domain Language, Issue tracker (local specs and tickets), .scratch/ local work tracking, String primary keys (not auto-increment)

### Community 66 - "Commands"
Cohesion: 0.38
Nodes (7): Biome (biome check --write), bun install, bun lint (write-mode), bun lint:check, bun run build, bun types:check, Commands

### Community 67 - "optionalDependencies"
Cohesion: 0.29
Nodes (7): optionalDependencies, lightningcss-linux-x64-gnu, lightningcss-win32-x64-msvc, @rollup/rollup-linux-x64-gnu, @rollup/rollup-win32-x64-msvc, @tailwindcss/oxide-linux-x64-gnu, @tailwindcss/oxide-win32-x64-msvc

### Community 68 - "tsconfig.e2e.json"
Cohesion: 0.29
Nodes (6): ./tsconfig.json, compilerOptions, incremental, exclude, extends, include

### Community 69 - "style"
Cohesion: 0.33
Nodes (6): style, noNamespace, noNonNullAssertion, useArrayLiterals, useAsConstAssertion, useBlockStatements

### Community 70 - "0002 Forecast pacing"
Cohesion: 0.33
Nodes (5): 0002 Forecast pacing, Consequences, Context, Decision, Rejected option

### Community 71 - "suggestions.test.ts"
Cohesion: 0.53
Nodes (4): decided(), live(), record(), statement()

### Community 72 - "0001-drill-down-url-state.md"
Cohesion: 0.40
Nodes (4): Compare selection uses included comparison months and title-based uniqueness, Gross and net category selection URL, Comparison window, Drill-down URL state

### Community 73 - "src/components/*"
Cohesion: 0.40
Nodes (4): Agent Behavior, Generated / Ignored Files, src/components/*, src/components/ui/**/*

### Community 74 - "Validation rule (ValidationError + Validator)"
Cohesion: 0.50
Nodes (4): Old Laravel Api/*Controller mapping, Laravel-shaped { field: string[] } error maps, ValidationError, Validator

### Community 75 - "Finpoint icon concept"
Cohesion: 0.40
Nodes (5): Finpoint icon concept, Charcoal shadow halo, Circular point, Rounded F monogram, Off-white icon fill

### Community 76 - "Finpoint icon with charcoal shadow"
Cohesion: 0.40
Nodes (5): Finpoint icon with charcoal shadow, Charcoal shadow halo, Circular point, Rounded F monogram, Off-white icon fill

### Community 77 - "Issue tracker: Local Markdown"
Cohesion: 0.40
Nodes (4): Files, Issue tracker: Local Markdown, Skill operations, Status and dependencies

### Community 78 - "Finpoint"
Cohesion: 0.50
Nodes (4): Finpoint, Circular point, Rounded F monogram, Off-white icon fill

### Community 79 - "Allocation"
Cohesion: 0.50
Nodes (4): Account, Allocation, Statement, Copy

### Community 80 - "Domain docs"
Cohesion: 0.50
Nodes (3): Before exploration, Domain docs, Writing

### Community 81 - "Local Markdown Issue Tracker"
Cohesion: 0.50
Nodes (4): Local Tracker Operations, Spec and Ticket Files, Ticket Lifecycle, Local Markdown Issue Tracker

### Community 83 - "Forecast pacing decision"
Cohesion: 0.67
Nodes (3): Forecast pacing decision, Remaining historical spending scaled by remaining days, Median daily spending fallback including zero days

### Community 84 - "F monogram icon"
Cohesion: 0.67
Nodes (3): Circular dot beside F, Rounded F letterform, F monogram icon

### Community 85 - "JPG favicon icon"
Cohesion: 0.67
Nodes (3): JPG favicon dot, JPG favicon F letterform, JPG favicon icon

### Community 86 - "PNG favicon icon"
Cohesion: 0.67
Nodes (3): PNG favicon dot, PNG favicon F letterform, PNG favicon icon

### Community 87 - "SVG favicon icon"
Cohesion: 0.67
Nodes (3): SVG favicon dot, SVG favicon F letterform, SVG favicon icon

### Community 88 - "F monogram icon"
Cohesion: 0.67
Nodes (3): Circular dot beside F, Rounded F letterform, F monogram icon

### Community 89 - "F monogram icon"
Cohesion: 0.67
Nodes (3): Circular dot beside F, Rounded F letterform, F monogram icon

## Knowledge Gaps
- **123 isolated node(s):** `Build app step`, `Build harness step (tests/harness/vite.config.ts)`, `Playwright browser cache (keyed on bun.lock)`, `Graph health warnings and refresh failure reporting`, `gitmoji.dev` (+118 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 636 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **15 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `cn()` connect `cn` to `record-editor.tsx`, `Button`, `suggestions.ts`, `primitives.tsx`, `utils.ts`, `formatCurrency`, `importer/page.tsx`, `luxon`, `paginated-data-table.tsx`, `(month)/page.tsx`, `app-sidebar.tsx`, `command.tsx`, `trend-chart.tsx`, `budgets/[id]/page.tsx`, `Input`, `alert-dialog.tsx`, `pagination.tsx`, `spending-calendar.tsx`, `SidebarMenuButton`?**
  _High betweenness centrality (0.100) - this node is a cross-community bridge._
- **What connects `Build app step`, `Build harness step (tests/harness/vite.config.ts)`, `Playwright browser cache (keyed on bun.lock)` to the rest of the system?**
  _123 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `record-editor.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.06246937775600196 - nodes in this community are weakly interconnected._
- **Why does `react` connect `utils.ts` to `record-editor.tsx`, `Button`, `suggestions.ts`, `primitives.tsx`, `formatCurrency`, `cn`, `importer/page.tsx`, `luxon`, `paginated-data-table.tsx`, `(month)/page.tsx`, `app-sidebar.tsx`, `package.json`, `auto-sync.ts`, `command.tsx`, `trend-chart.tsx`, `budgets/[id]/page.tsx`, `Input`, `use-appearance.tsx`, `alert-dialog.tsx`, `providers.tsx`, `pagination.tsx`, `spending-calendar.tsx`, `SidebarMenuButton`, `app.tsx`?**
  _High betweenness centrality (0.066) - this node is a cross-community bridge._
- **Should `Button` be split into smaller, more focused modules?**
  _Cohesion score 0.0647438131753224 - nodes in this community are weakly interconnected._
- **Why does `pluralize()` connect `Button` to `record-editor.tsx`, `suggestions.ts`, `utils.ts`, `dashboard.ts`, `formatCurrency`, `Input`, `importer/page.tsx`, `Allocation`, `luxon`, `(month)/page.tsx`, `app-sidebar.tsx`?**
  _High betweenness centrality (0.056) - this node is a cross-community bridge._
- **Should `suggestions.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.06768905341089371 - nodes in this community are weakly interconnected._