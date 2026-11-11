---
name: Toast
component: Toaster
summary: A short note after something happened, often with Undo. Bottom right, gone in about three seconds.
status: stable
group: records
---

## When to use

- After an action that changed something out of view, or that people may want to take back: "Moved to Activation · Undo".
- When something failed in the background: "Couldn't sync Tally".

## Do

- Put one `<Toaster />` at the root of the app. Call `toast()` anywhere.
- Title says what happened in two to four words: "Moved to Activation". The record goes in `description`.
- Offer Undo with `action: { label: 'Undo', onClick }` instead of asking "Are you sure?" first.
- `toast.success()` for creations, `toast.error()` for failures.

## Don't

- Don't toast what's already visible: a row that just changed in front of you needs nothing.
- Don't put questions or forms in a toast.
- Don't write sentences. No "Successfully" and no exclamation marks.

## Edge cases

- Three at most; older ones stack behind. Hovering keeps them on screen.
- Phones: full width at the bottom.
