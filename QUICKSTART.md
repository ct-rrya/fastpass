# EnrollFlow - Quick Start Guide

## 🚀 Your app is now running!

**Frontend:** http://localhost:3000  
**Backend:** http://localhost:3001

## 📱 Testing the App

### On Desktop
1. Open http://localhost:3000 in your browser
2. Press F12 to open DevTools
3. Click the device toolbar icon (or Ctrl+Shift+M)
4. Select a mobile device (e.g., iPhone 12 Pro)

### On Your Phone
1. Find your computer's IP address:
   - Windows: Run `ipconfig` and look for IPv4 Address
   - Example: 192.168.1.100

2. Make sure your phone is on the same WiFi network

3. Open your phone's browser and go to:
   - `http://YOUR_IP:3000` (e.g., http://192.168.1.100:3000)

## 🎯 Demo Walkthrough

### Test as a Student

1. **Login**
   - Select "Student"
   - Enter any Student ID (e.g., "2024001")
   - Click Continue

2. **View Enrollment Progress**
   - See all 7 enrollment offices
   - Progress bar shows 0% initially

3. **Join a Queue**
   - Click "Join Queue" on any office (e.g., Registrar)
   - You'll get a queue number (e.g., #1)
   - See estimated wait time

4. **Watch Your Status**
   - Your queue number is displayed prominently
   - Status updates in real-time

### Test as Office Staff

1. **Open a new browser tab/window** (or use incognito mode)

2. **Login**
   - Select "Office Staff"
   - Enter office name (e.g., "Registrar")
   - Click Continue

3. **Manage Queue**
   - See all students waiting in queue
   - Click "Call Next Student" to serve the first student
   - Student's queue number appears large on screen

4. **Complete Service**
   - Click "Mark as Completed"
   - Student's enrollment status updates automatically

5. **Call Next**
   - Click "Call Next Student" again for the next person

### Test Real-Time Updates

1. Keep both tabs open (student + office)
2. When office calls next student, watch the student tab update
3. When office marks completed, see the checkmark appear

## 🔌 Testing Offline Mode

1. Open DevTools (F12)
2. Go to Network tab
3. Check "Offline" checkbox
4. Try navigating the app - it still works!
5. Data is cached locally
6. Uncheck "Offline" to sync changes

## 📊 What to Test

- ✅ Mobile responsiveness (touch-friendly buttons)
- ✅ Multiple students joining same queue
- ✅ Multiple offices running simultaneously
- ✅ Progress tracking (complete all 7 offices)
- ✅ Offline functionality
- ✅ Real-time updates between student and office
- ✅ Queue number assignment
- ✅ Estimated wait times

## 🛠️ Development Commands

```bash
# Start frontend (already running)
npm run dev

# Start backend (already running)
npm run server

# Build for production
npm run build

# Preview production build
npm run preview
```

## 📁 Key Files to Customize

- `src/components/StudentDashboard.jsx` - Student interface
- `src/components/OfficeDashboard.jsx` - Office staff interface
- `src/components/EnrollmentChecklist.jsx` - Office list and status
- `server/index.js` - Backend API and WebSocket
- `tailwind.config.js` - Colors and styling

## 🎨 Customization Ideas

1. **Change Colors**
   - Edit `tailwind.config.js` primary color
   - Update theme color in `index.html` and `manifest.json`

2. **Add More Offices**
   - Edit the OFFICES array in `StudentDashboard.jsx`
   - Update server initialization in `server/index.js`

3. **Add Notifications**
   - Implement browser notifications when queue is called
   - Add sound alerts

4. **Add SMS Integration**
   - Use Twilio or similar service
   - Send SMS when student's turn is near

## 🐛 Troubleshooting

**Port already in use?**
```bash
# Find process using port 3001
netstat -ano | findstr :3001

# Kill the process (replace PID)
taskkill /F /PID <PID>
```

**Can't access from phone?**
- Check firewall settings
- Make sure both devices are on same WiFi
- Try disabling Windows Firewall temporarily

**WebSocket not connecting?**
- Check if backend is running on port 3001
- Look for errors in browser console (F12)

## 📱 Installing as PWA

1. Open the app on your phone
2. Browser will show "Add to Home Screen" prompt
3. Tap to install
4. App icon appears on home screen
5. Opens like a native app!

## 🎓 Next Steps

- Deploy to a real server (Vercel, Railway, DigitalOcean)
- Add user authentication
- Implement document upload
- Add admin analytics dashboard
- Create office staff training materials
- Conduct user testing with real students

---

**Need help?** Check the main README.md or review the code comments.

**Ready to deploy?** See deployment guides for your chosen platform.
