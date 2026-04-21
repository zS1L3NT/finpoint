import { router } from "@inertiajs/react"
import { useRef, useState } from "react"
import { Paginated, Recurrence } from "@/types"
import ApiRecurrenceController from "@/wayfinder/actions/App/Http/Controllers/Api/RecurrenceController"
import WebRecurrenceController from "@/wayfinder/actions/App/Http/Controllers/RecurrenceController"

export default function RecurrenceIndex({ recurrences }: { recurrences: Paginated<Recurrence> }) {
	const handleClick = (recurrence: Recurrence) => {
		router.visit(WebRecurrenceController.show({ recurrence: recurrence.id }).url)
	}

	return (
		<>
			<div className="d-flex justify-content-between align-items-center mb-4">
				<h1>Recurrences</h1>

				<button
					type="button"
					className="btn btn-primary"
					data-bs-toggle="modal"
					data-bs-target="#recurrence-creator"
				>
					Create
				</button>
			</div>

			<table className="table table-hover">
				<thead>
					<tr>
						<th>Name</th>
						<th>Amount</th>
						<th>Period</th>
					</tr>
				</thead>

				<tbody>
					{recurrences.data.map(recurrence => (
						<tr
							key={recurrence.id}
							style={{ cursor: "pointer" }}
							onClick={() => handleClick(recurrence)}
						>
							<td>{recurrence.name}</td>
							<td>${recurrence.amount.toFixed(2)}</td>
							<td>
								{recurrence.period[0].toUpperCase() + recurrence.period.slice(1)}ly
							</td>
						</tr>
					))}
				</tbody>
			</table>

			<nav>
				<ul className="pagination justify-content-center">
					{recurrences.links.map(link => (
						<li key={link.label} className={`page-item ${link.active ? "active" : ""}`}>
							<a className="page-link" href={link.url}>
								{link.label.replace("&laquo;", "«").replace("&raquo;", "»")}
							</a>
						</li>
					))}
				</ul>
			</nav>

			<RecurrenceCreator />
		</>
	)
}

function RecurrenceCreator() {
	const formRef = useRef<HTMLFormElement>(null)
	const closeButtonRef = useRef<HTMLButtonElement>(null)
	const [errors, setErrors] = useState<Record<string, string[]>>({})

	const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
		e.preventDefault()

		await fetch(ApiRecurrenceController.store().url, {
			method: "post",
			body: new FormData(e.currentTarget),
			headers: { Accept: "application/json" },
		})
			.then(async res => [res, await res.json()] as const)
			.then(([res, data]) => {
				if (res.status === 422) {
					setErrors(data.errors)
				}

				if (res.status === 201) {
					formRef.current?.reset()
					closeButtonRef.current?.click()
					router.reload()
					setErrors({})
				}
			})
	}

	return (
		<form
			ref={formRef}
			className="modal fade"
			id="recurrence-creator"
			tabIndex={-1}
			aria-labelledby="recurrence-creator-label"
			aria-hidden="true"
			onSubmit={handleSubmit}
		>
			<div className="modal-dialog modal-dialog-centered">
				<div className="modal-content">
					<div className="modal-header">
						<h1 className="modal-title fs-5" id="recurrence-creator-label">
							Recurrence Creator
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
								defaultValue=""
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
								defaultValue=""
							/>
							<div className="invalid-feedback">{errors.amount?.join("\n")}</div>
						</div>

						<div className="mb-3">
							<label htmlFor="period" className="form-label">
								Period
							</label>
							<select
								className={`form-select ${errors.period?.length ? "is-invalid" : ""}`}
								name="period"
								id="period"
								defaultValue="month"
							>
								<option value="week">Weekly</option>
								<option value="month">Monthly</option>
								<option value="year">Yearly</option>
							</select>
							<div className="invalid-feedback">{errors.period?.join("\n")}</div>
						</div>
					</div>
					<div className="modal-footer">
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
	)
}
