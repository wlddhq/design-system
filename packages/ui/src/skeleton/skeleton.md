---
name: Skeleton
component: Skeleton
summary: A placeholder in the shape of data that's still loading. Only for data, never for the app's frame.
status: stable
group: data
---

## When to use

- A region whose content comes from the server and whose layout you already know: table rows, a record's name, a person's avatar, a card.
- Skeleton when the page or panel is loading. Loader when an action is running (Save, Import, Send).
- The frame renders straight away and never shows a skeleton: sidebar, top bar, toolbar, tabs, buttons, inputs, filters, column headers.

## Do

- Use the component's own `loading` prop first: `<Table loading rows={8}>`, `<RecordCell loading />`, `<Avatar loading size={20} />`. They lay skeletons out exactly like the real thing, so nothing moves when data arrives.
- Keep the real header when a table loads. Only the rows are skeletons.
- Show about as many skeleton rows as will fit on screen: 8 for a full page, 3 for a panel.
- Use `<Skeleton>` directly only for content that has no `loading` prop yet: `shape="line"` for text, `"circle"` for avatars and logos, `"block"` for cards.
- Match sizes: a 20px avatar becomes a 20px circle; a text line is about as wide as its usual text.

## Don't

- Don't skeleton buttons, inputs, tabs, the sidebar or the top bar. They're the frame, and they render immediately.
- Don't show a skeleton for less than a moment. If data usually arrives in under 300ms, show nothing until it does.
- Don't put a Loader on top of a skeleton. One loading signal at a time.
- Don't use skeletons as empty states. When the data has loaded and there's none, show Empty.

## Accessibility

- Skeletons are hidden from screen readers. `Table` sets `aria-busy` while loading.
- With reduced motion the shimmer stops; the grey shapes stay.
