export type Appearance = "light" | "dark" | "system"

export type SharedPageProps = {
	appearance: Appearance
	sidebarOpen: boolean
}

export type PaginatedLink = {
	active: boolean
	label: string
	url: string | null
}

export type Paginated<T> = {
	data: T[]
	links: PaginatedLink[]
	total: number
	per_page: number
	current_page: number
}

export type Account = {
	id: string
	name: string
	bank: string
}

export type Statement = {
	id: string
	datetime: string
	description: string
	amount: number
}

export type Record = {
	id: string
	datetime: string
	title: string
	people: string | null
	location: string | null
	description: string | null
	amount: number
}

export type Category = {
	id: string
	name: string
	icon: string
	color: string
	parent_category_id: string | null
}

export type Allocation = {
	amount: number
}

export type Budget = {
	id: string
	name: string
	amount: number
	start_date: string
	end_date: string
	automatic: boolean
}

export type Recurrence = {
	id: string
	name: string
	amount: number
	period: "month" | "year"
}
