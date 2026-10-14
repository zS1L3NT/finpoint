# Graph Report - t3-7b03443b  (2026-10-14)

## Corpus Check
- 47 files · ~118,002 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 1564 nodes · 5519 edges · 88 communities (77 shown, 11 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 67 edges (avg confidence: 0.88)
- Token cost: 46,953 input · 0 output

## Community Hubs (Navigation)
- Allocator Pages
- Record Dialogs
- Monthly Overview Page
- Database and Tests
- Auto Sync Status
- Date Fields
- Importer
- Data Settings Page
- Dashboard Charts
- Sidebar Primitives
- Currency Formatting
- Records and Budgets Logic
- Test Data and Seed
- App Sidebar
- Icons and Detail Pages
- Validation
- Statements Logic
- Domain Types
- Appearance and Toasts
- Monthly Records
- Review Cards and Tables
- Pagination
- Category History Chart
- Monthly Budget Amounts
- Settings Storage
- Data Table Components
- Shell Header
- Month Picker
- Dashboard Logic
- Monthly Records Logic
- Search Sheets and Filters
- Snapshot Hashing
- Google Drive Sync
- Combobox Inputs
- Menu UI Primitives
- OAuth Broker
- App Providers
- Routes and Workflow Tabs
- Category Filter
- Persistent State Hook
- Runtime Dependencies
- Package Manifest
- Biome Suspicious Rules
- Biome Correctness Rules
- Fix Duplicates Design
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
- Icon Registry
- Fix Duplicates Ticket
- TypeScript Config
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
- Crawler Policy
- Generated Demo Data
- Progressive Web App
- Project Notes
- Agent Workflow Docs
- Domain Glossary

## God Nodes (most connected - your core abstractions)
1. `cn()` - 309 edges
2. `react` - 90 edges
3. `Button()` - 83 edges
4. `formatCurrency()` - 79 edges
5. `RecordEditorDialog()` - 52 edges
6. `UiIcon()` - 46 edges
7. `RecordCreatorDialog()` - 44 edges
8. `next` - 41 edges
9. `PageContent()` - 40 edges
10. `Card()` - 39 edges

## Surprising Connections (you probably didn't know these)
- `Decisions` --references--> `Alert()`  [INFERRED]
  .scratch/fix-duplicates/design.md → src/components/ui/alert.tsx
- `Problems with the current page` --references--> `Alert()`  [INFERRED]
  .scratch/fix-duplicates/design.md → src/components/ui/alert.tsx
- `Decisions` --references--> `Badge()`  [INFERRED]
  .scratch/fix-duplicates/design.md → src/components/ui/badge.tsx
- `Decisions` --references--> `Empty()`  [INFERRED]
  .scratch/fix-duplicates/design.md → src/components/ui/empty.tsx
- `Problems with the current page` --references--> `Empty()`  [INFERRED]
  .scratch/fix-duplicates/design.md → src/components/ui/empty.tsx

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **Category supplies Treatment and Monthly Budget defaults for a Record** — context_category, context_treatment, context_monthly_budget, context_record [EXTRACTED 1.00]
- **Fix Duplicates workflow (choose keeper, delete, or mark separate)** — _scratch_fix_duplicates_design_keep_delete_toggle, _scratch_fix_duplicates_design_not_a_duplicate_action, src_components_dialogs_duplicate_review, _scratch_fix_duplicates_design_silent_completion [INFERRED 0.85]
- **Statement to Record via Allocation** — context_statement, context_allocation, context_record [EXTRACTED 1.00]

## Communities (88 total, 11 thin omitted)

### Community 0 - "Allocator Pages"
Cohesion: 0.06
Nodes (109): AccountRow, CandidatePage, CategoryDialogState, Props, RecordRow, RecordTableOptions, StatementRow, StatementTableOptions (+101 more)

### Community 1 - "Record Dialogs"
Cohesion: 0.08
Nodes (88): CategoryFormValues, PendingStatementValues, Props, Props, FieldErrorItem, FormFieldProps, Props, Props (+80 more)

### Community 10 - "Monthly Overview Page"
Cohesion: 0.11
Nodes (28): Comparison, ComparisonValue, DashboardData, DashboardMonthlyBudget, DashboardView, PaceData, Projection, WeekdayBreakdown (+20 more)

### Community 14 - "Database and Tests"
Cohesion: 0.08
Nodes (17): AccountRow, AnalyticsMonthRow, BudgetRecordRow, BudgetRow, CategoryRow, DuplicateDismissalRow, FinpointDB, MetaRow (+9 more)

### Community 15 - "Auto Sync Status"
Cohesion: 0.11
Nodes (25): AuthNeededError, SyncActivity, SyncEvent, SyncKind, SyncSnapshot, DriveSyncResult, useSyncStatus(), emit() (+17 more)

### Community 16 - "Date Fields"
Cohesion: 0.19
Nodes (21): BudgetState, Props, DateRangeValue, Props, Props, DateField(), DateRange(), formatRange() (+13 more)

### Community 17 - "Importer"
Cohesion: 0.20
Nodes (23): ImportResult, Parsed, Row, ValidationError, Step(), asPending(), ensureAccount(), combine() (+15 more)

### Community 18 - "Data Settings Page"
Cohesion: 0.16
Nodes (22): StatusTone, DataSettingsPage(), StateRow(), WorkspaceRow(), AlertDialog(), AlertDialogAction(), AlertDialogCancel(), AlertDialogContent() (+14 more)

### Community 2 - "Dashboard Charts"
Cohesion: 0.09
Nodes (47): BudgetProgressPoint, CashflowPoint, MonthlyBudgetLine, SurplusPoint, ChartConfig, ChartContextProps, TooltipNameType, CashflowHistoryMonth (+39 more)

### Community 20 - "Sidebar Primitives"
Cohesion: 0.12
Nodes (23): SidebarContextProps, Sidebar(), SidebarFooter(), SidebarGroupAction(), SidebarGroupContent(), SidebarHeader(), SidebarInput(), SidebarInset() (+15 more)

### Community 22 - "Currency Formatting"
Cohesion: 0.15
Nodes (19): MonthlyBudgetUsageItem, CandidateResults(), PendingCard(), AllocateBar(), arc(), centerCurrency(), MonthlyBudgetUsage(), compact() (+11 more)

### Community 23 - "Records and Budgets Logic"
Cohesion: 0.14
Nodes (21): BudgetFilters, ConflictError, RecordDetail, RecordFilters, RecordInput, RecordStatementInput, attachBudgetRecord(), detachBudgetRecord() (+13 more)

### Community 27 - "Test Data and Seed"
Cohesion: 0.15
Nodes (18): FinpointExport, Meal, seedIfEmpty(), between(), generateTestData(), pad(), pick(), stamp() (+10 more)

### Community 28 - "App Sidebar"
Cohesion: 0.19
Nodes (19): AppearanceOption, AppearanceSwitch(), AppSidebar(), SyncDot(), useSyncIndicator(), SidebarContent(), SidebarGroup(), SidebarGroupLabel() (+11 more)

### Community 29 - "Icons and Detail Pages"
Cohesion: 0.21
Nodes (14): Mover, StatementPage(), DetailSummary(), DetailSummaryItem(), DynamicUiIcon(), loadIcon(), normalize(), preloadCategoryIcons() (+6 more)

### Community 30 - "Validation"
Cohesion: 0.28
Nodes (10): CategoryInput, Validator, updateAccount(), validateBudget(), cleanInput(), createCategory(), updateCategory(), validateRecordInput() (+2 more)

### Community 31 - "Statements Logic"
Cohesion: 0.20
Nodes (16): ReplacementAllocation, ReplacementStatement, StatementFilters, StatementInput, dayDifference(), ensureCanReplace(), maskDescription(), replacementComparison() (+8 more)

### Community 32 - "Domain Types"
Cohesion: 0.11
Nodes (18): Account, Allocation, AnalyticsSummary, AnalyticsTreatment, Appearance, Budget, Category, CategoryWithChildren (+10 more)

### Community 35 - "Appearance and Toasts"
Cohesion: 0.23
Nodes (15): Appearance, ResolvedAppearance, Toaster(), applyAppearance(), getStoredAppearance(), handleSystemThemeChange(), initializeAppearance(), isDarkMode() (+7 more)

### Community 36 - "Monthly Records"
Cohesion: 0.17
Nodes (12): Filters, EditableRecord, MonthlyRecordFilters(), MonthlyRecordsPage(), armMonthTransition(), takeMonthDirection(), useMonthTransition(), useRecordEditor() (+4 more)

### Community 4 - "Review Cards and Tables"
Cohesion: 0.14
Nodes (39): ReplacementReview, ReviewAllocation, BudgetPage(), getBudgetAnalytics(), getCategoryData(), Legend(), ImporterPage(), EmptyRecords() (+31 more)

### Community 41 - "Pagination"
Cohesion: 0.38
Nodes (11): PaginationLinkProps, pageHref(), pageWindow(), PaginationFooter(), Pagination(), PaginationContent(), PaginationEllipsis(), PaginationItem() (+3 more)

### Community 42 - "Category History Chart"
Cohesion: 0.24
Nodes (11): ChartMonth, ChartSeries, SpendingSeries, SpendingHistoryMonth, aggregateSeries(), CategoryHistoryChart(), HistoryTooltip(), MonthTick() (+3 more)

### Community 46 - "Monthly Budget Amounts"
Cohesion: 0.29
Nodes (10): MonthlyBudgetDefaultRow, amountFor(), createMonthlyBudget(), defaultAmountFor(), setMonthlyBudgetAmount(), updateMonthlyBudget(), upsertMonthlyBudget(), validateAmount() (+2 more)

### Community 47 - "Settings Storage"
Cohesion: 0.33
Nodes (8): TableName, FinpointSettings, readSettings(), replaceSettings(), getSettings(), SYNC_TABLES, TABLES, DEFAULT_SETTINGS

### Community 5 - "Data Table Components"
Cohesion: 0.14
Nodes (33): RowGroup, State, RowEntrance, SelectionBar(), DataTable(), PaginatedDataTable(), PaginationHeader(), GroupHeaderRow() (+25 more)

### Community 56 - "Shell Header"
Cohesion: 0.39
Nodes (5): SearchInit, AppHeader(), ShellHeader(), useMonthParams(), TITLES

### Community 59 - "Month Picker"
Cohesion: 0.33
Nodes (6): ButtonVariant, Month, MonthCalProps, MonthCal(), MonthPicker(), MONTHS

### Community 6 - "Dashboard Logic"
Cohesion: 0.13
Nodes (37): AllocationRow, AnalyticsRecord, AnalyticsSummary, DashboardInput, LoadedTables, AllocationTally, contribution(), summarize() (+29 more)

### Community 60 - "Monthly Records Logic"
Cohesion: 0.48
Nodes (5): MonthlyFilters, getMonthlyRecords(), expandCategoryIdsForMonthly(), listRecords(), db

### Community 7 - "Search Sheets and Filters"
Cohesion: 0.19
Nodes (28): AmountRange, Draft, PendingStatementConfirmationSheet(), RecordOption(), RecordSearchSheet(), StatementOption(), StatementSearchSheet(), AmountFilter() (+20 more)

### Community 71 - "Snapshot Hashing"
Cohesion: 0.67
Nodes (3): Snapshot, digestSnapshot(), hashLegacySnapshot()

### Community 8 - "Google Drive Sync"
Cohesion: 0.17
Nodes (33): CodeResponse, DriveFileMeta, Window, driveStatus, DriveSyncOutcome, exportData(), cacheToken(), disconnectDrive() (+25 more)

### Community 24 - "Combobox Inputs"
Cohesion: 0.13
Nodes (17): ComboboxChip(), ComboboxChips(), ComboboxChipsInput(), ComboboxClear(), ComboboxGroup(), ComboboxInput(), ComboboxLabel(), ComboboxSeparator() (+9 more)

### Community 3 - "Menu UI Primitives"
Cohesion: 0.06
Nodes (44): MonthLayout(), AlertAction(), ButtonGroup(), ButtonGroupSeparator(), ButtonGroupText(), DropdownMenuCheckboxItem(), DropdownMenuContent(), DropdownMenuItem() (+36 more)

### Community 33 - "OAuth Broker"
Cohesion: 0.29
Nodes (14): POST(), POST(), POST(), authCookie(), authCookieConfig(), clientIp(), encryptionKey(), rateLimit() (+6 more)

### Community 37 - "App Providers"
Cohesion: 0.20
Nodes (10): RootLayout(), Boot(), Providers(), useSyncToasts(), subscribeSyncEvents(), listCategoryIconNames(), metadata, viewport (+2 more)

### Community 38 - "Routes and Workflow Tabs"
Cohesion: 0.29
Nodes (11): NotFound(), pathAccount(), pathAccounts(), pathAllocator(), pathAllocatorDuplicates(), pathAllocatorPending(), pathBudgets(), pathDashboard() (+3 more)

### Community 40 - "Category Filter"
Cohesion: 0.33
Nodes (11): CategoryFilter(), CategoryFilterItem(), Command(), CommandEmpty(), CommandGroup(), CommandInput(), CommandItem(), CommandList() (+3 more)

### Community 11 - "Runtime Dependencies"
Cohesion: 0.07
Nodes (30): dependencies, @base-ui/react, class-variance-authority, clsx, cmdk, dexie, dexie-react-hooks, @fontsource-variable/inter (+22 more)

### Community 12 - "Package Manifest"
Cohesion: 0.07
Nodes (28): private, $schema, type, babel-plugin-react-compiler, @biomejs/biome, clsx, cmdk, @fontsource-variable/inter (+20 more)

### Community 13 - "Biome Suspicious Rules"
Cohesion: 0.07
Nodes (28): suspicious, noAssignInExpressions, noAsyncPromiseExecutor, noCatchAssign, noClassAssign, noCompareNegZero, noControlCharactersInRegex, noDebugger (+20 more)

### Community 19 - "Biome Correctness Rules"
Cohesion: 0.08
Nodes (26): noConstantCondition, noConstAssign, noEmptyCharacterClassInRegex, noEmptyPattern, noGlobalObjectCalls, noInvalidBuiltinInstantiation, noInvalidConstructorSuper, noNonoctalDecimalEscape (+18 more)

### Community 21 - "Fix Duplicates Design"
Cohesion: 0.11
Nodes (20): Fix Duplicates — UI redesign, Layout sketch, Out of scope, dismissDuplicatePair, DuplicateGroup.allocations field, Marked separate view, Account, Allocation (+12 more)

### Community 26 - "shadcn Config"
Cohesion: 0.09
Nodes (21): aliases, components, hooks, lib, ui, utils, iconLibrary, menuAccent (+13 more)

### Community 39 - "Biome Formatter Options"
Cohesion: 0.15
Nodes (13): arrowParentheses, bracketSameLine, bracketSpacing, jsxQuoteStyle, quoteProperties, quoteStyle, semicolons, trailingCommas (+5 more)

### Community 44 - "Biome Linter Config"
Cohesion: 0.18
Nodes (10): source, assist, actions, files, includes, linter, enabled, overrides (+2 more)

### Community 45 - "Biome Complexity Rules"
Cohesion: 0.18
Nodes (11): noAdjacentSpacesInRegex, noBannedTypes, noExtraBooleanCast, noUselessCatch, noUselessThisAlias, noUselessTypeConstraint, rules, noFloatingPromises (+3 more)

### Community 48 - "Style Guide"
Cohesion: 0.27
Nodes (10): APIs, Arguments, And Props, Code Style, Consistency, Core, Earning Its Place, Finpoint Style Additions, Grouping And Order, React / TypeScript Style (+2 more)

### Community 49 - "Dev Dependencies"
Cohesion: 0.20
Nodes (10): devDependencies, babel-plugin-react-compiler, @biomejs/biome, fake-indexeddb, @tailwindcss/postcss, @types/luxon, @types/node, @types/papaparse (+2 more)

### Community 50 - "PWA Manifest"
Cohesion: 0.20
Nodes (9): background_color, description, display, icons, name, scope, short_name, start_url (+1 more)

### Community 51 - "Fix Duplicates Spec"
Cohesion: 0.22
Nodes (8): Fix duplicate bank statements, Further Notes, Implementation Decisions, Out of Scope, Problem Statement, Solution, Testing Decisions, User Stories

### Community 53 - "Biome Formatter Flags"
Cohesion: 0.25
Nodes (8): formatter, attributePosition, enabled, formatWithErrors, indentStyle, indentWidth, lineEnding, lineWidth

### Community 54 - "Commit Guide"
Cohesion: 0.25
Nodes (4): Branches, Commit Guide, Commits, Pull Requests

### Community 57 - "Optional Dependencies"
Cohesion: 0.29
Nodes (7): optionalDependencies, lightningcss-linux-x64-gnu, lightningcss-win32-x64-msvc, @rollup/rollup-linux-x64-gnu, @rollup/rollup-win32-x64-msvc, @tailwindcss/oxide-linux-x64-gnu, @tailwindcss/oxide-win32-x64-msvc

### Community 58 - "Package Scripts"
Cohesion: 0.29
Nodes (7): scripts, build, dev, lint, lint:check, start, types:check

### Community 61 - "Biome Style Rules"
Cohesion: 0.33
Nodes (6): style, noNamespace, noNonNullAssertion, useArrayLiterals, useAsConstAssertion, useBlockStatements

### Community 64 - "Issue Tracker Docs"
Cohesion: 0.40
Nodes (4): Files, Issue tracker: Local Markdown, Skill operations, Status and dependencies

### Community 66 - "Domain Docs"
Cohesion: 0.50
Nodes (3): Before exploration, Domain docs, Writing

### Community 69 - "Icon Registry"
Cohesion: 0.50
Nodes (3): FALLBACK_ICON_NAME, ICONS, lucide-react

### Community 70 - "Fix Duplicates Ticket"
Cohesion: 0.50
Nodes (3): 01: Review and fix duplicate bank statements in Workflows, Completion evidence, PR preparation

### Community 9 - "TypeScript Config"
Cohesion: 0.06
Nodes (33): compilerOptions, allowJs, allowSyntheticDefaultImports, allowUnusedLabels, esModuleInterop, forceConsistentCasingInFileNames, incremental, isolatedModules (+25 more)

### Community 25 - "Architecture Overview"
Cohesion: 0.10
Nodes (10): Background Drive sync, Dexie IndexedDB, First-run seed, Generated test data, JSON export/import, React Compiler, Root Suspense, Versioned migrations (+2 more)

### Community 43 - "Project Graph Docs"
Cohesion: 0.20
Nodes (9): Graph health warnings, graphify skill, graphify update ., Local graph artifacts, Project Graph, graphify-out/graph.json, graphify-out/.graphify_labels.json, graphify-out/manifest.json (+1 more)

### Community 55 - "Domain Areas"
Cohesion: 0.32
Nodes (8): Allocator, Budgets, Categories, Dashboard, Statement-allocation-record model, Monthly Budgets, Records, Statement importer

### Community 62 - "Icon Concept"
Cohesion: 0.40
Nodes (5): Charcoal shadow halo, Circular point, Rounded F monogram, Off-white icon fill, Finpoint icon concept

### Community 63 - "Icon Shadow Variant"
Cohesion: 0.40
Nodes (5): Charcoal shadow halo, Circular point, Rounded F monogram, Off-white icon fill, Finpoint icon with charcoal shadow

### Community 65 - "Finpoint Icon"
Cohesion: 0.50
Nodes (4): Circular point, Rounded F monogram, Off-white icon fill, Finpoint

### Community 68 - "Product Features"
Cohesion: 0.50
Nodes (4): Google Drive sync, JSON backup and restore, Local-first finance tracking, Sync conflict handling

### Community 72 - "F Monogram Icon A"
Cohesion: 0.67
Nodes (3): Circular dot beside F, Rounded F letterform, F monogram icon

### Community 73 - "JPG Favicon"
Cohesion: 0.67
Nodes (3): JPG favicon dot, JPG favicon F letterform, JPG favicon icon

### Community 74 - "PNG Favicon"
Cohesion: 0.67
Nodes (3): PNG favicon dot, PNG favicon F letterform, PNG favicon icon

### Community 75 - "SVG Favicon"
Cohesion: 0.67
Nodes (3): SVG favicon dot, SVG favicon F letterform, SVG favicon icon

### Community 76 - "F Monogram Icon B"
Cohesion: 0.67
Nodes (3): Circular dot beside F, Rounded F letterform, F monogram icon

### Community 77 - "F Monogram Icon C"
Cohesion: 0.67
Nodes (3): Circular dot beside F, Rounded F letterform, F monogram icon

### Community 34 - "Project Notes"
Cohesion: 0.11
Nodes (18): Importer Test Isolation, Drive Baseline Migration, Dismissal Migration and Backup, Changed Bank Descriptions, Desktop and Mobile Smoke Checks, Duplicate Dismissal Migration, Grouped Statement Review, Duplicate Eligibility (+10 more)

### Community 52 - "Agent Workflow Docs"
Cohesion: 0.25
Nodes (8): Single-context Domain Docs, Spec and Ticket Files, Local Tracker Operations, Ticket Lifecycle, Domain and Importer Tests, Local Markdown Issue Tracker, Local Agent Skills, Domain Documentation Conflicts

## Knowledge Gaps
- **99 isolated node(s):** `Background Drive sync`, `First-run seed`, `Generated test data`, `JSON export/import`, `React Compiler` (+94 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 548 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **11 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `cn()` connect `Menu UI Primitives` to `Allocator Pages`, `Record Dialogs`, `Dashboard Charts`, `Review Cards and Tables`, `Data Table Components`, `Search Sheets and Filters`, `Monthly Overview Page`, `Date Fields`, `Importer`, `Data Settings Page`, `Sidebar Primitives`, `Currency Formatting`, `Combobox Inputs`, `App Sidebar`, `Icons and Detail Pages`, `Monthly Records`, `Routes and Workflow Tabs`, `Category Filter`, `Pagination`, `Month Picker`?**
  _High betweenness centrality (0.155) - this node is a cross-community bridge._
- **What connects `Background Drive sync`, `First-run seed`, `Generated test data` to the rest of the system?**
  _99 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Allocator Pages` be split into smaller, more focused modules?**
  _Cohesion score 0.05501519756838906 - nodes in this community are weakly interconnected._
- **Why does `react` connect `Search Sheets and Filters` to `Allocator Pages`, `Record Dialogs`, `Dashboard Charts`, `Menu UI Primitives`, `Review Cards and Tables`, `Data Table Components`, `Monthly Overview Page`, `Package Manifest`, `Auto Sync Status`, `Date Fields`, `Importer`, `Data Settings Page`, `Sidebar Primitives`, `Currency Formatting`, `Combobox Inputs`, `Icons and Detail Pages`, `Appearance and Toasts`, `Monthly Records`, `App Providers`, `Category Filter`, `Pagination`, `Category History Chart`, `Shell Header`, `Month Picker`, `Persistent State Hook`?**
  _High betweenness centrality (0.076) - this node is a cross-community bridge._
- **Should `Record Dialogs` be split into smaller, more focused modules?**
  _Cohesion score 0.08185840707964602 - nodes in this community are weakly interconnected._
- **Why does `dependencies` connect `Runtime Dependencies` to `Package Manifest`?**
  _High betweenness centrality (0.038) - this node is a cross-community bridge._
- **Should `Monthly Overview Page` be split into smaller, more focused modules?**
  _Cohesion score 0.11397849462365592 - nodes in this community are weakly interconnected._