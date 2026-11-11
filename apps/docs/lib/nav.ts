import { LayoutList, BookOpen, Palette, Shapes, SlidersHorizontal, Table2, PanelsTopLeft, LayoutTemplate, PenTool, Sparkles, type LucideIcon } from 'lucide-react'

export type Page = { title: string; href: string }
export type Group = { id: string; label: string; icon: LucideIcon; color: string; pages: Page[] }

const c = (slug: string, title: string): Page => ({ title, href: `/components/${slug}` })

/** The whole site map. Sidebar, crumbs and prev/next all read this. */
export const NAV: Group[] = [
  {
    id: 'start', label: 'Getting started', icon: BookOpen, color: 'var(--fg)',
    pages: [
      { title: 'Introduction', href: '/' },
      { title: 'Installation', href: '/installation' },
      { title: 'Theming', href: '/theming' },
      { title: 'Building with AI', href: '/ai' },
    ],
  },
  {
    id: 'foundations', label: 'Foundations', icon: Palette, color: 'var(--green)',
    pages: [
      { title: 'Colours', href: '/foundations/colours' },
      { title: 'Typography', href: '/foundations/typography' },
      { title: 'Shape & depth', href: '/foundations/shape' },
      { title: 'Motion', href: '/foundations/motion' },
      { title: 'Icons', href: '/foundations/icons' },
    ],
  },
  {
    id: 'brand', label: 'Brand', icon: PenTool, color: 'var(--pink)',
    pages: [{ title: 'Logo', href: '/brand/logo' }, { title: 'Logo animations', href: '/brand/animations' }],
  },
  {
    id: 'primitives', label: 'Primitives', icon: Shapes, color: 'var(--violet)',
    pages: [
      c('button', 'Button'), c('avatar', 'Avatar'), c('logo', 'Logo'), c('chip', 'Chip & Tag'), c('dot', 'Dot'),
      c('progress', 'Progress icon'), c('count', 'Count'), c('checkbox', 'Checkbox'), c('switch', 'Switch'),
      c('tooltip', 'Tooltip'), c('kbd', 'Kbd'),
    ],
  },
  {
    id: 'controls', label: 'Controls', icon: SlidersHorizontal, color: 'var(--yellow)',
    pages: [c('input', 'Input'), c('tabs', 'Tabs & Segmented'), c('popover', 'Popover & Menu'), c('select', 'Select')],
  },
  {
    id: 'data', label: 'Data display', icon: Table2, color: 'var(--pink)',
    pages: [c('track', 'Track'), c('sparkline', 'Sparkline'), c('skeleton', 'Skeleton'), c('selection', 'Selection bar'), c('empty', 'Empty')],
  },
  {
    id: 'views', label: 'Views', icon: LayoutList, color: 'var(--green)',
    pages: [c('list', 'List'), c('board', 'Board'), c('table', 'Table'), c('timeline', 'Timeline'), c('card', 'Grid (cards)'), c('display', 'Display menu')],
  },
  {
    id: 'shell', label: 'App shell', icon: PanelsTopLeft, color: 'var(--fg)',
    pages: [c('shell', 'App shell')],
  },
  {
    id: 'motion', label: 'Motion', icon: Sparkles, color: 'var(--violet)',
    pages: [c('loader', 'Loaders'), c('textmorph', 'Text morph')],
  },
  {
    id: 'showcase', label: 'Showcase', icon: LayoutTemplate, color: 'var(--green)',
    pages: [{ title: 'Campaigns', href: '/showcase/campaigns' }],
  },
]

export const ALL_PAGES = NAV.flatMap((g) => g.pages.map((p) => ({ ...p, group: g })))
export const findPage = (path: string) => ALL_PAGES.find((p) => p.href === path)
