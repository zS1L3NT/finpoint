import {
	type ColumnDef,
	flexRender,
	getCoreRowModel,
	type Row,
	useReactTable,
} from "@tanstack/react-table"
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

export default function PaginatedDataTable<TData extends { id: string }, TValue>({
	paginated,
	columns,
	header,
	footer,
	selectedIds,
	emptyMessage = "No results.",
	mobileRow,
}: {
	paginated: Paginated<TData>
	columns: ColumnDef<TData, TValue>[]
	header: React.ComponentProps<typeof PaginationHeader>
	footer: { summary: React.ReactNode }
	selectedIds?: string[]
	emptyMessage?: string
	mobileRow?: (row: Row<TData>) => React.ReactNode
}) {
	const table = useReactTable({
		data: paginated.data,
		columns,
		getCoreRowModel: getCoreRowModel(),
		getRowId: row => row.id,
	})

	return (
		<div className="flex flex-col gap-4">
			{header ? <PaginationHeader {...header} /> : null}

			{mobileRow ? (
				<div className="min-w-0 divide-y overflow-hidden rounded-lg border bg-card md:hidden">
					{table.getRowModel().rows.length ? (
						table.getRowModel().rows.map(row => (
							<div
								key={row.id}
								data-state={selectedIds?.includes(row.id) && "selected"}
								className="min-w-0 overflow-hidden px-3 py-2.5 text-sm data-[state=selected]:bg-muted"
							>
								{mobileRow(row)}
							</div>
						))
					) : (
						<div className="p-8 text-center text-sm text-muted-foreground">
							{emptyMessage}
						</div>
					)}
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
						{table.getRowModel().rows.length ? (
							table.getRowModel().rows.map(row => (
								<TableRow
									key={row.id}
									data-state={selectedIds?.includes(row.id) && "selected"}
									className="cursor-pointer"
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
					summary={footer.summary}
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
