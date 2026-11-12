---
name: Record page
component: RecordHeader
parts: Stepper, PropertyList, Property, PropertySeparator, RecordLayout
summary: The parts of a record's own page. Header, stage stepper, key numbers, properties.
status: stable
group: records
---

## When to use

- A record's own page: a campaign, an invoice, a vendor. Where people work on one thing for a while.
- For a quick look from a list, use a Sheet with RecordHeader and PropertyList instead.

## Anatomy

Top to bottom, inside a `Page`:

1. `RecordHeader`: Logo (size 40), title × sub, a meta line (pod, services), then actions (Pin, then one primary: "Move to Activation").
2. `Stepper`: every stage, the current one green.
3. Section `Tabs variant="underline"`: Overview, Plan, Tracker, Report.
4. `RecordLayout` with `side`: the main column (brief, `Metrics`, cards) and a 280px `PropertyList`.

## Do

- One primary action in the header: the next step. Morph its label when it's done ("Move to Activation" → "In Activation").
- Two to four `Metric`s. Tone `green` only when the number is good news (margin above target).
- Group properties with `PropertySeparator`: people, then dates and links, then finance, then switches.

## Don't

- Don't repeat the TopBar title in the page. The TopBar shows the code; the header shows the name.
- Don't put more than about twelve properties in the side column.

## Edge cases

- Long names truncate in the header (on phones they wrap; the sub moves under the title).
- Below 960px the side column moves under the main column. On phones the Stepper keeps its bars and drops the names, and Metrics stack.
