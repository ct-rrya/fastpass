import { useState } from 'react';
import JoinQueueModal from './JoinQueueModal';

export default function EnrollmentChecklist({ offices, onJoinQueue, isOnline }) {
  const [showModal, setShowModal] = useState(false);
  const [selectedOffice, setSelectedOffice] = useState(null);

  const handleJoinClick = (office) => {
    setSelectedOffice(office);
    setShowModal(true);
  };

  const handleJoinConfirm = (queueData) => {
    onJoinQueue(queueData);
    setShowModal(false);
    setSelectedOffice(null);
  };

  const getStatusColor = (status, office) => {
    // If in queue but not completed, show as in-progress
    if (office?.queueNumber && status !== 'completed') {
      return 'bg-blue-100 text-blue-800';
    }
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'in-progress': return 'bg-blue-100 text-blue-800';
      case 'pending': return 'bg-gray-100 text-gray-600';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  const getStatusIcon = (status, office) => {
    // If in queue but not completed, show as in-progress
    if (office?.queueNumber && status !== 'completed') {
      return '⏳';
    }
    switch (status) {
      case 'completed': return '✓';
      case 'in-progress': return '⏳';
      case 'pending': return '○';
      default: return '○';
    }
  };

  const getStatusText = (status, office) => {
    // If in queue but not completed, show as in-progress
    if (office?.queueNumber && status !== 'completed') {
      return 'in-progress';
    }
    return status;
  };

  return (
    <div className="space-y-3">
      <h3 className="font-semibold text-gray-900 px-1">Enrollment Steps</h3>
      
      {offices.map((office, index) => (
        <div key={office.id} className="card">
          <div className="flex items-start gap-3">
            {/* Icon */}
            <div className="text-3xl flex-shrink-0">{office.icon}</div>
            
            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2 mb-2">
                <div>
                  <h4 className="font-medium text-gray-900">{office.name}</h4>
                  <p className="text-sm text-gray-500">Step {index + 1} of {offices.length}</p>
                </div>
                <span className={`status-badge ${getStatusColor(office.status, office)}`}>
                  {getStatusIcon(office.status, office)} {getStatusText(office.status, office)}
                </span>
              </div>

              {/* Queue Info */}
              {office.queueNumber && office.status !== 'completed' && (
                <div className={`rounded-lg p-3 mb-2 ${office.offline ? 'bg-yellow-50' : office.position === 0 ? 'bg-orange-50 border-2 border-orange-300' : 'bg-blue-50'}`}>
                  <div className="flex items-center justify-between mb-2">
                    <p className={`text-sm font-medium ${office.offline ? 'text-yellow-900' : office.position === 0 ? 'text-orange-900' : 'text-blue-900'}`}>
                      Queue Number: <span className="text-2xl">#{office.queueNumber}</span>
                    </p>
                    {office.offline && (
                      <span className="bg-yellow-200 text-yellow-900 px-2 py-1 rounded-full text-xs font-medium">
                        📴 Pending Sync
                      </span>
                    )}
                    {!office.offline && office.position !== undefined && (
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        office.position === 0 
                          ? 'bg-orange-200 text-orange-900 animate-pulse' 
                          : 'bg-blue-200 text-blue-900'
                      }`}>
                        {office.position === 0 ? "⚡ You're next!" : `${office.position} ahead`}
                      </span>
                    )}
                  </div>
                  {office.estimatedWait && (
                    <p className={`text-xs mt-1 ${office.offline ? 'text-yellow-700' : 'text-blue-700'}`}>
                      Estimated wait: ~{office.estimatedWait} minutes
                    </p>
                  )}
                  {office.groupType && (
                    <p className={`text-xs mt-1 ${office.offline ? 'text-yellow-600' : 'text-blue-600'}`}>
                      {office.groupType === 'individual' ? '👤 Individual' :
                       office.groupType === 'group' ? `👥 Group of ${office.groupSize}` :
                       '👨‍👩‍👧‍👦 Whole Section'}
                    </p>
                  )}
                  {office.offline && (
                    <p className="text-xs mt-2 text-yellow-700 font-medium">
                      ⚡ Will be submitted when you're back online
                    </p>
                  )}
                </div>
              )}

              {/* Action Button */}
              {office.status === 'pending' && !office.queueNumber && (
                <button
                  onClick={() => handleJoinClick(office)}
                  className="w-full btn btn-primary text-sm"
                >
                  {isOnline ? 'Join Queue' : '📴 Join Queue (Offline)'}
                </button>
              )}

              {office.status === 'completed' && (
                <div className="flex items-center gap-2 text-green-600 text-sm">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="font-medium">Completed</span>
                </div>
              )}
            </div>
          </div>
        </div>
      ))}

      {/* Join Queue Modal */}
      {showModal && selectedOffice && (
        <JoinQueueModal
          office={selectedOffice}
          onJoin={handleJoinConfirm}
          onCancel={() => {
            setShowModal(false);
            setSelectedOffice(null);
          }}
        />
      )}
    </div>
  );
}
