---
name: Input
component: Input
summary: A text field, with an optional icon and shortcut.
status: stable
group: controls
---

## When to use

- Search and filter bars (`icon={Search}`, `kbd="/"`).
- Single-line fields in forms and settings.

## Do

- Use the placeholder for an example or a verb ("Search campaigns…"), never as the only label in a form.
- Show the shortcut that focuses it when there is one.

## Don't

- Don't add a border or background around an Input. It brings its own.
- Don't put helper paragraphs under fields. Use a Tooltip for definitions.

## Edge cases

- Disabled: dimmed and not focusable. Invalid: set `aria-invalid` for a pink ring, and say why next to it.
- The shortcut hint hides while the field is focused.
