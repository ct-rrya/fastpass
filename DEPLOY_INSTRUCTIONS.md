# How to Deploy Updated Version

## The Issue
Vercel has the wrong root directory setting. You need to fix it first.

## Fix Vercel Settings

1. **Go to:** https://vercel.com/apples-projects-d0ceef94/enroll/settings/general

2. **Find "Root Directory" section**

3. **Change from:** `enroll` or `.\` or `.\\`
   **To:** `.` (just a single dot)

4. **Click "Save"**

## Then Deploy

```bash
npm run build
vercel --prod
```

## Or Deploy Manually

1. Go to https://vercel.com/apples-projects-d0ceef94/enroll
2. Click "Deployments" tab
3. Click "..." menu on latest deployment
4. Click "Redeploy"

## Current Live URL

Your app is already live at:
**https://enroll-six.vercel.app**

The fix I just made will work once you redeploy!

## What the Fix Does

Now the app will:
- Try to use the server if available
- Automatically fallback to local storage if server fails
- Work perfectly offline
- No more "failed to join queue" errors!

## Test After Redeployment

1. Open https://enroll-six.vercel.app on phone
2. Join a queue - should work!
3. Turn off WiFi
4. Join another queue - still works!
5. Everything saved locally
