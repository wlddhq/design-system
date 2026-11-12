---
name: Command menu
component: CommandMenu
parts: CommandGroup, CommandItem
summary: The command menu (Ctrl K, or ⌘K on a Mac). One box to jump to any page or record and run any action, from the keyboard.
status: stable
group: shell
---

## When to use

- Once per app, at the root. ⌘K on a Mac, Ctrl K on Windows, opens it from anywhere.
- Open it from the top bar's search button too, so people who don't know the shortcut can find it.

## Anatomy

- **Input**: says what can be found, "Search campaigns, clients, or type a command…".
- **Groups**: Go to (pages), then records (Campaigns, Clients), then Actions, then Settings and preferences.
- **Item**: icon, label, then on the right a quiet meta (client, code), a shortcut, or a check for the current choice.

## Do

- Put every page in Go to, with the same names as the sidebar.
- List records by what people call them: "Krafton India × Launch Week", meta "WL-2419". Add codes and old names as `keywords`.
- Every action in the app's buttons and menus also belongs here: New campaign, Switch role, Toggle theme.
- Show the item's own shortcut with `shortcut` so the menu teaches the keys.
- Mark the current theme, layout or view with `checked`.
- For thousands of records or a server search: `filter={false}`, control `search`, pass only the matches, and set `loading` while they arrive.

## Don't

- Don't open it with an animation. People open it many times a day; it appears at once.
- Don't put forms or confirmations inside. Pick the action, then open a Dialog or Sheet.
- Don't add a second ⌘K listener. If the app binds the key itself, pass `hotkey={false}`.
- Don't write commands as sentences. "New campaign", not "Click here to create a new campaign".

## Edge cases

- Groups keep the order you write them in; inside each group the best matches come first. Matching is by words: a label starting with the query ranks first, then a word in the label, then a keyword. Every word typed must match ("zep q4").
- Nothing matches: "No results for “query”". Pass `empty` for a better next step ("Create “query” as a client").
- Long names truncate with an ellipsis; meta never wraps.
- Picking an item closes the menu. Use `keepOpen` for toggles people flip several times.
- Phones: the menu sits at the top so the keyboard never covers it; rows are 44px tall.

## Accessibility

- Arrow keys move, Enter runs, Esc closes and focus returns to where it was. The list wraps.
- The input is focused on open and announces the number of matches. `label` names the menu for screen readers.
