import { createBrowserRouter, Navigate } from "react-router-dom"
import MonthLayout from "@/components/layout/month-layout"
import Layout from "@/layout"
import AccountPage from "@/views/account"
import AccountsPage from "@/views/accounts"
import AllocatorPage from "@/views/allocator"
import AllocatorPendingPage from "@/views/allocator-pending"
import BudgetPage from "@/views/budget"
import BudgetsPage from "@/views/budgets"
import CategoriesPage from "@/views/categories"
import DashboardPage from "@/views/dashboard"
import DataSettingsPage from "@/views/data-settings"
import ImporterPage from "@/views/importer"
import MonthlyRecordsPage from "@/views/monthly-records"
import PrivacyPage from "@/views/privacy"
import RecordPage from "@/views/record"
import RecordsPage from "@/views/records"
import StatementPage from "@/views/statement"
import StatementsPage from "@/views/statements"
import TermsPage from "@/views/terms"

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
			{ path: "privacy", element: <PrivacyPage /> },
			{ path: "terms", element: <TermsPage /> },
			{ path: "*", element: <Navigate to="/" replace /> },
		],
	},
])
