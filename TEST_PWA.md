# How to Test PWA Install

## Quick Test in Chrome

1. Open http://localhost:3000
2. Press F12 (DevTools)
3. Go to **Application** tab
4. Click **Manifest** in left sidebar
5. Look for blue **"Install"** button at top

## If Install Button Doesn't Appear

PWA install requires these conditions:
- ✅ Valid manifest.json
- ✅ Service worker registered
- ✅ Served over HTTPS (or localhost)
- ✅ Has icons
- ✅ User hasn't dismissed install prompt before

## Force Install Prompt

In DevTools Console, run:
```javascript
window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  e.prompt();
});
```

Then refresh the page.

## Alternative: Manual Install

**Chrome:**
1. Click 3-dot menu (⋮)
2. More Tools → Create Shortcut
3. Check "Open as window"
4. Click Create

**Edge:**
1. Click 3-dot menu (...)
2. Apps → Install this site as an app

## Check PWA Status

In DevTools Console, run:
```javascript
// Check if service worker is registered
navigator.serviceWorker.getRegistrations().then(regs => {
  console.log('Service Workers:', regs.length);
});

// Check manifest
fetch('/manifest.webmanifest')
  .then(r => r.json())
  .then(m => console.log('Manifest:', m));
```

## For Presentation

If install doesn't work, you can:
1. Show the manifest in DevTools
2. Show service worker registered
3. Explain: "In production with HTTPS, users get an install prompt"
4. Demo offline mode instead (works without install)

## Test Offline Mode (Works Without Install)

1. Open http://localhost:3000
2. F12 → Network tab
3. Check "Offline" checkbox
4. Refresh page
5. App still works! (if service worker is active)
