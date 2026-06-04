import { useEffect, useState } from "react"
import DataTable from "@/components/table/data-table"
import { Button } from "@/components/ui/button"
import { Field, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
	Sheet,
	SheetContent,
	SheetDescription,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from "@/components/ui/sheet"
import { TABLE_WIDTH_CLASSNAMES } from "@/lib/table-width-classnames"
import { classForCurrency, cn, formatCurrency, formatDatetime } from "@/lib/utils"
import { Statement } from "@/types"
import { statementIndexApiRoute } from "@/wayfinder/routes"

export default function StatementSearchSheet({
	title,
	placeholder,
	filters,
	isOpen,
	setIsOpen,
	handler,
	trigger,
}: {
	title: string
	placeholder?: string
	filters?: { [key: string]: any }
	isOpen: boolean
	setIsOpen: (isOpen: boolean) => void
	handler: (statement: Statement) => Promise<void>
	trigger?: React.ReactNode
}) {
	const [query, setQuery] = useState("")
	const [statements, setStatements] = useState<Statement[]>([])

	useEffect(() => {
		if (!isOpen) {
			setQuery("")
		} else {
			void handleSearch()
		}
	}, [isOpen])

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
		<Sheet open={isOpen} onOpenChange={setIsOpen}>
			{trigger && <SheetTrigger asChild>{trigger}</SheetTrigger>}
			<SheetContent side="right" className="md:w-full md:max-w-4xl">
				<SheetHeader className="gap-2 border-b">
					<SheetTitle>{title}</SheetTitle>
					<SheetDescription className="sr-only">
						Search statements and attach one from the results.
					</SheetDescription>
				</SheetHeader>

				<div className="flex flex-1 flex-col gap-4 overflow-y-hidden p-4 md:p-6">
					<Field>
						<FieldLabel htmlFor="statement-search-query">Search statements</FieldLabel>
						<Input
							id="statement-search-query"
							type="search"
							placeholder={placeholder ?? "Search statements..."}
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
											<div className="whitespace-pre-line break-words">
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
									meta: { width: TABLE_WIDTH_CLASSNAMES.ACTIONS_FIXED_ATTACH },
									cell: ({ row }) => (
										<Button
											size="sm"
											onClick={async () => {
												await handler(row.original)
												await handleSearch()
											}}
										>
											Attach
										</Button>
									),
								},
							]}
							mobileRow={({ original: statement }) => (
								<div className="flex flex-col gap-3">
									<div>
										<p className="font-medium break-words">
											{statement.description}
										</p>
										<p className="text-xs text-muted-foreground">
											{formatDatetime(statement.datetime)}
										</p>
									</div>
									<div className="flex justify-between gap-3 text-xs">
										<span
											className={classForCurrency(statement.allocable_amount)}
										>
											{formatCurrency(statement.allocable_amount)}
										</span>
										<span
											className={cn(
												"font-bold",
												classForCurrency(statement.amount),
											)}
										>
											{formatCurrency(statement.amount)}
										</span>
									</div>
									<Progress
										value={
											statement.amount === 0
												? 0
												: (statement.allocable_amount / statement.amount) *
													100
										}
									/>
									<div className="flex justify-end">
										<Button
											size="sm"
											onClick={async () => {
												await handler(statement)
												await handleSearch()
											}}
										>
											Attach
										</Button>
									</div>
								</div>
							)}
						/>
					</ScrollArea>
				</div>
			</SheetContent>
		</Sheet>
	)
}
