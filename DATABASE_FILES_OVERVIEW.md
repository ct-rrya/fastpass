# Database Files Overview

## 📁 Project Structure

```
enroll/
│
├── prisma/
│   └── schema.prisma              # Database schema definition
│
├── server/
│   ├── db.js                      # Prisma client wrapper
│   ├── index-prisma.js            # NEW: Server with database ⭐
│   └── index.js                   # OLD: In-memory server (backup)
│
├── .env                           # Database connection (create this)
├── .gitignore                     # Updated to exclude .env
├── package.json                   # Updated with database scripts
│
└── Documentation/
    ├── _DATABASE_READY.md         # ⭐ START HERE - Overview
    ├── RAILWAY_DATABASE_DEPLOY.md # ⭐ Railway deployment guide
    ├── PRISMA_QUICKSTART.md       # Quick 5-min setup
    ├── DATABASE_SETUP.md          # Complete setup guide
    ├── DATABASE_MIGRATION_SUMMARY.md # Technical details
    └── setup-database.bat         # Windows setup script
```

---

## 🎯 Key Files Explained

### `prisma/schema.prisma`
**What:** Database schema definition
**Contains:** 4 table definitions (Enrollment, Queue, QueueCounter, OfficeSetting)
**Used by:** Prisma to generate client and create database tables

### `server/db.js`
**What:** Prisma client singleton
**Purpose:** Single database connection shared across app
**Exports:** `prisma` object for database queries

### `server/index-prisma.js`
**What:** New server with Prisma database
**Replaces:** In-memory storage with PostgreSQL
**Status:** Ready to use (just needs DATABASE_URL)

### `server/index.js`
**What:** Original server (in-memory)
**Status:** Backup - still works if needed
**Use:** Rollback option if database has issues

### `.env`
**What:** Environment variables (DATABASE_URL)
**Status:** Template created - you need to add real URL
**Security:** Never commit this file (in .gitignore)

### `package.json`
**What:** Project configuration
**Changes:** 
- Added Prisma dependencies
- Updated scripts to use new server
- Added database helper scripts

---

## 🔄 How It Works

### Old Flow (In-Memory)
```
Request → Express → In-Memory Object → Response
                    ↓
                (Lost on restart)
```

### New Flow (Prisma + PostgreSQL)
```
Request → Express → Prisma Client → PostgreSQL → Response
                                    ↓
                            (Persists forever)
```

---

## 📝 Scripts Available

```bash
# Start server with database
npm run server

# Start old server (backup)
npm run server:old

# Generate Prisma Client
npm run db:generate

# Create migration (development)
npm run db:migrate

# Apply migrations (production)
npm run db:deploy

# Open database GUI
npm run db:studio
```

---

## 🚀 Deployment Flow

### 1. Railway Setup
```
Railway Dashboard
  → Add PostgreSQL
  → Copy DATABASE_URL
  → Add to backend service
```

### 2. Code Deployment
```bash
git add .
git commit -m "Add database"
git push
```

### 3. Database Migration
```bash
railway run npx prisma migrate deploy
```

### 4. Verification
```
Test app → Restart server → Data still there ✅
```

---

## 📊 Database Tables

### Enrollment
```
id          String (unique)
studentId   String (unique)
offices     JSON array
currentQueue String?
createdAt   DateTime
updatedAt   DateTime
```

### Queue
```
id          String (unique)
officeId    String
studentId   String
queueNumber Int
groupType   String
groupSize   Int
sectionName String?
status      String (waiting/serving/completed)
createdAt   DateTime
updatedAt   DateTime
```

### QueueCounter
```
id        String (unique)
officeId  String (unique)
counter   Int
createdAt DateTime
updatedAt DateTime
```

### OfficeSetting
```
id                String (unique)
officeId          String (unique)
processingMode    String
avgProcessingTime Int
createdAt         DateTime
updatedAt         DateTime
```

---

## 🔍 Code Comparison

### Before (In-Memory)
```javascript
// Get enrollment
const enrollment = db.enrollments[studentId];

// Add to queue
db.queues.push({
  officeId,
  studentId,
  queueNumber,
  status: 'waiting'
});
```

### After (Prisma)
```javascript
// Get enrollment
const enrollment = await prisma.enrollment.findUnique({
  where: { studentId }
});

// Add to queue
await prisma.queue.create({
  data: {
    officeId,
    studentId,
    queueNumber,
    status: 'waiting'
  }
});
```

---

## ✅ What's Ready

- [x] Prisma installed and configured
- [x] Database schema designed
- [x] Server code migrated
- [x] Scripts added to package.json
- [x] Documentation complete
- [x] Backup plan in place

## ⏳ What You Need to Do

- [ ] Add PostgreSQL to Railway
- [ ] Set DATABASE_URL variable
- [ ] Push code to Railway
- [ ] Run database migration
- [ ] Test deployment

---

## 📚 Documentation Map

**Quick Start:**
1. Read `_DATABASE_READY.md` (this gives you the overview)
2. Follow `RAILWAY_DATABASE_DEPLOY.md` (step-by-step deployment)

**Reference:**
- `PRISMA_QUICKSTART.md` - Fast setup commands
- `DATABASE_SETUP.md` - All setup options
- `DATABASE_MIGRATION_SUMMARY.md` - Technical details

**Tools:**
- `setup-database.bat` - Windows setup script

---

## 🎯 Success Criteria

You'll know it worked when:
1. Server starts without errors ✅
2. Students can join queues ✅
3. Office can manage queues ✅
4. **Server restarts → Data still there** ✅ ⭐

---

## 🆘 Troubleshooting Quick Reference

| Problem | Solution |
|---------|----------|
| Can't reach database | Check DATABASE_URL is set |
| Table does not exist | Run `npx prisma migrate deploy` |
| Prisma Client not found | Run `npx prisma generate` |
| Data still disappears | Check using new server (index-prisma.js) |
| Server won't start | Check Railway logs for errors |

---

## 🎉 You're Ready!

All preparation is complete. Follow the deployment guide and you'll have a production-ready database in 10-15 minutes.

**Next file to read:** `RAILWAY_DATABASE_DEPLOY.md`

Good luck! 🚀
