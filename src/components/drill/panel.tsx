"use client"
import { useLiveQuery } from "dexie-react-hooks"
import { AnimatePresence, motion, useReducedMotion } from "framer-motion"
import { ChevronDown } from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"
import { AllocationProgress } from "@/components/allocation-progress"
import { AllocationRows } from "@/components/allocation-rows"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet"
import { DRILL_PIVOT, SPRING, TRANSITION } from "@/lib/motion"
import { formatCurrency, pluralize } from "@/lib/utils"
import { getDrilldown, getDrillStatement, type Selection } from "@/logic/drilldown"
export function DrillPanel({
	selection,
	focus,
	pivot,
	month,
	year,
	scope,
	close,
}: {
	focus: string | null
	pivot: (focus: string | null) => void
	selection: Selection
	month: string
	year: number
	scope: string
	close: () => void
}) {
	const key = JSON.stringify(selection)
	const data = useLiveQuery(
		() => getDrilldown(month, year, scope, selection),
		[month, year, scope, key],
	)
	const expanded = focus?.startsWith("record:") ? focus.slice(7) : null
	const [origin, setOrigin] = useState<{ key: string; id: string } | null>(null)
	const statementId = focus?.startsWith("statement:") ? focus.slice(10) : null
	const back = () => pivot(origin?.key === key ? `record:${origin.id}` : null)
	const statement = useLiveQuery(
		() => (statementId ? getDrillStatement(statementId) : undefined),
		[statementId],
	)
	const [desktop, setDesktop] = useState(
		() => typeof window !== "undefined" && matchMedia("(min-width:1280px)").matches,
	)
	const reduced = useReducedMotion()
	useEffect(() => {
		const media = matchMedia("(min-width:1280px)")
		const update = () => setDesktop(media.matches)
		update()
		media.addEventListener("change", update)
		return () => media.removeEventListener("change", update)
	}, [])
	useEffect(() => {
		const handler = (e: KeyboardEvent) => {
			if (e.key === "Escape") close()
		}
		document.addEventListener("keydown", handler)
		return () => document.removeEventListener("keydown", handler)
	}, [close])
	useEffect(() => {
		if (
			data === null ||
			statement === null ||
			(data && expanded && !data.records.some(r => r.id === expanded))
		)
			close()
	}, [data, statement, expanded, close])
	const ready = !!data
	useEffect(() => {
		if (ready && desktop) document.getElementById("drill-title")?.focus({ preventScroll: true })
	}, [ready, desktop])
	const content = data ? (
		<>
			<div className="flex items-start justify-between gap-3 border-b p-5">
				<div>
					<h2
						id="drill-title"
						tabIndex={-1}
						className="text-lg font-semibold tracking-tight outline-none focus-visible:ring-2 focus-visible:ring-ring"
					>
						{data.title}
					</h2>
					{statement ? (
						<nav
							aria-label="Drill-down breadcrumb"
							className="mt-2 text-xs text-muted-foreground"
						>
							{data.records.find(r => r.id === origin?.id)?.title
								? `${data.records.find(r => r.id === origin?.id)?.title} › `
								: ""}
							{statement.account.name} statement › {statement.description}
						</nav>
					) : null}
					<p
						className="text-3xl font-semibold tracking-tight tabular-nums"
						data-testid="drill-total"
						aria-live="polite"
					>
						{formatCurrency(data.total)}
					</p>
					<p className="mt-1 text-xs text-muted-foreground">
						{pluralize(data.records.length, "Record")} ·{" "}
						{selection.kind === "category-gross" || selection.kind === "month"
							? "Spending · refunds excluded · Pending Records counted"
							: "Spending · refunds subtracted · Pending Records counted"}
					</p>
				</div>
				<Button variant="ghost" size="sm" onClick={close} aria-label="Close drill-down">
					✕
				</Button>
			</div>
			<AnimatePresence mode="wait" custom={statementId ? 1 : -1}>
				<motion.div
					data-testid="drill-body"
					custom={statementId ? 1 : -1}
					variants={DRILL_PIVOT}
					key={`${key}:${statementId}`}
					initial={reduced ? { opacity: 0 } : "enter"}
					animate="visible"
					exit={reduced ? { opacity: 0 } : "exit"}
					transition={reduced ? TRANSITION.fast : TRANSITION.base}
					className="min-h-0 flex-1 overflow-y-auto p-5"
				>
					{statementId ? (
						statement ? (
							<>
								<Button variant="outline" size="sm" onClick={back}>
									← Back
								</Button>
								<p className="my-5 text-3xl tabular-nums">
									{formatCurrency(statement.amount)}
								</p>
								<p className="mb-3 text-xs text-muted-foreground">
									Records allocated to this Statement
								</p>
								<AllocationRows statement={statement} />
							</>
						) : null
					) : (
						<>
							{data.records.map(r => (
								<div key={r.id} className="border-b">
									<button
										type="button"
										className="flex w-full items-center gap-3 py-4 text-left hover:bg-muted/30"
										aria-expanded={expanded === r.id}
										onClick={() =>
											pivot(expanded === r.id ? null : `record:${r.id}`)
										}
									>
										<span className="min-w-0 flex-1">
											<span className="block text-sm font-medium">
												{r.title}
											</span>
											<span className="text-xs text-muted-foreground">
												{r.datetime.slice(0, 10)} · {r.category.name}
											</span>
										</span>
										<span className="text-sm tabular-nums">
											{r.amount > 0 ? "Refund " : ""}
											{formatCurrency(Math.abs(r.amount))}
											<AllocationProgress
												amount={r.amount}
												allocated={r.allocated_amount}
											/>
										</span>
										<ChevronDown aria-hidden className="size-4 shrink-0" />
									</button>
									{expanded === r.id ? (
										<motion.div
											initial={{ opacity: 0, height: reduced ? "auto" : 0 }}
											animate={{ opacity: 1, height: "auto" }}
											transition={reduced ? TRANSITION.fast : SPRING.snappy}
											className="mb-4 overflow-hidden rounded-lg bg-muted/40 p-3"
										>
											<AllocationRows
												record={r}
												onStatement={id => {
													setOrigin({ key, id: r.id })
													pivot(`statement:${id}`)
												}}
											/>
										</motion.div>
									) : null}
								</div>
							))}
						</>
					)}
				</motion.div>
			</AnimatePresence>
			<div className="border-t p-5">
				<Button asChild variant="outline" className="w-full">
					<Link href={data.href}>Open in Records</Link>
				</Button>
			</div>
		</>
	) : null
	return desktop ? (
		<motion.aside
			initial={{ opacity: 0, x: reduced ? 0 : 24 }}
			animate={{ opacity: 1, x: 0 }}
			exit={{ opacity: 0, x: reduced ? 0 : 24 }}
			transition={reduced ? TRANSITION.fast : SPRING.snappy}
			aria-labelledby="drill-title"
			role="region"
			className="sticky top-4 flex h-[calc(100vh-2rem)] flex-col overflow-hidden rounded-xl border bg-card shadow-sm"
		>
			{content}
		</motion.aside>
	) : (
		<Sheet
			open
			onOpenChange={open => {
				if (!open) close()
			}}
		>
			<SheetContent
				onCloseAutoFocus={event => {
					event.preventDefault()
				}}
				side="bottom"
				showCloseButton={false}
				className="h-[85dvh]! rounded-t-2xl motion-reduce:data-[state=open]:animate-in motion-reduce:data-[state=open]:fade-in motion-reduce:data-[state=closed]:animate-out motion-reduce:data-[state=closed]:fade-out"
			>
				<SheetTitle className="sr-only">Drill-down</SheetTitle>
				{content}
			</SheetContent>
		</Sheet>
	)
}
