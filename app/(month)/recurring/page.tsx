"use client"

import { useLiveQuery } from "dexie-react-hooks"
import { DateTime } from "luxon"
import Link from "next/link"
import { useRef } from "react"
import { UiIcon as IconifyIcon } from "@/components/icon"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useHistory } from "@/history"
import { useMonthParams } from "@/hooks/use-month-params"
import { STALE_MONTH_CLASS, useMonthTransition } from "@/hooks/use-month-transition"
import { cn, formatCurrency, pluralize } from "@/lib/utils"
import { type RecurringCharge, recurringCharges } from "@/logic/suggestions"
import { pathRecords, pathStatements } from "@/routes"

const LANES: {
	status: RecurringCharge["status"]
	label: (current: boolean) => string
	dot: string
}[] = [
	{
		status: "late",
		label: current => (current ? "Late" : "Not charged"),
		dot: "border-destructive bg-destructive",
	},
	{ status: "due", label: () => "Coming up", dot: "border-foreground bg-background" },
	{ status: "charged", label: () => "Charged", dot: "border-creative bg-creative" },
]

/**
 * Monthly charges found from history, for the month in the shared header: one line for the
 * month with each charge on the day it lands, lanes by whether it has arrived, then every charge
 * with the months it arrived in.
 */
export default function RecurringPage() {
	const { handlePush } = useHistory()
	const { month, year, date: start } = useMonthParams()
	const contentRef = useRef<HTMLDivElement>(null)
	const key = start.toISODate() ?? ""
	const data = useLiveQuery(async () => ({ key, charges: await recurringCharges(key) }), [key])
	useMonthTransition(contentRef, data?.key ?? null)
	if (!data) return null

	const { charges } = data
	const stale = data.key !== key
	const today = DateTime.now().startOf("day")
	const current = start.hasSame(today, "month")
	const days = start.daysInMonth ?? 30
	const position = (date: DateTime) =>
		`${((Math.min(date.hasSame(start, "month") ? date.day : 1, days) - 0.5) / days) * 100}%`
	const months = Array.from({ length: 6 }, (_, i) => start.minus({ months: 5 - i }))
	const href = (charge: RecurringCharge) =>
		charge.source === "records"
			? pathRecords({ query: charge.query })
			: pathStatements({ query: charge.query })
	const note = (charge: RecurringCharge) => {
		const date = DateTime.fromISO(charge.date)
		const expected = DateTime.fromISO(charge.expected)
		if (charge.status === "charged") return `Next expected ${expected.toFormat("d MMM")}`
		if (charge.status === "late")
			return current
				? `Expected ${expected.toFormat("d MMM")}. Cancelled, or paid another way?`
				: "No charge this month"
		if (!current) return `Usually around ${date.toFormat("d MMM")}`
		return expected < today
			? `Expected ${expected.toFormat("d MMM")}, any day now`
			: `In ${pluralize(Math.round(expected.diff(today, "days").days), "day")}`
	}

	return (
		<div
			ref={contentRef}
			aria-busy={stale}
			className={cn("reveal grid gap-5 md:gap-6", stale && STALE_MONTH_CLASS)}
		>
			{charges.length === 0 ? (
				<div className="grid justify-items-center gap-2 rounded-xl border border-dashed p-10 text-center">
					<IconifyIcon
						icon="lucide:calendar-clock"
						className="size-5 text-muted-foreground"
					/>
					<p className="text-sm font-medium">No recurring charges in {month}</p>
					<p className="max-w-sm text-xs text-muted-foreground">
						A charge shows here once it has arrived about a month apart three times for
						about the same amount, in your Records or your Statements.
					</p>
				</div>
			) : (
				<>
					<Card className="min-w-0">
						<CardHeader>
							<CardTitle className="text-2xl font-semibold tracking-tight tabular-nums">
								{formatCurrency(-charges.reduce((sum, c) => sum + c.amount, 0))}
							</CardTitle>
							<CardDescription>
								a month across {pluralize(charges.length, "recurring charge")}
							</CardDescription>
						</CardHeader>
						<CardContent className="grid gap-5">
							<div className="grid gap-1.5" aria-hidden>
								<div className="relative h-8">
									<div className="absolute inset-x-0 top-1/2 h-px bg-border" />
									{current ? (
										<div
											className="absolute inset-y-1 w-px bg-foreground"
											style={{ left: position(today) }}
										/>
									) : null}
									{charges.map(charge => (
										<span
											key={charge.key}
											title={`${charge.label}, ${formatCurrency(-charge.amount)}`}
											className={cn(
												"absolute top-1/2 size-3 -translate-x-1/2 -translate-y-1/2 rounded-full border-2",
												LANES.find(l => l.status === charge.status)?.dot,
											)}
											style={{
												left: position(DateTime.fromISO(charge.date)),
											}}
										/>
									))}
								</div>
								<div className="flex justify-between text-[0.6875rem] text-muted-foreground tabular-nums">
									<span>1 {start.toFormat("MMM")}</span>
									<span>
										{days} {start.toFormat("MMM")}
									</span>
								</div>
							</div>
							<div className="grid gap-5 @3xl/page:grid-cols-3">
								{LANES.map(lane => {
									const list = charges.filter(c => c.status === lane.status)
									return (
										<section
											key={lane.status}
											className="grid content-start gap-1"
											aria-label={lane.label(current)}
										>
											<h3 className="flex items-center gap-1.5 border-b pb-2 text-xs font-medium text-muted-foreground">
												<span
													className={cn(
														"size-2 rounded-full border-2",
														lane.dot,
													)}
												/>
												{lane.label(current)}
												<span className="tabular-nums">{list.length}</span>
											</h3>
											{list.length ? (
												<ul className="grid">
													{list.map(charge => {
														const date = DateTime.fromISO(charge.date)
														return (
															<li key={charge.key}>
																<Link
																	onClick={handlePush(
																		"Recurring charges",
																	)}
																	href={href(charge)}
																	className="-mx-2 grid grid-cols-[2rem_minmax(0,1fr)_auto] items-center gap-2 rounded-lg px-2 py-1.5 transition-colors duration-150 ease-out hover:bg-muted/50"
																>
																	<span className="grid justify-items-center leading-none">
																		<span className="text-sm font-semibold tabular-nums">
																			{date.day}
																		</span>
																		<span className="text-[0.6875rem] text-muted-foreground uppercase">
																			{date.toFormat("MMM")}
																		</span>
																	</span>
																	<span className="min-w-0">
																		<span className="block truncate text-sm font-medium">
																			{charge.label}
																		</span>
																		<span className="block text-xs text-muted-foreground">
																			{note(charge)}
																		</span>
																	</span>
																	<span className="text-sm tabular-nums">
																		{formatCurrency(
																			-charge.amount,
																		)}
																	</span>
																</Link>
															</li>
														)
													})}
												</ul>
											) : (
												<p className="py-1.5 text-xs text-muted-foreground">
													None
												</p>
											)}
										</section>
									)
								})}
							</div>
						</CardContent>
					</Card>

					<Card className="min-w-0">
						<CardHeader>
							<CardTitle>Every charge</CardTitle>
							<CardDescription>
								The months each charge arrived in, up to {month} {year}.
							</CardDescription>
						</CardHeader>
						<CardContent>
							<ul className="grid divide-y" aria-label="Every recurring charge">
								{charges
									.toSorted((a, b) => a.amount - b.amount)
									.map(charge => {
										const history = charge.history.map(d => DateTime.fromISO(d))
										const first = history[0]
										return (
											<li key={charge.key}>
												<Link
													onClick={handlePush("Recurring charges")}
													href={href(charge)}
													className="-mx-2 grid grid-cols-[minmax(0,1fr)_auto] items-center gap-x-4 gap-y-1.5 rounded-lg px-2 py-2.5 transition-colors duration-150 ease-out hover:bg-muted/50 @xl/page:grid-cols-[minmax(0,1fr)_auto_6rem]"
												>
													<span className="min-w-0">
														<span className="block truncate text-sm font-medium">
															{charge.label}
														</span>
														<span className="block text-xs text-muted-foreground">
															Usually around the{" "}
															{DateTime.fromISO(
																charge.expected,
															).toFormat("d")}
															{ordinal(
																DateTime.fromISO(charge.expected)
																	.day,
															)}
														</span>
													</span>
													<span
														className="col-span-2 row-start-2 flex gap-1 @xl/page:col-span-1 @xl/page:row-start-1 @xl/page:col-start-2"
														role="img"
														aria-label={`Charged in ${months.filter(m => history.some(d => d.hasSame(m, "month"))).length} of the last 6 months`}
													>
														{months.map(m => {
															const charged = history.some(d =>
																d.hasSame(m, "month"),
															)
															const before =
																!first || m < first.startOf("month")
															// The month's charge may simply not be due yet.
															const waiting =
																m.hasSame(start, "month") &&
																charge.status === "due"
															return (
																<span
																	key={m.toISODate()}
																	title={`${m.toFormat("MMM yyyy")}: ${charged ? "charged" : before ? "before it began" : waiting ? "coming up" : "not charged"}`}
																	className="grid justify-items-center gap-0.5"
																>
																	<span
																		className={cn(
																			"size-3 rounded-[3px] border",
																			charged
																				? "border-creative bg-creative"
																				: before
																					? "border-dashed border-border"
																					: waiting
																						? "border-foreground/60"
																						: "border-destructive/60",
																		)}
																	/>
																	<span className="text-[0.6875rem] text-muted-foreground">
																		{m.toFormat("MMMMM")}
																	</span>
																</span>
															)
														})}
													</span>
													<span className="col-start-2 row-start-1 text-right text-sm font-medium tabular-nums @xl/page:col-start-3">
														{formatCurrency(-charge.amount)}
													</span>
												</Link>
											</li>
										)
									})}
							</ul>
						</CardContent>
					</Card>
				</>
			)}
		</div>
	)
}

function ordinal(day: number) {
	if (day % 100 >= 11 && day % 100 <= 13) return "th"
	return ["th", "st", "nd", "rd"][day % 10] ?? "th"
}
