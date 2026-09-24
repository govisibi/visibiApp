import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Menu, X, ChevronDown, ChevronUp } from 'lucide-react'
import { cmsMenu } from '@/cms/client'

const fallbackMenu = [
  {
    label: 'Consulting', href: '#', children: [
      { label: 'GEO', href: '/geo', description: 'Generative Engine Optimization for AI platforms' },
      { label: 'SEO', href: '/seo', description: 'Search Engine Optimization that feeds AI visibility' },
      { label: 'AI Agents', href: '/ai-agents', description: 'Custom intelligent automation and AI workflows' },
    ],
  },
  {
    label: 'Platform', href: '#', children: [
      { label: 'Tool', href: '/tool', description: 'Track and measure your AI visibility' },
    ],
  },
  { label: 'Insights', href: '/insights', children: [] },
  { label: 'How We Work', href: '/how-we-work', children: [] },
  { label: 'About', href: '/about', children: [] },
  { label: 'Contact', href: '/contact', children: [] },
]

function safeHref(href) {
  if (typeof href !== 'string') return '#'
  if (href.startsWith('/')) return href
  if (/^https?:\/\//i.test(href)) return href
  return '#'
}

function MenuLink({ item, className, children, onClick }) {
  const href = safeHref(item.href)
  if (/^https?:\/\//i.test(href)) {
    return <a href={href} className={className} onClick={onClick}>{children}</a>
  }
  return <Link to={href} className={className} onClick={onClick}>{children}</Link>
}

export default function Navigation() {
  const { pathname } = useLocation()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [desktopOpen, setDesktopOpen] = useState(null)
  const [mobileExpanded, setMobileExpanded] = useState(null)
  const [isScrolled, setIsScrolled] = useState(false)
  const items = cmsMenu().length ? cmsMenu() : fallbackMenu

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 100)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const active = (item) => {
    const href = safeHref(item.href)
    return href === pathname || item.children?.some((child) => safeHref(child.href) === pathname)
  }

  return (
    <header className="max-w-[90%] mx-auto rounded-xl bg-white/90 backdrop-blur-sm sticky top-4 z-[100] shadow-sm relative">
      <div className="mx-auto px-6 lg:px-8 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 cursor-pointer">
          <img
            src="/govisibi-logo.png"
            alt="VISIBI Logo"
            width="24"
            height="24"
            className={`h-6 w-6 transition-transform duration-500 ease-out ${isScrolled ? 'rotate-[360deg]' : 'rotate-[315deg]'}`}
          />
          <span className={`text-xl font-bold text-slate-950 transition-all duration-500 whitespace-nowrap ${isScrolled ? 'opacity-0 -translate-x-full' : 'opacity-100 translate-x-0'}`}>
            VISIBI
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-8 px-4">
          {items.filter((item) => safeHref(item.href) !== '/').map((item) => {
            const children = Array.isArray(item.children) ? item.children : []
            if (children.length) {
              return (
                <div
                  key={item.label}
                  className="relative"
                  onMouseEnter={() => setDesktopOpen(item.label)}
                  onMouseLeave={() => setDesktopOpen(null)}
                >
                  <button
                    type="button"
                    aria-expanded={desktopOpen === item.label}
                    onClick={() => setDesktopOpen(desktopOpen === item.label ? null : item.label)}
                    className={`text-sm font-medium transition-colors flex items-center gap-1 ${active(item) ? 'text-blue-600' : 'text-slate-900 hover:text-blue-600'}`}
                  >
                    {item.label}<ChevronDown className="h-4 w-4" />
                  </button>
                  {desktopOpen === item.label && (
                    <div className="absolute top-full left-1/2 -translate-x-1/2 pt-6 w-[332px] z-[150]">
                      <div className="bg-white border border-slate-200 rounded-lg shadow-xl py-2">
                        {children.map((child) => (
                          <MenuLink
                            key={child.href}
                            item={child}
                            onClick={() => setDesktopOpen(null)}
                            className="block px-6 py-4 hover:bg-slate-50 transition-colors border-b border-slate-100 last:border-0"
                          >
                            <h3 className="text-base font-semibold text-slate-900 mb-1">{child.label}</h3>
                            {child.description && <p className="text-sm text-slate-600">{child.description}</p>}
                          </MenuLink>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )
            }
            const contact = safeHref(item.href) === '/contact'
            return (
              <MenuLink
                key={item.href}
                item={item}
                className={contact
                  ? `text-sm font-medium px-6 py-2 rounded-full transition-colors ${active(item) ? 'bg-blue-700 text-white' : 'bg-slate-950 text-white hover:bg-blue-700'}`
                  : `text-sm font-medium transition-colors ${active(item) ? 'text-blue-600' : 'text-slate-900 hover:text-blue-600'}`}
              >
                {item.label}
              </MenuLink>
            )
          })}
        </nav>

        <button
          type="button"
          aria-label="Toggle navigation"
          aria-expanded={mobileOpen}
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden p-2 text-gray-700 hover:text-blue-600 transition-colors"
        >
          {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {mobileOpen && (
        <div className="md:hidden border-t border-gray-200 bg-white backdrop-blur-sm">
          <nav className="px-6 py-4 flex flex-col gap-4">
            <Link to="/" onClick={() => setMobileOpen(false)} className="text-base font-medium text-gray-700 hover:text-blue-600 py-2">
              Home
            </Link>
            {items.filter((item) => safeHref(item.href) !== '/').map((item) => {
              const children = Array.isArray(item.children) ? item.children : []
              if (children.length) {
                return (
                  <div key={item.label}>
                    <button
                      type="button"
                      onClick={() => setMobileExpanded(mobileExpanded === item.label ? null : item.label)}
                      className={`w-full flex items-center justify-between text-base font-medium transition-colors py-2 ${active(item) ? 'text-blue-600' : 'text-gray-700 hover:text-blue-600'}`}
                    >
                      {item.label}
                      {mobileExpanded === item.label ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
                    </button>
                    {mobileExpanded === item.label && (
                      <div className="pl-4 mt-2 space-y-2">
                        {children.map((child) => (
                          <MenuLink
                            key={child.href}
                            item={child}
                            onClick={() => setMobileOpen(false)}
                            className={`block text-sm transition-colors py-2 ${active(child) ? 'text-blue-600' : 'text-gray-600 hover:text-blue-600'}`}
                          >
                            {child.label}{child.description ? ` - ${child.description}` : ''}
                          </MenuLink>
                        ))}
                      </div>
                    )}
                  </div>
                )
              }
              const contact = safeHref(item.href) === '/contact'
              return (
                <MenuLink
                  key={item.href}
                  item={item}
                  onClick={() => setMobileOpen(false)}
                  className={contact
                    ? `text-base font-medium px-6 py-3 rounded-full text-center ${active(item) ? 'bg-blue-700 text-white' : 'bg-slate-950 text-white hover:bg-blue-700'}`
                    : `text-base font-medium transition-colors py-2 ${active(item) ? 'text-blue-600' : 'text-gray-700 hover:text-blue-600'}`}
                >
                  {item.label}
                </MenuLink>
              )
            })}
          </nav>
        </div>
      )}
    </header>
  )
}