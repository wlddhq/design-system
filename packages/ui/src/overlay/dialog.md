---
name: Dialog
component: Dialog
summary: A focused question or short form in the centre of the screen.
status: stable
group: records
---

## When to use

- Confirming something that can't be undone: delete, reject, pay out.
- A short form people finish in one go: new campaign, rename.
- For anything that can be undone, skip the dialog: do it, then offer Undo in a toast.

## Do

- Title as a question for confirmations: "Delete campaign?". Say what happens in `description`.
- Footer: a secondary "Cancel", then one primary named for the action ("Delete", not "OK"). Use `variant="primary"`.
- `width` 420 for a confirmation, 560 for a form.

## Don't

- Don't open a dialog from a dialog.
- Don't put long forms here. More than about six fields belongs on a page or in a Sheet.

## Edge cases

- It sits near the top of the screen so it grows downward and never jumps as content changes.
- Escape, the ×, or a click outside closes it; focus returns to what opened it.
- Tall content scrolls inside the dialog body; header and footer stay.
- Phones: it rises from the bottom, full width, with full-width buttons.

## Accessibility

- Labelled by its title and described by its description. Tab stays inside.
