// Pure sample-data exercises. Never import the database or financial mutations here.
import { round2 } from "@/logic/shared"
import { Validator } from "@/logic/validate"

export const practiceLessons = [
	{
		id: "lunch",
		title: "Explain a $12 lunch",
		topic: "lunch",
		task: "Save a Lunch Record for Paid $12, allocated to the −$12 Statement.",
		amounts: [-12],
		target: -12,
		labels: ["Lunch payment"],
		defaults: ["12", "12"],
	},
	{
		id: "pending",
		title: "Repair a Pending Record",
		topic: "pending",
		task: "First save a Paid $10 Record with the −$12 Allocation. Inspect Pending, then correct the Record to Paid $12 and save again.",
		amounts: [-12],
		target: -12,
		labels: ["Lunch payment"],
		defaults: ["10", "12"],
	},
	{
		id: "split",
		title: "Split an $80 payment",
		topic: "split",
		task: "Save Groceries for Paid $60 first. Then explain the remaining Paid $20 with a Gift Record. Both draw from the same −$80 Statement.",
		amounts: [-80],
		target: -60,
		labels: ["Supermarket payment"],
		defaults: ["60", "60"],
	},
	{
		id: "repayment",
		title: "Explain a shared dinner",
		topic: "repayment",
		task: "Your share is Paid $30. Allocate Paid $90 and Received $60 to the same Record, then save.",
		amounts: [-90, 60],
		target: -30,
		labels: ["Dinner payment", "Friends’ repayment"],
		defaults: ["30", "90", "60"],
	},
] as const

export type PracticeId = (typeof practiceLessons)[number]["id"]
export type PracticeSnapshot = {
	draft: string[]
	saved: number[] | null
	stage: number
	sawPending: boolean
}

export function getPracticeLesson(id: string | null | undefined) {
	return practiceLessons.find(lesson => lesson.id === id) ?? practiceLessons[0]
}

export function initialPractice(id: PracticeId): PracticeSnapshot {
	return { draft: [...getPracticeLesson(id).defaults], saved: null, stage: 0, sawPending: false }
}

export function savePractice(id: PracticeId, state: PracticeSnapshot): PracticeSnapshot {
	const lesson = getPracticeLesson(id)
	const v = new Validator()
	const values = state.draft.map((raw, index) => {
		if (!/^\d+(?:\.\d{1,2})?$/.test(raw.trim()))
			v.reject(
				`amount${index}`,
				"Enter a positive amount with at most two decimal places, such as 12 or 12.50.",
			)
		const amount = v.amount(raw, `amount${index}`)
		if (amount < 0 || amount > 1_000_000)
			v.reject(`amount${index}`, "Enter an amount between 0 and 1,000,000.")
		return amount * (index > 0 && (lesson.amounts[index - 1] ?? 0) > 0 ? 1 : -1)
	})
	if (values.length !== lesson.amounts.length + 1)
		v.reject("amount", "Restart this lesson to restore its sample fields.")
	for (let index = 1; index < values.length; index++) {
		if (values[index] === 0)
			v.reject(`amount${index}`, "Allocate a nonzero amount from this Statement.")
		const capacity =
			id === "split" && state.stage === 1 ? -20 : (lesson.amounts[index - 1] ?? 0)
		if (Math.abs(values[index] ?? 0) > Math.abs(capacity))
			v.reject(
				`amount${index}`,
				`Only $${Math.abs(capacity).toFixed(2)} is available from this Statement.`,
			)
	}
	if (values.slice(1).every(amount => amount === 0))
		v.reject("amount1", "Allocate an amount from the sample Statement before saving.")
	v.throwIfInvalid()
	const total = round2(values.slice(1).reduce((sum, amount) => sum + amount, 0))
	return {
		...state,
		saved: values,
		sawPending: state.sawPending || (id === "pending" && values[0] === -10 && total === -12),
	}
}

export function practiceResult(id: PracticeId, state: PracticeSnapshot) {
	if (!state.saved) return null
	const record = state.saved[0] ?? 0
	const allocated = round2(state.saved.slice(1).reduce((sum, amount) => sum + amount, 0))
	const lesson = getPracticeLesson(id)
	const remaining = lesson.amounts.map((amount, index) =>
		round2(
			(id === "split" && state.stage === 1 ? -20 : amount) - (state.saved?.[index + 1] ?? 0),
		),
	)
	const pending = allocated !== record || state.saved.slice(1).every(amount => amount === 0)
	const target = id === "split" && state.stage === 1 ? -20 : lesson.target
	const exactPendingExample = id === "pending" && record === -10 && allocated === -12
	const complete =
		!pending &&
		record === target &&
		(id === "split" && state.stage === 0
			? remaining[0] === -20
			: remaining.every(amount => amount === 0)) &&
		(id !== "pending" || state.sawPending)
	return {
		record,
		allocated,
		remaining,
		pending,
		difference: round2(record - allocated),
		complete,
		exactPendingExample,
	}
}
