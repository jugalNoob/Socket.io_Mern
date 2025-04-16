const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const app = express();
const port = process.env.PORT || 9000;
const notify = require('./Notification/notify'); // Import the notify module

const server = http.createServer(app);

// Set server timeout
server.setTimeout(60000); // 60 seconds timeout
console.log(`Server timeout: ${server.timeout}ms`);
console.log(`Request timeout: ${server.requestTimeout}ms`);

// Initialize Socket.IO with CORS configuration
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:3000", // Client's origin
    methods: ['GET', 'POST'],
    credentials: true,
  },
});

// Socket.IO Events
io.on('connection', (socket) => {
  // Increment connected users
  notify.increment();
  console.log(`New user connected: ${socket.id}`);
  console.log(`Total connected users: ${notify.connectedUsers}`);

  // Notify all clients of updated user count
  io.emit('userCount', notify.connectedUsers);

  // Handle chat messages
  socket.on('chat', (msg) => {
    console.log(`Message received: ${msg}`);
    socket.broadcast.emit('chat', `Server received: ${msg}`);
  });

  // Handle user disconnection
  socket.on('disconnect', () => {
    notify.decrement();
    console.log(`User disconnected with ID: ${socket.id}`);
    console.log(`Total connected users: ${notify.connectedUsers}`);

    // Notify all clients of updated user count
    io.emit('userCount', notify.connectedUsers);
  });
});

// Endpoint to fetch logs (Optional)
app.get('/logs', (req, res) => {
  res.json({ logs: notify.getLogs() });
});

// Start the server
server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
