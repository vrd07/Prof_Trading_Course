import { MDXRemote } from 'next-mdx-remote/rsc'
import { notFound } from 'next/navigation'

import { LessonHeader } from '@/components/lessons/LessonHeader'
import { LessonNavigation } from '@/components/lessons/LessonNavigation'
import { LessonSidebar } from '@/components/lessons/LessonSidebar'
import { mdxComponents } from '@/lib/mdx/components'
import { getAllLessonPaths, getLessonContent } from '@/lib/mdx/loader'

interface LessonPageProps {
  params: { module: string; unit: string; lesson: string }
}

export default async function LessonPage({ params }: LessonPageProps) {
  const data = await getLessonContent(params.module, params.unit, params.lesson).catch(() => null)
  if (!data) notFound()

  const { frontmatter, mdxSource } = data

  return (
    <div className="flex min-h-screen">
      <LessonSidebar current={{ module: params.module, unit: params.unit, lesson: params.lesson }} />
      <main className="flex-1 px-6 py-10">
        <div className="mx-auto w-full max-w-3xl">
          <LessonHeader frontmatter={frontmatter} />
          <article className="prose prose-invert prose-lg mt-8 max-w-none">
            <MDXRemote source={mdxSource} components={mdxComponents} />
          </article>
          <div className="mt-12">
            <LessonNavigation frontmatter={frontmatter} module={params.module} unit={params.unit} />
          </div>
        </div>
      </main>
    </div>
  )
}

export async function generateStaticParams() {
  return getAllLessonPaths()
}

