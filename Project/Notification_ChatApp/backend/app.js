const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const port = process.env.PORT || 9000;
const server = http.createServer(app);

// Set HTTP server timeout to 60 seconds
server.setTimeout(60000);
console.log('Server timeout:', server.timeout);

// Configure CORS for Socket.IO
const io = socketIo(server, {
    cors: {
        origin: "http://localhost:3000", // Client origin
        methods: ['GET', 'POST'],
        credentials: true,
    },
});



let connectedUsers = 0; // Variable to track connected users

io.on('connection', (socket) => {
    connectedUsers++;
    console.log(`⚡: ${socket.id} user just connected`);
    console.log(`Total connected users: ${connectedUsers}`);
  
    // Emit the updated user count to all clients
    io.emit('userCount', connectedUsers);
  
    socket.on('disconnect', () => {
      connectedUsers--;
      console.log(`User disconnected with ID: ${socket.id}`);
      console.log(`Total connected users: ${connectedUsers}`);
  
      // Emit the updated user count to all clients
      io.emit('userCount', connectedUsers);
    });
  });

// Start the server
server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});




// socket.on('message', (data) => {
//     //sends the data to everyone except you.
// socket.broadcast.emit('response', data); 
// });
