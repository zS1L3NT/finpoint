# Graph Report - t3-c0745187  (2026-10-14)

## Corpus Check
- 200 files · ~112,437 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 9 file(s) not represented in the graph (top: (none) 5, .example 1, .lock 1)

## Summary
- 1510 nodes · 5737 edges · 74 communities (66 shown, 8 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 60 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- Record Forms and Dialogs
- Accounts and Workflow Views
- Sidebar and Route Navigation
- Budget Tables and Pagination
- History and Financial Charts
- Shared Interface Components
- Financial Domain and Architecture
- Monthly Dashboard Views
- Dashboard Aggregation
- TypeScript Compiler Settings
- Statement Replacement Review
- Amount and Input Filters
- Monthly Record Tables
- Application Package Metadata
- Runtime Dependencies
- Database Schema and Import Tests
- Lint Safety Rules
- Record and Allocation Logic
- Domain Validation and Buckets
- Lint Correctness Rules
- Background Drive Sync
- Data Settings and Alerts
- Bank Statement Importing
- Category Filters and Popovers
- Statement Replacement Logic
- Component Generator Settings
- Date Range Controls
- Statement Selection Sheets
- Sidebar Interface Primitives
- Seed and Generated Data
- Drive Sync Operations
- Financial Domain Types
- Google OAuth and Auth
- Statement Display Utilities
- Budget Detail Views
- Data Backup and Settings
- Duplicate Resolution Rules
- Google Drive Persistence
- Formatting Configuration
- Category History Charts
- Icon and Category Displays
- Project Graph Maintenance
- Biome Configuration
- Lint Rule Configuration
- Code Style Guide
- Web App Manifest
- Development Dependencies
- Duplicate Workflow Specification
- Duplicate Detection and Cleanup
- Local Agent Workflow Rules
- Formatter Rules
- Optional Native Dependencies
- Project Commands
- Style Lint Rules
- Brand Icon Concept
- Brand Icon Shadow
- Signed Commit Conventions
- Local Markdown Tracker
- Brand Vector Icon
- Domain Documentation Rules
- Apple Touch Icon
- JPEG Favicon
- PNG Favicon
- SVG Favicon
- Small App Icon
- Large App Icon
- Duplicate Feature Ticket
- Development Server Workflow
- Brand Icon Prompt
- Code Verification Commands
- String Domain Keys
- Crawler Policy

## God Nodes (most connected - your core abstractions)
1. `cn()` - 301 edges
2. `Button()` - 112 edges
3. `react` - 87 edges
4. `formatCurrency()` - 73 edges
5. `RecordEditorDialog()` - 62 edges
6. `RecordCreatorDialog()` - 46 edges
7. `UiIcon()` - 45 edges
8. `DataSettingsPage()` - 41 edges
9. `ValidationError` - 40 edges
10. `PageContent()` - 40 edges

## Surprising Connections (you probably didn't know these)
- `Boot()` --indirect_call--> `preloadCategoryIcons()`  [INFERRED]
  app/providers.tsx → src/components/icon.tsx
- `BudgetState` --calls--> `parseDate()`  [EXTRACTED]
  app/budgets/page.tsx → src/lib/utils.ts
- `AccountPage()` --calls--> `AccountDialog()`  [EXTRACTED]
  app/accounts/[id]/page.tsx → src/components/dialogs/account.tsx
- `AccountPage()` --calls--> `PendingStatementDialog()`  [EXTRACTED]
  app/accounts/[id]/page.tsx → src/components/dialogs/pending-statement.tsx
- `AccountPage()` --calls--> `Metric()`  [EXTRACTED]
  app/accounts/[id]/page.tsx → src/components/metric.tsx

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **Separate meaning, accounting and spending planning** — context_category, context_treatment, context_spending_bucket, context_record [EXTRACTED 1.00]
- **Imported activity explained by managed records** — context_statement, context_allocation, context_record [EXTRACTED 1.00]

## Communities (74 total, 8 thin omitted)

### Community 0 - "Record Forms and Dialogs"
Cohesion: 0.07
Nodes (101): DuplicateReviewDialog(), CandidateResults(), CategoriesPage(), CategoryDialogState, CategoryTile(), SECTIONS, class-variance-authority, react (+93 more)

### Community 1 - "Accounts and Workflow Views"
Cohesion: 0.12
Nodes (64): AccountPage(), AccountCard(), AccountRow, AccountsPage(), DuplicateGroupCard(), FixDuplicatesPage(), AllocatorPage(), AllocatorPendingPage() (+56 more)

### Community 2 - "Sidebar and Route Navigation"
Cohesion: 0.06
Nodes (67): metadata, RootLayout(), viewport, NotFound(), Boot(), Providers(), AppHeader(), AppearanceOption (+59 more)

### Community 3 - "Budget Tables and Pagination"
Cohesion: 0.08
Nodes (54): BUDGET_STATES, BudgetCard(), BudgetsPage(), BudgetState, formatBudgetDateWindow(), framer-motion, @tanstack/react-table, DataTable() (+46 more)

### Community 4 - "History and Financial Charts"
Cohesion: 0.09
Nodes (48): luxon, recharts, BudgetActiveDot(), BudgetProgressChart(), BudgetProgressPoint, buildSeries(), colorChange(), CashflowChart() (+40 more)

### Community 5 - "Shared Interface Components"
Cohesion: 0.08
Nodes (36): radix-ui, AlertAction(), ButtonGroup(), ButtonGroupSeparator(), ButtonGroupText(), buttonGroupVariants, DropdownMenuCheckboxItem(), DropdownMenuContent() (+28 more)

### Community 6 - "Financial Domain and Architecture"
Cohesion: 0.07
Nodes (31): Background Drive sync, CONTEXT.md, Dexie IndexedDB, First-run seed, Generated test data, JSON export/import, Installed Next.js documentation, React Compiler (+23 more)

### Community 7 - "Monthly Dashboard Views"
Cohesion: 0.09
Nodes (36): PendingCard(), BucketDailyData, BucketUsageBar(), Comparison, comparisonRateText(), comparisonText(), ComparisonValue, DashboardBucket (+28 more)

### Community 8 - "Dashboard Aggregation"
Cohesion: 0.13
Nodes (34): AnalyticsRecord, AnalyticsSummary, contribution(), summarize(), avg(), buildBuckets(), buildCashflowHistory(), buildCategories() (+26 more)

### Community 9 - "TypeScript Compiler Settings"
Cohesion: 0.06
Nodes (33): compilerOptions, allowJs, allowSyntheticDefaultImports, allowUnusedLabels, esModuleInterop, forceConsistentCasingInFileNames, incremental, isolatedModules (+25 more)

### Community 10 - "Statement Replacement Review"
Cohesion: 0.20
Nodes (27): BucketStatus(), WeekdayCard(), EmptyRecords(), metadata, PrivacyPage(), SECTIONS, RecordPage(), MethodHeader() (+19 more)

### Community 11 - "Amount and Input Filters"
Cohesion: 0.11
Nodes (26): AmountFilter(), AmountRange, COMPARISONS, describe(), Draft, readRange(), upperBound(), ComboboxChip() (+18 more)

### Community 12 - "Monthly Record Tables"
Cohesion: 0.15
Nodes (24): byRecordDay, FILTER_KEYS, Filters, MonthlyRecordsPage(), StatementPage(), BucketBadge(), formatRowTime(), PendingBadge() (+16 more)

### Community 13 - "Application Package Metadata"
Cohesion: 0.07
Nodes (29): private, $schema, type, @biomejs/biome, clsx, cmdk, @fontsource-variable/inter, lightningcss-linux-x64-gnu (+21 more)

### Community 14 - "Runtime Dependencies"
Cohesion: 0.07
Nodes (30): dependencies, @base-ui/react, class-variance-authority, clsx, cmdk, dexie, dexie-react-hooks, @fontsource-variable/inter (+22 more)

### Community 15 - "Database Schema and Import Tests"
Cohesion: 0.08
Nodes (19): dexie, fake-indexeddb, AccountRow, AllocationRow, AnalyticsMonthRow, BucketDefaultRow, BucketRow, BucketTargetRow (+11 more)

### Community 16 - "Lint Safety Rules"
Cohesion: 0.07
Nodes (28): suspicious, noAssignInExpressions, noAsyncPromiseExecutor, noCatchAssign, noClassAssign, noCompareNegZero, noControlCharactersInRegex, noDebugger (+20 more)

### Community 17 - "Record and Allocation Logic"
Cohesion: 0.12
Nodes (23): db, getMonthlyRecords(), MonthlyFilters, expandCategoryIdsForMonthly(), isPendingRecord(), analyticsValues(), budgetCovers(), ConflictError (+15 more)

### Community 18 - "Domain Validation and Buckets"
Cohesion: 0.21
Nodes (17): updateAccount(), createBucket(), GROUPS, PACE_KINDS, setBucketTarget(), updateBucket(), validateBudget(), cleanInput() (+9 more)

### Community 19 - "Lint Correctness Rules"
Cohesion: 0.08
Nodes (26): noConstantCondition, noConstAssign, noEmptyCharacterClassInRegex, noEmptyPattern, noGlobalObjectCalls, noInvalidBuiltinInstantiation, noInvalidConstructorSuper, noNonoctalDecimalEscape (+18 more)

### Community 20 - "Background Drive Sync"
Cohesion: 0.13
Nodes (24): useSyncStatus(), emit(), eventListeners, finishCycle(), flushOnHide(), getSyncSnapshot(), ingestManualResult(), markDirty() (+16 more)

### Community 21 - "Data Settings and Alerts"
Cohesion: 0.16
Nodes (22): COUNT_ROWS, DataSettingsPage(), StateRow(), STATUS_TONES, StatusTone, WorkspaceRow(), AlertDialog(), AlertDialogAction() (+14 more)

### Community 22 - "Bank Statement Importing"
Cohesion: 0.23
Nodes (22): ImporterPage(), Step(), asPending(), ensureAccount(), combine(), dbsDescriptionKey(), descriptionKey(), importDbs() (+14 more)

### Community 23 - "Category Filters and Popovers"
Cohesion: 0.18
Nodes (20): MonthLayout(), @base-ui/react, DateField(), Props, CategoryFilter(), CategoryFilterItem(), Command(), CommandEmpty() (+12 more)

### Community 24 - "Statement Replacement Logic"
Cohesion: 0.19
Nodes (20): countSuggestions(), removeStatementDismissals(), dayDifference(), ensureCanReplace(), maskDescription(), ReplacementAllocation, replacementComparison(), replacementReason() (+12 more)

### Community 25 - "Component Generator Settings"
Cohesion: 0.09
Nodes (21): aliases, components, hooks, lib, ui, utils, iconLibrary, menuAccent (+13 more)

### Community 26 - "Date Range Controls"
Cohesion: 0.13
Nodes (17): lucide-react, react-day-picker, DateRangeValue, formatRange(), Props, rangeFromValue(), FALLBACK_ICON_NAME, ICONS (+9 more)

### Community 27 - "Statement Selection Sheets"
Cohesion: 0.37
Nodes (14): PendingStatementConfirmationSheet(), RecordSearchSheet(), StatementSearchSheet(), Input(), Sheet(), SheetContent(), SheetDescription(), SheetHeader() (+6 more)

### Community 28 - "Sidebar Interface Primitives"
Cohesion: 0.15
Nodes (17): SidebarContext, SidebarContextProps, SidebarGroupAction(), SidebarGroupContent(), SidebarInput(), SidebarMenuAction(), SidebarMenuBadge(), SidebarMenuButton() (+9 more)

### Community 29 - "Seed and Generated Data"
Cohesion: 0.18
Nodes (15): DEFAULT_BUCKETS, DEFAULT_CATEGORIES, BANK_BLURB, between(), BUCKETS, CATEGORIES, DAILY, generateTestData() (+7 more)

### Community 30 - "Drive Sync Operations"
Cohesion: 0.34
Nodes (18): exportData(), downloadBackupFile(), driveFetch(), findBackupFile(), getClockSkewMs(), getFileMeta(), isDriveConfigured(), uploadBackupFile() (+10 more)

### Community 31 - "Financial Domain Types"
Cohesion: 0.11
Nodes (18): Account, Allocation, AnalyticsSummary, AnalyticsTreatment, Appearance, Bucket, Budget, Category (+10 more)

### Community 32 - "Google OAuth and Auth"
Cohesion: 0.29
Nodes (14): POST(), POST(), POST(), jose, AUTH_COOKIE_NAME, authCookie(), authCookieConfig(), clientIp() (+6 more)

### Community 33 - "Statement Display Utilities"
Cohesion: 0.18
Nodes (12): AllocateBar(), RecordAmount(), StatementOption(), amountTone(), StatementAmount(), StatementBadges(), StatementRow, StatementTableOptions (+4 more)

### Community 34 - "Budget Detail Views"
Cohesion: 0.24
Nodes (15): BudgetPage(), getBudgetAnalytics(), getCategoryData(), Legend(), Sparkline(), Icon(), Delta, Metric() (+7 more)

### Community 35 - "Data Backup and Settings"
Cohesion: 0.18
Nodes (14): clearAllData(), downloadExport(), EXPORT_VERSION, FinpointExport, importData(), parseImportFile(), SYNC_TABLES, tableCounts() (+6 more)

### Community 36 - "Duplicate Resolution Rules"
Cohesion: 0.12
Nodes (16): Duplicate Allocation Resolution, Atomic Statement Cleanup, Dismissal Migration and Backup, Desktop and Mobile Smoke Checks, Conservative Duplicate Suggestions, Pair-specific Dismissals, Duplicate Eligibility, Grouped Statement Review (+8 more)

### Community 37 - "Google Drive Persistence"
Cohesion: 0.20
Nodes (14): AuthNeededError, cacheToken(), CodeResponse, DRIVE_FILENAME, DRIVE_SCOPE, DriveFileMeta, ensureDriveToken(), ensureDriveTokenSilent() (+6 more)

### Community 38 - "Formatting Configuration"
Cohesion: 0.15
Nodes (13): arrowParentheses, bracketSameLine, bracketSpacing, jsxQuoteStyle, quoteProperties, quoteStyle, semicolons, trailingCommas (+5 more)

### Community 39 - "Category History Charts"
Cohesion: 0.24
Nodes (11): aggregateSeries(), CategoryHistoryChart(), ChartMonth, ChartSeries, HistoryTooltip(), MonthTick(), prepareMonths(), prepareSeries() (+3 more)

### Community 40 - "Icon and Category Displays"
Cohesion: 0.27
Nodes (10): CategoryMovers(), Mover, DynamicUiIcon(), iconNameSet, loadedIcons, loadIcon(), loadingIcons, normalize() (+2 more)

### Community 41 - "Project Graph Maintenance"
Cohesion: 0.20
Nodes (9): Graph health warnings, graphify-out/graph.json, graphify-out/.graphify_labels.json, graphify-out/manifest.json, graphify-out/GRAPH_REPORT.md, graphify skill, graphify update ., Local graph artifacts (+1 more)

### Community 42 - "Biome Configuration"
Cohesion: 0.18
Nodes (10): source, assist, actions, files, includes, linter, enabled, overrides (+2 more)

### Community 43 - "Lint Rule Configuration"
Cohesion: 0.18
Nodes (11): noAdjacentSpacesInRegex, noBannedTypes, noExtraBooleanCast, noUselessCatch, noUselessThisAlias, noUselessTypeConstraint, rules, noFloatingPromises (+3 more)

### Community 44 - "Code Style Guide"
Cohesion: 0.18
Nodes (10): APIs, Arguments, And Props, Code Style, Consistency, Core, Earning Its Place, Finpoint Style Additions, Grouping And Order, React / TypeScript Style (+2 more)

### Community 45 - "Web App Manifest"
Cohesion: 0.20
Nodes (9): background_color, description, display, icons, name, scope, short_name, start_url (+1 more)

### Community 46 - "Development Dependencies"
Cohesion: 0.22
Nodes (9): devDependencies, @biomejs/biome, fake-indexeddb, @tailwindcss/postcss, @types/luxon, @types/node, @types/papaparse, @types/react (+1 more)

### Community 47 - "Duplicate Workflow Specification"
Cohesion: 0.22
Nodes (8): Fix duplicate bank statements, Further Notes, Implementation Decisions, Out of Scope, Problem Statement, Solution, Testing Decisions, User Stories

### Community 48 - "Duplicate Detection and Cleanup"
Cohesion: 0.31
Nodes (8): descriptionAnchors(), descriptionIdentity(), DuplicateGroup, duplicateGroups(), duplicateReview(), FixDuplicatesInput, GENERIC, strongMatch()

### Community 49 - "Local Agent Workflow Rules"
Cohesion: 0.25
Nodes (8): Local Agent Skills, Domain and Importer Tests, Domain Documentation Conflicts, Single-context Domain Docs, Local Tracker Operations, Spec and Ticket Files, Ticket Lifecycle, Local Markdown Issue Tracker

### Community 50 - "Formatter Rules"
Cohesion: 0.25
Nodes (8): formatter, attributePosition, enabled, formatWithErrors, indentStyle, indentWidth, lineEnding, lineWidth

### Community 51 - "Optional Native Dependencies"
Cohesion: 0.29
Nodes (7): optionalDependencies, lightningcss-linux-x64-gnu, lightningcss-win32-x64-msvc, @rollup/rollup-linux-x64-gnu, @rollup/rollup-win32-x64-msvc, @tailwindcss/oxide-linux-x64-gnu, @tailwindcss/oxide-win32-x64-msvc

### Community 52 - "Project Commands"
Cohesion: 0.29
Nodes (7): scripts, build, dev, lint, lint:check, start, types:check

### Community 53 - "Style Lint Rules"
Cohesion: 0.33
Nodes (6): style, noNamespace, noNonNullAssertion, useArrayLiterals, useAsConstAssertion, useBlockStatements

### Community 54 - "Brand Icon Concept"
Cohesion: 0.40
Nodes (5): Finpoint icon concept, Charcoal shadow halo, Circular point, Rounded F monogram, Off-white icon fill

### Community 55 - "Brand Icon Shadow"
Cohesion: 0.40
Nodes (5): Finpoint icon with charcoal shadow, Charcoal shadow halo, Circular point, Rounded F monogram, Off-white icon fill

### Community 56 - "Signed Commit Conventions"
Cohesion: 0.40
Nodes (4): Branches, Commit Guide, Commits, Pull Requests

### Community 57 - "Local Markdown Tracker"
Cohesion: 0.40
Nodes (4): Files, Issue tracker: Local Markdown, Skill operations, Status and dependencies

### Community 58 - "Brand Vector Icon"
Cohesion: 0.50
Nodes (4): Finpoint, Circular point, Rounded F monogram, Off-white icon fill

### Community 59 - "Domain Documentation Rules"
Cohesion: 0.50
Nodes (3): Before exploration, Domain docs, Writing

### Community 61 - "Apple Touch Icon"
Cohesion: 0.67
Nodes (3): Circular dot beside F, Rounded F letterform, F monogram icon

### Community 62 - "JPEG Favicon"
Cohesion: 0.67
Nodes (3): JPG favicon dot, JPG favicon F letterform, JPG favicon icon

### Community 63 - "PNG Favicon"
Cohesion: 0.67
Nodes (3): PNG favicon dot, PNG favicon F letterform, PNG favicon icon

### Community 64 - "SVG Favicon"
Cohesion: 0.67
Nodes (3): SVG favicon dot, SVG favicon F letterform, SVG favicon icon

### Community 65 - "Small App Icon"
Cohesion: 0.67
Nodes (3): Circular dot beside F, Rounded F letterform, F monogram icon

### Community 66 - "Large App Icon"
Cohesion: 0.67
Nodes (3): Circular dot beside F, Rounded F letterform, F monogram icon

## Knowledge Gaps
- **88 isolated node(s):** `@biomejs/biome`, `@fontsource-variable/inter`, `lightningcss-linux-x64-gnu`, `lightningcss-win32-x64-msvc`, `react-dom` (+83 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 527 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **8 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `cn()` connect `Shared Interface Components` to `Record Forms and Dialogs`, `Accounts and Workflow Views`, `Statement Display Utilities`, `Budget Tables and Pagination`, `Sidebar and Route Navigation`, `History and Financial Charts`, `Budget Detail Views`, `Monthly Dashboard Views`, `Icon and Category Displays`, `Statement Replacement Review`, `Amount and Input Filters`, `Monthly Record Tables`, `Data Settings and Alerts`, `Bank Statement Importing`, `Category Filters and Popovers`, `Date Range Controls`, `Statement Selection Sheets`, `Sidebar Interface Primitives`?**
  _High betweenness centrality (0.132) - this node is a cross-community bridge._
- **What connects `@biomejs/biome`, `@fontsource-variable/inter`, `lightningcss-linux-x64-gnu` to the rest of the system?**
  _88 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Record Forms and Dialogs` be split into smaller, more focused modules?**
  _Cohesion score 0.06778309409888357 - nodes in this community are weakly interconnected._
- **Why does `react` connect `Record Forms and Dialogs` to `Accounts and Workflow Views`, `Sidebar and Route Navigation`, `Budget Tables and Pagination`, `History and Financial Charts`, `Shared Interface Components`, `Monthly Dashboard Views`, `Statement Replacement Review`, `Amount and Input Filters`, `Monthly Record Tables`, `Application Package Metadata`, `Background Drive Sync`, `Data Settings and Alerts`, `Category Filters and Popovers`, `Date Range Controls`, `Statement Selection Sheets`, `Sidebar Interface Primitives`, `Statement Display Utilities`, `Budget Detail Views`, `Icon and Category Displays`?**
  _High betweenness centrality (0.076) - this node is a cross-community bridge._
- **Should `Accounts and Workflow Views` be split into smaller, more focused modules?**
  _Cohesion score 0.11921946003742315 - nodes in this community are weakly interconnected._
- **Why does `dependencies` connect `Runtime Dependencies` to `Application Package Metadata`?**
  _High betweenness centrality (0.030) - this node is a cross-community bridge._
- **Should `Sidebar and Route Navigation` be split into smaller, more focused modules?**
  _Cohesion score 0.05740740740740741 - nodes in this community are weakly interconnected._