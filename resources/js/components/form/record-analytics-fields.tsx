import { useLiveQuery } from "dexie-react-hooks"
import SelectField from "@/components/form/select-field"
import { FieldGroup } from "@/components/ui/field"
import { treatmentLabel } from "@/lib/analytics"
import { listBuckets } from "@/logic/buckets"
import { AnalyticsTreatment } from "@/types"

const CATEGORY_DEFAULT = "category_default"

export default function RecordAnalyticsFields({
	treatment,
	categoryTreatment,
	amount,
	bucketId,
	bucketSource,
	categoryBucketId,
	onTreatmentChange,
	onBucketChange,
}: {
	treatment: string
	categoryTreatment: AnalyticsTreatment | null | undefined
	amount: number
	bucketId: string
	bucketSource: "category" | "manual"
	categoryBucketId: string | null | undefined
	onTreatmentChange: (value: string) => void
	onBucketChange: (value: string, source: "category" | "manual") => void
}) {
	const buckets = useLiveQuery(() => listBuckets(), []) ?? []
	const effectiveTreatment = (treatment || categoryTreatment || "automatic") as AnalyticsTreatment
	const bucketEligible = canUseBucket(effectiveTreatment, amount)
	const categoryBucket = buckets.find(bucket => bucket.id === categoryBucketId)
	const treatmentValue = treatment || (categoryTreatment ? CATEGORY_DEFAULT : "")
	const bucketValue =
		bucketSource === "category" && categoryBucketId && bucketId === categoryBucketId
			? CATEGORY_DEFAULT
			: bucketId

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
						{ value: "income", label: "Income" },
						{ value: "spending", label: "Spending" },
						{ value: "saving_investment", label: "Saving/investment" },
						{ value: "neutral", label: "Transfer/neutral" },
						{ value: "automatic", label: "Automatic by direction" },
					]}
					onChange={value => {
						const treatment = value === CATEGORY_DEFAULT ? "" : value
						onTreatmentChange(treatment)
						if (
							!canUseBucket(
								(treatment ||
									categoryTreatment ||
									"automatic") as AnalyticsTreatment,
								amount,
							)
						)
							onBucketChange("", "manual")
					}}
				/>
				<SelectField
					id="bucket_id"
					label="Spending bucket"
					disabled={!bucketEligible}
					value={bucketValue}
					placeholder="No default bucket"
					items={[
						...(categoryBucketId !== undefined
							? [
									{
										value: CATEGORY_DEFAULT,
										label: `Category default · ${categoryBucket?.name ?? (categoryBucketId ? "Default bucket" : "No default bucket")}`,
									},
								]
							: []),
						...buckets
							.filter(bucket => !bucket.archived)
							.map(bucket => ({ value: bucket.id, label: bucket.name })),
					]}
					onChange={value => {
						if (!value) return

						onBucketChange(
							value === CATEGORY_DEFAULT ? (categoryBucketId ?? "") : value,
							value === CATEGORY_DEFAULT ? "category" : "manual",
						)
					}}
				/>
			</FieldGroup>
		</div>
	)
}

function canUseBucket(treatment: AnalyticsTreatment, amount: number) {
	return treatment === "spending" || (treatment === "automatic" && amount < 0)
}
