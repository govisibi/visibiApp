const configuredWordpressUrl = import.meta.env.VITE_WORDPRESS_URL || ''
const wordpressUrl = (configuredWordpressUrl === 'same-origin' ? window.location.origin : configuredWordpressUrl).replace(/\/$/, '')

let site = { content: {}, menu: [], contactForm: null }
let posts = []
let pages = []

async function getJson(url, signal) {
  const response = await fetch(url, { signal })
  if (!response.ok) throw new Error(`WordPress returned ${response.status}`)
  return response.json()
}

export async function loadCms() {
  if (!wordpressUrl) return
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), 4000)
  try {
    const results = await Promise.allSettled([
      getJson(`${wordpressUrl}/wp-json/visibi/v1/site`, controller.signal),
      getJson(`${wordpressUrl}/wp-json/wp/v2/posts?per_page=100&_embed=1`, controller.signal),
      getJson(`${wordpressUrl}/wp-json/wp/v2/pages?per_page=100&_embed=1`, controller.signal),
    ])
    if (results[0].status === 'fulfilled') site = results[0].value
    if (results[1].status === 'fulfilled') posts = results[1].value
    if (results[2].status === 'fulfilled') pages = results[2].value
    if (results.some((result) => result.status === 'rejected')) {
      console.warn('Some WordPress content is unavailable; using local defaults.')
    }
  } catch {
    console.warn('WordPress content is unavailable; using local defaults.')
  } finally {
    clearTimeout(timeout)
  }
}

export function cmsText(key, fallback) {
  const value = site.content?.[key]
  return typeof value === 'string' ? value : fallback
}

export function cmsMenu() {
  return Array.isArray(site.menu) ? site.menu : []
}

export function cmsPosts() {
  return Array.isArray(posts) ? posts : []
}

export function cmsWordpressUrl() {
  return wordpressUrl
}
export function cmsPage(pathname) {
  const normalizedPath = pathname.replace(/\/+$/, '') || '/'
  const byId = new Map(pages.map(page => [page.id, page]))
  return pages.find(page => {
    if (page.status !== 'publish') return false
    const slugs = []
    const seen = new Set()
    let current = page
    while (current && !seen.has(current.id)) {
      seen.add(current.id)
      slugs.unshift(current.slug)
      current = byId.get(current.parent)
    }
    return '/' + slugs.join('/') === normalizedPath
  })
}
export function cmsAsset(value) {
  if (typeof value !== 'string' || !value.startsWith('/') || value.startsWith('//')) return value
  return import.meta.env.BASE_URL + value.slice(1)
}
export function cmsContactForm() {
  return site.contactForm
}
