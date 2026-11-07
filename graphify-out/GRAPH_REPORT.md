# Graph Report - t3-69efe8e6  (2026-11-07)

## Corpus Check
- 278 files · ~0 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 1974 nodes · 7914 edges · 98 communities (85 shown, 13 thin omitted)
- Extraction: 98% EXTRACTED · 2% INFERRED · 0% AMBIGUOUS · INFERRED: 132 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- Button
- duplicates/page.tsx
- db.ts
- Tests README
- suggestions.ts
- cn
- importer/page.tsx
- dashboard.ts
- sidebar.tsx
- (month)/page.tsx
- utils.ts
- records.ts
- utils.ts
- utils.ts
- radix-ui
- utils.ts
- editors.ts
- compilerOptions
- category-filter.tsx
- lib/motion.ts
- package.json
- dependencies
- cn
- auto-sync.ts
- ledger.e2e.ts
- ValidationError
- routes.ts
- suspicious
- test
- export-import.ts
- Validator
- support/motion.ts
- correctness
- export-import.ts
- utils.ts
- budgets/[id]/page.tsx
- components.json
- auto-sync.ts
- types.d.ts
- UiIcon
- auth-vault.ts
- ledger.e2e.ts
- core/routes.e2e.ts
- Statement
- core/routes.e2e.ts
- providers.tsx
- core/components.e2e.ts
- auto-sync.ts
- STYLE.md
- IndexedDB (Dexie)
- formatter
- devDependencies
- pagination.tsx
- Commands
- Next.js agent rules block ("This is NOT the Next.js you know")
- biome.json
- rules
- data.ts
- src/data/* (persistence, migrations, seeding, backup serialization, Drive storage)
- manifest.json
- spending-calendar.tsx
- 0001-drill-down-url-state.md
- scripts
- formatter
- Records
- navigation.e2e.ts
- Domain docs (single-context layout)
- optionalDependencies
- ledger.e2e.ts
- tsconfig.e2e.json
- style
- 0002 Forecast pacing
- Validation rule (ValidationError + Validator)
- Finpoint icon concept
- Finpoint icon with charcoal shadow
- Issue tracker: Local Markdown
- Finpoint
- Domain docs
- Local Markdown Issue Tracker
- Google Drive sync
- Forecast pacing decision
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
- Calendar and forecast daily views
- Generated demo data
- Progressive Web Application
- Dashboard summary metrics

## God Nodes (most connected - your core abstractions)
1. `cn()` - 324 edges
2. `PrimitivesSection()` - 181 edges
3. `Button()` - 127 edges
4. `react` - 99 edges
5. `formatCurrency()` - 78 edges
6. `RecordEditorDialog()` - 63 edges
7. `RecordCreatorDialog()` - 58 edges
8. `UiIcon()` - 56 edges
9. `round2()` - 48 edges
10. `pluralize()` - 44 edges

## Surprising Connections (you probably didn't know these)
- `Largest selection preserves amount order before pagination` --documents--> `Selection`  [INFERRED]
  docs/adr/0001-drill-down-url-state.md → src/logic/drilldown.ts
- `Finpoint Style Additions` --references--> `ValidationError`  [INFERRED]
  STYLE.md → src/logic/validate.ts
- `Finpoint Style Additions` --references--> `useApiFormErrors()`  [INFERRED]
  STYLE.md → src/hooks/use-api-form-errors.ts
- `Edit Records within the Drill-down` --documents--> `DrillPanel()`  [INFERRED]
  README.md → src/components/drill/panel.tsx
- `Copy` --references--> `pluralize()`  [INFERRED]
  STYLE.md → src/lib/utils.ts

## Import Cycles
- None detected.

## Communities (98 total, 13 thin omitted)

### Community 0 - "Button"
Cohesion: 0.07
Nodes (119): CandidateResults(), react-day-picker, react-dom, sonner, @tanstack/react-form, AccountDialog(), BudgetCreatorDialog(), BudgetEditorDialog() (+111 more)

### Community 1 - "duplicates/page.tsx"
Cohesion: 0.14
Nodes (55): AccountPage(), AccountCard(), AccountRow, AccountsPage(), CARD_MOTION, DuplicateGroupCard(), FixDuplicatesPage(), GroupHeader() (+47 more)

### Community 2 - "db.ts"
Cohesion: 0.06
Nodes (42): dexie, fake-indexeddb, xlsx, AccountRow, AllocationRow, AnalyticsMonthRow, BudgetRecordRow, BudgetRow (+34 more)

### Community 3 - "Tests README"
Cohesion: 0.06
Nodes (41): Build harness step (vite build tests/harness), Playwright browser cache keyed on bun.lock, blob report merge, Committed graph artifacts (graph.json, GRAPH_REPORT.md, manifest.json, .graphify_labels.json), Graph health warnings and refresh failure reporting, graphify-out/graph.json, graphify skill (--update), graphify update . (+33 more)

### Community 4 - "suggestions.ts"
Cohesion: 0.07
Nodes (50): Rule, RuleSentence(), StatementRulesPage(), ruleValueLabel(), byCreation(), conditionPattern(), deleteStatementRule(), listStatementRules() (+42 more)

### Community 5 - "cn"
Cohesion: 0.09
Nodes (51): DriveOverwriteConfirmation(), AlertAction(), AlertDialog(), AlertDialogAction(), AlertDialogCancel(), AlertDialogContent(), AlertDialogDescription(), AlertDialogFooter() (+43 more)

### Community 6 - "importer/page.tsx"
Cohesion: 0.12
Nodes (44): EmptyRecords(), metadata, PrivacyPage(), SECTIONS, RecordPage(), learnedSignals(), SettingsPage(), StatementPage() (+36 more)

### Community 7 - "dashboard.ts"
Cohesion: 0.11
Nodes (44): luxon, db, AnalyticsRecord, AnalyticsSummary, contribution(), summarize(), summaryMeasure(), avg() (+36 more)

### Community 8 - "sidebar.tsx"
Cohesion: 0.10
Nodes (40): metadata, RootLayout(), viewport, Providers(), lucide-react, AppHeader(), AppearanceOption, APPEARANCES (+32 more)

### Community 9 - "(month)/page.tsx"
Cohesion: 0.11
Nodes (33): Largest selection preserves amount order before pagination, CategoriesPage(), CategoryDialogState, CategoryTile(), SECTIONS, Comparison, comparisonText(), ComparisonValue (+25 more)

### Community 10 - "utils.ts"
Cohesion: 0.12
Nodes (30): AllocateBar(), AllocationProgress(), AllocationRows(), AllocationSource, Sparkline(), DetailSummary(), DetailSummaryItem(), DynamicUiIcon() (+22 more)

### Community 11 - "records.ts"
Cohesion: 0.11
Nodes (30): canUseMonthlyBudget(), round2(), BudgetDetail, BudgetFilters, createBudget(), getBudget(), listBudgets(), CategoryInput (+22 more)

### Community 12 - "utils.ts"
Cohesion: 0.13
Nodes (35): BudgetPage(), getBudgetAnalytics(), getCategoryData(), Legend(), MonthlyRecordsPage(), @tanstack/react-table, AllocationExpansion(), Icon() (+27 more)

### Community 13 - "utils.ts"
Cohesion: 0.11
Nodes (35): asPending(), descriptionAnchors(), descriptionIdentity(), DuplicateGroup, duplicateGroups(), DuplicateStatement, duplicateStatementIds(), FixDuplicatesInput (+27 more)

### Community 14 - "radix-ui"
Cohesion: 0.12
Nodes (29): class-variance-authority, radix-ui, ButtonGroup(), ButtonGroupSeparator(), ButtonGroupText(), buttonGroupVariants, EmptyContent(), EmptyMedia() (+21 more)

### Community 15 - "utils.ts"
Cohesion: 0.20
Nodes (26): react, PendingStatementConfirmationSheet(), RecordSearchSheet(), StatementSearchSheet(), AmountFilter(), AmountRange, COMPARISONS, describe() (+18 more)

### Community 16 - "editors.ts"
Cohesion: 0.14
Nodes (20): editors, editors, longName, expectHeldRead(), expectRetainedRows(), expectSilentSheet(), expectVisibleBackdrop(), account (+12 more)

### Community 17 - "compilerOptions"
Cohesion: 0.06
Nodes (33): compilerOptions, allowJs, allowSyntheticDefaultImports, allowUnusedLabels, esModuleInterop, forceConsistentCasingInFileNames, incremental, isolatedModules (+25 more)

### Community 18 - "category-filter.tsx"
Cohesion: 0.12
Nodes (27): MonthLayout(), CategoryFilter(), CategoryFilterItem(), Command(), CommandEmpty(), CommandGroup(), CommandInput(), CommandItem() (+19 more)

### Community 19 - "lib/motion.ts"
Cohesion: 0.20
Nodes (26): DataTable(), PaginatedDataTable(), PaginationHeader(), GroupHeaderRow(), groupStarts(), GroupTotal(), isInteractiveTarget(), LeavingRows() (+18 more)

### Community 20 - "package.json"
Cohesion: 0.06
Nodes (30): private, $schema, type, babel-plugin-react-compiler, @biomejs/biome, clsx, cmdk, @fontsource-variable/inter (+22 more)

### Community 21 - "dependencies"
Cohesion: 0.07
Nodes (30): dependencies, @base-ui/react, class-variance-authority, clsx, cmdk, dexie, dexie-react-hooks, @fontsource-variable/inter (+22 more)

### Community 22 - "cn"
Cohesion: 0.11
Nodes (24): @base-ui/react, Props, ComboboxChip(), ComboboxChips(), ComboboxChipsInput(), ComboboxClear(), ComboboxCollection(), ComboboxContent() (+16 more)

### Community 23 - "auto-sync.ts"
Cohesion: 0.11
Nodes (27): SYNC_TABLES, useSyncStatus(), useSyncToasts(), emit(), eventListeners, finishCycle(), flushOnHide(), getSyncSnapshot() (+19 more)

### Community 24 - "ledger.e2e.ts"
Cohesion: 0.11
Nodes (25): behaviourCoverage, componentInventory, facetNotApplicable, InventoryEntry, modalAnimationCoverage, notApplicable, openFacets, RouteEntry (+17 more)

### Community 25 - "ValidationError"
Cohesion: 0.20
Nodes (25): ACCEPT, BANKS_REQUIRING_ADDITIONAL_INFO, ImporterPage(), Step(), BANKS, ensureAccount(), combine(), dbsDescriptionKey() (+17 more)

### Community 26 - "routes.ts"
Cohesion: 0.17
Nodes (21): ReviewLinks(), NotFound(), Template(), nextConfig, next, WorkflowTabs(), useDrill(), useDefaultFilterEndDateToday() (+13 more)

### Community 27 - "suspicious"
Cohesion: 0.07
Nodes (28): suspicious, noAssignInExpressions, noAsyncPromiseExecutor, noCatchAssign, noClassAssign, noCompareNegZero, noControlCharactersInRegex, noDebugger (+20 more)

### Community 28 - "test"
Cohesion: 0.16
Nodes (15): cardTitles, card(), chartTooltip, overview, overviewCharts, themedRgb(), assertSeeded(), checkSeededMarker() (+7 more)

### Community 29 - "export-import.ts"
Cohesion: 0.12
Nodes (23): Boot(), DEFAULT_CATEGORIES, DEFAULT_MONTHLY_BUDGETS, EXPORT_VERSION, FinpointExport, tableCounts(), SEED_HASH_KEY, seedIfEmpty() (+15 more)

### Community 30 - "Validator"
Cohesion: 0.26
Nodes (17): updateAccount(), validateBudget(), cleanInput(), dismissDuplicatePair(), eligible(), fixDuplicates(), restoreDuplicatePair(), createMonthlyBudget() (+9 more)

### Community 31 - "support/motion.ts"
Cohesion: 0.17
Nodes (20): denseCardConsumers, denseRowConsumers, expectConsumerEntrance(), populatedConsumers, attachSamplingFailure(), expectModalEntrance(), expectModalExit(), expectPopupEntrance() (+12 more)

### Community 32 - "correctness"
Cohesion: 0.08
Nodes (26): noConstantCondition, noConstAssign, noEmptyCharacterClassInRegex, noEmptyPattern, noGlobalObjectCalls, noInvalidBuiltinInstantiation, noInvalidConstructorSuper, noNonoctalDecimalEscape (+18 more)

### Community 33 - "export-import.ts"
Cohesion: 0.16
Nodes (19): FinpointDB, withoutActionModes(), clearAllData(), downloadExport(), importData(), monthlyBudgetFields(), parseImportFile(), TableName (+11 more)

### Community 34 - "utils.ts"
Cohesion: 0.16
Nodes (18): bar(), BarChart(), BarSeries, PAD, BudgetProgressChart(), BudgetProgressPoint, buildSeries(), ChartFrame() (+10 more)

### Community 35 - "budgets/[id]/page.tsx"
Cohesion: 0.17
Nodes (15): Edit Records within the Drill-down, framer-motion, DrillPanel(), RuleSuggestions(), STALE_MONTH_CLASS, takeMonthDirection(), useMonthTransition(), useRecordEditor() (+7 more)

### Community 36 - "components.json"
Cohesion: 0.09
Nodes (21): aliases, components, hooks, lib, ui, utils, iconLibrary, menuAccent (+13 more)

### Community 37 - "auto-sync.ts"
Cohesion: 0.28
Nodes (21): exportData(), disconnectDrive(), downloadBackupFile(), driveFetch(), findBackupFile(), getClockSkewMs(), getFileMeta(), isDriveConfigured() (+13 more)

### Community 38 - "types.d.ts"
Cohesion: 0.10
Nodes (20): Account, Allocation, AnalyticsSummary, AnalyticsTreatment, Appearance, Budget, Category, CategoryWithChildren (+12 more)

### Community 39 - "UiIcon"
Cohesion: 0.20
Nodes (15): BUDGET_STATES, BudgetCard(), BudgetsPage(), BudgetState, formatBudgetDateWindow(), getStoredHistory(), getValidHistory(), HistoryContext (+7 more)

### Community 40 - "auth-vault.ts"
Cohesion: 0.32
Nodes (13): POST(), POST(), POST(), AUTH_COOKIE_NAME, authCookie(), authCookieConfig(), clientIp(), encryptionKey() (+5 more)

### Community 41 - "ledger.e2e.ts"
Cohesion: 0.28
Nodes (16): collectTests(), conditionBranch(), detailsTags(), disabled(), mentionsMotion(), record(), splitTestCallee(), tagValues() (+8 more)

### Community 42 - "core/routes.e2e.ts"
Cohesion: 0.19
Nodes (11): containedFooter(), PREMATURE, routeReady, titles, expectPointerCursor(), buildPopulated(), getScenario(), learnedCoffee() (+3 more)

### Community 43 - "Statement"
Cohesion: 0.16
Nodes (15): CONTEXT.md (domain vocabulary), Account, Allocation, Budget, Category, Duplicate Statement, Monthly Budget, Pending Record (+7 more)

### Community 44 - "core/routes.e2e.ts"
Cohesion: 0.18
Nodes (10): desktopOnly, @playwright/test, Child, october, september, installDateOnly(), revisions, setDateOnly() (+2 more)

### Community 45 - "providers.tsx"
Cohesion: 0.26
Nodes (14): Appearance, applyAppearance(), getStoredAppearance(), handleSystemThemeChange(), initializeAppearance(), isDarkMode(), listeners, mediaQuery() (+6 more)

### Community 46 - "core/components.e2e.ts"
Cohesion: 0.21
Nodes (7): bounds(), contained(), expectWheelScrollsPageWhileOpen(), expectDropdownPreservesScroll(), scrollWithInput(), settledOverlayAlpha(), IDS

### Community 47 - "auto-sync.ts"
Cohesion: 0.24
Nodes (12): AuthNeededError, cacheToken(), CodeResponse, DriveFileMeta, ensureDriveToken(), ensureDriveTokenSilent(), googleClientId(), hasFreshDriveToken() (+4 more)

### Community 48 - "STYLE.md"
Cohesion: 0.18
Nodes (12): APIs, Arguments, And Props, Code Style, Consistency, Core, Earning Its Place, Finpoint Style Additions, Grouping And Order, Motion and polish (+4 more)

### Community 49 - "IndexedDB (Dexie)"
Cohesion: 0.18
Nodes (9): app/**/page.tsx, IndexedDB (Dexie), Interactive routes are "use client" (search params via next/navigation), Pages take no props, Project Shape, React Compiler (enabled), Root Suspense (keeps routes static), URL search params (filters and pagination) (+1 more)

### Community 50 - "formatter"
Cohesion: 0.15
Nodes (13): arrowParentheses, bracketSameLine, bracketSpacing, jsxQuoteStyle, quoteProperties, quoteStyle, semicolons, trailingCommas (+5 more)

### Community 51 - "devDependencies"
Cohesion: 0.15
Nodes (13): devDependencies, babel-plugin-react-compiler, @biomejs/biome, fake-indexeddb, @playwright/test, @tailwindcss/postcss, @types/luxon, @types/node (+5 more)

### Community 52 - "pagination.tsx"
Cohesion: 0.38
Nodes (11): pageHref(), pageWindow(), PaginationFooter(), Pagination(), PaginationContent(), PaginationEllipsis(), PaginationItem(), PaginationLink() (+3 more)

### Community 53 - "Commands"
Cohesion: 0.20
Nodes (11): Agent Behavior, Biome (biome check --write), bun install, bun lint (write-mode), bun lint:check, bun run build, bun types:check, Commands (+3 more)

### Community 54 - "Next.js agent rules block ("This is NOT the Next.js you know")"
Cohesion: 0.18
Nodes (9): app/api/auth/* Route Handlers, bun test, node_modules/next/dist/server/lib/generate-agent-files.js, Google OAuth broker (exchange/token/logout), Domain and importer tests (Dexie with in-memory IndexedDB), Next.js App Router app (mostly client-side), node_modules/next/dist/docs/, npm run dev (port 5173) (+1 more)

### Community 55 - "biome.json"
Cohesion: 0.18
Nodes (10): source, assist, actions, files, includes, linter, enabled, overrides (+2 more)

### Community 56 - "rules"
Cohesion: 0.18
Nodes (11): noAdjacentSpacesInRegex, noBannedTypes, noExtraBooleanCast, noUselessCatch, noUselessThisAlias, noUselessTypeConstraint, rules, noFloatingPromises (+3 more)

### Community 58 - "src/data/* (persistence, migrations, seeding, backup serialization, Drive storage)"
Cohesion: 0.38
Nodes (8): Background Drive sync, src/data/* (persistence, migrations, seeding, backup serialization, Drive storage), src/logic/* (domain reads and operations), (month) route-group shell (Overview + Monthly Records), src/routes.ts (centralized route paths), Static content pages (privacy, terms) are server components, UI layer (app pages + components), Workspace backup/reset operations

### Community 59 - "manifest.json"
Cohesion: 0.20
Nodes (9): background_color, description, display, icons, name, scope, short_name, start_url (+1 more)

### Community 60 - "spending-calendar.tsx"
Cohesion: 0.29
Nodes (9): compact(), heat(), INK, LEVELS, quantile(), rampCap(), SpendingCalendar(), STRENGTH (+1 more)

### Community 61 - "0001-drill-down-url-state.md"
Cohesion: 0.25
Nodes (8): Record focus, Statement pivot, Gross and net category selection URL, Drill-down, Drill-down URL state, Forecast and Monthly Budget Drill-down with explicit scope, Category and trend Drill-down, Calendar day Drill-down

### Community 62 - "scripts"
Cohesion: 0.22
Nodes (9): scripts, build, dev, lint, lint:check, start, test:e2e, types:check (+1 more)

### Community 63 - "formatter"
Cohesion: 0.25
Nodes (8): formatter, attributePosition, enabled, formatWithErrors, indentStyle, indentWidth, lineEnding, lineWidth

### Community 64 - "Records"
Cohesion: 0.32
Nodes (8): Allocator, Budgets, Categories, Dashboard, Statement-allocation-record model, Monthly Budgets, Records, Statement importer

### Community 66 - "Domain docs (single-context layout)"
Cohesion: 0.33
Nodes (7): Agent skills, CONTEXT.md, Domain docs (single-context layout), Domain Language, Issue tracker (local specs and tickets), .scratch/ local work tracking, String primary keys (not auto-increment)

### Community 67 - "optionalDependencies"
Cohesion: 0.29
Nodes (7): optionalDependencies, lightningcss-linux-x64-gnu, lightningcss-win32-x64-msvc, @rollup/rollup-linux-x64-gnu, @rollup/rollup-win32-x64-msvc, @tailwindcss/oxide-linux-x64-gnu, @tailwindcss/oxide-win32-x64-msvc

### Community 68 - "ledger.e2e.ts"
Cohesion: 0.29
Nodes (4): vite, @vitejs/plugin-react, harnessDir, repoRoot

### Community 69 - "tsconfig.e2e.json"
Cohesion: 0.29
Nodes (6): ./tsconfig.json, compilerOptions, incremental, exclude, extends, include

### Community 70 - "style"
Cohesion: 0.33
Nodes (6): style, noNamespace, noNonNullAssertion, useArrayLiterals, useAsConstAssertion, useBlockStatements

### Community 71 - "0002 Forecast pacing"
Cohesion: 0.33
Nodes (5): 0002 Forecast pacing, Consequences, Context, Decision, Rejected option

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

### Community 76 - "Finpoint"
Cohesion: 0.50
Nodes (4): Finpoint, Circular point, Rounded F monogram, Off-white icon fill

### Community 77 - "Domain docs"
Cohesion: 0.50
Nodes (3): Before exploration, Domain docs, Writing

### Community 78 - "Local Markdown Issue Tracker"
Cohesion: 0.50
Nodes (4): Local Tracker Operations, Spec and Ticket Files, Ticket Lifecycle, Local Markdown Issue Tracker

### Community 80 - "Google Drive sync"
Cohesion: 0.50
Nodes (4): Google Drive sync, JSON backup and restore, Local-first finance tracking, Sync conflict handling

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
- **95 isolated node(s):** `Build app step`, `Build harness step (tests/harness/vite.config.ts)`, `Playwright browser cache (keyed on bun.lock)`, `Graph health warnings and refresh failure reporting`, `gitmoji.dev` (+90 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 608 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **13 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `cn()` connect `radix-ui` to `Button`, `duplicates/page.tsx`, `suggestions.ts`, `cn`, `importer/page.tsx`, `sidebar.tsx`, `(month)/page.tsx`, `utils.ts`, `utils.ts`, `utils.ts`, `category-filter.tsx`, `lib/motion.ts`, `cn`, `ValidationError`, `routes.ts`, `utils.ts`, `budgets/[id]/page.tsx`, `UiIcon`, `pagination.tsx`, `spending-calendar.tsx`?**
  _High betweenness centrality (0.111) - this node is a cross-community bridge._
- **What connects `Build app step`, `Build harness step (tests/harness/vite.config.ts)`, `Playwright browser cache (keyed on bun.lock)` to the rest of the system?**
  _95 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Button` be split into smaller, more focused modules?**
  _Cohesion score 0.0680550714534681 - nodes in this community are weakly interconnected._
- **Why does `react` connect `utils.ts` to `Button`, `duplicates/page.tsx`, `suggestions.ts`, `cn`, `importer/page.tsx`, `sidebar.tsx`, `(month)/page.tsx`, `utils.ts`, `utils.ts`, `radix-ui`, `category-filter.tsx`, `lib/motion.ts`, `package.json`, `cn`, `auto-sync.ts`, `ValidationError`, `routes.ts`, `utils.ts`, `budgets/[id]/page.tsx`, `UiIcon`, `providers.tsx`, `pagination.tsx`, `spending-calendar.tsx`?**
  _High betweenness centrality (0.062) - this node is a cross-community bridge._
- **Should `duplicates/page.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.13561368209255534 - nodes in this community are weakly interconnected._
- **Why does `src/data/* (persistence, migrations, seeding, backup serialization, Drive storage)` connect `src/data/* (persistence, migrations, seeding, backup serialization, Drive storage)` to `sidebar.tsx`, `IndexedDB (Dexie)`?**
  _High betweenness centrality (0.057) - this node is a cross-community bridge._
- **Should `db.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.05673076923076923 - nodes in this community are weakly interconnected._