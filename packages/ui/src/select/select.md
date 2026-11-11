---
name: Select
component: Select
summary: Picks one option from a short list.
status: stable
group: controls
---

## When to use

- Settings rows and display options: Grouping, Ordering, Zoom.
- Any choice of six or more options, or where space is tight.

## Do

- Keep option labels short. Add an icon or lead visual when it helps scanning.
- Use Segmented instead when there are two to five options and room to show them all.

## Don't

- Don't use Select for actions. Use a Popover with MenuItems.

## Edge cases

- A value that matches no option shows the placeholder ("Select"), never a wrong option.
- No options: the button is disabled.
- Long option labels truncate in the button; the menu shows them in full.
