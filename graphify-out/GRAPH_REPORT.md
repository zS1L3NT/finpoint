# Graph Report - t3-7b03443b  (2026-10-14)

## Corpus Check
- 3 files · ~118,062 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 1568 nodes · 5519 edges · 87 communities (76 shown, 11 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 67 edges (avg confidence: 0.88)
- Token cost: 40,938 input · 0 output

## Community Hubs (Navigation)
- Record Dialogs
- Date Fields
- Database Schema
- Records and Budgets Logic
- Fix Duplicates Page
- Auto Sync Status
- Record Columns
- Account Pages
- Validation
- Data Settings Page
- Budget Progress Chart
- Statements Logic
- Routes and Workflow Tabs
- Test Data and Seed
- Data Table Components
- Importer
- Drive Backup
- Domain Types
- Pending Allocator Page
- Appearance and Toasts
- Google Drive Client
- Next Config
- Test Setup and Hashing
- Review Cards and Tables
- Chart Primitives
- Cashflow Chart
- Settings Storage
- Monthly Budget Usage Chart
- Total Spending Chart
- Sidebar Primitives
- Shell Header
- Combobox Inputs
- Monthly Overview Page
- Dashboard Logic
- Search Sheets and Filters
- OAuth Broker
- Spending Calendar
- App Providers
- Menu UI Primitives
- Persistent State Hook
- TypeScript Config
- Package Manifest
- Runtime Dependencies
- Fix Duplicates Design
- Biome Suspicious Rules
- Biome Correctness Rules
- shadcn Config
- Biome Formatter Options
- Biome Linter Config
- Biome Complexity Rules
- Style Guide
- Dev Dependencies
- PWA Manifest
- Fix Duplicates Spec
- Biome Formatter Flags
- Commit Guide
- Optional Dependencies
- Package Scripts
- Biome Style Rules
- Issue Tracker Docs
- Domain Docs
- Fix Duplicates Ticket
- Architecture Overview
- Project Graph Docs
- Domain Areas
- Icon Concept
- Icon Shadow Variant
- Finpoint Icon
- Product Features
- F Monogram Icon A
- JPG Favicon
- PNG Favicon
- SVG Favicon
- F Monogram Icon B
- F Monogram Icon C
- Next Dev Server Rule
- App Icon Palette
- Biome Checks
- String Primary Keys
- Domain Glossary
- Crawler Policy
- Generated Demo Data
- Progressive Web App
- Project Notes
- Agent Workflow Docs

## God Nodes (most connected - your core abstractions)
1. `cn()` - 309 edges
2. `react` - 90 edges
3. `Button()` - 83 edges
4. `formatCurrency()` - 78 edges
5. `RecordEditorDialog()` - 52 edges
6. `UiIcon()` - 46 edges
7. `RecordCreatorDialog()` - 44 edges
8. `next` - 41 edges
9. `PageContent()` - 40 edges
10. `Card()` - 39 edges

## Surprising Connections (you probably didn't know these)
- `Decisions` --references--> `DuplicateGroup`  [INFERRED]
  .scratch/fix-duplicates/design.md → src/logic/duplicates.ts
- `Decisions` --references--> `Alert()`  [INFERRED]
  .scratch/fix-duplicates/design.md → src/components/ui/alert.tsx
- `Decisions` --references--> `Button()`  [INFERRED]
  .scratch/fix-duplicates/design.md → src/components/ui/button.tsx
- `Decisions` --references--> `Empty()`  [INFERRED]
  .scratch/fix-duplicates/design.md → src/components/ui/empty.tsx
- `Decisions` --references--> `dismissedDuplicatePairs()`  [INFERRED]
  .scratch/fix-duplicates/design.md → src/logic/duplicates.ts

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **Category supplies Treatment and Monthly Budget defaults for a Record** — context_category, context_treatment, context_monthly_budget, context_record [EXTRACTED 1.00]
- **Category supplies Treatment and Monthly Budget defaults for a Record** — context_category, context_treatment, context_monthly_budget, context_record [EXTRACTED 1.00]
- **Monthly Budget amount rules (exactly one per month)** — context_monthly_budget_amount, context_amount_rule_default, context_amount_rule_override_one_month, context_amount_rule_override_default [EXTRACTED 1.00]
- **Statement-to-Record allocation model** — context_statement, context_record, context_allocation, context_pending_record, context_pending_statement [EXTRACTED 1.00]
- **Statement to Record via Allocation** — context_statement, context_allocation, context_record [EXTRACTED 1.00]
- **Fix Duplicates workflow (choose keeper, delete, or mark separate)** — _scratch_fix_duplicates_design_keep_delete_toggle, _scratch_fix_duplicates_design_not_a_duplicate_action, src_components_dialogs_duplicate_review, _scratch_fix_duplicates_design_silent_completion [INFERRED 0.85]

## Communities (87 total, 11 thin omitted)

### Community 0 - "Record Dialogs"
Cohesion: 0.09
Nodes (85): CategoryFormValues, PendingStatementValues, Props, Props, Props, ErrorItem, AccountDialog(), BudgetCreatorDialog() (+77 more)

### Community 1 - "Date Fields"
Cohesion: 0.06
Nodes (68): BudgetState, Props, DateRangeValue, Props, Props, FieldErrorItem, FormFieldProps, ButtonVariant (+60 more)

### Community 10 - "Database Schema"
Cohesion: 0.08
Nodes (29): AccountRow, AllocationRow, AnalyticsMonthRow, BudgetRecordRow, BudgetRow, DuplicateDismissalRow, FinpointDB, MetaRow (+21 more)

### Community 13 - "Records and Budgets Logic"
Cohesion: 0.12
Nodes (27): BudgetFilters, ConflictError, RecordDetail, RecordFilters, RecordInput, RecordStatementInput, attachBudgetRecord(), createBudget() (+19 more)

### Community 14 - "Fix Duplicates Page"
Cohesion: 0.17
Nodes (28): DuplicateGroup, FixDuplicatesInput, DuplicateGroupCard(), FixDuplicatesPage(), GroupHeader(), highlightDifferences(), DuplicateReviewDialog(), StatementTile() (+20 more)

### Community 17 - "Auto Sync Status"
Cohesion: 0.11
Nodes (26): SyncActivity, SyncEvent, SyncKind, SyncSnapshot, DriveSyncResult, useSyncStatus(), useSyncToasts(), emit() (+18 more)

### Community 19 - "Record Columns"
Cohesion: 0.16
Nodes (24): RecordRow, RecordTableOptions, StatementRow, StatementTableOptions, MonthlyBudgetBadge(), amountTone(), formatRowTime(), PendingBadge() (+16 more)

### Community 2 - "Account Pages"
Cohesion: 0.14
Nodes (40): AccountRow, Filters, Props, EditableRecord, MonthlyRecordFilters(), MonthlyRecordsPage(), RecordCreatorHost(), RecordFilters() (+32 more)

### Community 20 - "Validation"
Cohesion: 0.18
Nodes (15): AccountActivity, CategoryInput, FieldErrors, Validator, getAccount(), updateAccount(), validateBudget(), cleanInput() (+7 more)

### Community 21 - "Data Settings Page"
Cohesion: 0.16
Nodes (22): StatusTone, DataSettingsPage(), StateRow(), WorkspaceRow(), AlertDialog(), AlertDialogAction(), AlertDialogCancel(), AlertDialogContent() (+14 more)

### Community 23 - "Budget Progress Chart"
Cohesion: 0.15
Nodes (19): BudgetProgressPoint, ChartMonth, ChartSeries, SpendingSeries, MonthlyBudgetLine, BudgetActiveDot(), BudgetProgressChart(), buildSeries() (+11 more)

### Community 25 - "Statements Logic"
Cohesion: 0.15
Nodes (21): AnalyticsRecord, AnalyticsSummary, ReplacementAllocation, ReplacementStatement, StatementFilters, StatementInput, contribution(), summarize() (+13 more)

### Community 26 - "Routes and Workflow Tabs"
Cohesion: 0.15
Nodes (19): CategoryDialogState, CategoriesPage(), CategoryTile(), NotFound(), useDefaultFilterEndDateToday(), useDefaultFilterStartDate(), useSettings(), listCategories() (+11 more)

### Community 29 - "Test Data and Seed"
Cohesion: 0.15
Nodes (18): FinpointExport, Meal, seedIfEmpty(), between(), generateTestData(), pad(), pick(), stamp() (+10 more)

### Community 3 - "Data Table Components"
Cohesion: 0.11
Nodes (39): RowGroup, State, RowEntrance, SelectionBar(), DataTable(), PaginatedDataTable(), PaginationHeader(), GroupHeaderRow() (+31 more)

### Community 30 - "Importer"
Cohesion: 0.26
Nodes (19): ImportResult, Parsed, Row, ValidationError, asPending(), ensureAccount(), combine(), dbsDescriptionKey() (+11 more)

### Community 31 - "Drive Backup"
Cohesion: 0.30
Nodes (20): driveStatus, DriveSyncOutcome, exportData(), disconnectDrive(), downloadBackupFile(), driveFetch(), findBackupFile(), getClockSkewMs() (+12 more)

### Community 32 - "Domain Types"
Cohesion: 0.11
Nodes (18): Account, Allocation, AnalyticsSummary, AnalyticsTreatment, Appearance, Budget, Category, CategoryWithChildren (+10 more)

### Community 33 - "Pending Allocator Page"
Cohesion: 0.21
Nodes (14): CandidatePage, AccountPage(), AllocatorPendingPage(), CandidateResults(), countSuggestions(), PendingCard(), AllocateBar(), RecordAmount() (+6 more)

### Community 36 - "Appearance and Toasts"
Cohesion: 0.23
Nodes (15): Appearance, ResolvedAppearance, Toaster(), applyAppearance(), getStoredAppearance(), handleSystemThemeChange(), initializeAppearance(), isDarkMode() (+7 more)

### Community 37 - "Google Drive Client"
Cohesion: 0.20
Nodes (14): AuthNeededError, CodeResponse, DriveFileMeta, Window, cacheToken(), ensureDriveToken(), ensureDriveTokenSilent(), googleClientId() (+6 more)

### Community 38 - "Next Config"
Cohesion: 0.18
Nodes (8): Mover, HistoryItem, getStoredHistory(), HistoryProvider(), useHistory(), nextConfig, HistoryContext, next

### Community 39 - "Test Setup and Hashing"
Cohesion: 0.18
Nodes (5): Snapshot, digestSnapshot(), hashLegacySnapshot(), dexie, fake-indexeddb

### Community 4 - "Review Cards and Tables"
Cohesion: 0.15
Nodes (41): ReplacementReview, ReviewAllocation, BudgetPage(), getBudgetAnalytics(), getCategoryData(), Legend(), BudgetsPage(), ImporterPage() (+33 more)

### Community 41 - "Chart Primitives"
Cohesion: 0.22
Nodes (12): ChartConfig, ChartContextProps, TooltipNameType, ChartContainer(), ChartLegendContent(), ChartStyle(), ChartTooltipContent(), getPayloadConfigFromPayload() (+4 more)

### Community 47 - "Cashflow Chart"
Cohesion: 0.31
Nodes (9): CashflowPoint, CashflowChart(), colorChange(), currencyOrDash(), LegendItem(), seriesLabel(), StatefulActiveDot(), dayTicks() (+1 more)

### Community 48 - "Settings Storage"
Cohesion: 0.33
Nodes (8): TableName, FinpointSettings, readSettings(), replaceSettings(), getSettings(), SYNC_TABLES, TABLES, DEFAULT_SETTINGS

### Community 52 - "Monthly Budget Usage Chart"
Cohesion: 0.29
Nodes (7): MonthlyBudgetUsageItem, arc(), centerCurrency(), MonthlyBudgetUsage(), formatChartCurrency(), WEEKDAYS, compactAmount

### Community 53 - "Total Spending Chart"
Cohesion: 0.33
Nodes (9): SurplusPoint, CashflowHistoryMonth, LegendItem(), niceStep(), roundTick(), surplusAxis(), surplusZeroOffset(), TotalSpendingChart() (+1 more)

### Community 6 - "Sidebar Primitives"
Cohesion: 0.09
Nodes (38): AppearanceOption, SidebarContextProps, AppearanceSwitch(), AppSidebar(), SyncDot(), useSyncIndicator(), SidebarContent(), SidebarFooter() (+30 more)

### Community 61 - "Shell Header"
Cohesion: 0.43
Nodes (5): SearchInit, AppHeader(), ShellHeader(), useMonthParams(), TITLES

### Community 7 - "Combobox Inputs"
Cohesion: 0.10
Nodes (29): Props, AmountRange, Draft, AmountFilter(), describe(), readRange(), upperBound(), ComboboxChip() (+21 more)

### Community 8 - "Monthly Overview Page"
Cohesion: 0.11
Nodes (33): Comparison, ComparisonValue, DashboardData, DashboardMonthlyBudget, DashboardView, PaceData, Projection, WeekdayBreakdown (+25 more)

### Community 9 - "Dashboard Logic"
Cohesion: 0.12
Nodes (34): CategoryRow, MonthlyBudgetAmountRow, RecordRow, StatementRow, DashboardInput, LoadedTables, SpendingHistoryMonth, TrendMonth (+26 more)

### Community 24 - "Search Sheets and Filters"
Cohesion: 0.29
Nodes (18): PendingStatementConfirmationSheet(), RecordOption(), RecordSearchSheet(), StatementOption(), StatementSearchSheet(), Badge(), Input(), Sheet() (+10 more)

### Community 35 - "OAuth Broker"
Cohesion: 0.32
Nodes (13): POST(), POST(), POST(), authCookie(), authCookieConfig(), clientIp(), encryptionKey(), rateLimit() (+5 more)

### Community 42 - "Spending Calendar"
Cohesion: 0.23
Nodes (9): compact(), quantile(), rampCap(), SpendingCalendar(), INK, LEVELS, WEEKDAYS, currencyFormat (+1 more)

### Community 44 - "App Providers"
Cohesion: 0.24
Nodes (8): RootLayout(), Boot(), Providers(), SidebarInset(), SidebarProvider(), TooltipProvider(), metadata, viewport

### Community 5 - "Menu UI Primitives"
Cohesion: 0.08
Nodes (35): ButtonGroup(), ButtonGroupSeparator(), ButtonGroupText(), DropdownMenuCheckboxItem(), DropdownMenuContent(), DropdownMenuItem(), DropdownMenuLabel(), DropdownMenuRadioItem() (+27 more)

### Community 11 - "TypeScript Config"
Cohesion: 0.06
Nodes (33): compilerOptions, allowJs, allowSyntheticDefaultImports, allowUnusedLabels, esModuleInterop, forceConsistentCasingInFileNames, incremental, isolatedModules (+25 more)

### Community 12 - "Package Manifest"
Cohesion: 0.06
Nodes (31): private, $schema, type, babel-plugin-react-compiler, @biomejs/biome, clsx, cmdk, @fontsource-variable/inter (+23 more)

### Community 15 - "Runtime Dependencies"
Cohesion: 0.07
Nodes (30): dependencies, @base-ui/react, class-variance-authority, clsx, cmdk, dexie, dexie-react-hooks, @fontsource-variable/inter (+22 more)

### Community 16 - "Fix Duplicates Design"
Cohesion: 0.11
Nodes (21): Fix Duplicates — UI redesign, Layout sketch, Out of scope, dismissDuplicatePair, DuplicateGroup.allocations field, Marked separate view, Account, Allocation (+13 more)

### Community 18 - "Biome Suspicious Rules"
Cohesion: 0.07
Nodes (28): suspicious, noAssignInExpressions, noAsyncPromiseExecutor, noCatchAssign, noClassAssign, noCompareNegZero, noControlCharactersInRegex, noDebugger (+20 more)

### Community 22 - "Biome Correctness Rules"
Cohesion: 0.08
Nodes (26): noConstantCondition, noConstAssign, noEmptyCharacterClassInRegex, noEmptyPattern, noGlobalObjectCalls, noInvalidBuiltinInstantiation, noInvalidConstructorSuper, noNonoctalDecimalEscape (+18 more)

### Community 28 - "shadcn Config"
Cohesion: 0.09
Nodes (21): aliases, components, hooks, lib, ui, utils, iconLibrary, menuAccent (+13 more)

### Community 40 - "Biome Formatter Options"
Cohesion: 0.15
Nodes (13): arrowParentheses, bracketSameLine, bracketSpacing, jsxQuoteStyle, quoteProperties, quoteStyle, semicolons, trailingCommas (+5 more)

### Community 45 - "Biome Linter Config"
Cohesion: 0.18
Nodes (10): source, assist, actions, files, includes, linter, enabled, overrides (+2 more)

### Community 46 - "Biome Complexity Rules"
Cohesion: 0.18
Nodes (11): noAdjacentSpacesInRegex, noBannedTypes, noExtraBooleanCast, noUselessCatch, noUselessThisAlias, noUselessTypeConstraint, rules, noFloatingPromises (+3 more)

### Community 49 - "Style Guide"
Cohesion: 0.27
Nodes (10): APIs, Arguments, And Props, Code Style, Consistency, Core, Earning Its Place, Finpoint Style Additions, Grouping And Order, React / TypeScript Style (+2 more)

### Community 50 - "Dev Dependencies"
Cohesion: 0.20
Nodes (10): devDependencies, babel-plugin-react-compiler, @biomejs/biome, fake-indexeddb, @tailwindcss/postcss, @types/luxon, @types/node, @types/papaparse (+2 more)

### Community 51 - "PWA Manifest"
Cohesion: 0.20
Nodes (9): background_color, description, display, icons, name, scope, short_name, start_url (+1 more)

### Community 54 - "Fix Duplicates Spec"
Cohesion: 0.22
Nodes (8): Fix duplicate bank statements, Further Notes, Implementation Decisions, Out of Scope, Problem Statement, Solution, Testing Decisions, User Stories

### Community 56 - "Biome Formatter Flags"
Cohesion: 0.25
Nodes (8): formatter, attributePosition, enabled, formatWithErrors, indentStyle, indentWidth, lineEnding, lineWidth

### Community 57 - "Commit Guide"
Cohesion: 0.25
Nodes (4): Branches, Commit Guide, Commits, Pull Requests

### Community 59 - "Optional Dependencies"
Cohesion: 0.29
Nodes (7): optionalDependencies, lightningcss-linux-x64-gnu, lightningcss-win32-x64-msvc, @rollup/rollup-linux-x64-gnu, @rollup/rollup-win32-x64-msvc, @tailwindcss/oxide-linux-x64-gnu, @tailwindcss/oxide-win32-x64-msvc

### Community 60 - "Package Scripts"
Cohesion: 0.29
Nodes (7): scripts, build, dev, lint, lint:check, start, types:check

### Community 62 - "Biome Style Rules"
Cohesion: 0.33
Nodes (6): style, noNamespace, noNonNullAssertion, useArrayLiterals, useAsConstAssertion, useBlockStatements

### Community 65 - "Issue Tracker Docs"
Cohesion: 0.40
Nodes (4): Files, Issue tracker: Local Markdown, Skill operations, Status and dependencies

### Community 67 - "Domain Docs"
Cohesion: 0.50
Nodes (3): Before exploration, Domain docs, Writing

### Community 70 - "Fix Duplicates Ticket"
Cohesion: 0.50
Nodes (3): 01: Review and fix duplicate bank statements in Workflows, Completion evidence, PR preparation

### Community 27 - "Architecture Overview"
Cohesion: 0.10
Nodes (10): Background Drive sync, Dexie IndexedDB, First-run seed, Generated test data, JSON export/import, React Compiler, Root Suspense, Versioned migrations (+2 more)

### Community 43 - "Project Graph Docs"
Cohesion: 0.20
Nodes (9): Graph health warnings, graphify skill, graphify update ., Local graph artifacts, Project Graph, graphify-out/graph.json, graphify-out/.graphify_labels.json, graphify-out/manifest.json (+1 more)

### Community 58 - "Domain Areas"
Cohesion: 0.32
Nodes (8): Allocator, Budgets, Categories, Dashboard, Statement-allocation-record model, Monthly Budgets, Records, Statement importer

### Community 63 - "Icon Concept"
Cohesion: 0.40
Nodes (5): Charcoal shadow halo, Circular point, Rounded F monogram, Off-white icon fill, Finpoint icon concept

### Community 64 - "Icon Shadow Variant"
Cohesion: 0.40
Nodes (5): Charcoal shadow halo, Circular point, Rounded F monogram, Off-white icon fill, Finpoint icon with charcoal shadow

### Community 66 - "Finpoint Icon"
Cohesion: 0.50
Nodes (4): Circular point, Rounded F monogram, Off-white icon fill, Finpoint

### Community 69 - "Product Features"
Cohesion: 0.50
Nodes (4): Google Drive sync, JSON backup and restore, Local-first finance tracking, Sync conflict handling

### Community 71 - "F Monogram Icon A"
Cohesion: 0.67
Nodes (3): Circular dot beside F, Rounded F letterform, F monogram icon

### Community 72 - "JPG Favicon"
Cohesion: 0.67
Nodes (3): JPG favicon dot, JPG favicon F letterform, JPG favicon icon

### Community 73 - "PNG Favicon"
Cohesion: 0.67
Nodes (3): PNG favicon dot, PNG favicon F letterform, PNG favicon icon

### Community 74 - "SVG Favicon"
Cohesion: 0.67
Nodes (3): SVG favicon dot, SVG favicon F letterform, SVG favicon icon

### Community 75 - "F Monogram Icon B"
Cohesion: 0.67
Nodes (3): Circular dot beside F, Rounded F letterform, F monogram icon

### Community 76 - "F Monogram Icon C"
Cohesion: 0.67
Nodes (3): Circular dot beside F, Rounded F letterform, F monogram icon

### Community 34 - "Project Notes"
Cohesion: 0.11
Nodes (18): Importer Test Isolation, Drive Baseline Migration, Dismissal Migration and Backup, Changed Bank Descriptions, Desktop and Mobile Smoke Checks, Duplicate Dismissal Migration, Grouped Statement Review, Duplicate Eligibility (+10 more)

### Community 55 - "Agent Workflow Docs"
Cohesion: 0.25
Nodes (8): Single-context Domain Docs, Spec and Ticket Files, Local Tracker Operations, Ticket Lifecycle, Domain and Importer Tests, Local Markdown Issue Tracker, Local Agent Skills, Domain Documentation Conflicts

## Knowledge Gaps
- **97 isolated node(s):** `babel-plugin-react-compiler`, `@biomejs/biome`, `@fontsource-variable/inter`, `lightningcss-linux-x64-gnu`, `lightningcss-win32-x64-msvc` (+92 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 547 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **11 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `cn()` connect `Menu UI Primitives` to `Record Dialogs`, `Date Fields`, `Account Pages`, `Data Table Components`, `Review Cards and Tables`, `Sidebar Primitives`, `Combobox Inputs`, `Monthly Overview Page`, `Fix Duplicates Page`, `Record Columns`, `Data Settings Page`, `Search Sheets and Filters`, `Routes and Workflow Tabs`, `Pending Allocator Page`, `Next Config`, `Chart Primitives`, `Spending Calendar`, `App Providers`, `Monthly Budget Usage Chart`, `Total Spending Chart`?**
  _High betweenness centrality (0.151) - this node is a cross-community bridge._
- **What connects `babel-plugin-react-compiler`, `@biomejs/biome`, `@fontsource-variable/inter` to the rest of the system?**
  _97 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Record Dialogs` be split into smaller, more focused modules?**
  _Cohesion score 0.08632268632268632 - nodes in this community are weakly interconnected._
- **Why does `react` connect `Record Dialogs` to `Date Fields`, `Account Pages`, `Data Table Components`, `Review Cards and Tables`, `Menu UI Primitives`, `Sidebar Primitives`, `Combobox Inputs`, `Monthly Overview Page`, `Package Manifest`, `Fix Duplicates Page`, `Auto Sync Status`, `Record Columns`, `Data Settings Page`, `Budget Progress Chart`, `Search Sheets and Filters`, `Routes and Workflow Tabs`, `Pending Allocator Page`, `Appearance and Toasts`, `Next Config`, `Chart Primitives`, `App Providers`, `Monthly Budget Usage Chart`, `Total Spending Chart`, `Shell Header`, `Persistent State Hook`?**
  _High betweenness centrality (0.065) - this node is a cross-community bridge._
- **Should `Date Fields` be split into smaller, more focused modules?**
  _Cohesion score 0.05540499849442939 - nodes in this community are weakly interconnected._
- **Why does `next` connect `Next Config` to `Record Dialogs`, `Date Fields`, `Account Pages`, `Data Table Components`, `Review Cards and Tables`, `Sidebar Primitives`, `Monthly Overview Page`, `Package Manifest`, `Fix Duplicates Page`, `Record Columns`, `Data Settings Page`, `Budget Progress Chart`, `Routes and Workflow Tabs`, `Pending Allocator Page`, `OAuth Broker`, `App Providers`, `Cashflow Chart`, `Total Spending Chart`, `Shell Header`?**
  _High betweenness centrality (0.041) - this node is a cross-community bridge._
- **Should `Database Schema` be split into smaller, more focused modules?**
  _Cohesion score 0.08067226890756303 - nodes in this community are weakly interconnected._