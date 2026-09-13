import { DateTime } from "luxon"
import { Link, Outlet, useLocation } from "react-router-dom"
import { UiIcon as IconifyIcon } from "@/components/icon"
import AppHeader from "@/components/layout/app-header"
import PageContent from "@/components/layout/page-content"
import { Button } from "@/components/ui/button"
import { ButtonGroup } from "@/components/ui/button-group"
import { MonthPicker } from "@/components/ui/monthpicker"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { useMonthParams } from "@/hooks/use-month-params"
import { cn } from "@/lib/utils"
import { pathDashboard, pathMonthlyRecords, pathRecords } from "@/routes"

/**
 * Persistent shell for the Overview / Monthly Records tabs. The title, month
 * navigation, and tabs mount once and never remount on tab switches, so the
 * month heading cannot flash. Pages below the Outlet render content only.
 */
export default function MonthLayout() {
	const { month, year, date, setSearchParams } = useMonthParams()
	const location = useLocation()
	const isMonthly = location.pathname.startsWith("/records/")

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
		const monthName = next.toFormat("MMMM")
		const yearValue = String(next.year)
		if (isMonthly) {
			setSearchParams(previous => {
				const params = new URLSearchParams(previous)
				params.set("month", monthName)
				params.set("year", yearValue)
				params.delete("day")
				return params
			})
		} else {
			setSearchParams({ month: monthName, year: yearValue })
		}
	}

	return (
		<>
			<AppHeader title={isMonthly ? "Monthly Records" : "Dashboard"} />
			<PageContent className={isMonthly ? "gap-5 md:gap-7" : "gap-7 md:gap-9"}>
				<header className="grid gap-5">
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
							<Link
								className={cn(
									"border-b-2 px-4 py-2 text-sm hover:text-foreground",
									isMonthly
										? "border-transparent text-muted-foreground"
										: "border-foreground font-medium",
								)}
								to={pathDashboard({ month, year: String(year) })}
							>
								Overview
							</Link>
							<Link
								className={cn(
									"border-b-2 px-4 py-2 text-sm hover:text-foreground",
									isMonthly
										? "border-foreground font-medium"
										: "border-transparent text-muted-foreground",
								)}
								to={pathMonthlyRecords({ month, year: String(year) })}
							>
								Monthly Records
							</Link>
						</nav>
						{isMonthly ? (
							<Button
								variant="outline"
								className="h-9 w-full sm:mb-2 sm:h-7 sm:w-auto"
								asChild
							>
								<Link
									to={pathRecords({
										start_date: date.startOf("month").toISODate() ?? undefined,
										end_date: date.endOf("month").toISODate() ?? undefined,
									})}
								>
									Open in Records <IconifyIcon icon="lucide:arrow-up-right" />
								</Link>
							</Button>
						) : null}
					</div>
				</header>

				<Outlet />
			</PageContent>
		</>
	)
}
