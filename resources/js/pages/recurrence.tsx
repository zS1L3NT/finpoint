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
import AppHeader from "@/components/app-header"
import DetailCard from "@/components/detail-card"
import AmountField from "@/components/form/amount-field"
import Icon from "@/components/icon"
import PageHeader from "@/components/page-header"
import RecordSearch from "@/components/record-search"
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
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table"
import useApiFormErrors from "@/hooks/use-api-form-errors"
import { currencyClass, round2dp, toCurrency, toDatetime, withMethod } from "@/lib/utils"
import { Category, Record, Recurrence } from "@/types"
import { record as recordRoute, recurrences as recurrencesRoute } from "@/wayfinder/routes"
import {
	destroy as destroyRecurrence,
	update as updateRecurrence,
} from "@/wayfinder/routes/recurrences"
import {
	update as attachRecurrenceRecord,
	destroy as detachRecurrenceRecord,
} from "@/wayfinder/routes/recurrences/records"

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
					? attachRecurrenceRecord.url({ recurrence: recurrence.id, record: record.id })
					: detachRecurrenceRecord.url({ recurrence: recurrence.id, record: record.id })

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
						url: recurrencesRoute.url(),
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
								description="Search existing records and link them to this recurring pattern."
								emptyTitle="Everything is already linked"
								emptyDescription="Try another search term if the record you want is not showing yet."
								filter={record =>
									!recurrence.records.some(attached => attached.id === record.id)
								}
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

				<Card className="py-0">
					<CardHeader className="border-b py-4">
						<CardTitle>Linked records</CardTitle>
						<CardDescription>
							Records currently associated with this recurring item.
						</CardDescription>
					</CardHeader>

					<CardContent className="p-0">
						<Table>
							<TableHeader>
								<TableRow>
									<TableHead className="w-40">Date &amp; Time</TableHead>
									<TableHead className="w-28">Amount</TableHead>
									<TableHead>Record</TableHead>
									<TableHead className="w-40">Category</TableHead>
									<TableHead className="w-36">Actions</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{recurrence.records.length ? (
									recurrence.records.map(record => {
										const details = [
											record.people ? `w/ ${record.people}` : null,
											record.location ? `@ ${record.location}` : null,
										]
											.filter(Boolean)
											.join(" ")

										return (
											<TableRow key={record.id}>
												<TableCell className="text-muted-foreground">
													{toDatetime(record.datetime)}
												</TableCell>
												<TableCell>
													<span className={currencyClass(record.amount)}>
														{toCurrency(record.amount)}
													</span>
												</TableCell>
												<TableCell>
													<div className="flex items-start gap-3">
														<Icon {...record.category} size={16} />
														<div className="min-w-0">
															<p className="truncate font-medium">
																{record.title}
															</p>
															<p className="truncate text-muted-foreground">
																{details ||
																	record.description ||
																	"No extra context"}
															</p>
														</div>
													</div>
												</TableCell>
												<TableCell className="text-muted-foreground">
													{record.category.name}
												</TableCell>
												<TableCell>
													<div className="flex items-center gap-2">
														<Button variant="outline" size="sm" asChild>
															<Link
																href={recordRoute.url({ record })}
															>
																Open
															</Link>
														</Button>
														<Button
															variant="destructive"
															size="sm"
															onClick={() =>
																void mutateRecord(record, "detach")
															}
															disabled={isMutatingRecords}
														>
															<Trash2Icon /> Remove
														</Button>
													</div>
												</TableCell>
											</TableRow>
										)
									})
								) : (
									<TableRow>
										<TableCell
											colSpan={5}
											className="h-24 text-center text-muted-foreground"
										>
											No records linked to this recurrence yet.
										</TableCell>
									</TableRow>
								)}
							</TableBody>
						</Table>
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

			const response = await fetch(updateRecurrence.url({ recurrence: recurrence.id }), {
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
		const response = await fetch(destroyRecurrence.url({ recurrence: recurrence.id }), {
			method: "POST",
			body: withMethod(new FormData(), "DELETE"),
			headers: { Accept: "application/json" },
		})

		if (response.ok) {
			setOpen(false)
			router.visit(recurrencesRoute.url())
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
											<SelectItem value="week">Weekly</SelectItem>
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
		case "week":
			return (amount * 52) / 12
		case "year":
			return amount / 12
		default:
			return amount
	}
}

function formatRecurrencePeriod(period: Recurrence["period"]) {
	return period === "week" ? "Weekly" : period === "year" ? "Yearly" : "Monthly"
}
