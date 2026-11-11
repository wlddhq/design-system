import { DocPage, H2 } from '@/components/Doc'
import { Code } from '@/components/Code'

export const metadata = { title: 'Building with AI' }

export default function Page() {
  return (
    <DocPage href="/ai" lead="Ask an AI to build a screen and get something that belongs in the DMS. The rules the AI needs ship inside the package.">
      <H2>What ships for AI</H2>
      <p>Every install of <code>@wldd/ui</code> carries three things an AI tool can read from <code>node_modules</code>:</p>
      <ul>
        <li><code>dist/AGENTS.md</code>: the entry point. House rules, then a list of components.</li>
        <li><code>dist/rules/&lt;component&gt;.md</code>: when to use each component, do and don’t. The same text as these docs.</li>
        <li><code>dist/meta/components.json</code>: every component’s props, read from the TypeScript.</li>
      </ul>
      <p>The docs site is built from these same files, so what you read here is exactly what the AI follows.</p>

      <H2>Claude Code or Cursor</H2>
      <p>Add one line to the project’s <code>CLAUDE.md</code> (or <code>.cursorrules</code>):</p>
      <Code lang="md" code={`Before building any UI, read node_modules/@wldd/ui/dist/AGENTS.md and follow it.
Use only @wldd/ui components, lucide-react icons and WLDD Tailwind classes.`} />
      <p>Then ask in plain words: “Add an invoices page with a table and an Approve action.”</p>

      <H2>Why it stays on-brand</H2>
      <ul>
        <li><strong>Off-brand styling doesn’t compile.</strong> Tailwind’s default palette is removed, so the AI can only reach WLDD colours.</li>
        <li><strong>Components carry the look.</strong> The AI picks a variant; the theme decides colour, radius and depth.</li>
        <li><strong>Types guard misuse.</strong> An icon-only button without a label is a type error.</li>
      </ul>

      <H2>Coming next</H2>
      <p>An MCP server for chat apps with no project folder, such as claude.ai. It will read the same rules, and add a <code>check_code</code> tool that reviews what the AI wrote and flags anything off-system.</p>
    </DocPage>
  )
}
