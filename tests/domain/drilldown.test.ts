import { expect, test } from "bun:test"
import Dexie from "dexie"
import { indexedDB, IDBKeyRange } from "fake-indexeddb"
import { DateTime, Settings } from "luxon"
Dexie.dependencies.indexedDB = indexedDB
Dexie.dependencies.IDBKeyRange = IDBKeyRange
const { db } = await import("../../src/data/db")
const { loadDemoWorkspace } = await import("../../src/logic/workspace")
const { getDashboardView } = await import("../../src/logic/dashboard")
const { getDrilldown } = await import("../../src/logic/drilldown")

test("every demo calendar day reconciles with its drill-down across scopes", async () => {
	const now = Settings.now
	Settings.now = () => new Date("2026-11-07T12:00:00+08:00").getTime()
	try {
		await loadDemoWorkspace()
		const months = new Set((await db.records.toArray()).map(r => r.datetime.slice(0, 7)))
		const scopes = ["all", ...(await db.monthly_budgets.toArray()).map(b => b.id)]
		for (const month of months) {
			const date = DateTime.fromISO(`${month}-01`)
			for (const scope of scopes) {
				const view = await getDashboardView({
					month: date.toFormat("MMMM"),
					year: date.year,
					scope,
				})
				for (const day of view.scopedDaily) {
					const drill = await getDrilldown(date.toFormat("MMMM"), date.year, scope, {
						kind: "day",
						value: day.date,
					})
					expect(drill?.total).toBeCloseTo(Math.max(day.spending, 0), 2)
					const amounts = drill!.records.map(r => Math.abs(r.amount))
					expect(amounts).toEqual([...amounts].sort((a, b) => b - a))
				}
			}
		}
	} finally {
		Settings.now = now
	}
}, 120000)

test("missing drill Statement focus returns null", async () => {
	const { getDrillStatement } = await import("../../src/logic/drilldown")
	expect(await getDrillStatement("missing-focus")).toBeNull()
})

test("category rows, movers and trend months reconcile across scopes", async () => {
	const now = Settings.now
	Settings.now = () => new Date("2026-11-07T12:00:00+08:00").getTime()
	try {
		await loadDemoWorkspace()
		for (const scope of ["all", ...(await db.monthly_budgets.toArray()).map(b => b.id)]) {
			const view = await getDashboardView({ month: "October", year: 2026, scope })
			for (const c of view.scopedCategories) {
				expect(
					(await getDrilldown("October", 2026, scope, { kind: "category", value: c.id }))
						?.total,
				).toBeCloseTo(c.spending, 2)
				expect(
					(
						await getDrilldown("October", 2026, scope, {
							kind: "category-gross",
							value: c.id,
						})
					)?.total,
				).toBeCloseTo(c.outflow, 2)
			}
			for (const m of view.dashboard.comparison_history.filter(m => m.included)) {
				const at = DateTime.fromFormat(m.month, "MMM yyyy").toFormat("yyyy-MM")
				let total = 0
				for (const c of m.categories) {
					const value =
						scope === "all" ? c.spending : (c.monthly_budget_spending[scope] ?? 0)
					total += value
					if (value === 0) continue
					expect(
						(
							await getDrilldown("October", 2026, scope, {
								kind: "category-gross",
								value: c.id,
								at,
							})
						)?.total,
					).toBeCloseTo(value, 2)
				}
				expect(
					(await getDrilldown("October", 2026, scope, { kind: "month", value: at }))
						?.total,
				).toBeCloseTo(total, 2)
			}
		}
	} finally {
		Settings.now = now
	}
}, 120000)

test("Monthly Budget cards and legend reconcile including refunds and plan amounts", async () => {
	const now = Settings.now
	Settings.now = () => new Date("2026-11-07T12:00:00+08:00").getTime()
	try {
		await loadDemoWorkspace()
		const view = await getDashboardView({ month: "October", year: 2026, scope: "all" })
		for (const b of view.dashboard.monthlyBudgets) {
			const drill = await getDrilldown("October", 2026, "all", {
				kind: "budget",
				value: b.id,
			})
			expect(drill?.total).toBeCloseTo(b.spending, 2)
			expect(drill?.budget?.amount).toBe(b.amount)
		}
		for (const b of view.pace.forecast) {
			const actual = b.points.filter(p => p.spending !== null).at(-1)?.spending ?? 0
			expect(
				(
					await getDrilldown("October", 2026, "all", {
						kind: "budget",
						value: b.id === "total" ? "all" : b.id,
					})
				)?.total,
			).toBeCloseTo(actual, 2)
		}
	} finally {
		Settings.now = now
	}
}, 120000)

 test("summary measures reconcile independently of spending scope", async () => {
 await loadDemoWorkspace()
 const view = await getDashboardView({month: "October", year: 2026, scope: "all"})
 const s = view.dashboard.summary
 for (const [value, total] of Object.entries({spent:s.spending, income:s.income, leftover:s.surplus, saved:s.contributions-s.withdrawals})) {
 expect((await getDrilldown("October",2026,"unbudgeted",{kind:"metric",value}))?.total).toBeCloseTo(total,2)
 }
 }, 30000)

 test("largest selection and Records amount sorting preserve month and scope", async () => {
 await loadDemoWorkspace()
 const {listRecords} = await import("../../src/logic/records")
 for (const scope of ["all", ...(await db.monthly_budgets.toArray()).map(b => b.id)]) {
 const drill = await getDrilldown("October", 2026, scope, {kind:"largest", value:""})
 const records = await listRecords({start_date:"2026-10-01",end_date:"2026-10-31", effective_spending:true,monthly_budget_id:scope === "all" ? undefined : scope,sort:"amount_desc"})
 expect(drill!.records.map(r=>r.id)).toEqual(records.map(r=>r.id))
 expect(records.map(r=>Math.abs(r.amount))).toEqual(records.map(r=>Math.abs(r.amount)).sort((a,b)=>b-a))
 expect(drill!.href).toContain("sort=amount_desc")
 }
 },120000)


test("compare drill uses the mover average and included same-period months", async () => {
 const now = Settings.now
 Settings.now = () => new Date("2026-10-15T12:00:00+08:00").getTime()
 try {
  await loadDemoWorkspace()
  for (const scope of ["all", (await db.monthly_budgets.toArray())[0]!.id]) {
   const view = await getDashboardView({month:"October",year:2026,scope})
   const category = view.scopedCategories.find(c => c.comparison !== null)
   if (!category) throw new Error("Expected comparison history")
   const drill = await getDrilldown("October",2026,scope,{kind:"compare",value:category.id})
   expect(drill!.total).toBeCloseTo(category.spending,2)
   expect(drill!.comparison!.average).toBeCloseTo(category.spending-category.comparison!,2)
   expect(drill!.comparison!.difference).toBeCloseTo(category.comparison!,2)
   expect(drill!.comparison!.months).toHaveLength(view.scopedComparisonCount)
   expect(drill!.comparison!.total/view.scopedComparisonCount).toBeCloseTo(drill!.comparison!.average!,2)
   for (const rows of [drill!.records,drill!.comparison!.records]) {
    expect(rows.map(r=>Math.abs(r.amount))).toEqual(rows.map(r=>Math.abs(r.amount)).sort((a,b)=>b-a))
   }
 expect(-drill!.comparison!.records.reduce((sum,r)=>sum+r.amount,0)/view.scopedComparisonCount).toBeCloseTo(drill!.comparison!.average!,2)
   expect(drill!.comparison!.records.every(r=>r.datetime.slice(8,10) <= "15")).toBe(true)
  }
  expect(await getDrilldown("October",2026,"all",{kind:"compare",value:"missing"})).toBeNull()
 } finally {Settings.now=now}
},30000)

test("Dashboard spending includes the $2.50 outside Monthly Budgets", async () => {
	await loadDemoWorkspace()
	const { dashboard: d } = await getDashboardView({ month: "October", year: 2026, scope: "all" })
	expect(d.spendingTotals.unbudgeted).toBe(2.5)
	expect(d.spendingTotals.budgeted + d.spendingTotals.unbudgeted).toBeCloseTo(d.summary.spending, 2)
	expect(d.summary.gross_spending - d.summary.refunds).toBeCloseTo(d.summary.spending, 2)
	expect(d.categories.reduce((sum, c) => sum + c.spending, 0)).toBeCloseTo(d.summary.spending, 2)
})

 test("spending drill reconciles gross spending and a cent-exact refund", async () => {
 await loadDemoWorkspace()
 const before=await getDrilldown("October",2026,"all",{kind:"metric",value:"spent"})
 const record=before!.records.find(r=>r.amount<0)!
 await db.records.update(record.id,{amount:34.72,treatment_choice:{kind:"explicit",value:"spending"}})
 const drill=await getDrilldown("October",2026,"all",{kind:"metric",value:"spent"})
 expect(drill!.refund_total).toBe(34.72)
 expect(drill!.gross_spending-drill!.refund_total).toBeCloseTo(drill!.total,2)
 expect(drill!.total).toBeCloseTo(before!.total+record.amount-34.72,2)
 },30000)

 test("Spent category groups partition Records and reconcile including a refund", async () => {
 await loadDemoWorkspace()
 const record=(await db.records.toArray()).find(r=>r.datetime.startsWith("2026-10")&&r.amount<0)!
 await db.records.update(record.id,{amount:34.72,treatment_choice:{kind:"explicit",value:"spending"}})
 const drill=(await getDrilldown("October",2026,"all",{kind:"metric",value:"spent"}))!
 expect(drill.groups.reduce((sum,g)=>sum+g.total,0)).toBeCloseTo(drill.total,2)
 expect(new Set(drill.groups.map(g=>g.category.id))).toEqual(new Set(drill.records.map(r=>r.category.id)))
 for(const group of drill.groups){
  const indices=drill.records.flatMap((r,i)=>r.category.id===group.category.id?[i]:[])
  expect(indices.at(-1)!-indices[0]!+1).toBe(indices.length)
  const amounts=drill.records.filter(r=>r.category.id===group.category.id).map(r=>Math.abs(r.amount))
  expect(amounts).toEqual([...amounts].sort((a,b)=>b-a))
 }
 },30000)
