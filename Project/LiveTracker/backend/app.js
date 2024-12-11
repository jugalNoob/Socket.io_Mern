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

// Store user data for connected clients
const users = {};

io.on('connection', (socket) => {
    console.log(`New user connected: ${socket.id}`);


    socket.on('send-location', (data) => {
        console.log(`Location from ${socket.id}:`, data);

        // update the location 

        io.emit("receive-location"  ,  {id:socket.id , ...data})
      
    });

    socket.on('disconnect', () => {
        console.log(`User disconnected: ${socket.id}`);
        // Remove the user from the list when they disconnect
        delete users[socket.id];
    });
});

// Start the server
server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
