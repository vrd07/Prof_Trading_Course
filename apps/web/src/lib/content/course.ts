import fs from 'node:fs/promises'
import path from 'node:path'

export interface ModuleMeta {
  title: string
  slug: string
  description: string
  tier: 'free' | 'paid'
  order: number
  totalLessons?: number
  estimatedHours?: number
}

export interface UnitMeta {
  title: string
  slug: string
  order: number
  lessons: string[]
  estimatedMinutes?: number
}

export interface LessonListItem {
  slug: string
  title: string
  lessonId: string
}

function contentRoot() {
  return path.join(process.cwd(), '..', '..', 'content')
}

export async function getModuleMeta(moduleSlug: string) {
  const metaPath = path.join(contentRoot(), moduleSlug, '_meta.json')
  const raw = await fs.readFile(metaPath, 'utf8')
  return JSON.parse(raw) as ModuleMeta
}

export async function getUnitMeta(moduleSlug: string, unitSlug: string) {
  const metaPath = path.join(contentRoot(), moduleSlug, unitSlug, '_meta.json')
  const raw = await fs.readFile(metaPath, 'utf8')
  return JSON.parse(raw) as UnitMeta
}

export async function getLessonList(moduleSlug: string, unitSlug: string) {
  const unitMeta = await getUnitMeta(moduleSlug, unitSlug)
  const unitDir = path.join(contentRoot(), moduleSlug, unitSlug)

  const items: LessonListItem[] = []
  for (const lessonId of unitMeta.lessons) {
    const entryPrefix = `${lessonId}-`
    const entries = await fs.readdir(unitDir)
    const mdx = entries.find((e) => e.startsWith(entryPrefix) && e.endsWith('.mdx'))
    if (!mdx) continue
    const slug = mdx.replace(/\.mdx$/, '')

    // cheap title parse: read only the frontmatter block
    const raw = await fs.readFile(path.join(unitDir, mdx), 'utf8')
    const titleMatch = raw.match(/^\s*---[\s\S]*?\ntitle:\s*"([^"]+)"[\s\S]*?\n---/m)
    const title = titleMatch?.[1] ?? slug

    items.push({ slug, title, lessonId })
  }

  return items
}

