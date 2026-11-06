import { expect, test } from "bun:test"
import { pendingReason } from "@/logic/records"

test("pending reason explains confirmation and allocation differences", () => {
 expect(pendingReason({ amount: -20, allocated_amount: 0, pending_statement_count: 0 })).toBe("No Statements allocated yet.")
 expect(pendingReason({ amount: -20, allocated_amount: -10, pending_statement_count: 0 })).toBe("The allocated amount differs from the Record amount.")
 expect(pendingReason({ amount: -20, allocated_amount: -20, pending_statement_count: 1 })).toBe("Allocated account activity is awaiting confirmation.")
 expect(pendingReason({ amount: -20, allocated_amount: -20, pending_statement_count: 0 })).toBe("All Allocations are confirmed and tally with the Record amount.")
 expect(pendingReason({ amount: 0, allocated_amount: 0, pending_statement_count: 1 })).toBe("Allocated account activity is awaiting confirmation.")
})
