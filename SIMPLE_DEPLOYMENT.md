# Simple Deployment Guide - Full Stack

## Problem with Vercel
Vercel is great for frontend, but your app needs:
- Frontend (React)
- Backend (Express + WebSocket)

Vercel free tier doesn't support WebSocket well.

## ✅ Best Option: Railway (Easiest Full-Stack Deploy)

### Step 1: Install Railway CLI
```bash
npm install -g @railway/cli
```

### Step 2: Login
```bash
railway login
```

### Step 3: Initialize Project
```bash
railway init
```

### Step 4: Add Start Script

Update `package.json`:
```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "server": "node server/index.js",
    "start": "node server/index.js"
  }
}
```

### Step 5: Deploy
```bash
railway up
```

### Step 6: Get Your URL
```bash
railway domain
```

Railway will give you an HTTPS URL like:
`https://enrollflow.up.railway.app`

## Alternative: Render (Also Free)

### Step 1: Push to GitHub
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin YOUR_GITHUB_REPO_URL
git push -u origin main
```

### Step 2: Go to Render.com
1. Sign up at https://render.com
2. Click "New +" → "Web Service"
3. Connect your GitHub repo
4. Configure:
   - **Build Command:** `npm install && npm run build`
   - **Start Command:** `node server/index.js`
5. Click "Create Web Service"

## 🎯 For Quick PWA Testing (No Deploy Needed)

### Use ngrok (Fastest!)

```bash
# 1. Download ngrok from https://ngrok.com/download
# Extract and add to PATH

# 2. Start your app
npm run dev

# 3. In another terminal
ngrok http 3000

# 4. You'll get an HTTPS URL like:
https://abc123.ngrok-free.app

# 5. Open on your phone - PWA works!
```

## Current Issue Summary

Your Vercel deployment failed because:
1. Root directory setting was wrong
2. Vercel doesn't handle backend well on free tier
3. WebSocket won't work on Vercel

## Recommended Next Steps

**For Capstone Demo:**
1. Use **ngrok** for quick HTTPS testing
2. Or deploy to **Railway** for permanent URL

**For Presentation:**
- Show app working on localhost
- Explain PWA requires HTTPS
- Demo on ngrok URL or Railway URL
- Show install on phone

## Quick ngrok Demo

```bash
# Terminal 1: Start backend
npm run server

# Terminal 2: Start frontend  
npm run dev

# Terminal 3: Expose with ngrok
ngrok http 3000

# Copy the HTTPS URL and open on phone!
```

---

**Bottom line:** Use Railway or ngrok instead of Vercel for full-stack apps with WebSocket.
