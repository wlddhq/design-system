---
name: Table
component: Table
parts: Th, Td, Tr, RecordCell, CellButton, Aggregate
summary: A full-bleed grid of records with a sticky header, sticky record column and hairlines.
status: stable
group: data
---

## When to use

- Many records with several properties to compare: campaigns, invoices, vendors, outreach.
- When people sort, select in bulk, or edit values in place.
- For a few records with one or two properties, a list reads better.

## Do

- Start with a `select` column (Checkbox) and a `primary` column (RecordCell). End with a `fill` column.
- Give every header an icon and a one-word label.
- Make sortable headers clickable with `onSort`, and mark the current one with `sorted`.
- Edit values in place with a CellButton that opens a Popover.
- Use mono for codes, tabular numbers for money, muted text for dates.
- Put aggregates (Count, Sum, Avg) in a `tfoot` row with Aggregate.
- While rows load, pass `loading` (and `rows`). Keep the real `thead`: the skeleton reads its columns from it, so the select, record and fill columns stay in place.

## How much to load

One table, one behaviour: it scrolls. Never page numbers.

- **Up to about 200 rows** (campaigns, approvals): load them all at once.
- **More than that** (invoices, payments, outreach): load about 50, then pass `hasMore` and `onLoadMore`. Three skeleton rows follow the last row and fetch the next batch as they scroll into view. Set `hasMore={false}` when the server has no more.
- **Footer totals cover everything that matches**, not just the loaded rows. Get Count and Sum from the server; never add up the rows on screen.
- **Filters and tabs** are how people cut a long list down ("Active 17"), not pages.
- **Select all**: the header checkbox selects the loaded rows. Give the SelectionBar `total` and `onSelectAll`, so it offers "Select all 1,240" before a bulk action.

## Every state

- **First load**: `loading`. The real header, skeleton rows, no footer.
- **Nothing matches**: `empty={<Empty icon={…} title="No campaigns" />}`. One quiet line where the rows would be; the header stays so the columns still make sense.
- **Loading more**: `hasMore` with `onLoadMore`. Rows stay usable while the next batch arrives.
- **Long text**: the record column truncates with an ellipsis and opens the record; other columns grow with their content.
- **Inside PageScroll**: the table scrolls itself, so the header and footer always stay in view.

## Don't

- Don't use page numbers or a "Load more" button in a table. It loads as people scroll.
- Don't wrap a Table in a card. It runs edge to edge in the page.
- Don't colour whole rows. Colour lives in the cells that carry meaning.
- Don't show more than about eight property columns. Let people choose them in Display.
