import { Link, router } from "@inertiajs/react"
import { CalendarSyncIcon, PlusIcon, RepeatIcon, Trash2Icon } from "lucide-react"
import DetailCard from "@/components/detail-card"
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
import RecurrenceEditorDialog from "@/dialogs/recurrence-editor"
import { useHistory } from "@/history"
import { TABLE_WIDTHS } from "@/lib/table-widths"
import { classForCurrency, formatCurrency, formatDatetime, round2dp, withMethod } from "@/lib/utils"
import { Category, Record, Recurrence } from "@/types"
import {
	recordWebRoute,
	recurrenceRecordAttachApiRoute,
	recurrenceRecordDetachApiRoute,
	recurrencesWebRoute,
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
	const { handlePush } = useHistory()

	const monthlyAmount = round2dp(toMonthlyAmount(recurrence.amount, recurrence.period))
	const yearlyAmount = round2dp(monthlyAmount * 12)

	const mutateRecord = async (record: Record, mode: "attach" | "detach") => {
		const route =
			mode === "attach"
				? recurrenceRecordAttachApiRoute.url({ recurrence, record })
				: recurrenceRecordDetachApiRoute.url({ recurrence, record })

		const response = await fetch(route, {
			method: "POST",
			body: mode === "attach" ? undefined : withMethod(new FormData(), "DELETE"),
			headers: { Accept: "application/json" },
		})

		if (response.ok) {
			router.reload()
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
					<DetailCard label="Entered amount" value={formatCurrency(recurrence.amount)} />
					<DetailCard label="Monthly equivalent" value={formatCurrency(monthlyAmount)} />
					<DetailCard label="Annualised" value={formatCurrency(yearlyAmount)} />
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
											{formatCurrency(monthlyAmount)}
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
									value={formatCurrency(recurrence.amount)}
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
								filters={{ exclude_recurrence_id: recurrence.id }}
								handler={record => mutateRecord(record, "attach")}
								trigger={
									<Button className="w-full" size="lg">
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
									meta: { width: TABLE_WIDTHS.RECORD },
									cell: ({ row }) => (
										<div className="flex items-center gap-3">
											<Icon {...row.original.category} size={16} />
											<div className="flex-1 overflow-hidden">
												<p className="truncate font-medium">
													{row.original.title}
												</p>
												<p className="truncate text-muted-foreground">
													{row.original.subtitle || "No extra context"}
												</p>
											</div>
										</div>
									),
								},
								{
									header: "Amount",
									meta: { width: TABLE_WIDTHS.AMOUNT },
									cell: ({ row }) => (
										<span className={classForCurrency(row.original.amount)}>
											{formatCurrency(row.original.amount)}
										</span>
									),
								},
								{
									header: "Date & Time",
									meta: { width: TABLE_WIDTHS.DATETIME },
									cell: ({ row }) => formatDatetime(row.original.datetime),
								},
								{
									header: "Description",
									meta: { width: TABLE_WIDTHS.DESCRIPTION },
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
													onClick={handlePush(
														`Recurrence ${recurrence.id}`,
													)}
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
