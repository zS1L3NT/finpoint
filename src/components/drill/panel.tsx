"use client"
import { useLiveQuery } from "dexie-react-hooks"
import { AnimatePresence, motion, useIsPresent, useReducedMotion } from "framer-motion"
import Link from "next/link"
import { Dialog as DialogPrimitive } from "radix-ui"
import { useEffect, useState } from "react"
import { AllocationProgress } from "@/components/allocation-progress"
import { AllocationRows } from "@/components/allocation-rows"
import RecordEditorDialog from "@/components/dialogs/record-editor"
import Icon, { UiIcon as IconifyIcon } from "@/components/icon"
import PageContent from "@/components/layout/page-content"
import MonthlyBudgetBadge from "@/components/monthly-budget-badge"
import { amountTone, PendingBadge } from "@/components/table/record-columns"
import Term from "@/components/term"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetOverlay, SheetPortal, SheetTitle } from "@/components/ui/sheet"
import { useRecordEditor } from "@/hooks/use-record-editor"
import { DRILL_PIVOT, SPRING, TRANSITION } from "@/lib/motion"
import { cn, formatCurrency, parseDatetime, pluralize } from "@/lib/utils"
import { listCategories } from "@/logic/categories"
import { getDrilldown, getDrillStatement, type Selection } from "@/logic/drilldown"
import { type DrillMode, getDrillMode, setDrillMode } from "@/logic/settings"
import { pathAllocator, pathRecord } from "@/routes"
import { DrillModeMenu, IconTip } from "./mode-menu"
export function DrillPanel({
	selection,
	focus,
	pivot,
	month,
	year,
	scope,
	onScope,
	close,
	place,
	page = false,
}: {
	focus: string | null
	pivot: (focus: string | null) => void
	selection: Selection
	month: string
	year: number
	scope: string
	onScope: (value: string) => void
	close: () => void
	place: (full: boolean) => void
	page?: boolean
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
	const statementQuery = useLiveQuery(
		() => (statementId ? getDrillStatement(statementId) : undefined),
		[statementId],
	)
	const statement = statementId ? statementQuery : undefined
	const mode = useLiveQuery(() => getDrillMode(), [])
	const [phone, setPhone] = useState(
		() => typeof window !== "undefined" && matchMedia("(max-width:767px)").matches,
	)
	const [full, setFull] = useState(false)
	const sheet = !page && phone
	const reduced = useReducedMotion()
	const present = useIsPresent()
	useEffect(() => {
		const media = matchMedia("(max-width:767px)")
		const update = () => setPhone(media.matches)
		update()
		media.addEventListener("change", update)
		return () => media.removeEventListener("change", update)
	}, [])
	// Overlays close through their dialog; the full page has none, so Escape leaves it.
	useEffect(() => {
		if (!page) return
		const handler = (e: KeyboardEvent) => {
			if (e.key === "Escape" && !e.defaultPrevented && !editingRecord) close()
		}
		document.addEventListener("keydown", handler)
		return () => document.removeEventListener("keydown", handler)
	}, [page, close, editingRecord])
	// The preferred mode decides where a drill opens, including one reached from a shared link.
	useEffect(() => {
		if (mode === "full" && !page) place(true)
	}, [mode, page, place])
	useEffect(() => {
		if (
			data === null ||
			statement === null ||
			(data && expanded && !data.records.some(r => r.id === expanded))
		)
			close()
	}, [data, statement, expanded, close])
	const ready = !!data && (!statementId || !!statement)
	useEffect(() => {
		if (ready && !sheet) document.getElementById("drill-title")?.focus({ preventScroll: true })
	}, [ready, sheet])
	const comparison = data?.comparison
	// Picking a mode switches this drill now and becomes where the next one opens.
	const choose = async (next: DrillMode) => {
		await setDrillMode(next)
		place(next === "full")
	}
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
			<div
				className={cn(
					"flex items-start justify-between gap-3 border-b p-5",
					sheet && "shrink-0",
					sheet && !full && "px-5 py-2",
				)}
			>
				<div className="min-w-0">
					{page ? (
						<Button variant="outline" size="sm" className="mb-3" onClick={close}>
							<IconifyIcon icon="lucide:arrow-left" /> Back to Dashboard
						</Button>
					) : null}
					{ready ? (
						<>
							<h2
								id="drill-title"
								tabIndex={-1}
								className="text-lg font-semibold tracking-tight outline-none"
							>
								{statement ? statement.description : data.title}
							</h2>
							{data.budget && !statementId ? (
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
									{data.title} ›{" "}
									{data.records.find(r => r.id === origin?.id)?.title
										? `${data.records.find(r => r.id === origin?.id)?.title} › `
										: ""}
									{statement.account.name} statement
								</nav>
							) : null}
							{!statementId &&
							comparison?.difference !== null &&
							comparison?.difference !== undefined ? (
								<p className="mt-2 text-xs text-muted-foreground">
									{formatCurrency(Math.abs(comparison.difference))}{" "}
									{comparison.difference >= 0 ? "more" : "less"} than your{" "}
									{`${comparison.months.length}-month`} average
								</p>
							) : null}
							<p
								className="mt-1 text-3xl font-semibold tracking-tight tabular-nums"
								data-testid="drill-total"
								aria-live="polite"
							>
								{formatCurrency(statement ? statement.amount : data.total)}
							</p>
							<p className="mt-1 text-xs text-muted-foreground">
								{statement ? (
									<>
										Statement · {statement.account.name} ·{" "}
										{parseDatetime(statement.datetime).toFormat(
											"d MMM yyyy, HH:mm",
										)}
										<span className="block">
											Funds {pluralize(statement.records.length, "Record")}
										</span>
									</>
								) : (
									<>
										{pluralize(data.records.length, "Record")} ·{" "}
										{sheet && !full ? (
											"Spending"
										) : (
											<>
												{selection.kind === "category-gross" ||
												selection.kind === "month"
													? "Spending · refunds excluded"
													: "Spending · refunds subtracted"}{" "}
												· Includes <Term name="Pending" /> Records
											</>
										)}
										{data.refund_total > 0 ? (
											<span className="block">
												{formatCurrency(data.gross_spending)} spent −{" "}
												{formatCurrency(data.refund_total)} refunds
											</span>
										) : null}
									</>
								)}
							</p>
						</>
					) : null}
				</div>
				<div className="-mr-2 -mt-2 flex shrink-0 items-center">
					{page ? null : (
						<IconTip label="Open as full page">
							<Button
								variant="ghost"
								size="icon-lg"
								aria-label="Open as full page"
								onClick={() => place(true)}
							>
								<IconifyIcon icon="lucide:maximize-2" />
							</Button>
						</IconTip>
					)}
					{mode ? (
						<DrillModeMenu mode={page ? "full" : mode} phone={phone} onMode={choose} />
					) : null}
					{page ? null : (
						<IconTip label="Close">
							<Button
								variant="ghost"
								size="icon-lg"
								onClick={close}
								aria-label="Close drill-down"
							>
								<IconifyIcon icon="lucide:x" />
							</Button>
						</IconTip>
					)}
				</div>
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
					className={cn(
						"min-h-0 flex-1 overflow-y-auto p-5",
						page && "overflow-y-visible",
						sheet && "[scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
						sheet && !full && (statementId ? "pt-3" : "py-0"),
					)}
				>
					{statementId ? (
						statement ? (
							<>
								<Button variant="outline" size="sm" onClick={back}>
									← Back
								</Button>
								<p className="my-3 text-xs text-muted-foreground">
									{statement.account.name} ·{" "}
									{parseDatetime(statement.datetime).toFormat(
										"d MMM yyyy, HH:mm",
									)}
								</p>
								<p className="mb-3 text-xs text-muted-foreground">
									Records allocated to this Statement
								</p>
								<AllocationRows statement={statement} />
								{statement.allocable_amount !== 0 ? (
									<Button asChild variant="outline">
										<Link
											href={pathAllocator({
												statement_ids: statement.id,
											})}
										>
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
												{index && comparison.months.length ? (
													<span className="block">
														{formatCurrency(comparison.total)} ÷{" "}
														{comparison.months.length}{" "}
														{comparison.months.length === 1
															? "month"
															: "months"}
													</span>
												) : null}
											</p>
											{side.rows.map(r => (
												<div key={r.id} className="border-t">
													<Link
														href={pathRecord(r.id)}
														className="-mx-2 block break-words rounded-lg px-2 py-3 outline-none transition-colors duration-150 ease-out hover:bg-muted/50 active:bg-muted/70 focus-visible:ring-2 focus-visible:ring-ring/50"
													>
														<span className="block font-medium">
															{r.title}
															<PendingBadge record={r} />
															{r.analytics_treatment === "spending" &&
															r.amount > 0 ? (
																<Badge
																	variant="outline"
																	className="text-creative"
																>
																	Refund
																</Badge>
															) : null}
														</span>
														<span className="block text-muted-foreground">
															{parseDatetime(r.datetime).toFormat(
																"ccc d MMM",
															)}
														</span>
														{r.pendingReason ? (
															<span className="block text-muted-foreground">
																{r.pendingReason}
															</span>
														) : null}
														<span
															className={cn(
																"block tabular-nums",
																amountTone(r.amount),
															)}
														>
															{r.analytics_treatment === "spending" &&
															r.amount > 0
																? "+"
																: ""}
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
												</div>
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
								data.records.map((r, index) => {
									const group =
										index === 0 ||
										data.records[index - 1]?.category.id !== r.category.id
											? data.groups.find(g => g.category.id === r.category.id)
											: undefined
									return (
										<div key={r.id} className="border-b">
											{group ? (
												<h3 className="flex items-center gap-2 pt-4 text-sm font-medium">
													<Icon {...group.category} size={14} />
													<span className="min-w-0 truncate">
														{group.category.name}
													</span>
													<span className="ml-auto shrink-0 tabular-nums">
														{formatCurrency(group.total)}
													</span>
												</h3>
											) : null}
											<button
												type="button"
												className={cn(
													"cursor-pointer -mx-3 flex w-[calc(100%+1.5rem)] flex-wrap items-center gap-3 rounded-lg px-3 py-3 text-left outline-none transition-colors duration-150 ease-out hover:bg-muted/50 active:bg-muted/70 focus-visible:ring-2 focus-visible:ring-ring/50",
													sheet && !full && "py-2",
												)}
												aria-expanded={expanded === r.id}
												onClick={() =>
													pivot(
														expanded === r.id ? null : `record:${r.id}`,
													)
												}
											>
												<Icon {...r.category} size={14} />
												<span className="min-w-[9rem] flex-1">
													<span className="block text-sm font-medium break-words">
														{r.title}
														<PendingBadge record={r} />
														{r.analytics_treatment === "spending" &&
														r.amount > 0 ? (
															<Badge
																variant="outline"
																className="text-creative"
															>
																Refund
															</Badge>
														) : null}
													</span>
													<span className="flex flex-col items-start sm:flex-row sm:flex-wrap sm:items-center gap-x-2 gap-y-1 text-xs text-muted-foreground">
														<span>
															{parseDatetime(r.datetime).toFormat(
																"ccc d MMM",
															)}{" "}
															· {r.category.name}
														</span>
														{r.monthly_budget ? (
															<MonthlyBudgetBadge
																name={r.monthly_budget.name}
																color={r.monthly_budget.color}
															/>
														) : null}
													</span>
													{r.is_pending ? (
														<AllocationProgress
															amount={r.amount}
															allocated={r.allocated_amount}
														/>
													) : null}
													{r.pendingReason ? (
														<span className="block text-xs text-muted-foreground">
															{r.pendingReason}
														</span>
													) : null}
												</span>
												<span
													data-testid="drill-row-amount"
													className={cn(
														"ml-auto shrink-0 whitespace-nowrap text-right text-sm tabular-nums",
														amountTone(r.amount),
													)}
												>
													{r.analytics_treatment === "spending" &&
													r.amount > 0
														? "+"
														: ""}
													{formatCurrency(r.amount)}
												</span>
												<motion.span
													animate={{
														rotate: expanded === r.id ? 180 : 0,
													}}
													transition={TRANSITION.fast}
												>
													<IconifyIcon
														icon="lucide:chevron-down"
														className="size-4 shrink-0"
													/>
												</motion.span>
											</button>
											<AnimatePresence initial={false}>
												{expanded === r.id ? (
													<motion.div
														initial={{
															opacity: 0,
															height: reduced ? "auto" : 0,
														}}
														animate={{ opacity: 1, height: "auto" }}
														exit={{
															opacity: 0,
															height: reduced ? "auto" : 0,
														}}
														transition={
															reduced
																? TRANSITION.fast
																: SPRING.snappy
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
															<Term
																name="Allocation"
																label="Allocations"
															/>
														</p>
														<AllocationRows
															record={r}
															showSummary={false}
															onStatement={id => {
																setOrigin({ key, id: r.id })
																pivot(`statement:${id}`)
															}}
														/>
													</motion.div>
												) : null}
											</AnimatePresence>
										</div>
									)
								})
							)}
						</>
					)}
				</motion.div>
			</AnimatePresence>
			<div
				className={cn(
					"grid gap-2 border-t p-5",
					sheet && "shrink-0",
					sheet && !full && "py-3",
				)}
			>
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
	if (mode === undefined || (mode === "full" && !page)) return null
	if (page)
		return (
			<PageContent>
				<section
					aria-labelledby="drill-title"
					className="mx-auto flex w-full max-w-3xl flex-col rounded-xl border bg-card shadow-sm"
				>
					{content}
				</section>
			</PageContent>
		)
	const edge = (side: "right" | "center") =>
		cn(
			"motion-reduce:data-[state=open]:animate-in motion-reduce:data-[state=open]:fade-in motion-reduce:data-[state=closed]:animate-out motion-reduce:data-[state=closed]:fade-out",
			side === "right" &&
				"motion-reduce:data-[side=right]:data-[state=open]:slide-in-from-right-0 motion-reduce:data-[side=right]:data-[state=closed]:slide-out-to-right-0",
		)
	const outside = (event: Event) => {
		if (editingRecord) event.preventDefault()
	}
	return (
		<motion.div exit={{ opacity: 0 }} transition={TRANSITION.base}>
			<Sheet
				key={sheet ? "sheet" : mode}
				modal={!editingRecord}
				open={present}
				onOpenChange={open => {
					if (!open) close()
				}}
			>
				{sheet ? (
					<SheetContent
						onCloseAutoFocus={event => {
							event.preventDefault()
						}}
						onInteractOutside={outside}
						aria-labelledby="drill-title"
						side="bottom"
						showCloseButton={false}
						overlayClassName={full ? undefined : "bg-transparent"}
						className={cn("h-auto! rounded-t-2xl", edge("center"))}
					>
						<button
							type="button"
							data-testid="drill-grab"
							aria-label={full ? "Collapse drill-down" : "Expand drill-down"}
							aria-expanded={full}
							onClick={() => setFull(v => !v)}
							className="mx-auto flex h-11 w-full shrink-0 cursor-pointer flex-col items-center justify-center gap-0.5 text-muted-foreground outline-none focus-visible:bg-muted/40"
						>
							<span
								aria-hidden="true"
								className="h-1 w-10 rounded-full bg-muted-foreground/40"
							/>
							<IconifyIcon
								icon={full ? "lucide:chevron-down" : "lucide:chevron-up"}
								className="size-4"
							/>
						</button>
						<SheetTitle className="sr-only">Drill-down</SheetTitle>
						<motion.div
							data-testid="drill-sheet-body"
							data-detent={full ? "full" : "half"}
							initial={false}
							animate={{
								height: full ? "calc(92dvh - 2.75rem)" : "calc(55dvh - 2.75rem)",
							}}
							transition={reduced ? TRANSITION.fast : SPRING.snappy}
							className="flex min-h-0 flex-col overflow-hidden"
						>
							{content}
						</motion.div>
					</SheetContent>
				) : mode === "center" ? (
					<SheetPortal>
						<SheetOverlay className="bg-black/30" />
						<DialogPrimitive.Content
							data-slot="sheet-content"
							data-side="center"
							aria-labelledby="drill-title"
							onCloseAutoFocus={event => {
								event.preventDefault()
							}}
							onInteractOutside={outside}
							className={cn(
								"fixed inset-0 z-50 m-auto flex h-fit max-h-[min(46rem,calc(100dvh-4rem))] w-[calc(100vw-2rem)] max-w-180 flex-col overflow-hidden rounded-xl border bg-popover text-xs/relaxed text-popover-foreground shadow-2xl outline-none ease-out data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-97 data-[state=open]:duration-200 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-97 data-[state=closed]:duration-150 motion-reduce:zoom-in-100 motion-reduce:zoom-out-100",
							)}
						>
							<SheetTitle className="sr-only">Drill-down</SheetTitle>
							{content}
						</DialogPrimitive.Content>
					</SheetPortal>
				) : (
					<SheetContent
						onCloseAutoFocus={event => {
							event.preventDefault()
						}}
						onInteractOutside={outside}
						aria-labelledby="drill-title"
						side="right"
						showCloseButton={false}
						overlayClassName="bg-black/30"
						className={cn(
							"md:data-[side=right]:w-120 md:data-[side=right]:max-w-[calc(100vw-2rem)]",
							edge("right"),
						)}
					>
						<SheetTitle className="sr-only">Drill-down</SheetTitle>
						{content}
					</SheetContent>
				)}
			</Sheet>
		</motion.div>
	)
}
