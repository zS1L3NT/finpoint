"use client"

import { usePathname } from "next/navigation"
import { useEffect } from "react"
import AppHeader from "@/components/layout/app-header"
import { useMonthParams } from "@/hooks/use-month-params"

const TITLES: { match: (pathname: string) => boolean; title: string }[] = [
	{ match: pathname => pathname === "/", title: "Dashboard" },
	{ match: pathname => pathname.startsWith("/records/monthly"), title: "Monthly Records" },
	{ match: pathname => pathname.startsWith("/records/"), title: "Record" },
	{ match: pathname => pathname.startsWith("/records"), title: "Records" },
	{ match: pathname => pathname.startsWith("/statements/"), title: "Statement" },
	{ match: pathname => pathname.startsWith("/statements"), title: "Statements" },
	{ match: pathname => pathname.startsWith("/accounts/"), title: "Account" },
	{ match: pathname => pathname.startsWith("/accounts"), title: "Accounts" },
	{ match: pathname => pathname.startsWith("/budgets/"), title: "Budget" },
	{ match: pathname => pathname.startsWith("/budgets"), title: "Budgets" },
	{ match: pathname => pathname.startsWith("/categories"), title: "Categories" },
	{ match: pathname => pathname.startsWith("/importer"), title: "Importer" },
	{ match: pathname => pathname.startsWith("/allocator"), title: "Allocator" },
	{ match: pathname => pathname.startsWith("/sync"), title: "Data" },
	{ match: pathname => pathname.startsWith("/settings"), title: "Settings" },
	{ match: pathname => pathname.startsWith("/privacy"), title: "Privacy Policy" },
	{ match: pathname => pathname.startsWith("/terms"), title: "Terms of Service" },
]

/** Persistent top bar: lives above the per-route animation boundary. Also owns the tab title. */
export default function ShellHeader() {
	const pathname = usePathname()
	const { date } = useMonthParams()
	const title = TITLES.find(entry => entry.match(pathname))?.title ?? "Page not found"
	// Month views lead with the month, so several open tabs stay tellable apart.
	const monthView =
		pathname === "/" ? "Overview" : pathname.startsWith("/records/monthly") ? "Records" : null
	const tabTitle = `${monthView ? `${date.toFormat("MMM yyyy")} ${monthView}` : title} · Finpoint`

	// Set imperatively and only here: the root metadata deliberately has no title, since Next
	// re-applies a metadata title over this one on every client navigation.
	useEffect(() => {
		document.title = tabTitle
	}, [tabTitle])

	return <AppHeader title={title} />
}
