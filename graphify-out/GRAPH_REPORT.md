# Graph Report - t3-d339ffd2  (2026-10-25)

## Corpus Check
- 250 files · ~217,674 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 9 file(s) not represented in the graph (top: (none) 5, .example 1, .lock 1)

## Summary
- 1914 nodes · 7647 edges · 89 communities (80 shown, 9 thin omitted)
- Extraction: 98% EXTRACTED · 2% INFERRED · 0% AMBIGUOUS · INFERRED: 119 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `479a1c53`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- record-editor.tsx
- @playwright/test
- category-history-chart.tsx
- displays.tsx
- cn
- combobox.tsx
- sync/page.tsx
- collectTests
- importer/page.tsx
- dashboard.ts
- app.tsx
- compilerOptions
- history.tsx
- package.json
- dependencies
- src/data/* (persistence, migrations, seeding, backup serialization, Drive storage)
- app-sidebar.tsx
- budgets/page.tsx
- suspicious
- primitives.tsx
- Button
- correctness
- export-import.ts
- auto-sync.ts
- Validation rule (ValidationError + Validator)
- components.json
- Commands
- runner.ts
- shared.ts
- (month)/layout.tsx
- pagination.tsx
- statement-rules.ts
- use-sync-status.ts
- total-spending-chart.tsx
- STYLE.md
- (month)/page.tsx
- Monthly Budget
- auth-vault.ts
- tests_web_support_fixtures_expect
- AGENTS.md
- category-filter.tsx
- types.d.ts
- fixtures.ts
- editors.ts
- formatter
- db.ts
- ledger.e2e.ts
- support/motion.ts
- biome.json
- rules
- devDependencies
- manifest.json
- core/components.e2e.ts
- Next.js agent rules block ("This is NOT the Next.js you know")
- monthly-budget-usage.tsx
- Project Graph
- vite.config.ts
- formatter
- Commit Guide
- Records
- providers.tsx
- optionalDependencies
- scripts
- style
- Finpoint icon concept
- Finpoint icon with charcoal shadow
- core/routes.e2e.ts
- radix-ui
- Finpoint
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
- Unrestricted crawler policy
- Generated demo data
- Progressive Web Application
- Issue tracker: Local Markdown
- Domain docs
- utils.ts
- tsconfig.web.json

## God Nodes (most connected - your core abstractions)
1. `cn()` - 320 edges
2. `PrimitivesSection()` - 184 edges
3. `Button()` - 125 edges
4. `react` - 96 edges
5. `formatCurrency()` - 81 edges
6. `RecordEditorDialog()` - 63 edges
7. `UiIcon()` - 56 edges
8. `RecordCreatorDialog()` - 52 edges
9. `round2()` - 44 edges
10. `PageContent()` - 42 edges

## Surprising Connections (you probably didn't know these)
- `Rendered assertions` --references--> `SelectItem()`  [INFERRED]
  tests/web/README.md → src/components/ui/select.tsx
- `Titles and tags` --references--> `describe()`  [INFERRED]
  tests/web/README.md → scripts/test/lib/summary.ts
- `Finpoint Style Additions` --references--> `useApiFormErrors()`  [INFERRED]
  STYLE.md → src/hooks/use-api-form-errors.ts
- `Copy` --references--> `pluralize()`  [INFERRED]
  STYLE.md → src/lib/utils.ts
- `Finpoint Style Additions` --references--> `ValidationError`  [INFERRED]
  STYLE.md → src/logic/validate.ts

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **Project graph refresh workflow** — agents_graph_refresh_rule, agents_graphify_update, agents_graphify_skill, agents_graph_artifacts_committed, agents_graph_local_only_rule [EXTRACTED 1.00]
- **UI / logic / data layer segregation** — agents_ui_layer, agents_logic_layer, agents_data_layer, agents_data_import_boundary [EXTRACTED 1.00]
- **Laravel-shaped validation pipeline** — agents_validation_rule, agents_validation_error, agents_validator, src_logic_validate, agents_laravel_shaped_error_maps [EXTRACTED 1.00]

## Communities (89 total, 9 thin omitted)

### Community 0 - "record-editor.tsx"
Cohesion: 0.06
Nodes (121): CandidateResults(), sonner, @tanstack/react-form, AccountDialog(), BudgetCreatorDialog(), BudgetEditorDialog(), CategoryDialog(), CategoryFormValues (+113 more)

### Community 1 - "@playwright/test"
Cohesion: 0.17
Nodes (12): @playwright/test, cardTitles, Child, october, september, card(), overview, overviewCharts (+4 more)

### Community 2 - "category-history-chart.tsx"
Cohesion: 0.11
Nodes (35): recharts, BudgetActiveDot(), BudgetProgressChart(), BudgetProgressPoint, colorChange(), aggregateSeries(), CategoryHistoryChart(), ChartMonth (+27 more)

### Community 3 - "displays.tsx"
Cohesion: 0.22
Nodes (11): AllocateBar(), Sparkline(), Delta, Metric(), MonthlyBudgetBadge(), RecordAmount(), ValueSwap(), DURATION (+3 more)

### Community 4 - "cn"
Cohesion: 0.13
Nodes (30): AppearanceSwitch(), SidebarContent(), SidebarContext, SidebarContextProps, SidebarFooter(), SidebarGroup(), SidebarGroupAction(), SidebarGroupContent() (+22 more)

### Community 5 - "combobox.tsx"
Cohesion: 0.13
Nodes (21): @base-ui/react, ComboboxField(), Props, ComboboxChip(), ComboboxChips(), ComboboxChipsInput(), ComboboxClear(), ComboboxCollection() (+13 more)

### Community 6 - "sync/page.tsx"
Cohesion: 0.15
Nodes (27): COUNT_ROWS, DataSettingsPage(), StateRow(), STATUS_TONES, StatusTone, WorkspaceRow(), AlertDialog(), AlertDialogAction() (+19 more)

### Community 7 - "collectTests"
Cohesion: 0.28
Nodes (16): collectTests(), conditionBranch(), detailsTags(), disabled(), mentionsMotion(), record(), splitTestCallee(), tagValues() (+8 more)

### Community 8 - "importer/page.tsx"
Cohesion: 0.06
Nodes (81): ACCEPT, BANKS_REQUIRING_ADDITIONAL_INFO, ImporterPage(), Step(), asPending(), BANKS, AccountActivity, ensureAccount() (+73 more)

### Community 9 - "dashboard.ts"
Cohesion: 0.10
Nodes (44): AnalyticsRecord, AnalyticsSummary, contribution(), summarize(), avg(), BREAKDOWN_MONTHS, buildCashflowHistory(), buildCategories() (+36 more)

### Community 10 - "app.tsx"
Cohesion: 0.20
Nodes (8): metadata, RootLayout(), viewport, react-dom, App(), HarnessSection, sectionFromLocation(), root

### Community 11 - "compilerOptions"
Cohesion: 0.06
Nodes (33): compilerOptions, allowJs, allowSyntheticDefaultImports, allowUnusedLabels, esModuleInterop, forceConsistentCasingInFileNames, incremental, isolatedModules (+25 more)

### Community 12 - "history.tsx"
Cohesion: 0.39
Nodes (7): getStoredHistory(), getValidHistory(), HistoryContext, HistoryItem, HistoryProvider(), normaliseUrl(), withoutTrailingSelf()

### Community 13 - "package.json"
Cohesion: 0.07
Nodes (29): private, $schema, type, babel-plugin-react-compiler, @biomejs/biome, clsx, cmdk, @fontsource-variable/inter (+21 more)

### Community 14 - "dependencies"
Cohesion: 0.07
Nodes (30): dependencies, @base-ui/react, class-variance-authority, clsx, cmdk, dexie, dexie-react-hooks, @fontsource-variable/inter (+22 more)

### Community 15 - "src/data/* (persistence, migrations, seeding, backup serialization, Drive storage)"
Cohesion: 0.15
Nodes (17): app/**/page.tsx, Background Drive sync, src/data/* (persistence, migrations, seeding, backup serialization, Drive storage), IndexedDB (Dexie), Interactive routes are "use client" (search params via next/navigation), src/logic/* (domain reads and operations), (month) route-group shell (Overview + Monthly Records), Pages take no props (+9 more)

### Community 16 - "app-sidebar.tsx"
Cohesion: 0.10
Nodes (41): NotFound(), Template(), lucide-react, ICONS, AppearanceOption, APPEARANCES, AppSidebar(), SyncDot() (+33 more)

### Community 17 - "budgets/page.tsx"
Cohesion: 0.14
Nodes (35): BUDGET_STATES, BudgetCard(), BudgetsPage(), formatBudgetDateWindow(), framer-motion, @tanstack/react-table, DataTable(), PaginatedDataTable() (+27 more)

### Community 18 - "suspicious"
Cohesion: 0.07
Nodes (28): suspicious, noAssignInExpressions, noAsyncPromiseExecutor, noCatchAssign, noClassAssign, noCompareNegZero, noControlCharactersInRegex, noDebugger (+20 more)

### Community 19 - "primitives.tsx"
Cohesion: 0.09
Nodes (47): Providers(), AlertAction(), AlertDialogTrigger(), DropdownMenu(), DropdownMenuCheckboxItem(), DropdownMenuContent(), DropdownMenuGroup(), DropdownMenuItem() (+39 more)

### Community 20 - "Button"
Cohesion: 0.05
Nodes (169): AccountPage(), AccountCard(), AccountRow, AccountsPage(), CARD_MOTION, DuplicateGroupCard(), FixDuplicatesPage(), GroupHeader() (+161 more)

### Community 21 - "correctness"
Cohesion: 0.08
Nodes (26): noConstantCondition, noConstAssign, noEmptyCharacterClassInRegex, noEmptyPattern, noGlobalObjectCalls, noInvalidBuiltinInstantiation, noInvalidConstructorSuper, noNonoctalDecimalEscape (+18 more)

### Community 22 - "export-import.ts"
Cohesion: 0.18
Nodes (17): clearAllData(), downloadExport(), EXPORT_VERSION, exportData(), FinpointExport, importData(), parseImportFile(), SYNC_TABLES (+9 more)

### Community 23 - "auto-sync.ts"
Cohesion: 0.11
Nodes (46): AuthNeededError, cacheToken(), CodeResponse, disconnectDrive(), downloadBackupFile(), driveFetch(), DriveFileMeta, ensureDriveToken() (+38 more)

### Community 24 - "Validation rule (ValidationError + Validator)"
Cohesion: 0.50
Nodes (4): Old Laravel Api/*Controller mapping, Laravel-shaped { field: string[] } error maps, ValidationError, Validator

### Community 26 - "components.json"
Cohesion: 0.09
Nodes (21): aliases, components, hooks, lib, ui, utils, iconLibrary, menuAccent (+13 more)

### Community 27 - "Commands"
Cohesion: 0.38
Nodes (7): Biome (biome check --write), bun install, bun lint (write-mode), bun lint:check, bun run build, bun types:check, Commands

### Community 28 - "runner.ts"
Cohesion: 0.09
Nodes (38): describeHolder(), LOCK_DIR, readHolder(), refuse(), releaseLock(), takeLock(), awaitGroupExit(), groupAlive() (+30 more)

### Community 30 - "shared.ts"
Cohesion: 0.17
Nodes (15): BANK_BLURB, between(), CATEGORIES, DAILY, generateTestData(), Meal, MONTHLY_BUDGETS, pad() (+7 more)

### Community 31 - "(month)/layout.tsx"
Cohesion: 0.13
Nodes (27): BudgetState, MonthLayout(), react-day-picker, DateField(), Props, DateRange(), DateRangeValue, formatRange() (+19 more)

### Community 32 - "pagination.tsx"
Cohesion: 0.38
Nodes (11): pageHref(), pageWindow(), PaginationFooter(), Pagination(), PaginationContent(), PaginationEllipsis(), PaginationItem(), PaginationLink() (+3 more)

### Community 33 - "statement-rules.ts"
Cohesion: 0.11
Nodes (16): dexie, fake-indexeddb, xlsx, StatementRow, byCreation(), conditionPattern(), deleteStatementRule(), listStatementRules() (+8 more)

### Community 34 - "use-sync-status.ts"
Cohesion: 0.60
Nodes (4): useSyncStatus(), getSyncSnapshot(), subscribeSync(), SyncSnapshot

### Community 35 - "total-spending-chart.tsx"
Cohesion: 0.18
Nodes (18): CashflowChart(), CashflowPoint, colorChange(), currencyOrDash(), LegendItem(), mobileAmount, seriesLabel(), StatefulActiveDot() (+10 more)

### Community 36 - "STYLE.md"
Cohesion: 0.17
Nodes (13): APIs, Arguments, And Props, Code Style, Consistency, Copy, Core, Earning Its Place, Finpoint Style Additions, Grouping And Order (+5 more)

### Community 37 - "(month)/page.tsx"
Cohesion: 0.12
Nodes (32): Comparison, comparisonRateText(), comparisonText(), ComparisonValue, DashboardData, DashboardMonthlyBudget, DashboardPage(), DashboardView (+24 more)

### Community 38 - "Monthly Budget"
Cohesion: 0.18
Nodes (16): CONTEXT.md (domain vocabulary), Account, Allocation, Budget, Category, Duplicate Statement, Finpoint Domain Glossary, Monthly Budget (+8 more)

### Community 39 - "auth-vault.ts"
Cohesion: 0.32
Nodes (13): POST(), POST(), POST(), AUTH_COOKIE_NAME, authCookie(), authCookieConfig(), clientIp(), encryptionKey() (+5 more)

### Community 42 - "AGENTS.md"
Cohesion: 0.18
Nodes (12): Agent Behavior, Agent skills, CONTEXT.md, Conventions, Domain docs (single-context layout), Domain Language, Generated / Ignored Files, Issue tracker (local specs and tickets) (+4 more)

### Community 43 - "category-filter.tsx"
Cohesion: 0.21
Nodes (16): CategoryFilter(), CategoryFilterItem(), Command(), CommandEmpty(), CommandGroup(), CommandInput(), CommandItem(), CommandList() (+8 more)

### Community 44 - "types.d.ts"
Cohesion: 0.08
Nodes (28): Account, Allocation, AnalyticsSummary, AnalyticsTreatment, Appearance, Budget, Category, CategoryWithChildren (+20 more)

### Community 45 - "fixtures.ts"
Cohesion: 0.12
Nodes (12): DBS_VALID, ScenarioName, WorkspaceDataset, WorkspaceTables, assertSeeded(), checkSeededMarker(), countStore(), seedInBrowser() (+4 more)

### Community 46 - "editors.ts"
Cohesion: 0.13
Nodes (20): editors, longName, expectHeldRead(), expectRetainedRows(), expectSilentSheet(), editors, expectVisibleBackdrop(), account (+12 more)

### Community 47 - "formatter"
Cohesion: 0.15
Nodes (13): arrowParentheses, bracketSameLine, bracketSpacing, jsxQuoteStyle, quoteProperties, quoteStyle, semicolons, trailingCommas (+5 more)

### Community 48 - "db.ts"
Cohesion: 0.11
Nodes (28): AccountRow, AllocationRow, AnalyticsMonthRow, BudgetRecordRow, BudgetRow, CategoryRow, DB_NAME, DB_VERSION (+20 more)

### Community 49 - "ledger.e2e.ts"
Cohesion: 0.11
Nodes (24): behaviourCoverage, componentInventory, facetNotApplicable, InventoryEntry, notApplicable, openFacets, RouteEntry, routeInventory (+16 more)

### Community 50 - "support/motion.ts"
Cohesion: 0.17
Nodes (18): denseCardConsumers, denseRowConsumers, expectConsumerEntrance(), populatedConsumers, attachSamplingFailure(), expectPopupEntrance(), expectReducedRowMovement(), expectVisibleRowCascade() (+10 more)

### Community 51 - "biome.json"
Cohesion: 0.18
Nodes (10): source, assist, actions, files, includes, linter, enabled, overrides (+2 more)

### Community 52 - "rules"
Cohesion: 0.18
Nodes (11): noAdjacentSpacesInRegex, noBannedTypes, noExtraBooleanCast, noUselessCatch, noUselessThisAlias, noUselessTypeConstraint, rules, noFloatingPromises (+3 more)

### Community 54 - "devDependencies"
Cohesion: 0.15
Nodes (13): devDependencies, babel-plugin-react-compiler, @biomejs/biome, fake-indexeddb, @playwright/test, @tailwindcss/postcss, @types/luxon, @types/node (+5 more)

### Community 55 - "manifest.json"
Cohesion: 0.20
Nodes (9): background_color, description, display, icons, name, scope, short_name, start_url (+1 more)

### Community 56 - "core/components.e2e.ts"
Cohesion: 0.15
Nodes (9): desktopOnly, bounds(), contained(), expectWheelScrollsPageWhileOpen(), expectDropdownPreservesScroll(), scrollWithInput(), settledOverlayAlpha(), APP_URL (+1 more)

### Community 57 - "Next.js agent rules block ("This is NOT the Next.js you know")"
Cohesion: 0.18
Nodes (9): app/api/auth/* Route Handlers, bun test, node_modules/next/dist/server/lib/generate-agent-files.js, Google OAuth broker (exchange/token/logout), Domain and importer tests (Dexie with in-memory IndexedDB), Next.js App Router app (mostly client-side), node_modules/next/dist/docs/, npm run dev (port 5173) (+1 more)

### Community 58 - "monthly-budget-usage.tsx"
Cohesion: 0.39
Nodes (6): arc(), centerCurrency(), MonthlyBudgetUsage(), MonthlyBudgetUsageItem, compactAmount, formatChartCurrency()

### Community 59 - "Project Graph"
Cohesion: 0.39
Nodes (6): Committed graph artifacts (graph.json, GRAPH_REPORT.md, manifest.json, .graphify_labels.json), Graph health warnings and refresh failure reporting, graphify-out/graph.json, graphify skill (--update), graphify update ., Project Graph

### Community 60 - "vite.config.ts"
Cohesion: 0.29
Nodes (4): vite, @vitejs/plugin-react, harnessDir, repoRoot

### Community 61 - "formatter"
Cohesion: 0.25
Nodes (8): formatter, attributePosition, enabled, formatWithErrors, indentStyle, indentWidth, lineEnding, lineWidth

### Community 62 - "Commit Guide"
Cohesion: 0.25
Nodes (4): Branches, Commit Guide, Commits, Pull Requests

### Community 63 - "Records"
Cohesion: 0.32
Nodes (8): Allocator, Budgets, Categories, Dashboard, Statement-allocation-record model, Monthly Budgets, Records, Statement importer

### Community 64 - "providers.tsx"
Cohesion: 0.18
Nodes (14): Boot(), db, DEFAULT_CATEGORIES, DEFAULT_MONTHLY_BUDGETS, tableCounts(), SEED_HASH_KEY, seedIfEmpty(), digestSnapshot() (+6 more)

### Community 65 - "optionalDependencies"
Cohesion: 0.29
Nodes (7): optionalDependencies, lightningcss-linux-x64-gnu, lightningcss-win32-x64-msvc, @rollup/rollup-linux-x64-gnu, @rollup/rollup-win32-x64-msvc, @tailwindcss/oxide-linux-x64-gnu, @tailwindcss/oxide-win32-x64-msvc

### Community 66 - "scripts"
Cohesion: 0.17
Nodes (12): scripts, build, dev, lint, lint:check, start, test:web, test:web:core (+4 more)

### Community 68 - "style"
Cohesion: 0.33
Nodes (6): style, noNamespace, noNonNullAssertion, useArrayLiterals, useAsConstAssertion, useBlockStatements

### Community 70 - "Finpoint icon concept"
Cohesion: 0.40
Nodes (5): Finpoint icon concept, Charcoal shadow halo, Circular point, Rounded F monogram, Off-white icon fill

### Community 71 - "Finpoint icon with charcoal shadow"
Cohesion: 0.40
Nodes (5): Finpoint icon with charcoal shadow, Charcoal shadow halo, Circular point, Rounded F monogram, Off-white icon fill

### Community 72 - "core/routes.e2e.ts"
Cohesion: 0.22
Nodes (9): containedFooter(), PREMATURE, routeReady, titles, expectPointerCursor(), IDS, fits(), patchRows() (+1 more)

### Community 73 - "radix-ui"
Cohesion: 0.16
Nodes (13): class-variance-authority, radix-ui, AppHeader(), ButtonGroup(), ButtonGroupSeparator(), ButtonGroupText(), buttonGroupVariants, FieldSeparator() (+5 more)

### Community 74 - "Finpoint"
Cohesion: 0.50
Nodes (4): Finpoint, Circular point, Rounded F monogram, Off-white icon fill

### Community 75 - "Local Markdown Issue Tracker"
Cohesion: 0.50
Nodes (4): Local Tracker Operations, Spec and Ticket Files, Ticket Lifecycle, Local Markdown Issue Tracker

### Community 77 - "Google Drive sync"
Cohesion: 0.50
Nodes (4): Google Drive sync, JSON backup and restore, Local-first finance tracking, Sync conflict handling

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

### Community 96 - "utils.ts"
Cohesion: 0.25
Nodes (9): luxon, compact(), INK, LEVELS, quantile(), rampCap(), SpendingCalendar(), WEEKDAYS (+1 more)

### Community 98 - "tsconfig.web.json"
Cohesion: 0.29
Nodes (6): ./tsconfig.json, compilerOptions, incremental, exclude, extends, include

## Knowledge Gaps
- **72 isolated node(s):** `@fontsource-variable/inter`, `shadcn`, `tailwindcss`, `tw-animate-css`, `@biomejs/biome` (+67 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 584 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **9 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `cn()` connect `cn` to `record-editor.tsx`, `utils.ts`, `category-history-chart.tsx`, `displays.tsx`, `total-spending-chart.tsx`, `(month)/page.tsx`, `sync/page.tsx`, `combobox.tsx`, `importer/page.tsx`, `radix-ui`, `pagination.tsx`, `category-filter.tsx`, `budgets/page.tsx`, `primitives.tsx`, `Button`, `monthly-budget-usage.tsx`, `(month)/layout.tsx`?**
  _High betweenness centrality (0.092) - this node is a cross-community bridge._
- **What connects `@fontsource-variable/inter`, `shadcn`, `tailwindcss` to the rest of the system?**
  _72 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `record-editor.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.0629726932569063 - nodes in this community are weakly interconnected._
- **Why does `react` connect `Button` to `record-editor.tsx`, `category-history-chart.tsx`, `displays.tsx`, `cn`, `combobox.tsx`, `sync/page.tsx`, `importer/page.tsx`, `app.tsx`, `history.tsx`, `package.json`, `app-sidebar.tsx`, `budgets/page.tsx`, `primitives.tsx`, `(month)/layout.tsx`, `pagination.tsx`, `use-sync-status.ts`, `total-spending-chart.tsx`, `(month)/page.tsx`, `category-filter.tsx`, `monthly-budget-usage.tsx`, `providers.tsx`, `radix-ui`?**
  _High betweenness centrality (0.065) - this node is a cross-community bridge._
- **Should `category-history-chart.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.11295681063122924 - nodes in this community are weakly interconnected._
- **Why does `@playwright/test` connect `@playwright/test` to `core/routes.e2e.ts`, `tests_web_support_fixtures_expect`, `package.json`, `editors.ts`, `fixtures.ts`, `ledger.e2e.ts`, `support/motion.ts`, `core/components.e2e.ts`?**
  _High betweenness centrality (0.063) - this node is a cross-community bridge._
- **Should `cn` be split into smaller, more focused modules?**
  _Cohesion score 0.13257575757575757 - nodes in this community are weakly interconnected._