---
name: Tabs & Segmented
component: Tabs
parts: Segmented
summary: Switch views or sections. Tabs for views of records, Segmented for a small choice in place.
status: stable
group: controls
---

## When to use

- **Tabs, pill** in the view bar above a list or table: All · Active · Pipeline, each with its count.
- **Tabs, underline** for sections of one record: Overview · Deliverables · Payments.
- **Segmented** for two to five options that apply immediately: Light · Dark · System, List · Board.

## Do

- Show the count of each view beside its label.
- Keep labels to one word where you can.

## Don't

- Don't use tabs for app navigation. That's the sidebar.
- Don't put more than five options in Segmented. Use a Select.
- Don't animate a sliding marker for page-level navigation.

## Edge cases

- More tabs than fit: the row scrolls sideways. Tabs never wrap onto a second line.
- Keyboard: one Tab stop for the group; arrow keys, Home and End move and select.
- A count of 0 still shows. It's information.
