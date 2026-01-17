# FastPass

Digital enrollment tracking and queue management system with mobile-first design and offline support.

## Features

- **Mobile-First Design** - Optimized for smartphone usage
- **Offline Support** - Works without internet connection using PWA technology
- **Real-Time Updates** - WebSocket-based live queue updates
- **Dual Interface** - Separate dashboards for students and office staff
- **Queue Management** - Virtual queue system for all enrollment offices
- **Progress Tracking** - Visual checklist showing enrollment completion status

## Quick Start

### Install Dependencies

```bash
npm install
```

### Run Development Server

Terminal 1 - Frontend:
```bash
npm run dev
```

Terminal 2 - Backend:
```bash
npm run server
```

Open http://localhost:3000 in your browser (preferably on mobile or with mobile emulation).

### Demo Login

**Student:**
- Role: Student
- ID: Any number (e.g., 2024001)

**Office Staff:**
- Role: Office Staff
- Name: Any office name (e.g., Registrar, Cashier)

## Tech Stack

- **Frontend:** React + Vite + Tailwind CSS
- **Backend:** Express + WebSocket
- **Database:** SQLite (better-sqlite3)
- **PWA:** Service Worker for offline support
- **Mobile:** Responsive design with touch optimization

## Project Structure

```
enrollflow/
├── public/
│   ├── sw.js              # Service worker for offline
│   ├── manifest.json      # PWA manifest
│   └── icon.svg           # App icon
├── src/
│   ├── components/
│   │   ├── LoginScreen.jsx
│   │   ├── StudentDashboard.jsx
│   │   ├── OfficeDashboard.jsx
│   │   ├── EnrollmentChecklist.jsx
│   │   └── QueueStatus.jsx
│   ├── hooks/
│   │   ├── useOfflineSync.js
│   │   └── useWebSocket.js
│   ├── services/
│   │   └── api.js
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── server/
│   └── index.js           # Express + WebSocket server
└── package.json
```

## Offline Capabilities

- Cached UI and assets
- Local storage for enrollment data
- Queue synchronization when back online
- Network-first strategy with cache fallback

## Building for Production

```bash
npm run build
```

The `dist/` folder will contain the production-ready files.

## Next Steps

- [ ] Add SMS notifications
- [ ] Implement document upload
- [ ] Add admin analytics dashboard
- [ ] Deploy to production server
- [ ] Create office staff training materials
