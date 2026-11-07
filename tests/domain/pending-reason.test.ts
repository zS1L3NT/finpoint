import { expect, test } from "bun:test"
import { pendingReason } from "@/logic/records"

test("pending reason explains confirmation and allocation differences", () => {
 expect(pendingReason({ amount: -20, allocated_amount: 0, pending_statement_count: 0 })).toBe("No Statement yet")
 expect(pendingReason({ amount: -20, allocated_amount: -10, pending_statement_count: 0 })).toBe("$10.00 not allocated yet")
 expect(pendingReason({ amount: -20, allocated_amount: -20, pending_statement_count: 1 })).toBe("Statement not confirmed yet")
 expect(pendingReason({ amount: -20, allocated_amount: -20, pending_statement_count: 0 })).toBe("All Allocations are confirmed and tally with the Record amount.")
 expect(pendingReason({ amount: 0, allocated_amount: 0, pending_statement_count: 1 })).toBe("Statement not confirmed yet")
})

 test("pending reason explains opposite signs even when magnitudes match", () => {
 expect(pendingReason({ amount: 20, allocated_amount: -20, pending_statement_count: 0 })).toBe("Amounts have opposite signs")
 })
