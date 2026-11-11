---
name: Logo
component: Logo
summary: A company, as its real logo or a letter mark.
status: stable
group: primitives
---

## When to use

- Beside every client, prospect, vendor or agency name: rows, tables, pinned items, headers.

## Do

- Always pass the real logo for real companies. Use a letter mark only for fictional names, or let it appear when the image fails.
- Size to context: 16 in the sidebar, 20 in lists, 24 in tables, 40 in headers.

## Don't

- Don't use a Logo for a person. That's an Avatar.
- Don't put a logo inside another ringed or filled box.

## Edge cases

- Missing or broken image: the letter mark. A new `src` gets a fresh try.
- An empty name shows "?" on a neutral colour.
