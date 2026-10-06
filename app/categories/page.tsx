"use client"

import { useLiveQuery } from "dexie-react-hooks"
import Link from "next/link"
import { useState } from "react"
import CategoryDialog from "@/components/dialogs/category"
import Icon, { UiIcon as IconifyIcon } from "@/components/icon"
import PageContent from "@/components/layout/page-content"
import PageHeader from "@/components/layout/page-header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"
import { useHistory } from "@/history"
import { canUseDefaultBucket, treatmentLabel } from "@/lib/analytics"
import { listCategories } from "@/logic/categories"
import { pathRecords } from "@/routes"
import type { AnalyticsTreatment, Category, CategoryWithChildren } from "@/types"

type CategoryDialogState =
	| { mode: "create" }
	| { mode: "edit"; category: Category | CategoryWithChildren }
	| null

export default function CategoriesPage() {
	const [dialogState, setDialogState] = useState<CategoryDialogState>(null)
	const { handlePush } = useHistory()
	const categoriesQuery = useLiveQuery(() => listCategories(), [])
	const categories = (categoriesQuery ?? []) as CategoryWithChildren[]
	const [query, setQuery] = useState("")
	const needle = query.trim().toLowerCase()
	const visible = needle
		? categories.filter(
				category =>
					category.name.toLowerCase().includes(needle) ||
					category.children.some(child => child.name.toLowerCase().includes(needle)),
			)
		: categories

	return (
		<>
			<PageContent>
				<PageHeader
					title="Categories"
					subtitle="Categories give Records meaning and supply their default treatment and spending bucket."
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
						onChange={event => setQuery(event.target.value)}
					/>
				</div>

				{categoriesQuery === undefined ? (
					<div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
						{["a", "b", "c", "d", "e", "f"].map(key => (
							<Skeleton key={key} className="h-28 rounded-xl" />
						))}
					</div>
				) : visible.length === 0 ? (
					<p className="rounded-xl border border-dashed p-10 text-center text-sm text-muted-foreground">
						{query ? "No categories match your search." : "No categories yet."}
					</p>
				) : (
					SECTIONS.map(section => {
						const items = visible.filter(
							category =>
								(category.analytics_treatment ?? "automatic") === section.value,
						)
						if (!items.length) return null
						const records = items.reduce(
							(sum, category) =>
								sum +
								category.records_count +
								category.children.reduce(
									(total, child) => total + child.records_count,
									0,
								),
							0,
						)
						return (
							<section key={section.value} className="grid gap-3">
								<h3 className="flex items-baseline gap-2 text-sm font-medium">
									{section.label}
									<span className="text-xs font-normal text-muted-foreground">
										{items.length}{" "}
										{items.length === 1 ? "category" : "categories"} ·{" "}
										{records.toLocaleString()} Records
									</span>
								</h3>
								<div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
									{items.map(category => (
										<CategoryTile
											key={category.id}
											category={category}
											onEdit={edit =>
												setDialogState({ mode: "edit", category: edit })
											}
											onFindRecords={handlePush("Categories")}
										/>
									))}
								</div>
							</section>
						)
					})
				)}
			</PageContent>

			<CategoryDialog
				open={dialogState !== null}
				mode={dialogState?.mode ?? "create"}
				category={dialogState?.mode === "edit" ? dialogState.category : null}
				categories={categories}
				onOpenChange={open => {
					if (!open) {
						setDialogState(null)
					}
				}}
			/>
		</>
	)
}

const SECTIONS: { value: AnalyticsTreatment; label: string }[] = [
	{ value: "spending", label: "Spending" },
	{ value: "income", label: "Income" },
	{ value: "saving_investment", label: "Saving & investment" },
	{ value: "neutral", label: "Transfers & neutral" },
	{ value: "automatic", label: "Automatic by direction" },
]

function CategoryTile({
	category,
	onEdit,
	onFindRecords,
}: {
	category: CategoryWithChildren
	onEdit: (category: Category | CategoryWithChildren) => void
	onFindRecords: () => void
}) {
	const bucket = canUseDefaultBucket(category.analytics_treatment)
		? category.default_bucket
		: null
	const childRecords = category.children.reduce((sum, child) => sum + child.records_count, 0)
	return (
		<article className="group grid content-start gap-3 rounded-xl border bg-card p-4 transition-shadow hover:shadow-md">
			<div className="flex items-start gap-3">
				<button
					type="button"
					className="flex min-w-0 flex-1 cursor-pointer items-center gap-3 text-left"
					onClick={() => onEdit(category)}
					aria-label={`Edit ${category.name}`}
				>
					<Icon {...category} size={16} />
					<span className="min-w-0">
						<span className="block truncate font-medium">{category.name}</span>
						<span className="block text-xs text-muted-foreground tabular-nums">
							{(category.records_count + childRecords).toLocaleString()}{" "}
							{category.records_count + childRecords === 1 ? "Record" : "Records"}
						</span>
					</span>
				</button>
				<Button
					variant="ghost"
					size="icon-sm"
					title="Open Records"
					className="opacity-60 group-hover:opacity-100"
					asChild
				>
					<Link
						href={pathRecords({ category_ids: category.id })}
						aria-label={`Open Records for ${category.name}`}
						onClick={onFindRecords}
					>
						<IconifyIcon icon="lucide:arrow-up-right" />
					</Link>
				</Button>
			</div>

			{bucket || category.analytics_treatment === null ? (
				<p className="flex items-center gap-1.5 text-xs text-muted-foreground">
					{bucket ? (
						<>
							<span
								className="size-2 rounded-full"
								style={{ backgroundColor: bucket.color }}
							/>
							{bucket.name} bucket
						</>
					) : (
						treatmentLabel(category.analytics_treatment)
					)}
				</p>
			) : null}

			{category.children.length ? (
				<div className="flex flex-wrap gap-1.5 border-t pt-3">
					{category.children.map(child => (
						<button
							key={child.id}
							type="button"
							onClick={() => onEdit(child)}
							title={`${child.records_count} Records · edit`}
							className="flex cursor-pointer items-center gap-1.5 rounded-full border px-2 py-0.5 text-xs hover:bg-muted"
						>
							<span
								className="size-2 rounded-full"
								style={{ backgroundColor: child.color }}
							/>
							{child.name}
							<span className="text-muted-foreground tabular-nums">
								{child.records_count}
							</span>
						</button>
					))}
				</div>
			) : null}
		</article>
	)
}
