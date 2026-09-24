# Phase 1 Updates: Custom Queries & API Usage Tracking

## Overview
Two powerful features have been added to Phase 1:
1. **Custom Queries & Keywords** - Advanced options for customized brand analysis
2. **API Usage Tracking** - Real-time token usage and cost estimation

---

## 🎯 Feature 1: Custom Queries & Keywords

### What It Does
Allows users to customize the analysis beyond the 5 default queries by:
- Adding completely custom questions to ask AI models
- Adding keywords that generate targeted queries automatically
- Mixing custom and default queries for comprehensive analysis

### User Interface

**Location**: Dashboard > Analyze Brand card > "Advanced Options" button

**Components**:
- **Collapsible Section**: Click "Advanced Options" to expand/collapse
- **Custom Queries Tab**: Add your own questions
- **Custom Keywords Tab**: Add keywords that auto-generate 2 queries each
- **Live Counter**: Shows total queries that will be analyzed
- **Reset Button**: Quickly clear all customizations

### How to Use

#### Adding Custom Queries
1. Click "Advanced Options (Custom Queries & Keywords)"
2. Navigate to "Custom Queries" tab
3. Type your question in the input field
4. Click "Add Query" or press Enter
5. Query appears as a badge below
6. Repeat to add more queries
7. Click × on any badge to remove it

**Example Custom Queries**:
```
"How does Slack compare to Microsoft Teams for enterprise?"
"What are the security features of Slack?"
"Is Slack good for remote team collaboration?"
"What integrations does Slack offer?"
```

#### Adding Custom Keywords
1. Click "Advanced Options (Custom Queries & Keywords)"
2. Navigate to "Custom Keywords" tab
3. Type a keyword in the input field
4. Click "Add Keyword" or press Enter
5. Keyword appears as a badge below
6. Each keyword generates 2 queries automatically:
   - "What do you think about {brand} {keyword}?"
   - "How is {brand} {keyword}?"

**Example Custom Keywords**:
```
security
integrations
pricing
mobile app
customer support
API
```

For keyword "security" with brand "Slack", generates:
- "What do you think about Slack security?"
- "How is Slack security?"

### Backend Support

**API Endpoint**: `POST /api/brands/analyze`

**Request Body**:
```json
{
  "url": "https://www.slack.com",
  "queries": ["Custom query 1", "Custom query 2"],  // Optional
  "custom_keywords": ["security", "integrations"]    // Optional
}
```

**Query Priority**:
1. If `queries` provided → Use ONLY custom queries
2. If `custom_keywords` provided → Generate 2 queries per keyword + 5 defaults
3. If neither provided → Use 5 default queries

**Default Queries**:
```
"What do you think about {brand}?"
"Have you heard of {brand}?"
"How does {brand} compare to alternatives?"
"What are the pros and cons of {brand}?"
"Would you recommend {brand}?"
```

### Technical Implementation

**Frontend**:
- Component: `frontend/src/components/QueryCustomizer.jsx`
- State management: Local state with callbacks to Dashboard
- Integration: Dashboard.jsx lines 20-27, 108-130
- Icons: Zap (Advanced), ChevronDown/Up (Toggle)

**Backend**:
- Schema: `backend/models/schemas.py` - URLRequest class
- Service: `backend/services/brand_analyzer.py` - generate_monitoring_queries()
- API: `backend/main.py` - analyze_brand endpoint

### Use Cases

**1. Competitive Analysis**
```
Custom Queries:
- "How does Slack compare to Microsoft Teams?"
- "How does Slack compare to Discord?"
- "How does Slack compare to Zoom?"
```

**2. Feature-Specific Research**
```
Custom Keywords:
- security
- integrations
- mobile
- pricing
- API
- automation
```

**3. Customer Sentiment**
```
Custom Queries:
- "What do users say about Slack's ease of use?"
- "Are there any common complaints about Slack?"
- "What features do users love most about Slack?"
```

**4. Industry-Specific Analysis**
```
Custom Keywords:
- healthcare
- education
- finance
- government
- nonprofit
```

---

## 📊 Feature 2: API Usage Tracking

### What It Does
Tracks and displays real-time metrics about OpenAI API usage:
- Total tokens consumed
- Input tokens (prompt)
- Output tokens (completion)
- Estimated cost in USD
- Model used for analysis

### User Interface

**Location**: Dashboard > Results section > API Usage card (purple border)

**Display Components**:
- **Model Badge**: Shows which AI model was used (e.g., "gpt-4o-mini")
- **Total Tokens**: Sum of input + output tokens
- **Input Tokens**: Tokens from queries sent to API
- **Output Tokens**: Tokens in responses received from API
- **Estimated Cost**: Calculated based on OpenAI pricing

**Visual Design**:
- Purple-bordered card with CPU icon
- Color-coded metrics:
  - Total Tokens: Purple
  - Input Tokens: Blue
  - Output Tokens: Green
  - Cost: Orange
- Responsive grid: 4 columns on desktop, 2 on mobile

### Cost Calculation

**gpt-4o-mini Pricing** (as of October 2025):
- Input: $0.150 per 1M tokens
- Output: $0.600 per 1M tokens

**Formula**:
```
estimated_cost = (prompt_tokens / 1,000,000) × $0.150 + 
                 (completion_tokens / 1,000,000) × $0.600
```

**Example Calculation**:
```
Analysis with 5 queries:
- Prompt tokens: 500 (queries sent)
- Completion tokens: 2,000 (responses received)
- Total tokens: 2,500

Cost = (500 / 1,000,000) × $0.150 + (2,000 / 1,000,000) × $0.600
     = $0.000075 + $0.0012
     = $0.001275
     ≈ $0.0013 (displayed)
```

### Typical Usage Costs

**5 Default Queries** (Standard Analysis):
- ~500-800 input tokens
- ~1,500-2,500 output tokens
- ~2,000-3,300 total tokens
- **Cost: $0.001 - $0.002** (less than a penny)

**10 Custom Queries** (Detailed Analysis):
- ~1,000-1,500 input tokens
- ~3,000-5,000 output tokens
- ~4,000-6,500 total tokens
- **Cost: $0.003 - $0.004** (less than half a penny)

**20 Keywords** (40 generated queries):
- ~4,000-6,000 input tokens
- ~12,000-20,000 output tokens
- ~16,000-26,000 total tokens
- **Cost: $0.012 - $0.016** (about 1-2 cents)

### Backend Implementation

**Schema Update** (`backend/models/schemas.py`):
```python
class UsageMetrics(BaseModel):
    model: str
    total_tokens: int
    prompt_tokens: int
    completion_tokens: int
    estimated_cost: float
```

**Response Update** (`backend/models/schemas.py`):
```python
class AnalysisResponse(BaseModel):
    # ... existing fields ...
    usage: Optional[UsageMetrics] = None
```

**OpenAI Response Handling** (`backend/main.py`):
```python
# Extract usage from OpenAI response
usage_data = {
    "prompt_tokens": response.usage.prompt_tokens,
    "completion_tokens": response.usage.completion_tokens,
    "total_tokens": response.usage.total_tokens
}
```

**Accumulation** (per analysis):
```python
# Track total across all queries
total_prompt_tokens = 0
total_completion_tokens = 0

for query in queries:
    response, usage_data = get_chatgpt_response(query)
    total_prompt_tokens += usage_data["prompt_tokens"]
    total_completion_tokens += usage_data["completion_tokens"]
```

**Cost Calculation** (`backend/main.py`):
```python
total_tokens = total_prompt_tokens + total_completion_tokens
estimated_cost = (
    (total_prompt_tokens / 1_000_000) * 0.150 +
    (total_completion_tokens / 1_000_000) * 0.600
)
```

### Why This Matters

**1. Transparency**
- Users see exactly what they're using
- No hidden costs or surprises
- Clear model identification

**2. Budget Planning**
- Estimate costs before scaling
- Compare analysis approaches
- Optimize query strategies

**3. Performance Insights**
- More tokens = more detailed responses
- Track token efficiency per query
- Identify verbose vs concise queries

**4. Debugging**
- Verify API calls are working
- Check token consumption patterns
- Validate pricing calculations

**5. Future Planning**
- Phase 4: Compare costs across models (GPT vs Claude vs Gemini)
- Phase 5: Team budgets and usage limits
- Analytics: Token usage trends over time

---

## 📝 API Examples

### Example 1: Default Queries Only
```bash
curl -X POST http://localhost:8000/api/brands/analyze \
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://www.slack.com"
  }'
```

**Response** (abbreviated):
```json
{
  "brand_name": "Slack",
  "queries_analyzed": 5,
  "usage": {
    "model": "gpt-4o-mini",
    "total_tokens": 2500,
    "prompt_tokens": 500,
    "completion_tokens": 2000,
    "estimated_cost": 0.00127
  }
}
```

### Example 2: Custom Queries
```bash
curl -X POST http://localhost:8000/api/brands/analyze \
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://www.slack.com",
    "queries": [
      "How does Slack compare to Microsoft Teams?",
      "What are the security features of Slack?",
      "Is Slack good for remote teams?"
    ]
  }'
```

**Response**:
```json
{
  "brand_name": "Slack",
  "queries_analyzed": 3,
  "usage": {
    "model": "gpt-4o-mini",
    "total_tokens": 1800,
    "prompt_tokens": 400,
    "completion_tokens": 1400,
    "estimated_cost": 0.00096
  }
}
```

### Example 3: Custom Keywords
```bash
curl -X POST http://localhost:8000/api/brands/analyze \
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://www.slack.com",
    "custom_keywords": ["security", "integrations", "pricing"]
  }'
```

**Generated Queries** (11 total):
- 5 default queries
- 6 keyword-based queries:
  - "What do you think about Slack security?"
  - "How is Slack security?"
  - "What do you think about Slack integrations?"
  - "How is Slack integrations?"
  - "What do you think about Slack pricing?"
  - "How is Slack pricing?"

**Response**:
```json
{
  "brand_name": "Slack",
  "queries_analyzed": 11,
  "usage": {
    "model": "gpt-4o-mini",
    "total_tokens": 5200,
    "prompt_tokens": 1100,
    "completion_tokens": 4100,
    "estimated_cost": 0.00285
  }
}
```

---

## 🎨 UI Screenshots (Description)

### Advanced Options - Collapsed
```
┌─────────────────────────────────────────────────┐
│ Analyze Brand                                    │
├─────────────────────────────────────────────────┤
│ [https://www.example.com        ] [Analyze]     │
│                                                  │
│ ⚡ Advanced Options (Custom Queries & Keywords) ▼│
└─────────────────────────────────────────────────┘
```

### Advanced Options - Expanded with Custom Queries
```
┌─────────────────────────────────────────────────┐
│ Analyze Brand                                    │
├─────────────────────────────────────────────────┤
│ [https://www.slack.com          ] [Analyze]     │
│                                                  │
│ ⚡ Advanced Options (Custom Queries & Keywords) ▲│
├─────────────────────────────────────────────────┤
│ [Custom Queries] [Custom Keywords]               │
│                                                  │
│ Add your own questions to customize analysis    │
│                                                  │
│ [Type your custom query here...    ] [Add Query]│
│                                                  │
│ ✨ Custom Queries (2)                            │
│ [How does Slack compare to Teams? ×]             │
│ [What are Slack security features? ×]            │
│                                                  │
│ 📊 Will analyze 2 custom queries                 │
│                                                  │
│ [Reset to Defaults]                              │
└─────────────────────────────────────────────────┘
```

### API Usage Card
```
┌─────────────────────────────────────────────────┐
│ 🖥️ API Usage                    [gpt-4o-mini]   │
│ Token usage and estimated cost                   │
├─────────────────────────────────────────────────┤
│  2,500      500      2,000      $0.0013         │
│  Total    Input    Output       Cost            │
│  Tokens   Tokens   Tokens       (USD)           │
└─────────────────────────────────────────────────┘
```

---

## 🔧 Configuration

### Backend Configuration
File: `backend/config.py`

```python
OPENAI_MODEL = "gpt-4o-mini"  # Model used for analysis
MAX_TOKENS = 500               # Max tokens per response
TEMPERATURE = 0.7              # Response creativity (0-1)
```

### Pricing Configuration
File: `backend/main.py` (lines 200-204)

```python
# gpt-4o-mini pricing: $0.150/1M input, $0.600/1M output
estimated_cost = (
    (total_prompt_tokens / 1_000_000) * 0.150 +
    (total_completion_tokens / 1_000_000) * 0.600
)
```

**To update pricing** (if OpenAI changes rates):
1. Update the cost calculation in `backend/main.py`
2. Update the pricing note in this documentation
3. Restart backend server

---

## 🚀 Testing the Features

### Test 1: Basic Custom Query
1. Open http://localhost:5173
2. Enter URL: `https://www.slack.com`
3. Click "Advanced Options"
4. Click "Custom Queries" tab
5. Type: "What are Slack's best features?"
6. Click "Add Query"
7. Click "Analyze"
8. Wait for results
9. Verify:
   - Analysis shows 1 query analyzed (not 5)
   - Results include your custom query
   - Usage card displays token metrics

### Test 2: Custom Keywords
1. Clear previous analysis
2. Enter URL: `https://www.slack.com`
3. Click "Advanced Options"
4. Click "Custom Keywords" tab
5. Add keywords: "security", "pricing"
6. Click "Analyze"
7. Verify:
   - Analysis shows 9 queries (5 default + 4 keyword-based)
   - Query results include keyword queries
   - Usage shows higher token count

### Test 3: Usage Metrics
1. Perform any analysis
2. Scroll to "API Usage" card
3. Verify:
   - Model badge shows "gpt-4o-mini"
   - All 4 metrics display numbers
   - Cost is > $0.0000 and < $0.05
   - Total tokens = Input + Output tokens

---

## 📊 Performance Impact

### Custom Queries
- **Processing Time**: ~3-8 seconds per query
- **Token Usage**: Varies by query complexity
- **Recommendation**: Use 5-10 custom queries for balance

### Custom Keywords
- **Processing Time**: 2 queries per keyword (×2 time)
- **Token Usage**: ~200-500 tokens per keyword (2 queries)
- **Recommendation**: Use 3-5 keywords to avoid long waits

### Large Analyses
- **20 keywords** = 40 keyword queries + 5 defaults = **45 total**
- **Estimated time**: 45 queries × 5 seconds = ~3-4 minutes
- **Estimated cost**: ~$0.015 - $0.025 (1-2 cents)
- **Use case**: Comprehensive brand audit

---

## 🔮 Future Enhancements

### Phase 2: Settings & Persistence
- Save favorite custom queries as templates
- Store keyword lists for reuse
- Usage history and cost tracking over time
- Monthly usage budgets and alerts

### Phase 3: Monitoring
- Scheduled analyses with custom queries
- Automated keyword discovery
- Query performance analytics

### Phase 4: Multi-Model
- Compare token usage across models
- Cost optimization recommendations
- Model selection based on query type

### Phase 5: Advanced Analytics
- Query effectiveness scoring
- Token efficiency metrics
- Team usage dashboards
- Cost allocation by project/team

---

## 📚 Related Documentation

- **PERFORMANCE-AND-CUSTOMIZATION.md** - Query customization guide
- **QUICK-PERFORMANCE-GUIDE.md** - Performance optimization
- **PHASE-1-COMPLETE.md** - Complete Phase 1 overview
- **SIDEBAR-MENU-DOCUMENTATION.md** - Feature roadmap

---

## ✅ Summary

**Custom Queries & Keywords**:
- ✅ Full UI component created
- ✅ Integrated into Dashboard
- ✅ Backend API support ready
- ✅ Tested and working

**API Usage Tracking**:
- ✅ Backend captures OpenAI usage data
- ✅ Cost calculation implemented
- ✅ Frontend displays 4 key metrics
- ✅ Real-time tracking per analysis

**Status**: Both features **COMPLETE** and ready to use in Phase 1! 🎉

---

**Last Updated**: October 11, 2025
**Version**: Phase 1.1
**Author**: VISIBI Development Team
