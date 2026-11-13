"use client"

import { useLiveQuery } from "dexie-react-hooks"
import { DateTime } from "luxon"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect, useRef, useState } from "react"
import { UiIcon as IconifyIcon } from "@/components/icon"
import DataTable from "@/components/table/data-table"
import { useRecordColumns, useRecordMobileRow } from "@/components/table/record-columns"
import { byDay } from "@/components/table/row-groups"
import { Button } from "@/components/ui/button"
import {
	Sheet,
	SheetContent,
	SheetDescription,
	SheetHeader,
	SheetTitle,
} from "@/components/ui/sheet"
import { useMonthParams } from "@/hooks/use-month-params"
import { type RecordsSheetFilters, useRecordsSheet } from "@/hooks/use-records-sheet"
import { treatmentLabel } from "@/lib/analytics"
import { pluralize } from "@/lib/utils"
import { listCategories } from "@/logic/categories"
import { getMonthlyRecords } from "@/logic/monthly"
import { pathRecords } from "@/routes"
import type { AnalyticsTreatment, Record } from "@/types"

const byRecordDay = byDay<Record>("Record")

/** The Records behind whatever was clicked on the Dashboard, without leaving it. */
export default function RecordsSheet() {
	const router = useRouter()
	const { month, year } = useMonthParams()
	const { filters, close } = useRecordsSheet()
	const categories = useLiveQuery(() => listCategories(), [])
	const columns = useRecordColumns<Record>({
		pageName: "Dashboard",
		grouped: true,
		showMonthlyBudget: true,
	})
	const mobileRow = useRecordMobileRow<Record>({
		pageName: "Dashboard",
		grouped: true,
	})

	// Keep the last filters while the sheet slides out, so its content does not blank mid-exit.
	const key = filters ? JSON.stringify(filters) : null
	const [shownKey, setShownKey] = useState(key)
	if (key !== null && key !== shownKey) setShownKey(key)
	const shown: RecordsSheetFilters | null = shownKey ? JSON.parse(shownKey) : null

	// A sheet opened from the Dashboard pushed a history entry, so closing pops it; one that
	// was already open on load has nothing to pop and is closed in place.
	const opened = useRef(false)
	const wasOpen = useRef(!!filters)
	useEffect(() => {
		opened.current = !!filters && (opened.current || !wasOpen.current)
		wasOpen.current = !!filters
	}, [!!filters])
	const dismiss = () => (opened.current ? router.back() : close())

	const start = shown?.start_date ? DateTime.fromISO(shown.start_date) : null
	const end = shown?.end_date ? DateTime.fromISO(shown.end_date) : null
	const at = start?.isValid ? start : DateTime.fromFormat(`${month} ${year}`, "MMMM yyyy")
	const data = useLiveQuery(
		() =>
			shown
				? getMonthlyRecords(at.toFormat("MMMM"), at.year, {
						category_ids: shown.category_ids,
						is_allocated: shown.is_allocated,
						monthly_budget_id: shown.monthly_budget_id,
						show_unbudgeted: shown.show_unbudgeted === "true",
						effective_spending: shown.effective_spending === "true",
						treatment: shown.treatment,
						start_date: shown.start_date,
						end_date: shown.end_date,
					}).catch(() => null)
				: null,
		[shownKey, month, year],
	)

	const categoryIds = shown?.category_ids?.split(",") ?? []
	const title =
		[
			...(categories ?? [])
				.flatMap(category => [category, ...category.children])
				.filter(category => categoryIds.includes(category.id))
				.map(category => category.name),
			data?.monthlyBudget?.name,
			shown?.show_unbudgeted === "true" ? "Unbudgeted" : null,
			shown?.treatment ? treatmentLabel(shown.treatment as AnalyticsTreatment) : null,
			shown?.is_allocated === "false" ? "Pending" : null,
		]
			.filter(Boolean)
			.join(" · ") || "Records"
	const period =
		start?.isValid &&
		end?.isValid &&
		!(start.day === 1 && end.hasSame(end.endOf("month"), "day"))
			? start.hasSame(end, "day")
				? start.toFormat("cccc, d MMMM yyyy")
				: `${start.toFormat("d MMM")} – ${end.toFormat("d MMM yyyy")}`
			: at.toFormat("MMMM yyyy")
	const records = data?.records ?? []
	const later = data?.future_records ?? []

	return (
		<Sheet open={!!filters} onOpenChange={isOpen => !isOpen && dismiss()}>
			<SheetContent side="right" className="gap-0 md:data-[side=right]:max-w-xl">
				<SheetHeader className="gap-1 border-b p-4 pr-12 md:px-6">
					<SheetTitle className="text-base">{title}</SheetTitle>
					<SheetDescription>
						{period}
						{data ? ` · ${pluralize(records.length + later.length, "Record")}` : ""}
					</SheetDescription>
				</SheetHeader>
				<div className="grid min-h-0 flex-1 content-start gap-5 overflow-y-auto p-4 md:px-6">
					{data === null ? (
						<p className="text-muted-foreground">These Records could not be loaded.</p>
					) : data ? (
						<>
							{records.length ? (
								<DataTable
									data={records}
									columns={columns}
									mobileRow={mobileRow}
									groupBy={byRecordDay}
								/>
							) : later.length ? null : (
								<p className="text-muted-foreground">No matching Records</p>
							)}
							{later.length ? (
								<section className="grid gap-3">
									<div>
										<h3 className="text-sm font-semibold">
											{data.period.is_future
												? "Future-dated Records"
												: "Later this month"}
										</h3>
										<p className="text-muted-foreground">
											Excluded from actual totals.
										</p>
									</div>
									<div className="opacity-80">
										<DataTable
											data={later}
											columns={columns}
											mobileRow={mobileRow}
											groupBy={byRecordDay}
										/>
									</div>
								</section>
							) : null}
						</>
					) : null}
				</div>
				<div className="border-t p-4 md:px-6">
					<Button variant="outline" size="sm" asChild>
						<Link
							href={pathRecords({
								start_date:
									shown?.start_date ??
									at.startOf("month").toISODate() ??
									undefined,
								end_date:
									shown?.end_date ?? at.endOf("month").toISODate() ?? undefined,
								category_ids: shown?.category_ids,
								is_allocated: shown?.is_allocated,
								monthly_budget_id: shown?.monthly_budget_id,
								show_unbudgeted: shown?.show_unbudgeted,
								treatment: shown?.treatment,
							})}
						>
							Open in Records <IconifyIcon icon="lucide:arrow-up-right" />
						</Link>
					</Button>
				</div>
			</SheetContent>
		</Sheet>
	)
}
