---
name: Ticker
component: Ticker
summary: A number whose digits roll to the new value when it changes.
status: stable
group: motion
---

## When to use

- Metrics and totals that change while people watch: a range switch (Month → Quarter), an approval that moves money, a live count.

## Do

- Format it the way the page reads numbers: `format={inr}`, `format={(n) => Math.round(n) + '%'}`.
- Use it inside Metric (it already does) and for totals beside a heading.

## Don't

- Don't use it in tables or lists: rows re-render often and the motion becomes noise.
- Don't roll numbers on first load just to look alive. It moves only when the value changes.

## Edge cases

- Units and separators (₹, L, %, commas) stay still; only digits roll.
- When the number gains a digit, the new digit appears on the left and the rest keep their place.

## Accessibility

- Screen readers hear the whole value once, not each digit. Reduced motion: the value simply changes.
