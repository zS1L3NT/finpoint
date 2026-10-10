"use client"

import { motion } from "framer-motion"
import { DateTime } from "luxon"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { UiIcon as IconifyIcon } from "@/components/icon"
import PageContent from "@/components/layout/page-content"
import { Button } from "@/components/ui/button"
import { ButtonGroup } from "@/components/ui/button-group"
import { MonthPicker } from "@/components/ui/monthpicker"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { useHistory } from "@/history"
import { useMonthParams } from "@/hooks/use-month-params"
import { armMonthTransition } from "@/hooks/use-month-transition"
import { SPRING } from "@/lib/motion"
import { cn } from "@/lib/utils"
import { pathDashboard, pathMonthlyRecords } from "@/routes"

/**
 * Persistent shell for the Overview / Monthly Records tabs. The title, month
 * navigation, and tabs mount once and never remount on tab switches, so the
 * month heading cannot flash. Pages below the Outlet render content only.
 */
export default function MonthLayout({ children }: { children: React.ReactNode }) {
	const { month, year, date, setSearchParams } = useMonthParams()
	const pathname = usePathname()
	const { latest, isNavigatingBack, navigateBack, handleClear } = useHistory()
	const back = latest?.url.split("?")[0] === pathDashboard() ? latest : null
	const isMonthly = pathname.startsWith("/records/")

	const today = DateTime.now().startOf("day")
	const isCurrent = date.hasSame(today, "month")
	const isFuture = date.startOf("month") > today.startOf("month")
	const through = isCurrent ? today.toFormat("yyyy-MM-dd") : null
	const subtitle = isMonthly
		? isCurrent && through
			? `Actuals through ${DateTime.fromISO(through).toFormat("d MMM")}`
			: isFuture
				? "Future-dated Records"
				: "Full month"
		: `${isCurrent ? `Through ${today.toFormat("d MMM")}` : isFuture ? "Future month" : "Full month"} · SGD · Based on Record dates`

	const changeMonth = (next: DateTime) => {
		if (next.hasSame(date, "month")) return
		armMonthTransition(next > date ? 1 : -1)
		const monthName = next.toFormat("MMMM")
		const yearValue = String(next.year)
		if (isMonthly) {
			setSearchParams(previous => {
				const params = new URLSearchParams(previous)
				params.set("month", monthName)
				params.set("year", yearValue)
				params.delete("day")
				params.delete("start_date")
				params.delete("end_date")
				return params
			})
		} else {
			setSearchParams({ month: monthName, year: yearValue })
		}
	}

	return (
		<>
			<PageContent className={isMonthly ? "gap-5 md:gap-7" : "gap-7 md:gap-9"}>
				<header className="grid gap-5">
					{isMonthly && back ? (
						<Button
							type="button"
							variant="outline"
							size="sm"
							className="w-fit max-w-full self-start"
							disabled={isNavigatingBack}
							aria-busy={isNavigatingBack}
							onClick={() => navigateBack(back)}
						>
							<IconifyIcon
								icon={
									isNavigatingBack ? "lucide:loader-circle" : "lucide:arrow-left"
								}
								className={isNavigatingBack ? "animate-spin" : undefined}
							/>
							Back to {back.name}
						</Button>
					) : null}
					<div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
						<div>
							<p className="text-xs font-medium tracking-[0.18em] text-muted-foreground uppercase">
								{isMonthly ? "Monthly Records" : "Monthly overview"}
							</p>
							<h2 className="mt-1 text-3xl font-semibold tracking-tight">
								{month} {year}
							</h2>
							<p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>
						</div>
						<ButtonGroup className="w-full sm:w-fit">
							<Button
								variant="outline"
								aria-label="Previous month"
								onClick={() => changeMonth(date.minus({ month: 1 }))}
							>
								<IconifyIcon icon="lucide:arrow-left" />
							</Button>
							<Popover>
								<PopoverTrigger
									render={<Button variant="outline" className="flex-1 sm:w-32" />}
								>
									<IconifyIcon icon="lucide:calendar" />{" "}
									{date.toFormat("MMM yyyy")}
								</PopoverTrigger>
								<PopoverContent className="w-auto p-0">
									<MonthPicker
										selectedMonth={date.toJSDate()}
										onMonthSelect={value =>
											changeMonth(DateTime.fromJSDate(value))
										}
									/>
								</PopoverContent>
							</Popover>
							<Button
								variant="outline"
								aria-label="Next month"
								onClick={() => changeMonth(date.plus({ month: 1 }))}
							>
								<IconifyIcon icon="lucide:arrow-right" />
							</Button>
						</ButtonGroup>
					</div>

					<div className="flex flex-col gap-3 sm:flex-row sm:items-end">
						<nav
							className="flex min-w-0 border-b sm:flex-1"
							aria-label="Monthly finance views"
						>
							{(
								[
									[
										"Overview",
										false,
										pathDashboard({ month, year: String(year) }),
									],
									[
										"Monthly Records",
										true,
										pathMonthlyRecords({ month, year: String(year) }),
									],
								] as const
							).map(([label, monthly, href]) => {
								const active = monthly === isMonthly
								return (
									<Link
										key={label}
										className={cn(
											"relative px-4 py-2 text-sm transition-colors duration-150 ease-out hover:text-foreground",
											active ? "font-medium" : "text-muted-foreground",
										)}
										href={href}
										onClick={handleClear}
									>
										{label}
										{active ? (
											<motion.span
												layoutId="month-tab-indicator"
												transition={SPRING.snappy}
												className="absolute inset-x-0 bottom-0 h-0.5 bg-foreground"
											/>
										) : null}
									</Link>
								)
							})}
						</nav>
					</div>
				</header>

				{children}
			</PageContent>
		</>
	)
}
