import { compileMDX } from 'next-mdx-remote/rsc'
import { notFound } from 'next/navigation'

import { LessonHeader } from '@/components/lessons/LessonHeader'
import { LessonToc } from '@/components/lessons/LessonToc'
import { MobileSidebar } from '@/components/lessons/MobileSidebar'
import { LessonNavigation } from '@/components/lessons/LessonNavigation'
import { LessonSidebarClient } from '@/components/lessons/LessonSidebarClient'
import { getLessonList, getModuleMeta, getUnitMeta } from '@/lib/content/course'
import { mdxComponents } from '@/lib/mdx/components'
import { getAllLessonPaths, getLessonContent } from '@/lib/mdx/loader'

export const dynamic = 'force-dynamic'

interface LessonPageProps {
  params: { module: string; unit: string; lesson: string }
}

export default async function LessonPage({ params }: LessonPageProps) {
  const [data, moduleMeta, unitMeta, lessons] = await Promise.all([
    getLessonContent(params.module, params.unit, params.lesson).catch(() => null),
    getModuleMeta(params.module).catch(() => null),
    getUnitMeta(params.module, params.unit).catch(() => null),
    getLessonList(params.module, params.unit).catch(() => []),
  ])
  if (!data) notFound()

  const { frontmatter, mdxSource, toc } = data
  const sidebarTitle = `${moduleMeta?.slug ?? params.module} · Unit ${unitMeta?.order ?? ''}`.trim()
  const { content } = await compileMDX({
    source: mdxSource,
    components: mdxComponents,
  })

  return (
    <div className="flex min-h-screen">
      <LessonSidebarClient
        title={sidebarTitle}
        lessons={lessons}
        module={params.module}
        unit={params.unit}
        currentLesson={params.lesson}
      />
      <main className="flex-1 px-6 py-10">
        <div className="mx-auto flex w-full max-w-6xl gap-10">
          <div className="w-full max-w-3xl">
          <MobileSidebar
            title={sidebarTitle}
            lessons={lessons}
            module={params.module}
            unit={params.unit}
            currentLesson={params.lesson}
          />
          <LessonHeader frontmatter={frontmatter} />
          <article className="prose prose-invert prose-lg mt-8 max-w-none">
            {content}
          </article>
          <div className="mt-12">
            <LessonNavigation frontmatter={frontmatter} module={params.module} unit={params.unit} />
          </div>
          </div>
          <LessonToc items={toc} />
        </div>
      </main>
    </div>
  )
}

