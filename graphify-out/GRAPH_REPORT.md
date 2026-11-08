# Graph Report - t3-69efe8e6  (2026-11-08)

## Corpus Check
- 271 files · ~245,645 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 9 file(s) not represented in the graph (top: (none) 5, .example 1, .lock 1)

## Summary
- 2048 nodes · 8131 edges · 99 communities (85 shown, 14 thin omitted)
- Extraction: 98% EXTRACTED · 2% INFERRED · 0% AMBIGUOUS · INFERRED: 144 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `6aa41da1`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- Button
- duplicates/page.tsx
- ledger.e2e.ts
- primitives.tsx
- (month)/page.tsx
- Tests README
- sync/page.tsx
- cn
- data.ts
- dashboard.ts
- category-filter.tsx
- records/[id]/page.tsx
- budgets/page.tsx
- editors.ts
- compilerOptions
- utils.ts
- collectTests
- package.json
- dependencies
- db.ts
- suggestions.ts
- displays.tsx
- routes.ts
- suspicious
- records.ts
- @playwright/test
- Validator
- support/motion.ts
- correctness
- vite.config.ts
- README.md
- combobox.tsx
- statements.ts
- test-data.ts
- core/routes.e2e.ts
- CONTEXT.md
- importer/page.tsx
- components.json
- core/components.e2e.ts
- themeColor
- types.d.ts
- UI layer
- auth-vault.ts
- statement-rules.ts
- STYLE.md
- alert-dialog.tsx
- formatter
- devDependencies
- pagination.tsx
- Commands
- biome.json
- rules
- src/data/* (persistence, migrations, seeding, backup serialization, Drive storage)
- manifest.json
- spending-calendar.tsx
- Next.js agent rules block ("This is NOT the Next.js you know")
- scripts
- formatter
- lucide-react
- app/layout.tsx
- fixtures.ts
- Domain docs (single-context layout)
- optionalDependencies
- tsconfig.e2e.json
- style
- 0002 Forecast pacing
- 0001-drill-down-url-state.md
- Validation rule (ValidationError + Validator)
- mode-menu.tsx
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
- category-history-chart.tsx
- layer segregation (UI / logic / data)
- src/components/*

## God Nodes (most connected - your core abstractions)
1. `cn()` - 326 edges
2. `PrimitivesSection()` - 181 edges
3. `Button()` - 127 edges
4. `react` - 100 edges
5. `formatCurrency()` - 84 edges
6. `RecordEditorDialog()` - 65 edges
7. `UiIcon()` - 61 edges
8. `RecordCreatorDialog()` - 58 edges
9. `round2()` - 48 edges
10. `pluralize()` - 46 edges

## Surprising Connections (you probably didn't know these)
- `Month context stays separate from Back targets and Record filters` --conceptually_related_to--> `MonthLayout()`  [INFERRED]
  README.md → app/(month)/layout.tsx
- `Forecast dotted comparison names the previous month` --conceptually_related_to--> `CashflowChart()`  [INFERRED]
  README.md → src/components/charts/cashflow-chart.tsx
- `Statement pivot amount, account and timestamp` --conceptually_related_to--> `DrillPanel()`  [INFERRED]
  README.md → src/components/drill/panel.tsx
- `Statement titles open their funded Records` --conceptually_related_to--> `useStatementColumns()`  [INFERRED]
  README.md → src/components/table/statement-columns.tsx
- `Past empty months show one dated message and import action` --conceptually_related_to--> `buildHeadline()`  [INFERRED]
  README.md → src/logic/dashboard.ts

## Import Cycles
- None detected.

## Communities (99 total, 14 thin omitted)

### Community 0 - "Button"
Cohesion: 0.07
Nodes (115): CandidateResults(), react, sonner, @tanstack/react-form, AccountDialog(), BudgetCreatorDialog(), BudgetEditorDialog(), CategoryDialog() (+107 more)

### Community 1 - "duplicates/page.tsx"
Cohesion: 0.06
Nodes (110): AccountPage(), AccountCard(), AccountRow, AccountsPage(), AllocatorPage(), CategoriesPage(), CategoryDialogState, CategoryTile() (+102 more)

### Community 2 - "ledger.e2e.ts"
Cohesion: 0.10
Nodes (25): behaviourCoverage, componentInventory, facetNotApplicable, InventoryEntry, modalAnimationCoverage, notApplicable, openFacets, RouteEntry (+17 more)

### Community 3 - "primitives.tsx"
Cohesion: 0.08
Nodes (55): class-variance-authority, radix-ui, DrillModeMenu(), AlertAction(), ButtonGroup(), ButtonGroupSeparator(), ButtonGroupText(), buttonGroupVariants (+47 more)

### Community 4 - "(month)/page.tsx"
Cohesion: 0.14
Nodes (21): AttentionList(), Comparison, comparisonText(), ComparisonValue, DashboardData, DashboardMonthlyBudget, DashboardPage(), DashboardView (+13 more)

### Community 5 - "Tests README"
Cohesion: 0.06
Nodes (41): Build harness step (vite build tests/harness), Playwright browser cache keyed on bun.lock, blob report merge, Committed graph artifacts (graph.json, GRAPH_REPORT.md, manifest.json, .graphify_labels.json), Graph health warnings and refresh failure reporting, graphify-out/graph.json, graphify skill (--update), graphify update . (+33 more)

### Community 6 - "sync/page.tsx"
Cohesion: 0.06
Nodes (86): Boot(), COUNT_ROWS, DataSettingsPage(), StateRow(), STATUS_TONES, StatusTone, WorkspaceRow(), @vercel/analytics (+78 more)

### Community 7 - "cn"
Cohesion: 0.13
Nodes (28): Providers(), AppHeader(), AppearanceSwitch(), SidebarContent(), SidebarContext, SidebarContextProps, SidebarFooter(), SidebarGroup() (+20 more)

### Community 8 - "data.ts"
Cohesion: 0.09
Nodes (20): AccountRow, BudgetRecordRow, BudgetRow, DuplicateDismissalRow, DBS_VALID, buildDense(), buildEmpty(), buildPopulated() (+12 more)

### Community 9 - "dashboard.ts"
Cohesion: 0.14
Nodes (35): db, contribution(), summarize(), avg(), buildCashflowHistory(), buildCategories(), buildComparison(), buildHeadline() (+27 more)

### Community 10 - "category-filter.tsx"
Cohesion: 0.20
Nodes (16): @base-ui/react, CategoryFilter(), CategoryFilterItem(), Command(), CommandEmpty(), CommandGroup(), CommandInput(), CommandItem() (+8 more)

### Community 11 - "records/[id]/page.tsx"
Cohesion: 0.30
Nodes (17): metadata, PrivacyPage(), SECTIONS, RecordPage(), StatementPage(), MethodHeader(), metadata, SECTIONS (+9 more)

### Community 12 - "budgets/page.tsx"
Cohesion: 0.08
Nodes (56): BUDGET_STATES, BudgetCard(), BudgetsPage(), BudgetState, formatBudgetDateWindow(), framer-motion, @tanstack/react-table, bar() (+48 more)

### Community 13 - "editors.ts"
Cohesion: 0.12
Nodes (22): editors, containedFooter(), editors, longName, expectHeldRead(), expectRetainedRows(), expectSilentSheet(), expectPointerCursor() (+14 more)

### Community 14 - "compilerOptions"
Cohesion: 0.06
Nodes (33): compilerOptions, allowJs, allowSyntheticDefaultImports, allowUnusedLabels, esModuleInterop, forceConsistentCasingInFileNames, incremental, isolatedModules (+25 more)

### Community 15 - "utils.ts"
Cohesion: 0.09
Nodes (69): BudgetPage(), getBudgetAnalytics(), getCategoryData(), Legend(), PendingCard(), AllocateBar(), AllocationProgress(), AllocationRows() (+61 more)

### Community 16 - "collectTests"
Cohesion: 0.28
Nodes (16): collectTests(), conditionBranch(), detailsTags(), disabled(), mentionsMotion(), record(), splitTestCallee(), tagValues() (+8 more)

### Community 17 - "package.json"
Cohesion: 0.07
Nodes (27): private, $schema, type, babel-plugin-react-compiler, @biomejs/biome, clsx, cmdk, @fontsource-variable/inter (+19 more)

### Community 18 - "dependencies"
Cohesion: 0.07
Nodes (30): dependencies, @base-ui/react, class-variance-authority, clsx, cmdk, dexie, dexie-react-hooks, @fontsource-variable/inter (+22 more)

### Community 19 - "db.ts"
Cohesion: 0.06
Nodes (42): Drill-down opens as a peek or a page, never docked, dexie, fake-indexeddb, xlsx, AnalyticsMonthRow, asPending(), DB_NAME, DB_VERSION (+34 more)

### Community 20 - "suggestions.ts"
Cohesion: 0.11
Nodes (31): allocatedStatements(), asOf(), byDate(), CHIP_LIMIT, CHOICES, Clue, DEFAULT_WEIGHTS, descriptionTokens() (+23 more)

### Community 21 - "displays.tsx"
Cohesion: 0.36
Nodes (7): Sparkline(), Delta, Metric(), ValueSwap(), Displays(), record, root

### Community 22 - "routes.ts"
Cohesion: 0.09
Nodes (50): NotFound(), AppearanceOption, APPEARANCES, AppSidebar(), SyncDot(), SYSTEM_APPEARANCE, useSyncIndicator(), ShellHeader() (+42 more)

### Community 23 - "suspicious"
Cohesion: 0.07
Nodes (28): suspicious, noAssignInExpressions, noAsyncPromiseExecutor, noCatchAssign, noClassAssign, noCompareNegZero, noControlCharactersInRegex, noDebugger (+20 more)

### Community 24 - "records.ts"
Cohesion: 0.08
Nodes (40): Comparison columns share ordering and show the average arithmetic, Dashboard, Forecast dotted comparison names the previous month, Month context stays separate from Back targets and Record filters, Past empty months show one dated message and import action, Pending Record reasons visible before expansion, Spending Drill-down refund signs, labels and gross arithmetic, Spent Drill-down category subtotals and compact half-height metadata (+32 more)

### Community 25 - "@playwright/test"
Cohesion: 0.20
Nodes (7): @playwright/test, cardTitles, card(), chartTooltip, overview, overviewCharts, themedRgb()

### Community 26 - "Validator"
Cohesion: 0.21
Nodes (23): updateAccount(), createBudget(), validateBudget(), cleanInput(), dismissDuplicatePair(), eligible(), fixDuplicates(), restoreDuplicatePair() (+15 more)

### Community 27 - "support/motion.ts"
Cohesion: 0.23
Nodes (16): expectConsumerEntrance(), expectVisibleBackdrop(), attachSamplingFailure(), expectModalEntrance(), expectModalExit(), expectPopupEntrance(), expectReducedRowMovement(), expectVisibleRowCascade() (+8 more)

### Community 28 - "correctness"
Cohesion: 0.08
Nodes (26): noConstantCondition, noConstAssign, noEmptyCharacterClassInRegex, noEmptyPattern, noGlobalObjectCalls, noInvalidBuiltinInstantiation, noInvalidConstructorSuper, noNonoctalDecimalEscape (+18 more)

### Community 29 - "vite.config.ts"
Cohesion: 0.29
Nodes (4): vite, @vitejs/plugin-react, harnessDir, repoRoot

### Community 30 - "README.md"
Cohesion: 0.08
Nodes (24): Allocate workspace, Allocations, Backup and restore, Categories, Custom-period Budgets, Demo data, Financial terms definitions, Finpoint (+16 more)

### Community 31 - "combobox.tsx"
Cohesion: 0.11
Nodes (24): Props, ComboboxChip(), ComboboxChips(), ComboboxChipsInput(), ComboboxClear(), ComboboxCollection(), ComboboxContent(), ComboboxEmpty() (+16 more)

### Community 32 - "statements.ts"
Cohesion: 0.09
Nodes (39): AnalyticsRecord, AnalyticsSummary, descriptionAnchors(), descriptionIdentity(), DuplicateGroup, duplicateGroups(), DuplicateStatement, duplicateStatementIds() (+31 more)

### Community 33 - "test-data.ts"
Cohesion: 0.13
Nodes (20): DEFAULT_CATEGORIES, DEFAULT_MONTHLY_BUDGETS, EXPORT_VERSION, FinpointExport, BANK_BLURB, between(), CATEGORIES, DAILY (+12 more)

### Community 34 - "core/routes.e2e.ts"
Cohesion: 0.13
Nodes (17): denseCardConsumers, denseRowConsumers, populatedConsumers, Child, october, september, PREMATURE, routeReady (+9 more)

### Community 35 - "CONTEXT.md"
Cohesion: 0.12
Nodes (21): Account, Allocate, Budget, Category, Drill-down, Duplicate Statement, Irregular, Left over (+13 more)

### Community 36 - "importer/page.tsx"
Cohesion: 0.15
Nodes (30): ACCEPT, BANKS_REQUIRING_ADDITIONAL_INFO, ImporterPage(), Step(), CardFooter(), BANKS, ensureAccount(), CategoryInput (+22 more)

### Community 37 - "components.json"
Cohesion: 0.09
Nodes (21): aliases, components, hooks, lib, ui, utils, iconLibrary, menuAccent (+13 more)

### Community 38 - "core/components.e2e.ts"
Cohesion: 0.15
Nodes (9): desktopOnly, bounds(), contained(), expectWheelScrollsPageWhileOpen(), expectDropdownPreservesScroll(), scrollWithInput(), settledOverlayAlpha(), APP_URL (+1 more)

### Community 39 - "themeColor"
Cohesion: 0.19
Nodes (13): Largest selection preserves amount order before pagination, CashflowChart(), CashflowPoint, CategoryMovers(), Mover, CategorySpendingMix(), MonthlyBudgetUsage(), MonthlyBudgetUsageItem (+5 more)

### Community 41 - "types.d.ts"
Cohesion: 0.10
Nodes (20): Account, Allocation, AnalyticsSummary, AnalyticsTreatment, Appearance, Budget, Category, CategoryWithChildren (+12 more)

### Community 42 - "UI layer"
Cohesion: 0.18
Nodes (10): app/**/page.tsx, Domain logic, Interactive routes are "use client" (search params via next/navigation), Pages take no props, Persistence, Root Suspense (keeps routes static), Static content pages (privacy, terms) are server components, UI layer (+2 more)

### Community 43 - "auth-vault.ts"
Cohesion: 0.29
Nodes (14): POST(), POST(), POST(), jose, AUTH_COOKIE_NAME, authCookie(), authCookieConfig(), clientIp() (+6 more)

### Community 45 - "statement-rules.ts"
Cohesion: 0.24
Nodes (12): StatementRow, byCreation(), conditionPattern(), deleteStatementRule(), listStatementRules(), matchesStatement(), NAME_ORDER, previewStatementRule() (+4 more)

### Community 46 - "STYLE.md"
Cohesion: 0.16
Nodes (14): Allocation, APIs, Arguments, And Props, Code Style, Consistency, Copy, Core, Earning Its Place, Finpoint Style Additions (+6 more)

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
Cohesion: 0.38
Nodes (7): Biome (biome check --write), bun install, bun lint (write-mode), bun lint:check, bun run build, bun types:check, Commands

### Community 55 - "biome.json"
Cohesion: 0.18
Nodes (10): source, assist, actions, files, includes, linter, enabled, overrides (+2 more)

### Community 56 - "rules"
Cohesion: 0.18
Nodes (11): noAdjacentSpacesInRegex, noBannedTypes, noExtraBooleanCast, noUselessCatch, noUselessThisAlias, noUselessTypeConstraint, rules, noFloatingPromises (+3 more)

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

### Community 65 - "formatter"
Cohesion: 0.25
Nodes (8): formatter, attributePosition, enabled, formatWithErrors, indentStyle, indentWidth, lineEnding, lineWidth

### Community 66 - "lucide-react"
Cohesion: 0.18
Nodes (12): lucide-react, react-day-picker, buttonVariants, Calendar(), CalendarDayButton(), ButtonVariant, Month, MonthCal() (+4 more)

### Community 67 - "app/layout.tsx"
Cohesion: 0.25
Nodes (5): metadata, RootLayout(), viewport, react-dom, root

### Community 68 - "fixtures.ts"
Cohesion: 0.16
Nodes (12): expectBackAboveHeadingFromKeyboardNavigation(), keyboardBack(), getScenario(), assertSeeded(), checkSeededMarker(), countStore(), seedInBrowser(), seedWorkspace() (+4 more)

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

### Community 76 - "mode-menu.tsx"
Cohesion: 0.30
Nodes (10): IconTip(), MODES, DEFINITIONS, Term(), SidebarMenuButton(), sidebarMenuButtonVariants, Tooltip(), TooltipContent() (+2 more)

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

### Community 104 - "category-history-chart.tsx"
Cohesion: 0.24
Nodes (12): aggregateSeries(), CategoryHistoryChart(), ChartMonth, ChartSeries, MonthBreakdown(), MonthTick(), monthTotal(), prepareMonths() (+4 more)

### Community 105 - "layer segregation (UI / logic / data)"
Cohesion: 0.60
Nodes (4): Dashboard month route-group shell, Project Shape, React Compiler (enabled), src/routes.ts (centralized route paths)

### Community 108 - "src/components/*"
Cohesion: 0.40
Nodes (4): Agent Behavior, Generated / Ignored Files, src/components/*, src/components/ui/**/*

## Knowledge Gaps
- **122 isolated node(s):** `@fontsource-variable/inter`, `shadcn`, `tailwindcss`, `tw-animate-css`, `@biomejs/biome` (+117 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 643 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **14 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `cn()` connect `cn` to `Button`, `duplicates/page.tsx`, `primitives.tsx`, `(month)/page.tsx`, `sync/page.tsx`, `category-filter.tsx`, `records/[id]/page.tsx`, `budgets/page.tsx`, `utils.ts`, `displays.tsx`, `routes.ts`, `combobox.tsx`, `importer/page.tsx`, `themeColor`, `alert-dialog.tsx`, `pagination.tsx`, `spending-calendar.tsx`, `lucide-react`, `mode-menu.tsx`, `category-history-chart.tsx`?**
  _High betweenness centrality (0.101) - this node is a cross-community bridge._
- **What connects `@fontsource-variable/inter`, `shadcn`, `tailwindcss` to the rest of the system?**
  _122 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Button` be split into smaller, more focused modules?**
  _Cohesion score 0.07328133502630146 - nodes in this community are weakly interconnected._
- **Why does `react` connect `Button` to `duplicates/page.tsx`, `primitives.tsx`, `(month)/page.tsx`, `sync/page.tsx`, `cn`, `category-filter.tsx`, `records/[id]/page.tsx`, `budgets/page.tsx`, `utils.ts`, `package.json`, `displays.tsx`, `routes.ts`, `combobox.tsx`, `importer/page.tsx`, `alert-dialog.tsx`, `pagination.tsx`, `spending-calendar.tsx`, `lucide-react`, `app/layout.tsx`, `mode-menu.tsx`, `category-history-chart.tsx`?**
  _High betweenness centrality (0.083) - this node is a cross-community bridge._
- **Should `duplicates/page.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.06175514626218852 - nodes in this community are weakly interconnected._
- **Why does `@playwright/test` connect `@playwright/test` to `core/routes.e2e.ts`, `ledger.e2e.ts`, `fixtures.ts`, `core/components.e2e.ts`, `data.ts`, `editors.ts`, `package.json`, `support/motion.ts`?**
  _High betweenness centrality (0.060) - this node is a cross-community bridge._
- **Should `ledger.e2e.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.10344827586206896 - nodes in this community are weakly interconnected._