# WLDD Library

The WLDD design system: tokens, a Tailwind theme and React components, extracted from the approved `dms-play` prototype.

| Package | What it is |
|---|---|
| `@wldd/tokens` | Every theme as CSS variables (`tokens.css`, `fonts.css`), plus the theme catalogue and `applyTheme()` |
| `@wldd/tailwind` | Tailwind v4 theme. Removes Tailwind's default colours, fonts, radii and shadows; only WLDD tokens exist |
| `@wldd/ui` | React components. One stylesheet: `@wldd/ui/styles.css` |
| `apps/docs` | The docs site (Next.js), built with the library in the DMS Velin shell |

## Use it

```css
/* app.css */
@import "@wldd/tokens/fonts.css";
@import "tailwindcss";
@import "@wldd/tailwind";
@import "@wldd/tokens/tokens.css";
@import "@wldd/ui/styles.css";
```

```tsx
import { Button } from '@wldd/ui'
import { applyTheme } from '@wldd/tokens'
import { Plus } from 'lucide-react'

applyTheme({ style: 'khadi', mode: 'light' }) // the default; call again whenever settings change

<Button variant="primary" icon={Plus} kbd="C">New campaign</Button>
```

## Themes

Set on `<html>` by `applyTheme()`. The default is Khadi, light, comfortable, full motion.

- **Style:** Khadi (default) · Kajal · Pop
- **Pop dials:** tone (Haldi, Tulsi, Baingani, Gulabi, Neel, Kesar, Mor, Koyla, Jamun, Ujala, Drishti) · buttons (Lip, Flat, Soft, Pill) · corners (4, 6, 10, 14)
- **Presets:** Haldi, Tulsi, Baingani, Gulabi, Jamun
- **Preferences:** font override · density · motion · custom accent

Components never know which theme is on. They read recipe tokens (`--btn-*`, `--control-*`, `--radius-*`) that each theme re-tunes.

## Develop

```sh
npm install
npm run dev        # builds the packages, then the docs at http://localhost:5180
npm run typecheck
```
