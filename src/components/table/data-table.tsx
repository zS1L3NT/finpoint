import {
	type ColumnDef,
	flexRender,
	getCoreRowModel,
	type Row,
	useReactTable,
} from "@tanstack/react-table"
import { AnimatePresence } from "framer-motion"
import { Fragment, memo, useEffect, useState } from "react"
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
import { TRANSITION } from "@/lib/motion"
import { cn } from "@/lib/utils"

function DataTable<TData extends { id: string }, TValue>({
	data,
	columns,
	header,
	selectedIds,
	emptyMessage,
	getRowClassName,
	mobileRow,
	groupBy,
	onRowClick,
}: {
	data: TData[]
	columns: ColumnDef<TData, TValue>[]
	header?: React.ReactNode
	selectedIds?: string[]
	emptyMessage?: string
	getRowClassName?: (row: Row<TData>) => string | undefined
	mobileRow?: (row: Row<TData>) => React.ReactNode
	groupBy?: RowGroup<TData>
	onRowClick?: (row: TData) => void
}) {
	const table = useReactTable({
		data,
		columns,
		getCoreRowModel: getCoreRowModel(),
		getRowId: row => row.id,
	})
	// First arrival renders instantly; later list updates animate out/in.
	const [live, setLive] = useState(false)
	useEffect(() => {
		setLive(true)
	}, [])
	const enter = live ? { opacity: 0, y: 6 } : false
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
			{header ? header : null}

			{mobileRow ? (
				<div
					className={cn(
						MOBILE_LIST_CLASS,
						"min-w-0 divide-y overflow-hidden rounded-lg border bg-card @5xl/table:hidden",
					)}
				>
					{rows.length ? (
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
										className={cn(
											MOBILE_ROW_CLASS,
											"px-3 py-2.5 text-sm transition-colors duration-100 data-[state=selected]:bg-muted",
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
					<TableBody>
						<AnimatePresence initial={false}>
							{rows.length ? (
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
												layout="position"
												initial={enter}
												animate={{ opacity: 1, y: 0 }}
												exit={{ opacity: 0 }}
												transition={TRANSITION.fast}
												data-state={
													selectedIds?.includes(row.id) && "selected"
												}
												onClick={
													onRowClick ? clickRow(row.original) : undefined
												}
												className={cn(
													onRowClick && "cursor-pointer",
													getRowClassName?.(row),
												)}
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
								<TableRow layout layoutId="empty">
									<TableCell
										colSpan={columns.length}
										className="h-24 text-center text-muted-foreground"
									>
										{emptyMessage}
									</TableCell>
								</TableRow>
							)}
						</AnimatePresence>
					</TableBody>
				</Table>
			</div>
		</div>
	)
}

export default memo(DataTable) as typeof DataTable
