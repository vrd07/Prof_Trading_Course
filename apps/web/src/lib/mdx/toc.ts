export interface TocItem {
  depth: number
  text: string
  id: string
}

function slugify(input: string) {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
}

export function extractTocFromMdx(mdxContent: string) {
  const toc: TocItem[] = []

  // MDX in this project uses markdown headings. Extract h2/h3.
  const lines = mdxContent.split('\n')
  for (const line of lines) {
    const m = /^(#{2,3})\s+(.+)$/.exec(line.trim())
    if (!m) continue
    const depth = m[1].length
    const text = m[2].trim()
    toc.push({ depth, text, id: slugify(text) })
  }

  return toc
}

