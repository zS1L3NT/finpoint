import {
	type ColumnDef,
	flexRender,
	getCoreRowModel,
	type OnChangeFn,
	type Row,
	type RowSelectionState,
	useReactTable,
} from "@tanstack/react-table"
import type { ComponentProps } from "react"
import PaginationFooter from "@/components/table/pagination-footer"
import PaginationHeader from "@/components/table/pagination-header"
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

export default function DataTable<TData, TValue>({
	data,
	columns,
	header,
	footer,
	emptyMessage = "No results.",
	getRowId,
	rowSelection = {},
	setRowSelection,
	onRowClick,
}: {
	data: Paginated<TData>
	columns: ColumnDef<TData, TValue>[]
	header?: ComponentProps<typeof PaginationHeader>
	footer?: Omit<ComponentProps<typeof PaginationFooter>, "links">
	emptyMessage?: string
	getRowId?: (row: TData) => string
	rowSelection?: RowSelectionState
	setRowSelection?: OnChangeFn<RowSelectionState>
	onRowClick?: (row: Row<TData>) => void
}) {
	const table = useReactTable({
		data: data.data,
		columns,
		getCoreRowModel: getCoreRowModel(),
		getRowId: getRowId ? originalRow => getRowId(originalRow) : undefined,
		onRowSelectionChange: setRowSelection,
		state: { rowSelection },
	})

	return (
		<div className="flex flex-col gap-4">
			{header ? <PaginationHeader {...header} /> : null}

			<div className="overflow-hidden rounded-lg border bg-card">
				<Table className="table-fixed">
					<TableHeader>
						{table.getHeaderGroups().map(headerGroup => (
							<TableRow key={headerGroup.id}>
								{headerGroup.headers.map(header => (
									<TableHead
										key={header.id}
										style={{
											width: (header.column.columnDef.meta as { width?: any })
												?.width,
										}}
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
						{table.getRowModel().rows.length ? (
							table.getRowModel().rows.map(row => (
								<TableRow
									key={row.id}
									data-state={row.getIsSelected() && "selected"}
									className={cn(onRowClick ? "cursor-pointer" : undefined)}
									onClick={onRowClick ? () => onRowClick(row) : undefined}
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

			{footer ? <PaginationFooter links={data.links} {...footer} /> : null}
		</div>
	)
}
