---
name: Button
component: Button
summary: Starts an action. The only button in WLDD.
status: stable
group: primitives
---

## When to use

- **Primary** for the one main action on a view: New campaign, Approve, Pay.
- **Secondary** (the default) for every other action.
- **Ghost** in toolbars, top bars and rows, where an outline would add noise.
- **Small** inside rows, cards, sheets and dense toolbars.

## Do

- Keep labels to one or two words: "Approve", "Move to Activation".
- Use at most one primary button per view.
- Give an icon-only button an `aria-label`. It also becomes its tooltip text.
- Pass lucide icons as components: `icon={Plus}`.
- Show a shortcut with `kbd` when one exists.

## Don't

- Don't style a raw `<button>`. Pick a variant instead.
- Don't set colours, radii or shadows on a Button. The theme owns them.
- Don't write "Click here to…" or full sentences.
- Don't put two primary buttons side by side. Make one of them secondary.
- Don't use a Button for navigation inside the sidebar. That's a nav item.

## Edge cases

- A label longer than its space truncates with an ellipsis. The icon and shortcut never shrink.
- Busy: put a Loader in place of the icon and morph the label ("Saving" → "Saved"). Don't disable it silently.

## Accessibility

- Renders a real `<button type="button">`, or an `<a>` when given `href`.
- `pressed` sets `aria-pressed` for toolbar toggles.
- Disabled buttons drop to 45% opacity and ignore clicks.
