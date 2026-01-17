import { useState, useEffect } from 'react';
import StudentDashboard from './components/StudentDashboard';
import OfficeDashboard from './components/OfficeDashboard';
import LoginScreen from './components/LoginScreen';
import { useOfflineSync } from './hooks/useOfflineSync';
import { useWebSocket } from './hooks/useWebSocket';

function App() {
  const [user, setUser] = useState(null);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showInstallButton, setShowInstallButton] = useState(false);
  
  const { syncQueue } = useOfflineSync();
  const { connected } = useWebSocket(user);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      syncQueue();
    };
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [syncQueue]);

  // PWA Install prompt
  useEffect(() => {
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowInstallButton(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === 'accepted') {
      console.log('PWA installed');
    }
    
    setDeferredPrompt(null);
    setShowInstallButton(false);
  };

  // Load user from localStorage
  useEffect(() => {
    // Try new key first, then old key for migration
    let savedUser = localStorage.getItem('fastpass_user');
    if (!savedUser) {
      savedUser = localStorage.getItem('enrollflow_user');
      if (savedUser) {
        // Migrate to new key
        localStorage.setItem('fastpass_user', savedUser);
        localStorage.removeItem('enrollflow_user');
      }
    }
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const handleLogin = (userData) => {
    setUser(userData);
    localStorage.setItem('fastpass_user', JSON.stringify(userData));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('fastpass_user');
  };

  if (!user) {
    return <LoginScreen onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen pb-20">
      {/* Status Bar */}
      <div className="sticky top-0 z-50 bg-white border-b border-gray-200">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-primary">FastPass</h1>
            {!isOnline && (
              <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
                Offline
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            {showInstallButton && (
              <button
                onClick={handleInstallClick}
                className="text-xs bg-primary text-white px-3 py-1 rounded-lg hover:bg-blue-700 transition-colors"
              >
                📱 Install App
              </button>
            )}
            <button
              onClick={handleLogout}
              className="text-sm text-gray-600 active:text-gray-900"
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      {user.role === 'student' ? (
        <StudentDashboard user={user} isOnline={isOnline} />
      ) : (
        <OfficeDashboard user={user} isOnline={isOnline} />
      )}
    </div>
  );
}

export default App;
