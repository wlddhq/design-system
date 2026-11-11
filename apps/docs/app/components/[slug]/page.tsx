import { notFound } from 'next/navigation'
import { ComponentDoc } from '@/components/ComponentDoc'
import { COMPONENT_PAGES } from '@/lib/component-pages'
import { componentMeta } from '@/lib/library'
import { H2 } from '@/components/Doc'
import { LoaderGallery } from '@/components/LoaderGallery'

export const dynamicParams = false
export const generateStaticParams = () => Object.keys(COMPONENT_PAGES).map((slug) => ({ slug }))

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  return { title: componentMeta(slug).name }
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const examples = COMPONENT_PAGES[slug]
  if (!examples) notFound()
  return (
    <ComponentDoc id={slug} href={`/components/${slug}`} examples={examples}>
      {slug === 'loader' && <><H2>All loaders</H2><LoaderGallery groups={['general', 'ai']} /></>}
    </ComponentDoc>
  )
}
