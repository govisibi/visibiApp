# Schema Markup Documentation

## Overview

This document provides a comprehensive record of all schema markup implementations across the VISIBI website. Schema markup (structured data) helps search engines better understand the content on our pages and can enable rich results in search engine results pages (SERPs).

**Last Updated:** 2025-11-17

---

## Schema Types Implemented

### 1. FAQPage Schema

FAQPage schema is implemented across all pages with FAQ sections. This markup helps Google display FAQ rich results in search, potentially increasing visibility and click-through rates.

**Schema Format:**
```json
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "Question text here",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Answer text here"
      }
    }
  ]
}
```

---

## Pages with FAQ Schema Markup

### Homepage (HomePage.jsx)

**File:** `frontend/src/pages/HomePage.jsx`
**Lines:** 274-288
**FAQ Count:** 7 FAQs
**Implementation Method:** Dynamically generated from `faqs` array

**Topics Covered:**
- What is Generative Engine Optimisation (GEO)?
- How is GEO different from SEO?
- Which Gen AI platforms does VISIBI optimise for?
- How do you measure Gen AI visibility?
- Do I still need SEO if I invest in GEO?
- How long does it take to see results?
- What industries benefit most from GEO?

**Schema Location:** Inside `<Helmet>` component after Twitter Card meta tags

---

### GEO Services Page (GEOPage.jsx)

**File:** `frontend/src/pages/GEOPage.jsx`
**Lines:** 161-175
**FAQ Count:** 10 FAQs
**Implementation Method:** Dynamically generated from `faqs` array

**Topics Covered:**
- What is GEO?
- GEO vs SEO differences
- AI platforms supported
- Timeline for results
- Guarantees
- Success measurement
- Need for traditional SEO alongside GEO
- Business types that benefit
- ROI impact
- Audit contents

**Schema Location:** Inside `<Helmet>` component after Twitter Card meta tags

---

### How We Work Page (HowWeWorkPage.jsx)

**File:** `frontend/src/pages/HowWeWorkPage.jsx`
**Lines:** 140-154
**FAQ Count:** 8 FAQs
**Implementation Method:** Dynamically generated from `faqs` array

**Topics Covered:**
- Engagement models
- Hands-on involvement approach
- Agency vs direct work
- Company sizes served
- Confidentiality policies
- Team requirements
- Pricing structure
- Guarantees

**Schema Location:** Inside `<Helmet>` component after Twitter Card meta tags

---

### SEO Services Page (SEOPage.jsx)

**File:** `frontend/src/pages/SEOPage.jsx`
**Lines:** 121-135
**FAQ Count:** 8 FAQs
**Implementation Method:** Dynamically generated from `faqs` array

**Topics Covered:**
- SEO vs GEO integration
- Timeline for results
- Multi-language support
- Technical SEO fixes
- AI platform measurement
- VISIBI's difference from other agencies
- Content creation approach
- Link building methodology

**Schema Location:** Inside `<Helmet>` component after Twitter Card meta tags

---

### PPC Services Page (PPCPage.jsx)

**File:** `frontend/src/pages/PPCPage.jsx`
**Lines:** 36-124
**FAQ Count:** 10 FAQs
**Implementation Method:** Manually defined (page uses inline FAQ structure, not array)

**Topics Covered:**
- PPC platforms managed
- AI in ad optimization
- PPC's role in AI visibility
- Minimum ad spend requirements
- Reporting methodology
- Ad copy and landing page creation
- Campaign launch timeline
- VISIBI's paid media differentiation
- Campaign success measurement
- Existing campaign takeover process

**Schema Location:** Inside `<Helmet>` component after Twitter Card meta tags

**Note:** This page has inline FAQs (not stored in an array), so the schema is manually defined with all 10 Q&A pairs.

---

### AI Visibility Tool Page (ToolPage.jsx)

**File:** `frontend/src/pages/ToolPage.jsx`
**Lines:** 117-131
**FAQ Count:** 10 FAQs
**Implementation Method:** Dynamically generated from `faqs` array

**Topics Covered:**
- What is the VISIBI Tool?
- Mention tracking capabilities
- Sentiment analysis accuracy
- Multiple brand tracking
- Update frequency
- Platforms monitored
- Tool availability
- Integration capabilities
- Manual monitoring comparison
- Access methods

**Schema Location:** Inside `<Helmet>` component after Twitter Card meta tags

---

### AI Agents Page (AIAgentsPage.jsx)

**File:** `frontend/src/pages/AIAgentsPage.jsx`
**Lines:** 220-234
**FAQ Count:** 12 FAQs
**Implementation Method:** Dynamically generated from `faqs` array

**Topics Covered:**
- Traditional vs agentic AI
- Development timeline
- System integration
- Cost structure
- Task capabilities
- Reliability and safety
- Technical expertise requirements
- Learning capabilities
- Error handling
- Data privacy
- Pilot projects
- Support offerings

**Schema Location:** Inside `<Helmet>` component after Twitter Card meta tags

---

## Schema Implementation Pattern

All FAQ schemas follow a consistent implementation pattern across the site:

### For Pages with FAQ Arrays

```jsx
<Helmet>
  {/* ... meta tags ... */}

  {/* Structured Data - FAQ Schema */}
  <script type="application/ld+json">
    {JSON.stringify({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": faqs.map(faq => ({
        "@type": "Question",
        "name": faq.question,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": faq.answer
        }
      }))
    })}
  </script>
</Helmet>
```

### For Pages with Inline FAQs (PPCPage)

```jsx
<Helmet>
  {/* ... meta tags ... */}

  {/* Structured Data - FAQ Schema */}
  <script type="application/ld+json">
    {JSON.stringify({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "Question text",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Answer text"
          }
        },
        // ... more Q&A pairs ...
      ]
    })}
  </script>
</Helmet>
```

---

## Technology Stack

- **Framework:** React (with Vite)
- **SEO Library:** react-helmet-async v2.0.5
- **Schema Format:** JSON-LD (recommended by Google)
- **Schema Vocabulary:** schema.org

---

## Best Practices Followed

1. **Single Source of Truth:** Schema is dynamically generated from the same data arrays used for UI rendering (except PPCPage)
2. **JSON-LD Format:** Using JSON-LD script tags in the document head (Google's recommended format)
3. **Placement:** Schema markup is placed within the `<Helmet>` component for proper head injection
4. **Consistency:** All pages follow the same implementation pattern
5. **Validation:** Schema follows schema.org FAQPage specifications exactly

---

## Maintenance Guidelines

### Adding New FAQs

1. **For pages with FAQ arrays:** Simply add new items to the `faqs` array in the component. The schema will automatically update.
   ```javascript
   const faqs = [
     // ... existing FAQs ...
     {
       question: "New question here?",
       answer: "New answer here."
     }
   ]
   ```

2. **For PPCPage:** Manually add the new Q&A to both the UI section AND the schema markup in the Helmet component.

### Modifying Existing FAQs

1. **For pages with FAQ arrays:** Update the question/answer text in the `faqs` array. Changes will automatically reflect in both UI and schema.

2. **For PPCPage:** Update the text in both the inline FAQ component AND the corresponding entry in the schema markup.

### Adding FAQ Schema to New Pages

1. Ensure the page uses react-helmet-async
2. Create a `faqs` array with question/answer objects
3. Add the FAQ schema script inside the Helmet component (after Twitter Card meta tags)
4. Use the standard pattern shown above
5. Update this documentation file

---

## Testing & Validation

### Recommended Testing Tools

1. **Google Rich Results Test**
   URL: https://search.google.com/test/rich-results
   Use this to validate FAQ schema markup

2. **Schema.org Validator**
   URL: https://validator.schema.org/
   Use this to validate JSON-LD structure

3. **Google Search Console**
   Monitor for enhancement reports and errors after deployment

### Testing Checklist

- [ ] Validate schema using Google Rich Results Test
- [ ] Check for JavaScript errors in browser console
- [ ] Verify schema appears in page source (View Page Source)
- [ ] Confirm schema matches FAQ UI content exactly
- [ ] Test on multiple pages to ensure consistency
- [ ] Monitor Google Search Console for errors after deployment

---

## SEO Benefits

Implementing FAQ schema provides several SEO benefits:

1. **Rich Results Eligibility:** Pages may appear as FAQ rich results in Google search
2. **Increased Visibility:** FAQ snippets can expand SERP real estate
3. **Higher CTR:** Rich results often have higher click-through rates
4. **Better Context:** Helps search engines understand page content better
5. **Voice Search:** Better positioning for voice search queries
6. **Featured Snippets:** Improved chances of appearing in featured snippets

---

## Future Schema Opportunities

Consider implementing these additional schema types:

1. **Organization Schema** (Already implemented in ComingSoon.jsx)
   - Add to other key pages for brand consistency

2. **BreadcrumbList Schema**
   - Improve navigation understanding for search engines

3. **Service Schema**
   - Detailed service descriptions for GEO, SEO, PPC pages

4. **Article Schema**
   - For blog posts and insight articles

5. **LocalBusiness Schema**
   - If physical location becomes relevant

6. **HowTo Schema**
   - For process-oriented content

---

## Related Documentation

- [Schema.org FAQPage Documentation](https://schema.org/FAQPage)
- [Google FAQ Rich Results Guidelines](https://developers.google.com/search/docs/appearance/structured-data/faqpage)
- [react-helmet-async Documentation](https://github.com/staylor/react-helmet-async)

---

## Change Log

| Date | Change | Pages Affected | Updated By |
|------|--------|---------------|------------|
| 2025-11-17 | Initial FAQ schema implementation | HomePage, GEOPage, HowWeWorkPage, SEOPage, PPCPage, ToolPage, AIAgentsPage | Claude Code |

---

## Contact

For questions about schema markup implementation or modifications, refer to the development team or consult this documentation.

**Note:** Always validate schema changes using Google's Rich Results Test before deployment to production.
