import { UiIcon } from "@/components/icon"
import { treatmentLabel } from "@/lib/analytics"
import type { listMonthlyBudgets } from "@/logic/monthly-budgets"
import type { RuleRecommendation } from "@/logic/statement-rules"
import type { AnalyticsTreatment, CategoryWithChildren, RuleField } from "@/types"

/** Display text for a rule value: names for ids, labels for treatments. */
export function ruleValueLabel(
	field: RuleField,
	value: string | null,
	categories: CategoryWithChildren[],
	monthlyBudgets: Awaited<ReturnType<typeof listMonthlyBudgets>> | undefined,
) {
	return field === "category_id"
		? (categories.flatMap(c => [c, ...c.children]).find(c => c.id === value)?.name ??
				"Unknown category")
		: field === "analytics_treatment"
			? treatmentLabel(value as AnalyticsTreatment)
			: field === "monthly_budget_id"
				? value === null
					? "Unbudgeted"
					: (monthlyBudgets?.find(b => b.id === value)?.name ?? "Unknown monthly budget")
				: (value ?? "")
}

export default function RuleSuggestions({
	field,
	recommendations,
	label,
	onApply,
	disabled,
}: {
	field: RuleField
	recommendations: RuleRecommendation[]
	label: (value: string | null) => string
	onApply: (item: RuleRecommendation) => void
	disabled?: boolean
}) {
	// Rules that suggest the same value share one chip.
	const suggestions = recommendations.filter(
		(item, i) =>
			item.field === field &&
			item.mode === "suggest" &&
			recommendations.findIndex(
				r => r.field === field && r.mode === "suggest" && r.value === item.value,
			) === i,
	)
	if (!suggestions.length) return null
	return (
		<div className="-mt-1 flex flex-wrap gap-1.5" aria-label="Suggestions from statement rules">
			{suggestions.map(item => (
				<button
					key={item.rule_id}
					type="button"
					title={`Suggested by “${item.rule_name}”`}
					disabled={disabled}
					className="flex max-w-full cursor-pointer items-center gap-1 rounded-full border border-dashed px-2 py-0.5 text-xs text-muted-foreground transition-colors duration-150 ease-out hover:border-solid hover:bg-muted hover:text-foreground disabled:pointer-events-none disabled:opacity-50"
					onClick={() => onApply(item)}
				>
					<UiIcon icon="lucide:sparkles" className="size-3 shrink-0" />
					<span className="truncate">{label(item.value)}</span>
				</button>
			))}
		</div>
	)
}
