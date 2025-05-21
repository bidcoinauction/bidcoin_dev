import { useState, useEffect, useRef, useCallback } from 'react';
import { auctionService } from '@/lib/apiService';

export function useWebSocket() {
  const [isConnected, setIsConnected] = useState(false);
  const socketRef = useRef<WebSocket | null>(null);
  const subscribersRef = useRef<Record<string, Set<(data: any) => void>>>({});
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  // Initialize WebSocket connection
  useEffect(() => {
    const connectWebSocket = () => {
      // Create new WebSocket connection with proper path formatting
      const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
      const host = window.location.hostname;
      // Don't specify port - let it use the same port as the current page
      const wsUrl = `${protocol}//${host}/ws`;
      
      console.log(`[websocket] Connecting to ${wsUrl}...`);
      const ws = new WebSocket(wsUrl);
      socketRef.current = ws;
      
      ws.onopen = () => {
        console.log('[websocket] Connection established');
        setIsConnected(true);
        
        // Clear any reconnect timeout
        if (reconnectTimeoutRef.current) {
          clearTimeout(reconnectTimeoutRef.current);
          reconnectTimeoutRef.current = null;
        }
        
        // Send initial handshake message
        ws.send(JSON.stringify({
          type: 'handshake',
          data: {
            clientId: localStorage.getItem('clientId') || 'anonymous',
            userAgent: navigator.userAgent,
            timestamp: Date.now()
          }
        }));
      };
      
      ws.onmessage = (event) => {
        try {
          const message = JSON.parse(event.data);
          console.log('[websocket] Received message:', message.type);
          
          // Handle connected message (store clientId)
          if (message.type === 'connected' && message.data?.clientId) {
            localStorage.setItem('clientId', message.data.clientId);
          }
          
          // Handle auction updates
          if (message.type === 'new-bid' && message.data?.auction?.id) {
            // Update auction cache
            auctionService.updateAuctionCache(message.data.auction.id, message.data.auction);
          }
          
          // Notify subscribers
          const subscribers = subscribersRef.current[message.type];
          if (subscribers) {
            subscribers.forEach(callback => callback(message.data));
          }
        } catch (error) {
          console.error('[websocket] Error parsing message:', error);
        }
      };
      
      ws.onclose = () => {
        console.log('[websocket] Connection closed');
        setIsConnected(false);
        
        // Attempt to reconnect after a delay
        if (!reconnectTimeoutRef.current) {
          reconnectTimeoutRef.current = setTimeout(() => {
            console.log('[websocket] Attempting to reconnect...');
            connectWebSocket();
          }, 3000);
        }
      };
      
      ws.onerror = (error) => {
        console.error('[websocket] Connection error:', error);
      };
    };
    
    connectWebSocket();
    
    // Cleanup on unmount
    return () => {
      if (socketRef.current) {
        socketRef.current.close();
      }
      
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
    };
  }, []);
  
  // Subscribe to a specific message type
  const subscribe = useCallback((type: string, callback: (data: any) => void) => {
    if (!subscribersRef.current[type]) {
      subscribersRef.current[type] = new Set();
    }
    
    subscribersRef.current[type].add(callback);
    
    // Return unsubscribe function
    return () => {
      if (subscribersRef.current[type]) {
        subscribersRef.current[type].delete(callback);
      }
    };
  }, []);
  
  // Subscribe to a specific auction's updates
  const subscribeToAuction = useCallback((auctionId: number) => {
    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      socketRef.current.send(JSON.stringify({
        type: 'subscribe',
        auctionId
      }));
    }
  }, []);
  
  // Request latest stats for an auction
  const requestAuctionStats = useCallback((auctionId: number) => {
    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      socketRef.current.send(JSON.stringify({
        type: 'get-auction-stats',
        auctionId
      }));
    }
  }, []);
  
  return {
    isConnected,
    subscribe,
    subscribeToAuction,
    requestAuctionStats
  };
}
