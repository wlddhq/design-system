import { Check, X } from 'lucide-react'
import { DocPage, H2 } from '@/components/Doc'
import { Code } from '@/components/Code'
import { ColourMark, MarkTiles, Plate } from '@/components/BrandPlates'

export const metadata = { title: 'Logo' }

export default function Page() {
  return (
    <DocPage href="/brand/logo" lead="The WLDD mark: four staggered letters with a 45° extrusion, every measure built from one unit, x.">
      <H2>Marks</H2>
      <p>Two versions. Colour is the brand; grey is the quiet version for inside the product.</p>
      <MarkTiles />

      <H2>Sizes</H2>
      <div className="brand-sizes">
        {[16, 26, 44, 72].map((h) => (
          <div key={h}><ColourMark height={h} /><span>{h}px</span></div>
        ))}
      </div>
      <ul>
        <li><strong>26px</strong> in the app sidebar. <strong>16px</strong> is the smallest, for favicons and tabs.</li>
        <li>Size by height. The width follows.</li>
      </ul>

      <H2>Construction</H2>
      <p>Every guide sits on real geometry and every label is computed from it: stems 1x, cap 5½x, bowl radius 1½x, a ⅓x outline and a 1x → 1x extrusion at 45°.</p>
      <Plate which="construction" />

      <H2>Anatomy</H2>
      <p>Four layers, in this order: face, outline, extrusion, mark.</p>
      <Plate which="anatomy" />

      <H2>Letters</H2>
      <Plate which="letters" />

      <H2>Clear space</H2>
      <p>Keep 2x free on every side, measured from the mark including its extrusion. Nothing else enters that space.</p>
      <Plate which="clearspace" />

      <H2 id="do-and-dont">Do and don’t</H2>
      <div className="dd">
        <div className="dd-c dd-do">
          <div className="dd-h"><span className="dd-i"><Check size={12} strokeWidth={2.5} /></span>Do</div>
          <ul>
            <li>Use the files from this page. Never redraw the mark.</li>
            <li>Use colour on plain backgrounds; grey where the mark should step back.</li>
            <li>Keep the extrusion pointing down and right.</li>
          </ul>
        </div>
        <div className="dd-c dd-dont">
          <div className="dd-h"><span className="dd-i"><X size={12} strokeWidth={2.5} /></span>Don’t</div>
          <ul>
            <li>Don’t recolour letters, swap their order, or straighten the stagger.</li>
            <li>Don’t stretch, rotate, outline or add shadows.</li>
            <li>Don’t put the colour mark on photos or busy backgrounds.</li>
            <li>Don’t animate it on load. It moves only as a loader or on hover.</li>
          </ul>
        </div>
      </div>

      <H2>In code</H2>
      <p>The logo is drawn in code from the same paths, built from x, so it's sharp at any size. Never use an image of it. On hover the letters press into their shadows, as in the DMS sidebar.</p>
      <Code code={`import { WlddLogo } from '@wldd/ui'

<SidebarHeader logo={<WlddLogo />} />          // 30px, the default
<WlddLogo height={20} />                       // in a rail`} />
    </DocPage>
  )
}
