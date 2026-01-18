# Prisma Quick Start - Get Running in 5 Minutes

## For Railway (Production)

### 1. Add PostgreSQL Database
```
Railway Dashboard → Your Project → + New → Database → PostgreSQL
```

### 2. Copy DATABASE_URL
```
Click PostgreSQL → Variables tab → Copy DATABASE_URL value
```

### 3. Add to Backend Service
```
Click Backend Service → Variables tab → + New Variable
Key: DATABASE_URL
Value: (paste the PostgreSQL URL)
```

### 4. Deploy
```bash
git add .
git commit -m "Add Prisma database"
git push
```

Railway will auto-deploy and run `prisma generate` via postinstall.

### 5. Run Migration (One Time)
In Railway terminal or locally with Railway DATABASE_URL:
```bash
npx prisma migrate deploy
```

**Done!** Your app now has persistent storage.

---

## For Local Testing (Quick Option)

### Use Railway Database Locally

1. Get DATABASE_URL from Railway (see step 2 above)

2. Create `.env` file:
```bash
DATABASE_URL="postgresql://user:pass@host:port/db"
```

3. Run migration:
```bash
npx prisma migrate dev --name init
```

4. Start server:
```bash
npm run server
```

**That's it!** You're using Railway's database locally.

---

## Test It Works

1. **Start server:** `npm run server`
2. **Login as student:** Use any student ID
3. **Join queue:** Select an office
4. **Restart server:** Stop and start again
5. **Check data persists:** Your queue should still be there!

---

## View Your Data

```bash
npx prisma studio
```

Opens a web UI at http://localhost:5555 to browse your database.

---

## Common Issues

**"Can't reach database"**
- Check DATABASE_URL in .env
- Ensure PostgreSQL is running

**"Table does not exist"**
- Run: `npx prisma migrate deploy`

**"Prisma Client not found"**
- Run: `npx prisma generate`

---

## What Changed?

- ✅ Data now persists across restarts
- ✅ No more in-memory storage
- ✅ Production-ready database
- ✅ Same API, same frontend - no changes needed!

The old server (`server/index.js`) still works if you need it:
```bash
npm run server:old
```
