// Client-side route paths (replaces the generated `@/wayfinder/routes`).
// Keep all route strings in one place so pages/components never hardcode URLs.

export const pathDashboard = (query?: Record<string, string | undefined>) => withQuery("/", query)
export const pathImporter = () => "/importer"
export const pathAllocator = (query?: Record<string, string | undefined>) =>
	withQuery("/allocator", query)
export const pathAllocatorPending = (query?: Record<string, string | undefined>) =>
	withQuery("/allocator/pending", query)
export const pathStatements = (query?: Record<string, string | undefined>) =>
	withQuery("/statements", query)
export const pathStatement = (id: string) => `/statements/${id}`
export const pathAccounts = (query?: Record<string, string | undefined>) =>
	withQuery("/accounts", query)
export const pathAccount = (id: string) => `/accounts/${id}`
export const pathMonthlyRecords = (query?: Record<string, string | undefined>) =>
	withQuery("/records/monthly", query)
export const pathRecords = (query?: Record<string, string | undefined>) =>
	withQuery("/records", query)
export const pathRecord = (id: string) => `/records/${id}`
export const pathBudgets = (query?: Record<string, string | undefined>) =>
	withQuery("/budgets", query)
export const pathBudget = (id: string) => `/budgets/${id}`
export const pathCategories = () => "/categories"
export const pathDataSettings = () => "/settings/data"

function withQuery(path: string, query?: Record<string, string | undefined>): string {
	if (!query) return path
	const params = new URLSearchParams()
	for (const [key, value] of Object.entries(query)) {
		if (value !== undefined && value !== "") params.set(key, value)
	}
	const suffix = params.toString()
	return suffix ? `${path}?${suffix}` : path
}
