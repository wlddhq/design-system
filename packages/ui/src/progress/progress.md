---
name: Progress icon
component: ProgressIcon
summary: How far a record has moved through its stages, as a filling ring.
status: stable
group: primitives
---

## When to use

- Beside a stage name in tables and lists: a campaign's stage, an invoice's approval step.

## Do

- Always show the stage name next to it.
- Map tones to meaning once, for the whole product. Campaigns use neutral before the brief, yellow while being set up, green when live and violet when complete.

## Don't

- Don't use it for percentages of money or time. It counts steps.
- Don't animate it on load. It fills only when the value changes.

## Edge cases

- Out-of-range values clamp: below 0 draws the dashed ring, max or more draws the check. A missing number counts as 0.
