# Graph Report - t3-69efe8e6  (2026-11-08)

## Corpus Check
- 265 files · ~240,167 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 9 file(s) not represented in the graph (top: (none) 5, .example 1, .lock 1)

## Summary
- 2010 nodes · 7955 edges · 106 communities (89 shown, 17 thin omitted)
- Extraction: 98% EXTRACTED · 2% INFERRED · 0% AMBIGUOUS · INFERRED: 129 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `be40fddd`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- utils.ts
- Button
- app-sidebar.tsx
- lib/motion.ts
- Tests README
- luxon
- auto-sync.ts
- primitives.tsx
- cn
- db.ts
- records/[id]/page.tsx
- statements.ts
- dashboard.ts
- suggestions.ts
- editors.ts
- compilerOptions
- amount-filter.tsx
- category-history-chart.tsx
- sync/page.tsx
- dependencies
- package.json
- Validator
- ledger.e2e.ts
- suspicious
- monthly-budgets.test.ts
- support/motion.ts
- correctness
- README.md
- importer/page.tsx
- (month)/page.tsx
- icon.tsx
- statements/[id]/page.tsx
- test-data.ts
- components.json
- CONTEXT.md
- types.d.ts
- core/components.e2e.ts
- test
- records.ts
- auth-vault.ts
- fixtures.ts
- importer.ts
- collectTests
- STYLE.md
- statement-rules.ts
- budgets/[id]/page.tsx
- export-import.ts
- duplicates.ts
- core/routes.e2e.ts
- formatter
- devDependencies
- pagination.tsx
- command.tsx
- biome.json
- rules
- Next.js agent rules block ("This is NOT the Next.js you know")
- manifest.json
- workflows.e2e.ts
- spending-calendar.tsx
- State persistence rule (ephemeral UI state vs IndexedDB)
- src/data/* (persistence, migrations, seeding, backup serialization, Drive storage)
- UI layer
- scripts
- ui/field.tsx
- categories.ts
- formatter
- navigation.e2e.ts
- Domain docs (single-context layout)
- Commands
- optionalDependencies
- vite.config.ts
- tsconfig.e2e.json
- Comparison window
- style
- 0002 Forecast pacing
- src/components/*
- Validation rule (ValidationError + Validator)
- Finpoint icon concept
- Finpoint icon with charcoal shadow
- Issue tracker: Local Markdown
- Finpoint
- Domain docs
- Local Markdown Issue Tracker
- Dashboard
- Forecast pacing decision
- F monogram icon
- JPG favicon icon
- PNG favicon icon
- SVG favicon icon
- F monogram icon
- F monogram icon
- Legacy Monthly Records redirects
- Finpoint app icon
- Dashboard Attention
- Domain Documentation Conflicts
- Dashboard Attention
- Conventions
- Dashboard shell
- Versioned migrations
- Money out / Money in
- Unrestricted crawler policy
- Calendar day Drill-down
- IndexedDB

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
- `Finpoint Style Additions` --references--> `useApiFormErrors()`  [INFERRED]
  STYLE.md → src/hooks/use-api-form-errors.ts
- `Copy` --references--> `pluralize()`  [INFERRED]
  STYLE.md → src/lib/utils.ts
- `Largest selection preserves amount order before pagination` --documents--> `Selection`  [INFERRED]
  docs/adr/0001-drill-down-url-state.md → src/logic/drilldown.ts
- `Finpoint Style Additions` --references--> `ValidationError`  [INFERRED]
  STYLE.md → src/logic/validate.ts
- `Boot()` --indirect_call--> `preloadCategoryIcons()`  [INFERRED]
  app/providers.tsx → src/components/icon.tsx

## Import Cycles
- None detected.

## Communities (106 total, 17 thin omitted)

### Community 0 - "utils.ts"
Cohesion: 0.07
Nodes (109): CandidateResults(), PendingCard(), react, sonner, @tanstack/react-form, AccountDialog(), BudgetCreatorDialog(), BudgetEditorDialog() (+101 more)

### Community 1 - "Button"
Cohesion: 0.08
Nodes (97): AccountPage(), AccountCard(), AccountRow, AccountsPage(), AllocatorPage(), BUDGET_STATES, BudgetCard(), BudgetsPage() (+89 more)

### Community 2 - "app-sidebar.tsx"
Cohesion: 0.08
Nodes (57): metadata, RootLayout(), viewport, NotFound(), Boot(), Providers(), @vercel/analytics, @vercel/speed-insights (+49 more)

### Community 3 - "lib/motion.ts"
Cohesion: 0.09
Nodes (47): @tanstack/react-table, bar(), BarChart(), BarSeries, PAD, BudgetProgressChart(), BudgetProgressPoint, buildSeries() (+39 more)

### Community 4 - "Tests README"
Cohesion: 0.06
Nodes (41): Build harness step (vite build tests/harness), Playwright browser cache keyed on bun.lock, blob report merge, Committed graph artifacts (graph.json, GRAPH_REPORT.md, manifest.json, .graphify_labels.json), Graph health warnings and refresh failure reporting, graphify-out/graph.json, graphify skill (--update), graphify update . (+33 more)

### Community 5 - "luxon"
Cohesion: 0.08
Nodes (46): BudgetState, MonthLayout(), @base-ui/react, luxon, ComboboxField(), Props, DateField(), Props (+38 more)

### Community 6 - "auto-sync.ts"
Cohesion: 0.10
Nodes (52): exportData(), AuthNeededError, cacheToken(), CodeResponse, disconnectDrive(), downloadBackupFile(), driveFetch(), DriveFileMeta (+44 more)

### Community 7 - "primitives.tsx"
Cohesion: 0.10
Nodes (50): DriveOverwriteConfirmation(), AlertAction(), AlertDialog(), AlertDialogAction(), AlertDialogCancel(), AlertDialogContent(), AlertDialogDescription(), AlertDialogFooter() (+42 more)

### Community 8 - "cn"
Cohesion: 0.09
Nodes (46): class-variance-authority, radix-ui, AppHeader(), DEFINITIONS, Term(), ButtonGroup(), ButtonGroupSeparator(), ButtonGroupText() (+38 more)

### Community 9 - "db.ts"
Cohesion: 0.08
Nodes (35): AccountRow, AllocationRow, AnalyticsMonthRow, BudgetRecordRow, BudgetRow, CategoryRow, DB_NAME, DB_VERSION (+27 more)

### Community 10 - "records/[id]/page.tsx"
Cohesion: 0.14
Nodes (31): SECTIONS, RecordPage(), AllocationProgress(), AllocationExpansion(), AllocationRows(), AllocationSource, DrillPanel(), Icon() (+23 more)

### Community 11 - "statements.ts"
Cohesion: 0.12
Nodes (33): asPending(), AnalyticsRecord, AnalyticsSummary, duplicateStatementIds(), removeStatementDismissals(), readFile(), upsertIndexed(), updateRecord() (+25 more)

### Community 12 - "dashboard.ts"
Cohesion: 0.14
Nodes (35): summarize(), avg(), buildCashflowHistory(), buildCategories(), buildComparison(), buildHeadline(), buildMonthlyBudgets(), buildProjection() (+27 more)

### Community 13 - "suggestions.ts"
Cohesion: 0.11
Nodes (35): allocatedStatements(), asOf(), byDate(), CHIP_LIMIT, CHOICES, Clue, createModel(), DEFAULT_WEIGHTS (+27 more)

### Community 14 - "editors.ts"
Cohesion: 0.13
Nodes (21): editors, editors, longName, expectHeldRead(), expectRetainedRows(), expectSilentSheet(), expectVisibleBackdrop(), IDS (+13 more)

### Community 15 - "compilerOptions"
Cohesion: 0.06
Nodes (33): compilerOptions, allowJs, allowSyntheticDefaultImports, allowUnusedLabels, esModuleInterop, forceConsistentCasingInFileNames, incremental, isolatedModules (+25 more)

### Community 16 - "amount-filter.tsx"
Cohesion: 0.11
Nodes (27): AmountFilter(), AmountRange, COMPARISONS, describe(), Draft, readRange(), upperBound(), ComboboxChip() (+19 more)

### Community 17 - "category-history-chart.tsx"
Cohesion: 0.12
Nodes (24): Largest selection preserves amount order before pagination, CashflowChart(), CashflowPoint, aggregateSeries(), CategoryHistoryChart(), ChartMonth, ChartSeries, MonthBreakdown() (+16 more)

### Community 18 - "sync/page.tsx"
Cohesion: 0.14
Nodes (25): COUNT_ROWS, DataSettingsPage(), StateRow(), STATUS_TONES, StatusTone, WorkspaceRow(), clearAllData(), downloadExport() (+17 more)

### Community 19 - "dependencies"
Cohesion: 0.07
Nodes (30): dependencies, @base-ui/react, class-variance-authority, clsx, cmdk, dexie, dexie-react-hooks, @fontsource-variable/inter (+22 more)

### Community 20 - "package.json"
Cohesion: 0.07
Nodes (28): private, $schema, type, babel-plugin-react-compiler, @biomejs/biome, clsx, cmdk, @fontsource-variable/inter (+20 more)

### Community 21 - "Validator"
Cohesion: 0.25
Nodes (19): updateAccount(), validateBudget(), cleanInput(), dismissDuplicatePair(), fixDuplicates(), restoreDuplicatePair(), importFiles(), amountFor() (+11 more)

### Community 22 - "ledger.e2e.ts"
Cohesion: 0.11
Nodes (25): behaviourCoverage, componentInventory, facetNotApplicable, InventoryEntry, modalAnimationCoverage, notApplicable, openFacets, RouteEntry (+17 more)

### Community 23 - "suspicious"
Cohesion: 0.07
Nodes (28): suspicious, noAssignInExpressions, noAsyncPromiseExecutor, noCatchAssign, noClassAssign, noCompareNegZero, noControlCharactersInRegex, noDebugger (+20 more)

### Community 24 - "monthly-budgets.test.ts"
Cohesion: 0.11
Nodes (11): dexie, fake-indexeddb, xlsx, input, legacyPaceKey, today, decided(), live() (+3 more)

### Community 25 - "support/motion.ts"
Cohesion: 0.16
Nodes (21): denseCardConsumers, denseRowConsumers, expectConsumerEntrance(), populatedConsumers, pickOption(), attachSamplingFailure(), expectModalEntrance(), expectModalExit() (+13 more)

### Community 26 - "correctness"
Cohesion: 0.08
Nodes (26): noConstantCondition, noConstAssign, noEmptyCharacterClassInRegex, noEmptyPattern, noGlobalObjectCalls, noInvalidBuiltinInstantiation, noInvalidConstructorSuper, noNonoctalDecimalEscape (+18 more)

### Community 27 - "README.md"
Cohesion: 0.08
Nodes (24): Allocate workspace, Detail table allocated portions and drill-down Allocations, Backup and restore, Categories, Custom-period Budgets, Demo data, Inline metric and drill-down term definitions, Finpoint (+16 more)

### Community 28 - "importer/page.tsx"
Cohesion: 0.23
Nodes (19): ACCEPT, BANKS_REQUIRING_ADDITIONAL_INFO, ImporterPage(), Step(), metadata, PrivacyPage(), SECTIONS, MethodHeader() (+11 more)

### Community 29 - "(month)/page.tsx"
Cohesion: 0.14
Nodes (21): AttentionList(), Comparison, comparisonText(), ComparisonValue, DashboardData, DashboardMonthlyBudget, DashboardPage(), DashboardView (+13 more)

### Community 30 - "icon.tsx"
Cohesion: 0.12
Nodes (20): lucide-react, react-day-picker, DynamicUiIcon(), ICON_NAMES, iconNameSet, loadedIcons, loadIcon(), loadingIcons (+12 more)

### Community 31 - "statements/[id]/page.tsx"
Cohesion: 0.19
Nodes (14): StatementPage(), react-dom, AllocateBar(), Sparkline(), DetailSummary(), DetailSummaryItem(), Delta, Metric() (+6 more)

### Community 32 - "test-data.ts"
Cohesion: 0.15
Nodes (18): DEFAULT_CATEGORIES, DEFAULT_MONTHLY_BUDGETS, migrateRecordChoices(), SEED_HASH_KEY, BANK_BLURB, between(), CATEGORIES, DAILY (+10 more)

### Community 33 - "components.json"
Cohesion: 0.09
Nodes (21): aliases, components, hooks, lib, ui, utils, iconLibrary, menuAccent (+13 more)

### Community 34 - "CONTEXT.md"
Cohesion: 0.12
Nodes (21): Account, Allocate, Budget, Category, Drill-down, Duplicate Statement, Irregular, Left over (+13 more)

### Community 35 - "types.d.ts"
Cohesion: 0.10
Nodes (20): Account, Allocation, AnalyticsSummary, AnalyticsTreatment, Appearance, Budget, Category, CategoryWithChildren (+12 more)

### Community 36 - "core/components.e2e.ts"
Cohesion: 0.15
Nodes (9): desktopOnly, bounds(), contained(), expectWheelScrollsPageWhileOpen(), expectDropdownPreservesScroll(), scrollWithInput(), settledOverlayAlpha(), APP_URL (+1 more)

### Community 37 - "test"
Cohesion: 0.23
Nodes (8): cardTitles, card(), chartTooltip, overview, overviewCharts, themedRgb(), seedWorkspace(), test

### Community 38 - "records.ts"
Cohesion: 0.20
Nodes (14): contribution(), summaryMeasure(), getDrilldown(), analyticsValues(), budgetCovers(), ConflictError, createRecord(), expandCategoryIds() (+6 more)

### Community 39 - "auth-vault.ts"
Cohesion: 0.32
Nodes (13): POST(), POST(), POST(), AUTH_COOKIE_NAME, authCookie(), authCookieConfig(), clientIp(), encryptionKey() (+5 more)

### Community 40 - "fixtures.ts"
Cohesion: 0.18
Nodes (14): @playwright/test, Child, october, september, installDateOnly(), revisions, setDateOnly(), assertSeeded() (+6 more)

### Community 41 - "importer.ts"
Cohesion: 0.29
Nodes (16): ensureAccount(), combine(), dbsDescriptionKey(), debitCreditAmount(), descriptionKey(), importDbs(), importOcbc(), ImportResult (+8 more)

### Community 42 - "collectTests"
Cohesion: 0.28
Nodes (16): collectTests(), conditionBranch(), detailsTags(), disabled(), mentionsMotion(), record(), splitTestCallee(), tagValues() (+8 more)

### Community 43 - "STYLE.md"
Cohesion: 0.16
Nodes (14): Allocation, APIs, Arguments, And Props, Code Style, Consistency, Copy, Core, Earning Its Place, Finpoint Style Additions (+6 more)

### Community 44 - "statement-rules.ts"
Cohesion: 0.26
Nodes (11): byCreation(), conditionPattern(), deleteStatementRule(), listStatementRules(), matchesStatement(), NAME_ORDER, previewStatementRule(), recommendationAutofill() (+3 more)

### Community 45 - "budgets/[id]/page.tsx"
Cohesion: 0.27
Nodes (12): BudgetPage(), getBudgetAnalytics(), getCategoryData(), Legend(), MetricGrid(), CardAction(), useRecordEditor(), parseDatetime() (+4 more)

### Community 46 - "export-import.ts"
Cohesion: 0.23
Nodes (11): EXPORT_VERSION, FinpointExport, monthlyBudgetFields(), SYNC_TABLES, TableName, TABLES, DEFAULT_SETTINGS, FinpointSettings (+3 more)

### Community 47 - "duplicates.ts"
Cohesion: 0.23
Nodes (13): allocationOutcome(), descriptionAnchors(), descriptionIdentity(), DuplicateGroup, duplicateGroups(), DuplicateStatement, eligible(), FixDuplicatesInput (+5 more)

### Community 48 - "core/routes.e2e.ts"
Cohesion: 0.23
Nodes (9): containedFooter(), PREMATURE, routeReady, titles, expectPointerCursor(), getScenario(), fits(), patchRows() (+1 more)

### Community 49 - "formatter"
Cohesion: 0.15
Nodes (13): arrowParentheses, bracketSameLine, bracketSpacing, jsxQuoteStyle, quoteProperties, quoteStyle, semicolons, trailingCommas (+5 more)

### Community 50 - "devDependencies"
Cohesion: 0.15
Nodes (13): devDependencies, babel-plugin-react-compiler, @biomejs/biome, fake-indexeddb, @playwright/test, @tailwindcss/postcss, @types/luxon, @types/node (+5 more)

### Community 51 - "pagination.tsx"
Cohesion: 0.38
Nodes (11): pageHref(), pageWindow(), PaginationFooter(), Pagination(), PaginationContent(), PaginationEllipsis(), PaginationItem(), PaginationLink() (+3 more)

### Community 52 - "command.tsx"
Cohesion: 0.36
Nodes (10): CategoryFilter(), CategoryFilterItem(), Command(), CommandEmpty(), CommandGroup(), CommandInput(), CommandItem(), CommandList() (+2 more)

### Community 53 - "biome.json"
Cohesion: 0.18
Nodes (10): source, assist, actions, files, includes, linter, enabled, overrides (+2 more)

### Community 54 - "rules"
Cohesion: 0.18
Nodes (11): noAdjacentSpacesInRegex, noBannedTypes, noExtraBooleanCast, noUselessCatch, noUselessThisAlias, noUselessTypeConstraint, rules, noFloatingPromises (+3 more)

### Community 55 - "Next.js agent rules block ("This is NOT the Next.js you know")"
Cohesion: 0.22
Nodes (7): app/api/auth/* Route Handlers, node_modules/next/dist/server/lib/generate-agent-files.js, Google OAuth broker (exchange/token/logout), Next.js App Router app (mostly client-side), node_modules/next/dist/docs/, npm run dev (port 5173), Verification

### Community 56 - "manifest.json"
Cohesion: 0.20
Nodes (9): background_color, description, display, icons, name, scope, short_name, start_url (+1 more)

### Community 58 - "spending-calendar.tsx"
Cohesion: 0.29
Nodes (9): compact(), heat(), INK, LEVELS, quantile(), rampCap(), SpendingCalendar(), STRENGTH (+1 more)

### Community 59 - "State persistence rule (ephemeral UI state vs IndexedDB)"
Cohesion: 0.22
Nodes (6): app/**/page.tsx, Interactive routes are "use client" (search params via next/navigation), Pages take no props, Root Suspense (keeps routes static), URL search params (filters and pagination), useLiveQuery

### Community 60 - "src/data/* (persistence, migrations, seeding, backup serialization, Drive storage)"
Cohesion: 0.36
Nodes (7): Background Drive sync, bun test, src/data/* (persistence, migrations, seeding, backup serialization, Drive storage), IndexedDB (Dexie), Domain and importer tests (Dexie with in-memory IndexedDB), src/logic/* (domain reads and operations), Workspace backup/reset operations

### Community 61 - "UI layer"
Cohesion: 0.31
Nodes (8): Domain logic, Dashboard month route-group shell, Persistence, Project Shape, React Compiler (enabled), src/routes.ts (centralized route paths), Static content pages (privacy, terms) are server components, UI layer

### Community 62 - "scripts"
Cohesion: 0.22
Nodes (9): scripts, build, dev, lint, lint:check, start, test:e2e, types:check (+1 more)

### Community 63 - "ui/field.tsx"
Cohesion: 0.28
Nodes (7): Field(), FieldContent(), FieldLegend(), FieldSet(), FieldTitle(), fieldVariants, Label()

### Community 64 - "categories.ts"
Cohesion: 0.31
Nodes (6): db, CategoryInput, getMonthlyRecords(), MonthlyFilters, expandCategoryIdsForMonthly(), TREATMENT_VALUES

### Community 65 - "formatter"
Cohesion: 0.25
Nodes (8): formatter, attributePosition, enabled, formatWithErrors, indentStyle, indentWidth, lineEnding, lineWidth

### Community 67 - "Domain docs (single-context layout)"
Cohesion: 0.33
Nodes (7): Agent skills, CONTEXT.md, Domain docs (single-context layout), Domain Language, Issue tracker (local specs and tickets), .scratch/ local work tracking, String primary keys (not auto-increment)

### Community 68 - "Commands"
Cohesion: 0.38
Nodes (7): Biome (biome check --write), bun install, bun lint (write-mode), bun lint:check, bun run build, bun types:check, Commands

### Community 69 - "optionalDependencies"
Cohesion: 0.29
Nodes (7): optionalDependencies, lightningcss-linux-x64-gnu, lightningcss-win32-x64-msvc, @rollup/rollup-linux-x64-gnu, @rollup/rollup-win32-x64-msvc, @tailwindcss/oxide-linux-x64-gnu, @tailwindcss/oxide-win32-x64-msvc

### Community 70 - "vite.config.ts"
Cohesion: 0.29
Nodes (4): vite, @vitejs/plugin-react, harnessDir, repoRoot

### Community 71 - "tsconfig.e2e.json"
Cohesion: 0.29
Nodes (6): ./tsconfig.json, compilerOptions, incremental, exclude, extends, include

### Community 72 - "Comparison window"
Cohesion: 0.33
Nodes (5): Compare selection uses included comparison months and title-based uniqueness, Gross and net category selection URL, Comparison window, Drill-down URL state, Biggest changes compares same-period net Spending Records

### Community 73 - "style"
Cohesion: 0.33
Nodes (6): style, noNamespace, noNonNullAssertion, useArrayLiterals, useAsConstAssertion, useBlockStatements

### Community 74 - "0002 Forecast pacing"
Cohesion: 0.33
Nodes (5): 0002 Forecast pacing, Consequences, Context, Decision, Rejected option

### Community 75 - "src/components/*"
Cohesion: 0.40
Nodes (4): Agent Behavior, Generated / Ignored Files, src/components/*, src/components/ui/**/*

### Community 76 - "Validation rule (ValidationError + Validator)"
Cohesion: 0.50
Nodes (4): Old Laravel Api/*Controller mapping, Laravel-shaped { field: string[] } error maps, ValidationError, Validator

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

### Community 84 - "Dashboard"
Cohesion: 0.50
Nodes (4): Dashboard, Dashboard natural card heights, Empty month offers latest recorded month, Empty workspace import and demo start state

### Community 85 - "Forecast pacing decision"
Cohesion: 0.67
Nodes (3): Forecast pacing decision, Remaining historical spending scaled by remaining days, Median daily spending fallback including zero days

### Community 86 - "F monogram icon"
Cohesion: 0.67
Nodes (3): Circular dot beside F, Rounded F letterform, F monogram icon

### Community 87 - "JPG favicon icon"
Cohesion: 0.67
Nodes (3): JPG favicon dot, JPG favicon F letterform, JPG favicon icon

### Community 88 - "PNG favicon icon"
Cohesion: 0.67
Nodes (3): PNG favicon dot, PNG favicon F letterform, PNG favicon icon

### Community 89 - "SVG favicon icon"
Cohesion: 0.67
Nodes (3): SVG favicon dot, SVG favicon F letterform, SVG favicon icon

### Community 90 - "F monogram icon"
Cohesion: 0.67
Nodes (3): Circular dot beside F, Rounded F letterform, F monogram icon

### Community 91 - "F monogram icon"
Cohesion: 0.67
Nodes (3): Circular dot beside F, Rounded F letterform, F monogram icon

## Knowledge Gaps
- **128 isolated node(s):** `@fontsource-variable/inter`, `shadcn`, `tailwindcss`, `tw-animate-css`, `@biomejs/biome` (+123 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 641 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **17 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `cn()` connect `cn` to `utils.ts`, `Button`, `app-sidebar.tsx`, `lib/motion.ts`, `luxon`, `primitives.tsx`, `records/[id]/page.tsx`, `amount-filter.tsx`, `category-history-chart.tsx`, `sync/page.tsx`, `importer/page.tsx`, `(month)/page.tsx`, `icon.tsx`, `statements/[id]/page.tsx`, `budgets/[id]/page.tsx`, `pagination.tsx`, `command.tsx`, `spending-calendar.tsx`, `ui/field.tsx`?**
  _High betweenness centrality (0.105) - this node is a cross-community bridge._
- **What connects `@fontsource-variable/inter`, `shadcn`, `tailwindcss` to the rest of the system?**
  _128 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `utils.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.07464175584980955 - nodes in this community are weakly interconnected._
- **Why does `src/data/* (persistence, migrations, seeding, backup serialization, Drive storage)` connect `src/data/* (persistence, migrations, seeding, backup serialization, Drive storage)` to `app-sidebar.tsx`, `UI layer`?**
  _High betweenness centrality (0.079) - this node is a cross-community bridge._
- **Should `Button` be split into smaller, more focused modules?**
  _Cohesion score 0.07771428571428571 - nodes in this community are weakly interconnected._
- **Why does `react` connect `utils.ts` to `Button`, `app-sidebar.tsx`, `lib/motion.ts`, `luxon`, `primitives.tsx`, `cn`, `records/[id]/page.tsx`, `amount-filter.tsx`, `category-history-chart.tsx`, `sync/page.tsx`, `package.json`, `importer/page.tsx`, `(month)/page.tsx`, `icon.tsx`, `statements/[id]/page.tsx`, `budgets/[id]/page.tsx`, `pagination.tsx`, `command.tsx`, `spending-calendar.tsx`, `ui/field.tsx`?**
  _High betweenness centrality (0.063) - this node is a cross-community bridge._
- **Should `app-sidebar.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.07672634271099744 - nodes in this community are weakly interconnected._