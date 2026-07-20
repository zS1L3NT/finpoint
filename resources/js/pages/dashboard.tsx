import { Icon as IconifyIcon } from "@iconify/react"
import { router } from "@inertiajs/react"
import { DateTime } from "luxon"
import { useEffect, useState } from "react"
import CategoriesPieChart from "@/components/charts/categories-pie"
import UsageAreaChart from "@/components/charts/usage-area"
import QuotaCreatorDialog from "@/components/dialogs/quota-creator"
import QuotaEditorDialog from "@/components/dialogs/quota-editor"
import RecordQuotaDialog from "@/components/dialogs/record-quota-editor"
import AppHeader from "@/components/layout/app-header"
import PageContent from "@/components/layout/page-content"
import PageHeader from "@/components/layout/page-header"
import LimiterPaceCards, { getLimitAggregations } from "@/components/limiter-pace-cards"
import DataTable from "@/components/table/data-table"
import { useRecordColumns, useRecordMobileRow } from "@/components/table/record-columns"
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
import {
	DropdownMenu,
	DropdownMenuCheckboxItem,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
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
import { useFetch } from "@/hooks/use-fetch"
import { useSearchParam } from "@/hooks/use-search-param"
import { TABLE_WIDTH_CLASSNAMES } from "@/lib/table-width-classnames"
import { cn, formatCurrency, formatDatetime, parseDatetime, withMethod } from "@/lib/utils"
import { CategoryWithChildren, Quota, Record } from "@/types"
import {
	budgetsWebRoute,
	categoryIndexApiRoute,
	dashboardWebRoute,
	recordQuotaDetachApiRoute,
} from "@/wayfinder/routes"

export default function DashboardPage({ records, quotas }: { records: Record[]; quotas: Quota[] }) {
	const categories = useFetch<CategoryWithChildren[]>(categoryIndexApiRoute.url(), [])
	const now = DateTime.now()

	const [month] = useSearchParam("month", now.toFormat("MMMM"))
	const [year] = useSearchParam("year", now.toFormat("yyyy"))
	const [queryParam, setQueryParam] = useSearchParam("query")
	const [quotaIdsParam, setQuotaIdsParam] = useSearchParam("quota_ids")
	const [showNoQuotaParam, setShowNoQuotaParam] = useSearchParam("show_no_quotas")

	const date = DateTime.fromFormat(`${month} ${year}`, "MMMM yyyy")
	const query = queryParam ?? ""
	const quotaIds = quotaIdsParam?.split(",").filter(Boolean) ?? []
	const showNoQuota = showNoQuotaParam === "true"
	const monthStart = date.startOf("month")
	const monthEnd = date.endOf("month")
	const monthAsOf = date.hasSame(now, "month") ? now : monthEnd

	const [selected, setSelected] = useState<Record[]>([])
	const [areaQuota, setAreaQuota] = useState<Quota | null>(null)
	const [editingQuotaId, setEditingQuotaId] = useState<string | null>(null)
	const [isCreatingQuota, setIsCreatingQuota] = useState(false)
	const [isAttachingQuota, setIsAttachingQuota] = useState(false)

	const selectedWithQuota = selected.filter(r => r.quota)
	const quotaStats = quotas.map(quota => {
		const quotaRecords = records.filter(record => record.quota?.id === quota.id)
		const spent = Math.abs(
			Math.min(
				quotaRecords.reduce((acc, record) => acc + record.amount, 0),
				0,
			),
		)
		const usage =
			quota.amount === null || quota.amount === 0 ? null : (spent / quota.amount) * 100

		return {
			quota,
			records: quotaRecords,
			spent,
			usage,
		}
	})

	const filteredRecords = (
		quotaIds.length || showNoQuota
			? records.filter(r => (r.quota ? quotaIds.includes(r.quota.id) : showNoQuota))
			: records
	).filter(r =>
		[
			r.title,
			r.subtitle,
			r.description,
			r.quota?.name,
			formatCurrency(r.amount),
			formatDatetime(r.datetime),
		]
			.filter(Boolean)
			.some(value => value?.toLowerCase().includes(query.toLowerCase())),
	)
	const activeQuotaFilters = quotas.filter(quota => quotaIds.includes(quota.id))
	const quotaFilterLabel = showNoQuota
		? activeQuotaFilters.length
			? `${activeQuotaFilters.length + 1} selected`
			: "No quota"
		: activeQuotaFilters.length === 1
			? activeQuotaFilters[0].name
			: activeQuotaFilters.length > 1
				? `${activeQuotaFilters.length} selected`
				: null

	/**
	 * These variables contain code specific to the developer's dashboard workflow
	 * You can comment this out or remove it if it doesn't apply to your use case
	 */
	const dailyQuota = quotas.find(q => q.name === "Daily")
	const limitAggregations = getLimitAggregations(
		records.filter(r => r.quota?.id === dailyQuota?.id),
		monthStart,
		monthEnd,
		dailyQuota?.amount ?? 0,
		monthAsOf,
	)

	useEffect(() => {
		const validIds = quotaIds.filter(id => quotas.some(quota => quota.id === id))
		const nextQuotaIdsParam = validIds.length ? validIds.join(",") : null

		if ((quotaIdsParam ?? null) !== nextQuotaIdsParam) {
			setQuotaIdsParam(nextQuotaIdsParam)
		}
	}, [quotas, quotaIds, quotaIdsParam, setQuotaIdsParam])

	/**
	 * This effect ensures that if a record is selected and then filtered out (either by the search query or quota filters),
	 * it will be deselected. This prevents the user from trying to perform actions on records that are not currently visible,
	 * which could lead to confusion or errors.
	 */
	useEffect(() => {
		setSelected(prev =>
			prev.every(record => filteredRecords.some(r => r.id === record.id))
				? prev
				: prev.filter(record => filteredRecords.some(r => r.id === record.id)),
		)
	}, [filteredRecords])

	/**
	 * This effect contains code specific to the developer's dashboard workflow
	 * You can comment this out or remove it if it doesn't apply to your use case
	 */
	useEffect(() => {
		setAreaQuota(dailyQuota ?? null)
	}, [dailyQuota])

	const setDate = (nextDate: Date) => {
		const dt = DateTime.fromJSDate(nextDate)
		router.visit(
			dashboardWebRoute({
				query: {
					month: dt.toFormat("MMMM"),
					year: dt.year,
					query: queryParam || undefined,
					quota_ids: quotaIdsParam || undefined,
					show_no_quotas: showNoQuotaParam || undefined,
				},
			}),
			{
				preserveState: true,
				preserveScroll: true,
			},
		)
	}

	const detach = async () => {
		if (!selectedWithQuota.length) {
			return
		}

		const responses = await Promise.all(
			selectedWithQuota.map(record =>
				fetch(recordQuotaDetachApiRoute({ record }).url, {
					method: "POST",
					body: withMethod(new FormData(), "DELETE"),
					headers: { Accept: "application/json" },
				}),
			),
		)

		if (responses.every(response => response.ok)) {
			setSelected([])

			setTimeout(() => {
				router.reload()
			}, 300)
		}
	}

	const recordColumns = useRecordColumns<Record>({
		showQuota: true,
		pageName: "Dashboard",
	})
	const recordMobileRow = useRecordMobileRow<Record>({
		showQuota: true,
		pageName: "Dashboard",
		mobileVariant: "dashboard",
		leading: record => (
			<Checkbox
				checked={!!selected.find(s => s.id === record.id)}
				aria-label={`Select record ${record.id}`}
				onCheckedChange={value =>
					setSelected(prev =>
						value === true ? [...prev, record] : prev.filter(s => s.id !== record.id),
					)
				}
			/>
		),
	})

	return (
		<>
			<AppHeader title="Dashboard" />

			<PageContent>
				<PageHeader
					title={`Dashboard for ${month} ${year}`}
					subtitle="Monthly quotas and recent records overview"
					description="Monthly Overview"
					icon="lucide:circle-dollar-sign"
					actions={
						<ButtonGroup className="w-full sm:w-fit">
							<Button
								variant="outline"
								onClick={() => setDate(date.minus({ month: 1 }).toJSDate())}
							>
								<IconifyIcon icon="lucide:arrow-left" />
							</Button>
							<Popover>
								<PopoverTrigger
									render={
										<Button variant="outline" className="flex-1 sm:w-32">
											<IconifyIcon
												icon="lucide:calendar"
												className="mr-2 h-4 w-4"
											/>
											{date.toFormat("MMM yyyy")}
										</Button>
									}
								/>
								<PopoverContent className="w-auto p-0">
									<MonthPicker
										onMonthSelect={setDate}
										selectedMonth={date.toJSDate()}
									/>
								</PopoverContent>
							</Popover>
							<Button
								variant="outline"
								onClick={() => setDate(date.plus({ month: 1 }).toJSDate())}
							>
								<IconifyIcon icon="lucide:arrow-right" />
							</Button>
						</ButtonGroup>
					}
					back={{ name: "Back to budgets", url: budgetsWebRoute.url() }}
				/>

				{dailyQuota && (
					<LimiterPaceCards
						name="daily quota"
						limit={dailyQuota?.amount ?? 0}
						{...limitAggregations}
					/>
				)}

				<div className="grid gap-6 md:grid-cols-[minmax(0,1fr)_minmax(0,2fr)] md:gap-8">
					<Card>
						<CardHeader>
							<CardTitle>Quotas</CardTitle>
							<CardAction>
								<QuotaCreatorDialog
									month={month}
									year={+year}
									isOpen={isCreatingQuota}
									setIsOpen={setIsCreatingQuota}
									trigger={
										<Button size="sm">
											<IconifyIcon icon="lucide:plus" /> Create Quota
										</Button>
									}
								/>
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
												{quotaRecords.length} record
												{quotaRecords.length === 1 ? "" : "s"}
											</p>
										</div>
										<QuotaEditorDialog
											quota={quota}
											isOpen={editingQuotaId === quota.id}
											setIsOpen={isOpen =>
												setEditingQuotaId(isOpen ? quota.id : null)
											}
											trigger={
												<Button variant="outline" size="sm">
													<IconifyIcon icon="lucide:pencil" /> Edit
												</Button>
											}
										/>
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
												{formatCurrency(spent)}
												{" / "}
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
					<Card>
						<CardHeader>
							<CardTitle>Spending over Time</CardTitle>
							<CardAction>
								<Select
									value={areaQuota?.id}
									onValueChange={value =>
										setAreaQuota(quotas.find(q => q.id === value) ?? null)
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
													onSelect={() => setAreaQuota(q)}
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
								className="h-64 aspect-auto md:h-auto md:aspect-video"
								records={
									areaQuota
										? records.filter(r => r.quota?.id === areaQuota.id)
										: []
								}
								start={DateTime.fromFormat(`${month} ${year}`, "MMMM yyyy").startOf(
									"month",
								)}
								end={DateTime.fromFormat(`${month} ${year}`, "MMMM yyyy").endOf(
									"month",
								)}
								maxY={Math.max(
									areaQuota?.amount ?? 0,
									quotaStats.find(q => q.quota.id === areaQuota?.id)?.spent ?? 0,
								)}
								limit={areaQuota?.amount ?? undefined}
								asOfDate={monthAsOf}
							/>
						</CardContent>
					</Card>
				</div>

				{quotas.length ? (
					<Card>
						<CardContent className="grid gap-x-4 gap-y-8 sm:grid-cols-2 xl:grid-cols-3">
							{quotas.map(quota => (
								<div
									key={quota.id}
									className="flex min-w-0 flex-col items-center gap-3"
								>
									<p className="text-sm font-heading font-medium text-center">
										Spending for {quota.name}
									</p>
									<CategoriesPieChart
										className="w-full"
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
							Records for {date.toFormat("MMMM yyyy")}. Select records to attach to a
							quota.
						</CardDescription>
					</CardHeader>
					<CardContent>
						<DataTable
							header={
								<div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
									<div className="w-full md:max-w-sm">
										<Input
											placeholder="Filter records..."
											value={query}
											onChange={event =>
												setQueryParam(event.target.value || null)
											}
										/>
									</div>
									<div className="flex flex-col gap-2 sm:flex-row md:flex-wrap md:justify-end">
										{quotas.length ? (
											<DropdownMenu>
												<DropdownMenuTrigger asChild>
													<Button
														type="button"
														variant={
															quotaFilterLabel
																? "secondary"
																: "outline"
														}
														className="w-full sm:w-auto"
													>
														<IconifyIcon icon="lucide:list-filter" />{" "}
														Filter quotas
														{quotaFilterLabel ? (
															<Badge variant="outline">
																{quotaFilterLabel}
															</Badge>
														) : null}
													</Button>
												</DropdownMenuTrigger>
												<DropdownMenuContent align="end" className="w-56">
													<DropdownMenuLabel>
														Filter by quota
													</DropdownMenuLabel>
													<DropdownMenuSeparator />
													<DropdownMenuGroup>
														<DropdownMenuCheckboxItem
															checked={showNoQuota}
															onSelect={event =>
																event.preventDefault()
															}
															onCheckedChange={checked =>
																setShowNoQuotaParam(
																	checked === true
																		? "true"
																		: null,
																)
															}
														>
															No quota
														</DropdownMenuCheckboxItem>
													</DropdownMenuGroup>
													<DropdownMenuSeparator />
													<DropdownMenuGroup>
														{quotas.map(quota => (
															<DropdownMenuCheckboxItem
																key={quota.id}
																checked={quotaIds.includes(
																	quota.id,
																)}
																onSelect={event =>
																	event.preventDefault()
																}
																onCheckedChange={checked =>
																	setQuotaIdsParam(
																		(checked === true
																			? [
																					...quotaIds.filter(
																						id =>
																							id !==
																							quota.id,
																					),
																					quota.id,
																				]
																			: quotaIds.filter(
																					id =>
																						id !==
																						quota.id,
																				)
																		).join(",") || null,
																	)
																}
															>
																{quota.name}
															</DropdownMenuCheckboxItem>
														))}
													</DropdownMenuGroup>
												</DropdownMenuContent>
											</DropdownMenu>
										) : null}
										<RecordQuotaDialog
											records={selected}
											quotas={quotas}
											clear={() => setSelected([])}
											isOpen={isAttachingQuota}
											setIsOpen={setIsAttachingQuota}
											trigger={
												<Button
													disabled={!selected.length}
													className="w-full sm:w-auto"
												>
													<IconifyIcon icon="lucide:link-2" /> Attach to
													Quota
												</Button>
											}
										/>
										<Button
											type="button"
											disabled={!selectedWithQuota.length}
											onClick={() => void detach()}
											className="w-full sm:w-auto"
										>
											<IconifyIcon icon="lucide:link-2-off" />
											Detach from Quota
										</Button>
									</div>
								</div>
							}
							data={filteredRecords}
							columns={[
								{
									id: "select",
									meta: { width: TABLE_WIDTH_CLASSNAMES.CHECKBOX },
									header: () => (
										<div className="flex items-center justify-center">
											<Checkbox
												checked={
													selected.length !== filteredRecords.length
														? selected.length
															? "indeterminate"
															: false
														: true
												}
												onCheckedChange={value =>
													setSelected(
														value !== true ? [] : filteredRecords,
													)
												}
											/>
										</div>
									),
									cell: ({ row }) => (
										<div className="flex items-center justify-center">
											<Checkbox
												checked={
													!!selected.find(s => s.id === row.original.id)
												}
												onCheckedChange={value =>
													setSelected(prev =>
														value === true
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
								...recordColumns,
							]}
							getRowClassName={row =>
								!filteredRecords[row.index + 1] ||
								parseDatetime(filteredRecords[row.index].datetime)
									.startOf("day")
									.toMillis() ===
									parseDatetime(filteredRecords[row.index + 1].datetime)
										.startOf("day")
										.toMillis()
									? "border-0"
									: ""
							}
							selectedIds={selected.map(s => s.id)}
							mobileRow={recordMobileRow}
							emptyMessage="No records found."
						/>
					</CardContent>
				</Card>
			</PageContent>
		</>
	)
}
