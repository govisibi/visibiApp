import { useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import Navigation from '@/components/Navigation'
import Breadcrumbs from '@/components/Breadcrumbs'
import { cmsPage } from '@/cms/client'

export default function WordPressPage() {
  const { pathname } = useLocation()
  const page = cmsPage(pathname)

  useEffect(() => { document.documentElement.classList.remove('dark') }, [])

  if (!page) {
    return <div className="min-h-screen relative line-pattern">
      <Navigation />
      <main className="max-w-[90%] mx-auto mt-12 bg-white border border-slate-300 rounded-xl px-8 py-20">
        <h1 className="font-open-sans text-4xl font-semibold text-slate-950">Page not found</h1>
        <Link to="/" className="text-blue-700 underline mt-6 inline-block">Back to home</Link>
      </main>
    </div>
  }

  const title = page.title?.rendered?.replace(/<[^>]*>/g, '') || ''
  const description = page.meta?.visibi_seo_description
    || page.excerpt?.rendered?.replace(/<[^>]*>/g, '')
    || ''
  const canonical = page.meta?.visibi_canonical || window.location.href.split('?')[0]

  return <div className="min-h-screen relative line-pattern">
    <Helmet>
      <title>{page.meta?.visibi_seo_title || title + ' | Visibi Ai'}</title>
      {description && <meta name="description" content={description} />}
      <link rel="canonical" href={canonical} />
      <meta property="og:type" content="website" />
      <meta property="og:title" content={page.meta?.visibi_seo_title || title} />
      {description && <meta property="og:description" content={description} />}
      <meta property="og:url" content={canonical} />
      {page.meta?.visibi_og_image && <meta property="og:image" content={page.meta.visibi_og_image} />}
    </Helmet>

    <Navigation />
    <section className="max-w-full md:max-w-[90%] mx-auto mt-12 bg-[#FAFAFB] border border-slate-300 rounded-t-xl">
      <div className="max-w-4xl mx-auto px-8 md:px-16 py-24">
        <Breadcrumbs items={[{ label: 'Home', path: '/' }, { label: title }]} />
        <h1 className="font-open-sans text-4xl md:text-6xl font-semibold text-slate-950 mt-8" dangerouslySetInnerHTML={{ __html: page.title.rendered }} />
      </div>
    </section>
    <main className="max-w-full md:max-w-[90%] mx-auto bg-white border border-t-0 border-slate-300 rounded-b-xl px-8 py-16 mb-16">
      <article className="max-w-4xl mx-auto prose prose-lg visibi-cf7" dangerouslySetInnerHTML={{ __html: page.content?.rendered || '' }} />
    </main>
  </div>
}
