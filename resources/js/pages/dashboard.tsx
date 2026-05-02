import { Link, router } from "@inertiajs/react"
import { ArrowLeftIcon, ArrowRightIcon, CalendarIcon, CircleDollarSignIcon } from "lucide-react"
import { DateTime } from "luxon"
import { useEffect, useState } from "react"
import CategoriesPieChart from "@/components/charts/categories-pie"
import UsageAreaChart from "@/components/charts/usage-area"
import Icon from "@/components/icon"
import AppHeader from "@/components/layout/app-header"
import PageHeader from "@/components/layout/page-header"
import DataTable from "@/components/table/data-table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ButtonGroup } from "@/components/ui/button-group"
import {
	Card,
	CardAction,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { MonthPicker } from "@/components/ui/monthpicker"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Progress } from "@/components/ui/progress"
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select"
import QuotaCreatorDialog from "@/dialogs/quota-creator"
import QuotaEditorDialog from "@/dialogs/quota-editor"
import RecordQuotaDialog from "@/dialogs/record-quota-editor"
import { useHistory } from "@/history"
import { TABLE_WIDTHS } from "@/lib/table-widths"
import { classForCurrency, cn, formatCurrency, formatDatetime } from "@/lib/utils"
import { Category, Quota, Record } from "@/types"
import { budgetsWebRoute, dashboardWebRoute, recordWebRoute } from "@/wayfinder/routes"

type RecordExtra = {
	category: Category
	quota: Quota | null
}

type CategoryExtra = {
	children: Category[]
}

export default function DashboardPage({
	month,
	year,
	records,
	categories,
	quotas,
}: {
	month: string
	year: number
	records: (Record & RecordExtra)[]
	categories: (Category & CategoryExtra)[]
	quotas: Quota[]
}) {
	const { handlePush } = useHistory()

	const [quota, setQuota] = useState<Quota | null>(null)
	const [selected, setSelected] = useState<(Record & RecordExtra)[]>([])

	const date = DateTime.fromFormat(`${month} ${year}`, "MMMM yyyy").toJSDate()

	const setDate = (date: Date) => {
		const dt = DateTime.fromJSDate(date)
		router.visit(
			dashboardWebRoute({
				query: {
					month: dt.toFormat("MMMM"),
					year: dt.year,
				},
			}),
			{
				preserveState: true,
				preserveScroll: true,
			},
		)
	}

	const previous = () => {
		setDate(DateTime.fromJSDate(date).minus({ month: 1 }).toJSDate())
	}

	const next = () => {
		setDate(DateTime.fromJSDate(date).plus({ month: 1 }).toJSDate())
	}

	const quotaStats = quotas.map(quota => {
		const quotaRecords = records.filter(record => record.quota?.id === quota.id)
		const spent = Math.abs(
			Math.min(
				quotaRecords.reduce((acc, record) => acc + record.amount, 0),
				0,
			),
		)
		const usage =
			quota.amount === null || quota.amount === 0
				? null
				: Math.min((spent / quota.amount) * 100, 100)

		return {
			quota,
			records: quotaRecords,
			spent,
			usage,
		}
	})

	/**
	 * This effect contains code specific to the developer's dashboard workflow
	 * You can comment this out or remove it if it doesn't apply to your use case
	 */
	useEffect(() => {
		if (quotas) {
			setQuota(quotas.find(q => q.name === "Daily") ?? null)
		}
	}, [quotas])

	return (
		<>
			<AppHeader title="Dashboard" />

			<div className="container mx-auto flex flex-col gap-8 p-8">
				<PageHeader
					title={`Dashboard for ${month} ${year}`}
					subtitle="Monthly quotas and recent records overview"
					description="Monthly Overview"
					icon={CircleDollarSignIcon}
					actions={
						<ButtonGroup>
							<Button variant="outline" onClick={previous}>
								<ArrowLeftIcon />
							</Button>
							<Popover>
								<PopoverTrigger
									render={
										<Button variant="outline" className="w-32">
											<CalendarIcon className="mr-2 h-4 w-4" />
											{date ? (
												DateTime.fromJSDate(date).toFormat("MMM yyyy")
											) : (
												<span>Pick a month</span>
											)}
										</Button>
									}
								/>
								<PopoverContent className="w-auto p-0">
									<MonthPicker onMonthSelect={setDate} selectedMonth={date} />
								</PopoverContent>
							</Popover>
							<Button variant="outline" onClick={next}>
								<ArrowRightIcon />
							</Button>
						</ButtonGroup>
					}
					back={{ name: "Back to budgets", url: budgetsWebRoute.url() }}
				/>

				<div className="flex gap-8">
					<Card className="flex-1">
						<CardHeader>
							<CardTitle>Quotas</CardTitle>
							<CardAction>
								<QuotaCreatorDialog month={month} year={year} />
							</CardAction>
						</CardHeader>
						<CardContent className="grid gap-3">
							{quotaStats.map(({ quota, records: quotaRecords, spent, usage }) => (
								<div
									key={quota.id}
									className="space-y-3 rounded-lg border border-border/70 px-4 py-3"
								>
									<div className="flex items-start justify-between gap-4">
										<div className="min-w-0 space-y-1">
											<Badge
												variant="outline"
												style={{
													borderColor: quota.color,
													color: quota.color,
												}}
											>
												{quota.name}
											</Badge>
											<p className="text-xs text-muted-foreground">
												{quotaRecords.length} transaction
												{quotaRecords.length === 1 ? "" : "s"}
											</p>
										</div>
										<QuotaEditorDialog quota={quota} />
									</div>

									<div className="space-y-2">
										<div className="flex items-center justify-between gap-3 text-xs text-muted-foreground">
											<span>
												{usage !== null
													? `${Math.round(usage)}% used`
													: "No limit"}
											</span>
											<span
												className={cn(
													usage !== null && usage >= 100
														? "text-destructive"
														: null,
												)}
											>
												{formatCurrency(spent)} /{" "}
												{usage !== null
													? formatCurrency(quota.amount ?? 0)
													: "∞"}
											</span>
										</div>
										<Progress value={usage} className="h-2" />
									</div>
								</div>
							))}
						</CardContent>
					</Card>
					<Card className="flex-2">
						<CardHeader>
							<CardTitle>Spending over Time</CardTitle>
							<CardAction>
								<Select
									value={quota?.id}
									onValueChange={value =>
										setQuota(quotas.find(q => q.id === value) ?? null)
									}
								>
									<SelectTrigger className="w-32">
										<SelectValue placeholder="Select a quota" />
									</SelectTrigger>
									<SelectContent>
										<SelectGroup>
											{quotas.map(q => (
												<SelectItem
													key={q.id}
													value={q.id.toString()}
													onSelect={() => setQuota(q)}
												>
													{q.name}
												</SelectItem>
											))}
										</SelectGroup>
									</SelectContent>
								</Select>
							</CardAction>
						</CardHeader>
						<CardContent>
							<UsageAreaChart
								records={quota ? records.filter(r => r.quota?.id === quota.id) : []}
								limit={quota?.amount ?? undefined}
								start={DateTime.fromFormat(`${month} ${year}`, "MMMM yyyy").startOf(
									"month",
								)}
								end={DateTime.fromFormat(`${month} ${year}`, "MMMM yyyy").endOf(
									"month",
								)}
							/>
						</CardContent>
					</Card>
				</div>

				{quotas.length ? (
					<Card>
						<CardContent className="flex justify-center gap-2">
							{quotas.map(quota => (
								<div key={quota.id} className="flex-1">
									<p className="text-sm font-heading font-medium text-center">
										Spending for {quota.name}
									</p>
									<CategoriesPieChart
										className="mx-auto pt-4 max-h-100"
										categories={categories}
										records={records.filter(r => r.quota?.id === quota.id)}
										limit={quota.amount ?? undefined}
									/>
								</div>
							))}
						</CardContent>
					</Card>
				) : null}

				<Card>
					<CardHeader>
						<CardTitle>Monthly records</CardTitle>
						<CardDescription>
							Records for {DateTime.fromJSDate(date).toFormat("MMMM yyyy")}. Select
							records to attach to a quota.
						</CardDescription>
						<CardAction>
							<RecordQuotaDialog
								records={selected}
								quotas={quotas}
								clear={() => setSelected([])}
							/>
						</CardAction>
					</CardHeader>
					<CardContent>
						<DataTable
							data={records}
							columns={[
								{
									id: "select",
									meta: { width: TABLE_WIDTHS.CHECKBOX },
									cell: ({ row }) => (
										<div className="flex items-center justify-center">
											<Checkbox
												checked={
													!!selected.find(s => s.id === row.original.id)
												}
												onCheckedChange={value =>
													setSelected(prev =>
														value
															? [...prev, row.original]
															: prev.filter(
																	s => s.id !== row.original.id,
																),
													)
												}
											/>
										</div>
									),
								},
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
									header: "Quota",
									meta: { width: TABLE_WIDTHS.QUOTA },
									cell: ({ row }) =>
										row.original.quota ? (
											<Badge
												variant="outline"
												style={{
													borderColor: row.original.quota.color,
													color: row.original.quota.color,
												}}
											>
												{row.original.quota.name}
											</Badge>
										) : null,
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
													onClick={handlePush("Dashboard")}
												>
													Open
												</Link>
											</Button>
											{/* <Button
												variant="destructive"
												size="sm"
												onClick={() => detach(row.original)}
											>
												<Link2OffIcon /> Detach
											</Button> */}
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
