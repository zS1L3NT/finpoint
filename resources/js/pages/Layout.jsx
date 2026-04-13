import { useEffect } from "react"

export default function Layout({ title, children, className }) {
    useEffect(() => {
        if (!!title) {
            document.title = title
        }
    }, [title])

    return (
        <div className="d-flex flex-column">
            <nav className="navbar navbar-expand-lg bg-body-tertiary">
                <div className="container-fluid">
                    <a className="navbar-brand" href="">Administrator Portal</a>
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarNav">
                        <ul className="navbar-nav ms-auto">
                            <li className="nav-item">
                                <a className="nav-link" href={route("import.index")}>Import</a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link" href={route("statements.index")}>Statements</a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link" href={route("records.index")}>Records</a>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>

            <main className={`container flex-grow-1 mt-5 ${className}`}>
                {children}
            </main>

            <footer>
                <p className="text-center py-3">Copyright &copy; Zechariah Tan</p>
            </footer>
        </div>
    )
}