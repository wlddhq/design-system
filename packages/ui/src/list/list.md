---
name: List
component: List
parts: ListGroup, ListRow, ListTitle, ListCell
summary: Records as grouped rows. The calm default view for a work queue.
status: stable
group: views
---

## When to use

- The default view for records people work through: campaigns, approvals, outreach. Grouped by what matters next (stage, pod, lead).
- Prefer Table when people compare many properties or edit in place; Board when moving things between stages is the job.

## Anatomy

- `List` › `ListGroup` (a header band: icon, label, count, and an aside like the group's budget) › `ListRow`.
- A row, left to right: `ListCell kind="code"`, a ProgressIcon in a Tooltip, a Logo, `ListTitle`, then properties (TagList, Track, `ListCell kind="num"`, `ListCell kind="date"`, Avatar, AvatarGroup).

## Do

- Use `ListCell` for values that repeat down the list (code, budget, age), so they line up like a quiet table.
- Give big groups a `limit` (about 10). The rest sit behind "Show N more", one click away.
- Keep the group `count` the group's full size, even when `limit` hides some rows.
- Make every row open its record (`href` or `onClick`).

## Don't

- Don't put buttons inside rows. The row is the button; actions live in the record or the SelectionBar.
- Don't show more than five or six properties on a row. Let people pick them in Display.

## Edge cases

- **Loading**: `loading` shows skeleton rows. **Nothing**: `empty={<Empty … />}`.
- Long names truncate with an ellipsis; the fixed cells never squeeze.
- Phones keep the name and one number. Codes, tags, tracks, dates and teams step aside.
- Keyboard: arrow keys or j / k move between rows; Enter opens one. Group headers collapse with Enter or a click.
