import { useEffect, useState } from "react"
import Icon from "@/components/icon"
import DataTable from "@/components/table/data-table"
import { Button } from "@/components/ui/button"
import { Field, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { TABLE_WIDTHS } from "@/lib/table-widths"
import { classForCurrency, formatCurrency, formatDatetime } from "@/lib/utils"
import { Category, Record } from "@/types"
import { recordIndexApiRoute } from "@/wayfinder/routes"

type RecordExtra = {
	category: Category
}

export default function RecordSearch({
	title,
	excluded,
	handler,
	trigger,
}: {
	title: string
	excluded?: Record[]
	handler: (record: Record & RecordExtra) => Promise<void>
	trigger: React.ReactNode
}) {
	const [open, setOpen] = useState(false)
	const [query, setQuery] = useState("")
	const [records, setRecords] = useState<(Record & RecordExtra)[]>([])

	useEffect(() => {
		if (!open) {
			setQuery("")
		}
	}, [open])

	useEffect(() => {
		void handleSearch()
	}, [query])

	const handleSearch = async () => {
		const response = await fetch(recordIndexApiRoute.url({ query: { query } }), {
			headers: { Accept: "application/json" },
		})

		if (response.ok) {
			setRecords(await response.json())
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
						<FieldLabel htmlFor="record-search-query">Search records</FieldLabel>
						<Input
							id="record-search-query"
							type="search"
							placeholder="Search by title or description"
							value={query}
							onChange={event => setQuery(event.target.value)}
						/>
					</Field>

					<ScrollArea className="flex-1 overflow-y-hidden">
						<DataTable
							key={records.map(r => r.id).join(",")}
							data={records.filter(r => !excluded?.some(e => e.id === r.id))}
							columns={[
								{
									header: "Record",
									cell: ({ row }) => (
										<div>
											<div className="flex items-center gap-2">
												<Icon {...row.original.category} size={20} />
												<div className="flex-1 truncate">
													<div className="truncate">
														<span className="font-medium">
															{row.original.title}{" "}
														</span>
														<span className="text-muted-foreground">
															{[
																row.original.people
																	? `w/ ${row.original.people}`
																	: null,
																row.original.location
																	? `@ ${row.original.location}`
																	: null,
															]
																.filter(Boolean)
																.join(" ")}
														</span>
													</div>
													<div className="text-muted-foreground">
														{formatDatetime(row.original.datetime)}
													</div>
													<span
														className={classForCurrency(
															row.original.amount,
														)}
													>
														{formatCurrency(row.original.amount)}
													</span>
												</div>
											</div>
										</div>
									),
								},
								{
									id: "actions",
									meta: { width: TABLE_WIDTHS.ACTIONS_ATTACH },
									cell: ({ row }) => (
										<Button size="sm" onClick={() => handler(row.original)}>
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
