import Icon from "@/components/icon"
import { Paginated, Record } from "@/types"
import { formatCurrency } from "@/utils"

export default function RecordsIndex({ records }: { records: Paginated<Record> }) {
	return (
		<>
			<h1 className="mb-4">Records</h1>

			<table className="table table-hover">
				<thead>
					<tr>
						<th style={{ width: 120 }}>Date</th>
						<th>Title</th>
						<th>Amount</th>
					</tr>
				</thead>

				<tbody>
					{Object.entries(Object.groupBy(records.data, record => record.date))
						.toSorted(([a], [b]) => b.localeCompare(a))
						.map(([date, records]) =>
							records?.map((record, i) => (
								<tr key={record.id} style={{ cursor: "pointer" }}>
									{i === 0 ? (
										<td rowSpan={records?.length ?? 0}>{date}</td>
									) : null}

									<td className="d-flex align-items-center gap-2">
										<Icon
											name={record.category.icon}
											color={record.category.color}
										/>
										<p className="m-0">
											<span>{record.title}</span>
											{record.people ? (
												<span>
													{" with "}
													<i>{record.people}</i>
												</span>
											) : null}
											{record.location ? (
												<span>
													{" @ "}
													<strong>{record.location}</strong>
												</span>
											) : null}
										</p>
									</td>
									<td
										className={
											record.amount < 0 ? "text-danger" : "text-success"
										}
									>
										{formatCurrency(record.amount)}
									</td>
								</tr>
							)),
						)}
				</tbody>
			</table>
		</>
	)
}
