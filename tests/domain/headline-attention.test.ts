import { expect, test } from "bun:test"
import { buildHeadline } from "../../src/logic/dashboard"

test("headline uses plan, majority category and month status", () => {
 expect(buildHeadline(1530, 3150, [{ name: "Rent", share: 80 }], "November", 27, false)).toBe("You've spent $1,530.00 of your $3,150.00 plan. Rent is most of it. 27 days left.")
 expect(buildHeadline(210, null, [], "October", 0, false)).toBe("You've spent $210.00. October is complete.")
 expect(buildHeadline(210, 200, [{ name: "Food", share: 49 }], "October", 0, false)).toBe("You've spent $210.00 of your $200.00 plan. October closed $10.00 over plan.")
 expect(buildHeadline(0, 200, [], "December", 31, true)).toBe("Your December plan is $200.00.")
})

test("Attention ranks budgets first and caps the list at three", async () => {
 const { buildAttention } = await import("../../src/logic/dashboard")
 const data = {
 monthlyBudgets: [{ id: "rent", name: "Rent", remaining: -10 }],
 review: { unallocated_statements: 2, pending_records: 1, pending_statements: 1 },
 summary: { unbudgeted_count: 1 },
 } as Parameters<typeof buildAttention>[0]
 const rows = buildAttention(data, "October", 2026)
 expect(rows).toHaveLength(3)
 expect(rows[0].selection).toEqual({ kind: "budget", value: "rent" })
 expect(rows[1].href).toContain("is_pending=false")
 expect(rows[2].label).toContain("Pending Record")
 data.monthlyBudgets = []
 data.review = { unallocated_statements: 0, pending_records: 0, pending_statements: 1 }
 expect(buildAttention(data, "October", 2026).map(r => r.label)).toEqual(["1 Pending Statement", "1 unbudgeted spending Record"])
})
