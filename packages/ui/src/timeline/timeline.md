---
name: Timeline
component: Timeline
parts: TimelineGroup, TimelineRow
summary: Records as bars on a calendar. When each runs and how far along it is.
status: stable
group: views
---

## When to use

- When dates matter more than properties: what's running this month, what overlaps, what's late.

## Do

- Colour bars by state: yellow while set up, green when live, violet when complete.
- Pass `progress` (0 to 1) so the bar fills as the record moves through its stages.
- Give `label` (the client) and `detail` (the budget); they appear when the bar has room.
- Use `zoom` from the Display menu: week for the next month or two, quarter for the big picture.

## Don't

- Don't use a Timeline for records without real dates. A List is clearer.

## Edge cases

- Records with no end date get a one-month bar.
- It opens scrolled to today. Today outside the range draws no line.
- Hover a bar for its exact dates. Short bars hide their label.
- Below 960px the name column narrows to 128px.
