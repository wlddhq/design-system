---
name: Chip & Tag
component: Chip
parts: Tag, TagList
summary: Short labels. Chip for words and status, Tag for mono codes.
status: stable
group: primitives
---

## When to use

- **Chip** for a status or a short word: "Paid", "Overdue", "Draft".
- **Tag** for codes such as services (AMP, INF, MEMD). Wrap a row of them in **TagList**.

## Do

- Use `tone` only when the chip carries meaning: green done, yellow waiting, pink failed, violet in review.
- Put the full meaning of a code in a Tooltip around the Tag.
- Keep chips to one or two words.

## Don't

- Don't colour a chip just to make it stand out.
- Don't add an outline to a filled chip. One layer per element.
- Don't use a chip as a button. Use Button size="sm".
- In dense rows, prefer a Dot with text over a filled chip.

## Edge cases

- Long labels truncate with an ellipsis. Keep them to a word or two; put anything longer in a Tooltip.
