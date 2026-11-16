"use client"

import { useLiveQuery } from "dexie-react-hooks"
import { motion } from "framer-motion"
import Link from "next/link"
import { useState } from "react"
import CategoryDialog from "@/components/dialogs/category"
import Icon, { UiIcon as IconifyIcon } from "@/components/icon"
import PageContent from "@/components/layout/page-content"
import PageHeader from "@/components/layout/page-header"
import MonthlyBudgetBadge from "@/components/monthly-budget-badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useHistory } from "@/history"
import { usePaginatedTableState } from "@/hooks/use-paginated-table-state"
import { canUseDefaultMonthlyBudget, treatmentLabel } from "@/lib/analytics"
import { cardEnter } from "@/lib/motion"
import { cn, pluralize } from "@/lib/utils"
import { listCategories } from "@/logic/categories"
import { pathRecords } from "@/routes"
import type { AnalyticsTreatment, Category, CategoryWithChildren } from "@/types"

type CategoryDialogState =
	| { mode: "create"; parent?: CategoryWithChildren }
	| { mode: "edit"; category: Category | CategoryWithChildren }
	| null

export default function CategoriesPage() {
	const [dialogState, setDialogState] = useState<CategoryDialogState>(null)
	const { handlePush } = useHistory()
	const categoriesQuery = useLiveQuery(() => listCategories(), [])
	const categories = (categoriesQuery ?? []) as CategoryWithChildren[]
	const { query, handleQueryChange } = usePaginatedTableState()
	const needle = query.trim().toLowerCase()
	// A Category found by name keeps all its subcategories; one found through a subcategory
	// keeps only the matching ones.
	const visible = needle
		? categories.flatMap(category => {
				if (category.name.toLowerCase().includes(needle)) return [category]
				const children = category.children.filter(child =>
					child.name.toLowerCase().includes(needle),
				)
				return children.length ? [{ ...category, children }] : []
			})
		: categories

	return (
		<>
			<PageContent>
				<PageHeader
					title="Categories"
					subtitle="Categories give Records meaning and supply their default treatment and monthly budget."
					description="Category map"
					icon="lucide:tag"
					actions={
						<Button
							type="button"
							className="w-full sm:w-auto"
							onClick={() => setDialogState({ mode: "create" })}
						>
							<IconifyIcon icon="lucide:plus" /> Create Category
						</Button>
					}
				/>

				<div className="relative max-w-sm">
					<IconifyIcon
						icon="lucide:search"
						className="pointer-events-none absolute top-1/2 left-2.5 size-3.5 -translate-y-1/2 text-muted-foreground"
					/>
					<Input
						type="search"
						aria-label="Search categories"
						placeholder="Search categories..."
						className="pl-8"
						value={query}
						onChange={event => handleQueryChange(event.target.value)}
					/>
				</div>

				{categoriesQuery === undefined ? null : visible.length === 0 ? (
					<p className="rounded-xl border border-dashed p-10 text-center text-xs text-muted-foreground">
						{query ? "No categories match your search." : "No categories yet."}
					</p>
				) : (
					SECTIONS.map((section, sectionIndex) => {
						const items = visible.filter(
							category => category.analytics_treatment === section.value,
						)
						const offset = visible.filter(category =>
							SECTIONS.slice(0, sectionIndex).some(
								previous => category.analytics_treatment === previous.value,
							),
						).length
						if (!items.length) return null
						const subcategories = items.reduce(
							(sum, category) => sum + category.children.length,
							0,
						)
						return (
							<section key={section.value} className="grid gap-2">
								<h3 className="flex items-baseline gap-2 text-sm font-semibold">
									{section.label}
									<span className="text-xs font-normal text-muted-foreground">
										{items.length}{" "}
										{items.length === 1 ? "category" : "categories"}
										{subcategories
											? ` · ${subcategories} ${subcategories === 1 ? "subcategory" : "subcategories"}`
											: ""}{" "}
										·{" "}
										{pluralize(
											items.reduce((sum, c) => sum + totalRecords(c), 0),
											"Record",
										)}
									</span>
								</h3>
								<div className="overflow-hidden rounded-xl border bg-card">
									<div
										aria-hidden
										className={cn(
											ROW_GRID,
											"hidden border-b bg-muted/30 py-2 text-xs font-medium text-muted-foreground sm:grid",
										)}
									>
										<span>Category</span>
										<span>
											{canUseDefaultMonthlyBudget(section.value)
												? "Default monthly budget"
												: null}
										</span>
										<span className="text-right">Records</span>
										<span />
									</div>
									{items.map((category, index) => (
										<motion.div
											key={category.id}
											className="border-b last:border-b-0"
											{...cardEnter(offset + index)}
										>
											<CategoryGroup
												category={category}
												onEdit={edit =>
													setDialogState({ mode: "edit", category: edit })
												}
												onAddSubcategory={() =>
													setDialogState({
														mode: "create",
														parent: category,
													})
												}
												onFindRecords={handlePush("Categories")}
											/>
										</motion.div>
									))}
								</div>
							</section>
						)
					})
				)}
			</PageContent>

			<CategoryDialog
				isOpen={dialogState !== null}
				mode={dialogState?.mode ?? "create"}
				category={dialogState?.mode === "edit" ? dialogState.category : null}
				parent={dialogState?.mode === "create" ? dialogState.parent : null}
				categories={categories}
				setIsOpen={open => {
					if (!open) {
						setDialogState(null)
					}
				}}
			/>
		</>
	)
}

const SECTIONS = (
	["spending", "income", "saving_investment", "neutral", "automatic"] as AnalyticsTreatment[]
).map(value => ({ value, label: treatmentLabel(value) }))

// One set of tracks for the header and every row, so budgets and counts line up down the list.
const ROW_GRID =
	"grid-cols-[minmax(0,1fr)_auto_2rem] items-center gap-x-3 px-3 sm:grid-cols-[minmax(0,1fr)_11rem_6.5rem_2rem] sm:px-4"

const totalRecords = (category: CategoryWithChildren) =>
	category.records_count + category.children.reduce((sum, child) => sum + child.records_count, 0)

/** A Category and its subcategories: one row each, the subcategories hanging off a guide line. */
function CategoryGroup({
	category,
	onEdit,
	onAddSubcategory,
	onFindRecords,
}: {
	category: CategoryWithChildren
	onEdit: (category: Category | CategoryWithChildren) => void
	onAddSubcategory: () => void
	onFindRecords: () => void
}) {
	return (
		<article className="grid min-w-0 grid-cols-1">
			<CategoryRow
				category={category}
				records={totalRecords(category)}
				onEdit={() => onEdit(category)}
				onFindRecords={onFindRecords}
				action={
					<Button
						type="button"
						variant="ghost"
						size="icon-sm"
						title="Add subcategory"
						aria-label={`Add subcategory to ${category.name}`}
						className="text-muted-foreground hover:text-foreground"
						onClick={onAddSubcategory}
					>
						<IconifyIcon icon="lucide:plus" />
					</Button>
				}
			/>
			{category.children.length ? (
				<ul className="relative grid pb-1.5 before:absolute before:top-0 before:bottom-5.5 before:left-7 before:w-px before:bg-border sm:before:left-8">
					{category.children.map(child => (
						<li
							key={child.id}
							className="relative before:absolute before:top-1/2 before:left-7 before:h-px before:w-4 before:bg-border sm:before:left-8"
						>
							<CategoryRow
								category={child}
								records={child.records_count}
								onEdit={() => onEdit(child)}
								onFindRecords={onFindRecords}
								child
							/>
						</li>
					))}
				</ul>
			) : null}
		</article>
	)
}

function CategoryRow({
	category,
	records,
	onEdit,
	onFindRecords,
	action,
	child,
}: {
	category: Category | CategoryWithChildren
	records: number
	onEdit: () => void
	onFindRecords: () => void
	action?: React.ReactNode
	child?: boolean
}) {
	const monthlyBudget = canUseDefaultMonthlyBudget(category.analytics_treatment)
		? category.default_monthly_budget
		: null
	return (
		<div
			className={cn(
				ROW_GRID,
				"relative grid transition-colors duration-150 ease-out hover:bg-muted/40 has-[[data-edit]:active]:bg-muted/60",
				child ? "py-1.5" : "py-2.5",
			)}
		>
			<button
				type="button"
				data-edit
				className={cn(
					"flex min-w-0 cursor-pointer items-center gap-3 rounded-md text-left outline-none after:absolute after:inset-0 focus-visible:ring-2 focus-visible:ring-ring",
					child && "pl-10 sm:pl-11",
				)}
				onClick={onEdit}
				aria-label={`Edit ${category.name}`}
			>
				<Icon {...category} size={child ? 12 : 16} />
				<span className="grid min-w-0 gap-0.5">
					<span className={cn("truncate", child ? "text-sm" : "font-medium")}>
						{category.name}
					</span>
					{monthlyBudget ? (
						<MonthlyBudgetBadge
							name={monthlyBudget.name}
							color={monthlyBudget.color}
							title="Default monthly budget"
							className="max-w-full sm:hidden"
						/>
					) : null}
				</span>
			</button>
			<span className="hidden min-w-0 sm:block">
				{monthlyBudget ? (
					<MonthlyBudgetBadge
						name={<span className="truncate">{monthlyBudget.name}</span>}
						color={monthlyBudget.color}
						title="Default monthly budget"
						className="max-w-full"
					/>
				) : canUseDefaultMonthlyBudget(category.analytics_treatment) ? (
					<span className="text-xs text-muted-foreground">Unbudgeted</span>
				) : null}
			</span>
			<Link
				href={pathRecords({ category_ids: category.id })}
				aria-label={`Open Records for ${category.name}`}
				title="Open Records"
				className="relative flex items-center justify-end gap-1 rounded-md text-xs text-muted-foreground tabular-nums outline-none hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring"
				onClick={onFindRecords}
			>
				{records.toLocaleString()}
				<span className="sm:hidden">{records === 1 ? "Record" : "Records"}</span>
				<IconifyIcon icon="lucide:arrow-up-right" className="size-3.5" />
			</Link>
			<span className="relative flex justify-end">{action}</span>
		</div>
	)
}
