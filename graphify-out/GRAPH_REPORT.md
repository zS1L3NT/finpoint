# Graph Report - t3-5de3660e  (2026-10-25)

## Corpus Check
- cluster-only mode — file stats not available

## Summary
- 1894 nodes · 7589 edges · 94 communities (83 shown, 11 thin omitted)
- Extraction: 98% EXTRACTED · 2% INFERRED · 0% AMBIGUOUS · INFERRED: 126 edges (avg confidence: 0.84)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `57d86ded`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- Button
- react
- budgets/[id]/page.tsx
- Tests README
- primitives.tsx
- dashboard.ts
- sidebar.tsx
- providers.tsx
- fixtures.ts
- daily-spending-chart.tsx
- lib/motion.ts
- compilerOptions
- editors.ts
- statement-rules.ts
- utils.ts
- (month)/page.tsx
- dependencies
- db.ts
- Validator
- records.ts
- (month)/layout.tsx
- statements.ts
- importer/page.tsx
- suspicious
- package.json
- ledger.e2e.ts
- correctness
- sync/page.tsx
- core/components.e2e.ts
- amount-filter.tsx
- support/motion.ts
- cn
- drive-sync.ts
- src/data/* (persistence, migrations, seeding, backup serialization, Drive storage)
- export-import.ts
- components.json
- test-data.ts
- total-spending-chart.tsx
- auto-sync.ts
- types.d.ts
- Monthly Budget
- auth-vault.ts
- radix-ui
- collectTests
- STYLE.md
- formatCurrency
- google-drive.ts
- formatter
- devDependencies
- pagination.tsx
- duplicates.ts
- Commands
- Next.js agent rules block ("This is NOT the Next.js you know")
- category-history-chart.tsx
- core/routes.e2e.ts
- biome.json
- rules
- manifest.json
- workflows.e2e.ts
- scripts
- luxon
- history.tsx
- formatter
- Records
- navigation.e2e.ts
- Domain docs (single-context layout)
- optionalDependencies
- vite.config.ts
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
1. `cn()` - 320 edges
2. `PrimitivesSection()` - 184 edges
3. `Button()` - 125 edges
4. `react` - 96 edges
5. `formatCurrency()` - 81 edges
6. `RecordEditorDialog()` - 63 edges
7. `UiIcon()` - 56 edges
8. `RecordCreatorDialog()` - 52 edges
9. `round2()` - 44 edges
10. `ValidationError` - 42 edges

## Surprising Connections (you probably didn't know these)
- `Finpoint Style Additions` --references--> `ValidationError`  [INFERRED]
  STYLE.md → src/logic/validate.ts
- `Copy` --references--> `pluralize()`  [INFERRED]
  STYLE.md → src/lib/utils.ts
- `Finpoint Style Additions` --references--> `useApiFormErrors()`  [INFERRED]
  STYLE.md → src/hooks/use-api-form-errors.ts
- `Boot()` --indirect_call--> `preloadCategoryIcons()`  [INFERRED]
  app/providers.tsx → src/components/icon.tsx
- `setup composite action` --implements--> `frozen production bundles (app 5273, harness 5274)`  [INFERRED]
  .github/actions/setup/action.yml → tests/README.md

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

## Communities (94 total, 11 thin omitted)

### Community 0 - "Button"
Cohesion: 0.07
Nodes (114): AccountPage(), AccountCard(), AccountRow, AccountsPage(), CARD_MOTION, DuplicateGroupCard(), FixDuplicatesPage(), GroupHeader() (+106 more)

### Community 1 - "react"
Cohesion: 0.08
Nodes (105): SECTIONS, @base-ui/react, react, sonner, @tanstack/react-form, AccountDialog(), BudgetCreatorDialog(), BudgetEditorDialog() (+97 more)

### Community 2 - "budgets/[id]/page.tsx"
Cohesion: 0.07
Nodes (72): BudgetPage(), getBudgetAnalytics(), getCategoryData(), Legend(), EmptyRecords(), MonthlyRecordsPage(), metadata, PrivacyPage() (+64 more)

### Community 3 - "Tests README"
Cohesion: 0.06
Nodes (41): Build harness step (vite build tests/harness), Playwright browser cache keyed on bun.lock, blob report merge, Committed graph artifacts (graph.json, GRAPH_REPORT.md, manifest.json, .graphify_labels.json), Graph health warnings and refresh failure reporting, graphify-out/graph.json, graphify skill (--update), graphify update . (+33 more)

### Community 4 - "primitives.tsx"
Cohesion: 0.10
Nodes (44): AlertDialogTrigger(), ComboboxChip(), ComboboxChips(), ComboboxChipsInput(), ComboboxCollection(), ComboboxContent(), ComboboxEmpty(), ComboboxGroup() (+36 more)

### Community 5 - "dashboard.ts"
Cohesion: 0.13
Nodes (37): contribution(), summarize(), avg(), buildCashflowHistory(), buildCategories(), buildComparison(), buildMonthlyBudgets(), buildProjection() (+29 more)

### Community 6 - "sidebar.tsx"
Cohesion: 0.10
Nodes (36): AppearanceOption, APPEARANCES, AppearanceSwitch(), AppSidebar(), SyncDot(), SYSTEM_APPEARANCE, useSyncIndicator(), SidebarContent() (+28 more)

### Community 7 - "providers.tsx"
Cohesion: 0.09
Nodes (31): metadata, RootLayout(), viewport, Boot(), Providers(), react-dom, @vercel/analytics, @vercel/speed-insights (+23 more)

### Community 8 - "fixtures.ts"
Cohesion: 0.12
Nodes (23): @playwright/test, cardTitles, Child, october, september, card(), overview, overviewCharts (+15 more)

### Community 9 - "daily-spending-chart.tsx"
Cohesion: 0.14
Nodes (27): recharts, BudgetActiveDot(), BudgetProgressChart(), BudgetProgressPoint, buildSeries(), colorChange(), CHART_INTRO_MS, useChartIntro() (+19 more)

### Community 10 - "lib/motion.ts"
Cohesion: 0.20
Nodes (27): @tanstack/react-table, DataTable(), PaginatedDataTable(), PaginationHeader(), GroupHeaderRow(), groupStarts(), GroupTotal(), isInteractiveTarget() (+19 more)

### Community 11 - "compilerOptions"
Cohesion: 0.06
Nodes (33): compilerOptions, allowJs, allowSyntheticDefaultImports, allowUnusedLabels, esModuleInterop, forceConsistentCasingInFileNames, incremental, isolatedModules (+25 more)

### Community 12 - "editors.ts"
Cohesion: 0.13
Nodes (19): editors, editors, longName, expectHeldRead(), expectRetainedRows(), expectSilentSheet(), expectVisibleBackdrop(), account (+11 more)

### Community 13 - "statement-rules.ts"
Cohesion: 0.10
Nodes (17): dexie, fake-indexeddb, xlsx, StatementRow, inferRecordDatetime(), byCreation(), conditionPattern(), deleteStatementRule() (+9 more)

### Community 14 - "utils.ts"
Cohesion: 0.26
Nodes (22): PendingCard(), PendingStatementConfirmationSheet(), RecordOption(), RecordSearchSheet(), StatementOption(), StatementSearchSheet(), Badge(), badgeVariants (+14 more)

### Community 15 - "(month)/page.tsx"
Cohesion: 0.12
Nodes (26): Comparison, comparisonRateText(), comparisonText(), ComparisonValue, DashboardData, DashboardMonthlyBudget, DashboardPage(), DashboardView (+18 more)

### Community 16 - "dependencies"
Cohesion: 0.07
Nodes (30): dependencies, @base-ui/react, class-variance-authority, clsx, cmdk, dexie, dexie-react-hooks, @fontsource-variable/inter (+22 more)

### Community 17 - "db.ts"
Cohesion: 0.11
Nodes (28): AccountRow, AllocationRow, AnalyticsMonthRow, asPending(), BudgetRecordRow, BudgetRow, CategoryRow, DB_NAME (+20 more)

### Community 18 - "Validator"
Cohesion: 0.23
Nodes (20): updateAccount(), validateBudget(), cleanInput(), dismissDuplicatePair(), eligible(), fixDuplicates(), restoreDuplicatePair(), createMonthlyBudget() (+12 more)

### Community 19 - "records.ts"
Cohesion: 0.11
Nodes (23): AnalyticsRecord, AnalyticsSummary, createBudget(), AllocationTally, pendingStatementIds(), tallyAllocations(), analyticsValues(), budgetCovers() (+15 more)

### Community 20 - "(month)/layout.tsx"
Cohesion: 0.13
Nodes (23): MonthLayout(), lucide-react, react-day-picker, DateField(), Props, buttonVariants, Calendar(), CalendarDayButton() (+15 more)

### Community 21 - "statements.ts"
Cohesion: 0.15
Nodes (24): countSuggestions(), duplicateStatementIds(), removeStatementDismissals(), dayDifference(), ensureCanReplace(), maskDescription(), ReplacementAllocation, replacementComparison() (+16 more)

### Community 22 - "importer/page.tsx"
Cohesion: 0.20
Nodes (25): ACCEPT, BANKS_REQUIRING_ADDITIONAL_INFO, ImporterPage(), Step(), BANKS, ensureAccount(), combine(), dbsDescriptionKey() (+17 more)

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

### Community 27 - "sync/page.tsx"
Cohesion: 0.17
Nodes (23): COUNT_ROWS, DataSettingsPage(), StateRow(), STATUS_TONES, StatusTone, WorkspaceRow(), AlertDialog(), AlertDialogAction() (+15 more)

### Community 28 - "core/components.e2e.ts"
Cohesion: 0.13
Nodes (11): desktopOnly, bounds(), contained(), expectWheelScrollsPageWhileOpen(), containedFooter(), expectDropdownPreservesScroll(), expectPointerCursor(), scrollWithInput() (+3 more)

### Community 29 - "amount-filter.tsx"
Cohesion: 0.15
Nodes (21): AmountFilter(), AmountRange, COMPARISONS, describe(), Draft, readRange(), upperBound(), ComboboxClear() (+13 more)

### Community 30 - "support/motion.ts"
Cohesion: 0.17
Nodes (19): denseCardConsumers, denseRowConsumers, expectConsumerEntrance(), populatedConsumers, pickOption(), attachSamplingFailure(), expectPopupEntrance(), expectReducedRowMovement() (+11 more)

### Community 31 - "cn"
Cohesion: 0.17
Nodes (21): CategoryFilter(), CategoryFilterItem(), AlertAction(), Command(), CommandEmpty(), CommandGroup(), CommandInput(), CommandItem() (+13 more)

### Community 32 - "drive-sync.ts"
Cohesion: 0.25
Nodes (23): downloadBackupFile(), driveFetch(), findBackupFile(), getClockSkewMs(), getFileMeta(), isDriveConfigured(), uploadBackupFile(), hashSnapshot() (+15 more)

### Community 33 - "src/data/* (persistence, migrations, seeding, backup serialization, Drive storage)"
Cohesion: 0.15
Nodes (17): app/**/page.tsx, Background Drive sync, src/data/* (persistence, migrations, seeding, backup serialization, Drive storage), IndexedDB (Dexie), Interactive routes are "use client" (search params via next/navigation), src/logic/* (domain reads and operations), (month) route-group shell (Overview + Monthly Records), Pages take no props (+9 more)

### Community 34 - "export-import.ts"
Cohesion: 0.20
Nodes (19): db, clearAllData(), downloadExport(), exportData(), importData(), parseImportFile(), tableCounts(), TableName (+11 more)

### Community 35 - "components.json"
Cohesion: 0.09
Nodes (21): aliases, components, hooks, lib, ui, utils, iconLibrary, menuAccent (+13 more)

### Community 36 - "test-data.ts"
Cohesion: 0.15
Nodes (18): DEFAULT_CATEGORIES, DEFAULT_MONTHLY_BUDGETS, EXPORT_VERSION, FinpointExport, SEED_HASH_KEY, BANK_BLURB, between(), CATEGORIES (+10 more)

### Community 37 - "total-spending-chart.tsx"
Cohesion: 0.18
Nodes (18): CashflowChart(), CashflowPoint, colorChange(), currencyOrDash(), LegendItem(), mobileAmount, seriesLabel(), StatefulActiveDot() (+10 more)

### Community 38 - "auto-sync.ts"
Cohesion: 0.14
Nodes (18): SYNC_TABLES, useSyncStatus(), emit(), eventListeners, finishCycle(), getSyncSnapshot(), sameSnapshot(), set() (+10 more)

### Community 39 - "types.d.ts"
Cohesion: 0.10
Nodes (19): Account, Allocation, AnalyticsSummary, AnalyticsTreatment, Appearance, Budget, Category, CategoryWithChildren (+11 more)

### Community 40 - "Monthly Budget"
Cohesion: 0.18
Nodes (16): CONTEXT.md (domain vocabulary), Account, Allocation, Budget, Category, Duplicate Statement, Finpoint Domain Glossary, Monthly Budget (+8 more)

### Community 41 - "auth-vault.ts"
Cohesion: 0.32
Nodes (13): POST(), POST(), POST(), AUTH_COOKIE_NAME, authCookie(), authCookieConfig(), clientIp(), encryptionKey() (+5 more)

### Community 42 - "radix-ui"
Cohesion: 0.17
Nodes (13): class-variance-authority, radix-ui, AppHeader(), ButtonGroup(), ButtonGroupSeparator(), ButtonGroupText(), buttonGroupVariants, FieldSeparator() (+5 more)

### Community 43 - "collectTests"
Cohesion: 0.28
Nodes (16): collectTests(), conditionBranch(), detailsTags(), disabled(), mentionsMotion(), record(), splitTestCallee(), tagValues() (+8 more)

### Community 44 - "STYLE.md"
Cohesion: 0.17
Nodes (13): APIs, Arguments, And Props, Code Style, Consistency, Copy, Core, Earning Its Place, Finpoint Style Additions, Grouping And Order (+5 more)

### Community 45 - "formatCurrency"
Cohesion: 0.23
Nodes (11): CategoryMovers(), Mover, arc(), centerCurrency(), MonthlyBudgetUsage(), MonthlyBudgetUsageItem, Amount(), compactAmount (+3 more)

### Community 46 - "google-drive.ts"
Cohesion: 0.24
Nodes (12): AuthNeededError, cacheToken(), CodeResponse, disconnectDrive(), DriveFileMeta, ensureDriveToken(), ensureDriveTokenSilent(), googleClientId() (+4 more)

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
Nodes (12): allocationOutcome(), descriptionAnchors(), descriptionIdentity(), DuplicateGroup, duplicateGroups(), DuplicateStatement, FixDuplicatesInput, GENERIC (+4 more)

### Community 51 - "Commands"
Cohesion: 0.20
Nodes (11): Agent Behavior, Biome (biome check --write), bun install, bun lint (write-mode), bun lint:check, bun run build, bun types:check, Commands (+3 more)

### Community 52 - "Next.js agent rules block ("This is NOT the Next.js you know")"
Cohesion: 0.18
Nodes (9): app/api/auth/* Route Handlers, bun test, node_modules/next/dist/server/lib/generate-agent-files.js, Google OAuth broker (exchange/token/logout), Domain and importer tests (Dexie with in-memory IndexedDB), Next.js App Router app (mostly client-side), node_modules/next/dist/docs/, npm run dev (port 5173) (+1 more)

### Community 53 - "category-history-chart.tsx"
Cohesion: 0.24
Nodes (11): aggregateSeries(), CategoryHistoryChart(), ChartMonth, ChartSeries, HistoryTooltip(), MonthTick(), prepareMonths(), prepareSeries() (+3 more)

### Community 54 - "core/routes.e2e.ts"
Cohesion: 0.27
Nodes (7): PREMATURE, routeReady, titles, IDS, fits(), patchRows(), statementRow()

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

### Community 60 - "luxon"
Cohesion: 0.31
Nodes (8): luxon, compact(), INK, LEVELS, quantile(), rampCap(), SpendingCalendar(), WEEKDAYS

### Community 61 - "history.tsx"
Cohesion: 0.39
Nodes (7): getStoredHistory(), getValidHistory(), HistoryContext, HistoryItem, HistoryProvider(), normaliseUrl(), withoutTrailingSelf()

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

### Community 67 - "vite.config.ts"
Cohesion: 0.29
Nodes (4): vite, @vitejs/plugin-react, harnessDir, repoRoot

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
- **83 isolated node(s):** `Graph health warnings and refresh failure reporting`, `Test areas (one file per area)`, `Frozen production bundle run (ports 5273/5274)`, `Rendered assertions (support/assertions.ts)`, `React Compiler (enabled)` (+78 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 578 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **11 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `cn()` connect `cn` to `Button`, `react`, `budgets/[id]/page.tsx`, `primitives.tsx`, `total-spending-chart.tsx`, `sidebar.tsx`, `daily-spending-chart.tsx`, `lib/motion.ts`, `radix-ui`, `formatCurrency`, `utils.ts`, `(month)/page.tsx`, `pagination.tsx`, `(month)/layout.tsx`, `importer/page.tsx`, `sync/page.tsx`, `luxon`, `amount-filter.tsx`?**
  _High betweenness centrality (0.106) - this node is a cross-community bridge._
- **What connects `Graph health warnings and refresh failure reporting`, `Test areas (one file per area)`, `Frozen production bundle run (ports 5273/5274)` to the rest of the system?**
  _83 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Button` be split into smaller, more focused modules?**
  _Cohesion score 0.06962683042040624 - nodes in this community are weakly interconnected._
- **Why does `src/data/* (persistence, migrations, seeding, backup serialization, Drive storage)` connect `src/data/* (persistence, migrations, seeding, backup serialization, Drive storage)` to `providers.tsx`?**
  _High betweenness centrality (0.062) - this node is a cross-community bridge._
- **Should `react` be split into smaller, more focused modules?**
  _Cohesion score 0.07680101555061886 - nodes in this community are weakly interconnected._
- **Why does `react` connect `react` to `Button`, `budgets/[id]/page.tsx`, `primitives.tsx`, `sidebar.tsx`, `providers.tsx`, `daily-spending-chart.tsx`, `lib/motion.ts`, `utils.ts`, `(month)/page.tsx`, `(month)/layout.tsx`, `importer/page.tsx`, `package.json`, `sync/page.tsx`, `amount-filter.tsx`, `cn`, `total-spending-chart.tsx`, `auto-sync.ts`, `radix-ui`, `formatCurrency`, `pagination.tsx`, `history.tsx`?**
  _High betweenness centrality (0.058) - this node is a cross-community bridge._
- **Should `budgets/[id]/page.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.0675549322113137 - nodes in this community are weakly interconnected._