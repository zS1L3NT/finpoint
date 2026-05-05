import { useEffect, useState } from "react"
import DataTable from "@/components/table/data-table"
import { Button } from "@/components/ui/button"
import { Field, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { TABLE_WIDTHS } from "@/lib/table-widths"
import { classForCurrency, cn, formatCurrency, formatDatetime } from "@/lib/utils"
import { Statement } from "@/types"
import { statementIndexApiRoute } from "@/wayfinder/routes"

export default function StatementSearch({
	title,
	filters,
	handler,
	trigger,
}: {
	title: string
	filters: { [key: string]: any }
	handler: (statement: Statement) => Promise<void>
	trigger: React.ReactNode
}) {
	const [open, setOpen] = useState(false)
	const [query, setQuery] = useState("")
	const [statements, setStatements] = useState<Statement[]>([])

	useEffect(() => {
		if (!open) {
			setQuery("")
		} else {
			void handleSearch()
		}
	}, [open])

	useEffect(() => {
		void handleSearch()
	}, [query])

	const handleSearch = async () => {
		const response = await fetch(statementIndexApiRoute.url({ query: { query, ...filters } }), {
			headers: { Accept: "application/json" },
		})

		if (response.ok) {
			setStatements(await response.json())
		}
	}

	return (
		<Sheet open={open} onOpenChange={setOpen}>
			<SheetTrigger asChild>{trigger}</SheetTrigger>
			<SheetContent side="right" className="w-4xl">
				<SheetHeader className="gap-2 border-b">
					<SheetTitle>{title}</SheetTitle>
				</SheetHeader>

				<div className="flex flex-1 flex-col gap-4 overflow-y-hidden p-6">
					<Field>
						<FieldLabel htmlFor="statement-search-query">Search statements</FieldLabel>
						<Input
							id="statement-search-query"
							type="search"
							placeholder="Search by description, amount, or account"
							value={query}
							onChange={event => setQuery(event.target.value)}
						/>
					</Field>

					<ScrollArea className="flex-1 overflow-y-hidden">
						<DataTable
							data={statements}
							columns={[
								{
									header: "Account",
									cell: ({ row }) => (
										<div className="space-y-1">
											<div className="text-wrap break-all">
												{row.original.description}
											</div>
											<div className="flex justify-between">
												<div className="text-muted-foreground">
													{formatDatetime(row.original.datetime)}
												</div>

												<div>
													<span
														className={classForCurrency(
															row.original.allocable_amount,
														)}
													>
														{formatCurrency(
															row.original.allocable_amount,
														)}
													</span>
													{" / "}
													<span
														className={cn(
															"font-bold",
															classForCurrency(row.original.amount),
														)}
													>
														{formatCurrency(row.original.amount)}
													</span>
												</div>
											</div>
											<Progress
												value={
													row.original.amount === 0
														? 0
														: (row.original.allocable_amount /
																row.original.amount) *
															100
												}
											/>
										</div>
									),
								},
								{
									id: "actions",
									meta: { width: TABLE_WIDTHS.ACTIONS_ATTACH },
									cell: ({ row }) => (
										<Button
											size="sm"
											onClick={() => handler(row.original).then(handleSearch)}
										>
											Attach
										</Button>
									),
								},
							]}
						/>
					</ScrollArea>
				</div>
			</SheetContent>
		</Sheet>
	)
}
