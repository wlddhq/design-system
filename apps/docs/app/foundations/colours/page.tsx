import { DocPage, H2 } from '@/components/Doc'
import { ColourTable } from '@/components/LiveTokens'

export const metadata = { title: 'Colours' }

export default function Page() {
  return (
    <DocPage href="/foundations/colours" lead="Every colour is a token. Values change with the theme; names never do. Switch the theme from the palette in the sidebar and watch the values update.">
      <H2>Surfaces</H2>
      <ColourTable rows={[
        { v: '--bg', cls: 'bg-canvas', note: 'Page and sidebar background' },
        { v: '--surface', cls: 'bg-surface', note: 'Main panel, cards, controls' },
        { v: '--sunken', cls: 'bg-sunken', note: 'Wells, code, inputs, hover on controls' },
        { v: '--pop', cls: 'bg-popover', note: 'Menus, popovers, dialogs' },
        { v: '--hover', cls: 'bg-hover', note: 'Row and item hover' },
        { v: '--press', cls: 'bg-press', note: 'Pressed and selected rows' },
        { v: '--overlay', cls: 'bg-overlay', note: 'Scrim behind sheets and dialogs' },
      ]} />

      <H2>Text</H2>
      <ColourTable rows={[
        { v: '--fg', cls: 'text-fg', note: 'Titles, values, active items' },
        { v: '--fg-2', cls: 'text-fg-2', note: 'Body text, inactive items' },
        { v: '--muted', cls: 'text-muted', note: 'Labels, counts, meta' },
        { v: '--faint', cls: 'text-faint', note: 'Placeholders, separators' },
      ]} />

      <H2>Lines</H2>
      <ColourTable rows={[
        { v: '--line', cls: 'border-line', note: 'Hairlines between rows and panels' },
        { v: '--line-2', cls: 'border-line-2', note: 'Control outlines, stronger dividers' },
      ]} />

      <H2>Emphasis</H2>
      <ColourTable rows={[
        { v: '--ink', cls: 'bg-ink', note: 'Primary action in Khadi and Kajal' },
        { v: '--ink-fg', cls: 'text-ink-fg', note: 'Text on ink' },
        { v: '--cta', cls: 'bg-cta', note: 'Primary action in Pop (the tone’s colour)' },
        { v: '--hl', cls: 'bg-hl', note: 'Small accents: switches, tab underline' },
      ]} />

      <H2>Status</H2>
      <p>The four WLDD logo colours. They mean something: modules (Pod green, Finance violet, Sales yellow, Creators pink) and status. Never use them to decorate. Each has a soft fill for chips and backgrounds.</p>
      <ColourTable rows={[
        { v: '--green', cls: 'text-green', note: 'Done, paid, on track · Pod' },
        { v: '--green-soft', cls: 'bg-green-soft' },
        { v: '--violet', cls: 'text-violet', note: 'In review · Finance' },
        { v: '--violet-soft', cls: 'bg-violet-soft' },
        { v: '--yellow', cls: 'text-yellow', note: 'Waiting, due soon · Sales' },
        { v: '--yellow-soft', cls: 'bg-yellow-soft' },
        { v: '--pink', cls: 'text-pink', note: 'Rejected, overdue, failed · Creators' },
        { v: '--pink-soft', cls: 'bg-pink-soft' },
      ]} />
    </DocPage>
  )
}
