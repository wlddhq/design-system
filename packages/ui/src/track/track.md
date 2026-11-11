---
name: Track
component: Track
summary: Where a record is in its stages, as short bars. Fits a list row.
status: stable
group: data
---

## When to use

- In list rows and cards, beside or instead of the stage name, when people scan many records' progress at once.
- For a single status icon next to text, use ProgressIcon instead.

## Do

- Wrap it in a Tooltip with the stage name: `<Tooltip label="Pitch Details"><Track value={2} /></Tooltip>`.
- Keep `max` the real number of stages (6 for campaigns).

## Don't

- Don't use it for percentages or money. It counts steps.

## Edge cases

- Values below 0 or above max clamp. At max every bar turns green.
