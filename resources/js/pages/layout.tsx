import React from "react"
import AllocatorController from "@/wayfinder/actions/App/Http/Controllers/AllocatorController"
import CategoryController from "@/wayfinder/actions/App/Http/Controllers/CategoryController"
import ImporterController from "@/wayfinder/actions/App/Http/Controllers/ImporterController"
import RecordController from "@/wayfinder/actions/App/Http/Controllers/RecordController"

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
								<a className="nav-link" href={ImporterController.index.url()}>
									Importer
								</a>
							</li>
							<li className="nav-item">
								<a className="nav-link" href={AllocatorController.index.url()}>
									Allocator
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
