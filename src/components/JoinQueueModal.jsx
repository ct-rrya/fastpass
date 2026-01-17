import { useState } from 'react';

export default function JoinQueueModal({ office, onJoin, onCancel }) {
  const [groupType, setGroupType] = useState('individual');
  const [groupSize, setGroupSize] = useState(1);
  const [sectionName, setSectionName] = useState('');

  const groupTypes = [
    { 
      id: 'individual', 
      name: 'Just Me', 
      icon: '👤',
      description: 'I\'m enrolling alone'
    },
    { 
      id: 'group', 
      name: 'Small Group', 
      icon: '👥',
      description: '2-5 friends together'
    },
    { 
      id: 'section', 
      name: 'Whole Section', 
      icon: '👨‍👩‍👧‍👦',
      description: 'My entire class/section'
    }
  ];

  const handleSubmit = () => {
    onJoin({
      officeId: office.id,
      groupType,
      groupSize: groupType === 'individual' ? 1 : groupType === 'group' ? groupSize : 30,
      sectionName: groupType === 'section' ? sectionName : null
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-4 border-b sticky top-0 bg-white">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-lg">Join Queue</h3>
              <p className="text-sm text-gray-600">{office.name}</p>
            </div>
            <button
              onClick={onCancel}
              className="p-2 hover:bg-gray-100 rounded-lg"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <div className="p-4 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              How are you enrolling?
            </label>
            <div className="space-y-2">
              {groupTypes.map(type => (
                <button
                  key={type.id}
                  onClick={() => setGroupType(type.id)}
                  className={`w-full p-4 rounded-lg border-2 transition-all text-left ${
                    groupType === type.id
                      ? 'border-primary bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{type.icon}</span>
                    <div className="flex-1">
                      <p className="font-medium">{type.name}</p>
                      <p className="text-sm text-gray-600">{type.description}</p>
                    </div>
                    {groupType === type.id && (
                      <svg className="w-6 h-6 text-primary flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Group Size Input */}
          {groupType === 'group' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                How many people in your group?
              </label>
              <input
                type="number"
                min="2"
                max="10"
                value={groupSize}
                onChange={(e) => setGroupSize(parseInt(e.target.value) || 2)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="e.g., 3"
              />
              <p className="text-xs text-gray-500 mt-1">
                Enter the number of students in your group (2-10)
              </p>
            </div>
          )}

          {/* Section Name Input */}
          {groupType === 'section' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Section/Class Name
              </label>
              <input
                type="text"
                value={sectionName}
                onChange={(e) => setSectionName(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="e.g., BSIT 3-A"
              />
              <p className="text-xs text-gray-500 mt-1">
                This helps the office prepare for your section
              </p>
            </div>
          )}

          {/* Info Box */}
          <div className="bg-blue-50 rounded-lg p-3">
            <p className="text-sm text-blue-900">
              <span className="font-medium">💡 Tip:</span> {
                groupType === 'individual' 
                  ? 'You\'ll be processed individually. Faster for single students!'
                  : groupType === 'group'
                  ? 'Your group will be processed together. Make sure everyone is present!'
                  : 'Your whole section will be processed at once. Great for orientations!'
              }
            </p>
          </div>
        </div>

        <div className="p-4 border-t bg-gray-50 sticky bottom-0">
          <button
            onClick={handleSubmit}
            disabled={groupType === 'section' && !sectionName.trim()}
            className="w-full btn btn-primary"
          >
            Join Queue
          </button>
        </div>
      </div>
    </div>
  );
}
