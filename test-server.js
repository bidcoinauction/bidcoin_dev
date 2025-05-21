const express = require('express');
const http = require('http');
const WebSocket = require('ws');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

app.get('/', (req, res) => {
  res.send('Hello World');
});

wss.on('connection', (ws) => {
  ws.send('Connected to WebSocket');
});

const PORT = 4000;
server.listen(PORT, 'localhost', () => {
  console.log(`Server running on http://localhost:${PORT}`);
});