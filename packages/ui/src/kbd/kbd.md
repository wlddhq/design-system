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

- Write the shortcut once for every platform: `<Kbd>mod+k</Kbd>`, `alt+1`, `shift+mod+b`, `c`. `mod` is ⌘ on a Mac and Ctrl on Windows.
- It shows the way each platform reads it: ⌘K and ⇧⌘B on a Mac; Ctrl K and Ctrl Shift B on Windows.
- Button `kbd`, Input `kbd`, Tooltip `kbd` and CommandItem `shortcut` take the same format.
- For text outside these, `const keys = useKeys()` then `keys('mod+k')`.

## Don't

- Don't hard-code ⌘ or Ctrl. Most of the team is on Windows; write `mod`.

- Don't use Kbd as decoration or to style inline text.
- Don't show a shortcut that doesn't exist.
