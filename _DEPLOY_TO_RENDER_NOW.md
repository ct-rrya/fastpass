# 🎯 Deploy to Render - Quick Checklist

## ✅ Your Code is Ready!

Everything is already configured for Render:
- ✅ Prisma installed
- ✅ Database schema ready
- ✅ Migration runs automatically on startup
- ✅ Server code ready (server/index.js)
- ✅ All code pushed to GitHub

---

## 🚀 Quick Steps (10 minutes total)

### 1. Sign Up (2 min)
- Go to: https://render.com
- Sign up with GitHub
- ✅ Done

### 2. Create Database (3 min)
- Dashboard → New + → PostgreSQL
- Name: `fastpass-db`
- Plan: **Free**
- Create Database
- **Copy the "Internal Database URL"**
- ✅ Done

### 3. Create Web Service (3 min)
- Dashboard → New + → Web Service
- Connect your `fastpass` repo
- Name: `fastpass-backend`
- Build: `npm install`
- Start: `npm start`
- Plan: **Free**
- Create Web Service
- ✅ Done

### 4. Add DATABASE_URL (1 min)
- Environment tab
- Add variable:
  - Key: `DATABASE_URL`
  - Value: (paste database URL from step 2)
- Save
- ✅ Done

### 5. Wait for Deploy (3 min)
- Watch Logs tab
- Look for: "Migration completed successfully"
- Look for: "Server running"
- ✅ Done

### 6. Get Backend URL (1 min)
- Copy URL from top of page
- Example: `https://fastpass-backend.onrender.com`
- ✅ Done

---

## 📖 Full Guide

See `RENDER_DEPLOY.md` for detailed step-by-step instructions with screenshots descriptions.

---

## 🎯 After Render Works

Update your frontend to use the new backend URL:
1. Vercel → Settings → Environment Variables
2. Update `VITE_API_URL` to your Render URL
3. Redeploy frontend

---

## ⏱️ Total Time: ~10 minutes

Much simpler than Railway! 🎉

**Start here:** https://render.com
