# Database Setup Guide - Prisma + PostgreSQL

## Overview
Your FastPass app now uses **Prisma ORM** with **PostgreSQL** for persistent data storage.

---

## 🚀 Quick Start (Railway Deployment)

### Step 1: Add PostgreSQL to Railway

1. Go to your Railway project: https://railway.app/project/[your-project-id]
2. Click **"+ New"** → **"Database"** → **"Add PostgreSQL"**
3. Railway will create a PostgreSQL database and provide connection details

### Step 2: Get Database URL

1. Click on the **PostgreSQL** service in Railway
2. Go to **"Variables"** tab
3. Copy the **DATABASE_URL** value (looks like: `postgresql://user:pass@host:port/db`)

### Step 3: Add DATABASE_URL to Backend Service

1. Click on your **backend service** (fastpass-production)
2. Go to **"Variables"** tab
3. Click **"+ New Variable"**
4. Add:
   - **Key:** `DATABASE_URL`
   - **Value:** (paste the PostgreSQL URL from Step 2)
5. Click **"Add"**

### Step 4: Deploy Updated Code

```bash
# Update package.json to use new server file
npm run build

# Push to Railway (it will auto-deploy)
git add .
git commit -m "Add Prisma database"
git push
```

### Step 5: Run Database Migration

After deployment, run this in Railway's terminal or locally:

```bash
npx prisma migrate deploy
```

**Done!** Your data will now persist across server restarts.

---

## 💻 Local Development Setup

### Option 1: Use Railway PostgreSQL (Recommended)

1. Get your Railway DATABASE_URL (see Step 2 above)
2. Update `.env` file:
   ```
   DATABASE_URL="postgresql://user:pass@host:port/db"
   ```
3. Run migrations:
   ```bash
   npx prisma migrate dev --name init
   ```
4. Start server:
   ```bash
   npm run server
   ```

### Option 2: Install PostgreSQL Locally

1. **Install PostgreSQL:**
   - Windows: Download from https://www.postgresql.org/download/windows/
   - Mac: `brew install postgresql`
   - Linux: `sudo apt install postgresql`

2. **Create Database:**
   ```bash
   # Start PostgreSQL
   # Windows: It starts automatically after install
   # Mac: brew services start postgresql
   # Linux: sudo service postgresql start
   
   # Create database
   createdb enrollflow
   ```

3. **Update .env:**
   ```
   DATABASE_URL="postgresql://postgres:password@localhost:5432/enrollflow"
   ```
   (Replace `password` with your PostgreSQL password)

4. **Run Migrations:**
   ```bash
   npx prisma migrate dev --name init
   ```

5. **Start Server:**
   ```bash
   npm run server
   ```

---

## 📝 Database Schema

Your database has 4 tables:

### 1. **Enrollment** - Student progress tracking
- `studentId` - Unique student identifier
- `offices` - JSON array of office statuses
- `currentQueue` - Current queue info

### 2. **Queue** - Active queue entries
- `officeId` - Which office (department, clinic, etc.)
- `studentId` - Student in queue
- `queueNumber` - Queue position number
- `status` - waiting, serving, or completed
- `groupType` - individual, group, or section
- `sectionName` - For section processing

### 3. **QueueCounter** - Queue number generators
- `officeId` - Office identifier
- `counter` - Current queue number

### 4. **OfficeSetting** - Office configurations
- `officeId` - Office identifier
- `processingMode` - individual, group, or section
- `avgProcessingTime` - Minutes per student

---

## 🔧 Useful Commands

```bash
# Generate Prisma Client (after schema changes)
npx prisma generate

# Create and apply migration
npx prisma migrate dev --name description_here

# Apply migrations in production
npx prisma migrate deploy

# Open Prisma Studio (database GUI)
npx prisma studio

# Reset database (WARNING: deletes all data)
npx prisma migrate reset

# View database schema
npx prisma db pull
```

---

## 🔄 Switching from Old Server to New Server

### Update package.json:

```json
{
  "scripts": {
    "server": "node server/index-prisma.js",
    "start": "node server/index-prisma.js",
    "server:old": "node server/index.js"
  }
}
```

### Or rename files:

```bash
# Backup old server
mv server/index.js server/index-old.js

# Use new server
mv server/index-prisma.js server/index.js
```

---

## 🐛 Troubleshooting

### Error: "Can't reach database server"
- Check DATABASE_URL is correct
- Ensure PostgreSQL is running
- Check firewall/network settings

### Error: "Table does not exist"
- Run: `npx prisma migrate deploy`
- Or: `npx prisma migrate dev`

### Error: "Prisma Client not generated"
- Run: `npx prisma generate`

### Railway deployment fails
- Check DATABASE_URL is set in Railway variables
- Ensure PostgreSQL addon is added to project
- Check Railway logs: `railway logs`

---

## 📊 Viewing Your Data

### Option 1: Prisma Studio (Recommended)
```bash
npx prisma studio
```
Opens a web UI at http://localhost:5555

### Option 2: PostgreSQL CLI
```bash
# Connect to database
psql $DATABASE_URL

# List tables
\dt

# Query data
SELECT * FROM "Enrollment";
SELECT * FROM "Queue" WHERE status = 'waiting';
```

---

## 🚨 Important Notes

1. **Never commit .env file** - It contains sensitive database credentials
2. **Backup before migrations** - Migrations can't be undone easily
3. **Test locally first** - Always test migrations locally before production
4. **Railway auto-restarts** - Server restarts after variable changes

---

## ✅ Verification Checklist

After setup, verify everything works:

- [ ] Server starts without errors
- [ ] Student can login and see enrollment status
- [ ] Student can join queue
- [ ] Office can call next student
- [ ] Office can mark student complete
- [ ] Data persists after server restart
- [ ] WebSocket notifications still work

---

## 📚 Next Steps

1. **Deploy to Railway** - Follow Quick Start above
2. **Test thoroughly** - Verify all features work
3. **Monitor logs** - Check for database errors
4. **Add authentication** - Secure your endpoints
5. **Backup strategy** - Set up automated backups

---

## 🆘 Need Help?

- Prisma Docs: https://www.prisma.io/docs
- Railway Docs: https://docs.railway.app
- PostgreSQL Docs: https://www.postgresql.org/docs

Good luck! 🚀
