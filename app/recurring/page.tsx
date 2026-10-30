"use client"

import { useLiveQuery } from "dexie-react-hooks"
import { motion } from "framer-motion"
import { DateTime } from "luxon"
import Link from "next/link"
import { UiIcon } from "@/components/icon"
import PageContent from "@/components/layout/page-content"
import PageHeader from "@/components/layout/page-header"
import { useHistory } from "@/history"
import { cardEnter } from "@/lib/motion"
import { cn, formatCurrency, pluralize } from "@/lib/utils"
import { type RecurringCharge, recurringCharges } from "@/logic/suggestions"
import { pathStatements } from "@/routes"

type Status = "late" | "due" | "charged"

const GROUPS: { status: Status; label: string; icon: string; dot: string }[] = [
	{
		status: "late",
		label: "Late",
		icon: "lucide:circle-alert",
		dot: "border-destructive bg-destructive",
	},
	{
		status: "due",
		label: "Coming up",
		icon: "lucide:circle-dashed",
		dot: "border-foreground bg-background",
	},
	{
		status: "charged",
		label: "Charged this month",
		icon: "lucide:circle-check",
		dot: "border-creative bg-creative",
	},
]

export default function RecurringPage() {
	const { handlePush } = useHistory()
	const charges = useLiveQuery(() => recurringCharges(), [])

	const today = DateTime.now().startOf("day")
	const days = today.daysInMonth ?? 30
	// A charge is placed by when it lands this month: when it was charged, else when it is due.
	const items = (charges ?? []).map(charge => {
		const last = DateTime.fromISO(charge.last)
		const status: Status = last.hasSame(today, "month")
			? "charged"
			: charge.overdue
				? "late"
				: "due"
		const date = status === "charged" ? last : DateTime.fromISO(charge.expected)
		return { charge, status, date }
	})
	const total = items.reduce((sum, item) => sum + item.charge.amount, 0)

	return (
		<PageContent>
			<PageHeader
				title="Recurring charges"
				subtitle="Statements that arrive about once a month for a steady amount, found from your history."
				description="Monthly charges"
				icon="lucide:calendar-clock"
			/>

			{charges === undefined ? null : charges.length === 0 ? (
				<motion.div
					{...cardEnter(0)}
					className="grid justify-items-center gap-2 rounded-xl border border-dashed p-10 text-center"
				>
					<UiIcon icon="lucide:calendar-clock" className="size-5 text-muted-foreground" />
					<p className="text-sm font-medium">No recurring charges found yet</p>
					<p className="max-w-sm text-xs text-muted-foreground">
						A charge shows here once it has arrived three months in a row for about the
						same amount.
					</p>
				</motion.div>
			) : (
				<>
					<motion.section
						{...cardEnter(0)}
						aria-label={`${today.toFormat("MMMM")} at a glance`}
						className="grid gap-4"
					>
						<p className="text-sm text-muted-foreground">
							<span className="text-2xl font-semibold tracking-tight text-foreground tabular-nums">
								{formatCurrency(-total)}
							</span>{" "}
							a month across {pluralize(items.length, "charge")}
						</p>

						{/* The month as one line: each charge sits on the day it lands. */}
						<div className="grid gap-1.5">
							<div className="relative h-8">
								<div className="absolute inset-x-0 top-1/2 h-px bg-border" />
								<div
									className="absolute inset-y-0 left-0 top-1/2 h-px bg-foreground/40"
									style={{ width: `${((today.day - 0.5) / days) * 100}%` }}
								/>
								<div
									className="absolute inset-y-1 w-px bg-foreground"
									style={{ left: `${((today.day - 0.5) / days) * 100}%` }}
									title={`Today, ${today.toFormat("d MMM")}`}
								/>
								{items.map(({ charge, status, date }) => (
									<span
										key={charge.key}
										title={`${charge.label}, ${formatCurrency(-charge.amount)} · ${date.toFormat("d MMM")}`}
										className={cn(
											"absolute top-1/2 size-3 -translate-x-1/2 -translate-y-1/2 rounded-full border-2",
											GROUPS.find(g => g.status === status)?.dot,
										)}
										style={{
											left: `${((Math.min(date.day, days) - 0.5) / days) * 100}%`,
										}}
									/>
								))}
							</div>
							<div className="flex justify-between text-[0.6875rem] text-muted-foreground tabular-nums">
								<span>1 {today.toFormat("MMM")}</span>
								<span>
									{days} {today.toFormat("MMM")}
								</span>
							</div>
						</div>
					</motion.section>

					{GROUPS.map(group => {
						const list = items
							.filter(item => item.status === group.status)
							.sort((a, b) => a.date.toMillis() - b.date.toMillis())
						if (!list.length) return null
						return (
							<section
								key={group.status}
								className="grid gap-1"
								aria-labelledby={`recurring-${group.status}`}
							>
								<h2
									id={`recurring-${group.status}`}
									className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground"
								>
									<span
										className={cn("size-2 rounded-full border-2", group.dot)}
									/>
									{group.label}
									<span className="tabular-nums">{list.length}</span>
								</h2>
								<ul className="grid">
									{list.map(({ charge, date }, index) => (
										<motion.li key={charge.key} {...cardEnter(index)}>
											<Link
												onClick={handlePush("Recurring charges")}
												href={pathStatements({ query: charge.query })}
												className="grid grid-cols-[3rem_minmax(0,1fr)_auto] items-center gap-3 rounded-lg px-2 py-2 transition-colors duration-150 ease-out hover:bg-muted/50"
											>
												<span className="grid justify-items-center leading-none">
													<span className="text-lg font-semibold tracking-tight tabular-nums">
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
														{chargeNote(charge, group.status, today)}
													</span>
												</span>
												<span className="text-sm font-medium tabular-nums">
													{formatCurrency(-charge.amount)}
												</span>
											</Link>
										</motion.li>
									))}
								</ul>
							</section>
						)
					})}
				</>
			)}
		</PageContent>
	)
}

function chargeNote(charge: RecurringCharge, status: Status, today: DateTime) {
	const expected = DateTime.fromISO(charge.expected)
	if (status === "charged") return `Next expected ${expected.toFormat("d MMM")}`
	if (status === "late")
		return `Expected ${expected.toFormat("d MMM")}, ${pluralize(Math.round(today.diff(expected, "days").days), "day")} late. Cancelled, or paid another way?`
	return expected < today
		? `Expected ${expected.toFormat("d MMM")}, any day now`
		: `In ${pluralize(Math.round(expected.diff(today, "days").days), "day")}`
}
