"use client"

import { DateTime } from "luxon"
import { useEffect, useState } from "react"
import { UiIcon as IconifyIcon } from "@/components/icon"
import { MonthHeaderSlotProvider } from "@/components/layout/month-header-slot"
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
 * Persistent shell for the Overview. The title and month navigation mount once and never
 * remount on month changes, so the month heading cannot flash. The page renders content only.
 */
export default function MonthLayout({ children }: { children: React.ReactNode }) {
	const { month, year, date, setSearchParams } = useMonthParams()
	const { latest, isNavigatingBack, navigateBack } = useHistory()
	const back = latest
	const [hydrated, setHydrated] = useState(false)
	const [status, setStatus] = useState<HTMLDivElement | null>(null)
	const [controls, setControls] = useState<HTMLDivElement | null>(null)

	// Calendar labels and links use the browser date, which can differ from SSR.
	useEffect(() => setHydrated(true), [])

	const today = DateTime.now().startOf("day")
	const isCurrent = date.hasSame(today, "month")
	const isFuture = date.startOf("month") > today.startOf("month")
	const subtitle = `${isCurrent ? `Through ${today.toFormat("d MMM")}` : isFuture ? "Future month" : "Full month"} · SGD · Based on Record dates`

	const changeMonth = (next: DateTime) => {
		if (next.hasSame(date, "month")) return
		armMonthTransition(next > date ? 1 : -1)
		// Keep the Overview's selected budget across months.
		setSearchParams(previous => ({
			month: next.toFormat("MMMM"),
			year: String(next.year),
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
							<div className="min-w-0">
								<p className="text-xs font-medium text-muted-foreground">
									Monthly overview
								</p>
								<h2 className="mt-1 text-xl font-semibold tracking-tight md:text-2xl">
									<ValueSwap value={`${month} ${year}`} />
								</h2>
								<p className="mt-1 text-xs text-muted-foreground">{subtitle}</p>
								<div ref={setStatus} className="mt-3 empty:hidden" />
							</div>
							<div className="flex w-full flex-col-reverse gap-2 sm:w-fit sm:flex-row sm:items-center">
								<div ref={setControls} className="contents" />
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
											render={
												<Button
													variant="outline"
													className="flex-1 sm:w-32"
												/>
											}
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
						</div>
					</header>
				)}

				<MonthHeaderSlotProvider value={{ status, controls }}>
					{children}
				</MonthHeaderSlotProvider>
			</PageContent>
		</>
	)
}
