# WLDD Design System

Tokens, a Tailwind theme and React components for building WLDD products. Build with them and the result looks like the DMS: same type, spacing, motion and themes.

[![@wldd/ui](https://img.shields.io/npm/v/@wldd/ui?label=%40wldd%2Fui)](https://www.npmjs.com/package/@wldd/ui)
[![@wldd/tokens](https://img.shields.io/npm/v/@wldd/tokens?label=%40wldd%2Ftokens)](https://www.npmjs.com/package/@wldd/tokens)
[![@wldd/tailwind](https://img.shields.io/npm/v/@wldd/tailwind?label=%40wldd%2Ftailwind)](https://www.npmjs.com/package/@wldd/tailwind)
![License: MIT](https://img.shields.io/badge/license-MIT-black)

| Package | What it is |
|---|---|
| [`@wldd/ui`](https://www.npmjs.com/package/@wldd/ui) | The React components, with one stylesheet. Each component also ships its own rules for people and AI tools. |
| [`@wldd/tokens`](https://www.npmjs.com/package/@wldd/tokens) | Every theme as CSS variables, the fonts (self-hosted), and `applyTheme()` |
| [`@wldd/tailwind`](https://www.npmjs.com/package/@wldd/tailwind) | Tailwind v4 theme. Removes Tailwind's default colours, fonts, radii and shadows; only WLDD tokens exist |
| `apps/docs` | The docs site: every component, live examples, rules and props |

## Use it

Works in any React 18/19 app with Tailwind v4 (Next.js, Vite).

```bash
npm install @wldd/ui @wldd/tokens @wldd/tailwind lucide-react motion
```

```css
/* app/globals.css */
@import "@wldd/tokens/fonts.css";   /* first: the fonts, self-hosted (nothing is fetched from Google) */
@import "tailwindcss";
@import "@wldd/tailwind";
@import "@wldd/tokens/tokens.css";
@import "@wldd/ui/styles.css";
```

```tsx
import { Button } from '@wldd/ui'
import { Plus } from 'lucide-react'

<Button variant="primary" icon={Plus} kbd="c">New campaign</Button>
```

Shortcuts are written once for every platform: `kbd="mod+k"` shows ⌘K on a Mac and Ctrl K on Windows.

### For AI tools

`@wldd/ui` ships its own instructions: start with `node_modules/@wldd/ui/dist/AGENTS.md`, then `dist/rules/<component>.md`. Every prop is in `dist/meta/components.json`.

## What's inside

- **Primitives and controls:** Button, Chip, Avatar, Logo, Kbd, Tooltip, Popover, Select, Tabs, Segmented, Input, Checkbox, Switch, RadioGroup, MultiSelect
- **Views:** List, Board, Table (edge to edge, framed, infinite), Timeline, Grid cards, Display menu
- **Records:** record page, Sheet, Dialog, form fields, Toast, Selection bar, Empty, Skeleton
- **Dashboards:** Metrics, AreaChart, Bars, ShareBar, ChartPanel, Sparkline, Track
- **App shell:** sidebar, top bar, page, and the ⌘K / Ctrl K command menu
- **Motion:** loaders (Ring, Notch, the WLDD cycle), Text morph, Ticker, the WLDD logo

## Themes

`applyTheme()` sets the theme on `<html>`; every component follows. The default is Khadi, light.

```ts
import { applyTheme } from '@wldd/tokens'
applyTheme({ mode: 'dark', style: 'pop', tone: 'tulsi' })
```

- **Styles:** Khadi (default) · Kajal · Pop
- **Pop tones and presets** change colour only: Haldi, Tulsi, Baingani, Gulabi, Jamun and more
- **Personal preferences, in every style:** type (Inter, Geist, Plex, Manrope, Bricolage), corners (4, 6, 10, 14), density, motion
- Buttons are always Lip. Text meets WCAG AA (4.5:1) in every theme; chart colours are checked for colour blindness in light and dark.

## Develop

```bash
npm install
npm run dev        # builds the packages, then the docs at http://localhost:5180
npm run typecheck
```

## Release

```bash
# 1. bump "version" in packages/*/package.json (all three together)
npm run smoke                  # a blank Next.js app must build with the packed packages, fonts included
npm publish -w @wldd/tokens -w @wldd/tailwind -w @wldd/ui --auth-type=web
npm run smoke -- --registry    # once npm has processed it: the same check against the published versions
git tag vX.Y.Z && git push --tags
```

## License

[MIT](LICENSE)
