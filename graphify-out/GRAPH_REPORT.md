# Graph Report - t3-69efe8e6  (2026-11-08)

## Corpus Check
- cluster-only mode — file stats not available

## Summary
- 2007 nodes · 7959 edges · 101 communities (86 shown, 15 thin omitted)
- Extraction: 98% EXTRACTED · 2% INFERRED · 0% AMBIGUOUS · INFERRED: 129 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `f5682c48`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- Button
- record-editor.tsx
- primitives.tsx
- Tests README
- dashboard.ts
- sidebar.tsx
- lib/motion.ts
- (month)/page.tsx
- records.ts
- db.ts
- suggestions.ts
- statements.ts
- drive-sync.ts
- compilerOptions
- data.ts
- Card
- (month)/layout.tsx
- cn
- package.json
- animations/editors.e2e.ts
- editors.ts
- dependencies
- export-import.ts
- fixtures.ts
- ledger.e2e.ts
- suspicious
- amount-filter.tsx
- correctness
- Validator
- luxon
- sync/page.tsx
- README.md
- components.json
- CONTEXT.md
- core/components.e2e.ts
- formatCurrency
- statement-rules.ts
- providers.tsx
- core/routes.e2e.ts
- types.d.ts
- trend-chart.tsx
- auto-sync.ts
- importer.ts
- UI layer
- auth-vault.ts
- collectTests
- use-appearance.tsx
- budgets/[id]/page.tsx
- STYLE.md
- displays.tsx
- alert-dialog.tsx
- formatter
- devDependencies
- pagination.tsx
- Commands
- app.tsx
- biome.json
- rules
- src/data/* (persistence, migrations, seeding, backup serialization, Drive storage)
- manifest.json
- spending-calendar.tsx
- Next.js agent rules block ("This is NOT the Next.js you know")
- scripts
- formatter
- navigation.e2e.ts
- Domain docs (single-context layout)
- optionalDependencies
- vite.config.ts
- tsconfig.e2e.json
- style
- 0002 Forecast pacing
- 0001-drill-down-url-state.md
- Validation rule (ValidationError + Validator)
- Finpoint icon concept
- Finpoint icon with charcoal shadow
- Issue tracker: Local Markdown
- Dashboard
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

## God Nodes (most connected - your core abstractions)
1. `cn()` - 325 edges
2. `PrimitivesSection()` - 181 edges
3. `Button()` - 125 edges
4. `react` - 99 edges
5. `formatCurrency()` - 84 edges
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

## Communities (101 total, 15 thin omitted)

### Community 0 - "Button"
Cohesion: 0.06
Nodes (135): AccountPage(), AccountCard(), AccountRow, AccountsPage(), AllocatorPage(), BUDGET_STATES, BudgetCard(), BudgetsPage() (+127 more)

### Community 1 - "record-editor.tsx"
Cohesion: 0.07
Nodes (109): SECTIONS, sonner, @tanstack/react-form, AccountDialog(), BudgetCreatorDialog(), BudgetEditorDialog(), CategoryDialog(), CategoryFormValues (+101 more)

### Community 2 - "primitives.tsx"
Cohesion: 0.09
Nodes (53): Props, AlertAction(), CardFooter(), ComboboxChip(), ComboboxChips(), ComboboxChipsInput(), ComboboxClear(), ComboboxCollection() (+45 more)

### Community 3 - "Tests README"
Cohesion: 0.06
Nodes (41): Build harness step (vite build tests/harness), Playwright browser cache keyed on bun.lock, blob report merge, Committed graph artifacts (graph.json, GRAPH_REPORT.md, manifest.json, .graphify_labels.json), Graph health warnings and refresh failure reporting, graphify-out/graph.json, graphify skill (--update), graphify update . (+33 more)

### Community 4 - "dashboard.ts"
Cohesion: 0.10
Nodes (44): AnalyticsRecord, AnalyticsSummary, contribution(), summarize(), avg(), BREAKDOWN_MONTHS, buildCashflowHistory(), buildCategories() (+36 more)

### Community 5 - "sidebar.tsx"
Cohesion: 0.09
Nodes (42): Providers(), AppearanceOption, APPEARANCES, AppearanceSwitch(), AppSidebar(), SyncDot(), SYSTEM_APPEARANCE, useSyncIndicator() (+34 more)

### Community 6 - "lib/motion.ts"
Cohesion: 0.14
Nodes (35): framer-motion, @tanstack/react-table, DataTable(), PaginatedDataTable(), GroupHeaderRow(), groupStarts(), GroupTotal(), isInteractiveTarget() (+27 more)

### Community 7 - "(month)/page.tsx"
Cohesion: 0.11
Nodes (37): AttentionList(), Comparison, comparisonText(), ComparisonValue, DashboardData, DashboardMonthlyBudget, DashboardPage(), DashboardView (+29 more)

### Community 8 - "records.ts"
Cohesion: 0.10
Nodes (30): AllocationExpansion(), AllocationRows(), AllocationSource, AllocationRow, round2(), BudgetDetail, BudgetFilters, createBudget() (+22 more)

### Community 9 - "db.ts"
Cohesion: 0.10
Nodes (18): dexie, fake-indexeddb, xlsx, DB_NAME, DB_VERSION, FinpointDB, MetaRow, SettingsRow (+10 more)

### Community 10 - "suggestions.ts"
Cohesion: 0.10
Nodes (37): allocatedStatements(), asOf(), byDate(), CHIP_LIMIT, CHOICES, Clue, createModel(), DEFAULT_WEIGHTS (+29 more)

### Community 11 - "statements.ts"
Cohesion: 0.12
Nodes (34): asPending(), allocationOutcome(), descriptionAnchors(), descriptionIdentity(), DuplicateGroup, duplicateGroups(), DuplicateStatement, duplicateStatementIds() (+26 more)

### Community 12 - "drive-sync.ts"
Cohesion: 0.16
Nodes (33): exportData(), AuthNeededError, cacheToken(), CodeResponse, disconnectDrive(), downloadBackupFile(), driveFetch(), DriveFileMeta (+25 more)

### Community 13 - "compilerOptions"
Cohesion: 0.06
Nodes (33): compilerOptions, allowJs, allowSyntheticDefaultImports, allowUnusedLabels, esModuleInterop, forceConsistentCasingInFileNames, incremental, isolatedModules (+25 more)

### Community 14 - "data.ts"
Cohesion: 0.09
Nodes (23): AccountRow, AnalyticsMonthRow, BudgetRecordRow, BudgetRow, CategoryRow, DuplicateDismissalRow, MonthlyBudgetAmountRow, MonthlyBudgetDefaultRow (+15 more)

### Community 15 - "Card"
Cohesion: 0.17
Nodes (27): ImporterPage(), Step(), metadata, PrivacyPage(), SECTIONS, RecordPage(), MethodHeader(), metadata (+19 more)

### Community 16 - "(month)/layout.tsx"
Cohesion: 0.13
Nodes (27): MonthLayout(), @base-ui/react, lucide-react, DateField(), CategoryFilter(), CategoryFilterItem(), Command(), CommandEmpty() (+19 more)

### Community 17 - "cn"
Cohesion: 0.14
Nodes (26): class-variance-authority, radix-ui, AppHeader(), ButtonGroup(), ButtonGroupSeparator(), ButtonGroupText(), buttonGroupVariants, FieldSeparator() (+18 more)

### Community 18 - "package.json"
Cohesion: 0.06
Nodes (30): private, $schema, type, babel-plugin-react-compiler, @biomejs/biome, clsx, cmdk, @fontsource-variable/inter (+22 more)

### Community 19 - "animations/editors.e2e.ts"
Cohesion: 0.14
Nodes (22): editors, denseCardConsumers, denseRowConsumers, expectConsumerEntrance(), populatedConsumers, chooseCategory(), attachSamplingFailure(), expectModalEntrance() (+14 more)

### Community 20 - "editors.ts"
Cohesion: 0.14
Nodes (19): containedFooter(), editors, longName, expectHeldRead(), expectRetainedRows(), expectSilentSheet(), expectVisibleBackdrop(), account (+11 more)

### Community 21 - "dependencies"
Cohesion: 0.07
Nodes (30): dependencies, @base-ui/react, class-variance-authority, clsx, cmdk, dexie, dexie-react-hooks, @fontsource-variable/inter (+22 more)

### Community 22 - "export-import.ts"
Cohesion: 0.12
Nodes (22): EXPORT_VERSION, FinpointExport, TableName, TABLES, migrateRecordChoices(), DEFAULT_SETTINGS, FinpointSettings, readSettings() (+14 more)

### Community 23 - "fixtures.ts"
Cohesion: 0.14
Nodes (18): cardTitles, card(), chartTooltip, overview, overviewCharts, themedRgb(), ScenarioName, WorkspaceDataset (+10 more)

### Community 24 - "ledger.e2e.ts"
Cohesion: 0.11
Nodes (25): behaviourCoverage, componentInventory, facetNotApplicable, InventoryEntry, modalAnimationCoverage, notApplicable, openFacets, RouteEntry (+17 more)

### Community 25 - "suspicious"
Cohesion: 0.07
Nodes (28): suspicious, noAssignInExpressions, noAsyncPromiseExecutor, noCatchAssign, noClassAssign, noCompareNegZero, noControlCharactersInRegex, noDebugger (+20 more)

### Community 26 - "amount-filter.tsx"
Cohesion: 0.19
Nodes (25): PendingStatementConfirmationSheet(), RecordSearchSheet(), StatementSearchSheet(), AmountFilter(), AmountRange, COMPARISONS, describe(), Draft (+17 more)

### Community 27 - "correctness"
Cohesion: 0.08
Nodes (26): noConstantCondition, noConstAssign, noEmptyCharacterClassInRegex, noEmptyPattern, noGlobalObjectCalls, noInvalidBuiltinInstantiation, noInvalidConstructorSuper, noNonoctalDecimalEscape (+18 more)

### Community 28 - "Validator"
Cohesion: 0.28
Nodes (16): updateAccount(), validateBudget(), cleanInput(), dismissDuplicatePair(), restoreDuplicatePair(), createMonthlyBudget(), setMonthlyBudgetAmount(), updateMonthlyBudget() (+8 more)

### Community 29 - "luxon"
Cohesion: 0.17
Nodes (16): Largest selection preserves amount order before pagination, CategoryTile(), luxon, CashflowChart(), CashflowPoint, CategoryMovers(), Mover, MonthlyBudgetUsage() (+8 more)

### Community 30 - "sync/page.tsx"
Cohesion: 0.16
Nodes (23): COUNT_ROWS, DataSettingsPage(), StateRow(), STATUS_TONES, StatusTone, WorkspaceRow(), downloadExport(), importData() (+15 more)

### Community 31 - "README.md"
Cohesion: 0.08
Nodes (24): Allocate workspace, Allocations, Backup and restore, Categories, Custom-period Budgets, Demo data, Financial terms definitions, Finpoint (+16 more)

### Community 32 - "components.json"
Cohesion: 0.09
Nodes (21): aliases, components, hooks, lib, ui, utils, iconLibrary, menuAccent (+13 more)

### Community 33 - "CONTEXT.md"
Cohesion: 0.12
Nodes (21): Account, Allocate, Budget, Category, Drill-down, Duplicate Statement, Irregular, Left over (+13 more)

### Community 34 - "core/components.e2e.ts"
Cohesion: 0.14
Nodes (10): desktopOnly, bounds(), contained(), expectWheelScrollsPageWhileOpen(), expectDropdownPreservesScroll(), expectPointerCursor(), scrollWithInput(), settledOverlayAlpha() (+2 more)

### Community 35 - "formatCurrency"
Cohesion: 0.25
Nodes (18): AllocationProgress(), DrillPanel(), RecordAmount(), amountTone(), formatRowTime(), PendingBadge(), RecordActions(), RecordActionsCell() (+10 more)

### Community 36 - "statement-rules.ts"
Cohesion: 0.16
Nodes (16): RecordRow, StatementRow, byCreation(), conditionPattern(), listStatementRules(), matchesStatement(), NAME_ORDER, previewStatementRule() (+8 more)

### Community 37 - "providers.tsx"
Cohesion: 0.17
Nodes (15): Boot(), db, DEFAULT_CATEGORIES, DEFAULT_MONTHLY_BUDGETS, SEED_HASH_KEY, seedIfEmpty(), CATEGORIES, useSyncToasts() (+7 more)

### Community 38 - "core/routes.e2e.ts"
Cohesion: 0.17
Nodes (14): @playwright/test, Child, october, september, PREMATURE, routeReady, titles, IDS (+6 more)

### Community 39 - "types.d.ts"
Cohesion: 0.10
Nodes (20): Account, Allocation, AnalyticsSummary, AnalyticsTreatment, Appearance, Budget, Category, CategoryWithChildren (+12 more)

### Community 40 - "trend-chart.tsx"
Cohesion: 0.20
Nodes (15): bar(), BarChart(), BarSeries, PAD, ChartFrame(), ChartSize, ReadoutRows(), PAD (+7 more)

### Community 41 - "auto-sync.ts"
Cohesion: 0.14
Nodes (18): SYNC_TABLES, useSyncStatus(), emit(), eventListeners, finishCycle(), getSyncSnapshot(), sameSnapshot(), set() (+10 more)

### Community 42 - "importer.ts"
Cohesion: 0.25
Nodes (19): ensureAccount(), combine(), dbsDescriptionKey(), debitCreditAmount(), descriptionKey(), importDbs(), importFiles(), importOcbc() (+11 more)

### Community 43 - "UI layer"
Cohesion: 0.15
Nodes (14): app/**/page.tsx, Domain logic, Interactive routes are "use client" (search params via next/navigation), Dashboard month route-group shell, Pages take no props, Persistence, Project Shape, React Compiler (enabled) (+6 more)

### Community 44 - "auth-vault.ts"
Cohesion: 0.32
Nodes (13): POST(), POST(), POST(), AUTH_COOKIE_NAME, authCookie(), authCookieConfig(), clientIp(), encryptionKey() (+5 more)

### Community 45 - "collectTests"
Cohesion: 0.28
Nodes (16): collectTests(), conditionBranch(), detailsTags(), disabled(), mentionsMotion(), record(), splitTestCallee(), tagValues() (+8 more)

### Community 46 - "use-appearance.tsx"
Cohesion: 0.24
Nodes (14): Appearance, applyAppearance(), getStoredAppearance(), handleSystemThemeChange(), initializeAppearance(), isDarkMode(), listeners, mediaQuery() (+6 more)

### Community 47 - "budgets/[id]/page.tsx"
Cohesion: 0.28
Nodes (13): BudgetPage(), getBudgetAnalytics(), getCategoryData(), Legend(), BudgetProgressChart(), BudgetProgressPoint, buildSeries(), Icon() (+5 more)

### Community 48 - "STYLE.md"
Cohesion: 0.16
Nodes (13): Allocation, APIs, Arguments, And Props, Code Style, Consistency, Copy, Core, Earning Its Place, Grouping And Order (+5 more)

### Community 49 - "displays.tsx"
Cohesion: 0.29
Nodes (10): AllocateBar(), Sparkline(), DetailSummary(), DetailSummaryItem(), Delta, Metric(), ValueSwap(), Displays() (+2 more)

### Community 50 - "alert-dialog.tsx"
Cohesion: 0.34
Nodes (12): DriveOverwriteConfirmation(), AlertDialog(), AlertDialogAction(), AlertDialogCancel(), AlertDialogContent(), AlertDialogDescription(), AlertDialogFooter(), AlertDialogHeader() (+4 more)

### Community 51 - "formatter"
Cohesion: 0.15
Nodes (13): arrowParentheses, bracketSameLine, bracketSpacing, jsxQuoteStyle, quoteProperties, quoteStyle, semicolons, trailingCommas (+5 more)

### Community 52 - "devDependencies"
Cohesion: 0.15
Nodes (13): devDependencies, babel-plugin-react-compiler, @biomejs/biome, fake-indexeddb, @playwright/test, @tailwindcss/postcss, @types/luxon, @types/node (+5 more)

### Community 53 - "pagination.tsx"
Cohesion: 0.38
Nodes (11): pageHref(), pageWindow(), PaginationFooter(), Pagination(), PaginationContent(), PaginationEllipsis(), PaginationItem(), PaginationLink() (+3 more)

### Community 54 - "Commands"
Cohesion: 0.20
Nodes (11): Agent Behavior, Biome (biome check --write), bun install, bun lint (write-mode), bun lint:check, bun run build, bun types:check, Commands (+3 more)

### Community 55 - "app.tsx"
Cohesion: 0.20
Nodes (8): metadata, RootLayout(), viewport, react-dom, App(), HarnessSection, sectionFromLocation(), root

### Community 56 - "biome.json"
Cohesion: 0.18
Nodes (10): source, assist, actions, files, includes, linter, enabled, overrides (+2 more)

### Community 57 - "rules"
Cohesion: 0.18
Nodes (11): noAdjacentSpacesInRegex, noBannedTypes, noExtraBooleanCast, noUselessCatch, noUselessThisAlias, noUselessTypeConstraint, rules, noFloatingPromises (+3 more)

### Community 58 - "src/data/* (persistence, migrations, seeding, backup serialization, Drive storage)"
Cohesion: 0.31
Nodes (8): Background Drive sync, bun test, src/data/* (persistence, migrations, seeding, backup serialization, Drive storage), IndexedDB (Dexie), Domain and importer tests (Dexie with in-memory IndexedDB), src/logic/* (domain reads and operations), Verification, Workspace backup/reset operations

### Community 59 - "manifest.json"
Cohesion: 0.20
Nodes (9): background_color, description, display, icons, name, scope, short_name, start_url (+1 more)

### Community 60 - "spending-calendar.tsx"
Cohesion: 0.29
Nodes (9): compact(), heat(), INK, LEVELS, quantile(), rampCap(), SpendingCalendar(), STRENGTH (+1 more)

### Community 61 - "Next.js agent rules block ("This is NOT the Next.js you know")"
Cohesion: 0.25
Nodes (6): app/api/auth/* Route Handlers, node_modules/next/dist/server/lib/generate-agent-files.js, Google OAuth broker (exchange/token/logout), Next.js App Router app (mostly client-side), node_modules/next/dist/docs/, npm run dev (port 5173)

### Community 62 - "scripts"
Cohesion: 0.22
Nodes (9): scripts, build, dev, lint, lint:check, start, test:e2e, types:check (+1 more)

### Community 63 - "formatter"
Cohesion: 0.25
Nodes (8): formatter, attributePosition, enabled, formatWithErrors, indentStyle, indentWidth, lineEnding, lineWidth

### Community 65 - "Domain docs (single-context layout)"
Cohesion: 0.33
Nodes (7): Agent skills, CONTEXT.md, Domain docs (single-context layout), Domain Language, Issue tracker (local specs and tickets), .scratch/ local work tracking, String primary keys (not auto-increment)

### Community 66 - "optionalDependencies"
Cohesion: 0.29
Nodes (7): optionalDependencies, lightningcss-linux-x64-gnu, lightningcss-win32-x64-msvc, @rollup/rollup-linux-x64-gnu, @rollup/rollup-win32-x64-msvc, @tailwindcss/oxide-linux-x64-gnu, @tailwindcss/oxide-win32-x64-msvc

### Community 67 - "vite.config.ts"
Cohesion: 0.29
Nodes (4): vite, @vitejs/plugin-react, harnessDir, repoRoot

### Community 68 - "tsconfig.e2e.json"
Cohesion: 0.29
Nodes (6): ./tsconfig.json, compilerOptions, incremental, exclude, extends, include

### Community 69 - "style"
Cohesion: 0.33
Nodes (6): style, noNamespace, noNonNullAssertion, useArrayLiterals, useAsConstAssertion, useBlockStatements

### Community 70 - "0002 Forecast pacing"
Cohesion: 0.33
Nodes (5): 0002 Forecast pacing, Consequences, Context, Decision, Rejected option

### Community 71 - "0001-drill-down-url-state.md"
Cohesion: 0.40
Nodes (4): Compare selection uses included comparison months and title-based uniqueness, Gross and net category selection URL, Comparison window, Drill-down URL state

### Community 72 - "Validation rule (ValidationError + Validator)"
Cohesion: 0.50
Nodes (4): Old Laravel Api/*Controller mapping, Laravel-shaped { field: string[] } error maps, ValidationError, Validator

### Community 73 - "Finpoint icon concept"
Cohesion: 0.40
Nodes (5): Finpoint icon concept, Charcoal shadow halo, Circular point, Rounded F monogram, Off-white icon fill

### Community 74 - "Finpoint icon with charcoal shadow"
Cohesion: 0.40
Nodes (5): Finpoint icon with charcoal shadow, Charcoal shadow halo, Circular point, Rounded F monogram, Off-white icon fill

### Community 75 - "Issue tracker: Local Markdown"
Cohesion: 0.40
Nodes (4): Files, Issue tracker: Local Markdown, Skill operations, Status and dependencies

### Community 76 - "Dashboard"
Cohesion: 0.40
Nodes (5): Dashboard, Forecast dotted comparison names the previous month, Pending Record reasons visible before expansion, Statement pivot amount, account and timestamp, Statement titles open their funded Records

### Community 77 - "Finpoint"
Cohesion: 0.50
Nodes (4): Finpoint, Circular point, Rounded F monogram, Off-white icon fill

### Community 78 - "Domain docs"
Cohesion: 0.50
Nodes (3): Before exploration, Domain docs, Writing

### Community 79 - "Local Markdown Issue Tracker"
Cohesion: 0.50
Nodes (4): Local Tracker Operations, Spec and Ticket Files, Ticket Lifecycle, Local Markdown Issue Tracker

### Community 81 - "Forecast pacing decision"
Cohesion: 0.67
Nodes (3): Forecast pacing decision, Remaining historical spending scaled by remaining days, Median daily spending fallback including zero days

### Community 82 - "F monogram icon"
Cohesion: 0.67
Nodes (3): Circular dot beside F, Rounded F letterform, F monogram icon

### Community 83 - "JPG favicon icon"
Cohesion: 0.67
Nodes (3): JPG favicon dot, JPG favicon F letterform, JPG favicon icon

### Community 84 - "PNG favicon icon"
Cohesion: 0.67
Nodes (3): PNG favicon dot, PNG favicon F letterform, PNG favicon icon

### Community 85 - "SVG favicon icon"
Cohesion: 0.67
Nodes (3): SVG favicon dot, SVG favicon F letterform, SVG favicon icon

### Community 86 - "F monogram icon"
Cohesion: 0.67
Nodes (3): Circular dot beside F, Rounded F letterform, F monogram icon

### Community 87 - "F monogram icon"
Cohesion: 0.67
Nodes (3): Circular dot beside F, Rounded F letterform, F monogram icon

## Knowledge Gaps
- **126 isolated node(s):** `Build app step`, `Build harness step (tests/harness/vite.config.ts)`, `Playwright browser cache (keyed on bun.lock)`, `Graph health warnings and refresh failure reporting`, `gitmoji.dev` (+121 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 639 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **15 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `cn()` connect `cn` to `Button`, `record-editor.tsx`, `primitives.tsx`, `formatCurrency`, `sidebar.tsx`, `lib/motion.ts`, `(month)/page.tsx`, `trend-chart.tsx`, `Card`, `(month)/layout.tsx`, `displays.tsx`, `budgets/[id]/page.tsx`, `alert-dialog.tsx`, `pagination.tsx`, `amount-filter.tsx`, `spending-calendar.tsx`, `luxon`, `sync/page.tsx`?**
  _High betweenness centrality (0.104) - this node is a cross-community bridge._
- **What connects `Build app step`, `Build harness step (tests/harness/vite.config.ts)`, `Playwright browser cache (keyed on bun.lock)` to the rest of the system?**
  _126 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Button` be split into smaller, more focused modules?**
  _Cohesion score 0.05933713471133286 - nodes in this community are weakly interconnected._
- **Why does `react` connect `Button` to `record-editor.tsx`, `primitives.tsx`, `sidebar.tsx`, `lib/motion.ts`, `(month)/page.tsx`, `records.ts`, `Card`, `(month)/layout.tsx`, `cn`, `package.json`, `amount-filter.tsx`, `luxon`, `sync/page.tsx`, `formatCurrency`, `providers.tsx`, `trend-chart.tsx`, `auto-sync.ts`, `use-appearance.tsx`, `budgets/[id]/page.tsx`, `displays.tsx`, `alert-dialog.tsx`, `pagination.tsx`, `app.tsx`, `spending-calendar.tsx`?**
  _High betweenness centrality (0.068) - this node is a cross-community bridge._
- **Should `record-editor.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.07173689619732786 - nodes in this community are weakly interconnected._
- **Why does `src/data/* (persistence, migrations, seeding, backup serialization, Drive storage)` connect `src/data/* (persistence, migrations, seeding, backup serialization, Drive storage)` to `UI layer`, `providers.tsx`?**
  _High betweenness centrality (0.058) - this node is a cross-community bridge._
- **Should `primitives.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.08524590163934426 - nodes in this community are weakly interconnected._