# Graph Report - t3-69efe8e6  (2026-11-07)

## Corpus Check
- 279 files · ~238,417 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 9 file(s) not represented in the graph (top: (none) 5, .example 1, .lock 1)

## Summary
- 1973 nodes · 7928 edges · 94 communities (82 shown, 12 thin omitted)
- Extraction: 98% EXTRACTED · 2% INFERRED · 0% AMBIGUOUS · INFERRED: 126 edges (avg confidence: 0.84)
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- cn
- Button
- monthly-budgets.test.ts
- Tests README
- suggestions.ts
- ui/field.tsx
- combobox.tsx
- react
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
- State persistence rule (ephemeral UI state vs IndexedDB)
- statements.ts
- Validation rule (ValidationError + Validator)
- utils.ts
- Validator
- suspicious
- package.json
- ledger.e2e.ts
- correctness
- dashboard.ts
- core/components.e2e.ts
- auto-sync.ts
- support/motion.ts
- core/routes.e2e.ts
- ValidationError
- src/data/* (persistence, migrations, seeding, backup serialization, Drive storage)
- test-data.ts
- components.json
- export-import.ts
- records.ts
- primitives.tsx
- types.d.ts
- STYLE.md
- auth-vault.ts
- app/layout.tsx
- budgets/[id]/page.tsx
- collectTests
- duplicates.ts
- navigation.e2e.ts
- formatter
- devDependencies
- pagination.tsx
- record-columns.tsx
- Commands
- Next.js agent rules block ("This is NOT the Next.js you know")
- category-filter.tsx
- spending-calendar.tsx
- biome.json
- rules
- manifest.json
- vite.config.ts
- scripts
- Community 60
- 0002 Forecast pacing
- formatter
- Records
- Drill-down
- Domain docs (single-context layout)
- optionalDependencies
- (month)/page.tsx
- tsconfig.e2e.json
- style
- duplicates/page.tsx
- 0001-drill-down-url-state.md
- Finpoint icon concept
- Finpoint icon with charcoal shadow
- Issue tracker: Local Markdown
- Finpoint
- Local Markdown Issue Tracker
- next-env.d.ts
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
- `Finpoint Style Additions` --references--> `ValidationError`  [INFERRED]
  STYLE.md → src/logic/validate.ts
- `Finpoint Style Additions` --references--> `useApiFormErrors()`  [INFERRED]
  STYLE.md → src/hooks/use-api-form-errors.ts
- `Copy` --references--> `pluralize()`  [INFERRED]
  STYLE.md → src/lib/utils.ts
- `Boot()` --indirect_call--> `preloadCategoryIcons()`  [INFERRED]
  app/providers.tsx → src/components/icon.tsx
- `record()` --indirect_call--> `path()`  [INFERRED]
  tests/core/ledger.e2e.ts → src/components/charts/trend-chart.tsx

## Import Cycles
- None detected.

## Communities (94 total, 12 thin omitted)

### Community 0 - "cn"
Cohesion: 0.05
Nodes (170): BudgetPage(), getBudgetAnalytics(), getCategoryData(), Legend(), CategoriesPage(), CategoryDialogState, CategoryTile(), SECTIONS (+162 more)

### Community 1 - "Button"
Cohesion: 0.05
Nodes (134): AccountPage(), AccountCard(), AccountRow, AccountsPage(), CARD_MOTION, DuplicateGroupCard(), FixDuplicatesPage(), GroupHeader() (+126 more)

### Community 2 - "monthly-budgets.test.ts"
Cohesion: 0.06
Nodes (73): BUDGET_STATES, BudgetCard(), BudgetsPage(), BudgetState, formatBudgetDateWindow(), MonthLayout(), framer-motion, luxon (+65 more)

### Community 3 - "Tests README"
Cohesion: 0.06
Nodes (41): Build harness step (vite build tests/harness), Playwright browser cache keyed on bun.lock, blob report merge, Committed graph artifacts (graph.json, GRAPH_REPORT.md, manifest.json, .graphify_labels.json), Graph health warnings and refresh failure reporting, graphify-out/graph.json, graphify skill (--update), graphify update . (+33 more)

### Community 4 - "suggestions.ts"
Cohesion: 0.07
Nodes (46): typescript, vite, @vitejs/plugin-react, behaviourCoverage, componentInventory, facetNotApplicable, InventoryEntry, modalAnimationCoverage (+38 more)

### Community 5 - "ui/field.tsx"
Cohesion: 0.11
Nodes (49): AuthNeededError, cacheToken(), CodeResponse, disconnectDrive(), downloadBackupFile(), driveFetch(), DriveFileMeta, ensureDriveToken() (+41 more)

### Community 6 - "combobox.tsx"
Cohesion: 0.09
Nodes (40): AppearanceSwitch(), AlertAction(), EmptyContent(), FieldContent(), FieldTitle(), Label(), PopoverDescription(), PopoverHeader() (+32 more)

### Community 7 - "react"
Cohesion: 0.14
Nodes (32): Comparison, comparisonRateText(), comparisonText(), ComparisonValue, DashboardData, DashboardMonthlyBudget, DashboardPage(), DashboardView (+24 more)

### Community 8 - "fixtures.ts"
Cohesion: 0.13
Nodes (37): db, contribution(), summarize(), avg(), buildCashflowHistory(), buildCategories(), buildComparison(), buildMonthlyBudgets() (+29 more)

### Community 9 - "drive-sync.ts"
Cohesion: 0.09
Nodes (34): class-variance-authority, radix-ui, AppHeader(), ButtonGroup(), ButtonGroupSeparator(), ButtonGroupText(), buttonGroupVariants, FieldLegend() (+26 more)

### Community 10 - "lib/motion.ts"
Cohesion: 0.09
Nodes (32): AccountRow, AllocationRow, AnalyticsMonthRow, BudgetRecordRow, BudgetRow, CategoryRow, DB_NAME, DB_VERSION (+24 more)

### Community 11 - "compilerOptions"
Cohesion: 0.11
Nodes (36): allocatedStatements(), asOf(), byDate(), CHIP_LIMIT, CHOICES, Clue, createModel(), DEFAULT_WEIGHTS (+28 more)

### Community 12 - "editors.ts"
Cohesion: 0.06
Nodes (33): compilerOptions, allowJs, allowSyntheticDefaultImports, allowUnusedLabels, esModuleInterop, forceConsistentCasingInFileNames, incremental, isolatedModules (+25 more)

### Community 13 - "routes.ts"
Cohesion: 0.13
Nodes (19): editors, containedFooter(), editors, longName, expectHeldRead(), expectRetainedRows(), expectSilentSheet(), account (+11 more)

### Community 14 - "useHistory"
Cohesion: 0.12
Nodes (26): metadata, RootLayout(), viewport, Boot(), Providers(), @vercel/analytics, @vercel/speed-insights, ShellHeader() (+18 more)

### Community 15 - "workflows.e2e.ts"
Cohesion: 0.11
Nodes (26): @base-ui/react, ComboboxField(), Props, ComboboxChip(), ComboboxChips(), ComboboxChipsInput(), ComboboxClear(), ComboboxCollection() (+18 more)

### Community 16 - "dependencies"
Cohesion: 0.14
Nodes (24): round2(), getDrilldown(), getDrillStatement(), Selection, resolveRecordChoices(), inferRecordDatetime(), analyticsValues(), budgetCovers() (+16 more)

### Community 17 - "db.ts"
Cohesion: 0.07
Nodes (30): dependencies, @base-ui/react, class-variance-authority, clsx, cmdk, dexie, dexie-react-hooks, @fontsource-variable/inter (+22 more)

### Community 18 - "State persistence rule (ephemeral UI state vs IndexedDB)"
Cohesion: 0.14
Nodes (18): cardTitles, card(), chartTooltip, overview, overviewCharts, themedRgb(), ScenarioName, WorkspaceDataset (+10 more)

### Community 19 - "statements.ts"
Cohesion: 0.19
Nodes (23): NotFound(), Template(), AppearanceOption, APPEARANCES, AppSidebar(), SyncDot(), SYSTEM_APPEARANCE, useSyncIndicator() (+15 more)

### Community 20 - "Validation rule (ValidationError + Validator)"
Cohesion: 0.13
Nodes (22): bar(), BarChart(), BarSeries, PAD, BudgetProgressChart(), BudgetProgressPoint, buildSeries(), ChartFrame() (+14 more)

### Community 21 - "utils.ts"
Cohesion: 0.16
Nodes (22): denseCardConsumers, denseRowConsumers, expectConsumerEntrance(), populatedConsumers, expectVisibleBackdrop(), pickOption(), attachSamplingFailure(), expectModalEntrance() (+14 more)

### Community 22 - "Validator"
Cohesion: 0.07
Nodes (28): suspicious, noAssignInExpressions, noAsyncPromiseExecutor, noCatchAssign, noClassAssign, noCompareNegZero, noControlCharactersInRegex, noDebugger (+20 more)

### Community 23 - "suspicious"
Cohesion: 0.26
Nodes (18): updateAccount(), validateBudget(), cleanInput(), dismissDuplicatePair(), eligible(), fixDuplicates(), restoreDuplicatePair(), importFiles() (+10 more)

### Community 24 - "package.json"
Cohesion: 0.07
Nodes (26): private, $schema, type, babel-plugin-react-compiler, @biomejs/biome, clsx, cmdk, @fontsource-variable/inter (+18 more)

### Community 25 - "ledger.e2e.ts"
Cohesion: 0.15
Nodes (25): asPending(), duplicateStatementIds(), removeStatementDismissals(), dayDifference(), ensureCanReplace(), maskDescription(), ReplacementAllocation, replacementComparison() (+17 more)

### Community 26 - "correctness"
Cohesion: 0.08
Nodes (26): noConstantCondition, noConstAssign, noEmptyCharacterClassInRegex, noEmptyPattern, noGlobalObjectCalls, noInvalidBuiltinInstantiation, noInvalidConstructorSuper, noNonoctalDecimalEscape (+18 more)

### Community 27 - "dashboard.ts"
Cohesion: 0.12
Nodes (11): dexie, fake-indexeddb, xlsx, input, legacyPaceKey, today, decided(), live() (+3 more)

### Community 28 - "core/components.e2e.ts"
Cohesion: 0.18
Nodes (20): clearAllData(), downloadExport(), exportData(), importData(), monthlyBudgetFields(), parseImportFile(), SYNC_TABLES, tableCounts() (+12 more)

### Community 29 - "auto-sync.ts"
Cohesion: 0.14
Nodes (11): desktopOnly, bounds(), contained(), expectWheelScrollsPageWhileOpen(), expectDropdownPreservesScroll(), expectPointerCursor(), scrollWithInput(), settledOverlayAlpha() (+3 more)

### Community 30 - "support/motion.ts"
Cohesion: 0.14
Nodes (19): DEFAULT_CATEGORIES, DEFAULT_MONTHLY_BUDGETS, EXPORT_VERSION, FinpointExport, SEED_HASH_KEY, BANK_BLURB, between(), CATEGORIES (+11 more)

### Community 31 - "core/routes.e2e.ts"
Cohesion: 0.09
Nodes (21): aliases, components, hooks, lib, ui, utils, iconLibrary, menuAccent (+13 more)

### Community 32 - "ValidationError"
Cohesion: 0.17
Nodes (14): @playwright/test, Child, october, september, PREMATURE, routeReady, titles, getScenario() (+6 more)

### Community 33 - "src/data/* (persistence, migrations, seeding, backup serialization, Drive storage)"
Cohesion: 0.10
Nodes (20): Account, Allocation, AnalyticsSummary, AnalyticsTreatment, Appearance, Budget, Category, CategoryWithChildren (+12 more)

### Community 34 - "test-data.ts"
Cohesion: 0.17
Nodes (18): COUNT_ROWS, DataSettingsPage(), MethodHeader(), StateRow(), STATUS_TONES, StatusTone, WorkspaceRow(), wasVaultProven() (+10 more)

### Community 35 - "components.json"
Cohesion: 0.29
Nodes (14): POST(), POST(), POST(), jose, AUTH_COOKIE_NAME, authCookie(), authCookieConfig(), clientIp() (+6 more)

### Community 36 - "export-import.ts"
Cohesion: 0.22
Nodes (16): DropdownMenu(), DropdownMenuCheckboxItem(), DropdownMenuContent(), DropdownMenuGroup(), DropdownMenuItem(), DropdownMenuLabel(), DropdownMenuPortal(), DropdownMenuRadioGroup() (+8 more)

### Community 37 - "records.ts"
Cohesion: 0.23
Nodes (13): StatementRow, byCreation(), conditionPattern(), deleteStatementRule(), listStatementRules(), matchesStatement(), NAME_ORDER, previewStatementRule() (+5 more)

### Community 38 - "primitives.tsx"
Cohesion: 0.16
Nodes (15): CONTEXT.md (domain vocabulary), Account, Allocation, Budget, Category, Duplicate Statement, Monthly Budget, Pending Record (+7 more)

### Community 39 - "types.d.ts"
Cohesion: 0.34
Nodes (12): DriveOverwriteConfirmation(), AlertDialog(), AlertDialogAction(), AlertDialogCancel(), AlertDialogContent(), AlertDialogDescription(), AlertDialogFooter(), AlertDialogHeader() (+4 more)

### Community 40 - "STYLE.md"
Cohesion: 0.30
Nodes (12): CategoryFilter(), CategoryFilterItem(), Command(), CommandDialog(), CommandEmpty(), CommandGroup(), CommandInput(), CommandItem() (+4 more)

### Community 41 - "auth-vault.ts"
Cohesion: 0.18
Nodes (10): AnalyticsRecord, AnalyticsSummary, BudgetDetail, BudgetFilters, createBudget(), getBudget(), upsertIndexed(), fromCents() (+2 more)

### Community 42 - "app/layout.tsx"
Cohesion: 0.18
Nodes (12): APIs, Arguments, And Props, Code Style, Consistency, Core, Earning Its Place, Finpoint Style Additions, Grouping And Order, Motion and polish (+4 more)

### Community 43 - "budgets/[id]/page.tsx"
Cohesion: 0.18
Nodes (9): app/**/page.tsx, IndexedDB (Dexie), Interactive routes are "use client" (search params via next/navigation), Pages take no props, Project Shape, React Compiler (enabled), Root Suspense (keeps routes static), URL search params (filters and pagination) (+1 more)

### Community 44 - "collectTests"
Cohesion: 0.15
Nodes (13): arrowParentheses, bracketSameLine, bracketSpacing, jsxQuoteStyle, quoteProperties, quoteStyle, semicolons, trailingCommas (+5 more)

### Community 45 - "duplicates.ts"
Cohesion: 0.15
Nodes (13): devDependencies, babel-plugin-react-compiler, @biomejs/biome, fake-indexeddb, @playwright/test, @tailwindcss/postcss, @types/luxon, @types/node (+5 more)

### Community 46 - "navigation.e2e.ts"
Cohesion: 0.24
Nodes (12): aggregateSeries(), CategoryHistoryChart(), ChartMonth, ChartSeries, MonthBreakdown(), MonthTick(), monthTotal(), prepareMonths() (+4 more)

### Community 47 - "formatter"
Cohesion: 0.38
Nodes (11): pageHref(), pageWindow(), PaginationFooter(), Pagination(), PaginationContent(), PaginationEllipsis(), PaginationItem(), PaginationLink() (+3 more)

### Community 48 - "devDependencies"
Cohesion: 0.20
Nodes (11): Agent Behavior, Biome (biome check --write), bun install, bun lint (write-mode), bun lint:check, bun run build, bun types:check, Commands (+3 more)

### Community 49 - "pagination.tsx"
Cohesion: 0.18
Nodes (9): app/api/auth/* Route Handlers, bun test, node_modules/next/dist/server/lib/generate-agent-files.js, Google OAuth broker (exchange/token/logout), Domain and importer tests (Dexie with in-memory IndexedDB), Next.js App Router app (mostly client-side), node_modules/next/dist/docs/, npm run dev (port 5173) (+1 more)

### Community 50 - "record-columns.tsx"
Cohesion: 0.27
Nodes (11): descriptionAnchors(), descriptionIdentity(), DuplicateGroup, duplicateGroups(), DuplicateStatement, FixDuplicatesInput, GENERIC, pairIds() (+3 more)

### Community 51 - "Commands"
Cohesion: 0.18
Nodes (10): source, assist, actions, files, includes, linter, enabled, overrides (+2 more)

### Community 52 - "Next.js agent rules block ("This is NOT the Next.js you know")"
Cohesion: 0.18
Nodes (11): noAdjacentSpacesInRegex, noBannedTypes, noExtraBooleanCast, noUselessCatch, noUselessThisAlias, noUselessTypeConstraint, rules, noFloatingPromises (+3 more)

### Community 54 - "spending-calendar.tsx"
Cohesion: 0.38
Nodes (8): Background Drive sync, src/data/* (persistence, migrations, seeding, backup serialization, Drive storage), src/logic/* (domain reads and operations), (month) route-group shell (Overview + Monthly Records), src/routes.ts (centralized route paths), Static content pages (privacy, terms) are server components, UI layer (app pages + components), Workspace backup/reset operations

### Community 55 - "biome.json"
Cohesion: 0.20
Nodes (9): background_color, description, display, icons, name, scope, short_name, start_url (+1 more)

### Community 56 - "rules"
Cohesion: 0.29
Nodes (9): compact(), heat(), INK, LEVELS, quantile(), rampCap(), SpendingCalendar(), STRENGTH (+1 more)

### Community 57 - "manifest.json"
Cohesion: 0.22
Nodes (9): scripts, build, dev, lint, lint:check, start, test:e2e, types:check (+1 more)

### Community 58 - "vite.config.ts"
Cohesion: 0.28
Nodes (8): lucide-react, buttonVariants, ButtonVariant, Month, MonthCal(), MonthCalProps, MonthPicker(), MONTHS

### Community 59 - "scripts"
Cohesion: 0.39
Nodes (7): getStoredHistory(), getValidHistory(), HistoryContext, HistoryItem, HistoryProvider(), normaliseUrl(), withoutTrailingSelf()

### Community 60 - "Community 60"
Cohesion: 0.25
Nodes (8): formatter, attributePosition, enabled, formatWithErrors, indentStyle, indentWidth, lineEnding, lineWidth

### Community 61 - "0002 Forecast pacing"
Cohesion: 0.32
Nodes (8): Allocator, Budgets, Categories, Dashboard, Statement-allocation-record model, Monthly Budgets, Records, Statement importer

### Community 63 - "Records"
Cohesion: 0.33
Nodes (7): Agent skills, CONTEXT.md, Domain docs (single-context layout), Domain Language, Issue tracker (local specs and tickets), .scratch/ local work tracking, String primary keys (not auto-increment)

### Community 64 - "Drill-down"
Cohesion: 0.29
Nodes (7): optionalDependencies, lightningcss-linux-x64-gnu, lightningcss-win32-x64-msvc, @rollup/rollup-linux-x64-gnu, @rollup/rollup-win32-x64-msvc, @tailwindcss/oxide-linux-x64-gnu, @tailwindcss/oxide-win32-x64-msvc

### Community 65 - "Domain docs (single-context layout)"
Cohesion: 0.29
Nodes (6): ./tsconfig.json, compilerOptions, incremental, exclude, extends, include

### Community 66 - "optionalDependencies"
Cohesion: 0.40
Nodes (5): Record focus, Statement pivot, Drill-down, Drill-down URL state, Calendar day Drill-down

### Community 67 - "(month)/page.tsx"
Cohesion: 0.33
Nodes (6): style, noNamespace, noNonNullAssertion, useArrayLiterals, useAsConstAssertion, useBlockStatements

### Community 68 - "tsconfig.e2e.json"
Cohesion: 0.33
Nodes (5): 0002 Forecast pacing, Consequences, Context, Decision, Rejected option

### Community 69 - "style"
Cohesion: 0.50
Nodes (4): Old Laravel Api/*Controller mapping, Laravel-shaped { field: string[] } error maps, ValidationError, Validator

### Community 70 - "duplicates/page.tsx"
Cohesion: 0.40
Nodes (5): Finpoint icon concept, Charcoal shadow halo, Circular point, Rounded F monogram, Off-white icon fill

### Community 71 - "0001-drill-down-url-state.md"
Cohesion: 0.40
Nodes (5): Finpoint icon with charcoal shadow, Charcoal shadow halo, Circular point, Rounded F monogram, Off-white icon fill

### Community 72 - "Finpoint icon concept"
Cohesion: 0.40
Nodes (4): Files, Issue tracker: Local Markdown, Skill operations, Status and dependencies

### Community 73 - "Finpoint icon with charcoal shadow"
Cohesion: 0.50
Nodes (4): Finpoint, Circular point, Rounded F monogram, Off-white icon fill

### Community 74 - "Issue tracker: Local Markdown"
Cohesion: 0.50
Nodes (3): Before exploration, Domain docs, Writing

### Community 75 - "Finpoint"
Cohesion: 0.50
Nodes (4): Local Tracker Operations, Spec and Ticket Files, Ticket Lifecycle, Local Markdown Issue Tracker

### Community 77 - "Local Markdown Issue Tracker"
Cohesion: 0.50
Nodes (4): Google Drive sync, JSON backup and restore, Local-first finance tracking, Sync conflict handling

### Community 78 - "next-env.d.ts"
Cohesion: 0.67
Nodes (3): Forecast pacing decision, Remaining historical spending scaled by remaining days, Median daily spending fallback including zero days

### Community 79 - "Google Drive sync"
Cohesion: 0.67
Nodes (3): Circular dot beside F, Rounded F letterform, F monogram icon

### Community 80 - "F monogram icon"
Cohesion: 0.67
Nodes (3): JPG favicon dot, JPG favicon F letterform, JPG favicon icon

### Community 81 - "JPG favicon icon"
Cohesion: 0.67
Nodes (3): PNG favicon dot, PNG favicon F letterform, PNG favicon icon

### Community 82 - "PNG favicon icon"
Cohesion: 0.67
Nodes (3): SVG favicon dot, SVG favicon F letterform, SVG favicon icon

### Community 83 - "SVG favicon icon"
Cohesion: 0.67
Nodes (3): Circular dot beside F, Rounded F letterform, F monogram icon

### Community 84 - "F monogram icon"
Cohesion: 0.67
Nodes (3): Circular dot beside F, Rounded F letterform, F monogram icon

## Knowledge Gaps
- **87 isolated node(s):** `Build app step`, `Build harness step (tests/harness/vite.config.ts)`, `Playwright browser cache (keyed on bun.lock)`, `Graph health warnings and refresh failure reporting`, `gitmoji.dev` (+82 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 600 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **12 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `cn()` connect `combobox.tsx` to `cn`, `Button`, `monthly-budgets.test.ts`, `test-data.ts`, `export-import.ts`, `react`, `STYLE.md`, `types.d.ts`, `drive-sync.ts`, `navigation.e2e.ts`, `workflows.e2e.ts`, `formatter`, `Validation rule (ValidationError + Validator)`, `rules`, `vite.config.ts`?**
  _High betweenness centrality (0.098) - this node is a cross-community bridge._
- **What connects `Build app step`, `Build harness step (tests/harness/vite.config.ts)`, `Playwright browser cache (keyed on bun.lock)` to the rest of the system?**
  _87 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `cn` be split into smaller, more focused modules?**
  _Cohesion score 0.05166598107774578 - nodes in this community are weakly interconnected._
- **Why does `react` connect `cn` to `Button`, `monthly-budgets.test.ts`, `combobox.tsx`, `react`, `drive-sync.ts`, `useHistory`, `workflows.e2e.ts`, `statements.ts`, `Validation rule (ValidationError + Validator)`, `package.json`, `test-data.ts`, `export-import.ts`, `types.d.ts`, `STYLE.md`, `navigation.e2e.ts`, `formatter`, `rules`, `vite.config.ts`, `scripts`?**
  _High betweenness centrality (0.086) - this node is a cross-community bridge._
- **Should `Button` be split into smaller, more focused modules?**
  _Cohesion score 0.05453556371549027 - nodes in this community are weakly interconnected._
- **Why does `src/data/* (persistence, migrations, seeding, backup serialization, Drive storage)` connect `spending-calendar.tsx` to `budgets/[id]/page.tsx`, `useHistory`?**
  _High betweenness centrality (0.064) - this node is a cross-community bridge._
- **Should `monthly-budgets.test.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.06177076183939602 - nodes in this community are weakly interconnected._