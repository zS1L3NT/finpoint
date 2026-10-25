# Graph Report - t3-d36465d2  (2026-10-26)

## Corpus Check
- 243 files · ~217,635 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 9 file(s) not represented in the graph (top: (none) 5, .example 1, .lock 1)

## Summary
- 1899 nodes · 7651 edges · 91 communities (79 shown, 12 thin omitted)
- Extraction: 98% EXTRACTED · 2% INFERRED · 0% AMBIGUOUS · INFERRED: 126 edges (avg confidence: 0.84)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `7419c4d0`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- duplicates/page.tsx
- Button
- formatCurrency
- Tests README
- primitives.tsx
- dashboard.ts
- cn
- providers.tsx
- @playwright/test
- total-spending-chart.tsx
- budgets/page.tsx
- compilerOptions
- editors.ts
- fixtures.ts
- amount-filter.tsx
- (month)/page.tsx
- dependencies
- db.ts
- Validator
- records.ts
- utils.ts
- statements.ts
- ValidationError
- suspicious
- package.json
- ledger.e2e.ts
- correctness
- icon.tsx
- core/components.e2e.ts
- combobox.tsx
- animations/tables.e2e.ts
- mobile-tab-bar.tsx
- drive-sync.ts
- src/data/* (persistence, migrations, seeding, backup serialization, Drive storage)
- export-import.ts
- components.json
- shared.ts
- app-sidebar.tsx
- auto-sync.ts
- types.d.ts
- Monthly Budget
- auth-vault.ts
- monthpicker.tsx
- main.tsx
- STYLE.md
- google-drive.ts
- formatter
- devDependencies
- pagination.tsx
- duplicates.ts
- Commands
- Next.js agent rules block ("This is NOT the Next.js you know")
- core/routes.e2e.ts
- biome.json
- rules
- manifest.json
- workflows.e2e.ts
- scripts
- (month)/layout.tsx
- next
- formatter
- Records
- tests_support_fixtures_expect
- Domain docs (single-context layout)
- optionalDependencies
- tsconfig.e2e.json
- style
- snapshot-hash.ts
- Validation rule (ValidationError + Validator)
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

## God Nodes (most connected - your core abstractions)
1. `cn()` - 322 edges
2. `PrimitivesSection()` - 184 edges
3. `Button()` - 126 edges
4. `react` - 97 edges
5. `formatCurrency()` - 81 edges
6. `RecordEditorDialog()` - 63 edges
7. `UiIcon()` - 57 edges
8. `RecordCreatorDialog()` - 52 edges
9. `round2()` - 44 edges
10. `next` - 42 edges

## Surprising Connections (you probably didn't know these)
- `Finpoint Style Additions` --references--> `useApiFormErrors()`  [INFERRED]
  STYLE.md → src/hooks/use-api-form-errors.ts
- `Copy` --references--> `pluralize()`  [INFERRED]
  STYLE.md → src/lib/utils.ts
- `Finpoint Style Additions` --references--> `ValidationError`  [INFERRED]
  STYLE.md → src/logic/validate.ts
- `BudgetState` --calls--> `parseDate()`  [EXTRACTED]
  app/budgets/page.tsx → src/lib/utils.ts
- `Boot()` --indirect_call--> `preloadCategoryIcons()`  [INFERRED]
  app/providers.tsx → src/components/icon.tsx

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

## Communities (91 total, 12 thin omitted)

### Community 0 - "duplicates/page.tsx"
Cohesion: 0.11
Nodes (58): AccountPage(), AccountCard(), AccountRow, AccountsPage(), CARD_MOTION, DuplicateGroupCard(), FixDuplicatesPage(), GroupHeader() (+50 more)

### Community 1 - "Button"
Cohesion: 0.06
Nodes (140): AllocatorPendingPage(), CandidatePage, CandidateResults(), CategoriesPage(), CategoryDialogState, CategoryTile(), SECTIONS, RecordCreatorHost() (+132 more)

### Community 2 - "formatCurrency"
Cohesion: 0.06
Nodes (107): PendingCard(), BudgetPage(), getBudgetAnalytics(), getCategoryData(), Legend(), ACCEPT, BANKS_REQUIRING_ADDITIONAL_INFO, ImporterPage() (+99 more)

### Community 3 - "Tests README"
Cohesion: 0.06
Nodes (41): Build harness step (vite build tests/harness), Playwright browser cache keyed on bun.lock, blob report merge, Committed graph artifacts (graph.json, GRAPH_REPORT.md, manifest.json, .graphify_labels.json), Graph health warnings and refresh failure reporting, graphify-out/graph.json, graphify skill (--update), graphify update . (+33 more)

### Community 4 - "primitives.tsx"
Cohesion: 0.09
Nodes (46): AlertAction(), AlertDialogTrigger(), DropdownMenu(), DropdownMenuCheckboxItem(), DropdownMenuContent(), DropdownMenuGroup(), DropdownMenuItem(), DropdownMenuLabel() (+38 more)

### Community 5 - "dashboard.ts"
Cohesion: 0.12
Nodes (38): AnalyticsRecord, AnalyticsSummary, contribution(), summarize(), avg(), buildCashflowHistory(), buildCategories(), buildComparison() (+30 more)

### Community 6 - "cn"
Cohesion: 0.10
Nodes (41): radix-ui, AppHeader(), AppearanceSwitch(), ButtonGroup(), ButtonGroupSeparator(), ButtonGroupText(), buttonGroupVariants, FieldSeparator() (+33 more)

### Community 7 - "providers.tsx"
Cohesion: 0.14
Nodes (24): metadata, RootLayout(), viewport, Boot(), Providers(), ShellHeader(), Toaster(), Appearance (+16 more)

### Community 8 - "@playwright/test"
Cohesion: 0.17
Nodes (12): @playwright/test, cardTitles, Child, october, september, card(), overview, overviewCharts (+4 more)

### Community 9 - "total-spending-chart.tsx"
Cohesion: 0.07
Nodes (61): recharts, BudgetActiveDot(), BudgetProgressChart(), BudgetProgressPoint, buildSeries(), colorChange(), CashflowChart(), CashflowPoint (+53 more)

### Community 10 - "budgets/page.tsx"
Cohesion: 0.13
Nodes (37): BUDGET_STATES, BudgetCard(), BudgetsPage(), BudgetState, formatBudgetDateWindow(), framer-motion, @tanstack/react-table, DataTable() (+29 more)

### Community 11 - "compilerOptions"
Cohesion: 0.06
Nodes (33): compilerOptions, allowJs, allowSyntheticDefaultImports, allowUnusedLabels, esModuleInterop, forceConsistentCasingInFileNames, incremental, isolatedModules (+25 more)

### Community 12 - "editors.ts"
Cohesion: 0.12
Nodes (22): editors, containedFooter(), editors, longName, expectHeldRead(), expectRetainedRows(), expectSilentSheet(), expectPointerCursor() (+14 more)

### Community 13 - "fixtures.ts"
Cohesion: 0.18
Nodes (15): buildEmpty(), buildPopulated(), emptyTables(), getScenario(), ScenarioName, WorkspaceDataset, WorkspaceTables, assertSeeded() (+7 more)

### Community 14 - "amount-filter.tsx"
Cohesion: 0.23
Nodes (23): PendingStatementConfirmationSheet(), RecordSearchSheet(), StatementSearchSheet(), AmountFilter(), AmountRange, COMPARISONS, describe(), Draft (+15 more)

### Community 15 - "(month)/page.tsx"
Cohesion: 0.13
Nodes (20): Comparison, comparisonRateText(), comparisonText(), ComparisonValue, DashboardData, DashboardMonthlyBudget, DashboardView, deltaOf() (+12 more)

### Community 16 - "dependencies"
Cohesion: 0.07
Nodes (30): dependencies, @base-ui/react, class-variance-authority, clsx, cmdk, dexie, dexie-react-hooks, @fontsource-variable/inter (+22 more)

### Community 17 - "db.ts"
Cohesion: 0.08
Nodes (26): dexie, fake-indexeddb, xlsx, AccountRow, AllocationRow, AnalyticsMonthRow, BudgetRecordRow, BudgetRow (+18 more)

### Community 18 - "Validator"
Cohesion: 0.23
Nodes (20): updateAccount(), createBudget(), validateBudget(), cleanInput(), fixDuplicates(), restoreDuplicatePair(), createMonthlyBudget(), MONTHLY_BUDGET_GROUPS (+12 more)

### Community 19 - "records.ts"
Cohesion: 0.14
Nodes (17): db, getMonthlyRecords(), MonthlyFilters, expandCategoryIdsForMonthly(), analyticsValues(), budgetCovers(), ConflictError, createRecord() (+9 more)

### Community 20 - "utils.ts"
Cohesion: 0.13
Nodes (30): lucide-react, react-day-picker, DateField(), Props, DateRange(), DateRangeValue, formatRange(), Props (+22 more)

### Community 21 - "statements.ts"
Cohesion: 0.15
Nodes (26): countSuggestions(), asPending(), removeStatementDismissals(), dayDifference(), ensureCanReplace(), maskDescription(), ReplacementAllocation, replacementComparison() (+18 more)

### Community 22 - "ValidationError"
Cohesion: 0.26
Nodes (20): ensureAccount(), combine(), dbsDescriptionKey(), debitCreditAmount(), descriptionKey(), importDbs(), importFiles(), importOcbc() (+12 more)

### Community 23 - "suspicious"
Cohesion: 0.07
Nodes (28): suspicious, noAssignInExpressions, noAsyncPromiseExecutor, noCatchAssign, noClassAssign, noCompareNegZero, noControlCharactersInRegex, noDebugger (+20 more)

### Community 24 - "package.json"
Cohesion: 0.07
Nodes (27): private, $schema, type, babel-plugin-react-compiler, @biomejs/biome, clsx, cmdk, @fontsource-variable/inter (+19 more)

### Community 25 - "ledger.e2e.ts"
Cohesion: 0.07
Nodes (45): typescript, vite, @vitejs/plugin-react, behaviourCoverage, componentInventory, facetNotApplicable, InventoryEntry, notApplicable (+37 more)

### Community 26 - "correctness"
Cohesion: 0.08
Nodes (26): noConstantCondition, noConstAssign, noEmptyCharacterClassInRegex, noEmptyPattern, noGlobalObjectCalls, noInvalidBuiltinInstantiation, noInvalidConstructorSuper, noNonoctalDecimalEscape (+18 more)

### Community 27 - "icon.tsx"
Cohesion: 0.25
Nodes (9): DynamicUiIcon(), ICON_NAMES, iconNameSet, loadedIcons, loadIcon(), loadingIcons, normalize(), preloadCategoryIcons() (+1 more)

### Community 28 - "core/components.e2e.ts"
Cohesion: 0.15
Nodes (9): desktopOnly, bounds(), contained(), expectWheelScrollsPageWhileOpen(), expectDropdownPreservesScroll(), scrollWithInput(), settledOverlayAlpha(), APP_URL (+1 more)

### Community 29 - "combobox.tsx"
Cohesion: 0.11
Nodes (25): @base-ui/react, ComboboxField(), Props, ComboboxChip(), ComboboxChips(), ComboboxChipsInput(), ComboboxClear(), ComboboxCollection() (+17 more)

### Community 30 - "animations/tables.e2e.ts"
Cohesion: 0.16
Nodes (21): denseCardConsumers, denseRowConsumers, expectConsumerEntrance(), openMobileSidebarFromTableUpdates(), populatedConsumers, statementRules(), attachSamplingFailure(), expectPopupEntrance() (+13 more)

### Community 31 - "mobile-tab-bar.tsx"
Cohesion: 0.47
Nodes (7): MobileTabBar(), WorkflowTabs(), useDefaultFilterEndDateToday(), useDefaultFilterStartDate(), useSettings(), pathAllocatorDuplicates(), pathAllocatorPending()

### Community 32 - "drive-sync.ts"
Cohesion: 0.31
Nodes (17): exportData(), disconnectDrive(), downloadBackupFile(), driveFetch(), findBackupFile(), getClockSkewMs(), getFileMeta(), uploadBackupFile() (+9 more)

### Community 33 - "src/data/* (persistence, migrations, seeding, backup serialization, Drive storage)"
Cohesion: 0.15
Nodes (17): app/**/page.tsx, Background Drive sync, src/data/* (persistence, migrations, seeding, backup serialization, Drive storage), IndexedDB (Dexie), Interactive routes are "use client" (search params via next/navigation), src/logic/* (domain reads and operations), (month) route-group shell (Overview + Monthly Records), Pages take no props (+9 more)

### Community 34 - "export-import.ts"
Cohesion: 0.26
Nodes (10): EXPORT_VERSION, FinpointExport, SYNC_TABLES, TableName, TABLES, DEFAULT_SETTINGS, FinpointSettings, readSettings() (+2 more)

### Community 35 - "components.json"
Cohesion: 0.09
Nodes (21): aliases, components, hooks, lib, ui, utils, iconLibrary, menuAccent (+13 more)

### Community 36 - "shared.ts"
Cohesion: 0.16
Nodes (17): DEFAULT_CATEGORIES, DEFAULT_MONTHLY_BUDGETS, SEED_HASH_KEY, BANK_BLURB, between(), CATEGORIES, DAILY, generateTestData() (+9 more)

### Community 37 - "app-sidebar.tsx"
Cohesion: 0.21
Nodes (23): ReviewLinks(), NotFound(), Template(), AppearanceOption, APPEARANCES, AppSidebar(), SyncDot(), SYSTEM_APPEARANCE (+15 more)

### Community 38 - "auto-sync.ts"
Cohesion: 0.14
Nodes (25): useSyncStatus(), cycle(), emit(), eventListeners, finishCycle(), getSyncSnapshot(), ingestManualResult(), markDirty() (+17 more)

### Community 39 - "types.d.ts"
Cohesion: 0.10
Nodes (19): Account, Allocation, AnalyticsSummary, AnalyticsTreatment, Appearance, Budget, Category, CategoryWithChildren (+11 more)

### Community 40 - "Monthly Budget"
Cohesion: 0.18
Nodes (16): CONTEXT.md (domain vocabulary), Account, Allocation, Budget, Category, Duplicate Statement, Finpoint Domain Glossary, Monthly Budget (+8 more)

### Community 41 - "auth-vault.ts"
Cohesion: 0.29
Nodes (14): POST(), POST(), POST(), jose, AUTH_COOKIE_NAME, authCookie(), authCookieConfig(), clientIp() (+6 more)

### Community 42 - "monthpicker.tsx"
Cohesion: 0.32
Nodes (7): buttonVariants, ButtonVariant, Month, MonthCal(), MonthCalProps, MonthPicker(), MONTHS

### Community 44 - "STYLE.md"
Cohesion: 0.17
Nodes (13): APIs, Arguments, And Props, Code Style, Consistency, Copy, Core, Earning Its Place, Finpoint Style Additions, Grouping And Order (+5 more)

### Community 46 - "google-drive.ts"
Cohesion: 0.22
Nodes (14): AuthNeededError, cacheToken(), CodeResponse, DriveFileMeta, ensureDriveToken(), ensureDriveTokenSilent(), googleClientId(), hasFreshDriveToken() (+6 more)

### Community 47 - "formatter"
Cohesion: 0.15
Nodes (13): arrowParentheses, bracketSameLine, bracketSpacing, jsxQuoteStyle, quoteProperties, quoteStyle, semicolons, trailingCommas (+5 more)

### Community 48 - "devDependencies"
Cohesion: 0.15
Nodes (13): devDependencies, babel-plugin-react-compiler, @biomejs/biome, fake-indexeddb, @playwright/test, @tailwindcss/postcss, @types/luxon, @types/node (+5 more)

### Community 49 - "pagination.tsx"
Cohesion: 0.38
Nodes (11): pageHref(), pageWindow(), PaginationFooter(), Pagination(), PaginationContent(), PaginationEllipsis(), PaginationItem(), PaginationLink() (+3 more)

### Community 50 - "duplicates.ts"
Cohesion: 0.24
Nodes (14): descriptionAnchors(), descriptionIdentity(), dismissDuplicatePair(), DuplicateGroup, duplicateGroups(), DuplicateStatement, duplicateStatementIds(), eligible() (+6 more)

### Community 51 - "Commands"
Cohesion: 0.20
Nodes (11): Agent Behavior, Biome (biome check --write), bun install, bun lint (write-mode), bun lint:check, bun run build, bun types:check, Commands (+3 more)

### Community 52 - "Next.js agent rules block ("This is NOT the Next.js you know")"
Cohesion: 0.18
Nodes (9): app/api/auth/* Route Handlers, bun test, node_modules/next/dist/server/lib/generate-agent-files.js, Google OAuth broker (exchange/token/logout), Domain and importer tests (Dexie with in-memory IndexedDB), Next.js App Router app (mostly client-side), node_modules/next/dist/docs/, npm run dev (port 5173) (+1 more)

### Community 54 - "core/routes.e2e.ts"
Cohesion: 0.25
Nodes (9): PREMATURE, routeReady, titles, IDS, closeTableFilters(), fits(), openTableFilters(), patchRows() (+1 more)

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

### Community 60 - "(month)/layout.tsx"
Cohesion: 0.20
Nodes (12): MonthLayout(), luxon, compact(), INK, LEVELS, quantile(), rampCap(), SpendingCalendar() (+4 more)

### Community 61 - "next"
Cohesion: 0.18
Nodes (14): nextConfig, next, CategoryMovers(), Mover, CategorySpendingMix(), getStoredHistory(), getValidHistory(), HistoryContext (+6 more)

### Community 62 - "formatter"
Cohesion: 0.25
Nodes (8): formatter, attributePosition, enabled, formatWithErrors, indentStyle, indentWidth, lineEnding, lineWidth

### Community 63 - "Records"
Cohesion: 0.32
Nodes (8): Allocator, Budgets, Categories, Dashboard, Statement-allocation-record model, Monthly Budgets, Records, Statement importer

### Community 65 - "Domain docs (single-context layout)"
Cohesion: 0.33
Nodes (7): Agent skills, CONTEXT.md, Domain docs (single-context layout), Domain Language, Issue tracker (local specs and tickets), .scratch/ local work tracking, String primary keys (not auto-increment)

### Community 66 - "optionalDependencies"
Cohesion: 0.29
Nodes (7): optionalDependencies, lightningcss-linux-x64-gnu, lightningcss-win32-x64-msvc, @rollup/rollup-linux-x64-gnu, @rollup/rollup-win32-x64-msvc, @tailwindcss/oxide-linux-x64-gnu, @tailwindcss/oxide-win32-x64-msvc

### Community 68 - "tsconfig.e2e.json"
Cohesion: 0.29
Nodes (6): ./tsconfig.json, compilerOptions, incremental, exclude, extends, include

### Community 69 - "style"
Cohesion: 0.33
Nodes (6): style, noNamespace, noNonNullAssertion, useArrayLiterals, useAsConstAssertion, useBlockStatements

### Community 70 - "snapshot-hash.ts"
Cohesion: 0.40
Nodes (4): FinpointDB, digestSnapshot(), hashLegacySnapshot(), Snapshot

### Community 71 - "Validation rule (ValidationError + Validator)"
Cohesion: 0.50
Nodes (4): Old Laravel Api/*Controller mapping, Laravel-shaped { field: string[] } error maps, ValidationError, Validator

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

## Knowledge Gaps
- **83 isolated node(s):** `@fontsource-variable/inter`, `shadcn`, `tailwindcss`, `tw-animate-css`, `@biomejs/biome` (+78 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 577 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **12 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `cn()` connect `cn` to `duplicates/page.tsx`, `Button`, `formatCurrency`, `primitives.tsx`, `total-spending-chart.tsx`, `budgets/page.tsx`, `monthpicker.tsx`, `amount-filter.tsx`, `(month)/page.tsx`, `pagination.tsx`, `combobox.tsx`, `utils.ts`, `icon.tsx`, `(month)/layout.tsx`, `next`, `mobile-tab-bar.tsx`?**
  _High betweenness centrality (0.107) - this node is a cross-community bridge._
- **What connects `@fontsource-variable/inter`, `shadcn`, `tailwindcss` to the rest of the system?**
  _83 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `duplicates/page.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.10844748858447488 - nodes in this community are weakly interconnected._
- **Why does `src/data/* (persistence, migrations, seeding, backup serialization, Drive storage)` connect `src/data/* (persistence, migrations, seeding, backup serialization, Drive storage)` to `providers.tsx`?**
  _High betweenness centrality (0.067) - this node is a cross-community bridge._
- **Should `Button` be split into smaller, more focused modules?**
  _Cohesion score 0.060287479211214065 - nodes in this community are weakly interconnected._
- **Why does `react` connect `Button` to `duplicates/page.tsx`, `formatCurrency`, `primitives.tsx`, `cn`, `providers.tsx`, `total-spending-chart.tsx`, `budgets/page.tsx`, `amount-filter.tsx`, `(month)/page.tsx`, `utils.ts`, `package.json`, `icon.tsx`, `combobox.tsx`, `app-sidebar.tsx`, `auto-sync.ts`, `monthpicker.tsx`, `main.tsx`, `pagination.tsx`, `(month)/layout.tsx`, `next`?**
  _High betweenness centrality (0.056) - this node is a cross-community bridge._
- **Should `formatCurrency` be split into smaller, more focused modules?**
  _Cohesion score 0.05608042635658915 - nodes in this community are weakly interconnected._