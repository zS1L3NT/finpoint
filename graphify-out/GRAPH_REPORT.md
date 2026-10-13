# Graph Report - finpoint-fix-duplicates-impl  (2026-10-14)

## Corpus Check
- 185 files · ~110,658 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 9 file(s) not represented in the graph (top: (none) 5, .example 1, .lock 1)

## Summary
- 1466 nodes · 5699 edges · 63 communities (56 shown, 7 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 60 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `68e99f93`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- (month)/page.tsx
- react
- cn
- export-import.ts
- Record
- useHistory
- app-sidebar.tsx
- date-range.tsx
- dashboard.ts
- compilerOptions
- dependencies
- sync/page.tsx
- suspicious
- package.json
- combobox.tsx
- correctness
- db.ts
- duplicates/page.tsx
- Button
- auto-sync.ts
- ValidationError
- components.json
- test-data.ts
- drive-sync.ts
- paginated-data-table.tsx
- types.d.ts
- auth-vault.ts
- records.ts
- google-drive.ts
- Validator
- (month)/layout.tsx
- sidebar.tsx
- formatter
- Graph refresh after code tasks
- biome.json
- rules
- manifest.json
- Separator
- formatter
- devDependencies
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
- category-filter.tsx
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
- `MonthLayout()` --calls--> `MonthPicker()`  [EXTRACTED]
  app/(month)/layout.tsx → src/components/ui/monthpicker.tsx

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **Separated application layers** — agents_ui_layer, agents_domain_operations, agents_persistence_layer [EXTRACTED 1.00]
- **Committed graph refresh artifacts** — agents_graph_json, agents_graph_report, agents_graph_manifest, agents_graph_labels [EXTRACTED 1.00]
- **Separate meaning, accounting and spending planning** — context_category, context_treatment, context_spending_bucket, context_record [EXTRACTED 1.00]
- **Imported activity explained by managed records** — context_statement, context_allocation, context_record [EXTRACTED 1.00]

## Communities (63 total, 7 thin omitted)

### Community 0 - "(month)/page.tsx"
Cohesion: 0.05
Nodes (127): AccountsPage(), AllocatorPage(), AllocatorPendingPage(), CandidatePage, CandidateResults(), ACCEPT, BANKS_REQUIRING_ADDITIONAL_INFO, ImporterPage() (+119 more)

### Community 1 - "react"
Cohesion: 0.13
Nodes (52): react, sonner, AccountDialog(), BucketDialog(), EditableBucket, fieldErrors(), BudgetCreatorDialog(), BudgetEditorDialog() (+44 more)

### Community 2 - "cn"
Cohesion: 0.09
Nodes (27): AlertAction(), DropdownMenuCheckboxItem(), DropdownMenuContent(), DropdownMenuItem(), DropdownMenuLabel(), DropdownMenuRadioItem(), DropdownMenuSeparator(), DropdownMenuShortcut() (+19 more)

### Community 3 - "export-import.ts"
Cohesion: 0.15
Nodes (16): fake-indexeddb, clearAllData(), downloadExport(), EXPORT_VERSION, FinpointExport, importData(), parseImportFile(), SYNC_TABLES (+8 more)

### Community 4 - "Record"
Cohesion: 0.05
Nodes (41): Background Drive sync, CONTEXT.md, Dexie IndexedDB, First-run seed, Generated test data, JSON export/import, Installed Next.js documentation, React Compiler (+33 more)

### Community 5 - "useHistory"
Cohesion: 0.06
Nodes (65): luxon, recharts, BudgetActiveDot(), BudgetProgressChart(), BudgetProgressPoint, buildSeries(), colorChange(), CashflowChart() (+57 more)

### Community 6 - "app-sidebar.tsx"
Cohesion: 0.05
Nodes (69): AccountCard(), AccountRow, metadata, RootLayout(), viewport, NotFound(), Boot(), Providers() (+61 more)

### Community 7 - "date-range.tsx"
Cohesion: 0.13
Nodes (17): lucide-react, react-day-picker, DateRangeValue, formatRange(), Props, rangeFromValue(), FALLBACK_ICON_NAME, ICONS (+9 more)

### Community 8 - "dashboard.ts"
Cohesion: 0.12
Nodes (36): db, AnalyticsRecord, AnalyticsSummary, contribution(), summarize(), avg(), buildBuckets(), buildCashflowHistory() (+28 more)

### Community 9 - "compilerOptions"
Cohesion: 0.06
Nodes (33): compilerOptions, allowJs, allowSyntheticDefaultImports, allowUnusedLabels, esModuleInterop, forceConsistentCasingInFileNames, incremental, isolatedModules (+25 more)

### Community 10 - "dependencies"
Cohesion: 0.07
Nodes (30): dependencies, @base-ui/react, class-variance-authority, clsx, cmdk, dexie, dexie-react-hooks, @fontsource-variable/inter (+22 more)

### Community 11 - "sync/page.tsx"
Cohesion: 0.16
Nodes (23): COUNT_ROWS, DataSettingsPage(), MethodHeader(), StateRow(), STATUS_TONES, StatusTone, WorkspaceRow(), AlertDialog() (+15 more)

### Community 12 - "suspicious"
Cohesion: 0.07
Nodes (28): suspicious, noAssignInExpressions, noAsyncPromiseExecutor, noCatchAssign, noClassAssign, noCompareNegZero, noControlCharactersInRegex, noDebugger (+20 more)

### Community 13 - "package.json"
Cohesion: 0.07
Nodes (29): private, $schema, type, @biomejs/biome, clsx, cmdk, @fontsource-variable/inter, lightningcss-linux-x64-gnu (+21 more)

### Community 14 - "combobox.tsx"
Cohesion: 0.12
Nodes (20): @base-ui/react, ComboboxChip(), ComboboxChips(), ComboboxChipsInput(), ComboboxClear(), ComboboxContent(), ComboboxEmpty(), ComboboxGroup() (+12 more)

### Community 15 - "correctness"
Cohesion: 0.08
Nodes (26): noConstantCondition, noConstAssign, noEmptyCharacterClassInRegex, noEmptyPattern, noGlobalObjectCalls, noInvalidBuiltinInstantiation, noInvalidConstructorSuper, noNonoctalDecimalEscape (+18 more)

### Community 16 - "db.ts"
Cohesion: 0.07
Nodes (19): dexie, AccountRow, AllocationRow, AnalyticsMonthRow, BucketDefaultRow, BucketRow, BucketTargetRow, BudgetRecordRow (+11 more)

### Community 17 - "duplicates/page.tsx"
Cohesion: 0.25
Nodes (16): DuplicateGroupCard(), DuplicateReviewDialog(), FixDuplicatesPage(), descriptionAnchors(), descriptionIdentity(), dismissedDuplicatePairs(), DuplicateGroup, duplicateGroups() (+8 more)

### Community 19 - "Button"
Cohesion: 0.06
Nodes (112): AccountPage(), PendingCard(), BudgetPage(), getBudgetAnalytics(), getCategoryData(), Legend(), BUDGET_STATES, BudgetCard() (+104 more)

### Community 20 - "auto-sync.ts"
Cohesion: 0.13
Nodes (24): useSyncStatus(), emit(), eventListeners, finishCycle(), flushOnHide(), getSyncSnapshot(), ingestManualResult(), markDirty() (+16 more)

### Community 21 - "ValidationError"
Cohesion: 0.25
Nodes (20): asPending(), ensureAccount(), combine(), dbsDescriptionKey(), descriptionKey(), importDbs(), importOcbc(), ImportResult (+12 more)

### Community 22 - "components.json"
Cohesion: 0.09
Nodes (21): aliases, components, hooks, lib, ui, utils, iconLibrary, menuAccent (+13 more)

### Community 24 - "test-data.ts"
Cohesion: 0.18
Nodes (15): DEFAULT_BUCKETS, DEFAULT_CATEGORIES, BANK_BLURB, between(), BUCKETS, CATEGORIES, DAILY, generateTestData() (+7 more)

### Community 25 - "drive-sync.ts"
Cohesion: 0.34
Nodes (18): exportData(), downloadBackupFile(), driveFetch(), findBackupFile(), getClockSkewMs(), getFileMeta(), isDriveConfigured(), uploadBackupFile() (+10 more)

### Community 26 - "paginated-data-table.tsx"
Cohesion: 0.17
Nodes (30): framer-motion, @tanstack/react-table, DataTable(), PaginatedDataTable(), GroupHeaderRow(), groupStarts(), GroupTotal(), isInteractiveTarget() (+22 more)

### Community 27 - "types.d.ts"
Cohesion: 0.11
Nodes (18): Account, Allocation, AnalyticsSummary, AnalyticsTreatment, Appearance, Bucket, Budget, Category (+10 more)

### Community 28 - "auth-vault.ts"
Cohesion: 0.29
Nodes (14): POST(), POST(), POST(), jose, AUTH_COOKIE_NAME, authCookie(), authCookieConfig(), clientIp() (+6 more)

### Community 31 - "records.ts"
Cohesion: 0.11
Nodes (30): AccountActivity, NO_ACTIVITY, BudgetFilters, createBudget(), getBudget(), listBudgets(), AllocationTally, isPendingRecord() (+22 more)

### Community 32 - "google-drive.ts"
Cohesion: 0.22
Nodes (13): AuthNeededError, cacheToken(), CodeResponse, DRIVE_FILENAME, DRIVE_SCOPE, DriveFileMeta, ensureDriveToken(), ensureDriveTokenSilent() (+5 more)

### Community 33 - "Validator"
Cohesion: 0.23
Nodes (15): updateAccount(), createBucket(), GROUPS, PACE_KINDS, setBucketTarget(), updateBucket(), validateBudget(), cleanInput() (+7 more)

### Community 35 - "(month)/layout.tsx"
Cohesion: 0.20
Nodes (16): MonthLayout(), DateField(), Props, DatetimeField(), parseValue(), Props, toInputValue(), Popover() (+8 more)

### Community 36 - "sidebar.tsx"
Cohesion: 0.15
Nodes (17): SidebarContext, SidebarContextProps, SidebarGroupAction(), SidebarGroupContent(), SidebarInput(), SidebarMenuAction(), SidebarMenuBadge(), SidebarMenuButton() (+9 more)

### Community 38 - "formatter"
Cohesion: 0.15
Nodes (13): arrowParentheses, bracketSameLine, bracketSpacing, jsxQuoteStyle, quoteProperties, quoteStyle, semicolons, trailingCommas (+5 more)

### Community 40 - "Graph refresh after code tasks"
Cohesion: 0.20
Nodes (9): Graph health warnings, graphify-out/graph.json, graphify-out/.graphify_labels.json, graphify-out/manifest.json, graphify-out/GRAPH_REPORT.md, graphify skill, graphify update ., Local graph artifacts (+1 more)

### Community 41 - "biome.json"
Cohesion: 0.18
Nodes (10): source, assist, actions, files, includes, linter, enabled, overrides (+2 more)

### Community 42 - "rules"
Cohesion: 0.18
Nodes (11): noAdjacentSpacesInRegex, noBannedTypes, noExtraBooleanCast, noUselessCatch, noUselessThisAlias, noUselessTypeConstraint, rules, noFloatingPromises (+3 more)

### Community 45 - "manifest.json"
Cohesion: 0.20
Nodes (9): background_color, description, display, icons, name, scope, short_name, start_url (+1 more)

### Community 46 - "Separator"
Cohesion: 0.21
Nodes (11): class-variance-authority, AppHeader(), ButtonGroup(), ButtonGroupSeparator(), ButtonGroupText(), buttonGroupVariants, FieldSeparator(), ItemSeparator() (+3 more)

### Community 47 - "formatter"
Cohesion: 0.25
Nodes (8): formatter, attributePosition, enabled, formatWithErrors, indentStyle, indentWidth, lineEnding, lineWidth

### Community 48 - "devDependencies"
Cohesion: 0.22
Nodes (9): devDependencies, @biomejs/biome, fake-indexeddb, @tailwindcss/postcss, @types/luxon, @types/node, @types/papaparse, @types/react (+1 more)

### Community 50 - "optionalDependencies"
Cohesion: 0.29
Nodes (7): optionalDependencies, lightningcss-linux-x64-gnu, lightningcss-win32-x64-msvc, @rollup/rollup-linux-x64-gnu, @rollup/rollup-win32-x64-msvc, @tailwindcss/oxide-linux-x64-gnu, @tailwindcss/oxide-win32-x64-msvc

### Community 51 - "scripts"
Cohesion: 0.29
Nodes (7): scripts, build, dev, lint, lint:check, start, types:check

### Community 52 - "statements.ts"
Cohesion: 0.19
Nodes (20): countSuggestions(), removeStatementDismissals(), dayDifference(), ensureCanReplace(), maskDescription(), ReplacementAllocation, replacementComparison(), replacementReason() (+12 more)

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

### Community 76 - "category-filter.tsx"
Cohesion: 0.33
Nodes (11): CategoryFilter(), CategoryFilterItem(), Command(), CommandEmpty(), CommandGroup(), CommandInput(), CommandItem(), CommandList() (+3 more)

### Community 86 - "Commit Guide"
Cohesion: 0.40
Nodes (4): Branches, Commit Guide, Commits, Pull Requests

## Knowledge Gaps
- **69 isolated node(s):** `@fontsource-variable/inter`, `react-dom`, `shadcn`, `tailwindcss`, `tw-animate-css` (+64 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 491 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **7 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `cn()` connect `cn` to `(month)/page.tsx`, `react`, `(month)/layout.tsx`, `sidebar.tsx`, `useHistory`, `app-sidebar.tsx`, `date-range.tsx`, `PaginationFooter`, `sync/page.tsx`, `category-filter.tsx`, `Separator`, `combobox.tsx`, `Button`, `paginated-data-table.tsx`?**
  _High betweenness centrality (0.143) - this node is a cross-community bridge._
- **What connects `@fontsource-variable/inter`, `react-dom`, `shadcn` to the rest of the system?**
  _69 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `(month)/page.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.054316923537333535 - nodes in this community are weakly interconnected._
- **Why does `react` connect `react` to `(month)/page.tsx`, `cn`, `(month)/layout.tsx`, `sidebar.tsx`, `useHistory`, `app-sidebar.tsx`, `date-range.tsx`, `PaginationFooter`, `sync/page.tsx`, `category-filter.tsx`, `package.json`, `combobox.tsx`, `Separator`, `duplicates/page.tsx`, `Button`, `auto-sync.ts`, `paginated-data-table.tsx`?**
  _High betweenness centrality (0.047) - this node is a cross-community bridge._
- **Should `react` be split into smaller, more focused modules?**
  _Cohesion score 0.12906057945566285 - nodes in this community are weakly interconnected._
- **Why does `next` connect `(month)/page.tsx` to `react`, `(month)/layout.tsx`, `useHistory`, `app-sidebar.tsx`, `PaginationFooter`, `sync/page.tsx`, `package.json`, `duplicates/page.tsx`, `Button`, `auth-vault.ts`?**
  _High betweenness centrality (0.030) - this node is a cross-community bridge._
- **Should `cn` be split into smaller, more focused modules?**
  _Cohesion score 0.0907563025210084 - nodes in this community are weakly interconnected._