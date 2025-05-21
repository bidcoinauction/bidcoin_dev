// WebSocket service for real-time updates

// Determine if we're in production
const isProduction = process.env.NODE_ENV === 'production';

// In production, we might use a service like Pusher instead of native WebSockets
// For now, we'll create a mock implementation for production
class MockWebSocket {
  private callbacks: Record<string, Function[]> = {};
  private isConnected = false;
  
  constructor(url: string) {
    console.log(`[MockWebSocket] Creating connection to ${url}`);
    // Simulate connection after a short delay
    setTimeout(() => {
      this.isConnected = true;
      this.triggerEvent('open', {});
      
      // Send a welcome message
      setTimeout(() => {
        this.triggerEvent('message', { 
          data: JSON.stringify({
            type: 'connected',
            data: {
              clientId: `mock-${Date.now()}`,
              message: 'Connected to mock WebSocket server',
              timestamp: new Date().toISOString()
            }
          })
        });
      }, 500);
    }, 1000);
  }
  
  send(data: string) {
    console.log(`[MockWebSocket] Sending data: ${data}`);
    // Parse the message
    try {
      const parsedData = JSON.parse(data);
      
      // Simulate responses based on message type
      if (parsedData.type === 'ping') {
        setTimeout(() => {
          this.triggerEvent('message', {
            data: JSON.stringify({
              type: 'pong',
              data: {
                timestamp: Date.now(),
                clientId: `mock-${Date.now()}`
              }
            })
          });
        }, 300);
      } else if (parsedData.type === 'subscribe' && parsedData.auctionId) {
        setTimeout(() => {
          this.triggerEvent('message', {
            data: JSON.stringify({
              type: 'subscription-confirmed',
              data: {
                auctionId: parsedData.auctionId,
                message: `Subscribed to auction ${parsedData.auctionId} updates`,
                timestamp: new Date().toISOString()
              }
            })
          });
        }, 300);
      }
    } catch (error) {
      console.error('[MockWebSocket] Error parsing message:', error);
    }
  }
  
  addEventListener(event: string, callback: Function) {
    if (!this.callbacks[event]) {
      this.callbacks[event] = [];
    }
    this.callbacks[event].push(callback);
  }
  
  removeEventListener(event: string, callback: Function) {
    if (this.callbacks[event]) {
      this.callbacks[event] = this.callbacks[event].filter(cb => cb !== callback);
    }
  }
  
  close() {
    console.log('[MockWebSocket] Closing connection');
    this.isConnected = false;
    this.triggerEvent('close', {});
  }
  
  private triggerEvent(event: string, data: any) {
    if (this.callbacks[event]) {
      this.callbacks[event].forEach(callback => callback(data));
    }
  }
}

// Create a WebSocket connection
export function createWebSocketConnection() {
  const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
  const host = window.location.host;
  const wsUrl = `${protocol}//${host}/ws`;
  
  console.log(`Creating WebSocket connection to ${wsUrl}`);
  
  // Use mock WebSocket in production, real WebSocket in development
  return isProduction ? new MockWebSocket(wsUrl) as unknown as WebSocket : new WebSocket(wsUrl);
}

// Helper function to send JSON messages
export function sendWebSocketMessage(ws: WebSocket, type: string, data: any) {
  if (ws.readyState === WebSocket.OPEN) {
    ws.send(JSON.stringify({ type, data }));
  } else {
    console.warn('WebSocket is not open, message not sent:', { type, data });
  }
}

// Export a singleton WebSocket instance
let websocket: WebSocket | null = null;

export function getWebSocket(): WebSocket {
  if (!websocket) {
    websocket = createWebSocketConnection();
  }
  return websocket;
}

export function closeWebSocket() {
  if (websocket) {
    websocket.close();
    websocket = null;
  }
}