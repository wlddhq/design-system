---
name: Text morph
component: TextMorph
summary: A label that morphs when it changes. Shared letters stay, the rest blur through.
status: stable
group: motion
---

## When to use

- A button or status whose word changes after an action: "Approve" → "Approved", "Saving" → "Saved".
- Short labels only, one or two words.

## Do

- Use it where the change is the confirmation, so people see the action land.

## Don't

- Don't morph on first render. It only animates changes.
- Don't use it for numbers that tick often. Show them static.
- Don't morph long sentences.

## Edge cases

- Reduced motion (the OS setting or the app's): the new label appears at once, no blur.
- Numbers work too: `<TextMorph>{count}</TextMorph>`.
