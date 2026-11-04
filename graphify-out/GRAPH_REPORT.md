# Graph Report - t3-6da1f67d  (2026-11-04)

## Corpus Check
- 251 files · ~230,971 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 9 file(s) not represented in the graph (top: (none) 5, .example 1, .lock 1)

## Summary
- 1938 nodes · 7750 edges · 99 communities (88 shown, 11 thin omitted)
- Extraction: 98% EXTRACTED · 2% INFERRED · 0% AMBIGUOUS · INFERRED: 126 edges (avg confidence: 0.84)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `f877e844`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- cn
- budget-editor.tsx
- db.ts
- Tests README
- auto-sync.ts
- dashboard.ts
- primitives.tsx
- record-editor.tsx
- @playwright/test
- export-import.ts
- lib/motion.ts
- compilerOptions
- editors.ts
- app-sidebar.tsx
- Validator
- category.tsx
- dependencies
- data.ts
- statements.ts
- date-range.tsx
- Validation rule (ValidationError + Validator)
- records/[id]/page.tsx
- sync/page.tsx
- suspicious
- package.json
- ledger.e2e.ts
- correctness
- icon.tsx
- core/components.e2e.ts
- drive-sync.ts
- support/motion.ts
- core/routes.e2e.ts
- combobox.tsx
- UI layer (app pages + components)
- test-data.ts
- components.json
- fixtures.ts
- ui/field.tsx
- category-history-chart.tsx
- types.d.ts
- STYLE.md
- auth-vault.ts
- importer/page.tsx
- collectTests
- use-appearance.tsx
- duplicates.ts
- tests_support_fixtures_expect
- formatter
- devDependencies
- pagination.tsx
- records.ts
- Commands
- Next.js agent rules block ("This is NOT the Next.js you know")
- category-filter.tsx
- spending-calendar.tsx
- biome.json
- rules
- manifest.json
- providers.tsx
- scripts
- src/data/* (persistence, migrations, seeding, backup serialization, Drive storage)
- next
- formatter
- Records
- vite.config.ts
- Domain docs (single-context layout)
- optionalDependencies
- (month)/page.tsx
- tsconfig.e2e.json
- style
- Button
- src/components/*
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
- db
- monthpicker.tsx
- shared.ts
- workflows.e2e.ts
- trend-chart.tsx

## God Nodes (most connected - your core abstractions)
1. `cn()` - 324 edges
2. `PrimitivesSection()` - 180 edges
3. `Button()` - 126 edges
4. `react` - 97 edges
5. `formatCurrency()` - 74 edges
6. `RecordEditorDialog()` - 63 edges
7. `RecordCreatorDialog()` - 57 edges
8. `UiIcon()` - 56 edges
9. `round2()` - 45 edges
10. `next` - 43 edges

## Surprising Connections (you probably didn't know these)
- `Finpoint Style Additions` --references--> `useApiFormErrors()`  [INFERRED]
  STYLE.md → src/hooks/use-api-form-errors.ts
- `Copy` --references--> `pluralize()`  [INFERRED]
  STYLE.md → src/lib/utils.ts
- `Finpoint Style Additions` --references--> `ValidationError`  [INFERRED]
  STYLE.md → src/logic/validate.ts
- `SECTIONS` --calls--> `treatmentLabel()`  [EXTRACTED]
  app/categories/page.tsx → src/lib/analytics.ts
- `record()` --indirect_call--> `path()`  [INFERRED]
  tests/core/ledger.e2e.ts → src/components/charts/trend-chart.tsx

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

## Communities (99 total, 11 thin omitted)

### Community 0 - "cn"
Cohesion: 0.12
Nodes (32): AppearanceSwitch(), SidebarContent(), SidebarContext, SidebarContextProps, SidebarFooter(), SidebarGroup(), SidebarGroupAction(), SidebarGroupContent() (+24 more)

### Community 1 - "budget-editor.tsx"
Cohesion: 0.07
Nodes (103): BUDGET_STATES, BudgetCard(), BudgetsPage(), BudgetState, formatBudgetDateWindow(), MonthLayout(), react, react-day-picker (+95 more)

### Community 2 - "db.ts"
Cohesion: 0.11
Nodes (14): dexie, fake-indexeddb, xlsx, digestSnapshot(), hashLegacySnapshot(), Snapshot, input, legacyPaceKey (+6 more)

### Community 3 - "Tests README"
Cohesion: 0.06
Nodes (41): Build harness step (vite build tests/harness), Playwright browser cache keyed on bun.lock, blob report merge, Committed graph artifacts (graph.json, GRAPH_REPORT.md, manifest.json, .graphify_labels.json), Graph health warnings and refresh failure reporting, graphify-out/graph.json, graphify skill (--update), graphify update . (+33 more)

### Community 4 - "auto-sync.ts"
Cohesion: 0.13
Nodes (21): useSyncStatus(), emit(), eventListeners, finishCycle(), getSyncSnapshot(), markDirty(), refreshSyncDisplay(), refreshTimes() (+13 more)

### Community 5 - "dashboard.ts"
Cohesion: 0.12
Nodes (41): db, contribution(), summarize(), avg(), BREAKDOWN_MONTHS, buildCashflowHistory(), buildCategories(), buildComparison() (+33 more)

### Community 6 - "primitives.tsx"
Cohesion: 0.09
Nodes (47): AlertAction(), AlertDialogTrigger(), CardAction(), DropdownMenu(), DropdownMenuCheckboxItem(), DropdownMenuContent(), DropdownMenuGroup(), DropdownMenuItem() (+39 more)

### Community 7 - "record-editor.tsx"
Cohesion: 0.16
Nodes (37): AllocatorPendingPage(), CandidatePage, CandidateResults(), PendingCard(), @tanstack/react-form, RecordCreatorDialog(), RecordEditorDialog(), dateDifferenceLabel() (+29 more)

### Community 8 - "@playwright/test"
Cohesion: 0.23
Nodes (7): @playwright/test, cardTitles, card(), chartTooltip, overview, overviewCharts, themedRgb()

### Community 9 - "export-import.ts"
Cohesion: 0.17
Nodes (21): clearAllData(), downloadExport(), EXPORT_VERSION, exportData(), FinpointExport, importData(), monthlyBudgetFields(), parseImportFile() (+13 more)

### Community 10 - "lib/motion.ts"
Cohesion: 0.25
Nodes (23): @tanstack/react-table, DataTable(), PaginatedDataTable(), GroupHeaderRow(), groupStarts(), GroupTotal(), isInteractiveTarget(), MOBILE_LIST_CLASS (+15 more)

### Community 11 - "compilerOptions"
Cohesion: 0.06
Nodes (33): compilerOptions, allowJs, allowSyntheticDefaultImports, allowUnusedLabels, esModuleInterop, forceConsistentCasingInFileNames, incremental, isolatedModules (+25 more)

### Community 12 - "editors.ts"
Cohesion: 0.12
Nodes (22): editors, containedFooter(), editors, longName, expectHeldRead(), expectRetainedRows(), expectSilentSheet(), expectPointerCursor() (+14 more)

### Community 13 - "app-sidebar.tsx"
Cohesion: 0.17
Nodes (28): ReviewLinks(), NotFound(), Template(), AppearanceOption, APPEARANCES, AppSidebar(), SyncDot(), SYSTEM_APPEARANCE (+20 more)

### Community 14 - "Validator"
Cohesion: 0.23
Nodes (20): updateAccount(), validateBudget(), cleanInput(), dismissDuplicatePair(), eligible(), fixDuplicates(), restoreDuplicatePair(), amountFor() (+12 more)

### Community 15 - "category.tsx"
Cohesion: 0.18
Nodes (18): Rule, RuleSentence(), StatementRulesPage(), RecordAnalyticsFields(), ruleValueLabel(), RecordMonthlyBudget(), canUseDefaultMonthlyBudget(), canUseMonthlyBudget() (+10 more)

### Community 16 - "dependencies"
Cohesion: 0.07
Nodes (30): dependencies, @base-ui/react, class-variance-authority, clsx, cmdk, dexie, dexie-react-hooks, @fontsource-variable/inter (+22 more)

### Community 17 - "data.ts"
Cohesion: 0.10
Nodes (30): AccountRow, AllocationRow, AnalyticsMonthRow, BudgetRecordRow, BudgetRow, CategoryRow, DB_NAME, DB_VERSION (+22 more)

### Community 18 - "statements.ts"
Cohesion: 0.15
Nodes (25): asPending(), duplicateStatementIds(), removeStatementDismissals(), getRecord(), dayDifference(), ensureCanReplace(), maskDescription(), ReplacementAllocation (+17 more)

### Community 19 - "date-range.tsx"
Cohesion: 0.18
Nodes (30): CARD_MOTION, DuplicateGroupCard(), FixDuplicatesPage(), GroupHeader(), highlightDifferences(), VIEWS, ScopeSelect(), byRecordDay (+22 more)

### Community 20 - "Validation rule (ValidationError + Validator)"
Cohesion: 0.50
Nodes (4): Old Laravel Api/*Controller mapping, Laravel-shaped { field: string[] } error maps, ValidationError, Validator

### Community 21 - "records/[id]/page.tsx"
Cohesion: 0.25
Nodes (23): EmptyRecords(), metadata, PrivacyPage(), SECTIONS, RecordPage(), learnedSignals(), SettingsPage(), StatementPage() (+15 more)

### Community 22 - "sync/page.tsx"
Cohesion: 0.16
Nodes (24): COUNT_ROWS, DataSettingsPage(), StateRow(), STATUS_TONES, StatusTone, WorkspaceRow(), AlertDialog(), AlertDialogAction() (+16 more)

### Community 23 - "suspicious"
Cohesion: 0.07
Nodes (28): suspicious, noAssignInExpressions, noAsyncPromiseExecutor, noCatchAssign, noClassAssign, noCompareNegZero, noControlCharactersInRegex, noDebugger (+20 more)

### Community 24 - "package.json"
Cohesion: 0.07
Nodes (27): private, $schema, type, babel-plugin-react-compiler, @biomejs/biome, clsx, cmdk, @fontsource-variable/inter (+19 more)

### Community 25 - "ledger.e2e.ts"
Cohesion: 0.11
Nodes (24): behaviourCoverage, componentInventory, facetNotApplicable, InventoryEntry, notApplicable, openFacets, RouteEntry, routeInventory (+16 more)

### Community 26 - "correctness"
Cohesion: 0.08
Nodes (26): noConstantCondition, noConstAssign, noEmptyCharacterClassInRegex, noEmptyPattern, noGlobalObjectCalls, noInvalidBuiltinInstantiation, noInvalidConstructorSuper, noNonoctalDecimalEscape (+18 more)

### Community 27 - "icon.tsx"
Cohesion: 0.11
Nodes (30): allocatedStatements(), asOf(), byDate(), CHIP_LIMIT, CHOICES, Clue, DEFAULT_WEIGHTS, descriptionTokens() (+22 more)

### Community 28 - "core/components.e2e.ts"
Cohesion: 0.20
Nodes (7): bounds(), contained(), expectWheelScrollsPageWhileOpen(), expectDropdownPreservesScroll(), scrollWithInput(), settledOverlayAlpha(), IDS

### Community 29 - "drive-sync.ts"
Cohesion: 0.17
Nodes (31): AuthNeededError, cacheToken(), CodeResponse, disconnectDrive(), downloadBackupFile(), driveFetch(), DriveFileMeta, ensureDriveToken() (+23 more)

### Community 30 - "support/motion.ts"
Cohesion: 0.17
Nodes (18): denseCardConsumers, denseRowConsumers, expectConsumerEntrance(), populatedConsumers, attachSamplingFailure(), expectPopupEntrance(), expectReducedRowMovement(), expectVisibleRowCascade() (+10 more)

### Community 31 - "core/routes.e2e.ts"
Cohesion: 0.18
Nodes (13): Child, october, september, PREMATURE, routeReady, titles, installDateOnly(), revisions (+5 more)

### Community 32 - "combobox.tsx"
Cohesion: 0.14
Nodes (20): @base-ui/react, ComboboxField(), Props, ComboboxChip(), ComboboxChips(), ComboboxChipsInput(), ComboboxClear(), ComboboxCollection() (+12 more)

### Community 33 - "UI layer (app pages + components)"
Cohesion: 0.15
Nodes (17): app/**/page.tsx, Background Drive sync, src/data/* (persistence, migrations, seeding, backup serialization, Drive storage), IndexedDB (Dexie), Interactive routes are "use client" (search params via next/navigation), src/logic/* (domain reads and operations), (month) route-group shell (Overview + Monthly Records), Pages take no props (+9 more)

### Community 34 - "test-data.ts"
Cohesion: 0.16
Nodes (17): DEFAULT_CATEGORIES, DEFAULT_MONTHLY_BUDGETS, SEED_HASH_KEY, BANK_BLURB, between(), CATEGORIES, DAILY, generateTestData() (+9 more)

### Community 35 - "components.json"
Cohesion: 0.09
Nodes (21): aliases, components, hooks, lib, ui, utils, iconLibrary, menuAccent (+13 more)

### Community 36 - "fixtures.ts"
Cohesion: 0.23
Nodes (12): getScenario(), ScenarioName, WorkspaceDataset, WorkspaceTables, assertSeeded(), checkSeededMarker(), countStore(), seedInBrowser() (+4 more)

### Community 37 - "ui/field.tsx"
Cohesion: 0.22
Nodes (11): class-variance-authority, radix-ui, AppHeader(), ButtonGroup(), ButtonGroupSeparator(), ButtonGroupText(), buttonGroupVariants, FieldSeparator() (+3 more)

### Community 38 - "category-history-chart.tsx"
Cohesion: 0.10
Nodes (39): CategoriesPage(), CategoryDialogState, CategoryTile(), SECTIONS, InvestmentRow(), nextConfig, luxon, next (+31 more)

### Community 39 - "types.d.ts"
Cohesion: 0.10
Nodes (20): Account, Allocation, AnalyticsSummary, AnalyticsTreatment, Appearance, Budget, Category, CategoryWithChildren (+12 more)

### Community 40 - "STYLE.md"
Cohesion: 0.18
Nodes (16): CONTEXT.md (domain vocabulary), Account, Allocation, Budget, Category, Duplicate Statement, Finpoint Domain Glossary, Monthly Budget (+8 more)

### Community 41 - "auth-vault.ts"
Cohesion: 0.29
Nodes (14): POST(), POST(), POST(), jose, AUTH_COOKIE_NAME, authCookie(), authCookieConfig(), clientIp() (+6 more)

### Community 42 - "importer/page.tsx"
Cohesion: 0.20
Nodes (25): ACCEPT, BANKS_REQUIRING_ADDITIONAL_INFO, ImporterPage(), Step(), BANKS, ensureAccount(), combine(), dbsDescriptionKey() (+17 more)

### Community 43 - "collectTests"
Cohesion: 0.28
Nodes (16): collectTests(), conditionBranch(), detailsTags(), disabled(), mentionsMotion(), record(), splitTestCallee(), tagValues() (+8 more)

### Community 44 - "use-appearance.tsx"
Cohesion: 0.23
Nodes (25): AllocateBar(), StatementTile(), Amount(), StatementRow(), PendingStatementConfirmationSheet(), RecordOption(), RecordSearchSheet(), StatementOption() (+17 more)

### Community 45 - "duplicates.ts"
Cohesion: 0.24
Nodes (12): allocationOutcome(), descriptionAnchors(), descriptionIdentity(), DuplicateGroup, duplicateGroups(), DuplicateStatement, FixDuplicatesInput, GENERIC (+4 more)

### Community 47 - "formatter"
Cohesion: 0.15
Nodes (13): arrowParentheses, bracketSameLine, bracketSpacing, jsxQuoteStyle, quoteProperties, quoteStyle, semicolons, trailingCommas (+5 more)

### Community 48 - "devDependencies"
Cohesion: 0.15
Nodes (13): devDependencies, babel-plugin-react-compiler, @biomejs/biome, fake-indexeddb, @playwright/test, @tailwindcss/postcss, @types/luxon, @types/node (+5 more)

### Community 49 - "pagination.tsx"
Cohesion: 0.38
Nodes (11): pageHref(), pageWindow(), PaginationFooter(), Pagination(), PaginationContent(), PaginationEllipsis(), PaginationItem(), PaginationLink() (+3 more)

### Community 50 - "records.ts"
Cohesion: 0.11
Nodes (23): AnalyticsRecord, AnalyticsSummary, BudgetDetail, BudgetFilters, createBudget(), updateBudget(), analyticsValues(), budgetCovers() (+15 more)

### Community 51 - "Commands"
Cohesion: 0.20
Nodes (11): Agent Behavior, Biome (biome check --write), bun install, bun lint (write-mode), bun lint:check, bun run build, bun types:check, Commands (+3 more)

### Community 52 - "Next.js agent rules block ("This is NOT the Next.js you know")"
Cohesion: 0.18
Nodes (9): app/api/auth/* Route Handlers, bun test, node_modules/next/dist/server/lib/generate-agent-files.js, Google OAuth broker (exchange/token/logout), Domain and importer tests (Dexie with in-memory IndexedDB), Next.js App Router app (mostly client-side), node_modules/next/dist/docs/, npm run dev (port 5173) (+1 more)

### Community 53 - "category-filter.tsx"
Cohesion: 0.36
Nodes (10): CategoryFilter(), CategoryFilterItem(), Command(), CommandEmpty(), CommandGroup(), CommandInput(), CommandItem(), CommandList() (+2 more)

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

### Community 58 - "providers.tsx"
Cohesion: 0.12
Nodes (28): metadata, RootLayout(), viewport, Boot(), Providers(), @vercel/analytics, @vercel/speed-insights, normalize() (+20 more)

### Community 59 - "scripts"
Cohesion: 0.22
Nodes (9): scripts, build, dev, lint, lint:check, start, test:e2e, types:check (+1 more)

### Community 60 - "src/data/* (persistence, migrations, seeding, backup serialization, Drive storage)"
Cohesion: 0.12
Nodes (23): framer-motion, lucide-react, Sparkline(), DynamicUiIcon(), ICON_NAMES, iconNameSet, loadedIcons, loadIcon() (+15 more)

### Community 61 - "next"
Cohesion: 0.14
Nodes (26): BudgetPage(), getBudgetAnalytics(), getCategoryData(), Legend(), MonthlyRecordsPage(), BudgetProgressChart(), BudgetProgressPoint, buildSeries() (+18 more)

### Community 62 - "formatter"
Cohesion: 0.25
Nodes (8): formatter, attributePosition, enabled, formatWithErrors, indentStyle, indentWidth, lineEnding, lineWidth

### Community 63 - "Records"
Cohesion: 0.32
Nodes (8): Allocator, Budgets, Categories, Dashboard, Statement-allocation-record model, Monthly Budgets, Records, Statement importer

### Community 64 - "vite.config.ts"
Cohesion: 0.29
Nodes (4): vite, @vitejs/plugin-react, harnessDir, repoRoot

### Community 65 - "Domain docs (single-context layout)"
Cohesion: 0.33
Nodes (7): Agent skills, CONTEXT.md, Domain docs (single-context layout), Domain Language, Issue tracker (local specs and tickets), .scratch/ local work tracking, String primary keys (not auto-increment)

### Community 66 - "optionalDependencies"
Cohesion: 0.29
Nodes (7): optionalDependencies, lightningcss-linux-x64-gnu, lightningcss-win32-x64-msvc, @rollup/rollup-linux-x64-gnu, @rollup/rollup-win32-x64-msvc, @tailwindcss/oxide-linux-x64-gnu, @tailwindcss/oxide-win32-x64-msvc

### Community 67 - "(month)/page.tsx"
Cohesion: 0.13
Nodes (21): Comparison, comparisonRateText(), comparisonText(), ComparisonValue, DashboardData, DashboardMonthlyBudget, DashboardPage(), DashboardView (+13 more)

### Community 68 - "tsconfig.e2e.json"
Cohesion: 0.29
Nodes (6): ./tsconfig.json, compilerOptions, incremental, exclude, extends, include

### Community 69 - "style"
Cohesion: 0.33
Nodes (6): style, noNamespace, noNonNullAssertion, useArrayLiterals, useAsConstAssertion, useBlockStatements

### Community 70 - "Button"
Cohesion: 0.14
Nodes (36): AccountPage(), AccountCard(), AccountRow, AccountsPage(), AllocatorPage(), RecordsPage(), StatementsPage(), dexie-react-hooks (+28 more)

### Community 71 - "src/components/*"
Cohesion: 0.16
Nodes (18): AmountFilter(), AmountRange, COMPARISONS, describe(), Draft, readRange(), upperBound(), InputGroup() (+10 more)

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

### Community 94 - "db"
Cohesion: 0.26
Nodes (11): byCreation(), conditionPattern(), deleteStatementRule(), listStatementRules(), matchesStatement(), NAME_ORDER, previewStatementRule(), recommendationAutofill() (+3 more)

### Community 95 - "monthpicker.tsx"
Cohesion: 0.17
Nodes (13): APIs, Arguments, And Props, Code Style, Consistency, Copy, Core, Earning Its Place, Finpoint Style Additions, Grouping And Order (+5 more)

### Community 96 - "shared.ts"
Cohesion: 0.38
Nodes (3): desktopOnly, APP_URL, HARNESS_URL

### Community 100 - "trend-chart.tsx"
Cohesion: 0.16
Nodes (19): bar(), BarChart(), BarSeries, PAD, ChartFrame(), ChartSize, ReadoutRows(), arc() (+11 more)

## Knowledge Gaps
- **83 isolated node(s):** `@fontsource-variable/inter`, `shadcn`, `tailwindcss`, `tw-animate-css`, `@biomejs/biome` (+78 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 591 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **11 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `cn()` connect `cn` to `budget-editor.tsx`, `primitives.tsx`, `record-editor.tsx`, `lib/motion.ts`, `app-sidebar.tsx`, `category.tsx`, `date-range.tsx`, `records/[id]/page.tsx`, `sync/page.tsx`, `combobox.tsx`, `ui/field.tsx`, `category-history-chart.tsx`, `importer/page.tsx`, `use-appearance.tsx`, `pagination.tsx`, `category-filter.tsx`, `spending-calendar.tsx`, `src/data/* (persistence, migrations, seeding, backup serialization, Drive storage)`, `next`, `(month)/page.tsx`, `Button`, `src/components/*`, `trend-chart.tsx`?**
  _High betweenness centrality (0.081) - this node is a cross-community bridge._
- **What connects `@fontsource-variable/inter`, `shadcn`, `tailwindcss` to the rest of the system?**
  _83 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `cn` be split into smaller, more focused modules?**
  _Cohesion score 0.1226890756302521 - nodes in this community are weakly interconnected._
- **Why does `react` connect `budget-editor.tsx` to `cn`, `auto-sync.ts`, `primitives.tsx`, `record-editor.tsx`, `lib/motion.ts`, `app-sidebar.tsx`, `category.tsx`, `date-range.tsx`, `records/[id]/page.tsx`, `sync/page.tsx`, `package.json`, `combobox.tsx`, `ui/field.tsx`, `category-history-chart.tsx`, `importer/page.tsx`, `use-appearance.tsx`, `pagination.tsx`, `category-filter.tsx`, `spending-calendar.tsx`, `providers.tsx`, `src/data/* (persistence, migrations, seeding, backup serialization, Drive storage)`, `next`, `(month)/page.tsx`, `Button`, `src/components/*`, `trend-chart.tsx`?**
  _High betweenness centrality (0.075) - this node is a cross-community bridge._
- **Should `budget-editor.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.06744057490326147 - nodes in this community are weakly interconnected._
- **Why does `@playwright/test` connect `@playwright/test` to `shared.ts`, `workflows.e2e.ts`, `fixtures.ts`, `editors.ts`, `tests_support_fixtures_expect`, `package.json`, `ledger.e2e.ts`, `core/components.e2e.ts`, `support/motion.ts`, `core/routes.e2e.ts`?**
  _High betweenness centrality (0.066) - this node is a cross-community bridge._
- **Should `db.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.10837438423645321 - nodes in this community are weakly interconnected._