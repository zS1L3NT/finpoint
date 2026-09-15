"use client"

import { useLiveQuery } from "dexie-react-hooks"
import { useSearchParams } from "next/navigation"
import { useCallback, useMemo, useState } from "react"
import RecordCreatorDialog from "@/components/dialogs/record-creator"
import RecordEditorDialog from "@/components/dialogs/record-editor"
import DateField from "@/components/form/date-field"
import { UiIcon as IconifyIcon } from "@/components/icon"
import AppHeader from "@/components/layout/app-header"
import PageContent from "@/components/layout/page-content"
import PageHeader from "@/components/layout/page-header"
import CategoryFilter from "@/components/table/category-filter"
import { ClearFiltersButton, FILTER_CONTROL_CLASS, FilterBar } from "@/components/table/filter-bar"
import PaginatedDataTable from "@/components/table/paginated-data-table"
import { useRecordColumns, useRecordMobileRow } from "@/components/table/record-columns"
import { Button } from "@/components/ui/button"
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
import { useRecordEditor } from "@/hooks/use-record-editor"
import { cn } from "@/lib/utils"
import { listBuckets } from "@/logic/buckets"
import { listCategories } from "@/logic/categories"
import { paginateItems, parsePage, parsePageSize } from "@/logic/pagination"
import { listRecords } from "@/logic/records"
import { Bucket, CategoryWithChildren, Record } from "@/types"

export default function RecordsPage() {
	const searchParams = useSearchParams()
	const startDate = searchParams.get("start_date")
	const endDate = searchParams.get("end_date")
	const isAllocated = searchParams.get("is_allocated")
	const bucketId = searchParams.get("bucket_id")
	const bucketGroup = searchParams.get("bucket_group")
	const showUnbucketed = searchParams.get("show_unbucketed") === "1"
	const treatment = searchParams.get("treatment")
	const categoryIdsParam = searchParams.get("category_ids") ?? ""
	const categoryIds = useMemo(
		() => categoryIdsParam.split(",").filter(Boolean),
		[categoryIdsParam],
	)

	const categories = useFetch(() => listCategories(), [])
	const buckets = useFetch(() => listBuckets(), [])
	const { editingRecord, handleEdit, setEditingRecord } = useRecordEditor()
	const { query, page, pageSize, handleQueryChange, handlePageSizeChange, setParams } =
		usePaginatedTableState()
	const updateFilters = useCallback(
		(changes: { [key: string]: string | null }) => {
			setParams({ ...changes, page: null })
		},
		[setParams],
	)
	const clearFilters = useCallback(
		() =>
			setParams({
				query: null,
				start_date: null,
				end_date: null,
				is_allocated: null,
				category_ids: null,
				bucket_id: null,
				bucket_group: null,
				show_unbucketed: null,
				treatment: null,
				page: null,
			}),
		[setParams],
	)
	const activeFilterCount = [
		searchParams.get("query"),
		startDate,
		endDate,
		isAllocated,
		categoryIds.length ? "categories" : null,
		bucketId ?? bucketGroup ?? (showUnbucketed ? "unbucketed" : null),
		treatment,
	].filter(Boolean).length

	const recordsQuery = useLiveQuery(
		() =>
			listRecords({
				query: query || null,
				start_date: startDate,
				end_date: endDate,
				is_allocated: isAllocated,
				category_ids: categoryIds.length ? categoryIds : null,
				bucket_id: bucketId,
				bucket_group: bucketGroup,
				show_unbucketed: showUnbucketed,
				treatment,
			}),
		[
			query,
			startDate,
			endDate,
			isAllocated,
			categoryIdsParam,
			bucketId,
			bucketGroup,
			showUnbucketed,
			treatment,
		],
	)
	const records = recordsQuery ?? []
	const paginated = useMemo(
		() => paginateItems(records, parsePage(page), parsePageSize(pageSize)),
		[records, page, pageSize],
	)
	const columns = useRecordColumns<Record>({ pageName: "Records", onEdit: handleEdit })
	const mobileRow = useRecordMobileRow<Record>({ pageName: "Records", onEdit: handleEdit })
	const tableHeader = useMemo(
		() => ({
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
			actions: <RecordCreatorHost categories={categories} />,
		}),
		[
			query,
			handleQueryChange,
			pageSize,
			handlePageSizeChange,
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
			updateFilters,
			clearFilters,
		],
	)
	const tableFooter = useMemo(
		() => ({
			summary: `Showing ${paginated.data.length} of ${paginated.total} records.`,
		}),
		[paginated],
	)

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
					paginated={paginated}
					columns={columns}
					header={tableHeader}
					footer={tableFooter}
					mobileRow={mobileRow}
					emptyMessage="No records found."
					loading={recordsQuery === undefined}
				/>
			</PageContent>

			{editingRecord ? (
				<RecordEditorDialog
					record={editingRecord}
					statements={editingRecord.statements}
					categories={categories}
					isOpen
					setIsOpen={isOpen => {
						if (!isOpen) setEditingRecord(null)
					}}
				/>
			) : null}
		</>
	)
}

function RecordCreatorHost({ categories }: { categories: CategoryWithChildren[] }) {
	const [isOpen, setIsOpen] = useState(false)

	return (
		<RecordCreatorDialog
			statements={[]}
			categories={categories}
			isOpen={isOpen}
			setIsOpen={setIsOpen}
			trigger={
				<Button className="w-full sm:w-auto">
					<IconifyIcon icon="lucide:plus" /> Create Pending Record
				</Button>
			}
		/>
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
		<FilterBar>
			<CategoryFilter
				categories={categories}
				selectedIds={categoryIds}
				onChange={ids => onChange({ category_ids: ids.join(",") || null })}
			/>

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

			<ClearFiltersButton count={activeFilterCount} onClear={onClear} />
		</FilterBar>
	)
}
