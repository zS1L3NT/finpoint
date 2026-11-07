# Graph Report - t3-69efe8e6  (2026-11-07)

## Corpus Check
- 265 files · ~240,739 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 9 file(s) not represented in the graph (top: (none) 5, .example 1, .lock 1)

## Summary
- 2000 nodes · 8023 edges · 95 communities (85 shown, 10 thin omitted)
- Extraction: 98% EXTRACTED · 2% INFERRED · 0% AMBIGUOUS · INFERRED: 129 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `1c9c3ce0`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- Button
- utils.ts
- budgets/page.tsx
- duplicates/page.tsx
- Tests README
- db.ts
- primitives.tsx
- dashboard.ts
- sidebar.tsx
- records.ts
- budgets/[id]/page.tsx
- Validator
- monthly/page.tsx
- suggestions.ts
- cn
- editors.ts
- routes.ts
- amount-filter.tsx
- compilerOptions
- data.ts
- package.json
- dependencies
- fixtures.ts
- icon.tsx
- auto-sync.ts
- ledger.e2e.ts
- suspicious
- correctness
- README.md
- core/components.e2e.ts
- (month)/page.tsx
- ValidationError
- support/motion.ts
- components.json
- CONTEXT.md
- statements.ts
- workspace.ts
- types.d.ts
- core/routes.e2e.ts
- export-import.ts
- drive-sync.ts
- sync/page.tsx
- test-data.ts
- auth-vault.ts
- collectTests
- STYLE.md
- google-drive.ts
- use-appearance.tsx
- alert-dialog.tsx
- UI layer (app pages + components)
- formatter
- devDependencies
- pagination.tsx
- biome.json
- rules
- src/data/* (persistence, migrations, seeding, backup serialization, Drive storage)
- manifest.json
- Next.js agent rules block ("This is NOT the Next.js you know")
- scripts
- src/components/*
- formatter
- lucide-react
- navigation.e2e.ts
- Domain docs (single-context layout)
- Commands
- optionalDependencies
- vite.config.ts
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
- main.tsx
- Forecast pacing decision
- F monogram icon
- JPG favicon icon
- PNG favicon icon
- SVG favicon icon
- F monogram icon
- F monogram icon
- Dashboard
- Finpoint app icon
- Domain Documentation Conflicts
- Conventions
- Unrestricted crawler policy
- Calendar day Drill-down

## God Nodes (most connected - your core abstractions)
1. `cn()` - 329 edges
2. `PrimitivesSection()` - 181 edges
3. `Button()` - 128 edges
4. `react` - 100 edges
5. `formatCurrency()` - 79 edges
6. `RecordEditorDialog()` - 67 edges
7. `UiIcon()` - 60 edges
8. `RecordCreatorDialog()` - 58 edges
9. `round2()` - 48 edges
10. `pluralize()` - 44 edges

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

## Communities (95 total, 10 thin omitted)

### Community 0 - "Button"
Cohesion: 0.07
Nodes (126): BudgetState, MonthLayout(), CandidateResults(), react-day-picker, sonner, @tanstack/react-form, AccountDialog(), BudgetCreatorDialog() (+118 more)

### Community 1 - "utils.ts"
Cohesion: 0.16
Nodes (14): class-variance-authority, radix-ui, react, AppHeader(), ButtonGroup(), ButtonGroupSeparator(), ButtonGroupText(), buttonGroupVariants (+6 more)

### Community 2 - "budgets/page.tsx"
Cohesion: 0.05
Nodes (74): BUDGET_STATES, BudgetCard(), BudgetsPage(), formatBudgetDateWindow(), framer-motion, @tanstack/react-table, bar(), BarChart() (+66 more)

### Community 3 - "duplicates/page.tsx"
Cohesion: 0.15
Nodes (50): AccountPage(), AllocatorPage(), ScopeSelect(), MonthlyRecordFilters(), RecordCreatorHost(), RecordFilters(), RecordsPage(), CARD_MOTION (+42 more)

### Community 4 - "Tests README"
Cohesion: 0.06
Nodes (41): Build harness step (vite build tests/harness), Playwright browser cache keyed on bun.lock, blob report merge, Committed graph artifacts (graph.json, GRAPH_REPORT.md, manifest.json, .graphify_labels.json), Graph health warnings and refresh failure reporting, graphify-out/graph.json, graphify skill (--update), graphify update . (+33 more)

### Community 5 - "db.ts"
Cohesion: 0.07
Nodes (30): dexie, fake-indexeddb, xlsx, asPending(), CategoryRow, DB_NAME, DB_VERSION, MetaRow (+22 more)

### Community 6 - "primitives.tsx"
Cohesion: 0.09
Nodes (48): @base-ui/react, Props, AlertAction(), ComboboxChip(), ComboboxChips(), ComboboxChipsInput(), ComboboxCollection(), ComboboxContent() (+40 more)

### Community 7 - "dashboard.ts"
Cohesion: 0.10
Nodes (44): db, MonthlyBudgetRow, AnalyticsRecord, AnalyticsSummary, contribution(), summarize(), summaryMeasure(), avg() (+36 more)

### Community 8 - "sidebar.tsx"
Cohesion: 0.09
Nodes (42): metadata, RootLayout(), viewport, Providers(), AppearanceOption, APPEARANCES, AppearanceSwitch(), AppSidebar() (+34 more)

### Community 9 - "records.ts"
Cohesion: 0.10
Nodes (35): AllocationExpansion(), AllocationSource, canUseMonthlyBudget(), round2(), BudgetDetail, BudgetFilters, createBudget(), getBudget() (+27 more)

### Community 10 - "budgets/[id]/page.tsx"
Cohesion: 0.11
Nodes (42): BudgetPage(), getBudgetAnalytics(), getCategoryData(), Legend(), MonthlyRecordsPage(), AllocationProgress(), AllocationRows(), BudgetProgressChart() (+34 more)

### Community 11 - "Validator"
Cohesion: 0.15
Nodes (30): updateAccount(), validateBudget(), cleanInput(), allocationOutcome(), descriptionAnchors(), descriptionIdentity(), dismissDuplicatePair(), DuplicateGroup (+22 more)

### Community 12 - "monthly/page.tsx"
Cohesion: 0.12
Nodes (40): ACCEPT, BANKS_REQUIRING_ADDITIONAL_INFO, ImporterPage(), Step(), byRecordDay, EmptyRecords(), FILTER_KEYS, Filters (+32 more)

### Community 13 - "suggestions.ts"
Cohesion: 0.10
Nodes (38): AllocationRow, allocatedStatements(), asOf(), byDate(), CHIP_LIMIT, CHOICES, Clue, createModel() (+30 more)

### Community 14 - "cn"
Cohesion: 0.13
Nodes (34): CategoryFilter(), CategoryFilterItem(), ComboboxClear(), ComboboxInput(), ComboboxTrigger(), Command(), CommandEmpty(), CommandGroup() (+26 more)

### Community 15 - "editors.ts"
Cohesion: 0.13
Nodes (23): editors, editors, longName, expectHeldRead(), expectRetainedRows(), expectSilentSheet(), expectVisibleBackdrop(), IDS (+15 more)

### Community 16 - "routes.ts"
Cohesion: 0.14
Nodes (25): AccountCard(), AccountRow, AccountsPage(), NotFound(), TITLES, dayLabel(), bankMeta(), BANKS (+17 more)

### Community 17 - "amount-filter.tsx"
Cohesion: 0.19
Nodes (26): PendingStatementConfirmationSheet(), RecordOption(), RecordSearchSheet(), StatementOption(), StatementSearchSheet(), AmountFilter(), AmountRange, COMPARISONS (+18 more)

### Community 18 - "compilerOptions"
Cohesion: 0.06
Nodes (33): compilerOptions, allowJs, allowSyntheticDefaultImports, allowUnusedLabels, esModuleInterop, forceConsistentCasingInFileNames, incremental, isolatedModules (+25 more)

### Community 19 - "data.ts"
Cohesion: 0.09
Nodes (22): AccountRow, AnalyticsMonthRow, BudgetRecordRow, BudgetRow, DuplicateDismissalRow, MonthlyBudgetAmountRow, MonthlyBudgetDefaultRow, DBS_VALID (+14 more)

### Community 20 - "package.json"
Cohesion: 0.06
Nodes (30): private, $schema, type, babel-plugin-react-compiler, @biomejs/biome, clsx, cmdk, @fontsource-variable/inter (+22 more)

### Community 21 - "dependencies"
Cohesion: 0.07
Nodes (30): dependencies, @base-ui/react, class-variance-authority, clsx, cmdk, dexie, dexie-react-hooks, @fontsource-variable/inter (+22 more)

### Community 22 - "fixtures.ts"
Cohesion: 0.15
Nodes (17): cardTitles, card(), chartTooltip, overview, overviewCharts, themedRgb(), ScenarioName, WorkspaceTables (+9 more)

### Community 23 - "icon.tsx"
Cohesion: 0.11
Nodes (36): CategoriesPage(), CategoryDialogState, CategoryTile(), SECTIONS, RecordPage(), Rule, RuleSentence(), StatementRulesPage() (+28 more)

### Community 24 - "auto-sync.ts"
Cohesion: 0.10
Nodes (26): Boot(), SYNC_TABLES, useSyncStatus(), useSyncToasts(), emit(), eventListeners, finishCycle(), flushOnHide() (+18 more)

### Community 25 - "ledger.e2e.ts"
Cohesion: 0.11
Nodes (25): behaviourCoverage, componentInventory, facetNotApplicable, InventoryEntry, modalAnimationCoverage, notApplicable, openFacets, RouteEntry (+17 more)

### Community 26 - "suspicious"
Cohesion: 0.07
Nodes (28): suspicious, noAssignInExpressions, noAsyncPromiseExecutor, noCatchAssign, noClassAssign, noCompareNegZero, noControlCharactersInRegex, noDebugger (+20 more)

### Community 27 - "correctness"
Cohesion: 0.08
Nodes (26): noConstantCondition, noConstAssign, noEmptyCharacterClassInRegex, noEmptyPattern, noGlobalObjectCalls, noInvalidBuiltinInstantiation, noInvalidConstructorSuper, noNonoctalDecimalEscape (+18 more)

### Community 28 - "README.md"
Cohesion: 0.08
Nodes (23): Allocate workspace, Detail table allocated portions and drill-down Allocations, Backup and restore, Categories, Custom-period Budgets, Demo data, Inline metric and drill-down term definitions, Finpoint (+15 more)

### Community 29 - "core/components.e2e.ts"
Cohesion: 0.13
Nodes (11): desktopOnly, bounds(), contained(), expectWheelScrollsPageWhileOpen(), containedFooter(), expectDropdownPreservesScroll(), expectPointerCursor(), scrollWithInput() (+3 more)

### Community 30 - "(month)/page.tsx"
Cohesion: 0.10
Nodes (37): Largest selection preserves amount order before pagination, Comparison, comparisonText(), ComparisonValue, DashboardData, DashboardMonthlyBudget, DashboardPage(), DashboardView (+29 more)

### Community 31 - "ValidationError"
Cohesion: 0.22
Nodes (21): ensureAccount(), combine(), dbsDescriptionKey(), debitCreditAmount(), descriptionKey(), importDbs(), importOcbc(), ImportResult (+13 more)

### Community 32 - "support/motion.ts"
Cohesion: 0.18
Nodes (18): denseCardConsumers, denseRowConsumers, expectConsumerEntrance(), populatedConsumers, attachSamplingFailure(), expectPopupEntrance(), expectReducedRowMovement(), expectVisibleRowCascade() (+10 more)

### Community 33 - "components.json"
Cohesion: 0.09
Nodes (21): aliases, components, hooks, lib, ui, utils, iconLibrary, menuAccent (+13 more)

### Community 34 - "CONTEXT.md"
Cohesion: 0.09
Nodes (21): Account, Allocate, Budget, Category, Drill-down, Duplicate Statement, Irregular, Left over (+13 more)

### Community 35 - "statements.ts"
Cohesion: 0.20
Nodes (20): duplicateStatementIds(), removeStatementDismissals(), dayDifference(), ensureCanReplace(), maskDescription(), ReplacementAllocation, replacementComparison(), replacementReason() (+12 more)

### Community 36 - "workspace.ts"
Cohesion: 0.20
Nodes (14): DEFAULT_CATEGORIES, DEFAULT_MONTHLY_BUDGETS, clearAllData(), downloadExport(), exportData(), tableCounts(), SEED_HASH_KEY, seedIfEmpty() (+6 more)

### Community 37 - "types.d.ts"
Cohesion: 0.10
Nodes (20): Account, Allocation, AnalyticsSummary, AnalyticsTreatment, Appearance, Budget, Category, CategoryWithChildren (+12 more)

### Community 38 - "core/routes.e2e.ts"
Cohesion: 0.18
Nodes (13): @playwright/test, Child, october, september, PREMATURE, routeReady, titles, installDateOnly() (+5 more)

### Community 39 - "export-import.ts"
Cohesion: 0.18
Nodes (15): FinpointDB, withoutActionModes(), importData(), monthlyBudgetFields(), parseImportFile(), TableName, TABLES, migrateRecordChoices() (+7 more)

### Community 40 - "drive-sync.ts"
Cohesion: 0.33
Nodes (18): downloadBackupFile(), driveFetch(), findBackupFile(), getClockSkewMs(), getFileMeta(), isDriveConfigured(), uploadBackupFile(), hashSnapshot() (+10 more)

### Community 41 - "sync/page.tsx"
Cohesion: 0.23
Nodes (14): COUNT_ROWS, DataSettingsPage(), StateRow(), STATUS_TONES, StatusTone, WorkspaceRow(), wasVaultProven(), ingestManualResult() (+6 more)

### Community 42 - "test-data.ts"
Cohesion: 0.16
Nodes (16): EXPORT_VERSION, FinpointExport, BANK_BLURB, between(), CATEGORIES, DAILY, generateTestData(), IRREGULAR (+8 more)

### Community 43 - "auth-vault.ts"
Cohesion: 0.32
Nodes (13): POST(), POST(), POST(), AUTH_COOKIE_NAME, authCookie(), authCookieConfig(), clientIp(), encryptionKey() (+5 more)

### Community 44 - "collectTests"
Cohesion: 0.28
Nodes (16): collectTests(), conditionBranch(), detailsTags(), disabled(), mentionsMotion(), record(), splitTestCallee(), tagValues() (+8 more)

### Community 45 - "STYLE.md"
Cohesion: 0.16
Nodes (14): Allocation, APIs, Arguments, And Props, Code Style, Consistency, Copy, Core, Earning Its Place, Finpoint Style Additions (+6 more)

### Community 46 - "google-drive.ts"
Cohesion: 0.24
Nodes (12): AuthNeededError, cacheToken(), CodeResponse, disconnectDrive(), DriveFileMeta, ensureDriveToken(), ensureDriveTokenSilent(), googleClientId() (+4 more)

### Community 47 - "use-appearance.tsx"
Cohesion: 0.26
Nodes (14): Appearance, applyAppearance(), getStoredAppearance(), handleSystemThemeChange(), initializeAppearance(), isDarkMode(), listeners, mediaQuery() (+6 more)

### Community 48 - "alert-dialog.tsx"
Cohesion: 0.34
Nodes (12): DriveOverwriteConfirmation(), AlertDialog(), AlertDialogAction(), AlertDialogCancel(), AlertDialogContent(), AlertDialogDescription(), AlertDialogFooter(), AlertDialogHeader() (+4 more)

### Community 50 - "UI layer (app pages + components)"
Cohesion: 0.22
Nodes (11): app/**/page.tsx, Interactive routes are "use client" (search params via next/navigation), (month) route-group shell (Overview + Monthly Records), Pages take no props, Project Shape, React Compiler (enabled), Root Suspense (keeps routes static), src/routes.ts (centralized route paths) (+3 more)

### Community 51 - "formatter"
Cohesion: 0.15
Nodes (13): arrowParentheses, bracketSameLine, bracketSpacing, jsxQuoteStyle, quoteProperties, quoteStyle, semicolons, trailingCommas (+5 more)

### Community 52 - "devDependencies"
Cohesion: 0.15
Nodes (13): devDependencies, babel-plugin-react-compiler, @biomejs/biome, fake-indexeddb, @playwright/test, @tailwindcss/postcss, @types/luxon, @types/node (+5 more)

### Community 53 - "pagination.tsx"
Cohesion: 0.38
Nodes (11): pageHref(), pageWindow(), PaginationFooter(), Pagination(), PaginationContent(), PaginationEllipsis(), PaginationItem(), PaginationLink() (+3 more)

### Community 54 - "biome.json"
Cohesion: 0.18
Nodes (10): source, assist, actions, files, includes, linter, enabled, overrides (+2 more)

### Community 55 - "rules"
Cohesion: 0.18
Nodes (11): noAdjacentSpacesInRegex, noBannedTypes, noExtraBooleanCast, noUselessCatch, noUselessThisAlias, noUselessTypeConstraint, rules, noFloatingPromises (+3 more)

### Community 56 - "src/data/* (persistence, migrations, seeding, backup serialization, Drive storage)"
Cohesion: 0.31
Nodes (8): Background Drive sync, bun test, src/data/* (persistence, migrations, seeding, backup serialization, Drive storage), IndexedDB (Dexie), Domain and importer tests (Dexie with in-memory IndexedDB), src/logic/* (domain reads and operations), Verification, Workspace backup/reset operations

### Community 57 - "manifest.json"
Cohesion: 0.20
Nodes (9): background_color, description, display, icons, name, scope, short_name, start_url (+1 more)

### Community 58 - "Next.js agent rules block ("This is NOT the Next.js you know")"
Cohesion: 0.25
Nodes (6): app/api/auth/* Route Handlers, node_modules/next/dist/server/lib/generate-agent-files.js, Google OAuth broker (exchange/token/logout), Next.js App Router app (mostly client-side), node_modules/next/dist/docs/, npm run dev (port 5173)

### Community 59 - "scripts"
Cohesion: 0.22
Nodes (9): scripts, build, dev, lint, lint:check, start, test:e2e, types:check (+1 more)

### Community 60 - "src/components/*"
Cohesion: 0.25
Nodes (5): Agent Behavior, Generated / Ignored Files, src/components/*, src/components/ui/**/*, useLiveQuery

### Community 61 - "formatter"
Cohesion: 0.25
Nodes (8): formatter, attributePosition, enabled, formatWithErrors, indentStyle, indentWidth, lineEnding, lineWidth

### Community 62 - "lucide-react"
Cohesion: 0.29
Nodes (7): lucide-react, ButtonVariant, Month, MonthCal(), MonthCalProps, MonthPicker(), MONTHS

### Community 64 - "Domain docs (single-context layout)"
Cohesion: 0.33
Nodes (7): Agent skills, CONTEXT.md, Domain docs (single-context layout), Domain Language, Issue tracker (local specs and tickets), .scratch/ local work tracking, String primary keys (not auto-increment)

### Community 65 - "Commands"
Cohesion: 0.38
Nodes (7): Biome (biome check --write), bun install, bun lint (write-mode), bun lint:check, bun run build, bun types:check, Commands

### Community 66 - "optionalDependencies"
Cohesion: 0.29
Nodes (7): optionalDependencies, lightningcss-linux-x64-gnu, lightningcss-win32-x64-msvc, @rollup/rollup-linux-x64-gnu, @rollup/rollup-win32-x64-msvc, @tailwindcss/oxide-linux-x64-gnu, @tailwindcss/oxide-win32-x64-msvc

### Community 67 - "vite.config.ts"
Cohesion: 0.29
Nodes (4): vite, @vitejs/plugin-react, harnessDir, repoRoot

### Community 68 - "tsconfig.e2e.json"
Cohesion: 0.29
Nodes (6): ./tsconfig.json, compilerOptions, incremental, exclude, extends, include

### Community 69 - "Comparison window"
Cohesion: 0.33
Nodes (5): Compare selection uses included comparison months and title-based uniqueness, Gross and net category selection URL, Comparison window, Drill-down URL state, Biggest changes compares same-period net Spending Records

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
Cohesion: 0.67
Nodes (3): Dashboard, Empty month offers latest recorded month, Empty workspace import and demo start state

## Knowledge Gaps
- **121 isolated node(s):** `@fontsource-variable/inter`, `shadcn`, `tailwindcss`, `tw-animate-css`, `@biomejs/biome` (+116 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 636 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **10 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `cn()` connect `cn` to `Button`, `utils.ts`, `budgets/page.tsx`, `duplicates/page.tsx`, `primitives.tsx`, `sidebar.tsx`, `sync/page.tsx`, `budgets/[id]/page.tsx`, `monthly/page.tsx`, `routes.ts`, `amount-filter.tsx`, `alert-dialog.tsx`, `pagination.tsx`, `icon.tsx`, `lucide-react`, `(month)/page.tsx`?**
  _High betweenness centrality (0.105) - this node is a cross-community bridge._
- **What connects `@fontsource-variable/inter`, `shadcn`, `tailwindcss` to the rest of the system?**
  _121 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Button` be split into smaller, more focused modules?**
  _Cohesion score 0.06619496855345912 - nodes in this community are weakly interconnected._
- **Why does `src/data/* (persistence, migrations, seeding, backup serialization, Drive storage)` connect `src/data/* (persistence, migrations, seeding, backup serialization, Drive storage)` to `sidebar.tsx`, `UI layer (app pages + components)`?**
  _High betweenness centrality (0.079) - this node is a cross-community bridge._
- **Should `budgets/page.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.05307017543859649 - nodes in this community are weakly interconnected._
- **Why does `react` connect `utils.ts` to `Button`, `budgets/page.tsx`, `duplicates/page.tsx`, `primitives.tsx`, `sidebar.tsx`, `records.ts`, `budgets/[id]/page.tsx`, `monthly/page.tsx`, `cn`, `routes.ts`, `amount-filter.tsx`, `package.json`, `icon.tsx`, `auto-sync.ts`, `(month)/page.tsx`, `sync/page.tsx`, `use-appearance.tsx`, `alert-dialog.tsx`, `pagination.tsx`, `lucide-react`, `main.tsx`?**
  _High betweenness centrality (0.071) - this node is a cross-community bridge._
- **Should `Tests README` be split into smaller, more focused modules?**
  _Cohesion score 0.05928614640048397 - nodes in this community are weakly interconnected._