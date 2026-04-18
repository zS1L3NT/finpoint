import { router } from "@inertiajs/react"
import { TrashIcon } from "lucide-react"
import { DateTime } from "luxon"
import { useRef, useState } from "react"
import Icon from "@/components/icon"
import RecordSearch from "@/components/record-search"
import { Budget, Category, Record } from "@/types"
import { formatCurrency, styleCurrency } from "@/utils"
import ApiBudgetController from "@/wayfinder/actions/App/Http/Controllers/Api/BudgetController"
import ApiBudgetRecordController from "@/wayfinder/actions/App/Http/Controllers/Api/BudgetRecordController"
import WebBudgetController from "@/wayfinder/actions/App/Http/Controllers/BudgetController"
import WebRecordController from "@/wayfinder/actions/App/Http/Controllers/RecordController"

type BudgetExtra = {
	records: (Record & RecordExtra)[]
	records_sum_amount: number
}

type RecordExtra = {
	category: Category
}

export default function BudgetShow({ budget }: { budget: Budget & BudgetExtra }) {
	const handleClick = (record: Record) => {
		router.visit(WebRecordController.show({ record: record.id }).url)
	}

	const startDate = DateTime.fromFormat(budget.start_date, "y-MM-dd")
	const endDate = DateTime.fromFormat(budget.end_date, "y-MM-dd")

	const handleAttachRecord = async (record: Record) => {
		const formData = new FormData()
		formData.set("record_id", record.id)

		await fetch(ApiBudgetRecordController.store({ budget: budget.id }).url, {
			method: "POST",
			body: formData,
			headers: { Accept: "application/json" },
		}).then(res => {
			if (res.status === 200) {
				router.reload()
			}
		})
	}

	const handleDetachRecord = async (record: Record) => {
		const formData = new FormData()
		formData.set("_method", "DELETE")

		await fetch(
			ApiBudgetRecordController.destroy({ budget: budget.id, record: record.id }).url,
			{
				method: "POST",
				body: formData,
				headers: { Accept: "application/json" },
			},
		).then(res => {
			if (res.status === 200) {
				router.reload()
			}
		})
	}

	return (
		<>
			<div className="d-flex justify-content-between align-items-center mb-4">
				<h1 className="m-0">Budget {budget.id}</h1>

				<button
					type="button"
					className="btn btn-primary"
					data-bs-toggle="modal"
					data-bs-target="#budget-editor"
				>
					Edit
				</button>
			</div>

			<div className="my-3">
				<div className="row">
					<div className="col">
						<p className="m-0 fs-6 font-monospaced text-body-secondary">NAME</p>
						<p className="fs-3">{budget.name}</p>
					</div>

					<div className="col">
						<p className="m-0 fs-6 font-monospaced text-body-secondary">PERIOD</p>
						<p className="fs-5">
							{budget.start_date && budget.end_date
								? `${startDate.toFormat("d MMM y")} ~ ${endDate.toFormat("d MMM y")}`
								: "One-Time"}
						</p>
					</div>
				</div>

				<div className="row">
					<div className="col">
						<p className="m-0 fs-6 font-monospaced text-body-secondary">SPENT</p>
						<p className="fs-3">${-budget.records_sum_amount.toFixed(2)}</p>
					</div>

					<div className="col">
						<p className="m-0 fs-6 font-monospaced text-body-secondary">TOTAL</p>
						<p className="fs-3">${budget.amount.toFixed(2)}</p>
					</div>
				</div>
			</div>

			<div className="d-flex justify-content-between align-items-center mt-5 mb-4">
				<h3 className="m-0">Records</h3>

				<button
					className="btn btn-primary"
					data-bs-toggle="modal"
					data-bs-target="#record-search"
				>
					Add Record to Budget
				</button>
			</div>

			<table className="table table-hover" style={{ tableLayout: "fixed" }}>
				<thead>
					<tr>
						<th style={{ width: 200 }}>Date & Time</th>
						<th style={{ width: 125 }}>Amount ($)</th>
						<th>Title</th>
					</tr>
				</thead>

				<tbody>
					{budget.records.map(record => (
						<tr
							key={record.id}
							style={{ cursor: "pointer" }}
							onClick={() => handleClick(record)}
						>
							<td className="align-middle">
								{DateTime.fromFormat(record.datetime, "y-MM-dd T")
									.toFormat("d MMM y, h:mm a")
									.replace("12:00 AM", "-")}
							</td>
							<td className="align-middle" style={styleCurrency(record.amount)}>
								{formatCurrency(record.amount)}
							</td>
							<td className="d-flex align-items-center gap-2">
								<Icon {...record.category} />
								<p className="m-0" style={{ flex: 1 }}>
									{record.title}
									{record.people ? ` w/ ${record.people}` : ""}
									{record.location ? ` @ ${record.location}` : ""}
								</p>

								<button
									type="button"
									className="btn btn-danger ms-auto"
									onClick={async e => {
										e.stopPropagation()

										await handleDetachRecord(record)
									}}
								>
									<TrashIcon />
								</button>
							</td>
						</tr>
					))}
				</tbody>
			</table>

			<RecordSearch
				filter={record =>
					DateTime.fromFormat(record.datetime, "y-MM-dd T") >= startDate &&
					DateTime.fromFormat(record.datetime, "y-MM-dd T") <= endDate &&
					!budget.records.find(r => r.id === record.id)
				}
				handler={async (record, close) => {
					await handleAttachRecord(record)
					close()
				}}
			/>

			<BudgetEditor budget={budget} />
		</>
	)
}

function BudgetEditor({ budget }: { budget: Budget }) {
	const closeButtonRef = useRef<HTMLButtonElement>(null)
	const [errors, setErrors] = useState<globalThis.Record<string, string[]>>({})

	const handleDelete = async () => {
		const formData = new FormData()
		formData.set("_method", "DELETE")

		await fetch(ApiBudgetController.destroy({ budget: budget.id }).url, {
			method: "post",
			body: formData,
			headers: { Accept: "application/json" },
		}).then(res => {
			if (res.status === 200) {
				closeButtonRef.current?.click()
				router.visit(WebBudgetController.index.url())
			}
		})
	}

	const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
		e.preventDefault()

		const formData = new FormData(e.currentTarget)
		formData.set("_method", "PUT")

		await fetch(ApiBudgetController.update({ budget: budget.id }).url, {
			method: "post",
			body: formData,
			headers: { Accept: "application/json" },
		})
			.then(async res => [res, await res.json()] as const)
			.then(([res, data]) => {
				if (res.status === 422) {
					setErrors(data.errors)
				}

				if (res.status === 200) {
					closeButtonRef.current?.click()
					router.reload()
				}
			})
	}

	return (
		<>
			<form
				className="modal fade"
				id="budget-editor"
				tabIndex={-1}
				aria-labelledby="budget-editor-label"
				aria-hidden="true"
				onSubmit={handleSubmit}
			>
				<div className="modal-dialog modal-dialog-centered">
					<div className="modal-content">
						<div className="modal-header">
							<h1 className="modal-title fs-5" id="budget-editor">
								Budget Editor
							</h1>
							<button
								type="button"
								className="btn-close"
								data-bs-dismiss="modal"
								aria-label="Close"
							></button>
						</div>
						<div className="modal-body">
							<div className="mb-3">
								<label htmlFor="name" className="form-label">
									Name
								</label>
								<input
									type="text"
									className={`form-control ${errors.name?.length ? "is-invalid" : ""}`}
									name="name"
									id="name"
									defaultValue={budget.name}
								/>
								<div className="invalid-feedback">{errors.name?.join("\n")}</div>
							</div>

							<div className="mb-3">
								<label htmlFor="amount" className="form-label">
									Amount ($)
								</label>
								<input
									type="number"
									className={`form-control ${errors.amount?.length ? "is-invalid" : ""}`}
									name="amount"
									id="amount"
									step={0.01}
									defaultValue={budget.amount}
								/>
								<div className="invalid-feedback">{errors.amount?.join("\n")}</div>
							</div>

							<div className="form-check mb-3">
								<input
									type="checkbox"
									className={`form-check-input ${errors.automatic?.length ? "is-invalid" : ""}`}
									name="automatic"
									id="automatic"
									defaultChecked={budget.automatic}
								/>
								<label htmlFor="automatic" className="form-check-label">
									Automatically attach new records in date range
								</label>
								<div className="invalid-feedback">
									{errors.automatic?.join("\n")}
								</div>
							</div>
						</div>
						<div className="modal-footer">
							<button
								type="button"
								className="btn btn-danger me-auto"
								onClick={handleDelete}
							>
								Delete
							</button>
							<button
								ref={closeButtonRef}
								type="button"
								className="btn btn-secondary"
								data-bs-dismiss="modal"
							>
								Close
							</button>
							<button type="submit" className="btn btn-primary">
								Save
							</button>
						</div>
					</div>
				</div>
			</form>
		</>
	)
}
