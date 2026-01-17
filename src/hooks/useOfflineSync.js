import { useState, useCallback } from 'react';

export function useOfflineSync() {
  const [syncQueue, setSyncQueue] = useState([]);

  const addToQueue = useCallback((action) => {
    const queue = JSON.parse(localStorage.getItem('offline_queue') || '[]');
    queue.push({ ...action, timestamp: Date.now() });
    localStorage.setItem('offline_queue', JSON.stringify(queue));
    setSyncQueue(queue);
  }, []);

  const processQueue = useCallback(async () => {
    const queue = JSON.parse(localStorage.getItem('offline_queue') || '[]');
    if (queue.length === 0) return;

    console.log('Processing offline queue:', queue.length, 'items');

    for (const action of queue) {
      try {
        // Process each queued action
        await fetch(`/api${action.endpoint}`, {
          method: action.method,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(action.data)
        });
      } catch (error) {
        console.error('Failed to sync action:', error);
        return; // Stop if sync fails
      }
    }

    // Clear queue after successful sync
    localStorage.setItem('offline_queue', '[]');
    setSyncQueue([]);
  }, []);

  return { addToQueue, syncQueue: processQueue, queueLength: syncQueue.length };
}
