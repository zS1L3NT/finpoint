/** Candidate reachability is an ownership map, not evidence of behaviour coverage. */
export type InventoryEntry = {
	path: string
	owner: "team2" | "team3"
	routes: string[]
	visibleExports: string[]
	dormantExports: string[]
	helperExports: string[]
	scenarios: string[]
}

export type RouteEntry = {
	path: string
	url: string | null
	kind: "page" | "framework" | "auth-handler"
	owner: "team3"
	scenarios: string[]
}

// Scenario keys become stable IDs: `${entry.path}#${family}.${case}`.
// Map a case only after reviewing its real assertions; mounting/importing is insufficient.
export const scenarioFamilies: Record<string, Record<string, string>> = {
	editor: {
		open: "Open create/update popup: visible backdrop, whole-popup motion, initially visible children stable with no transient overflow; mobile tall content may scroll",
		validation:
			"Submit invalid fields, inspect visible errors, correct and save; disabled submit cannot act; valid keyboard submit persists values",
		long: "Long names/descriptions and many options fit mobile and desktop without hiding save/cancel",
		conditional:
			"Reveal conditional fields after opening; preserve entered values on failed validation and verify cancel/reopen semantics",
	},
	field: {
		input: "Label and error association, empty/invalid and valid typed values, keyboard change and disabled behaviour",
		options:
			"Long label/value, selected option and empty optional value; applicable pickers preserve page scrolling and dismiss by Escape",
	},
	chart: {
		values: "Empty and populated data, zero/negative values where supported, missing comparison/null values; inspect labels/tooltips/totals rather than mount",
		responsive:
			"Long category/monthly budget names and dense data fit mobile/dark/tall desktop; verify readable tooltip interaction",
		motion: "Changed month/data updates values and chart intro respects reduced motion",
	},
	table: {
		rows: "Populated and empty results, long descriptions, zero/negative values and pending/archived badges where supported; grouped totals agree",
		interaction:
			"Select/deselect, disabled actions, filtering and pagination including empty final page; links return with previous filters",
		motion: "All visible rows cascade beyond 12 on tall desktop; removal preserves identity and does not replay remaining rows; reduced motion respected",
	},
	primitive: {
		consumer:
			"Assert actual composed consumer behaviour and accessible names, long content, selected/disabled states where supported; wrappers are covered through consumers",
		responsive:
			"Long supported content remains contained; consumer remains usable by keyboard and on mobile/dark; popup consumers show backdrop, Escape dismissal and preserve scrolling as applicable",
	},
	display: {
		values: "Visible content and accessible meaning with long labels, missing optional values and zero/negative numeric values where supported",
		interaction:
			"Applicable enabled controls work by pointer/keyboard and have pointer cursor; disabled controls do not act; responsive/reduced-motion state is stable",
	},
	"monthly-budget": {
		amount: "Explicit null differs from valid zero; default, override one month and override default resolve and render correctly",
		archived:
			"Archived assignments remain visible historically, unbudgeted/no colour renders fallback; ineligible treatment disables Monthly Budget selection",
	},
	allocation: {
		amount: "Zero total, negative amounts, partial/full/excess allocation render finite progress and correct money; save result changes statement/record state",
	},
	selection: {
		state: "None/one/multiple selections, select all, clear, enabled/disabled action and post-removal identity; mobile bar avoids obscuring controls",
	},
	indirect: {
		consumer:
			"Non-rendering helper: verify resulting output or consumer workflow; no standalone mount coverage claim",
	},
	dormant: {
		behaviour:
			"Standalone harness at port 5174: assert rendered output, meaningful pointer/keyboard interaction, selected/disabled states and long content where supported; a mount alone is insufficient",
	},
	route: {
		data: "Populated/empty/long/zero/negative/null/pending/archived data as applicable; undefined live query shows no loader or premature empty state",
		navigation:
			"Meaningful route actions work with keyboard/pointer; detail back button above header restores filters; month tabs preserve shared header",
		viewport:
			"Desktop/tall/mobile/dark/reduced motion remain usable; page fade and all visible list/grid items beyond 12 cascade",
	},
	shell: {
		consumer:
			"Verify shared shell/sidebar/theme/toasts or not-found behaviour through routes, stable month header and nonblocking query reveal",
	},
	auth: {
		boundary:
			"Non-visual OAuth broker: excluded from browser UI coverage; no live Google calls, use intercepted responses in sync workflows",
	},
}

export const componentInventory: InventoryEntry[] = [
	{
		path: "src/components/allocate-bar.tsx",
		owner: "team3",
		routes: ["/statements/[id]"],
		visibleExports: ["default"],
		dormantExports: [],
		helperExports: [],
		scenarios: ["display", "allocation"],
	},
	{
		path: "src/components/charts/budget-progress-chart.tsx",
		owner: "team3",
		routes: ["/budgets/[id]"],
		visibleExports: ["default"],
		dormantExports: [],
		helperExports: [],
		scenarios: ["chart"],
	},
	{
		path: "src/components/charts/cashflow-chart.tsx",
		owner: "team3",
		routes: ["/"],
		visibleExports: ["default"],
		dormantExports: [],
		helperExports: [],
		scenarios: ["chart"],
	},
	{
		path: "src/components/charts/category-history-chart.tsx",
		owner: "team3",
		routes: ["/"],
		visibleExports: ["default"],
		dormantExports: [],
		helperExports: [],
		scenarios: ["chart"],
	},
	{
		path: "src/components/charts/category-movers.tsx",
		owner: "team3",
		routes: ["/"],
		visibleExports: ["default"],
		dormantExports: [],
		helperExports: [],
		scenarios: ["chart"],
	},
	{
		path: "src/components/charts/category-spending-mix.tsx",
		owner: "team3",
		routes: ["/"],
		visibleExports: ["default"],
		dormantExports: [],
		helperExports: [],
		scenarios: ["chart"],
	},
	{
		path: "src/components/charts/chart-intro.ts",
		owner: "team3",
		routes: ["/budgets/[id]", "/"],
		visibleExports: [],
		dormantExports: [],
		helperExports: ["CHART_INTRO_MS", "useChartIntro"],
		scenarios: ["indirect"],
	},
	{
		path: "src/components/charts/daily-spending-chart.tsx",
		owner: "team3",
		routes: ["/"],
		visibleExports: ["default"],
		dormantExports: [],
		helperExports: [],
		scenarios: ["chart"],
	},
	{
		path: "src/components/charts/monthly-budget-usage.tsx",
		owner: "team3",
		routes: ["/"],
		visibleExports: ["default"],
		dormantExports: [],
		helperExports: [],
		scenarios: ["chart"],
	},
	{
		path: "src/components/charts/sparkline.tsx",
		owner: "team3",
		routes: ["/budgets/[id]", "/accounts/[id]", "/"],
		visibleExports: ["default"],
		dormantExports: [],
		helperExports: [],
		scenarios: ["chart"],
	},
	{
		path: "src/components/charts/spending-calendar.tsx",
		owner: "team3",
		routes: ["/"],
		visibleExports: ["default"],
		dormantExports: [],
		helperExports: [],
		scenarios: ["chart"],
	},
	{
		path: "src/components/charts/total-spending-chart.tsx",
		owner: "team3",
		routes: ["/"],
		visibleExports: ["default"],
		dormantExports: [],
		helperExports: [],
		scenarios: ["chart"],
	},
	{
		path: "src/components/charts/weekday-bars.tsx",
		owner: "team3",
		routes: ["/"],
		visibleExports: ["default"],
		dormantExports: [],
		helperExports: [],
		scenarios: ["chart"],
	},
	{
		path: "src/components/detail-summary.tsx",
		owner: "team3",
		routes: ["/statements/[id]", "/records/[id]"],
		visibleExports: ["DetailSummary", "DetailSummaryItem"],
		dormantExports: [],
		helperExports: [],
		scenarios: ["display"],
	},
	{
		path: "src/components/dialogs/account.tsx",
		owner: "team2",
		routes: ["/accounts/[id]", "/accounts"],
		visibleExports: ["default"],
		dormantExports: [],
		helperExports: [],
		scenarios: ["editor"],
	},
	{
		path: "src/components/dialogs/budget-creator.tsx",
		owner: "team2",
		routes: ["/budgets"],
		visibleExports: ["default"],
		dormantExports: [],
		helperExports: [],
		scenarios: ["editor"],
	},
	{
		path: "src/components/dialogs/budget-editor.tsx",
		owner: "team2",
		routes: ["/budgets/[id]", "/budgets"],
		visibleExports: ["default"],
		dormantExports: [],
		helperExports: [],
		scenarios: ["editor"],
	},
	{
		path: "src/components/dialogs/category.tsx",
		owner: "team2",
		routes: ["/categories"],
		visibleExports: ["default"],
		dormantExports: [],
		helperExports: [],
		scenarios: ["editor"],
	},
	{
		path: "src/components/dialogs/duplicate-review.tsx",
		owner: "team2",
		routes: ["/allocator/duplicates"],
		visibleExports: ["default"],
		dormantExports: [],
		helperExports: [],
		scenarios: ["editor"],
	},
	{
		path: "src/components/dialogs/monthly-budget.tsx",
		owner: "team2",
		routes: ["/"],
		visibleExports: ["default"],
		dormantExports: [],
		helperExports: [],
		scenarios: ["editor", "monthly-budget"],
	},
	{
		path: "src/components/dialogs/pending-statement.tsx",
		owner: "team2",
		routes: ["/statements/[id]", "/statements", "/accounts/[id]", "/records/[id]"],
		visibleExports: ["default"],
		dormantExports: [],
		helperExports: [],
		scenarios: ["editor"],
	},
	{
		path: "src/components/dialogs/record-creator.tsx",
		owner: "team2",
		routes: ["/allocator", "/records"],
		visibleExports: ["default"],
		dormantExports: [],
		helperExports: [],
		scenarios: ["editor"],
	},
	{
		path: "src/components/dialogs/record-editor.tsx",
		owner: "team2",
		routes: [
			"/statements/[id]",
			"/budgets/[id]",
			"/allocator",
			"/records/[id]",
			"/records",
			"/records/monthly",
		],
		visibleExports: ["default"],
		dormantExports: [],
		helperExports: [],
		scenarios: ["editor"],
	},
	{
		path: "src/components/dialogs/statement-replacement-review.tsx",
		owner: "team2",
		routes: ["/allocator", "/allocator/pending"],
		visibleExports: ["default"],
		dormantExports: [],
		helperExports: ["dateDifferenceLabel"],
		scenarios: ["editor"],
	},
	{
		path: "src/components/form/amount-field.tsx",
		owner: "team2",
		routes: [
			"/statements/[id]",
			"/statements",
			"/budgets/[id]",
			"/budgets",
			"/accounts/[id]",
			"/allocator",
			"/records/[id]",
			"/records",
			"/",
			"/records/monthly",
		],
		visibleExports: ["default"],
		dormantExports: [],
		helperExports: [],
		scenarios: ["field"],
	},
	{
		path: "src/components/form/combobox-field.tsx",
		owner: "team2",
		routes: [
			"/statements/[id]",
			"/budgets/[id]",
			"/allocator",
			"/records/[id]",
			"/records",
			"/categories",
			"/records/monthly",
		],
		visibleExports: ["default"],
		dormantExports: [],
		helperExports: [],
		scenarios: ["field"],
	},
	{
		path: "src/components/form/date-field.tsx",
		owner: "team2",
		routes: ["/settings"],
		visibleExports: ["default"],
		dormantExports: [],
		helperExports: [],
		scenarios: ["field"],
	},
	{
		path: "src/components/form/date-range.tsx",
		owner: "team2",
		routes: [
			"/statements",
			"/budgets/[id]",
			"/budgets",
			"/allocator",
			"/records",
			"/records/monthly",
		],
		visibleExports: ["default"],
		dormantExports: [],
		helperExports: [],
		scenarios: ["field"],
	},
	{
		path: "src/components/form/datetime-field.tsx",
		owner: "team2",
		routes: [
			"/statements/[id]",
			"/statements",
			"/budgets/[id]",
			"/accounts/[id]",
			"/allocator",
			"/records/[id]",
			"/records",
			"/records/monthly",
		],
		visibleExports: ["default"],
		dormantExports: [],
		helperExports: [],
		scenarios: ["field"],
	},
	{
		path: "src/components/form/field.tsx",
		owner: "team2",
		routes: [
			"/statements/[id]",
			"/statements",
			"/budgets/[id]",
			"/budgets",
			"/accounts/[id]",
			"/accounts",
			"/allocator",
			"/records/[id]",
			"/records",
			"/categories",
			"/",
			"/records/monthly",
			"/settings",
			"/importer",
		],
		visibleExports: ["FormField"],
		dormantExports: [],
		helperExports: [],
		scenarios: ["field"],
	},
	{
		path: "src/components/form/record-analytics-fields.tsx",
		owner: "team2",
		routes: [
			"/statements/[id]",
			"/budgets/[id]",
			"/allocator",
			"/records/[id]",
			"/records",
			"/records/monthly",
		],
		visibleExports: ["default"],
		dormantExports: [],
		helperExports: [],
		scenarios: ["field", "monthly-budget"],
	},
	{
		path: "src/components/form/select-field.tsx",
		owner: "team2",
		routes: [
			"/statements/[id]",
			"/statements",
			"/budgets/[id]",
			"/accounts/[id]",
			"/allocator",
			"/records/[id]",
			"/records",
			"/categories",
			"/",
			"/records/monthly",
			"/importer",
		],
		visibleExports: ["default"],
		dormantExports: [],
		helperExports: [],
		scenarios: ["field"],
	},
	{
		path: "src/components/form/text-field.tsx",
		owner: "team2",
		routes: [
			"/statements/[id]",
			"/budgets/[id]",
			"/budgets",
			"/accounts/[id]",
			"/accounts",
			"/allocator",
			"/records/[id]",
			"/records",
			"/categories",
			"/",
			"/records/monthly",
			"/importer",
		],
		visibleExports: ["default"],
		dormantExports: [],
		helperExports: [],
		scenarios: ["field"],
	},
	{
		path: "src/components/form/textarea-field.tsx",
		owner: "team2",
		routes: [
			"/statements/[id]",
			"/statements",
			"/budgets/[id]",
			"/accounts/[id]",
			"/allocator",
			"/records/[id]",
			"/records",
			"/records/monthly",
		],
		visibleExports: ["default"],
		dormantExports: [],
		helperExports: [],
		scenarios: ["field"],
	},
	{
		path: "src/components/icon.tsx",
		owner: "team3",
		routes: [
			"/statements/[id]",
			"/statements",
			"/budgets/[id]",
			"/budgets",
			"/accounts/[id]",
			"/accounts",
			"/allocator",
			"/allocator/duplicates",
			"/allocator/pending",
			"/records/[id]",
			"/records",
			"/categories",
			"/",
			"/records/monthly",
			"/terms",
			"/settings",
			"/sync",
			"/importer",
			"/privacy",
		],
		visibleExports: ["UiIcon", "default"],
		dormantExports: [],
		helperExports: ["ICON_NAMES", "preloadCategoryIcons"],
		scenarios: ["display"],
	},
	{
		path: "src/components/icons.ts",
		owner: "team3",
		routes: [
			"/statements/[id]",
			"/statements",
			"/budgets/[id]",
			"/budgets",
			"/accounts/[id]",
			"/accounts",
			"/allocator",
			"/allocator/duplicates",
			"/allocator/pending",
			"/records/[id]",
			"/records",
			"/categories",
			"/",
			"/records/monthly",
			"/terms",
			"/settings",
			"/sync",
			"/importer",
			"/privacy",
		],
		visibleExports: [],
		dormantExports: [],
		helperExports: ["ICONS"],
		scenarios: ["indirect"],
	},
	{
		path: "src/components/layout/app-header.tsx",
		owner: "team3",
		routes: [
			"/statements/[id]",
			"/statements",
			"/budgets/[id]",
			"/budgets",
			"/accounts/[id]",
			"/accounts",
			"/allocator",
			"/allocator/duplicates",
			"/allocator/pending",
			"/records/[id]",
			"/records",
			"/categories",
			"/",
			"/records/monthly",
			"/terms",
			"/settings",
			"/sync",
			"/importer",
			"/privacy",
		],
		visibleExports: ["default"],
		dormantExports: [],
		helperExports: [],
		scenarios: ["display"],
	},
	{
		path: "src/components/layout/app-sidebar.tsx",
		owner: "team3",
		routes: [
			"/statements/[id]",
			"/statements",
			"/budgets/[id]",
			"/budgets",
			"/accounts/[id]",
			"/accounts",
			"/allocator",
			"/allocator/duplicates",
			"/allocator/pending",
			"/records/[id]",
			"/records",
			"/categories",
			"/",
			"/records/monthly",
			"/terms",
			"/settings",
			"/sync",
			"/importer",
			"/privacy",
		],
		visibleExports: ["default"],
		dormantExports: [],
		helperExports: [],
		scenarios: ["display"],
	},
	{
		path: "src/components/layout/page-content.tsx",
		owner: "team3",
		routes: [
			"/statements/[id]",
			"/statements",
			"/budgets/[id]",
			"/budgets",
			"/accounts/[id]",
			"/accounts",
			"/allocator",
			"/allocator/duplicates",
			"/allocator/pending",
			"/records/[id]",
			"/records",
			"/categories",
			"/",
			"/records/monthly",
			"/terms",
			"/settings",
			"/sync",
			"/importer",
			"/privacy",
		],
		visibleExports: ["default"],
		dormantExports: [],
		helperExports: [],
		scenarios: ["display"],
	},
	{
		path: "src/components/layout/page-header.tsx",
		owner: "team3",
		routes: [
			"/statements/[id]",
			"/statements",
			"/budgets/[id]",
			"/budgets",
			"/accounts/[id]",
			"/accounts",
			"/allocator",
			"/allocator/duplicates",
			"/allocator/pending",
			"/records/[id]",
			"/records",
			"/categories",
			"/terms",
			"/settings",
			"/sync",
			"/importer",
			"/privacy",
		],
		visibleExports: ["default"],
		dormantExports: [],
		helperExports: [],
		scenarios: ["display"],
	},
	{
		path: "src/components/layout/shell-header.tsx",
		owner: "team3",
		routes: [
			"/statements/[id]",
			"/statements",
			"/budgets/[id]",
			"/budgets",
			"/accounts/[id]",
			"/accounts",
			"/allocator",
			"/allocator/duplicates",
			"/allocator/pending",
			"/records/[id]",
			"/records",
			"/categories",
			"/",
			"/records/monthly",
			"/terms",
			"/settings",
			"/sync",
			"/importer",
			"/privacy",
		],
		visibleExports: ["default"],
		dormantExports: [],
		helperExports: [],
		scenarios: ["display"],
	},
	{
		path: "src/components/metric.tsx",
		owner: "team3",
		routes: ["/budgets/[id]", "/accounts/[id]", "/"],
		visibleExports: ["Metric", "MetricGrid"],
		dormantExports: [],
		helperExports: [],
		scenarios: ["display"],
	},
	{
		path: "src/components/monthly-budget-badge.tsx",
		owner: "team3",
		routes: [
			"/statements/[id]",
			"/statements",
			"/budgets/[id]",
			"/accounts/[id]",
			"/allocator",
			"/records/[id]",
			"/records",
			"/categories",
			"/",
			"/records/monthly",
		],
		visibleExports: ["default"],
		dormantExports: [],
		helperExports: [],
		scenarios: ["display", "monthly-budget"],
	},
	{
		path: "src/components/record-amount.tsx",
		owner: "team3",
		routes: ["/records/[id]"],
		visibleExports: ["default"],
		dormantExports: [],
		helperExports: [],
		scenarios: ["display"],
	},
	{
		path: "src/components/selection-bar.tsx",
		owner: "team3",
		routes: ["/allocator"],
		visibleExports: ["default"],
		dormantExports: [],
		helperExports: [],
		scenarios: ["display", "selection"],
	},
	{
		path: "src/components/sheets/pending-statement-confirmation.tsx",
		owner: "team3",
		routes: ["/allocator"],
		visibleExports: ["default"],
		dormantExports: [],
		helperExports: [],
		scenarios: ["display"],
	},
	{
		path: "src/components/sheets/record-search.tsx",
		owner: "team3",
		routes: ["/budgets/[id]", "/allocator"],
		visibleExports: ["default"],
		dormantExports: [],
		helperExports: [],
		scenarios: ["display"],
	},
	{
		path: "src/components/sheets/statement-search.tsx",
		owner: "team3",
		routes: [
			"/statements/[id]",
			"/budgets/[id]",
			"/allocator",
			"/records/[id]",
			"/records",
			"/records/monthly",
		],
		visibleExports: ["default"],
		dormantExports: [],
		helperExports: [],
		scenarios: ["display"],
	},
	{
		path: "src/components/table/amount-filter.tsx",
		owner: "team3",
		routes: ["/statements", "/allocator", "/records", "/records/monthly"],
		visibleExports: ["default"],
		dormantExports: [],
		helperExports: [],
		scenarios: ["table"],
	},
	{
		path: "src/components/table/category-filter.tsx",
		owner: "team3",
		routes: ["/records", "/records/monthly"],
		visibleExports: ["default"],
		dormantExports: [],
		helperExports: [],
		scenarios: ["table"],
	},
	{
		path: "src/components/table/data-table.tsx",
		owner: "team3",
		routes: ["/statements/[id]", "/budgets/[id]", "/records/[id]", "/records/monthly"],
		visibleExports: ["default"],
		dormantExports: [],
		helperExports: [],
		scenarios: ["table"],
	},
	{
		path: "src/components/table/filter-bar.tsx",
		owner: "team3",
		routes: [
			"/statements",
			"/allocator",
			"/allocator/duplicates",
			"/allocator/pending",
			"/records",
			"/",
			"/records/monthly",
		],
		visibleExports: ["ClearFiltersButton", "FilterBar"],
		dormantExports: [],
		helperExports: ["FILTER_CONTROL_CLASS"],
		scenarios: ["table"],
	},
	{
		path: "src/components/table/paginated-data-table.tsx",
		owner: "team3",
		routes: ["/statements", "/accounts/[id]", "/allocator", "/records"],
		visibleExports: ["default"],
		dormantExports: [],
		helperExports: [],
		scenarios: ["table"],
	},
	{
		path: "src/components/table/pagination-footer.tsx",
		owner: "team3",
		routes: [
			"/statements",
			"/accounts/[id]",
			"/allocator",
			"/allocator/duplicates",
			"/allocator/pending",
			"/records",
		],
		visibleExports: ["default"],
		dormantExports: [],
		helperExports: [],
		scenarios: ["table"],
	},
	{
		path: "src/components/table/pagination-header.tsx",
		owner: "team3",
		routes: ["/statements", "/budgets", "/accounts/[id]", "/allocator", "/records"],
		visibleExports: ["default"],
		dormantExports: [],
		helperExports: [],
		scenarios: ["table"],
	},
	{
		path: "src/components/table/record-columns.tsx",
		owner: "team3",
		routes: [
			"/statements/[id]",
			"/statements",
			"/budgets/[id]",
			"/accounts/[id]",
			"/allocator",
			"/records/[id]",
			"/records",
			"/records/monthly",
		],
		visibleExports: ["PendingBadge", "RecordAmountCell"],
		dormantExports: [],
		helperExports: ["amountTone", "formatRowTime", "useRecordColumns", "useRecordMobileRow"],
		scenarios: ["table"],
	},
	{
		path: "src/components/table/row-groups.tsx",
		owner: "team3",
		routes: [
			"/statements/[id]",
			"/statements",
			"/budgets/[id]",
			"/budgets",
			"/accounts/[id]",
			"/accounts",
			"/allocator",
			"/records/[id]",
			"/records",
			"/records/monthly",
		],
		visibleExports: ["GroupHeaderRow", "MobileGroupHeader", "MobileRow"],
		dormantExports: [],
		helperExports: [
			"MOBILE_LIST_CLASS",
			"MOBILE_ROW_CLASS",
			"byDay",
			"dayLabel",
			"groupStarts",
			"isInteractiveTarget",
		],
		scenarios: ["table"],
	},
	{
		path: "src/components/table/statement-columns.tsx",
		owner: "team3",
		routes: ["/statements", "/accounts/[id]", "/allocator", "/records/[id]"],
		visibleExports: [],
		dormantExports: [],
		helperExports: ["useStatementColumns", "useStatementMobileRow"],
		scenarios: ["table"],
	},
	{
		path: "src/components/ui/alert-dialog.tsx",
		owner: "team2",
		routes: ["/sync"],
		visibleExports: [
			"AlertDialog",
			"AlertDialogAction",
			"AlertDialogCancel",
			"AlertDialogContent",
			"AlertDialogDescription",
			"AlertDialogFooter",
			"AlertDialogHeader",
			"AlertDialogOverlay",
			"AlertDialogPortal",
			"AlertDialogTitle",
		],
		dormantExports: ["AlertDialogTrigger"],
		helperExports: [],
		scenarios: ["primitive"],
	},
	{
		path: "src/components/ui/alert.tsx",
		owner: "team2",
		routes: [
			"/statements/[id]",
			"/budgets/[id]",
			"/allocator",
			"/allocator/duplicates",
			"/allocator/pending",
			"/records/[id]",
			"/records",
			"/records/monthly",
		],
		visibleExports: ["Alert", "AlertDescription", "AlertTitle"],
		dormantExports: ["AlertAction"],
		helperExports: [],
		scenarios: ["primitive"],
	},
	{
		path: "src/components/ui/badge.tsx",
		owner: "team2",
		routes: [
			"/statements/[id]",
			"/statements",
			"/budgets/[id]",
			"/budgets",
			"/accounts/[id]",
			"/allocator",
			"/allocator/duplicates",
			"/allocator/pending",
			"/records/[id]",
			"/records",
			"/",
			"/records/monthly",
			"/sync",
		],
		visibleExports: ["Badge"],
		dormantExports: [],
		helperExports: ["badgeVariants"],
		scenarios: ["primitive"],
	},
	{
		path: "src/components/ui/button-group.tsx",
		owner: "team2",
		routes: ["/", "/records/monthly"],
		visibleExports: ["ButtonGroup"],
		dormantExports: ["ButtonGroupSeparator", "ButtonGroupText"],
		helperExports: ["buttonGroupVariants"],
		scenarios: ["primitive"],
	},
	{
		path: "src/components/ui/button.tsx",
		owner: "team2",
		routes: [
			"/statements/[id]",
			"/statements",
			"/budgets/[id]",
			"/budgets",
			"/accounts/[id]",
			"/accounts",
			"/allocator",
			"/allocator/duplicates",
			"/allocator/pending",
			"/records/[id]",
			"/records",
			"/categories",
			"/",
			"/records/monthly",
			"/terms",
			"/settings",
			"/sync",
			"/importer",
			"/privacy",
		],
		visibleExports: ["Button"],
		dormantExports: [],
		helperExports: ["buttonVariants"],
		scenarios: ["primitive"],
	},
	{
		path: "src/components/ui/calendar.tsx",
		owner: "team2",
		routes: [
			"/statements/[id]",
			"/statements",
			"/budgets/[id]",
			"/budgets",
			"/accounts/[id]",
			"/allocator",
			"/records/[id]",
			"/records",
			"/records/monthly",
			"/settings",
		],
		visibleExports: ["Calendar", "CalendarDayButton"],
		dormantExports: [],
		helperExports: [],
		scenarios: ["primitive"],
	},
	{
		path: "src/components/ui/card.tsx",
		owner: "team2",
		routes: [
			"/statements/[id]",
			"/budgets/[id]",
			"/allocator",
			"/allocator/duplicates",
			"/allocator/pending",
			"/records/[id]",
			"/records",
			"/categories",
			"/",
			"/records/monthly",
			"/terms",
			"/settings",
			"/sync",
			"/importer",
			"/privacy",
		],
		visibleExports: [
			"Card",
			"CardAction",
			"CardContent",
			"CardDescription",
			"CardFooter",
			"CardHeader",
			"CardTitle",
		],
		dormantExports: [],
		helperExports: [],
		scenarios: ["primitive"],
	},
	{
		path: "src/components/ui/chart.tsx",
		owner: "team2",
		routes: ["/budgets/[id]", "/"],
		visibleExports: ["ChartContainer", "ChartStyle", "ChartTooltip", "ChartTooltipContent"],
		dormantExports: ["ChartLegend", "ChartLegendContent"],
		helperExports: [],
		scenarios: ["primitive"],
	},
	{
		path: "src/components/ui/checkbox.tsx",
		owner: "team2",
		routes: ["/budgets/[id]", "/budgets", "/allocator", "/"],
		visibleExports: ["Checkbox"],
		dormantExports: [],
		helperExports: [],
		scenarios: ["primitive"],
	},
	{
		path: "src/components/ui/combobox.tsx",
		owner: "team2",
		routes: [
			"/statements/[id]",
			"/budgets/[id]",
			"/budgets",
			"/accounts/[id]",
			"/accounts",
			"/allocator",
			"/records/[id]",
			"/records",
			"/categories",
			"/",
			"/records/monthly",
			"/importer",
		],
		visibleExports: [
			"Combobox",
			"ComboboxContent",
			"ComboboxEmpty",
			"ComboboxInput",
			"ComboboxItem",
			"ComboboxList",
			"ComboboxTrigger",
		],
		dormantExports: [
			"ComboboxChip",
			"ComboboxChips",
			"ComboboxChipsInput",
			"ComboboxCollection",
			"ComboboxGroup",
			"ComboboxLabel",
			"ComboboxSeparator",
			"ComboboxValue",
		],
		helperExports: ["useComboboxAnchor"],
		scenarios: ["primitive"],
	},
	{
		path: "src/components/ui/command.tsx",
		owner: "team2",
		routes: ["/records", "/records/monthly"],
		visibleExports: [
			"Command",
			"CommandEmpty",
			"CommandGroup",
			"CommandInput",
			"CommandItem",
			"CommandList",
		],
		dormantExports: ["CommandDialog", "CommandSeparator", "CommandShortcut"],
		helperExports: [],
		scenarios: ["primitive"],
	},
	{
		path: "src/components/ui/dialog.tsx",
		owner: "team2",
		routes: [
			"/statements/[id]",
			"/statements",
			"/budgets/[id]",
			"/budgets",
			"/accounts/[id]",
			"/accounts",
			"/allocator",
			"/allocator/duplicates",
			"/allocator/pending",
			"/records/[id]",
			"/records",
			"/categories",
			"/",
			"/records/monthly",
		],
		visibleExports: [
			"Dialog",
			"DialogClose",
			"DialogContent",
			"DialogDescription",
			"DialogFooter",
			"DialogHeader",
			"DialogOverlay",
			"DialogPortal",
			"DialogTitle",
			"DialogTrigger",
		],
		dormantExports: [],
		helperExports: [],
		scenarios: ["primitive"],
	},
	{
		path: "src/components/ui/dropdown-menu.tsx",
		owner: "team2",
		routes: [],
		visibleExports: [],
		dormantExports: [
			"DropdownMenu",
			"DropdownMenuCheckboxItem",
			"DropdownMenuContent",
			"DropdownMenuGroup",
			"DropdownMenuItem",
			"DropdownMenuLabel",
			"DropdownMenuPortal",
			"DropdownMenuRadioGroup",
			"DropdownMenuRadioItem",
			"DropdownMenuSeparator",
			"DropdownMenuShortcut",
			"DropdownMenuSub",
			"DropdownMenuSubContent",
			"DropdownMenuSubTrigger",
			"DropdownMenuTrigger",
		],
		helperExports: [],
		scenarios: ["dormant"],
	},
	{
		path: "src/components/ui/empty.tsx",
		owner: "team2",
		routes: [
			"/statements/[id]",
			"/budgets/[id]",
			"/allocator",
			"/allocator/duplicates",
			"/allocator/pending",
			"/records/[id]",
			"/records",
			"/records/monthly",
		],
		visibleExports: [
			"Empty",
			"EmptyContent",
			"EmptyDescription",
			"EmptyHeader",
			"EmptyMedia",
			"EmptyTitle",
		],
		dormantExports: [],
		helperExports: [],
		scenarios: ["primitive"],
	},
	{
		path: "src/components/ui/field.tsx",
		owner: "team2",
		routes: [
			"/statements/[id]",
			"/statements",
			"/budgets/[id]",
			"/budgets",
			"/accounts/[id]",
			"/accounts",
			"/allocator",
			"/records/[id]",
			"/records",
			"/categories",
			"/",
			"/records/monthly",
			"/settings",
			"/importer",
		],
		visibleExports: ["Field", "FieldDescription", "FieldError", "FieldGroup", "FieldLabel"],
		dormantExports: ["FieldContent", "FieldLegend", "FieldSeparator", "FieldSet", "FieldTitle"],
		helperExports: [],
		scenarios: ["primitive"],
	},
	{
		path: "src/components/ui/input-group.tsx",
		owner: "team2",
		routes: [
			"/statements/[id]",
			"/statements",
			"/budgets/[id]",
			"/budgets",
			"/accounts/[id]",
			"/accounts",
			"/allocator",
			"/records/[id]",
			"/records",
			"/categories",
			"/",
			"/records/monthly",
			"/importer",
		],
		visibleExports: ["InputGroup", "InputGroupAddon", "InputGroupButton", "InputGroupInput"],
		dormantExports: ["InputGroupText", "InputGroupTextarea"],
		helperExports: [],
		scenarios: ["primitive"],
	},
	{
		path: "src/components/ui/input.tsx",
		owner: "team2",
		routes: [
			"/statements/[id]",
			"/statements",
			"/budgets/[id]",
			"/budgets",
			"/accounts/[id]",
			"/accounts",
			"/allocator",
			"/allocator/duplicates",
			"/allocator/pending",
			"/records/[id]",
			"/records",
			"/categories",
			"/",
			"/records/monthly",
			"/terms",
			"/settings",
			"/sync",
			"/importer",
			"/privacy",
		],
		visibleExports: ["Input"],
		dormantExports: [],
		helperExports: [],
		scenarios: ["primitive"],
	},
	{
		path: "src/components/ui/item.tsx",
		owner: "team2",
		routes: [],
		visibleExports: [],
		dormantExports: [
			"Item",
			"ItemActions",
			"ItemContent",
			"ItemDescription",
			"ItemFooter",
			"ItemGroup",
			"ItemHeader",
			"ItemMedia",
			"ItemSeparator",
			"ItemTitle",
		],
		helperExports: [],
		scenarios: ["dormant"],
	},
	{
		path: "src/components/ui/label.tsx",
		owner: "team2",
		routes: [
			"/statements/[id]",
			"/statements",
			"/budgets/[id]",
			"/budgets",
			"/accounts/[id]",
			"/accounts",
			"/allocator",
			"/records/[id]",
			"/records",
			"/categories",
			"/",
			"/records/monthly",
			"/settings",
			"/importer",
		],
		visibleExports: ["Label"],
		dormantExports: [],
		helperExports: [],
		scenarios: ["primitive"],
	},
	{
		path: "src/components/ui/monthpicker.tsx",
		owner: "team2",
		routes: ["/", "/records/monthly"],
		visibleExports: ["MonthPicker"],
		dormantExports: [],
		helperExports: [],
		scenarios: ["primitive"],
	},
	{
		path: "src/components/ui/pagination.tsx",
		owner: "team2",
		routes: [
			"/statements",
			"/accounts/[id]",
			"/allocator",
			"/allocator/duplicates",
			"/allocator/pending",
			"/records",
		],
		visibleExports: [
			"Pagination",
			"PaginationContent",
			"PaginationEllipsis",
			"PaginationItem",
			"PaginationLink",
			"PaginationNext",
			"PaginationPrevious",
		],
		dormantExports: [],
		helperExports: [],
		scenarios: ["primitive"],
	},
	{
		path: "src/components/ui/popover.tsx",
		owner: "team2",
		routes: [
			"/statements/[id]",
			"/statements",
			"/budgets/[id]",
			"/budgets",
			"/accounts/[id]",
			"/allocator",
			"/records/[id]",
			"/records",
			"/",
			"/records/monthly",
			"/settings",
		],
		visibleExports: ["Popover", "PopoverContent", "PopoverTrigger"],
		dormantExports: ["PopoverDescription", "PopoverHeader", "PopoverTitle"],
		helperExports: [],
		scenarios: ["primitive"],
	},
	{
		path: "src/components/ui/progress.tsx",
		owner: "team2",
		routes: [
			"/statements/[id]",
			"/budgets/[id]",
			"/allocator",
			"/records/[id]",
			"/records",
			"/records/monthly",
		],
		visibleExports: ["Progress"],
		dormantExports: [],
		helperExports: [],
		scenarios: ["primitive"],
	},
	{
		path: "src/components/ui/scroll-area.tsx",
		owner: "team2",
		routes: [
			"/statements/[id]",
			"/budgets/[id]",
			"/allocator",
			"/records/[id]",
			"/records",
			"/records/monthly",
		],
		visibleExports: ["ScrollArea", "ScrollBar"],
		dormantExports: [],
		helperExports: [],
		scenarios: ["primitive"],
	},
	{
		path: "src/components/ui/select.tsx",
		owner: "team2",
		routes: [
			"/statements/[id]",
			"/statements",
			"/budgets/[id]",
			"/accounts/[id]",
			"/allocator",
			"/allocator/duplicates",
			"/allocator/pending",
			"/records/[id]",
			"/records",
			"/categories",
			"/",
			"/records/monthly",
			"/settings",
			"/importer",
		],
		visibleExports: [
			"Select",
			"SelectContent",
			"SelectGroup",
			"SelectItem",
			"SelectLabel",
			"SelectScrollDownButton",
			"SelectScrollUpButton",
			"SelectSeparator",
			"SelectTrigger",
			"SelectValue",
		],
		dormantExports: [],
		helperExports: [],
		scenarios: ["primitive"],
	},
	{
		path: "src/components/ui/separator.tsx",
		owner: "team2",
		routes: [
			"/statements/[id]",
			"/statements",
			"/budgets/[id]",
			"/budgets",
			"/accounts/[id]",
			"/accounts",
			"/allocator",
			"/allocator/duplicates",
			"/allocator/pending",
			"/records/[id]",
			"/records",
			"/categories",
			"/",
			"/records/monthly",
			"/terms",
			"/settings",
			"/sync",
			"/importer",
			"/privacy",
		],
		visibleExports: ["Separator"],
		dormantExports: [],
		helperExports: [],
		scenarios: ["primitive"],
	},
	{
		path: "src/components/ui/sheet.tsx",
		owner: "team2",
		routes: [
			"/statements/[id]",
			"/statements",
			"/budgets/[id]",
			"/budgets",
			"/accounts/[id]",
			"/accounts",
			"/allocator",
			"/allocator/duplicates",
			"/allocator/pending",
			"/records/[id]",
			"/records",
			"/categories",
			"/",
			"/records/monthly",
			"/terms",
			"/settings",
			"/sync",
			"/importer",
			"/privacy",
		],
		visibleExports: [
			"Sheet",
			"SheetContent",
			"SheetDescription",
			"SheetHeader",
			"SheetTitle",
			"SheetTrigger",
		],
		dormantExports: ["SheetClose", "SheetFooter"],
		helperExports: [],
		scenarios: ["primitive"],
	},
	{
		path: "src/components/ui/sidebar.tsx",
		owner: "team2",
		routes: [
			"/statements/[id]",
			"/statements",
			"/budgets/[id]",
			"/budgets",
			"/accounts/[id]",
			"/accounts",
			"/allocator",
			"/allocator/duplicates",
			"/allocator/pending",
			"/records/[id]",
			"/records",
			"/categories",
			"/",
			"/records/monthly",
			"/terms",
			"/settings",
			"/sync",
			"/importer",
			"/privacy",
		],
		visibleExports: [
			"Sidebar",
			"SidebarContent",
			"SidebarFooter",
			"SidebarGroup",
			"SidebarGroupLabel",
			"SidebarHeader",
			"SidebarInset",
			"SidebarMenu",
			"SidebarMenuButton",
			"SidebarMenuItem",
			"SidebarProvider",
			"SidebarRail",
			"SidebarTrigger",
		],
		dormantExports: [
			"SidebarGroupAction",
			"SidebarGroupContent",
			"SidebarInput",
			"SidebarMenuAction",
			"SidebarMenuBadge",
			"SidebarMenuSkeleton",
			"SidebarMenuSub",
			"SidebarMenuSubButton",
			"SidebarMenuSubItem",
			"SidebarSeparator",
		],
		helperExports: ["useSidebar"],
		scenarios: ["primitive"],
	},
	{
		path: "src/components/ui/skeleton.tsx",
		owner: "team2",
		routes: [
			"/statements/[id]",
			"/statements",
			"/budgets/[id]",
			"/budgets",
			"/accounts/[id]",
			"/accounts",
			"/allocator",
			"/allocator/duplicates",
			"/allocator/pending",
			"/records/[id]",
			"/records",
			"/categories",
			"/",
			"/records/monthly",
			"/terms",
			"/settings",
			"/sync",
			"/importer",
			"/privacy",
		],
		visibleExports: [],
		dormantExports: ["Skeleton"],
		helperExports: [],
		scenarios: ["dormant"],
	},
	{
		path: "src/components/ui/sonner.tsx",
		owner: "team2",
		routes: [
			"/statements/[id]",
			"/statements",
			"/budgets/[id]",
			"/budgets",
			"/accounts/[id]",
			"/accounts",
			"/allocator",
			"/allocator/duplicates",
			"/allocator/pending",
			"/records/[id]",
			"/records",
			"/categories",
			"/",
			"/records/monthly",
			"/terms",
			"/settings",
			"/sync",
			"/importer",
			"/privacy",
		],
		visibleExports: ["Toaster"],
		dormantExports: [],
		helperExports: [],
		scenarios: ["primitive"],
	},
	{
		path: "src/components/ui/table.tsx",
		owner: "team2",
		routes: [
			"/statements/[id]",
			"/statements",
			"/budgets/[id]",
			"/budgets",
			"/accounts/[id]",
			"/accounts",
			"/allocator",
			"/records/[id]",
			"/records",
			"/records/monthly",
		],
		visibleExports: ["Table", "TableBody", "TableCell", "TableHead", "TableHeader", "TableRow"],
		dormantExports: ["TableCaption", "TableFooter"],
		helperExports: [],
		scenarios: ["primitive"],
	},
	{
		path: "src/components/ui/textarea.tsx",
		owner: "team2",
		routes: [
			"/statements/[id]",
			"/statements",
			"/budgets/[id]",
			"/budgets",
			"/accounts/[id]",
			"/accounts",
			"/allocator",
			"/records/[id]",
			"/records",
			"/categories",
			"/",
			"/records/monthly",
			"/importer",
		],
		visibleExports: ["Textarea"],
		dormantExports: [],
		helperExports: [],
		scenarios: ["primitive"],
	},
	{
		path: "src/components/ui/toggle-group.tsx",
		owner: "team2",
		routes: [
			"/statements",
			"/allocator",
			"/allocator/duplicates",
			"/records",
			"/records/monthly",
		],
		visibleExports: ["ToggleGroup", "ToggleGroupItem"],
		dormantExports: [],
		helperExports: [],
		scenarios: ["primitive"],
	},
	{
		path: "src/components/ui/tooltip.tsx",
		owner: "team2",
		routes: [
			"/statements/[id]",
			"/statements",
			"/budgets/[id]",
			"/budgets",
			"/accounts/[id]",
			"/accounts",
			"/allocator",
			"/allocator/duplicates",
			"/allocator/pending",
			"/records/[id]",
			"/records",
			"/categories",
			"/",
			"/records/monthly",
			"/terms",
			"/settings",
			"/sync",
			"/importer",
			"/privacy",
		],
		visibleExports: ["Tooltip", "TooltipContent", "TooltipProvider", "TooltipTrigger"],
		dormantExports: [],
		helperExports: [],
		scenarios: ["primitive"],
	},
	{
		path: "src/components/value-swap.tsx",
		owner: "team3",
		routes: ["/statements/[id]", "/budgets/[id]", "/accounts/[id]", "/records/[id]", "/"],
		visibleExports: ["default"],
		dormantExports: [],
		helperExports: [],
		scenarios: ["display"],
	},
	{
		path: "src/components/workflow-tabs.tsx",
		owner: "team3",
		routes: ["/allocator", "/allocator/duplicates", "/allocator/pending"],
		visibleExports: ["default"],
		dormantExports: [],
		helperExports: [],
		scenarios: ["display"],
	},
]

export const routeInventory: RouteEntry[] = [
	{
		path: "app/statements/[id]/page.tsx",
		url: "/statements/[id]",
		kind: "page",
		owner: "team3",
		scenarios: ["route"],
	},
	{
		path: "app/statements/page.tsx",
		url: "/statements",
		kind: "page",
		owner: "team3",
		scenarios: ["route"],
	},
	{
		path: "app/budgets/[id]/page.tsx",
		url: "/budgets/[id]",
		kind: "page",
		owner: "team3",
		scenarios: ["route"],
	},
	{
		path: "app/budgets/page.tsx",
		url: "/budgets",
		kind: "page",
		owner: "team3",
		scenarios: ["route"],
	},
	{
		path: "app/accounts/[id]/page.tsx",
		url: "/accounts/[id]",
		kind: "page",
		owner: "team3",
		scenarios: ["route"],
	},
	{
		path: "app/accounts/page.tsx",
		url: "/accounts",
		kind: "page",
		owner: "team3",
		scenarios: ["route"],
	},
	{
		path: "app/allocator/page.tsx",
		url: "/allocator",
		kind: "page",
		owner: "team3",
		scenarios: ["route"],
	},
	{
		path: "app/allocator/duplicates/page.tsx",
		url: "/allocator/duplicates",
		kind: "page",
		owner: "team3",
		scenarios: ["route"],
	},
	{
		path: "app/allocator/pending/page.tsx",
		url: "/allocator/pending",
		kind: "page",
		owner: "team3",
		scenarios: ["route"],
	},
	{
		path: "app/records/[id]/page.tsx",
		url: "/records/[id]",
		kind: "page",
		owner: "team3",
		scenarios: ["route"],
	},
	{
		path: "app/records/page.tsx",
		url: "/records",
		kind: "page",
		owner: "team3",
		scenarios: ["route"],
	},
	{
		path: "app/categories/page.tsx",
		url: "/categories",
		kind: "page",
		owner: "team3",
		scenarios: ["route"],
	},
	{ path: "app/(month)/page.tsx", url: "/", kind: "page", owner: "team3", scenarios: ["route"] },
	{
		path: "app/(month)/records/monthly/page.tsx",
		url: "/records/monthly",
		kind: "page",
		owner: "team3",
		scenarios: ["route"],
	},
	{
		path: "app/terms/page.tsx",
		url: "/terms",
		kind: "page",
		owner: "team3",
		scenarios: ["route"],
	},
	{
		path: "app/settings/page.tsx",
		url: "/settings",
		kind: "page",
		owner: "team3",
		scenarios: ["route"],
	},
	{ path: "app/sync/page.tsx", url: "/sync", kind: "page", owner: "team3", scenarios: ["route"] },
	{
		path: "app/importer/page.tsx",
		url: "/importer",
		kind: "page",
		owner: "team3",
		scenarios: ["route"],
	},
	{
		path: "app/privacy/page.tsx",
		url: "/privacy",
		kind: "page",
		owner: "team3",
		scenarios: ["route"],
	},
	{
		path: "app/(month)/layout.tsx",
		url: null,
		kind: "framework",
		owner: "team3",
		scenarios: ["shell"],
	},
	{
		path: "app/api/auth/exchange/route.ts",
		url: "/api/auth/exchange",
		kind: "auth-handler",
		owner: "team3",
		scenarios: ["auth"],
	},
	{
		path: "app/api/auth/logout/route.ts",
		url: "/api/auth/logout",
		kind: "auth-handler",
		owner: "team3",
		scenarios: ["auth"],
	},
	{
		path: "app/api/auth/token/route.ts",
		url: "/api/auth/token",
		kind: "auth-handler",
		owner: "team3",
		scenarios: ["auth"],
	},
	{ path: "app/layout.tsx", url: null, kind: "framework", owner: "team3", scenarios: ["shell"] },
	{
		path: "app/not-found.tsx",
		url: null,
		kind: "framework",
		owner: "team3",
		scenarios: ["shell"],
	},
	{
		path: "app/providers.tsx",
		url: null,
		kind: "framework",
		owner: "team3",
		scenarios: ["shell"],
	},
	{
		path: "app/template.tsx",
		url: null,
		kind: "framework",
		owner: "team3",
		scenarios: ["shell"],
	},
]

/** Specific refinements of generic family cases. These remain required, not exempt. */
export const scenarioDescriptions: Record<string, string> = {
	"src/components/dialogs/account.tsx#editor.validation":
		"Validate supported required fields and boundary amounts, correct input and verify persisted values after reload; disabled paths asserted where this editor exposes them",
	"src/components/dialogs/account.tsx#editor.conditional":
		"Account editor has no conditional sections: dismissal/reopen restores persisted name and keyboard trigger works",
	"src/components/dialogs/budget-creator.tsx#editor.validation":
		"Validate supported required fields and boundary amounts, correct input and verify persisted values after reload; disabled paths asserted where this editor exposes them",
	"src/components/dialogs/budget-editor.tsx#editor.validation":
		"Validate supported required fields and boundary amounts, correct input and verify persisted values after reload; disabled paths asserted where this editor exposes them",
	"src/components/dialogs/category.tsx#editor.validation":
		"Validate supported required fields and boundary amounts, correct input and verify persisted values after reload; disabled paths asserted where this editor exposes them",
	"src/components/dialogs/monthly-budget.tsx#editor.validation":
		"Validate supported required fields and boundary amounts, correct input and verify persisted values after reload; disabled paths asserted where this editor exposes them",
	"src/components/dialogs/pending-statement.tsx#editor.validation":
		"Validate supported required fields and boundary amounts, correct input and verify persisted values after reload; disabled paths asserted where this editor exposes them",
	"src/components/dialogs/record-creator.tsx#editor.validation":
		"Validate supported required fields and boundary amounts, correct input and verify persisted values after reload; disabled paths asserted where this editor exposes them",
	"src/components/dialogs/record-editor.tsx#editor.validation":
		"Validate supported required fields and boundary amounts, correct input and verify persisted values after reload; disabled paths asserted where this editor exposes them",
	"src/components/dialogs/duplicate-review.tsx#editor.conditional":
		"Review selection, cancel/back restoration and reopening retain the actual selected descriptions",
	"src/components/dialogs/statement-replacement-review.tsx#editor.conditional":
		"Review selection, cancel/back restoration and reopening retain the actual selected descriptions",
	"src/components/form/textarea-field.tsx#field.options":
		"Textarea has no picker/options: long controlled text remains intact and the visible control reflects the entered value",
	"src/components/form/select-field.tsx#field.input":
		"Controlled selected value changes and disabled options cannot replace it; keyboard opens and Escape closes",
	"src/components/form/combobox-field.tsx#field.options":
		"Search produces a real option, picking updates controlled value, clear restores none and no matches shows empty copy",
	"src/components/form/date-field.tsx#field.options":
		"Select a date, clear to empty and persist default date filters through real settings UI",
	"src/components/form/datetime-field.tsx#field.options":
		"Time edit retains selected date; choosing a day retains time and controlled ISO minute value updates",
	"src/components/form/record-analytics-fields.tsx#field.input":
		"Income disables Monthly Budget choice; Spending re-enables it and treatment changes update controlled state",
	"src/components/form/combobox-field.tsx#field.input":
		"Label activation with filter, pick, clear, empty copy and keyboard match; disabled control keeps its value; error alerts render through the shared FormField wrapper",
	"src/components/form/date-field.tsx#field.input":
		"Label activation with pick, clear-to-empty, keyboard open and disabled value retention plus while-open scroll preservation; error alerts render through the shared FormField wrapper",
	"src/components/form/datetime-field.tsx#field.input":
		"Label activation with valid time/date edits, keyboard open and disabled value retention; empty has no clear affordance and error alerts render through the shared FormField wrapper",
	"src/components/form/record-analytics-fields.tsx#field.options":
		"Treatment gating and scroll/Escape dismissal for both selects; long Monthly Budget label is selected intact, fits the popup/trigger, clears to Unbudgeted and remains cleared through Income/Spending changes",
	"src/components/form/select-field.tsx#field.options":
		"Selected and disabled options with keyboard open/close, a long empty-optional select with while-open scroll, and disabled value retention",
	"src/components/ui/select.tsx#primitive.responsive":
		"Closed pages fit the viewport; the opened 40-item popup fits the viewport with working scroll buttons and far-item selection",
	"src/components/ui/combobox.tsx#primitive.responsive":
		"Closed pages fit the viewport; the opened combobox list preserves page scroll with real wheel input and Escape dismissal",
	"src/components/ui/command.tsx#primitive.responsive":
		"Closed pages fit the viewport; the opened command dialog fits the viewport and closes from its item",
	"src/components/ui/dialog.tsx#primitive.responsive":
		"Closed pages fit the viewport; the opened dialog fits the viewport with an owned visible backdrop and Escape dismissal",
	"src/components/ui/alert-dialog.tsx#primitive.responsive":
		"Closed pages fit the viewport; the opened alert dialog fits the viewport with an owned visible backdrop and decision recording",
	"src/components/ui/sheet.tsx#primitive.responsive":
		"Closed pages fit the viewport; the opened sheet fits the viewport once its slide-in settles, with backdrop and close-button dismissal",
	"src/components/ui/popover.tsx#primitive.responsive":
		"Closed pages fit the viewport; the opened popover fits the viewport, preserves page scroll with real wheel input, and closes on Escape",
	"src/components/ui/tooltip.tsx#primitive.responsive":
		"Closed pages fit the viewport; the hover/focus tooltip fits the viewport",
	"src/components/ui/calendar.tsx#primitive.responsive":
		"Closed pages fit the viewport; the date-picker calendar popup fits the viewport with while-open scroll preservation and Escape dismissal",
	"src/components/charts/weekday-bars.tsx#chart.values":
		"Keyboard tooltip exposes expected numeric values; empty history renders zero current spending without a fabricated comparison baseline",
	"src/components/charts/category-history-chart.tsx#chart.values":
		"Keyboard tooltip exposes selected-month values; empty scope explains no spending and history distinguishes unavailable coverage from a complete zero-spending month",
	"src/components/charts/category-movers.tsx#chart.values":
		"Known category comparison has correct current/previous amount and signed delta; no history shows useful explanation; drill preserves category filter",
	"src/components/value-swap.tsx#display.values":
		"Month changes update October/September money; standalone keyboard update samples intermediate opacity and final value, with a stable immediate positional pose under reduced motion",
	"src/components/monthly-budget-badge.tsx#display.values":
		"Named/Unbudgeted states and hollow no-colour fallback render; long Unicode name retains full title and stays contained, with its configured colour dot",
	"src/components/allocate-bar.tsx#display.values":
		"No/partial/full allocation renders correct state and finite progress; zero total, negative, excess and opposite signs produce bounded rendered scales and exact amounts",
	"src/components/selection-bar.tsx#display.interaction":
		"One selected statement exposes Allocate action; action opens pending record search and selected allocation is persisted",
	"src/components/sheets/record-search.tsx#display.interaction":
		"Query/selection opens the real result workflow; chosen descriptions are verified, and cancellation/Escape restores correct state",
	"src/components/sheets/statement-search.tsx#display.interaction":
		"Query/selection opens the real result workflow; chosen descriptions are verified, and cancellation/Escape restores correct state",
	"src/components/sheets/pending-statement-confirmation.tsx#display.interaction":
		"Query/selection opens the real result workflow; chosen descriptions are verified, and cancellation/Escape restores correct state",
	"src/components/table/amount-filter.tsx#table.interaction":
		"Paid zero entered through control produces both URL bounds and the actual zero Record result",
	"src/components/table/category-filter.tsx#table.interaction":
		"Selected category narrows visible records, survives reload and Clear restores excluded rows",
	"src/components/table/filter-bar.tsx#table.interaction":
		"Clear category filters removes URL state and restores rows; the bar keeps visible control composition",
	"src/components/table/paginated-data-table.tsx#table.interaction":
		"Next page changes row identity and URL, previous is disabled on first page; search resets page and survives reload",
	"src/components/table/pagination-footer.tsx#table.interaction":
		"Disabled previous link and active next link perform correct URL/page change",
	"src/components/table/pagination-header.tsx#table.rows":
		"Header showing count is accurate for 10 rows and follows changed query/page",
	"src/components/table/data-table.tsx#table.rows":
		"Grouped date results contain the two signed amounts and their correct subtotal",
	"src/components/table/row-groups.tsx#table.rows":
		"Desktop/mobile grouped consumers show same-day count and signed subtotal with both actual record links",
	"src/components/table/record-columns.tsx#table.rows":
		"Rendered rows preserve zero/negative amounts and partial-allocation Pending reason; oversized title/optional values remain accessible through the real Record drill",
	"src/components/ui/button.tsx#primitive.consumer":
		"Pointer/Enter increments the counter; disabled button cannot increment it; enabled computed cursor is pointer",
	"src/components/ui/button-group.tsx#primitive.consumer":
		"Group text and Left counter interaction render; vertical separator orientation/dimensions and pointer cursors are asserted in the composed group",
	"src/components/ui/checkbox.tsx#primitive.consumer":
		"Label click/Space toggles controlled checked state; disabled checkbox remains off; computed cursor is pointer",
	"src/components/ui/toggle-group.tsx#primitive.consumer":
		"Pointer and Enter select Day/Week; disabled Archived stays disabled and unselected",
	"src/components/ui/calendar.tsx#primitive.consumer":
		"Pointer day pick and next month update selection/heading; keyboard ArrowRight/Home/End move day focus, Enter selects and month navigation activates by Enter",
	"src/components/ui/monthpicker.tsx#primitive.consumer":
		"Selecting October updates month and out-of-range January is disabled after changing year",
	"src/components/ui/command.tsx#primitive.consumer":
		"Search hides nonmatching result, selecting Durian changes state, no-match shows empty message; ArrowDown highlights an option",
	"src/components/ui/tooltip.tsx#primitive.consumer": "Hover and focus expose the tooltip text",
	"src/components/ui/popover.tsx#primitive.consumer":
		"Open exposes title and description copy, preserves body overflow and Escape closes the popup",
	"src/components/ui/select.tsx#primitive.consumer":
		"Choosing Banana changes controlled value, disabled option is marked and keyboard can open/Escape dismiss",
	"src/components/ui/combobox.tsx#primitive.consumer":
		"Actual selection, clear and miss update controlled selected value/empty copy",
	"src/components/ui/dropdown-menu.tsx#dormant.behaviour":
		"Item, checkbox, radio and submenu update state with keyboard and while-open scroll; label, two painted separator geometries and Export shortcut text are asserted",
	"src/components/ui/dialog.tsx#primitive.consumer":
		"Real composed popup has labelled title/description/header/footer; close restores focus, containment/backdrop tested; confirm/cancel action state asserted for alert",
	"src/components/ui/sheet.tsx#primitive.consumer":
		"Real composed popup has labelled title/description/header/footer; close restores focus, containment/backdrop tested; confirm/cancel action state asserted for alert",
	"src/components/ui/alert-dialog.tsx#primitive.consumer":
		"Real composed popup has labelled title/description/header/footer; close restores focus, containment/backdrop tested; confirm/cancel action state asserted for alert",
	"src/components/ui/item.tsx#dormant.behaviour":
		"Standalone compound Item composition asserts real list content ordering and bounded media/content/actions; no controlled state or keyboard action exists on these layout wrappers",
	"src/components/ui/card.tsx#primitive.consumer":
		"Assert actual title/body/description and bounded header/content/footer/action composition; decorative wrappers have no own state/action to simulate",
	"src/components/ui/empty.tsx#primitive.consumer":
		"Assert actual title/body/description and bounded header/content/footer/action composition; decorative wrappers have no own state/action to simulate",
	"src/components/ui/table.tsx#primitive.consumer":
		"Accessible table caption/headers, two payee amounts and computed numeric footer sum are preserved",
	"src/components/ui/field.tsx#primitive.consumer":
		"Associated label focuses actual input, editable unicode value, live error alert, legend and horizontal checkbox content are meaningful; Space changes checkbox checked state",
	"src/components/ui/input-group.tsx#primitive.consumer":
		"Controlled amount input mirrors changes and Clear; Note addon is visible and the uncontrolled grouped textarea accepts long Unicode text plus keyboard edits",
	"src/components/ui/input.tsx#primitive.consumer":
		"Label focuses associated input and controlled textarea input is mirrored in output",
	"src/components/ui/textarea.tsx#primitive.consumer":
		"Typed textarea content updates the controlled mirror output",
	"src/components/ui/label.tsx#primitive.consumer":
		"Associated label changes checkbox state, confirming its interactive association",
	"src/components/ui/badge.tsx#primitive.consumer":
		"Warning/destructive status text has distinct painted foregrounds and backgrounds; long secondary Badge keeps full text/title accessible and ellipsises within the viewport",
	"src/components/ui/progress.tsx#primitive.consumer":
		"Changing to 150 shows excess indicator; changing to 0 hides its excess and sets base translation to zero coverage position",
	"src/components/ui/scroll-area.tsx#primitive.consumer":
		"Viewport actually scrolls; scrolling exposes visible vertical scrollbar and thumb with positive bounded geometry",
	"src/components/ui/pagination.tsx#primitive.consumer":
		"Current page exposes aria-current and previous/next accessible labels; actual app pagination is asserted separately",
	"src/components/ui/chart.tsx#primitive.consumer":
		"Composed legend exposes both named series, generated CSS colour variables differ, keyboard tooltip shows 120/200 then 180/160",
	"src/components/ui/sonner.tsx#primitive.consumer":
		"Real success/error buttons produce the expected notification texts",
	"src/components/ui/sidebar.tsx#primitive.consumer":
		"Desktop collapse/reopen state or mobile Sidebar dialog open/Escape dismissal is asserted",
	"src/components/ui/skeleton.tsx#dormant.behaviour":
		"Standalone and menu placeholders have visible bounded geometry; non-positional pulse changes opacity without moving or resizing the standalone placeholder under every motion preference",
	"src/components/layout/page-header.tsx#display.interaction":
		"Back control is above destination heading and restores exact category/record origin URLs",
	"src/components/workflow-tabs.tsx#display.interaction":
		"Keyboard navigation changes Replace Pending, Fix Duplicates and Allocate destinations; returning to Allocate carries configured default start date",
	"src/components/layout/app-sidebar.tsx#display.interaction":
		"Visible sidebar Dashboard link navigates and clears drill history; header sidebar trigger toggles via keyboard (dialog on mobile)",
	"src/components/layout/app-sidebar.tsx#export.default.behaviour":
		"Visible sidebar Dashboard link navigates and clears drill history; header sidebar trigger toggles via keyboard (dialog on mobile)",
	"app/importer/page.tsx#route.data":
		"Invalid CSV/workbook produces format errors without changing statements; valid import adds exactly one statement and repeat import adds none",
	"app/settings/page.tsx#route.data":
		"Disabled unchanged Save enables for edits; date filter changes persist and clear restores absent default",
	"app/sync/page.tsx#route.data":
		"Backup exports real counts, empty workspace disables download, restore returns exact Records/Statements and a known Record ID",
	"app/allocator/duplicates/page.tsx#route.data":
		"Explicit keep/delete moves allocations, deletes selected duplicate and leaves kept statement fully allocated",
	"app/allocator/pending/page.tsx#route.data":
		"Queue/candidate search selects replacement; allocation follows imported statement and old pending ID is gone",
	"app/accounts/[id]/page.tsx#route.navigation":
		'Direct account detail fallback is tested by "direct Accounts detail has a working fallback"; "accounts keyboard card to detail to Back keeps exact origin" verifies this route\'s filtered keyboard return and Back above heading',
	"app/budgets/[id]/page.tsx#route.navigation":
		'Direct budget detail fallback is tested by "direct Budgets detail has a working fallback"; "budgets keyboard card Enter to detail to Back keeps exact origin" verifies this route\'s filtered keyboard return and Back above heading',
	"app/records/[id]/page.tsx#route.navigation":
		'Direct record detail fallback is tested by "direct Records detail has a working fallback"; "records keyboard filtered list to detail to Back keeps exact origin" verifies this route\'s filtered keyboard return and Back above heading',
	"app/statements/[id]/page.tsx#route.navigation":
		'Direct statement detail fallback is tested by "direct Statements detail has a working fallback"; "statements keyboard filtered list to detail to Back keeps exact origin" verifies this route\'s filtered keyboard return and Back above heading',
	"src/components/ui/dialog.tsx#export.DialogPortal.behaviour":
		"Structural portal pass-through; covered through the composed backdrop/focus consumer rather than an isolated mount",
	"src/components/ui/alert-dialog.tsx#export.AlertDialogPortal.behaviour":
		"Structural portal pass-through; covered through the composed backdrop/decision consumer rather than an isolated mount",
	"src/components/ui/tooltip.tsx#export.TooltipProvider.behaviour":
		"Structural provider pass-through; covered through the composed hover/focus consumer rather than an isolated mount",
	"src/components/ui/select.tsx#export.SelectValue.behaviour":
		"Value slot renders the selected label inside the composed trigger; covered through the pick/disabled consumer",
	"src/components/charts/category-spending-mix.tsx#chart.motion":
		"Category mix bars carry no transition by construction; list entrance is covered via the shared page fade",
	"src/components/charts/budget-progress-chart.tsx#chart.responsive":
		"Dense budget card fits with finite values; keyboard tooltip carries actual October values",
	"src/components/charts/cashflow-chart.tsx#chart.responsive":
		"Dense card fits with finite values; keyboard tooltip stays numeric and inside every viewport",
	"src/components/charts/category-history-chart.tsx#chart.responsive":
		"Dense card fits with finite values; keyboard tooltip stays numeric and inside every viewport",
	"src/components/charts/daily-spending-chart.tsx#chart.responsive":
		"Dense card fits with finite values; keyboard tooltip stays numeric and inside every viewport",
	"src/components/charts/weekday-bars.tsx#chart.responsive":
		"Dense card fits with finite values; keyboard tooltip stays numeric and inside every viewport",
	"src/components/charts/total-spending-chart.tsx#chart.responsive":
		"Dense card fits with finite values; keyboard tooltip stays numeric and inside every viewport",
	"src/components/charts/category-movers.tsx#chart.responsive":
		"Dense card fits with finite values and long names; Housing drill works by keyboard",
	"src/components/charts/category-movers.tsx#chart.motion":
		"Real editor save in the same scope transitions the live bar scale with drill identity and settled tail; reduced motion applies immediately",
	"src/components/charts/category-spending-mix.tsx#chart.responsive":
		"Dense long category name truncates readably; card fits with finite values",
	"src/components/charts/monthly-budget-usage.tsx#chart.responsive":
		"Dense card fits with finite values and long names",
	"src/components/charts/monthly-budget-usage.tsx#chart.motion":
		"Focused donut segment dims siblings smoothly with settle and restore; reduced motion dims immediately",
	"src/components/charts/spending-calendar.tsx#chart.responsive":
		"Dense card fits with finite values and long names; day drill works by keyboard",
	"src/components/charts/spending-calendar.tsx#chart.motion":
		"Day heat fades in place across a month change with node persistence and settle; reduced motion recolors immediately",
	"src/components/charts/sparkline.tsx#chart.responsive":
		"Zero/negative/mixed/dense fixtures fit narrow viewports with visible strokes and correct finite endpoints",
	"src/components/charts/sparkline.tsx#chart.motion":
		"Endpoint marker entrance respects reduced motion with final data endpoint; polyline draws progressively then settles",
	"src/components/charts/cashflow-chart.tsx#chart.motion":
		"All five projects: Surplus / Shortfall graph marks grow through intermediate geometry once and settle with no replay on hover/resize; reduced-motion immediate-final covered in the reduced-motion project",
	"src/components/charts/total-spending-chart.tsx#chart.motion":
		"All five projects: Spending forecast graph marks grow through intermediate geometry once and settle with no replay on hover/resize; reduced-motion immediate-final covered in the reduced-motion project",
	"src/components/charts/daily-spending-chart.tsx#chart.motion":
		"All five projects: Spending by day graph marks grow through intermediate geometry once and settle; reduced-motion immediate-final covered in the reduced-motion project",
	"src/components/charts/weekday-bars.tsx#chart.motion":
		"All five projects: Spending by weekday graph marks grow through intermediate geometry once and settle; reduced-motion immediate-final covered in the reduced-motion project",
	"src/components/charts/category-history-chart.tsx#chart.motion":
		"All five projects: Category trend graph marks grow through intermediate geometry once and settle; reduced-motion immediate-final covered in the reduced-motion project",
	"src/components/charts/budget-progress-chart.tsx#chart.motion":
		"All five projects: Spending over time graph marks grow through intermediate geometry once and settle with no replay on hover/resize; reduced-motion immediate-final covered in the reduced-motion project",
	"src/components/charts/chart-intro.ts#indirect.consumer":
		"All five projects: overview and budget graph marks grow through intermediate geometry once and settle with no replay on hover/resize; reduced-motion immediate-final covered in the reduced-motion project",
	"src/components/table/statement-columns.tsx#table.interaction":
		"Statement pagination keeps search in the URL and changes row identity; search resets page and survives reload",
	"src/components/table/statement-columns.tsx#table.rows":
		"Populated/empty rows retain pending badge, zero/signed amounts and allocable remainder; oversized description stays accessible and same-day signed subtotal reconciles; unsupported archive/null states have source reasons in facetNotApplicable",
	"src/components/layout/app-header.tsx#display.values":
		"Header h1 copy is asserted across all 19 layout routes and theme branches; reachable titles are fixed by ShellHeader.TITLES, so arbitrary entity-name h1 is inapplicable (facetNotApplicable)",
	"src/components/layout/shell-header.tsx#display.values":
		"Header h1 copy is asserted across all 19 layout routes and theme branches; ShellHeader.TITLES supplies fixed route labels, with no entity-name input (facetNotApplicable)",
	"src/components/layout/app-sidebar.tsx#display.values":
		"Finpoint/Local-first finance brand copy visible in the desktop sidebar and the mobile dialog via keyboard toggle",
	"app/statements/page.tsx#route.navigation":
		"Keyboard filtered list to detail with exact origin, Back above heading and keyboard return; pointer fallbacks covered separately",
	"app/budgets/page.tsx#route.navigation":
		"Keyboard card Enter to detail with exact origin, Back above heading and keyboard return; pointer fallbacks covered separately",
	"app/accounts/page.tsx#route.navigation":
		"Keyboard card to detail (One Card account) with exact origin, Back above heading and keyboard return; pointer fallbacks covered separately",
	"app/allocator/page.tsx#route.navigation":
		"Keyboard checkbox selection, dialog open/cancel and clear with checked state retained",
	"app/allocator/duplicates/page.tsx#route.navigation":
		"Keyboard keep/delete radio choice with review open and Escape cancel",
	"app/allocator/pending/page.tsx#route.navigation":
		"Keyboard queue search, candidate scope, replace and confirm through to the record",
	"app/records/page.tsx#route.navigation":
		"Keyboard filtered list to detail with exact origin, Back above heading and keyboard return; pointer fallbacks covered separately",
	"app/categories/page.tsx#route.navigation":
		"Keyboard nested drill through filtered Records with two keyboard Back returns; no detail route exists by design",
	"app/settings/page.tsx#route.navigation":
		'Top-level sidebar destination (app-sidebar.tsx): Back exemption applies to that navigation. "settings keyboard save persists across reload" verifies date pick/save/reload; ordinary drill Back is covered by route-specific keyboard detail cases',
	"app/sync/page.tsx#route.navigation":
		'Top-level sidebar destination (app-sidebar.tsx): Back exemption applies to that navigation. "sync keyboard clear cancelled preserves data" uses a visible-only Monthly Salary assertion on both responsive layouts; ordinary drill Back is covered by route-specific keyboard detail cases',
	"app/importer/page.tsx#route.navigation":
		'Top-level sidebar destination (app-sidebar.tsx): Back exemption applies to that navigation. "importer keyboard bank select and invalid rejection" verifies bank radio/file chooser/rejection; ordinary drill Back is covered by route-specific keyboard detail cases',
	"src/components/selection-bar.tsx#selection.state":
		"Keyboard one-selection with dialog/cancel retention and clear, honestly disabled two-selection replace, small-viewport keyboard clear, and post-clear identity; no select-all header control exists by design",
	"src/components/table/data-table.tsx#table.motion":
		"Records/Statements consumers cascade with settled refilter and paging fade across light/tall/mobile/dark plus the reduced-motion project; detach no-replay and clear-identity do not vary by configuration (default chromium/mobile selection, detach also reduced-motion); Allocate tall beyond-12 excluded",
	"src/components/table/paginated-data-table.tsx#table.motion":
		"Paging fade and Records/Statements cascades run across light/tall/mobile/dark plus the reduced-motion project; page-change identity does not vary by configuration (default chromium/mobile selection)",
	"src/components/table/record-columns.tsx#table.motion":
		"Records/Monthly consumers cascade with settled refilter across light/tall/mobile/dark plus the reduced-motion project; detach no-replay does not vary by configuration (default projects plus reduced-motion); tall Budget Records covered by the tall-only file",
	"src/components/table/row-groups.tsx#table.motion":
		"Records/Monthly grouped consumers cascade with settled refilter across light/tall/mobile/dark plus the reduced-motion project",
	"src/components/table/statement-columns.tsx#table.motion":
		"Statements/Allocate consumers cascade with settled refilter and paging fade across light/tall/mobile/dark plus the reduced-motion project; Allocate tall beyond-12 excluded",
	"src/components/table/data-table.tsx#table.interaction":
		"Budget detach preserves sibling identity without replay; record/statement pagination and category filtering act through real parent controls",
	"src/components/table/record-columns.tsx#table.interaction":
		"Pagination, category filtering and exact filtered Back act through real parent controls; long Record link works by Enter; action cells expose no disabled action (source reason in facetNotApplicable)",
	"src/components/monthly-budget-badge.tsx#monthly-budget.archived":
		"Historical assignment retains name/totals and disabled archived editor option after raw/UI archival; hollow Unbudgeted/no-colour fallback and Income/Spending eligibility are covered through their actual consumers",
	"src/components/dialogs/monthly-budget.tsx#monthly-budget.archived":
		"UI archival persists its flag and historical assignment; record consumers retain archived badge/totals and disabled option, Unbudgeted fallback and treatment eligibility; those fields belong to record consumers, not this editor (facetNotApplicable)",
	"app/statements/page.tsx#route.data":
		"Populated/empty/paginated rows retain pending, zero, signed/allocable state and silent reveal; long description and signed grouped subtotal are asserted; archive/null fields are unsupported (facetNotApplicable)",
	"app/statements/[id]/page.tsx#route.data":
		"Split/unallocated allocations, related rows, missing-ID copy and silent reveal; oversized pending description, Pending footer/edit action and confirmed imported-index footer are asserted",
	"app/budgets/page.tsx#route.data":
		"Populated/empty/searchable directory with silent reveal; long-name overflow is covered via route.long and zero/negative plan facets via charts",
	"app/budgets/[id]/page.tsx#route.data":
		"Manual/automatic membership sums, related rows, missing-ID copy and silent reveal; Budget has no archive state (facetNotApplicable); Monthly Budget archival is covered on its own consumer",
	"app/accounts/page.tsx#route.data":
		"Populated/empty/searchable directory with silent reveal; long-name overflow is covered via route.long",
	"app/accounts/[id]/page.tsx#route.data":
		"Related rows, missing-ID copy and silent reveal; pending count/badge/edit action are distinguished from imported confirmed activity and real pending editor opens",
	"app/records/page.tsx#route.data":
		"Populated/empty/paginated/filtered rows retain zero/signed values and silent reveal; long Unicode title and optional values remain accessible through keyboard drill and reload",
	"app/records/[id]/page.tsx#route.data":
		"Zero/pending/null/income variants, allocations, missing-ID copy and silent reveal; long Unicode title/people/location/description survive real list drill and reload with reachable Edit",
	"app/categories/page.tsx#route.data":
		"Populated/empty/searchable directory with silent reveal; long-name overflow is covered via route.long",
	"app/(month)/page.tsx#route.data":
		"Income/refund/exclusion reconciliation with empty, null/zero-plan, dense, calendar-drill and movers values; per-chart motion stays separate",
	"app/(month)/records/monthly/page.tsx#route.data":
		"Empty and archived-assignment filtered totals; later current-month rows show excluded-from-actuals copy and money, and future-month rows retain amount plus keyboard drill",
	"src/components/dialogs/budget-creator.tsx#editor.long":
		"Unicode long name entry keeps a contained footer with pointer cursor, in-viewport Cancel and Enter cancellation",
	"src/components/dialogs/category.tsx#editor.long":
		"Unicode long name entry keeps a contained footer with pointer cursor, in-viewport Cancel and Enter cancellation",
	"src/components/dialogs/monthly-budget.tsx#editor.long":
		"Unicode long name entry keeps a contained footer with pointer cursor, in-viewport Cancel and Enter cancellation",
	"src/components/dialogs/pending-statement.tsx#editor.long":
		"Unicode long description entry keeps a contained footer with pointer cursor, in-viewport Cancel and Enter cancellation",
	"src/components/dialogs/duplicate-review.tsx#editor.long":
		"Long imported descriptions render with a contained footer, pointer cursor, in-viewport Cancel and Enter cancellation",
	"src/components/dialogs/statement-replacement-review.tsx#editor.long":
		"Long imported descriptions render with a contained footer, pointer cursor, in-viewport Cancel and Enter cancellation",
	"src/components/form/date-range.tsx#field.options":
		"Fixed-format range applies a day and clears back to null; the popover preserves page overflow while open with content inside the viewport and Escape dismissal",
}

/** Explicitly non-applicable cases with documented reasons. These are neither
 * mapped nor pending: removing them from scenarios would hide the decision, and
 * mapping them would fabricate coverage. The gate reports them separately. */
export const notApplicable: Record<string, string> = {
	"src/components/dialogs/account.tsx#editor.conditional":
		"No conditional sections in the account editor; reopen/keyboard semantics are covered via editor.open, not conditional motion",
	"src/components/dialogs/budget-creator.tsx#editor.conditional":
		"No conditional sections in the budget creator; range/amount validation is covered via editor.validation",
	"src/components/dialogs/budget-editor.tsx#editor.conditional":
		"No conditional sections in the budget editor; prepopulated period/amount behaviour is covered via editor.validation",
	"src/components/dialogs/pending-statement.tsx#editor.conditional":
		"No conditional sections in the pending-statement editor; account/allocation behaviour is covered via editor.validation",
	"src/components/dialogs/duplicate-review.tsx#editor.conditional":
		"Choice dialog with no conditional reveal animation; selection/disabled-confirm semantics are covered via editor.open and editor.validation",
	"src/components/dialogs/statement-replacement-review.tsx#editor.conditional":
		"Choice dialog with no conditional reveal animation; selection/replace semantics are covered via editor.open and editor.validation",
	"src/components/allocate-bar.tsx#display.interaction":
		"Static progress display with no enabled controls; values and finite progress are covered via display.values and allocation.amount",
	"src/components/detail-summary.tsx#display.interaction":
		"Static summary with no enabled controls; content and overflow are covered via display.values",
	"src/components/metric.tsx#display.interaction":
		"Static metric output with no enabled controls; values are covered via display.values",
	"src/components/record-amount.tsx#display.interaction":
		"Static amount output with no enabled controls; signs and pending values are covered via display.values",
	"src/components/monthly-budget-badge.tsx#display.interaction":
		"Static badge with no enabled controls; assignment and fallback are covered via display.values",
	"src/components/icon.tsx#display.interaction":
		"Static icon output with no enabled controls; SVG output and size are covered via display.values",
	"src/components/layout/page-content.tsx#display.values":
		"Layout container with no own visible copy; containment is exercised through route.layout consumers mapped to its export",
	"src/components/layout/page-content.tsx#display.interaction":
		"Layout container with no enabled controls of its own",
	"src/components/value-swap.tsx#display.interaction":
		"Animated value span with no enabled controls of its own; keyboard-triggered updates are covered via display.values",
	"src/components/table/amount-filter.tsx#table.rows":
		"Filter control renders no rows of its own; row results are covered via table.interaction and paginated consumers",
	"src/components/table/amount-filter.tsx#table.motion":
		"Filter control has no row entrance cascade of its own",
	"src/components/table/category-filter.tsx#table.rows":
		"Filter control renders no rows of its own; row results are covered via table.interaction and paginated consumers",
	"src/components/table/category-filter.tsx#table.motion":
		"Filter control has no row entrance cascade of its own",
	"src/components/table/filter-bar.tsx#table.rows":
		"Filter bar renders no rows of its own; row results are covered via table.interaction and paginated consumers",
	"src/components/table/filter-bar.tsx#table.motion":
		"Filter bar has no row entrance cascade of its own",
	"src/components/table/pagination-footer.tsx#table.rows":
		"Pagination footer renders no rows of its own; counts and page changes are covered via table.interaction",
	"src/components/table/pagination-footer.tsx#table.motion":
		"Pagination footer has no row entrance cascade of its own",
	"src/components/table/pagination-header.tsx#table.interaction":
		"Count header has no interactive controls of its own; accuracy is covered via table.rows",
	"src/components/table/pagination-header.tsx#table.motion":
		"Count header has no row entrance cascade of its own",
	"src/components/form/amount-field.tsx#field.options":
		"Numeric input with no picker/options; typing, steps and sign are covered via field.input",
	"src/components/form/field.tsx#field.options":
		"Label/error wrapper with no picker/options of its own; association and alerts are covered via field.input",
	"src/components/monthly-budget-badge.tsx#monthly-budget.amount":
		"Badge renders only the budget name and colour dot with no comparison amount output; null/zero/default/override resolution is covered via monthly-budget dialog and chart usage tests",
	"src/components/form/record-analytics-fields.tsx#monthly-budget.amount":
		"Field chooses budget identity and treatment eligibility (amount only gates eligibility) with no comparison amount output; resolution is covered via monthly-budget dialog tests",
	"src/components/table/row-groups.tsx#table.interaction":
		"Group header wrappers expose no own interactive controls; row filtering, pagination and link behaviour is covered via record-columns and data-table consumers",
	"src/components/charts/category-spending-mix.tsx#chart.motion":
		"Category mix bars carry no transition by construction; list entrance is covered via the shared page fade",
	"app/privacy/page.tsx#route.data":
		"Static content page with no financial live query; readability is covered via pages.static and navigation via ordinary static-page links",
	"app/terms/page.tsx#route.data":
		"Static content page with no financial live query; readability is covered via pages.static and navigation via ordinary static-page links",
}

/** Reviewed assertion mappings. Passing browser evidence is separate; unmapped cases fail by default. */
export const behaviourCoverage: Record<string, string[]> = {
	"src/components/dialogs/account.tsx#editor.open": [
		"account update: popup entrance, backdrop and keyboard reopen",
	],
	"src/components/dialogs/account.tsx#export.default.behaviour": [
		"account update: popup entrance, backdrop and keyboard reopen",
		"account: required name, unicode rename persists after reload",
	],
	"src/components/dialogs/account.tsx#editor.validation": [
		"account: required name, unicode rename persists after reload",
	],
	"src/components/dialogs/budget-creator.tsx#editor.open": [
		"budget create: popup entrance, backdrop and keyboard reopen",
	],
	"src/components/dialogs/budget-creator.tsx#export.default.behaviour": [
		"budget create: popup entrance, backdrop and keyboard reopen",
		"budget creator: blank name/range errors, negative rejected, zero and single-day range persist",
	],
	"src/components/dialogs/budget-creator.tsx#editor.validation": [
		"budget creator: blank name/range errors, negative rejected, zero and single-day range persist",
	],
	"src/components/dialogs/budget-editor.tsx#editor.open": [
		"budget update: popup entrance, backdrop and keyboard reopen",
	],
	"src/components/dialogs/budget-editor.tsx#export.default.behaviour": [
		"budget update: popup entrance, backdrop and keyboard reopen",
		"budget editor: prepopulated period and amount, clearing range fails, long name and zero persist",
	],
	"src/components/dialogs/budget-editor.tsx#editor.validation": [
		"budget editor: prepopulated period and amount, clearing range fails, long name and zero persist",
	],
	"src/components/dialogs/category.tsx#editor.open": [
		"category update: popup entrance, backdrop and keyboard reopen",
	],
	"src/components/dialogs/category.tsx#export.default.behaviour": [
		"category update: popup entrance, backdrop and keyboard reopen",
		"category: spending default budget, archived options absent, income clears budget, blank validation",
		"category creator: required identity and valid colour/defaults persist",
	],
	"src/components/dialogs/category.tsx#editor.validation": [
		"category: spending default budget, archived options absent, income clears budget, blank validation",
		"category creator: required identity and valid colour/defaults persist",
	],
	"src/components/dialogs/monthly-budget.tsx#editor.open": [
		"monthly budget update: popup entrance, backdrop and keyboard reopen",
	],
	"src/components/dialogs/monthly-budget.tsx#export.default.behaviour": [
		"monthly budget update: popup entrance, backdrop and keyboard reopen",
		"monthly budget creator: blank errors, zero amount and null are distinct persisted values",
		"monthly budget editor: inherited amount reveals smoothly only after override action",
	],
	"src/components/dialogs/monthly-budget.tsx#editor.validation": [
		"monthly budget creator: blank errors, zero amount and null are distinct persisted values",
		"monthly budget editor: inherited amount reveals smoothly only after override action",
	],
	"src/components/dialogs/pending-statement.tsx#editor.open": [
		"pending statement update: popup entrance, backdrop and keyboard reopen",
	],
	"src/components/dialogs/pending-statement.tsx#export.default.behaviour": [
		"pending statement update: popup entrance, backdrop and keyboard reopen",
		"pending statement creator: required account/description and negative amount persist",
		"pending statement editor: original description, allocations protect delete, zero fails and negative persists",
	],
	"src/components/dialogs/pending-statement.tsx#editor.validation": [
		"pending statement creator: required account/description and negative amount persist",
		"pending statement editor: original description, allocations protect delete, zero fails and negative persists",
	],
	"src/components/dialogs/record-creator.tsx#editor.open": [
		"record create: popup entrance, backdrop and keyboard reopen",
	],
	"src/components/dialogs/record-creator.tsx#export.default.behaviour": [
		"record create: popup entrance, backdrop and keyboard reopen",
		"record creator: required fields, category defaults, amount -12.34 and long text persist",
		"record creator: required fields, category defaults, amount 0 and long text persist",
		"record creator: clearing the selected date shows date validation and archived budgets stay unavailable",
	],
	"src/components/dialogs/record-creator.tsx#editor.validation": [
		"record creator: required fields, category defaults, amount -12.34 and long text persist",
		"record creator: required fields, category defaults, amount 0 and long text persist",
		"record creator: clearing the selected date shows date validation and archived budgets stay unavailable",
	],
	"src/components/dialogs/record-editor.tsx#editor.open": [
		"record update: popup entrance, backdrop and keyboard reopen",
	],
	"src/components/dialogs/record-editor.tsx#export.default.behaviour": [
		"record update: popup entrance, backdrop and keyboard reopen",
		"record editor: null optional fields, long title, sign and penny keyboard steps persist",
	],
	"src/components/dialogs/record-editor.tsx#editor.validation": [
		"record editor: null optional fields, long title, sign and penny keyboard steps persist",
	],
	"src/components/dialogs/duplicate-review.tsx#export.default.behaviour": [
		"duplicate review: explicit keep/delete, backdrop, cancel and reopen retain choices",
	],
	"src/components/dialogs/duplicate-review.tsx#editor.open": [
		"duplicate review: explicit keep/delete, backdrop, cancel and reopen retain choices",
	],
	"src/components/dialogs/statement-replacement-review.tsx#export.default.behaviour": [
		"pending confirmation sheet and replacement review: selected descriptions, cancel restores sheet",
	],
	"src/components/dialogs/statement-replacement-review.tsx#editor.open": [
		"pending confirmation sheet and replacement review: selected descriptions, cancel restores sheet",
	],
	"src/components/dialogs/monthly-budget.tsx#monthly-budget.amount": [
		"monthly budget creator: blank errors, zero amount and null are distinct persisted values",
		"monthly budget editor: inherited amount reveals smoothly only after override action",
	],
	"src/components/dialogs/monthly-budget.tsx#monthly-budget.archived": [
		"data.archiving Monthly Budget editor persists archival without erasing historical assignment",
		"data.archived historical assignment retains its badge, total and disabled editor option",
		"display.amount and badge optional states preserve signs pending values and colour fallback",
		"UI-FACET-ANALYTICS",
	],
	"src/components/form/amount-field.tsx#export.default.behaviour": [
		"amount commits typed value, rejects invalid text and 3dp",
		"amount ArrowUp/ArrowDown step by 0.01",
		"amount sign toggle flips sign; min=0 field hides toggle and rejects minus",
	],
	"src/components/form/amount-field.tsx#field.input": [
		"amount commits typed value, rejects invalid text and 3dp",
		"amount ArrowUp/ArrowDown step by 0.01",
		"amount sign toggle flips sign; min=0 field hides toggle and rejects minus",
	],
	"src/components/form/text-field.tsx#export.default.behaviour": [
		"text field types; suggestions filter and select",
		"account: required name, unicode rename persists after reload",
	],
	"src/components/form/text-field.tsx#field.input": [
		"text field types; suggestions filter and select",
		"account: required name, unicode rename persists after reload",
	],
	"src/components/form/textarea-field.tsx#export.default.behaviour": [
		"textarea records long values",
	],
	"src/components/form/textarea-field.tsx#field.options": ["textarea records long values"],
	"src/components/form/select-field.tsx#export.default.behaviour": [
		"select picks an option; disabled option stays unselected",
		"select opens and closes from the keyboard",
	],
	"src/components/form/select-field.tsx#field.input": [
		"select picks an option; disabled option stays unselected",
		"select opens and closes from the keyboard",
	],
	"src/components/form/select-field.tsx#field.options": [
		"select picks an option; disabled option stays unselected",
		"select opens and closes from the keyboard",
		"long optional select shows empty placeholder, fits popup and picks",
		"disabled form fields stay disabled and keep their values",
	],
	"src/components/form/combobox-field.tsx#export.default.behaviour": [
		"combobox field filters, picks, clears and shows empty text",
	],
	"src/components/form/combobox-field.tsx#field.options": [
		"combobox field filters, picks, clears and shows empty text",
	],
	"src/components/form/combobox-field.tsx#field.input": [
		"combobox field filters, picks, clears and shows empty text",
		"combobox field selects the highlighted match from the keyboard",
		"combobox field preserves page scroll while open and dismisses with Escape",
		"disabled form fields stay disabled and keep their values",
		"form labels activate their controls and invalid input links its error",
	],
	"src/components/form/date-field.tsx#export.default.behaviour": [
		"date field picks a day from the calendar and clears",
		"settings validate, persist, and reload",
	],
	"src/components/form/date-field.tsx#field.options": [
		"date field picks a day from the calendar and clears",
		"settings validate, persist, and reload",
	],
	"src/components/form/date-field.tsx#field.input": [
		"date field picks a day from the calendar and clears",
		"date picker preserves page scroll while open and dismisses with Escape",
		"form picker triggers open from the keyboard and close with Escape",
		"disabled form fields stay disabled and keep their values",
		"form labels activate their controls and invalid input links its error",
	],
	"src/components/form/date-range.tsx#export.default.behaviour": [
		"date range applies a day and clears back to null",
		"budget creator: blank name/range errors, negative rejected, zero and single-day range persist",
	],
	"src/components/form/date-range.tsx#field.input": [
		"date range applies a day and clears back to null",
		"budget creator: blank name/range errors, negative rejected, zero and single-day range persist",
	],
	"src/components/form/date-range.tsx#field.options": [
		"date range applies a day and clears back to null",
		"date range preserves page scroll while open and dismisses with Escape",
	],
	"src/components/form/datetime-field.tsx#export.default.behaviour": [
		"datetime field edits time and picks a new date",
	],
	"src/components/form/datetime-field.tsx#field.options": [
		"datetime field edits time and picks a new date",
	],
	"src/components/form/datetime-field.tsx#field.input": [
		"datetime field edits time and picks a new date",
		"form picker triggers open from the keyboard and close with Escape",
		"disabled form fields stay disabled and keep their values",
		"form labels activate their controls and invalid input links its error",
	],
	"src/components/form/field.tsx#export.FormField.behaviour": [
		"field validation errors render as alerts",
		"account: required name, unicode rename persists after reload",
	],
	"src/components/form/field.tsx#field.input": [
		"field validation errors render as alerts",
		"account: required name, unicode rename persists after reload",
	],
	"src/components/form/record-analytics-fields.tsx#export.default.behaviour": [
		"record analytics treatment gates the monthly budget control",
		"category: spending default budget, archived options absent, income clears budget, blank validation",
		"UI-FACET-ANALYTICS",
	],
	"src/components/form/record-analytics-fields.tsx#monthly-budget.archived": [
		"record analytics treatment gates the monthly budget control",
		"record creator: clearing the selected date shows date validation and archived budgets stay unavailable",
	],
	"src/components/form/record-analytics-fields.tsx#field.input": [
		"record analytics treatment gates the monthly budget control",
	],
	"src/components/form/record-analytics-fields.tsx#field.options": [
		"record analytics treatment gates the monthly budget control",
		"record analytics selects preserve page scroll while open and dismiss with Escape",
		"UI-FACET-ANALYTICS",
	],
	"src/components/charts/cashflow-chart.tsx#export.default.behaviour": [
		"charts.tooltip Surplus / Shortfall keyboard navigation exposes actual numeric values",
	],
	"src/components/charts/daily-spending-chart.tsx#export.default.behaviour": [
		"charts.tooltip Spending by day keyboard navigation exposes actual numeric values",
	],
	"src/components/charts/total-spending-chart.tsx#export.default.behaviour": [
		"charts.tooltip Spending forecast keyboard navigation exposes actual numeric values",
	],
	"src/components/charts/weekday-bars.tsx#export.default.behaviour": [
		"charts.tooltip Spending by weekday keyboard navigation exposes actual numeric values",
	],
	"src/components/charts/weekday-bars.tsx#chart.values": [
		"charts.tooltip Spending by weekday keyboard navigation exposes actual numeric values",
		"charts.empty no history gives zero metrics and useful chart explanations",
		"UI-FACET-WEEKDAY-NULL",
	],
	"src/components/charts/category-history-chart.tsx#export.default.behaviour": [
		"charts.tooltip Category trend keyboard navigation exposes actual numeric values",
	],
	"src/components/charts/category-history-chart.tsx#chart.values": [
		"charts.tooltip Category trend keyboard navigation exposes actual numeric values",
		"charts.empty no history gives zero metrics and useful chart explanations",
		"UI-FACET-CHART-COMPARISON",
	],
	"src/components/charts/budget-progress-chart.tsx#export.default.behaviour": [
		"charts.tooltip Spending over time keyboard navigation exposes actual numeric values",
	],
	"src/components/charts/category-spending-mix.tsx#export.default.behaviour": [
		"charts.summary income, refunds and exclusions reconcile across metrics and category mix",
		"charts.refund net refund, long category name and excluded treatment retain numeric meaning",
		"charts.mix category drilldown carries treatment and category filters",
	],
	"src/components/charts/category-spending-mix.tsx#chart.values": [
		"charts.summary income, refunds and exclusions reconcile across metrics and category mix",
		"charts.refund net refund, long category name and excluded treatment retain numeric meaning",
		"charts.mix category drilldown carries treatment and category filters",
	],
	"src/components/charts/category-movers.tsx#export.default.behaviour": [
		"charts.movers category change title and drilldown reconcile with previous month",
		"charts.empty no history gives zero metrics and useful chart explanations",
	],
	"src/components/charts/category-movers.tsx#chart.values": [
		"charts.movers category change title and drilldown reconcile with previous month",
		"charts.empty no history gives zero metrics and useful chart explanations",
	],
	"src/components/charts/monthly-budget-usage.tsx#export.default.behaviour": [
		"charts.budgets null amount and zero plan remain distinct when scope changes",
		"charts.dense zero and null plan rows never display invalid percentages",
	],
	"src/components/charts/monthly-budget-usage.tsx#chart.values": [
		"charts.budgets null amount and zero plan remain distinct when scope changes",
		"charts.dense zero and null plan rows never display invalid percentages",
	],
	"src/components/charts/spending-calendar.tsx#export.default.behaviour": [
		"charts.calendar daily amount, zero and refund days drill into exact Records",
		"charts.calendar February 2024 has exactly 29 valid dates",
		"charts.calendar February 2025 has exactly 28 valid dates",
	],
	"src/components/charts/spending-calendar.tsx#chart.values": [
		"charts.calendar daily amount, zero and refund days drill into exact Records",
		"charts.calendar February 2024 has exactly 29 valid dates",
		"charts.calendar February 2025 has exactly 28 valid dates",
	],
	"src/components/charts/sparkline.tsx#export.default.behaviour": [
		"charts.value-swap month change updates metrics and accessible sparkline period",
	],
	"src/components/metric.tsx#export.Metric.behaviour": [
		"charts.summary income, refunds and exclusions reconcile across metrics and category mix",
		"charts.empty no history gives zero metrics and useful chart explanations",
	],
	"src/components/metric.tsx#export.MetricGrid.behaviour": [
		"charts.summary income, refunds and exclusions reconcile across metrics and category mix",
		"charts.empty no history gives zero metrics and useful chart explanations",
	],
	"src/components/metric.tsx#display.values": [
		"charts.summary income, refunds and exclusions reconcile across metrics and category mix",
		"charts.empty no history gives zero metrics and useful chart explanations",
	],
	"src/components/value-swap.tsx#export.default.behaviour": [
		"charts.value-swap month change updates metrics and accessible sparkline period",
		"display.summary long and missing values fit each viewport and changing values settle after keyboard action",
	],
	"src/components/value-swap.tsx#display.values": [
		"charts.value-swap month change updates metrics and accessible sparkline period",
		"display.summary long and missing values fit each viewport and changing values settle after keyboard action",
	],
	"src/components/record-amount.tsx#export.default.behaviour": [
		"detail.record zero renders amount, category, treatment and allocations",
		"detail.record partialPending renders amount, category, treatment and allocations",
	],
	"src/components/record-amount.tsx#display.values": [
		"detail.record zero renders amount, category, treatment and allocations",
		"detail.record partialPending renders amount, category, treatment and allocations",
	],
	"src/components/detail-summary.tsx#export.DetailSummary.behaviour": [
		"detail.record zero renders amount, category, treatment and allocations",
		"detail.record nulls renders amount, category, treatment and allocations",
	],
	"src/components/detail-summary.tsx#export.DetailSummaryItem.behaviour": [
		"detail.record zero renders amount, category, treatment and allocations",
		"detail.record nulls renders amount, category, treatment and allocations",
	],
	"src/components/detail-summary.tsx#display.values": [
		"detail.record zero renders amount, category, treatment and allocations",
		"detail.record nulls renders amount, category, treatment and allocations",
		"display.summary long and missing values fit each viewport and changing values settle after keyboard action",
	],
	"src/components/monthly-budget-badge.tsx#export.default.behaviour": [
		"detail.record nulls renders amount, category, treatment and allocations",
		"detail.record salaryIncome renders amount, category, treatment and allocations",
		"display.amount and badge optional states preserve signs pending values and colour fallback",
	],
	"src/components/monthly-budget-badge.tsx#display.values": [
		"detail.record nulls renders amount, category, treatment and allocations",
		"detail.record salaryIncome renders amount, category, treatment and allocations",
		"display.amount and badge optional states preserve signs pending values and colour fallback",
	],
	"src/components/monthly-budget-badge.tsx#monthly-budget.archived": [
		"data.archived historical assignment retains its badge, total and disabled editor option",
		"data.archiving Monthly Budget editor persists archival without erasing historical assignment",
		"display.amount and badge optional states preserve signs pending values and colour fallback",
		"UI-FACET-ANALYTICS",
	],
	"src/components/allocate-bar.tsx#export.default.behaviour": [
		"allocate-bar shows not, partial, and fully allocated states finitely",
		"display.allocation zero negative full excess and opposite signs remain finite and bounded",
	],
	"src/components/allocate-bar.tsx#display.values": [
		"allocate-bar shows not, partial, and fully allocated states finitely",
		"display.allocation zero negative full excess and opposite signs remain finite and bounded",
	],
	"src/components/selection-bar.tsx#export.default.behaviour": [
		"record-search sheet allocates selected statements to a pending record",
	],
	"src/components/selection-bar.tsx#display.interaction": [
		"record-search sheet allocates selected statements to a pending record",
	],
	"src/components/sheets/record-search.tsx#export.default.behaviour": [
		"record search sheet: query miss and hit, attach persists, Escape/reopen",
	],
	"src/components/sheets/record-search.tsx#display.interaction": [
		"record search sheet: query miss and hit, attach persists, Escape/reopen",
	],
	"src/components/sheets/statement-search.tsx#export.default.behaviour": [
		"statement search sheet: filter, allocate, Done returns to editor, unsaved allocation cancelled",
	],
	"src/components/sheets/statement-search.tsx#display.interaction": [
		"statement search sheet: filter, allocate, Done returns to editor, unsaved allocation cancelled",
	],
	"src/components/sheets/pending-statement-confirmation.tsx#export.default.behaviour": [
		"pending confirmation sheet and replacement review: selected descriptions, cancel restores sheet",
	],
	"src/components/sheets/pending-statement-confirmation.tsx#display.interaction": [
		"pending confirmation sheet and replacement review: selected descriptions, cancel restores sheet",
	],
	"src/components/table/amount-filter.tsx#export.default.behaviour": [
		"table.amount-control paid zero is applied through the UI",
	],
	"src/components/table/amount-filter.tsx#table.interaction": [
		"table.amount-control paid zero is applied through the UI",
	],
	"src/components/table/category-filter.tsx#export.default.behaviour": [
		"table.filters category selection narrows records and survives reload",
	],
	"src/components/table/category-filter.tsx#table.interaction": [
		"table.filters category selection narrows records and survives reload",
	],
	"src/components/table/filter-bar.tsx#export.ClearFiltersButton.behaviour": [
		"table.filters category selection narrows records and survives reload",
	],
	"src/components/table/filter-bar.tsx#export.FilterBar.behaviour": [
		"table.filters category selection narrows records and survives reload",
	],
	"src/components/table/filter-bar.tsx#table.interaction": [
		"table.filters category selection narrows records and survives reload",
	],
	"src/components/table/paginated-data-table.tsx#export.default.behaviour": [
		"table.pagination record keeps search in the URL and moves between pages",
	],
	"src/components/table/paginated-data-table.tsx#table.interaction": [
		"table.pagination record keeps search in the URL and moves between pages",
	],
	"src/components/table/paginated-data-table.tsx#table.motion": [
		"table.pagination record keeps search in the URL and moves between pages",
		"table.pagination statement keeps search in the URL and moves between pages",
		"table.paging-motion /records new page fades without restarting the rise",
		"table.paging-motion /statements new page fades without restarting the rise",
		"motion.consumer Records animates every visible item in the actual viewport",
		"motion.consumer Statements animates every visible item in the actual viewport",
	],
	"src/components/table/pagination-footer.tsx#export.default.behaviour": [
		"table.pagination record keeps search in the URL and moves between pages",
	],
	"src/components/table/pagination-footer.tsx#table.interaction": [
		"table.pagination record keeps search in the URL and moves between pages",
	],
	"src/components/table/pagination-header.tsx#export.default.behaviour": [
		"table.pagination record keeps search in the URL and moves between pages",
	],
	"src/components/table/pagination-header.tsx#table.rows": [
		"table.pagination record keeps search in the URL and moves between pages",
	],
	"src/components/table/data-table.tsx#export.default.behaviour": [
		"table.groups same-day subtotal includes positive and negative Records",
	],
	"src/components/table/data-table.tsx#table.rows": [
		"table.groups same-day subtotal includes positive and negative Records",
	],
	"src/components/table/data-table.tsx#table.interaction": [
		"detaching a budget Record preserves the remaining row without replaying its entrance",
		"table.pagination record keeps search in the URL and moves between pages",
		"table.pagination statement keeps search in the URL and moves between pages",
		"table.filters category selection narrows records and survives reload",
	],
	"src/components/table/data-table.tsx#table.motion": [
		"motion.consumer Records animates every visible item in the actual viewport",
		"motion.consumer Statements animates every visible item in the actual viewport",
		"table.refilter /records settled results reveal a different nonempty set",
		"table.refilter /statements settled results reveal a different nonempty set",
		"table.paging-motion /records new page fades without restarting the rise",
		"table.paging-motion /statements new page fades without restarting the rise",
		"detaching a budget Record preserves the remaining row without replaying its entrance",
		"route.selection multiple selections retain values after cancelling keyboard creation",
	],
	"src/components/table/row-groups.tsx#export.GroupHeaderRow.behaviour": [
		"table.groups same-day subtotal includes positive and negative Records",
	],
	"src/components/table/row-groups.tsx#export.MobileGroupHeader.behaviour": [
		"table.groups same-day subtotal includes positive and negative Records",
	],
	"src/components/table/row-groups.tsx#export.MobileRow.behaviour": [
		"table.groups same-day subtotal includes positive and negative Records",
	],
	"src/components/table/row-groups.tsx#table.rows": [
		"table.groups same-day subtotal includes positive and negative Records",
	],
	"src/components/table/row-groups.tsx#table.motion": [
		"motion.consumer Records animates every visible item in the actual viewport",
		"motion.consumer Monthly Records animates every visible item in the actual viewport",
		"table.refilter /records settled results reveal a different nonempty set",
	],
	"src/components/table/record-columns.tsx#export.RecordAmountCell.behaviour": [
		"UI-GAP-RECORD-CELLS",
	],
	"src/components/table/record-columns.tsx#table.rows": [
		"UI-GAP-RECORD-CELLS",
		"UI-FACET-RECORD-LONG",
	],
	"src/components/table/record-columns.tsx#table.interaction": [
		"table.pagination record keeps search in the URL and moves between pages",
		"table.filters category selection narrows records and survives reload",
		"a multifilter Unicode origin returns exactly after reload",
		"UI-FACET-RECORD-LONG",
	],
	"src/components/table/record-columns.tsx#table.motion": [
		"motion.consumer Records animates every visible item in the actual viewport",
		"motion.consumer Monthly Records animates every visible item in the actual viewport",
		"motion.consumer Budget Records animates its initially visible related rows",
		"table.refilter /records settled results reveal a different nonempty set",
		"detaching a budget Record preserves the remaining row without replaying its entrance",
	],
	"src/components/ui/button.tsx#export.Button.behaviour": [
		"enabled buttons count clicks, work from keyboard and show pointer cursor",
		"disabled button stays disabled and ignores programmatic clicks",
	],
	"src/components/ui/button.tsx#primitive.consumer": [
		"enabled buttons count clicks, work from keyboard and show pointer cursor",
		"disabled button stays disabled and ignores programmatic clicks",
	],
	"src/components/ui/button-group.tsx#export.ButtonGroup.behaviour": [
		"button group exposes a group role with separator and label",
	],
	"src/components/ui/button-group.tsx#export.ButtonGroupText.behaviour": [
		"button group exposes a group role with separator and label",
	],
	"src/components/ui/button-group.tsx#primitive.consumer": [
		"button group exposes a group role with separator and label",
		"button group separator orientation and pointer cursors",
		"UI-FACET-PRIMITIVE-GEOMETRY",
	],
	"src/components/ui/checkbox.tsx#export.Checkbox.behaviour": [
		"checkbox toggles by label and Space; disabled stays off",
	],
	"src/components/ui/checkbox.tsx#primitive.consumer": [
		"checkbox toggles by label and Space; disabled stays off",
	],
	"src/components/ui/toggle-group.tsx#export.ToggleGroup.behaviour": [
		"toggle group selects a value; disabled item stays disabled",
	],
	"src/components/ui/toggle-group.tsx#export.ToggleGroupItem.behaviour": [
		"toggle group selects a value; disabled item stays disabled",
	],
	"src/components/ui/toggle-group.tsx#primitive.consumer": [
		"toggle group selects a value; disabled item stays disabled",
		"toggle activates from the keyboard and keeps the disabled item unselected",
	],
	"src/components/ui/calendar.tsx#export.Calendar.behaviour": [
		"calendar selects a day and navigates months",
	],
	"src/components/ui/calendar.tsx#export.CalendarDayButton.behaviour": [
		"calendar selects a day and navigates months",
	],
	"src/components/ui/calendar.tsx#primitive.consumer": [
		"calendar selects a day and navigates months",
		"calendar arrow keys move focus and Home/End jump",
	],
	"src/components/ui/monthpicker.tsx#export.MonthPicker.behaviour": [
		"month picker selects a month; bounded picker disables out-of-range months",
	],
	"src/components/ui/monthpicker.tsx#primitive.consumer": [
		"month picker selects a month; bounded picker disables out-of-range months",
	],
	"src/components/ui/command.tsx#export.Command.behaviour": [
		"command filters, selects and reports an empty state",
		"command highlights an item from the keyboard",
	],
	"src/components/ui/command.tsx#export.CommandInput.behaviour": [
		"command filters, selects and reports an empty state",
		"command highlights an item from the keyboard",
	],
	"src/components/ui/command.tsx#export.CommandList.behaviour": [
		"command filters, selects and reports an empty state",
		"command highlights an item from the keyboard",
	],
	"src/components/ui/command.tsx#export.CommandGroup.behaviour": [
		"command filters, selects and reports an empty state",
		"command highlights an item from the keyboard",
	],
	"src/components/ui/command.tsx#export.CommandItem.behaviour": [
		"command filters, selects and reports an empty state",
		"command highlights an item from the keyboard",
	],
	"src/components/ui/command.tsx#export.CommandEmpty.behaviour": [
		"command filters, selects and reports an empty state",
		"command highlights an item from the keyboard",
	],
	"src/components/ui/command.tsx#primitive.consumer": [
		"command filters, selects and reports an empty state",
		"command highlights an item from the keyboard",
	],
	"src/components/ui/command.tsx#export.CommandDialog.behaviour": [
		"command dialog opens and closes from an item",
	],
	"src/components/ui/tooltip.tsx#export.Tooltip.behaviour": [
		"tooltip appears on hover and on focus",
	],
	"src/components/ui/tooltip.tsx#export.TooltipProvider.behaviour": [
		"tooltip appears on hover and on focus",
	],
	"src/components/ui/tooltip.tsx#export.TooltipTrigger.behaviour": [
		"tooltip appears on hover and on focus",
	],
	"src/components/ui/tooltip.tsx#export.TooltipContent.behaviour": [
		"tooltip appears on hover and on focus",
	],
	"src/components/ui/tooltip.tsx#primitive.consumer": ["tooltip appears on hover and on focus"],
	"src/components/ui/popover.tsx#export.Popover.behaviour": [
		"popover opens, keeps page overflow intact and closes on Escape",
	],
	"src/components/ui/popover.tsx#export.PopoverTrigger.behaviour": [
		"popover opens, keeps page overflow intact and closes on Escape",
	],
	"src/components/ui/popover.tsx#export.PopoverContent.behaviour": [
		"popover opens, keeps page overflow intact and closes on Escape",
	],
	"src/components/ui/popover.tsx#export.PopoverHeader.behaviour": [
		"popover opens, keeps page overflow intact and closes on Escape",
	],
	"src/components/ui/popover.tsx#export.PopoverTitle.behaviour": [
		"popover opens, keeps page overflow intact and closes on Escape",
	],
	"src/components/ui/popover.tsx#primitive.consumer": [
		"popover opens, keeps page overflow intact and closes on Escape",
		"popover exposes its description copy",
	],
	"src/components/ui/select.tsx#export.Select.behaviour": [
		"select primitive picks a value and marks disabled items",
		"select opens and closes from the keyboard",
	],
	"src/components/ui/select.tsx#export.SelectTrigger.behaviour": [
		"select primitive picks a value and marks disabled items",
		"select opens and closes from the keyboard",
	],
	"src/components/ui/select.tsx#export.SelectContent.behaviour": [
		"select primitive picks a value and marks disabled items",
		"select opens and closes from the keyboard",
	],
	"src/components/ui/select.tsx#export.SelectItem.behaviour": [
		"select primitive picks a value and marks disabled items",
		"select opens and closes from the keyboard",
	],
	"src/components/ui/select.tsx#export.SelectValue.behaviour": [
		"select primitive picks a value and marks disabled items",
		"select opens and closes from the keyboard",
	],
	"src/components/ui/select.tsx#primitive.consumer": [
		"select primitive picks a value and marks disabled items",
		"select opens and closes from the keyboard",
	],
	"src/components/ui/combobox.tsx#export.Combobox.behaviour": [
		"combobox field filters, picks, clears and shows empty text",
		"combobox primitive filters, selects and clears",
	],
	"src/components/ui/combobox.tsx#export.ComboboxInput.behaviour": [
		"combobox field filters, picks, clears and shows empty text",
		"combobox primitive filters, selects and clears",
	],
	"src/components/ui/combobox.tsx#export.ComboboxContent.behaviour": [
		"combobox field filters, picks, clears and shows empty text",
		"combobox primitive filters, selects and clears",
	],
	"src/components/ui/combobox.tsx#export.ComboboxList.behaviour": [
		"combobox field filters, picks, clears and shows empty text",
		"combobox primitive filters, selects and clears",
	],
	"src/components/ui/combobox.tsx#export.ComboboxItem.behaviour": [
		"combobox field filters, picks, clears and shows empty text",
		"combobox primitive filters, selects and clears",
	],
	"src/components/ui/combobox.tsx#export.ComboboxEmpty.behaviour": [
		"combobox field filters, picks, clears and shows empty text",
		"combobox primitive filters, selects and clears",
	],
	"src/components/ui/combobox.tsx#primitive.consumer": [
		"combobox field filters, picks, clears and shows empty text",
		"combobox primitive filters, selects and clears",
	],
	"src/components/ui/combobox.tsx#export.ComboboxCollection.behaviour": [
		"combobox collection renders the filtered items",
	],
	"src/components/ui/combobox.tsx#export.ComboboxChips.behaviour": [
		"multi combobox chips accumulate picks",
	],
	"src/components/ui/combobox.tsx#export.ComboboxChipsInput.behaviour": [
		"multi combobox chips accumulate picks",
	],
	"src/components/ui/combobox.tsx#export.ComboboxChip.behaviour": [
		"multi combobox chips accumulate picks",
	],
	"src/components/ui/dropdown-menu.tsx#export.DropdownMenu.behaviour": [
		"items, checkbox, radio and sub-menu all act on state",
		"dropdown keeps the page scrollable and supports keyboard selection after reopening",
	],
	"src/components/ui/dropdown-menu.tsx#export.DropdownMenuTrigger.behaviour": [
		"items, checkbox, radio and sub-menu all act on state",
		"dropdown keeps the page scrollable and supports keyboard selection after reopening",
	],
	"src/components/ui/dropdown-menu.tsx#export.DropdownMenuContent.behaviour": [
		"items, checkbox, radio and sub-menu all act on state",
		"dropdown keeps the page scrollable and supports keyboard selection after reopening",
	],
	"src/components/ui/dropdown-menu.tsx#export.DropdownMenuPortal.behaviour": [
		"items, checkbox, radio and sub-menu all act on state",
		"dropdown keeps the page scrollable and supports keyboard selection after reopening",
	],
	"src/components/ui/dropdown-menu.tsx#export.DropdownMenuItem.behaviour": [
		"items, checkbox, radio and sub-menu all act on state",
		"dropdown keeps the page scrollable and supports keyboard selection after reopening",
	],
	"src/components/ui/dropdown-menu.tsx#export.DropdownMenuCheckboxItem.behaviour": [
		"items, checkbox, radio and sub-menu all act on state",
		"dropdown keeps the page scrollable and supports keyboard selection after reopening",
	],
	"src/components/ui/dropdown-menu.tsx#export.DropdownMenuRadioGroup.behaviour": [
		"items, checkbox, radio and sub-menu all act on state",
		"dropdown keeps the page scrollable and supports keyboard selection after reopening",
	],
	"src/components/ui/dropdown-menu.tsx#export.DropdownMenuRadioItem.behaviour": [
		"items, checkbox, radio and sub-menu all act on state",
		"dropdown keeps the page scrollable and supports keyboard selection after reopening",
	],
	"src/components/ui/dropdown-menu.tsx#export.DropdownMenuSub.behaviour": [
		"items, checkbox, radio and sub-menu all act on state",
		"dropdown keeps the page scrollable and supports keyboard selection after reopening",
	],
	"src/components/ui/dropdown-menu.tsx#export.DropdownMenuSubContent.behaviour": [
		"items, checkbox, radio and sub-menu all act on state",
		"dropdown keeps the page scrollable and supports keyboard selection after reopening",
	],
	"src/components/ui/dropdown-menu.tsx#export.DropdownMenuSubTrigger.behaviour": [
		"items, checkbox, radio and sub-menu all act on state",
		"dropdown keeps the page scrollable and supports keyboard selection after reopening",
	],
	"src/components/ui/dropdown-menu.tsx#dormant.behaviour": [
		"items, checkbox, radio and sub-menu all act on state",
		"dropdown keeps the page scrollable and supports keyboard selection after reopening",
		"UI-FACET-DROPDOWN-STRUCTURE",
	],
	"src/components/ui/dialog.tsx#export.Dialog.behaviour": [
		"UI-GAP-MODAL-dialog",
		"Harness dialog: backdrop, keyboard focus containment and restoration",
	],
	"src/components/ui/dialog.tsx#export.DialogTrigger.behaviour": [
		"UI-GAP-MODAL-dialog",
		"Harness dialog: backdrop, keyboard focus containment and restoration",
	],
	"src/components/ui/dialog.tsx#export.DialogContent.behaviour": [
		"UI-GAP-MODAL-dialog",
		"Harness dialog: backdrop, keyboard focus containment and restoration",
	],
	"src/components/ui/dialog.tsx#export.DialogTitle.behaviour": [
		"UI-GAP-MODAL-dialog",
		"Harness dialog: backdrop, keyboard focus containment and restoration",
	],
	"src/components/ui/dialog.tsx#export.DialogDescription.behaviour": [
		"UI-GAP-MODAL-dialog",
		"Harness dialog: backdrop, keyboard focus containment and restoration",
	],
	"src/components/ui/dialog.tsx#export.DialogHeader.behaviour": [
		"UI-GAP-MODAL-dialog",
		"Harness dialog: backdrop, keyboard focus containment and restoration",
	],
	"src/components/ui/dialog.tsx#export.DialogFooter.behaviour": [
		"UI-GAP-MODAL-dialog",
		"Harness dialog: backdrop, keyboard focus containment and restoration",
	],
	"src/components/ui/dialog.tsx#export.DialogClose.behaviour": [
		"UI-GAP-MODAL-dialog",
		"Harness dialog: backdrop, keyboard focus containment and restoration",
	],
	"src/components/ui/dialog.tsx#export.DialogPortal.behaviour": [
		"UI-GAP-MODAL-dialog",
		"Harness dialog: backdrop, keyboard focus containment and restoration",
	],
	"src/components/ui/dialog.tsx#export.DialogOverlay.behaviour": [
		"Harness dialog: backdrop, keyboard focus containment and restoration",
		"dialog opens with backdrop and closes on Escape with scroll restored",
	],
	"src/components/ui/dialog.tsx#primitive.consumer": [
		"UI-GAP-MODAL-dialog",
		"Harness dialog: backdrop, keyboard focus containment and restoration",
	],
	"src/components/ui/sheet.tsx#export.Sheet.behaviour": [
		"UI-GAP-MODAL-sheet",
		"Harness sheet: backdrop, keyboard focus containment and restoration",
	],
	"src/components/ui/sheet.tsx#export.SheetTrigger.behaviour": [
		"UI-GAP-MODAL-sheet",
		"Harness sheet: backdrop, keyboard focus containment and restoration",
	],
	"src/components/ui/sheet.tsx#export.SheetContent.behaviour": [
		"UI-GAP-MODAL-sheet",
		"Harness sheet: backdrop, keyboard focus containment and restoration",
	],
	"src/components/ui/sheet.tsx#export.SheetTitle.behaviour": [
		"UI-GAP-MODAL-sheet",
		"Harness sheet: backdrop, keyboard focus containment and restoration",
	],
	"src/components/ui/sheet.tsx#export.SheetDescription.behaviour": [
		"UI-GAP-MODAL-sheet",
		"Harness sheet: backdrop, keyboard focus containment and restoration",
	],
	"src/components/ui/sheet.tsx#export.SheetHeader.behaviour": [
		"UI-GAP-MODAL-sheet",
		"Harness sheet: backdrop, keyboard focus containment and restoration",
	],
	"src/components/ui/sheet.tsx#export.SheetFooter.behaviour": [
		"UI-GAP-MODAL-sheet",
		"Harness sheet: backdrop, keyboard focus containment and restoration",
	],
	"src/components/ui/sheet.tsx#export.SheetClose.behaviour": [
		"UI-GAP-MODAL-sheet",
		"Harness sheet: backdrop, keyboard focus containment and restoration",
	],
	"src/components/ui/sheet.tsx#primitive.consumer": [
		"UI-GAP-MODAL-sheet",
		"Harness sheet: backdrop, keyboard focus containment and restoration",
	],
	"src/components/ui/alert-dialog.tsx#export.AlertDialog.behaviour": [
		"UI-GAP-MODAL-alert",
		"alert dialog confirms and cancels with a visible backdrop",
	],
	"src/components/ui/alert-dialog.tsx#export.AlertDialogTrigger.behaviour": [
		"UI-GAP-MODAL-alert",
		"alert dialog confirms and cancels with a visible backdrop",
	],
	"src/components/ui/alert-dialog.tsx#export.AlertDialogContent.behaviour": [
		"UI-GAP-MODAL-alert",
		"alert dialog confirms and cancels with a visible backdrop",
	],
	"src/components/ui/alert-dialog.tsx#export.AlertDialogTitle.behaviour": [
		"UI-GAP-MODAL-alert",
		"alert dialog confirms and cancels with a visible backdrop",
	],
	"src/components/ui/alert-dialog.tsx#export.AlertDialogDescription.behaviour": [
		"UI-GAP-MODAL-alert",
		"alert dialog confirms and cancels with a visible backdrop",
	],
	"src/components/ui/alert-dialog.tsx#export.AlertDialogHeader.behaviour": [
		"UI-GAP-MODAL-alert",
		"alert dialog confirms and cancels with a visible backdrop",
	],
	"src/components/ui/alert-dialog.tsx#export.AlertDialogFooter.behaviour": [
		"UI-GAP-MODAL-alert",
		"alert dialog confirms and cancels with a visible backdrop",
	],
	"src/components/ui/alert-dialog.tsx#export.AlertDialogAction.behaviour": [
		"UI-GAP-MODAL-alert",
		"alert dialog confirms and cancels with a visible backdrop",
	],
	"src/components/ui/alert-dialog.tsx#export.AlertDialogCancel.behaviour": [
		"UI-GAP-MODAL-alert",
		"alert dialog confirms and cancels with a visible backdrop",
	],
	"src/components/ui/alert-dialog.tsx#export.AlertDialogPortal.behaviour": [
		"UI-GAP-MODAL-alert",
		"alert dialog confirms and cancels with a visible backdrop",
	],
	"src/components/ui/alert-dialog.tsx#export.AlertDialogOverlay.behaviour": [
		"Delete workspace?: backdrop, keyboard focus containment and restoration",
		"alert dialog confirms and cancels with a visible backdrop",
	],
	"src/components/ui/alert-dialog.tsx#primitive.consumer": [
		"UI-GAP-MODAL-alert",
		"alert dialog confirms and cancels with a visible backdrop",
	],
	"src/components/ui/item.tsx#export.Item.behaviour": ["UI-GAP-ITEM"],
	"src/components/ui/item.tsx#export.ItemGroup.behaviour": ["UI-GAP-ITEM"],
	"src/components/ui/item.tsx#export.ItemHeader.behaviour": ["UI-GAP-ITEM"],
	"src/components/ui/item.tsx#export.ItemTitle.behaviour": ["UI-GAP-ITEM"],
	"src/components/ui/item.tsx#export.ItemDescription.behaviour": ["UI-GAP-ITEM"],
	"src/components/ui/item.tsx#export.ItemFooter.behaviour": ["UI-GAP-ITEM"],
	"src/components/ui/item.tsx#export.ItemMedia.behaviour": ["UI-GAP-ITEM"],
	"src/components/ui/item.tsx#export.ItemContent.behaviour": ["UI-GAP-ITEM"],
	"src/components/ui/item.tsx#export.ItemActions.behaviour": ["UI-GAP-ITEM"],
	"src/components/ui/item.tsx#export.ItemSeparator.behaviour": ["UI-GAP-ITEM"],
	"src/components/ui/item.tsx#dormant.behaviour": ["UI-GAP-ITEM"],
	"src/components/ui/card.tsx#export.Card.behaviour": ["UI-GAP-CARD-EMPTY"],
	"src/components/ui/card.tsx#export.CardHeader.behaviour": ["UI-GAP-CARD-EMPTY"],
	"src/components/ui/card.tsx#export.CardTitle.behaviour": ["UI-GAP-CARD-EMPTY"],
	"src/components/ui/card.tsx#export.CardDescription.behaviour": ["UI-GAP-CARD-EMPTY"],
	"src/components/ui/card.tsx#export.CardContent.behaviour": ["UI-GAP-CARD-EMPTY"],
	"src/components/ui/card.tsx#export.CardFooter.behaviour": ["UI-GAP-CARD-EMPTY"],
	"src/components/ui/card.tsx#export.CardAction.behaviour": ["UI-GAP-CARD-EMPTY"],
	"src/components/ui/card.tsx#primitive.consumer": ["UI-GAP-CARD-EMPTY"],
	"src/components/ui/empty.tsx#export.Empty.behaviour": ["UI-GAP-CARD-EMPTY"],
	"src/components/ui/empty.tsx#export.EmptyHeader.behaviour": ["UI-GAP-CARD-EMPTY"],
	"src/components/ui/empty.tsx#export.EmptyTitle.behaviour": ["UI-GAP-CARD-EMPTY"],
	"src/components/ui/empty.tsx#export.EmptyDescription.behaviour": ["UI-GAP-CARD-EMPTY"],
	"src/components/ui/empty.tsx#export.EmptyContent.behaviour": ["UI-GAP-CARD-EMPTY"],
	"src/components/ui/empty.tsx#export.EmptyMedia.behaviour": ["UI-GAP-CARD-EMPTY"],
	"src/components/ui/empty.tsx#primitive.consumer": ["UI-GAP-CARD-EMPTY"],
	"src/components/ui/table.tsx#export.Table.behaviour": ["UI-GAP-TABLE"],
	"src/components/ui/table.tsx#export.TableHeader.behaviour": ["UI-GAP-TABLE"],
	"src/components/ui/table.tsx#export.TableBody.behaviour": ["UI-GAP-TABLE"],
	"src/components/ui/table.tsx#export.TableHead.behaviour": ["UI-GAP-TABLE"],
	"src/components/ui/table.tsx#export.TableRow.behaviour": ["UI-GAP-TABLE"],
	"src/components/ui/table.tsx#export.TableCell.behaviour": ["UI-GAP-TABLE"],
	"src/components/ui/table.tsx#export.TableCaption.behaviour": ["UI-GAP-TABLE"],
	"src/components/ui/table.tsx#export.TableFooter.behaviour": ["UI-GAP-TABLE"],
	"src/components/ui/table.tsx#primitive.consumer": ["UI-GAP-TABLE"],
	"src/components/ui/field.tsx#export.Field.behaviour": ["UI-GAP-FIELD"],
	"src/components/ui/field.tsx#export.FieldGroup.behaviour": ["UI-GAP-FIELD"],
	"src/components/ui/field.tsx#export.FieldLabel.behaviour": ["UI-GAP-FIELD"],
	"src/components/ui/field.tsx#export.FieldError.behaviour": ["UI-GAP-FIELD"],
	"src/components/ui/field.tsx#export.FieldDescription.behaviour": ["UI-GAP-FIELD"],
	"src/components/ui/field.tsx#export.FieldContent.behaviour": ["UI-GAP-FIELD"],
	"src/components/ui/field.tsx#export.FieldTitle.behaviour": ["UI-GAP-FIELD"],
	"src/components/ui/field.tsx#export.FieldSet.behaviour": ["UI-GAP-FIELD"],
	"src/components/ui/field.tsx#export.FieldLegend.behaviour": ["UI-GAP-FIELD"],
	"src/components/ui/field.tsx#export.FieldSeparator.behaviour": ["UI-GAP-FIELD"],
	"src/components/ui/field.tsx#primitive.consumer": ["UI-GAP-FIELD"],
	"src/components/ui/input-group.tsx#export.InputGroup.behaviour": [
		"input group types, clears and shows addon content",
	],
	"src/components/ui/input-group.tsx#export.InputGroupInput.behaviour": [
		"input group types, clears and shows addon content",
	],
	"src/components/ui/input-group.tsx#export.InputGroupButton.behaviour": [
		"input group types, clears and shows addon content",
	],
	"src/components/ui/input-group.tsx#export.InputGroupAddon.behaviour": [
		"input group types, clears and shows addon content",
	],
	"src/components/ui/input-group.tsx#export.InputGroupText.behaviour": [
		"input group types, clears and shows addon content",
	],
	"src/components/ui/input-group.tsx#export.InputGroupTextarea.behaviour": [
		"input group types, clears and shows addon content",
		"UI-FACET-INPUT-GROUP",
	],
	"src/components/ui/input-group.tsx#primitive.consumer": [
		"input group types, clears and shows addon content",
		"UI-FACET-INPUT-GROUP",
	],
	"src/components/ui/input.tsx#export.Input.behaviour": [
		"label focuses its control and mirrors textarea state",
	],
	"src/components/ui/input.tsx#primitive.consumer": [
		"label focuses its control and mirrors textarea state",
	],
	"src/components/ui/textarea.tsx#export.Textarea.behaviour": [
		"label focuses its control and mirrors textarea state",
	],
	"src/components/ui/textarea.tsx#primitive.consumer": [
		"label focuses its control and mirrors textarea state",
	],
	"src/components/ui/label.tsx#export.Label.behaviour": [
		"checkbox toggles by label and Space; disabled stays off",
	],
	"src/components/ui/label.tsx#primitive.consumer": [
		"checkbox toggles by label and Space; disabled stays off",
	],
	"src/components/ui/badge.tsx#export.Badge.behaviour": [
		"badge, card and empty render their content",
		"UI-FACET-BADGE",
	],
	"src/components/ui/badge.tsx#primitive.consumer": [
		"badge, card and empty render their content",
		"UI-FACET-BADGE",
	],
	"src/components/ui/progress.tsx#export.Progress.behaviour": [
		"progress clamps its base bar and flags only values above 100",
	],
	"src/components/ui/progress.tsx#primitive.consumer": [
		"progress clamps its base bar and flags only values above 100",
	],
	"src/components/ui/scroll-area.tsx#export.ScrollArea.behaviour": [
		"scroll area scrolls its viewport",
	],
	"src/components/ui/scroll-area.tsx#primitive.consumer": [
		"scroll area scrolls its viewport",
		"scroll area exposes scrollbar and thumb while scrolling",
		"UI-FACET-PRIMITIVE-GEOMETRY",
	],
	"src/components/ui/pagination.tsx#export.Pagination.behaviour": [
		"pagination marks the active page and labels navigation",
	],
	"src/components/ui/pagination.tsx#export.PaginationLink.behaviour": [
		"pagination marks the active page and labels navigation",
	],
	"src/components/ui/pagination.tsx#export.PaginationPrevious.behaviour": [
		"pagination marks the active page and labels navigation",
	],
	"src/components/ui/pagination.tsx#export.PaginationNext.behaviour": [
		"pagination marks the active page and labels navigation",
	],
	"src/components/ui/pagination.tsx#primitive.consumer": [
		"pagination marks the active page and labels navigation",
	],
	"src/components/ui/pagination.tsx#export.PaginationContent.behaviour": [
		"table.pagination record keeps search in the URL and moves between pages",
	],
	"src/components/ui/pagination.tsx#export.PaginationItem.behaviour": [
		"table.pagination record keeps search in the URL and moves between pages",
	],
	"src/components/ui/chart.tsx#export.ChartContainer.behaviour": ["UI-GAP-CHART"],
	"src/components/ui/chart.tsx#export.ChartStyle.behaviour": ["UI-GAP-CHART"],
	"src/components/ui/chart.tsx#export.ChartLegend.behaviour": ["UI-GAP-CHART"],
	"src/components/ui/chart.tsx#export.ChartLegendContent.behaviour": ["UI-GAP-CHART"],
	"src/components/ui/chart.tsx#export.ChartTooltip.behaviour": ["UI-GAP-CHART"],
	"src/components/ui/chart.tsx#export.ChartTooltipContent.behaviour": ["UI-GAP-CHART"],
	"src/components/ui/chart.tsx#primitive.consumer": ["UI-GAP-CHART"],
	"src/components/ui/sonner.tsx#export.Toaster.behaviour": [
		"sonner shows success and error toasts",
	],
	"src/components/ui/sonner.tsx#primitive.consumer": ["sonner shows success and error toasts"],
	"src/components/ui/sidebar.tsx#export.Sidebar.behaviour": [
		"trigger collapses on desktop and sheets on mobile",
	],
	"src/components/ui/sidebar.tsx#export.SidebarProvider.behaviour": [
		"trigger collapses on desktop and sheets on mobile",
	],
	"src/components/ui/sidebar.tsx#export.SidebarTrigger.behaviour": [
		"trigger collapses on desktop and sheets on mobile",
	],
	"src/components/ui/sidebar.tsx#export.SidebarInset.behaviour": [
		"trigger collapses on desktop and sheets on mobile",
	],
	"src/components/ui/sidebar.tsx#primitive.consumer": [
		"trigger collapses on desktop and sheets on mobile",
	],
	"src/components/ui/sidebar.tsx#export.SidebarMenu.behaviour": [
		"menu and sub-menu buttons report selection",
	],
	"src/components/ui/sidebar.tsx#export.SidebarMenuItem.behaviour": [
		"menu and sub-menu buttons report selection",
	],
	"src/components/ui/sidebar.tsx#export.SidebarMenuButton.behaviour": [
		"menu and sub-menu buttons report selection",
	],
	"src/components/ui/sidebar.tsx#export.SidebarMenuSub.behaviour": [
		"menu and sub-menu buttons report selection",
	],
	"src/components/ui/sidebar.tsx#export.SidebarMenuSubItem.behaviour": [
		"menu and sub-menu buttons report selection",
	],
	"src/components/ui/sidebar.tsx#export.SidebarMenuSubButton.behaviour": [
		"menu and sub-menu buttons report selection",
	],
	"src/components/ui/sidebar.tsx#export.SidebarMenuBadge.behaviour": [
		"badge, skeleton, input, group action and menu action behave",
	],
	"src/components/ui/sidebar.tsx#export.SidebarInput.behaviour": [
		"badge, skeleton, input, group action and menu action behave",
	],
	"src/components/ui/sidebar.tsx#export.SidebarGroupAction.behaviour": [
		"badge, skeleton, input, group action and menu action behave",
	],
	"src/components/ui/sidebar.tsx#export.SidebarMenuAction.behaviour": [
		"badge, skeleton, input, group action and menu action behave",
	],
	"src/components/ui/skeleton.tsx#export.Skeleton.behaviour": [
		"badge, skeleton, input, group action and menu action behave",
		"UI-FACET-SKELETON",
	],
	"src/components/ui/skeleton.tsx#dormant.behaviour": [
		"badge, skeleton, input, group action and menu action behave",
		"UI-GAP-SKELETON",
		"UI-FACET-SKELETON",
	],
	"src/components/layout/page-header.tsx#export.default.behaviour": [
		"category drill and nested detail return to exact filtered origins",
	],
	"src/components/layout/page-header.tsx#display.interaction": [
		"category drill and nested detail return to exact filtered origins",
	],
	"src/components/layout/page-header.tsx#display.values": [
		"category drill and nested detail return to exact filtered origins",
	],
	"src/components/workflow-tabs.tsx#export.default.behaviour": ["UI-GAP-WORKFLOW"],
	"src/components/workflow-tabs.tsx#display.values": ["UI-GAP-WORKFLOW"],
	"src/components/workflow-tabs.tsx#display.interaction": ["UI-GAP-WORKFLOW"],
	"src/components/layout/app-sidebar.tsx#export.default.behaviour": [
		"sidebar and month tabs clear drill history",
		"header sidebar trigger supports keyboard toggle",
	],
	"src/components/layout/app-sidebar.tsx#display.interaction": [
		"sidebar and month tabs clear drill history",
		"header sidebar trigger supports keyboard toggle",
	],
	"app/(month)/layout.tsx#shell.consumer": [
		"monthly.shell header and tabs retain DOM identity across tab switches",
	],
	"app/template.tsx#shell.consumer": ["page fades during client navigation"],
	"app/not-found.tsx#shell.consumer": [
		"pages.not-found unmatched route offers working Records destination",
	],
	"app/privacy/page.tsx#route.navigation": [
		"ordinary static-page links preserve nested back history",
	],
	"app/terms/page.tsx#route.navigation": [
		"ordinary static-page links preserve nested back history",
	],
	"app/importer/page.tsx#route.data": [
		"importer rejects invalid files without mutation and skips duplicates",
	],
	"app/settings/page.tsx#route.data": ["settings validate, persist, and reload"],
	"app/sync/page.tsx#route.data": ["backup round-trip restores the workspace"],
	"app/allocator/duplicates/page.tsx#route.data": [
		"duplicate keep moves allocations and the deleted statement is gone",
		"route.empty /allocator/duplicates resolves without premature loading copy",
	],
	"app/allocator/pending/page.tsx#route.data": [
		"replacing pending preserves allocations on the imported statement",
		"route.empty /allocator/pending resolves without premature loading copy",
	],
	"app/statements/page.tsx#route.data": [
		"pages.empty /statements resolves to its useful empty state",
		"table.pagination statement keeps search in the URL and moves between pages",
		"data.statement cells retain pending, allocation, zero and signed amount meaning",
		"loading.local /statements stays silent while the database is opening then reveals actual data",
		"UI-FACET-STATEMENT-LONG",
		"UI-FACET-STATEMENT-GROUP",
	],
	"app/statements/[id]/page.tsx#route.data": [
		"detail.statement split allocation shows its assigned amount and confirmed account",
		"detail.statement unallocated confirmed Statement shows resolved empty Records",
		"detail.related /statements/t1-s-pending renders real related rows",
		"loading.local /statements/t1-s-pending stays silent while the database is opening then reveals actual data",
		"pages.invalid statements missing ID resolves without a loader",
		"UI-FACET-STATEMENT-LONG",
	],
	"app/budgets/page.tsx#route.data": [
		"pages.empty /budgets resolves to its useful empty state",
		"pages.directory /budgets searches populated data and clears no matches",
		"loading.local /budgets stays silent while the database is opening then reveals actual data",
	],
	"app/budgets/[id]/page.tsx#route.data": [
		"detail.budget manual and automatic membership sums reconcile",
		"detail.related /budgets/t1-b-manual renders real related rows",
		"loading.local /budgets/t1-b-manual stays silent while the database is opening then reveals actual data",
		"pages.invalid budgets missing ID resolves without a loader",
	],
	"app/accounts/page.tsx#route.data": [
		"pages.empty /accounts resolves to its useful empty state",
		"pages.directory /accounts searches populated data and clears no matches",
		"loading.local /accounts stays silent while the database is opening then reveals actual data",
	],
	"app/accounts/[id]/page.tsx#route.data": [
		"detail.related /accounts/t1-acc-dbs renders real related rows",
		"loading.local /accounts/t1-acc-dbs stays silent while the database is opening then reveals actual data",
		"pages.invalid accounts missing ID resolves without a loader",
		"UI-FACET-ACCOUNT-STATE",
	],
	"app/records/page.tsx#route.data": [
		"pages.empty /records resolves to its useful empty state",
		"table.pagination record keeps search in the URL and moves between pages",
		"table.filters category selection narrows records and survives reload",
		"table.amount zero is a real filter, paid and received ranges retain sign",
		"loading.local /records stays silent while the database is opening then reveals actual data",
		"UI-FACET-RECORD-LONG",
	],
	"app/records/[id]/page.tsx#route.data": [
		"detail.record zero renders amount, category, treatment and allocations",
		"detail.record partialPending renders amount, category, treatment and allocations",
		"detail.record nulls renders amount, category, treatment and allocations",
		"detail.record salaryIncome renders amount, category, treatment and allocations",
		"loading.local /records/t1-r-partial stays silent while the database is opening then reveals actual data",
		"pages.invalid records missing ID resolves without a loader",
		"UI-FACET-RECORD-LONG",
	],
	"app/categories/page.tsx#route.data": [
		"pages.empty /categories resolves to its useful empty state",
		"pages.directory /categories searches populated data and clears no matches",
		"loading.local /categories stays silent while the database is opening then reveals actual data",
	],
	"app/(month)/page.tsx#route.data": [
		"charts.summary income, refunds and exclusions reconcile across metrics and category mix",
		"charts.empty no history gives zero metrics and useful chart explanations",
		"charts.budgets null amount and zero plan remain distinct when scope changes",
		"charts.dense zero and null plan rows never display invalid percentages",
		"charts.calendar daily amount, zero and refund days drill into exact Records",
		"charts.movers category change title and drilldown reconcile with previous month",
	],
	"app/(month)/records/monthly/page.tsx#route.data": [
		"pages.empty /records/monthly?month=October&year=2026 resolves to its useful empty state",
		"data.archived historical assignment retains its badge, total and disabled editor option",
		"UI-FACET-MONTHLY-FUTURE",
	],
	"app/accounts/[id]/page.tsx#route.navigation": [
		"direct Accounts detail has a working fallback",
		"accounts keyboard card to detail to Back keeps exact origin",
	],
	"app/budgets/[id]/page.tsx#route.navigation": [
		"direct Budgets detail has a working fallback",
		"budgets keyboard card Enter to detail to Back keeps exact origin",
	],
	"app/records/[id]/page.tsx#route.navigation": [
		"direct Records detail has a working fallback",
		"records keyboard filtered list to detail to Back keeps exact origin",
	],
	"app/statements/[id]/page.tsx#route.navigation": [
		"direct Statements detail has a working fallback",
		"statements keyboard filtered list to detail to Back keeps exact origin",
	],
	"app/statements/page.tsx#route.navigation": [
		"statements keyboard filtered list to detail to Back keeps exact origin",
	],
	"app/budgets/page.tsx#route.navigation": [
		"budgets keyboard card Enter to detail to Back keeps exact origin",
	],
	"app/accounts/page.tsx#route.navigation": [
		"accounts keyboard card to detail to Back keeps exact origin",
	],
	"app/allocator/page.tsx#route.navigation": ["allocator keyboard selection, dialog, and clear"],
	"app/allocator/duplicates/page.tsx#route.navigation": [
		"duplicates keyboard keep, delete, review, and cancel",
	],
	"app/allocator/pending/page.tsx#route.navigation": [
		"pending keyboard queue, replace, and confirm",
	],
	"app/records/page.tsx#route.navigation": [
		"records keyboard filtered list to detail to Back keeps exact origin",
	],
	"app/categories/page.tsx#route.navigation": [
		"categories nested keyboard drill returns through exact origins",
	],
	"app/settings/page.tsx#route.navigation": ["settings keyboard save persists across reload"],
	"app/sync/page.tsx#route.navigation": ["sync keyboard clear cancelled preserves data"],
	"app/importer/page.tsx#route.navigation": [
		"importer keyboard bank select and invalid rejection",
	],
	"src/components/table/record-columns.tsx#export.PendingBadge.behaviour": [
		"UI-GAP-RECORD-CELLS",
	],
	"src/components/icon.tsx#export.UiIcon.behaviour": [
		"display.icons missing invalid prefixed and dynamic icons retain real SVG output and reserved size",
	],
	"src/components/icon.tsx#export.default.behaviour": [
		"display.icons missing invalid prefixed and dynamic icons retain real SVG output and reserved size",
	],
	"src/components/icon.tsx#display.values": [
		"display.icons missing invalid prefixed and dynamic icons retain real SVG output and reserved size",
	],
	"src/components/icons.ts#indirect.consumer": [
		"display.icons missing invalid prefixed and dynamic icons retain real SVG output and reserved size",
	],
	"src/components/layout/app-header.tsx#export.default.behaviour": [
		"header sidebar trigger supports keyboard toggle",
	],
	"src/components/layout/app-header.tsx#display.interaction": [
		"header sidebar trigger supports keyboard toggle",
	],
	"src/components/layout/app-header.tsx#display.values": [
		"route.layout / keeps populated content and enabled controls inside the viewport",
		"route.layout /records keeps populated content and enabled controls inside the viewport",
		"route.layout /statements keeps populated content and enabled controls inside the viewport",
		"route.layout /accounts keeps populated content and enabled controls inside the viewport",
		"route.layout /budgets keeps populated content and enabled controls inside the viewport",
		"route.layout /categories keeps populated content and enabled controls inside the viewport",
		"route.layout /allocator keeps populated content and enabled controls inside the viewport",
		"route.layout /allocator/pending keeps populated content and enabled controls inside the viewport",
		"route.layout /allocator/duplicates keeps populated content and enabled controls inside the viewport",
		"route.layout /importer keeps populated content and enabled controls inside the viewport",
		"route.layout /settings keeps populated content and enabled controls inside the viewport",
		"route.layout /sync keeps populated content and enabled controls inside the viewport",
		"route.layout /privacy keeps populated content and enabled controls inside the viewport",
		"route.layout /terms keeps populated content and enabled controls inside the viewport",
		"route.layout /records/monthly?month=October&year=2026 keeps populated content and enabled controls inside the viewport",
		"route.layout /accounts/t1-acc-dbs keeps populated content and enabled controls inside the viewport",
		"route.layout /budgets/t1-b-manual keeps populated content and enabled controls inside the viewport",
		"route.layout /records/t1-r-partial keeps populated content and enabled controls inside the viewport",
		"route.layout /statements/t1-s-pending keeps populated content and enabled controls inside the viewport",
	],
	"src/components/layout/page-content.tsx#export.default.behaviour": [
		"route.layout / keeps populated content and enabled controls inside the viewport",
		"route.layout /records keeps populated content and enabled controls inside the viewport",
		"route.layout /statements keeps populated content and enabled controls inside the viewport",
		"route.layout /privacy keeps populated content and enabled controls inside the viewport",
	],
	"src/components/layout/shell-header.tsx#export.default.behaviour": [
		"header sidebar trigger supports keyboard toggle",
		"route.layout /privacy keeps populated content and enabled controls inside the viewport",
	],
	"src/components/layout/shell-header.tsx#display.interaction": [
		"header sidebar trigger supports keyboard toggle",
	],
	"src/components/layout/shell-header.tsx#display.values": [
		"route.layout / keeps populated content and enabled controls inside the viewport",
		"route.layout /records keeps populated content and enabled controls inside the viewport",
		"route.layout /statements keeps populated content and enabled controls inside the viewport",
		"route.layout /accounts keeps populated content and enabled controls inside the viewport",
		"route.layout /budgets keeps populated content and enabled controls inside the viewport",
		"route.layout /categories keeps populated content and enabled controls inside the viewport",
		"route.layout /allocator keeps populated content and enabled controls inside the viewport",
		"route.layout /allocator/pending keeps populated content and enabled controls inside the viewport",
		"route.layout /allocator/duplicates keeps populated content and enabled controls inside the viewport",
		"route.layout /importer keeps populated content and enabled controls inside the viewport",
		"route.layout /settings keeps populated content and enabled controls inside the viewport",
		"route.layout /sync keeps populated content and enabled controls inside the viewport",
		"route.layout /privacy keeps populated content and enabled controls inside the viewport",
		"route.layout /terms keeps populated content and enabled controls inside the viewport",
		"route.layout /records/monthly?month=October&year=2026 keeps populated content and enabled controls inside the viewport",
		"route.layout /accounts/t1-acc-dbs keeps populated content and enabled controls inside the viewport",
		"route.layout /budgets/t1-b-manual keeps populated content and enabled controls inside the viewport",
		"route.layout /records/t1-r-partial keeps populated content and enabled controls inside the viewport",
		"route.layout /statements/t1-s-pending keeps populated content and enabled controls inside the viewport",
	],
	"src/components/layout/app-sidebar.tsx#display.values": [
		"header sidebar trigger supports keyboard toggle",
	],
	"src/components/ui/alert.tsx#export.Alert.behaviour": [
		"alerts render both variants with title, description and action",
	],
	"src/components/ui/alert.tsx#export.AlertDescription.behaviour": [
		"alerts render both variants with title, description and action",
	],
	"src/components/ui/alert.tsx#export.AlertTitle.behaviour": [
		"alerts render both variants with title, description and action",
	],
	"src/components/ui/alert.tsx#export.AlertAction.behaviour": [
		"alerts expose both variants and a pointer action",
	],
	"src/components/ui/alert.tsx#primitive.consumer": [
		"alerts render both variants with title, description and action",
		"alerts expose both variants and a pointer action",
	],
	"src/components/ui/button-group.tsx#export.ButtonGroupSeparator.behaviour": [
		"button group separator orientation and pointer cursors",
		"UI-FACET-PRIMITIVE-GEOMETRY",
	],
	"src/components/ui/combobox.tsx#export.ComboboxTrigger.behaviour": [
		"trigger opens the list and clear resets the value",
	],
	"src/components/ui/combobox.tsx#export.ComboboxGroup.behaviour": [
		"grouped combobox shows its label and separator",
	],
	"src/components/ui/combobox.tsx#export.ComboboxLabel.behaviour": [
		"grouped combobox shows its label and separator",
	],
	"src/components/ui/combobox.tsx#export.ComboboxSeparator.behaviour": [
		"grouped combobox shows its label and separator",
	],
	"src/components/ui/combobox.tsx#export.ComboboxValue.behaviour": [
		"grouped combobox shows its label and separator",
	],
	"src/components/ui/command.tsx#export.CommandSeparator.behaviour": [
		"groups, separator and shortcuts render with accessible names",
	],
	"src/components/ui/command.tsx#export.CommandShortcut.behaviour": [
		"groups, separator and shortcuts render with accessible names",
	],
	"src/components/ui/dropdown-menu.tsx#export.DropdownMenuGroup.behaviour": [
		"items, checkbox, radio and sub-menu all act on state",
	],
	"src/components/ui/dropdown-menu.tsx#export.DropdownMenuLabel.behaviour": [
		"items, checkbox, radio and sub-menu all act on state",
		"UI-FACET-DROPDOWN-STRUCTURE",
	],
	"src/components/ui/dropdown-menu.tsx#export.DropdownMenuSeparator.behaviour": [
		"items, checkbox, radio and sub-menu all act on state",
		"UI-FACET-DROPDOWN-STRUCTURE",
	],
	"src/components/ui/dropdown-menu.tsx#export.DropdownMenuShortcut.behaviour": [
		"items, checkbox, radio and sub-menu all act on state",
		"UI-FACET-DROPDOWN-STRUCTURE",
	],
	"src/components/ui/pagination.tsx#export.PaginationEllipsis.behaviour": [
		"pagination exposes its ellipsis",
	],
	"src/components/ui/popover.tsx#export.PopoverDescription.behaviour": [
		"popover exposes its description copy",
	],
	"src/components/ui/scroll-area.tsx#export.ScrollBar.behaviour": [
		"scroll area exposes scrollbar and thumb while scrolling",
		"UI-FACET-PRIMITIVE-GEOMETRY",
	],
	"src/components/ui/select.tsx#export.SelectGroup.behaviour": [
		"group label and separator render with the options",
	],
	"src/components/ui/select.tsx#export.SelectLabel.behaviour": [
		"group label and separator render with the options",
	],
	"src/components/ui/select.tsx#export.SelectSeparator.behaviour": [
		"group label and separator render with the options",
	],
	"src/components/ui/select.tsx#export.SelectScrollDownButton.behaviour": [
		"long list exposes scroll buttons and selects a far item",
	],
	"src/components/ui/select.tsx#export.SelectScrollUpButton.behaviour": [
		"long list exposes scroll buttons and selects a far item",
	],
	"src/components/ui/separator.tsx#export.Separator.behaviour": [
		"separators render in both orientations",
	],
	"src/components/ui/separator.tsx#primitive.consumer": [
		"separators render in both orientations",
	],
	"src/components/ui/sidebar.tsx#export.SidebarContent.behaviour": [
		"sidebar readonly display renders badge, footer, label and separator",
	],
	"src/components/ui/sidebar.tsx#export.SidebarFooter.behaviour": [
		"sidebar readonly display renders badge, footer, label and separator",
	],
	"src/components/ui/sidebar.tsx#export.SidebarGroup.behaviour": [
		"sidebar readonly display renders badge, footer, label and separator",
	],
	"src/components/ui/sidebar.tsx#export.SidebarGroupLabel.behaviour": [
		"sidebar readonly display renders badge, footer, label and separator",
	],
	"src/components/ui/sidebar.tsx#export.SidebarHeader.behaviour": [
		"sidebar readonly display renders badge, footer, label and separator",
	],
	"src/components/ui/sidebar.tsx#export.SidebarRail.behaviour": [
		"trigger collapses on desktop and sheets on mobile",
	],
	"src/components/ui/sidebar.tsx#export.SidebarGroupContent.behaviour": [
		"sidebar readonly display renders badge, footer, label and separator",
	],
	"src/components/ui/sidebar.tsx#export.SidebarMenuSkeleton.behaviour": [
		"badge, skeleton, input, group action and menu action behave",
	],
	"src/components/ui/sidebar.tsx#export.SidebarSeparator.behaviour": [
		"sidebar readonly display renders badge, footer, label and separator",
	],
	"src/components/allocate-bar.tsx#allocation.amount": [
		"allocate-bar shows not, partial, and fully allocated states finitely",
		"display.allocation zero negative full excess and opposite signs remain finite and bounded",
	],
	"src/components/charts/sparkline.tsx#chart.values": [
		"display.sparkline missing flat negative mixed and dense values have correct finite endpoints",
	],
	"src/components/charts/sparkline.tsx#chart.motion": [
		"display.sparkline entrance respects reduced motion and draws the final data endpoint",
		"display.sparkline polyline draws progressively then settles",
	],
	"src/components/charts/chart-intro.ts#indirect.consumer": [
		"charts.intro overview grows real graph marks once and respects reduced motion",
		"charts.intro budget grows real graph marks once and respects reduced motion",
	],
	"src/components/charts/budget-progress-chart.tsx#chart.values": [
		"charts.tooltip Spending over time keyboard navigation exposes actual numeric values",
		"charts.empty no history gives zero metrics and useful chart explanations",
	],
	"src/components/charts/cashflow-chart.tsx#chart.values": [
		"charts.tooltip Surplus / Shortfall keyboard navigation exposes actual numeric values",
		"charts.empty no history gives zero metrics and useful chart explanations",
	],
	"src/components/charts/daily-spending-chart.tsx#chart.values": [
		"charts.tooltip Spending by day keyboard navigation exposes actual numeric values",
		"charts.empty no history gives zero metrics and useful chart explanations",
	],
	"src/components/charts/total-spending-chart.tsx#chart.values": [
		"charts.tooltip Spending forecast keyboard navigation exposes actual numeric values",
		"charts.empty no history gives zero metrics and useful chart explanations",
	],
	"src/components/charts/total-spending-chart.tsx#chart.responsive": [
		"chart-edges containment: every dense card renders values and fits",
		"chart-edges tooltips stay numeric and inside every viewport",
	],
	"src/components/charts/cashflow-chart.tsx#chart.responsive": [
		"chart-edges containment: every dense card renders values and fits",
		"chart-edges tooltips stay numeric and inside every viewport",
	],
	"src/components/charts/daily-spending-chart.tsx#chart.responsive": [
		"chart-edges containment: every dense card renders values and fits",
		"chart-edges tooltips stay numeric and inside every viewport",
	],
	"src/components/charts/weekday-bars.tsx#chart.responsive": [
		"chart-edges containment: every dense card renders values and fits",
		"chart-edges tooltips stay numeric and inside every viewport",
	],
	"src/components/charts/category-history-chart.tsx#chart.responsive": [
		"chart-edges containment: every dense card renders values and fits",
		"chart-edges tooltips stay numeric and inside every viewport",
	],
	"src/components/charts/budget-progress-chart.tsx#chart.responsive": [
		"chart-edges containment: every dense card renders values and fits",
		"chart-edges tooltips stay numeric and inside every viewport",
	],
	"src/components/charts/category-spending-mix.tsx#chart.responsive": [
		"chart-edges containment: every dense card renders values and fits",
		"chart-edges dense long category name stays truncated and readable",
	],
	"src/components/charts/category-movers.tsx#chart.responsive": [
		"chart-edges containment: every dense card renders values and fits",
		"chart-edges dense long category name stays truncated and readable",
		"chart-edges calendar and movers drills work by keyboard",
	],
	"src/components/charts/category-movers.tsx#chart.motion": [
		"chart-edges movers liveRecordamount bar transitions on record update",
	],
	"src/components/charts/monthly-budget-usage.tsx#chart.responsive": [
		"chart-edges containment: every dense card renders values and fits",
		"chart-edges dense long category name stays truncated and readable",
	],
	"src/components/charts/monthly-budget-usage.tsx#chart.motion": [
		"chart-edges monthly budget donut dims siblings smoothly on focus",
	],
	"src/components/charts/spending-calendar.tsx#chart.responsive": [
		"chart-edges containment: every dense card renders values and fits",
		"chart-edges dense long category name stays truncated and readable",
		"chart-edges calendar and movers drills work by keyboard",
	],
	"src/components/charts/spending-calendar.tsx#chart.motion": [
		"chart-edges calendar heat fades in place on month change",
	],
	"src/components/charts/sparkline.tsx#chart.responsive": [
		"display.sparkline fixtures fit narrow viewports with visible strokes",
		"display.sparkline missing flat negative mixed and dense values have correct finite endpoints",
	],
	"src/components/charts/cashflow-chart.tsx#chart.motion": [
		"charts.intro overview grows real graph marks once and respects reduced motion",
	],
	"src/components/charts/total-spending-chart.tsx#chart.motion": [
		"charts.intro overview grows real graph marks once and respects reduced motion",
	],
	"src/components/charts/daily-spending-chart.tsx#chart.motion": [
		"charts.intro overview grows real graph marks once and respects reduced motion",
	],
	"src/components/charts/weekday-bars.tsx#chart.motion": [
		"charts.intro overview grows real graph marks once and respects reduced motion",
	],
	"src/components/charts/category-history-chart.tsx#chart.motion": [
		"charts.intro overview grows real graph marks once and respects reduced motion",
	],
	"src/components/charts/budget-progress-chart.tsx#chart.motion": [
		"charts.intro budget grows real graph marks once and respects reduced motion",
	],
	"src/components/selection-bar.tsx#display.values": [
		"route.selection multiple selections retain values after cancelling keyboard creation",
	],
	"src/components/selection-bar.tsx#selection.state": [
		"allocator keyboard selection, dialog, and clear",
		"selection bar disabled replace action is honestly disabled",
		"selection bar on small viewport keeps clear reachable by keyboard",
		"route.selection multiple selections retain values after cancelling keyboard creation",
	],
	"src/components/sheets/record-search.tsx#display.values": [
		"record search sheet: query miss and hit, attach persists, Escape/reopen",
	],
	"src/components/sheets/statement-search.tsx#display.values": [
		"statement search sheet: filter, allocate, Done returns to editor, unsaved allocation cancelled",
	],
	"src/components/sheets/pending-statement-confirmation.tsx#display.values": [
		"pending confirmation sheet and replacement review: selected descriptions, cancel restores sheet",
	],
	"src/components/table/statement-columns.tsx#table.interaction": [
		"table.pagination statement keeps search in the URL and moves between pages",
	],
	"src/components/table/statement-columns.tsx#table.rows": [
		"data.statement cells retain pending, allocation, zero and signed amount meaning",
		"pages.empty /statements resolves to its useful empty state",
		"UI-FACET-STATEMENT-LONG",
		"UI-FACET-STATEMENT-GROUP",
	],
	"src/components/table/statement-columns.tsx#table.motion": [
		"motion.consumer Statements animates every visible item in the actual viewport",
		"motion.consumer Allocate animates every visible item in the actual viewport",
		"table.refilter /statements settled results reveal a different nonempty set",
		"table.paging-motion /statements new page fades without restarting the rise",
	],
	"src/components/table/paginated-data-table.tsx#table.rows": [
		"table.pagination record keeps search in the URL and moves between pages",
		"table.pagination statement keeps search in the URL and moves between pages",
	],
	"src/components/dialogs/account.tsx#editor.long": [
		"account: required name, unicode rename persists after reload",
	],
	"src/components/dialogs/budget-creator.tsx#editor.long": [
		"editor.long Create Budget contains Unicode content and keeps keyboard cancellation reachable",
	],
	"src/components/dialogs/category.tsx#editor.long": [
		"editor.long Create Category contains Unicode content and keeps keyboard cancellation reachable",
	],
	"src/components/dialogs/monthly-budget.tsx#editor.long": [
		"editor.long Create monthly budget contains Unicode content and keeps keyboard cancellation reachable",
	],
	"src/components/dialogs/pending-statement.tsx#editor.long": [
		"editor.long Create Pending Statement contains Unicode content and keeps keyboard cancellation reachable",
	],
	"src/components/dialogs/duplicate-review.tsx#editor.long": [
		"editor.long duplicate review contains long imported descriptions and keeps its footer usable",
	],
	"src/components/dialogs/statement-replacement-review.tsx#editor.long": [
		"editor.long replacement review contains long imported descriptions and keeps its footer usable",
	],
	"src/components/dialogs/budget-editor.tsx#editor.long": [
		"budget editor: prepopulated period and amount, clearing range fails, long name and zero persist",
	],
	"src/components/dialogs/record-creator.tsx#editor.long": [
		"record creator: required fields, category defaults, amount -12.34 and long text persist",
		"record creator: required fields, category defaults, amount 0 and long text persist",
	],
	"src/components/dialogs/record-editor.tsx#editor.long": [
		"record editor: null optional fields, long title, sign and penny keyboard steps persist",
	],
	"src/components/dialogs/monthly-budget.tsx#editor.conditional": [
		"monthly budget editor: inherited amount reveals smoothly only after override action",
	],
	"src/components/dialogs/record-creator.tsx#editor.conditional": [
		"record creator: required fields, category defaults, amount -12.34 and long text persist",
		"record creator: clearing the selected date shows date validation and archived budgets stay unavailable",
	],
	"src/components/dialogs/record-editor.tsx#editor.conditional": [
		"record editor: null optional fields, long title, sign and penny keyboard steps persist",
		"pending Record editor opens with initial content already laid out",
	],
	"src/components/dialogs/category.tsx#editor.conditional": [
		"category: spending default budget, archived options absent, income clears budget, blank validation",
	],
	"src/components/dialogs/duplicate-review.tsx#editor.validation": [
		"duplicate review: explicit keep/delete, backdrop, cancel and reopen retain choices",
	],
	"src/components/dialogs/statement-replacement-review.tsx#editor.validation": [
		"pending confirmation sheet and replacement review: selected descriptions, cancel restores sheet",
	],
	"src/components/form/text-field.tsx#field.options": [
		"text field types; suggestions filter and select",
	],
	"src/components/form/textarea-field.tsx#field.input": ["textarea records long values"],
	"src/components/ui/alert.tsx#primitive.responsive": [
		"harness sections fit the viewport width",
		"alerts render both variants with title, description and action",
	],
	"src/components/ui/badge.tsx#primitive.responsive": [
		"harness sections fit the viewport width",
		"badge, card and empty render their content",
	],
	"src/components/ui/button.tsx#primitive.responsive": [
		"harness sections fit the viewport width",
		"enabled buttons count clicks, work from keyboard and show pointer cursor",
	],
	"src/components/ui/button-group.tsx#primitive.responsive": [
		"harness sections fit the viewport width",
		"button group exposes a group role with separator and label",
	],
	"src/components/ui/calendar.tsx#primitive.responsive": [
		"harness sections fit the viewport width",
		"calendar selects a day and navigates months",
		"date picker preserves page scroll while open and dismisses with Escape",
	],
	"src/components/ui/card.tsx#primitive.responsive": [
		"harness sections fit the viewport width",
		"badge, card and empty render their content",
	],
	"src/components/ui/chart.tsx#primitive.responsive": [
		"harness sections fit the viewport width",
		"chart container renders axes and legend entries",
	],
	"src/components/ui/checkbox.tsx#primitive.responsive": [
		"harness sections fit the viewport width",
		"checkbox toggles by label and Space; disabled stays off",
	],
	"src/components/ui/combobox.tsx#primitive.responsive": [
		"harness sections fit the viewport width",
		"combobox primitive filters, selects and clears",
		"combobox field preserves page scroll while open and dismisses with Escape",
	],
	"src/components/ui/command.tsx#primitive.responsive": [
		"harness sections fit the viewport width",
		"command filters, selects and reports an empty state",
		"command dialog opens and closes from an item",
	],
	"src/components/ui/dialog.tsx#primitive.responsive": [
		"harness sections fit the viewport width",
		"dialog opens with backdrop and closes on Escape with scroll restored",
	],
	"src/components/ui/empty.tsx#primitive.responsive": [
		"harness sections fit the viewport width",
		"badge, card and empty render their content",
	],
	"src/components/ui/field.tsx#primitive.responsive": [
		"harness sections fit the viewport width",
		"field primitives render label, error, legend and separator copy",
	],
	"src/components/ui/input.tsx#primitive.responsive": [
		"harness sections fit the viewport width",
		"label focuses its control and mirrors textarea state",
	],
	"src/components/ui/input-group.tsx#primitive.responsive": [
		"harness sections fit the viewport width",
		"input group types, clears and shows addon content",
	],
	"src/components/ui/label.tsx#primitive.responsive": [
		"harness sections fit the viewport width",
		"label focuses its control and mirrors textarea state",
	],
	"src/components/ui/monthpicker.tsx#primitive.responsive": [
		"harness sections fit the viewport width",
		"month picker selects a month; bounded picker disables out-of-range months",
	],
	"src/components/ui/pagination.tsx#primitive.responsive": [
		"harness sections fit the viewport width",
		"pagination marks the active page and labels navigation",
	],
	"src/components/ui/popover.tsx#primitive.responsive": [
		"harness sections fit the viewport width",
		"popover opens, keeps page overflow intact and closes on Escape",
	],
	"src/components/ui/progress.tsx#primitive.responsive": [
		"harness sections fit the viewport width",
		"progress clamps its base bar and flags only values above 100",
	],
	"src/components/ui/scroll-area.tsx#primitive.responsive": [
		"harness sections fit the viewport width",
		"scroll area scrolls its viewport",
	],
	"src/components/ui/select.tsx#primitive.responsive": [
		"harness sections fit the viewport width",
		"select primitive picks a value and marks disabled items",
		"long list exposes scroll buttons and selects a far item",
	],
	"src/components/ui/separator.tsx#primitive.responsive": [
		"harness sections fit the viewport width",
		"separators render in both orientations",
	],
	"src/components/ui/sheet.tsx#primitive.responsive": [
		"harness sections fit the viewport width",
		"sheet opens with backdrop and closes from its close button",
	],
	"src/components/ui/sidebar.tsx#primitive.responsive": [
		"harness sections fit the viewport width",
		"trigger collapses on desktop and sheets on mobile",
	],
	"src/components/ui/sonner.tsx#primitive.responsive": [
		"harness sections fit the viewport width",
		"sonner shows success and error toasts",
	],
	"src/components/ui/table.tsx#primitive.responsive": [
		"harness sections fit the viewport width",
		"table shows caption, rows and footer totals",
	],
	"src/components/ui/textarea.tsx#primitive.responsive": [
		"harness sections fit the viewport width",
		"long field values stay inside the viewport width",
	],
	"src/components/ui/toggle-group.tsx#primitive.responsive": [
		"harness sections fit the viewport width",
		"toggle group selects a value; disabled item stays disabled",
	],
	"src/components/ui/tooltip.tsx#primitive.responsive": [
		"harness sections fit the viewport width",
		"tooltip appears on hover and on focus",
	],
	"src/components/ui/alert-dialog.tsx#primitive.responsive": [
		"harness sections fit the viewport width",
		"alert dialog confirms and cancels with a visible backdrop",
	],
	"app/allocator/page.tsx#route.data": [
		"route.empty /allocator resolves without premature loading copy",
	],
	"app/(month)/page.tsx#route.navigation": [
		"monthly.shell header and tabs retain DOM identity across tab switches",
		"sidebar and month tabs clear drill history",
	],
	"app/(month)/records/monthly/page.tsx#route.navigation": [
		"monthly.shell header and tabs retain DOM identity across tab switches",
		"sidebar and month tabs clear drill history",
	],
	"app/layout.tsx#shell.consumer": [
		"monthly.shell header and tabs retain DOM identity across tab switches",
	],
	"app/providers.tsx#shell.consumer": [
		"loading.local /records stays silent while the database is opening then reveals actual data",
	],
	"app/statements/page.tsx#route.viewport": [
		"route.layout /statements keeps populated content and enabled controls inside the viewport",
	],
	"app/statements/[id]/page.tsx#route.viewport": [
		"route.layout /statements/t1-s-pending keeps populated content and enabled controls inside the viewport",
	],
	"app/budgets/page.tsx#route.viewport": [
		"route.layout /budgets keeps populated content and enabled controls inside the viewport",
	],
	"app/budgets/[id]/page.tsx#route.viewport": [
		"route.layout /budgets/t1-b-manual keeps populated content and enabled controls inside the viewport",
	],
	"app/accounts/page.tsx#route.viewport": [
		"route.layout /accounts keeps populated content and enabled controls inside the viewport",
	],
	"app/accounts/[id]/page.tsx#route.viewport": [
		"route.layout /accounts/t1-acc-dbs keeps populated content and enabled controls inside the viewport",
	],
	"app/allocator/page.tsx#route.viewport": [
		"route.layout /allocator keeps populated content and enabled controls inside the viewport",
	],
	"app/allocator/pending/page.tsx#route.viewport": [
		"route.layout /allocator/pending keeps populated content and enabled controls inside the viewport",
	],
	"app/allocator/duplicates/page.tsx#route.viewport": [
		"route.layout /allocator/duplicates keeps populated content and enabled controls inside the viewport",
	],
	"app/records/page.tsx#route.viewport": [
		"route.layout /records keeps populated content and enabled controls inside the viewport",
	],
	"app/records/[id]/page.tsx#route.viewport": [
		"route.layout /records/t1-r-partial keeps populated content and enabled controls inside the viewport",
	],
	"app/categories/page.tsx#route.viewport": [
		"route.layout /categories keeps populated content and enabled controls inside the viewport",
	],
	"app/(month)/page.tsx#route.viewport": [
		"route.layout / keeps populated content and enabled controls inside the viewport",
	],
	"app/(month)/records/monthly/page.tsx#route.viewport": [
		"route.layout /records/monthly?month=October&year=2026 keeps populated content and enabled controls inside the viewport",
	],
	"app/settings/page.tsx#route.viewport": [
		"route.layout /settings keeps populated content and enabled controls inside the viewport",
	],
	"app/sync/page.tsx#route.viewport": [
		"route.layout /sync keeps populated content and enabled controls inside the viewport",
	],
	"app/importer/page.tsx#route.viewport": [
		"route.layout /importer keeps populated content and enabled controls inside the viewport",
	],
	"app/terms/page.tsx#route.viewport": [
		"route.layout /terms keeps populated content and enabled controls inside the viewport",
	],
	"app/privacy/page.tsx#route.viewport": [
		"route.layout /privacy keeps populated content and enabled controls inside the viewport",
	],
}

/** Applicable facets without evidence stay here even when their parent scenario is mapped.
 * The default gate fails these, as well as admissions in prose. */
export const openFacets: Record<string, string[]> = {}

/** Source-backed exceptions within otherwise applicable scenarios. These do not
 * exempt the remaining facets or provide behavioural evidence. */
export const facetNotApplicable: Record<string, Record<string, string>> = {
	"src/components/layout/app-header.tsx#display.values": {
		"arbitrary long h1":
			"src/components/layout/shell-header.tsx TITLES supplies every reachable AppHeader title; no entity name or user text reaches h1. Real fixed titles are checked by route.layout cases.",
	},
	"src/components/layout/shell-header.tsx#display.values": {
		"arbitrary long h1":
			"src/components/layout/shell-header.tsx TITLES and Page not found fallback are fixed strings. Entity names render in PageHeader h2, covered separately by long Record/Statement cases.",
	},
	"src/components/table/statement-columns.tsx#table.rows": {
		"archived Statement":
			"src/types.d.ts Statement and src/data/db.ts StatementRow have no archived field; StatementBadges renders Pending and Unallocated only.",
		"null required fields":
			"src/types.d.ts Statement requires description, amount, datetime and Account. src/logic/statements.ts enriches account with a fallback; null description/amount is not a supported imported or manual Statement shape.",
	},
	"app/statements/page.tsx#route.data": {
		"archived Statement":
			"src/types.d.ts Statement has no archive state; app/statements/page.tsx renders statement-columns Pending/Unallocated states.",
		"null required cells":
			"src/types.d.ts Statement requires description, amount, datetime and Account; src/logic/statements.ts provides an account fallback. There is no optional nullable Statement cell to synthesise.",
	},
	"app/budgets/[id]/page.tsx#route.data": {
		"archived Budget":
			"src/types.d.ts Budget and src/data/db.ts BudgetRow define period/amount/automatic membership, without archived. MonthlyBudget is a separate type with archived and its historical consumer has tests.",
	},
	"src/components/table/record-columns.tsx#table.interaction": {
		"disabled Record action":
			"RecordActions and RecordEditButton in src/components/table/record-columns.tsx expose Open/Edit with no disabled prop; the busy edit handler guards repeated work via aria-busy. Parent pagination disabled controls are exercised by table.pagination cases.",
	},
	"src/components/dialogs/monthly-budget.tsx#monthly-budget.archived": {
		"editor treatment and Unbudgeted fields":
			"src/components/dialogs/monthly-budget.tsx edits identity, group, pace, amount and archived. Treatment and Unbudgeted choice live in record-analytics-fields.tsx and the badge; mapped consumer tests cover those there.",
	},
	"src/components/monthly-budget-badge.tsx#display.values": {
		"text contrast on user colour":
			"src/components/monthly-budget-badge.tsx paints only an isolated dot with user colour; text stays text-muted-foreground on bg-background, never on the user colour. Tests assert the painted dot, hollow fallback and full long-label title.",
	},
}

/** Configuration claims in ledger prose, keyed by scenario.
 * Desktop runs every enabled case and every project except light starts dark,
 * so only the non-implicit projects are listed: mobile, tall-desktop, light and
 * reduced-motion. Exactly the scenarios whose effective description names a
 * configuration appear here; prose that merely mentions viewports without
 * claiming them (editor tall scrolling, tall-only file wording) is covered by
 * scenarioProjectLexiconExemptions instead. */
export const scenarioProjects: Record<
	string,
	("mobile" | "tall-desktop" | "light" | "reduced-motion")[]
> = {
	"src/components/charts/cashflow-chart.tsx#chart.motion": [
		"mobile",
		"tall-desktop",
		"light",
		"reduced-motion",
	],
	"src/components/charts/total-spending-chart.tsx#chart.motion": [
		"mobile",
		"tall-desktop",
		"light",
		"reduced-motion",
	],
	"src/components/charts/daily-spending-chart.tsx#chart.motion": [
		"mobile",
		"tall-desktop",
		"light",
		"reduced-motion",
	],
	"src/components/charts/weekday-bars.tsx#chart.motion": [
		"mobile",
		"tall-desktop",
		"light",
		"reduced-motion",
	],
	"src/components/charts/category-history-chart.tsx#chart.motion": [
		"mobile",
		"tall-desktop",
		"light",
		"reduced-motion",
	],
	"src/components/charts/budget-progress-chart.tsx#chart.motion": [
		"mobile",
		"tall-desktop",
		"light",
		"reduced-motion",
	],
	"src/components/charts/chart-intro.ts#indirect.consumer": [
		"mobile",
		"tall-desktop",
		"light",
		"reduced-motion",
	],
	"src/components/table/data-table.tsx#table.motion": [
		"mobile",
		"tall-desktop",
		"light",
		"reduced-motion",
	],
	"src/components/table/paginated-data-table.tsx#table.motion": [
		"mobile",
		"tall-desktop",
		"light",
		"reduced-motion",
	],
	"src/components/table/record-columns.tsx#table.motion": [
		"mobile",
		"tall-desktop",
		"light",
		"reduced-motion",
	],
	"src/components/table/row-groups.tsx#table.motion": [
		"mobile",
		"tall-desktop",
		"light",
		"reduced-motion",
	],
	"src/components/table/statement-columns.tsx#table.motion": [
		"mobile",
		"tall-desktop",
		"light",
		"reduced-motion",
	],
	"app/statements/[id]/page.tsx#route.viewport": ["mobile", "tall-desktop", "reduced-motion"],
	"app/statements/page.tsx#route.viewport": ["mobile", "tall-desktop", "reduced-motion"],
	"app/budgets/[id]/page.tsx#route.viewport": ["mobile", "tall-desktop", "reduced-motion"],
	"app/budgets/page.tsx#route.viewport": ["mobile", "tall-desktop", "reduced-motion"],
	"app/accounts/[id]/page.tsx#route.viewport": ["mobile", "tall-desktop", "reduced-motion"],
	"app/accounts/page.tsx#route.viewport": ["mobile", "tall-desktop", "reduced-motion"],
	"app/allocator/page.tsx#route.viewport": ["mobile", "tall-desktop", "reduced-motion"],
	"app/allocator/pending/page.tsx#route.viewport": ["mobile", "tall-desktop", "reduced-motion"],
	"app/allocator/duplicates/page.tsx#route.viewport": [
		"mobile",
		"tall-desktop",
		"reduced-motion",
	],
	"app/records/[id]/page.tsx#route.viewport": ["mobile", "tall-desktop", "reduced-motion"],
	"app/records/page.tsx#route.viewport": ["mobile", "tall-desktop", "reduced-motion"],
	"app/categories/page.tsx#route.viewport": ["mobile", "tall-desktop", "reduced-motion"],
	"app/(month)/page.tsx#route.viewport": ["mobile", "tall-desktop", "reduced-motion"],
	"app/(month)/records/monthly/page.tsx#route.viewport": [
		"mobile",
		"tall-desktop",
		"reduced-motion",
	],
	"app/settings/page.tsx#route.viewport": ["mobile", "tall-desktop", "reduced-motion"],
	"app/sync/page.tsx#route.viewport": ["mobile", "tall-desktop", "reduced-motion"],
	"app/importer/page.tsx#route.viewport": ["mobile", "tall-desktop", "reduced-motion"],
	"app/terms/page.tsx#route.viewport": ["mobile", "tall-desktop", "reduced-motion"],
	"app/privacy/page.tsx#route.viewport": ["mobile", "tall-desktop", "reduced-motion"],
	"src/components/charts/cashflow-chart.tsx#chart.responsive": ["mobile", "tall-desktop"],
	"src/components/charts/category-history-chart.tsx#chart.responsive": ["mobile", "tall-desktop"],
	"src/components/charts/daily-spending-chart.tsx#chart.responsive": ["mobile", "tall-desktop"],
	"src/components/charts/total-spending-chart.tsx#chart.responsive": ["mobile", "tall-desktop"],
	"src/components/charts/weekday-bars.tsx#chart.responsive": ["mobile", "tall-desktop"],
	"src/components/charts/category-movers.tsx#chart.motion": ["reduced-motion"],
	"src/components/charts/monthly-budget-usage.tsx#chart.motion": ["reduced-motion"],
	"src/components/charts/spending-calendar.tsx#chart.motion": ["reduced-motion"],
	"src/components/charts/sparkline.tsx#chart.motion": ["reduced-motion"],
	"src/components/value-swap.tsx#display.values": ["reduced-motion"],
	"src/components/table/row-groups.tsx#table.rows": ["mobile"],
	"src/components/ui/sidebar.tsx#primitive.consumer": ["mobile"],
	"src/components/layout/app-sidebar.tsx#export.default.behaviour": ["mobile"],
	"src/components/layout/app-sidebar.tsx#display.interaction": ["mobile"],
	"src/components/layout/app-sidebar.tsx#display.values": ["mobile"],
	"src/components/layout/app-header.tsx#display.interaction": ["reduced-motion"],
	"src/components/layout/shell-header.tsx#display.interaction": ["reduced-motion"],
	"src/components/dialogs/account.tsx#editor.long": ["mobile"],
	"src/components/dialogs/budget-editor.tsx#editor.long": ["mobile"],
	"src/components/dialogs/record-creator.tsx#editor.long": ["mobile"],
	"src/components/dialogs/record-editor.tsx#editor.long": ["mobile"],
	"src/components/ui/alert.tsx#primitive.responsive": ["mobile"],
	"src/components/ui/badge.tsx#primitive.responsive": ["mobile"],
	"src/components/ui/button.tsx#primitive.responsive": ["mobile"],
	"src/components/ui/button-group.tsx#primitive.responsive": ["mobile"],
	"src/components/ui/card.tsx#primitive.responsive": ["mobile"],
	"src/components/ui/chart.tsx#primitive.responsive": ["mobile"],
	"src/components/ui/checkbox.tsx#primitive.responsive": ["mobile"],
	"src/components/ui/empty.tsx#primitive.responsive": ["mobile"],
	"src/components/ui/field.tsx#primitive.responsive": ["mobile"],
	"src/components/ui/input.tsx#primitive.responsive": ["mobile"],
	"src/components/ui/input-group.tsx#primitive.responsive": ["mobile"],
	"src/components/ui/label.tsx#primitive.responsive": ["mobile"],
	"src/components/ui/monthpicker.tsx#primitive.responsive": ["mobile"],
	"src/components/ui/pagination.tsx#primitive.responsive": ["mobile"],
	"src/components/ui/progress.tsx#primitive.responsive": ["mobile"],
	"src/components/ui/scroll-area.tsx#primitive.responsive": ["mobile"],
	"src/components/ui/separator.tsx#primitive.responsive": ["mobile"],
	"src/components/ui/sidebar.tsx#primitive.responsive": ["mobile"],
	"src/components/ui/sonner.tsx#primitive.responsive": ["mobile"],
	"src/components/ui/table.tsx#primitive.responsive": ["mobile"],
	"src/components/ui/textarea.tsx#primitive.responsive": ["mobile"],
	"src/components/ui/toggle-group.tsx#primitive.responsive": ["mobile"],
}

/** Described exceptions within otherwise claimed scenarios. These exempt the
 * listed test IDs from the claimed project selection; the remaining mappings
 * still prove the claim. */
export const scenarioProjectExemptions: Record<string, Record<string, string>> = {
	"src/components/table/data-table.tsx#table.motion": {
		"detaching a budget Record preserves the remaining row without replaying its entrance":
			"Detach no-replay does not vary by configuration; the test forces its own 1920×1440 viewport; src/components/table/data-table.tsx",
		"route.selection multiple selections retain values after cancelling keyboard creation":
			"Keyboard selection retention does not vary by configuration; src/components/selection-bar.tsx",
	},
	"src/components/table/paginated-data-table.tsx#table.motion": {
		"table.pagination record keeps search in the URL and moves between pages":
			"Page-change identity and URL state do not vary by configuration; src/components/table/paginated-data-table.tsx",
		"table.pagination statement keeps search in the URL and moves between pages":
			"Page-change identity and URL state do not vary by configuration; src/components/table/paginated-data-table.tsx",
	},
	"src/components/table/record-columns.tsx#table.motion": {
		"detaching a budget Record preserves the remaining row without replaying its entrance":
			"Detach no-replay does not vary by configuration; the test forces its own 1920×1440 viewport; src/components/table/record-columns.tsx",
		"motion.consumer Budget Records animates its initially visible related rows":
			"Tall Budget Records run only in the tall-only file, as the description states; src/components/table/record-columns.tsx",
	},
}

/** Behaviour-mapping IDs whose description matches the configuration-claim
 * lexicon but names no executable project: the editor "mobile tall content may
 * scroll" wording describes tall popup content scrolling on small viewports,
 * not execution in the tall-desktop project. */
export const scenarioProjectLexiconExemptions: Record<string, string> = {
	"src/components/dialogs/account.tsx#editor.open":
		"Tall content scrolling inside a mobile popup is about in-popup overflow, not the tall-desktop project; the mapped popup test runs on desktop and mobile",
	"src/components/dialogs/budget-creator.tsx#editor.open":
		"Tall content scrolling inside a mobile popup is about in-popup overflow, not the tall-desktop project; the mapped popup test runs on desktop and mobile",
	"src/components/dialogs/budget-editor.tsx#editor.open":
		"Tall content scrolling inside a mobile popup is about in-popup overflow, not the tall-desktop project; the mapped popup test runs on desktop and mobile",
	"src/components/dialogs/category.tsx#editor.open":
		"Tall content scrolling inside a mobile popup is about in-popup overflow, not the tall-desktop project; the mapped popup test runs on desktop and mobile",
	"src/components/dialogs/monthly-budget.tsx#editor.open":
		"Tall content scrolling inside a mobile popup is about in-popup overflow, not the tall-desktop project; the mapped popup test runs on desktop and mobile",
	"src/components/dialogs/pending-statement.tsx#editor.open":
		"Tall content scrolling inside a mobile popup is about in-popup overflow, not the tall-desktop project; the mapped popup test runs on desktop and mobile",
	"src/components/dialogs/record-creator.tsx#editor.open":
		"Tall content scrolling inside a mobile popup is about in-popup overflow, not the tall-desktop project; the mapped popup test runs on desktop and mobile",
	"src/components/dialogs/record-editor.tsx#editor.open":
		"Tall content scrolling inside a mobile popup is about in-popup overflow, not the tall-desktop project; the mapped popup test runs on desktop and mobile",
	"src/components/dialogs/duplicate-review.tsx#editor.open":
		"Tall content scrolling inside a mobile popup is about in-popup overflow, not the tall-desktop project; the mapped popup test runs on desktop and mobile",
	"src/components/dialogs/statement-replacement-review.tsx#editor.open":
		"Tall content scrolling inside a mobile popup is about in-popup overflow, not the tall-desktop project; the mapped popup test runs on desktop and mobile",
}
