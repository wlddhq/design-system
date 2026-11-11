---
name: Avatar
component: Avatar
parts: AvatarGroup
summary: A person, as a photo or initials on their own colour.
status: stable
group: primitives
---

## When to use

- **Avatar** next to a name: a lead, an owner, the person who acted.
- **AvatarGroup** for a team in a table cell or card. Use `max` when teams can be large.

## Do

- Size to the row: 18 in list rows, 20 in tables, 22–28 in headers.
- Keep a person's hue stable everywhere. Pass `hue` from your data, or let it derive from the name.
- Put the name beside a single avatar when there's room. An avatar alone relies on its tooltip.
- While the person loads, use `<Avatar loading size={…} />` at the same size.

## Don't

- Don't use avatars for companies. That's a Logo.
- Don't recolour avatars to mean status.
- Don't stack more than five without `max`.

## Edge cases

- No photo, or a photo that fails to load: initials on the person's colour. A broken image never shows.
- Names in any script or with emoji: the first whole character of the first two words. An empty name shows "?".
- AvatarGroup with `max`: the rest collapse into "+n". `max={0}` still shows one face.
