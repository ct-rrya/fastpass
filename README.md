# 🎫 FastPass - Digital Enrollment Tracking System

[![Live Demo](https://img.shields.io/badge/demo-live-success)](https://enroll-six.vercel.app)
[![Vercel](https://img.shields.io/badge/deployed-vercel-black)](https://enroll-six.vercel.app)
[![Railway](https://img.shields.io/badge/backend-railway-purple)](https://fastpass-production.up.railway.app)

A modern, mobile-first digital enrollment tracking and queue management system designed to streamline the multi-office enrollment process in educational institutions.

## ✨ Features

### For Students
- 📱 **Mobile-First Design** - Optimized for smartphone usage
- 🔔 **Smart Notifications** - Get alerted when you're next in queue
- 📊 **Progress Tracking** - Visual checklist showing enrollment completion
- 🎯 **Queue Position** - Real-time updates on your position
- 📴 **Offline Support** - Works without internet after first visit
- ⚡ **PWA Installable** - Install as native app on any device

### For Office Staff
- 🖱️ **One-Click Operation** - Mark complete and call next automatically
- ⌨️ **Keyboard Shortcuts** - Space/Enter to complete, N to call next
- 👥 **Group Processing** - Handle individuals, groups, or whole sections
- 📈 **Queue Overview** - See all waiting students at a glance
- 🔄 **Real-Time Sync** - Instant updates across all devices

### Technical Features
- 🚀 **Real-Time Updates** - WebSocket-based live queue updates
- 💾 **Dual Storage** - Cloud database + local storage fallback
- 🔄 **Auto-Sync** - Offline actions sync when back online
- 🎨 **Modern UI** - Clean, intuitive interface with Tailwind CSS
- 📦 **PWA Technology** - Service workers for offline capability

## 🌐 Live Demo

**Frontend:** https://enroll-six.vercel.app  
**Backend API:** https://fastpass-production.up.railway.app

### Demo Login

**Student:**
- Role: Student
- ID: Any number (e.g., 2024001)

**Office Staff:**
- Role: Office Staff
- Name: department, clinic, nstp, cashier, affairs, mis, or registrar

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/YOUR_USERNAME/fastpass.git
cd fastpass

# Install dependencies
npm install
```

### Development

Run both frontend and backend:

```bash
# Terminal 1 - Frontend (http://localhost:3000)
npm run dev

# Terminal 2 - Backend (http://localhost:3001)
npm run server
```

Open http://localhost:3000 in your browser (preferably on mobile or with mobile emulation).

### Building for Production

```bash
npm run build
```

The `dist/` folder will contain the production-ready files.

## 📁 Project Structure

```
fastpass/
├── public/
│   ├── sw.js              # Service worker for offline
│   ├── manifest.json      # PWA manifest
│   └── icon.svg           # App icon (fast-forward logo)
├── src/
│   ├── components/
│   │   ├── LoginScreen.jsx          # Login interface
│   │   ├── StudentDashboard.jsx     # Student view
│   │   ├── OfficeDashboard.jsx      # Office staff view
│   │   ├── EnrollmentChecklist.jsx  # Progress checklist
│   │   ├── JoinQueueModal.jsx       # Queue join dialog
│   │   ├── QueueStatus.jsx          # Queue position display
│   │   └── Toast.jsx                # Notification system
│   ├── hooks/
│   │   ├── useOfflineSync.js        # Offline sync logic
│   │   ├── useWebSocket.js          # Real-time connection
│   │   └── useToast.js              # Toast notifications
│   ├── services/
│   │   ├── api.js                   # API client
│   │   └── localQueue.js            # Local storage queue
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── server/
│   └── index.js           # Express + WebSocket server
├── package.json
└── vite.config.js         # Vite + PWA configuration
```

## 🛠️ Tech Stack

### Frontend
- **Framework:** React 18
- **Build Tool:** Vite
- **Styling:** Tailwind CSS
- **PWA:** vite-plugin-pwa
- **State:** React Hooks

### Backend
- **Runtime:** Node.js
- **Framework:** Express
- **Real-Time:** WebSocket (ws)
- **Storage:** In-memory (migrate to PostgreSQL recommended)

### Deployment
- **Frontend:** Vercel
- **Backend:** Railway
- **CDN:** Vercel Edge Network

## 📱 PWA Features

- ✅ Installable on mobile and desktop
- ✅ Offline-first architecture
- ✅ Service worker caching
- ✅ App-like experience
- ✅ Fast loading with precaching
- ✅ Background sync support

## 🔔 Notification System

### Student Notifications
- ✅ **Queue Joined** - Confirmation with queue number
- ⚡ **You're Next!** - Alert when position becomes 0
- 🔔 **It's Your Turn!** - When office calls you
- ✅ **Step Completed** - When office marks complete

### Visual Indicators
- 🟠 Orange pulsing badge when next in queue
- 🔵 Blue badge for in-progress items
- 🟢 Green checkmark for completed items
- 🟡 Yellow badge for offline pending items

## 🚢 Deployment

### Deploy Frontend to Vercel

```bash
npm run build
vercel --prod
```

### Deploy Backend to Railway

```bash
railway up
```

See [DEPLOYMENT_STATUS.md](DEPLOYMENT_STATUS.md) for detailed deployment guide.

## 📋 Enrollment Offices

The system supports these enrollment offices:
1. 🏢 Department Office
2. 🏥 Clinic
3. 🎖️ NSTP Office
4. 💰 Cashier
5. 👥 Student Affairs
6. 💻 MIS Office
7. 📋 Registrar

## ⚙️ Configuration

### Environment Variables

Create `.env` file for local development:

```env
PORT=3001
NODE_ENV=development
```

For production, set these in Railway/Vercel dashboard.

### API Endpoints

The backend exposes these endpoints:

- `GET /api/enrollment/:studentId` - Get enrollment status
- `POST /api/queue/join` - Join office queue
- `GET /api/queue/:officeId` - Get office queue
- `POST /api/queue/next` - Call next student
- `POST /api/enrollment/complete` - Mark step complete
- `GET /api/office/settings/:officeId` - Get office settings
- `POST /api/office/settings` - Update office settings

## 🐛 Known Limitations

⚠️ **Current Issues:**
1. Backend uses in-memory storage (data resets on restart)
2. No authentication/authorization
3. WebSocket may disconnect on free tier

See [PROGRESS_LOG.txt](PROGRESS_LOG.txt) for improvement roadmap.

## 🔮 Roadmap

### High Priority
- [ ] Add PostgreSQL database for persistence
- [ ] Implement authentication system
- [ ] Add admin dashboard
- [ ] Improve offline sync

### Medium Priority
- [ ] Browser push notifications
- [ ] Student profiles and history
- [ ] Queue management (skip, reorder)
- [ ] Analytics dashboard

### Low Priority
- [ ] Dark mode
- [ ] SMS notifications
- [ ] Email notifications
- [ ] QR code support

See [PROGRESS_LOG.txt](PROGRESS_LOG.txt) for complete roadmap.

## 📖 Documentation

- [QUICKSTART.md](QUICKSTART.md) - Getting started guide
- [DEPLOYMENT.md](DEPLOYMENT.md) - Deployment instructions
- [PROGRESS_LOG.txt](PROGRESS_LOG.txt) - Development progress and roadmap
- [NOTIFICATION_IMPROVEMENTS.md](NOTIFICATION_IMPROVEMENTS.md) - Notification system details
- [PROCESSING_MODES.md](PROCESSING_MODES.md) - Queue processing modes

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Authors

- **Your Name** - Initial work

## 🙏 Acknowledgments

- Built as a capstone project to solve real enrollment bottlenecks
- Inspired by the need for better queue management in educational institutions
- Thanks to all contributors and testers

## 📞 Support

For support, email your-email@example.com or open an issue on GitHub.

## 🌟 Show Your Support

Give a ⭐️ if this project helped you!

---

**Built with ❤️ for better enrollment experiences**
