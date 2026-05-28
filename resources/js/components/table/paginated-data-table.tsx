import {
	type ColumnDef,
	flexRender,
	getCoreRowModel,
	type Row,
	useReactTable,
} from "@tanstack/react-table"
import { AnimatePresence } from "framer-motion"
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
	header: ComponentProps<typeof PaginationHeader>
	footer: Omit<ComponentProps<typeof PaginationFooter>, "links">
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

			{footer ? <PaginationFooter links={paginated.links} {...footer} /> : null}
		</div>
	)
}
