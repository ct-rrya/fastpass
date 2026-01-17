import { useState, useEffect } from 'react';
import { getEnrollmentStatus, joinQueue, getOfficeQueue } from '../services/api';
import { getLocalEnrollment, saveLocalEnrollment, joinLocalQueue } from '../services/localQueue';
import EnrollmentChecklist from './EnrollmentChecklist';
import QueueStatus from './QueueStatus';
import Toast from './Toast';
import { useToast } from '../hooks/useToast';

const OFFICES = [
  { id: 'department', name: 'Department Office', icon: '🏢' },
  { id: 'clinic', name: 'Clinic', icon: '🏥' },
  { id: 'nstp', name: 'NSTP Office', icon: '🎖️' },
  { id: 'cashier', name: 'Cashier', icon: '💰' },
  { id: 'affairs', name: 'Student Affairs', icon: '👥' },
  { id: 'mis', name: 'MIS Office', icon: '💻' },
  { id: 'registrar', name: 'Registrar', icon: '📋' }
];

export default function StudentDashboard({ user, isOnline }) {
  const [enrollment, setEnrollment] = useState(null);
  const [loading, setLoading] = useState(true);
  const { toasts, showToast, hideToast } = useToast();

  useEffect(() => {
    loadEnrollmentStatus();
    
    // Refresh queue positions periodically
    const interval = setInterval(() => {
      if (enrollment?.offices.some(o => o.status === 'in-progress')) {
        loadEnrollmentStatus();
      }
    }, 10000); // Every 10 seconds

    // Listen for real-time queue updates
    const handleQueueUpdate = (event) => {
      const { officeId, action, studentId } = event.detail;
      
      if (action === 'complete' && studentId === user.id) {
        // Student's turn is complete
        showToast(
          <div>
            <p className="font-semibold mb-1">✅ Step Completed!</p>
            <p className="text-sm">Your enrollment step has been marked as complete.</p>
          </div>,
          'success',
          5000
        );
        loadEnrollmentStatus();
      } else if (action === 'call') {
        // Check if it's this student
        if (event.detail.student?.studentId === user.id) {
          showToast(
            <div>
              <p className="font-semibold mb-1">🔔 It's Your Turn!</p>
              <p className="text-sm">Please proceed to the office now.</p>
            </div>,
            'info',
            10000
          );
          loadEnrollmentStatus();
        }
      } else if (action === 'join' || action === 'complete') {
        // Queue changed, refresh positions and check if student is next
        loadEnrollmentStatus();
      }
    };

    // Sync offline actions when coming back online
    const handleOnlineSync = async () => {
      const offlineActions = JSON.parse(localStorage.getItem('offline_actions') || '[]');
      if (offlineActions.length > 0) {
        showToast(
          <div>
            <p className="font-semibold mb-1">🔄 Syncing Offline Actions...</p>
            <p className="text-sm">{offlineActions.length} action(s) pending</p>
          </div>,
          'info',
          3000
        );

        for (const action of offlineActions) {
          try {
            if (action.type === 'joinQueue') {
              await joinQueue(user.id, action.data.officeId, {
                groupType: action.data.groupType,
                groupSize: action.data.groupSize,
                sectionName: action.data.sectionName
              });
            }
          } catch (error) {
            console.error('Failed to sync action:', error);
          }
        }

        // Clear offline queue
        localStorage.setItem('offline_actions', '[]');
        
        // Reload enrollment
        loadEnrollmentStatus();
        
        showToast(
          <div>
            <p className="font-semibold mb-1">✅ Synced Successfully!</p>
            <p className="text-sm">All offline actions have been processed</p>
          </div>,
          'success',
          4000
        );
      }
    };

    if (isOnline) {
      handleOnlineSync();
    }

    window.addEventListener('queue_update', handleQueueUpdate);
    return () => {
      clearInterval(interval);
      window.removeEventListener('queue_update', handleQueueUpdate);
    };
  }, [user.id, showToast, enrollment, isOnline]);

  const loadEnrollmentStatus = async () => {
    try {
      if (isOnline) {
        // Try to load from server
        const data = await getEnrollmentStatus(user.id);
        
        // Fetch queue positions for offices where student is waiting
        for (const office of data.offices) {
          if (office.queueNumber && office.status === 'in-progress') {
            try {
              const queueData = await getOfficeQueue(office.id);
              const position = queueData.queue.findIndex(q => q.studentId === user.id);
              office.position = position >= 0 ? position : 0;
              
              // Check if student is next and notify
              if (position === 0 && enrollment) {
                const prevOffice = enrollment.offices.find(o => o.id === office.id);
                // Only notify if position changed to 0 (wasn't 0 before)
                if (prevOffice && prevOffice.position !== 0) {
                  showToast(
                    <div>
                      <p className="font-semibold mb-1">⚡ You're Next!</p>
                      <p className="text-sm">{office.name}</p>
                      <p className="text-xs mt-1 opacity-90">Please prepare and be ready!</p>
                    </div>,
                    'warning',
                    8000
                  );
                }
              }
            } catch (error) {
              console.error('Failed to get queue position:', error);
            }
          }
        }
        
        setEnrollment(data);
        // Save to local storage
        saveLocalEnrollment(user.id, data);
      } else {
        // Load from local storage
        const localData = getLocalEnrollment(user.id);
        if (localData) {
          setEnrollment(localData);
        } else {
          // Initialize new enrollment locally
          const newEnrollment = {
            studentId: user.id,
            offices: OFFICES.map(o => ({ ...o, status: 'pending', queueNumber: null })),
            currentQueue: null
          };
          setEnrollment(newEnrollment);
          saveLocalEnrollment(user.id, newEnrollment);
        }
      }
    } catch (error) {
      console.error('Failed to load enrollment:', error);
      // Fallback to local storage
      const localData = getLocalEnrollment(user.id);
      if (localData) {
        setEnrollment(localData);
      } else {
        // Initialize new enrollment
        const newEnrollment = {
          studentId: user.id,
          offices: OFFICES.map(o => ({ ...o, status: 'pending', queueNumber: null })),
          currentQueue: null
        };
        setEnrollment(newEnrollment);
        saveLocalEnrollment(user.id, newEnrollment);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleJoinQueue = async (queueData) => {
    try {
      const office = OFFICES.find(o => o.id === queueData.officeId);
      let result;
      
      // Always try local first, then try server if online
      try {
        if (isOnline) {
          // Try server first
          result = await joinQueue(user.id, queueData.officeId, {
            groupType: queueData.groupType,
            groupSize: queueData.groupSize,
            sectionName: queueData.sectionName
          });
        } else {
          throw new Error('Offline');
        }
      } catch (error) {
        // Fallback to local queue
        console.log('Using local queue:', error.message);
        result = joinLocalQueue(user.id, queueData.officeId, {
          groupType: queueData.groupType,
          groupSize: queueData.groupSize,
          sectionName: queueData.sectionName
        });
      }
      
      const estimatedWait = result.estimatedWait || 15;
      
      const updatedEnrollment = {
        ...enrollment,
        currentQueue: result.queueNumber,
        offices: enrollment.offices.map(o =>
          o.id === queueData.officeId 
            ? { 
                ...o, 
                queueNumber: result.queueNumber, 
                estimatedWait, 
                status: 'in-progress',
                groupType: queueData.groupType,
                groupSize: queueData.groupSize
              } 
            : o
        )
      };
      
      setEnrollment(updatedEnrollment);
      saveLocalEnrollment(user.id, updatedEnrollment);

      showToast(
        <div>
          <p className="font-semibold mb-1">✅ Joined Queue Successfully!</p>
          <p className="text-sm">
            <span className="font-medium">{office?.name}</span>
          </p>
          <p className="text-sm mt-1">
            Your queue number: <span className="text-2xl font-bold">#{result.queueNumber}</span>
          </p>
          <p className="text-xs mt-1 opacity-90">
            Estimated wait: ~{estimatedWait} minutes
          </p>
          <p className="text-xs mt-2 opacity-75">
            💾 {isOnline ? 'Saved online and locally' : 'Saved locally - works offline!'}
          </p>
        </div>,
        'success',
        7000
      );
    } catch (error) {
      console.error('Failed to join queue:', error);
      showToast('Failed to join queue. Please try again.', 'error');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }

  const completedCount = enrollment?.offices.filter(o => o.status === 'completed').length || 0;
  const totalCount = OFFICES.length;
  const progress = (completedCount / totalCount) * 100;

  return (
    <div className="max-w-2xl mx-auto p-4 space-y-4">
      {/* Progress Card */}
      <div className="card">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h2 className="text-lg font-semibold">Enrollment Progress</h2>
            <p className="text-sm text-gray-600">
              {completedCount} of {totalCount} completed
            </p>
          </div>
          <div className="text-3xl font-bold text-primary">
            {Math.round(progress)}%
          </div>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div
            className="bg-primary h-3 rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>

      {/* Current Queue */}
      {enrollment?.currentQueue && (
        <QueueStatus
          queueNumber={enrollment.currentQueue}
          office={enrollment.offices.find(o => o.queueNumber === enrollment.currentQueue)}
        />
      )}

      {/* Enrollment Checklist */}
      <EnrollmentChecklist
        offices={enrollment?.offices || []}
        onJoinQueue={handleJoinQueue}
        isOnline={isOnline}
      />

      {/* Toast Notifications */}
      {toasts.map(toast => (
        <Toast
          key={toast.id}
          message={toast.message}
          type={toast.type}
          duration={toast.duration}
          onClose={() => hideToast(toast.id)}
        />
      ))}
    </div>
  );
}
