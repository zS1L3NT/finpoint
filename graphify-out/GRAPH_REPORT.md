# Graph Report - t3-69efe8e6  (2026-11-08)

## Corpus Check
- cluster-only mode — file stats not available

## Summary
- 2006 nodes · 7958 edges · 103 communities (88 shown, 15 thin omitted)
- Extraction: 98% EXTRACTED · 2% INFERRED · 0% AMBIGUOUS · INFERRED: 129 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `6d60397d`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- Button
- duplicates/page.tsx
- lib/motion.ts
- Tests README
- utils.ts
- ledger.e2e.ts
- primitives.tsx
- auto-sync.ts
- db.ts
- (month)/page.tsx
- dashboard.ts
- cn
- suggestions.ts
- app-sidebar.tsx
- icon.tsx
- round2
- compilerOptions
- data.ts
- settings/page.tsx
- animations/editors.e2e.ts
- editors.ts
- package.json
- dependencies
- fixtures.ts
- importer/page.tsx
- sync/page.tsx
- suspicious
- Validator
- combobox.tsx
- correctness
- statements.ts
- records.ts
- README.md
- test-data.ts
- components.json
- CONTEXT.md
- core/components.e2e.ts
- core/routes.e2e.ts
- types.d.ts
- command.tsx
- budgets/[id]/page.tsx
- statement-rules.ts
- auth-vault.ts
- STYLE.md
- use-appearance.tsx
- alert-dialog.tsx
- duplicates.ts
- UI layer
- providers.tsx
- formatter
- devDependencies
- category-history-chart.tsx
- pagination.tsx
- export-import.ts
- biome.json
- rules
- lucide-react
- src/data/* (persistence, migrations, seeding, backup serialization, Drive storage)
- manifest.json
- Next.js agent rules block ("This is NOT the Next.js you know")
- scripts
- SidebarMenuButton
- app/layout.tsx
- formatter
- navigation.e2e.ts
- Domain docs (single-context layout)
- Commands
- optionalDependencies
- tsconfig.e2e.json
- style
- 0002 Forecast pacing
- 0001-drill-down-url-state.md
- src/components/*
- Validation rule (ValidationError + Validator)
- layer segregation (UI / logic / data)
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
- `Finpoint Style Additions` --references--> `useApiFormErrors()`  [INFERRED]
  STYLE.md → src/hooks/use-api-form-errors.ts
- `Copy` --references--> `pluralize()`  [INFERRED]
  STYLE.md → src/lib/utils.ts
- `Boot()` --indirect_call--> `preloadCategoryIcons()`  [INFERRED]
  app/providers.tsx → src/components/icon.tsx

## Import Cycles
- None detected.

## Communities (103 total, 15 thin omitted)

### Community 0 - "Button"
Cohesion: 0.07
Nodes (113): react, react-day-picker, sonner, @tanstack/react-form, AccountDialog(), BudgetCreatorDialog(), BudgetEditorDialog(), CategoryDialog() (+105 more)

### Community 1 - "duplicates/page.tsx"
Cohesion: 0.08
Nodes (83): AccountPage(), AccountCard(), AccountRow, AccountsPage(), AllocatorPage(), BUDGET_STATES, BudgetCard(), BudgetsPage() (+75 more)

### Community 2 - "lib/motion.ts"
Cohesion: 0.08
Nodes (53): Rule, RuleSentence(), StatementRulesPage(), framer-motion, @tanstack/react-table, bar(), BarChart(), BarSeries (+45 more)

### Community 3 - "Tests README"
Cohesion: 0.06
Nodes (41): Build harness step (vite build tests/harness), Playwright browser cache keyed on bun.lock, blob report merge, Committed graph artifacts (graph.json, GRAPH_REPORT.md, manifest.json, .graphify_labels.json), Graph health warnings and refresh failure reporting, graphify-out/graph.json, graphify skill (--update), graphify update . (+33 more)

### Community 4 - "utils.ts"
Cohesion: 0.11
Nodes (42): Largest selection preserves amount order before pagination, PendingCard(), AllocateBar(), AllocationProgress(), AllocationExpansion(), AllocationRows(), AllocationSource, Amount() (+34 more)

### Community 5 - "ledger.e2e.ts"
Cohesion: 0.07
Nodes (46): typescript, vite, @vitejs/plugin-react, behaviourCoverage, componentInventory, facetNotApplicable, InventoryEntry, modalAnimationCoverage (+38 more)

### Community 6 - "primitives.tsx"
Cohesion: 0.09
Nodes (48): Providers(), AlertAction(), DropdownMenu(), DropdownMenuCheckboxItem(), DropdownMenuContent(), DropdownMenuGroup(), DropdownMenuItem(), DropdownMenuLabel() (+40 more)

### Community 7 - "auto-sync.ts"
Cohesion: 0.11
Nodes (46): SYNC_TABLES, AuthNeededError, cacheToken(), CodeResponse, disconnectDrive(), downloadBackupFile(), driveFetch(), DriveFileMeta (+38 more)

### Community 8 - "db.ts"
Cohesion: 0.09
Nodes (22): dexie, fake-indexeddb, xlsx, DB_NAME, DB_VERSION, FinpointDB, MetaRow, SettingsRow (+14 more)

### Community 9 - "(month)/page.tsx"
Cohesion: 0.08
Nodes (38): MonthLayout(), AttentionList(), Comparison, comparisonText(), ComparisonValue, DashboardData, DashboardMonthlyBudget, DashboardPage() (+30 more)

### Community 10 - "dashboard.ts"
Cohesion: 0.11
Nodes (40): AnalyticsRecord, AnalyticsSummary, contribution(), summarize(), summaryMeasure(), avg(), buildCashflowHistory(), buildCategories() (+32 more)

### Community 11 - "cn"
Cohesion: 0.10
Nodes (38): class-variance-authority, radix-ui, AppHeader(), AppearanceSwitch(), ButtonGroup(), ButtonGroupSeparator(), ButtonGroupText(), buttonGroupVariants (+30 more)

### Community 12 - "suggestions.ts"
Cohesion: 0.10
Nodes (37): allocatedStatements(), asOf(), byDate(), CHIP_LIMIT, CHOICES, Clue, createModel(), DEFAULT_WEIGHTS (+29 more)

### Community 13 - "app-sidebar.tsx"
Cohesion: 0.17
Nodes (31): NotFound(), AppearanceOption, APPEARANCES, AppSidebar(), SyncDot(), SYSTEM_APPEARANCE, useSyncIndicator(), ShellHeader() (+23 more)

### Community 14 - "icon.tsx"
Cohesion: 0.13
Nodes (26): CategoryDialogState, CategoryTile(), SECTIONS, CashflowChart(), CashflowPoint, CategoryMovers(), Mover, CategorySpendingMix() (+18 more)

### Community 15 - "round2"
Cohesion: 0.20
Nodes (26): PendingStatementConfirmationSheet(), RecordSearchSheet(), StatementSearchSheet(), AmountFilter(), AmountRange, COMPARISONS, describe(), Draft (+18 more)

### Community 16 - "compilerOptions"
Cohesion: 0.06
Nodes (33): compilerOptions, allowJs, allowSyntheticDefaultImports, allowUnusedLabels, esModuleInterop, forceConsistentCasingInFileNames, incremental, isolatedModules (+25 more)

### Community 17 - "data.ts"
Cohesion: 0.09
Nodes (23): AccountRow, AllocationRow, AnalyticsMonthRow, BudgetRecordRow, BudgetRow, DuplicateDismissalRow, MonthlyBudgetAmountRow, MonthlyBudgetDefaultRow (+15 more)

### Community 18 - "settings/page.tsx"
Cohesion: 0.26
Nodes (22): metadata, PrivacyPage(), SECTIONS, RecordPage(), learnedSignals(), SettingsPage(), StatementPage(), MethodHeader() (+14 more)

### Community 19 - "animations/editors.e2e.ts"
Cohesion: 0.14
Nodes (22): editors, denseCardConsumers, denseRowConsumers, expectConsumerEntrance(), populatedConsumers, chooseCategory(), attachSamplingFailure(), expectModalEntrance() (+14 more)

### Community 20 - "editors.ts"
Cohesion: 0.14
Nodes (19): containedFooter(), editors, longName, expectHeldRead(), expectRetainedRows(), expectSilentSheet(), expectVisibleBackdrop(), account (+11 more)

### Community 21 - "package.json"
Cohesion: 0.07
Nodes (29): private, $schema, type, babel-plugin-react-compiler, @biomejs/biome, clsx, cmdk, @fontsource-variable/inter (+21 more)

### Community 22 - "dependencies"
Cohesion: 0.07
Nodes (30): dependencies, @base-ui/react, class-variance-authority, clsx, cmdk, dexie, dexie-react-hooks, @fontsource-variable/inter (+22 more)

### Community 23 - "fixtures.ts"
Cohesion: 0.14
Nodes (18): cardTitles, card(), chartTooltip, overview, overviewCharts, themedRgb(), ScenarioName, WorkspaceDataset (+10 more)

### Community 24 - "importer/page.tsx"
Cohesion: 0.20
Nodes (25): ACCEPT, BANKS_REQUIRING_ADDITIONAL_INFO, ImporterPage(), Step(), BANKS, ensureAccount(), combine(), dbsDescriptionKey() (+17 more)

### Community 25 - "sync/page.tsx"
Cohesion: 0.15
Nodes (25): COUNT_ROWS, DataSettingsPage(), StateRow(), STATUS_TONES, StatusTone, WorkspaceRow(), clearAllData(), downloadExport() (+17 more)

### Community 26 - "suspicious"
Cohesion: 0.07
Nodes (28): suspicious, noAssignInExpressions, noAsyncPromiseExecutor, noCatchAssign, noClassAssign, noCompareNegZero, noControlCharactersInRegex, noDebugger (+20 more)

### Community 27 - "Validator"
Cohesion: 0.25
Nodes (18): updateAccount(), validateBudget(), cleanInput(), dismissDuplicatePair(), eligible(), fixDuplicates(), restoreDuplicatePair(), createMonthlyBudget() (+10 more)

### Community 28 - "combobox.tsx"
Cohesion: 0.13
Nodes (22): @base-ui/react, ComboboxField(), Props, AUTOPOPULATED_BORDER, Props, ComboboxChip(), ComboboxChips(), ComboboxChipsInput() (+14 more)

### Community 29 - "correctness"
Cohesion: 0.08
Nodes (26): noConstantCondition, noConstAssign, noEmptyCharacterClassInRegex, noEmptyPattern, noGlobalObjectCalls, noInvalidBuiltinInstantiation, noInvalidConstructorSuper, noNonoctalDecimalEscape (+18 more)

### Community 30 - "statements.ts"
Cohesion: 0.16
Nodes (24): asPending(), duplicateStatementIds(), dayDifference(), ensureCanReplace(), maskDescription(), ReplacementAllocation, replacementComparison(), replacementReason() (+16 more)

### Community 31 - "records.ts"
Cohesion: 0.14
Nodes (20): CategoryRow, RecordRow, canUseMonthlyBudget(), AllocationTally, isPendingRecord(), pendingStatementIds(), resolveRecordChoices(), analyticsValues() (+12 more)

### Community 32 - "README.md"
Cohesion: 0.08
Nodes (24): Allocate workspace, Allocations, Backup and restore, Categories, Custom-period Budgets, Demo data, Financial terms definitions, Finpoint (+16 more)

### Community 33 - "test-data.ts"
Cohesion: 0.13
Nodes (20): DEFAULT_CATEGORIES, DEFAULT_MONTHLY_BUDGETS, EXPORT_VERSION, FinpointExport, migrateRecordChoices(), SEED_HASH_KEY, BANK_BLURB, between() (+12 more)

### Community 34 - "components.json"
Cohesion: 0.09
Nodes (21): aliases, components, hooks, lib, ui, utils, iconLibrary, menuAccent (+13 more)

### Community 35 - "CONTEXT.md"
Cohesion: 0.12
Nodes (21): Account, Allocate, Budget, Category, Drill-down, Duplicate Statement, Irregular, Left over (+13 more)

### Community 36 - "core/components.e2e.ts"
Cohesion: 0.14
Nodes (10): desktopOnly, bounds(), contained(), expectWheelScrollsPageWhileOpen(), expectDropdownPreservesScroll(), expectPointerCursor(), scrollWithInput(), settledOverlayAlpha() (+2 more)

### Community 37 - "core/routes.e2e.ts"
Cohesion: 0.17
Nodes (14): @playwright/test, Child, october, september, PREMATURE, routeReady, titles, IDS (+6 more)

### Community 38 - "types.d.ts"
Cohesion: 0.10
Nodes (20): Account, Allocation, AnalyticsSummary, AnalyticsTreatment, Appearance, Budget, Category, CategoryWithChildren (+12 more)

### Community 39 - "command.tsx"
Cohesion: 0.21
Nodes (16): CategoryFilter(), CategoryFilterItem(), Command(), CommandEmpty(), CommandGroup(), CommandInput(), CommandItem(), CommandList() (+8 more)

### Community 40 - "budgets/[id]/page.tsx"
Cohesion: 0.24
Nodes (15): BudgetPage(), getBudgetAnalytics(), getCategoryData(), Legend(), BudgetProgressChart(), BudgetProgressPoint, buildSeries(), Sparkline() (+7 more)

### Community 41 - "statement-rules.ts"
Cohesion: 0.20
Nodes (14): byCreation(), conditionPattern(), deleteStatementRule(), listStatementRules(), matchesStatement(), NAME_ORDER, previewStatementRule(), recommendationAutofill() (+6 more)

### Community 42 - "auth-vault.ts"
Cohesion: 0.32
Nodes (13): POST(), POST(), POST(), AUTH_COOKIE_NAME, authCookie(), authCookieConfig(), clientIp(), encryptionKey() (+5 more)

### Community 43 - "STYLE.md"
Cohesion: 0.16
Nodes (14): Allocation, APIs, Arguments, And Props, Code Style, Consistency, Copy, Core, Earning Its Place, Finpoint Style Additions (+6 more)

### Community 44 - "use-appearance.tsx"
Cohesion: 0.24
Nodes (14): Appearance, applyAppearance(), getStoredAppearance(), handleSystemThemeChange(), initializeAppearance(), isDarkMode(), listeners, mediaQuery() (+6 more)

### Community 45 - "alert-dialog.tsx"
Cohesion: 0.34
Nodes (12): DriveOverwriteConfirmation(), AlertDialog(), AlertDialogAction(), AlertDialogCancel(), AlertDialogContent(), AlertDialogDescription(), AlertDialogFooter(), AlertDialogHeader() (+4 more)

### Community 46 - "duplicates.ts"
Cohesion: 0.22
Nodes (13): allocationOutcome(), descriptionAnchors(), descriptionIdentity(), DuplicateGroup, duplicateGroups(), DuplicateStatement, FixDuplicatesInput, GENERIC (+5 more)

### Community 47 - "UI layer"
Cohesion: 0.18
Nodes (10): app/**/page.tsx, Domain logic, Interactive routes are "use client" (search params via next/navigation), Pages take no props, Persistence, Root Suspense (keeps routes static), Static content pages (privacy, terms) are server components, UI layer (+2 more)

### Community 48 - "providers.tsx"
Cohesion: 0.26
Nodes (9): Boot(), seedIfEmpty(), useSyncToasts(), markDirty(), startAutoSync(), subscribeSyncEvents(), CategoryInput, listCategoryIconNames() (+1 more)

### Community 49 - "formatter"
Cohesion: 0.15
Nodes (13): arrowParentheses, bracketSameLine, bracketSpacing, jsxQuoteStyle, quoteProperties, quoteStyle, semicolons, trailingCommas (+5 more)

### Community 50 - "devDependencies"
Cohesion: 0.15
Nodes (13): devDependencies, babel-plugin-react-compiler, @biomejs/biome, fake-indexeddb, @playwright/test, @tailwindcss/postcss, @types/luxon, @types/node (+5 more)

### Community 51 - "category-history-chart.tsx"
Cohesion: 0.24
Nodes (12): aggregateSeries(), CategoryHistoryChart(), ChartMonth, ChartSeries, MonthBreakdown(), MonthTick(), monthTotal(), prepareMonths() (+4 more)

### Community 52 - "pagination.tsx"
Cohesion: 0.38
Nodes (11): pageHref(), pageWindow(), PaginationFooter(), Pagination(), PaginationContent(), PaginationEllipsis(), PaginationItem(), PaginationLink() (+3 more)

### Community 53 - "export-import.ts"
Cohesion: 0.29
Nodes (10): db, exportData(), monthlyBudgetFields(), TableName, TABLES, DEFAULT_SETTINGS, FinpointSettings, readSettings() (+2 more)

### Community 54 - "biome.json"
Cohesion: 0.18
Nodes (10): source, assist, actions, files, includes, linter, enabled, overrides (+2 more)

### Community 55 - "rules"
Cohesion: 0.18
Nodes (11): noAdjacentSpacesInRegex, noBannedTypes, noExtraBooleanCast, noUselessCatch, noUselessThisAlias, noUselessTypeConstraint, rules, noFloatingPromises (+3 more)

### Community 56 - "lucide-react"
Cohesion: 0.22
Nodes (9): lucide-react, ICONS, buttonVariants, ButtonVariant, Month, MonthCal(), MonthCalProps, MonthPicker() (+1 more)

### Community 57 - "src/data/* (persistence, migrations, seeding, backup serialization, Drive storage)"
Cohesion: 0.31
Nodes (8): Background Drive sync, bun test, src/data/* (persistence, migrations, seeding, backup serialization, Drive storage), IndexedDB (Dexie), Domain and importer tests (Dexie with in-memory IndexedDB), src/logic/* (domain reads and operations), Verification, Workspace backup/reset operations

### Community 58 - "manifest.json"
Cohesion: 0.20
Nodes (9): background_color, description, display, icons, name, scope, short_name, start_url (+1 more)

### Community 59 - "Next.js agent rules block ("This is NOT the Next.js you know")"
Cohesion: 0.25
Nodes (6): app/api/auth/* Route Handlers, node_modules/next/dist/server/lib/generate-agent-files.js, Google OAuth broker (exchange/token/logout), Next.js App Router app (mostly client-side), node_modules/next/dist/docs/, npm run dev (port 5173)

### Community 60 - "scripts"
Cohesion: 0.22
Nodes (9): scripts, build, dev, lint, lint:check, start, test:e2e, types:check (+1 more)

### Community 61 - "SidebarMenuButton"
Cohesion: 0.44
Nodes (7): DEFINITIONS, Term(), SidebarMenuButton(), sidebarMenuButtonVariants, Tooltip(), TooltipContent(), TooltipTrigger()

### Community 62 - "app/layout.tsx"
Cohesion: 0.25
Nodes (5): metadata, RootLayout(), viewport, react-dom, root

### Community 63 - "formatter"
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

### Community 68 - "tsconfig.e2e.json"
Cohesion: 0.29
Nodes (6): ./tsconfig.json, compilerOptions, incremental, exclude, extends, include

### Community 69 - "style"
Cohesion: 0.33
Nodes (6): style, noNamespace, noNonNullAssertion, useArrayLiterals, useAsConstAssertion, useBlockStatements

### Community 70 - "0002 Forecast pacing"
Cohesion: 0.33
Nodes (5): 0002 Forecast pacing, Consequences, Context, Decision, Rejected option

### Community 71 - "0001-drill-down-url-state.md"
Cohesion: 0.40
Nodes (4): Compare selection uses included comparison months and title-based uniqueness, Gross and net category selection URL, Comparison window, Drill-down URL state

### Community 72 - "src/components/*"
Cohesion: 0.40
Nodes (4): Agent Behavior, Generated / Ignored Files, src/components/*, src/components/ui/**/*

### Community 73 - "Validation rule (ValidationError + Validator)"
Cohesion: 0.50
Nodes (4): Old Laravel Api/*Controller mapping, Laravel-shaped { field: string[] } error maps, ValidationError, Validator

### Community 74 - "layer segregation (UI / logic / data)"
Cohesion: 0.60
Nodes (4): Dashboard month route-group shell, Project Shape, React Compiler (enabled), src/routes.ts (centralized route paths)

### Community 75 - "Finpoint icon concept"
Cohesion: 0.40
Nodes (5): Finpoint icon concept, Charcoal shadow halo, Circular point, Rounded F monogram, Off-white icon fill

### Community 76 - "Finpoint icon with charcoal shadow"
Cohesion: 0.40
Nodes (5): Finpoint icon with charcoal shadow, Charcoal shadow halo, Circular point, Rounded F monogram, Off-white icon fill

### Community 77 - "Issue tracker: Local Markdown"
Cohesion: 0.40
Nodes (4): Files, Issue tracker: Local Markdown, Skill operations, Status and dependencies

### Community 78 - "Finpoint"
Cohesion: 0.50
Nodes (4): Finpoint, Circular point, Rounded F monogram, Off-white icon fill

### Community 79 - "Domain docs"
Cohesion: 0.50
Nodes (3): Before exploration, Domain docs, Writing

### Community 80 - "Local Markdown Issue Tracker"
Cohesion: 0.50
Nodes (4): Local Tracker Operations, Spec and Ticket Files, Ticket Lifecycle, Local Markdown Issue Tracker

### Community 82 - "Dashboard"
Cohesion: 0.50
Nodes (4): Dashboard, Pending Record reasons visible before expansion, Statement pivot amount, account and timestamp, Statement titles open their funded Records

### Community 83 - "Forecast pacing decision"
Cohesion: 0.67
Nodes (3): Forecast pacing decision, Remaining historical spending scaled by remaining days, Median daily spending fallback including zero days

### Community 84 - "F monogram icon"
Cohesion: 0.67
Nodes (3): Circular dot beside F, Rounded F letterform, F monogram icon

### Community 85 - "JPG favicon icon"
Cohesion: 0.67
Nodes (3): JPG favicon dot, JPG favicon F letterform, JPG favicon icon

### Community 86 - "PNG favicon icon"
Cohesion: 0.67
Nodes (3): PNG favicon dot, PNG favicon F letterform, PNG favicon icon

### Community 87 - "SVG favicon icon"
Cohesion: 0.67
Nodes (3): SVG favicon dot, SVG favicon F letterform, SVG favicon icon

### Community 88 - "F monogram icon"
Cohesion: 0.67
Nodes (3): Circular dot beside F, Rounded F letterform, F monogram icon

### Community 89 - "F monogram icon"
Cohesion: 0.67
Nodes (3): Circular dot beside F, Rounded F letterform, F monogram icon

## Knowledge Gaps
- **125 isolated node(s):** `Build app step`, `Build harness step (tests/harness/vite.config.ts)`, `Playwright browser cache (keyed on bun.lock)`, `Graph health warnings and refresh failure reporting`, `gitmoji.dev` (+120 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 638 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **15 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `cn()` connect `cn` to `Button`, `duplicates/page.tsx`, `lib/motion.ts`, `utils.ts`, `primitives.tsx`, `(month)/page.tsx`, `app-sidebar.tsx`, `icon.tsx`, `round2`, `settings/page.tsx`, `importer/page.tsx`, `sync/page.tsx`, `combobox.tsx`, `command.tsx`, `budgets/[id]/page.tsx`, `alert-dialog.tsx`, `category-history-chart.tsx`, `pagination.tsx`, `lucide-react`, `SidebarMenuButton`?**
  _High betweenness centrality (0.092) - this node is a cross-community bridge._
- **What connects `Build app step`, `Build harness step (tests/harness/vite.config.ts)`, `Playwright browser cache (keyed on bun.lock)` to the rest of the system?**
  _125 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Button` be split into smaller, more focused modules?**
  _Cohesion score 0.07028697571743929 - nodes in this community are weakly interconnected._
- **Why does `src/data/* (persistence, migrations, seeding, backup serialization, Drive storage)` connect `src/data/* (persistence, migrations, seeding, backup serialization, Drive storage)` to `providers.tsx`, `layer segregation (UI / logic / data)`, `UI layer`?**
  _High betweenness centrality (0.066) - this node is a cross-community bridge._
- **Should `duplicates/page.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.08158131176999102 - nodes in this community are weakly interconnected._
- **Why does `react` connect `Button` to `duplicates/page.tsx`, `lib/motion.ts`, `utils.ts`, `primitives.tsx`, `(month)/page.tsx`, `cn`, `app-sidebar.tsx`, `icon.tsx`, `round2`, `settings/page.tsx`, `package.json`, `importer/page.tsx`, `sync/page.tsx`, `combobox.tsx`, `command.tsx`, `budgets/[id]/page.tsx`, `use-appearance.tsx`, `alert-dialog.tsx`, `providers.tsx`, `category-history-chart.tsx`, `pagination.tsx`, `lucide-react`, `SidebarMenuButton`, `app/layout.tsx`?**
  _High betweenness centrality (0.060) - this node is a cross-community bridge._
- **Should `lib/motion.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.07806841046277666 - nodes in this community are weakly interconnected._