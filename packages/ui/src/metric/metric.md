---
name: Metrics
component: Metrics
parts: Metric
summary: Headline numbers in one frame, each with a label and an optional trend. The top of a dashboard.
status: stable
group: data
---

## When to use

- The two to four numbers a person checks first: "To approve 6", "Scheduled ₹4.2L", "Billing ₹38L".
- In a side panel beside the work (Home), use `stacked`.
- On a record page: Budget · Plan cost · Margin, under the header.

## Anatomy

- **Label**: one or two words, quiet, above.
- **Value**: the number, big. It rolls when it changes (Ticker).
- **Trend** (optional): a small line of the last months, beside the value. Shape only; no axes.
- **Note** (optional): a small line under the value: "of ₹40L planned".

## Do

- Format money and counts the way the app does everywhere: ₹ lakhs, compact views, whole percentages.
- Make a tile a button (`onClick`) when it opens or explains something; mark the open one with `pressed`.
- Make it a link (`href`) when it simply goes to the page behind the number.
- Same labels as the pages they come from: "To approve" leads to the invoices waiting for approval.

## Don't

- Don't show more than four in a row. Group them by workspace, or use a table.
- Don't add up-and-down arrows or percentages unless people act on the change. A trend line already shows direction.
- Don't colour the number for direction. `tone="green"` only when it is good news against a target (margin above plan); `pink` when it needs action. A `note` says against what.

## Edge cases

- Long values never wrap; the tile shrinks the trend first.
- Phones: tiles stack, one per row.
- No data yet: show "—" as the value, not 0.

## Accessibility

- The group can be named with `label`. Each value is read once in full, even while it rolls.
- Clickable tiles are buttons or links with a visible focus ring; `pressed` sets aria-pressed.
