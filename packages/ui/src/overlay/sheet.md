---
name: Sheet
component: Sheet
summary: A panel that slides in from the right over the page. A record's peek, a quick form.
status: stable
group: records
---

## When to use

- Clicking a record in a list, when people should glance at it and get back to the list: a peek.
- A quick form that belongs to the current page: add a vendor, log a payment.
- For a record people work in for a while, open its page instead.

## Do

- `width` 460 for a peek, 560 for a form.
- Lead with the RecordHeader, then a PropertyList; end with one link to the full page.
- Pass `label` (the record's name) so screen readers announce what opened.

## Don't

- Don't stack a sheet on a sheet. Replace its content, or open the full page.
- Don't put a Table in a sheet. It's too narrow.

## Edge cases

- Escape, the ×, or a click on the dimmed page closes it; focus goes back to what opened it.
- An open menu inside the sheet takes Escape first.
- The page behind doesn't scroll while it's open; the sheet scrolls on its own.
- Phones: it fills the screen, 8px from every edge.
- Reduced motion: it appears without sliding.

## Accessibility

- `role="dialog"` with `aria-modal`; Tab stays inside until it closes.
