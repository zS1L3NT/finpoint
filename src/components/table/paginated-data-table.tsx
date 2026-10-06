import {
	type ColumnDef,
	flexRender,
	getCoreRowModel,
	type Row,
	useReactTable,
} from "@tanstack/react-table"
import { AnimatePresence } from "framer-motion"
import { Fragment, memo, useEffect, useState } from "react"
import PaginationFooter from "@/components/table/pagination-footer"
import PaginationHeader from "@/components/table/pagination-header"
import {
	GroupHeaderRow,
	groupStarts,
	isInteractiveTarget,
	MOBILE_LIST_CLASS,
	MOBILE_ROW_CLASS,
	MobileGroupHeader,
	type RowGroup,
} from "@/components/table/row-groups"
import { Skeleton } from "@/components/ui/skeleton"
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table"
import { cn } from "@/lib/utils"
import { Paginated } from "@/types"

const SKELETON_WIDTHS = ["w-full", "w-3/4", "w-1/2"] as const

function PaginatedDataTable<TData extends { id: string }, TValue>({
	paginated,
	columns,
	header,
	footer,
	selectedIds,
	emptyMessage = "No results.",
	mobileRow,
	loading,
	groupBy,
	onRowClick,
}: {
	paginated: Paginated<TData>
	columns: ColumnDef<TData, TValue>[]
	header?: React.ComponentProps<typeof PaginationHeader>
	footer: { summary: React.ReactNode }
	selectedIds?: string[]
	emptyMessage?: string
	mobileRow?: (row: Row<TData>) => React.ReactNode
	loading?: boolean
	groupBy?: RowGroup<TData>
	onRowClick?: (row: TData) => void
}) {
	const table = useReactTable({
		data: paginated.data,
		columns,
		getCoreRowModel: getCoreRowModel(),
		getRowId: row => row.id,
	})
	const skeletonRows = Math.min(Math.max(Number(header?.pageSize) || 8, 3), 12)
	// First arrival renders instantly; later list updates animate out/in.
	const [live, setLive] = useState(false)
	useEffect(() => {
		if (!loading) setLive(true)
	}, [loading])
	const enter = live ? { opacity: 0, y: 12 } : false
	const rows = table.getRowModel().rows
	const starts = groupStarts(
		rows.map(row => row.original),
		groupBy,
	)
	const columnInfo = table.getVisibleLeafColumns().map(column => ({
		id: column.id,
		className:
			column.columnDef.meta && "width" in column.columnDef.meta
				? `${column.columnDef.meta.width}`
				: undefined,
	}))
	const clickRow = (row: TData) => (event: React.MouseEvent) => {
		if (onRowClick && !isInteractiveTarget(event.target)) onRowClick(row)
	}

	return (
		<div className="@container/table flex min-w-0 flex-col gap-4">
			{header ? <PaginationHeader {...header} /> : null}

			{mobileRow ? (
				<div
					className={cn(
						MOBILE_LIST_CLASS,
						"min-w-0 divide-y overflow-hidden rounded-lg border bg-card @5xl/table:hidden",
					)}
				>
					<AnimatePresence initial={false}>
						{loading ? (
							Array.from({ length: 4 }).map((_, index) => (
								<div key={index} className="col-span-full grid gap-1.5 px-3 py-2.5">
									<Skeleton className="h-4 w-2/3" />
									<Skeleton className="h-3 w-1/3" />
								</div>
							))
						) : rows.length ? (
							rows.map((row, index) => {
								const group = starts.get(index)
								return (
									<Fragment key={row.id}>
										{group && groupBy ? (
											<MobileGroupHeader
												group={groupBy}
												groupKey={group.key}
												rows={group.rows}
											/>
										) : null}
										<div
											data-state={selectedIds?.includes(row.id) && "selected"}
											onClick={
												onRowClick ? clickRow(row.original) : undefined
											}
											className={cn(
												MOBILE_ROW_CLASS,
												"px-3 py-2.5 text-sm data-[state=selected]:bg-muted",
												onRowClick && "cursor-pointer active:bg-muted/60",
											)}
										>
											{mobileRow(row)}
										</div>
									</Fragment>
								)
							})
						) : (
							<div className="col-span-full p-8 text-center text-sm text-muted-foreground">
								{emptyMessage}
							</div>
						)}
					</AnimatePresence>
				</div>
			) : null}

			<div
				className={cn(
					"overflow-hidden rounded-lg border bg-card",
					mobileRow ? "hidden @5xl/table:block" : null,
				)}
			>
				<Table className="table-fixed overflow-hidden">
					<TableHeader>
						{table.getHeaderGroups().map(headerGroup => (
							<TableRow key={headerGroup.id}>
								{headerGroup.headers.map(header => (
									<TableHead
										key={header.id}
										className={
											header.column.columnDef.meta &&
											"width" in header.column.columnDef.meta
												? `${header.column.columnDef.meta?.width}`
												: undefined
										}
									>
										{header.isPlaceholder
											? null
											: flexRender(
													header.column.columnDef.header,
													header.getContext(),
												)}
									</TableHead>
								))}
							</TableRow>
						))}
					</TableHeader>
					<TableBody key={loading ? "skeleton" : "rows"}>
						{loading ? (
							Array.from({ length: skeletonRows }).map((_, row) => (
								<TableRow key={row}>
									{columns.map((_, cell) => (
										<TableCell key={cell}>
											<Skeleton
												className={cn(
													"h-4",
													SKELETON_WIDTHS[
														(row + cell) % SKELETON_WIDTHS.length
													],
												)}
											/>
										</TableCell>
									))}
								</TableRow>
							))
						) : rows.length ? (
							<AnimatePresence initial={false}>
								{rows.map((row, index) => {
									const group = starts.get(index)
									return (
										<Fragment key={row.id}>
											{group && groupBy ? (
												<GroupHeaderRow
													group={groupBy}
													groupKey={group.key}
													rows={group.rows}
													columns={columnInfo}
												/>
											) : null}
											<TableRow
												key={row.id}
												layout="position"
												initial={enter}
												animate={{ opacity: 1, y: 0 }}
												exit={{ opacity: 0, y: -12 }}
												data-state={
													selectedIds?.includes(row.id) && "selected"
												}
												onClick={
													onRowClick ? clickRow(row.original) : undefined
												}
												className={cn(onRowClick && "cursor-pointer")}
											>
												{row.getVisibleCells().map(cell => (
													<TableCell
														key={cell.id}
														className={
															cell.column.columnDef.meta &&
															"width" in cell.column.columnDef.meta
																? `${cell.column.columnDef.meta?.width}`
																: undefined
														}
													>
														{flexRender(
															cell.column.columnDef.cell,
															cell.getContext(),
														)}
													</TableCell>
												))}
											</TableRow>
										</Fragment>
									)
								})}
							</AnimatePresence>
						) : (
							<TableRow layout layoutId="empty">
								<TableCell
									colSpan={columns.length}
									className="h-24 text-center text-muted-foreground"
								>
									{emptyMessage}
								</TableCell>
							</TableRow>
						)}
					</TableBody>
				</Table>
			</div>

			{footer ? (
				<PaginationFooter
					summary={loading ? <Skeleton className="h-4 w-44" /> : footer.summary}
					page={paginated.current_page}
					lastPage={
						typeof paginated.last_page === "number"
							? paginated.last_page
							: Math.max(
									1,
									Math.ceil(paginated.total / Math.max(1, paginated.per_page)),
								)
					}
				/>
			) : null}
		</div>
	)
}

export default memo(PaginatedDataTable) as typeof PaginatedDataTable
