# Changelog

Every release of `@wldd/ui`, `@wldd/tokens` and `@wldd/tailwind`. The three always share one version.
The docs site reads this file: the "What's new" page, the version in the sidebar, and the "Updated in" badge and history on each component page.

How to write an entry:
- One `## x.y.z — YYYY-MM-DD` per release, newest first. Work not yet released goes under `## Unreleased`.
- Group lines under `### New`, `### Fixed` or `### Changed`.
- Start a line with the component it touches in brackets, e.g. `[table]`, using the component's page id (as in /components/table). Use `[tokens]`, `[fonts]` or `[tailwind]` for those packages.
- Say what changed for the person using it, in one line. Name the prop in backticks.

## 0.1.3 — 2026-11-12

### Changed
- [tokens] Dark mode is the default. With no setup (or `applyTheme()` with no mode), apps start in Khadi dark; light is `applyTheme({ mode: 'light' })`.
- npm pages link to the source on GitHub (Repository and Issues).

## 0.1.2 — 2026-11-12

### New
- [table] `framed`: a rounded frame with all four edges, for tables inside a padded page such as a dashboard or a record. List views stay edge to edge.

## 0.1.1 — 2026-11-12

### Fixed
- [fonts] Fonts load in every app. `@wldd/tokens/fonts.css` now ships the fonts self-hosted; 0.1.0 fetched them from Google with an import that Next.js drops, so apps fell back to the system font. Nothing is fetched from Google any more.
- [chip] Toned chips read at 4.5:1 in light themes. Yellow was 2.2:1.
- [chart] `ChartPanel` is no longer a page landmark, so a chart and a table with the same title don't clash for screen readers.

## 0.1.0 — 2026-11-12

### New
- First release of `@wldd/tokens`, `@wldd/tailwind` and `@wldd/ui`: the themes (Khadi, Kajal, Pop and its tones), the Tailwind theme, and the components.
- [command] The command menu: ⌘K on a Mac, Ctrl K on Windows. Groups, icons, shortcuts, checks, word ranking, server search.
- [metric] `Metrics`: headline numbers that roll when they change, with an optional trend; clickable or stacked.
- [chart] `AreaChart`, `Bars`, `ShareBar` and `ChartPanel`, with hover and keyboard readouts and colour-blind-safe series colours.
- [ticker] `Ticker`: a number whose digits roll to the new value.
- [kbd] Shortcuts are written once (`mod+k`) and shown per platform: ⌘K on a Mac, Ctrl K on Windows.
- [table] `Table`: sticky header and first column, infinite loading, selection, empty and loading states.
