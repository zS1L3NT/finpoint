export type Paginated<T> = {
	data: T[]
	links: { active: boolean; label: string; url: string }[]
}

export type Account = {
	id: string
	name: string
}

export type Statement = {
	id: string
	date: string
	description: string
	amount: number
}

export type Record = {
	id: string
	date: string
	title: string
	people: string | null
	location: string | null
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
	description: string
}