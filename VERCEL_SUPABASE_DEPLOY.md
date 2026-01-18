# 🚀 Deploy Backend to Vercel + Supabase

## Why This Stack?
- ✅ Vercel: Serverless, fast, reliable (you already use it for frontend)
- ✅ Supabase: Best free PostgreSQL (500MB, unlimited requests)
- ✅ Both have excellent free tiers
- ✅ Modern, production-ready stack
- ✅ No cold starts like Render/Railway

---

## 📋 Part 1: Set Up Supabase Database (5 minutes)

### Step 1: Create Supabase Account

1. Go to: https://supabase.com
2. Click **"Start your project"**
3. Sign in with **GitHub** (easiest)
4. Verify email if needed

### Step 2: Create New Project

1. Click **"New Project"**
2. Choose your organization (or create one)
3. Fill in:
   - **Name:** `fastpass` (or any name)
   - **Database Password:** Create a strong password (save this!)
   - **Region:** Choose closest to you (e.g., Southeast Asia, US West)
   - **Pricing Plan:** **Free** (already selected)
4. Click **"Create new project"**
5. Wait ~2 minutes for database to provision

### Step 3: Get Database Connection String

1. In your project, click **"Settings"** (gear icon, bottom left)
2. Click **"Database"** in the left menu
3. Scroll to **"Connection string"** section
4. Select **"URI"** tab
5. Copy the connection string - looks like:
   ```
   postgresql://postgres:[YOUR-PASSWORD]@db.xxx.supabase.co:5432/postgres
   ```
6. **Replace `[YOUR-PASSWORD]`** with the password you created in Step 2
7. **Save this URL** - you'll need it!

---

## 📋 Part 2: Deploy Backend to Vercel (10 minutes)

### Step 4: Prepare Backend for Vercel

Vercel uses serverless functions, so we need to adapt the Express server.

**I'll create the necessary files for you - just wait for the next steps!**

### Step 5: Create Vercel Project for Backend

1. Go to: https://vercel.com/dashboard
2. Click **"Add New..."** → **"Project"**
3. Import your **fastpass** repository (same repo as frontend)
4. Configure:
   - **Project Name:** `fastpass-backend` (or any name)
   - **Framework Preset:** Other
   - **Root Directory:** `./` (leave as is)
   - **Build Command:** Leave empty or `npm install`
   - **Output Directory:** Leave empty
5. **Don't deploy yet!** Click **"Environment Variables"** first

### Step 6: Add Environment Variables

Add these environment variables:

**Variable 1:**
- **Key:** `DATABASE_URL`
- **Value:** (paste Supabase connection string from Step 3)

**Variable 2:**
- **Key:** `NODE_ENV`
- **Value:** `production`

Click **"Deploy"**

### Step 7: Get Backend URL

After deployment:
1. You'll see a URL like: `https://fastpass-backend.vercel.app`
2. **Copy this URL**

---

## 📋 Part 3: Update Frontend (2 minutes)

### Step 8: Update Frontend Environment Variable

1. Go to Vercel dashboard
2. Click your **frontend project** (enroll-six)
3. Go to **Settings** → **Environment Variables**
4. Find or add `VITE_API_URL`
5. Update value to: `https://fastpass-backend.vercel.app`
6. Click **"Save"**
7. Go to **Deployments** tab
8. Click **"..."** on latest deployment → **"Redeploy"**

---

## 📋 Part 4: Run Database Migration (2 minutes)

### Step 9: Run Migration Locally

Since Vercel is serverless, we'll run the migration from your local machine:

```bash
# Set DATABASE_URL temporarily
$env:DATABASE_URL="postgresql://postgres:password@db.xxx.supabase.co:5432/postgres"

# Run migration
npx prisma migrate deploy

# Verify
npx prisma studio
```

You should see your tables created in Prisma Studio!

---

## ✅ Testing (2 minutes)

### Step 10: Test Your App

1. Open: https://enroll-six.vercel.app
2. Login as student "test123"
3. Join a queue
4. Open new tab → Login as office "department"
5. See student in queue
6. Call next → Mark complete
7. **Refresh page** → Data should persist!

---

## 🎉 Success!

Your app is now running on:
- **Frontend:** Vercel (enroll-six.vercel.app)
- **Backend:** Vercel (fastpass-backend.vercel.app)
- **Database:** Supabase (PostgreSQL)

All with generous free tiers! 🚀

---

## 🐛 Troubleshooting

### Backend deployment fails
- Check Vercel build logs
- Verify `vercel.json` is configured correctly
- Check environment variables are set

### Can't connect to database
- Verify DATABASE_URL is correct
- Check Supabase project is running
- Verify password in connection string

### Frontend can't reach backend
- Check VITE_API_URL is set correctly
- Verify backend is deployed and running
- Check CORS settings in server

### Migration fails
- Check DATABASE_URL format
- Verify Supabase database is accessible
- Check Prisma schema is valid

---

## 📊 Free Tier Limits

**Vercel:**
- Unlimited deployments
- 100GB bandwidth/month
- Serverless functions: 100GB-hours

**Supabase:**
- 500MB database storage
- Unlimited API requests
- 2GB file storage
- 50MB file uploads

**For your capstone:** More than enough! 🎉

---

## 🔄 Auto-Deploy

Both Vercel projects auto-deploy when you push to GitHub.

To deploy manually:
- Vercel Dashboard → Project → Deployments → Redeploy

---

## 📚 Next Steps

1. Monitor usage in Vercel dashboard
2. Check database in Supabase dashboard
3. Add authentication (next priority)
4. Set up monitoring/alerts

---

**Need help?**
- Vercel docs: https://vercel.com/docs
- Supabase docs: https://supabase.com/docs

Good luck! 🚀
