# Graph Report - finpoint  (2026-10-13)

## Corpus Check
- 195 files · ~109,671 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 9 file(s) not represented in the graph (top: (none) 5, .example 1, .lock 1)

## Summary
- 1647 nodes · 5904 edges · 92 communities (79 shown, 13 thin omitted)
- Extraction: 96% EXTRACTED · 4% INFERRED · 0% AMBIGUOUS · INFERRED: 207 edges (avg confidence: 0.92)
- Token cost: unmeasured input · unmeasured output

## Graph Freshness
- Built from commit: `68e99f93`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- Account Allocation Views
- Budget Form Components
- Data Settings Workspace
- IndexedDB Domain Schema
- Dashboard Insight Cards
- Cashflow Chart Presentation
- Background Sync Engine
- Bank Statement Import
- Month Navigation Fields
- Seed Demo Data
- Form Input Patterns
- Custom Budget Views
- Domain View Types
- Drive Backup Operations
- Data Backup Restore
- Record Domain Operations
- Domain Input Validation
- Spending Surplus Charts
- Monthly Budget Charts
- Overlay Sidebar Primitives
- Google Drive Client
- Budget History Charts
- Chart Component System
- Statement Replacement Analytics
- Application Shell Navigation
- Monthly Dashboard Types
- Pagination Navigation
- Dashboard Analytics Queries
- Combobox Components
- Allocation Amount Display
- Shared UI Utilities
- OAuth Token Broker
- Spending Calendar Display
- Persistent UI State
- Chat Messaging Patterns
- Trigger Composition APIs
- Runtime Dependencies
- Suspicious Code Rules
- Package Configuration
- Correctness Lint Rules
- UI Component Configuration
- Design System Decisions
- Component CLI Commands
- JavaScript Formatting Rules
- Component Theme Customization
- Biome Tool Configuration
- Type Safety Rules
- Design System Showcase
- Web App Manifest
- General Formatting Rules
- Development Dependencies
- Platform Native Dependencies
- Project Commands
- Style Lint Rules
- Component MCP Tools
- Component Composition Patterns
- Component Styling Rules
- Repository Code Style
- Component System Overview
- Registry Authoring Patterns
- Visual Design Foundations
- Base Radix Differences
- Frontend Design Principles
- Icon Component Conventions
- Commit Branch Conventions
- TypeScript Compiler Configuration
- Application Architecture
- Graph Refresh Workflow
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
- Canonical Finance Concepts
- Finance Feature Overview
- Local Data Synchronization
- Generated Demo Data
- Progressive Web App

## God Nodes (most connected - your core abstractions)
1. `cn()` - 307 edges
2. `Button()` - 117 edges
3. `react` - 87 edges
4. `formatCurrency()` - 73 edges
5. `RecordEditorDialog()` - 62 edges
6. `RecordCreatorDialog()` - 46 edges
7. `UiIcon()` - 45 edges
8. `DataSettingsPage()` - 41 edges
9. `Card()` - 40 edges
10. `Input()` - 39 edges

## Surprising Connections (you probably didn't know these)
- `Select — multiple selection and object values (base only)` --references--> `SelectValue()`  [INFERRED]
  .agents/skills/shadcn/rules/base-vs-radix.md → src/components/ui/select.tsx
- `Button / trigger as non-button element (base only)` --references--> `Button()`  [INFERRED]
  .agents/skills/shadcn/rules/base-vs-radix.md → src/components/ui/button.tsx
- `Icons → [icons.md](./rules/icons.md)` --references--> `Button()`  [INFERRED]
  .agents/skills/shadcn/SKILL.md → src/components/ui/button.tsx
- `Card structure` --references--> `CardContent()`  [INFERRED]
  .agents/skills/shadcn/rules/composition.md → src/components/ui/card.tsx
- `Message surfaces use Bubble` --references--> `Badge()`  [INFERRED]
  .agents/skills/shadcn/rules/chat.md → src/components/ui/badge.tsx

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **Separated application layers** — agents_ui_layer, agents_domain_operations, agents_persistence_layer [EXTRACTED 1.00]
- **Committed graph refresh artifacts** — agents_graph_json, agents_graph_report, agents_graph_manifest, agents_graph_labels [EXTRACTED 1.00]
- **Separate meaning, accounting and spending planning** — context_category, context_treatment, context_monthly_budget, context_record [EXTRACTED 1.00]
- **Imported activity explained by managed records** — context_statement, context_allocation, context_record [EXTRACTED 1.00]

## Communities (92 total, 13 thin omitted)

### Community 0 - "Account Allocation Views"
Cohesion: 0.06
Nodes (99): AccountRow, CandidatePage, CategoryDialogState, Filters, DateRangeValue, Props, Props, RecordRow (+91 more)

### Community 1 - "Budget Form Components"
Cohesion: 0.06
Nodes (129): CategoryFormValues, EditableMonthlyBudget, PendingStatementValues, ReplacementReview, ReviewAllocation, Props, Props, FieldErrorItem (+121 more)

### Community 11 - "Data Settings Workspace"
Cohesion: 0.17
Nodes (23): StatusTone, DataSettingsPage(), MethodHeader(), StateRow(), WorkspaceRow(), AlertDialog(), AlertDialogAction(), AlertDialogCancel() (+15 more)

### Community 16 - "IndexedDB Domain Schema"
Cohesion: 0.08
Nodes (17): AccountRow, AnalyticsMonthRow, BudgetRecordRow, BudgetRow, CategoryRow, FinpointDB, MetaRow, MonthlyBudgetAmountRow (+9 more)

### Community 17 - "Dashboard Insight Cards"
Cohesion: 0.28
Nodes (13): MonthlyBudgetLine, DashboardPage(), HabitInsights(), InvestmentRow(), ReviewLinks(), ScopedCardTitle(), ScopeLabel(), WeekdayCard() (+5 more)

### Community 18 - "Cashflow Chart Presentation"
Cohesion: 0.36
Nodes (8): CashflowPoint, CashflowChart(), colorChange(), currencyOrDash(), LegendItem(), seriesLabel(), StatefulActiveDot(), mobileAmount

### Community 20 - "Background Sync Engine"
Cohesion: 0.13
Nodes (24): SyncActivity, SyncEvent, SyncKind, SyncSnapshot, DriveSyncResult, useSyncStatus(), emit(), finishCycle() (+16 more)

### Community 21 - "Bank Statement Import"
Cohesion: 0.16
Nodes (28): AccountActivity, ImportResult, Parsed, Row, FieldErrors, ValidationError, ImporterPage(), Step() (+20 more)

### Community 23 - "Month Navigation Fields"
Cohesion: 0.10
Nodes (33): Props, Props, ButtonVariant, Month, MonthCalProps, MonthLayout(), DateField(), parseValue() (+25 more)

### Community 24 - "Seed Demo Data"
Cohesion: 0.16
Nodes (17): FinpointExport, Meal, between(), generateTestData(), pad(), pick(), stamp(), slugify() (+9 more)

### Community 25 - "Form Input Patterns"
Cohesion: 0.12
Nodes (33): AmountRange, Draft, AmountFilter(), describe(), readRange(), upperBound(), ComboboxClear(), FieldLegend() (+25 more)

### Community 26 - "Custom Budget Views"
Cohesion: 0.13
Nodes (37): BudgetState, RowGroup, State, RowEntrance, BudgetCard(), formatBudgetDateWindow(), DataTable(), PaginatedDataTable() (+29 more)

### Community 27 - "Domain View Types"
Cohesion: 0.11
Nodes (18): Account, Allocation, AnalyticsSummary, AnalyticsTreatment, Appearance, Budget, Category, CategoryWithChildren (+10 more)

### Community 29 - "Drive Backup Operations"
Cohesion: 0.34
Nodes (18): driveStatus, DriveSyncOutcome, exportData(), downloadBackupFile(), driveFetch(), findBackupFile(), getClockSkewMs(), getFileMeta() (+10 more)

### Community 3 - "Data Backup Restore"
Cohesion: 0.21
Nodes (13): TableName, FinpointSettings, clearAllData(), downloadExport(), importData(), parseImportFile(), tableCounts(), readSettings() (+5 more)

### Community 31 - "Record Domain Operations"
Cohesion: 0.13
Nodes (23): AllocationRow, BudgetFilters, AllocationTally, ConflictError, RecordDetail, RecordFilters, RecordInput, RecordStatementInput (+15 more)

### Community 33 - "Domain Input Validation"
Cohesion: 0.23
Nodes (18): CategoryInput, Validator, updateAccount(), validateBudget(), cleanInput(), createCategory(), updateCategory(), amountFor() (+10 more)

### Community 34 - "Spending Surplus Charts"
Cohesion: 0.36
Nodes (8): SurplusPoint, CashflowHistoryMonth, LegendItem(), niceStep(), roundTick(), surplusAxis(), surplusZeroOffset(), TotalSpendingChart()

### Community 35 - "Monthly Budget Charts"
Cohesion: 0.39
Nodes (6): MonthlyBudgetUsageItem, arc(), centerCurrency(), MonthlyBudgetUsage(), formatChartCurrency(), compactAmount

### Community 36 - "Overlay Sidebar Primitives"
Cohesion: 0.11
Nodes (19): SidebarContextProps, DropdownMenu(), SidebarGroupAction(), SidebarGroupContent(), SidebarMenuAction(), SidebarMenuBadge(), SidebarMenuSkeleton(), SidebarMenuSub() (+11 more)

### Community 37 - "Google Drive Client"
Cohesion: 0.20
Nodes (14): AuthNeededError, CodeResponse, DriveFileMeta, Window, cacheToken(), ensureDriveToken(), ensureDriveTokenSilent(), googleClientId() (+6 more)

### Community 43 - "Budget History Charts"
Cohesion: 0.14
Nodes (22): BudgetProgressPoint, ChartMonth, ChartSeries, SpendingSeries, SpendingHistoryMonth, BudgetActiveDot(), BudgetProgressChart(), buildSeries() (+14 more)

### Community 5 - "Chart Component System"
Cohesion: 0.22
Nodes (12): ChartConfig, ChartContextProps, TooltipNameType, ChartContainer(), ChartLegendContent(), ChartStyle(), ChartTooltipContent(), getPayloadConfigFromPayload() (+4 more)

### Community 52 - "Statement Replacement Analytics"
Cohesion: 0.16
Nodes (23): AnalyticsRecord, AnalyticsSummary, ReplacementAllocation, ReplacementStatement, StatementFilters, StatementInput, countSuggestions(), dayDifference() (+15 more)

### Community 6 - "Application Shell Navigation"
Cohesion: 0.06
Nodes (70): AppearanceOption, Appearance, ResolvedAppearance, SearchInit, RootLayout(), NotFound(), Boot(), Providers() (+62 more)

### Community 7 - "Monthly Dashboard Types"
Cohesion: 0.10
Nodes (25): Comparison, ComparisonValue, DashboardData, DashboardMonthlyBudget, DashboardView, PaceData, Projection, WeekdayBreakdown (+17 more)

### Community 71 - "Pagination Navigation"
Cohesion: 0.38
Nodes (11): PaginationLinkProps, pageHref(), pageWindow(), PaginationFooter(), Pagination(), PaginationContent(), PaginationEllipsis(), PaginationItem() (+3 more)

### Community 8 - "Dashboard Analytics Queries"
Cohesion: 0.12
Nodes (37): DashboardInput, DashboardInsight, LoadedTables, TrendMonth, MonthlyFilters, contribution(), summarize(), avg() (+29 more)

### Community 14 - "Combobox Components"
Cohesion: 0.17
Nodes (8): ComboboxChip(), ComboboxChips(), ComboboxChipsInput(), ComboboxGroup(), ComboboxLabel(), ComboboxSeparator(), ComboboxTrigger(), @base-ui/react

### Community 19 - "Allocation Amount Display"
Cohesion: 0.22
Nodes (24): PendingCard(), AllocateBar(), Amount(), RecordAmount(), PendingStatementConfirmationSheet(), RecordOption(), RecordSearchSheet(), StatementOption() (+16 more)

### Community 2 - "Shared UI Utilities"
Cohesion: 0.08
Nodes (42): AlertAction(), ButtonGroup(), ButtonGroupSeparator(), ButtonGroupText(), DropdownMenuCheckboxItem(), DropdownMenuContent(), DropdownMenuGroup(), DropdownMenuItem() (+34 more)

### Community 28 - "OAuth Token Broker"
Cohesion: 0.32
Nodes (13): POST(), POST(), POST(), authCookie(), authCookieConfig(), clientIp(), encryptionKey(), rateLimit() (+5 more)

### Community 49 - "Spending Calendar Display"
Cohesion: 0.31
Nodes (8): compact(), quantile(), rampCap(), SpendingCalendar(), INK, LEVELS, WEEKDAYS, luxon

### Community 76 - "Chat Messaging Patterns"
Cohesion: 0.20
Nodes (10): ScrollArea(), ScrollBar(), Chat & Messaging, Contents, Escape hatch: the scroller hooks, Message rows use Message, Message surfaces use Bubble, Scrollable threads use MessageScroller (+2 more)

### Community 84 - "Trigger Composition APIs"
Cohesion: 0.50
Nodes (4): AlertDialogTrigger(), DropdownMenuTrigger(), SheetClose(), Composition: asChild (radix) vs render (base)

### Community 10 - "Runtime Dependencies"
Cohesion: 0.07
Nodes (30): dependencies, @base-ui/react, class-variance-authority, clsx, cmdk, dexie, dexie-react-hooks, @fontsource-variable/inter (+22 more)

### Community 12 - "Suspicious Code Rules"
Cohesion: 0.07
Nodes (28): suspicious, noAssignInExpressions, noAsyncPromiseExecutor, noCatchAssign, noClassAssign, noCompareNegZero, noControlCharactersInRegex, noDebugger (+20 more)

### Community 13 - "Package Configuration"
Cohesion: 0.07
Nodes (28): private, $schema, type, @biomejs/biome, clsx, cmdk, @fontsource-variable/inter, jose (+20 more)

### Community 15 - "Correctness Lint Rules"
Cohesion: 0.08
Nodes (26): noConstantCondition, noConstAssign, noEmptyCharacterClassInRegex, noEmptyPattern, noGlobalObjectCalls, noInvalidBuiltinInstantiation, noInvalidConstructorSuper, noNonoctalDecimalEscape (+18 more)

### Community 22 - "UI Component Configuration"
Cohesion: 0.09
Nodes (21): aliases, components, hooks, lib, ui, utils, iconLibrary, menuAccent (+13 more)

### Community 30 - "Design System Decisions"
Cohesion: 0.11
Nodes (18): Contents, Coverage check, Dark mode, Design Systems from DESIGN.md, Elevation, Focus, Inputs to Confirm, Picking a style (+10 more)

### Community 32 - "Component CLI Commands"
Cohesion: 0.12
Nodes (17): `add` — Add components, `apply` — Apply a preset to an existing project, `build` — Build a custom registry, Commands, Contents, `diff` — Check for updates, `docs` — Get component documentation URLs, Dry-Run Mode (+9 more)

### Community 38 - "JavaScript Formatting Rules"
Cohesion: 0.15
Nodes (13): arrowParentheses, bracketSameLine, bracketSpacing, jsxQuoteStyle, quoteProperties, quoteStyle, semicolons, trailingCommas (+5 more)

### Community 39 - "Component Theme Customization"
Cohesion: 0.14
Nodes (14): 1. Built-in variants, 2. Tailwind classes via `className`, 3. Add a new variant, 4. Wrapper components, Adding Custom Colors, Border Radius, Changing the Theme, Checking for Updates (+6 more)

### Community 41 - "Biome Tool Configuration"
Cohesion: 0.18
Nodes (10): source, assist, actions, files, includes, linter, enabled, overrides (+2 more)

### Community 42 - "Type Safety Rules"
Cohesion: 0.18
Nodes (11): noAdjacentSpacesInRegex, noBannedTypes, noExtraBooleanCast, noUselessCatch, noUselessThisAlias, noUselessTypeConstraint, rules, noFloatingPromises (+3 more)

### Community 44 - "Design System Showcase"
Cohesion: 0.15
Nodes (13): Block anatomy, Checklist, Components: Tiers and Block Anatomy, Contents, Do and Don't, Edge Cases, Helpers, Page Outline (+5 more)

### Community 45 - "Web App Manifest"
Cohesion: 0.20
Nodes (9): background_color, description, display, icons, name, scope, short_name, start_url (+1 more)

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

### Community 53 - "Style Lint Rules"
Cohesion: 0.33
Nodes (6): style, noNamespace, noNonNullAssertion, useArrayLiterals, useAsConstAssertion, useBlockStatements

### Community 72 - "Component MCP Tools"
Cohesion: 0.17
Nodes (11): Configuring Registries, Setup, `shadcn:get_add_command_for_items`, `shadcn:get_audit_checklist`, `shadcn:get_item_examples_from_registries`, `shadcn:get_project_registries`, `shadcn:list_items_in_registries`, shadcn MCP Server (+3 more)

### Community 73 - "Component Composition Patterns"
Cohesion: 0.17
Nodes (12): Avatar always needs AvatarFallback, Button has no isPending or isLoading prop, Callouts use Alert, Card structure, Choosing between overlay components, Component Composition, Contents, Dialog, Sheet, and Drawer always need a Title (+4 more)

### Community 74 - "Component Styling Rules"
Cohesion: 0.17
Nodes (12): Built-in variants first, className for layout only, Contents, No manual dark: color overrides, No raw color values for status/state indicators, No space-x-* / space-y-*, Prefer size-* over w-* h-* when equal, Prefer truncate shorthand (+4 more)

### Community 77 - "Repository Code Style"
Cohesion: 0.27
Nodes (10): APIs, Arguments, And Props, Code Style, Consistency, Core, Earning Its Place, Finpoint Style Additions, Grouping And Order, React / TypeScript Style (+2 more)

### Community 78 - "Component System Overview"
Cohesion: 0.20
Nodes (10): Component Docs, Examples, and Usage, Current Project Context, Design Systems from DESIGN.md, Detailed References, Key Fields, Key Patterns, Principles, Quick Reference (+2 more)

### Community 79 - "Registry Authoring Patterns"
Cohesion: 0.22
Nodes (9): Address Schemes, Build and Verify, GitHub Registries, Include, Item Definitions, Mental Model, Registry Authoring and Addresses, Registry Dependencies (+1 more)

### Community 80 - "Visual Design Foundations"
Cohesion: 0.25
Nodes (8): Color roles, Elevation, Foundations, Motion and icons, Palette, Radius, Spacing, Typography

### Community 81 - "Base Radix Differences"
Cohesion: 0.25
Nodes (8): Accordion, Base vs Radix, Button / trigger as non-button element (base only), Contents, Select, Select — multiple selection and object values (base only), Slider, ToggleGroup

### Community 83 - "Frontend Design Principles"
Cohesion: 0.29
Nodes (6): Design principles, Frontend Design, Ground your designs in the subject matter, More on writing in design, Process: plan, review against the brief, build, critique, Restraint and self-critique

### Community 85 - "Icon Component Conventions"
Cohesion: 0.50
Nodes (3): Icons, Icons in Button use data-icon attribute, Pass icons as component objects, not string keys

### Community 86 - "Commit Branch Conventions"
Cohesion: 0.25
Nodes (4): Branches, Commit Guide, Commits, Pull Requests

### Community 9 - "TypeScript Compiler Configuration"
Cohesion: 0.06
Nodes (33): compilerOptions, allowJs, allowSyntheticDefaultImports, allowUnusedLabels, esModuleInterop, forceConsistentCasingInFileNames, incremental, isolatedModules (+25 more)

### Community 4 - "Application Architecture"
Cohesion: 0.10
Nodes (10): Background Drive sync, Dexie IndexedDB, First-run seed, Generated test data, JSON export/import, React Compiler, Root Suspense, Versioned migrations (+2 more)

### Community 40 - "Graph Refresh Workflow"
Cohesion: 0.20
Nodes (9): Graph health warnings, graphify skill, graphify update ., Local graph artifacts, Project Graph, graphify-out/graph.json, graphify-out/.graphify_labels.json, graphify-out/manifest.json (+1 more)

### Community 54 - "Icon Concept Branding"
Cohesion: 0.40
Nodes (5): Charcoal shadow halo, Circular point, Rounded F monogram, Off-white icon fill, Finpoint icon concept

### Community 55 - "Shadow Icon Branding"
Cohesion: 0.40
Nodes (5): Charcoal shadow halo, Circular point, Rounded F monogram, Off-white icon fill, Finpoint icon with charcoal shadow

### Community 56 - "Finpoint Brand Identity"
Cohesion: 0.50
Nodes (4): Circular point, Rounded F monogram, Off-white icon fill, Finpoint

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

### Community 46 - "Canonical Finance Concepts"
Cohesion: 0.23
Nodes (13): Account, Allocation, Budget, Category, Finpoint, Monthly Budget, Monthly Budget amount, Pending Record (+5 more)

### Community 82 - "Finance Feature Overview"
Cohesion: 0.32
Nodes (8): Allocator, Budgets, Categories, Dashboard, Statement-allocation-record model, Monthly Budgets, Records, Statement importer

### Community 87 - "Local Data Synchronization"
Cohesion: 0.50
Nodes (4): Google Drive sync, JSON backup and restore, Local-first finance tracking, Sync conflict handling

## Knowledge Gaps
- **76 isolated node(s):** `@biomejs/biome`, `@fontsource-variable/inter`, `lightningcss-linux-x64-gnu`, `lightningcss-win32-x64-msvc`, `react-dom` (+71 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 612 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **13 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `cn()` connect `Shared UI Utilities` to `Account Allocation Views`, `Budget Form Components`, `Chart Component System`, `Application Shell Navigation`, `Monthly Dashboard Types`, `Data Settings Workspace`, `Combobox Components`, `Dashboard Insight Cards`, `Allocation Amount Display`, `Bank Statement Import`, `Month Navigation Fields`, `Form Input Patterns`, `Custom Budget Views`, `Design System Decisions`, `Spending Surplus Charts`, `Monthly Budget Charts`, `Overlay Sidebar Primitives`, `Design System Showcase`, `Spending Calendar Display`, `Pagination Navigation`, `Component Styling Rules`, `Chat Messaging Patterns`?**
  _High betweenness centrality (0.190) - this node is a cross-community bridge._
- **Are the 4 inferred relationships involving `cn()` (e.g. with `Helpers` and `Type scale`) actually correct?**
  _`cn()` has 4 INFERRED edges - model-reasoned connections that need verification._
- **What connects `@biomejs/biome`, `@fontsource-variable/inter`, `lightningcss-linux-x64-gnu` to the rest of the system?**
  _76 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Account Allocation Views` be split into smaller, more focused modules?**
  _Cohesion score 0.06434547244094488 - nodes in this community are weakly interconnected._
- **Why does `Button()` connect `Budget Form Components` to `Account Allocation Views`, `Shared UI Utilities`, `Overlay Sidebar Primitives`, `Application Shell Navigation`, `Monthly Dashboard Types`, `Pagination Navigation`, `Data Settings Workspace`, `Combobox Components`, `Base Radix Differences`, `Dashboard Insight Cards`, `Allocation Amount Display`, `Bank Statement Import`, `Month Navigation Fields`, `Form Input Patterns`, `Custom Budget Views`?**
  _High betweenness centrality (0.053) - this node is a cross-community bridge._
- **Are the 9 inferred relationships involving `Button()` (e.g. with `Known traps` and `Step 5: Map Component Recipes to Variants`) actually correct?**
  _`Button()` has 9 INFERRED edges - model-reasoned connections that need verification._
- **Should `Budget Form Components` be split into smaller, more focused modules?**
  _Cohesion score 0.06284602723327846 - nodes in this community are weakly interconnected._
Host semantic extraction token usage: unmeasured.

Refresh diagnostics: no missing or dangling endpoints, self-loops, or same-endpoint collapsed edges in the merged extraction. The structural extractor reported no symbols for postcss.config.mjs; this is an existing extractor limitation. Nine unsupported files were skipped. Untouched document/image semantic content and four hyperedges were preserved.
