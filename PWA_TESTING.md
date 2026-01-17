# PWA Testing Guide

## Why PWA Doesn't Work on IP Address in Development

**The Issue:**
- PWAs require **HTTPS** for security
- Exception: `localhost` works without HTTPS
- Your IP address (http://192.168.100.47:3000) is **NOT localhost**
- Therefore, service worker won't register and install won't work

## ✅ Solutions

### Option 1: Test on Localhost (Laptop Only)

**On your laptop:**
1. Open http://localhost:3000 (NOT the IP address)
2. The PWA features will work
3. Install button should appear
4. Service worker will register

**To verify:**
1. Press F12 (DevTools)
2. Go to **Application** tab
3. Click **Service Workers** - should show registered
4. Click **Manifest** - should show app details

### Option 2: Use ngrok (Recommended for Phone Testing)

**Install ngrok:**
```bash
# Download from https://ngrok.com/download
# Or use chocolatey:
choco install ngrok
```

**Run ngrok:**
```bash
ngrok http 3000
```

**You'll get an HTTPS URL like:**
```
https://abc123.ngrok.io
```

**Now:**
1. Open that URL on your phone
2. PWA will work!
3. Install option will appear
4. Offline mode will work

### Option 3: Deploy to Production

Deploy to any hosting with HTTPS:
- **Vercel** - Free, automatic HTTPS
- **Netlify** - Free, automatic HTTPS
- **Railway** - Free tier, automatic HTTPS

Then test PWA on the production URL.

### Option 4: Local HTTPS (Advanced)

**Install mkcert:**
```bash
choco install mkcert
mkcert -install
mkcert localhost 192.168.100.47
```

**Update vite.config.js:**
```javascript
import fs from 'fs';

export default defineConfig({
  server: {
    https: {
      key: fs.readFileSync('./localhost+1-key.pem'),
      cert: fs.readFileSync('./localhost+1.pem')
    },
    host: '0.0.0.0',
    port: 3000
  }
});
```

Now access via: `https://192.168.100.47:3000`

## 📱 Current Status

### What Works Now:
✅ Mobile-responsive design  
✅ Offline data caching (localStorage)  
✅ Real-time updates (WebSocket)  
✅ Touch-optimized interface  
✅ PWA manifest configured  
✅ Service worker code ready  

### What Needs HTTPS:
❌ Service worker registration (on IP)  
❌ Install prompt (on IP)  
❌ Offline asset caching (on IP)  
❌ Background sync (on IP)  

### Workarounds for Demo:
1. **Show on localhost** - Full PWA works
2. **Use ngrok** - Get HTTPS for phone testing
3. **Deploy to Vercel** - Production PWA testing
4. **Explain in presentation** - "PWA requires HTTPS in production"

## 🎯 For Your Capstone Presentation

### What to Say:
"EnrollFlow is built as a Progressive Web App. In development, PWA features work on localhost. For production deployment with HTTPS, users can install it on their home screen and use it offline like a native app."

### What to Demo:
1. **On laptop (localhost):**
   - Show service worker in DevTools
   - Show manifest
   - Show offline mode working
   - Show install option

2. **On phone (via ngrok or deployed):**
   - Show "Add to Home Screen"
   - Install the app
   - Show it on home screen
   - Open as standalone app
   - Test offline mode

## Quick ngrok Setup

```bash
# 1. Download ngrok
# Go to https://ngrok.com/download

# 2. Run your app
npm run dev

# 3. In another terminal, run ngrok
ngrok http 3000

# 4. Copy the HTTPS URL (e.g., https://abc123.ngrok.io)

# 5. Open on your phone
# PWA features will work!
```

## Verification Checklist

On localhost or HTTPS URL:

- [ ] Service worker registered (DevTools → Application → Service Workers)
- [ ] Manifest loaded (DevTools → Application → Manifest)
- [ ] Install button appears
- [ ] Can install to home screen
- [ ] Works offline after first visit
- [ ] Caches assets properly
- [ ] Updates automatically

---

**Bottom line:** For full PWA testing on your phone, use ngrok or deploy to production. For laptop testing, use localhost.
