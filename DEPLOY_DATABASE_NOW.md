# 🚀 Deploy Database NOW - Final Steps

## ✅ What's Ready
- [x] Prisma installed
- [x] Database schema created
- [x] Migration files created
- [x] Server code updated
- [x] Code committed to git

## 🎯 Final Steps (5 minutes)

### Step 1: Add DATABASE_URL to Railway Backend

**CRITICAL: Do this BEFORE pushing code!**

1. Go to Railway: https://railway.app
2. Click your **backend service** (fastpass-production)
3. Go to **"Variables"** tab
4. Click **"+ New Variable"**
5. Add:
   - **Variable:** `DATABASE_URL`
   - **Value:** Get from PostgreSQL service Variables tab
     - Click PostgreSQL service → Variables → Copy DATABASE_URL
     - Should look like: `postgresql://postgres:...@monorail.proxy.rlwy.net:PORT/railway`
6. Click **"Add"**

✅ Railway will restart your backend

---

### Step 2: Push Code

```bash
git push
```

Railway will automatically:
- Install Prisma packages
- Generate Prisma Client (via postinstall)
- Run migration (via start script)
- Start server with database

---

### Step 3: Monitor Deployment

Watch Railway logs:
1. Railway → Backend service → Deployments tab
2. Click latest deployment
3. Watch for:
   - ✅ "Prisma Client generated"
   - ✅ "Migration applied successfully"
   - ✅ "Server running on port..."

---

### Step 4: Test It Works

1. **Open app:** https://enroll-six.vercel.app

2. **Test as Student:**
   - Login with student ID (e.g., "999")
   - Join Department Office queue
   - Note your queue number

3. **Test as Office:**
   - New tab → Login as "department"
   - See student in queue
   - Call next → Mark complete

4. **Test Persistence (CRITICAL):**
   - Railway → Backend service → Settings → Restart
   - Wait 30 seconds
   - Refresh app → Login as student "999"
   - **Your enrollment progress should still be there!** ✅

---

## 🐛 If Something Goes Wrong

### Error: "Can't reach database"
- Check DATABASE_URL is set in backend service variables
- Verify it's the public URL (contains `rlwy.net`)

### Error: "Table does not exist"
- Check Railway logs - migration should run automatically
- If not, manually run: `railway run npx prisma migrate deploy`

### Server won't start
- Check Railway logs for errors
- Verify Prisma Client was generated
- Check DATABASE_URL format

### Rollback if needed
```bash
# Revert to old server
git revert HEAD
git push
```

---

## ✅ Success Checklist

After deployment:
- [ ] Server starts without errors
- [ ] Student can login
- [ ] Student can join queue
- [ ] Office can see queue
- [ ] Office can call next
- [ ] Office can mark complete
- [ ] **Data persists after restart** ⭐

---

## 🎉 You're Ready!

**Current status:** Code is committed, ready to push

**Next command:** 
1. Add DATABASE_URL to Railway backend (Step 1 above)
2. Then run: `git push`

Good luck! 🚀
