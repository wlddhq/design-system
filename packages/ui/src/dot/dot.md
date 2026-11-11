---
name: Dot
component: Dot
parts: DotLabel
summary: A small colour mark for status or category, always beside text.
status: stable
group: primitives
---

## When to use

- **DotLabel** for a category in dense rows: pods (square), owners, channels.
- **Dot** alone beside your own text, for example a live status in a header.

## Do

- Use square dots for categories (pods) and round dots for status.
- Keep the colour meaning consistent: Pod green, Finance violet, Sales yellow, Creators pink.

## Don't

- Don't show a dot without text. Colour alone is invisible to some people.
- Don't scale dots up into badges. Use a Chip.
