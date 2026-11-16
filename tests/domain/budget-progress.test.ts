import { expect, test } from "bun:test"
import { budgetProgress } from "../../src/logic/budgets"

const record = (day: string, amount: number) => ({
	datetime: `${day} 12:00`,
	amount,
	analytics_treatment: "spending" as const,
})

test("Records dated outside the window keep their own points and never set the pace", () => {
	const progress = budgetProgress(
		[record("2026-09-20", -100), record("2026-10-02", -30), record("2026-10-12", -50)],
		"2026-10-01",
		"2026-10-10",
		"2026-10-05",
	)
	expect(progress.points.map(p => p.key)).toEqual([
		"before",
		...Array.from({ length: 10 }, (_, i) => `2026-10-${String(i + 1).padStart(2, "0")}`),
		"after",
	])
	expect(progress.points[0]?.usage).toBe(100)
	expect(progress.points[5]?.usage).toBe(130)
	expect(progress.points[6]?.usage).toBeNull()
	// $30 over five elapsed days: the $100 spent before the window is not pace.
	expect(progress.pace).toBe(6)
	expect(progress.scheduled).toBe(50)
	expect(progress.points.at(-1)).toMatchObject({ projection: 210, scheduled: 50 })
	expect(progress.projected).toBe(210)
})

test("a scheduled Record steps the projection up on its day", () => {
	const { points } = budgetProgress(
		[record("2026-10-01", -40), record("2026-10-04", -200)],
		"2026-10-01",
		"2026-10-05",
		"2026-10-02",
	)
	expect(points.map(p => p.projection)).toEqual([null, 40, 60, 280, 300])
	expect(points.map(p => p.scheduled)).toEqual([0, 0, 0, 200, 0])
})

test("a Budget that has not started projects its scheduled Records from what is already spent", () => {
	const progress = budgetProgress(
		[record("2026-09-01", -500), record("2026-10-02", -120)],
		"2026-10-01",
		"2026-10-03",
		"2026-09-15",
	)
	expect(progress.points.map(p => p.usage)).toEqual([500, null, null, null])
	expect(progress.points.map(p => p.projection)).toEqual([500, 500, 620, 620])
	expect(progress.elapsedDays).toBe(0)
})

test("a finished Budget with nothing scheduled has no projection", () => {
	const progress = budgetProgress(
		[record("2026-10-01", -40), record("2026-10-09", -10)],
		"2026-10-01",
		"2026-10-03",
		"2026-10-20",
	)
	expect(progress.points.every(p => p.projection === null)).toBe(true)
	expect(progress.points.at(-1)).toMatchObject({ key: "after", usage: 50 })
})
