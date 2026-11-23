import axe from 'axe-core'

/**
 * Runs axe on the whole document (so portalled menus and dialogs count) and returns the problems as readable lines.
 * Off: colour contrast (jsdom has no layout or computed colours, so contrast needs a real browser) and
 * page-level rules that only make sense for a full page, not one component on its own.
 */
export async function a11y(root: Element = document.body): Promise<string[]> {
  const { violations } = await axe.run(root, {
    rules: {
      'color-contrast': { enabled: false },
      region: { enabled: false },
      'page-has-heading-one': { enabled: false },
      'landmark-one-main': { enabled: false },
    },
  })
  return violations.flatMap((v) => v.nodes.map((n) => `${v.id}: ${v.help} → ${n.html.slice(0, 160)}`))
}
