---
name: Popover & Menu
component: Popover
parts: MenuItem, MenuLabel, MenuSeparator, PopoverSection, PopoverRow
summary: A floating panel anchored to a button, for menus, pickers and display options.
status: stable
group: controls
---

## When to use

- **Menus**: actions or choices from a button ("Filter", "Sort", a row's stage). Fill with MenuItem, MenuLabel and MenuSeparator.
- **Panels**: small settings next to their trigger, like Display options. Use PopoverSection and PopoverRow.

## Do

- Use a Button as the trigger. It shows as pressed while open.
- Mark the current choice with `checked`.
- Use `align="start"` when the trigger sits at the left of a bar or in a table cell.
- Lead items with an icon, Dot, Avatar or ProgressIcon so lists scan quickly.

## Don't

- Don't put long forms in a popover. Use a sheet.
- Don't nest more than one popover deep.
- Don't animate items in; the panel's scale-in is enough.

## Edge cases

- Taller than the room on screen: it scrolls inside. With no room below, it opens above.
- Keyboard: arrow keys move between menu items; Escape closes it and puts focus back on the trigger.
- A popover opened from a popover keeps its parent open. Only the newest one answers Escape.
