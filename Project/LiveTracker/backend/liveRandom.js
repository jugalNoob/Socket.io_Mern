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

io.on('connection', (socket) => {
    console.log(`New user connected with ID: ${socket.id}`);

    // Emit random location updates every 3 seconds
    setInterval(() => {
        const randomLat = 32.7816291 + Math.random() * 0.01 - 0.005; // Adjust for your range
        const randomLng = 74.8215626 + Math.random() * 0.01 - 0.005;

        console.log(randomLat ,randomLng )
        socket.emit('locationUpdate', { lat: randomLat, lng: randomLng });
    }, 3000);

    // Handle client disconnection
    socket.on('disconnect', () => {
        console.log(`User disconnected with ID: ${socket.id}`);
    });
});

// Start the server
server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
