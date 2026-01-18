# Railway Database Deployment Checklist

## 🎯 Goal
Add persistent PostgreSQL database to your Railway deployment so data survives server restarts.

---

## ✅ Pre-Deployment Checklist

Before you start, make sure:
- [ ] You have access to Railway dashboard
- [ ] Your backend is already deployed on Railway
- [ ] You have git installed and configured
- [ ] You're in the project directory

---

## 📝 Step-by-Step Deployment

### Step 1: Add PostgreSQL to Railway (2 minutes)

1. Go to Railway: https://railway.app
2. Open your FastPass project
3. Click **"+ New"** button
4. Select **"Database"**
5. Choose **"Add PostgreSQL"**
6. Wait for it to provision (30 seconds)

✅ **Verify:** You should see a new "PostgreSQL" service in your project

---

### Step 2: Get Database Connection String (1 minute)

1. Click on the **PostgreSQL** service
2. Go to **"Variables"** tab
3. Find **DATABASE_URL** variable
4. Click the **copy icon** to copy the full URL

It looks like:
```
postgresql://postgres:password@hostname.railway.app:5432/railway
```

✅ **Verify:** URL starts with `postgresql://` and contains `railway.app`

---

### Step 3: Add DATABASE_URL to Backend (1 minute)

1. Click on your **backend service** (the one running your server)
2. Go to **"Variables"** tab
3. Click **"+ New Variable"** button
4. Enter:
   - **Variable Name:** `DATABASE_URL`
   - **Value:** (paste the URL from Step 2)
5. Click **"Add"**

⚠️ **Important:** Railway will automatically restart your service after adding the variable

✅ **Verify:** DATABASE_URL appears in your backend service variables

---

### Step 4: Push Updated Code (2 minutes)

```bash
# Make sure all files are saved
git status

# Add all new files
git add .

# Commit changes
git commit -m "Add Prisma database support"

# Push to Railway
git push
```

Railway will automatically:
- Detect the changes
- Run `npm install` (installs Prisma)
- Run `npx prisma generate` (via postinstall script)
- Restart your server

✅ **Verify:** Check Railway logs - should see "Prisma Client generated"

---

### Step 5: Run Database Migration (2 minutes)

This creates the tables in your database.

**Option A: Using Railway CLI (Recommended)**

```bash
# Install Railway CLI if you haven't
npm i -g @railway/cli

# Login to Railway
railway login

# Link to your project
railway link

# Run migration
railway run npx prisma migrate deploy
```

**Option B: Using Local Terminal with Railway Database**

```bash
# Copy DATABASE_URL from Railway (Step 2)
# Set it temporarily in your terminal

# Windows CMD:
set DATABASE_URL=postgresql://...

# Windows PowerShell:
$env:DATABASE_URL="postgresql://..."

# Mac/Linux:
export DATABASE_URL="postgresql://..."

# Run migration
npx prisma migrate deploy
```

**Option C: Using Railway Web Terminal**

1. Go to Railway dashboard
2. Click your backend service
3. Click **"Settings"** tab
4. Scroll to **"Service Settings"**
5. Click **"Open Terminal"**
6. Run: `npx prisma migrate deploy`

✅ **Verify:** Should see "Migration applied successfully"

---

### Step 6: Test Your Deployment (3 minutes)

1. **Open your app:** https://enroll-six.vercel.app

2. **Test as Student:**
   - Login with any student ID (e.g., "123")
   - Join a queue (e.g., Department Office)
   - Note your queue number

3. **Test as Office:**
   - Open new tab/window
   - Login as office (e.g., "department")
   - You should see the student in queue
   - Click "Call Next"
   - Click "Mark Complete"

4. **Test Persistence (CRITICAL):**
   - Go to Railway dashboard
   - Click your backend service
   - Click **"Settings"** → **"Restart"**
   - Wait for restart (30 seconds)
   - Refresh your app
   - Login as student again
   - **Your enrollment progress should still be there!**

✅ **Verify:** Data persists after server restart

---

## 🎉 Success Indicators

You'll know it worked when:
- ✅ Server starts without database errors
- ✅ Students can join queues
- ✅ Office can manage queues
- ✅ **Data persists after Railway restart**
- ✅ No "in-memory storage" warnings in logs

---

## 🐛 Troubleshooting

### Error: "Can't reach database server"

**Cause:** DATABASE_URL not set or incorrect

**Fix:**
1. Check DATABASE_URL is in backend service variables
2. Verify it starts with `postgresql://`
3. Copy it again from PostgreSQL service

---

### Error: "Table does not exist"

**Cause:** Migration not run

**Fix:**
```bash
railway run npx prisma migrate deploy
```

---

### Error: "Prisma Client not generated"

**Cause:** postinstall script didn't run

**Fix:**
1. Check package.json has: `"postinstall": "prisma generate"`
2. Redeploy: `git commit --allow-empty -m "Trigger rebuild" && git push`

---

### Server keeps restarting

**Cause:** Database connection failing

**Fix:**
1. Check Railway logs for error details
2. Verify DATABASE_URL is correct
3. Ensure PostgreSQL service is running
4. Check if migration was applied

---

### Data still disappears after restart

**Cause:** Still using old server (in-memory)

**Fix:**
1. Check package.json: `"start": "node server/index-prisma.js"`
2. Verify server/index-prisma.js exists
3. Redeploy code

---

## 📊 Verify Database Contents

### Using Prisma Studio (Local)

```bash
# Set DATABASE_URL to Railway database
$env:DATABASE_URL="postgresql://..."

# Open Prisma Studio
npx prisma studio
```

Opens http://localhost:5555 - browse your Railway database!

### Using Railway PostgreSQL Plugin

1. Railway dashboard → PostgreSQL service
2. Click "Data" tab
3. Browse tables directly

---

## 🔄 Rollback Plan

If something goes wrong:

1. **Revert to old server:**
   ```json
   // package.json
   "start": "node server/index.js"
   ```

2. **Push changes:**
   ```bash
   git add package.json
   git commit -m "Rollback to in-memory storage"
   git push
   ```

3. **Remove DATABASE_URL:**
   - Railway → Backend service → Variables
   - Delete DATABASE_URL variable

---

## 📈 Post-Deployment

### Monitor Your Database

1. **Check Railway metrics:**
   - PostgreSQL service → Metrics tab
   - Watch connections, queries, storage

2. **Check logs:**
   - Backend service → Deployments tab
   - Look for database errors

3. **Set up backups:**
   - Railway Pro plan includes automated backups
   - Or use `pg_dump` for manual backups

### Performance Tips

1. **Add indexes** (already done in schema)
2. **Monitor query performance** in Railway logs
3. **Use connection pooling** (Prisma handles this)

---

## ✅ Final Checklist

After deployment, verify:
- [ ] PostgreSQL service running in Railway
- [ ] DATABASE_URL set in backend service
- [ ] Code deployed successfully
- [ ] Migration applied (tables created)
- [ ] Server starts without errors
- [ ] Students can login and join queues
- [ ] Office can manage queues
- [ ] **Data persists after server restart** ⭐
- [ ] WebSocket notifications work
- [ ] No errors in Railway logs

---

## 🎯 You're Done!

Your FastPass app now has:
- ✅ Persistent PostgreSQL database
- ✅ Production-ready storage
- ✅ Data survives server restarts
- ✅ Scalable for multiple users
- ✅ Ready for real enrollment periods

**Next steps:**
- Add authentication (see PROGRESS_LOG.txt)
- Monitor usage during enrollment
- Collect user feedback
- Plan additional features

---

## 📚 Resources

- Railway Docs: https://docs.railway.app
- Prisma Docs: https://www.prisma.io/docs
- PostgreSQL Docs: https://www.postgresql.org/docs
- Your setup guide: `DATABASE_SETUP.md`
- Quick start: `PRISMA_QUICKSTART.md`

---

**Estimated Total Time:** 10-15 minutes

Good luck! 🚀
