# Vercel Deployment Guide for VISIBI

## Overview
This project is configured to deploy both the React frontend and FastAPI backend to Vercel as a single deployment.

## Files Created for Vercel Deployment

### 1. `/vercel.json`
Main Vercel configuration file that defines:
- Build command for the frontend
- Output directory
- API rewrites (routing `/api/*` and `/health` to the backend)

### 2. `/api/index.py`
Serverless function entry point that:
- Imports the FastAPI app from `backend/main.py`
- Sets up proper Python paths
- Exposes the app to Vercel's serverless infrastructure

### 3. `/api/requirements.txt`
Python dependencies for the serverless function

### 4. `/.vercelignore`
Files and directories to exclude from deployment

## Environment Variables

You need to set these environment variables in your Vercel project settings:

### Required for Email Service:
- `SMTP_HOST` - SMTP server (e.g., smtp.gmail.com)
- `SMTP_PORT` - SMTP port (e.g., 587)
- `SMTP_USER` - SMTP username/email
- `SMTP_PASSWORD` - SMTP password or app password
- `FROM_EMAIL` - Email address to send from
- `ADMIN_EMAIL` - Admin email for notifications

### Optional (for OpenAI features):
- `OPENAI_API_KEY` - Your OpenAI API key (if enabling AI analysis)

## Deployment Steps

### Option 1: Deploy via Vercel CLI

1. Install Vercel CLI:
   ```bash
   npm i -g vercel
   ```

2. Login to Vercel:
   ```bash
   vercel login
   ```

3. Deploy:
   ```bash
   vercel
   ```

4. For production deployment:
   ```bash
   vercel --prod
   ```

### Option 2: Deploy via Vercel Dashboard

1. Go to [vercel.com](https://vercel.com)
2. Click "Add New Project"
3. Import your Git repository
4. Vercel will auto-detect the configuration from `vercel.json`
5. Add environment variables in the project settings
6. Click "Deploy"

## How It Works

### Frontend
- Built with Vite from the `frontend` directory
- Static files are output to `frontend/dist`
- Served directly by Vercel's CDN

### Backend
- FastAPI app runs as Vercel serverless functions
- All `/api/*` routes are forwarded to `api/index.py`
- The serverless function imports the main FastAPI app from `backend/main.py`

### API Routes
- Frontend: `https://your-domain.vercel.app/`
- API endpoints: `https://your-domain.vercel.app/api/*`
- Health check: `https://your-domain.vercel.app/health`

## Local Development

The setup works seamlessly with local development:

1. Frontend (in terminal 1):
   ```bash
   cd frontend
   npm run dev
   ```

2. Backend (in terminal 2):
   ```bash
   cd backend
   uvicorn main:app --reload --port 8000
   ```

The frontend's API client automatically detects the environment and uses:
- `http://localhost:8000` in development
- Relative URLs (same domain) in production

## Important Notes

1. **Serverless Function Limits**: Vercel serverless functions have execution time limits (10s for Hobby, 60s for Pro)
2. **Cold Starts**: The first request after inactivity may be slower due to cold starts
3. **Environment Variables**: Make sure all environment variables are set in Vercel project settings
4. **CORS**: The FastAPI app is configured with CORS to allow requests from the frontend

## Troubleshooting

### Build Fails
- Check build logs in Vercel dashboard
- Ensure all dependencies are in `package.json` and `api/requirements.txt`

### API Returns 404
- Verify environment variables are set
- Check that `/api/*` routes are properly defined in `vercel.json`
- Review serverless function logs in Vercel dashboard

### Email Not Sending
- Verify SMTP environment variables are correct
- Check that SMTP_PASSWORD is an app-specific password (for Gmail)
- Review function logs for email errors

## Production Checklist

- [ ] All environment variables set in Vercel
- [ ] SMTP credentials tested and working
- [ ] Custom domain configured (optional)
- [ ] SSL certificate active (automatic with Vercel)
- [ ] Analytics enabled (optional)
- [ ] Error monitoring configured (optional)

## Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Vercel Python Runtime](https://vercel.com/docs/runtimes#official-runtimes/python)
- [FastAPI Deployment](https://fastapi.tiangolo.com/deployment/)
