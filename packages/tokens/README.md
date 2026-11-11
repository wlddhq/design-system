# @wldd/tokens

WLDD's design tokens as CSS variables: colour, type, radius, motion and every theme (Khadi, Kajal, Pop and its tones). Khadi light is the default.

```css
@import "@wldd/tokens/tokens.css";
```

```ts
import { applyTheme } from '@wldd/tokens'

applyTheme({ mode: 'dark', style: 'pop', tone: 'tulsi' })
```

`applyTheme` writes the theme onto `<html>`. `STYLES`, `TONES`, `PRESETS`, `CORNERS` and `FONTS` list every option for building pickers.
