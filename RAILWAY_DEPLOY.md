# Railway Backend Deployment

## Quick Deploy Steps

The backend has been updated to use in-memory storage instead of file system (Railway doesn't persist files between deployments).

### Option 1: Deploy via Railway CLI

```bash
# Install Railway CLI (if not already installed)
npm install -g @railway/cli

# Login to Railway
railway login

# Link to your project
railway link

# Deploy
railway up
```

### Option 2: Deploy via Git Push

If you connected Railway to your GitHub repository:

1. Commit the changes:
```bash
git add server/index.js
git commit -m "Fix: Use in-memory storage for Railway"
git push
```

2. Railway will automatically redeploy

### Option 3: Manual Redeploy from Railway Dashboard

1. Go to https://railway.app/dashboard
2. Select your "fastpass" project
3. Click on the service
4. Click "Deploy" → "Redeploy"

## What Changed

- Removed file system operations (`fs.readFileSync`, `fs.writeFileSync`)
- Using in-memory database that resets on restart
- This is temporary - for production, you should use a real database (PostgreSQL, MongoDB, etc.)

## Note

The in-memory database means data will be lost when Railway restarts the server. For a permanent solution, you'll need to add a real database service to Railway.
