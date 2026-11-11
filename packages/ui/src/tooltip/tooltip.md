---
name: Tooltip
component: Tooltip
summary: Names a control on hover, with its shortcut.
status: stable
group: primitives
---

## When to use

- On every icon-only button.
- For definitions and shortcuts that would otherwise become helper text on the page. Service codes, for example.

## Do

- Keep it to one or two words, plus the shortcut in `kbd`.
- Use `side="right"` in the sidebar.

## Don't

- Don't put sentences, links or buttons in a tooltip.
- Don't use a tooltip as the only place important information lives.

## Edge cases

- Near a screen edge it flips to the side with room and stays 8px inside the window.
- Scrolling hides it. Keyboard focus shows it (focus-visible only); Escape hides it.
- An empty label renders no tooltip at all.
