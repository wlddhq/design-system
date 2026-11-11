---
name: Kbd
component: Kbd
summary: A keyboard key hint.
status: stable
group: primitives
---

## When to use

- Inside buttons, menu items and tooltips, to show the shortcut for that action.

## Do

- Show one key per Kbd: `<Kbd>⌘</Kbd><Kbd>K</Kbd>`.
- Use platform symbols (⌘ ⌥ ⇧) on Mac and words (Ctrl, Alt) elsewhere.

## Don't

- Don't use Kbd as decoration or to style inline text.
- Don't show a shortcut that doesn't exist.
