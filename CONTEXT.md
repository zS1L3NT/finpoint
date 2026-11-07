# Finpoint

Finpoint tracks imported account activity and the user-managed financial entries that explain it.

## Language

**Statement**:
An imported bank row from an external account feed. A statement may be allocated to one or more records.
Date-only statements may preserve a same-day timing order inferred from the bank export.
_Avoid_: Transaction, bank row, feed row

**Record**:
Records is the single ledger, with optional calendar-month navigation. Legacy Monthly Records URLs redirect here with their filters intact.
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

**Drill-down**:
The panel that lists the Records behind a number on the Dashboard, and their Allocations.
_Avoid_: Inspect panel, breakdown, details

**Effective spending**:
Personal spending selected by the effective Record treatment (Record override, otherwise Category default, otherwise amount sign), net of refunds. Transfer / excluded and Saving / investment do not contribute.
_Avoid_: Outflow, all money out

**Left over**:
Income minus personal spending, before Saving / investment contributions. It is a Record-based measure for the selected period and spending scope, not an account balance or available cash.
_Avoid_: Total shortfall/surplus, disposable cash

**Unbudgeted**:
Spending Records with no Monthly Budget assigned. These still count as spending.
_Avoid_: Uncategorised, unallocated

**Pace**:
A month-end spending estimate using prior-month spending patterns plus scheduled Records, with typical daily spending as a fallback when history is unavailable.
_Avoid_: Guaranteed forecast

**Irregular**:
An example Monthly Budget name for spending that does not occur every month. Names do not determine treatment or forecast behaviour.
_Avoid_: Special accounting type

**Money out / Money in**:
The Record editor's direction control: Money out stores a negative amount; Money in stores a positive amount. The amount field shows the magnitude. This direction is separate from treatment.
_Avoid_: Debit / credit

**Allocate**:
The workspace for assigning available Statement amounts to Records. Statement cleanup is accessed through Statements tabs.
_Avoid_: Workflows


## Example Dialogue

Developer: "Should this imported row become a transaction?"
Domain expert: "Call it a statement. A statement is the imported account activity we later allocate to records."

Developer: "Why is this record still pending?"
Domain expert: "Its allocated statements do not tally with the record amount yet."

Developer: "Should dining go under a Budget or Monthly Budget?"
Domain expert: "Use a Monthly Budget for reusable calendar-month planning. Use a budget when the plan has its own custom period."

Developer: "Why do Category, treatment, and Monthly Budget all exist?"
Domain expert: "The Category describes the Record, its treatment controls totals, and its optional Monthly Budget groups personal spending. Category defaults normally fill the other two."

**Comparison window**:
The included historical months used to calculate usual spending. Current months compare the same days so far; completed months compare full months. Months excluded or marked incomplete do not contribute. The window is shared by Biggest changes and its comparison Drill-down.
_Avoid_: Normal spending, expected spending

### Headline and Attention

The Dashboard Headline is a fixed factual sentence: spending against the selected plan,
a category contributing at least half of spending, and days left or the closed month's result.
With no plan it reports spending alone. Attention replaces the review chips with at most
three rows, prioritising over-plan Monthly Budgets, unallocated Statements, Pending Records,
Pending Statements, then unbudgeted spending. Budget rows open their drill-down; Statement
and Pending Record rows open their filtered work lists.
