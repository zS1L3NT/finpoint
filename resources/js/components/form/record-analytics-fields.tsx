import SelectField from "@/components/form/select-field"
import { FieldGroup } from "@/components/ui/field"
import { useFetch } from "@/hooks/use-fetch"
import { AnalyticsTreatment, Bucket } from "@/types"
import { bucketIndexApiRoute } from "@/wayfinder/routes"

export default function RecordAnalyticsFields({
	treatment,
	categoryTreatment,
	amount,
	bucketId,
	onTreatmentChange,
	onBucketChange,
}: {
	treatment: string
	categoryTreatment: AnalyticsTreatment | null | undefined
	amount: number
	bucketId: string
	onTreatmentChange: (value: string) => void
	onBucketChange: (value: string) => void
}) {
	const buckets = useFetch<Bucket[]>(bucketIndexApiRoute.url(), [])
	const effectiveTreatment = (treatment || categoryTreatment || "automatic") as AnalyticsTreatment
	const bucketEligible = canUseBucket(effectiveTreatment, amount)

	return (
		<div className="grid gap-4 rounded-lg border p-4">
			<div>
				<p className="text-sm font-semibold">Reporting</p>
				<p className="text-xs text-muted-foreground">
					The Category normally fills these in for you. Change them only when this Record
					should count differently or use a different spending bucket.
				</p>
			</div>
			<FieldGroup>
				<SelectField
					id="analytics_treatment"
					label="How this Record counts"
					value={treatment}
					placeholder="Use Category default"
					description={`Currently ${treatmentLabel(effectiveTreatment)}. Leave unchanged to follow the Category.`}
					items={[
						{ value: "income", label: "Income" },
						{ value: "spending", label: "Spending" },
						{ value: "saving_investment", label: "Saving/investment" },
						{ value: "neutral", label: "Transfer/neutral" },
						{ value: "automatic", label: "Automatic by direction" },
					]}
					onChange={value => {
						onTreatmentChange(value)
						if (
							!canUseBucket(
								(value || categoryTreatment || "automatic") as AnalyticsTreatment,
								amount,
							)
						)
							onBucketChange("")
					}}
				/>
				<SelectField
					id="bucket_id"
					label="Spending bucket"
					description={
						bucketEligible
							? "Controls which spending target this Record uses."
							: "Available only when this Record is classified as spending."
					}
					disabled={!bucketEligible}
					value={bucketId}
					placeholder="No bucket"
					items={(buckets ?? [])
						.filter(bucket => !bucket.archived)
						.map(bucket => ({ value: bucket.id, label: bucket.name }))}
					onChange={onBucketChange}
				/>
			</FieldGroup>
		</div>
	)
}

function treatmentLabel(treatment: AnalyticsTreatment) {
	return {
		income: "Income",
		spending: "Spending",
		saving_investment: "Saving/investment",
		neutral: "Transfer/neutral",
		automatic: "Automatic by direction",
	}[treatment]
}

function canUseBucket(treatment: AnalyticsTreatment, amount: number) {
	return treatment === "spending" || (treatment === "automatic" && amount < 0)
}
