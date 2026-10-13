import { useLiveQuery } from "dexie-react-hooks"
import SelectField from "@/components/form/select-field"
import { FieldGroup } from "@/components/ui/field"
import { canUseMonthlyBudget, TREATMENTS, treatmentLabel } from "@/lib/analytics"
import { listMonthlyBudgets } from "@/logic/monthly-budgets"
import { AnalyticsTreatment } from "@/types"

const CATEGORY_DEFAULT = "category_default"
const UNBUDGETED = "unbudgeted"

export default function RecordAnalyticsFields({
	treatment,
	categoryTreatment,
	amount,
	monthlyBudgetId,
	monthlyBudgetSource,
	categoryMonthlyBudgetId,
	onTreatmentChange,
	onMonthlyBudgetChange,
}: {
	treatment: string
	categoryTreatment: AnalyticsTreatment | null | undefined
	amount: number
	monthlyBudgetId: string
	monthlyBudgetSource: "category" | "manual"
	categoryMonthlyBudgetId: string | null | undefined
	onTreatmentChange: (value: string) => void
	onMonthlyBudgetChange: (value: string, source: "category" | "manual") => void
}) {
	const monthlyBudgets = useLiveQuery(() => listMonthlyBudgets(), [])
	if (monthlyBudgets === undefined) return null
	const effectiveTreatment = (treatment || categoryTreatment || "automatic") as AnalyticsTreatment
	const monthlyBudgetEligible = canUseMonthlyBudget(effectiveTreatment, amount)
	const categoryMonthlyBudget = monthlyBudgets.find(
		monthlyBudget => monthlyBudget.id === categoryMonthlyBudgetId,
	)
	const treatmentValue = treatment || (categoryTreatment ? CATEGORY_DEFAULT : "")
	const monthlyBudgetValue =
		monthlyBudgetSource === "category" &&
		categoryMonthlyBudgetId &&
		monthlyBudgetId === categoryMonthlyBudgetId
			? CATEGORY_DEFAULT
			: monthlyBudgetId || UNBUDGETED

	return (
		<div className="grid gap-4 rounded-lg border p-4">
			<p className="text-sm font-semibold">Analytics</p>
			<FieldGroup>
				<SelectField
					id="analytics_treatment"
					label="Treatment"
					value={treatmentValue}
					placeholder="No default treatment"
					items={[
						...(categoryTreatment !== undefined
							? [
									{
										value: CATEGORY_DEFAULT,
										label: `Category default · ${categoryTreatment ? treatmentLabel(categoryTreatment) : "No default treatment"}`,
									},
								]
							: []),
						...TREATMENTS,
					]}
					onChange={value => {
						const treatment = value === CATEGORY_DEFAULT ? "" : value
						onTreatmentChange(treatment)
						if (
							!canUseMonthlyBudget(
								(treatment ||
									categoryTreatment ||
									"automatic") as AnalyticsTreatment,
								amount,
							)
						)
							onMonthlyBudgetChange("", "manual")
					}}
				/>
				<SelectField
					id="monthly_budget_id"
					label="Monthly budget"
					disabled={!monthlyBudgetEligible}
					value={monthlyBudgetValue}
					placeholder="Unbudgeted"
					items={[
						{ value: UNBUDGETED, label: "Unbudgeted" },
						...(categoryMonthlyBudgetId !== undefined
							? [
									{
										value: CATEGORY_DEFAULT,
										label: `Category default · ${categoryMonthlyBudget?.name ?? (categoryMonthlyBudgetId ? "Default monthly budget" : "Unbudgeted")}`,
									},
								]
							: []),
						...monthlyBudgets
							.filter(monthlyBudget => !monthlyBudget.archived)
							.map(monthlyBudget => ({
								value: monthlyBudget.id,
								label: monthlyBudget.name,
							})),
					]}
					onChange={value => {
						if (!value) return

						onMonthlyBudgetChange(
							value === CATEGORY_DEFAULT
								? (categoryMonthlyBudgetId ?? "")
								: value === UNBUDGETED
									? ""
									: value,
							value === CATEGORY_DEFAULT ? "category" : "manual",
						)
					}}
				/>
			</FieldGroup>
		</div>
	)
}
