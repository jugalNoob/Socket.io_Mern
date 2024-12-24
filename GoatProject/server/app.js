const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const app = express();
const port = process.env.PORT || 9000;

const server = http.createServer(app);

// -- > < > < > Create HTTP server  check all http methods

 server.setTimeout(60000) // 60 seconds timeout
console.log(server.timeout)
console.log(server.requestTimeout)



// server to client communication
const io = socketIo(server, {
    cors: {
      origin: "http://localhost:3000", // Client's origin
      methods: ['GET', 'POST'],
      credentials: true,
    },
});


/// ----------- Service messgaeing start row class ------------------------->>>

// Count user connections to the server
let connectedUsers = 0; // Variable to track connected users

io.on('connection', (socket) => {

    // socket check connection
    console.log('New user connected', socket.id);
    connectedUsers++;
    console.log(`Total connected users: ${connectedUsers}`);

    // socket.broadcast.emit

  // Handle incoming chat messages
  socket.on('chat', (msg) => {
    console.log(`Message received: ${msg}`);
    // socket.broadcast.emit('chat', ` all user message Server received: ${msg}`)
    io.emit('chat', `message  received ${msg}`);
    io.emit('userCount', connectedUsers);
});




    socket.on('disconnect', () => {
        console.log('User disconnected');

        connectedUsers--;
        console.log(`User disconnected with ID: ${socket.id}`);
        console.log(`Total connected users: ${connectedUsers}`);
    
        // Emit the updated user count to all clients
        io.emit('userCount', connectedUsers);
    });
});

server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});