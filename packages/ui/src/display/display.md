---
name: Display menu
component: ViewPicker
parts: ToggleChips
summary: The parts of a Display popover: layout tiles and property pills.
status: stable
group: views
---

## When to use

- Inside the toolbar's Display popover, to choose how records are shown.

## Anatomy

A Display popover, top to bottom:

1. `ViewPicker` with the layouts (List, Board, Table, Timeline, Grid).
2. A `PopoverSection` with Grouping and Ordering (Select in a PopoverRow).
3. A `PopoverSection` with Show completed (Switch).
4. Timeline only: Zoom.
5. `MenuLabel` "Properties", then `ToggleChips` for what rows and cards show.

## Do

- Remember the choice per person (localStorage is fine).
- Keep the same Display menu for every record type, so people learn it once.

## Don't

- Don't put filters here. Filters live in their own menu beside Display.
