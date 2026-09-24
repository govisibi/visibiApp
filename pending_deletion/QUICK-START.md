# VISIBI - Quick Start Guide

## 🎯 Phase 0 Backend - Ready to Run!

### Option 1: Automated Setup (Recommended)

```bash
cd /Users/samarmustafa/Documents/1Samar/50-apps-to-launch/VISIBI
./setup.sh
```

This will automatically:
- ✅ Create virtual environment
- ✅ Install all dependencies
- ✅ Run all tests
- ✅ Verify configuration

### Option 2: Manual Setup

```bash
# 1. Navigate to project
cd /Users/samarmustafa/Documents/1Samar/50-apps-to-launch/VISIBI

# 2. Create virtual environment
python3 -m venv venv

# 3. Activate virtual environment
source venv/bin/activate

# 4. Install dependencies
pip install -r requirements.txt

# 5. Run tests
pytest tests/ -v

# 6. Start server
python -m uvicorn backend.main:app --reload
```

## 🌐 Access Points

- **API**: http://localhost:8000
- **Documentation**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc
- **Health Check**: http://localhost:8000/health

## 🧪 Quick Test

```bash
# Test the API
curl -X POST "http://localhost:8000/api/brands/analyze" \
  -H "Content-Type: application/json" \
  -d '{"url": "https://www.slack.com"}'
```

## 📁 What Was Created

```
✅ backend/config.py           - Configuration management
✅ backend/main.py             - FastAPI application
✅ backend/services/brand_analyzer.py
✅ backend/services/sentiment_analyzer.py
✅ backend/models/schemas.py   - Request/response models
✅ tests/test_brand_analyzer.py (15+ tests)
✅ tests/test_sentiment.py     (20+ tests)
✅ tests/test_api.py          (20+ tests)
✅ requirements.txt           - Dependencies
✅ .gitignore                - Git ignore patterns
✅ setup.sh                  - Setup automation
```

## 🎯 Phase 0 Checklist

- [x] Backend directory structure
- [x] Configuration file (config.py)
- [x] BrandAnalyzer service
- [x] SentimentAnalyzer service
- [x] Pydantic schemas
- [x] FastAPI application with endpoints
- [x] Comprehensive test suite (55+ tests)
- [x] .gitignore file
- [x] requirements.txt
- [x] Setup automation script
- [ ] **Next: Run setup.sh and start server!**

## 🚀 Next Steps

1. **Run the setup script**: `./setup.sh`
2. **Start the server**: `python -m uvicorn backend.main:app --reload`
3. **Test the API**: Visit http://localhost:8000/docs
4. **Proceed to Phase 1**: Frontend development

## 📚 Documentation

- Full details: `BACKEND-README.md`
- Phase 0 guide: `Phase-0-Backend-setup.md`
- Sub-agent guide: `SUB-AGENT-GUIDE.md`

---

**Backend Development Agent - Ready to Launch! 🎉**
