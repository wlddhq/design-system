# @wldd/tokens

WLDD's design tokens as CSS variables: colour, type, radius, motion and every theme (Khadi, Kajal, Pop and its tones). Khadi in dark mode is the default.

```css
@import "@wldd/tokens/fonts.css";  /* first: every font the themes use, self-hosted */
@import "@wldd/tokens/tokens.css";
```

The fonts ship inside the package (Fontsource, SIL Open Font License). Your build includes the files; nothing is fetched from Google.

```ts
import { applyTheme } from '@wldd/tokens'

applyTheme({ mode: 'dark', style: 'pop', tone: 'tulsi' })
```

`applyTheme` writes the theme onto `<html>`. `STYLES`, `TONES`, `PRESETS`, `CORNERS` and `FONTS` list every option for building pickers.
