# Vercel Deployment Troubleshooting Guide

## 🚨 Issue Identified

**Problem:** Vercel is deploying a different project than what's being pushed to GitHub.

**Root Cause:** Mismatch between GitHub repository and Vercel project connection.

---

## ✅ Current Configuration

### Git Repository
- **Repository URL:** `https://github.com/Adnan-hka/visibiwebproject`
- **Branch:** `main`
- **Latest Commit:** `c679247` - "Fix Vercel build configuration to build from source"

### Build Files
- **Source:** `frontend/src/`
- **Build Output:** `frontend/dist/`
- **Build Command:** `cd frontend && npm run build`
- **Pre-rendered Pages:** 10 pages (Homepage, About, GEO, SEO, AI Agents, Tool, Insights, Blog, How We Work, Contact)

---

## 🛠️ Solution Steps

### Step 1: Verify Vercel Project Connection

1. **Go to Vercel Dashboard:**
   - Visit: https://vercel.com/dashboard
   - Login with your account

2. **Find Your Projects:**
   - Look for any project named "VISIBI" or similar
   - Check which project is currently deploying when you push to GitHub

3. **Check Git Connection:**
   - Click on the project
   - Go to: **Settings → Git**
   - Verify which GitHub repository is connected
   - **Expected:** `Adnan-hka/visibiwebproject`
   - **Branch:** `main`

### Step 2: Fix Repository Connection (If Wrong)

**If Vercel is connected to a different repository:**

1. In Vercel Dashboard → Your Project → Settings → Git
2. Click **"Disconnect"** to disconnect the current repository
3. Click **"Connect Git Repository"**
4. Select: `Adnan-hka/visibiwebproject`
5. Select branch: `main`

### Step 3: Configure Build Settings

In Vercel Dashboard → Your Project → Settings → General:

```
Framework Preset: Other
Root Directory: ./ (or leave empty)
Build Command: cd frontend && npm run build
Output Directory: frontend/dist
Install Command: cd frontend && npm install
Node.js Version: 18.x (or latest LTS)
```

### Step 4: Environment Variables (If Needed)

In Vercel Dashboard → Your Project → Settings → Environment Variables:

```
VITE_API_URL = https://your-backend-api-url.com
```

*(Add any other environment variables your app needs)*

### Step 5: Trigger Deployment

**Option A: Push to GitHub (Automatic)**
```bash
cd /Users/samarmustafa/Documents/1Samar/50-apps-to-launch/VISIBI
git add .
git commit -m "Trigger Vercel deployment"
git push origin main
```

**Option B: Manual Deploy in Vercel**
- Go to Vercel Dashboard → Your Project → Deployments
- Click **"Redeploy"** on the latest deployment

---

## 📋 Vercel Configuration File

Your `vercel.json` has been updated to:

```json
{
  "buildCommand": "cd frontend && npm run build:csr",
  "outputDirectory": "frontend/dist",
  "framework": null,
  "installCommand": "cd frontend && npm ci --production=false",
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

This configuration:
- ✅ Installs dependencies from `frontend/package.json` using `npm ci` (faster, more reliable)
- ✅ Builds using `build:csr` (Client-Side Rendering) - skips pre-rendering
- ✅ Serves static files from `frontend/dist/`
- ✅ Handles client-side routing with SPA rewrites
- ✅ SEO handled by React Helmet (meta tags injected client-side)

### Why CSR on Vercel?

Pre-rendering requires Puppeteer and Chromium which are:
- ❌ Large dependencies (~300MB+)
- ❌ Slow to install on Vercel
- ❌ Can cause build timeouts
- ❌ Not necessary for good SEO (React Helmet handles meta tags)

**Solution:** Pre-render locally, push to Git, Vercel serves pre-built files OR use CSR mode with React Helmet.

---

## 🔍 Verification Checklist

After following the steps above, verify:

- [ ] Vercel project is connected to `Adnan-hka/visibiwebproject`
- [ ] Branch is set to `main`
- [ ] Build command is: `cd frontend && npm run build`
- [ ] Output directory is: `frontend/dist`
- [ ] Latest commit shows in Vercel deployments
- [ ] Deployment succeeds without errors
- [ ] Website shows the updated HomePage content
- [ ] All 10 pages are accessible and load correctly

---

## 🚀 Quick Deploy Commands

### Build Locally and Push
```bash
cd /Users/samarmustafa/Documents/1Samar/50-apps-to-launch/VISIBI

# Build the frontend
cd frontend
npm run build
cd ..

# Commit and push
git add frontend/dist/
git commit -m "Update static build"
git push origin main
```

### Using Vercel CLI (Alternative)

```bash
# Login to Vercel
vercel login

# Link to correct project
cd /Users/samarmustafa/Documents/1Samar/50-apps-to-launch/VISIBI
vercel link

# Deploy
vercel --prod
```

---

## 📊 Recent Commits

```
c679247 - Fix Vercel build configuration to build from source
d94f629 - Rebuild static pages with updated HomePage content
74ccf3a - Rebuild static pages with updated HomePage content
c190dab - Update GEO page in dist folder
8b0fddc - Update HomePage with new content and redesigned sections
```

---

## 🆘 Still Having Issues?

### Check Vercel Deployment Logs

1. Go to Vercel Dashboard → Your Project → Deployments
2. Click on the latest deployment
3. Check the **"Building"** and **"Deployment"** logs for errors

### Common Issues

**Issue 1: Build Fails**
- Check Node.js version (should be 18.x or higher)
- Verify all dependencies are in `package.json`
- Check build logs for missing packages

**Issue 2: Wrong Project Deploys**
- Disconnect and reconnect the correct GitHub repository
- Ensure you're pushing to the correct branch (`main`)

**Issue 3: Old Content Shows**
- Clear Vercel cache: Settings → General → Clear Cache
- Redeploy the latest commit
- Check browser cache (hard refresh with Cmd+Shift+R)

**Issue 4: 404 Errors**
- Verify `vercel.json` rewrites are configured
- Check output directory contains `index.html`
- Ensure all routes are pre-rendered

---

## 📞 Support

If issues persist:
1. Check Vercel documentation: https://vercel.com/docs
2. Verify GitHub webhook is active in repository settings
3. Contact Vercel support with deployment logs

---

**Last Updated:** November 26, 2025
**Repository:** https://github.com/Adnan-hka/visibiwebproject
**Branch:** main

