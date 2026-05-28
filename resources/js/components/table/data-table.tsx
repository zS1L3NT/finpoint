import { ColumnDef, flexRender, getCoreRowModel, Row, useReactTable } from "@tanstack/react-table"
import { AnimatePresence } from "framer-motion"
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table"
import { cn } from "@/lib/utils"

export default function DataTable<TData extends { id: string }, TValue>({
	data,
	columns,
	header,
	selectedIds,
	emptyMessage,
	getRowClassName,
	mobileRow,
}: {
	data: TData[]
	columns: ColumnDef<TData, TValue>[]
	header?: React.ReactNode
	selectedIds?: string[]
	emptyMessage?: string
	getRowClassName?: (row: Row<TData>) => any
	mobileRow?: (row: Row<TData>) => React.ReactNode
}) {
	const table = useReactTable({
		data,
		columns,
		getCoreRowModel: getCoreRowModel(),
		getRowId: row => row.id,
	})

	return (
		<div className="flex flex-col gap-4">
			{header ? header : null}

			{mobileRow ? (
				<div className="grid gap-3 md:hidden">
					<AnimatePresence initial={false}>
						{table.getRowModel().rows.length ? (
							table.getRowModel().rows.map(row => (
								<div
									key={row.id}
									data-state={selectedIds?.includes(row.id) && "selected"}
									className="rounded-lg border bg-card p-3 text-sm data-[state=selected]:bg-muted"
								>
									{mobileRow(row)}
								</div>
							))
						) : (
							<div className="rounded-lg border bg-card p-8 text-center text-sm text-muted-foreground">
								{emptyMessage}
							</div>
						)}
					</AnimatePresence>
				</div>
			) : null}

			<div
				className={cn(
					"overflow-hidden rounded-lg border bg-card",
					mobileRow ? "hidden md:block" : null,
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
							{table.getRowModel().rows.length ? (
								table.getRowModel().rows.map(row => (
									<TableRow
										key={row.id}
										layout="position"
										initial={{ opacity: 0 }}
										animate={{ opacity: 1 }}
										exit={{ opacity: 0 }}
										data-state={selectedIds?.includes(row.id) && "selected"}
										className={cn("cursor-pointer", getRowClassName?.(row))}
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
								))
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
