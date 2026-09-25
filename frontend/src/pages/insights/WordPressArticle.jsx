import { useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import Navigation from '@/components/Navigation'
import Breadcrumbs from '@/components/Breadcrumbs'
import { cmsPosts } from '@/cms/client'

export default function WordPressArticle() {
  const { slug } = useParams()
  const post = cmsPosts().find(item => item.slug === slug && item.status === 'publish')
  useEffect(() => { document.documentElement.classList.remove('dark') }, [])
  if (!post) {
    return <div className="min-h-screen"><Navigation currentPage="insights" /><main className="max-w-4xl mx-auto p-12"><h1>Article not found</h1><Link to="/insights">Back to Insights</Link></main></div>
  }
  const title = post.title?.rendered?.replace(/<[^>]*>/g, '') || ''
  const description = post.meta?.visibi_seo_description || post.excerpt?.rendered?.replace(/<[^>]*>/g, '') || ''
  const canonical = post.meta?.visibi_canonical || window.location.origin + '/insights/' + slug
  return <div className="min-h-screen relative line-pattern">
    <Helmet>
      <title>{post.meta?.visibi_seo_title || title + ' | Visibi Ai'}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={canonical} />
      <meta property="og:type" content="article" />
      <meta property="og:title" content={post.meta?.visibi_seo_title || title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={canonical} />
      {post.meta?.visibi_og_image && <meta property="og:image" content={post.meta.visibi_og_image} />}
    </Helmet>
    <Navigation currentPage="insights" />
    <section className="max-w-full md:max-w-[90%] mx-auto mt-12 bg-[#FAFAFB] border border-slate-300 rounded-t-xl">
      <div className="max-w-4xl mx-auto px-8 md:px-16 py-24">
        <Breadcrumbs items={[{ label: 'Home', path: '/' }, { label: 'Insights', path: '/insights' }, { label: title }]} />
        <p className="font-space-mono text-sm text-blue-700 mt-8">{new Date(post.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
        <h1 className="font-open-sans text-4xl md:text-6xl font-semibold text-slate-950 mt-4" dangerouslySetInnerHTML={{ __html: post.title.rendered }} />
        <p className="font-open-sans text-xl text-slate-700 mt-8" dangerouslySetInnerHTML={{ __html: post.excerpt?.rendered || '' }} />
      </div>
    </section>
    <main className="max-w-full md:max-w-[90%] mx-auto bg-white border border-t-0 border-slate-300 rounded-b-xl px-8 py-16 mb-16">
      <article className="max-w-4xl mx-auto prose prose-lg" dangerouslySetInnerHTML={{ __html: post.content?.rendered || '' }} />
    </main>
  </div>
}
