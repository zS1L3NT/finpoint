import { Link, router } from "@inertiajs/react"
import { useForm } from "@tanstack/react-form"
import {
	CalendarSyncIcon,
	LoaderCircleIcon,
	PencilIcon,
	PlusIcon,
	RepeatIcon,
	Trash2Icon,
} from "lucide-react"
import { useState } from "react"
import DetailCard from "@/components/detail-card"
import AmountField from "@/components/form/amount-field"
import Icon from "@/components/icon"
import AppHeader from "@/components/layout/app-header"
import PageHeader from "@/components/layout/page-header"
import RecordSearch from "@/components/record-search"
import DataTable from "@/components/table/data-table"
import { Button } from "@/components/ui/button"
import {
	Card,
	CardAction,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card"
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
import { Field, FieldDescription, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select"
import useApiFormErrors from "@/hooks/use-api-form-errors"
import { currencyClass, round2dp, toCurrency, toDatetime, withMethod } from "@/lib/utils"
import { Category, Record, Recurrence } from "@/types"
import {
	recordWebRoute,
	recurrenceDestroyApiRoute,
	recurrenceRecordDestroyApiRoute,
	recurrenceRecordUpdateApiRoute,
	recurrencesWebRoute,
	recurrenceUpdateApiRoute,
} from "@/wayfinder/routes"

type RecurrenceExtra = {
	records: (Record & RecordExtra)[]
	records_count: number
}

type RecordExtra = {
	category: Category
}

export default function RecurrencePage({
	recurrence,
}: {
	recurrence: Recurrence & RecurrenceExtra
}) {
	const [isMutatingRecords, setIsMutatingRecords] = useState(false)
	const monthlyAmount = round2dp(toMonthlyAmount(recurrence.amount, recurrence.period))
	const yearlyAmount = round2dp(monthlyAmount * 12)

	const mutateRecord = async (record: Record, mode: "attach" | "detach") => {
		setIsMutatingRecords(true)

		try {
			const route =
				mode === "attach"
					? recurrenceRecordUpdateApiRoute.url({ recurrence, record })
					: recurrenceRecordDestroyApiRoute.url({ recurrence, record })

			const response = await fetch(route, {
				method: "POST",
				body: withMethod(new FormData(), mode === "attach" ? "PUT" : "DELETE"),
				headers: { Accept: "application/json" },
			})

			if (response.ok) {
				router.reload()
			}
		} finally {
			setIsMutatingRecords(false)
		}
	}

	return (
		<>
			<AppHeader title="Recurrence" />

			<div className="container mx-auto flex flex-col gap-8 p-8">
				<PageHeader
					title={recurrence.name}
					subtitle="Use linked records to ground this recurrence in real spending activity while keeping a clean normalized monthly view."
					description="Recurrence details"
					icon={CalendarSyncIcon}
					actions={<RecurrenceEditorDialog recurrence={recurrence} />}
					back={{
						name: "Back to recurrences",
						url: recurrencesWebRoute.url(),
					}}
				/>

				<div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
					<DetailCard label="Period" value={formatRecurrencePeriod(recurrence.period)} />
					<DetailCard label="Entered amount" value={toCurrency(recurrence.amount)} />
					<DetailCard label="Monthly equivalent" value={toCurrency(monthlyAmount)} />
					<DetailCard label="Annualised" value={toCurrency(yearlyAmount)} />
					<DetailCard label="Linked records" value={recurrence.records_count} />
				</div>

				<div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
					<Card className="border border-border/70 bg-linear-to-br from-card via-card to-muted/30 py-0">
						<CardHeader className="border-b py-4">
							<CardDescription>Breakdown</CardDescription>
							<CardTitle>Normalized spending profile</CardTitle>
							<CardAction className="text-sm text-muted-foreground">
								{formatRecurrencePeriod(recurrence.period)} cadence
							</CardAction>
						</CardHeader>

						<CardContent className="space-y-4 py-6">
							<div className="rounded-2xl border border-border/70 bg-background/70 p-6">
								<div className="flex items-start justify-between gap-4">
									<div>
										<p className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
											Monthly equivalent
										</p>
										<p className="mt-2 text-3xl font-semibold">
											{toCurrency(monthlyAmount)}
										</p>
									</div>
									<div className="flex size-12 items-center justify-center rounded-full bg-muted ring-1 ring-border">
										<RepeatIcon className="size-5 text-muted-foreground" />
									</div>
								</div>
								<p className="mt-4 text-sm text-muted-foreground">
									This converts the stored{" "}
									{formatRecurrencePeriod(recurrence.period).toLowerCase()} amount
									into a monthly planning number.
								</p>
							</div>

							<div className="grid gap-3 md:grid-cols-2">
								<MiniMetricCard
									label="Original value"
									value={toCurrency(recurrence.amount)}
								/>
								<MiniMetricCard
									label="Linked evidence"
									value={`${recurrence.records.length} record${recurrence.records.length === 1 ? "" : "s"}`}
								/>
							</div>
						</CardContent>
					</Card>

					<Card className="border border-border/70 py-0">
						<CardHeader className="border-b py-4">
							<CardDescription>Link records</CardDescription>
							<CardTitle>Attach real entries to this recurrence</CardTitle>
						</CardHeader>

						<CardContent className="flex flex-col gap-4 py-6">
							<div className="rounded-xl border border-dashed border-border/80 bg-muted/20 p-4">
								<p className="font-medium">How to use this</p>
								<p className="mt-1 text-sm text-muted-foreground">
									Attach records that represent this repeating cost so you can
									inspect the actual ledger entries behind the recurrence.
								</p>
							</div>

							<RecordSearch
								title="Attach record to recurrence"
								excluded={recurrence.records}
								handler={record => mutateRecord(record, "attach")}
								trigger={
									<Button
										className="w-full"
										size="lg"
										disabled={isMutatingRecords}
									>
										<PlusIcon /> Attach record
									</Button>
								}
							/>
						</CardContent>
					</Card>
				</div>

				<Card>
					<CardHeader>
						<CardTitle>Linked records</CardTitle>
						<CardDescription>
							Records currently associated with this recurring item.
						</CardDescription>
					</CardHeader>

					<CardContent>
						<DataTable
							data={recurrence.records}
							columns={[
								{
									header: "Record",
									meta: { width: "20rem" },
									cell: ({ row }) => (
										<div className="flex items-center gap-3">
											<Icon {...row.original.category} size={16} />
											<div className="flex-1 overflow-hidden">
												<p className="truncate font-medium">
													{row.original.title}
												</p>
												<p className="truncate text-muted-foreground">
													{[
														row.original.people
															? `w/ ${row.original.people}`
															: null,
														row.original.location
															? `@ ${row.original.location}`
															: null,
													]
														.filter(Boolean)
														.join(" ") || "No extra context"}
												</p>
											</div>
										</div>
									),
								},
								{
									header: "Amount",
									meta: { width: "8rem" },
									cell: ({ row }) => (
										<span className={currencyClass(row.original.amount)}>
											{toCurrency(row.original.amount)}
										</span>
									),
								},
								{
									header: "Date & Time",
									meta: { width: "12rem" },
									cell: ({ row }) => toDatetime(row.original.datetime),
								},
								{
									header: "Description",
									meta: { width: "24rem" },
									cell: ({ row }) => (
										<div className="truncate text-muted-foreground">
											{row.original.description || "-"}
										</div>
									),
								},
								{
									id: "actions",
									cell: ({ row }) => (
										<div className="flex justify-end gap-2">
											<Button variant="outline" size="sm" asChild>
												<Link
													href={recordWebRoute.url({
														record: row.original,
													})}
												>
													Open
												</Link>
											</Button>
											<Button
												variant="destructive"
												size="sm"
												// onClick={() => mutateRecord(row.original, "detach")}
											>
												<Trash2Icon /> Remove
											</Button>
										</div>
									),
								},
							]}
							emptyMessage="No records found."
						/>
					</CardContent>
				</Card>
			</div>
		</>
	)
}

function MiniMetricCard({ label, value }: { label: string; value: string }) {
	return (
		<div className="rounded-lg bg-background/70 p-4 ring-1 ring-border/70">
			<p className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">{label}</p>
			<p className="mt-2 text-sm font-semibold">{value}</p>
		</div>
	)
}

function RecurrenceEditorDialog({ recurrence }: { recurrence: Recurrence }) {
	const [open, setOpen] = useState(false)
	const { mergeErrors, clearApiError, resetApiErrors, setApiErrors } = useApiFormErrors()

	const form = useForm({
		defaultValues: {
			name: recurrence.name,
			amount: recurrence.amount,
			period: recurrence.period,
		},
		onSubmit: async ({ value }) => {
			const formData = new FormData()
			formData.append("name", value.name)
			formData.append("amount", `${value.amount}`)
			formData.append("period", value.period)

			const response = await fetch(recurrenceUpdateApiRoute.url({ recurrence }), {
				method: "POST",
				body: withMethod(formData, "PUT"),
				headers: { Accept: "application/json" },
			})

			if (response.status === 422) {
				const data = await response.json().catch(() => null)
				setApiErrors((data?.errors ?? {}) as globalThis.Record<string, string[]>)
				return
			}

			if (response.ok) {
				setOpen(false)
				router.reload()
			}
		},
	})

	const handleDelete = async () => {
		const response = await fetch(recurrenceDestroyApiRoute.url({ recurrence }), {
			method: "POST",
			body: withMethod(new FormData(), "DELETE"),
			headers: { Accept: "application/json" },
		})

		if (response.ok) {
			setOpen(false)
			router.visit(recurrencesWebRoute.url())
		}
	}

	return (
		<Dialog
			open={open}
			onOpenChange={nextOpen => {
				setOpen(nextOpen)
				if (nextOpen) {
					form.reset()
					resetApiErrors()
				}
			}}
		>
			<DialogTrigger
				render={
					<Button size="lg">
						<PencilIcon /> Edit recurrence
					</Button>
				}
			/>
			<DialogContent className="sm:max-w-xl">
				<DialogHeader>
					<DialogTitle>Edit Recurrence</DialogTitle>
					<DialogDescription>
						Update the cadence or amount behind this recurring item.
					</DialogDescription>
				</DialogHeader>

				<form
					id="recurrence-edit-form"
					className="grid gap-6"
					onSubmit={event => {
						event.preventDefault()
						void form.handleSubmit()
					}}
				>
					<form.Field
						name="name"
						children={field => (
							<Field
								data-invalid={
									!!mergeErrors(field.state.meta.errors, field.name).length
								}
							>
								<FieldLabel htmlFor={field.name}>Name</FieldLabel>
								<Input
									id={field.name}
									value={field.state.value}
									onChange={event => {
										field.handleChange(event.target.value)
										clearApiError(field.name)
									}}
									aria-invalid={
										!!mergeErrors(field.state.meta.errors, field.name).length
									}
								/>
							</Field>
						)}
					/>

					<form.Field
						name="amount"
						children={field => (
							<AmountField
								id={field.name}
								label="Amount"
								value={field.state.value}
								errors={mergeErrors(field.state.meta.errors, field.name)}
								onChange={value => {
									field.handleChange(value)
									clearApiError(field.name)
								}}
							/>
						)}
					/>

					<form.Field
						name="period"
						children={field => (
							<Field>
								<FieldLabel htmlFor={field.name}>Period</FieldLabel>
								<Select
									value={field.state.value}
									onValueChange={value => {
										field.handleChange(value as Recurrence["period"])
										clearApiError(field.name)
									}}
								>
									<SelectTrigger id={field.name} className="w-full">
										<SelectValue placeholder="Select period" />
									</SelectTrigger>
									<SelectContent>
										<SelectGroup>
											<SelectItem value="month">Monthly</SelectItem>
											<SelectItem value="year">Yearly</SelectItem>
										</SelectGroup>
									</SelectContent>
								</Select>
								<FieldDescription>
									Switching periods updates how this item contributes to monthly
									planning.
								</FieldDescription>
							</Field>
						)}
					/>
				</form>

				<DialogFooter>
					<Button
						type="button"
						variant="destructive"
						className="mr-auto"
						onClick={handleDelete}
					>
						<Trash2Icon /> Delete
					</Button>
					<DialogClose
						render={
							<Button type="button" variant="outline">
								Cancel
							</Button>
						}
					/>
					<Button type="submit" form="recurrence-edit-form">
						<form.Subscribe
							selector={state => state.isSubmitting}
							children={isSubmitting =>
								isSubmitting ? <LoaderCircleIcon className="animate-spin" /> : null
							}
						/>
						Save changes
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	)
}

function toMonthlyAmount(amount: number, period: Recurrence["period"]) {
	switch (period) {
		case "year":
			return amount / 12
		default:
			return amount
	}
}

function formatRecurrencePeriod(period: Recurrence["period"]) {
	return period === "year" ? "Yearly" : "Monthly"
}
