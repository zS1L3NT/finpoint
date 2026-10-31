# Graph Report - Finpoint  (2026-11-01)

## Corpus Check
- 262 files · ~206,865 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 1934 nodes · 7745 edges · 93 communities (82 shown, 11 thin omitted)
- Extraction: 98% EXTRACTED · 2% INFERRED · 0% AMBIGUOUS · INFERRED: 126 edges (avg confidence: 0.84)
- Token cost: unavailable (host agent semantic refresh; CLI structural refresh uses no model tokens)

## Community Hubs (Navigation)
- react
- lib/motion.ts
- next
- app-sidebar.tsx
- categories/page.tsx
- (month)/page.tsx
- data.ts
- Validator
- db.ts
- statements.ts
- category-history-chart.tsx
- ledger.e2e.ts
- suggestions.ts
- auto-sync.ts
- support/motion.ts
- core/routes.e2e.ts
- fixtures.ts
- export-import.ts
- test-data.ts
- amount-filter.tsx
- types.d.ts
- sidebar.tsx
- Button
- duplicates.ts
- category-filter.tsx
- trend-chart.tsx
- pagination.tsx
- dashboard.ts
- records.ts
- history.tsx
- sync/page.tsx
- providers.tsx
- importer/page.tsx
- lucide-react
- collectTests
- editors.ts
- spending-calendar.tsx
- core/components.e2e.ts
- auth-vault.ts
- tests_support_fixtures_expect
- primitives.tsx
- cn
- @playwright/test
- radix-ui
- workflows.e2e.ts
- Validation rule (ValidationError + Validator)
- Tests README
- src/data/* (persistence, migrations, seeding, backup serialization, Drive storage)
- Commands
- Next.js agent rules block ("This is NOT the Next.js you know")
- Domain docs (single-context layout)
- Conventions
- compilerOptions
- dependencies
- STYLE.md
- suspicious
- package.json
- correctness
- components.json
- vite.config.ts
- formatter
- devDependencies
- biome.json
- rules
- manifest.json
- scripts
- formatter
- optionalDependencies
- tsconfig.e2e.json
- style
- Issue tracker: Local Markdown
- Domain docs
- Records
- Finpoint icon concept
- Finpoint icon with charcoal shadow
- Finpoint
- Google Drive sync
- F monogram icon
- JPG favicon icon
- PNG favicon icon
- SVG favicon icon
- F monogram icon
- F monogram icon
- Finpoint app icon
- Unrestricted crawler policy
- Generated demo data
- Progressive Web Application
- Local Markdown Issue Tracker
- Domain Documentation Conflicts
- Monthly Budget

## God Nodes (most connected - your core abstractions)
1. `cn()` - 321 edges
2. `PrimitivesSection()` - 180 edges
3. `Button()` - 126 edges
4. `react` - 97 edges
5. `formatCurrency()` - 77 edges
6. `RecordEditorDialog()` - 63 edges
7. `RecordCreatorDialog()` - 57 edges
8. `UiIcon()` - 56 edges
9. `round2()` - 45 edges
10. `next` - 43 edges

## Surprising Connections (you probably didn't know these)
- `Finpoint Style Additions` --references--> `ValidationError`  [INFERRED]
  STYLE.md → src/logic/validate.ts
- `Finpoint Style Additions` --references--> `useApiFormErrors()`  [INFERRED]
  STYLE.md → src/hooks/use-api-form-errors.ts
- `Copy` --references--> `pluralize()`  [INFERRED]
  STYLE.md → src/lib/utils.ts
- `record()` --indirect_call--> `path()`  [INFERRED]
  tests/core/ledger.e2e.ts → src/components/charts/trend-chart.tsx
- `SECTIONS` --calls--> `treatmentLabel()`  [EXTRACTED]
  app/categories/page.tsx → src/lib/analytics.ts

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **Change-scoped required checks that always report** — github_workflows_ci_changes, github_workflows_ci_checks, github_workflows_ci_domain, github_workflows_ci_core, github_workflows_ci_animations [EXTRACTED 0.95]
- **Group matrix to gate and merged HTML report flow** — github_workflows_ci_core_group, github_workflows_ci_animations_group, github_workflows_ci_blob_report_merge, github_workflows_ci_core, github_workflows_ci_animations [EXTRACTED 0.95]
- **Test file to CI group membership enforced by the ledger** — tests_readme_behaviour_ledger, tests_readme_ci_groups, tests_readme_areas, github_workflows_ci_ci [EXTRACTED 0.95]
- **CI browser test pipeline: setup, grouped runs, gated report merge** — github_actions_setup_action_setup, github_workflows_ci_core_group, github_workflows_ci_animations_group, github_workflows_ci_core, github_workflows_ci_animations, _github_workflows_ci_blob_report_merge [EXTRACTED 1.00]
- **Change-scoped job skipping with required checks still reporting** — github_workflows_ci_changes, github_workflows_ci_checks, github_workflows_ci_domain, github_workflows_ci_core, github_workflows_ci_animations, github_workflows_ci_required_checks [EXTRACTED 1.00]
- **Test group to gate to merged report flow** — github_workflows_ci_core_group, github_workflows_ci_animations_group, github_workflows_ci_core, github_workflows_ci_animations, github_workflows_ci_blob_report_merge [EXTRACTED 1.00]
- **Every browser test file joins exactly one CI group, enforced by the ledger** — tests_readme_behaviour_ledger, tests_readme_ci_groups, github_workflows_ci_core_group, github_workflows_ci_animations_group, agents_verification_rules [INFERRED 0.95]

## Communities (93 total, 11 thin omitted)

### Community 1 - "react"
Cohesion: 0.07
Nodes (110): Rule, CategoryFormValues, PendingStatementValues, Rule, Props, Props, Props, FieldErrorItem (+102 more)

### Community 10 - "lib/motion.ts"
Cohesion: 0.10
Nodes (41): Delta, RowGroup, State, RowEntrance, HarnessSection, Sparkline(), Metric(), DataTable() (+33 more)

### Community 100 - "next"
Cohesion: 0.18
Nodes (20): CashflowPoint, MonthlyBudgetLine, SurplusPoint, SearchInit, CashflowHistoryMonth, MonthLayout(), InvestmentRow(), ReviewLinks() (+12 more)

### Community 13 - "app-sidebar.tsx"
Cohesion: 0.18
Nodes (27): AppearanceOption, Template(), AppSidebar(), SyncDot(), useSyncIndicator(), ShellHeader(), WorkflowTabs(), useDefaultFilterEndDateToday() (+19 more)

### Community 14 - "categories/page.tsx"
Cohesion: 0.26
Nodes (9): CategoryDialogState, Mover, CategoryTile(), CategoryMovers(), CategorySpendingMix(), MonthlyBudgetBadge(), themeColor(), SECTIONS (+1 more)

### Community 15 - "(month)/page.tsx"
Cohesion: 0.13
Nodes (23): Comparison, ComparisonValue, DashboardData, DashboardMonthlyBudget, DashboardView, PaceData, Projection, WeekdayBreakdown (+15 more)

### Community 17 - "data.ts"
Cohesion: 0.13
Nodes (22): AccountRow, AnalyticsMonthRow, BudgetRecordRow, BudgetRow, CategoryRow, DuplicateDismissalRow, MonthlyBudgetAmountRow, MonthlyBudgetDefaultRow (+14 more)

### Community 18 - "Validator"
Cohesion: 0.24
Nodes (19): Validator, updateAccount(), validateBudget(), cleanInput(), dismissDuplicatePair(), eligible(), fixDuplicates(), restoreDuplicatePair() (+11 more)

### Community 2 - "db.ts"
Cohesion: 0.10
Nodes (18): FinpointDB, MetaRow, RecordRow, SettingsRow, Snapshot, digestSnapshot(), hashLegacySnapshot(), hashSnapshot() (+10 more)

### Community 21 - "statements.ts"
Cohesion: 0.17
Nodes (22): ReplacementAllocation, ReplacementStatement, StatementDetail, StatementFilters, StatementInput, asPending(), duplicateStatementIds(), dayDifference() (+14 more)

### Community 22 - "category-history-chart.tsx"
Cohesion: 0.24
Nodes (12): ChartMonth, ChartSeries, SpendingSeries, SpendingHistoryMonth, aggregateSeries(), CategoryHistoryChart(), MonthBreakdown(), MonthTick() (+4 more)

### Community 25 - "ledger.e2e.ts"
Cohesion: 0.11
Nodes (24): InventoryEntry, RouteEntry, SelectionProject, TestSelection, admitsOpenFacets(), collectOpenFacets(), declaredTests(), files() (+16 more)

### Community 27 - "suggestions.ts"
Cohesion: 0.11
Nodes (31): AllocationRow, Clue, Evidence, Example, LearnedWeights, Model, RuleSuggestion, suggestionAccuracy (+23 more)

### Community 29 - "auto-sync.ts"
Cohesion: 0.11
Nodes (48): AuthNeededError, CodeResponse, DriveFileMeta, Window, SyncActivity, SyncEvent, SyncKind, driveStatus (+40 more)

### Community 30 - "support/motion.ts"
Cohesion: 0.17
Nodes (18): MotionFrame, MotionPose, RowAnimationSample, MotionConsumer, expectConsumerEntrance(), attachSamplingFailure(), expectPopupEntrance(), expectReducedRowMovement() (+10 more)

### Community 31 - "core/routes.e2e.ts"
Cohesion: 0.15
Nodes (16): Child, containedFooter(), expectPointerCursor(), installDateOnly(), setDateOnly(), fits(), patchRows(), statementRow() (+8 more)

### Community 32 - "fixtures.ts"
Cohesion: 0.24
Nodes (11): ScenarioName, WorkspaceDataset, WorkspaceTables, WorkspaceFixtures, assertSeeded(), checkSeededMarker(), countStore(), seedInBrowser() (+3 more)

### Community 34 - "export-import.ts"
Cohesion: 0.16
Nodes (22): TableName, FinpointSettings, withoutActionModes(), clearAllData(), downloadExport(), exportData(), importData(), parseImportFile() (+14 more)

### Community 36 - "test-data.ts"
Cohesion: 0.16
Nodes (16): FinpointExport, Meal, between(), generateTestData(), pad(), pick(), stamp(), DEFAULT_CATEGORIES (+8 more)

### Community 38 - "amount-filter.tsx"
Cohesion: 0.24
Nodes (22): AmountRange, Draft, PendingStatementConfirmationSheet(), RecordSearchSheet(), StatementSearchSheet(), AmountFilter(), describe(), readRange() (+14 more)

### Community 39 - "types.d.ts"
Cohesion: 0.11
Nodes (18): Account, Allocation, AnalyticsSummary, AnalyticsTreatment, Appearance, Budget, Category, CategoryWithChildren (+10 more)

### Community 4 - "sidebar.tsx"
Cohesion: 0.08
Nodes (32): SidebarContextProps, AppearanceSwitch(), SidebarContent(), SidebarFooter(), SidebarGroup(), SidebarGroupAction(), SidebarGroupContent(), SidebarGroupLabel() (+24 more)

### Community 42 - "Button"
Cohesion: 0.05
Nodes (174): AccountRow, CandidatePage, BudgetState, Filters, BudgetProgressPoint, ReplacementReview, ReviewAllocation, DateRangeValue (+166 more)

### Community 43 - "duplicates.ts"
Cohesion: 0.22
Nodes (13): DuplicateGroup, DuplicateStatement, FixDuplicatesInput, allocationOutcome(), descriptionAnchors(), descriptionIdentity(), duplicateGroups(), pairIds() (+5 more)

### Community 44 - "category-filter.tsx"
Cohesion: 0.20
Nodes (18): Props, DateField(), CategoryFilter(), CategoryFilterItem(), Command(), CommandEmpty(), CommandGroup(), CommandInput() (+10 more)

### Community 45 - "trend-chart.tsx"
Cohesion: 0.15
Nodes (20): BarSeries, ChartSize, MonthlyBudgetUsageItem, TrendSeries, bar(), BarChart(), ChartFrame(), ReadoutRows() (+12 more)

### Community 49 - "pagination.tsx"
Cohesion: 0.38
Nodes (11): PaginationLinkProps, pageHref(), pageWindow(), PaginationFooter(), Pagination(), PaginationContent(), PaginationEllipsis(), PaginationItem() (+3 more)

### Community 5 - "dashboard.ts"
Cohesion: 0.11
Nodes (41): AnalyticsRecord, AnalyticsSummary, DashboardInput, LoadedTables, TrendMonth, MonthlyFilters, contribution(), summarize() (+33 more)

### Community 50 - "records.ts"
Cohesion: 0.10
Nodes (31): BudgetDetail, BudgetFilters, CategoryInput, AllocationTally, ConflictError, RecordDetail, RecordFilters, RecordInput (+23 more)

### Community 54 - "history.tsx"
Cohesion: 0.39
Nodes (7): HistoryItem, getStoredHistory(), getValidHistory(), HistoryProvider(), normaliseUrl(), withoutTrailingSelf(), HistoryContext

### Community 60 - "sync/page.tsx"
Cohesion: 0.13
Nodes (28): StatusTone, SyncSnapshot, DataSettingsPage(), StateRow(), WorkspaceRow(), AlertDialog(), AlertDialogAction(), AlertDialogCancel() (+20 more)

### Community 7 - "providers.tsx"
Cohesion: 0.14
Nodes (23): Appearance, ResolvedAppearance, RootLayout(), Boot(), Providers(), Toaster(), applyAppearance(), getStoredAppearance() (+15 more)

### Community 9 - "importer/page.tsx"
Cohesion: 0.20
Nodes (25): ImportResult, Parsed, Row, ValidationError, ImporterPage(), Step(), ensureAccount(), combine() (+17 more)

### Community 98 - "lucide-react"
Cohesion: 0.22
Nodes (11): ButtonVariant, Month, MonthCalProps, Calendar(), CalendarDayButton(), MonthCal(), MonthPicker(), buttonVariants (+3 more)

### Community 0 - "collectTests"
Cohesion: 0.28
Nodes (16): collectTests(), conditionBranch(), detailsTags(), disabled(), mentionsMotion(), record(), splitTestCallee(), tagValues() (+8 more)

### Community 12 - "editors.ts"
Cohesion: 0.13
Nodes (20): expectHeldRead(), expectRetainedRows(), expectSilentSheet(), expectVisibleBackdrop(), chooseCategory(), openEditor(), pickOption(), select() (+12 more)

### Community 19 - "spending-calendar.tsx"
Cohesion: 0.29
Nodes (9): compact(), heat(), quantile(), rampCap(), SpendingCalendar(), INK, LEVELS, STRENGTH (+1 more)

### Community 28 - "core/components.e2e.ts"
Cohesion: 0.15
Nodes (9): bounds(), contained(), expectWheelScrollsPageWhileOpen(), expectDropdownPreservesScroll(), scrollWithInput(), settledOverlayAlpha(), desktopOnly, APP_URL (+1 more)

### Community 41 - "auth-vault.ts"
Cohesion: 0.29
Nodes (14): POST(), POST(), POST(), authCookie(), authCookieConfig(), clientIp(), encryptionKey(), rateLimit() (+6 more)

### Community 6 - "primitives.tsx"
Cohesion: 0.10
Nodes (45): AlertAction(), AlertDialogTrigger(), ComboboxCollection(), ComboboxValue(), DropdownMenu(), DropdownMenuCheckboxItem(), DropdownMenuContent(), DropdownMenuGroup() (+37 more)

### Community 64 - "cn"
Cohesion: 0.17
Nodes (24): ComboboxChip(), ComboboxChips(), ComboboxChipsInput(), ComboboxClear(), ComboboxContent(), ComboboxEmpty(), ComboboxGroup(), ComboboxInput() (+16 more)

### Community 8 - "@playwright/test"
Cohesion: 0.23
Nodes (7): card(), themedRgb(), cardTitles, chartTooltip, overview, overviewCharts, @playwright/test

### Community 95 - "radix-ui"
Cohesion: 0.24
Nodes (10): AppHeader(), ButtonGroup(), ButtonGroupSeparator(), ButtonGroupText(), FieldSeparator(), Separator(), SidebarSeparator(), SidebarTrigger() (+2 more)

### Community 102 - "Validation rule (ValidationError + Validator)"
Cohesion: 0.50
Nodes (4): ValidationError, Validator, Old Laravel Api/*Controller mapping, Laravel-shaped { field: string[] } error maps

### Community 3 - "Tests README"
Cohesion: 0.06
Nodes (41): graphify-out/graph.json, graphify skill (--update), graphify update ., Build app step, Build harness step (tests/harness/vite.config.ts), Playwright browser cache (keyed on bun.lock), setup composite action, animations gate job (+33 more)

### Community 33 - "src/data/* (persistence, migrations, seeding, backup serialization, Drive storage)"
Cohesion: 0.15
Nodes (17): app/**/page.tsx, src/data/* (persistence, migrations, seeding, backup serialization, Drive storage), IndexedDB (Dexie), src/logic/* (domain reads and operations), src/routes.ts (centralized route paths), useLiveQuery, Background Drive sync, Interactive routes are "use client" (search params via next/navigation) (+9 more)

### Community 51 - "Commands"
Cohesion: 0.20
Nodes (11): Biome (biome check --write), bun install, bun lint (write-mode), bun lint:check, bun run build, bun types:check, src/components/*, src/components/ui/**/* (+3 more)

### Community 52 - "Next.js agent rules block ("This is NOT the Next.js you know")"
Cohesion: 0.18
Nodes (9): app/api/auth/* Route Handlers, bun test, node_modules/next/dist/server/lib/generate-agent-files.js, npm run dev (port 5173), Google OAuth broker (exchange/token/logout), Domain and importer tests (Dexie with in-memory IndexedDB), Next.js App Router app (mostly client-side), Verification (+1 more)

### Community 65 - "Domain docs (single-context layout)"
Cohesion: 0.33
Nodes (7): Agent skills, Domain docs (single-context layout), Domain Language, Issue tracker (local specs and tickets), .scratch/ local work tracking, String primary keys (not auto-increment), CONTEXT.md

### Community 11 - "compilerOptions"
Cohesion: 0.06
Nodes (33): compilerOptions, allowJs, allowSyntheticDefaultImports, allowUnusedLabels, esModuleInterop, forceConsistentCasingInFileNames, incremental, isolatedModules (+25 more)

### Community 16 - "dependencies"
Cohesion: 0.07
Nodes (30): dependencies, @base-ui/react, class-variance-authority, clsx, cmdk, dexie, dexie-react-hooks, @fontsource-variable/inter (+22 more)

### Community 20 - "STYLE.md"
Cohesion: 0.17
Nodes (13): APIs, Arguments, And Props, Code Style, Consistency, Copy, Core, Earning Its Place, Finpoint Style Additions, Grouping And Order (+5 more)

### Community 23 - "suspicious"
Cohesion: 0.07
Nodes (28): suspicious, noAssignInExpressions, noAsyncPromiseExecutor, noCatchAssign, noClassAssign, noCompareNegZero, noControlCharactersInRegex, noDebugger (+20 more)

### Community 24 - "package.json"
Cohesion: 0.07
Nodes (29): private, $schema, type, babel-plugin-react-compiler, @biomejs/biome, clsx, cmdk, @fontsource-variable/inter (+21 more)

### Community 26 - "correctness"
Cohesion: 0.08
Nodes (26): noConstantCondition, noConstAssign, noEmptyCharacterClassInRegex, noEmptyPattern, noGlobalObjectCalls, noInvalidBuiltinInstantiation, noInvalidConstructorSuper, noNonoctalDecimalEscape (+18 more)

### Community 35 - "components.json"
Cohesion: 0.09
Nodes (21): aliases, components, hooks, lib, ui, utils, iconLibrary, menuAccent (+13 more)

### Community 37 - "vite.config.ts"
Cohesion: 0.29
Nodes (4): harnessDir, repoRoot, vite, @vitejs/plugin-react

### Community 47 - "formatter"
Cohesion: 0.15
Nodes (13): arrowParentheses, bracketSameLine, bracketSpacing, jsxQuoteStyle, quoteProperties, quoteStyle, semicolons, trailingCommas (+5 more)

### Community 48 - "devDependencies"
Cohesion: 0.15
Nodes (13): devDependencies, babel-plugin-react-compiler, @biomejs/biome, fake-indexeddb, @playwright/test, @tailwindcss/postcss, @types/luxon, @types/node (+5 more)

### Community 55 - "biome.json"
Cohesion: 0.18
Nodes (10): source, assist, actions, files, includes, linter, enabled, overrides (+2 more)

### Community 56 - "rules"
Cohesion: 0.18
Nodes (11): noAdjacentSpacesInRegex, noBannedTypes, noExtraBooleanCast, noUselessCatch, noUselessThisAlias, noUselessTypeConstraint, rules, noFloatingPromises (+3 more)

### Community 57 - "manifest.json"
Cohesion: 0.20
Nodes (9): background_color, description, display, icons, name, scope, short_name, start_url (+1 more)

### Community 59 - "scripts"
Cohesion: 0.22
Nodes (9): scripts, build, dev, lint, lint:check, start, test:e2e, types:check (+1 more)

### Community 62 - "formatter"
Cohesion: 0.25
Nodes (8): formatter, attributePosition, enabled, formatWithErrors, indentStyle, indentWidth, lineEnding, lineWidth

### Community 66 - "optionalDependencies"
Cohesion: 0.29
Nodes (7): optionalDependencies, lightningcss-linux-x64-gnu, lightningcss-win32-x64-msvc, @rollup/rollup-linux-x64-gnu, @rollup/rollup-win32-x64-msvc, @tailwindcss/oxide-linux-x64-gnu, @tailwindcss/oxide-win32-x64-msvc

### Community 68 - "tsconfig.e2e.json"
Cohesion: 0.29
Nodes (6): compilerOptions, incremental, exclude, extends, include, ./tsconfig.json

### Community 69 - "style"
Cohesion: 0.33
Nodes (6): style, noNamespace, noNonNullAssertion, useArrayLiterals, useAsConstAssertion, useBlockStatements

### Community 74 - "Issue tracker: Local Markdown"
Cohesion: 0.40
Nodes (4): Files, Issue tracker: Local Markdown, Skill operations, Status and dependencies

### Community 76 - "Domain docs"
Cohesion: 0.50
Nodes (3): Before exploration, Domain docs, Writing

### Community 63 - "Records"
Cohesion: 0.32
Nodes (8): Allocator, Budgets, Categories, Dashboard, Statement-allocation-record model, Monthly Budgets, Records, Statement importer

### Community 72 - "Finpoint icon concept"
Cohesion: 0.40
Nodes (5): Charcoal shadow halo, Circular point, Rounded F monogram, Off-white icon fill, Finpoint icon concept

### Community 73 - "Finpoint icon with charcoal shadow"
Cohesion: 0.40
Nodes (5): Charcoal shadow halo, Circular point, Rounded F monogram, Off-white icon fill, Finpoint icon with charcoal shadow

### Community 75 - "Finpoint"
Cohesion: 0.50
Nodes (4): Circular point, Rounded F monogram, Off-white icon fill, Finpoint

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

### Community 77 - "Local Markdown Issue Tracker"
Cohesion: 0.50
Nodes (4): Spec and Ticket Files, Local Tracker Operations, Ticket Lifecycle, Local Markdown Issue Tracker

### Community 40 - "Monthly Budget"
Cohesion: 0.18
Nodes (16): Monthly Budget amount, Finpoint Domain Glossary, Account, Allocation, Budget, Category, Duplicate Statement, Monthly Budget (+8 more)

## Knowledge Gaps
- **83 isolated node(s):** `Build app step`, `Build harness step (tests/harness/vite.config.ts)`, `Playwright browser cache (keyed on bun.lock)`, `Graph health warnings and refresh failure reporting`, `gitmoji.dev` (+78 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 589 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **11 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `cn()` connect `cn` to `react`, `lucide-react`, `next`, `sidebar.tsx`, `amount-filter.tsx`, `primitives.tsx`, `importer/page.tsx`, `Button`, `lib/motion.ts`, `category-filter.tsx`, `trend-chart.tsx`, `categories/page.tsx`, `(month)/page.tsx`, `app-sidebar.tsx`, `pagination.tsx`, `spending-calendar.tsx`, `sync/page.tsx`, `radix-ui`?**
  _High betweenness centrality (0.094) - this node is a cross-community bridge._
- **What connects `Build app step`, `Build harness step (tests/harness/vite.config.ts)`, `Playwright browser cache (keyed on bun.lock)` to the rest of the system?**
  _83 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `react` be split into smaller, more focused modules?**
  _Cohesion score 0.06800766283524905 - nodes in this community are weakly interconnected._
- **Why does `react` connect `react` to `sidebar.tsx`, `primitives.tsx`, `providers.tsx`, `importer/page.tsx`, `lib/motion.ts`, `app-sidebar.tsx`, `categories/page.tsx`, `(month)/page.tsx`, `spending-calendar.tsx`, `category-history-chart.tsx`, `package.json`, `amount-filter.tsx`, `Button`, `category-filter.tsx`, `trend-chart.tsx`, `pagination.tsx`, `history.tsx`, `sync/page.tsx`, `cn`, `radix-ui`, `lucide-react`, `next`?**
  _High betweenness centrality (0.062) - this node is a cross-community bridge._
- **Should `lib/motion.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.10087719298245613 - nodes in this community are weakly interconnected._
- **Why does `src/data/* (persistence, migrations, seeding, backup serialization, Drive storage)` connect `src/data/* (persistence, migrations, seeding, backup serialization, Drive storage)` to `providers.tsx`?**
  _High betweenness centrality (0.055) - this node is a cross-community bridge._
- **Should `(month)/page.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.13230769230769232 - nodes in this community are weakly interconnected._