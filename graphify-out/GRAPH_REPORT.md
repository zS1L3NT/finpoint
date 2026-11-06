# Graph Report - t3-69efe8e6  (2026-11-07)

## Corpus Check
- 264 files · ~237,917 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 9 file(s) not represented in the graph (top: (none) 5, .example 1, .lock 1)

## Summary
- 1970 nodes · 7918 edges · 96 communities (83 shown, 13 thin omitted)
- Extraction: 98% EXTRACTED · 2% INFERRED · 0% AMBIGUOUS · INFERRED: 126 edges (avg confidence: 0.84)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `522c4fb9`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- cn
- Button
- monthly-budgets.test.ts
- Tests README
- suggestions.ts
- radix-ui
- combobox.tsx
- Statement
- fixtures.ts
- drive-sync.ts
- lib/motion.ts
- compilerOptions
- editors.ts
- routes.ts
- useHistory
- workflows.e2e.ts
- dependencies
- db.ts
- src/components/*
- Validation rule (ValidationError + Validator)
- lucide-react
- statements.ts
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
- UI layer (app pages + components)
- export-import.ts
- components.json
- sync/page.tsx
- primitives.tsx
- types.d.ts
- STYLE.md
- auth-vault.ts
- app/layout.tsx
- statement-rules.ts
- src/data/* (persistence, migrations, seeding, backup serialization, Drive storage)
- navigation.e2e.ts
- formatter
- devDependencies
- pagination.tsx
- formatCurrency
- Commands
- Next.js agent rules block ("This is NOT the Next.js you know")
- category-filter.tsx
- spending-calendar.tsx
- biome.json
- rules
- manifest.json
- next
- scripts
- 0002 Forecast pacing
- formatter
- Records
- Drill-down
- Domain docs (single-context layout)
- optionalDependencies
- (month)/page.tsx
- tsconfig.e2e.json
- style
- record-creator.tsx
- 0001-drill-down-url-state.md
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
- providers.tsx
- use-appearance.tsx
- category-history-chart.tsx
- trend-chart.tsx
- Forecast pacing decision
- history.tsx

## God Nodes (most connected - your core abstractions)
1. `cn()` - 324 edges
2. `PrimitivesSection()` - 181 edges
3. `Button()` - 125 edges
4. `react` - 100 edges
5. `formatCurrency()` - 78 edges
6. `RecordEditorDialog()` - 61 edges
7. `RecordCreatorDialog()` - 58 edges
8. `UiIcon()` - 56 edges
9. `round2()` - 48 edges
10. `next` - 46 edges

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

## Communities (96 total, 13 thin omitted)

### Community 0 - "cn"
Cohesion: 0.12
Nodes (33): Providers(), AppearanceSwitch(), SidebarContent(), SidebarContext, SidebarContextProps, SidebarFooter(), SidebarGroup(), SidebarGroupAction() (+25 more)

### Community 1 - "Button"
Cohesion: 0.06
Nodes (125): AccountRow, AccountsPage(), BUDGET_STATES, BudgetCard(), BudgetsPage(), BudgetState, formatBudgetDateWindow(), CategoriesPage() (+117 more)

### Community 2 - "monthly-budgets.test.ts"
Cohesion: 0.11
Nodes (10): dexie, fake-indexeddb, xlsx, digestSnapshot(), hashLegacySnapshot(), Snapshot, input, legacyPaceKey (+2 more)

### Community 3 - "Tests README"
Cohesion: 0.06
Nodes (41): Build harness step (vite build tests/harness), Playwright browser cache keyed on bun.lock, blob report merge, Committed graph artifacts (graph.json, GRAPH_REPORT.md, manifest.json, .graphify_labels.json), Graph health warnings and refresh failure reporting, graphify-out/graph.json, graphify skill (--update), graphify update . (+33 more)

### Community 4 - "suggestions.ts"
Cohesion: 0.11
Nodes (30): allocatedStatements(), asOf(), byDate(), CHIP_LIMIT, CHOICES, Clue, DEFAULT_WEIGHTS, descriptionTokens() (+22 more)

### Community 5 - "radix-ui"
Cohesion: 0.15
Nodes (14): class-variance-authority, radix-ui, AppHeader(), ButtonGroup(), ButtonGroupSeparator(), ButtonGroupText(), buttonGroupVariants, FieldSeparator() (+6 more)

### Community 6 - "combobox.tsx"
Cohesion: 0.11
Nodes (25): ComboboxField(), Props, ComboboxChip(), ComboboxChips(), ComboboxChipsInput(), ComboboxClear(), ComboboxCollection(), ComboboxContent() (+17 more)

### Community 7 - "Statement"
Cohesion: 0.18
Nodes (14): CONTEXT.md (domain vocabulary), Account, Allocation, Budget, Category, Duplicate Statement, Monthly Budget, Pending Record (+6 more)

### Community 8 - "fixtures.ts"
Cohesion: 0.14
Nodes (18): cardTitles, card(), chartTooltip, overview, overviewCharts, themedRgb(), ScenarioName, WorkspaceDataset (+10 more)

### Community 9 - "drive-sync.ts"
Cohesion: 0.18
Nodes (31): exportData(), AuthNeededError, cacheToken(), CodeResponse, disconnectDrive(), downloadBackupFile(), driveFetch(), DriveFileMeta (+23 more)

### Community 10 - "lib/motion.ts"
Cohesion: 0.17
Nodes (30): framer-motion, @tanstack/react-table, DataTable(), PaginatedDataTable(), GroupHeaderRow(), groupStarts(), GroupTotal(), isInteractiveTarget() (+22 more)

### Community 11 - "compilerOptions"
Cohesion: 0.06
Nodes (33): compilerOptions, allowJs, allowSyntheticDefaultImports, allowUnusedLabels, esModuleInterop, forceConsistentCasingInFileNames, incremental, isolatedModules (+25 more)

### Community 12 - "editors.ts"
Cohesion: 0.13
Nodes (21): editors, containedFooter(), editors, longName, expectHeldRead(), expectRetainedRows(), expectSilentSheet(), expectPointerCursor() (+13 more)

### Community 13 - "routes.ts"
Cohesion: 0.19
Nodes (26): ReviewLinks(), NotFound(), Template(), AppearanceOption, APPEARANCES, AppSidebar(), SyncDot(), SYSTEM_APPEARANCE (+18 more)

### Community 14 - "useHistory"
Cohesion: 0.19
Nodes (17): AccountCard(), CategoryTile(), CashflowChart(), CashflowPoint, CategoryMovers(), Mover, DailySpendingChart(), MonthlyBudgetLine (+9 more)

### Community 16 - "dependencies"
Cohesion: 0.07
Nodes (30): dependencies, @base-ui/react, class-variance-authority, clsx, cmdk, dexie, dexie-react-hooks, @fontsource-variable/inter (+22 more)

### Community 17 - "db.ts"
Cohesion: 0.12
Nodes (28): AccountRow, AllocationRow, AnalyticsMonthRow, BudgetRecordRow, BudgetRow, CategoryRow, DB_NAME, DB_VERSION (+20 more)

### Community 18 - "src/components/*"
Cohesion: 0.25
Nodes (5): Agent Behavior, Generated / Ignored Files, src/components/*, src/components/ui/**/*, useLiveQuery

### Community 20 - "Validation rule (ValidationError + Validator)"
Cohesion: 0.50
Nodes (4): Old Laravel Api/*Controller mapping, Laravel-shaped { field: string[] } error maps, ValidationError, Validator

### Community 21 - "lucide-react"
Cohesion: 0.22
Nodes (8): lucide-react, ButtonVariant, Month, MonthCal(), MonthCalProps, MonthPicker(), MONTHS, Toaster()

### Community 22 - "statements.ts"
Cohesion: 0.06
Nodes (76): asPending(), clearAllData(), ensureAccount(), updateAccount(), validateBudget(), cleanInput(), descriptionAnchors(), descriptionIdentity() (+68 more)

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

### Community 27 - "dashboard.ts"
Cohesion: 0.11
Nodes (42): db, AnalyticsRecord, AnalyticsSummary, contribution(), summarize(), avg(), BREAKDOWN_MONTHS, buildCashflowHistory() (+34 more)

### Community 28 - "core/components.e2e.ts"
Cohesion: 0.15
Nodes (9): desktopOnly, bounds(), contained(), expectWheelScrollsPageWhileOpen(), expectDropdownPreservesScroll(), scrollWithInput(), settledOverlayAlpha(), APP_URL (+1 more)

### Community 29 - "auto-sync.ts"
Cohesion: 0.12
Nodes (25): SYNC_TABLES, useSyncStatus(), emit(), eventListeners, finishCycle(), flushOnHide(), getSyncSnapshot(), ingestManualResult() (+17 more)

### Community 30 - "support/motion.ts"
Cohesion: 0.16
Nodes (21): denseCardConsumers, denseRowConsumers, expectConsumerEntrance(), populatedConsumers, expectVisibleBackdrop(), attachSamplingFailure(), expectModalEntrance(), expectModalExit() (+13 more)

### Community 31 - "core/routes.e2e.ts"
Cohesion: 0.17
Nodes (14): @playwright/test, Child, october, september, PREMATURE, routeReady, titles, IDS (+6 more)

### Community 32 - "alert-dialog.tsx"
Cohesion: 0.34
Nodes (12): DriveOverwriteConfirmation(), AlertDialog(), AlertDialogAction(), AlertDialogCancel(), AlertDialogContent(), AlertDialogDescription(), AlertDialogFooter(), AlertDialogHeader() (+4 more)

### Community 33 - "UI layer (app pages + components)"
Cohesion: 0.22
Nodes (11): app/**/page.tsx, Interactive routes are "use client" (search params via next/navigation), (month) route-group shell (Overview + Monthly Records), Pages take no props, Project Shape, React Compiler (enabled), Root Suspense (keeps routes static), src/routes.ts (centralized route paths) (+3 more)

### Community 34 - "export-import.ts"
Cohesion: 0.10
Nodes (31): FinpointDB, withoutActionModes(), downloadExport(), EXPORT_VERSION, FinpointExport, importData(), monthlyBudgetFields(), parseImportFile() (+23 more)

### Community 35 - "components.json"
Cohesion: 0.09
Nodes (21): aliases, components, hooks, lib, ui, utils, iconLibrary, menuAccent (+13 more)

### Community 36 - "sync/page.tsx"
Cohesion: 0.12
Nodes (48): ImporterPage(), Step(), EmptyRecords(), metadata, PrivacyPage(), SECTIONS, RecordPage(), learnedSignals() (+40 more)

### Community 38 - "primitives.tsx"
Cohesion: 0.09
Nodes (46): AlertAction(), CardAction(), DropdownMenu(), DropdownMenuCheckboxItem(), DropdownMenuContent(), DropdownMenuGroup(), DropdownMenuItem(), DropdownMenuLabel() (+38 more)

### Community 39 - "types.d.ts"
Cohesion: 0.10
Nodes (20): Account, Allocation, AnalyticsSummary, AnalyticsTreatment, Appearance, Budget, Category, CategoryWithChildren (+12 more)

### Community 40 - "STYLE.md"
Cohesion: 0.17
Nodes (13): APIs, Arguments, And Props, Code Style, Consistency, Copy, Core, Earning Its Place, Finpoint Style Additions, Grouping And Order (+5 more)

### Community 41 - "auth-vault.ts"
Cohesion: 0.29
Nodes (14): POST(), POST(), POST(), jose, AUTH_COOKIE_NAME, authCookie(), authCookieConfig(), clientIp() (+6 more)

### Community 42 - "app/layout.tsx"
Cohesion: 0.40
Nodes (3): metadata, RootLayout(), viewport

### Community 43 - "statement-rules.ts"
Cohesion: 0.16
Nodes (17): StatementRow, byCreation(), conditionPattern(), deleteStatementRule(), listStatementRules(), matchesStatement(), NAME_ORDER, previewStatementRule() (+9 more)

### Community 44 - "src/data/* (persistence, migrations, seeding, backup serialization, Drive storage)"
Cohesion: 0.31
Nodes (8): Background Drive sync, bun test, src/data/* (persistence, migrations, seeding, backup serialization, Drive storage), IndexedDB (Dexie), Domain and importer tests (Dexie with in-memory IndexedDB), src/logic/* (domain reads and operations), Verification, Workspace backup/reset operations

### Community 47 - "formatter"
Cohesion: 0.15
Nodes (13): arrowParentheses, bracketSameLine, bracketSpacing, jsxQuoteStyle, quoteProperties, quoteStyle, semicolons, trailingCommas (+5 more)

### Community 48 - "devDependencies"
Cohesion: 0.15
Nodes (13): devDependencies, babel-plugin-react-compiler, @biomejs/biome, fake-indexeddb, @playwright/test, @tailwindcss/postcss, @types/luxon, @types/node (+5 more)

### Community 49 - "pagination.tsx"
Cohesion: 0.38
Nodes (11): pageHref(), pageWindow(), PaginationFooter(), Pagination(), PaginationContent(), PaginationEllipsis(), PaginationItem(), PaginationLink() (+3 more)

### Community 50 - "formatCurrency"
Cohesion: 0.08
Nodes (71): BudgetPage(), getBudgetAnalytics(), getCategoryData(), Legend(), AllocationProgress(), AllocationExpansion(), AllocationRows(), AllocationSource (+63 more)

### Community 51 - "Commands"
Cohesion: 0.38
Nodes (7): Biome (biome check --write), bun install, bun lint (write-mode), bun lint:check, bun run build, bun types:check, Commands

### Community 52 - "Next.js agent rules block ("This is NOT the Next.js you know")"
Cohesion: 0.25
Nodes (6): app/api/auth/* Route Handlers, node_modules/next/dist/server/lib/generate-agent-files.js, Google OAuth broker (exchange/token/logout), Next.js App Router app (mostly client-side), node_modules/next/dist/docs/, npm run dev (port 5173)

### Community 53 - "category-filter.tsx"
Cohesion: 0.20
Nodes (16): @base-ui/react, CategoryFilter(), CategoryFilterItem(), Command(), CommandEmpty(), CommandGroup(), CommandInput(), CommandItem() (+8 more)

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

### Community 58 - "next"
Cohesion: 0.29
Nodes (7): MonthLayout(), nextConfig, luxon, next, SearchInit, useMonthParams(), armMonthTransition()

### Community 59 - "scripts"
Cohesion: 0.22
Nodes (9): scripts, build, dev, lint, lint:check, start, test:e2e, types:check (+1 more)

### Community 61 - "0002 Forecast pacing"
Cohesion: 0.33
Nodes (5): 0002 Forecast pacing, Consequences, Context, Decision, Rejected option

### Community 62 - "formatter"
Cohesion: 0.25
Nodes (8): formatter, attributePosition, enabled, formatWithErrors, indentStyle, indentWidth, lineEnding, lineWidth

### Community 63 - "Records"
Cohesion: 0.32
Nodes (8): Allocator, Budgets, Categories, Dashboard, Statement-allocation-record model, Monthly Budgets, Records, Statement importer

### Community 65 - "Domain docs (single-context layout)"
Cohesion: 0.33
Nodes (7): Agent skills, CONTEXT.md, Domain docs (single-context layout), Domain Language, Issue tracker (local specs and tickets), .scratch/ local work tracking, String primary keys (not auto-increment)

### Community 66 - "optionalDependencies"
Cohesion: 0.29
Nodes (7): optionalDependencies, lightningcss-linux-x64-gnu, lightningcss-win32-x64-msvc, @rollup/rollup-linux-x64-gnu, @rollup/rollup-win32-x64-msvc, @tailwindcss/oxide-linux-x64-gnu, @tailwindcss/oxide-win32-x64-msvc

### Community 67 - "(month)/page.tsx"
Cohesion: 0.16
Nodes (19): Comparison, comparisonRateText(), comparisonText(), ComparisonValue, DashboardData, DashboardMonthlyBudget, DashboardPage(), DashboardView (+11 more)

### Community 68 - "tsconfig.e2e.json"
Cohesion: 0.29
Nodes (6): ./tsconfig.json, compilerOptions, incremental, exclude, extends, include

### Community 69 - "style"
Cohesion: 0.33
Nodes (6): style, noNamespace, noNonNullAssertion, useArrayLiterals, useAsConstAssertion, useBlockStatements

### Community 70 - "record-creator.tsx"
Cohesion: 0.06
Nodes (116): AccountPage(), CARD_MOTION, DuplicateGroupCard(), FixDuplicatesPage(), GroupHeader(), highlightDifferences(), VIEWS, AllocatorPage() (+108 more)

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

### Community 95 - "providers.tsx"
Cohesion: 0.16
Nodes (15): Boot(), @vercel/analytics, @vercel/speed-insights, DEFAULT_CATEGORIES, DEFAULT_MONTHLY_BUDGETS, tableCounts(), SEED_HASH_KEY, seedIfEmpty() (+7 more)

### Community 97 - "use-appearance.tsx"
Cohesion: 0.26
Nodes (14): Appearance, applyAppearance(), getStoredAppearance(), handleSystemThemeChange(), initializeAppearance(), isDarkMode(), listeners, mediaQuery() (+6 more)

### Community 98 - "category-history-chart.tsx"
Cohesion: 0.27
Nodes (11): aggregateSeries(), CategoryHistoryChart(), ChartMonth, ChartSeries, MonthBreakdown(), MonthTick(), monthTotal(), prepareMonths() (+3 more)

### Community 100 - "trend-chart.tsx"
Cohesion: 0.16
Nodes (19): bar(), BarChart(), BarSeries, PAD, ChartFrame(), ChartSize, ReadoutRows(), arc() (+11 more)

### Community 102 - "Forecast pacing decision"
Cohesion: 0.67
Nodes (3): Forecast pacing decision, Remaining historical spending scaled by remaining days, Median daily spending fallback including zero days

### Community 103 - "history.tsx"
Cohesion: 0.39
Nodes (7): getStoredHistory(), getValidHistory(), HistoryContext, HistoryItem, HistoryProvider(), normaliseUrl(), withoutTrailingSelf()

## Knowledge Gaps
- **88 isolated node(s):** `@fontsource-variable/inter`, `shadcn`, `tailwindcss`, `tw-animate-css`, `@biomejs/biome` (+83 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 602 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **13 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `cn()` connect `cn` to `alert-dialog.tsx`, `Button`, `category-history-chart.tsx`, `(month)/page.tsx`, `sync/page.tsx`, `trend-chart.tsx`, `record-creator.tsx`, `primitives.tsx`, `radix-ui`, `combobox.tsx`, `lib/motion.ts`, `useHistory`, `pagination.tsx`, `formatCurrency`, `category-filter.tsx`, `spending-calendar.tsx`, `lucide-react`, `next`?**
  _High betweenness centrality (0.100) - this node is a cross-community bridge._
- **What connects `@fontsource-variable/inter`, `shadcn`, `tailwindcss` to the rest of the system?**
  _88 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `cn` be split into smaller, more focused modules?**
  _Cohesion score 0.12063492063492064 - nodes in this community are weakly interconnected._
- **Why does `src/data/* (persistence, migrations, seeding, backup serialization, Drive storage)` connect `src/data/* (persistence, migrations, seeding, backup serialization, Drive storage)` to `UI layer (app pages + components)`, `providers.tsx`?**
  _High betweenness centrality (0.079) - this node is a cross-community bridge._
- **Should `Button` be split into smaller, more focused modules?**
  _Cohesion score 0.05580192165558019 - nodes in this community are weakly interconnected._
- **Why does `layer segregation (UI / logic / data)` connect `UI layer (app pages + components)` to `Tests README`, `Next.js agent rules block ("This is NOT the Next.js you know")`, `src/data/* (persistence, migrations, seeding, backup serialization, Drive storage)`?**
  _High betweenness centrality (0.062) - this node is a cross-community bridge._
- **Should `monthly-budgets.test.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.1111111111111111 - nodes in this community are weakly interconnected._