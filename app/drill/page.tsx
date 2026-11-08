"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { DrillPanel } from "@/components/drill/panel"
import { useDrill } from "@/hooks/use-drill"
import { useMonthParams } from "@/hooks/use-month-params"
import { pathDashboard } from "@/routes"

/** The drill-down as its own page: the same URL state as the Dashboard overlay, opened full size. */
export default function DrillPage() {
	const drill = useDrill()
	const router = useRouter()
	const { month, year } = useMonthParams()
	const scope = useSearchParams().get("scope") ?? "all"
	if (!drill.selection) return null
	return (
		<DrillPanel
			page
			selection={drill.selection}
			focus={drill.focus}
			pivot={drill.pivot}
			month={month}
			year={year}
			scope={scope}
			onScope={value =>
				router.push(pathDashboard({ month, year: String(year), scope: value }))
			}
			close={drill.close}
			place={drill.place}
		/>
	)
}
