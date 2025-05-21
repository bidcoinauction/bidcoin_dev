import express, { type Request, Response, NextFunction } from "express";
import { createServer } from "http";
import { WebSocketServer, WebSocket } from "ws";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";

// Define custom WebSocket interface with clientId property
interface CustomWebSocket extends WebSocket {
  clientId?: string;
}

// Create Express app
const app = express();
const server = createServer(app);

// Create WebSocket server attached to the HTTP server
const wss = new WebSocketServer({ 
  server,
  path: '/ws' // Explicitly set the path
});

// Store connected clients
const clients = new Set<CustomWebSocket>();

// Middleware setup
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static('public'));

// Logging middleware
app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      log(logLine);
    }
  });

  next();
});

// WebSocket connection handler
wss.on('connection', (ws: CustomWebSocket, req) => {
  log('[websocket] Client connected');
  clients.add(ws);
  
  // Generate a unique client ID
  const clientId = `client-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
  ws.clientId = clientId;
  
  // Send initial connection confirmation
  ws.send(JSON.stringify({
    type: 'connected',
    data: {
      clientId,
      serverVersion: '1.0.0',
      message: 'Connected to WebSocket server',
      timestamp: new Date().toISOString()
    }
  }));
  
  // Handle messages from client
  ws.on('message', (message) => {
    try {
      const data = JSON.parse(message.toString());
      log(`[websocket] Received message from ${clientId}: ${data.type}`);
      
      // Handle different message types
      if (data.type === 'ping') {
        // Respond to ping with pong
        ws.send(JSON.stringify({
          type: 'pong',
          data: {
            timestamp: Date.now(),
            clientId
          }
        }));
      } else if (data.type === 'subscribe' && data.auctionId) {
        // Handle subscription to auction
        ws.send(JSON.stringify({
          type: 'subscription-confirmed',
          data: {
            auctionId: data.auctionId,
            message: `Subscribed to auction ${data.auctionId} updates`,
            timestamp: new Date().toISOString()
          }
        }));
      }
    } catch (error) {
      log(`[websocket] Error processing message: ${error}`);
    }
  });
  
  // Handle client disconnect
  ws.on('close', () => {
    log(`[websocket] Client ${clientId} disconnected`);
    clients.delete(ws);
  });
});

// Main application setup
(async () => {
  try {
    // Register routes
    await registerRoutes(app);

    // Error handling middleware
    app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
      const status = err.status || err.statusCode || 500;
      const message = err.message || "Internal Server Error";
      res.status(status).json({ message });
      console.error(err);
    });

    // Setup Vite or serve static files
    if (app.get("env") === "development") {
      await setupVite(app, server);
    } else {
      serveStatic(app);
    }

    // Use port 4000 for development
    const port = process.env.PORT || (process.env.NODE_ENV === "development" ? 4000 : 5000);
    
    // Use localhost for binding - fix the type error by using a number for port
    server.listen(Number(port), 'localhost', () => {
      log(`Server running at http://localhost:${port}`);
      log(`WebSocket server running at ws://localhost:${port}/ws`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
})();

// Export a function to broadcast messages to all clients
export function broadcastMessage(type: string, data: any) {
  const message = JSON.stringify({ type, data });
  log(`[websocket] Broadcasting ${type} to ${clients.size} clients`);
  
  clients.forEach((client: CustomWebSocket) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(message);
    }
  });
}
