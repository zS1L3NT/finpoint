# Graph Report - t3-e5470010  (2026-10-14)

## Corpus Check
- 195 files · ~118,064 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 9 file(s) not represented in the graph (top: (none) 5, .example 1, .lock 1)

## Summary
- 1567 nodes · 5997 edges · 89 communities (78 shown, 11 thin omitted)
- Extraction: 98% EXTRACTED · 2% INFERRED · 0% AMBIGUOUS · INFERRED: 98 edges (avg confidence: 0.87)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `35485f55`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- Button
- date-range.tsx
- allocator/page.tsx
- paginated-data-table.tsx
- statement-replacement-review.tsx
- cn
- sidebar.tsx
- amount-filter.tsx
- (month)/page.tsx
- dashboard.ts
- db.ts
- compilerOptions
- package.json
- records.ts
- pending/page.tsx
- dependencies
- Fix Duplicates — UI redesign
- auto-sync.ts
- suspicious
- react
- Validator
- sync/page.tsx
- correctness
- total-spending-chart.tsx
- Input
- statements.ts
- routes.ts
- Next.js App Router
- components.json
- test-data.ts
- importer.ts
- drive-sync.ts
- types.d.ts
- records/page.tsx
- Changed Bank Descriptions
- auth-vault.ts
- use-appearance.tsx
- google-drive.ts
- utils.ts
- export-import.ts
- formatter
- chart.tsx
- app-sidebar.tsx
- Graph refresh after code tasks
- providers.tsx
- biome.json
- rules
- budgets/[id]/page.tsx
- category-history-chart.tsx
- Style Guide
- devDependencies
- manifest.json
- category-filter.tsx
- lucide-react
- Fix duplicate bank statements
- Local Markdown Issue Tracker
- formatter
- Commit Guide
- Records
- optionalDependencies
- scripts
- shell-header.tsx
- style
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
- use-persistent-state.ts
- Next.js development server
- Finpoint app icon
- Biome checks
- String primary keys
- Finpoint Domain Glossary (CONTEXT.md)
- Unrestricted crawler policy
- Generated demo data
- Progressive Web Application
- statement-columns.tsx
- db

## God Nodes (most connected - your core abstractions)
1. `cn()` - 309 edges
2. `Button()` - 114 edges
3. `react` - 90 edges
4. `formatCurrency()` - 79 edges
5. `RecordEditorDialog()` - 62 edges
6. `UiIcon()` - 47 edges
7. `RecordCreatorDialog()` - 46 edges
8. `DataSettingsPage()` - 41 edges
9. `next` - 41 edges
10. `PageContent()` - 40 edges

## Surprising Connections (you probably didn't know these)
- `Decisions` --references--> `FilterBar()`  [INFERRED]
  .scratch/fix-duplicates/design.md → src/components/table/filter-bar.tsx
- `Decisions` --references--> `ClearFiltersButton()`  [INFERRED]
  .scratch/fix-duplicates/design.md → src/components/table/filter-bar.tsx
- `Decisions` --references--> `Alert()`  [INFERRED]
  .scratch/fix-duplicates/design.md → src/components/ui/alert.tsx
- `Problems with the current page` --references--> `Alert()`  [INFERRED]
  .scratch/fix-duplicates/design.md → src/components/ui/alert.tsx
- `Decisions` --references--> `Badge()`  [INFERRED]
  .scratch/fix-duplicates/design.md → src/components/ui/badge.tsx

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **Category supplies Treatment and Monthly Budget defaults for a Record** — context_category, context_treatment, context_monthly_budget, context_record [EXTRACTED 1.00]
- **Category supplies Treatment and Monthly Budget defaults for a Record** — context_category, context_treatment, context_monthly_budget, context_record [EXTRACTED 1.00]
- **Monthly Budget amount rules (exactly one per month)** — context_monthly_budget_amount, context_amount_rule_default, context_amount_rule_override_one_month, context_amount_rule_override_default [EXTRACTED 1.00]
- **Statement-to-Record allocation model** — context_statement, context_record, context_allocation, context_pending_record, context_pending_statement [EXTRACTED 1.00]
- **Statement to Record via Allocation** — context_statement, context_allocation, context_record [EXTRACTED 1.00]
- **Fix Duplicates workflow (choose keeper, delete, or mark separate)** — _scratch_fix_duplicates_design_keep_delete_toggle, _scratch_fix_duplicates_design_not_a_duplicate_action, src_components_dialogs_duplicate_review, _scratch_fix_duplicates_design_silent_completion [INFERRED 0.85]

## Communities (89 total, 11 thin omitted)

### Community 0 - "Button"
Cohesion: 0.08
Nodes (89): ACCEPT, BANKS_REQUIRING_ADDITIONAL_INFO, sonner, @tanstack/react-form, AccountDialog(), BudgetCreatorDialog(), BudgetEditorDialog(), CategoryDialog() (+81 more)

### Community 1 - "date-range.tsx"
Cohesion: 0.15
Nodes (22): MonthLayout(), @base-ui/react, react-day-picker, DateField(), Props, DateRange(), DateRangeValue, formatRange() (+14 more)

### Community 2 - "allocator/page.tsx"
Cohesion: 0.27
Nodes (22): AllocatorPage(), ScopeSelect(), MonthlyRecordFilters(), RecordFilters(), SettingsPage(), Problems with the current page, Props, SelectField() (+14 more)

### Community 3 - "paginated-data-table.tsx"
Cohesion: 0.12
Nodes (41): framer-motion, @tanstack/react-table, DataTable(), PaginatedDataTable(), pageHref(), pageWindow(), PaginationFooter(), GroupHeaderRow() (+33 more)

### Community 4 - "statement-replacement-review.tsx"
Cohesion: 0.16
Nodes (39): ImporterPage(), Step(), EmptyRecords(), metadata, PrivacyPage(), SECTIONS, RecordPage(), StatementPage() (+31 more)

### Community 5 - "cn"
Cohesion: 0.08
Nodes (37): class-variance-authority, radix-ui, AlertAction(), ButtonGroup(), ButtonGroupSeparator(), ButtonGroupText(), buttonGroupVariants, DropdownMenuCheckboxItem() (+29 more)

### Community 6 - "sidebar.tsx"
Cohesion: 0.13
Nodes (20): SidebarContext, SidebarContextProps, SidebarGroupAction(), SidebarGroupContent(), SidebarInput(), SidebarInset(), SidebarMenuAction(), SidebarMenuBadge() (+12 more)

### Community 7 - "amount-filter.tsx"
Cohesion: 0.11
Nodes (25): AmountFilter(), AmountRange, COMPARISONS, describe(), Draft, readRange(), upperBound(), ComboboxChip() (+17 more)

### Community 8 - "(month)/page.tsx"
Cohesion: 0.09
Nodes (37): Comparison, comparisonRateText(), comparisonText(), ComparisonValue, DashboardData, DashboardMonthlyBudget, DashboardPage(), DashboardView (+29 more)

### Community 9 - "dashboard.ts"
Cohesion: 0.18
Nodes (27): contribution(), summarize(), avg(), buildCashflowHistory(), buildCategories(), buildComparison(), buildProjection(), buildSeries() (+19 more)

### Community 10 - "db.ts"
Cohesion: 0.09
Nodes (20): AccountRow, AnalyticsMonthRow, BudgetRecordRow, BudgetRow, CategoryRow, DB_NAME, DB_VERSION, DuplicateDismissalRow (+12 more)

### Community 11 - "compilerOptions"
Cohesion: 0.06
Nodes (33): compilerOptions, allowJs, allowSyntheticDefaultImports, allowUnusedLabels, esModuleInterop, forceConsistentCasingInFileNames, incremental, isolatedModules (+25 more)

### Community 12 - "package.json"
Cohesion: 0.07
Nodes (28): private, $schema, type, babel-plugin-react-compiler, @biomejs/biome, clsx, cmdk, @fontsource-variable/inter (+20 more)

### Community 13 - "records.ts"
Cohesion: 0.17
Nodes (15): AllocationRow, loadDashboardTables(), AllocationTally, pendingStatementIds(), tallyAllocations(), budgetCovers(), enrichRecords(), expandCategoryIds() (+7 more)

### Community 14 - "pending/page.tsx"
Cohesion: 0.20
Nodes (23): CARD_MOTION, DuplicateGroupCard(), FixDuplicatesPage(), GroupHeader(), highlightDifferences(), VIEWS, AllocatorPendingPage(), CandidatePage (+15 more)

### Community 15 - "dependencies"
Cohesion: 0.07
Nodes (30): dependencies, @base-ui/react, class-variance-authority, clsx, cmdk, dexie, dexie-react-hooks, @fontsource-variable/inter (+22 more)

### Community 16 - "Fix Duplicates — UI redesign"
Cohesion: 0.11
Nodes (21): dismissDuplicatePair, DuplicateGroup.allocations field, Marked separate view, Account, Allocation, Budget, Category, Duplicate Statement (+13 more)

### Community 17 - "auto-sync.ts"
Cohesion: 0.14
Nodes (27): isDriveConfigured(), useSyncStatus(), cycle(), emit(), eventListeners, finishCycle(), flushOnHide(), getSyncSnapshot() (+19 more)

### Community 18 - "suspicious"
Cohesion: 0.07
Nodes (28): suspicious, noAssignInExpressions, noAsyncPromiseExecutor, noCatchAssign, noClassAssign, noCompareNegZero, noControlCharactersInRegex, noDebugger (+20 more)

### Community 19 - "react"
Cohesion: 0.12
Nodes (33): CategoriesPage(), CategoryDialogState, CategoryTile(), SECTIONS, byRecordDay, FILTER_KEYS, Filters, MonthlyRecordsPage() (+25 more)

### Community 20 - "Validator"
Cohesion: 0.15
Nodes (31): updateAccount(), validateBudget(), CategoryInput, cleanInput(), createCategory(), TREATMENTS, updateCategory(), allocationOutcome() (+23 more)

### Community 21 - "sync/page.tsx"
Cohesion: 0.16
Nodes (23): COUNT_ROWS, DataSettingsPage(), StateRow(), STATUS_TONES, StatusTone, WorkspaceRow(), AlertDialog(), AlertDialogAction() (+15 more)

### Community 22 - "correctness"
Cohesion: 0.08
Nodes (26): noConstantCondition, noConstAssign, noEmptyCharacterClassInRegex, noEmptyPattern, noGlobalObjectCalls, noInvalidBuiltinInstantiation, noInvalidConstructorSuper, noNonoctalDecimalEscape (+18 more)

### Community 23 - "total-spending-chart.tsx"
Cohesion: 0.12
Nodes (38): InvestmentRow(), luxon, recharts, BudgetActiveDot(), BudgetProgressChart(), BudgetProgressPoint, buildSeries(), colorChange() (+30 more)

### Community 24 - "Input"
Cohesion: 0.33
Nodes (17): PendingStatementConfirmationSheet(), RecordOption(), RecordSearchSheet(), StatementOption(), StatementSearchSheet(), Input(), Sheet(), SheetContent() (+9 more)

### Community 25 - "statements.ts"
Cohesion: 0.18
Nodes (21): countSuggestions(), AnalyticsRecord, AnalyticsSummary, dayDifference(), ensureCanReplace(), maskDescription(), ReplacementAllocation, replacementComparison() (+13 more)

### Community 26 - "routes.ts"
Cohesion: 0.24
Nodes (16): ReviewLinks(), NotFound(), WorkflowTabs(), useDefaultFilterEndDateToday(), useDefaultFilterStartDate(), useSettings(), getSettings(), pathAccounts() (+8 more)

### Community 27 - "Next.js App Router"
Cohesion: 0.10
Nodes (10): Background Drive sync, CONTEXT.md, Dexie IndexedDB, First-run seed, Generated test data, JSON export/import, Installed Next.js documentation, React Compiler (+2 more)

### Community 28 - "components.json"
Cohesion: 0.09
Nodes (21): aliases, components, hooks, lib, ui, utils, iconLibrary, menuAccent (+13 more)

### Community 29 - "test-data.ts"
Cohesion: 0.16
Nodes (17): DEFAULT_CATEGORIES, DEFAULT_MONTHLY_BUDGETS, EXPORT_VERSION, FinpointExport, BANK_BLURB, between(), CATEGORIES, DAILY (+9 more)

### Community 30 - "importer.ts"
Cohesion: 0.26
Nodes (18): asPending(), ensureAccount(), combine(), dbsDescriptionKey(), descriptionKey(), importDbs(), importOcbc(), ImportResult (+10 more)

### Community 31 - "drive-sync.ts"
Cohesion: 0.22
Nodes (19): FinpointDB, exportData(), downloadBackupFile(), driveFetch(), findBackupFile(), getClockSkewMs(), getFileMeta(), uploadBackupFile() (+11 more)

### Community 32 - "types.d.ts"
Cohesion: 0.11
Nodes (18): Account, Allocation, AnalyticsSummary, AnalyticsTreatment, Appearance, Budget, Category, CategoryWithChildren (+10 more)

### Community 33 - "records/page.tsx"
Cohesion: 0.23
Nodes (22): AccountPage(), AccountCard(), AccountRow, AccountsPage(), RecordCreatorHost(), RecordsPage(), StatementsPage(), PageContent() (+14 more)

### Community 34 - "Changed Bank Descriptions"
Cohesion: 0.11
Nodes (18): Drive Baseline Migration, Duplicate Dismissal Migration, Duplicate Allocation Resolution, Atomic Statement Cleanup, Dismissal Migration and Backup, Desktop and Mobile Smoke Checks, Conservative Duplicate Suggestions, Pair-specific Dismissals (+10 more)

### Community 35 - "auth-vault.ts"
Cohesion: 0.29
Nodes (14): POST(), POST(), POST(), jose, AUTH_COOKIE_NAME, authCookie(), authCookieConfig(), clientIp() (+6 more)

### Community 36 - "use-appearance.tsx"
Cohesion: 0.25
Nodes (14): Toaster(), applyAppearance(), getStoredAppearance(), handleSystemThemeChange(), initializeAppearance(), isDarkMode(), listeners, mediaQuery() (+6 more)

### Community 37 - "google-drive.ts"
Cohesion: 0.20
Nodes (14): AuthNeededError, cacheToken(), CodeResponse, disconnectDrive(), DRIVE_FILENAME, DRIVE_SCOPE, DriveFileMeta, ensureDriveToken() (+6 more)

### Community 38 - "utils.ts"
Cohesion: 0.11
Nodes (25): BUDGET_STATES, BudgetCard(), BudgetsPage(), BudgetState, formatBudgetDateWindow(), nextConfig, next, CategoryMovers() (+17 more)

### Community 39 - "export-import.ts"
Cohesion: 0.14
Nodes (12): dexie, fake-indexeddb, clearAllData(), importData(), parseImportFile(), SYNC_TABLES, TableName, TABLES (+4 more)

### Community 40 - "formatter"
Cohesion: 0.15
Nodes (13): arrowParentheses, bracketSameLine, bracketSpacing, jsxQuoteStyle, quoteProperties, quoteStyle, semicolons, trailingCommas (+5 more)

### Community 41 - "chart.tsx"
Cohesion: 0.22
Nodes (10): ChartConfig, ChartContext, ChartContextProps, ChartLegendContent(), ChartStyle(), getPayloadConfigFromPayload(), INITIAL_DIMENSION, THEMES (+2 more)

### Community 42 - "app-sidebar.tsx"
Cohesion: 0.18
Nodes (19): AppearanceOption, APPEARANCES, AppearanceSwitch(), AppSidebar(), SyncDot(), SYSTEM_APPEARANCE, useSyncIndicator(), SidebarContent() (+11 more)

### Community 43 - "Graph refresh after code tasks"
Cohesion: 0.20
Nodes (9): Graph health warnings, graphify-out/graph.json, graphify-out/.graphify_labels.json, graphify-out/manifest.json, graphify-out/GRAPH_REPORT.md, graphify skill, graphify update ., Local graph artifacts (+1 more)

### Community 44 - "providers.tsx"
Cohesion: 0.17
Nodes (15): metadata, RootLayout(), viewport, Boot(), Providers(), @vercel/analytics, @vercel/speed-insights, SidebarProvider() (+7 more)

### Community 45 - "biome.json"
Cohesion: 0.18
Nodes (10): source, assist, actions, files, includes, linter, enabled, overrides (+2 more)

### Community 46 - "rules"
Cohesion: 0.18
Nodes (11): noAdjacentSpacesInRegex, noBannedTypes, noExtraBooleanCast, noUselessCatch, noUselessThisAlias, noUselessTypeConstraint, rules, noFloatingPromises (+3 more)

### Community 47 - "budgets/[id]/page.tsx"
Cohesion: 0.23
Nodes (14): BudgetPage(), getBudgetAnalytics(), getCategoryData(), Legend(), Sparkline(), DetailSummaryItem(), Metric(), MetricGrid() (+6 more)

### Community 48 - "category-history-chart.tsx"
Cohesion: 0.24
Nodes (11): aggregateSeries(), CategoryHistoryChart(), ChartMonth, ChartSeries, HistoryTooltip(), MonthTick(), prepareMonths(), prepareSeries() (+3 more)

### Community 49 - "Style Guide"
Cohesion: 0.27
Nodes (10): APIs, Arguments, And Props, Code Style, Consistency, Core, Earning Its Place, Finpoint Style Additions, Grouping And Order, React / TypeScript Style (+2 more)

### Community 50 - "devDependencies"
Cohesion: 0.20
Nodes (10): devDependencies, babel-plugin-react-compiler, @biomejs/biome, fake-indexeddb, @tailwindcss/postcss, @types/luxon, @types/node, @types/papaparse (+2 more)

### Community 51 - "manifest.json"
Cohesion: 0.20
Nodes (9): background_color, description, display, icons, name, scope, short_name, start_url (+1 more)

### Community 52 - "category-filter.tsx"
Cohesion: 0.36
Nodes (10): CategoryFilter(), CategoryFilterItem(), Command(), CommandEmpty(), CommandGroup(), CommandInput(), CommandItem(), CommandList() (+2 more)

### Community 53 - "lucide-react"
Cohesion: 0.20
Nodes (9): lucide-react, FALLBACK_ICON_NAME, ICONS, ButtonVariant, Month, MonthCal(), MonthCalProps, MonthPicker() (+1 more)

### Community 54 - "Fix duplicate bank statements"
Cohesion: 0.22
Nodes (8): Fix duplicate bank statements, Further Notes, Implementation Decisions, Out of Scope, Problem Statement, Solution, Testing Decisions, User Stories

### Community 55 - "Local Markdown Issue Tracker"
Cohesion: 0.25
Nodes (8): Local Agent Skills, Domain and Importer Tests, Domain Documentation Conflicts, Single-context Domain Docs, Local Tracker Operations, Spec and Ticket Files, Ticket Lifecycle, Local Markdown Issue Tracker

### Community 56 - "formatter"
Cohesion: 0.25
Nodes (8): formatter, attributePosition, enabled, formatWithErrors, indentStyle, indentWidth, lineEnding, lineWidth

### Community 57 - "Commit Guide"
Cohesion: 0.25
Nodes (4): Branches, Commit Guide, Commits, Pull Requests

### Community 58 - "Records"
Cohesion: 0.32
Nodes (8): Allocator, Budgets, Categories, Dashboard, Statement-allocation-record model, Monthly Budgets, Records, Statement importer

### Community 59 - "optionalDependencies"
Cohesion: 0.29
Nodes (7): optionalDependencies, lightningcss-linux-x64-gnu, lightningcss-win32-x64-msvc, @rollup/rollup-linux-x64-gnu, @rollup/rollup-win32-x64-msvc, @tailwindcss/oxide-linux-x64-gnu, @tailwindcss/oxide-win32-x64-msvc

### Community 60 - "scripts"
Cohesion: 0.29
Nodes (7): scripts, build, dev, lint, lint:check, start, types:check

### Community 61 - "shell-header.tsx"
Cohesion: 0.36
Nodes (6): AppHeader(), ShellHeader(), TITLES, SidebarTrigger(), SearchInit, useMonthParams()

### Community 62 - "style"
Cohesion: 0.33
Nodes (6): style, noNamespace, noNonNullAssertion, useArrayLiterals, useAsConstAssertion, useBlockStatements

### Community 63 - "Finpoint icon concept"
Cohesion: 0.40
Nodes (5): Finpoint icon concept, Charcoal shadow halo, Circular point, Rounded F monogram, Off-white icon fill

### Community 64 - "Finpoint icon with charcoal shadow"
Cohesion: 0.40
Nodes (5): Finpoint icon with charcoal shadow, Charcoal shadow halo, Circular point, Rounded F monogram, Off-white icon fill

### Community 65 - "Issue tracker: Local Markdown"
Cohesion: 0.40
Nodes (4): Files, Issue tracker: Local Markdown, Skill operations, Status and dependencies

### Community 66 - "Finpoint"
Cohesion: 0.50
Nodes (4): Finpoint, Circular point, Rounded F monogram, Off-white icon fill

### Community 67 - "Domain docs"
Cohesion: 0.50
Nodes (3): Before exploration, Domain docs, Writing

### Community 69 - "Google Drive sync"
Cohesion: 0.50
Nodes (4): Google Drive sync, JSON backup and restore, Local-first finance tracking, Sync conflict handling

### Community 70 - "01: Review and fix duplicate bank statements in Workflows"
Cohesion: 0.50
Nodes (3): 01: Review and fix duplicate bank statements in Workflows, Completion evidence, PR preparation

### Community 71 - "F monogram icon"
Cohesion: 0.67
Nodes (3): Circular dot beside F, Rounded F letterform, F monogram icon

### Community 72 - "JPG favicon icon"
Cohesion: 0.67
Nodes (3): JPG favicon dot, JPG favicon F letterform, JPG favicon icon

### Community 73 - "PNG favicon icon"
Cohesion: 0.67
Nodes (3): PNG favicon dot, PNG favicon F letterform, PNG favicon icon

### Community 74 - "SVG favicon icon"
Cohesion: 0.67
Nodes (3): SVG favicon dot, SVG favicon F letterform, SVG favicon icon

### Community 75 - "F monogram icon"
Cohesion: 0.67
Nodes (3): Circular dot beside F, Rounded F letterform, F monogram icon

### Community 76 - "F monogram icon"
Cohesion: 0.67
Nodes (3): Circular dot beside F, Rounded F letterform, F monogram icon

### Community 87 - "statement-columns.tsx"
Cohesion: 0.36
Nodes (10): amountTone(), formatRowTime(), StatementActions(), StatementActionsCell(), StatementAmount(), StatementBadges(), StatementRow, StatementTableOptions (+2 more)

### Community 88 - "db"
Cohesion: 0.48
Nodes (5): db, monthStart(), getMonthlyRecords(), MonthlyFilters, expandCategoryIdsForMonthly()

## Knowledge Gaps
- **97 isolated node(s):** `@fontsource-variable/inter`, `react-dom`, `shadcn`, `tailwindcss`, `tw-animate-css` (+92 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 543 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **11 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `cn()` connect `cn` to `Button`, `date-range.tsx`, `allocator/page.tsx`, `paginated-data-table.tsx`, `statement-replacement-review.tsx`, `sidebar.tsx`, `amount-filter.tsx`, `(month)/page.tsx`, `pending/page.tsx`, `react`, `sync/page.tsx`, `total-spending-chart.tsx`, `Input`, `routes.ts`, `records/page.tsx`, `utils.ts`, `chart.tsx`, `app-sidebar.tsx`, `providers.tsx`, `budgets/[id]/page.tsx`, `category-filter.tsx`, `lucide-react`, `shell-header.tsx`, `statement-columns.tsx`?**
  _High betweenness centrality (0.129) - this node is a cross-community bridge._
- **What connects `@fontsource-variable/inter`, `react-dom`, `shadcn` to the rest of the system?**
  _97 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Button` be split into smaller, more focused modules?**
  _Cohesion score 0.08176964149504196 - nodes in this community are weakly interconnected._
- **Why does `react` connect `react` to `Button`, `date-range.tsx`, `allocator/page.tsx`, `paginated-data-table.tsx`, `statement-replacement-review.tsx`, `cn`, `sidebar.tsx`, `amount-filter.tsx`, `(month)/page.tsx`, `package.json`, `pending/page.tsx`, `auto-sync.ts`, `sync/page.tsx`, `total-spending-chart.tsx`, `Input`, `records/page.tsx`, `use-appearance.tsx`, `utils.ts`, `chart.tsx`, `providers.tsx`, `budgets/[id]/page.tsx`, `category-history-chart.tsx`, `category-filter.tsx`, `lucide-react`, `shell-header.tsx`, `use-persistent-state.ts`, `statement-columns.tsx`?**
  _High betweenness centrality (0.046) - this node is a cross-community bridge._
- **Should `paginated-data-table.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.11764705882352941 - nodes in this community are weakly interconnected._
- **Why does `next` connect `utils.ts` to `Button`, `records/page.tsx`, `allocator/page.tsx`, `auth-vault.ts`, `statement-replacement-review.tsx`, `paginated-data-table.tsx`, `(month)/page.tsx`, `app-sidebar.tsx`, `providers.tsx`, `package.json`, `pending/page.tsx`, `react`, `sync/page.tsx`, `statement-columns.tsx`, `total-spending-chart.tsx`, `routes.ts`, `shell-header.tsx`?**
  _High betweenness centrality (0.034) - this node is a cross-community bridge._
- **Should `cn` be split into smaller, more focused modules?**
  _Cohesion score 0.07770582793709528 - nodes in this community are weakly interconnected._