import { ColumnDef, flexRender, getCoreRowModel, useReactTable } from "@tanstack/react-table"
import { AnimatePresence } from "framer-motion"
import { ReactNode } from "react"
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table"

export default function DataTable<TData extends { id: string }, TValue>({
	data,
	columns,
	header,
	selectedIds,
	emptyMessage,
}: {
	data: TData[]
	columns: ColumnDef<TData, TValue>[]
	header?: ReactNode
	selectedIds?: string[]
	emptyMessage?: string
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

			<div className="overflow-hidden rounded-lg border bg-card">
				<Table className="table-fixed overflow-hidden">
					<TableHeader>
						{table.getHeaderGroups().map(headerGroup => (
							<TableRow key={headerGroup.id}>
								{headerGroup.headers.map(header => (
									<TableHead key={header.id} style={header.column.columnDef.meta}>
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
						<AnimatePresence>
							{table.getRowModel().rows.length ? (
								table.getRowModel().rows.map(row => (
									<TableRow
										key={row.id}
										layout
										data-state={selectedIds?.includes(row.id) && "selected"}
										className="cursor-pointer"
									>
										{row.getVisibleCells().map(cell => (
											<TableCell key={cell.id}>
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
