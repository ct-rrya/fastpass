# 🚀 Deploy to Render - Step by Step

## Why Render?
- More reliable than Railway
- Prisma works out of the box
- Free PostgreSQL included
- Better documentation
- Auto-deploys from GitHub

---

## 📋 Step-by-Step Deployment

### Step 1: Create Render Account (2 minutes)

1. Go to: https://render.com
2. Click **"Get Started"** or **"Sign Up"**
3. Sign up with **GitHub** (easiest - auto-connects repos)
4. Verify your email if needed

---

### Step 2: Create PostgreSQL Database (3 minutes)

1. From Render Dashboard, click **"New +"** button
2. Select **"PostgreSQL"**
3. Fill in:
   - **Name:** `fastpass-db` (or any name)
   - **Database:** `fastpass` (default is fine)
   - **User:** `fastpass` (default is fine)
   - **Region:** Choose closest to you (e.g., Oregon, Singapore)
   - **Plan:** **Free** (select this!)
4. Click **"Create Database"**
5. Wait ~30 seconds for it to provision

**Important:** Keep this tab open - you'll need the connection info!

---

### Step 3: Get Database Connection String (1 minute)

1. Click on your new database
2. Scroll down to **"Connections"** section
3. Find **"Internal Database URL"** 
4. Click **"Copy"** button
5. It looks like: `postgresql://fastpass:password@dpg-xxx.oregon-postgres.render.com/fastpass`

**Save this URL** - you'll need it in Step 5!

---

### Step 4: Create Web Service (3 minutes)

1. Go back to Render Dashboard
2. Click **"New +"** button
3. Select **"Web Service"**
4. Click **"Connect a repository"**
5. Find and select your **fastpass** repository
6. Click **"Connect"**

**Configure the service:**
- **Name:** `fastpass-backend` (or any name)
- **Region:** Same as database (e.g., Oregon)
- **Branch:** `main`
- **Root Directory:** Leave empty
- **Runtime:** **Node**
- **Build Command:** `npm install`
- **Start Command:** `npm start`
- **Plan:** **Free**

Click **"Create Web Service"** (don't deploy yet!)

---

### Step 5: Add Environment Variables (2 minutes)

Before the first deploy completes:

1. On your web service page, click **"Environment"** tab (left sidebar)
2. Click **"Add Environment Variable"**
3. Add these variables:

**Variable 1:**
- **Key:** `DATABASE_URL`
- **Value:** (paste the Internal Database URL from Step 3)

**Variable 2:**
- **Key:** `NODE_ENV`
- **Value:** `production`

4. Click **"Save Changes"**

Render will automatically redeploy with the new variables.

---

### Step 6: Wait for Deployment (3-5 minutes)

Watch the deployment logs:
1. Click **"Logs"** tab
2. You should see:
   - `npm install` installing packages
   - `npx prisma generate` (via postinstall)
   - "Running database migration..."
   - "Migration completed successfully"
   - "Server running on http://localhost:10000"
   - "Database: PostgreSQL with Prisma"

**If you see these messages: ✅ SUCCESS!**

---

### Step 7: Get Your Backend URL (1 minute)

1. At the top of your web service page, you'll see a URL like:
   ```
   https://fastpass-backend.onrender.com
   ```
2. **Copy this URL** - you'll need it for your frontend!

---

### Step 8: Update Frontend to Use Render (2 minutes)

You need to update your Vercel frontend to point to the new Render backend.

**Option A: Update via Vercel Dashboard**
1. Go to Vercel dashboard
2. Click your frontend project
3. Go to **Settings** → **Environment Variables**
4. Find or add `VITE_API_URL`
5. Set value to: `https://fastpass-backend.onrender.com`
6. Redeploy frontend

**Option B: Update code and push**
(I can help you with this if needed)

---

### Step 9: Test Your App! (2 minutes)

1. Open your frontend: https://enroll-six.vercel.app
2. Login as student "test999"
3. Join a queue
4. Go to Render → Your web service → **Manual Deploy** → **Deploy latest commit**
5. Wait for redeploy (~2 min)
6. Refresh your app
7. Login as "test999" again
8. **Your queue should still be there!** 🎉

---

## ✅ Success Checklist

- [ ] Render account created
- [ ] PostgreSQL database created
- [ ] Web service created and connected to GitHub
- [ ] DATABASE_URL environment variable set
- [ ] Deployment successful (check logs)
- [ ] Backend URL obtained
- [ ] Frontend updated to use new backend
- [ ] Data persists after redeploy

---

## 🐛 Troubleshooting

### Build fails with "Cannot find module '@prisma/client'"
- Check that `@prisma/client` is in `dependencies` (not devDependencies)
- Check logs show `npx prisma generate` ran

### Migration fails
- Check DATABASE_URL is set correctly
- Check database is running (Render dashboard)
- Check logs for specific error

### Server won't start
- Check logs for errors
- Verify Start Command is `npm start`
- Check PORT environment variable (Render sets this automatically)

### Frontend can't connect
- Check backend URL is correct
- Check CORS is enabled in server
- Check backend is running (green status in Render)

---

## 🎯 Render vs Railway

**Advantages:**
- ✅ More reliable deployments
- ✅ Better free tier (750 hours/month)
- ✅ Clearer documentation
- ✅ Prisma works immediately
- ✅ Better logging

**Disadvantages:**
- ⚠️ Sleeps after 15 min inactivity (free tier)
- ⚠️ Cold start takes ~30 seconds

---

## 📚 Useful Render Commands

**View logs:**
- Render Dashboard → Your service → Logs tab

**Manual deploy:**
- Render Dashboard → Your service → Manual Deploy → Deploy latest commit

**Restart service:**
- Render Dashboard → Your service → Manual Deploy → Clear build cache & deploy

**Database access:**
- Render Dashboard → Database → Connect (shows psql command)

---

## 🔄 Auto-Deploy

Render automatically deploys when you push to GitHub (just like Railway).

To disable auto-deploy:
- Service Settings → Auto-Deploy → Toggle off

---

## 💰 Free Tier Limits

- **Web Service:** 750 hours/month (enough for 1 service running 24/7)
- **PostgreSQL:** 1GB storage, 97 connection limit
- **Bandwidth:** 100GB/month
- **Sleeps after:** 15 minutes of inactivity
- **Cold start:** ~30 seconds

**For your capstone:** This is more than enough!

---

## 🎉 You're Done!

Your FastPass app is now running on Render with persistent PostgreSQL database!

**Next steps:**
- Test thoroughly
- Update documentation with new URLs
- Consider adding a health check endpoint
- Monitor usage in Render dashboard

---

**Need help?** Check Render docs: https://render.com/docs

Good luck! 🚀
