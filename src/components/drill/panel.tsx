"use client"
import { useLiveQuery } from "dexie-react-hooks"
import { AnimatePresence, motion, useIsPresent, useReducedMotion } from "framer-motion"
import Link from "next/link"
import { useEffect, useState } from "react"
import { AllocationProgress } from "@/components/allocation-progress"
import { AllocationRows } from "@/components/allocation-rows"
import RecordEditorDialog from "@/components/dialogs/record-editor"
import Icon, { UiIcon as IconifyIcon } from "@/components/icon"
import MonthlyBudgetBadge from "@/components/monthly-budget-badge"
import { amountTone, PendingBadge } from "@/components/table/record-columns"
import Term from "@/components/term"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet"
import { useRecordEditor } from "@/hooks/use-record-editor"
import { DRILL_PIVOT, SPRING, TRANSITION } from "@/lib/motion"
import { cn, formatCurrency, parseDatetime, pluralize } from "@/lib/utils"
import { listCategories } from "@/logic/categories"
import { getDrilldown, getDrillStatement, type Selection } from "@/logic/drilldown"
import { pathAllocator, pathRecord } from "@/routes"
export function DrillPanel({
	selection,
	focus,
	pivot,
	month,
	year,
	scope,
	onScope,
	close,
}: {
	focus: string | null
	pivot: (focus: string | null) => void
	selection: Selection
	month: string
	year: number
	scope: string
	onScope: (value: string) => void
	close: () => void
}) {
	const { editingRecord, handleEdit, setEditingRecord } = useRecordEditor()
	const categories = useLiveQuery(() => listCategories(), []) ?? []
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
	const present = useIsPresent()
	useEffect(() => {
		const media = matchMedia("(min-width:1280px)")
		const update = () => setDesktop(media.matches)
		update()
		media.addEventListener("change", update)
		return () => media.removeEventListener("change", update)
	}, [])
	useEffect(() => {
		const handler = (e: KeyboardEvent) => {
			if (e.key === "Escape" && !editingRecord) close()
		}
		document.addEventListener("keydown", handler)
		return () => document.removeEventListener("keydown", handler)
	}, [close, editingRecord])
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
	const comparison = data?.comparison
	const content = data ? (
		<>
			{editingRecord ? (
				<RecordEditorDialog
					record={editingRecord}
					statements={editingRecord.statements}
					categories={categories}
					isOpen
					setIsOpen={open => {
						if (!open) {
							const id = editingRecord.id
							setEditingRecord(null)
							requestAnimationFrame(() =>
								(
									document.getElementById(`drill-edit-${id}`) ??
									document.getElementById("drill-title")
								)?.focus({ preventScroll: true }),
							)
						}
					}}
				/>
			) : null}
			<div className="flex items-start justify-between gap-3 border-b p-5">
				<div>
					<h2
						id="drill-title"
						tabIndex={-1}
						className="text-lg font-semibold tracking-tight outline-none"
					>
						{data.title}
					</h2>
					{data.budget ? (
						<p className="text-xs text-muted-foreground">
							{data.budget.amount === null
								? "No planned amount"
								: `${formatCurrency(data.total)} of ${formatCurrency(data.budget.amount)}`}
						</p>
					) : null}
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
						className="mt-1 text-3xl font-semibold tracking-tight tabular-nums"
						data-testid="drill-total"
						aria-live="polite"
					>
						{formatCurrency(data.total)}
					</p>
					<p className="mt-1 text-xs text-muted-foreground">
						{pluralize(data.records.length, "Record")} ·{" "}
						{selection.kind === "category-gross" || selection.kind === "month"
							? "Spending · refunds excluded"
							: "Spending · refunds subtracted"}{" "}
						· <Term name="Pending" /> Records counted
					</p>
				</div>
				<Button
					variant="ghost"
					size="icon-sm"
					onClick={close}
					aria-label="Close drill-down"
				>
					<IconifyIcon icon="lucide:x" />
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
								{statement.allocable_amount !== 0 ? (
									<Button asChild variant="outline">
										<Link href={pathAllocator({ statement_ids: statement.id })}>
											Allocate…
										</Link>
									</Button>
								) : null}
							</>
						) : null
					) : (
						<>
							{comparison ? (
								<div
									data-testid="drill-comparison"
									className="grid grid-cols-2 gap-3 text-xs"
								>
									{[
										{
											label: month,
											amount: data.total,
											rows: data.records,
											unique: comparison.uniqueCurrentIds,
										},
										{
											label: `${comparison.months.length}-month average`,
											amount: comparison.average,
											rows: comparison.records,
											unique: comparison.uniquePreviousIds,
										},
									].map((side, index) => (
										<section key={side.label} className="min-w-0">
											<h3 className="font-medium">{side.label}</h3>
											<p className="my-2 text-lg font-semibold tabular-nums">
												{side.amount === null
													? "No comparison"
													: formatCurrency(side.amount)}
											</p>
											<p className="mb-3 text-muted-foreground">
												{comparison.period}
												{index ? ` · ${comparison.months.join(", ")}` : ""}
											</p>
											{side.rows.map(r => (
												<Link
													key={r.id}
													href={pathRecord(r.id)}
													className="block break-words border-t py-3 hover:bg-muted/30"
												>
													<span className="block font-medium">
														{r.title}
													</span>
													<span className="block text-muted-foreground">
														{parseDatetime(r.datetime).toFormat(
															"ccc d MMM",
														)}
													</span>
													<span
														className={cn(
															"block tabular-nums",
															amountTone(r.amount),
														)}
													>
														{formatCurrency(r.amount)}
													</span>
													{side.unique.includes(r.id) ? (
														<span className="block text-muted-foreground">
															{index
																? "Only in comparison"
																: "Only this month"}
														</span>
													) : null}
												</Link>
											))}
											{!side.rows.length ? (
												<p>No Records in this period.</p>
											) : null}
										</section>
									))}
									<p className="col-span-2 text-muted-foreground">
										Labels show Record titles found on only one side. The
										average divides spending by the included months.
									</p>
								</div>
							) : (
								data.records.map(r => (
									<div key={r.id} className="border-b">
										<button
											type="button"
											className="cursor-pointer flex w-full items-center gap-3 py-4 text-left hover:bg-muted/30"
											aria-expanded={expanded === r.id}
											onClick={() =>
												pivot(expanded === r.id ? null : `record:${r.id}`)
											}
										>
											<Icon {...r.category} size={14} />
											<span className="min-w-0 flex-1">
												<span className="block text-sm font-medium">
													{r.title}
													<PendingBadge record={r} />
												</span>
												<span className="text-xs text-muted-foreground">
													{parseDatetime(r.datetime).toFormat(
														"ccc d MMM",
													)}{" "}
													· {r.category.name}
													{r.monthly_budget ? (
														<MonthlyBudgetBadge
															name={r.monthly_budget.name}
															color={r.monthly_budget.color}
														/>
													) : null}
												</span>
											</span>
											<span
												className={cn(
													"text-sm tabular-nums",
													amountTone(r.amount),
												)}
											>
												{formatCurrency(r.amount)}
												{r.is_pending ? (
													<AllocationProgress
														amount={r.amount}
														allocated={r.allocated_amount}
													/>
												) : null}
											</span>
											<motion.span
												animate={{ rotate: expanded === r.id ? 180 : 0 }}
												transition={TRANSITION.fast}
											>
												<IconifyIcon
													icon="lucide:chevron-down"
													className="size-4 shrink-0"
												/>
											</motion.span>
										</button>
										{expanded === r.id ? (
											<motion.div
												initial={{
													opacity: 0,
													height: reduced ? "auto" : 0,
												}}
												animate={{ opacity: 1, height: "auto" }}
												transition={
													reduced ? TRANSITION.fast : SPRING.snappy
												}
												className="mb-4 overflow-hidden rounded-lg bg-muted/40 p-3"
											>
												<Button
													id={`drill-edit-${r.id}`}
													variant="outline"
													size="sm"
													onClick={() => handleEdit(r)}
												>
													Edit Record
												</Button>
												<p className="my-2 text-xs text-muted-foreground">
													<Term name="Allocation" label="Allocations" />
												</p>
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
								))
							)}
						</>
					)}
				</motion.div>
			</AnimatePresence>
			<div className="grid gap-2 border-t p-5">
				{data.budget ? (
					<Button
						variant="outline"
						className="h-auto min-h-8 whitespace-normal"
						onClick={() => onScope(selection.value)}
					>
						Show the dashboard for {data.budget.name} only
					</Button>
				) : null}
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
		<motion.div exit={{ opacity: 0 }} transition={TRANSITION.base}>
			<Sheet
				modal={!editingRecord}
				open={present}
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
					<div
						aria-hidden="true"
						className="mx-auto mt-2 h-1 w-10 shrink-0 rounded-full bg-muted-foreground/40"
					/>
					<SheetTitle className="sr-only">Drill-down</SheetTitle>
					{content}
				</SheetContent>
			</Sheet>
		</motion.div>
	)
}
