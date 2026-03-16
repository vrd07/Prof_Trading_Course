import type { LessonFrontmatter } from '@/lib/mdx/loader'
import { LessonNavigationClient } from './LessonNavigationClient'

export function LessonNavigation({
  frontmatter,
  module,
  unit,
}: {
  frontmatter: LessonFrontmatter
  module: string
  unit: string
}) {
  return <LessonNavigationClient frontmatter={frontmatter} module={module} unit={unit} />
}
