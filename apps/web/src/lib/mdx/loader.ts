import fs from 'node:fs/promises'
import path from 'node:path'

import matter from 'gray-matter'
import remarkGfm from 'remark-gfm'
import rehypePrettyCode from 'rehype-pretty-code'
import { serialize } from 'next-mdx-remote/serialize'
import { extractTocFromMdx, type TocItem } from './toc'

export interface LessonFrontmatter {
  title: string
  unit: number
  lesson: number
  lessonId: string
  tier: 'free' | 'paid'
  estimatedMinutes: number
  module: 'beginner' | 'intermediate' | 'advanced'
  prerequisites: string[]
  animationComponents?: string[]
  prev?: { title: string; slug: string } | null
  next?: { title: string; slug: string } | null
  quizQuestionIds?: string[]
}

export interface LessonContent {
  frontmatter: LessonFrontmatter
  mdxSource: string
  toc: TocItem[]
}

export async function getLessonContent(moduleSlug: string, unitSlug: string, lessonSlug: string) {
  const filePath = path.join(
    process.cwd(),
    '..',
    '..',
    'content',
    moduleSlug,
    unitSlug,
    `${lessonSlug}.mdx`
  )

  const raw = await fs.readFile(filePath, 'utf8')
  const parsed = matter(raw)
  const toc = extractTocFromMdx(parsed.content)

  const mdxSource = await serialize(parsed.content, {
    mdxOptions: {
      remarkPlugins: [remarkGfm],
      rehypePlugins: [
        [
          rehypePrettyCode,
          {
            theme: 'github-dark',
          },
        ],
      ],
    },
  })

  return { frontmatter: parsed.data as LessonFrontmatter, mdxSource, toc }
}

export async function getAllLessonPaths() {
  const root = path.join(process.cwd(), '..', '..', 'content')
  const moduleEntries = await fs.readdir(root, { withFileTypes: true })
  const modules = moduleEntries.filter((e) => e.isDirectory()).map((e) => e.name)

  const paths: Array<{ module: string; unit: string; lesson: string }> = []

  for (const moduleSlug of modules) {
    const modulePath = path.join(root, moduleSlug)
    const unitEntries = await fs.readdir(modulePath, { withFileTypes: true })
    const unitSlugs = unitEntries.filter((e) => e.isDirectory()).map((e) => e.name)
    for (const unitSlug of unitSlugs) {
      const unitPath = path.join(modulePath, unitSlug)
      const entries = await fs.readdir(unitPath)
      for (const entry of entries) {
        if (!entry.endsWith('.mdx')) continue
        paths.push({
          module: moduleSlug,
          unit: unitSlug,
          lesson: entry.replace(/\.mdx$/, ''),
        })
      }
    }
  }

  return paths
}

