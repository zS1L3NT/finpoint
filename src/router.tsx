import { createBrowserRouter, Navigate } from "react-router-dom"
import MonthLayout from "@/components/layout/month-layout"
import Layout from "@/layout"
import AccountPage from "@/pages/account"
import AccountsPage from "@/pages/accounts"
import AllocatorPage from "@/pages/allocator"
import AllocatorPendingPage from "@/pages/allocator-pending"
import BudgetPage from "@/pages/budget"
import BudgetsPage from "@/pages/budgets"
import CategoriesPage from "@/pages/categories"
import DashboardPage from "@/pages/dashboard"
import DataSettingsPage from "@/pages/data-settings"
import ImporterPage from "@/pages/importer"
import MonthlyRecordsPage from "@/pages/monthly-records"
import RecordPage from "@/pages/record"
import RecordsPage from "@/pages/records"
import StatementPage from "@/pages/statement"
import StatementsPage from "@/pages/statements"

export const router = createBrowserRouter([
	{
		path: "/",
		element: <Layout />,
		children: [
			{
				element: <MonthLayout />,
				children: [
					{ index: true, element: <DashboardPage /> },
					{ path: "records/monthly", element: <MonthlyRecordsPage /> },
				],
			},
			{ path: "importer", element: <ImporterPage /> },
			{ path: "allocator", element: <AllocatorPage /> },
			{ path: "allocator/pending", element: <AllocatorPendingPage /> },
			{ path: "statements", element: <StatementsPage /> },
			{ path: "statements/:id", element: <StatementPage /> },
			{ path: "accounts", element: <AccountsPage /> },
			{ path: "accounts/:id", element: <AccountPage /> },
			{ path: "records", element: <RecordsPage /> },
			{ path: "records/:id", element: <RecordPage /> },
			{ path: "budgets", element: <BudgetsPage /> },
			{ path: "budgets/:id", element: <BudgetPage /> },
			{ path: "categories", element: <CategoriesPage /> },
			{ path: "settings/data", element: <DataSettingsPage /> },
			{ path: "*", element: <Navigate to="/" replace /> },
		],
	},
])
