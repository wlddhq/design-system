import type { EXAMPLES } from '@/examples'

type Ex = { id: keyof typeof EXAMPLES; title: string; note?: string; /** stage height in px for full-frame examples */ frame?: number }

/** Which live examples each component page shows. The rest of the page comes from the package's rules and props. */
export const COMPONENT_PAGES: Record<string, Ex[]> = {
  button: [
    { id: 'button/variants', title: 'Variants', note: 'Primary for the one main action, secondary for the rest, ghost for toolbars.' },
    { id: 'button/sizes', title: 'Sizes' },
    { id: 'button/icons', title: 'With an icon' },
    { id: 'button/icon-only', title: 'Icon only', note: 'Needs an aria-label. TypeScript enforces it.' },
    { id: 'button/shortcut', title: 'With a shortcut' },
    { id: 'button/states', title: 'Pressed, disabled, link' },
  ],
  avatar: [{ id: 'avatar/people', title: 'Sizes and groups' }],
  logo: [{ id: 'logo/brands', title: 'Real logos and letter marks', note: 'Letter marks appear for unknown names, or when an image fails.' }],
  chip: [{ id: 'chip/tones', title: 'Chip tones' }, { id: 'chip/tags', title: 'Service tags', note: 'Hover a tag for its full name.' }],
  dot: [{ id: 'dot/labels', title: 'Categories and status' }],
  progress: [{ id: 'progress/stages', title: 'Campaign stages' }],
  count: [{ id: 'count/labels', title: 'Beside a label' }],
  checkbox: [{ id: 'checkbox/rows', title: 'Rows with select all' }],
  switch: [{ id: 'switch/setting', title: 'A setting' }],
  tooltip: [{ id: 'tooltip/icons', title: 'On icon buttons', note: 'The first tooltip waits; moving along the bar, the next ones are instant.' }],
  kbd: [{ id: 'kbd/keys', title: 'Keys' }],
  input: [{ id: 'input/search', title: 'Search' }],
  tabs: [
    { id: 'tabs/views', title: 'View tabs' },
    { id: 'tabs/sections', title: 'Section tabs' },
    { id: 'tabs/segmented', title: 'Segmented' },
  ],
  popover: [
    { id: 'popover/filter', title: 'Menu', note: 'A filter menu with a label, leading dots and the current choice checked.' },
    { id: 'popover/display', title: 'Panel', note: 'Display options: Segmented, Select and Switch in sections.' },
  ],
  select: [{ id: 'select/order', title: 'Ordering' }],
  table: [
    { id: 'table/campaigns', title: 'Campaigns', note: 'Select rows, hover a record to open it. The full screen is in Showcase › Campaigns.', frame: 300 },
    { id: 'table/infinite', title: 'Loads as you scroll', note: '240 invoices, 40 at a time. Scroll to the end and the next batch loads. Select a row, then "Select all 240". The footer totals cover all 240 from the start.', frame: 360 },
    { id: 'table/empty', title: 'Nothing matches', note: 'The header stays so the columns still make sense.' },
    { id: 'table/long', title: 'More rows than fit', note: 'Scroll it. The header and the footer stay put; a line above the footer separates the rows passing under it.', frame: 300 },
  ],
  skeleton: [
    { id: 'skeleton/table', title: 'A table loading', note: 'The header is real from the first frame; the rows read their columns from it. Click Reload.', frame: 300 },
    { id: 'skeleton/pieces', title: 'Avatar, record and custom shapes', note: 'Use a loading prop when the component has one. Skeleton directly only for the rest.' },
  ],
  list: [{ id: 'list/grouped', title: 'Grouped by stage', note: 'Click a group header to collapse it. Each group has a limit of 2, so Activation’s third campaign sits behind "Show 1 more".' }],
  board: [{ id: 'board/stages', title: 'Stages', note: 'Drag a card to another column.', frame: 380 }],
  timeline: [{ id: 'timeline/campaigns', title: 'Live and reporting', note: 'It opens scrolled to today. Hover a bar for its dates.', frame: 320 }],
  card: [{ id: 'card/grid', title: 'Grid view cards' }],
  track: [{ id: 'track/stages', title: 'Stages' }],
  sparkline: [{ id: 'sparkline/trend', title: 'Trends' }],
  display: [{ id: 'display/menu', title: 'The Display popover', note: 'Open it: layouts, grouping, and the properties rows show.' }],
  selection: [{ id: 'selection/bar', title: 'Three selected', frame: 120 }],
  empty: [{ id: 'empty/clear', title: 'Empty states' }],
  shell: [{ id: 'shell/frame', title: 'The frame', frame: 420 }],
  loader: [
    { id: 'loader/save', title: 'In a button', note: 'Click Save. The loader settles into a check while the label morphs.' },
    { id: 'loader/inline', title: 'Inline' },
  ],
  textmorph: [{ id: 'textmorph/approve', title: 'Approve', note: 'Click it. Shared letters stay; the rest blur through.' }],
}
