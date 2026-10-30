# Graph Report - finpoint  (2026-10-31)

## Corpus Check
- 246 files · ~225,188 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 9 file(s) not represented in the graph (top: (none) 4, .example 1, .lock 1)

## Summary
- 1934 nodes · 7738 edges · 91 communities (80 shown, 11 thin omitted)
- Extraction: 98% EXTRACTED · 2% INFERRED · 0% AMBIGUOUS · INFERRED: 127 edges (avg confidence: 0.84)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `fda7b1bb`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- pending/page.tsx
- Button
- suggestions.test.ts
- Tests README
- primitives.tsx
- dashboard.ts
- icon.tsx
- app-sidebar.tsx
- @playwright/test
- category-history-chart.tsx
- paginated-data-table.tsx
- compilerOptions
- editors.ts
- combobox.tsx
- auto-sync.ts
- (month)/page.tsx
- dependencies
- db.ts
- Validator
- records.ts
- react
- statements.ts
- statement-replacement-review.tsx
- suspicious
- package.json
- ledger.e2e.ts
- correctness
- suggestions.ts
- core/components.e2e.ts
- sync/page.tsx
- support/motion.ts
- fixtures.ts
- drive-sync.ts
- UI layer (app pages + components)
- export-import.ts
- components.json
- test-data.ts
- budgets/[id]/page.tsx
- Input
- types.d.ts
- STYLE.md
- auth-vault.ts
- cn
- duplicates.ts
- workflows.e2e.ts
- utils.ts
- radix-ui
- formatter
- devDependencies
- pagination.tsx
- google-drive.ts
- Commands
- Next.js agent rules block ("This is NOT the Next.js you know")
- category-filter.tsx
- core/routes.e2e.ts
- biome.json
- rules
- manifest.json
- main.tsx
- scripts
- formatter
- Records
- Domain docs (single-context layout)
- optionalDependencies
- tsconfig.e2e.json
- style
- src/data/* (persistence, migrations, seeding, backup serialization, Drive storage)
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
- src/components/*

## God Nodes (most connected - your core abstractions)
1. `cn()` - 318 edges
2. `PrimitivesSection()` - 180 edges
3. `Button()` - 128 edges
4. `react` - 97 edges
5. `formatCurrency()` - 78 edges
6. `RecordEditorDialog()` - 63 edges
7. `RecordCreatorDialog()` - 57 edges
8. `UiIcon()` - 57 edges
9. `round2()` - 47 edges
10. `next` - 42 edges

## Surprising Connections (you probably didn't know these)
- `Copy` --references--> `pluralize()`  [INFERRED]
  STYLE.md → src/lib/utils.ts
- `Finpoint Style Additions` --references--> `useApiFormErrors()`  [INFERRED]
  STYLE.md → src/hooks/use-api-form-errors.ts
- `Finpoint Style Additions` --references--> `ValidationError`  [INFERRED]
  STYLE.md → src/logic/validate.ts
- `Boot()` --indirect_call--> `preloadCategoryIcons()`  [INFERRED]
  app/providers.tsx → src/components/icon.tsx
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

## Communities (91 total, 11 thin omitted)

### Community 0 - "pending/page.tsx"
Cohesion: 0.10
Nodes (80): AccountPage(), AccountCard(), AccountRow, AccountsPage(), CARD_MOTION, DuplicateGroupCard(), FixDuplicatesPage(), GroupHeader() (+72 more)

### Community 1 - "Button"
Cohesion: 0.05
Nodes (143): BUDGET_STATES, BudgetCard(), BudgetsPage(), BudgetState, formatBudgetDateWindow(), ACCEPT, BANKS_REQUIRING_ADDITIONAL_INFO, ImporterPage() (+135 more)

### Community 2 - "suggestions.test.ts"
Cohesion: 0.17
Nodes (7): dexie, fake-indexeddb, xlsx, decided(), live(), record(), statement()

### Community 3 - "Tests README"
Cohesion: 0.06
Nodes (41): Build harness step (vite build tests/harness), Playwright browser cache keyed on bun.lock, blob report merge, Committed graph artifacts (graph.json, GRAPH_REPORT.md, manifest.json, .graphify_labels.json), Graph health warnings and refresh failure reporting, graphify-out/graph.json, graphify skill (--update), graphify update . (+33 more)

### Community 4 - "primitives.tsx"
Cohesion: 0.09
Nodes (46): AlertAction(), AlertDialogTrigger(), CardFooter(), DropdownMenu(), DropdownMenuCheckboxItem(), DropdownMenuContent(), DropdownMenuGroup(), DropdownMenuItem() (+38 more)

### Community 5 - "dashboard.ts"
Cohesion: 0.14
Nodes (35): contribution(), summarize(), avg(), BREAKDOWN_MONTHS, buildCashflowHistory(), buildCategories(), buildComparison(), buildMonthlyBudgets() (+27 more)

### Community 6 - "icon.tsx"
Cohesion: 0.15
Nodes (27): RecordPage(), StatementPage(), AllocateBar(), Sparkline(), DetailSummary(), DetailSummaryItem(), DynamicUiIcon(), Icon() (+19 more)

### Community 7 - "app-sidebar.tsx"
Cohesion: 0.07
Nodes (61): metadata, RootLayout(), viewport, NotFound(), Boot(), Providers(), Template(), lucide-react (+53 more)

### Community 8 - "@playwright/test"
Cohesion: 0.13
Nodes (9): @playwright/test, cardTitles, expectBackAboveHeadingFromKeyboardNavigation(), keyboardBack(), card(), chartTooltip, overview, overviewCharts (+1 more)

### Community 9 - "category-history-chart.tsx"
Cohesion: 0.31
Nodes (10): aggregateSeries(), CategoryHistoryChart(), ChartMonth, ChartSeries, MonthBreakdown(), MonthTick(), monthTotal(), prepareMonths() (+2 more)

### Community 10 - "paginated-data-table.tsx"
Cohesion: 0.22
Nodes (24): @tanstack/react-table, DataTable(), PaginatedDataTable(), PaginationHeader(), GroupHeaderRow(), groupStarts(), GroupTotal(), isInteractiveTarget() (+16 more)

### Community 11 - "compilerOptions"
Cohesion: 0.06
Nodes (33): compilerOptions, allowJs, allowSyntheticDefaultImports, allowUnusedLabels, esModuleInterop, forceConsistentCasingInFileNames, incremental, isolatedModules (+25 more)

### Community 12 - "editors.ts"
Cohesion: 0.13
Nodes (21): editors, editors, longName, expectHeldRead(), expectRetainedRows(), expectSilentSheet(), IDS, statementRules() (+13 more)

### Community 13 - "combobox.tsx"
Cohesion: 0.11
Nodes (25): @base-ui/react, ComboboxField(), Props, ComboboxChip(), ComboboxChips(), ComboboxChipsInput(), ComboboxClear(), ComboboxCollection() (+17 more)

### Community 14 - "auto-sync.ts"
Cohesion: 0.14
Nodes (18): SYNC_TABLES, useSyncStatus(), emit(), eventListeners, finishCycle(), getSyncSnapshot(), sameSnapshot(), set() (+10 more)

### Community 15 - "(month)/page.tsx"
Cohesion: 0.10
Nodes (43): Comparison, comparisonRateText(), comparisonText(), ComparisonValue, DashboardData, DashboardMonthlyBudget, DashboardPage(), DashboardView (+35 more)

### Community 16 - "dependencies"
Cohesion: 0.07
Nodes (30): dependencies, @base-ui/react, class-variance-authority, clsx, cmdk, dexie, dexie-react-hooks, @fontsource-variable/inter (+22 more)

### Community 17 - "db.ts"
Cohesion: 0.12
Nodes (27): AccountRow, AllocationRow, AnalyticsMonthRow, BudgetRecordRow, BudgetRow, CategoryRow, DB_NAME, DB_VERSION (+19 more)

### Community 18 - "Validator"
Cohesion: 0.21
Nodes (23): updateAccount(), validateBudget(), cleanInput(), dismissDuplicatePair(), eligible(), fixDuplicates(), restoreDuplicatePair(), importFiles() (+15 more)

### Community 19 - "records.ts"
Cohesion: 0.14
Nodes (20): db, getMonthlyRecords(), MonthlyFilters, expandCategoryIdsForMonthly(), AllocationTally, pendingStatementIds(), tallyAllocations(), analyticsValues() (+12 more)

### Community 20 - "react"
Cohesion: 0.13
Nodes (26): MonthLayout(), react, AmountFilter(), AmountRange, COMPARISONS, describe(), Draft, readRange() (+18 more)

### Community 21 - "statements.ts"
Cohesion: 0.13
Nodes (28): countSuggestions(), asPending(), AnalyticsRecord, AnalyticsSummary, duplicateStatementIds(), removeStatementDismissals(), dayDifference(), ensureCanReplace() (+20 more)

### Community 22 - "statement-replacement-review.tsx"
Cohesion: 0.16
Nodes (34): PendingCard(), WeekdayCard(), EmptyRecords(), metadata, PrivacyPage(), SECTIONS, MethodHeader(), metadata (+26 more)

### Community 23 - "suspicious"
Cohesion: 0.07
Nodes (28): suspicious, noAssignInExpressions, noAsyncPromiseExecutor, noCatchAssign, noClassAssign, noCompareNegZero, noControlCharactersInRegex, noDebugger (+20 more)

### Community 24 - "package.json"
Cohesion: 0.07
Nodes (26): private, $schema, type, babel-plugin-react-compiler, @biomejs/biome, clsx, cmdk, @fontsource-variable/inter (+18 more)

### Community 25 - "ledger.e2e.ts"
Cohesion: 0.07
Nodes (45): typescript, vite, @vitejs/plugin-react, behaviourCoverage, componentInventory, facetNotApplicable, InventoryEntry, notApplicable (+37 more)

### Community 26 - "correctness"
Cohesion: 0.08
Nodes (26): noConstantCondition, noConstAssign, noEmptyCharacterClassInRegex, noEmptyPattern, noGlobalObjectCalls, noInvalidBuiltinInstantiation, noInvalidConstructorSuper, noNonoctalDecimalEscape (+18 more)

### Community 27 - "suggestions.ts"
Cohesion: 0.05
Nodes (70): CategoryDialogState, CategoryTile(), SECTIONS, Rule, RuleActionList(), RuleCard(), StatementRulesPage(), SuggestedRuleCard() (+62 more)

### Community 28 - "core/components.e2e.ts"
Cohesion: 0.13
Nodes (12): desktopOnly, bounds(), contained(), expectWheelScrollsPageWhileOpen(), containedFooter(), expectDropdownPreservesScroll(), expectPointerCursor(), expectVisibleBackdrop() (+4 more)

### Community 29 - "sync/page.tsx"
Cohesion: 0.16
Nodes (24): COUNT_ROWS, DataSettingsPage(), StateRow(), STATUS_TONES, StatusTone, WorkspaceRow(), AlertDialog(), AlertDialogAction() (+16 more)

### Community 30 - "support/motion.ts"
Cohesion: 0.17
Nodes (18): denseCardConsumers, denseRowConsumers, expectConsumerEntrance(), populatedConsumers, attachSamplingFailure(), expectPopupEntrance(), expectReducedRowMovement(), expectVisibleRowCascade() (+10 more)

### Community 31 - "fixtures.ts"
Cohesion: 0.24
Nodes (11): ScenarioName, WorkspaceDataset, WorkspaceTables, assertSeeded(), checkSeededMarker(), countStore(), seedInBrowser(), seedWorkspace() (+3 more)

### Community 32 - "drive-sync.ts"
Cohesion: 0.25
Nodes (22): downloadBackupFile(), driveFetch(), findBackupFile(), getClockSkewMs(), getFileMeta(), isDriveConfigured(), uploadBackupFile(), cycle() (+14 more)

### Community 33 - "UI layer (app pages + components)"
Cohesion: 0.22
Nodes (11): app/**/page.tsx, Interactive routes are "use client" (search params via next/navigation), (month) route-group shell (Overview + Monthly Records), Pages take no props, Project Shape, React Compiler (enabled), Root Suspense (keeps routes static), src/routes.ts (centralized route paths) (+3 more)

### Community 34 - "export-import.ts"
Cohesion: 0.14
Nodes (25): FinpointDB, withoutActionModes(), clearAllData(), downloadExport(), exportData(), importData(), parseImportFile(), tableCounts() (+17 more)

### Community 35 - "components.json"
Cohesion: 0.09
Nodes (21): aliases, components, hooks, lib, ui, utils, iconLibrary, menuAccent (+13 more)

### Community 36 - "test-data.ts"
Cohesion: 0.15
Nodes (17): DEFAULT_CATEGORIES, DEFAULT_MONTHLY_BUDGETS, EXPORT_VERSION, FinpointExport, BANK_BLURB, between(), CATEGORIES, DAILY (+9 more)

### Community 37 - "budgets/[id]/page.tsx"
Cohesion: 0.15
Nodes (27): BudgetPage(), getBudgetAnalytics(), getCategoryData(), Legend(), MonthlyRecordsPage(), BudgetProgressChart(), BudgetProgressPoint, buildSeries() (+19 more)

### Community 38 - "Input"
Cohesion: 0.44
Nodes (13): PendingStatementConfirmationSheet(), RecordSearchSheet(), StatementSearchSheet(), Input(), Sheet(), SheetContent(), SheetDescription(), SheetHeader() (+5 more)

### Community 39 - "types.d.ts"
Cohesion: 0.11
Nodes (18): Account, Allocation, AnalyticsSummary, AnalyticsTreatment, Appearance, Budget, Category, CategoryWithChildren (+10 more)

### Community 40 - "STYLE.md"
Cohesion: 0.09
Nodes (28): CONTEXT.md (domain vocabulary), Account, Allocation, Budget, Category, Duplicate Statement, Finpoint Domain Glossary, Monthly Budget (+20 more)

### Community 41 - "auth-vault.ts"
Cohesion: 0.29
Nodes (14): POST(), POST(), POST(), jose, AUTH_COOKIE_NAME, authCookie(), authCookieConfig(), clientIp() (+6 more)

### Community 42 - "cn"
Cohesion: 0.11
Nodes (34): AppearanceSwitch(), ScrollArea(), ScrollBar(), SidebarContent(), SidebarContext, SidebarContextProps, SidebarFooter(), SidebarGroup() (+26 more)

### Community 43 - "duplicates.ts"
Cohesion: 0.24
Nodes (12): allocationOutcome(), descriptionAnchors(), descriptionIdentity(), DuplicateGroup, duplicateGroups(), DuplicateStatement, FixDuplicatesInput, GENERIC (+4 more)

### Community 45 - "utils.ts"
Cohesion: 0.17
Nodes (17): bar(), BarChart(), BarSeries, PAD, ChartFrame(), ChartSize, ReadoutRows(), PAD (+9 more)

### Community 46 - "radix-ui"
Cohesion: 0.18
Nodes (12): class-variance-authority, radix-ui, AppHeader(), ButtonGroup(), ButtonGroupSeparator(), ButtonGroupText(), buttonGroupVariants, FieldSeparator() (+4 more)

### Community 47 - "formatter"
Cohesion: 0.15
Nodes (13): arrowParentheses, bracketSameLine, bracketSpacing, jsxQuoteStyle, quoteProperties, quoteStyle, semicolons, trailingCommas (+5 more)

### Community 48 - "devDependencies"
Cohesion: 0.15
Nodes (13): devDependencies, babel-plugin-react-compiler, @biomejs/biome, fake-indexeddb, @playwright/test, @tailwindcss/postcss, @types/luxon, @types/node (+5 more)

### Community 49 - "pagination.tsx"
Cohesion: 0.38
Nodes (11): pageHref(), pageWindow(), PaginationFooter(), Pagination(), PaginationContent(), PaginationEllipsis(), PaginationItem(), PaginationLink() (+3 more)

### Community 50 - "google-drive.ts"
Cohesion: 0.24
Nodes (12): AuthNeededError, cacheToken(), CodeResponse, disconnectDrive(), DriveFileMeta, ensureDriveToken(), ensureDriveTokenSilent(), googleClientId() (+4 more)

### Community 51 - "Commands"
Cohesion: 0.38
Nodes (7): Biome (biome check --write), bun install, bun lint (write-mode), bun lint:check, bun run build, bun types:check, Commands

### Community 52 - "Next.js agent rules block ("This is NOT the Next.js you know")"
Cohesion: 0.25
Nodes (6): app/api/auth/* Route Handlers, node_modules/next/dist/server/lib/generate-agent-files.js, Google OAuth broker (exchange/token/logout), Next.js App Router app (mostly client-side), node_modules/next/dist/docs/, npm run dev (port 5173)

### Community 53 - "category-filter.tsx"
Cohesion: 0.33
Nodes (11): CategoryFilter(), CategoryFilterItem(), Command(), CommandEmpty(), CommandGroup(), CommandInput(), CommandItem(), CommandList() (+3 more)

### Community 54 - "core/routes.e2e.ts"
Cohesion: 0.18
Nodes (13): Child, october, september, PREMATURE, routeReady, titles, installDateOnly(), revisions (+5 more)

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

### Community 70 - "src/data/* (persistence, migrations, seeding, backup serialization, Drive storage)"
Cohesion: 0.31
Nodes (8): Background Drive sync, bun test, src/data/* (persistence, migrations, seeding, backup serialization, Drive storage), IndexedDB (Dexie), Domain and importer tests (Dexie with in-memory IndexedDB), src/logic/* (domain reads and operations), Verification, Workspace backup/reset operations

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

### Community 94 - "src/components/*"
Cohesion: 0.25
Nodes (5): Agent Behavior, Generated / Ignored Files, src/components/*, src/components/ui/**/*, useLiveQuery

## Knowledge Gaps
- **83 isolated node(s):** `@fontsource-variable/inter`, `shadcn`, `tailwindcss`, `tw-animate-css`, `@biomejs/biome` (+78 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 586 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **11 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `cn()` connect `cn` to `pending/page.tsx`, `Button`, `primitives.tsx`, `budgets/[id]/page.tsx`, `icon.tsx`, `Input`, `app-sidebar.tsx`, `paginated-data-table.tsx`, `utils.ts`, `radix-ui`, `(month)/page.tsx`, `combobox.tsx`, `pagination.tsx`, `react`, `category-filter.tsx`, `statement-replacement-review.tsx`, `suggestions.ts`, `sync/page.tsx`?**
  _High betweenness centrality (0.091) - this node is a cross-community bridge._
- **What connects `@fontsource-variable/inter`, `shadcn`, `tailwindcss` to the rest of the system?**
  _83 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `pending/page.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.09575480677707976 - nodes in this community are weakly interconnected._
- **Why does `src/data/* (persistence, migrations, seeding, backup serialization, Drive storage)` connect `src/data/* (persistence, migrations, seeding, backup serialization, Drive storage)` to `UI layer (app pages + components)`, `app-sidebar.tsx`?**
  _High betweenness centrality (0.080) - this node is a cross-community bridge._
- **Should `Button` be split into smaller, more focused modules?**
  _Cohesion score 0.051342100522428394 - nodes in this community are weakly interconnected._
- **Why does `react` connect `react` to `pending/page.tsx`, `Button`, `primitives.tsx`, `icon.tsx`, `app-sidebar.tsx`, `category-history-chart.tsx`, `paginated-data-table.tsx`, `combobox.tsx`, `auto-sync.ts`, `(month)/page.tsx`, `statement-replacement-review.tsx`, `package.json`, `suggestions.ts`, `sync/page.tsx`, `budgets/[id]/page.tsx`, `Input`, `cn`, `utils.ts`, `radix-ui`, `pagination.tsx`, `category-filter.tsx`, `main.tsx`?**
  _High betweenness centrality (0.075) - this node is a cross-community bridge._
- **Should `Tests README` be split into smaller, more focused modules?**
  _Cohesion score 0.05928614640048397 - nodes in this community are weakly interconnected._