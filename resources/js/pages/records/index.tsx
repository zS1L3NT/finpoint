import { router } from "@inertiajs/react"
import { DateTime } from "luxon"
import Icon from "@/components/icon"
import { Category, Paginated, Record, Statement } from "@/types"
import { decodeHtml, formatCurrency, styleCurrency } from "@/utils"
import RecordController from "@/wayfinder/actions/App/Http/Controllers/RecordController"

type RecordExtra = {
	category: Category
	statements: Statement[]
}

export default function RecordIndex({ records }: { records: Paginated<Record & RecordExtra> }) {
	const handleClick = (record: Record) => {
		router.visit(RecordController.show({ record: record.id }).url)
	}

	return (
		<>
			<h1 className="mb-4">Records</h1>

			<table className="table table-hover">
				<thead>
					<tr>
						<th style={{ width: 80 }}>Month</th>
						<th style={{ width: 200 }}>Date & Time</th>
						<th style={{ width: 120 }}>Amount</th>
						<th>Title</th>
					</tr>
				</thead>

				<tbody>
					{Object.entries(
						Object.groupBy(records.data, record =>
							record.date.slice(0, "YYYY-MM".length),
						),
					)
						.toSorted(([a], [b]) => b.localeCompare(a))
						.map(([month, monthRecords]) =>
							Object.entries(
								Object.groupBy(monthRecords ?? [], record =>
									record.date.slice(0, "YYYY-MM-DD".length),
								),
							)
								.toSorted(([a], [b]) => b.localeCompare(a))
								.map(([, dateRecords], dateIndex) =>
									dateRecords?.map((record, recordIndex) => (
										<tr
											key={record.id}
											style={{ cursor: "pointer" }}
											onClick={() => handleClick(record)}
										>
											{dateIndex === 0 && recordIndex === 0 ? (
												<td
													className="align-middle"
													rowSpan={monthRecords?.length ?? 0}
												>
													{DateTime.fromFormat(month, "y-MM").toFormat(
														"MMM yy",
													)}
												</td>
											) : null}

											{recordIndex === 0 ? (
												<td
													className="align-middle"
													rowSpan={dateRecords?.length ?? 0}
												>
													{DateTime.fromFormat(
														record.date,
														"y-MM-dd T",
													).toFormat("d MMM y h:mm a")}
												</td>
											) : null}

											<td
												className="align-middle"
												style={styleCurrency(record.amount)}
											>
												{formatCurrency(record.amount)}
											</td>

											<td className="d-flex align-items-center gap-2">
												<Icon {...record.category} />
												<p className="m-0">
													{record.title}
													{record.people ? ` with ${record.people}` : ""}
													{record.location ? ` @ ${record.location}` : ""}
												</p>
											</td>
										</tr>
									)),
								),
						)}
				</tbody>
			</table>

			<nav>
				<ul className="pagination justify-content-center">
					{records.links.map(link => (
						<li key={link.label} className={`page-item ${link.active ? "active" : ""}`}>
							<a className="page-link" href={link.url}>
								{decodeHtml(link.label)}
							</a>
						</li>
					))}
				</ul>
			</nav>
		</>
	)
}
