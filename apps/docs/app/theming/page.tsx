import { DocPage, H2 } from '@/components/Doc'
import { Code } from '@/components/Code'
import { StyleGallery, ToneGallery, PresetRow, DialRow, FontRow, AccentRow } from '@/components/ThemeGallery'

export const metadata = { title: 'Theming' }

export default function Page() {
  return (
    <DocPage href="/theming" lead="One product, many looks. Everything on this page changes this site too, so you can see each option on real components.">
      <H2>Styles</H2>
      <p>A style is the base paint. <strong>Khadi</strong> is the default: neutral paper and ink. <strong>Kajal</strong> is dark-first and sharp. <strong>Pop</strong> is warm and tactile, and opens up tones and corners.</p>
      <StyleGallery />

      <H2>Pop tones</H2>
      <p>Each tone sets the surfaces and one accent for the primary action. Ujala is high contrast; Drishti is safe for colour blindness, so status reads blue and orange, never green and red.</p>
      <ToneGallery />

      <H2>Presets</H2>
      <p>Named Pop combinations of tone, type and corners.</p>
      <PresetRow />

      <H2>Buttons and corners</H2>
      <p><strong>Buttons are always Lip</strong>, in every style: a 2px lip under each control that presses flat when clicked. Corners sets the radius scale and is Pop only.</p>
      <DialRow />

      <H2>Font</H2>
      <p>Overrides the style’s own typeface, in any style.</p>
      <FontRow />

      <H2>Custom accent</H2>
      <p>Replaces the primary colour in any theme. Text on it switches between black and white for contrast.</p>
      <AccentRow />

      <H2>In code</H2>
      <Code code={`import { applyTheme } from '@wldd/tokens'

applyTheme({ style: 'khadi', mode: 'system' })
applyTheme({ style: 'pop', tone: 'tulsi', corners: '4', font: 'geist' })
applyTheme({ accent: '#2f5fd0' })`} />
      <p>Lists of every option, with labels and swatches for building pickers, are exported too: <code>STYLES</code>, <code>TONES</code>, <code>PRESETS</code>, <code>CORNERS</code>, <code>FONTS</code>.</p>
    </DocPage>
  )
}
