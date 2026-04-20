import {
	ColumnDef,
	flexRender,
	getCoreRowModel,
	OnChangeFn,
	PaginationState,
	RowSelectionState,
	useReactTable,
} from "@tanstack/react-table"
import { Field, FieldLabel } from "@/components/ui/field"
import {
	Pagination,
	PaginationContent,
	PaginationItem,
	PaginationNext,
	PaginationPrevious,
} from "@/components/ui/pagination"
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select"
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table"
import { Paginated } from "@/types"

export default function DataTable<TData, TValue>({
	data,
	columns,
	pagination,
	setPagination,
	rowSelection,
	setRowSelection,
}: {
	data: Paginated<TData>
	columns: ColumnDef<TData, TValue>[]
	pagination?: PaginationState
	setPagination?: OnChangeFn<PaginationState>
	rowSelection?: RowSelectionState
	setRowSelection?: OnChangeFn<RowSelectionState>
}) {
	const table = useReactTable({
		data: data.data,
		columns,
		getCoreRowModel: getCoreRowModel(),
		manualPagination: true,
		manualFiltering: true,
		rowCount: data.total,
		onPaginationChange: setPagination,
		onRowSelectionChange: setRowSelection,
		state: { pagination, rowSelection },
	})

	return (
		<div className="flex flex-col gap-4">
			<div className="overflow-hidden rounded-md border">
				<Table>
					<TableHeader>
						{table.getHeaderGroups().map(headerGroup => (
							<TableRow key={headerGroup.id}>
								{headerGroup.headers.map(header => {
									return (
										<TableHead key={header.id}>
											{header.isPlaceholder
												? null
												: flexRender(
														header.column.columnDef.header,
														header.getContext(),
													)}
										</TableHead>
									)
								})}
							</TableRow>
						))}
					</TableHeader>
					<TableBody>
						{table.getRowModel().rows?.length ? (
							table.getRowModel().rows.map(row => (
								<TableRow
									key={row.id}
									data-state={row.getIsSelected() && "selected"}
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
								<TableCell colSpan={columns.length} className="h-24 text-center">
									No results.
								</TableCell>
							</TableRow>
						)}
					</TableBody>
				</Table>
			</div>
			<div className="flex items-center justify-between px-2">
				<div className="flex-1 text-xs text-muted-foreground">
					{table.getFilteredSelectedRowModel().rows.length} of{" "}
					{table.getFilteredRowModel().rows.length} row(s) selected.
				</div>
				<div className="flex items-center space-x-6 lg:space-x-8">
					<Field orientation="horizontal" className="w-fit">
						<FieldLabel htmlFor="select-rows-per-page">Rows per page</FieldLabel>
						<Select
							value={`${table.getState().pagination.pageSize}`}
							onValueChange={size => table.setPageSize(+size)}
						>
							<SelectTrigger className="w-20" id="select-rows-per-page">
								<SelectValue placeholder={table.getState().pagination.pageSize} />
							</SelectTrigger>
							<SelectContent align="start">
								<SelectGroup>
									<SelectItem value="10">10</SelectItem>
									<SelectItem value="25">25</SelectItem>
									<SelectItem value="50">50</SelectItem>
									<SelectItem value="100">100</SelectItem>
								</SelectGroup>
							</SelectContent>
						</Select>
					</Field>
					<p className="text-xs text-center">
						Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
					</p>
					<Pagination className="mx-0 w-auto">
						<PaginationContent>
							<PaginationItem>
								<PaginationPrevious onClick={() => table.previousPage()} />
							</PaginationItem>
							<PaginationItem>
								<PaginationNext onClick={() => table.nextPage()} />
							</PaginationItem>
						</PaginationContent>
					</Pagination>
				</div>
			</div>
		</div>
	)
}
