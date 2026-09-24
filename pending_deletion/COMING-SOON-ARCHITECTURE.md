# Coming Soon Page - Architecture

## System Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                         USER JOURNEY                             │
└─────────────────────────────────────────────────────────────────┘

Step 1: Landing Page
├── Hero section with features
├── Brand URL input form
└── [Next] button

Step 2: Email Collection
├── Show entered URL (with change option)
├── Email input form
└── [Get My Free Analysis] button

Step 3: Preview Results
├── Success confirmation
├── Preview analytics (sentiment, mentions, visibility)
└── Email notification sent


┌─────────────────────────────────────────────────────────────────┐
│                      TECHNICAL FLOW                              │
└─────────────────────────────────────────────────────────────────┘

Frontend (React + Vite)
│
├── ComingSoon.jsx
│   ├── State: step (1, 2, or 3)
│   ├── State: brandUrl
│   ├── State: email
│   └── State: preview
│
└── POST /api/waitlist ──────┐
                             │
                             ▼
                    Backend (FastAPI)
                             │
                    /api/waitlist endpoint
                             │
                    ┌────────┴─────────┐
                    │                  │
                    ▼                  ▼
            Brand Analyzer    Sentiment Analyzer
                    │                  │
                    └────────┬─────────┘
                             │
                    ┌────────┴─────────┐
                    │                  │
                    ▼                  ▼
            Waitlist Service   Email Service
                    │                  │
                    ▼                  ▼
            waitlist.json      SMTP / Console
                    │                  │
                    └────────┬─────────┘
                             │
                             ▼
                    Preview Response
                             │
                             └──────► Frontend shows results


┌─────────────────────────────────────────────────────────────────┐
│                      DATA STORAGE                                │
└─────────────────────────────────────────────────────────────────┘

backend/data/waitlist.json (Auto-created)
│
├── Array of entries:
│   ├── email
│   ├── brand_url
│   ├── created_at
│   ├── status (pending/sent/error)
│   └── preview_data
│       ├── brand_name
│       ├── sentiment
│       ├── mentions
│       └── visibility
│
└── Easy to migrate to PostgreSQL (Phase 2)


┌─────────────────────────────────────────────────────────────────┐
│                    EMAIL SYSTEM                                  │
└─────────────────────────────────────────────────────────────────┘

EmailService (Backend)
│
├── Provider: ConsoleEmailProvider (default)
│   └── Prints emails to terminal (dev mode)
│
└── Provider: SMTPEmailProvider (production)
    │
    ├── Gmail SMTP
    ├── SendGrid SMTP
    ├── AWS SES SMTP
    └── Custom SMTP
    │
    ├── User Confirmation Email
    │   ├── Beautiful HTML template
    │   ├── Preview analytics
    │   └── Next steps
    │
    └── Admin Notification Email (optional)
        ├── User email + brand URL
        └── Preview data


┌─────────────────────────────────────────────────────────────────┐
│                    API ENDPOINTS                                 │
└─────────────────────────────────────────────────────────────────┘

POST /api/waitlist
├── Input: { email, brand_url }
├── Process:
│   ├── Validate email format
│   ├── Fetch brand info from URL
│   ├── Generate 5 monitoring queries
│   ├── Get ChatGPT responses
│   ├── Analyze sentiment
│   ├── Calculate preview metrics
│   ├── Save to waitlist.json
│   ├── Send confirmation email
│   └── Send admin notification (if configured)
└── Output: { message, email, brand_url, preview }

GET /api/waitlist/stats
├── Input: None
└── Output: { total, pending, sent, error }


┌─────────────────────────────────────────────────────────────────┐
│                 CONFIGURATION FILES                              │
└─────────────────────────────────────────────────────────────────┘

.env (Create from .env.example)
│
├── OPENAI_API_KEY=xxx          [Required for analysis]
├── SMTP_HOST=smtp.gmail.com    [Optional for emails]
├── SMTP_PORT=587
├── SMTP_USER=user@gmail.com
├── SMTP_PASSWORD=app-password
├── FROM_EMAIL=user@gmail.com
└── ADMIN_EMAIL=admin@domain.com [Optional notifications]


┌─────────────────────────────────────────────────────────────────┐
│                 MIGRATION PATH TO PHASE 2                        │
└─────────────────────────────────────────────────────────────────┘

Current: JSON File Storage
│
└── Phase 2: PostgreSQL Database
    │
    ├── 1. Create waitlist table schema:
    │   CREATE TABLE waitlist (
    │     id SERIAL PRIMARY KEY,
    │     email VARCHAR(255) UNIQUE,
    │     brand_url VARCHAR(500),
    │     created_at TIMESTAMP,
    │     status VARCHAR(50),
    │     preview_data JSONB
    │   );
    │
    ├── 2. Import waitlist.json data:
    │   python scripts/migrate_waitlist.py
    │
    ├── 3. Update WaitlistService:
    │   Replace JSON file operations with SQL queries
    │
    └── 4. No frontend changes needed! ✅


┌─────────────────────────────────────────────────────────────────┐
│                  DEPLOYMENT ARCHITECTURE                         │
└─────────────────────────────────────────────────────────────────┘

Production Setup:

User Browser
     │
     ▼
CDN (Vercel/Netlify)
     │
     ├── Static Files (React SPA)
     └── API Proxy to Backend
              │
              ▼
       Backend Server
       (Railway/Render/Heroku)
              │
              ├── FastAPI Application
              ├── OpenAI API calls
              ├── Email Service (SMTP)
              └── JSON Storage (temp)
                       │
                       └─► PostgreSQL (Phase 2)


┌─────────────────────────────────────────────────────────────────┐
│                    SECURITY NOTES                                │
└─────────────────────────────────────────────────────────────────┘

✅ Email validation (basic format check)
✅ Environment variables for sensitive data
✅ CORS configuration (update for production)
✅ HTTPS recommended for production
✅ Rate limiting (add in production)
✅ Email verification (consider for Phase 2)
✅ GDPR compliance (add privacy policy)


┌─────────────────────────────────────────────────────────────────┐
│                  PERFORMANCE NOTES                               │
└─────────────────────────────────────────────────────────────────┘

Current Setup:
├── Quick preview: 5 queries only (~10-15 seconds)
├── Full analysis: Available in dashboard (10+ queries)
├── Email: Async (doesn't block response)
└── JSON storage: Fast for < 10,000 entries

Future Optimizations (Phase 2+):
├── Cache brand analysis results
├── Background job queue (Celery/Redis)
├── Database indexing
└── CDN for static assets


┌─────────────────────────────────────────────────────────────────┐
│                    TESTING STRATEGY                              │
└─────────────────────────────────────────────────────────────────┘

Manual Testing:
├── ✓ Frontend renders correctly
├── ✓ Form validation works
├── ✓ Can submit brand URL + email
├── ✓ Preview analytics appear
├── ✓ Email printed to console (dev)
└── ✓ Data saved to waitlist.json

Integration Testing:
├── ✓ Backend endpoint responds
├── ✓ OpenAI API calls work
├── ✓ Sentiment analysis returns data
├── ✓ Email service handles errors gracefully
└── ✓ Waitlist service saves correctly

Production Testing:
├── ✓ SMTP email delivery works
├── ✓ Admin notifications received
├── ✓ CORS settings correct
└── ✓ Error handling for API failures
