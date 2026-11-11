---
name: Sparkline
component: Sparkline
summary: A tiny trend line with no axes. Shape over numbers.
status: stable
group: data
---

## When to use

- On cards and metric tiles, to show which way something is moving: views, spend, replies.

## Do

- Put the number beside it. The line shows direction; the number gives the value.
- `tone="green"` when the trend is the good kind (a live campaign growing); `muted` otherwise.

## Don't

- Don't add axes, dots or labels. When people need values, use a chart.

## Edge cases

- Fewer than two values, or all values equal, draw a flat line. Missing values are skipped.
