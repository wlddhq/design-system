# @wldd/ui

React components for WLDD products. Build with them and the result looks like the DMS: same type, spacing, motion and themes.

```bash
npm install @wldd/ui @wldd/tokens @wldd/tailwind lucide-react motion
```

```css
/* app/globals.css */
@import "@wldd/tokens/fonts.css"; /* first: the fonts the themes use */
@import "tailwindcss";
@import "@wldd/tailwind";
@import "@wldd/tokens/tokens.css";
@import "@wldd/ui/styles.css";
```

```tsx
import { Button } from '@wldd/ui'
import { Plus } from 'lucide-react'

<Button variant="primary" icon={Plus} kbd="C">New campaign</Button>
```

## For AI tools

The package ships its own rules. Start with `node_modules/@wldd/ui/dist/AGENTS.md`, then `dist/rules/<component>.md`; every prop is in `dist/meta/components.json`.

## What's inside

Primitives, controls, the five record views (List, Board, Table, Timeline, Grid), record pages, sheets, dialogs, forms, toasts, the app shell, loaders and the WLDD logo. Every component's docs and live examples are on the docs site.
