import { Link } from "@inertiajs/react"
import { LoaderCircleIcon, SearchIcon, SparklesIcon } from "lucide-react"
import { useEffect, useState } from "react"
import Icon from "@/components/icon"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Field, FieldDescription, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import {
	Sheet,
	SheetContent,
	SheetDescription,
	SheetFooter,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from "@/components/ui/sheet"
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table"
import { currencyClass, toCurrency, toDatetime } from "@/lib/utils"
import { Category, Record } from "@/types"
import { record as recordRoute } from "@/wayfinder/routes"
import { index as recordsIndex } from "@/wayfinder/routes/records"

type RecordExtra = {
	category: Category
}

type SearchState = "idle" | "loading" | "done"

export default function RecordSearch({
	title,
	description,
	emptyTitle = "No records match yet",
	emptyDescription = "Try a different search phrase or broaden the filter.",
	filter,
	handler,
	trigger,
}: {
	title: string
	description: string
	emptyTitle?: string
	emptyDescription?: string
	filter?: (record: Record & RecordExtra) => boolean
	handler: (record: Record & RecordExtra) => Promise<void>
	trigger: React.ReactNode
}) {
	const [open, setOpen] = useState(false)
	const [query, setQuery] = useState("")
	const [records, setRecords] = useState<(Record & RecordExtra)[]>([])
	const [status, setStatus] = useState<SearchState>("idle")
	const [isAttachingId, setIsAttachingId] = useState<string | null>(null)

	useEffect(() => {
		if (open) {
			return
		}

		setQuery("")
		setRecords([])
		setStatus("idle")
		setIsAttachingId(null)
	}, [open])

	const handleSearch = async (event?: React.FormEvent<HTMLFormElement>) => {
		event?.preventDefault()
		setStatus("loading")

		const response = await fetch(
			recordsIndex.url({
				query: query.trim() ? { query: query.trim() } : undefined,
			}),
			{
				headers: { Accept: "application/json" },
			},
		)

		const data = ((await response.json().catch(() => [])) as (Record & RecordExtra)[]).filter(
			record => (filter ? filter(record) : true),
		)

		setRecords(data)
		setStatus("done")
	}

	const handleAttach = async (record: Record & RecordExtra) => {
		setIsAttachingId(record.id)

		try {
			await handler(record)
			setOpen(false)
		} finally {
			setIsAttachingId(null)
		}
	}

	return (
		<Sheet open={open} onOpenChange={setOpen}>
			<SheetTrigger asChild>{trigger}</SheetTrigger>
			<SheetContent side="right" className="w-full sm:max-w-4xl">
				<SheetHeader className="gap-2 border-b">
					<SheetTitle>{title}</SheetTitle>
					<SheetDescription>{description}</SheetDescription>
				</SheetHeader>

				<div className="flex flex-1 flex-col gap-4 overflow-y-auto px-6 pb-6">
					<form className="pt-6" onSubmit={handleSearch}>
						<Field>
							<FieldLabel htmlFor="record-search-query">Search records</FieldLabel>
							<div className="flex gap-2">
								<Input
									id="record-search-query"
									type="search"
									placeholder="Search by title or description"
									value={query}
									onChange={event => setQuery(event.target.value)}
								/>
								<Button type="submit" disabled={status === "loading"}>
									{status === "loading" ? (
										<LoaderCircleIcon className="animate-spin" />
									) : (
										<SearchIcon />
									)}
									Search
								</Button>
							</div>
							<FieldDescription>
								Leave blank to browse all available records.
							</FieldDescription>
						</Field>
					</form>

					{status === "idle" ? (
						<RecordSearchEmptyState
							title="Start with a search"
							description="Find an existing record to attach without leaving this page."
							icon={<SparklesIcon className="size-4" />}
						/>
					) : null}

					{status === "loading" ? (
						<RecordSearchEmptyState
							title="Searching records"
							description="Pulling the latest matching records from the API."
							icon={<LoaderCircleIcon className="size-4 animate-spin" />}
						/>
					) : null}

					{status === "done" && !records.length ? (
						<RecordSearchEmptyState
							title={emptyTitle}
							description={emptyDescription}
							icon={<SearchIcon className="size-4" />}
						/>
					) : null}

					{records.length ? (
						<div className="overflow-hidden rounded-lg border bg-card">
							<Table className="table-fixed">
								<TableHeader>
									<TableRow>
										<TableHead className="w-40">Date &amp; Time</TableHead>
										<TableHead className="w-28">Amount</TableHead>
										<TableHead>Record</TableHead>
										<TableHead className="w-40">Category</TableHead>
										<TableHead className="w-40">Actions</TableHead>
									</TableRow>
								</TableHeader>
								<TableBody>
									{records.map(record => {
										const details = [
											record.people ? `w/ ${record.people}` : null,
											record.location ? `@ ${record.location}` : null,
										]
											.filter(Boolean)
											.join(" ")

										return (
											<TableRow key={record.id}>
												<TableCell className="text-muted-foreground">
													{toDatetime(record.datetime)}
												</TableCell>
												<TableCell>
													<span className={currencyClass(record.amount)}>
														{toCurrency(record.amount)}
													</span>
												</TableCell>
												<TableCell>
													<div className="flex items-start gap-3">
														<Icon {...record.category} size={16} />
														<div className="min-w-0">
															<p className="truncate font-medium">
																{record.title}
															</p>
															<p className="truncate text-muted-foreground">
																{details ||
																	record.description ||
																	"No extra context"}
															</p>
														</div>
													</div>
												</TableCell>
												<TableCell className="text-muted-foreground">
													{record.category.name}
												</TableCell>
												<TableCell>
													<div className="flex items-center gap-2">
														<Button variant="outline" size="sm" asChild>
															<Link
																href={recordRoute.url({ record })}
															>
																Open
															</Link>
														</Button>
														<Button
															size="sm"
															onClick={() =>
																void handleAttach(record)
															}
															disabled={isAttachingId !== null}
														>
															{isAttachingId === record.id ? (
																<>
																	<LoaderCircleIcon className="animate-spin" />
																	Attaching
																</>
															) : (
																"Attach"
															)}
														</Button>
													</div>
												</TableCell>
											</TableRow>
										)
									})}
								</TableBody>
							</Table>
						</div>
					) : null}
				</div>

				<SheetFooter className="border-t bg-muted/20">
					<Button type="button" variant="outline" onClick={() => setOpen(false)}>
						Done
					</Button>
				</SheetFooter>
			</SheetContent>
		</Sheet>
	)
}

function RecordSearchEmptyState({
	title,
	description,
	icon,
}: {
	title: string
	description: string
	icon: React.ReactNode
}) {
	return (
		<Card className="border border-dashed border-border/80 bg-muted/20">
			<CardContent className="flex flex-col items-center gap-2 py-10 text-center">
				<div className="flex size-10 items-center justify-center rounded-full bg-background text-muted-foreground ring-1 ring-border">
					{icon}
				</div>
				<div className="space-y-1">
					<p className="font-medium">{title}</p>
					<p className="text-sm text-muted-foreground">{description}</p>
				</div>
			</CardContent>
		</Card>
	)
}
