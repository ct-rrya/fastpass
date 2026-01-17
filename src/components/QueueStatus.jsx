export default function QueueStatus({ queueNumber, office }) {
  return (
    <div className="card bg-gradient-to-r from-blue-500 to-blue-600 text-white">
      <div className="text-center">
        <p className="text-sm opacity-90 mb-1">Your Current Queue</p>
        <div className="text-5xl font-bold mb-2">#{queueNumber}</div>
        <p className="text-sm opacity-90">{office?.name}</p>
        
        <div className="mt-4 pt-4 border-t border-white/20">
          <div className="flex items-center justify-center gap-2 text-sm">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span>Waiting for your turn...</span>
          </div>
        </div>
      </div>
    </div>
  );
}
