# Graph Report - t3-69efe8e6  (2026-11-08)

## Corpus Check
- cluster-only mode — file stats not available

## Summary
- 2011 nodes · 7969 edges · 94 communities (78 shown, 16 thin omitted)
- Extraction: 98% EXTRACTED · 2% INFERRED · 0% AMBIGUOUS · INFERRED: 129 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `b2ef9d8f`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- utils.ts
- Button
- react
- importer/page.tsx
- lib/motion.ts
- Tests README
- ledger.e2e.ts
- auto-sync.ts
- primitives.tsx
- (month)/page.tsx
- dashboard.ts
- cn
- db.ts
- app-sidebar.tsx
- editors.ts
- compilerOptions
- sync/page.tsx
- monthly-budgets.test.ts
- suggestions.ts
- dependencies
- suspicious
- fixtures.ts
- package.json
- support/motion.ts
- correctness
- README.md
- combobox.tsx
- test-data.ts
- CONTEXT.md
- core/routes.e2e.ts
- amount-filter.tsx
- components.json
- core/components.e2e.ts
- types.d.ts
- command.tsx
- auth-vault.ts
- statement-rules.ts
- use-appearance.tsx
- IndexedDB (Dexie)
- UI layer
- providers.tsx
- lucide-react
- alert-dialog.tsx
- STYLE.md
- formatter
- devDependencies
- category-history-chart.tsx
- export-import.ts
- Commands
- biome.json
- rules
- workflows.e2e.ts
- manifest.json
- spending-calendar.tsx
- scripts
- Dashboard
- SidebarMenuButton
- Next.js agent rules block ("This is NOT the Next.js you know")
- formatter
- navigation.e2e.ts
- optionalDependencies
- tsconfig.e2e.json
- Domain docs (single-context layout)
- style
- 0002 Forecast pacing
- 0001-drill-down-url-state.md
- Validation rule (ValidationError + Validator)
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
- `Finpoint Style Additions` --references--> `ValidationError`  [INFERRED]
  STYLE.md → src/logic/validate.ts
- `Largest selection preserves amount order before pagination` --documents--> `Selection`  [INFERRED]
  docs/adr/0001-drill-down-url-state.md → src/logic/drilldown.ts
- `Copy` --references--> `pluralize()`  [INFERRED]
  STYLE.md → src/lib/utils.ts
- `Finpoint Style Additions` --references--> `useApiFormErrors()`  [INFERRED]
  STYLE.md → src/hooks/use-api-form-errors.ts
- `SECTIONS` --calls--> `treatmentLabel()`  [EXTRACTED]
  app/categories/page.tsx → src/lib/analytics.ts

## Import Cycles
- None detected.

## Communities (94 total, 16 thin omitted)

### Community 0 - "utils.ts"
Cohesion: 0.06
Nodes (129): BudgetPage(), getBudgetAnalytics(), getCategoryData(), Legend(), metadata, PrivacyPage(), SECTIONS, RecordPage() (+121 more)

### Community 1 - "Button"
Cohesion: 0.06
Nodes (123): AccountPage(), AccountCard(), AccountRow, AccountsPage(), AllocatorPage(), BUDGET_STATES, BudgetCard(), BudgetsPage() (+115 more)

### Community 2 - "react"
Cohesion: 0.06
Nodes (96): @base-ui/react, react, react-day-picker, react-dom, sonner, @tanstack/react-form, AccountDialog(), BudgetCreatorDialog() (+88 more)

### Community 3 - "importer/page.tsx"
Cohesion: 0.06
Nodes (85): ACCEPT, BANKS_REQUIRING_ADDITIONAL_INFO, ImporterPage(), Step(), asPending(), BANKS, ensureAccount(), updateAccount() (+77 more)

### Community 4 - "lib/motion.ts"
Cohesion: 0.09
Nodes (47): framer-motion, @tanstack/react-table, bar(), BarChart(), BarSeries, PAD, ChartFrame(), ChartSize (+39 more)

### Community 5 - "Tests README"
Cohesion: 0.06
Nodes (41): Build harness step (vite build tests/harness), Playwright browser cache keyed on bun.lock, blob report merge, Committed graph artifacts (graph.json, GRAPH_REPORT.md, manifest.json, .graphify_labels.json), Graph health warnings and refresh failure reporting, graphify-out/graph.json, graphify skill (--update), graphify update . (+33 more)

### Community 6 - "ledger.e2e.ts"
Cohesion: 0.07
Nodes (46): typescript, vite, @vitejs/plugin-react, behaviourCoverage, componentInventory, facetNotApplicable, InventoryEntry, modalAnimationCoverage (+38 more)

### Community 7 - "auto-sync.ts"
Cohesion: 0.11
Nodes (48): AuthNeededError, cacheToken(), CodeResponse, disconnectDrive(), downloadBackupFile(), driveFetch(), DriveFileMeta, ensureDriveToken() (+40 more)

### Community 8 - "primitives.tsx"
Cohesion: 0.10
Nodes (43): AlertAction(), DropdownMenu(), DropdownMenuCheckboxItem(), DropdownMenuContent(), DropdownMenuGroup(), DropdownMenuItem(), DropdownMenuLabel(), DropdownMenuPortal() (+35 more)

### Community 9 - "(month)/page.tsx"
Cohesion: 0.09
Nodes (34): Largest selection preserves amount order before pagination, AttentionList(), Comparison, comparisonText(), ComparisonValue, DashboardData, DashboardMonthlyBudget, DashboardPage() (+26 more)

### Community 10 - "dashboard.ts"
Cohesion: 0.12
Nodes (39): db, contribution(), summarize(), avg(), buildCashflowHistory(), buildCategories(), buildComparison(), buildHeadline() (+31 more)

### Community 11 - "cn"
Cohesion: 0.11
Nodes (35): class-variance-authority, AppHeader(), ButtonGroup(), ButtonGroupSeparator(), ButtonGroupText(), buttonGroupVariants, FieldSeparator(), ItemSeparator() (+27 more)

### Community 12 - "db.ts"
Cohesion: 0.08
Nodes (34): AccountRow, AllocationRow, AnalyticsMonthRow, BudgetRecordRow, BudgetRow, CategoryRow, DB_NAME, DB_VERSION (+26 more)

### Community 13 - "app-sidebar.tsx"
Cohesion: 0.18
Nodes (29): AppearanceOption, APPEARANCES, AppearanceSwitch(), AppSidebar(), SyncDot(), SYSTEM_APPEARANCE, useSyncIndicator(), ShellHeader() (+21 more)

### Community 14 - "editors.ts"
Cohesion: 0.14
Nodes (20): editors, editors, longName, expectHeldRead(), expectRetainedRows(), expectSilentSheet(), expectVisibleBackdrop(), account (+12 more)

### Community 15 - "compilerOptions"
Cohesion: 0.06
Nodes (33): compilerOptions, allowJs, allowSyntheticDefaultImports, allowUnusedLabels, esModuleInterop, forceConsistentCasingInFileNames, incremental, isolatedModules (+25 more)

### Community 16 - "sync/page.tsx"
Cohesion: 0.13
Nodes (28): COUNT_ROWS, DataSettingsPage(), StateRow(), STATUS_TONES, StatusTone, WorkspaceRow(), CardFooter(), clearAllData() (+20 more)

### Community 17 - "monthly-budgets.test.ts"
Cohesion: 0.11
Nodes (11): dexie, fake-indexeddb, xlsx, input, legacyPaceKey, today, decided(), live() (+3 more)

### Community 18 - "suggestions.ts"
Cohesion: 0.11
Nodes (30): allocatedStatements(), asOf(), byDate(), CHIP_LIMIT, CHOICES, Clue, DEFAULT_WEIGHTS, descriptionTokens() (+22 more)

### Community 19 - "dependencies"
Cohesion: 0.07
Nodes (30): dependencies, @base-ui/react, class-variance-authority, clsx, cmdk, dexie, dexie-react-hooks, @fontsource-variable/inter (+22 more)

### Community 20 - "suspicious"
Cohesion: 0.07
Nodes (28): suspicious, noAssignInExpressions, noAsyncPromiseExecutor, noCatchAssign, noClassAssign, noCompareNegZero, noControlCharactersInRegex, noDebugger (+20 more)

### Community 21 - "fixtures.ts"
Cohesion: 0.16
Nodes (15): cardTitles, card(), chartTooltip, overview, overviewCharts, themedRgb(), assertSeeded(), checkSeededMarker() (+7 more)

### Community 22 - "package.json"
Cohesion: 0.07
Nodes (26): private, $schema, type, babel-plugin-react-compiler, @biomejs/biome, clsx, cmdk, @fontsource-variable/inter (+18 more)

### Community 23 - "support/motion.ts"
Cohesion: 0.17
Nodes (20): denseCardConsumers, denseRowConsumers, expectConsumerEntrance(), populatedConsumers, attachSamplingFailure(), expectModalEntrance(), expectModalExit(), expectPopupEntrance() (+12 more)

### Community 24 - "correctness"
Cohesion: 0.08
Nodes (26): noConstantCondition, noConstAssign, noEmptyCharacterClassInRegex, noEmptyPattern, noGlobalObjectCalls, noInvalidBuiltinInstantiation, noInvalidConstructorSuper, noNonoctalDecimalEscape (+18 more)

### Community 25 - "README.md"
Cohesion: 0.08
Nodes (24): Allocate workspace, Allocations, Backup and restore, Categories, Custom-period Budgets, Demo data, Financial terms definitions, Finpoint (+16 more)

### Community 26 - "combobox.tsx"
Cohesion: 0.13
Nodes (21): ComboboxChip(), ComboboxChips(), ComboboxChipsInput(), ComboboxClear(), ComboboxCollection(), ComboboxEmpty(), ComboboxGroup(), ComboboxInput() (+13 more)

### Community 27 - "test-data.ts"
Cohesion: 0.13
Nodes (20): DEFAULT_CATEGORIES, DEFAULT_MONTHLY_BUDGETS, EXPORT_VERSION, FinpointExport, migrateRecordChoices(), SEED_HASH_KEY, BANK_BLURB, between() (+12 more)

### Community 28 - "CONTEXT.md"
Cohesion: 0.11
Nodes (23): Account, Allocate, Allocation, Budget, Category, Drill-down, Duplicate Statement, Irregular (+15 more)

### Community 29 - "core/routes.e2e.ts"
Cohesion: 0.13
Nodes (17): containedFooter(), Child, october, september, PREMATURE, routeReady, titles, expectPointerCursor() (+9 more)

### Community 30 - "amount-filter.tsx"
Cohesion: 0.18
Nodes (19): radix-ui, AmountFilter(), AmountRange, COMPARISONS, describe(), Draft, readRange(), upperBound() (+11 more)

### Community 31 - "components.json"
Cohesion: 0.09
Nodes (21): aliases, components, hooks, lib, ui, utils, iconLibrary, menuAccent (+13 more)

### Community 32 - "core/components.e2e.ts"
Cohesion: 0.14
Nodes (11): desktopOnly, @playwright/test, bounds(), contained(), expectWheelScrollsPageWhileOpen(), expectDropdownPreservesScroll(), scrollWithInput(), settledOverlayAlpha() (+3 more)

### Community 33 - "types.d.ts"
Cohesion: 0.10
Nodes (20): Account, Allocation, AnalyticsSummary, AnalyticsTreatment, Appearance, Budget, Category, CategoryWithChildren (+12 more)

### Community 34 - "command.tsx"
Cohesion: 0.22
Nodes (16): CategoryFilter(), CategoryFilterItem(), Command(), CommandEmpty(), CommandGroup(), CommandInput(), CommandItem(), CommandList() (+8 more)

### Community 35 - "auth-vault.ts"
Cohesion: 0.29
Nodes (14): POST(), POST(), POST(), jose, AUTH_COOKIE_NAME, authCookie(), authCookieConfig(), clientIp() (+6 more)

### Community 36 - "statement-rules.ts"
Cohesion: 0.20
Nodes (14): TREATMENT_VALUES, byCreation(), conditionPattern(), deleteStatementRule(), listStatementRules(), matchesStatement(), NAME_ORDER, previewStatementRule() (+6 more)

### Community 37 - "use-appearance.tsx"
Cohesion: 0.23
Nodes (15): Toaster(), Appearance, applyAppearance(), getStoredAppearance(), handleSystemThemeChange(), initializeAppearance(), isDarkMode(), listeners (+7 more)

### Community 38 - "IndexedDB (Dexie)"
Cohesion: 0.14
Nodes (11): app/**/page.tsx, bun test, IndexedDB (Dexie), Domain and importer tests (Dexie with in-memory IndexedDB), Interactive routes are "use client" (search params via next/navigation), Pages take no props, Root Suspense (keeps routes static), String primary keys (not auto-increment) (+3 more)

### Community 39 - "UI layer"
Cohesion: 0.23
Nodes (12): Background Drive sync, src/data/* (persistence, migrations, seeding, backup serialization, Drive storage), Domain logic, src/logic/* (domain reads and operations), Dashboard month route-group shell, Persistence, Project Shape, React Compiler (enabled) (+4 more)

### Community 40 - "providers.tsx"
Cohesion: 0.23
Nodes (11): metadata, RootLayout(), viewport, Boot(), Providers(), @vercel/analytics, @vercel/speed-insights, TooltipProvider() (+3 more)

### Community 41 - "lucide-react"
Cohesion: 0.34
Nodes (12): lucide-react, pageHref(), pageWindow(), PaginationFooter(), Pagination(), PaginationContent(), PaginationEllipsis(), PaginationItem() (+4 more)

### Community 42 - "alert-dialog.tsx"
Cohesion: 0.34
Nodes (12): DriveOverwriteConfirmation(), AlertDialog(), AlertDialogAction(), AlertDialogCancel(), AlertDialogContent(), AlertDialogDescription(), AlertDialogFooter(), AlertDialogHeader() (+4 more)

### Community 43 - "STYLE.md"
Cohesion: 0.18
Nodes (12): APIs, Arguments, And Props, Code Style, Consistency, Core, Earning Its Place, Finpoint Style Additions, Grouping And Order, Motion and polish (+4 more)

### Community 44 - "formatter"
Cohesion: 0.15
Nodes (13): arrowParentheses, bracketSameLine, bracketSpacing, jsxQuoteStyle, quoteProperties, quoteStyle, semicolons, trailingCommas (+5 more)

### Community 45 - "devDependencies"
Cohesion: 0.15
Nodes (13): devDependencies, babel-plugin-react-compiler, @biomejs/biome, fake-indexeddb, @playwright/test, @tailwindcss/postcss, @types/luxon, @types/node (+5 more)

### Community 46 - "category-history-chart.tsx"
Cohesion: 0.24
Nodes (12): aggregateSeries(), CategoryHistoryChart(), ChartMonth, ChartSeries, MonthBreakdown(), MonthTick(), monthTotal(), prepareMonths() (+4 more)

### Community 47 - "export-import.ts"
Cohesion: 0.28
Nodes (10): exportData(), monthlyBudgetFields(), SYNC_TABLES, TableName, TABLES, DEFAULT_SETTINGS, FinpointSettings, readSettings() (+2 more)

### Community 48 - "Commands"
Cohesion: 0.20
Nodes (11): Agent Behavior, Biome (biome check --write), bun install, bun lint (write-mode), bun lint:check, bun run build, bun types:check, Commands (+3 more)

### Community 49 - "biome.json"
Cohesion: 0.18
Nodes (10): source, assist, actions, files, includes, linter, enabled, overrides (+2 more)

### Community 50 - "rules"
Cohesion: 0.18
Nodes (11): noAdjacentSpacesInRegex, noBannedTypes, noExtraBooleanCast, noUselessCatch, noUselessThisAlias, noUselessTypeConstraint, rules, noFloatingPromises (+3 more)

### Community 52 - "manifest.json"
Cohesion: 0.20
Nodes (9): background_color, description, display, icons, name, scope, short_name, start_url (+1 more)

### Community 53 - "spending-calendar.tsx"
Cohesion: 0.29
Nodes (9): compact(), heat(), INK, LEVELS, quantile(), rampCap(), SpendingCalendar(), STRENGTH (+1 more)

### Community 54 - "scripts"
Cohesion: 0.22
Nodes (9): scripts, build, dev, lint, lint:check, start, test:e2e, types:check (+1 more)

### Community 55 - "Dashboard"
Cohesion: 0.22
Nodes (9): Comparison columns share ordering and show the average arithmetic, Dashboard, Forecast dotted comparison names the previous month, Month context stays separate from Back targets and Record filters, Past empty months show one dated message and import action, Pending Record reasons visible before expansion, Spending Drill-down refund signs, labels and gross arithmetic, Statement pivot amount, account and timestamp (+1 more)

### Community 56 - "SidebarMenuButton"
Cohesion: 0.44
Nodes (7): DEFINITIONS, Term(), SidebarMenuButton(), sidebarMenuButtonVariants, Tooltip(), TooltipContent(), TooltipTrigger()

### Community 57 - "Next.js agent rules block ("This is NOT the Next.js you know")"
Cohesion: 0.29
Nodes (6): app/api/auth/* Route Handlers, node_modules/next/dist/server/lib/generate-agent-files.js, Google OAuth broker (exchange/token/logout), Next.js App Router app (mostly client-side), node_modules/next/dist/docs/, npm run dev (port 5173)

### Community 58 - "formatter"
Cohesion: 0.25
Nodes (8): formatter, attributePosition, enabled, formatWithErrors, indentStyle, indentWidth, lineEnding, lineWidth

### Community 60 - "optionalDependencies"
Cohesion: 0.29
Nodes (7): optionalDependencies, lightningcss-linux-x64-gnu, lightningcss-win32-x64-msvc, @rollup/rollup-linux-x64-gnu, @rollup/rollup-win32-x64-msvc, @tailwindcss/oxide-linux-x64-gnu, @tailwindcss/oxide-win32-x64-msvc

### Community 61 - "tsconfig.e2e.json"
Cohesion: 0.29
Nodes (6): ./tsconfig.json, compilerOptions, incremental, exclude, extends, include

### Community 62 - "Domain docs (single-context layout)"
Cohesion: 0.40
Nodes (6): Agent skills, CONTEXT.md, Domain docs (single-context layout), Domain Language, Issue tracker (local specs and tickets), .scratch/ local work tracking

### Community 63 - "style"
Cohesion: 0.33
Nodes (6): style, noNamespace, noNonNullAssertion, useArrayLiterals, useAsConstAssertion, useBlockStatements

### Community 64 - "0002 Forecast pacing"
Cohesion: 0.33
Nodes (5): 0002 Forecast pacing, Consequences, Context, Decision, Rejected option

### Community 65 - "0001-drill-down-url-state.md"
Cohesion: 0.40
Nodes (4): Compare selection uses included comparison months and title-based uniqueness, Gross and net category selection URL, Comparison window, Drill-down URL state

### Community 66 - "Validation rule (ValidationError + Validator)"
Cohesion: 0.50
Nodes (4): Old Laravel Api/*Controller mapping, Laravel-shaped { field: string[] } error maps, ValidationError, Validator

### Community 67 - "Finpoint icon concept"
Cohesion: 0.40
Nodes (5): Finpoint icon concept, Charcoal shadow halo, Circular point, Rounded F monogram, Off-white icon fill

### Community 68 - "Finpoint icon with charcoal shadow"
Cohesion: 0.40
Nodes (5): Finpoint icon with charcoal shadow, Charcoal shadow halo, Circular point, Rounded F monogram, Off-white icon fill

### Community 69 - "Issue tracker: Local Markdown"
Cohesion: 0.40
Nodes (4): Files, Issue tracker: Local Markdown, Skill operations, Status and dependencies

### Community 70 - "Finpoint"
Cohesion: 0.50
Nodes (4): Finpoint, Circular point, Rounded F monogram, Off-white icon fill

### Community 71 - "Domain docs"
Cohesion: 0.50
Nodes (3): Before exploration, Domain docs, Writing

### Community 72 - "Local Markdown Issue Tracker"
Cohesion: 0.50
Nodes (4): Local Tracker Operations, Spec and Ticket Files, Ticket Lifecycle, Local Markdown Issue Tracker

### Community 74 - "Forecast pacing decision"
Cohesion: 0.67
Nodes (3): Forecast pacing decision, Remaining historical spending scaled by remaining days, Median daily spending fallback including zero days

### Community 75 - "F monogram icon"
Cohesion: 0.67
Nodes (3): Circular dot beside F, Rounded F letterform, F monogram icon

### Community 76 - "JPG favicon icon"
Cohesion: 0.67
Nodes (3): JPG favicon dot, JPG favicon F letterform, JPG favicon icon

### Community 77 - "PNG favicon icon"
Cohesion: 0.67
Nodes (3): PNG favicon dot, PNG favicon F letterform, PNG favicon icon

### Community 78 - "SVG favicon icon"
Cohesion: 0.67
Nodes (3): SVG favicon dot, SVG favicon F letterform, SVG favicon icon

### Community 79 - "F monogram icon"
Cohesion: 0.67
Nodes (3): Circular dot beside F, Rounded F letterform, F monogram icon

### Community 80 - "F monogram icon"
Cohesion: 0.67
Nodes (3): Circular dot beside F, Rounded F letterform, F monogram icon

## Knowledge Gaps
- **130 isolated node(s):** `Root Suspense (keeps routes static)`, `React Compiler (enabled)`, `Static content pages (privacy, terms) are server components`, `bun install`, `bun run build` (+125 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 643 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **16 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `cn()` connect `cn` to `utils.ts`, `Button`, `react`, `importer/page.tsx`, `lib/motion.ts`, `command.tsx`, `primitives.tsx`, `(month)/page.tsx`, `alert-dialog.tsx`, `lucide-react`, `app-sidebar.tsx`, `category-history-chart.tsx`, `sync/page.tsx`, `spending-calendar.tsx`, `SidebarMenuButton`, `combobox.tsx`, `amount-filter.tsx`?**
  _High betweenness centrality (0.093) - this node is a cross-community bridge._
- **What connects `Root Suspense (keeps routes static)`, `React Compiler (enabled)`, `Static content pages (privacy, terms) are server components` to the rest of the system?**
  _130 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `utils.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.05534284719805082 - nodes in this community are weakly interconnected._
- **Why does `react` connect `react` to `utils.ts`, `Button`, `importer/page.tsx`, `lib/motion.ts`, `primitives.tsx`, `(month)/page.tsx`, `cn`, `app-sidebar.tsx`, `sync/page.tsx`, `package.json`, `combobox.tsx`, `amount-filter.tsx`, `command.tsx`, `use-appearance.tsx`, `providers.tsx`, `lucide-react`, `alert-dialog.tsx`, `category-history-chart.tsx`, `spending-calendar.tsx`, `SidebarMenuButton`?**
  _High betweenness centrality (0.066) - this node is a cross-community bridge._
- **Should `Button` be split into smaller, more focused modules?**
  _Cohesion score 0.05745341614906832 - nodes in this community are weakly interconnected._
- **Why does `@playwright/test` connect `core/components.e2e.ts` to `ledger.e2e.ts`, `editors.ts`, `workflows.e2e.ts`, `fixtures.ts`, `package.json`, `support/motion.ts`, `navigation.e2e.ts`, `core/routes.e2e.ts`?**
  _High betweenness centrality (0.060) - this node is a cross-community bridge._
- **Should `react` be split into smaller, more focused modules?**
  _Cohesion score 0.0639763779527559 - nodes in this community are weakly interconnected._