import { DocPage, H2 } from '@/components/Doc'
import { CurveDemo } from '@/components/CurveDemo'

export const metadata = { title: 'Motion' }

export default function Page() {
  return (
    <DocPage href="/foundations/motion" lead="Motion confirms a change. It never decorates, and it never runs on page load.">
      <H2>Curves</H2>
      <CurveDemo />

      <H2>Durations</H2>
      <div className="tbl-w">
        <table className="tbl">
          <thead><tr><th>Token</th><th>Value</th><th>Use for</th></tr></thead>
          <tbody>
            <tr><td className="m nm">--dur-fast</td><td className="m">120ms</td><td>Colour and background on hover</td></tr>
            <tr><td className="m nm">--dur-press</td><td className="m">160ms (Pop 100ms)</td><td>Button press</td></tr>
            <tr><td className="m nm">—</td><td className="m">150–300ms</td><td>Popovers, swaps, state changes</td></tr>
            <tr><td className="m nm">—</td><td className="m">~360ms</td><td>Sheets and trays, on the drawer curve</td></tr>
          </tbody>
        </table>
      </div>

      <H2>Rules</H2>
      <ul>
        <li><strong>Animate state changes only:</strong> approve, move, switch, open, close.</li>
        <li><strong>Never on load.</strong> No staggered fade-ups, no counting numbers, no charts drawing in.</li>
        <li><strong>Keyboard is instant.</strong> Mouse actions get the motion.</li>
        <li><strong>Navigation never animates.</strong> The active sidebar item is an instant fill.</li>
        <li>Never scale from 0. Start at 0.93 or more, from the trigger’s corner.</li>
        <li>Buttons press flat, down by their 2px lip. Ghost buttons press to <code>scale(.96)</code>.</li>
        <li>Save delight for rare, high-stakes moments like paying vendors.</li>
        <li>Reduced motion keeps fades and colour and drops movement.</li>
      </ul>
    </DocPage>
  )
}
