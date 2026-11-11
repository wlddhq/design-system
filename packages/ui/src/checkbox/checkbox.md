---
name: Checkbox
component: Checkbox
summary: Selects a row or an option.
status: stable
group: primitives
---

## When to use

- Selecting rows in a table for bulk actions, with a SelectionBar.
- Multi-select options in settings and permission matrices.

## Do

- Give every checkbox a `label` naming what it selects. It's read by screen readers.
- Use `indeterminate` on a header checkbox when only some rows are selected.

## Don't

- Don't use a checkbox for an instant on/off setting. That's a Switch.
- Don't put a checkbox where only one choice is allowed. Use Segmented or a Menu.
