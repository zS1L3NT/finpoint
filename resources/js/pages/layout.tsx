import React from "react"
import CategoryController from "@/actions/App/Http/Controllers/CategoryController"
import ImportController from "@/actions/App/Http/Controllers/ImportController"
import RecordController from "@/actions/App/Http/Controllers/RecordController"
import StatementController from "@/actions/App/Http/Controllers/StatementController"

export default function Layout({ children }: { children: React.ReactNode }) {
	return (
		<div className="d-flex flex-column">
			<nav className="navbar navbar-expand-lg bg-body-tertiary">
				<div className="container-fluid">
					<a className="navbar-brand" href="">
						Fintrack
					</a>
					<button
						className="navbar-toggler"
						type="button"
						data-bs-toggle="collapse"
						data-bs-target="#navbarNav"
						aria-controls="navbarNav"
						aria-expanded="false"
						aria-label="Toggle navigation"
					>
						<span className="navbar-toggler-icon"></span>
					</button>
					<div className="collapse navbar-collapse" id="navbarNav">
						<ul className="navbar-nav ms-auto">
							<li className="nav-item">
								<a className="nav-link" href={ImportController.index.url()}>
									Import
								</a>
							</li>
							<li className="nav-item">
								<a className="nav-link" href={StatementController.index.url()}>
									Statements
								</a>
							</li>
							<li className="nav-item">
								<a className="nav-link" href={RecordController.index.url()}>
									Records
								</a>
							</li>
							<li className="nav-item">
								<a className="nav-link" href={CategoryController.index.url()}>
									Categories
								</a>
							</li>
						</ul>
					</div>
				</div>
			</nav>

			<main className="container flex-grow-1 mt-5">{children}</main>

			<footer>
				<p className="text-center py-3">Copyright &copy; Zechariah Tan</p>
			</footer>
		</div>
	)
}
