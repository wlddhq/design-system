import { createCssVariablesTheme, createHighlighter, type Highlighter } from 'shiki'
import { CopyButton } from './CopyButton'

// Colours come from CSS variables mapped to WLDD tokens (doc.css), so code follows every theme.
const theme = createCssVariablesTheme({ name: 'wldd', variablePrefix: '--shiki-', fontStyle: true })
// One highlighter for the whole server, kept on globalThis so dev hot-reloads reuse it instead of piling up new ones.
const g = globalThis as { __wlddShiki?: Promise<Highlighter> }
const highlighter = () => (g.__wlddShiki ??= createHighlighter({ themes: [theme], langs: ['tsx', 'ts', 'css', 'bash', 'json', 'md'] }))

export type Lang = 'tsx' | 'ts' | 'css' | 'bash' | 'json' | 'md'

export async function Code({ code, lang = 'tsx' }: { code: string; lang?: Lang }) {
  const html = (await highlighter()).codeToHtml(code.trim(), { lang, theme: 'wldd' })
  return (
    <div className="code">
      <div dangerouslySetInnerHTML={{ __html: html }} />
      <CopyButton text={code.trim()} />
    </div>
  )
}
