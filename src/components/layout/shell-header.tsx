"use client"

import { usePathname } from "next/navigation"
import { useEffect } from "react"
import AppHeader from "@/components/layout/app-header"
import { useMonthParams } from "@/hooks/use-month-params"
import {
	pathAccounts,
	pathAllocator,
	pathBudgets,
	pathCategories,
	pathDashboard,
	pathDataSettings,
	pathImporter,
	pathMonthlyRecords,
	pathPrivacy,
	pathRecords,
	pathRecurring,
	pathSettings,
	pathStatementRules,
	pathStatements,
	pathTerms,
} from "@/routes"

const TITLES: { match: (pathname: string) => boolean; title: string }[] = [
	{ match: pathname => pathname === pathDashboard(), title: "Dashboard" },
	{ match: pathname => pathname.startsWith(pathMonthlyRecords()), title: "Monthly Records" },
	{ match: pathname => pathname.startsWith(`${pathRecords()}/`), title: "Record" },
	{ match: pathname => pathname.startsWith(pathRecords()), title: "Records" },
	{ match: pathname => pathname.startsWith(`${pathStatements()}/`), title: "Statement" },
	{ match: pathname => pathname.startsWith(pathStatements()), title: "Statements" },
	{ match: pathname => pathname.startsWith(`${pathAccounts()}/`), title: "Account" },
	{ match: pathname => pathname.startsWith(pathAccounts()), title: "Accounts" },
	{ match: pathname => pathname.startsWith(`${pathBudgets()}/`), title: "Budget" },
	{ match: pathname => pathname.startsWith(pathBudgets()), title: "Budgets" },
	{ match: pathname => pathname.startsWith(pathStatementRules()), title: "Statement rules" },
	{ match: pathname => pathname.startsWith(pathRecurring()), title: "Recurring charges" },
	{ match: pathname => pathname.startsWith(pathCategories()), title: "Categories" },
	{ match: pathname => pathname.startsWith(pathImporter()), title: "Importer" },
	{ match: pathname => pathname.startsWith(pathAllocator()), title: "Workflows" },
	{ match: pathname => pathname.startsWith(pathDataSettings()), title: "Data" },
	{ match: pathname => pathname.startsWith(pathSettings()), title: "Settings" },
	{ match: pathname => pathname.startsWith(pathPrivacy()), title: "Privacy Policy" },
	{ match: pathname => pathname.startsWith(pathTerms()), title: "Terms of Service" },
]

/** Persistent top bar: lives above the per-route animation boundary. Also owns the tab title. */
export default function ShellHeader() {
	const pathname = usePathname()
	const { date } = useMonthParams()
	const title = TITLES.find(entry => entry.match(pathname))?.title ?? "Page not found"
	// Month views lead with the month, so several open tabs stay tellable apart.
	const monthView =
		pathname === pathDashboard()
			? "Overview"
			: pathname.startsWith(pathMonthlyRecords())
				? "Records"
				: null
	const tabTitle = `${monthView ? `${date.toFormat("MMM yyyy")} ${monthView}` : title} · Finpoint`

	// Set imperatively and only here: the root metadata deliberately has no title, since Next
	// re-applies a metadata title over this one on every client navigation.
	useEffect(() => {
		document.title = tabTitle
	}, [tabTitle])

	return <AppHeader title={title} />
}
