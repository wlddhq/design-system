import { DocPage, H2 } from '@/components/Doc'
import { Code } from '@/components/Code'
import { LoaderGallery } from '@/components/LoaderGallery'

export const metadata = { title: 'Logo animations' }

export default function Page() {
  return (
    <DocPage wide href="/brand/animations" lead="The WLDD wordmark in motion. Seven animations built on the same master as the logo; each one settles back into the mark when done.">
      <H2>Animations</H2>
      <p>Click any stage to finish it, or switch everything to Done. Hover a name for what it does.</p>
      <LoaderGallery groups={['wldd']} />

      <H2>Where to use them</H2>
      <ul>
        <li><strong>Press</strong>: the calm default. First load, full-page waits, the sidebar logo on hover.</li>
        <li><strong>Cycle</strong> with <code>tight</code>: inline, where a square fits. Home’s chat uses it while it thinks.</li>
        <li><strong>Dance, Drop, Build</strong>: splash screens and moments worth celebrating.</li>
        <li><strong>Travel and Portal</strong>: wide; rare, playful moments only.</li>
      </ul>
      <p>For everyday waits (saving, fetching, a button), use a <a href="/components/loader">Loader</a> instead.</p>

      <H2>In code</H2>
      <Code code={`import { WlddLoader } from '@wldd/ui'

<WlddLoader mode="press" size={48} />
<WlddLoader mode="cycle" size={26} tight />          // inline
<WlddLoader mode="press" size={48} done={loaded} />  // settles into the logo`} />
    </DocPage>
  )
}
