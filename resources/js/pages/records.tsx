import { Icon as IconifyIcon } from "@iconify/react"
import { router, usePage } from "@inertiajs/react"
import { useState } from "react"
import RecordCreatorDialog from "@/components/dialogs/record-creator"
import DateField from "@/components/form/date-field"
import Icon from "@/components/icon"
import AppHeader from "@/components/layout/app-header"
import PageContent from "@/components/layout/page-content"
import PageHeader from "@/components/layout/page-header"
import PaginatedDataTable from "@/components/table/paginated-data-table"
import { useRecordColumns, useRecordMobileRow } from "@/components/table/record-columns"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
} from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectLabel,
	SelectSeparator,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select"
import { useFetch } from "@/hooks/use-fetch"
import { usePaginatedTableState } from "@/hooks/use-paginated-table-state"
import { cn } from "@/lib/utils"
import { Bucket, CategoryWithChildren, Paginated, Record } from "@/types"
import { bucketIndexApiRoute, categoryIndexApiRoute, recordsWebRoute } from "@/wayfinder/routes"

const FILTER_CONTROL_CLASS = "border-border bg-input/20 text-foreground dark:bg-input/30"

export default function RecordsPage({ records }: { records: Paginated<Record> }) {
	const [isCreatingRecord, setIsCreatingRecord] = useState(false)
	const page = usePage()
	const pageUrl = new URL(page.url, "http://localhost")
	const startDate = pageUrl.searchParams.get("start_date")
	const endDate = pageUrl.searchParams.get("end_date")
	const isAllocated = pageUrl.searchParams.get("is_allocated")
	const bucketId = pageUrl.searchParams.get("bucket_id")
	const bucketGroup = pageUrl.searchParams.get("bucket_group")
	const showUnbucketed = pageUrl.searchParams.get("show_unbucketed") === "1"
	const treatment = pageUrl.searchParams.get("treatment")
	const categoryIds = pageUrl.searchParams.get("category_ids")?.split(",").filter(Boolean) ?? []

	const categories = useFetch<CategoryWithChildren[]>(categoryIndexApiRoute.url(), [])
	const buckets = useFetch<Bucket[]>(bucketIndexApiRoute.url(), [])
	const updateFilters = (changes: { [key: string]: string | null }) => {
		const url = new URL(page.url, "http://localhost")
		for (const [key, value] of Object.entries(changes)) {
			if (value) url.searchParams.set(key, value)
			else url.searchParams.delete(key)
		}
		url.searchParams.delete("page")
		router.visit(url.pathname + url.search, { preserveState: true, preserveScroll: true })
	}
	const clearFilters = () =>
		router.visit(
			recordsWebRoute({
				query: { per_page: pageUrl.searchParams.get("per_page") || undefined },
			}),
			{ preserveState: true, preserveScroll: true },
		)
	const activeFilterCount = [
		pageUrl.searchParams.get("query"),
		startDate,
		endDate,
		isAllocated,
		categoryIds.length ? "categories" : null,
		bucketId ?? bucketGroup ?? (showUnbucketed ? "unbucketed" : null),
		treatment,
	].filter(Boolean).length

	const { query, pageSize, handleQueryChange, handlePageSizeChange } = usePaginatedTableState({
		syncOn: records,
		buildUrl: query =>
			recordsWebRoute({
				query: {
					...query,
					start_date: startDate || undefined,
					end_date: endDate || undefined,
					is_allocated: isAllocated || undefined,
					category_ids: categoryIds.join(",") || undefined,
					bucket_id: bucketId || undefined,
					bucket_group: bucketGroup || undefined,
					show_unbucketed: showUnbucketed || undefined,
					treatment: treatment || undefined,
				},
			}).url,
	})
	const columns = useRecordColumns<Record>({ pageName: "Records" })
	const mobileRow = useRecordMobileRow<Record>({ pageName: "Records" })

	return (
		<>
			<AppHeader title="Records" />

			<PageContent>
				<PageHeader
					title="Records"
					subtitle="Browse and manage your financial records."
					description="Ledger view"
					icon="lucide:receipt-text"
				/>
				<PaginatedDataTable
					paginated={records}
					columns={columns}
					header={{
						query,
						onQueryChange: handleQueryChange,
						pageSize,
						onPageSizeChange: handlePageSizeChange,
						searchPlaceholder: "Search all records...",
						filters: (
							<RecordFilters
								categories={categories}
								categoryIds={categoryIds}
								buckets={buckets}
								startDate={startDate}
								endDate={endDate}
								isAllocated={isAllocated}
								bucketId={bucketId}
								bucketGroup={bucketGroup}
								showUnbucketed={showUnbucketed}
								treatment={treatment}
								activeFilterCount={activeFilterCount}
								onChange={updateFilters}
								onClear={clearFilters}
							/>
						),
						actions: (
							<RecordCreatorDialog
								statements={[]}
								categories={categories}
								isOpen={isCreatingRecord}
								setIsOpen={setIsCreatingRecord}
								trigger={
									<Button className="w-full sm:w-auto">
										<IconifyIcon icon="lucide:plus" /> Create Pending Record
									</Button>
								}
							/>
						),
					}}
					footer={{
						summary: `Showing ${records.data.length} of ${records.total} records.`,
					}}
					mobileRow={mobileRow}
					emptyMessage="No records found."
				/>
			</PageContent>
		</>
	)
}

function RecordFilters({
	categories,
	categoryIds,
	buckets,
	startDate,
	endDate,
	isAllocated,
	bucketId,
	bucketGroup,
	showUnbucketed,
	treatment,
	activeFilterCount,
	onChange,
	onClear,
}: {
	categories: CategoryWithChildren[]
	categoryIds: string[]
	buckets: Bucket[]
	startDate: string | null
	endDate: string | null
	isAllocated: string | null
	bucketId: string | null
	bucketGroup: string | null
	showUnbucketed: boolean
	treatment: string | null
	activeFilterCount: number
	onChange: (changes: { [key: string]: string | null }) => void
	onClear: () => void
}) {
	const bucketScope = showUnbucketed
		? "unbucketed"
		: bucketId
			? `bucket:${bucketId}`
			: bucketGroup
				? `group:${bucketGroup}`
				: "all"
	const activeBuckets = buckets.filter(bucket => !bucket.archived)

	const changeBucketScope = (scope: string) => {
		const changes: { [key: string]: string | null } = {
			bucket_id: null,
			bucket_group: null,
			show_unbucketed: null,
		}

		if (scope === "unbucketed") changes.show_unbucketed = "1"
		else if (scope.startsWith("bucket:")) changes.bucket_id = scope.slice(7)
		else if (scope.startsWith("group:")) changes.bucket_group = scope.slice(6)

		onChange(changes)
	}

	return (
		<div className="grid w-full grid-cols-2 gap-2 sm:flex sm:w-auto sm:flex-wrap">
			<CategoryFilter
				categories={categories}
				selectedIds={categoryIds}
				onChange={ids => onChange({ category_ids: ids.join(",") || null })}
			/>

			<Select
				value={isAllocated ?? "all"}
				onValueChange={value => onChange({ is_allocated: value === "all" ? null : value })}
			>
				<SelectTrigger className={cn("w-full sm:w-40", FILTER_CONTROL_CLASS)}>
					<IconifyIcon icon="lucide:circle-check-big" />
					<SelectValue />
				</SelectTrigger>
				<SelectContent align="start" variant="filter">
					<SelectGroup>
						<SelectItem value="all">Any status</SelectItem>
						<SelectItem value="true">Complete</SelectItem>
						<SelectItem value="false">Pending</SelectItem>
					</SelectGroup>
				</SelectContent>
			</Select>

			<Select value={bucketScope} onValueChange={changeBucketScope}>
				<SelectTrigger className={cn("w-full sm:w-40", FILTER_CONTROL_CLASS)}>
					<IconifyIcon icon="lucide:wallet-cards" />
					<SelectValue />
				</SelectTrigger>
				<SelectContent align="start" variant="filter">
					<SelectGroup>
						<SelectItem value="all">Any bucket</SelectItem>
						<SelectItem value="unbucketed">No bucket</SelectItem>
					</SelectGroup>
					<SelectSeparator />
					<SelectGroup>
						<SelectLabel>Bucket groups</SelectLabel>
						<SelectItem value="group:core">Core</SelectItem>
						<SelectItem value="group:outlier">Outlier</SelectItem>
						<SelectItem value="group:other">Other</SelectItem>
					</SelectGroup>
					{activeBuckets.length ? <SelectSeparator /> : null}
					{activeBuckets.length ? (
						<SelectGroup>
							<SelectLabel>Specific bucket</SelectLabel>
							{activeBuckets.map(bucket => (
								<SelectItem key={bucket.id} value={`bucket:${bucket.id}`}>
									<span
										className="size-2 rounded-full"
										style={{ backgroundColor: bucket.color }}
									/>
									{bucket.name}
								</SelectItem>
							))}
						</SelectGroup>
					) : null}
				</SelectContent>
			</Select>

			<Select
				value={treatment ?? "all"}
				onValueChange={value => onChange({ treatment: value === "all" ? null : value })}
			>
				<SelectTrigger className={cn("w-full sm:w-40", FILTER_CONTROL_CLASS)}>
					<IconifyIcon icon="lucide:chart-no-axes-combined" />
					<SelectValue />
				</SelectTrigger>
				<SelectContent align="start" variant="filter">
					<SelectGroup>
						<SelectItem value="all">Any treatment</SelectItem>
						<SelectItem value="income">Income</SelectItem>
						<SelectItem value="spending">Spending</SelectItem>
						<SelectItem value="saving_investment">Saving / investment</SelectItem>
						<SelectItem value="neutral">Excluded</SelectItem>
						<SelectItem value="automatic">Automatic</SelectItem>
					</SelectGroup>
				</SelectContent>
			</Select>

			<DateField
				id="records_start_date"
				value={startDate ?? ""}
				className="min-w-0 sm:w-40"
				triggerClassName={FILTER_CONTROL_CLASS}
				placeholder="Start date"
				onChange={date => onChange({ start_date: date || null })}
			/>
			<DateField
				id="records_end_date"
				value={endDate ?? ""}
				className="min-w-0 sm:w-40"
				triggerClassName={FILTER_CONTROL_CLASS}
				placeholder="End date"
				onChange={date => onChange({ end_date: date || null })}
			/>

			{activeFilterCount ? (
				<Button
					type="button"
					variant="outline"
					className={cn("w-full sm:w-40", FILTER_CONTROL_CLASS)}
					onClick={onClear}
				>
					<IconifyIcon icon="lucide:list-filter-x" /> Clear
					<Badge variant="secondary">{activeFilterCount}</Badge>
				</Button>
			) : null}
		</div>
	)
}

function CategoryFilter({
	categories,
	selectedIds,
	onChange,
}: {
	categories: CategoryWithChildren[]
	selectedIds: string[]
	onChange: (ids: string[]) => void
}) {
	const categoriesFlat = categories.flatMap(category => [category, ...category.children])

	const toggle = (id: string) =>
		onChange(
			selectedIds.includes(id)
				? selectedIds.filter(selectedId => selectedId !== id)
				: [...selectedIds, id],
		)

	return (
		<Popover>
			<PopoverTrigger
				render={
					<Button
						type="button"
						variant="outline"
						className={cn("w-full justify-start sm:w-40", FILTER_CONTROL_CLASS)}
					/>
				}
			>
				<IconifyIcon icon="lucide:tags" />
				<span className="truncate">
					{selectedIds.length
						? `${selectedIds.length} categor${selectedIds.length === 1 ? "y" : "ies"}`
						: "Any category"}
				</span>
				<IconifyIcon icon="lucide:chevron-down" className="ml-auto" />
			</PopoverTrigger>
			<PopoverContent
				align="start"
				variant="filter"
				className="w-[calc(100vw-2rem)] overflow-hidden sm:w-72"
			>
				<Command
					filter={(value, search) =>
						value.toLowerCase().includes(search.trim().toLowerCase()) ? 1 : 0
					}
				>
					<CommandInput
						placeholder="Search categories..."
						className={selectedIds.length ? "pr-6" : undefined}
					/>
					{selectedIds.length ? (
						<Button
							type="button"
							variant="ghost"
							size="icon-xs"
							className="absolute top-2 right-2 z-10"
							aria-label="Clear categories"
							onClick={() => onChange([])}
						>
							<IconifyIcon icon="lucide:x" />
						</Button>
					) : null}
					<CommandList>
						<CommandEmpty>No categories found.</CommandEmpty>
						<CommandGroup>
							{categoriesFlat.map(category => (
								<CategoryFilterItem
									key={category.id}
									category={category}
									checked={selectedIds.includes(category.id)}
									onSelect={() => toggle(category.id)}
								/>
							))}
						</CommandGroup>
					</CommandList>
				</Command>
			</PopoverContent>
		</Popover>
	)
}

function CategoryFilterItem({
	category,
	checked,
	onSelect,
}: {
	category: CategoryWithChildren["children"][number] | CategoryWithChildren
	checked: boolean
	onSelect: () => void
}) {
	return (
		<CommandItem
			value={category.name}
			data-checked={checked}
			variant="filter"
			onSelect={onSelect}
		>
			<div
				className={cn(
					"flex min-w-0 items-center gap-1",
					category.parent_category_id ? "pl-2" : null,
				)}
			>
				<Icon {...category} size={10} />
				<span className="truncate">{category.name}</span>
			</div>
		</CommandItem>
	)
}
