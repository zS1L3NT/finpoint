import { Link } from "@inertiajs/react"
import { CalendarSyncIcon } from "lucide-react"
import DetailCard from "@/components/detail-card"
import AppHeader from "@/components/layout/app-header"
import PageHeader from "@/components/layout/page-header"
import PaginatedDataTable from "@/components/table/paginated-data-table"
import { Button } from "@/components/ui/button"
import {
	Card,
	CardAction,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card"
import RecurrenceCreatorDialog from "@/dialogs/recurrence-creator"
import usePaginatedTableState from "@/hooks/use-paginated-table-state"
import { TABLE_WIDTHS } from "@/lib/table-widths"
import { classForCurrency, cn, formatCurrency, round2dp } from "@/lib/utils"
import { Paginated, Recurrence } from "@/types"
import { recurrencesWebRoute, recurrenceWebRoute } from "@/wayfinder/routes"

type RecurrenceOverview = Recurrence & {
	records_count: number
}

type BreakdownSlice = RecurrenceOverview & {
	monthlyAmount: number
	percentage: number
	stroke: string
	dasharray: string
	dashoffset: string
}

const RECURRENCE_COLORS = [
	"var(--color-chart-1)",
	"var(--color-chart-2)",
	"var(--color-chart-3)",
	"var(--color-chart-4)",
	"var(--color-chart-5)",
]

export default function RecurrencesPage({
	recurrences,
	breakdown,
}: {
	recurrences: Paginated<RecurrenceOverview>
	breakdown: RecurrenceOverview[]
}) {
	const { query, pageSize, handleQueryChange, handlePageSizeChange } = usePaginatedTableState({
		syncOn: recurrences,
		buildUrl: query => recurrencesWebRoute({ query }).url,
	})

	const slices = buildBreakdownSlices(breakdown)
	const monthlyTotal = slices.reduce((sum, recurrence) => sum + recurrence.monthlyAmount, 0)
	const yearlyTotal = monthlyTotal * 12
	const linkedRecordCount = breakdown.reduce(
		(sum, recurrence) => sum + recurrence.records_count,
		0,
	)

	return (
		<>
			<AppHeader title="Recurrences" />

			<div className="container mx-auto flex flex-col gap-8 p-8">
				<PageHeader
					title="Recurrences"
					subtitle="See your recurring commitments as a monthly breakdown, then dive into the records that support each pattern."
					description="Recurring spend map"
					icon={CalendarSyncIcon}
					actions={<RecurrenceCreatorDialog />}
				/>

				<div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
					<DetailCard label="Recurrences" value={breakdown.length} />
					<DetailCard label="Monthly run-rate" value={formatCurrency(monthlyTotal)} />
					<DetailCard label="Annualised" value={formatCurrency(yearlyTotal)} />
					<DetailCard label="Linked records" value={linkedRecordCount} />
				</div>

				<Card className="border border-border/70 bg-linear-to-br from-card via-card to-muted/30 py-0">
					<CardHeader className="border-b py-4">
						<CardDescription>Monthly breakdown</CardDescription>
						<CardTitle>Where your money is going</CardTitle>
						<CardAction className="text-sm text-muted-foreground">
							{formatCurrency(monthlyTotal)} / month
						</CardAction>
					</CardHeader>

					<CardContent className="grid gap-6 py-6 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
						<RecurrencePieChart slices={slices} monthlyTotal={monthlyTotal} />

						<div className="flex flex-col gap-3">
							{slices.length ? (
								slices.map(slice => (
									<div
										key={slice.id}
										className="rounded-lg bg-background/70 p-3 ring-1 ring-border/70"
									>
										<div className="flex items-start justify-between gap-3">
											<div className="min-w-0">
												<div className="flex items-center gap-2">
													<span
														className="size-2.5 rounded-full"
														style={{
															backgroundColor: slice.stroke,
														}}
													/>
													<p className="truncate font-medium">
														{slice.name}
													</p>
												</div>
												<p className="mt-1 text-xs text-muted-foreground">
													{slice.period[0].toUpperCase() +
														slice.period.slice(1)}{" "}
													• {slice.records_count} linked record
													{slice.records_count === 1 ? "" : "s"}
												</p>
											</div>
											<div className="text-right">
												<p className="font-semibold">
													{formatCurrency(slice.monthlyAmount)}
												</p>
												<p className="text-xs text-muted-foreground">
													{slice.percentage.toFixed(1)}%
												</p>
											</div>
										</div>
									</div>
								))
							) : (
								<div className="rounded-lg border border-dashed border-border/70 bg-background/60 p-6 text-center text-sm text-muted-foreground">
									Create a recurrence to see your monthly breakdown.
								</div>
							)}
						</div>
					</CardContent>
				</Card>

				<div className="flex flex-col gap-1">
					<h3 className="text-xl font-semibold tracking-tight">Recurring items</h3>
					<p className="text-sm text-muted-foreground">
						Open a recurrence to inspect and attach records.
					</p>
				</div>

				<PaginatedDataTable
					paginated={recurrences}
					columns={[
						{
							header: "Recurrence",
							meta: { width: TABLE_WIDTHS.RECURRENCE },
							cell: ({ row }) => (
								<div className="flex items-center gap-2">
									<p className="truncate font-medium">{row.original.name}</p>
								</div>
							),
						},
						{
							header: "Monthly",
							meta: { width: TABLE_WIDTHS.RECURRENCE_MONTHLY },
							cell: ({ row }) => (
								<span
									className={cn(
										classForCurrency(row.original.amount),
										row.original.period === "year" ? "opacity-50" : null,
									)}
								>
									{formatCurrency(
										round2dp(
											row.original.period === "month"
												? row.original.amount
												: row.original.amount / 12,
										),
									)}
								</span>
							),
						},
						{
							header: "Yearly",
							meta: { width: TABLE_WIDTHS.RECURRENCE_YEARLY },
							cell: ({ row }) => (
								<span
									className={cn(
										classForCurrency(row.original.amount),
										row.original.period === "month" ? "opacity-50" : null,
									)}
								>
									{formatCurrency(
										round2dp(
											row.original.period === "year"
												? row.original.amount
												: row.original.amount * 12,
										),
									)}
								</span>
							),
						},
						{
							id: "actions",
							cell: ({ row }) => (
								<div className="flex justify-end">
									<Button variant="outline" size="sm" asChild>
										<Link
											href={recurrenceWebRoute.url({
												recurrence: row.original,
											})}
										>
											Open
										</Link>
									</Button>
								</div>
							),
						},
					]}
					header={{
						query,
						onQueryChange: handleQueryChange,
						pageSize,
						onPageSizeChange: handlePageSizeChange,
						searchPlaceholder: "Search recurrences...",
					}}
					footer={{
						summary: `Showing ${recurrences.data.length} of ${recurrences.total} recurrences.`,
					}}
					emptyMessage="No recurrences found."
				/>
			</div>
		</>
	)
}

function RecurrencePieChart({
	slices,
	monthlyTotal,
}: {
	slices: BreakdownSlice[]
	monthlyTotal: number
}) {
	return (
		<div className="flex flex-col items-center gap-4">
			<div className="relative flex size-72 items-center justify-center">
				<svg viewBox="0 0 120 120" className="size-full -rotate-90">
					<circle
						cx="60"
						cy="60"
						r="42"
						fill="none"
						stroke="color-mix(in oklch, var(--color-border) 65%, transparent)"
						strokeWidth="14"
					/>
					{slices.map(slice => (
						<circle
							key={slice.id}
							cx="60"
							cy="60"
							r="42"
							fill="none"
							stroke={slice.stroke}
							strokeWidth="14"
							strokeLinecap="round"
							strokeDasharray={slice.dasharray}
							strokeDashoffset={slice.dashoffset}
						/>
					))}
				</svg>

				<div className="absolute inset-0 flex flex-col items-center justify-center text-center">
					<p className="text-xs uppercase tracking-[0.22em] text-muted-foreground">
						Monthly total
					</p>
					<p className="mt-2 text-2xl font-semibold">{formatCurrency(monthlyTotal)}</p>
				</div>
			</div>

			<p className="max-w-xs text-center text-sm text-muted-foreground">
				Weekly and yearly recurrences are normalized into a monthly view so you can compare
				them side by side.
			</p>
		</div>
	)
}

function buildBreakdownSlices(recurrences: RecurrenceOverview[]) {
	const monthlyTotal = recurrences.reduce(
		(sum, recurrence) => sum + toMonthlyAmount(recurrence.amount, recurrence.period),
		0,
	)

	let offset = 0

	return recurrences.map((recurrence, index) => {
		const monthlyAmount = round2dp(toMonthlyAmount(recurrence.amount, recurrence.period))
		const percentage = monthlyTotal === 0 ? 0 : (monthlyAmount / monthlyTotal) * 100
		const circumference = 2 * Math.PI * 42
		const segmentLength = (percentage / 100) * circumference

		const slice = {
			...recurrence,
			monthlyAmount,
			percentage,
			stroke: RECURRENCE_COLORS[index % RECURRENCE_COLORS.length],
			dasharray: `${segmentLength} ${circumference - segmentLength}`,
			dashoffset: `${-offset}`,
		}

		offset += segmentLength
		return slice
	})
}

function toMonthlyAmount(amount: number, period: Recurrence["period"]) {
	switch (period) {
		case "year":
			return amount / 12
		default:
			return amount
	}
}
