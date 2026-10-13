# Graph Report - t3-b88747ce  (2026-10-13)

## Corpus Check
- 185 files · ~109,197 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 9 file(s) not represented in the graph (top: (none) 5, .example 1, .lock 1)

## Summary
- 1454 nodes · 5570 edges · 71 communities (61 shown, 10 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 63 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `e7f73347`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- (month)/page.tsx
- Button
- cn
- Data Backup Restore
- Application Architecture
- motion.ts
- app-sidebar.tsx
- pagination.tsx
- dashboard.ts
- TypeScript Compiler Configuration
- Runtime Dependencies
- sync/page.tsx
- Suspicious Code Rules
- package.json
- providers.tsx
- Correctness Lint Rules
- db.ts
- allocator-tabs.tsx
- use-persistent-state.ts
- utils.ts
- auto-sync.ts
- importer/page.tsx
- UI Component Configuration
- Seed Demo Data
- combobox.tsx
- paginated-data-table.tsx
- Domain View Types
- auth-vault.ts
- drive-sync.ts
- use-appearance.tsx
- records.ts
- Validator
- sidebar.tsx
- google-drive.ts
- JavaScript Formatting Rules
- category-filter.tsx
- Graph Refresh Workflow
- Biome Tool Configuration
- Type Safety Rules
- formatCurrency
- shell-header.tsx
- Web App Manifest
- Canonical Finance Concepts
- General Formatting Rules
- Development Dependencies
- Platform Native Dependencies
- Project Commands
- statements.ts
- Style Lint Rules
- Icon Concept Branding
- Shadow Icon Branding
- Finpoint Brand Identity
- Apple Touch Icon
- JPEG Favicon Branding
- PNG Favicon Branding
- SVG Favicon Branding
- Small App Icon
- Large App Icon
- Next.js Development Workflow
- Finpoint Application Icon
- Code Quality Checks
- Domain Primary Keys
- Search Crawler Policy
- Repository Code Style
- Finance Feature Overview
- Commit Branch Conventions
- Local Data Synchronization
- Generated Demo Data
- Progressive Web App

## God Nodes (most connected - your core abstractions)
1. `cn()` - 303 edges
2. `Button()` - 108 edges
3. `react` - 88 edges
4. `formatCurrency()` - 73 edges
5. `RecordEditorDialog()` - 62 edges
6. `RecordCreatorDialog()` - 46 edges
7. `UiIcon()` - 45 edges
8. `DataSettingsPage()` - 41 edges
9. `next` - 38 edges
10. `PageContent()` - 38 edges

## Surprising Connections (you probably didn't know these)
- `Boot()` --indirect_call--> `preloadCategoryIcons()`  [INFERRED]
  app/providers.tsx → src/components/icon.tsx
- `MonthLayout()` --calls--> `PageContent()`  [EXTRACTED]
  app/(month)/layout.tsx → src/components/layout/page-content.tsx
- `MonthLayout()` --calls--> `Button()`  [EXTRACTED]
  app/(month)/layout.tsx → src/components/ui/button.tsx
- `MonthLayout()` --calls--> `ButtonGroup()`  [EXTRACTED]
  app/(month)/layout.tsx → src/components/ui/button-group.tsx
- `MonthLayout()` --calls--> `useHistory()`  [EXTRACTED]
  app/(month)/layout.tsx → src/history.tsx

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **Separated application layers** — agents_ui_layer, agents_domain_operations, agents_persistence_layer [EXTRACTED 1.00]
- **Committed graph refresh artifacts** — agents_graph_json, agents_graph_report, agents_graph_manifest, agents_graph_labels [EXTRACTED 1.00]
- **Separate meaning, accounting and spending planning** — context_category, context_treatment, context_monthly_budget, context_record [EXTRACTED 1.00]
- **Imported activity explained by managed records** — context_statement, context_allocation, context_record [EXTRACTED 1.00]

## Communities (71 total, 10 thin omitted)

### Community 0 - "(month)/page.tsx"
Cohesion: 0.06
Nodes (104): AccountPage(), AccountCard(), AccountRow, AccountsPage(), AllocatorPage(), AllocatorPendingPage(), CandidatePage, PendingCard() (+96 more)

### Community 1 - "Button"
Cohesion: 0.08
Nodes (106): CandidateResults(), CategoryTile(), EmptyRecords(), PrivacyPage(), RecordPage(), StatementPage(), TermsPage(), class-variance-authority (+98 more)

### Community 2 - "cn"
Cohesion: 0.06
Nodes (41): RecordAmount(), AlertAction(), ButtonGroup(), ButtonGroupSeparator(), ButtonGroupText(), buttonGroupVariants, DropdownMenuCheckboxItem(), DropdownMenuContent() (+33 more)

### Community 3 - "Data Backup Restore"
Cohesion: 0.21
Nodes (13): clearAllData(), downloadExport(), importData(), parseImportFile(), SYNC_TABLES, tableCounts(), TableName, TABLES (+5 more)

### Community 4 - "Application Architecture"
Cohesion: 0.10
Nodes (10): Background Drive sync, CONTEXT.md, Dexie IndexedDB, First-run seed, Generated test data, JSON export/import, Installed Next.js documentation, React Compiler (+2 more)

### Community 5 - "motion.ts"
Cohesion: 0.28
Nodes (8): framer-motion, State, DURATION, EASE_DRAWER, EASE_IN_OUT, EASE_OUT, ROW_CASCADE_LIMIT, RowEntrance

### Community 6 - "app-sidebar.tsx"
Cohesion: 0.16
Nodes (27): NotFound(), AppearanceOption, APPEARANCES, AppearanceSwitch(), AppSidebar(), SyncDot(), SYSTEM_APPEARANCE, useSyncIndicator() (+19 more)

### Community 7 - "pagination.tsx"
Cohesion: 0.38
Nodes (11): pageHref(), pageWindow(), PaginationFooter(), Pagination(), PaginationContent(), PaginationEllipsis(), PaginationItem(), PaginationLink() (+3 more)

### Community 8 - "dashboard.ts"
Cohesion: 0.12
Nodes (37): AllocationRow, AnalyticsRecord, AnalyticsSummary, contribution(), summarize(), avg(), buildCashflowHistory(), buildCategories() (+29 more)

### Community 9 - "TypeScript Compiler Configuration"
Cohesion: 0.06
Nodes (33): compilerOptions, allowJs, allowSyntheticDefaultImports, allowUnusedLabels, esModuleInterop, forceConsistentCasingInFileNames, incremental, isolatedModules (+25 more)

### Community 10 - "Runtime Dependencies"
Cohesion: 0.07
Nodes (30): dependencies, @base-ui/react, class-variance-authority, clsx, cmdk, dexie, dexie-react-hooks, @fontsource-variable/inter (+22 more)

### Community 11 - "sync/page.tsx"
Cohesion: 0.15
Nodes (24): COUNT_ROWS, DataSettingsPage(), MethodHeader(), StateRow(), STATUS_TONES, StatusTone, WorkspaceRow(), AlertDialog() (+16 more)

### Community 12 - "Suspicious Code Rules"
Cohesion: 0.07
Nodes (28): suspicious, noAssignInExpressions, noAsyncPromiseExecutor, noCatchAssign, noClassAssign, noCompareNegZero, noControlCharactersInRegex, noDebugger (+20 more)

### Community 13 - "package.json"
Cohesion: 0.07
Nodes (27): private, $schema, type, @biomejs/biome, clsx, cmdk, @fontsource-variable/inter, lightningcss-linux-x64-gnu (+19 more)

### Community 14 - "providers.tsx"
Cohesion: 0.17
Nodes (15): metadata, RootLayout(), viewport, Boot(), Providers(), @vercel/analytics, @vercel/speed-insights, SidebarInset() (+7 more)

### Community 15 - "Correctness Lint Rules"
Cohesion: 0.08
Nodes (26): noConstantCondition, noConstAssign, noEmptyCharacterClassInRegex, noEmptyPattern, noGlobalObjectCalls, noInvalidBuiltinInstantiation, noInvalidConstructorSuper, noNonoctalDecimalEscape (+18 more)

### Community 16 - "db.ts"
Cohesion: 0.08
Nodes (17): dexie, AccountRow, AnalyticsMonthRow, BudgetRecordRow, BudgetRow, CategoryRow, DB_NAME, DB_VERSION (+9 more)

### Community 17 - "allocator-tabs.tsx"
Cohesion: 0.54
Nodes (6): AllocatorTabs(), useDefaultFilterEndDateToday(), useDefaultFilterStartDate(), useSettings(), pathAllocator(), pathAllocatorPending()

### Community 19 - "utils.ts"
Cohesion: 0.05
Nodes (97): BudgetPage(), getBudgetAnalytics(), getCategoryData(), Legend(), BUDGET_STATES, BudgetCard(), BudgetsPage(), BudgetState (+89 more)

### Community 20 - "auto-sync.ts"
Cohesion: 0.14
Nodes (21): useSyncStatus(), emit(), eventListeners, finishCycle(), getSyncSnapshot(), ingestManualResult(), refreshSyncDisplay(), refreshTimes() (+13 more)

### Community 21 - "importer/page.tsx"
Cohesion: 0.21
Nodes (23): ACCEPT, BANKS_REQUIRING_ADDITIONAL_INFO, ImporterPage(), Step(), FieldError(), BANKS, ensureAccount(), combine() (+15 more)

### Community 22 - "UI Component Configuration"
Cohesion: 0.09
Nodes (21): aliases, components, hooks, lib, ui, utils, iconLibrary, menuAccent (+13 more)

### Community 24 - "Seed Demo Data"
Cohesion: 0.16
Nodes (17): DEFAULT_CATEGORIES, DEFAULT_MONTHLY_BUDGETS, EXPORT_VERSION, FinpointExport, BANK_BLURB, between(), CATEGORIES, DAILY (+9 more)

### Community 25 - "combobox.tsx"
Cohesion: 0.13
Nodes (17): @base-ui/react, ComboboxChip(), ComboboxChips(), ComboboxChipsInput(), ComboboxClear(), ComboboxGroup(), ComboboxInput(), ComboboxLabel() (+9 more)

### Community 26 - "paginated-data-table.tsx"
Cohesion: 0.32
Nodes (20): @tanstack/react-table, DataTable(), PaginatedDataTable(), GroupHeaderRow(), groupStarts(), GroupTotal(), isInteractiveTarget(), MOBILE_LIST_CLASS (+12 more)

### Community 27 - "Domain View Types"
Cohesion: 0.11
Nodes (18): Account, Allocation, AnalyticsSummary, AnalyticsTreatment, Appearance, Budget, Category, CategoryWithChildren (+10 more)

### Community 28 - "auth-vault.ts"
Cohesion: 0.29
Nodes (14): POST(), POST(), POST(), jose, AUTH_COOKIE_NAME, authCookie(), authCookieConfig(), clientIp() (+6 more)

### Community 29 - "drive-sync.ts"
Cohesion: 0.28
Nodes (21): exportData(), downloadBackupFile(), driveFetch(), findBackupFile(), getClockSkewMs(), getFileMeta(), isDriveConfigured(), uploadBackupFile() (+13 more)

### Community 30 - "use-appearance.tsx"
Cohesion: 0.21
Nodes (16): lucide-react, Toaster(), Appearance, applyAppearance(), getStoredAppearance(), handleSystemThemeChange(), initializeAppearance(), isDarkMode() (+8 more)

### Community 31 - "records.ts"
Cohesion: 0.14
Nodes (19): db, getMonthlyRecords(), MonthlyFilters, expandCategoryIdsForMonthly(), analyticsValues(), budgetCovers(), ConflictError, createRecord() (+11 more)

### Community 33 - "Validator"
Cohesion: 0.23
Nodes (18): updateAccount(), validateBudget(), CategoryInput, cleanInput(), createCategory(), TREATMENTS, updateCategory(), amountFor() (+10 more)

### Community 36 - "sidebar.tsx"
Cohesion: 0.12
Nodes (19): radix-ui, SidebarContext, SidebarContextProps, SidebarGroupAction(), SidebarGroupContent(), SidebarInput(), SidebarMenuAction(), SidebarMenuBadge() (+11 more)

### Community 37 - "google-drive.ts"
Cohesion: 0.22
Nodes (13): AuthNeededError, cacheToken(), CodeResponse, DRIVE_FILENAME, DRIVE_SCOPE, DriveFileMeta, ensureDriveToken(), ensureDriveTokenSilent() (+5 more)

### Community 38 - "JavaScript Formatting Rules"
Cohesion: 0.15
Nodes (13): arrowParentheses, bracketSameLine, bracketSpacing, jsxQuoteStyle, quoteProperties, quoteStyle, semicolons, trailingCommas (+5 more)

### Community 39 - "category-filter.tsx"
Cohesion: 0.33
Nodes (11): CategoryFilter(), CategoryFilterItem(), Command(), CommandEmpty(), CommandGroup(), CommandInput(), CommandItem(), CommandList() (+3 more)

### Community 40 - "Graph Refresh Workflow"
Cohesion: 0.20
Nodes (9): Graph health warnings, graphify-out/graph.json, graphify-out/.graphify_labels.json, graphify-out/manifest.json, graphify-out/GRAPH_REPORT.md, graphify skill, graphify update ., Local graph artifacts (+1 more)

### Community 41 - "Biome Tool Configuration"
Cohesion: 0.18
Nodes (10): source, assist, actions, files, includes, linter, enabled, overrides (+2 more)

### Community 42 - "Type Safety Rules"
Cohesion: 0.18
Nodes (11): noAdjacentSpacesInRegex, noBannedTypes, noExtraBooleanCast, noUselessCatch, noUselessThisAlias, noUselessTypeConstraint, rules, noFloatingPromises (+3 more)

### Community 43 - "formatCurrency"
Cohesion: 0.05
Nodes (84): comparisonRateText(), comparisonText(), DashboardPage(), deltaOf(), InvestmentRow(), PaceSummary(), ReviewLinks(), ScopedCardTitle() (+76 more)

### Community 44 - "shell-header.tsx"
Cohesion: 0.36
Nodes (6): AppHeader(), ShellHeader(), TITLES, SidebarTrigger(), SearchInit, useMonthParams()

### Community 45 - "Web App Manifest"
Cohesion: 0.20
Nodes (9): background_color, description, display, icons, name, scope, short_name, start_url (+1 more)

### Community 46 - "Canonical Finance Concepts"
Cohesion: 0.23
Nodes (13): Account, Allocation, Budget, Category, Finpoint, Monthly Budget, Monthly Budget amount, Pending Record (+5 more)

### Community 47 - "General Formatting Rules"
Cohesion: 0.25
Nodes (8): formatter, attributePosition, enabled, formatWithErrors, indentStyle, indentWidth, lineEnding, lineWidth

### Community 48 - "Development Dependencies"
Cohesion: 0.25
Nodes (8): devDependencies, @biomejs/biome, @tailwindcss/postcss, @types/luxon, @types/node, @types/papaparse, @types/react, @types/react-dom

### Community 50 - "Platform Native Dependencies"
Cohesion: 0.29
Nodes (7): optionalDependencies, lightningcss-linux-x64-gnu, lightningcss-win32-x64-msvc, @rollup/rollup-linux-x64-gnu, @rollup/rollup-win32-x64-msvc, @tailwindcss/oxide-linux-x64-gnu, @tailwindcss/oxide-win32-x64-msvc

### Community 51 - "Project Commands"
Cohesion: 0.29
Nodes (7): scripts, build, dev, lint, lint:check, start, types:check

### Community 52 - "statements.ts"
Cohesion: 0.17
Nodes (24): countSuggestions(), asPending(), dayDifference(), ensureCanReplace(), maskDescription(), ReplacementAllocation, replacementComparison(), replacementReason() (+16 more)

### Community 53 - "Style Lint Rules"
Cohesion: 0.33
Nodes (6): style, noNamespace, noNonNullAssertion, useArrayLiterals, useAsConstAssertion, useBlockStatements

### Community 54 - "Icon Concept Branding"
Cohesion: 0.40
Nodes (5): Finpoint icon concept, Charcoal shadow halo, Circular point, Rounded F monogram, Off-white icon fill

### Community 55 - "Shadow Icon Branding"
Cohesion: 0.40
Nodes (5): Finpoint icon with charcoal shadow, Charcoal shadow halo, Circular point, Rounded F monogram, Off-white icon fill

### Community 56 - "Finpoint Brand Identity"
Cohesion: 0.50
Nodes (4): Finpoint, Circular point, Rounded F monogram, Off-white icon fill

### Community 58 - "Apple Touch Icon"
Cohesion: 0.67
Nodes (3): Circular dot beside F, Rounded F letterform, F monogram icon

### Community 59 - "JPEG Favicon Branding"
Cohesion: 0.67
Nodes (3): JPG favicon dot, JPG favicon F letterform, JPG favicon icon

### Community 60 - "PNG Favicon Branding"
Cohesion: 0.67
Nodes (3): PNG favicon dot, PNG favicon F letterform, PNG favicon icon

### Community 61 - "SVG Favicon Branding"
Cohesion: 0.67
Nodes (3): SVG favicon dot, SVG favicon F letterform, SVG favicon icon

### Community 62 - "Small App Icon"
Cohesion: 0.67
Nodes (3): Circular dot beside F, Rounded F letterform, F monogram icon

### Community 63 - "Large App Icon"
Cohesion: 0.67
Nodes (3): Circular dot beside F, Rounded F letterform, F monogram icon

### Community 77 - "Repository Code Style"
Cohesion: 0.27
Nodes (10): APIs, Arguments, And Props, Code Style, Consistency, Core, Earning Its Place, Finpoint Style Additions, Grouping And Order, React / TypeScript Style (+2 more)

### Community 82 - "Finance Feature Overview"
Cohesion: 0.32
Nodes (8): Allocator, Budgets, Categories, Dashboard, Statement-allocation-record model, Monthly Budgets, Records, Statement importer

### Community 86 - "Commit Branch Conventions"
Cohesion: 0.25
Nodes (4): Branches, Commit Guide, Commits, Pull Requests

### Community 87 - "Local Data Synchronization"
Cohesion: 0.50
Nodes (4): Google Drive sync, JSON backup and restore, Local-first finance tracking, Sync conflict handling

## Knowledge Gaps
- **76 isolated node(s):** `@fontsource-variable/inter`, `react-dom`, `shadcn`, `tailwindcss`, `tw-animate-css` (+71 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 494 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **10 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `cn()` connect `cn` to `(month)/page.tsx`, `Button`, `sidebar.tsx`, `motion.ts`, `app-sidebar.tsx`, `category-filter.tsx`, `pagination.tsx`, `formatCurrency`, `sync/page.tsx`, `shell-header.tsx`, `providers.tsx`, `allocator-tabs.tsx`, `utils.ts`, `importer/page.tsx`, `combobox.tsx`, `paginated-data-table.tsx`?**
  _High betweenness centrality (0.148) - this node is a cross-community bridge._
- **What connects `@fontsource-variable/inter`, `react-dom`, `shadcn` to the rest of the system?**
  _76 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `(month)/page.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.0579647917561185 - nodes in this community are weakly interconnected._
- **Why does `react` connect `utils.ts` to `(month)/page.tsx`, `Button`, `cn`, `sidebar.tsx`, `motion.ts`, `category-filter.tsx`, `pagination.tsx`, `sync/page.tsx`, `formatCurrency`, `package.json`, `providers.tsx`, `shell-header.tsx`, `use-persistent-state.ts`, `auto-sync.ts`, `importer/page.tsx`, `combobox.tsx`, `paginated-data-table.tsx`, `use-appearance.tsx`?**
  _High betweenness centrality (0.051) - this node is a cross-community bridge._
- **Should `Button` be split into smaller, more focused modules?**
  _Cohesion score 0.07556891369686561 - nodes in this community are weakly interconnected._
- **Why does `Button()` connect `Button` to `(month)/page.tsx`, `cn`, `sidebar.tsx`, `app-sidebar.tsx`, `category-filter.tsx`, `pagination.tsx`, `formatCurrency`, `sync/page.tsx`, `shell-header.tsx`, `utils.ts`, `importer/page.tsx`, `combobox.tsx`?**
  _High betweenness centrality (0.035) - this node is a cross-community bridge._
- **Should `cn` be split into smaller, more focused modules?**
  _Cohesion score 0.06431372549019608 - nodes in this community are weakly interconnected._