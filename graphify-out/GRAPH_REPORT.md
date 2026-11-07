# Graph Report - t3-69efe8e6  (2026-11-08)

## Corpus Check
- cluster-only mode — file stats not available

## Summary
- 2008 nodes · 7960 edges · 94 communities (79 shown, 15 thin omitted)
- Extraction: 98% EXTRACTED · 2% INFERRED · 0% AMBIGUOUS · INFERRED: 129 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `d6f70d87`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- Button
- duplicates/page.tsx
- utils.ts
- statements.ts
- dashboard.ts
- (month)/page.tsx
- Tests README
- primitives.tsx
- auto-sync.ts
- lib/motion.ts
- sidebar.tsx
- cn
- suggestions.ts
- editors.ts
- db.ts
- data.ts
- compilerOptions
- export-import.ts
- package.json
- dependencies
- ledger.e2e.ts
- providers.tsx
- suspicious
- correctness
- README.md
- support/motion.ts
- core/routes.e2e.ts
- test-data.ts
- components.json
- CONTEXT.md
- types.d.ts
- sync/page.tsx
- auth-vault.ts
- statement-rules.ts
- test
- collectTests
- STYLE.md
- radix-ui
- amount-filter.tsx
- alert-dialog.tsx
- core/components.e2e.ts
- formatter
- devDependencies
- pagination.tsx
- biome.json
- rules
- Next.js agent rules block ("This is NOT the Next.js you know")
- manifest.json
- State persistence rule (ephemeral UI state vs IndexedDB)
- src/data/* (persistence, migrations, seeding, backup serialization, Drive storage)
- UI layer
- scripts
- formatter
- navigation.e2e.ts
- Domain docs (single-context layout)
- Commands
- optionalDependencies
- animations/components.e2e.ts
- vite.config.ts
- tsconfig.e2e.json
- hashSnapshot
- style
- 0002 Forecast pacing
- Dashboard
- 0001-drill-down-url-state.md
- src/components/*
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
- `Largest selection preserves amount order before pagination` --documents--> `Selection`  [INFERRED]
  docs/adr/0001-drill-down-url-state.md → src/logic/drilldown.ts
- `Finpoint Style Additions` --references--> `ValidationError`  [INFERRED]
  STYLE.md → src/logic/validate.ts
- `Finpoint Style Additions` --references--> `useApiFormErrors()`  [INFERRED]
  STYLE.md → src/hooks/use-api-form-errors.ts
- `Copy` --references--> `pluralize()`  [INFERRED]
  STYLE.md → src/lib/utils.ts
- `Boot()` --indirect_call--> `preloadCategoryIcons()`  [INFERRED]
  app/providers.tsx → src/components/icon.tsx

## Import Cycles
- None detected.

## Communities (94 total, 15 thin omitted)

### Community 0 - "Button"
Cohesion: 0.06
Nodes (154): CategoriesPage(), CategoryDialogState, CategoryTile(), SECTIONS, ACCEPT, BANKS_REQUIRING_ADDITIONAL_INFO, ImporterPage(), Step() (+146 more)

### Community 1 - "duplicates/page.tsx"
Cohesion: 0.05
Nodes (123): AccountPage(), AccountCard(), AccountRow, AccountsPage(), AllocatorPage(), BUDGET_STATES, BudgetCard(), BudgetsPage() (+115 more)

### Community 2 - "utils.ts"
Cohesion: 0.05
Nodes (96): Largest selection preserves amount order before pagination, BudgetPage(), getBudgetAnalytics(), getCategoryData(), Legend(), PendingCard(), AllocateBar(), AllocationProgress() (+88 more)

### Community 3 - "statements.ts"
Cohesion: 0.07
Nodes (74): asPending(), ensureAccount(), updateAccount(), validateBudget(), cleanInput(), descriptionAnchors(), descriptionIdentity(), dismissDuplicatePair() (+66 more)

### Community 4 - "dashboard.ts"
Cohesion: 0.06
Nodes (67): AllocationRow, AnalyticsMonthRow, CategoryRow, MonthlyBudgetAmountRow, MonthlyBudgetDefaultRow, RecordRow, AnalyticsRecord, AnalyticsSummary (+59 more)

### Community 5 - "(month)/page.tsx"
Cohesion: 0.07
Nodes (54): AttentionList(), Comparison, comparisonText(), ComparisonValue, DashboardData, DashboardMonthlyBudget, DashboardPage(), DashboardView (+46 more)

### Community 6 - "Tests README"
Cohesion: 0.06
Nodes (41): Build harness step (vite build tests/harness), Playwright browser cache keyed on bun.lock, blob report merge, Committed graph artifacts (graph.json, GRAPH_REPORT.md, manifest.json, .graphify_labels.json), Graph health warnings and refresh failure reporting, graphify-out/graph.json, graphify skill (--update), graphify update . (+33 more)

### Community 7 - "primitives.tsx"
Cohesion: 0.09
Nodes (49): AlertAction(), CardFooter(), DropdownMenu(), DropdownMenuCheckboxItem(), DropdownMenuContent(), DropdownMenuGroup(), DropdownMenuItem(), DropdownMenuLabel() (+41 more)

### Community 8 - "auto-sync.ts"
Cohesion: 0.11
Nodes (47): SYNC_TABLES, AuthNeededError, cacheToken(), CodeResponse, disconnectDrive(), downloadBackupFile(), driveFetch(), DriveFileMeta (+39 more)

### Community 9 - "lib/motion.ts"
Cohesion: 0.13
Nodes (35): @tanstack/react-table, Sparkline(), Delta, Metric(), DataTable(), PaginatedDataTable(), GroupHeaderRow(), groupStarts() (+27 more)

### Community 10 - "sidebar.tsx"
Cohesion: 0.10
Nodes (37): lucide-react, AppearanceOption, APPEARANCES, AppearanceSwitch(), AppSidebar(), SyncDot(), SYSTEM_APPEARANCE, useSyncIndicator() (+29 more)

### Community 11 - "cn"
Cohesion: 0.13
Nodes (34): CategoryFilter(), CategoryFilterItem(), ComboboxChip(), ComboboxChips(), ComboboxChipsInput(), ComboboxClear(), ComboboxCollection(), ComboboxContent() (+26 more)

### Community 12 - "suggestions.ts"
Cohesion: 0.10
Nodes (37): MonthlyBudgetRow, allocatedStatements(), asOf(), byDate(), CHIP_LIMIT, CHOICES, Clue, createModel() (+29 more)

### Community 13 - "editors.ts"
Cohesion: 0.12
Nodes (22): editors, containedFooter(), editors, longName, expectHeldRead(), expectRetainedRows(), expectSilentSheet(), expectVisibleBackdrop() (+14 more)

### Community 14 - "db.ts"
Cohesion: 0.10
Nodes (16): dexie, fake-indexeddb, xlsx, AccountRow, BudgetRecordRow, BudgetRow, DB_NAME, DB_VERSION (+8 more)

### Community 15 - "data.ts"
Cohesion: 0.10
Nodes (25): DBS_VALID, buildDense(), buildEmpty(), buildPopulated(), cycle(), DEFAULT_SETTINGS, emptyTables(), getScenario() (+17 more)

### Community 16 - "compilerOptions"
Cohesion: 0.06
Nodes (33): compilerOptions, allowJs, allowSyntheticDefaultImports, allowUnusedLabels, esModuleInterop, forceConsistentCasingInFileNames, incremental, isolatedModules (+25 more)

### Community 17 - "export-import.ts"
Cohesion: 0.14
Nodes (25): db, withoutActionModes(), clearAllData(), downloadExport(), EXPORT_VERSION, exportData(), importData(), monthlyBudgetFields() (+17 more)

### Community 18 - "package.json"
Cohesion: 0.06
Nodes (30): private, $schema, type, babel-plugin-react-compiler, @base-ui/react, @biomejs/biome, clsx, cmdk (+22 more)

### Community 19 - "dependencies"
Cohesion: 0.07
Nodes (30): dependencies, @base-ui/react, class-variance-authority, clsx, cmdk, dexie, dexie-react-hooks, @fontsource-variable/inter (+22 more)

### Community 20 - "ledger.e2e.ts"
Cohesion: 0.10
Nodes (25): behaviourCoverage, componentInventory, facetNotApplicable, InventoryEntry, modalAnimationCoverage, notApplicable, openFacets, RouteEntry (+17 more)

### Community 21 - "providers.tsx"
Cohesion: 0.15
Nodes (23): metadata, RootLayout(), viewport, Boot(), Providers(), Toaster(), TooltipProvider(), applyAppearance() (+15 more)

### Community 22 - "suspicious"
Cohesion: 0.07
Nodes (28): suspicious, noAssignInExpressions, noAsyncPromiseExecutor, noCatchAssign, noClassAssign, noCompareNegZero, noControlCharactersInRegex, noDebugger (+20 more)

### Community 23 - "correctness"
Cohesion: 0.08
Nodes (26): noConstantCondition, noConstAssign, noEmptyCharacterClassInRegex, noEmptyPattern, noGlobalObjectCalls, noInvalidBuiltinInstantiation, noInvalidConstructorSuper, noNonoctalDecimalEscape (+18 more)

### Community 24 - "README.md"
Cohesion: 0.08
Nodes (25): Allocate workspace, Allocations, Backup and restore, Categories, Custom-period Budgets, Demo data, Financial terms definitions, Finpoint (+17 more)

### Community 25 - "support/motion.ts"
Cohesion: 0.17
Nodes (19): denseCardConsumers, denseRowConsumers, expectConsumerEntrance(), populatedConsumers, pickOption(), attachSamplingFailure(), expectPopupEntrance(), expectReducedRowMovement() (+11 more)

### Community 26 - "core/routes.e2e.ts"
Cohesion: 0.16
Nodes (15): @playwright/test, Child, october, september, PREMATURE, routeReady, titles, expectPointerCursor() (+7 more)

### Community 27 - "test-data.ts"
Cohesion: 0.14
Nodes (18): DEFAULT_CATEGORIES, DEFAULT_MONTHLY_BUDGETS, FinpointExport, migrateRecordChoices(), BANK_BLURB, between(), CATEGORIES, DAILY (+10 more)

### Community 28 - "components.json"
Cohesion: 0.09
Nodes (21): aliases, components, hooks, lib, ui, utils, iconLibrary, menuAccent (+13 more)

### Community 29 - "CONTEXT.md"
Cohesion: 0.12
Nodes (20): Account, Allocate, Budget, Category, Drill-down, Duplicate Statement, Irregular, Left over (+12 more)

### Community 30 - "types.d.ts"
Cohesion: 0.10
Nodes (20): Account, Allocation, AnalyticsSummary, AnalyticsTreatment, Appearance, Budget, Category, CategoryWithChildren (+12 more)

### Community 31 - "sync/page.tsx"
Cohesion: 0.17
Nodes (18): COUNT_ROWS, DataSettingsPage(), StateRow(), STATUS_TONES, StatusTone, WorkspaceRow(), wasVaultProven(), useSyncStatus() (+10 more)

### Community 32 - "auth-vault.ts"
Cohesion: 0.29
Nodes (14): POST(), POST(), POST(), jose, AUTH_COOKIE_NAME, authCookie(), authCookieConfig(), clientIp() (+6 more)

### Community 33 - "statement-rules.ts"
Cohesion: 0.21
Nodes (14): StatementRow, TREATMENT_VALUES, byCreation(), conditionPattern(), deleteStatementRule(), listStatementRules(), matchesStatement(), NAME_ORDER (+6 more)

### Community 34 - "test"
Cohesion: 0.24
Nodes (7): cardTitles, card(), chartTooltip, overview, overviewCharts, themedRgb(), test

### Community 35 - "collectTests"
Cohesion: 0.28
Nodes (16): collectTests(), conditionBranch(), detailsTags(), disabled(), mentionsMotion(), record(), splitTestCallee(), tagValues() (+8 more)

### Community 36 - "STYLE.md"
Cohesion: 0.16
Nodes (14): Allocation, APIs, Arguments, And Props, Code Style, Consistency, Copy, Core, Earning Its Place, Finpoint Style Additions (+6 more)

### Community 37 - "radix-ui"
Cohesion: 0.18
Nodes (12): class-variance-authority, radix-ui, AppHeader(), ButtonGroup(), ButtonGroupSeparator(), ButtonGroupText(), buttonGroupVariants, FieldSeparator() (+4 more)

### Community 38 - "amount-filter.tsx"
Cohesion: 0.22
Nodes (13): AmountFilter(), AmountRange, COMPARISONS, describe(), Draft, readRange(), upperBound(), InputGroupInput() (+5 more)

### Community 39 - "alert-dialog.tsx"
Cohesion: 0.34
Nodes (12): DriveOverwriteConfirmation(), AlertDialog(), AlertDialogAction(), AlertDialogCancel(), AlertDialogContent(), AlertDialogDescription(), AlertDialogFooter(), AlertDialogHeader() (+4 more)

### Community 40 - "core/components.e2e.ts"
Cohesion: 0.23
Nodes (6): bounds(), contained(), expectWheelScrollsPageWhileOpen(), expectDropdownPreservesScroll(), scrollWithInput(), settledOverlayAlpha()

### Community 41 - "formatter"
Cohesion: 0.15
Nodes (13): arrowParentheses, bracketSameLine, bracketSpacing, jsxQuoteStyle, quoteProperties, quoteStyle, semicolons, trailingCommas (+5 more)

### Community 42 - "devDependencies"
Cohesion: 0.15
Nodes (13): devDependencies, babel-plugin-react-compiler, @biomejs/biome, fake-indexeddb, @playwright/test, @tailwindcss/postcss, @types/luxon, @types/node (+5 more)

### Community 43 - "pagination.tsx"
Cohesion: 0.38
Nodes (11): pageHref(), pageWindow(), PaginationFooter(), Pagination(), PaginationContent(), PaginationEllipsis(), PaginationItem(), PaginationLink() (+3 more)

### Community 44 - "biome.json"
Cohesion: 0.18
Nodes (10): source, assist, actions, files, includes, linter, enabled, overrides (+2 more)

### Community 45 - "rules"
Cohesion: 0.18
Nodes (11): noAdjacentSpacesInRegex, noBannedTypes, noExtraBooleanCast, noUselessCatch, noUselessThisAlias, noUselessTypeConstraint, rules, noFloatingPromises (+3 more)

### Community 46 - "Next.js agent rules block ("This is NOT the Next.js you know")"
Cohesion: 0.22
Nodes (7): app/api/auth/* Route Handlers, node_modules/next/dist/server/lib/generate-agent-files.js, Google OAuth broker (exchange/token/logout), Next.js App Router app (mostly client-side), node_modules/next/dist/docs/, npm run dev (port 5173), Verification

### Community 47 - "manifest.json"
Cohesion: 0.20
Nodes (9): background_color, description, display, icons, name, scope, short_name, start_url (+1 more)

### Community 48 - "State persistence rule (ephemeral UI state vs IndexedDB)"
Cohesion: 0.22
Nodes (6): app/**/page.tsx, Interactive routes are "use client" (search params via next/navigation), Pages take no props, Root Suspense (keeps routes static), URL search params (filters and pagination), useLiveQuery

### Community 49 - "src/data/* (persistence, migrations, seeding, backup serialization, Drive storage)"
Cohesion: 0.36
Nodes (7): Background Drive sync, bun test, src/data/* (persistence, migrations, seeding, backup serialization, Drive storage), IndexedDB (Dexie), Domain and importer tests (Dexie with in-memory IndexedDB), src/logic/* (domain reads and operations), Workspace backup/reset operations

### Community 50 - "UI layer"
Cohesion: 0.31
Nodes (8): Domain logic, Dashboard month route-group shell, Persistence, Project Shape, React Compiler (enabled), src/routes.ts (centralized route paths), Static content pages (privacy, terms) are server components, UI layer

### Community 51 - "scripts"
Cohesion: 0.22
Nodes (9): scripts, build, dev, lint, lint:check, start, test:e2e, types:check (+1 more)

### Community 52 - "formatter"
Cohesion: 0.25
Nodes (8): formatter, attributePosition, enabled, formatWithErrors, indentStyle, indentWidth, lineEnding, lineWidth

### Community 54 - "Domain docs (single-context layout)"
Cohesion: 0.33
Nodes (7): Agent skills, CONTEXT.md, Domain docs (single-context layout), Domain Language, Issue tracker (local specs and tickets), .scratch/ local work tracking, String primary keys (not auto-increment)

### Community 55 - "Commands"
Cohesion: 0.38
Nodes (7): Biome (biome check --write), bun install, bun lint (write-mode), bun lint:check, bun run build, bun types:check, Commands

### Community 56 - "optionalDependencies"
Cohesion: 0.29
Nodes (7): optionalDependencies, lightningcss-linux-x64-gnu, lightningcss-win32-x64-msvc, @rollup/rollup-linux-x64-gnu, @rollup/rollup-win32-x64-msvc, @tailwindcss/oxide-linux-x64-gnu, @tailwindcss/oxide-win32-x64-msvc

### Community 57 - "animations/components.e2e.ts"
Cohesion: 0.38
Nodes (3): desktopOnly, APP_URL, HARNESS_URL

### Community 58 - "vite.config.ts"
Cohesion: 0.29
Nodes (4): vite, @vitejs/plugin-react, harnessDir, repoRoot

### Community 59 - "tsconfig.e2e.json"
Cohesion: 0.29
Nodes (6): ./tsconfig.json, compilerOptions, incremental, exclude, extends, include

### Community 60 - "hashSnapshot"
Cohesion: 0.43
Nodes (5): FinpointDB, digestSnapshot(), hashLegacySnapshot(), hashSnapshot(), Snapshot

### Community 61 - "style"
Cohesion: 0.33
Nodes (6): style, noNamespace, noNonNullAssertion, useArrayLiterals, useAsConstAssertion, useBlockStatements

### Community 62 - "0002 Forecast pacing"
Cohesion: 0.33
Nodes (5): 0002 Forecast pacing, Consequences, Context, Decision, Rejected option

### Community 63 - "Dashboard"
Cohesion: 0.33
Nodes (6): Comparison columns share ordering and show the average arithmetic, Dashboard, Forecast dotted comparison names the previous month, Pending Record reasons visible before expansion, Statement pivot amount, account and timestamp, Statement titles open their funded Records

### Community 64 - "0001-drill-down-url-state.md"
Cohesion: 0.40
Nodes (4): Compare selection uses included comparison months and title-based uniqueness, Gross and net category selection URL, Comparison window, Drill-down URL state

### Community 65 - "src/components/*"
Cohesion: 0.40
Nodes (4): Agent Behavior, Generated / Ignored Files, src/components/*, src/components/ui/**/*

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
- **127 isolated node(s):** `node_modules/next/dist/server/lib/generate-agent-files.js`, `node_modules/next/dist/docs/`, `Root Suspense (keeps routes static)`, `React Compiler (enabled)`, `Static content pages (privacy, terms) are server components` (+122 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 640 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **15 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `cn()` connect `cn` to `Button`, `duplicates/page.tsx`, `utils.ts`, `(month)/page.tsx`, `amount-filter.tsx`, `primitives.tsx`, `alert-dialog.tsx`, `lib/motion.ts`, `radix-ui`, `pagination.tsx`, `sidebar.tsx`, `sync/page.tsx`?**
  _High betweenness centrality (0.082) - this node is a cross-community bridge._
- **What connects `node_modules/next/dist/server/lib/generate-agent-files.js`, `node_modules/next/dist/docs/`, `Root Suspense (keeps routes static)` to the rest of the system?**
  _127 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Button` be split into smaller, more focused modules?**
  _Cohesion score 0.05602652143026285 - nodes in this community are weakly interconnected._
- **Why does `@playwright/test` connect `core/routes.e2e.ts` to `test`, `core/components.e2e.ts`, `editors.ts`, `data.ts`, `package.json`, `ledger.e2e.ts`, `navigation.e2e.ts`, `animations/components.e2e.ts`, `support/motion.ts`?**
  _High betweenness centrality (0.068) - this node is a cross-community bridge._
- **Should `duplicates/page.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.052437106918238996 - nodes in this community are weakly interconnected._
- **Why does `react` connect `Button` to `duplicates/page.tsx`, `utils.ts`, `dashboard.ts`, `(month)/page.tsx`, `amount-filter.tsx`, `alert-dialog.tsx`, `primitives.tsx`, `lib/motion.ts`, `sidebar.tsx`, `cn`, `radix-ui`, `pagination.tsx`, `package.json`, `providers.tsx`, `sync/page.tsx`?**
  _High betweenness centrality (0.064) - this node is a cross-community bridge._
- **Should `utils.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.05337004982953055 - nodes in this community are weakly interconnected._