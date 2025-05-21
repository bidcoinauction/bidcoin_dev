import express, { Request, Response, NextFunction } from 'express';
import { createServer } from 'http';
import { WebSocketServer } from 'ws';
import cors from 'cors';
import { nanoid } from 'nanoid';
import { setupVite, serveStatic, log } from './vite';
import apiRoutes from './routes/api';

// For Vercel serverless functions
export const app = express();
app.use(cors());
app.use(express.json());
app.use('/api', apiRoutes);

// Only create and listen on the server if not in a serverless environment
if (process.env.NODE_ENV !== 'vercel') {
  const server = createServer(app);

  // Set up WebSocket server
  const wss = new WebSocketServer({ server, path: '/ws' });
  const clients = new Map();

  wss.on('connection', (ws) => {
    const clientId = nanoid();
    clients.set(ws, clientId);
    log(`[websocket] Client ${clientId} connected`);
    
    // Send welcome message
    ws.send(JSON.stringify({
      type: 'connected',
      data: {
        clientId,
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
          ws.send(JSON.stringify({
            type: 'pong',
            data: {
              timestamp: Date.now(),
              clientId
            }
          }));
        }
      } catch (error) {
        log(`[websocket] Error parsing message: ${error}`);
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
      // Error handling middleware
      app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
        const status = err.status || err.statusCode || 500;
        const message = err.message || "Internal Server Error";
        res.status(status).json({ message });
        console.error(err);
      });

      // Setup Vite or serve static files
      if (process.env.NODE_ENV === "development") {
        await setupVite(app, server);
      } else {
        serveStatic(app);
      }

      // Use port 4000 for development, 5000 for production, or from env var
      const port = process.env.PORT || (process.env.NODE_ENV === "development" ? 4000 : 5000);
      
      // Listen on all interfaces (0.0.0.0) to allow external connections
      server.listen(Number(port), '0.0.0.0', () => {
        log(`Server running at http://localhost:${port}`);
        log(`WebSocket server running at ws://localhost:${port}/ws`);
      });
    } catch (error) {
      console.error("Failed to start server:", error);
      process.exit(1);
    }
  })();
}
