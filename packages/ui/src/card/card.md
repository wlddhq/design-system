---
name: Record card
component: RecordCard
parts: CardGrid, CardGroup
summary: One record as a card, in a responsive grid. Who, how it's trending, where it stands.
status: stable
group: views
---

## When to use

- The Grid view: a visual overview where each record's trend matters (views, spend).
- Use List or Table when people scan many records quickly. Cards show fewer per screen.

## Anatomy

- Head: Logo (size 32), title × sub, a caption (code · pod), the lead's Avatar in the corner.
- Body: a Sparkline. Footer: ProgressIcon + stage, TagList, the amount on the right. Meta: dates.

## Do

- Wrap the amount in `<span className="ml-auto">` so it sits on the right.
- Group cards with `CardGroup` when the view is grouped; use a bare `CardGrid` otherwise.

## Don't

- Don't put buttons on cards. The card opens the record.
- Don't nest cards or wrap a CardGrid in a card.

## Edge cases

- Long names truncate. On phones the grid becomes one column.
