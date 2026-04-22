import { Link, router } from "@inertiajs/react"
import { useForm } from "@tanstack/react-form"
import {
	LoaderCircleIcon,
	PencilIcon,
	PiggyBankIcon,
	PlusIcon,
	SparklesIcon,
	Trash2Icon,
} from "lucide-react"
import { DateTime } from "luxon"
import { useState } from "react"
import AppHeader from "@/components/app-header"
import DetailCard from "@/components/detail-card"
import AmountField from "@/components/form/amount-field"
import TextField from "@/components/form/text-field"
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
import { Field, FieldDescription, FieldLabel } from "@/components/ui/field"
import { Progress } from "@/components/ui/progress"
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table"
import useApiFormErrors from "@/hooks/use-api-form-errors"
import { cn, currencyClass, round2dp, toCurrency, toDatetime, withMethod } from "@/lib/utils"
import { Budget, Category, Record } from "@/types"
import { budgets as budgetsRoute, record as recordRoute } from "@/wayfinder/routes"
import { destroy as destroyBudget, update as updateBudget } from "@/wayfinder/routes/budgets"
import {
	update as attachBudgetRecord,
	destroy as detachBudgetRecord,
} from "@/wayfinder/routes/budgets/records"

type BudgetExtra = {
	records: (Record & RecordExtra)[]
	records_sum_amount: number | null
	records_count: number
}

type RecordExtra = {
	category: Category
}

export default function BudgetPage({ budget }: { budget: Budget & BudgetExtra }) {
	const [isMutatingRecords, setIsMutatingRecords] = useState(false)

	const spent = Math.abs(Math.min(budget.records_sum_amount ?? 0, 0))
	const remaining = round2dp(budget.amount - spent)
	const usage = budget.amount === 0 ? 0 : Math.min((spent / budget.amount) * 100, 100)
	const start = DateTime.fromFormat(budget.start_date, "yyyy-MM-dd")
	const end = DateTime.fromFormat(budget.end_date, "yyyy-MM-dd")

	const mutateRecord = async (record: Record, mode: "attach" | "detach") => {
		setIsMutatingRecords(true)

		try {
			const route =
				mode === "attach"
					? attachBudgetRecord.url({ budget: budget.id, record: record.id })
					: detachBudgetRecord.url({ budget: budget.id, record: record.id })

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
			<AppHeader title="Budget" />

			<div className="container mx-auto flex flex-col gap-8 p-8">
				<PageHeader
					title={budget.name}
					subtitle="Manage the spending window, review attached records, and fine-tune what this budget tracks."
					description="Budget details"
					icon={PiggyBankIcon}
					actions={<BudgetEditorDialog budget={budget} />}
					back={{ name: "Back to budgets", url: budgetsRoute.url() }}
				/>

				<div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
					<DetailCard label="Planned" value={toCurrency(budget.amount)} />
					<DetailCard
						label="Spent"
						value={toCurrency(-spent)}
						valueClassName={currencyClass(-spent)}
					/>
					<DetailCard
						label="Remaining"
						value={toCurrency(remaining)}
						valueClassName={remaining < 0 ? "text-destructive" : undefined}
					/>
					<DetailCard label="Records" value={budget.records_count} />
					<DetailCard
						label="Mode"
						value={budget.automatic ? "Automatic attach" : "Manual attach"}
					/>
				</div>

				<div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
					<Card className="border border-border/70 bg-linear-to-br from-card via-card to-muted/30 py-0">
						<CardHeader className="border-b py-4">
							<CardDescription>Usage</CardDescription>
							<CardTitle className="text-xl">How this budget is tracking</CardTitle>
							<CardAction className="text-sm text-muted-foreground">
								{start.toFormat("d MMM yyyy")} to {end.toFormat("d MMM yyyy")}
							</CardAction>
						</CardHeader>

						<CardContent className="space-y-5 py-6">
							<div className="space-y-2">
								<div className="flex items-center justify-between text-sm">
									<span>{Math.round(usage)}% used</span>
									<span className="text-muted-foreground">
										{toCurrency(-spent)} of {toCurrency(budget.amount)}
									</span>
								</div>
								<Progress value={usage} className="h-3" />
							</div>

							<div className="grid gap-3 md:grid-cols-3">
								<UsagePanel
									label="Healthy pace"
									value={remaining >= 0 ? "On track" : "Over budget"}
									tone={remaining >= 0 ? "good" : "danger"}
								/>
								<UsagePanel
									label="Linked records"
									value={`${budget.records.length} attached`}
									tone="neutral"
								/>
								<UsagePanel
									label="Rule"
									value={
										budget.automatic
											? "Auto-pulls in-range records"
											: "Curated manually"
									}
									tone="neutral"
								/>
							</div>
						</CardContent>
					</Card>

					<Card className="border border-border/70 py-0">
						<CardHeader className="border-b py-4">
							<CardDescription>Record attachment</CardDescription>
							<CardTitle>Keep the budget scoped</CardTitle>
						</CardHeader>

						<CardContent className="flex flex-col gap-4 py-6">
							<div className="rounded-xl border border-dashed border-border/80 bg-muted/20 p-4">
								<p className="font-medium">Suggested attachment rule</p>
								<p className="mt-1 text-sm text-muted-foreground">
									This picker only suggests records inside the budget period that
									are not already attached.
								</p>
							</div>

							<RecordSearch
								title="Attach record to budget"
								description="Find an existing record within this budget window and attach it here."
								emptyTitle="No eligible records found"
								emptyDescription="Only records inside the budget range and not already attached appear here."
								filter={record =>
									isRecordWithinBudgetRange(
										record,
										budget.start_date,
										budget.end_date,
									) && !budget.records.some(attached => attached.id === record.id)
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

							<div className="flex items-center justify-between rounded-lg bg-background px-3 py-2 text-xs text-muted-foreground ring-1 ring-border">
								<span>
									{budget.automatic
										? "New in-range records may attach automatically"
										: "Attachments stay manual"}
								</span>
								{budget.automatic ? <SparklesIcon className="size-3.5" /> : null}
							</div>
						</CardContent>
					</Card>
				</div>

				<Card className="py-0">
					<CardHeader className="border-b py-4">
						<CardTitle>Attached records</CardTitle>
						<CardDescription>
							Records that currently contribute to this budget.
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
								{budget.records.length ? (
									budget.records.map(record => {
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
											No records attached to this budget yet.
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

function UsagePanel({
	label,
	value,
	tone,
}: {
	label: string
	value: string
	tone: "good" | "danger" | "neutral"
}) {
	return (
		<div className="rounded-lg bg-background/70 p-4 ring-1 ring-border/70">
			<p className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">{label}</p>
			<p
				className={cn(
					"mt-2 text-sm font-semibold",
					tone === "good"
						? "text-green-600"
						: tone === "danger"
							? "text-destructive"
							: "text-foreground",
				)}
			>
				{value}
			</p>
		</div>
	)
}

function BudgetEditorDialog({ budget }: { budget: Budget }) {
	const [open, setOpen] = useState(false)
	const { mergeErrors, clearApiError, resetApiErrors, setApiErrors } = useApiFormErrors()

	const form = useForm({
		defaultValues: {
			name: budget.name,
			amount: budget.amount,
			automatic: budget.automatic,
		},
		onSubmit: async ({ value }) => {
			const formData = new FormData()
			formData.append("name", value.name)
			formData.append("amount", `${value.amount}`)
			if (value.automatic) {
				formData.append("automatic", "on")
			}

			const response = await fetch(updateBudget.url({ budget: budget.id }), {
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
		const response = await fetch(destroyBudget.url({ budget: budget.id }), {
			method: "POST",
			body: withMethod(new FormData(), "DELETE"),
			headers: { Accept: "application/json" },
		})

		if (response.ok) {
			setOpen(false)
			router.visit(budgetsRoute.url())
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
						<PencilIcon /> Edit budget
					</Button>
				}
			/>
			<DialogContent className="sm:max-w-2xl">
				<DialogHeader>
					<DialogTitle>Edit Budget</DialogTitle>
					<DialogDescription>
						Update the target spend or switch between automatic and manual record
						assignment.
					</DialogDescription>
				</DialogHeader>

				<form
					id="budget-edit-form"
					className="grid gap-6"
					onSubmit={event => {
						event.preventDefault()
						void form.handleSubmit()
					}}
				>
					<div className="grid gap-4 md:grid-cols-2">
						<form.Field
							name="name"
							children={field => (
								<TextField
									id={field.name}
									label="Name"
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
							name="amount"
							children={field => (
								<AmountField
									id={field.name}
									label="Amount"
									value={field.state.value}
									min={0}
									errors={mergeErrors(field.state.meta.errors, field.name)}
									onChange={value => {
										field.handleChange(value)
										clearApiError(field.name)
									}}
								/>
							)}
						/>
					</div>

					<form.Field
						name="automatic"
						children={field => (
							<Field orientation="horizontal">
								<Checkbox
									checked={field.state.value}
									onCheckedChange={checked =>
										field.handleChange(checked === true)
									}
									id={field.name}
								/>
								<div className="space-y-1">
									<FieldLabel htmlFor={field.name}>Automatic attach</FieldLabel>
									<FieldDescription>
										When enabled, updates will also pull in records that fall
										inside the budget date range.
									</FieldDescription>
								</div>
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
					<Button type="submit" form="budget-edit-form">
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
