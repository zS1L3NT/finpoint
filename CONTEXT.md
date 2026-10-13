# Finpoint

Finpoint tracks imported account activity and the user-managed financial entries that explain it.

## Language

**Statement**:
An imported bank row from an external account feed. A statement may be allocated to one or more records.
Date-only statements may preserve a same-day timing order inferred from the bank export.
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
A record whose allocated statement amounts do not tally with the record amount, or that is allocated to any Pending Statement (its imported bank row has not arrived yet). Pending records are useful when the real-world activity is known before the bank statements are fully confirmed.
_Avoid_: Draft record, unconfirmed record

**Pending Statement**:
A handwritten placeholder for account activity that has not appeared in an imported bank feed yet. A pending statement may be allocated like any statement. When the imported statement arrives, it replaces one pending statement and inherits its allocations unchanged.
_Avoid_: Draft statement, estimated record

**Budget**:
A spending plan with a custom date period and amount. Budget membership can be manual, or automatic when records fall within the budget period; records may still be attached or detached outside the period.
_Avoid_: Spending bucket, monthly target

**Monthly Budget**:
A reusable spending plan for calendar months, such as Daily, Recurring, Irregular, or Travel. It has an optional default amount that applies from an effective month and an optional amount override for one month. An explicit null means no comparison amount; zero is a valid amount. Only Records whose effective treatment is Spending contribute to its totals. Archived Monthly Budgets retain historical assignments.
_Avoid_: Bucket, spending bucket, monthly target, custom-period budget

**Monthly Budget amount**:
The comparison amount for a Monthly Budget in a selected calendar month. A month override takes precedence over the latest eligible default amount. It does not reserve cash, carry a balance, or change a Record's accounting treatment.
_Avoid_: Target, limit, allowance

**Treatment**:
The accounting role of a Record: Income, Spending, Saving / investment, Transfer / excluded (counted in no total), or Automatic by direction (income or spending by amount sign). A Category supplies the normal default and a Record may override it for an exception.
_Avoid_: Bucket, category type

**Category**:
A category gives a Record user-facing meaning and supplies its usual treatment and optional default Monthly Budget. The defaults reduce repeated input; the Category, treatment, and Monthly Budget remain separate concepts.
_Avoid_: Budget category, bucket, treatment

**Subcategory**:
A category presented under another category for one layer of grouping. Use subcategory only when the parent-child presentation matters; otherwise it is still just a category.
_Avoid_: Child category

## Example Dialogue

Developer: "Should this imported row become a transaction?"
Domain expert: "Call it a statement. A statement is the imported account activity we later allocate to records."

Developer: "Why is this record still pending?"
Domain expert: "Its allocated statements do not tally with the record amount yet."

Developer: "Should dining go under a Budget or Monthly Budget?"
Domain expert: "Use a Monthly Budget for reusable calendar-month planning. Use a budget when the plan has its own custom period."

Developer: "Why do Category, treatment, and Monthly Budget all exist?"
Domain expert: "The Category describes the Record, its treatment controls totals, and its optional Monthly Budget groups personal spending. Category defaults normally fill the other two."
