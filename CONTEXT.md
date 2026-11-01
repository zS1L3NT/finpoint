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
The assignment of part or all of a Statement amount to a Record. Use allocate/allocation for this connection; attach/detach describes Budget membership. “Match” describes an amount comparison, not an allocation.
_Avoid_: Link, match, reconciliation

**Account**:
An external financial account whose activity is imported into Finpoint. Accounts are sources of statements, not application users.
_Avoid_: User account, login account

**Pending Record**:
A record whose allocated statement amounts do not tally with the record amount, or that is allocated to any Pending Statement (its account activity is not confirmed yet). Pending records are useful when the real-world activity is known before the bank statements are fully confirmed.
_Avoid_: Draft record, unconfirmed record

**Pending Statement**:
A Statement whose account activity is not confirmed yet, whether entered manually or imported with a pending bank status. Pending describes confirmation state, not provenance. A Pending Statement may be allocated like any Statement; replacing it with a confirmed Statement preserves its allocations.
_Avoid_: Draft statement, estimated record

**Duplicate Statement**:
An imported statement that repeats another imported statement on the same account, day, and amount, usually because the bank changed its description between exports. Fixing duplicates keeps one statement and deletes the others; Allocations follow the kept statement.
_Avoid_: Survivor, double import, match

**Separate pair**:
Two same-day statements the user marked as not duplicates, so they are no longer suggested together. Marking is per pair and can be restored.
_Avoid_: Ignored match, false positive

**Budget**:
A spending plan with a custom date period and amount. Budget membership can be manual, or automatic when records fall within the budget period; records may still be attached or detached outside the period.
_Avoid_: Spending bucket, monthly target

**Monthly Budget**:
A reusable spending plan for calendar months, such as Daily, Recurring, Irregular, or Travel. Each month takes its amount from one of three amount rules (see Monthly Budget amount). An explicit null means no comparison amount; zero is a valid amount. Only Records whose effective treatment is Spending contribute to its totals. Archived Monthly Budgets retain historical assignments.
_Avoid_: Bucket, spending bucket, monthly target, custom-period budget

**Monthly Budget amount**:
The comparison amount for a Monthly Budget in a selected calendar month. Each month has exactly one of three amount rules. **Default**: the month has no amount of its own and looks back to the latest Override default in an earlier month; unavailable when no earlier Override default exists. **Override one month**: an amount for that month only; months looking back skip it. **Override default**: a default amount that applies from its month onward; months looking back stop at the latest one they reach. Changing a month's rule replaces its previous rule for that month only; changing a month away from Override default makes later months look further back. It does not reserve cash, carry a balance, or change a Record's accounting treatment.
_Avoid_: Target, limit, allowance

**Treatment**:
The accounting role of a Record: Income, Spending, Saving / investment, Transfer / excluded (counted in no total), or Automatic (income or spending by amount sign). A Category always supplies a treatment, defaulting to Automatic, and a Record may override it for an exception.
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
