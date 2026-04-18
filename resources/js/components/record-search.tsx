import { SearchIcon } from "lucide-react"
import { DateTime } from "luxon"
import { useRef, useState } from "react"
import { Category, Record } from "@/types"
import { formatCurrency, styleCurrency } from "@/utils"
import ApiRecordController from "@/wayfinder/actions/App/Http/Controllers/Api/RecordController"
import Icon from "./icon"

type RecordExtra = {
	category: Category
}

export default function RecordSearch({
	filter,
	handler,
}: {
	filter?: (record: Record & RecordExtra) => boolean
	handler: (record: Record & RecordExtra, close: () => void) => Promise<void>
}) {
	const closeButtonRef = useRef<HTMLButtonElement>(null)
	const [query, setQuery] = useState("")
	const [records, setRecords] = useState<(Record & RecordExtra)[]>([])

	const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
		e.preventDefault()

		await fetch(ApiRecordController.index.url({ query: { query } }), {
			headers: { Accept: "application/json" },
		})
			.then(async res => await res.json())
			.then(records => {
				if (filter) {
					setRecords(records.filter(filter))
				} else {
					setRecords(records)
				}
			})
	}

	const handleSelect = async (record: Record & RecordExtra) => {
		await handler(record, () => {
			closeButtonRef.current?.click()
			setTimeout(() => {
				setRecords([])
				setQuery("")
			}, 500)
		})
	}

	return (
		<form
			className="modal fade"
			id="record-search"
			tabIndex={-1}
			aria-labelledby="record-search-label"
			aria-hidden="true"
			onSubmit={handleSubmit}
		>
			<div className="modal-dialog modal-dialog-centered modal-dialog-scrollable modal-lg">
				<div className="modal-content">
					<div className="modal-header">
						<h1 className="modal-title fs-5" id="record-search-label">
							Record Search
						</h1>
						<button
							ref={closeButtonRef}
							type="button"
							className="btn-close"
							data-bs-dismiss="modal"
							aria-label="Close"
						></button>
					</div>
					<div className="modal-body">
						<div className="d-flex gap-3 mb-3">
							<input
								type="text"
								placeholder="Search records..."
								className="form-control flex-full"
								value={query}
								onChange={e => setQuery(e.target.value)}
							/>

							<button className="btn btn-primary">
								<SearchIcon />
							</button>
						</div>

						{records.length ? (
							<table className="table table-hover">
								<thead>
									<tr>
										<th style={{ width: 200 }}>Date & Time</th>
										<th style={{ width: 125 }}>Amount ($)</th>
										<th>Title</th>
									</tr>
								</thead>

								<tbody>
									{records.map(record => (
										<tr
											key={record.id}
											style={{ cursor: "pointer" }}
											onClick={() => handleSelect(record)}
										>
											<td className="align-middle">
												{DateTime.fromFormat(record.datetime, "y-MM-dd T")
													.toFormat("d MMM y, h:mm a")
													.replace("12:00 AM", "-")}
											</td>
											<td
												className="align-middle"
												style={styleCurrency(record.amount)}
											>
												{formatCurrency(record.amount)}
											</td>
											<td className="d-flex align-items-center gap-2">
												<Icon {...record.category} />
												<p className="m-0" style={{ flex: 1 }}>
													{record.title}
													{record.people ? ` w/ ${record.people}` : ""}
													{record.location ? ` @ ${record.location}` : ""}
												</p>
											</td>
										</tr>
									))}
								</tbody>
							</table>
						) : null}
					</div>
				</div>
			</div>
		</form>
	)
}
