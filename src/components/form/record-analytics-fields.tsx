import { useLiveQuery } from "dexie-react-hooks"
import SelectField from "@/components/form/select-field"
import { FieldGroup } from "@/components/ui/field"
import {
	canUseDefaultMonthlyBudget,
	canUseMonthlyBudget,
	TREATMENTS,
	treatmentLabel,
} from "@/lib/analytics"
import { listMonthlyBudgets } from "@/logic/monthly-budgets"
import type { AnalyticsTreatment } from "@/types"

const CATEGORY_DEFAULT = "category_default"
const UNBUDGETED = "unbudgeted"

export default function RecordAnalyticsFields({
	treatment,
	categoryTreatment,
	amount,
	monthlyBudgetId,
	monthlyBudgetSource,
	categoryMonthlyBudgetId,
	monthlyBudgets: monthlyBudgetsProp,
	treatmentSuggestions,
	monthlyBudgetSuggestions,
	treatmentAutopopulated,
	monthlyBudgetAutopopulated,
	onTreatmentChange,
	onMonthlyBudgetChange,
}: {
	treatment: string
	categoryTreatment: AnalyticsTreatment | null | undefined
	amount: number
	monthlyBudgetId: string
	monthlyBudgetSource: "category" | "manual"
	categoryMonthlyBudgetId: string | null | undefined
	/** Prepared Monthly Budget lookup from the opening dialog; falls back to its own live query. */
	monthlyBudgets?: Awaited<ReturnType<typeof listMonthlyBudgets>>
	treatmentSuggestions?: React.ReactNode
	monthlyBudgetSuggestions?: React.ReactNode
	treatmentAutopopulated?: string
	monthlyBudgetAutopopulated?: string
	onTreatmentChange: (value: string) => void
	onMonthlyBudgetChange: (value: string, source: "category" | "manual") => void
}) {
	const queriedMonthlyBudgets = useLiveQuery(
		() => (monthlyBudgetsProp === undefined ? listMonthlyBudgets() : undefined),
		[monthlyBudgetsProp === undefined],
	)
	const monthlyBudgets = monthlyBudgetsProp ?? queriedMonthlyBudgets
	const effectiveTreatment = (treatment || categoryTreatment || "automatic") as AnalyticsTreatment
	const monthlyBudgetEligible = canUseMonthlyBudget(effectiveTreatment, amount)
	const categoryBudgetId = canUseDefaultMonthlyBudget(categoryTreatment)
		? categoryMonthlyBudgetId
		: null
	const categoryMonthlyBudget = monthlyBudgets?.find(
		monthlyBudget => monthlyBudget.id === categoryBudgetId,
	)
	const treatmentValue =
		treatment || (categoryTreatment !== undefined ? CATEGORY_DEFAULT : "automatic")
	const monthlyBudgetValue =
		monthlyBudgetSource === "category" && categoryMonthlyBudgetId !== undefined
			? CATEGORY_DEFAULT
			: monthlyBudgetId || UNBUDGETED

	return (
		<div className="grid gap-4 rounded-lg border p-4">
			<p className="text-sm font-semibold">Analytics</p>
			<FieldGroup>
				<SelectField
					id="analytics_treatment"
					label="Treatment"
					autopopulated={treatmentAutopopulated}
					value={treatmentValue}
					items={[
						...(categoryTreatment !== undefined
							? [
									{
										value: CATEGORY_DEFAULT,
										label: `Category default · ${treatmentLabel(categoryTreatment)}`,
									},
								]
							: []),
						...TREATMENTS,
					]}
					onChange={value => {
						const treatment = value === CATEGORY_DEFAULT ? "" : value
						onTreatmentChange(treatment)
					}}
				/>
				{treatmentSuggestions}
				{monthlyBudgetEligible && (
					<SelectField
						id="monthly_budget_id"
						label="Monthly budget"
						autopopulated={monthlyBudgetAutopopulated}
						disabled={!monthlyBudgetEligible}
						value={monthlyBudgets === undefined ? "" : monthlyBudgetValue}
						placeholder={monthlyBudgets === undefined ? "Monthly budget" : "Unbudgeted"}
						items={[
							{ value: UNBUDGETED, label: "Unbudgeted" },
							...(categoryMonthlyBudgetId !== undefined
								? [
										{
											value: CATEGORY_DEFAULT,
											label: `Category default · ${categoryMonthlyBudget?.name ?? (categoryBudgetId ? "Default monthly budget" : "Unbudgeted")}`,
										},
									]
								: []),
							...(monthlyBudgets ?? [])
								.filter(
									monthlyBudget =>
										!monthlyBudget.archived ||
										monthlyBudget.id === monthlyBudgetId,
								)
								.map(monthlyBudget => ({
									value: monthlyBudget.id,
									label: monthlyBudget.name,
									disabled: monthlyBudget.archived,
								})),
						]}
						onChange={value => {
							if (!value) return

							onMonthlyBudgetChange(
								value === CATEGORY_DEFAULT
									? (categoryBudgetId ?? "")
									: value === UNBUDGETED
										? ""
										: value,
								value === CATEGORY_DEFAULT ? "category" : "manual",
							)
						}}
					/>
				)}
				{monthlyBudgetEligible && monthlyBudgetSuggestions}
			</FieldGroup>
		</div>
	)
}
