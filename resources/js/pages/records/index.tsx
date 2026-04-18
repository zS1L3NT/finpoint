import { router } from "@inertiajs/react"
import { DateTime } from "luxon"
import Icon from "@/components/icon"
import { Category, Paginated, Record, Statement } from "@/types"
import { formatCurrency, styleCurrency } from "@/utils"
import WebRecordController from "@/wayfinder/actions/App/Http/Controllers/RecordController"

type RecordExtra = {
	category: Category
	statements: Statement[]
}

export default function RecordIndex({ records }: { records: Paginated<Record & RecordExtra> }) {
	const handleClick = (record: Record) => {
		router.visit(WebRecordController.show({ record: record.id }).url)
	}

	return (
		<>
			<h1 className="mb-2">Records</h1>

			<div className="d-flex justify-content-end">
				<input
					type="text"
					className="form-control mb-4"
					style={{ width: 300 }}
					placeholder="Search..."
					value={new URLSearchParams(window.location.search).get("query") ?? ""}
					onChange={e => {
						router.reload({ data: { query: e.target.value } })
					}}
				/>
			</div>

			<table className="table table-hover">
				<thead>
					<tr>
						<th style={{ width: 80 }}>Month</th>
						<th style={{ width: 120 }}>Date</th>
						<th style={{ width: 100 }}>Time</th>
						<th style={{ width: 120 }}>Amount</th>
						<th>Title</th>
					</tr>
				</thead>

				<tbody>
					{Object.entries(
						Object.groupBy(records.data, record =>
							record.datetime.slice(0, "YYYY-MM".length),
						),
					)
						.toSorted(([a], [b]) => b.localeCompare(a))
						.map(([month, monthRecords]) =>
							Object.entries(
								Object.groupBy(monthRecords ?? [], record =>
									record.datetime.slice(0, "YYYY-MM-DD".length),
								),
							)
								.toSorted(([a], [b]) => b.localeCompare(a))
								.map(([date, dateRecords], dateIndex) =>
									Object.entries(
										Object.groupBy(dateRecords ?? [], record =>
											record.datetime.slice(0, "YYYY-MM-DD HH:mm".length),
										),
									)
										.toSorted(([a], [b]) => b.localeCompare(a))
										.map(([, timeRecords], timeIndex) =>
											timeRecords?.map((record, recordIndex) => (
												<tr
													key={record.id}
													style={{ cursor: "pointer" }}
													onClick={() => handleClick(record)}
												>
													{timeIndex === 0 &&
													dateIndex === 0 &&
													recordIndex === 0 ? (
														<td
															className="align-middle"
															rowSpan={monthRecords?.length ?? 0}
														>
															{DateTime.fromFormat(
																month,
																"y-MM",
															).toFormat("MMM yy")}
														</td>
													) : null}

													{timeIndex === 0 && recordIndex === 0 ? (
														<td
															className="align-middle"
															rowSpan={dateRecords?.length ?? 0}
														>
															{DateTime.fromFormat(
																date,
																"y-MM-dd",
															).toFormat("d MMM y")}
														</td>
													) : null}

													<td className="align-middle">
														{DateTime.fromFormat(
															record.datetime,
															"y-MM-dd T",
														)
															.toFormat("h:mm a")
															.replace("12:00 AM", "-")}
													</td>

													<td
														className="align-middle"
														style={styleCurrency(record.amount)}
													>
														{formatCurrency(record.amount)}
													</td>

													<td className="d-flex align-items-center gap-2">
														<Icon {...record.category} size={16} />
														<p className="m-0">
															{record.title}
															{record.people
																? ` w/ ${record.people}`
																: ""}
															{record.location
																? ` @ ${record.location}`
																: ""}
														</p>
													</td>
												</tr>
											)),
										),
								),
						)}
				</tbody>
			</table>

			<nav>
				<ul className="pagination justify-content-center">
					{records.links.map(link => (
						<li key={link.label} className={`page-item ${link.active ? "active" : ""}`}>
							<a className="page-link" href={link.url}>
								{link.label.replace("&laquo;", "«").replace("&raquo;", "»")}
							</a>
						</li>
					))}
				</ul>
			</nav>
		</>
	)
}
