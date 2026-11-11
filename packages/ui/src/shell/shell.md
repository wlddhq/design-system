---
name: App shell
component: AppShell
parts: Sidebar, SidebarHeader, SidebarBody, SidebarGroup, SidebarItem, SidebarSection, SidebarFooter, IconTile, TopBar, TopBarTitle, TopBarActions, Toolbar, Spacer, PageScroll, Page
summary: The DMS frame. Stacked sidebar, a 44px top bar, an optional view bar, and the scrolling page.
status: stable
group: shell
---

## When to use

- Every screen of a WLDD app. Build the screen inside it; never make your own frame.

## Anatomy

- **Sidebar**: SidebarHeader (logo and tools), SidebarBody (workspaces as SidebarGroups, each with its SidebarItems, then a Pinned SidebarSection at the bottom), SidebarFooter (person and settings).
- **TopBar**: TopBarTitle (icon, title, live count), then TopBarActions (search, notifications, one primary).
- **Toolbar** (optional): view Tabs on the left, a Spacer, then Filter and Display.
- **PageScroll**: a Table straight in, or a Page for everything else.

## Do

- Give each workspace its colour on its IconTile: Pod green, Finance violet, Sales yellow, Creators pink.
- Show a closed group's pending total as its count.
- Keep the title in the TopBar only. Pages don't repeat it.
- On record pages, pass `detail` with the record's code, not its name.
- Pass your router's link as `as` (for example Next.js `Link`) on SidebarItem and SidebarGroup.

## Don't

- Don't animate the active nav item. It's an instant fill.
- Don't add a second navigation (top tabs, breadcrumb trails) for app-level pages.
- Don't put more than one primary button in the TopBar.

## Edge cases

- Sidebar counts above 99 show "99+". A count of 0 hides.
- Long page titles and record names truncate in the TopBar; the count and icons never shrink.
- A Table straight inside PageScroll scrolls itself, so its header and footer stay in view.
- Phones and tablets: the sidebar becomes a drawer (`sidebarOpen`, `onSidebarClose`); the toolbar scrolls sideways.
