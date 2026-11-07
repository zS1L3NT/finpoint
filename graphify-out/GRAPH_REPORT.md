# Graph Report - t3-69efe8e6  (2026-11-08)

## Corpus Check
- cluster-only mode — file stats not available

## Summary
- 2012 nodes · 7979 edges · 104 communities (88 shown, 16 thin omitted)
- Extraction: 98% EXTRACTED · 2% INFERRED · 0% AMBIGUOUS · INFERRED: 138 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `29e18c8c`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- Button
- duplicates/page.tsx
- ledger.e2e.ts
- cn
- (month)/page.tsx
- Tests README
- auto-sync.ts
- sidebar.tsx
- db.ts
- dashboard.ts
- utils.ts
- records/[id]/page.tsx
- lib/motion.ts
- editors.ts
- compilerOptions
- formatCurrency
- sync/page.tsx
- package.json
- dependencies
- monthly-budgets.test.ts
- suggestions.ts
- panel.tsx
- routes.ts
- suspicious
- records.ts
- fixtures.ts
- Validator
- support/motion.ts
- correctness
- providers.tsx
- README.md
- command.tsx
- statements.ts
- test-data.ts
- core/routes.e2e.ts
- CONTEXT.md
- importer.ts
- components.json
- core/components.e2e.ts
- drilldown.ts
- ref_types
- types.d.ts
- UI layer
- auth-vault.ts
- radix-ui
- statement-rules.ts
- STYLE.md
- budgets/[id]/page.tsx
- alert-dialog.tsx
- formatter
- devDependencies
- pagination.tsx
- Commands
- export-import.ts
- duplicates.ts
- biome.json
- rules
- workflows.e2e.ts
- statement-columns.tsx
- src/data/* (persistence, migrations, seeding, backup serialization, Drive storage)
- manifest.json
- spending-calendar.tsx
- Next.js agent rules block ("This is NOT the Next.js you know")
- scripts
- history.tsx
- formatter
- lucide-react
- app.tsx
- navigation.e2e.ts
- Domain docs (single-context layout)
- optionalDependencies
- tsconfig.e2e.json
- style
- 0002 Forecast pacing
- 0001-drill-down-url-state.md
- Validation rule (ValidationError + Validator)
- Boot
- Finpoint icon concept
- Finpoint icon with charcoal shadow
- Issue tracker: Local Markdown
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
- `Month context stays separate from Back targets and Record filters` --conceptually_related_to--> `MonthLayout()`  [INFERRED]
  README.md → app/(month)/layout.tsx
- `Statement pivot amount, account and timestamp` --conceptually_related_to--> `DrillPanel()`  [INFERRED]
  README.md → src/components/drill/panel.tsx
- `Pending Record reasons visible before expansion` --conceptually_related_to--> `pendingReason()`  [INFERRED]
  README.md → src/logic/records.ts
- `Forecast dotted comparison names the previous month` --conceptually_related_to--> `CashflowChart()`  [INFERRED]
  README.md → src/components/charts/cashflow-chart.tsx
- `Statement titles open their funded Records` --conceptually_related_to--> `useStatementColumns()`  [INFERRED]
  README.md → src/components/table/statement-columns.tsx

## Import Cycles
- None detected.

## Communities (104 total, 16 thin omitted)

### Community 0 - "Button"
Cohesion: 0.06
Nodes (135): BudgetCard(), BudgetState, formatBudgetDateWindow(), ACCEPT, BANKS_REQUIRING_ADDITIONAL_INFO, MonthLayout(), react-day-picker, sonner (+127 more)

### Community 1 - "duplicates/page.tsx"
Cohesion: 0.13
Nodes (62): AccountPage(), AccountsPage(), AllocatorPage(), BudgetsPage(), ScopeSelect(), RecordCreatorHost(), RecordFilters(), RecordsPage() (+54 more)

### Community 2 - "ledger.e2e.ts"
Cohesion: 0.05
Nodes (60): typescript, vite, @vitejs/plugin-react, bar(), BarChart(), BarSeries, PAD, ChartFrame() (+52 more)

### Community 3 - "cn"
Cohesion: 0.09
Nodes (63): AlertAction(), CardFooter(), ComboboxChip(), ComboboxChips(), ComboboxChipsInput(), ComboboxCollection(), ComboboxContent(), ComboboxEmpty() (+55 more)

### Community 4 - "(month)/page.tsx"
Cohesion: 0.07
Nodes (49): Largest selection preserves amount order before pagination, CategoriesPage(), CategoryDialogState, CategoryTile(), AttentionList(), Comparison, comparisonText(), ComparisonValue (+41 more)

### Community 5 - "Tests README"
Cohesion: 0.06
Nodes (41): Build harness step (vite build tests/harness), Playwright browser cache keyed on bun.lock, blob report merge, Committed graph artifacts (graph.json, GRAPH_REPORT.md, manifest.json, .graphify_labels.json), Graph health warnings and refresh failure reporting, graphify-out/graph.json, graphify skill (--update), graphify update . (+33 more)

### Community 6 - "auto-sync.ts"
Cohesion: 0.11
Nodes (50): exportData(), SYNC_TABLES, AuthNeededError, cacheToken(), CodeResponse, disconnectDrive(), downloadBackupFile(), driveFetch() (+42 more)

### Community 7 - "sidebar.tsx"
Cohesion: 0.10
Nodes (37): AppearanceOption, APPEARANCES, AppearanceSwitch(), AppSidebar(), SyncDot(), SYSTEM_APPEARANCE, useSyncIndicator(), DEFINITIONS (+29 more)

### Community 8 - "db.ts"
Cohesion: 0.08
Nodes (34): AccountRow, AllocationRow, AnalyticsMonthRow, BudgetRecordRow, BudgetRow, CategoryRow, DB_NAME, DB_VERSION (+26 more)

### Community 9 - "dashboard.ts"
Cohesion: 0.11
Nodes (38): AnalyticsRecord, summarize(), avg(), BREAKDOWN_MONTHS, buildCashflowHistory(), buildCategories(), buildComparison(), buildHeadline() (+30 more)

### Community 10 - "utils.ts"
Cohesion: 0.13
Nodes (24): AccountCard(), AccountRow, BUDGET_STATES, Rule, dexie-react-hooks, luxon, react, DynamicUiIcon() (+16 more)

### Community 11 - "records/[id]/page.tsx"
Cohesion: 0.18
Nodes (28): metadata, PrivacyPage(), SECTIONS, RecordPage(), StatementPage(), MethodHeader(), metadata, SECTIONS (+20 more)

### Community 12 - "lib/motion.ts"
Cohesion: 0.18
Nodes (30): @tanstack/react-table, DataTable(), PaginatedDataTable(), PaginationHeader(), GroupHeaderRow(), groupStarts(), GroupTotal(), isInteractiveTarget() (+22 more)

### Community 13 - "editors.ts"
Cohesion: 0.14
Nodes (20): editors, editors, longName, expectHeldRead(), expectRetainedRows(), expectSilentSheet(), expectVisibleBackdrop(), account (+12 more)

### Community 14 - "compilerOptions"
Cohesion: 0.06
Nodes (33): compilerOptions, allowJs, allowSyntheticDefaultImports, allowUnusedLabels, esModuleInterop, forceConsistentCasingInFileNames, incremental, isolatedModules (+25 more)

### Community 15 - "formatCurrency"
Cohesion: 0.25
Nodes (26): PendingCard(), Amount(), PendingStatementConfirmationSheet(), RecordOption(), RecordSearchSheet(), StatementOption(), StatementSearchSheet(), AmountFilter() (+18 more)

### Community 16 - "sync/page.tsx"
Cohesion: 0.13
Nodes (26): COUNT_ROWS, DataSettingsPage(), StateRow(), STATUS_TONES, StatusTone, WorkspaceRow(), clearAllData(), downloadExport() (+18 more)

### Community 17 - "package.json"
Cohesion: 0.07
Nodes (29): private, $schema, type, babel-plugin-react-compiler, @base-ui/react, @biomejs/biome, clsx, cmdk (+21 more)

### Community 18 - "dependencies"
Cohesion: 0.07
Nodes (30): dependencies, @base-ui/react, class-variance-authority, clsx, cmdk, dexie, dexie-react-hooks, @fontsource-variable/inter (+22 more)

### Community 19 - "monthly-budgets.test.ts"
Cohesion: 0.10
Nodes (11): dexie, fake-indexeddb, xlsx, input, legacyPaceKey, today, decided(), live() (+3 more)

### Community 20 - "suggestions.ts"
Cohesion: 0.11
Nodes (29): allocatedStatements(), asOf(), byDate(), CHIP_LIMIT, CHOICES, Clue, DEFAULT_WEIGHTS, descriptionTokens() (+21 more)

### Community 21 - "panel.tsx"
Cohesion: 0.19
Nodes (23): SECTIONS, AllocationProgress(), AllocationExpansion(), AllocationRows(), AllocationSource, DrillPanel(), Icon(), PendingBadge() (+15 more)

### Community 22 - "routes.ts"
Cohesion: 0.16
Nodes (21): NotFound(), nextConfig, next, ShellHeader(), TITLES, useDrill(), buildAttention(), pathAccounts() (+13 more)

### Community 23 - "suspicious"
Cohesion: 0.07
Nodes (28): suspicious, noAssignInExpressions, noAsyncPromiseExecutor, noCatchAssign, noClassAssign, noCompareNegZero, noControlCharactersInRegex, noDebugger (+20 more)

### Community 24 - "records.ts"
Cohesion: 0.13
Nodes (22): BudgetDetail, BudgetFilters, createBudget(), listBudgets(), isPendingRecord(), pendingStatementIds(), tallyAllocations(), resolveRecordChoices() (+14 more)

### Community 25 - "fixtures.ts"
Cohesion: 0.16
Nodes (15): cardTitles, card(), chartTooltip, overview, overviewCharts, themedRgb(), assertSeeded(), checkSeededMarker() (+7 more)

### Community 26 - "Validator"
Cohesion: 0.26
Nodes (17): updateAccount(), validateBudget(), cleanInput(), dismissDuplicatePair(), eligible(), fixDuplicates(), restoreDuplicatePair(), createMonthlyBudget() (+9 more)

### Community 27 - "support/motion.ts"
Cohesion: 0.17
Nodes (20): denseCardConsumers, denseRowConsumers, expectConsumerEntrance(), populatedConsumers, attachSamplingFailure(), expectModalEntrance(), expectModalExit(), expectPopupEntrance() (+12 more)

### Community 28 - "correctness"
Cohesion: 0.08
Nodes (26): noConstantCondition, noConstAssign, noEmptyCharacterClassInRegex, noEmptyPattern, noGlobalObjectCalls, noInvalidBuiltinInstantiation, noInvalidConstructorSuper, noNonoctalDecimalEscape (+18 more)

### Community 29 - "providers.tsx"
Cohesion: 0.16
Nodes (21): metadata, RootLayout(), viewport, Providers(), SidebarInset(), SidebarProvider(), Toaster(), TooltipProvider() (+13 more)

### Community 30 - "README.md"
Cohesion: 0.08
Nodes (24): Allocate workspace, Allocations, Backup and restore, Categories, Custom-period Budgets, Demo data, Financial terms definitions, Finpoint (+16 more)

### Community 31 - "command.tsx"
Cohesion: 0.16
Nodes (21): CategoryFilter(), CategoryFilterItem(), ComboboxClear(), ComboboxInput(), ComboboxTrigger(), Command(), CommandEmpty(), CommandGroup() (+13 more)

### Community 32 - "statements.ts"
Cohesion: 0.16
Nodes (23): asPending(), duplicateStatementIds(), removeStatementDismissals(), dayDifference(), ensureCanReplace(), maskDescription(), ReplacementAllocation, replacementComparison() (+15 more)

### Community 33 - "test-data.ts"
Cohesion: 0.13
Nodes (20): DEFAULT_CATEGORIES, DEFAULT_MONTHLY_BUDGETS, EXPORT_VERSION, FinpointExport, SEED_HASH_KEY, BANK_BLURB, between(), CATEGORIES (+12 more)

### Community 34 - "core/routes.e2e.ts"
Cohesion: 0.13
Nodes (17): containedFooter(), Child, october, september, PREMATURE, routeReady, titles, expectPointerCursor() (+9 more)

### Community 35 - "CONTEXT.md"
Cohesion: 0.12
Nodes (22): Account, Allocate, Allocation, Budget, Category, Drill-down, Duplicate Statement, Irregular (+14 more)

### Community 36 - "importer.ts"
Cohesion: 0.23
Nodes (21): ImporterPage(), Step(), ensureAccount(), combine(), dbsDescriptionKey(), debitCreditAmount(), descriptionKey(), importDbs() (+13 more)

### Community 37 - "components.json"
Cohesion: 0.09
Nodes (21): aliases, components, hooks, lib, ui, utils, iconLibrary, menuAccent (+13 more)

### Community 38 - "core/components.e2e.ts"
Cohesion: 0.14
Nodes (11): desktopOnly, @playwright/test, bounds(), contained(), expectWheelScrollsPageWhileOpen(), expectDropdownPreservesScroll(), scrollWithInput(), settledOverlayAlpha() (+3 more)

### Community 39 - "drilldown.ts"
Cohesion: 0.16
Nodes (18): Comparison columns share ordering and show the average arithmetic, Dashboard, Forecast dotted comparison names the previous month, Month context stays separate from Back targets and Record filters, Past empty months show one dated message and import action, Pending Record reasons visible before expansion, Spending Drill-down refund signs, labels and gross arithmetic, Spent Drill-down category subtotals and compact half-height metadata (+10 more)

### Community 40 - "ref_types"
Cohesion: 0.19
Nodes (12): framer-motion, AllocateBar(), Sparkline(), Delta, Metric(), RecordAmount(), ValueSwap(), DURATION (+4 more)

### Community 41 - "types.d.ts"
Cohesion: 0.10
Nodes (20): Account, Allocation, AnalyticsSummary, AnalyticsTreatment, Appearance, Budget, Category, CategoryWithChildren (+12 more)

### Community 42 - "UI layer"
Cohesion: 0.15
Nodes (14): app/**/page.tsx, Domain logic, Interactive routes are "use client" (search params via next/navigation), Dashboard month route-group shell, Pages take no props, Persistence, Project Shape, React Compiler (enabled) (+6 more)

### Community 43 - "auth-vault.ts"
Cohesion: 0.29
Nodes (14): POST(), POST(), POST(), jose, AUTH_COOKIE_NAME, authCookie(), authCookieConfig(), clientIp() (+6 more)

### Community 44 - "radix-ui"
Cohesion: 0.17
Nodes (13): class-variance-authority, radix-ui, AppHeader(), ButtonGroup(), ButtonGroupSeparator(), ButtonGroupText(), buttonGroupVariants, FieldSeparator() (+5 more)

### Community 45 - "statement-rules.ts"
Cohesion: 0.24
Nodes (11): byCreation(), conditionPattern(), listStatementRules(), matchesStatement(), NAME_ORDER, previewStatementRule(), RULE_FIELDS, RULE_OPERATORS (+3 more)

### Community 46 - "STYLE.md"
Cohesion: 0.17
Nodes (13): APIs, Arguments, And Props, Code Style, Consistency, Copy, Core, Earning Its Place, Finpoint Style Additions, Grouping And Order (+5 more)

### Community 47 - "budgets/[id]/page.tsx"
Cohesion: 0.30
Nodes (12): BudgetPage(), getBudgetAnalytics(), getCategoryData(), Legend(), BudgetProgressChart(), BudgetProgressPoint, buildSeries(), MetricGrid() (+4 more)

### Community 48 - "alert-dialog.tsx"
Cohesion: 0.34
Nodes (12): DriveOverwriteConfirmation(), AlertDialog(), AlertDialogAction(), AlertDialogCancel(), AlertDialogContent(), AlertDialogDescription(), AlertDialogFooter(), AlertDialogHeader() (+4 more)

### Community 49 - "formatter"
Cohesion: 0.15
Nodes (13): arrowParentheses, bracketSameLine, bracketSpacing, jsxQuoteStyle, quoteProperties, quoteStyle, semicolons, trailingCommas (+5 more)

### Community 50 - "devDependencies"
Cohesion: 0.15
Nodes (13): devDependencies, babel-plugin-react-compiler, @biomejs/biome, fake-indexeddb, @playwright/test, @tailwindcss/postcss, @types/luxon, @types/node (+5 more)

### Community 51 - "pagination.tsx"
Cohesion: 0.38
Nodes (11): pageHref(), pageWindow(), PaginationFooter(), Pagination(), PaginationContent(), PaginationEllipsis(), PaginationItem(), PaginationLink() (+3 more)

### Community 52 - "Commands"
Cohesion: 0.20
Nodes (11): Agent Behavior, Biome (biome check --write), bun install, bun lint (write-mode), bun lint:check, bun run build, bun types:check, Commands (+3 more)

### Community 53 - "export-import.ts"
Cohesion: 0.30
Nodes (9): db, monthlyBudgetFields(), TableName, TABLES, DEFAULT_SETTINGS, FinpointSettings, readSettings(), replaceSettings() (+1 more)

### Community 54 - "duplicates.ts"
Cohesion: 0.27
Nodes (11): descriptionAnchors(), descriptionIdentity(), DuplicateGroup, duplicateGroups(), DuplicateStatement, FixDuplicatesInput, GENERIC, pairIds() (+3 more)

### Community 55 - "biome.json"
Cohesion: 0.18
Nodes (10): source, assist, actions, files, includes, linter, enabled, overrides (+2 more)

### Community 56 - "rules"
Cohesion: 0.18
Nodes (11): noAdjacentSpacesInRegex, noBannedTypes, noExtraBooleanCast, noUselessCatch, noUselessThisAlias, noUselessTypeConstraint, rules, noFloatingPromises (+3 more)

### Community 58 - "statement-columns.tsx"
Cohesion: 0.36
Nodes (10): amountTone(), formatRowTime(), StatementActions(), StatementActionsCell(), StatementAmount(), StatementBadges(), StatementRow, StatementTableOptions (+2 more)

### Community 59 - "src/data/* (persistence, migrations, seeding, backup serialization, Drive storage)"
Cohesion: 0.31
Nodes (8): Background Drive sync, bun test, src/data/* (persistence, migrations, seeding, backup serialization, Drive storage), IndexedDB (Dexie), Domain and importer tests (Dexie with in-memory IndexedDB), src/logic/* (domain reads and operations), Verification, Workspace backup/reset operations

### Community 60 - "manifest.json"
Cohesion: 0.20
Nodes (9): background_color, description, display, icons, name, scope, short_name, start_url (+1 more)

### Community 61 - "spending-calendar.tsx"
Cohesion: 0.29
Nodes (9): compact(), heat(), INK, LEVELS, quantile(), rampCap(), SpendingCalendar(), STRENGTH (+1 more)

### Community 62 - "Next.js agent rules block ("This is NOT the Next.js you know")"
Cohesion: 0.25
Nodes (6): app/api/auth/* Route Handlers, node_modules/next/dist/server/lib/generate-agent-files.js, Google OAuth broker (exchange/token/logout), Next.js App Router app (mostly client-side), node_modules/next/dist/docs/, npm run dev (port 5173)

### Community 63 - "scripts"
Cohesion: 0.22
Nodes (9): scripts, build, dev, lint, lint:check, start, test:e2e, types:check (+1 more)

### Community 64 - "history.tsx"
Cohesion: 0.39
Nodes (7): getStoredHistory(), getValidHistory(), HistoryContext, HistoryItem, HistoryProvider(), normaliseUrl(), withoutTrailingSelf()

### Community 65 - "formatter"
Cohesion: 0.25
Nodes (8): formatter, attributePosition, enabled, formatWithErrors, indentStyle, indentWidth, lineEnding, lineWidth

### Community 66 - "lucide-react"
Cohesion: 0.29
Nodes (7): lucide-react, ButtonVariant, Month, MonthCal(), MonthCalProps, MonthPicker(), MONTHS

### Community 67 - "app.tsx"
Cohesion: 0.32
Nodes (5): react-dom, App(), HarnessSection, sectionFromLocation(), root

### Community 69 - "Domain docs (single-context layout)"
Cohesion: 0.33
Nodes (7): Agent skills, CONTEXT.md, Domain docs (single-context layout), Domain Language, Issue tracker (local specs and tickets), .scratch/ local work tracking, String primary keys (not auto-increment)

### Community 70 - "optionalDependencies"
Cohesion: 0.29
Nodes (7): optionalDependencies, lightningcss-linux-x64-gnu, lightningcss-win32-x64-msvc, @rollup/rollup-linux-x64-gnu, @rollup/rollup-win32-x64-msvc, @tailwindcss/oxide-linux-x64-gnu, @tailwindcss/oxide-win32-x64-msvc

### Community 71 - "tsconfig.e2e.json"
Cohesion: 0.29
Nodes (6): ./tsconfig.json, compilerOptions, incremental, exclude, extends, include

### Community 72 - "style"
Cohesion: 0.33
Nodes (6): style, noNamespace, noNonNullAssertion, useArrayLiterals, useAsConstAssertion, useBlockStatements

### Community 73 - "0002 Forecast pacing"
Cohesion: 0.33
Nodes (5): 0002 Forecast pacing, Consequences, Context, Decision, Rejected option

### Community 74 - "0001-drill-down-url-state.md"
Cohesion: 0.40
Nodes (4): Compare selection uses included comparison months and title-based uniqueness, Gross and net category selection URL, Comparison window, Drill-down URL state

### Community 75 - "Validation rule (ValidationError + Validator)"
Cohesion: 0.50
Nodes (4): Old Laravel Api/*Controller mapping, Laravel-shaped { field: string[] } error maps, ValidationError, Validator

### Community 76 - "Boot"
Cohesion: 0.50
Nodes (4): Boot(), useSyncToasts(), subscribeSyncEvents(), listCategoryIconNames()

### Community 77 - "Finpoint icon concept"
Cohesion: 0.40
Nodes (5): Finpoint icon concept, Charcoal shadow halo, Circular point, Rounded F monogram, Off-white icon fill

### Community 78 - "Finpoint icon with charcoal shadow"
Cohesion: 0.40
Nodes (5): Finpoint icon with charcoal shadow, Charcoal shadow halo, Circular point, Rounded F monogram, Off-white icon fill

### Community 79 - "Issue tracker: Local Markdown"
Cohesion: 0.40
Nodes (4): Files, Issue tracker: Local Markdown, Skill operations, Status and dependencies

### Community 80 - "Finpoint"
Cohesion: 0.50
Nodes (4): Finpoint, Circular point, Rounded F monogram, Off-white icon fill

### Community 81 - "Domain docs"
Cohesion: 0.50
Nodes (3): Before exploration, Domain docs, Writing

### Community 82 - "Local Markdown Issue Tracker"
Cohesion: 0.50
Nodes (4): Local Tracker Operations, Spec and Ticket Files, Ticket Lifecycle, Local Markdown Issue Tracker

### Community 84 - "Forecast pacing decision"
Cohesion: 0.67
Nodes (3): Forecast pacing decision, Remaining historical spending scaled by remaining days, Median daily spending fallback including zero days

### Community 85 - "F monogram icon"
Cohesion: 0.67
Nodes (3): Circular dot beside F, Rounded F letterform, F monogram icon

### Community 86 - "JPG favicon icon"
Cohesion: 0.67
Nodes (3): JPG favicon dot, JPG favicon F letterform, JPG favicon icon

### Community 87 - "PNG favicon icon"
Cohesion: 0.67
Nodes (3): PNG favicon dot, PNG favicon F letterform, PNG favicon icon

### Community 88 - "SVG favicon icon"
Cohesion: 0.67
Nodes (3): SVG favicon dot, SVG favicon F letterform, SVG favicon icon

### Community 89 - "F monogram icon"
Cohesion: 0.67
Nodes (3): Circular dot beside F, Rounded F letterform, F monogram icon

### Community 90 - "F monogram icon"
Cohesion: 0.67
Nodes (3): Circular dot beside F, Rounded F letterform, F monogram icon

## Knowledge Gaps
- **122 isolated node(s):** `React Compiler (enabled)`, `Root Suspense (keeps routes static)`, `Static content pages (privacy, terms) are server components`, `Build app step`, `Build harness step (tests/harness/vite.config.ts)` (+117 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 635 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **16 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `cn()` connect `cn` to `Button`, `duplicates/page.tsx`, `ledger.e2e.ts`, `(month)/page.tsx`, `sidebar.tsx`, `utils.ts`, `records/[id]/page.tsx`, `lib/motion.ts`, `formatCurrency`, `sync/page.tsx`, `panel.tsx`, `providers.tsx`, `command.tsx`, `importer.ts`, `ref_types`, `radix-ui`, `budgets/[id]/page.tsx`, `alert-dialog.tsx`, `pagination.tsx`, `statement-columns.tsx`, `spending-calendar.tsx`, `lucide-react`?**
  _High betweenness centrality (0.094) - this node is a cross-community bridge._
- **What connects `React Compiler (enabled)`, `Root Suspense (keeps routes static)`, `Static content pages (privacy, terms) are server components` to the rest of the system?**
  _122 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Button` be split into smaller, more focused modules?**
  _Cohesion score 0.05664354685162519 - nodes in this community are weakly interconnected._
- **Why does `src/data/* (persistence, migrations, seeding, backup serialization, Drive storage)` connect `src/data/* (persistence, migrations, seeding, backup serialization, Drive storage)` to `UI layer`, `providers.tsx`?**
  _High betweenness centrality (0.069) - this node is a cross-community bridge._
- **Should `duplicates/page.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.12947368421052632 - nodes in this community are weakly interconnected._
- **Why does `react` connect `utils.ts` to `Button`, `duplicates/page.tsx`, `ledger.e2e.ts`, `cn`, `(month)/page.tsx`, `sidebar.tsx`, `records/[id]/page.tsx`, `lib/motion.ts`, `formatCurrency`, `sync/page.tsx`, `package.json`, `panel.tsx`, `routes.ts`, `providers.tsx`, `command.tsx`, `ref_types`, `radix-ui`, `budgets/[id]/page.tsx`, `alert-dialog.tsx`, `pagination.tsx`, `statement-columns.tsx`, `spending-calendar.tsx`, `history.tsx`, `lucide-react`, `app.tsx`, `Boot`?**
  _High betweenness centrality (0.066) - this node is a cross-community bridge._
- **Should `ledger.e2e.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.0502283105022831 - nodes in this community are weakly interconnected._