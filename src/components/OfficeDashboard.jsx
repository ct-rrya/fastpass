import { useState, useEffect } from 'react';
import { getOfficeQueue, callNextStudent, markCompleted } from '../services/api';
import { getLocalOfficeQueue, callLocalNextStudent, markLocalCompleted } from '../services/localQueue';

export default function OfficeDashboard({ user, isOnline }) {
  const [queue, setQueue] = useState([]);
  const [currentStudent, setCurrentStudent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadQueue();
    const interval = setInterval(loadQueue, 5000);
    return () => clearInterval(interval);
  }, [user.id]);

  // Keyboard shortcuts for faster workflow
  useEffect(() => {
    const handleKeyPress = (e) => {
      // Space or Enter to mark complete and call next
      if ((e.key === ' ' || e.key === 'Enter') && currentStudent) {
        e.preventDefault();
        handleMarkCompleted();
      }
      // 'N' key to call next when no current student
      if (e.key === 'n' && !currentStudent && queue.length > 0) {
        e.preventDefault();
        handleCallNext();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [currentStudent, queue]);

  const loadQueue = async () => {
    try {
      let data;
      if (isOnline) {
        data = await getOfficeQueue(user.id);
      } else {
        data = getLocalOfficeQueue(user.id);
      }
      setQueue(data.queue || []);
      setCurrentStudent(data.current);
    } catch (error) {
      console.error('Failed to load queue:', error);
      // Fallback to local
      const data = getLocalOfficeQueue(user.id);
      setQueue(data.queue || []);
      setCurrentStudent(data.current);
    } finally {
      setLoading(false);
    }
  };

  const handleCallNext = async () => {
    try {
      let result;
      try {
        if (isOnline) {
          result = await callNextStudent(user.id);
        } else {
          throw new Error('Offline');
        }
      } catch (error) {
        // Fallback to local
        console.log('Using local queue for call next');
        result = callLocalNextStudent(user.id);
      }
      
      if (result.student) {
        setCurrentStudent(result.student);
        setQueue(prev => prev.filter(s => s.studentId !== result.student.studentId));
      }
    } catch (error) {
      console.error('Failed to call next:', error);
    }
  };

  const handleMarkCompleted = async () => {
    if (!currentStudent) return;
    
    try {
      try {
        if (isOnline) {
          await markCompleted(user.id, currentStudent.studentId);
        } else {
          throw new Error('Offline');
        }
      } catch (error) {
        // Fallback to local
        console.log('Using local storage for mark completed');
        markLocalCompleted(user.id, currentStudent.studentId);
      }
      
      // Automatically call next student
      let result;
      try {
        if (isOnline) {
          result = await callNextStudent(user.id);
        } else {
          throw new Error('Offline');
        }
      } catch (error) {
        result = callLocalNextStudent(user.id);
      }
        
      if (result.student) {
        setCurrentStudent(result.student);
        setQueue(prev => prev.filter(s => s.studentId !== result.student.studentId));
      } else {
        setCurrentStudent(null);
      }
      
      loadQueue();
    } catch (error) {
      console.error('Failed to mark completed:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }

  const calculateWaitTime = (position) => {
    // Simple estimation based on position
    return position * 5;
  };

  return (
    <div className="max-w-2xl mx-auto p-4 space-y-4">
      {/* Office Header */}
      <div className="card bg-primary text-white">
        <h2 className="text-2xl font-bold mb-1">{user.name}</h2>
        <p className="text-blue-100">Queue Management</p>
      </div>

      {/* Current Student */}
      {currentStudent ? (
        <div className="card border-2 border-primary">
          <div className="text-center mb-4">
            <p className="text-sm text-gray-600 mb-1">Now Serving</p>
            <div className="text-5xl font-bold text-primary mb-2">
              #{currentStudent.queueNumber}
            </div>
            <p className="text-lg font-medium">{currentStudent.name}</p>
            <p className="text-sm text-gray-600">ID: {currentStudent.studentId}</p>
            
            {/* Group Type Badge */}
            {currentStudent.groupType && (
              <div className="mt-3 inline-flex items-center gap-2 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                <span>
                  {currentStudent.groupType === 'individual' ? '👤 Individual' :
                   currentStudent.groupType === 'group' ? `👥 Group of ${currentStudent.groupSize}` :
                   `👨‍👩‍👧‍👦 Section: ${currentStudent.sectionName}`}
                </span>
              </div>
            )}
          </div>
          
          <button
            onClick={handleMarkCompleted}
            className="w-full btn btn-primary text-lg py-4"
          >
            ✓ Done - Next Student
          </button>
          <p className="text-xs text-center text-gray-500 mt-2">
            {isOnline ? (
              <>Press <kbd className="px-2 py-1 bg-gray-200 rounded text-xs">Space</kbd> or <kbd className="px-2 py-1 bg-gray-200 rounded text-xs">Enter</kbd> for quick action</>
            ) : (
              <>📴 Offline Mode - Data saved locally</>
            )}
          </p>
        </div>
      ) : (
        <div className="card text-center py-8">
          <p className="text-gray-500 mb-4">No student currently being served</p>
          <button
            onClick={handleCallNext}
            disabled={queue.length === 0}
            className="btn btn-primary text-lg py-4 px-8"
          >
            {queue.length > 0 ? `Call Next Student (${queue.length} waiting)` : 'No Students in Queue'}
          </button>
          {queue.length > 0 && (
            <p className="text-xs text-gray-500 mt-2">
              {isOnline ? (
                <>Press <kbd className="px-2 py-1 bg-gray-200 rounded text-xs">N</kbd> to call next</>
              ) : (
                <>📴 Offline Mode - Works locally</>
              )}
            </p>
          )}
        </div>
      )}

      {/* Queue List */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold">Waiting Queue</h3>
          <span className="bg-gray-100 px-3 py-1 rounded-full text-sm font-medium">
            {queue.length} waiting
          </span>
        </div>

        {queue.length === 0 ? (
          <p className="text-center text-gray-500 py-8">No students in queue</p>
        ) : (
          <div className="space-y-2">
            {queue.map((student, index) => (
              <div
                key={student.id}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary text-white rounded-full flex items-center justify-center font-bold">
                    {index + 1}
                  </div>
                  <div>
                    <p className="font-medium">
                      Queue #{student.queueNumber}
                      {student.groupType === 'group' && ` (${student.groupSize} people)`}
                      {student.groupType === 'section' && ` (${student.sectionName})`}
                    </p>
                    <p className="text-sm text-gray-600">
                      {student.groupType === 'individual' ? '👤' :
                       student.groupType === 'group' ? '👥' : '👨‍👩‍👧‍👦'} {student.studentId}
                    </p>
                  </div>
                </div>
                <span className="text-sm text-gray-500">
                  ~{calculateWaitTime(index + 1)} min
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
