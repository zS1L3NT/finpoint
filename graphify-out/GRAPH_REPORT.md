# Graph Report - t3-14490122  (2026-10-14)

## Corpus Check
- 195 files · ~118,265 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 9 file(s) not represented in the graph (top: (none) 5, .example 1, .lock 1)

## Summary
- 1596 nodes · 6140 edges · 86 communities (79 shown, 7 thin omitted)
- Extraction: 98% EXTRACTED · 2% INFERRED · 0% AMBIGUOUS · INFERRED: 118 edges (avg confidence: 0.86)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `c38d6840`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- Button
- pending/page.tsx
- daily-spending-chart.tsx
- (month)/page.tsx
- cn
- budgets/[id]/page.tsx
- sidebar.tsx
- round2
- Validator
- dashboard.ts
- importer/page.tsx
- compilerOptions
- db.ts
- package.json
- dependencies
- Project Shape
- utils.ts
- budgets/page.tsx
- suspicious
- statements.ts
- sync/page.tsx
- correctness
- export-import.ts
- drive-sync.ts
- next
- records.ts
- components.json
- Commands
- icon.tsx
- combobox.tsx
- test-data.ts
- date-range.tsx
- STYLE.md
- Validation rule (ValidationError + Validator)
- auto-sync.ts
- spending-calendar.tsx
- category-history-chart.tsx
- Changed Bank Descriptions
- Fix Duplicates — UI redesign
- auth-vault.ts
- duplicates.ts
- src/data/* (persistence, migrations, seeding, backup serialization, Drive storage)
- AGENTS.md
- amount-filter.tsx
- types.d.ts
- monthpicker.tsx
- google-drive.ts
- formatter
- monthly-budget-usage.tsx
- biome.json
- rules
- devDependencies
- manifest.json
- cashflow-chart.tsx
- Next.js agent rules block ("This is NOT the Next.js you know")
- Fix duplicate bank statements
- Project Graph
- total-spending-chart.tsx
- formatter
- Commit Guide
- Records
- snapshot-hash.ts
- optionalDependencies
- scripts
- style
- Finpoint icon concept
- Finpoint icon with charcoal shadow
- Finpoint
- Local Markdown Issue Tracker
- Google Drive sync
- 01: Review and fix duplicate bank statements in Workflows
- F monogram icon
- JPG favicon icon
- PNG favicon icon
- SVG favicon icon
- F monogram icon
- F monogram icon
- Finpoint app icon
- Domain Documentation Conflicts
- Unrestricted crawler policy
- Generated demo data
- Progressive Web Application
- Issue tracker: Local Markdown
- Domain docs

## God Nodes (most connected - your core abstractions)
1. `cn()` - 309 edges
2. `Button()` - 114 edges
3. `react` - 87 edges
4. `formatCurrency()` - 79 edges
5. `RecordEditorDialog()` - 62 edges
6. `UiIcon()` - 47 edges
7. `RecordCreatorDialog()` - 46 edges
8. `round2()` - 46 edges
9. `next` - 41 edges
10. `PageContent()` - 40 edges

## Surprising Connections (you probably didn't know these)
- `Decisions` --references--> `Alert()`  [INFERRED]
  .scratch/fix-duplicates/design.md → src/components/ui/alert.tsx
- `Problems with the current page` --references--> `Alert()`  [INFERRED]
  .scratch/fix-duplicates/design.md → src/components/ui/alert.tsx
- `Decisions` --references--> `Badge()`  [INFERRED]
  .scratch/fix-duplicates/design.md → src/components/ui/badge.tsx
- `Decisions` --references--> `Button()`  [INFERRED]
  .scratch/fix-duplicates/design.md → src/components/ui/button.tsx
- `Decisions` --references--> `Empty()`  [INFERRED]
  .scratch/fix-duplicates/design.md → src/components/ui/empty.tsx

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **Project graph refresh workflow** — agents_graph_refresh_rule, agents_graphify_update, agents_graphify_skill, agents_graph_artifacts_committed, agents_graph_local_only_rule [EXTRACTED 1.00]
- **UI / logic / data layer segregation** — agents_ui_layer, agents_logic_layer, agents_data_layer, agents_data_import_boundary [EXTRACTED 1.00]
- **Laravel-shaped validation pipeline** — agents_validation_rule, agents_validation_error, agents_validator, src_logic_validate, agents_laravel_shaped_error_maps [EXTRACTED 1.00]
- **Fix Duplicates workflow (choose keeper, delete, or mark separate)** — _scratch_fix_duplicates_design_keep_delete_toggle, _scratch_fix_duplicates_design_not_a_duplicate_action, src_components_dialogs_duplicate_review, _scratch_fix_duplicates_design_silent_completion [INFERRED 0.85]

## Communities (86 total, 7 thin omitted)

### Community 0 - "Button"
Cohesion: 0.09
Nodes (88): CandidateResults(), RecordCreatorHost(), class-variance-authority, sonner, @tanstack/react-form, AccountDialog(), BudgetCreatorDialog(), BudgetEditorDialog() (+80 more)

### Community 1 - "pending/page.tsx"
Cohesion: 0.09
Nodes (83): AccountPage(), AccountCard(), AccountRow, AccountsPage(), CARD_MOTION, DuplicateGroupCard(), FixDuplicatesPage(), GroupHeader() (+75 more)

### Community 2 - "daily-spending-chart.tsx"
Cohesion: 0.14
Nodes (26): BudgetActiveDot(), BudgetProgressChart(), BudgetProgressPoint, buildSeries(), colorChange(), CHART_INTRO_MS, useChartIntro(), DailySpendingChart() (+18 more)

### Community 3 - "(month)/page.tsx"
Cohesion: 0.15
Nodes (28): Comparison, comparisonRateText(), comparisonText(), ComparisonValue, DashboardData, DashboardMonthlyBudget, DashboardPage(), DashboardView (+20 more)

### Community 4 - "cn"
Cohesion: 0.11
Nodes (26): CategoryFilter(), CategoryFilterItem(), AlertAction(), Command(), CommandEmpty(), CommandGroup(), CommandInput(), CommandItem() (+18 more)

### Community 5 - "budgets/[id]/page.tsx"
Cohesion: 0.09
Nodes (59): BudgetPage(), getBudgetAnalytics(), getCategoryData(), Legend(), EmptyRecords(), MonthlyRecordsPage(), metadata, PrivacyPage() (+51 more)

### Community 6 - "sidebar.tsx"
Cohesion: 0.13
Nodes (20): AppHeader(), SidebarContext, SidebarContextProps, SidebarGroupAction(), SidebarGroupContent(), SidebarInput(), SidebarMenuAction(), SidebarMenuBadge() (+12 more)

### Community 7 - "round2"
Cohesion: 0.30
Nodes (19): PendingCard(), PendingStatementConfirmationSheet(), RecordOption(), RecordSearchSheet(), StatementOption(), StatementSearchSheet(), Input(), Sheet() (+11 more)

### Community 8 - "Validator"
Cohesion: 0.25
Nodes (17): updateAccount(), validateBudget(), cleanInput(), dismissDuplicatePair(), fixDuplicates(), amountFor(), createMonthlyBudget(), MONTHLY_BUDGET_GROUPS (+9 more)

### Community 9 - "dashboard.ts"
Cohesion: 0.11
Nodes (41): db, AnalyticsRecord, AnalyticsSummary, contribution(), summarize(), avg(), buildCashflowHistory(), buildCategories() (+33 more)

### Community 10 - "importer/page.tsx"
Cohesion: 0.21
Nodes (23): ACCEPT, BANKS_REQUIRING_ADDITIONAL_INFO, ImporterPage(), Step(), asPending(), BANKS, ensureAccount(), combine() (+15 more)

### Community 11 - "compilerOptions"
Cohesion: 0.06
Nodes (33): compilerOptions, allowJs, allowSyntheticDefaultImports, allowUnusedLabels, esModuleInterop, forceConsistentCasingInFileNames, incremental, isolatedModules (+25 more)

### Community 12 - "db.ts"
Cohesion: 0.09
Nodes (18): dexie, fake-indexeddb, AccountRow, AllocationRow, AnalyticsMonthRow, BudgetRecordRow, BudgetRow, CategoryRow (+10 more)

### Community 13 - "package.json"
Cohesion: 0.06
Nodes (31): private, $schema, type, babel-plugin-react-compiler, @base-ui/react, @biomejs/biome, clsx, cmdk (+23 more)

### Community 14 - "dependencies"
Cohesion: 0.07
Nodes (30): dependencies, @base-ui/react, class-variance-authority, clsx, cmdk, dexie, dexie-react-hooks, @fontsource-variable/inter (+22 more)

### Community 15 - "Project Shape"
Cohesion: 0.18
Nodes (9): app/**/page.tsx, IndexedDB (Dexie), Interactive routes are "use client" (search params via next/navigation), Pages take no props, Project Shape, React Compiler (enabled), Root Suspense (keeps routes static), URL search params (filters and pagination) (+1 more)

### Community 16 - "utils.ts"
Cohesion: 0.12
Nodes (20): radix-ui, react, ButtonGroupSeparator(), ButtonGroupText(), FieldSeparator(), Item(), ItemActions(), ItemContent() (+12 more)

### Community 17 - "budgets/page.tsx"
Cohesion: 0.09
Nodes (53): BUDGET_STATES, BudgetCard(), BudgetsPage(), BudgetState, formatBudgetDateWindow(), framer-motion, @tanstack/react-table, Sparkline() (+45 more)

### Community 18 - "suspicious"
Cohesion: 0.07
Nodes (28): suspicious, noAssignInExpressions, noAsyncPromiseExecutor, noCatchAssign, noClassAssign, noCompareNegZero, noControlCharactersInRegex, noDebugger (+20 more)

### Community 19 - "statements.ts"
Cohesion: 0.15
Nodes (25): countSuggestions(), removeStatementDismissals(), enrichRecords(), subtitle(), dayDifference(), ensureCanReplace(), maskDescription(), ReplacementAllocation (+17 more)

### Community 20 - "sync/page.tsx"
Cohesion: 0.14
Nodes (26): COUNT_ROWS, DataSettingsPage(), StateRow(), STATUS_TONES, StatusTone, WorkspaceRow(), AlertDialog(), AlertDialogAction() (+18 more)

### Community 21 - "correctness"
Cohesion: 0.08
Nodes (26): noConstantCondition, noConstAssign, noEmptyCharacterClassInRegex, noEmptyPattern, noGlobalObjectCalls, noInvalidBuiltinInstantiation, noInvalidConstructorSuper, noNonoctalDecimalEscape (+18 more)

### Community 22 - "export-import.ts"
Cohesion: 0.21
Nodes (15): clearAllData(), downloadExport(), importData(), parseImportFile(), SYNC_TABLES, tableCounts(), TableName, TABLES (+7 more)

### Community 23 - "drive-sync.ts"
Cohesion: 0.27
Nodes (22): exportData(), downloadBackupFile(), driveFetch(), findBackupFile(), getClockSkewMs(), getFileMeta(), isDriveConfigured(), uploadBackupFile() (+14 more)

### Community 24 - "next"
Cohesion: 0.15
Nodes (14): MonthLayout(), nextConfig, luxon, next, ButtonGroup(), buttonGroupVariants, HistoryContext, HistoryItem (+6 more)

### Community 25 - "records.ts"
Cohesion: 0.15
Nodes (18): CategoryInput, AllocationTally, pendingStatementIds(), tallyAllocations(), analyticsValues(), budgetCovers(), ConflictError, createRecord() (+10 more)

### Community 26 - "components.json"
Cohesion: 0.09
Nodes (21): aliases, components, hooks, lib, ui, utils, iconLibrary, menuAccent (+13 more)

### Community 27 - "Commands"
Cohesion: 0.38
Nodes (7): Biome (biome check --write), bun install, bun lint (write-mode), bun lint:check, bun run build, bun types:check, Commands

### Community 28 - "icon.tsx"
Cohesion: 0.05
Nodes (74): metadata, RootLayout(), viewport, NotFound(), Boot(), Providers(), Template(), lucide-react (+66 more)

### Community 29 - "combobox.tsx"
Cohesion: 0.14
Nodes (17): ComboboxField(), Props, ComboboxChip(), ComboboxChips(), ComboboxChipsInput(), ComboboxClear(), ComboboxContent(), ComboboxEmpty() (+9 more)

### Community 30 - "test-data.ts"
Cohesion: 0.15
Nodes (18): DEFAULT_CATEGORIES, DEFAULT_MONTHLY_BUDGETS, EXPORT_VERSION, FinpointExport, seedIfEmpty(), BANK_BLURB, between(), CATEGORIES (+10 more)

### Community 31 - "date-range.tsx"
Cohesion: 0.19
Nodes (18): react-day-picker, DateField(), Props, DateRange(), DateRangeValue, formatRange(), Props, rangeFromValue() (+10 more)

### Community 32 - "STYLE.md"
Cohesion: 0.17
Nodes (13): APIs, Arguments, And Props, Code Style, Consistency, Copy, Core, Earning Its Place, Finpoint Style Additions, Grouping And Order (+5 more)

### Community 33 - "Validation rule (ValidationError + Validator)"
Cohesion: 0.50
Nodes (4): Old Laravel Api/*Controller mapping, Laravel-shaped { field: string[] } error maps, ValidationError, Validator

### Community 34 - "auto-sync.ts"
Cohesion: 0.15
Nodes (18): useSyncStatus(), emit(), eventListeners, finishCycle(), getSyncSnapshot(), refreshTimes(), sameSnapshot(), set() (+10 more)

### Community 35 - "spending-calendar.tsx"
Cohesion: 0.36
Nodes (7): compact(), INK, LEVELS, quantile(), rampCap(), SpendingCalendar(), WEEKDAYS

### Community 36 - "category-history-chart.tsx"
Cohesion: 0.24
Nodes (11): aggregateSeries(), CategoryHistoryChart(), ChartMonth, ChartSeries, HistoryTooltip(), MonthTick(), prepareMonths(), prepareSeries() (+3 more)

### Community 37 - "Changed Bank Descriptions"
Cohesion: 0.11
Nodes (18): Drive Baseline Migration, Duplicate Dismissal Migration, Duplicate Allocation Resolution, Atomic Statement Cleanup, Dismissal Migration and Backup, Desktop and Mobile Smoke Checks, Conservative Duplicate Suggestions, Pair-specific Dismissals (+10 more)

### Community 38 - "Fix Duplicates — UI redesign"
Cohesion: 0.10
Nodes (22): dismissDuplicatePair, DuplicateGroup.allocations field, Marked separate view, CONTEXT.md (domain vocabulary), Account, Allocation, Budget, Category (+14 more)

### Community 39 - "auth-vault.ts"
Cohesion: 0.29
Nodes (14): POST(), POST(), POST(), jose, AUTH_COOKIE_NAME, authCookie(), authCookieConfig(), clientIp() (+6 more)

### Community 40 - "duplicates.ts"
Cohesion: 0.31
Nodes (8): descriptionAnchors(), descriptionIdentity(), DuplicateStatement, eligible(), FixDuplicatesInput, GENERIC, sameDayKey(), strongMatch()

### Community 41 - "src/data/* (persistence, migrations, seeding, backup serialization, Drive storage)"
Cohesion: 0.38
Nodes (8): Background Drive sync, src/data/* (persistence, migrations, seeding, backup serialization, Drive storage), src/logic/* (domain reads and operations), (month) route-group shell (Overview + Monthly Records), src/routes.ts (centralized route paths), Static content pages (privacy, terms) are server components, UI layer (app pages + components), Workspace backup/reset operations

### Community 42 - "AGENTS.md"
Cohesion: 0.18
Nodes (12): Agent Behavior, Agent skills, CONTEXT.md, Conventions, Domain docs (single-context layout), Domain Language, Generated / Ignored Files, Issue tracker (local specs and tickets) (+4 more)

### Community 43 - "amount-filter.tsx"
Cohesion: 0.20
Nodes (15): AmountFilter(), AmountRange, COMPARISONS, describe(), Draft, readRange(), upperBound(), InputGroup() (+7 more)

### Community 44 - "types.d.ts"
Cohesion: 0.13
Nodes (14): Account, Allocation, AnalyticsSummary, AnalyticsTreatment, Appearance, Budget, Category, CategoryWithChildren (+6 more)

### Community 45 - "monthpicker.tsx"
Cohesion: 0.33
Nodes (6): ButtonVariant, Month, MonthCal(), MonthCalProps, MonthPicker(), MONTHS

### Community 46 - "google-drive.ts"
Cohesion: 0.24
Nodes (12): AuthNeededError, cacheToken(), CodeResponse, disconnectDrive(), DriveFileMeta, ensureDriveToken(), ensureDriveTokenSilent(), googleClientId() (+4 more)

### Community 47 - "formatter"
Cohesion: 0.15
Nodes (13): arrowParentheses, bracketSameLine, bracketSpacing, jsxQuoteStyle, quoteProperties, quoteStyle, semicolons, trailingCommas (+5 more)

### Community 49 - "monthly-budget-usage.tsx"
Cohesion: 0.39
Nodes (6): arc(), centerCurrency(), MonthlyBudgetUsage(), MonthlyBudgetUsageItem, compactAmount, formatChartCurrency()

### Community 51 - "biome.json"
Cohesion: 0.18
Nodes (10): source, assist, actions, files, includes, linter, enabled, overrides (+2 more)

### Community 52 - "rules"
Cohesion: 0.18
Nodes (11): noAdjacentSpacesInRegex, noBannedTypes, noExtraBooleanCast, noUselessCatch, noUselessThisAlias, noUselessTypeConstraint, rules, noFloatingPromises (+3 more)

### Community 54 - "devDependencies"
Cohesion: 0.20
Nodes (10): devDependencies, babel-plugin-react-compiler, @biomejs/biome, fake-indexeddb, @tailwindcss/postcss, @types/luxon, @types/node, @types/papaparse (+2 more)

### Community 55 - "manifest.json"
Cohesion: 0.20
Nodes (9): background_color, description, display, icons, name, scope, short_name, start_url (+1 more)

### Community 56 - "cashflow-chart.tsx"
Cohesion: 0.31
Nodes (9): CashflowChart(), CashflowPoint, colorChange(), currencyOrDash(), LegendItem(), mobileAmount, seriesLabel(), StatefulActiveDot() (+1 more)

### Community 57 - "Next.js agent rules block ("This is NOT the Next.js you know")"
Cohesion: 0.18
Nodes (9): app/api/auth/* Route Handlers, bun test, node_modules/next/dist/server/lib/generate-agent-files.js, Google OAuth broker (exchange/token/logout), Domain and importer tests (Dexie with in-memory IndexedDB), Next.js App Router app (mostly client-side), node_modules/next/dist/docs/, npm run dev (port 5173) (+1 more)

### Community 58 - "Fix duplicate bank statements"
Cohesion: 0.22
Nodes (8): Fix duplicate bank statements, Further Notes, Implementation Decisions, Out of Scope, Problem Statement, Solution, Testing Decisions, User Stories

### Community 59 - "Project Graph"
Cohesion: 0.39
Nodes (6): Committed graph artifacts (graph.json, GRAPH_REPORT.md, manifest.json, .graphify_labels.json), Graph health warnings and refresh failure reporting, graphify-out/graph.json, graphify skill (--update), graphify update ., Project Graph

### Community 60 - "total-spending-chart.tsx"
Cohesion: 0.31
Nodes (9): recharts, LegendItem(), niceStep(), roundTick(), surplusAxis(), SurplusPoint, surplusZeroOffset(), TotalSpendingChart() (+1 more)

### Community 61 - "formatter"
Cohesion: 0.25
Nodes (8): formatter, attributePosition, enabled, formatWithErrors, indentStyle, indentWidth, lineEnding, lineWidth

### Community 62 - "Commit Guide"
Cohesion: 0.25
Nodes (4): Branches, Commit Guide, Commits, Pull Requests

### Community 63 - "Records"
Cohesion: 0.32
Nodes (8): Allocator, Budgets, Categories, Dashboard, Statement-allocation-record model, Monthly Budgets, Records, Statement importer

### Community 64 - "snapshot-hash.ts"
Cohesion: 0.40
Nodes (4): FinpointDB, digestSnapshot(), hashLegacySnapshot(), Snapshot

### Community 65 - "optionalDependencies"
Cohesion: 0.29
Nodes (7): optionalDependencies, lightningcss-linux-x64-gnu, lightningcss-win32-x64-msvc, @rollup/rollup-linux-x64-gnu, @rollup/rollup-win32-x64-msvc, @tailwindcss/oxide-linux-x64-gnu, @tailwindcss/oxide-win32-x64-msvc

### Community 66 - "scripts"
Cohesion: 0.29
Nodes (7): scripts, build, dev, lint, lint:check, start, types:check

### Community 68 - "style"
Cohesion: 0.33
Nodes (6): style, noNamespace, noNonNullAssertion, useArrayLiterals, useAsConstAssertion, useBlockStatements

### Community 70 - "Finpoint icon concept"
Cohesion: 0.40
Nodes (5): Finpoint icon concept, Charcoal shadow halo, Circular point, Rounded F monogram, Off-white icon fill

### Community 71 - "Finpoint icon with charcoal shadow"
Cohesion: 0.40
Nodes (5): Finpoint icon with charcoal shadow, Charcoal shadow halo, Circular point, Rounded F monogram, Off-white icon fill

### Community 74 - "Finpoint"
Cohesion: 0.50
Nodes (4): Finpoint, Circular point, Rounded F monogram, Off-white icon fill

### Community 75 - "Local Markdown Issue Tracker"
Cohesion: 0.50
Nodes (4): Local Tracker Operations, Spec and Ticket Files, Ticket Lifecycle, Local Markdown Issue Tracker

### Community 77 - "Google Drive sync"
Cohesion: 0.50
Nodes (4): Google Drive sync, JSON backup and restore, Local-first finance tracking, Sync conflict handling

### Community 78 - "01: Review and fix duplicate bank statements in Workflows"
Cohesion: 0.50
Nodes (3): 01: Review and fix duplicate bank statements in Workflows, Completion evidence, PR preparation

### Community 79 - "F monogram icon"
Cohesion: 0.67
Nodes (3): Circular dot beside F, Rounded F letterform, F monogram icon

### Community 80 - "JPG favicon icon"
Cohesion: 0.67
Nodes (3): JPG favicon dot, JPG favicon F letterform, JPG favicon icon

### Community 81 - "PNG favicon icon"
Cohesion: 0.67
Nodes (3): PNG favicon dot, PNG favicon F letterform, PNG favicon icon

### Community 82 - "SVG favicon icon"
Cohesion: 0.67
Nodes (3): SVG favicon dot, SVG favicon F letterform, SVG favicon icon

### Community 83 - "F monogram icon"
Cohesion: 0.67
Nodes (3): Circular dot beside F, Rounded F letterform, F monogram icon

### Community 84 - "F monogram icon"
Cohesion: 0.67
Nodes (3): Circular dot beside F, Rounded F letterform, F monogram icon

### Community 91 - "Issue tracker: Local Markdown"
Cohesion: 0.40
Nodes (4): Files, Issue tracker: Local Markdown, Skill operations, Status and dependencies

### Community 92 - "Domain docs"
Cohesion: 0.50
Nodes (3): Before exploration, Domain docs, Writing

## Knowledge Gaps
- **89 isolated node(s):** `@fontsource-variable/inter`, `react-dom`, `shadcn`, `tailwindcss`, `tw-animate-css` (+84 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 520 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **7 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `cn()` connect `cn` to `Button`, `pending/page.tsx`, `daily-spending-chart.tsx`, `(month)/page.tsx`, `budgets/[id]/page.tsx`, `sidebar.tsx`, `round2`, `importer/page.tsx`, `utils.ts`, `budgets/page.tsx`, `sync/page.tsx`, `next`, `icon.tsx`, `combobox.tsx`, `date-range.tsx`, `spending-calendar.tsx`, `amount-filter.tsx`, `monthpicker.tsx`, `monthly-budget-usage.tsx`, `total-spending-chart.tsx`?**
  _High betweenness centrality (0.130) - this node is a cross-community bridge._
- **What connects `@fontsource-variable/inter`, `react-dom`, `shadcn` to the rest of the system?**
  _89 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Button` be split into smaller, more focused modules?**
  _Cohesion score 0.09118204804045513 - nodes in this community are weakly interconnected._
- **Why does `react` connect `utils.ts` to `Button`, `pending/page.tsx`, `daily-spending-chart.tsx`, `(month)/page.tsx`, `cn`, `budgets/[id]/page.tsx`, `sidebar.tsx`, `round2`, `importer/page.tsx`, `package.json`, `budgets/page.tsx`, `sync/page.tsx`, `next`, `icon.tsx`, `combobox.tsx`, `date-range.tsx`, `auto-sync.ts`, `amount-filter.tsx`, `monthpicker.tsx`, `monthly-budget-usage.tsx`, `total-spending-chart.tsx`?**
  _High betweenness centrality (0.058) - this node is a cross-community bridge._
- **Should `pending/page.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.08710985716804796 - nodes in this community are weakly interconnected._
- **Why does `next` connect `next` to `Button`, `pending/page.tsx`, `daily-spending-chart.tsx`, `(month)/page.tsx`, `budgets/[id]/page.tsx`, `auth-vault.ts`, `importer/page.tsx`, `package.json`, `total-spending-chart.tsx`, `budgets/page.tsx`, `sync/page.tsx`, `cashflow-chart.tsx`, `icon.tsx`?**
  _High betweenness centrality (0.044) - this node is a cross-community bridge._
- **Should `daily-spending-chart.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.13725490196078433 - nodes in this community are weakly interconnected._