# 0002 Forecast pacing

## Context

A daily average repeats large early expenses such as rent throughout the month.

## Decision

For the current month, forecast spending is actual spending plus future dated Records plus average remaining spending from included months in the existing two-month comparison window. Coverage and manual exclusions apply to full historical months. Include spending strictly after today's day number, clamped to each historical month's length; scale by current remaining days divided by historical remaining days. Complete months with no spending count as zero.

Without usable history, use the median spending across every elapsed calendar day, including zero days. Average the middle two values for even day counts. Apply the same rule to each Monthly Budget and Unbudgeted chart line. Keep full precision until displayed totals are rounded.

Completed months show actual spending only. Future months retain their existing behaviour: no extrapolation.

## Rejected option

Option C, skipping Monthly Budgets named Recurring, is rejected because names are user data and do not define accounting behaviour.

## Consequences

History avoids repeating rent already paid. Scheduled Records are added independently of the historical estimate. With no history and only one elapsed day, the median is that day's spending: a day-1 rent can still produce a high forecast until more days are available. This is a limitation of the agreed fallback, not a special rule for rent. Independent medians by Monthly Budget need not add to the median of total daily spending; the Total chart line uses the median of total daily spending, matching its forecast summary.
