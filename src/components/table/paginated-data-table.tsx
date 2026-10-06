import {
	type ColumnDef,
	flexRender,
	getCoreRowModel,
	type Row,
	useReactTable,
} from "@tanstack/react-table"
import { Fragment, memo } from "react"
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
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table"
import { rowEnter, staggerDelay } from "@/lib/motion"
import { cn } from "@/lib/utils"
import { Paginated } from "@/types"

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
					{loading ? null : rows.length ? (
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
										onClick={onRowClick ? clickRow(row.original) : undefined}
										style={{ animationDelay: `${staggerDelay(index)}s` }}
										className={cn(
											MOBILE_ROW_CLASS,
											"animate-in fade-in slide-in-from-bottom-2 px-3 py-2.5 text-sm transition-colors duration-100 ease-out [animation-duration:300ms] [animation-fill-mode:backwards] data-[state=selected]:bg-muted",
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
					<TableBody key={loading ? "loading" : "rows"}>
						{loading ? null : rows.length ? (
							rows.map((row, index) => {
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
											{...rowEnter(index)}
											data-state={selectedIds?.includes(row.id) && "selected"}
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
							})
						) : (
							<TableRow>
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
					summary={loading ? null : footer.summary}
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
