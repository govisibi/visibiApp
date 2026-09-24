# Adding New Blog Articles to VISIBI

This guide explains how to add new blog posts to the VISIBI insights section.

## Overview

Blog articles are managed centrally in `/frontend/src/data/articles.js`. When you add a new article entry there, it automatically appears in:
- **InsightsPage** - All published articles sorted by date
- **HomePage** - Latest 2 published articles in the insights section

## Step-by-Step Process

### 1. Create the Blog Post Component

Create a new file in `/frontend/src/pages/insights/` for your article:

```jsx
// Example: /frontend/src/pages/insights/YourArticleTitle.jsx
import { useEffect } from 'react'
import { Helmet } from 'react-helmet-async'
import Navigation from '../../components/Navigation'
import { Button } from '../../components/Button'
import { ArrowLeft, Calendar, Clock } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function YourArticleTitle() {
  useEffect(() => {
    document.documentElement.classList.remove('dark')
  }, [])

  return (
    <div className="min-h-screen relative line-pattern">
      <Helmet>
        <title>Your Article Title | VISIBI Insights</title>
        <meta name="description" content="Your article description" />
        {/* Add more meta tags as needed */}
      </Helmet>

      <Navigation currentPage="insights" />

      {/* Your article content here */}
      {/* Use ChatGPTBrandDiscovery.jsx as a reference for structure */}
    </div>
  )
}
```

**Use `ChatGPTBrandDiscovery.jsx` as a template** - it has the proper layout, styling, and structure.

### 2. Add Route in App.jsx

Update `/frontend/src/App.jsx` to include your new route:

```jsx
import YourArticleTitle from './pages/insights/YourArticleTitle'

// In the Routes section:
<Route path="/insights/your-article-slug" element={<YourArticleTitle />} />
```

### 3. Register the Article in articles.js

Add your article entry to `/frontend/src/data/articles.js`:

```javascript
import { Brain, Search, TrendingUp, Target, BookOpen } from 'lucide-react'

export const articles = [
  // ... existing articles ...
  {
    id: 'your-article-slug',                    // Unique identifier
    title: "Your Article Title",                 // Full title
    category: "GEO",                             // GEO, SEO, Strategy, Analytics, Case Studies
    icon: Brain,                                 // Brain, Search, TrendingUp, Target, BookOpen
    date: "2025-11-20",                         // ISO format (YYYY-MM-DD) for sorting
    displayDate: "Nov 20, 2025",                // Human-readable date
    excerpt: "Short excerpt for card view",     // 1-2 sentences
    description: "Full description",             // Used for meta tags and previews
    readTime: "8 min read",                     // Estimated reading time
    slug: "/insights/your-article-slug",        // Route path (must match App.jsx)
    published: true                              // false = draft, true = published
  }
]
```

### 4. Field Descriptions

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | string | Yes | Unique identifier (use kebab-case) |
| `title` | string | Yes | Article title (displayed on cards and page) |
| `category` | string | Yes | One of: GEO, SEO, Strategy, Analytics, Case Studies |
| `icon` | component | Yes | Lucide icon: Brain, Search, TrendingUp, Target, BookOpen |
| `date` | string | Yes | ISO format (YYYY-MM-DD) for proper sorting |
| `displayDate` | string | Yes | Human-readable format (e.g., "Nov 20, 2025") |
| `excerpt` | string | Yes | Short description for insight cards (1-2 sentences) |
| `description` | string | Yes | Full description for SEO and previews |
| `readTime` | string | Yes | Estimated reading time (e.g., "8 min read") |
| `slug` | string | Yes | URL path (must match route in App.jsx) |
| `published` | boolean | Yes | `true` to show article, `false` to hide |

### 5. Icon Options

Choose the appropriate icon based on category:

```javascript
import { Brain, Search, TrendingUp, Target, BookOpen } from 'lucide-react'

Brain       // For GEO articles
Search      // For SEO articles  
Target      // For Strategy articles
TrendingUp  // For Analytics articles
BookOpen    // For Case Studies
```

### 6. Category Options

Valid categories (used for filtering on InsightsPage):
- `"GEO"` - Generative Engine Optimization topics
- `"SEO"` - Search Engine Optimization topics
- `"Strategy"` - Strategic guidance and frameworks
- `"Analytics"` - Metrics, tracking, and measurement
- `"Case Studies"` - Real-world examples and results

## Automatic Features

Once you add an article to `articles.js` with `published: true`:

✅ **InsightsPage**
- Automatically appears in the insights grid
- Sorted by date (newest first)
- Filterable by category
- Clickable card links to article page

✅ **HomePage**
- Latest 2 published articles appear in insights section
- Automatically updates when newer articles are added
- Links directly to article pages

✅ **No Manual Updates Needed**
- No need to manually update HomePage or InsightsPage
- Article cards render automatically with correct data
- Dates, titles, descriptions all pulled from articles.js

## Draft Articles

To work on an article without publishing it:

```javascript
{
  // ... article fields ...
  published: false  // Article won't appear on site
}
```

When ready to publish, change to `published: true`.

## Article Sorting

Articles are automatically sorted by the `date` field (newest first). Make sure to use ISO format (YYYY-MM-DD) for proper chronological sorting.

## Example: Complete New Article

```javascript
// 1. Create component: /frontend/src/pages/insights/ContentStrategyGEO.jsx
// 2. Add route in App.jsx:
import ContentStrategyGEO from './pages/insights/ContentStrategyGEO'
<Route path="/insights/content-strategy-geo" element={<ContentStrategyGEO />} />

// 3. Add to articles.js:
{
  id: 'content-strategy-geo',
  title: "Building a Content Strategy for GEO Success",
  category: "Strategy",
  icon: Target,
  date: "2025-11-20",
  displayDate: "Nov 20, 2025",
  excerpt: "Strategic framework for creating AI-optimized content that drives citations and brand visibility.",
  description: "Learn how to build a comprehensive content strategy optimized for generative AI platforms with our proven framework.",
  readTime: "10 min read",
  slug: "/insights/content-strategy-geo",
  published: true
}
```

## Troubleshooting

**Article not appearing?**
- Check `published: true` is set
- Verify `date` is in ISO format (YYYY-MM-DD)
- Ensure `slug` matches route in App.jsx
- Check for typos in category name (must be exact match)

**Wrong icon displaying?**
- Verify icon is imported at top of articles.js
- Check icon component name matches (case-sensitive)

**Articles in wrong order?**
- Verify all `date` fields use ISO format (YYYY-MM-DD)
- Newer dates should appear first automatically

## Helper Functions

Available in `/frontend/src/data/articles.js`:

```javascript
getPublishedArticles()           // Returns all published articles sorted by date
getLatestArticles(count)         // Returns latest N published articles
getArticlesByCategory(category)  // Returns articles filtered by category
getArticleById(id)              // Returns single article by ID
getCategories()                 // Returns array of all categories
```

## Questions?

If you need help adding articles or have questions about the system, refer to:
- `ChatGPTBrandDiscovery.jsx` for article page structure
- `InsightsPage.jsx` for how articles are rendered
- `HomePage.jsx` for homepage insights section
- `articles.js` for data structure and helper functions
