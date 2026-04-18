import { router } from "@inertiajs/react"
import { DateTime } from "luxon"
import { useRef, useState } from "react"
import { Budget, Paginated } from "@/types"
import BudgetController from "@/wayfinder/actions/App/Http/Controllers/BudgetController"

export default function BudgetIndex({ budgets }: { budgets: Paginated<Budget> }) {
	const handleClick = (budget: Budget) => {
		router.visit(BudgetController.show({ budget: budget.id }).url)
	}

	return (
		<>
			<div className="d-flex justify-content-between align-items-center mb-4">
				<h1>Budgets</h1>

				<button
					type="button"
					className="btn btn-primary"
					data-bs-toggle="modal"
					data-bs-target="#budget-creator"
				>
					Create
				</button>
			</div>

			<table className="table table-hover">
				<thead>
					<tr>
						<th>Name</th>
						<th>Period</th>
						<th>Amount</th>
					</tr>
				</thead>

				<tbody>
					{budgets.data.map(budget => (
						<tr
							key={budget.id}
							style={{ cursor: "pointer" }}
							onClick={() => handleClick(budget)}
						>
							<td>{budget.name}</td>
							<td>
								{budget.start_date && budget.end_date
									? `${DateTime.fromFormat(budget.start_date, "y-MM-dd").toFormat(
											"d MMM y",
										)} ~ ${DateTime.fromFormat(
											budget.end_date,
											"y-MM-dd",
										).toFormat("d MMM y")}`
									: "One-Time"}
							</td>
							<td>${budget.amount.toFixed(2)}</td>
						</tr>
					))}
				</tbody>
			</table>

			<nav>
				<ul className="pagination justify-content-center">
					{budgets.links.map(link => (
						<li key={link.label} className={`page-item ${link.active ? "active" : ""}`}>
							<a className="page-link" href={link.url}>
								{link.label.replace("&laquo;", "«").replace("&raquo;", "»")}
							</a>
						</li>
					))}
				</ul>
			</nav>

			<BudgetCreator />
		</>
	)
}

function BudgetCreator() {
	const formRef = useRef<HTMLFormElement>(null)
	const closeButtonRef = useRef<HTMLButtonElement>(null)
	const [errors, setErrors] = useState<Record<string, string[]>>({})

	const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
		e.preventDefault()

		await fetch(BudgetController.store().url, {
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
			id="budget-creator"
			tabIndex={-1}
			aria-labelledby="budget-creator-label"
			aria-hidden="true"
			onSubmit={handleSubmit}
		>
			<div className="modal-dialog modal-dialog-centered">
				<div className="modal-content">
					<div className="modal-header">
						<h1 className="modal-title fs-5" id="budget-creator-label">
							Budget Creator
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
							<label htmlFor="start_date" className="form-label">
								Start Date
							</label>
							<input
								type="date"
								className={`form-control ${errors.start_date?.length ? "is-invalid" : ""}`}
								name="start_date"
								id="start_date"
								defaultValue=""
							/>
							<div className="invalid-feedback">{errors.start_date?.join("\n")}</div>
						</div>

						<div className="mb-3">
							<label htmlFor="end_date" className="form-label">
								End Date
							</label>
							<input
								type="date"
								className={`form-control ${errors.end_date?.length ? "is-invalid" : ""}`}
								name="end_date"
								id="end_date"
								defaultValue=""
							/>
							<div className="invalid-feedback">{errors.end_date?.join("\n")}</div>
						</div>

						<div className="form-check mb-3">
							<input
								type="checkbox"
								className={`form-check-input ${errors.automatic?.length ? "is-invalid" : ""}`}
								name="automatic"
								id="automatic"
								defaultChecked={true}
							/>
							<label htmlFor="automatic" className="form-check-label">
								Automatically attach records in date range
							</label>
							<div className="invalid-feedback">{errors.automatic?.join("\n")}</div>
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
