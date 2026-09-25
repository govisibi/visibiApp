import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import HomePage from './pages/HomePage'
import ComingSoon from './pages/ComingSoon'
import AboutPage from './pages/AboutPage'
import GEOPage from './pages/GEOPage'
import SEOPage from './pages/SEOPage'
import PPCPage from './pages/PPCPage'
import InsightsPage from './pages/InsightsPage'
import ToolPage from './pages/ToolPage'
import HowWeWorkPage from './pages/HowWeWorkPage'
import ContactPage from './pages/ContactPage'
import AIAgentsPage from './pages/AIAgentsPage'
import ChatGPTBrandDiscovery from './pages/insights/ChatGPTBrandDiscovery'
import SmallBusinessAIVisibility from './pages/insights/SmallBusinessAIVisibility'
import GEOPlaybook2026 from './pages/insights/GEOPlaybook2026'
import WordPressArticle from './pages/insights/WordPressArticle'
import WordPressPage from './pages/WordPressPage'
import PrivacyPolicy from './pages/PrivacyPolicy'
import TermsOfUse from './pages/TermsOfUse'
import ScrollToTop from './components/ScrollToTop'
import './index.css'

function App() {
  return (
    <Router>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/coming-soon" element={<ComingSoon />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/geo" element={<GEOPage />} />
        <Route path="/seo" element={<SEOPage />} />
        {/* Temporarily hidden for launch - may re-add later */}
        {/* <Route path="/ppc" element={<PPCPage />} /> */}
        <Route path="/ai-agents" element={<AIAgentsPage />} />
        <Route path="/insights" element={<InsightsPage />} />
        <Route path="/insights/chatgpt-brand-discovery" element={<ChatGPTBrandDiscovery />} />
        <Route path="/insights/small-business-ai-visibility-guide" element={<SmallBusinessAIVisibility />} />
        <Route path="/insights/geo-playbook-2026" element={<GEOPlaybook2026 />} />
        <Route path="/insights/:slug" element={<WordPressArticle />} />
        <Route path="/tool" element={<ToolPage />} />
        <Route path="/how-we-work" element={<HowWeWorkPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/terms-of-use" element={<TermsOfUse />} />
        <Route path="*" element={<WordPressPage />} />
      </Routes>
    </Router>
  )
}

export default App
