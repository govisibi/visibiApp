# 🚀 Quick Start: Production SSG

## ⚡ TL;DR - Run This Now

```bash
# From project root
./migrate-ssg.sh
```

This will:
1. ✅ Backup your current setup
2. ✅ Clean install new dependencies
3. ✅ Test the build
4. ✅ Verify all 8 pages are pre-rendered
5. ✅ Give you a success report

---

## 📋 What's Changing

| Old | New | Why |
|-----|-----|-----|
| `puppeteer` | `puppeteer-core` + `@sparticuz/chromium` | 80% smaller, no downloads |
| 5-7 min builds | 30-60 sec builds | Optimized for Railway |
| Skipped SSG on Railway | Full SSG everywhere | Better SEO |

---

## 🎯 Manual Steps (if migration script fails)

### 1. Install New Dependencies

```bash
cd frontend
rm -rf node_modules package-lock.json
npm install
```

### 2. Test Local Build

```bash
npm run build
```

**Expected:** Build completes in 30-60 seconds with all 8 pages pre-rendered.

### 3. Verify Output

```bash
ls dist/index.html
ls dist/about/index.html
ls dist/seo/index.html
# ... check all 8 pages
```

### 4. Test Locally

```bash
npm run serve
# Open http://localhost:5173
# View source - should see full HTML
```

### 5. Deploy

```bash
git add .
git commit -m "Optimize SSG for production with @sparticuz/chromium"
git push
```

---

## 🔍 Verify It Worked

### Local Test
```bash
npm run build

# Should see:
# 💻 Development mode: Using local Chrome
# ✅ Pre-rendering complete!
#    📊 Success: 8/8 pages
#    ⏱️  Duration: ~15s
```

### Railway Test
After deployment, check Railway logs for:
```
🚀 Production mode: Using @sparticuz/chromium
✅ Pre-rendering complete!
   📊 Success: 8/8 pages
   ⏱️  Duration: ~12s
```

### SEO Test
View source on your production site:
```bash
curl https://your-site.railway.app/ | grep -i "meta"
curl https://your-site.railway.app/about | grep -i "about"
```

Should see full HTML with meta tags, not empty React root.

---

## 📊 Quick Reference

### Marketing Pages (All Pre-rendered)
- `/` - Coming Soon
- `/about` - About
- `/geo` - GEO
- `/seo` - SEO
- `/ppc` - PPC
- `/tool` - Tool
- `/insights` - Insights
- `/how-we-work` - How We Work

### Build Commands
```bash
npm run build        # Full build with SSG
npm run build:csr    # CSR only (no pre-rendering)
npm run preview      # Preview built site
npm run serve        # Serve dist folder
```

### Environment Detection
- **Local:** Uses your Chrome (`/Applications/Google Chrome.app`)
- **Railway:** Uses `@sparticuz/chromium` (lightweight)

---

## 🆘 Troubleshooting

### Build fails with "Cannot find Chrome"
**Local:** Install Chrome if not present
**Railway:** Should use @sparticuz/chromium automatically

### Pre-rendering takes too long
Check for:
- API calls during render (move to useEffect)
- Infinite loops
- Missing error boundaries

### Pages don't show pre-rendered HTML
1. Check `dist/{page}/index.html` exists
2. Verify file size > 1KB
3. Look for errors in build logs

### Migration script fails
Run manual steps above instead.

---

## ✅ Success Checklist

- [ ] Run `./migrate-ssg.sh`
- [ ] See "✅ MIGRATION SUCCESSFUL!"
- [ ] Test locally: `npm run serve`
- [ ] View source shows full HTML
- [ ] All 8 pages load correctly
- [ ] Commit and push to git
- [ ] Railway build completes in <2 min
- [ ] Production site has pre-rendered HTML
- [ ] SEO tools can read content

---

## 📚 Full Documentation

See `PRODUCTION-SSG-OPTIMIZATION.md` for complete details.

---

**Questions?** Check the troubleshooting section or build logs.
