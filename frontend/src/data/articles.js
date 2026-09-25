import { Brain, Search, TrendingUp, Target, BookOpen } from 'lucide-react'
import { cmsPosts } from '@/cms/client'

/**
 * Central repository for all blog articles
 * Add new articles here when creating new blog post pages
 * Articles are automatically sorted by date (newest first)
 */
export const articles = [
  {
    id: 'geo-playbook-2026',
    title: "The 2026 GEO Playbook: How to Win in AI-Enabled Search",
    category: "Strategy",
    icon: Target,
    date: "2025-12-01", // ISO format for proper sorting
    displayDate: "Dec 1, 2025",
    excerpt: "Search has quietly crossed a line. Learn the 7 key signals for organic success in 2026 and strategies for optimizing AI-enabled search.",
    description: "Search has quietly crossed a line. Learn the 7 key signals for organic success in 2026 and strategies for optimizing AI-enabled search.",
    readTime: "12 min read",
    slug: "/insights/geo-playbook-2026",
    published: true
  },
  {
    id: 'small-business-ai-visibility',
    title: "Can't See Your Business in AI Results? 7 Practical Steps for Small Businesses",
    category: "Strategy",
    icon: Target,
    date: "2025-12-01", // ISO format for proper sorting
    displayDate: "Dec 1, 2025",
    excerpt: "Practical, budget-friendly guide for small businesses to improve visibility in AI search results—no technical jargon required.",
    description: "Practical, budget-friendly guide for small businesses to improve visibility in AI search results—no technical jargon required.",
    readTime: "10 min read",
    slug: "/insights/small-business-ai-visibility-guide",
    published: true
  },
  {
    id: 'chatgpt-brand-discovery',
    title: "How ChatGPT Discovers & Cites Brands in 2025",
    category: "GEO",
    icon: Brain,
    date: "2025-11-17", // ISO format for proper sorting
    displayDate: "Nov 17, 2025",
    excerpt: "Deep analysis of the technical mechanisms ChatGPT uses to source information and how brands can optimize for citations.",
    description: "Deep analysis of the technical mechanisms ChatGPT uses to source information and how brands can optimize for citations in AI-generated responses.",
    readTime: "8 min read",
    slug: "/insights/chatgpt-brand-discovery",
    published: true
  },
  {
    id: 'complete-guide-ai-search',
    title: "The Complete Guide to AI Search Optimization",
    category: "Strategy",
    icon: Target,
    date: "2025-10-10",
    displayDate: "Oct 10, 2025",
    excerpt: "Everything you need to know about optimizing your brand's presence across AI platforms—from fundamentals to advanced tactics.",
    description: "Everything you need to know about optimizing your brand's presence across AI platforms—from fundamentals to advanced tactics.",
    readTime: "12 min read",
    slug: "/insights",
    published: false
  },
  {
    id: 'measuring-brand-visibility',
    title: "Measuring Brand Visibility Across AI Platforms",
    category: "Analytics",
    icon: TrendingUp,
    date: "2025-10-05",
    displayDate: "Oct 5, 2025",
    excerpt: "How to track, measure, and report on your AI visibility performance with quantitative frameworks and tools.",
    description: "How to track, measure, and report on your AI visibility performance with quantitative frameworks and tools.",
    readTime: "10 min read",
    slug: "/insights",
    published: false
  },
  {
    id: 'geo-vs-seo',
    title: "GEO vs SEO: Understanding the Strategic Difference",
    category: "GEO",
    icon: Brain,
    date: "2025-09-28",
    displayDate: "Sep 28, 2025",
    excerpt: "Why generative engine optimization requires fundamentally different tactics than traditional search engine optimization.",
    description: "Why generative engine optimization requires fundamentally different tactics than traditional search engine optimization.",
    readTime: "7 min read",
    slug: "/insights",
    published: false
  },
  {
    id: 'authority-signals',
    title: "The Authority Signals AI Platforms Trust",
    category: "Strategy",
    icon: Target,
    date: "2025-09-20",
    displayDate: "Sep 20, 2025",
    excerpt: "Research findings on what makes AI engines more likely to cite certain sources over others.",
    description: "Research findings on what makes AI engines more likely to cite certain sources over others.",
    readTime: "9 min read",
    slug: "/insights",
    published: false
  },
  {
    id: 'case-study-300-increase',
    title: "Case Study: 300% Increase in AI Mentions in 6 Months",
    category: "Case Studies",
    icon: BookOpen,
    date: "2025-09-15",
    displayDate: "Sep 15, 2025",
    excerpt: "How a B2B SaaS company transformed their AI visibility through structured GEO strategy.",
    description: "How a B2B SaaS company transformed their AI visibility through structured GEO strategy.",
    readTime: "11 min read",
    slug: "/insights",
    published: false
  },
  {
    id: 'content-structure',
    title: "Content Structure for Maximum AI Comprehension",
    category: "GEO",
    icon: Brain,
    date: "2025-09-08",
    displayDate: "Sep 8, 2025",
    excerpt: "Technical best practices for structuring content so AI platforms can easily extract and cite information.",
    description: "Technical best practices for structuring content so AI platforms can easily extract and cite information.",
    readTime: "8 min read",
    slug: "/insights",
    published: false
  },
  {
    id: 'future-of-search',
    title: "The Future of Search: 2026 Predictions",
    category: "Strategy",
    icon: Target,
    date: "2025-09-01",
    displayDate: "Sep 1, 2025",
    excerpt: "Expert predictions on how AI-powered search will evolve and what brands should prepare for.",
    description: "Expert predictions on how AI-powered search will evolve and what brands should prepare for.",
    readTime: "10 min read",
    slug: "/insights",
    published: false
  },
  {
    id: 'schema-markup',
    title: "Schema Markup for AI Platforms",
    category: "SEO",
    icon: Search,
    date: "2025-08-25",
    displayDate: "Aug 25, 2025",
    excerpt: "How structured data influences both traditional search rankings and AI platform understanding.",
    description: "How structured data influences both traditional search rankings and AI platform understanding.",
    readTime: "9 min read",
    slug: "/insights",
    published: false
  }
]

/**
 * Get all published articles sorted by date (newest first)
 */
export const getPublishedArticles = () => {
  const wordpressArticles = cmsPosts().filter(post => post.slug && post.status === 'publish').map(post => ({
    id: post.slug,
    title: decodeHtml(post.title?.rendered || ''),
    category: post._embedded?.['wp:term']?.[0]?.[0]?.name || 'Insights',
    icon: BookOpen,
    date: post.date,
    displayDate: new Date(post.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    excerpt: decodeHtml((post.excerpt?.rendered || '').replace(/<[^>]*>/g, '')).trim(),
    description: decodeHtml((post.excerpt?.rendered || '').replace(/<[^>]*>/g, '')).trim(),
    readTime: Math.max(1, Math.ceil((post.content?.rendered || '').replace(/<[^>]*>/g, '').split(/\s+/).length / 220)) + ' min read',
    slug: '/insights/' + post.slug,
    published: true,
  }))
  return [...wordpressArticles, ...articles.filter(article => !wordpressArticles.some(post => post.slug === article.slug))]
    .filter(article => article.published)
    .sort((a, b) => new Date(b.date) - new Date(a.date))
}

/**
 * Get latest N published articles
 */
export const getLatestArticles = (count = 2) => {
  return getPublishedArticles().slice(0, count)
}

/**
 * Get articles by category
 */
export const getArticlesByCategory = (category) => {
  if (category === 'All') return getPublishedArticles()
  return getPublishedArticles().filter(article => article.category === category)
}

/**
 * Get single article by ID
 */
export const getArticleById = (id) => {
  return getPublishedArticles().find(article => article.id === id)
}

/**
 * Get all unique categories
 */
export const getCategories = () => {
  const categories = ['All']
  const uniqueCategories = [...new Set(getPublishedArticles().map(article => article.category))]
  return [...categories, ...uniqueCategories.sort()]
}

function decodeHtml(value) {
  if (typeof document === 'undefined') return value
  const element = document.createElement('textarea')
  element.innerHTML = value
  return element.value
}
