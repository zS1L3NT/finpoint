"use client"

import { usePathname } from "next/navigation"
import AppHeader from "@/components/layout/app-header"

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
	{ match: pathname => pathname.startsWith("/settings/data"), title: "Sync" },
	{ match: pathname => pathname.startsWith("/privacy"), title: "Privacy Policy" },
	{ match: pathname => pathname.startsWith("/terms"), title: "Terms of Service" },
]

/** Persistent top bar: lives above the per-route animation boundary. */
export default function ShellHeader() {
	const pathname = usePathname()
	const title = TITLES.find(entry => entry.match(pathname))?.title ?? "Finpoint"
	return <AppHeader title={title} />
}
