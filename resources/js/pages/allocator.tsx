import { router } from "@inertiajs/react"
import { MoreHorizontalIcon } from "lucide-react"
import { useEffect, useState } from "react"
import AllocateRecordDialog from "@/components/allocate-record-dialog"
import AppHeader from "@/components/app-header"
import DataTable from "@/components/data-table"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Field, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import { cn, round2dp, toCurrency, toDate } from "@/lib/utils"
import { Account, Category, Paginated, Statement } from "@/types"
import { allocator, statement } from "@/wayfinder/routes"

type StatementExtra = {
	account: Account
	allocations_sum_amount: number | null
}

type CategoryExtra = {
	children: Category[]
}

export default function Allocator({
	statements,
	categories,
}: {
	statements: Paginated<Statement & StatementExtra>
	categories: (Category & CategoryExtra)[]
}) {
	const [query, setQuery] = useState("")
	const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 100 })
	const [rowSelection, setRowSelection] = useState<{ [key: string]: boolean }>({})

	useEffect(() => {
		const params = new URLSearchParams(window.location.search)

		// biome-ignore lint/style/noNonNullAssertion: Asserted not null
		const page = params.get("page") !== null ? +params.get("page")! : 1
		// biome-ignore lint/style/noNonNullAssertion: Asserted not null
		const perPage = params.get("per_page") !== null ? +params.get("per_page")! : 100

		if (page !== pagination.pageIndex + 1 || perPage !== pagination.pageSize) {
			refresh()
		}
	}, [pagination])

	useEffect(() => {
		refresh()
	}, [query])

	const refresh = () => {
		router.visit(
			allocator({
				query: {
					page: pagination.pageIndex + 1,
					per_page: pagination.pageSize,
					query: query !== "" ? query : undefined,
				},
			}).url,
			{ preserveState: true },
		)
	}

	return (
		<>
			<AppHeader title="Allocator" />

			<div className="container mx-auto p-8 flex flex-col gap-8">
				<div className="flex flex-col gap-1">
					<h2 className="text-2xl font-semibold">Allocator</h2>
					<p className="text-muted-foreground">Allocate bank statements to app records</p>
				</div>

				<div className="flex flex-col gap-4">
					<div className="flex items-center justify-between">
						<div className="flex flex-1 items-center gap-2">
							<Input
								type="text"
								placeholder="Filter statements..."
								className="w-50"
								value={query}
								onChange={e => setQuery(e.target.value)}
							/>
						</div>

						<AllocateRecordDialog
							statements={statements.data.filter((s, i) => rowSelection[i])}
							categories={categories}
							clear={() => setRowSelection({})}
						/>
					</div>

					<DataTable
						data={statements}
						pagination={pagination}
						setPagination={setPagination}
						rowSelection={rowSelection}
						setRowSelection={setRowSelection}
						columns={[
							{
								id: "select",
								cell: ({ row }) => (
									<div className="flex items-center justify-center">
										<Checkbox
											checked={row.getIsSelected()}
											onCheckedChange={value => row.toggleSelected(!!value)}
											aria-label="Select row"
										/>
									</div>
								),
								enableSorting: false,
								enableHiding: false,
							},
							{
								accessorFn: statement => statement.account.id,
								header: "Account",
							},
							{
								accessorFn: statement => toDate(statement.date),
								header: "Date",
							},
							{
								header: "Amount",
								cell: ({ row }) => {
									const total = row.original.amount
									const allocable = round2dp(
										total - (row.original.allocations_sum_amount ?? 0),
									)

									return (
										<Field className="w-full max-w-sm">
											<FieldLabel>
												<span>Allocable</span>
												<div className="ml-auto">
													<span
														className={cn(
															"text-muted-foreground",
															allocable < 0
																? "text-red-500"
																: allocable > 0
																	? "text-green-500"
																	: "text-foreground",
														)}
													>
														{toCurrency(allocable)}
													</span>
													{" / "}
													<span
														className={cn(
															"font-bold",
															total < 0
																? "text-red-500"
																: total > 0
																	? "text-green-500"
																	: "text-foreground",
														)}
													>
														{toCurrency(total)}
													</span>
												</div>
											</FieldLabel>
											<Progress value={(allocable / total) * 100} />
										</Field>
									)
								},
							},
							{
								accessorKey: "description",
								header: "Description",
							},
							{
								id: "actions",
								cell: ({ row }) => (
									<DropdownMenu>
										<DropdownMenuTrigger asChild>
											<Button variant="ghost" className="size-8 p-0">
												<span className="sr-only">Open menu</span>
												<MoreHorizontalIcon className="size-4"></MoreHorizontalIcon>
											</Button>
										</DropdownMenuTrigger>
										<DropdownMenuContent align="end">
											<DropdownMenuLabel>Actions</DropdownMenuLabel>
											<DropdownMenuItem asChild>
												<a
													href={statement.url({
														statement: row.original,
													})}
												>
													View statement
												</a>
											</DropdownMenuItem>
										</DropdownMenuContent>
									</DropdownMenu>
								),
							},
						]}
					/>
				</div>
			</div>
		</>
	)
}
