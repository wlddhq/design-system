---
name: Selection bar
component: SelectionBar
summary: Floats at the bottom while rows are selected, holding the bulk actions.
status: stable
group: data
---

## When to use

- With a selectable Table or list, as soon as one row is selected.

## Do

- Two or three actions at most, as small Buttons with icons: "Next stage", "Pin".
- Pass `onClear`. It adds the × button and makes Escape clear the selection (an open menu closes first).
- When not every matching record is loaded, pass `total` and `onSelectAll`. The bar offers "Select all 1,240"; once everything is selected it reads "All 1,240 selected".

## Don't

- Don't put destructive actions here without a confirm step.
- Don't run a bulk action on "everything" when only the loaded rows were selected. Offer Select all first.
- Don't keep the bar when nothing is selected. It hides itself at 0.

## Accessibility

- The bar is a toolbar named by its count ("3 selected"). Clear has an accessible name.
