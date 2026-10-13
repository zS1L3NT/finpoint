# Graph Report - t3-c0745187  (2026-10-14)

## Corpus Check
- 196 files · ~117,601 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 9 file(s) not represented in the graph (top: (none) 5, .example 1, .lock 1)

## Summary
- 1546 nodes · 5957 edges · 80 communities (71 shown, 9 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 88 edges (avg confidence: 0.87)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `1a6b9eaf`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- record-editor.tsx
- amount-filter.tsx
- Button
- app-sidebar.tsx
- paginated-data-table.tsx
- combobox.tsx
- dashboard.ts
- compilerOptions
- daily-spending-chart.tsx
- (month)/page.tsx
- Application Dependencies
- Validator
- sync/page.tsx
- suspicious
- auto-sync.ts
- package.json
- correctness
- records.ts
- Input
- category-filter.tsx
- category-history-chart.tsx
- Next.js App Router
- Components Components
- drive-sync.ts
- test-data.ts
- export-import.ts
- Fix Duplicates — UI redesign
- sidebar.tsx
- importer/page.tsx
- types.d.ts
- Changed Bank Descriptions
- auth-vault.ts
- utils.ts
- google-drive.ts
- db.ts
- formatter
- Record
- Graph refresh after code tasks
- biome.json
- rules
- cashflow-chart.tsx
- Style Guide
- manifest.json
- devDependencies
- Fix duplicate bank statements
- total-spending-chart.tsx
- Local Markdown Issue Tracker
- formatter
- Commit Guide
- Records
- monthly-budget-usage.tsx
- spending-calendar.tsx
- optionalDependencies
- scripts
- style
- shell-header.tsx
- Finpoint icon concept
- Finpoint icon with charcoal shadow
- Issue tracker: Local Markdown
- Finpoint
- Domain docs
- Google Drive sync
- 01: Review and fix duplicate bank statements in Workflows
- F monogram icon
- JPG favicon icon
- PNG favicon icon
- SVG favicon icon
- F monogram icon
- F monogram icon
- cn
- Next.js development server
- Finpoint app icon
- Biome checks
- String primary keys
- Unrestricted crawler policy
- Generated demo data
- Progressive Web Application
- statements.ts

## God Nodes (most connected - your core abstractions)
1. `cn()` - 308 edges
2. `Button()` - 114 edges
3. `react` - 90 edges
4. `formatCurrency()` - 78 edges
5. `RecordEditorDialog()` - 62 edges
6. `UiIcon()` - 47 edges
7. `RecordCreatorDialog()` - 46 edges
8. `FixDuplicatesPage()` - 44 edges
9. `DataSettingsPage()` - 41 edges
10. `next` - 41 edges

## Surprising Connections (you probably didn't know these)
- `Decisions` --references--> `Input()`  [INFERRED]
  .scratch/fix-duplicates/design.md → src/components/ui/input.tsx
- `Decisions` --references--> `ToggleGroup()`  [INFERRED]
  .scratch/fix-duplicates/design.md → src/components/ui/toggle-group.tsx
- `Decisions` --references--> `duplicateGroups()`  [INFERRED]
  .scratch/fix-duplicates/design.md → src/logic/duplicates.ts
- `Decisions` --references--> `FilterBar()`  [INFERRED]
  .scratch/fix-duplicates/design.md → src/components/table/filter-bar.tsx
- `Problems with the current page` --references--> `FilterBar()`  [INFERRED]
  .scratch/fix-duplicates/design.md → src/components/table/filter-bar.tsx

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **Separate meaning, accounting and spending planning** — context_category, context_treatment, context_monthly_budget, context_record [EXTRACTED 1.00]
- **Imported activity explained by managed records** — context_statement, context_allocation, context_record [EXTRACTED 1.00]

## Communities (80 total, 9 thin omitted)

### Community 0 - "record-editor.tsx"
Cohesion: 0.09
Nodes (80): react, sonner, @tanstack/react-form, AccountDialog(), BudgetCreatorDialog(), BudgetEditorDialog(), CategoryDialog(), CategoryFormValues (+72 more)

### Community 1 - "amount-filter.tsx"
Cohesion: 0.30
Nodes (10): AmountFilter(), AmountRange, COMPARISONS, describe(), Draft, readRange(), upperBound(), InputGroupInput() (+2 more)

### Community 2 - "Button"
Cohesion: 0.05
Nodes (169): AccountPage(), AccountCard(), AccountRow, AccountsPage(), DuplicateGroupCard(), FixDuplicatesPage(), highlightDifferences(), AllocatorPage() (+161 more)

### Community 3 - "app-sidebar.tsx"
Cohesion: 0.06
Nodes (63): metadata, RootLayout(), viewport, Boot(), Providers(), @vercel/analytics, @vercel/speed-insights, AllocatorTabs() (+55 more)

### Community 4 - "paginated-data-table.tsx"
Cohesion: 0.11
Nodes (42): framer-motion, @tanstack/react-table, DataTable(), PaginatedDataTable(), pageHref(), pageWindow(), PaginationFooter(), GroupHeaderRow() (+34 more)

### Community 5 - "combobox.tsx"
Cohesion: 0.15
Nodes (15): ComboboxChip(), ComboboxChips(), ComboboxChipsInput(), ComboboxClear(), ComboboxGroup(), ComboboxInput(), ComboboxLabel(), ComboboxSeparator() (+7 more)

### Community 6 - "dashboard.ts"
Cohesion: 0.14
Nodes (33): avg(), BREAKDOWN_MONTHS, buildCashflowHistory(), buildCategories(), buildComparison(), buildMonthlyBudgets(), buildProjection(), buildSeries() (+25 more)

### Community 7 - "compilerOptions"
Cohesion: 0.06
Nodes (33): compilerOptions, allowJs, allowSyntheticDefaultImports, allowUnusedLabels, esModuleInterop, forceConsistentCasingInFileNames, incremental, isolatedModules (+25 more)

### Community 8 - "daily-spending-chart.tsx"
Cohesion: 0.15
Nodes (26): recharts, BudgetActiveDot(), BudgetProgressChart(), BudgetProgressPoint, buildSeries(), colorChange(), CHART_INTRO_MS, useChartIntro() (+18 more)

### Community 9 - "(month)/page.tsx"
Cohesion: 0.10
Nodes (34): Comparison, comparisonRateText(), comparisonText(), ComparisonValue, DashboardData, DashboardMonthlyBudget, DashboardPage(), DashboardView (+26 more)

### Community 10 - "Application Dependencies"
Cohesion: 0.07
Nodes (30): dependencies, @base-ui/react, class-variance-authority, clsx, cmdk, dexie, dexie-react-hooks, @fontsource-variable/inter (+22 more)

### Community 11 - "Validator"
Cohesion: 0.22
Nodes (21): MonthlyBudgetDefaultRow, updateAccount(), validateBudget(), cleanInput(), createCategory(), updateCategory(), dismissDuplicatePair(), eligible() (+13 more)

### Community 12 - "sync/page.tsx"
Cohesion: 0.15
Nodes (24): COUNT_ROWS, DataSettingsPage(), StateRow(), STATUS_TONES, StatusTone, WorkspaceRow(), AlertDialog(), AlertDialogAction() (+16 more)

### Community 13 - "suspicious"
Cohesion: 0.07
Nodes (28): suspicious, noAssignInExpressions, noAsyncPromiseExecutor, noCatchAssign, noClassAssign, noCompareNegZero, noControlCharactersInRegex, noDebugger (+20 more)

### Community 14 - "auto-sync.ts"
Cohesion: 0.12
Nodes (25): SYNC_TABLES, useSyncStatus(), emit(), eventListeners, finishCycle(), flushOnHide(), getSyncSnapshot(), ingestManualResult() (+17 more)

### Community 15 - "package.json"
Cohesion: 0.07
Nodes (28): private, $schema, type, babel-plugin-react-compiler, @biomejs/biome, clsx, cmdk, @fontsource-variable/inter (+20 more)

### Community 16 - "correctness"
Cohesion: 0.08
Nodes (26): noConstantCondition, noConstAssign, noEmptyCharacterClassInRegex, noEmptyPattern, noGlobalObjectCalls, noInvalidBuiltinInstantiation, noInvalidConstructorSuper, noNonoctalDecimalEscape (+18 more)

### Community 17 - "records.ts"
Cohesion: 0.13
Nodes (19): AllocationRow, db, getMonthlyRecords(), MonthlyFilters, expandCategoryIdsForMonthly(), AllocationTally, pendingStatementIds(), tallyAllocations() (+11 more)

### Community 18 - "Input"
Cohesion: 0.33
Nodes (16): PendingStatementConfirmationSheet(), RecordOption(), RecordSearchSheet(), StatementOption(), StatementSearchSheet(), Input(), Sheet(), SheetContent() (+8 more)

### Community 19 - "category-filter.tsx"
Cohesion: 0.22
Nodes (14): lucide-react, FALLBACK_ICON_NAME, ICONS, CategoryFilter(), CategoryFilterItem(), Command(), CommandEmpty(), CommandGroup() (+6 more)

### Community 20 - "category-history-chart.tsx"
Cohesion: 0.31
Nodes (9): aggregateSeries(), CategoryHistoryChart(), ChartMonth, ChartSeries, HistoryTooltip(), MonthTick(), prepareMonths(), prepareSeries() (+1 more)

### Community 21 - "Next.js App Router"
Cohesion: 0.10
Nodes (10): Background Drive sync, CONTEXT.md, Dexie IndexedDB, First-run seed, Generated test data, JSON export/import, Installed Next.js documentation, React Compiler (+2 more)

### Community 22 - "Components Components"
Cohesion: 0.09
Nodes (21): aliases, components, hooks, lib, ui, utils, iconLibrary, menuAccent (+13 more)

### Community 23 - "drive-sync.ts"
Cohesion: 0.35
Nodes (18): exportData(), downloadBackupFile(), driveFetch(), findBackupFile(), getClockSkewMs(), getFileMeta(), isDriveConfigured(), uploadBackupFile() (+10 more)

### Community 24 - "test-data.ts"
Cohesion: 0.15
Nodes (18): DEFAULT_CATEGORIES, DEFAULT_MONTHLY_BUDGETS, EXPORT_VERSION, FinpointExport, seedIfEmpty(), BANK_BLURB, between(), CATEGORIES (+10 more)

### Community 25 - "export-import.ts"
Cohesion: 0.35
Nodes (8): importData(), parseImportFile(), TableName, TABLES, DEFAULT_SETTINGS, FinpointSettings, readSettings(), replaceSettings()

### Community 26 - "Fix Duplicates — UI redesign"
Cohesion: 0.50
Nodes (3): Fix Duplicates — UI redesign, Layout sketch, Out of scope

### Community 27 - "sidebar.tsx"
Cohesion: 0.13
Nodes (17): SidebarContext, SidebarContextProps, SidebarGroupAction(), SidebarGroupContent(), SidebarInput(), SidebarMenuAction(), SidebarMenuBadge(), sidebarMenuButtonVariants (+9 more)

### Community 28 - "importer/page.tsx"
Cohesion: 0.14
Nodes (35): ACCEPT, BANKS_REQUIRING_ADDITIONAL_INFO, ImporterPage(), Step(), asPending(), BANKS, AccountActivity, ensureAccount() (+27 more)

### Community 29 - "types.d.ts"
Cohesion: 0.11
Nodes (18): Account, Allocation, AnalyticsSummary, AnalyticsTreatment, Appearance, Budget, Category, CategoryWithChildren (+10 more)

### Community 30 - "Changed Bank Descriptions"
Cohesion: 0.11
Nodes (18): Drive Baseline Migration, Duplicate Dismissal Migration, Duplicate Allocation Resolution, Atomic Statement Cleanup, Dismissal Migration and Backup, Desktop and Mobile Smoke Checks, Conservative Duplicate Suggestions, Pair-specific Dismissals (+10 more)

### Community 31 - "auth-vault.ts"
Cohesion: 0.29
Nodes (14): POST(), POST(), POST(), jose, AUTH_COOKIE_NAME, authCookie(), authCookieConfig(), clientIp() (+6 more)

### Community 32 - "utils.ts"
Cohesion: 0.10
Nodes (35): BudgetState, MonthLayout(), @base-ui/react, luxon, react-day-picker, DateField(), Props, DateRange() (+27 more)

### Community 33 - "google-drive.ts"
Cohesion: 0.20
Nodes (14): AuthNeededError, cacheToken(), CodeResponse, DRIVE_FILENAME, DRIVE_SCOPE, DriveFileMeta, ensureDriveToken(), ensureDriveTokenSilent() (+6 more)

### Community 34 - "db.ts"
Cohesion: 0.07
Nodes (29): dexie, fake-indexeddb, AccountRow, AnalyticsMonthRow, BudgetRecordRow, BudgetRow, CategoryRow, DB_NAME (+21 more)

### Community 35 - "formatter"
Cohesion: 0.15
Nodes (13): arrowParentheses, bracketSameLine, bracketSpacing, jsxQuoteStyle, quoteProperties, quoteStyle, semicolons, trailingCommas (+5 more)

### Community 36 - "Record"
Cohesion: 0.23
Nodes (13): Account, Allocation, Budget, Category, Finpoint, Monthly Budget, Monthly Budget amount, Pending Record (+5 more)

### Community 38 - "Graph refresh after code tasks"
Cohesion: 0.20
Nodes (9): Graph health warnings, graphify-out/graph.json, graphify-out/.graphify_labels.json, graphify-out/manifest.json, graphify-out/GRAPH_REPORT.md, graphify skill, graphify update ., Local graph artifacts (+1 more)

### Community 39 - "biome.json"
Cohesion: 0.18
Nodes (10): source, assist, actions, files, includes, linter, enabled, overrides (+2 more)

### Community 40 - "rules"
Cohesion: 0.18
Nodes (11): noAdjacentSpacesInRegex, noBannedTypes, noExtraBooleanCast, noUselessCatch, noUselessThisAlias, noUselessTypeConstraint, rules, noFloatingPromises (+3 more)

### Community 41 - "cashflow-chart.tsx"
Cohesion: 0.31
Nodes (9): CashflowChart(), CashflowPoint, colorChange(), currencyOrDash(), LegendItem(), mobileAmount, seriesLabel(), StatefulActiveDot() (+1 more)

### Community 43 - "Style Guide"
Cohesion: 0.27
Nodes (10): APIs, Arguments, And Props, Code Style, Consistency, Core, Earning Its Place, Finpoint Style Additions, Grouping And Order, React / TypeScript Style (+2 more)

### Community 44 - "manifest.json"
Cohesion: 0.20
Nodes (9): background_color, description, display, icons, name, scope, short_name, start_url (+1 more)

### Community 46 - "devDependencies"
Cohesion: 0.20
Nodes (10): devDependencies, babel-plugin-react-compiler, @biomejs/biome, fake-indexeddb, @tailwindcss/postcss, @types/luxon, @types/node, @types/papaparse (+2 more)

### Community 47 - "Fix duplicate bank statements"
Cohesion: 0.22
Nodes (8): Fix duplicate bank statements, Further Notes, Implementation Decisions, Out of Scope, Problem Statement, Solution, Testing Decisions, User Stories

### Community 48 - "total-spending-chart.tsx"
Cohesion: 0.36
Nodes (8): LegendItem(), niceStep(), roundTick(), surplusAxis(), SurplusPoint, surplusZeroOffset(), TotalSpendingChart(), dayTicks()

### Community 49 - "Local Markdown Issue Tracker"
Cohesion: 0.25
Nodes (8): Local Agent Skills, Domain and Importer Tests, Domain Documentation Conflicts, Single-context Domain Docs, Local Tracker Operations, Spec and Ticket Files, Ticket Lifecycle, Local Markdown Issue Tracker

### Community 50 - "formatter"
Cohesion: 0.25
Nodes (8): formatter, attributePosition, enabled, formatWithErrors, indentStyle, indentWidth, lineEnding, lineWidth

### Community 51 - "Commit Guide"
Cohesion: 0.25
Nodes (4): Branches, Commit Guide, Commits, Pull Requests

### Community 52 - "Records"
Cohesion: 0.32
Nodes (8): Allocator, Budgets, Categories, Dashboard, Statement-allocation-record model, Monthly Budgets, Records, Statement importer

### Community 54 - "monthly-budget-usage.tsx"
Cohesion: 0.39
Nodes (6): arc(), centerCurrency(), MonthlyBudgetUsage(), MonthlyBudgetUsageItem, compactAmount, formatChartCurrency()

### Community 55 - "spending-calendar.tsx"
Cohesion: 0.36
Nodes (7): compact(), INK, LEVELS, quantile(), rampCap(), SpendingCalendar(), WEEKDAYS

### Community 56 - "optionalDependencies"
Cohesion: 0.29
Nodes (7): optionalDependencies, lightningcss-linux-x64-gnu, lightningcss-win32-x64-msvc, @rollup/rollup-linux-x64-gnu, @rollup/rollup-win32-x64-msvc, @tailwindcss/oxide-linux-x64-gnu, @tailwindcss/oxide-win32-x64-msvc

### Community 57 - "scripts"
Cohesion: 0.29
Nodes (7): scripts, build, dev, lint, lint:check, start, types:check

### Community 58 - "style"
Cohesion: 0.33
Nodes (6): style, noNamespace, noNonNullAssertion, useArrayLiterals, useAsConstAssertion, useBlockStatements

### Community 59 - "shell-header.tsx"
Cohesion: 0.48
Nodes (5): AppHeader(), ShellHeader(), TITLES, SidebarTrigger(), useMonthParams()

### Community 60 - "Finpoint icon concept"
Cohesion: 0.40
Nodes (5): Finpoint icon concept, Charcoal shadow halo, Circular point, Rounded F monogram, Off-white icon fill

### Community 61 - "Finpoint icon with charcoal shadow"
Cohesion: 0.40
Nodes (5): Finpoint icon with charcoal shadow, Charcoal shadow halo, Circular point, Rounded F monogram, Off-white icon fill

### Community 62 - "Issue tracker: Local Markdown"
Cohesion: 0.40
Nodes (4): Files, Issue tracker: Local Markdown, Skill operations, Status and dependencies

### Community 63 - "Finpoint"
Cohesion: 0.50
Nodes (4): Finpoint, Circular point, Rounded F monogram, Off-white icon fill

### Community 64 - "Domain docs"
Cohesion: 0.50
Nodes (3): Before exploration, Domain docs, Writing

### Community 66 - "Google Drive sync"
Cohesion: 0.50
Nodes (4): Google Drive sync, JSON backup and restore, Local-first finance tracking, Sync conflict handling

### Community 67 - "01: Review and fix duplicate bank statements in Workflows"
Cohesion: 0.50
Nodes (3): 01: Review and fix duplicate bank statements in Workflows, Completion evidence, PR preparation

### Community 68 - "F monogram icon"
Cohesion: 0.67
Nodes (3): Circular dot beside F, Rounded F letterform, F monogram icon

### Community 69 - "JPG favicon icon"
Cohesion: 0.67
Nodes (3): JPG favicon dot, JPG favicon F letterform, JPG favicon icon

### Community 70 - "PNG favicon icon"
Cohesion: 0.67
Nodes (3): PNG favicon dot, PNG favicon F letterform, PNG favicon icon

### Community 71 - "SVG favicon icon"
Cohesion: 0.67
Nodes (3): SVG favicon dot, SVG favicon F letterform, SVG favicon icon

### Community 72 - "F monogram icon"
Cohesion: 0.67
Nodes (3): Circular dot beside F, Rounded F letterform, F monogram icon

### Community 73 - "F monogram icon"
Cohesion: 0.67
Nodes (3): Circular dot beside F, Rounded F letterform, F monogram icon

### Community 74 - "cn"
Cohesion: 0.08
Nodes (36): radix-ui, AlertAction(), ButtonGroup(), ButtonGroupSeparator(), ButtonGroupText(), buttonGroupVariants, DropdownMenuCheckboxItem(), DropdownMenuContent() (+28 more)

### Community 83 - "statements.ts"
Cohesion: 0.17
Nodes (22): countSuggestions(), AnalyticsRecord, AnalyticsSummary, contribution(), summarize(), dayDifference(), ensureCanReplace(), maskDescription() (+14 more)

## Knowledge Gaps
- **98 isolated node(s):** `@fontsource-variable/inter`, `react-dom`, `shadcn`, `tailwindcss`, `tw-animate-css` (+93 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 537 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **9 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `cn()` connect `cn` to `utils.ts`, `record-editor.tsx`, `Button`, `app-sidebar.tsx`, `amount-filter.tsx`, `paginated-data-table.tsx`, `combobox.tsx`, `daily-spending-chart.tsx`, `(month)/page.tsx`, `shell-header.tsx`, `sync/page.tsx`, `total-spending-chart.tsx`, `Input`, `category-filter.tsx`, `monthly-budget-usage.tsx`, `spending-calendar.tsx`, `sidebar.tsx`, `importer/page.tsx`?**
  _High betweenness centrality (0.127) - this node is a cross-community bridge._
- **What connects `@fontsource-variable/inter`, `react-dom`, `shadcn` to the rest of the system?**
  _98 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `record-editor.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.08722741433021806 - nodes in this community are weakly interconnected._
- **Why does `react` connect `record-editor.tsx` to `amount-filter.tsx`, `Button`, `app-sidebar.tsx`, `paginated-data-table.tsx`, `combobox.tsx`, `daily-spending-chart.tsx`, `(month)/page.tsx`, `sync/page.tsx`, `auto-sync.ts`, `package.json`, `Input`, `category-filter.tsx`, `category-history-chart.tsx`, `sidebar.tsx`, `importer/page.tsx`, `utils.ts`, `total-spending-chart.tsx`, `monthly-budget-usage.tsx`, `shell-header.tsx`, `cn`?**
  _High betweenness centrality (0.041) - this node is a cross-community bridge._
- **Should `Button` be split into smaller, more focused modules?**
  _Cohesion score 0.05081504020865029 - nodes in this community are weakly interconnected._
- **Why does `luxon` connect `utils.ts` to `record-editor.tsx`, `Button`, `app-sidebar.tsx`, `paginated-data-table.tsx`, `dashboard.ts`, `daily-spending-chart.tsx`, `(month)/page.tsx`, `cashflow-chart.tsx`, `Validator`, `package.json`, `total-spending-chart.tsx`, `records.ts`, `spending-calendar.tsx`, `test-data.ts`, `export-import.ts`, `importer/page.tsx`?**
  _High betweenness centrality (0.031) - this node is a cross-community bridge._
- **Should `app-sidebar.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.06468797564687975 - nodes in this community are weakly interconnected._