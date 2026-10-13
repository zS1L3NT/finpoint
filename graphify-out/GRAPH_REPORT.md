# Graph Report - finpoint-fix-duplicates-impl  (2026-10-14)

## Corpus Check
- 185 files · ~110,684 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 9 file(s) not represented in the graph (top: (none) 5, .example 1, .lock 1)

## Summary
- 1465 nodes · 5699 edges · 72 communities (65 shown, 7 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 60 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `33853772`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- Button
- record-editor.tsx
- cn
- export-import.ts
- Record
- budget-progress-chart.tsx
- app-sidebar.tsx
- (month)/layout.tsx
- dashboard.ts
- compilerOptions
- dependencies
- sync/page.tsx
- suspicious
- package.json
- combobox.tsx
- correctness
- db.ts
- utils.ts
- providers.tsx
- monthly/page.tsx
- auto-sync.ts
- importer/page.tsx
- components.json
- icon.tsx
- test-data.ts
- drive-sync.ts
- paginated-data-table.tsx
- types.d.ts
- auth-vault.ts
- use-appearance.tsx
- motion.ts
- records.ts
- google-drive.ts
- Validator
- category-history-chart.tsx
- (month)/page.tsx
- sidebar.tsx
- amount-filter.tsx
- formatter
- luxon
- Graph refresh after code tasks
- biome.json
- rules
- cashflow-chart.tsx
- total-spending-chart.tsx
- manifest.json
- shell-header.tsx
- formatter
- devDependencies
- history.tsx
- optionalDependencies
- scripts
- statements.ts
- style
- Finpoint icon concept
- Finpoint icon with charcoal shadow
- Finpoint
- F monogram icon
- JPG favicon icon
- PNG favicon icon
- SVG favicon icon
- F monogram icon
- F monogram icon
- Next.js development server
- Finpoint app icon
- Biome checks
- String primary keys
- Unrestricted crawler policy
- PaginationFooter
- Commit Guide

## God Nodes (most connected - your core abstractions)
1. `cn()` - 301 edges
2. `Button()` - 112 edges
3. `react` - 87 edges
4. `formatCurrency()` - 73 edges
5. `RecordEditorDialog()` - 62 edges
6. `RecordCreatorDialog()` - 46 edges
7. `UiIcon()` - 45 edges
8. `DataSettingsPage()` - 41 edges
9. `PageContent()` - 40 edges
10. `ValidationError` - 40 edges

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
- **Separate meaning, accounting and spending planning** — context_category, context_treatment, context_spending_bucket, context_record [EXTRACTED 1.00]
- **Imported activity explained by managed records** — context_statement, context_allocation, context_record [EXTRACTED 1.00]

## Communities (72 total, 7 thin omitted)

### Community 0 - "Button"
Cohesion: 0.06
Nodes (111): AccountPage(), AccountCard(), AccountRow, AccountsPage(), DuplicateGroupCard(), FixDuplicatesPage(), AllocatorPage(), AllocatorPendingPage() (+103 more)

### Community 1 - "record-editor.tsx"
Cohesion: 0.09
Nodes (78): DuplicateReviewDialog(), radix-ui, react, sonner, @tanstack/react-form, AccountDialog(), BucketDialog(), EditableBucket (+70 more)

### Community 2 - "cn"
Cohesion: 0.08
Nodes (36): ButtonGroup(), ButtonGroupSeparator(), ButtonGroupText(), buttonGroupVariants, DropdownMenuCheckboxItem(), DropdownMenuContent(), DropdownMenuItem(), DropdownMenuLabel() (+28 more)

### Community 3 - "export-import.ts"
Cohesion: 0.11
Nodes (16): dexie, fake-indexeddb, clearAllData(), downloadExport(), EXPORT_VERSION, importData(), parseImportFile(), SYNC_TABLES (+8 more)

### Community 4 - "Record"
Cohesion: 0.05
Nodes (41): Background Drive sync, CONTEXT.md, Dexie IndexedDB, First-run seed, Generated test data, JSON export/import, Installed Next.js documentation, React Compiler (+33 more)

### Community 5 - "budget-progress-chart.tsx"
Cohesion: 0.15
Nodes (23): recharts, BudgetActiveDot(), BudgetProgressChart(), BudgetProgressPoint, buildSeries(), colorChange(), BucketLine, WeekdayBars() (+15 more)

### Community 6 - "app-sidebar.tsx"
Cohesion: 0.15
Nodes (32): AllocatorTabs(), AppearanceOption, APPEARANCES, AppearanceSwitch(), AppSidebar(), SyncDot(), SYSTEM_APPEARANCE, useSyncIndicator() (+24 more)

### Community 7 - "(month)/layout.tsx"
Cohesion: 0.11
Nodes (29): BudgetCard(), BudgetState, formatBudgetDateWindow(), MonthLayout(), @base-ui/react, react-day-picker, DateField(), Props (+21 more)

### Community 8 - "dashboard.ts"
Cohesion: 0.13
Nodes (34): AnalyticsRecord, AnalyticsSummary, contribution(), summarize(), avg(), buildBuckets(), buildCashflowHistory(), buildCategories() (+26 more)

### Community 9 - "compilerOptions"
Cohesion: 0.06
Nodes (33): compilerOptions, allowJs, allowSyntheticDefaultImports, allowUnusedLabels, esModuleInterop, forceConsistentCasingInFileNames, incremental, isolatedModules (+25 more)

### Community 10 - "dependencies"
Cohesion: 0.07
Nodes (30): dependencies, @base-ui/react, class-variance-authority, clsx, cmdk, dexie, dexie-react-hooks, @fontsource-variable/inter (+22 more)

### Community 11 - "sync/page.tsx"
Cohesion: 0.17
Nodes (21): COUNT_ROWS, DataSettingsPage(), StateRow(), STATUS_TONES, StatusTone, WorkspaceRow(), AlertDialog(), AlertDialogAction() (+13 more)

### Community 12 - "suspicious"
Cohesion: 0.07
Nodes (28): suspicious, noAssignInExpressions, noAsyncPromiseExecutor, noCatchAssign, noClassAssign, noCompareNegZero, noControlCharactersInRegex, noDebugger (+20 more)

### Community 13 - "package.json"
Cohesion: 0.07
Nodes (28): private, $schema, type, @biomejs/biome, clsx, cmdk, @fontsource-variable/inter, jose (+20 more)

### Community 14 - "combobox.tsx"
Cohesion: 0.11
Nodes (27): CategoryFilter(), CategoryFilterItem(), ComboboxChip(), ComboboxChips(), ComboboxChipsInput(), ComboboxClear(), ComboboxGroup(), ComboboxInput() (+19 more)

### Community 15 - "correctness"
Cohesion: 0.08
Nodes (26): noConstantCondition, noConstAssign, noEmptyCharacterClassInRegex, noEmptyPattern, noGlobalObjectCalls, noInvalidBuiltinInstantiation, noInvalidConstructorSuper, noNonoctalDecimalEscape (+18 more)

### Community 16 - "db.ts"
Cohesion: 0.09
Nodes (23): AccountRow, AllocationRow, AnalyticsMonthRow, BucketDefaultRow, BucketRow, BucketTargetRow, BudgetRecordRow, BudgetRow (+15 more)

### Community 17 - "utils.ts"
Cohesion: 0.21
Nodes (22): AllocateBar(), RecordAmount(), PendingStatementConfirmationSheet(), RecordOption(), RecordSearchSheet(), StatementOption(), StatementSearchSheet(), Badge() (+14 more)

### Community 18 - "providers.tsx"
Cohesion: 0.17
Nodes (15): metadata, RootLayout(), viewport, Boot(), Providers(), @vercel/analytics, @vercel/speed-insights, SidebarInset() (+7 more)

### Community 19 - "monthly/page.tsx"
Cohesion: 0.10
Nodes (62): BudgetPage(), getBudgetAnalytics(), getCategoryData(), Legend(), BucketStatus(), ScopedCardTitle(), ScopeLabel(), WeekdayCard() (+54 more)

### Community 20 - "auto-sync.ts"
Cohesion: 0.13
Nodes (24): useSyncStatus(), emit(), eventListeners, finishCycle(), flushOnHide(), getSyncSnapshot(), ingestManualResult(), markDirty() (+16 more)

### Community 21 - "importer/page.tsx"
Cohesion: 0.20
Nodes (25): ACCEPT, BANKS_REQUIRING_ADDITIONAL_INFO, ImporterPage(), Step(), asPending(), BANKS, ensureAccount(), combine() (+17 more)

### Community 22 - "components.json"
Cohesion: 0.09
Nodes (21): aliases, components, hooks, lib, ui, utils, iconLibrary, menuAccent (+13 more)

### Community 23 - "icon.tsx"
Cohesion: 0.18
Nodes (14): lucide-react, CategoryMovers(), Mover, DynamicUiIcon(), ICON_NAMES, iconNameSet, loadedIcons, loadIcon() (+6 more)

### Community 24 - "test-data.ts"
Cohesion: 0.17
Nodes (16): DEFAULT_BUCKETS, DEFAULT_CATEGORIES, FinpointExport, BANK_BLURB, between(), BUCKETS, CATEGORIES, DAILY (+8 more)

### Community 25 - "drive-sync.ts"
Cohesion: 0.34
Nodes (18): exportData(), downloadBackupFile(), driveFetch(), findBackupFile(), getClockSkewMs(), getFileMeta(), isDriveConfigured(), uploadBackupFile() (+10 more)

### Community 26 - "paginated-data-table.tsx"
Cohesion: 0.26
Nodes (23): @tanstack/react-table, DataTable(), PaginatedDataTable(), PaginationHeader(), GroupHeaderRow(), groupStarts(), GroupTotal(), isInteractiveTarget() (+15 more)

### Community 27 - "types.d.ts"
Cohesion: 0.11
Nodes (18): Account, Allocation, AnalyticsSummary, AnalyticsTreatment, Appearance, Bucket, Budget, Category (+10 more)

### Community 28 - "auth-vault.ts"
Cohesion: 0.32
Nodes (13): POST(), POST(), POST(), AUTH_COOKIE_NAME, authCookie(), authCookieConfig(), clientIp(), encryptionKey() (+5 more)

### Community 29 - "use-appearance.tsx"
Cohesion: 0.26
Nodes (14): Appearance, applyAppearance(), getStoredAppearance(), handleSystemThemeChange(), initializeAppearance(), isDarkMode(), listeners, mediaQuery() (+6 more)

### Community 30 - "motion.ts"
Cohesion: 0.30
Nodes (9): framer-motion, Sparkline(), Metric(), ValueSwap(), DURATION, EASE_DRAWER, EASE_IN_OUT, EASE_OUT (+1 more)

### Community 31 - "records.ts"
Cohesion: 0.12
Nodes (24): AccountActivity, NO_ACTIVITY, BudgetFilters, createBudget(), getBudget(), listBudgets(), tallyAllocations(), analyticsValues() (+16 more)

### Community 32 - "google-drive.ts"
Cohesion: 0.20
Nodes (14): AuthNeededError, cacheToken(), CodeResponse, DRIVE_FILENAME, DRIVE_SCOPE, DriveFileMeta, ensureDriveToken(), ensureDriveTokenSilent() (+6 more)

### Community 33 - "Validator"
Cohesion: 0.25
Nodes (13): updateAccount(), createBucket(), GROUPS, PACE_KINDS, setBucketTarget(), updateBucket(), validateBudget(), cleanInput() (+5 more)

### Community 34 - "category-history-chart.tsx"
Cohesion: 0.22
Nodes (12): aggregateSeries(), CategoryHistoryChart(), ChartMonth, ChartSeries, HistoryTooltip(), MonthTick(), prepareMonths(), prepareSeries() (+4 more)

### Community 35 - "(month)/page.tsx"
Cohesion: 0.11
Nodes (33): BucketDailyData, BucketUsageBar(), Comparison, comparisonRateText(), comparisonText(), ComparisonValue, DashboardBucket, DashboardCategory (+25 more)

### Community 36 - "sidebar.tsx"
Cohesion: 0.15
Nodes (17): SidebarContext, SidebarContextProps, SidebarGroupAction(), SidebarGroupContent(), SidebarInput(), SidebarMenuAction(), SidebarMenuBadge(), SidebarMenuButton() (+9 more)

### Community 37 - "amount-filter.tsx"
Cohesion: 0.30
Nodes (10): AmountFilter(), AmountRange, COMPARISONS, describe(), Draft, readRange(), upperBound(), InputGroupInput() (+2 more)

### Community 38 - "formatter"
Cohesion: 0.15
Nodes (13): arrowParentheses, bracketSameLine, bracketSpacing, jsxQuoteStyle, quoteProperties, quoteStyle, semicolons, trailingCommas (+5 more)

### Community 39 - "luxon"
Cohesion: 0.31
Nodes (8): luxon, compact(), INK, LEVELS, quantile(), rampCap(), SpendingCalendar(), WEEKDAYS

### Community 40 - "Graph refresh after code tasks"
Cohesion: 0.20
Nodes (9): Graph health warnings, graphify-out/graph.json, graphify-out/.graphify_labels.json, graphify-out/manifest.json, graphify-out/GRAPH_REPORT.md, graphify skill, graphify update ., Local graph artifacts (+1 more)

### Community 41 - "biome.json"
Cohesion: 0.18
Nodes (10): source, assist, actions, files, includes, linter, enabled, overrides (+2 more)

### Community 42 - "rules"
Cohesion: 0.18
Nodes (11): noAdjacentSpacesInRegex, noBannedTypes, noExtraBooleanCast, noUselessCatch, noUselessThisAlias, noUselessTypeConstraint, rules, noFloatingPromises (+3 more)

### Community 43 - "cashflow-chart.tsx"
Cohesion: 0.36
Nodes (7): CashflowChart(), CashflowPoint, colorChange(), currencyOrDash(), LegendItem(), seriesLabel(), StatefulActiveDot()

### Community 44 - "total-spending-chart.tsx"
Cohesion: 0.36
Nodes (8): LegendItem(), niceStep(), roundTick(), surplusAxis(), SurplusPoint, surplusZeroOffset(), TotalSpendingChart(), CashflowHistoryMonth

### Community 45 - "manifest.json"
Cohesion: 0.20
Nodes (9): background_color, description, display, icons, name, scope, short_name, start_url (+1 more)

### Community 46 - "shell-header.tsx"
Cohesion: 0.36
Nodes (6): AppHeader(), ShellHeader(), TITLES, SidebarTrigger(), SearchInit, useMonthParams()

### Community 47 - "formatter"
Cohesion: 0.25
Nodes (8): formatter, attributePosition, enabled, formatWithErrors, indentStyle, indentWidth, lineEnding, lineWidth

### Community 48 - "devDependencies"
Cohesion: 0.22
Nodes (9): devDependencies, @biomejs/biome, fake-indexeddb, @tailwindcss/postcss, @types/luxon, @types/node, @types/papaparse, @types/react (+1 more)

### Community 49 - "history.tsx"
Cohesion: 0.40
Nodes (4): getStoredHistory(), HistoryContext, HistoryItem, HistoryProvider()

### Community 50 - "optionalDependencies"
Cohesion: 0.29
Nodes (7): optionalDependencies, lightningcss-linux-x64-gnu, lightningcss-win32-x64-msvc, @rollup/rollup-linux-x64-gnu, @rollup/rollup-win32-x64-msvc, @tailwindcss/oxide-linux-x64-gnu, @tailwindcss/oxide-win32-x64-msvc

### Community 51 - "scripts"
Cohesion: 0.29
Nodes (7): scripts, build, dev, lint, lint:check, start, types:check

### Community 52 - "statements.ts"
Cohesion: 0.23
Nodes (12): removeStatementDismissals(), maskDescription(), inputToStored(), deletePendingStatement(), enrich(), ensureAllocationsFit(), getStatement(), replacementReview() (+4 more)

### Community 53 - "style"
Cohesion: 0.33
Nodes (6): style, noNamespace, noNonNullAssertion, useArrayLiterals, useAsConstAssertion, useBlockStatements

### Community 54 - "Finpoint icon concept"
Cohesion: 0.40
Nodes (5): Finpoint icon concept, Charcoal shadow halo, Circular point, Rounded F monogram, Off-white icon fill

### Community 55 - "Finpoint icon with charcoal shadow"
Cohesion: 0.40
Nodes (5): Finpoint icon with charcoal shadow, Charcoal shadow halo, Circular point, Rounded F monogram, Off-white icon fill

### Community 56 - "Finpoint"
Cohesion: 0.50
Nodes (4): Finpoint, Circular point, Rounded F monogram, Off-white icon fill

### Community 58 - "F monogram icon"
Cohesion: 0.67
Nodes (3): Circular dot beside F, Rounded F letterform, F monogram icon

### Community 59 - "JPG favicon icon"
Cohesion: 0.67
Nodes (3): JPG favicon dot, JPG favicon F letterform, JPG favicon icon

### Community 60 - "PNG favicon icon"
Cohesion: 0.67
Nodes (3): PNG favicon dot, PNG favicon F letterform, PNG favicon icon

### Community 61 - "SVG favicon icon"
Cohesion: 0.67
Nodes (3): SVG favicon dot, SVG favicon F letterform, SVG favicon icon

### Community 62 - "F monogram icon"
Cohesion: 0.67
Nodes (3): Circular dot beside F, Rounded F letterform, F monogram icon

### Community 63 - "F monogram icon"
Cohesion: 0.67
Nodes (3): Circular dot beside F, Rounded F letterform, F monogram icon

### Community 71 - "PaginationFooter"
Cohesion: 0.38
Nodes (11): pageHref(), pageWindow(), PaginationFooter(), Pagination(), PaginationContent(), PaginationEllipsis(), PaginationItem(), PaginationLink() (+3 more)

### Community 86 - "Commit Guide"
Cohesion: 0.40
Nodes (4): Branches, Commit Guide, Commits, Pull Requests

## Knowledge Gaps
- **69 isolated node(s):** `@fontsource-variable/inter`, `react-dom`, `shadcn`, `tailwindcss`, `tw-animate-css` (+64 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 490 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **7 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `cn()` connect `cn` to `Button`, `record-editor.tsx`, `budget-progress-chart.tsx`, `app-sidebar.tsx`, `(month)/layout.tsx`, `sync/page.tsx`, `combobox.tsx`, `utils.ts`, `providers.tsx`, `monthly/page.tsx`, `importer/page.tsx`, `icon.tsx`, `paginated-data-table.tsx`, `motion.ts`, `(month)/page.tsx`, `sidebar.tsx`, `amount-filter.tsx`, `luxon`, `total-spending-chart.tsx`, `shell-header.tsx`, `PaginationFooter`?**
  _High betweenness centrality (0.143) - this node is a cross-community bridge._
- **What connects `@fontsource-variable/inter`, `react-dom`, `shadcn` to the rest of the system?**
  _69 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Button` be split into smaller, more focused modules?**
  _Cohesion score 0.06043352312456298 - nodes in this community are weakly interconnected._
- **Why does `react` connect `record-editor.tsx` to `Button`, `cn`, `budget-progress-chart.tsx`, `(month)/layout.tsx`, `sync/page.tsx`, `package.json`, `combobox.tsx`, `utils.ts`, `providers.tsx`, `monthly/page.tsx`, `auto-sync.ts`, `importer/page.tsx`, `icon.tsx`, `paginated-data-table.tsx`, `use-appearance.tsx`, `category-history-chart.tsx`, `(month)/page.tsx`, `sidebar.tsx`, `amount-filter.tsx`, `total-spending-chart.tsx`, `shell-header.tsx`, `history.tsx`, `PaginationFooter`?**
  _High betweenness centrality (0.047) - this node is a cross-community bridge._
- **Should `record-editor.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.0900437845040929 - nodes in this community are weakly interconnected._
- **Why does `next` connect `Button` to `record-editor.tsx`, `(month)/page.tsx`, `budget-progress-chart.tsx`, `app-sidebar.tsx`, `(month)/layout.tsx`, `PaginationFooter`, `sync/page.tsx`, `cashflow-chart.tsx`, `package.json`, `total-spending-chart.tsx`, `shell-header.tsx`, `history.tsx`, `providers.tsx`, `monthly/page.tsx`, `importer/page.tsx`, `auth-vault.ts`?**
  _High betweenness centrality (0.030) - this node is a cross-community bridge._
- **Should `cn` be split into smaller, more focused modules?**
  _Cohesion score 0.07575757575757576 - nodes in this community are weakly interconnected._