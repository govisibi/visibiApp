import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { Mail, MessageSquare, CheckCircle2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import Navigation from '@/components/Navigation'
import Breadcrumbs from '@/components/Breadcrumbs'
import { executeRecaptcha } from '@/utils/recaptcha'
import { cmsContactForm } from '@/cms/client'

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [formData, setFormData] = useState({
    name: '',
    company: '',
    email: '',
    topic: '',
    message: ''
  })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    let recaptchaToken
    try {
      recaptchaToken = await executeRecaptcha('contact_form')
    } catch (recaptchaError) {
      console.error('reCAPTCHA verification failed', recaptchaError)
      setError('Human verification failed. Please refresh the page and try again.')
      setLoading(false)
      return
    }

    try {
      const apiUrl = (import.meta.env.VITE_API_URL || 'https://visibiapp-production.up.railway.app').replace(/\/$/, '')

      const res = await fetch(`${apiUrl}/api/send-email`, {
        method: 'POST',
        mode: 'cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          recaptchaToken,
        }),
      })

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}))
        throw new Error(errorData.detail || 'Server error')
      }

      setSubmitted(true)
      setTimeout(() => {
        setSubmitted(false)
        setFormData({ name: '', company: '', email: '', topic: '', message: '' })
      }, 5000)
    } catch (err) {
      console.error('Failed to send contact message', err)
      setError('Sorry — something went wrong sending your message. Please try again or email us directly at info@govisibi.ai')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  return (
    <div className="min-h-screen relative line-pattern">
      <Helmet>
        <title>Contact Us - Get in Touch with VISIBI | Gen AI Visibility</title>
        <meta name="referrer" content="strict-origin-when-cross-origin" />
        <meta name="description" content="Ready to improve your brand's visibility across AI platforms? Contact VISIBI for GEO, SEO, and PPC services. We'll respond within 24 hours." />
        <meta name="keywords" content="contact VISIBI, GEO consultation, AI visibility inquiry, brand consultation" />
        <link rel="canonical" href="https://www.govisibi.ai/contact" />

        {/* Open Graph */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://govisibi.ai/contact" />
        <meta property="og:title" content="Contact Us | VISIBI" />
        <meta property="og:description" content="Get in touch with VISIBI for Gen AI visibility services." />
        <meta property="og:site_name" content="VISIBI" />

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Contact Us | VISIBI" />
        <meta name="twitter:description" content="Ready to improve your brand's AI visibility? Contact us today." />
      </Helmet>

      <div className="absolute inset-0 -z-10 h-full w-full bg-slate-300/60 bg-[linear-gradient(to_right,#1d4ed80A_1px,transparent_1px),linear-gradient(to_bottom,#1d4ed80A_1px,transparent_1px)] bg-[size:128px_104px]"></div>

      <Navigation currentPage="contact" />

      {/* Hero */}
      <section className="max-w-full md:max-w-[90%] mx-auto items-center  mb-0 mt-12 relative bg-[#FAFAFB] border border-b-0 border-slate-300 rounded-xl rounded-bl-none rounded-br-none overflow-hidden">
        {/* Graph paper style background with gradient fade at bottom */}
        <div className="absolute inset-x-0 bottom-0 h-64 pointer-events-none">
          {/* Graph paper grid pattern */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] bg-[length:14px_14px]"></div>
          {/* Gradient fade from white to gray-50 */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#FAFAFB] via-white/40 to-[#FAFAFB]"></div>
        </div>

        <div className="lg:block h-full w-full">
          <div className="relative z-10 py-16 border-l border-r border-slate-200">
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-center px-16">
              {/* Left Column - 60% (3 out of 5 columns) */}
              <div className="lg:col-span-3 space-y-4 text-left">
                <div className="text-left pb-8">
                  <Breadcrumbs items={[
                    { label: "Home", path: "/" },
                    { label: "Contact" }
                  ]} />
                </div>
                <h1 className="font-open-sans text-3xl md:text-6xl font-semibold tracking-tight text-slate-950 md:leading-[1.15]">
                  Let's Make Your Brand Visible in Gen AI Search
                </h1>
                <h2 className="font-open-sans text-2xl md:text-3xl font-thin block md:leading-[1.4] pb-8">
                  Tell us about your Gen AI visibility goals and we'll show you how VISIBI can help you get discovered, cited, and trusted by millions.
                </h2>
              </div>

              {/* Right Column - 40% (2 out of 5 columns) */}
              <div className="lg:col-span-2 flex items-center justify-center">
                <style>{`
                  @keyframes subtleBounce {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-10px); }
                  }
                  .animate-subtle-bounce {
                    animation: subtleBounce 4s ease-in-out infinite;
                  }
                `}</style>
                <img 
                  src="/vi/visibi-ppc-ai.png" 
                  alt="VISIBI contact - Get in touch for AI visibility solutions" 
                  width="448"
                  height="448"
                  className="w-full h-auto max-w-md animate-subtle-bounce"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="max-w-full md:max-w-[90%] mx-auto px-12 py-12 relative z-10 bg-white rounded-xl rounded-tl-none rounded-tr-none border-t border-b border-r border-l border-slate-300 mb-2">
        <div className="lg:block absolute h-full w-0 md:w-16 bg-slate-200/20 border-0 md:border-r md:border-t-0 md:border-slate-200 left-0 top-0 pattern-background rounded-bl-xl"></div>
        <div className="lg:block absolute h-full w-0 md:w-16 bg-slate-200/20 border-0 md:border-l md:border-t-0 md:border-slate-200 right-0 top-0 pattern-background rounded-br-xl"></div>

        <div className="max-w-7xl mx-auto">
          {/* Contact Form */}
          <section className="py-12 mb-12">
            <div className="grid md:grid-cols-2 gap-12">
              {/* Form */}
              <div className="md:px-16">
                <h2 className="font-open-sans font-thin text-3xl md:text-5xl leading-[1.3] text-slate-950 mb-8">Send Us a Message</h2>
                {submitted ? (
                  <div className="bg-white border-2 border-blue-700 rounded-xl p-8 text-center">
                    <CheckCircle2 className="w-16 h-16 text-blue-700 mx-auto mb-4" />
                    <h3 className="font-space-mono font-bold text-2xl leading-[1.3] text-slate-950 mb-2">Thank You!</h3>
                    <p className="font-space-mono text-md leading-[1.5] text-slate-950">
                      We've received your message and will respond within 24 hours.
                    </p>
                  </div>
                ) : cmsContactForm() ? (
                  <div className="visibi-cf7" dangerouslySetInnerHTML={{ __html: cmsContactForm().html }} />
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                      <label htmlFor="name" className="font-space-mono text-sm uppercase text-slate-950 block mb-2">Name *</label>
                      <Input
                        id="name"
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => handleChange('name', e.target.value)}
                        className="rounded-md border-slate-300 font-space-mono"
                        placeholder="Your name"
                      />
                    </div>

                    <div>
                      <label htmlFor="company" className="font-space-mono text-sm uppercase text-slate-950 block mb-2">Company *</label>
                      <Input
                        id="company"
                        type="text"
                        required
                        value={formData.company}
                        onChange={(e) => handleChange('company', e.target.value)}
                        className="rounded-md border-slate-300 font-space-mono"
                        placeholder="Your company name"
                      />
                    </div>

                    <div>
                      <label htmlFor="email" className="font-space-mono text-sm uppercase text-slate-950 block mb-2">Email *</label>
                      <Input
                        id="email"
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => handleChange('email', e.target.value)}
                        className="rounded-md border-slate-300 font-space-mono"
                        placeholder="your@email.com"
                      />
                    </div>

                    <div>
                      <label htmlFor="topic" className="font-space-mono text-sm uppercase text-slate-950 block mb-2">What are you interested in? *</label>
                      <select
                        id="topic"
                        required
                        value={formData.topic}
                        onChange={(e) => handleChange('topic', e.target.value)}
                        className="w-full rounded-md border border-slate-300 font-space-mono px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-700"
                      >
                        <option value="">Select a topic</option>
                        <option value="geo">GEO Services</option>
                        <option value="seo">SEO & Content</option>
                        <option value="ppc">Paid Media</option>
                        <option value="tool">VISIBI Tool</option>
                        <option value="audit">AI Visibility Audit</option>
                        <option value="integrated">Integrated Strategy</option>
                        <option value="other">Other</option>
                      </select>
                    </div>

                    <div>
                      <label htmlFor="message" className="font-space-mono text-sm uppercase text-slate-950 block mb-2">Message *</label>
                      <textarea
                        id="message"
                        required
                        value={formData.message}
                        onChange={(e) => handleChange('message', e.target.value)}
                        className="w-full rounded-md border border-slate-300 font-space-mono px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-700 min-h-[150px]"
                        placeholder="Tell us about your AI visibility goals..."
                      />
                    </div>

                    <Button
                      type="submit"
                      disabled={loading}
                      className="bg-blue-700 text-white hover:bg-blue-800 rounded-full py-3 px-6 h-auto font-inter font-semibold text-md transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                      {loading ? 'Sending...' : 'Submit Request'}
                    </Button>
                    {error && (
                      <p className="text-sm text-red-600 font-space-mono">{error}</p>
                    )}
                  </form>
                )}
              </div>

              {/* Contact Info */}
              <div className="space-y-8 md:px-16">
                <div>
                  <h2 className="font-open-sans font-thin text-3xl md:text-5xl leading-[1.3] text-slate-950 mb-6">Get in Touch</h2>
                  <p className="font-open-sans text-md leading-[1.5] text-slate-950 mb-8">
                    Ready to improve your brand's visibility across AI platforms? We'd love to hear from you.
                  </p>
                </div>

                <div className="bg-white border border-slate-300 rounded-xl p-8">
                  <div className="flex items-start gap-4 mb-6">
                    <div className="w-12 h-12 bg-white flex items-center justify-center flex-shrink-0">
                      <Mail className="w-6 h-6 text-slate-950" />
                    </div>
                    <div>
                      <h3 className="font-open-sans font-normal text-xl leading-[1.3] text-slate-950 mb-2">Email</h3>
                      <a
                        href="mailto:info@govisibi.ai"
                        className="font-space-mono text-md text-slate-950 hover:text-blue-700 transition-colors"
                      >
                        info@govisibi.ai
                      </a>
                    </div>
                  </div>
                </div>

                <div className="bg-white border border-slate-300 rounded-xl p-8">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-white flex items-center justify-center flex-shrink-0">
                      <MessageSquare className="w-6 h-6 text-slate-950" />
                    </div>
                    <div>
                      <h3 className="font-open-sans font-normal text-xl leading-[1.3] text-slate-950 mb-2">What to Expect</h3>
                      <ul className="font-open-sans text-sm leading-[1.5] text-slate-950 space-y-2">
                        <li className="flex gap-2">
                          <span className="flex-shrink-0">•</span>
                          <span>Response within 24 hours</span>
                        </li>
                        <li className="flex gap-2">
                          <span className="flex-shrink-0">•</span>
                          <span>Initial consultation to understand your needs</span>
                        </li>
                        <li className="flex gap-2">
                          <span className="flex-shrink-0">•</span>
                          <span>Custom proposal outlining approach and pricing</span>
                        </li>
                        <li className="flex gap-2">
                          <span className="flex-shrink-0">•</span>
                          <span>No pressure, no obligation</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="bg-white border-2 border-blue-700 rounded-xl p-8">
                  <h3 className="font-open-sans font-normal text-xl leading-[1.3] text-slate-950 mb-3">Need an AI Visibility Audit?</h3>
                  <p className="font-open-sans text-md leading-[1.5] text-slate-950 mb-4">
                    Get a comprehensive analysis of how your brand currently appears across AI platforms, plus strategic recommendations.
                  </p>
                  <Button
                    onClick={() => handleChange('topic', 'audit')}
                    className="bg-transparent text-slate-950 border border-slate-950 hover:bg-slate-950 hover:text-white rounded-md font-inter font-semibold text-md transition-all"
                  >
                    Request Audit
                  </Button>
                </div>
              </div>
            </div>
          </section>

          {/* FAQ Quick Links */}
          <section className="py-12 mb-12 border-t border-slate-200">
            <div className="text-center mb-12 md:px-16">
              <h2 className="font-open-sans font-thin text-3xl md:text-5xl leading-[1.3] text-slate-950 mb-4">Have Questions?</h2>
              <p className="font-open-sans text-xl leading-[1.5] text-slate-950">
                Check out our service pages for detailed FAQs and information.
              </p>
            </div>
            <div className="grid md:grid-cols-4 gap-6 max-w-5xl mx-auto md:px-16">
              <Link to="/geo">
                <Button
                  variant="outline"
                  className="w-full bg-transparent text-slate-950 border border-slate-300 hover:border-blue-700 hover:bg-blue-700 hover:text-white rounded-md p-6 h-auto flex flex-col items-center gap-2 transition-all"
                >
                  <span className="font-space-mono text-md">GEO FAQs</span>
                </Button>
              </Link>
              <Link to="/seo">
                <Button
                  variant="outline"
                  className="w-full bg-transparent text-slate-950 border border-slate-300 hover:border-blue-700 hover:bg-blue-700 hover:text-white rounded-md p-6 h-auto flex flex-col items-center gap-2 transition-all"
                >
                  <span className="font-space-mono text-md">SEO FAQs</span>
                </Button>
              </Link>
              {/* <Link to="/ppc">
                <Button
                  variant="outline"
                  className="w-full bg-transparent text-slate-950 border border-slate-300 hover:border-blue-700 hover:bg-blue-700 hover:text-white rounded-md p-6 h-auto flex flex-col items-center gap-2 transition-all"
                >
                  <span className="font-space-mono text-md">PPC FAQs</span>
                </Button>
              </Link> */}
              <Link to="/how-we-work">
                <Button
                  variant="outline"
                  className="w-full bg-transparent text-slate-950 border border-slate-300 hover:border-blue-700 hover:bg-blue-700 hover:text-white rounded-md p-6 h-auto flex flex-col items-center gap-2 transition-all"
                >
                  <span className="font-space-mono text-md">Process FAQs</span>
                </Button>
              </Link>
            </div>
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="max-w-full md:max-w-[90%] mx-auto px-8 py-12 mt-24 border-t border-gray-200 bg-white rounded-xl rounded-bl-none rounded-br-none z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
          <div className="space-y-6">
            <div className="flex items-center gap-2">
              <img src="/govisibi-logo.png" alt="VISIBI Logo" width="32" height="32" className="h-8 w-8" />
              <span className="text-2xl font-bold bg-slate-950 bg-clip-text text-transparent">VISIBI</span>
            </div>
            <p className="font-open-sans text-lg text-slate-900 max-w-md leading-relaxed">
              Track and manage your brand's presence across leading AI platforms.
            </p>
            <div className="flex gap-6">
              <a
                href="https://x.com/VisibiAI"
                target="_blank"
                rel="noopener noreferrer"
                className="font-space-mono text-sm text-gray-600 hover:text-blue-700 uppercase tracking-wide"
              >
                X
              </a>
              <a
                href="http://linkedin.com/company/visibi-ai"
                target="_blank"
                rel="noopener noreferrer"
                className="font-space-mono text-sm text-gray-600 hover:text-blue-700 uppercase tracking-wide"
              >
                LinkedIn
              </a>
            </div>
          </div>
          <div className="space-y-8">
            <div>
              <h3 className="font-sans text-xl text-slate-950 mb-2">
                Want your brand to stand out in the age of AI conversations?
              </h3>
              <p className="text-sm text-slate-600">
                Stay informed with expert updates on brand visibility across AI platforms.
              </p>
            </div>
            <div className="flex gap-2">
              <Input type="email" placeholder="Email Address" className="flex-1 font-space-mono text-sm placeholder:text-gray-400 rounded-full text-gray-900" />
              <Button className="bg-slate-900 text-white hover:bg-gray-800 font-space-mono text-sm uppercase px-6 rounded-full">Start Now</Button>
            </div>
          </div>
        </div>
        <div className="mt-12 pt-8 border-t border-gray-200 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="font-space-mono text-xs text-gray-500">© 2025 VISIBI — ALL RIGHTS RESERVED</p>
        </div>
      </footer>
    </div>
  )
}
