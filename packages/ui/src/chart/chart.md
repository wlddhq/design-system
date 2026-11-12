---
name: Charts
component: AreaChart
parts: Bars, ShareBar, ChartPanel
summary: The few charts a dashboard needs: a trend over time, amounts side by side, and how one whole splits.
status: stable
group: data
---

## When to use

- **AreaChart**: one measure over time. "Closed by month", "Views this quarter".
- **Bars**: amounts to compare: per month, per pod, per vendor.
- **ShareBar**: how one total splits by status: "Proposals: 4 converted, 6 approved, 3 mapped, 2 cancelled".
- One number that matters: not a chart. Use Metrics.

## Do

- Put the chart in a ChartPanel with a title that names the measure ("Closed by month"). The title is the legend for a single series.
- Give `label` the same words; screen readers and the hidden table use it.
- Format values the way the app reads them: ₹ lakhs, compact counts.
- Keep series colours in their order: --chart-1 green, --chart-2 violet, --chart-3 yellow, --chart-4 pink. A part's colour belongs to the thing, so it never changes when a filter removes another part.
- Fold anything past four parts into "Other" (`var(--chart-other)`).

## Don't

- Don't put two measures with different scales on one chart. Make two charts.
- Don't colour labels or numbers in the series colour; text stays in text colours.
- Don't use status colours (green good, red bad) as series colours, or series colours to mean status.
- Don't start an area or bar chart above zero. These charts always start at zero.
- Don't label every point. Hover (or the arrow keys) reads any value.

## Edge cases

- One value: the area draws a single point; a share with all zeros shows an empty grey bar and the legend with zeros.
- Long label lists squeeze; keep period names short ("Jun", not "June 2026").
- Charts are client components. A server page can't hand them a `format` function: put the chart (with its format) in a small `'use client'` file and render that.
- Negative values: AreaChart draws them below the zero line; Bars and ShareBar treat them as zero.

## Accessibility

- Every chart is focusable. ←/→ step through values (Home and End jump to the ends), and each value is announced. Esc clears.
- A hidden table carries every value for screen readers. ShareBar's legend names every part, its count and its share.
- Colours were checked for colour-blind separation in light and dark; the legend and readouts mean colour is never the only cue.
