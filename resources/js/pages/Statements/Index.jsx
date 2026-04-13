import React from "react"
import Layout from "../Layout"

export default function StatementsIndex({ statements }) {
    const decodeHtml = html => {
        return new DOMParser().parseFromString(html, "text/html").documentElement.textContent
    }

    return (
        <Layout title="Statement List">
            <h1 className="mb-4">Statements</h1>

            <table className="table">
                <thead>
                    <tr>
                        <th>Account</th>
                        <th>Date</th>
                        <th>Amount</th>
                        <th>Supplementary</th>
                        <th>Client</th>
                        <th>Record</th>
                    </tr>
                </thead>

                <tbody>
                    {statements.data.map(statement => (
                        <tr key={statement.id} id={statement.id}>
                            <td>{statement.account.name} ({statement.account.id})</td>
                            <td>{statement.transaction_date}</td>
                            <td style={{ color: statement.amount < 0 ? "red" : "green" }}>
                                {statement.amount < 0 ? `-$${Math.abs(statement.amount).toFixed(2)}` : `$${statement.amount.toFixed(2)}`}
                            </td>
                            <td>{statement.supplementary_code}</td>
                            <td>{statement.client_reference}</td>
                            <td></td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <nav>
                <ul className="pagination justify-content-center">
                    {statements.links.map(link => (
                        <li key={link.label} className={`page-item ${link.active ? "active" : ""}`}>
                            <a className="page-link" href={link.url}>
                                {decodeHtml(link.label)}
                            </a>
                        </li>
                    ))}
                </ul>
            </nav>
        </Layout>
    )
}