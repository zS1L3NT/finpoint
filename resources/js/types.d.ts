export type Paginated<T> = {
	data: T[]
	links: { active: boolean; label: string; url: string }[]
}

export type Account = {
	id: string
	name: string
}

export type Statement = {
	account: Account
	id: string
	transaction_date: string
	value_date: string
	statement_code: string
	description: string
	supplementary_code: string
	supplementary_code_description: string
	client_reference: string
	additional_reference: string
	status: string
	currency: string
	amount: number

	allocations_sum_amount: number | null
}

export type Record = {
	id: string
	date: string
	description: string
	amount: number
}

export type Category = {
	id: string
	name: string
	icon: string
	color: string
	parent_category_id: string | null
	children: Category[] | null

	can_delete: boolean
}
