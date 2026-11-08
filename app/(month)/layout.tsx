"use client"

import { DateTime } from "luxon"
import { usePathname } from "next/navigation"
import { useEffect, useState } from "react"
import DevDataToggle from "@/components/dev-data-toggle"
import { UiIcon as IconifyIcon } from "@/components/icon"
import PageContent from "@/components/layout/page-content"
import { Button } from "@/components/ui/button"
import { ButtonGroup } from "@/components/ui/button-group"
import { MonthPicker } from "@/components/ui/monthpicker"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import ValueSwap from "@/components/value-swap"
import { useHistory } from "@/history"
import { useMonthParams } from "@/hooks/use-month-params"
import { armMonthTransition } from "@/hooks/use-month-transition"

/**
 * Persistent Dashboard shell. The title and month navigation stay mounted
 * while the selected month changes.
 */
export default function MonthLayout({ children }: { children: React.ReactNode }) {
	const [monthPickerOpen, setMonthPickerOpen] = useState(false)
	const { month, year, date, setSearchParams } = useMonthParams()
	const pathname = usePathname()

	const { latest, isNavigatingBack, navigateBack } = useHistory()
	const [hydrated, setHydrated] = useState(false)

	// Calendar labels and links use the browser date, which can differ from SSR.
	useEffect(() => setHydrated(true), [])

	const today = DateTime.now().startOf("day")
	const [backPath, backQuery] = latest?.url.split("?") ?? []
	const backParams = new URLSearchParams(backQuery)
	const back =
		backPath === pathname &&
		(backParams.get("month") ?? today.toFormat("MMMM")) === month &&
		Number(backParams.get("year") ?? today.year) === year
			? null
			: latest
	const isCurrent = date.hasSame(today, "month")
	const isFuture = date.startOf("month") > today.startOf("month")
	const subtitle = `${isCurrent ? `Through ${today.toFormat("d MMM")}` : isFuture ? "Future month" : "Full month"} · SGD · Based on Record dates`

	const changeMonth = (next: DateTime) => {
		if (next.hasSame(date, "month")) return
		armMonthTransition(next > date ? 1 : -1)
		const monthName = next.toFormat("MMMM")
		const yearValue = String(next.year)
		setSearchParams(previous => ({
			month: monthName,
			year: yearValue,
			scope: previous.get("scope") ?? undefined,
		}))
	}

	return (
		<>
			<PageContent className="gap-7 md:gap-9">
				{hydrated && (
					<header className="grid gap-5">
						{back ? (
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
										isNavigatingBack
											? "lucide:loader-circle"
											: "lucide:arrow-left"
									}
									className={isNavigatingBack ? "animate-spin" : undefined}
								/>
								<span className="truncate">Back to {back.name}</span>
							</Button>
						) : null}
						<div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
							<div>
								<p className="text-xs font-medium text-muted-foreground">
									Dashboard
								</p>
								<h2 className="mt-1 text-xl font-semibold tracking-tight md:text-2xl">
									<ValueSwap value={`${month} ${year}`} />
								</h2>
								<p className="mt-1 text-xs text-muted-foreground">{subtitle}</p>
							</div>
							<ButtonGroup className="w-full sm:w-fit">
								<Button
									variant="outline"
									aria-label="Previous month"
									onClick={() => changeMonth(date.minus({ month: 1 }))}
								>
									<IconifyIcon icon="lucide:arrow-left" />
								</Button>
								<Popover open={monthPickerOpen} onOpenChange={setMonthPickerOpen}>
									<PopoverTrigger
										render={
											<Button variant="outline" className="flex-1 sm:w-32" />
										}
									>
										<IconifyIcon icon="lucide:calendar" />{" "}
										{date.toFormat("MMM yyyy")}
									</PopoverTrigger>
									<PopoverContent className="w-auto p-0">
										<MonthPicker
											selectedMonth={date.toJSDate()}
											onMonthSelect={value => {
												setMonthPickerOpen(false)
												changeMonth(DateTime.fromJSDate(value))
											}}
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
					</header>
				)}

				{children}
			</PageContent>
			<DevDataToggle />
		</>
	)
}
