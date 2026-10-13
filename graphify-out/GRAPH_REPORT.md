# Graph Report - t3-7b03443b  (2026-10-14)

## Corpus Check
- 186 files · ~109,907 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 9 file(s) not represented in the graph (top: (none) 5, .example 1, .lock 1)

## Summary
- 1462 nodes · 5613 edges · 73 communities (63 shown, 10 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 61 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `0b1bfd31`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- record-search.tsx
- record-editor.tsx
- cn
- export-import.ts
- Next.js App Router
- chart.tsx
- app-sidebar.tsx
- use-persistent-state.ts
- dashboard.ts
- compilerOptions
- dependencies
- sync/page.tsx
- suspicious
- package.json
- correctness
- db.ts
- (month)/page.tsx
- utils.ts
- auto-sync.ts
- ValidationError
- components.json
- Button
- test-data.ts
- amount-filter.tsx
- budgets/page.tsx
- types.d.ts
- auth-vault.ts
- drive-sync.ts
- records.ts
- Validator
- cashflow-chart.tsx
- react
- google-drive.ts
- formatter
- category-filter.tsx
- Graph refresh after code tasks
- biome.json
- rules
- category-history-chart.tsx
- manifest.json
- Record
- formatter
- devDependencies
- total-spending-chart.tsx
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
- formatCurrency
- spending-calendar.tsx
- Style Guide
- snapshot-hash.ts
- Records
- Commit Guide
- Google Drive sync
- Generated demo data
- Progressive Web Application

## God Nodes (most connected - your core abstractions)
1. `cn()` - 302 edges
2. `Button()` - 108 edges
3. `react` - 88 edges
4. `formatCurrency()` - 75 edges
5. `RecordEditorDialog()` - 62 edges
6. `RecordCreatorDialog()` - 46 edges
7. `UiIcon()` - 45 edges
8. `DataSettingsPage()` - 41 edges
9. `next` - 39 edges
10. `useHistory()` - 39 edges

## Surprising Connections (you probably didn't know these)
- `BudgetState` --calls--> `parseDate()`  [EXTRACTED]
  app/budgets/page.tsx → src/lib/utils.ts
- `Boot()` --indirect_call--> `preloadCategoryIcons()`  [INFERRED]
  app/providers.tsx → src/components/icon.tsx
- `MonthLayout()` --calls--> `PageContent()`  [EXTRACTED]
  app/(month)/layout.tsx → src/components/layout/page-content.tsx
- `MonthLayout()` --calls--> `Button()`  [EXTRACTED]
  app/(month)/layout.tsx → src/components/ui/button.tsx
- `MonthLayout()` --calls--> `useHistory()`  [EXTRACTED]
  app/(month)/layout.tsx → src/history.tsx

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **Separated application layers** — agents_ui_layer, agents_domain_operations, agents_persistence_layer [EXTRACTED 1.00]
- **Committed graph refresh artifacts** — agents_graph_json, agents_graph_report, agents_graph_manifest, agents_graph_labels [EXTRACTED 1.00]
- **Separate meaning, accounting and spending planning** — context_category, context_treatment, context_monthly_budget, context_record [EXTRACTED 1.00]
- **Imported activity explained by managed records** — context_statement, context_allocation, context_record [EXTRACTED 1.00]

## Communities (73 total, 10 thin omitted)

### Community 0 - "record-search.tsx"
Cohesion: 0.29
Nodes (19): PendingStatementConfirmationSheet(), RecordOption(), RecordSearchSheet(), StatementOption(), StatementSearchSheet(), Badge(), badgeVariants, Input() (+11 more)

### Community 1 - "record-editor.tsx"
Cohesion: 0.08
Nodes (93): AllocatorPendingPage(), CandidatePage, CandidateResults(), PendingCard(), sonner, @tanstack/react-form, AllocatorTabs(), AccountDialog() (+85 more)

### Community 2 - "cn"
Cohesion: 0.07
Nodes (37): AlertAction(), ComboboxChip(), ComboboxChips(), ComboboxChipsInput(), ComboboxClear(), ComboboxGroup(), ComboboxInput(), ComboboxLabel() (+29 more)

### Community 3 - "export-import.ts"
Cohesion: 0.23
Nodes (12): EXPORT_VERSION, FinpointExport, importData(), parseImportFile(), SYNC_TABLES, TableName, TABLES, DEFAULT_SETTINGS (+4 more)

### Community 4 - "Next.js App Router"
Cohesion: 0.10
Nodes (10): Background Drive sync, CONTEXT.md, Dexie IndexedDB, First-run seed, Generated test data, JSON export/import, Installed Next.js documentation, React Compiler (+2 more)

### Community 5 - "chart.tsx"
Cohesion: 0.23
Nodes (11): ChartConfig, ChartContext, ChartContextProps, ChartLegendContent(), ChartStyle(), ChartTooltipContent(), getPayloadConfigFromPayload(), INITIAL_DIMENSION (+3 more)

### Community 6 - "app-sidebar.tsx"
Cohesion: 0.07
Nodes (56): metadata, RootLayout(), viewport, Boot(), Providers(), AppearanceOption, APPEARANCES, AppearanceSwitch() (+48 more)

### Community 8 - "dashboard.ts"
Cohesion: 0.14
Nodes (35): contribution(), summarize(), avg(), BREAKDOWN_MONTHS, buildCashflowHistory(), buildCategories(), buildComparison(), buildMonthlyBudgets() (+27 more)

### Community 9 - "compilerOptions"
Cohesion: 0.06
Nodes (33): compilerOptions, allowJs, allowSyntheticDefaultImports, allowUnusedLabels, esModuleInterop, forceConsistentCasingInFileNames, incremental, isolatedModules (+25 more)

### Community 10 - "dependencies"
Cohesion: 0.07
Nodes (30): dependencies, @base-ui/react, class-variance-authority, clsx, cmdk, dexie, dexie-react-hooks, @fontsource-variable/inter (+22 more)

### Community 11 - "sync/page.tsx"
Cohesion: 0.15
Nodes (24): COUNT_ROWS, DataSettingsPage(), StateRow(), STATUS_TONES, StatusTone, WorkspaceRow(), AlertDialog(), AlertDialogAction() (+16 more)

### Community 12 - "suspicious"
Cohesion: 0.07
Nodes (28): suspicious, noAssignInExpressions, noAsyncPromiseExecutor, noCatchAssign, noClassAssign, noCompareNegZero, noControlCharactersInRegex, noDebugger (+20 more)

### Community 13 - "package.json"
Cohesion: 0.07
Nodes (27): private, $schema, type, @biomejs/biome, clsx, cmdk, @fontsource-variable/inter, lightningcss-linux-x64-gnu (+19 more)

### Community 15 - "correctness"
Cohesion: 0.08
Nodes (26): noConstantCondition, noConstAssign, noEmptyCharacterClassInRegex, noEmptyPattern, noGlobalObjectCalls, noInvalidBuiltinInstantiation, noInvalidConstructorSuper, noNonoctalDecimalEscape (+18 more)

### Community 16 - "db.ts"
Cohesion: 0.08
Nodes (21): dexie, AccountRow, AllocationRow, AnalyticsMonthRow, BudgetRecordRow, BudgetRow, CategoryRow, db (+13 more)

### Community 17 - "(month)/page.tsx"
Cohesion: 0.10
Nodes (29): Comparison, ComparisonValue, DashboardData, DashboardMonthlyBudget, DashboardPage(), DashboardView, InvestmentRow(), PaceData (+21 more)

### Community 19 - "utils.ts"
Cohesion: 0.09
Nodes (41): MonthLayout(), @base-ui/react, class-variance-authority, lucide-react, luxon, react-day-picker, DateField(), Props (+33 more)

### Community 20 - "auto-sync.ts"
Cohesion: 0.13
Nodes (24): useSyncStatus(), emit(), eventListeners, finishCycle(), flushOnHide(), getSyncSnapshot(), ingestManualResult(), markDirty() (+16 more)

### Community 21 - "ValidationError"
Cohesion: 0.22
Nodes (22): papaparse, xlsx, asPending(), ensureAccount(), combine(), dbsDescriptionKey(), descriptionKey(), importDbs() (+14 more)

### Community 22 - "components.json"
Cohesion: 0.09
Nodes (21): aliases, components, hooks, lib, ui, utils, iconLibrary, menuAccent (+13 more)

### Community 23 - "Button"
Cohesion: 0.05
Nodes (145): AccountPage(), AccountCard(), AccountRow, AccountsPage(), AllocatorPage(), BudgetPage(), getBudgetAnalytics(), getCategoryData() (+137 more)

### Community 24 - "test-data.ts"
Cohesion: 0.18
Nodes (15): DEFAULT_CATEGORIES, DEFAULT_MONTHLY_BUDGETS, BANK_BLURB, between(), CATEGORIES, DAILY, generateTestData(), Meal (+7 more)

### Community 25 - "amount-filter.tsx"
Cohesion: 0.30
Nodes (10): AmountFilter(), AmountRange, COMPARISONS, describe(), Draft, readRange(), upperBound(), InputGroupInput() (+2 more)

### Community 26 - "budgets/page.tsx"
Cohesion: 0.09
Nodes (49): BUDGET_STATES, BudgetCard(), BudgetsPage(), BudgetState, formatBudgetDateWindow(), framer-motion, @tanstack/react-table, DataTable() (+41 more)

### Community 27 - "types.d.ts"
Cohesion: 0.11
Nodes (18): Account, Allocation, AnalyticsSummary, AnalyticsTreatment, Appearance, Budget, Category, CategoryWithChildren (+10 more)

### Community 28 - "auth-vault.ts"
Cohesion: 0.29
Nodes (14): POST(), POST(), POST(), jose, AUTH_COOKIE_NAME, authCookie(), authCookieConfig(), clientIp() (+6 more)

### Community 29 - "drive-sync.ts"
Cohesion: 0.35
Nodes (18): exportData(), downloadBackupFile(), driveFetch(), findBackupFile(), getClockSkewMs(), getFileMeta(), isDriveConfigured(), uploadBackupFile() (+10 more)

### Community 31 - "records.ts"
Cohesion: 0.17
Nodes (18): getBudget(), tallyAllocations(), analyticsValues(), budgetCovers(), ConflictError, createRecord(), enrichRecords(), expandCategoryIds() (+10 more)

### Community 33 - "Validator"
Cohesion: 0.24
Nodes (18): updateAccount(), validateBudget(), cleanInput(), createCategory(), updateCategory(), amountFor(), createMonthlyBudget(), listMonthlyBudgets() (+10 more)

### Community 34 - "cashflow-chart.tsx"
Cohesion: 0.36
Nodes (8): CashflowChart(), CashflowPoint, colorChange(), currencyOrDash(), LegendItem(), mobileAmount, seriesLabel(), StatefulActiveDot()

### Community 36 - "react"
Cohesion: 0.10
Nodes (26): radix-ui, react, AppHeader(), TITLES, ButtonGroupSeparator(), FieldSeparator(), ItemSeparator(), Separator() (+18 more)

### Community 37 - "google-drive.ts"
Cohesion: 0.20
Nodes (14): AuthNeededError, cacheToken(), CodeResponse, disconnectDrive(), DRIVE_FILENAME, DRIVE_SCOPE, DriveFileMeta, ensureDriveToken() (+6 more)

### Community 38 - "formatter"
Cohesion: 0.15
Nodes (13): arrowParentheses, bracketSameLine, bracketSpacing, jsxQuoteStyle, quoteProperties, quoteStyle, semicolons, trailingCommas (+5 more)

### Community 39 - "category-filter.tsx"
Cohesion: 0.17
Nodes (18): Props, CategoryFilter(), CategoryFilterItem(), Command(), CommandEmpty(), CommandGroup(), CommandInput(), CommandItem() (+10 more)

### Community 40 - "Graph refresh after code tasks"
Cohesion: 0.20
Nodes (9): Graph health warnings, graphify-out/graph.json, graphify-out/.graphify_labels.json, graphify-out/manifest.json, graphify-out/GRAPH_REPORT.md, graphify skill, graphify update ., Local graph artifacts (+1 more)

### Community 41 - "biome.json"
Cohesion: 0.18
Nodes (10): source, assist, actions, files, includes, linter, enabled, overrides (+2 more)

### Community 42 - "rules"
Cohesion: 0.18
Nodes (11): noAdjacentSpacesInRegex, noBannedTypes, noExtraBooleanCast, noUselessCatch, noUselessThisAlias, noUselessTypeConstraint, rules, noFloatingPromises (+3 more)

### Community 43 - "category-history-chart.tsx"
Cohesion: 0.15
Nodes (25): recharts, BudgetActiveDot(), BudgetProgressChart(), BudgetProgressPoint, buildSeries(), colorChange(), aggregateSeries(), CategoryHistoryChart() (+17 more)

### Community 45 - "manifest.json"
Cohesion: 0.20
Nodes (9): background_color, description, display, icons, name, scope, short_name, start_url (+1 more)

### Community 46 - "Record"
Cohesion: 0.23
Nodes (13): Account, Allocation, Budget, Category, Finpoint, Monthly Budget, Monthly Budget amount, Pending Record (+5 more)

### Community 47 - "formatter"
Cohesion: 0.25
Nodes (8): formatter, attributePosition, enabled, formatWithErrors, indentStyle, indentWidth, lineEnding, lineWidth

### Community 48 - "devDependencies"
Cohesion: 0.25
Nodes (8): devDependencies, @biomejs/biome, @tailwindcss/postcss, @types/luxon, @types/node, @types/papaparse, @types/react, @types/react-dom

### Community 49 - "total-spending-chart.tsx"
Cohesion: 0.31
Nodes (9): LegendItem(), niceStep(), roundTick(), surplusAxis(), SurplusPoint, surplusZeroOffset(), TotalSpendingChart(), dayTicks() (+1 more)

### Community 50 - "optionalDependencies"
Cohesion: 0.29
Nodes (7): optionalDependencies, lightningcss-linux-x64-gnu, lightningcss-win32-x64-msvc, @rollup/rollup-linux-x64-gnu, @rollup/rollup-win32-x64-msvc, @tailwindcss/oxide-linux-x64-gnu, @tailwindcss/oxide-win32-x64-msvc

### Community 51 - "scripts"
Cohesion: 0.29
Nodes (7): scripts, build, dev, lint, lint:check, start, types:check

### Community 52 - "statements.ts"
Cohesion: 0.16
Nodes (24): countSuggestions(), AnalyticsRecord, AnalyticsSummary, dayDifference(), ensureCanReplace(), maskDescription(), ReplacementAllocation, replacementComparison() (+16 more)

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

### Community 70 - "formatCurrency"
Cohesion: 0.31
Nodes (10): comparisonRateText(), comparisonText(), deltaOf(), SummaryBand(), arc(), centerCurrency(), MonthlyBudgetUsage(), MonthlyBudgetUsageItem (+2 more)

### Community 71 - "spending-calendar.tsx"
Cohesion: 0.36
Nodes (7): compact(), INK, LEVELS, quantile(), rampCap(), SpendingCalendar(), WEEKDAYS

### Community 77 - "Style Guide"
Cohesion: 0.27
Nodes (10): APIs, Arguments, And Props, Code Style, Consistency, Core, Earning Its Place, Finpoint Style Additions, Grouping And Order, React / TypeScript Style (+2 more)

### Community 78 - "snapshot-hash.ts"
Cohesion: 0.40
Nodes (4): FinpointDB, digestSnapshot(), hashLegacySnapshot(), Snapshot

### Community 82 - "Records"
Cohesion: 0.32
Nodes (8): Allocator, Budgets, Categories, Dashboard, Statement-allocation-record model, Monthly Budgets, Records, Statement importer

### Community 86 - "Commit Guide"
Cohesion: 0.25
Nodes (4): Branches, Commit Guide, Commits, Pull Requests

### Community 87 - "Google Drive sync"
Cohesion: 0.50
Nodes (4): Google Drive sync, JSON backup and restore, Local-first finance tracking, Sync conflict handling

## Knowledge Gaps
- **76 isolated node(s):** `@fontsource-variable/inter`, `react-dom`, `shadcn`, `tailwindcss`, `tw-animate-css` (+71 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 491 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **10 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `cn()` connect `cn` to `record-search.tsx`, `record-editor.tsx`, `react`, `chart.tsx`, `formatCurrency`, `spending-calendar.tsx`, `category-filter.tsx`, `app-sidebar.tsx`, `sync/page.tsx`, `category-history-chart.tsx`, `(month)/page.tsx`, `total-spending-chart.tsx`, `utils.ts`, `Button`, `amount-filter.tsx`, `budgets/page.tsx`?**
  _High betweenness centrality (0.137) - this node is a cross-community bridge._
- **What connects `@fontsource-variable/inter`, `react-dom`, `shadcn` to the rest of the system?**
  _76 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `record-editor.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.07741046831955922 - nodes in this community are weakly interconnected._
- **Why does `react` connect `react` to `record-search.tsx`, `record-editor.tsx`, `cn`, `chart.tsx`, `app-sidebar.tsx`, `formatCurrency`, `category-filter.tsx`, `use-persistent-state.ts`, `sync/page.tsx`, `category-history-chart.tsx`, `package.json`, `(month)/page.tsx`, `total-spending-chart.tsx`, `utils.ts`, `auto-sync.ts`, `Button`, `amount-filter.tsx`, `budgets/page.tsx`?**
  _High betweenness centrality (0.048) - this node is a cross-community bridge._
- **Should `cn` be split into smaller, more focused modules?**
  _Cohesion score 0.06972789115646258 - nodes in this community are weakly interconnected._
- **Why does `Button()` connect `Button` to `record-search.tsx`, `record-editor.tsx`, `cn`, `react`, `app-sidebar.tsx`, `category-filter.tsx`, `sync/page.tsx`, `(month)/page.tsx`, `utils.ts`, `amount-filter.tsx`, `budgets/page.tsx`?**
  _High betweenness centrality (0.030) - this node is a cross-community bridge._
- **Should `Next.js App Router` be split into smaller, more focused modules?**
  _Cohesion score 0.09956709956709957 - nodes in this community are weakly interconnected._