import { Button } from "@/components/ui/button"
import type { RuleRecommendation } from "@/logic/statement-rules"
import type { RuleField } from "@/types/statement-rules"

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
	const suggestions = recommendations.filter(
		item => item.field === field && item.mode === "suggest",
	)
	if (!suggestions.length) return null
	return (
		<div className="flex flex-wrap gap-1.5" aria-label={`Rule suggestions for ${field}`}>
			{suggestions.map(item => (
				<Button
					key={item.rule_id}
					type="button"
					variant="outline"
					size="sm"
					className="h-auto rounded-full px-2.5 py-1 text-xs"
					title={`Suggested by ${item.rule_name}`}
					disabled={disabled}
					onClick={() => onApply(item)}
				>
					{label(item.value)}
				</Button>
			))}
		</div>
	)
}
