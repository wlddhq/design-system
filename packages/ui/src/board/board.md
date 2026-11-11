---
name: Board
component: Board
parts: BoardColumn, BoardCard
summary: Records as cards in columns. Drag a card to move it to another stage.
status: stable
group: views
---

## When to use

- When moving records between stages is the work: a pipeline, a hiring flow.
- One column per group (stage, pod, lead). Empty columns stay, so cards can land in them.

## Do

- Pass `onMove(card, column)` and update your data there. Cards glide to their new place.
- Put the code and lead on the top row, the logo and name in the middle, and two or three facts in `meta`.
- Give each column a count, and its budget as `aside`.

## Don't

- Don't make dragging the only way to move a record. Keep a stage menu on the record, for keyboards and phones.
- Don't repeat what the column already says. On a stage board, leave the stage off the card.

## Edge cases

- Without `onMove` the board is read-only: no dragging.
- Columns scroll sideways when they don't fit. On phones each column is most of the screen wide and snaps into place.
- Long names truncate; `meta` wraps onto a second line.
- Reduced motion: cards jump to their new place instead of gliding.
