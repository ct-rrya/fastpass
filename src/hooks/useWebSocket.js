import { useEffect, useState } from 'react';

export function useWebSocket(user) {
  const [connected, setConnected] = useState(false);
  const [ws, setWs] = useState(null);

  useEffect(() => {
    if (!user) return;

    // In production, use Railway WebSocket URL
    const wsUrl = import.meta.env.PROD
      ? 'wss://fastpass-production.up.railway.app/ws'
      : `ws://${window.location.hostname}:3001/ws`;
    
    const socket = new WebSocket(wsUrl);

    socket.onopen = () => {
      console.log('WebSocket connected');
      setConnected(true);
      socket.send(JSON.stringify({ type: 'register', userId: user.id, role: user.role }));
    };

    socket.onclose = () => {
      console.log('WebSocket disconnected');
      setConnected(false);
    };

    socket.onmessage = (event) => {
      const message = JSON.parse(event.data);
      console.log('WebSocket message:', message);
      
      // Handle real-time updates
      if (message.type === 'queue_update') {
        window.dispatchEvent(new CustomEvent('queue_update', { detail: message.data }));
      }
    };

    socket.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    setWs(socket);

    return () => {
      socket.close();
    };
  }, [user]);

  return { connected, ws };
}
