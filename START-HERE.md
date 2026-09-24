# 🚀 START HERE - VISIBI Coming Soon Page

## ✅ Good News - You're Already Set Up!

I've checked your system and:
- ✅ Virtual environment (`venv/`) exists
- ✅ All Python packages installed (FastAPI, OpenAI, etc.)
- ✅ `.env` file configured with OpenAI API key
- ✅ Backend tested and working

**You can start immediately!**

---

## 🎯 Quick Start (Copy & Paste)

### Terminal 1: Start Backend
```bash
cd /Users/samarmustafa/Documents/1Samar/50-apps-to-launch/VISIBI
source venv/bin/activate
python3 -m uvicorn backend.main:app --reload
```

Wait for this message:
```
🚀 Starting VISIBI - AI Brand Monitor v0.1.0
📝 API Documentation: http://localhost:8000/docs
✅ Configuration validated
```

### Terminal 2: Start Frontend
```bash
cd /Users/samarmustafa/Documents/1Samar/50-apps-to-launch/VISIBI/frontend
npm run dev
```

Wait for:
```
  ➜  Local:   http://localhost:5173/
```

### 3. Open & Test

**Open:** http://localhost:5173

**Test with:**
- Brand URL: `https://tesla.com`
- Email: `test@example.com`

**Result:** You'll see instant analytics preview!

---

## 📧 Email Behavior

### Development Mode (Current) ✅
- Emails **print to console** (backend terminal)
- Perfect for testing
- **No additional setup needed**

### Production Mode (When Ready)
Add to `backend/.env`:
```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password
FROM_EMAIL=your-email@gmail.com
ADMIN_EMAIL=your-email@gmail.com
```

For Gmail App Password: https://myaccount.google.com/apppasswords

---

## 💡 What You'll See

### When Backend Starts:
```
⚠️  No email configuration found. Using console output mode.
🚀 Starting VISIBI - AI Brand Monitor v0.1.0
📝 API Documentation: http://localhost:8000/docs
✅ Configuration validated
```

This warning is **NORMAL** - emails will print to console.

### When User Signs Up:
```
==============================================================================
EMAIL SENT (CONSOLE MODE)
==============================================================================
To: test@example.com
Subject: Your VISIBI Brand Analysis is Coming! (Tesla)
------------------------------------------------------------------------------
[Full email content here]
==============================================================================
```

### Data Saved To:
`backend/data/waitlist.json` (auto-created on first signup)

View it:
```bash
cat backend/data/waitlist.json
```

---

## 🎨 What Users Experience

1. **Beautiful landing page** with AI analytics features
2. **Enter brand URL** → Click "Next"
3. **Enter email** → Click "Get My Free Analysis"
4. **See instant preview**:
   - Sentiment: POSITIVE/NEGATIVE/NEUTRAL
   - Mentions: Number found
   - Visibility: Percentage score
5. **Confirmation message** about email being sent

---

## 🔧 Common Commands

### Check Backend is Running
```bash
curl http://localhost:8000/health
```

### View Waitlist Stats
```bash
curl http://localhost:8000/api/waitlist/stats
```

### Test Waitlist Endpoint
```bash
curl -X POST http://localhost:8000/api/waitlist \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","brand_url":"https://tesla.com"}'
```

### View Pretty Waitlist Data
```bash
cat backend/data/waitlist.json | python3 -m json.tool
```

---

## 📁 File Locations

### Frontend
- Coming Soon Page: `frontend/src/pages/ComingSoon.jsx`
- App Entry: `frontend/src/App.jsx`

### Backend
- API Endpoints: `backend/main.py`
- Email Service: `backend/services/email_service.py`
- Waitlist Service: `backend/services/waitlist_service.py`
- Configuration: `backend/.env`

### Data
- Waitlist Data: `backend/data/waitlist.json` (auto-created)

---

## 🚨 If Something Goes Wrong

### Backend won't start?
```bash
# Make sure you're in the right directory
cd /Users/samarmustafa/Documents/1Samar/50-apps-to-launch/VISIBI

# Activate venv
source venv/bin/activate

# Check Python version
python3 --version  # Should be 3.8+

# Reinstall if needed
pip install -r requirements.txt

# Try again
python3 -m uvicorn backend.main:app --reload
```

### Frontend can't connect?
1. Make sure backend is running on http://localhost:8000
2. Check browser DevTools console for errors
3. Visit http://localhost:8000/docs to verify backend

### More help?
See [TROUBLESHOOTING.md](./TROUBLESHOOTING.md)

---

## 📚 Documentation

- **Quick Start**: [QUICK-START-COMING-SOON.md](./QUICK-START-COMING-SOON.md)
- **Full Setup Guide**: [COMING-SOON-SETUP.md](./COMING-SOON-SETUP.md)
- **Architecture**: [COMING-SOON-ARCHITECTURE.md](./pending_deletion/COMING-SOON-ARCHITECTURE.md)
- **Troubleshooting**: [TROUBLESHOOTING.md](./TROUBLESHOOTING.md)

---

## 🎊 You're Ready!

Everything is configured and tested. Just run the commands above and you'll have a fully functional coming soon page collecting emails with AI-powered brand analysis!

**Next Steps:**
1. Start both servers (commands above)
2. Test with a real brand URL
3. Customize the branding if you want
4. Share with potential users!

---

## ⚡ Pro Tips

1. Keep backend terminal visible to see email previews
2. `backend/data/waitlist.json` stores all signups
3. Each submission runs a real AI analysis (uses OpenAI API)
4. Email config is optional - works great without it
5. Frontend hot-reloads automatically when you edit code

---

**Ready? Copy the commands above and launch! 🚀**
