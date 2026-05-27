# Finpoint

Finpoint tracks imported account activity and the user-managed financial entries that explain it.

## Language

**Statement**:
An imported bank row from an external account feed. A statement may be allocated to one or more records.
_Avoid_: Transaction, bank row, feed row

**Record**:
A user-managed financial entry that represents the meaningful expense, income, transfer, or adjustment behind account activity. A record may be linked to one or more statements.
_Avoid_: Transaction, entry, ledger item

**Allocation**:
The assignment of part or all of a statement amount to a record. Allocations are what connect imported account activity to the records that explain it.
_Avoid_: Link, match, reconciliation

**Account**:
An external financial account whose activity is imported into Finpoint. Accounts are sources of statements, not application users.
_Avoid_: User account, login account

**Pending Record**:
A record whose allocated statement amounts do not tally with the record amount. Pending records are useful when the real-world activity is known before the bank statements are fully confirmed.
_Avoid_: Draft record, unconfirmed record

**Budget**:
A spending plan with a custom date period and amount. Budget membership can be manual, or automatic when records fall within the budget period; records may still be attached or detached outside the period.
_Avoid_: Quota, monthly cap

**Quota**:
A named monthly spending bucket for records in one calendar month. Records are assigned to quotas manually; a quota may have a spending limit or no limit.
_Avoid_: Budget, category

**Category**:
A category decorates a record. It gives the record user-facing meaning, but has no relationship to budgets or quotas.
_Avoid_: Budget category, quota type

**Subcategory**:
A category presented under another category for one layer of grouping. Use subcategory only when the parent-child presentation matters; otherwise it is still just a category.
_Avoid_: Child category

## Example Dialogue

Developer: "Should this imported row become a transaction?"
Domain expert: "Call it a statement. A statement is the imported account activity we later allocate to records."

Developer: "Why is this record still pending?"
Domain expert: "Its allocated statements do not tally with the record amount yet."

Developer: "Should dining go under a budget or quota?"
Domain expert: "Use a quota for a monthly bucket. Use a budget when the plan has its own custom period."

Developer: "Does a category control whether a record appears in a budget or quota?"
Domain expert: "No. A category decorates the record; budgets and quotas are separate planning concepts."
