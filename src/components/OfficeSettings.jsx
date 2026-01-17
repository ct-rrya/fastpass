export default function OfficeSettings({ settings, onUpdate }) {
  const processingModes = [
    { id: 'individual', name: 'Individual', icon: '👤', avgTime: 5 },
    { id: 'group', name: 'Small Group (2-5)', icon: '👥', avgTime: 10 },
    { id: 'section', name: 'Whole Section (20-40)', icon: '👨‍👩‍👧‍👦', avgTime: 30 }
  ];

  return (
    <div className="card mb-4">
      <h3 className="font-semibold mb-3">Processing Mode</h3>
      
      <div className="grid grid-cols-1 gap-2">
        {processingModes.map(mode => (
          <button
            key={mode.id}
            onClick={() => onUpdate({ 
              processingMode: mode.id,
              avgProcessingTime: mode.avgTime 
            })}
            className={`p-3 rounded-lg border-2 transition-all text-left ${
              settings.processingMode === mode.id
                ? 'border-primary bg-blue-50'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{mode.icon}</span>
                <div>
                  <p className="font-medium">{mode.name}</p>
                  <p className="text-xs text-gray-600">~{mode.avgTime} min per batch</p>
                </div>
              </div>
              {settings.processingMode === mode.id && (
                <svg className="w-6 h-6 text-primary" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              )}
            </div>
          </button>
        ))}
      </div>

      {/* Custom Time Override */}
      <div className="mt-4 pt-4 border-t">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Custom Processing Time (minutes)
        </label>
        <input
          type="number"
          min="1"
          max="120"
          value={settings.avgProcessingTime}
          onChange={(e) => onUpdate({ avgProcessingTime: parseInt(e.target.value) || 5 })}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
        />
        <p className="text-xs text-gray-500 mt-1">
          Adjust based on your actual processing speed
        </p>
      </div>

      {/* Current Status */}
      <div className="mt-4 p-3 bg-gray-50 rounded-lg">
        <p className="text-sm text-gray-600">
          <span className="font-medium">Current mode:</span> {
            processingModes.find(m => m.id === settings.processingMode)?.name || 'Individual'
          }
        </p>
        <p className="text-sm text-gray-600">
          <span className="font-medium">Avg time:</span> {settings.avgProcessingTime} minutes
        </p>
      </div>
    </div>
  );
}
