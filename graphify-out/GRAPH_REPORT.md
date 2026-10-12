# Graph Report - finpoint  (2026-10-13)

## Corpus Check
- 201 files · ~127,153 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 9 file(s) not represented in the graph (top: (none) 4, .css 2, .example 1)

## Summary
- 1647 nodes · 5894 edges · 87 communities (78 shown, 9 thin omitted)
- Extraction: 97% EXTRACTED · 3% INFERRED · 0% AMBIGUOUS · INFERRED: 202 edges (avg confidence: 0.92)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `2002b188`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- Accounts and Allocation
- Record Forms and Dialogs
- cn
- allocator-tabs.tsx
- Architecture and Domain Documentation
- Financial Charts
- Sidebar and Settings Navigation
- Monthly Dashboard
- Dashboard Aggregation Engine
- TypeScript Compiler Settings
- Runtime Dependencies
- Sync Settings Interface
- Lint Safety Rules
- Package Metadata
- Date Forms and Filters
- Lint Correctness Rules
- Database Schema
- utils.ts
- cashflow-chart.tsx
- Pending Statement Review
- Background Sync Engine
- importer/page.tsx
- Component Generator Settings
- importer.test.ts
- Seed and Sample Data
- Google Drive File Operations
- paginated-data-table.tsx
- Shared Domain Types
- OAuth Broker and Cookies
- Application Boot and Layout
- Appearance and Theme State
- Allocation and Record Queries
- Google Drive Authentication
- Validator
- dropdown-menu.tsx
- motion.ts
- Sidebar Primitives
- Commands
- JavaScript Formatting Rules
- Design Systems from DESIGN.md
- Graph Maintenance Workflow
- Biome Tool Configuration
- Lint Complexity Rules
- Category History Charts
- Chart Primitives
- Web App Manifest
- Shell Headers and Titles
- General Formatting Settings
- Development Dependencies
- Spending Calendar
- Platform Binary Dependencies
- Project Commands
- statements.ts
- Lint Style Rules
- Brand Icon Concept
- Shadow Icon Variant
- Vector Brand Icon
- Apple Touch Icon
- JPG Favicon Artwork
- PNG Favicon Artwork
- SVG Favicon Artwork
- Small App Icon
- Large App Icon
- Next.js Development Instructions
- Brand Palette Prompt
- Biome Verification
- String Primary Keys
- Crawler Policy
- Customization & Theming
- pagination.tsx
- color-pair.tsx
- Tools
- Component Composition
- Styling & Customization
- category-filter.tsx
- The Design System Page
- shadcn/ui
- Registry Authoring and Addresses
- showcase-coverage.mjs
- Foundations
- Base vs Radix
- Chat & Messaging
- Frontend Design
- Commit Guide

## God Nodes (most connected - your core abstractions)
1. `cn()` - 309 edges
2. `Button()` - 117 edges
3. `react` - 88 edges
4. `formatCurrency()` - 70 edges
5. `RecordEditorDialog()` - 62 edges
6. `RecordCreatorDialog()` - 46 edges
7. `UiIcon()` - 45 edges
8. `DataSettingsPage()` - 41 edges
9. `Card()` - 40 edges
10. `ValidationError` - 40 edges

## Surprising Connections (you probably didn't know these)
- `Message surfaces use Bubble` --references--> `Badge()`  [INFERRED]
  .agents/skills/shadcn/rules/chat.md → src/components/ui/badge.tsx
- `Button / trigger as non-button element (base only)` --references--> `Button()`  [INFERRED]
  .agents/skills/shadcn/rules/base-vs-radix.md → src/components/ui/button.tsx
- `Icons → [icons.md](./rules/icons.md)` --references--> `Button()`  [INFERRED]
  .agents/skills/shadcn/SKILL.md → src/components/ui/button.tsx
- `Card structure` --references--> `CardContent()`  [INFERRED]
  .agents/skills/shadcn/rules/composition.md → src/components/ui/card.tsx
- `Scrollable threads use MessageScroller` --references--> `ScrollArea()`  [INFERRED]
  .agents/skills/shadcn/rules/chat.md → src/components/ui/scroll-area.tsx

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **Separated application layers** — agents_ui_layer, agents_domain_operations, agents_persistence_layer [EXTRACTED 1.00]
- **Committed graph refresh artifacts** — agents_graph_json, agents_graph_report, agents_graph_manifest, agents_graph_labels [EXTRACTED 1.00]
- **Separate meaning, accounting and spending planning** — context_category, context_treatment, context_spending_bucket, context_record [EXTRACTED 1.00]
- **Imported activity explained by managed records** — context_statement, context_allocation, context_record [EXTRACTED 1.00]

## Communities (87 total, 9 thin omitted)

### Community 0 - "Accounts and Allocation"
Cohesion: 0.06
Nodes (99): Known traps, Workflow, AccountPage(), AccountCard(), AccountRow, AccountsPage(), AllocatorPage(), AllocatorPendingPage() (+91 more)

### Community 1 - "Record Forms and Dialogs"
Cohesion: 0.07
Nodes (125): Fonts, Option sets (2–7 choices) use ToggleGroup, Component Structure → [composition.md](./rules/composition.md), CandidateResults(), BudgetPage(), getBudgetAnalytics(), getCategoryData(), Legend() (+117 more)

### Community 2 - "cn"
Cohesion: 0.09
Nodes (36): Attachments use Attachment, Chat & Messaging → [chat.md](./rules/chat.md), CLI, Critical Rules, Icons → [icons.md](./rules/icons.md), Styling & Tailwind → [styling.md](./rules/styling.md), Use Components, Not Custom Markup → [composition.md](./rules/composition.md), AlertAction() (+28 more)

### Community 3 - "allocator-tabs.tsx"
Cohesion: 0.29
Nodes (10): AllocatorTabs(), DEFAULT_SETTINGS, FinpointSettings, readSettings(), replaceSettings(), useDefaultFilterEndDateToday(), useDefaultFilterStartDate(), useSettings() (+2 more)

### Community 4 - "Architecture and Domain Documentation"
Cohesion: 0.05
Nodes (41): Background Drive sync, CONTEXT.md, Dexie IndexedDB, First-run seed, Generated test data, JSON export/import, Installed Next.js documentation, React Compiler (+33 more)

### Community 5 - "Financial Charts"
Cohesion: 0.18
Nodes (20): recharts, BudgetActiveDot(), BudgetProgressChart(), BudgetProgressPoint, buildSeries(), colorChange(), CHART_INTRO_MS, useChartIntro() (+12 more)

### Community 6 - "Sidebar and Settings Navigation"
Cohesion: 0.15
Nodes (27): NotFound(), lucide-react, AppearanceOption, APPEARANCES, AppearanceSwitch(), AppSidebar(), SyncDot(), SYSTEM_APPEARANCE (+19 more)

### Community 7 - "Monthly Dashboard"
Cohesion: 0.12
Nodes (27): BucketDailyData, BucketUsageBar(), Comparison, ComparisonValue, DashboardBucket, DashboardCategory, DashboardData, DashboardPage() (+19 more)

### Community 8 - "Dashboard Aggregation Engine"
Cohesion: 0.16
Nodes (30): contribution(), summarize(), avg(), buildBuckets(), buildCashflowHistory(), buildCategories(), buildComparison(), buildProjection() (+22 more)

### Community 9 - "TypeScript Compiler Settings"
Cohesion: 0.06
Nodes (33): compilerOptions, allowJs, allowSyntheticDefaultImports, allowUnusedLabels, esModuleInterop, forceConsistentCasingInFileNames, incremental, isolatedModules (+25 more)

### Community 10 - "Runtime Dependencies"
Cohesion: 0.07
Nodes (30): dependencies, @base-ui/react, class-variance-authority, clsx, cmdk, dexie, dexie-react-hooks, @fontsource-variable/inter (+22 more)

### Community 11 - "Sync Settings Interface"
Cohesion: 0.14
Nodes (28): COUNT_ROWS, DataSettingsPage(), StateRow(), STATUS_TONES, StatusTone, WorkspaceRow(), AlertDialog(), AlertDialogAction() (+20 more)

### Community 12 - "Lint Safety Rules"
Cohesion: 0.07
Nodes (28): suspicious, noAssignInExpressions, noAsyncPromiseExecutor, noCatchAssign, noClassAssign, noCompareNegZero, noControlCharactersInRegex, noDebugger (+20 more)

### Community 13 - "Package Metadata"
Cohesion: 0.07
Nodes (27): private, $schema, type, @biomejs/biome, clsx, cmdk, @fontsource-variable/inter, lightningcss-linux-x64-gnu (+19 more)

### Community 14 - "Date Forms and Filters"
Cohesion: 0.06
Nodes (56): BudgetCard(), BudgetState, formatBudgetDateWindow(), MonthLayout(), @base-ui/react, react-day-picker, ComboboxField(), Props (+48 more)

### Community 15 - "Lint Correctness Rules"
Cohesion: 0.08
Nodes (26): noConstantCondition, noConstAssign, noEmptyCharacterClassInRegex, noEmptyPattern, noGlobalObjectCalls, noInvalidBuiltinInstantiation, noInvalidConstructorSuper, noNonoctalDecimalEscape (+18 more)

### Community 16 - "Database Schema"
Cohesion: 0.09
Nodes (22): dexie, AccountRow, AllocationRow, AnalyticsMonthRow, BucketDefaultRow, BucketRow, BucketTargetRow, BudgetRecordRow (+14 more)

### Community 17 - "utils.ts"
Cohesion: 0.18
Nodes (12): comparisonRateText(), comparisonText(), deltaOf(), PendingValue(), SummaryBand(), AllocateBar(), CategoryMovers(), Mover (+4 more)

### Community 18 - "cashflow-chart.tsx"
Cohesion: 0.31
Nodes (8): CashflowChart(), CashflowPoint, colorChange(), currencyOrDash(), LegendItem(), seriesLabel(), StatefulActiveDot(), CashflowHistoryMonth

### Community 19 - "Pending Statement Review"
Cohesion: 0.10
Nodes (55): Step 5: Map Component Recipes to Variants, Composition: asChild (radix) vs render (base), Buttons inside inputs use InputGroup + InputGroupAddon, Contents, Field validation and disabled states, FieldSet + FieldLegend for grouping related fields, Forms & Inputs, Forms use FieldGroup + Field (+47 more)

### Community 20 - "Background Sync Engine"
Cohesion: 0.13
Nodes (24): useSyncStatus(), emit(), eventListeners, finishCycle(), flushOnHide(), getSyncSnapshot(), ingestManualResult(), markDirty() (+16 more)

### Community 21 - "importer/page.tsx"
Cohesion: 0.17
Nodes (26): ACCEPT, BANKS_REQUIRING_ADDITIONAL_INFO, Step(), asPending(), BANKS, AccountActivity, ensureAccount(), NO_ACTIVITY (+18 more)

### Community 22 - "Component Generator Settings"
Cohesion: 0.09
Nodes (21): aliases, components, hooks, lib, ui, utils, iconLibrary, menuAccent (+13 more)

### Community 24 - "Seed and Sample Data"
Cohesion: 0.17
Nodes (16): DEFAULT_BUCKETS, DEFAULT_CATEGORIES, FinpointExport, BANK_BLURB, between(), BUCKETS, CATEGORIES, DAILY (+8 more)

### Community 25 - "Google Drive File Operations"
Cohesion: 0.34
Nodes (18): exportData(), downloadBackupFile(), driveFetch(), findBackupFile(), getClockSkewMs(), getFileMeta(), isDriveConfigured(), uploadBackupFile() (+10 more)

### Community 26 - "paginated-data-table.tsx"
Cohesion: 0.24
Nodes (23): @tanstack/react-table, DataTable(), PaginatedDataTable(), PaginationHeader(), GroupHeaderRow(), groupStarts(), GroupTotal(), isInteractiveTarget() (+15 more)

### Community 27 - "Shared Domain Types"
Cohesion: 0.11
Nodes (18): Account, Allocation, AnalyticsSummary, AnalyticsTreatment, Appearance, Bucket, Budget, Category (+10 more)

### Community 28 - "OAuth Broker and Cookies"
Cohesion: 0.29
Nodes (14): POST(), POST(), POST(), jose, AUTH_COOKIE_NAME, authCookie(), authCookieConfig(), clientIp() (+6 more)

### Community 29 - "Application Boot and Layout"
Cohesion: 0.15
Nodes (18): Step 2: Install Everything, metadata, RootLayout(), viewport, Boot(), Providers(), @vercel/analytics, @vercel/speed-insights (+10 more)

### Community 30 - "Appearance and Theme State"
Cohesion: 0.27
Nodes (13): applyAppearance(), getStoredAppearance(), handleSystemThemeChange(), initializeAppearance(), isDarkMode(), listeners, mediaQuery(), notify() (+5 more)

### Community 31 - "Allocation and Record Queries"
Cohesion: 0.16
Nodes (19): tallyAllocations(), analyticsValues(), budgetCovers(), ConflictError, createRecord(), enrichRecords(), expandCategoryIds(), RecordDetail (+11 more)

### Community 32 - "Google Drive Authentication"
Cohesion: 0.17
Nodes (16): AuthNeededError, cacheToken(), CodeResponse, disconnectDrive(), DRIVE_FILENAME, DRIVE_SCOPE, DriveFileMeta, ensureDriveToken() (+8 more)

### Community 33 - "Validator"
Cohesion: 0.26
Nodes (12): updateAccount(), createBucket(), GROUPS, PACE_KINDS, setBucketTarget(), updateBucket(), validateBudget(), cleanInput() (+4 more)

### Community 34 - "dropdown-menu.tsx"
Cohesion: 0.12
Nodes (16): Items always inside their Group component, Icons, Icons in Button use data-icon attribute, No sizing classes on icons inside components, Pass icons as component objects, not string keys, DropdownMenuCheckboxItem(), DropdownMenuContent(), DropdownMenuGroup() (+8 more)

### Community 35 - "motion.ts"
Cohesion: 0.19
Nodes (14): framer-motion, Sparkline(), Delta, Metric(), ValueSwap(), STALE_MONTH_CLASS, takeMonthDirection(), useMonthTransition() (+6 more)

### Community 36 - "Sidebar Primitives"
Cohesion: 0.16
Nodes (17): SidebarContext, SidebarContextProps, SidebarGroupAction(), SidebarGroupContent(), SidebarInput(), SidebarMenuAction(), SidebarMenuBadge(), SidebarMenuButton() (+9 more)

### Community 37 - "Commands"
Cohesion: 0.12
Nodes (17): `add` — Add components, `apply` — Apply a preset to an existing project, `build` — Build a custom registry, Commands, Contents, `diff` — Check for updates, `docs` — Get component documentation URLs, Dry-Run Mode (+9 more)

### Community 38 - "JavaScript Formatting Rules"
Cohesion: 0.15
Nodes (13): arrowParentheses, bracketSameLine, bracketSpacing, jsxQuoteStyle, quoteProperties, quoteStyle, semicolons, trailingCommas (+5 more)

### Community 39 - "Design Systems from DESIGN.md"
Cohesion: 0.12
Nodes (17): Contents, Coverage check, Dark mode, Design Systems from DESIGN.md, Elevation, Focus, Inputs to Confirm, Picking a style (+9 more)

### Community 40 - "Graph Maintenance Workflow"
Cohesion: 0.20
Nodes (9): Graph health warnings, graphify-out/graph.json, graphify-out/.graphify_labels.json, graphify-out/manifest.json, graphify-out/GRAPH_REPORT.md, graphify skill, graphify update ., Local graph artifacts (+1 more)

### Community 41 - "Biome Tool Configuration"
Cohesion: 0.18
Nodes (10): source, assist, actions, files, includes, linter, enabled, overrides (+2 more)

### Community 42 - "Lint Complexity Rules"
Cohesion: 0.18
Nodes (11): noAdjacentSpacesInRegex, noBannedTypes, noExtraBooleanCast, noUselessCatch, noUselessThisAlias, noUselessTypeConstraint, rules, noFloatingPromises (+3 more)

### Community 43 - "Category History Charts"
Cohesion: 0.24
Nodes (11): aggregateSeries(), CategoryHistoryChart(), ChartMonth, ChartSeries, HistoryTooltip(), MonthTick(), prepareMonths(), prepareSeries() (+3 more)

### Community 44 - "Chart Primitives"
Cohesion: 0.23
Nodes (11): ChartConfig, ChartContext, ChartContextProps, ChartLegendContent(), ChartStyle(), ChartTooltipContent(), getPayloadConfigFromPayload(), INITIAL_DIMENSION (+3 more)

### Community 45 - "Web App Manifest"
Cohesion: 0.20
Nodes (9): background_color, description, display, icons, name, scope, short_name, start_url (+1 more)

### Community 46 - "Shell Headers and Titles"
Cohesion: 0.36
Nodes (6): AppHeader(), ShellHeader(), TITLES, SidebarTrigger(), SearchInit, useMonthParams()

### Community 47 - "General Formatting Settings"
Cohesion: 0.25
Nodes (8): formatter, attributePosition, enabled, formatWithErrors, indentStyle, indentWidth, lineEnding, lineWidth

### Community 48 - "Development Dependencies"
Cohesion: 0.25
Nodes (8): devDependencies, @biomejs/biome, @tailwindcss/postcss, @types/luxon, @types/node, @types/papaparse, @types/react, @types/react-dom

### Community 49 - "Spending Calendar"
Cohesion: 0.31
Nodes (8): luxon, compact(), INK, LEVELS, quantile(), rampCap(), SpendingCalendar(), WEEKDAYS

### Community 50 - "Platform Binary Dependencies"
Cohesion: 0.29
Nodes (7): optionalDependencies, lightningcss-linux-x64-gnu, lightningcss-win32-x64-msvc, @rollup/rollup-linux-x64-gnu, @rollup/rollup-win32-x64-msvc, @tailwindcss/oxide-linux-x64-gnu, @tailwindcss/oxide-win32-x64-msvc

### Community 51 - "Project Commands"
Cohesion: 0.29
Nodes (7): scripts, build, dev, lint, lint:check, start, types:check

### Community 52 - "statements.ts"
Cohesion: 0.18
Nodes (21): countSuggestions(), AnalyticsRecord, AnalyticsSummary, dayDifference(), ensureCanReplace(), maskDescription(), ReplacementAllocation, replacementComparison() (+13 more)

### Community 53 - "Lint Style Rules"
Cohesion: 0.33
Nodes (6): style, noNamespace, noNonNullAssertion, useArrayLiterals, useAsConstAssertion, useBlockStatements

### Community 54 - "Brand Icon Concept"
Cohesion: 0.40
Nodes (5): Finpoint icon concept, Charcoal shadow halo, Circular point, Rounded F monogram, Off-white icon fill

### Community 55 - "Shadow Icon Variant"
Cohesion: 0.40
Nodes (5): Finpoint icon with charcoal shadow, Charcoal shadow halo, Circular point, Rounded F monogram, Off-white icon fill

### Community 56 - "Vector Brand Icon"
Cohesion: 0.50
Nodes (4): Finpoint, Circular point, Rounded F monogram, Off-white icon fill

### Community 58 - "Apple Touch Icon"
Cohesion: 0.67
Nodes (3): Circular dot beside F, Rounded F letterform, F monogram icon

### Community 59 - "JPG Favicon Artwork"
Cohesion: 0.67
Nodes (3): JPG favicon dot, JPG favicon F letterform, JPG favicon icon

### Community 60 - "PNG Favicon Artwork"
Cohesion: 0.67
Nodes (3): PNG favicon dot, PNG favicon F letterform, PNG favicon icon

### Community 61 - "SVG Favicon Artwork"
Cohesion: 0.67
Nodes (3): SVG favicon dot, SVG favicon F letterform, SVG favicon icon

### Community 62 - "Small App Icon"
Cohesion: 0.67
Nodes (3): Circular dot beside F, Rounded F letterform, F monogram icon

### Community 63 - "Large App Icon"
Cohesion: 0.67
Nodes (3): Circular dot beside F, Rounded F letterform, F monogram icon

### Community 70 - "Customization & Theming"
Cohesion: 0.14
Nodes (14): 1. Built-in variants, 2. Tailwind classes via `className`, 3. Add a new variant, 4. Wrapper components, Adding Custom Colors, Border Radius, Changing the Theme, Checking for Updates (+6 more)

### Community 71 - "pagination.tsx"
Cohesion: 0.38
Nodes (11): pageHref(), pageWindow(), PaginationFooter(), Pagination(), PaginationContent(), PaginationEllipsis(), PaginationItem(), PaginationLink() (+3 more)

### Community 72 - "color-pair.tsx"
Cohesion: 0.24
Nodes (10): ColorPair(), contrast(), luminance(), toHex(), toRgb(), defaultStates, previewState(), StateMatrix() (+2 more)

### Community 73 - "Tools"
Cohesion: 0.17
Nodes (11): Configuring Registries, Setup, `shadcn:get_add_command_for_items`, `shadcn:get_audit_checklist`, `shadcn:get_item_examples_from_registries`, `shadcn:get_project_registries`, `shadcn:list_items_in_registries`, shadcn MCP Server (+3 more)

### Community 74 - "Component Composition"
Cohesion: 0.17
Nodes (12): Avatar always needs AvatarFallback, Button has no isPending or isLoading prop, Callouts use Alert, Card structure, Choosing between overlay components, Component Composition, Contents, Dialog, Sheet, and Drawer always need a Title (+4 more)

### Community 75 - "Styling & Customization"
Cohesion: 0.17
Nodes (12): Built-in variants first, className for layout only, Contents, No manual dark: color overrides, No raw color values for status/state indicators, No space-x-* / space-y-*, Prefer size-* over w-* h-* when equal, Prefer truncate shorthand (+4 more)

### Community 76 - "category-filter.tsx"
Cohesion: 0.36
Nodes (10): CategoryFilter(), CategoryFilterItem(), Command(), CommandEmpty(), CommandGroup(), CommandInput(), CommandItem(), CommandList() (+2 more)

### Community 78 - "The Design System Page"
Cohesion: 0.18
Nodes (11): Block anatomy, Checklist, Components: Tiers and Block Anatomy, Contents, Do and Don't, Edge Cases, Page Outline, Principles (+3 more)

### Community 79 - "shadcn/ui"
Cohesion: 0.20
Nodes (10): Component Docs, Examples, and Usage, Current Project Context, Design Systems from DESIGN.md, Detailed References, Key Fields, Key Patterns, Principles, Quick Reference (+2 more)

### Community 80 - "Registry Authoring and Addresses"
Cohesion: 0.22
Nodes (9): Address Schemes, Build and Verify, GitHub Registries, Include, Item Definitions, Mental Model, Registry Authoring and Addresses, Registry Dependencies (+1 more)

### Community 81 - "showcase-coverage.mjs"
Cohesion: 0.22
Nodes (6): components, missing, source, [uiArg, ...roots], uiDir, walk()

### Community 82 - "Foundations"
Cohesion: 0.25
Nodes (8): Color roles, Elevation, Foundations, Motion and icons, Palette, Radius, Spacing, Typography

### Community 83 - "Base vs Radix"
Cohesion: 0.25
Nodes (8): Accordion, Base vs Radix, Button / trigger as non-button element (base only), Contents, Select, Select — multiple selection and object values (base only), Slider, ToggleGroup

### Community 84 - "Chat & Messaging"
Cohesion: 0.25
Nodes (8): Chat & Messaging, Contents, Escape hatch: the scroller hooks, Message rows use Message, Message surfaces use Bubble, Scrollable threads use MessageScroller, Streaming, anchoring, and jump-to-latest are built in, System notes and dividers use Marker

### Community 85 - "Frontend Design"
Cohesion: 0.29
Nodes (6): Design principles, Frontend Design, Ground your designs in the subject matter, More on writing in design, Process: plan, review against the brief, build, critique, Restraint and self-critique

### Community 86 - "Commit Guide"
Cohesion: 0.40
Nodes (4): Branches, Commit Guide, Commits, Pull Requests

## Knowledge Gaps
- **69 isolated node(s):** `@fontsource-variable/inter`, `react-dom`, `shadcn`, `tailwindcss`, `tw-animate-css` (+64 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 607 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **9 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `cn()` connect `cn` to `Accounts and Allocation`, `Record Forms and Dialogs`, `allocator-tabs.tsx`, `Financial Charts`, `Sidebar and Settings Navigation`, `Monthly Dashboard`, `Sync Settings Interface`, `Date Forms and Filters`, `utils.ts`, `Pending Statement Review`, `importer/page.tsx`, `paginated-data-table.tsx`, `Application Boot and Layout`, `dropdown-menu.tsx`, `motion.ts`, `Sidebar Primitives`, `Design Systems from DESIGN.md`, `Chart Primitives`, `Shell Headers and Titles`, `Spending Calendar`, `pagination.tsx`, `color-pair.tsx`, `Styling & Customization`, `category-filter.tsx`?**
  _High betweenness centrality (0.167) - this node is a cross-community bridge._
- **Are the 4 inferred relationships involving `cn()` (e.g. with `Helpers` and `Type scale`) actually correct?**
  _`cn()` has 4 INFERRED edges - model-reasoned connections that need verification._
- **What connects `@fontsource-variable/inter`, `react-dom`, `shadcn` to the rest of the system?**
  _69 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Accounts and Allocation` be split into smaller, more focused modules?**
  _Cohesion score 0.06431686046511628 - nodes in this community are weakly interconnected._
- **Why does `react` connect `Pending Statement Review` to `Accounts and Allocation`, `Record Forms and Dialogs`, `cn`, `Financial Charts`, `Monthly Dashboard`, `Sync Settings Interface`, `Package Metadata`, `Date Forms and Filters`, `Background Sync Engine`, `importer/page.tsx`, `paginated-data-table.tsx`, `Application Boot and Layout`, `Appearance and Theme State`, `dropdown-menu.tsx`, `motion.ts`, `Sidebar Primitives`, `Chart Primitives`, `Shell Headers and Titles`, `pagination.tsx`, `color-pair.tsx`, `category-filter.tsx`?**
  _High betweenness centrality (0.049) - this node is a cross-community bridge._
- **Are the 9 inferred relationships involving `Button()` (e.g. with `Known traps` and `Step 5: Map Component Recipes to Variants`) actually correct?**
  _`Button()` has 9 INFERRED edges - model-reasoned connections that need verification._
- **Should `Record Forms and Dialogs` be split into smaller, more focused modules?**
  _Cohesion score 0.06565409113179814 - nodes in this community are weakly interconnected._