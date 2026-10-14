# Graph Report - t3-7b03443b  (2026-10-14)

## Corpus Check
- 195 files · ~117,933 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 9 file(s) not represented in the graph (top: (none) 5, .example 1, .lock 1)

## Summary
- 1553 nodes · 5966 edges · 80 communities (70 shown, 10 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 88 edges (avg confidence: 0.87)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `825377cf`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- record-editor.tsx
- db.ts
- record-columns.tsx
- app-sidebar.tsx
- paginated-data-table.tsx
- combobox.tsx
- dashboard.ts
- compilerOptions
- formatCurrency
- icon.tsx
- Application Dependencies
- Validator
- sync/page.tsx
- suspicious
- auto-sync.ts
- package.json
- correctness
- records.ts
- Button
- category-filter.tsx
- monthly/page.tsx
- Next.js App Router
- Components Components
- drive-sync.ts
- test-data.ts
- export-import.ts
- pending/page.tsx
- sidebar.tsx
- importer/page.tsx
- types.d.ts
- Changed Bank Descriptions
- auth-vault.ts
- Input
- google-drive.ts
- statement-columns.tsx
- formatter
- Record
- use-persistent-state.ts
- Graph refresh after code tasks
- biome.json
- rules
- Style Guide
- manifest.json
- PaginationFooter
- devDependencies
- Fix duplicate bank statements
- Local Markdown Issue Tracker
- formatter
- Commit Guide
- Records
- utils.ts
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
- duplicates/page.tsx

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
- **Separate meaning, accounting and spending planning** — context_category, context_treatment, context_monthly_budget, context_record [EXTRACTED 1.00]
- **Imported activity explained by managed records** — context_statement, context_allocation, context_record [EXTRACTED 1.00]

## Communities (80 total, 10 thin omitted)

### Community 0 - "record-editor.tsx"
Cohesion: 0.05
Nodes (146): CandidateResults(), BudgetPage(), getBudgetAnalytics(), getCategoryData(), Legend(), CategoriesPage(), CategoryDialogState, CategoryTile() (+138 more)

### Community 1 - "db.ts"
Cohesion: 0.08
Nodes (21): dexie, fake-indexeddb, AccountRow, AllocationRow, AnalyticsMonthRow, BudgetRecordRow, BudgetRow, CategoryRow (+13 more)

### Community 2 - "record-columns.tsx"
Cohesion: 0.27
Nodes (14): MonthlyRecordsPage(), amountTone(), formatRowTime(), PendingBadge(), pendingReason(), RecordActions(), RecordActionsCell(), RecordAmountCell() (+6 more)

### Community 3 - "app-sidebar.tsx"
Cohesion: 0.07
Nodes (59): metadata, RootLayout(), viewport, Boot(), Providers(), AppearanceOption, APPEARANCES, AppearanceSwitch() (+51 more)

### Community 4 - "paginated-data-table.tsx"
Cohesion: 0.12
Nodes (38): framer-motion, @tanstack/react-table, Sparkline(), Delta, Metric(), DataTable(), PaginatedDataTable(), GroupHeaderRow() (+30 more)

### Community 5 - "combobox.tsx"
Cohesion: 0.14
Nodes (18): @base-ui/react, ComboboxField(), Props, ComboboxChip(), ComboboxChips(), ComboboxChipsInput(), ComboboxClear(), ComboboxContent() (+10 more)

### Community 6 - "dashboard.ts"
Cohesion: 0.11
Nodes (40): db, AnalyticsRecord, AnalyticsSummary, contribution(), summarize(), avg(), BREAKDOWN_MONTHS, buildCashflowHistory() (+32 more)

### Community 7 - "compilerOptions"
Cohesion: 0.06
Nodes (33): compilerOptions, allowJs, allowSyntheticDefaultImports, allowUnusedLabels, esModuleInterop, forceConsistentCasingInFileNames, incremental, isolatedModules (+25 more)

### Community 8 - "formatCurrency"
Cohesion: 0.06
Nodes (67): InvestmentRow(), recharts, BudgetActiveDot(), BudgetProgressChart(), BudgetProgressPoint, buildSeries(), colorChange(), CashflowChart() (+59 more)

### Community 9 - "icon.tsx"
Cohesion: 0.14
Nodes (20): BUDGET_STATES, BudgetCard(), BudgetsPage(), BudgetState, formatBudgetDateWindow(), rangeFromValue(), DynamicUiIcon(), ICON_NAMES (+12 more)

### Community 10 - "Application Dependencies"
Cohesion: 0.07
Nodes (30): dependencies, @base-ui/react, class-variance-authority, clsx, cmdk, dexie, dexie-react-hooks, @fontsource-variable/inter (+22 more)

### Community 11 - "Validator"
Cohesion: 0.18
Nodes (24): MonthlyBudgetDefaultRow, updateAccount(), validateBudget(), CategoryInput, cleanInput(), createCategory(), TREATMENTS, updateCategory() (+16 more)

### Community 12 - "sync/page.tsx"
Cohesion: 0.16
Nodes (22): COUNT_ROWS, DataSettingsPage(), StateRow(), STATUS_TONES, StatusTone, WorkspaceRow(), AlertDialog(), AlertDialogAction() (+14 more)

### Community 13 - "suspicious"
Cohesion: 0.07
Nodes (28): suspicious, noAssignInExpressions, noAsyncPromiseExecutor, noCatchAssign, noClassAssign, noCompareNegZero, noControlCharactersInRegex, noDebugger (+20 more)

### Community 14 - "auto-sync.ts"
Cohesion: 0.13
Nodes (24): useSyncStatus(), emit(), eventListeners, finishCycle(), flushOnHide(), getSyncSnapshot(), ingestManualResult(), markDirty() (+16 more)

### Community 15 - "package.json"
Cohesion: 0.06
Nodes (30): private, $schema, type, babel-plugin-react-compiler, @biomejs/biome, clsx, cmdk, @fontsource-variable/inter (+22 more)

### Community 16 - "correctness"
Cohesion: 0.08
Nodes (26): noConstantCondition, noConstAssign, noEmptyCharacterClassInRegex, noEmptyPattern, noGlobalObjectCalls, noInvalidBuiltinInstantiation, noInvalidConstructorSuper, noNonoctalDecimalEscape (+18 more)

### Community 17 - "records.ts"
Cohesion: 0.12
Nodes (28): AccountActivity, NO_ACTIVITY, BudgetFilters, createBudget(), getBudget(), listBudgets(), isPendingRecord(), pendingStatementIds() (+20 more)

### Community 18 - "Button"
Cohesion: 0.10
Nodes (39): MonthLayout(), NotFound(), nextConfig, lucide-react, luxon, next, react-day-picker, Props (+31 more)

### Community 19 - "category-filter.tsx"
Cohesion: 0.17
Nodes (18): Props, CategoryFilter(), CategoryFilterItem(), Command(), CommandEmpty(), CommandGroup(), CommandInput(), CommandItem() (+10 more)

### Community 20 - "monthly/page.tsx"
Cohesion: 0.31
Nodes (19): ScopeSelect(), byRecordDay, FILTER_KEYS, Filters, MonthlyRecordFilters(), RecordFilters(), SettingsPage(), Props (+11 more)

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
Cohesion: 0.16
Nodes (17): DEFAULT_CATEGORIES, DEFAULT_MONTHLY_BUDGETS, EXPORT_VERSION, FinpointExport, BANK_BLURB, between(), CATEGORIES, DAILY (+9 more)

### Community 25 - "export-import.ts"
Cohesion: 0.21
Nodes (13): clearAllData(), downloadExport(), importData(), parseImportFile(), SYNC_TABLES, tableCounts(), TableName, TABLES (+5 more)

### Community 26 - "pending/page.tsx"
Cohesion: 0.20
Nodes (30): AccountPage(), AccountCard(), AccountRow, AccountsPage(), AllocatorPage(), AllocatorPendingPage(), CandidatePage, PendingCard() (+22 more)

### Community 27 - "sidebar.tsx"
Cohesion: 0.15
Nodes (17): SidebarContext, SidebarContextProps, SidebarGroupAction(), SidebarGroupContent(), SidebarInput(), SidebarMenuAction(), SidebarMenuBadge(), SidebarMenuButton() (+9 more)

### Community 28 - "importer/page.tsx"
Cohesion: 0.19
Nodes (25): ACCEPT, BANKS_REQUIRING_ADDITIONAL_INFO, ImporterPage(), Step(), FieldError(), asPending(), BANKS, ensureAccount() (+17 more)

### Community 29 - "types.d.ts"
Cohesion: 0.11
Nodes (18): Account, Allocation, AnalyticsSummary, AnalyticsTreatment, Appearance, Budget, Category, CategoryWithChildren (+10 more)

### Community 30 - "Changed Bank Descriptions"
Cohesion: 0.11
Nodes (18): Drive Baseline Migration, Duplicate Dismissal Migration, Duplicate Allocation Resolution, Atomic Statement Cleanup, Dismissal Migration and Backup, Desktop and Mobile Smoke Checks, Conservative Duplicate Suggestions, Pair-specific Dismissals (+10 more)

### Community 31 - "auth-vault.ts"
Cohesion: 0.29
Nodes (14): POST(), POST(), POST(), jose, AUTH_COOKIE_NAME, authCookie(), authCookieConfig(), clientIp() (+6 more)

### Community 32 - "Input"
Cohesion: 0.21
Nodes (23): AllocateBar(), RecordAmount(), PendingStatementConfirmationSheet(), RecordOption(), RecordSearchSheet(), StatementOption(), StatementSearchSheet(), AmountFilter() (+15 more)

### Community 33 - "google-drive.ts"
Cohesion: 0.20
Nodes (14): AuthNeededError, cacheToken(), CodeResponse, DRIVE_FILENAME, DRIVE_SCOPE, DriveFileMeta, ensureDriveToken(), ensureDriveTokenSilent() (+6 more)

### Community 34 - "statement-columns.tsx"
Cohesion: 0.42
Nodes (8): StatementActions(), StatementActionsCell(), StatementAmount(), StatementBadges(), StatementRow, StatementTableOptions, useStatementColumns(), useStatementMobileRow()

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

### Community 43 - "Style Guide"
Cohesion: 0.27
Nodes (10): APIs, Arguments, And Props, Code Style, Consistency, Core, Earning Its Place, Finpoint Style Additions, Grouping And Order, React / TypeScript Style (+2 more)

### Community 44 - "manifest.json"
Cohesion: 0.20
Nodes (9): background_color, description, display, icons, name, scope, short_name, start_url (+1 more)

### Community 45 - "PaginationFooter"
Cohesion: 0.38
Nodes (11): pageHref(), pageWindow(), PaginationFooter(), Pagination(), PaginationContent(), PaginationEllipsis(), PaginationItem(), PaginationLink() (+3 more)

### Community 46 - "devDependencies"
Cohesion: 0.20
Nodes (10): devDependencies, babel-plugin-react-compiler, @biomejs/biome, fake-indexeddb, @tailwindcss/postcss, @types/luxon, @types/node, @types/papaparse (+2 more)

### Community 47 - "Fix duplicate bank statements"
Cohesion: 0.22
Nodes (8): Fix duplicate bank statements, Further Notes, Implementation Decisions, Out of Scope, Problem Statement, Solution, Testing Decisions, User Stories

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

### Community 54 - "utils.ts"
Cohesion: 0.32
Nodes (4): radix-ui, react, badgeVariants, currencyFormat

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
Cohesion: 0.07
Nodes (43): class-variance-authority, AlertAction(), ButtonGroup(), ButtonGroupSeparator(), ButtonGroupText(), buttonGroupVariants, DropdownMenuCheckboxItem(), DropdownMenuContent() (+35 more)

### Community 83 - "statements.ts"
Cohesion: 0.13
Nodes (30): countSuggestions(), allocationOutcome(), descriptionAnchors(), descriptionIdentity(), eligible(), fixDuplicates(), GENERIC, removeStatementDismissals() (+22 more)

### Community 86 - "duplicates/page.tsx"
Cohesion: 0.19
Nodes (19): CARD_MOTION, DuplicateGroupCard(), FixDuplicatesPage(), GroupHeader(), highlightDifferences(), VIEWS, Decisions, Fix Duplicates — UI redesign (+11 more)

## Knowledge Gaps
- **98 isolated node(s):** `@fontsource-variable/inter`, `react-dom`, `shadcn`, `tailwindcss`, `tw-animate-css` (+93 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 539 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **10 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `cn()` connect `cn` to `record-editor.tsx`, `record-columns.tsx`, `app-sidebar.tsx`, `paginated-data-table.tsx`, `combobox.tsx`, `formatCurrency`, `icon.tsx`, `sync/page.tsx`, `Button`, `category-filter.tsx`, `monthly/page.tsx`, `pending/page.tsx`, `sidebar.tsx`, `importer/page.tsx`, `Input`, `statement-columns.tsx`, `PaginationFooter`, `utils.ts`, `shell-header.tsx`, `duplicates/page.tsx`?**
  _High betweenness centrality (0.132) - this node is a cross-community bridge._
- **What connects `@fontsource-variable/inter`, `react-dom`, `shadcn` to the rest of the system?**
  _98 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `record-editor.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.05479881991086561 - nodes in this community are weakly interconnected._
- **Why does `react` connect `utils.ts` to `record-editor.tsx`, `record-columns.tsx`, `app-sidebar.tsx`, `paginated-data-table.tsx`, `combobox.tsx`, `formatCurrency`, `icon.tsx`, `sync/page.tsx`, `auto-sync.ts`, `package.json`, `Button`, `category-filter.tsx`, `monthly/page.tsx`, `pending/page.tsx`, `sidebar.tsx`, `importer/page.tsx`, `Input`, `statement-columns.tsx`, `use-persistent-state.ts`, `PaginationFooter`, `shell-header.tsx`, `cn`, `duplicates/page.tsx`?**
  _High betweenness centrality (0.043) - this node is a cross-community bridge._
- **Should `db.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.07765151515151515 - nodes in this community are weakly interconnected._
- **Why does `next` connect `Button` to `record-editor.tsx`, `record-columns.tsx`, `app-sidebar.tsx`, `statement-columns.tsx`, `formatCurrency`, `icon.tsx`, `sync/page.tsx`, `PaginationFooter`, `package.json`, `monthly/page.tsx`, `duplicates/page.tsx`, `pending/page.tsx`, `shell-header.tsx`, `importer/page.tsx`, `auth-vault.ts`?**
  _High betweenness centrality (0.034) - this node is a cross-community bridge._
- **Should `app-sidebar.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.06947996589940324 - nodes in this community are weakly interconnected._