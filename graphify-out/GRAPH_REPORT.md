# Graph Report - t3-69efe8e6  (2026-11-08)

## Corpus Check
- cluster-only mode — file stats not available

## Summary
- 2009 nodes · 8047 edges · 97 communities (86 shown, 11 thin omitted)
- Extraction: 98% EXTRACTED · 2% INFERRED · 0% AMBIGUOUS · INFERRED: 129 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `c4712806`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- RecordEditorDialog
- allocator/page.tsx
- db.ts
- Tests README
- (month)/page.tsx
- use-appearance.tsx
- history.tsx
- paginated-data-table.tsx
- primitives.tsx
- sidebar.tsx
- dashboard.ts
- providers.tsx
- cn
- auto-sync.ts
- editors.ts
- compilerOptions
- icon.tsx
- record-creator.tsx
- routes.ts
- Button
- Validator
- suggestions.ts
- package.json
- dependencies
- test-data.ts
- ledger.e2e.ts
- suspicious
- fixtures.ts
- support/motion.ts
- correctness
- app.tsx
- Boot
- README.md
- core/routes.e2e.ts
- category-history-chart.tsx
- category-filter.tsx
- components.json
- CONTEXT.md
- core/components.e2e.ts
- types.d.ts
- auth-vault.ts
- sync/page.tsx
- formatCurrency
- STYLE.md
- record-editor.tsx
- UI layer (app pages + components)
- formatter
- devDependencies
- monthpicker.tsx
- pagination.tsx
- biome.json
- rules
- data.ts
- export-import.ts
- src/data/* (persistence, migrations, seeding, backup serialization, Drive storage)
- manifest.json
- spending-calendar.tsx
- Next.js agent rules block ("This is NOT the Next.js you know")
- scripts
- src/components/*
- formatter
- navigation.e2e.ts
- Domain docs (single-context layout)
- Commands
- optionalDependencies
- utils.ts
- tsconfig.e2e.json
- Comparison window
- style
- 0002 Forecast pacing
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
- Dashboard
- Finpoint app icon
- Dashboard Attention
- Domain Documentation Conflicts
- Dashboard Attention
- Conventions
- Unrestricted crawler policy
- Calendar day Drill-down
- statement-rules.ts
- alert-dialog.tsx

## God Nodes (most connected - your core abstractions)
1. `cn()` - 330 edges
2. `PrimitivesSection()` - 181 edges
3. `Button()` - 127 edges
4. `react` - 100 edges
5. `formatCurrency()` - 82 edges
6. `RecordEditorDialog()` - 67 edges
7. `UiIcon()` - 60 edges
8. `RecordCreatorDialog()` - 58 edges
9. `round2()` - 48 edges
10. `pluralize()` - 46 edges

## Surprising Connections (you probably didn't know these)
- `Largest selection preserves amount order before pagination` --documents--> `Selection`  [INFERRED]
  docs/adr/0001-drill-down-url-state.md → src/logic/drilldown.ts
- `Finpoint Style Additions` --references--> `useApiFormErrors()`  [INFERRED]
  STYLE.md → src/hooks/use-api-form-errors.ts
- `Copy` --references--> `pluralize()`  [INFERRED]
  STYLE.md → src/lib/utils.ts
- `Finpoint Style Additions` --references--> `ValidationError`  [INFERRED]
  STYLE.md → src/logic/validate.ts
- `Boot()` --indirect_call--> `preloadCategoryIcons()`  [INFERRED]
  app/providers.tsx → src/components/icon.tsx

## Import Cycles
- None detected.

## Communities (97 total, 11 thin omitted)

### Community 0 - "RecordEditorDialog"
Cohesion: 0.19
Nodes (42): sonner, @tanstack/react-form, AccountDialog(), BudgetCreatorDialog(), BudgetEditorDialog(), COLOURS, MonthlyBudgetDialog(), PendingStatementDialog() (+34 more)

### Community 1 - "allocator/page.tsx"
Cohesion: 0.06
Nodes (124): AccountPage(), AccountCard(), AccountRow, AccountsPage(), AllocatorPage(), BudgetPage(), Legend(), CategoriesPage() (+116 more)

### Community 2 - "db.ts"
Cohesion: 0.09
Nodes (19): dexie, fake-indexeddb, xlsx, DB_NAME, DB_VERSION, MetaRow, SettingsRow, StatementRow (+11 more)

### Community 3 - "Tests README"
Cohesion: 0.06
Nodes (41): Build harness step (vite build tests/harness), Playwright browser cache keyed on bun.lock, blob report merge, Committed graph artifacts (graph.json, GRAPH_REPORT.md, manifest.json, .graphify_labels.json), Graph health warnings and refresh failure reporting, graphify-out/graph.json, graphify skill (--update), graphify update . (+33 more)

### Community 4 - "(month)/page.tsx"
Cohesion: 0.11
Nodes (29): MonthLayout(), AttentionList(), Comparison, comparisonText(), ComparisonValue, DashboardData, DashboardMonthlyBudget, DashboardPage() (+21 more)

### Community 5 - "use-appearance.tsx"
Cohesion: 0.26
Nodes (14): Appearance, applyAppearance(), getStoredAppearance(), handleSystemThemeChange(), initializeAppearance(), isDarkMode(), listeners, mediaQuery() (+6 more)

### Community 6 - "history.tsx"
Cohesion: 0.39
Nodes (7): getStoredHistory(), getValidHistory(), HistoryContext, HistoryItem, HistoryProvider(), normaliseUrl(), withoutTrailingSelf()

### Community 7 - "paginated-data-table.tsx"
Cohesion: 0.21
Nodes (26): @tanstack/react-table, DataTable(), PaginatedDataTable(), PaginationHeader(), GroupHeaderRow(), groupStarts(), GroupTotal(), isInteractiveTarget() (+18 more)

### Community 8 - "primitives.tsx"
Cohesion: 0.08
Nodes (58): ComboboxField(), AlertAction(), ComboboxChip(), ComboboxChips(), ComboboxChipsInput(), ComboboxClear(), ComboboxCollection(), ComboboxContent() (+50 more)

### Community 9 - "sidebar.tsx"
Cohesion: 0.15
Nodes (28): lucide-react, AppHeader(), AppearanceOption, APPEARANCES, AppearanceSwitch(), AppSidebar(), SyncDot(), SYSTEM_APPEARANCE (+20 more)

### Community 10 - "dashboard.ts"
Cohesion: 0.06
Nodes (73): AllocationExpansion(), AllocationRow, asPending(), AnalyticsRecord, AnalyticsSummary, contribution(), summarize(), summaryMeasure() (+65 more)

### Community 11 - "providers.tsx"
Cohesion: 0.29
Nodes (9): metadata, RootLayout(), viewport, Providers(), ShellHeader(), SidebarInset(), SidebarProvider(), Toaster() (+1 more)

### Community 12 - "cn"
Cohesion: 0.13
Nodes (30): class-variance-authority, radix-ui, ButtonGroup(), ButtonGroupSeparator(), ButtonGroupText(), buttonGroupVariants, FieldContent(), FieldDescription() (+22 more)

### Community 13 - "auto-sync.ts"
Cohesion: 0.11
Nodes (50): exportData(), SYNC_TABLES, AuthNeededError, cacheToken(), CodeResponse, disconnectDrive(), downloadBackupFile(), driveFetch() (+42 more)

### Community 14 - "editors.ts"
Cohesion: 0.14
Nodes (20): editors, editors, longName, expectHeldRead(), expectRetainedRows(), expectSilentSheet(), expectVisibleBackdrop(), account (+12 more)

### Community 15 - "compilerOptions"
Cohesion: 0.06
Nodes (33): compilerOptions, allowJs, allowSyntheticDefaultImports, allowUnusedLabels, esModuleInterop, forceConsistentCasingInFileNames, incremental, isolatedModules (+25 more)

### Community 16 - "icon.tsx"
Cohesion: 0.15
Nodes (20): Rule, RuleSentence(), StatementRulesPage(), highlight(), Rule, CategoryField(), RuleSuggestions(), ruleValueLabel() (+12 more)

### Community 17 - "record-creator.tsx"
Cohesion: 0.10
Nodes (36): CategoryDialogState, SECTIONS, dexie-react-hooks, CategoryDialog(), CategoryFormValues, EMPTY_FORM_VALUES, iconLabel(), isChildCategory() (+28 more)

### Community 18 - "routes.ts"
Cohesion: 0.22
Nodes (19): NotFound(), Template(), TITLES, buildAttention(), pathAccounts(), pathAllocator(), pathBudgets(), pathCategories() (+11 more)

### Community 19 - "Button"
Cohesion: 0.14
Nodes (30): @base-ui/react, react-day-picker, Props, Props, DateField(), Props, DateRange(), DateRangeValue (+22 more)

### Community 20 - "Validator"
Cohesion: 0.11
Nodes (39): updateAccount(), BudgetDetail, BudgetFilters, createBudget(), listBudgets(), updateBudget(), validateBudget(), cleanInput() (+31 more)

### Community 21 - "suggestions.ts"
Cohesion: 0.10
Nodes (37): MonthlyBudgetRow, allocatedStatements(), asOf(), byDate(), CHIP_LIMIT, CHOICES, Clue, createModel() (+29 more)

### Community 22 - "package.json"
Cohesion: 0.07
Nodes (28): private, $schema, type, babel-plugin-react-compiler, @biomejs/biome, clsx, cmdk, @fontsource-variable/inter (+20 more)

### Community 23 - "dependencies"
Cohesion: 0.07
Nodes (30): dependencies, @base-ui/react, class-variance-authority, clsx, cmdk, dexie, dexie-react-hooks, @fontsource-variable/inter (+22 more)

### Community 24 - "test-data.ts"
Cohesion: 0.13
Nodes (20): DEFAULT_CATEGORIES, DEFAULT_MONTHLY_BUDGETS, EXPORT_VERSION, FinpointExport, SEED_HASH_KEY, BANK_BLURB, between(), CATEGORIES (+12 more)

### Community 25 - "ledger.e2e.ts"
Cohesion: 0.07
Nodes (46): typescript, vite, @vitejs/plugin-react, behaviourCoverage, componentInventory, facetNotApplicable, InventoryEntry, modalAnimationCoverage (+38 more)

### Community 26 - "suspicious"
Cohesion: 0.07
Nodes (28): suspicious, noAssignInExpressions, noAsyncPromiseExecutor, noCatchAssign, noClassAssign, noCompareNegZero, noControlCharactersInRegex, noDebugger (+20 more)

### Community 27 - "fixtures.ts"
Cohesion: 0.14
Nodes (18): cardTitles, card(), chartTooltip, overview, overviewCharts, themedRgb(), ScenarioName, WorkspaceDataset (+10 more)

### Community 28 - "support/motion.ts"
Cohesion: 0.17
Nodes (20): denseCardConsumers, denseRowConsumers, expectConsumerEntrance(), populatedConsumers, attachSamplingFailure(), expectModalEntrance(), expectModalExit(), expectPopupEntrance() (+12 more)

### Community 29 - "correctness"
Cohesion: 0.08
Nodes (26): noConstantCondition, noConstAssign, noEmptyCharacterClassInRegex, noEmptyPattern, noGlobalObjectCalls, noInvalidBuiltinInstantiation, noInvalidConstructorSuper, noNonoctalDecimalEscape (+18 more)

### Community 30 - "app.tsx"
Cohesion: 0.32
Nodes (5): react-dom, App(), HarnessSection, sectionFromLocation(), root

### Community 31 - "Boot"
Cohesion: 0.50
Nodes (4): Boot(), useSyncToasts(), subscribeSyncEvents(), listCategoryIconNames()

### Community 32 - "README.md"
Cohesion: 0.08
Nodes (24): Allocate workspace, Detail table allocated portions and drill-down Allocations, Backup and restore, Categories, Custom-period Budgets, Demo data, Inline metric and drill-down term definitions, Finpoint (+16 more)

### Community 33 - "core/routes.e2e.ts"
Cohesion: 0.18
Nodes (13): @playwright/test, Child, october, september, PREMATURE, routeReady, titles, installDateOnly() (+5 more)

### Community 34 - "category-history-chart.tsx"
Cohesion: 0.08
Nodes (39): Largest selection preserves amount order before pagination, bar(), BarChart(), BarSeries, PAD, CashflowChart(), CashflowPoint, aggregateSeries() (+31 more)

### Community 35 - "category-filter.tsx"
Cohesion: 0.19
Nodes (17): CategoryFilter(), CategoryFilterItem(), Command(), CommandEmpty(), CommandGroup(), CommandInput(), CommandItem(), CommandList() (+9 more)

### Community 36 - "components.json"
Cohesion: 0.09
Nodes (21): aliases, components, hooks, lib, ui, utils, iconLibrary, menuAccent (+13 more)

### Community 37 - "CONTEXT.md"
Cohesion: 0.09
Nodes (21): Account, Allocate, Budget, Category, Drill-down, Duplicate Statement, Irregular, Left over (+13 more)

### Community 38 - "core/components.e2e.ts"
Cohesion: 0.13
Nodes (12): desktopOnly, bounds(), contained(), expectWheelScrollsPageWhileOpen(), containedFooter(), expectDropdownPreservesScroll(), expectPointerCursor(), scrollWithInput() (+4 more)

### Community 39 - "types.d.ts"
Cohesion: 0.10
Nodes (20): Account, Allocation, AnalyticsSummary, AnalyticsTreatment, Appearance, Budget, Category, CategoryWithChildren (+12 more)

### Community 41 - "auth-vault.ts"
Cohesion: 0.29
Nodes (14): POST(), POST(), POST(), jose, AUTH_COOKIE_NAME, authCookie(), authCookieConfig(), clientIp() (+6 more)

### Community 42 - "sync/page.tsx"
Cohesion: 0.13
Nodes (28): COUNT_ROWS, DataSettingsPage(), StateRow(), STATUS_TONES, StatusTone, WorkspaceRow(), clearAllData(), downloadExport() (+20 more)

### Community 43 - "formatCurrency"
Cohesion: 0.10
Nodes (53): getBudgetAnalytics(), getCategoryData(), DuplicateGroupCard(), GroupHeader(), highlightDifferences(), PendingCard(), AllocationProgress(), AllocationRows() (+45 more)

### Community 44 - "STYLE.md"
Cohesion: 0.16
Nodes (13): Allocation, APIs, Arguments, And Props, Code Style, Consistency, Copy, Core, Earning Its Place, Grouping And Order (+5 more)

### Community 45 - "record-editor.tsx"
Cohesion: 0.17
Nodes (28): CARD_MOTION, VIEWS, CandidatePage, CandidateResults(), DuplicateReviewDialog(), StatementTile(), dateDifferenceLabel(), ReplacementReview (+20 more)

### Community 46 - "UI layer (app pages + components)"
Cohesion: 0.22
Nodes (11): app/**/page.tsx, Interactive routes are "use client" (search params via next/navigation), (month) route-group shell (Overview + Monthly Records), Pages take no props, Project Shape, React Compiler (enabled), Root Suspense (keeps routes static), src/routes.ts (centralized route paths) (+3 more)

### Community 47 - "formatter"
Cohesion: 0.15
Nodes (13): arrowParentheses, bracketSameLine, bracketSpacing, jsxQuoteStyle, quoteProperties, quoteStyle, semicolons, trailingCommas (+5 more)

### Community 48 - "devDependencies"
Cohesion: 0.15
Nodes (13): devDependencies, babel-plugin-react-compiler, @biomejs/biome, fake-indexeddb, @playwright/test, @tailwindcss/postcss, @types/luxon, @types/node (+5 more)

### Community 49 - "monthpicker.tsx"
Cohesion: 0.33
Nodes (6): ButtonVariant, Month, MonthCal(), MonthCalProps, MonthPicker(), MONTHS

### Community 50 - "pagination.tsx"
Cohesion: 0.38
Nodes (11): pageHref(), pageWindow(), PaginationFooter(), Pagination(), PaginationContent(), PaginationEllipsis(), PaginationItem(), PaginationLink() (+3 more)

### Community 51 - "biome.json"
Cohesion: 0.18
Nodes (10): source, assist, actions, files, includes, linter, enabled, overrides (+2 more)

### Community 52 - "rules"
Cohesion: 0.18
Nodes (11): noAdjacentSpacesInRegex, noBannedTypes, noExtraBooleanCast, noUselessCatch, noUselessThisAlias, noUselessTypeConstraint, rules, noFloatingPromises (+3 more)

### Community 53 - "data.ts"
Cohesion: 0.09
Nodes (22): AccountRow, AnalyticsMonthRow, BudgetRecordRow, BudgetRow, CategoryRow, DuplicateDismissalRow, MonthlyBudgetAmountRow, MonthlyBudgetDefaultRow (+14 more)

### Community 54 - "export-import.ts"
Cohesion: 0.20
Nodes (12): db, FinpointDB, withoutActionModes(), monthlyBudgetFields(), TableName, TABLES, migrateRecordChoices(), DEFAULT_SETTINGS (+4 more)

### Community 55 - "src/data/* (persistence, migrations, seeding, backup serialization, Drive storage)"
Cohesion: 0.31
Nodes (8): Background Drive sync, bun test, src/data/* (persistence, migrations, seeding, backup serialization, Drive storage), IndexedDB (Dexie), Domain and importer tests (Dexie with in-memory IndexedDB), src/logic/* (domain reads and operations), Verification, Workspace backup/reset operations

### Community 56 - "manifest.json"
Cohesion: 0.20
Nodes (9): background_color, description, display, icons, name, scope, short_name, start_url (+1 more)

### Community 57 - "spending-calendar.tsx"
Cohesion: 0.29
Nodes (9): compact(), heat(), INK, LEVELS, quantile(), rampCap(), SpendingCalendar(), STRENGTH (+1 more)

### Community 58 - "Next.js agent rules block ("This is NOT the Next.js you know")"
Cohesion: 0.25
Nodes (6): app/api/auth/* Route Handlers, node_modules/next/dist/server/lib/generate-agent-files.js, Google OAuth broker (exchange/token/logout), Next.js App Router app (mostly client-side), node_modules/next/dist/docs/, npm run dev (port 5173)

### Community 59 - "scripts"
Cohesion: 0.22
Nodes (9): scripts, build, dev, lint, lint:check, start, test:e2e, types:check (+1 more)

### Community 61 - "src/components/*"
Cohesion: 0.25
Nodes (5): Agent Behavior, Generated / Ignored Files, src/components/*, src/components/ui/**/*, useLiveQuery

### Community 62 - "formatter"
Cohesion: 0.25
Nodes (8): formatter, attributePosition, enabled, formatWithErrors, indentStyle, indentWidth, lineEnding, lineWidth

### Community 65 - "Domain docs (single-context layout)"
Cohesion: 0.33
Nodes (7): Agent skills, CONTEXT.md, Domain docs (single-context layout), Domain Language, Issue tracker (local specs and tickets), .scratch/ local work tracking, String primary keys (not auto-increment)

### Community 66 - "Commands"
Cohesion: 0.38
Nodes (7): Biome (biome check --write), bun install, bun lint (write-mode), bun lint:check, bun run build, bun types:check, Commands

### Community 67 - "optionalDependencies"
Cohesion: 0.29
Nodes (7): optionalDependencies, lightningcss-linux-x64-gnu, lightningcss-win32-x64-msvc, @rollup/rollup-linux-x64-gnu, @rollup/rollup-win32-x64-msvc, @tailwindcss/oxide-linux-x64-gnu, @tailwindcss/oxide-win32-x64-msvc

### Community 68 - "utils.ts"
Cohesion: 0.10
Nodes (27): BUDGET_STATES, BudgetCard(), BudgetsPage(), BudgetState, formatBudgetDateWindow(), framer-motion, react, AllocationSource (+19 more)

### Community 69 - "tsconfig.e2e.json"
Cohesion: 0.29
Nodes (6): ./tsconfig.json, compilerOptions, incremental, exclude, extends, include

### Community 70 - "Comparison window"
Cohesion: 0.33
Nodes (5): Compare selection uses included comparison months and title-based uniqueness, Gross and net category selection URL, Comparison window, Drill-down URL state, Biggest changes compares same-period net Spending Records

### Community 71 - "style"
Cohesion: 0.33
Nodes (6): style, noNamespace, noNonNullAssertion, useArrayLiterals, useAsConstAssertion, useBlockStatements

### Community 72 - "0002 Forecast pacing"
Cohesion: 0.33
Nodes (5): 0002 Forecast pacing, Consequences, Context, Decision, Rejected option

### Community 73 - "Validation rule (ValidationError + Validator)"
Cohesion: 0.50
Nodes (4): Old Laravel Api/*Controller mapping, Laravel-shaped { field: string[] } error maps, ValidationError, Validator

### Community 74 - "Finpoint icon concept"
Cohesion: 0.40
Nodes (5): Finpoint icon concept, Charcoal shadow halo, Circular point, Rounded F monogram, Off-white icon fill

### Community 75 - "Finpoint icon with charcoal shadow"
Cohesion: 0.40
Nodes (5): Finpoint icon with charcoal shadow, Charcoal shadow halo, Circular point, Rounded F monogram, Off-white icon fill

### Community 76 - "Issue tracker: Local Markdown"
Cohesion: 0.40
Nodes (4): Files, Issue tracker: Local Markdown, Skill operations, Status and dependencies

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

### Community 88 - "Dashboard"
Cohesion: 0.50
Nodes (4): Dashboard, Dashboard natural card heights, Empty month offers latest recorded month, Empty workspace import and demo start state

### Community 100 - "statement-rules.ts"
Cohesion: 0.20
Nodes (14): byCreation(), conditionPattern(), deleteStatementRule(), listStatementRules(), matchesStatement(), NAME_ORDER, previewStatementRule(), recommendationAutofill() (+6 more)

### Community 101 - "alert-dialog.tsx"
Cohesion: 0.34
Nodes (12): DriveOverwriteConfirmation(), AlertDialog(), AlertDialogAction(), AlertDialogCancel(), AlertDialogContent(), AlertDialogDescription(), AlertDialogFooter(), AlertDialogHeader() (+4 more)

## Knowledge Gaps
- **127 isolated node(s):** `Build app step`, `Build harness step (tests/harness/vite.config.ts)`, `Playwright browser cache (keyed on bun.lock)`, `Graph health warnings and refresh failure reporting`, `gitmoji.dev` (+122 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 642 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **11 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `cn()` connect `cn` to `RecordEditorDialog`, `allocator/page.tsx`, `(month)/page.tsx`, `paginated-data-table.tsx`, `primitives.tsx`, `sidebar.tsx`, `providers.tsx`, `icon.tsx`, `record-creator.tsx`, `routes.ts`, `Button`, `category-history-chart.tsx`, `category-filter.tsx`, `sync/page.tsx`, `formatCurrency`, `record-editor.tsx`, `monthpicker.tsx`, `pagination.tsx`, `spending-calendar.tsx`, `utils.ts`, `alert-dialog.tsx`?**
  _High betweenness centrality (0.090) - this node is a cross-community bridge._
- **What connects `Build app step`, `Build harness step (tests/harness/vite.config.ts)`, `Playwright browser cache (keyed on bun.lock)` to the rest of the system?**
  _127 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `allocator/page.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.05993793891883064 - nodes in this community are weakly interconnected._
- **Why does `react` connect `utils.ts` to `RecordEditorDialog`, `allocator/page.tsx`, `(month)/page.tsx`, `use-appearance.tsx`, `history.tsx`, `paginated-data-table.tsx`, `primitives.tsx`, `sidebar.tsx`, `providers.tsx`, `cn`, `icon.tsx`, `record-creator.tsx`, `routes.ts`, `Button`, `package.json`, `app.tsx`, `Boot`, `category-history-chart.tsx`, `category-filter.tsx`, `sync/page.tsx`, `formatCurrency`, `record-editor.tsx`, `monthpicker.tsx`, `pagination.tsx`, `spending-calendar.tsx`, `alert-dialog.tsx`?**
  _High betweenness centrality (0.070) - this node is a cross-community bridge._
- **Should `db.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.08970099667774087 - nodes in this community are weakly interconnected._
- **Why does `src/data/* (persistence, migrations, seeding, backup serialization, Drive storage)` connect `src/data/* (persistence, migrations, seeding, backup serialization, Drive storage)` to `providers.tsx`, `UI layer (app pages + components)`?**
  _High betweenness centrality (0.060) - this node is a cross-community bridge._
- **Should `Tests README` be split into smaller, more focused modules?**
  _Cohesion score 0.05928614640048397 - nodes in this community are weakly interconnected._