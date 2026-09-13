import { DateTime } from "luxon"
import { useState } from "react"
import { toast } from "sonner"
import AmountField from "@/components/form/amount-field"
import SelectField from "@/components/form/select-field"
import TextField from "@/components/form/text-field"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog"
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"
import { createBucket, setBucketTarget, updateBucket } from "@/logic/buckets"
import { ValidationError } from "@/logic/validate"
import { Bucket } from "@/types"

type EditableBucket = Bucket & { target?: number | null }
const fieldErrors = (errors?: string[]) => errors?.map(message => ({ message }))

export default function BucketDialog({
	bucket,
	month,
	year,
	trigger,
}: {
	bucket?: EditableBucket
	month: string
	year: number
	trigger: React.ReactElement
}) {
	const selectedMonth = DateTime.fromFormat(`${month} ${year}`, "MMMM yyyy").startOf("month")
	const [open, setOpen] = useState(false)
	const [name, setName] = useState(bucket?.name ?? "")
	const [color, setColor] = useState(bucket?.color ?? "#64748b")
	const [group, setGroup] = useState(bucket?.group ?? "core")
	const [paceKind, setPaceKind] = useState(bucket?.pace_kind ?? "none")
	const [target, setTarget] = useState(bucket?.target ?? 0)
	const [noTarget, setNoTarget] = useState(bucket?.target === null)
	const [targetScope, setTargetScope] = useState("month")
	const [archived, setArchived] = useState(bucket?.archived ?? false)
	const [errors, setErrors] = useState<{ [key: string]: string[] }>({})
	const [submitting, setSubmitting] = useState(false)

	const reset = () => {
		setName(bucket?.name ?? "")
		setColor(bucket?.color ?? "#64748b")
		setGroup(bucket?.group ?? "core")
		setPaceKind(bucket?.pace_kind ?? "none")
		setTarget(bucket?.target ?? 0)
		setNoTarget(bucket?.target === null)
		setTargetScope("month")
		setArchived(bucket?.archived ?? false)
		setErrors({})
	}

	const submit = async () => {
		setSubmitting(true)
		setErrors({})
		try {
			const saved = bucket
				? await updateBucket(bucket.id, {
						name,
						color,
						group,
						pace_kind: group === "outlier" ? "none" : paceKind,
						archived,
					})
				: await createBucket({
						name,
						color,
						group,
						pace_kind: group === "outlier" ? "none" : paceKind,
					})

			const targetMonth =
				targetScope === "default"
					? (selectedMonth.plus({ month: 1 }).toISODate() ?? "")
					: (selectedMonth.toISODate() ?? "")
			await setBucketTarget(saved.id, {
				month: targetMonth,
				amount: noTarget ? null : target,
				scope: targetScope as "month" | "default",
			})

			setOpen(false)
		} catch (cause) {
			if (cause instanceof ValidationError) {
				setErrors(cause.errors)
			} else {
				toast.error("Unable to save this bucket.")
			}
		} finally {
			setSubmitting(false)
		}
	}

	return (
		<Dialog
			open={open}
			onOpenChange={value => {
				setOpen(value)
				if (value) reset()
			}}
		>
			<DialogTrigger render={trigger} />
			<DialogContent className="md:max-w-lg">
				<DialogHeader>
					<DialogTitle>{bucket ? `Edit ${bucket.name}` : "Create bucket"}</DialogTitle>
					<DialogDescription>
						Buckets persist across months. The target can apply only to {month} {year}{" "}
						or become the default from the following month.
					</DialogDescription>
				</DialogHeader>
				<form
					className="grid gap-5"
					onSubmit={event => {
						event.preventDefault()
						void submit()
					}}
				>
					<FieldGroup>
						<TextField
							id="bucket-name"
							label="Name"
							value={name}
							errors={fieldErrors(errors.name)}
							onChange={setName}
						/>
						<Field>
							<FieldLabel htmlFor="bucket-color">Colour</FieldLabel>
							<div className="flex items-center gap-2">
								<input
									id="bucket-color"
									type="color"
									value={color}
									onChange={event => setColor(event.target.value)}
									className="h-8 w-12 cursor-pointer rounded border bg-transparent p-1"
								/>
								<span className="text-xs text-muted-foreground">{color}</span>
							</div>
						</Field>
						<SelectField
							id="bucket-group"
							label="Group"
							value={group}
							items={[
								{ value: "core", label: "Core" },
								{ value: "outlier", label: "Outlier" },
								{ value: "other", label: "Other" },
							]}
							errors={fieldErrors(errors.group)}
							onChange={value => setGroup(value as Bucket["group"])}
						/>
						<SelectField
							id="bucket-pace"
							label="Pacing"
							value={group === "outlier" ? "none" : paceKind}
							disabled={group === "outlier"}
							description={
								group === "outlier" ? "Outlier buckets are not paced." : undefined
							}
							items={[
								{ value: "none", label: "No pacing" },
								{ value: "daily", label: "Daily" },
								{ value: "recurring", label: "Recurring" },
							]}
							errors={fieldErrors(errors.pace_kind)}
							onChange={value => setPaceKind(value as Bucket["pace_kind"])}
						/>
						<AmountField
							id="bucket-target"
							label="Target"
							value={target}
							min={0}
							disabled={noTarget}
							errors={fieldErrors(errors.amount)}
							onChange={setTarget}
						/>
						<Field orientation="horizontal">
							<Checkbox
								id="bucket-no-target"
								checked={noTarget}
								onCheckedChange={value => setNoTarget(value === true)}
							/>
							<FieldLabel htmlFor="bucket-no-target">No target</FieldLabel>
						</Field>
						<SelectField
							id="bucket-target-scope"
							label="Target applies to"
							value={targetScope}
							items={[
								{ value: "month", label: `${month} ${year} only` },
								{
									value: "default",
									label: `Default from ${selectedMonth.plus({ month: 1 }).toFormat("MMMM yyyy")}`,
								},
							]}
							onChange={setTargetScope}
						/>
						{bucket ? (
							<Field orientation="horizontal">
								<Checkbox
									id="bucket-archived"
									checked={archived}
									onCheckedChange={value => setArchived(value === true)}
								/>
								<div>
									<FieldLabel htmlFor="bucket-archived">
										Archive bucket
									</FieldLabel>
									<p className="text-xs text-muted-foreground">
										Existing Record assignments remain intact.
									</p>
								</div>
							</Field>
						) : null}
					</FieldGroup>
					{Object.values(errors).flat().length ? (
						<p className="text-sm text-destructive" role="alert">
							{Object.values(errors).flat().join(" ")}
						</p>
					) : null}
					<DialogFooter>
						<DialogClose
							render={
								<Button type="button" variant="outline">
									Cancel
								</Button>
							}
						/>
						<Button type="submit" disabled={submitting}>
							{submitting ? "Saving…" : bucket ? "Save changes" : "Create bucket"}
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	)
}
