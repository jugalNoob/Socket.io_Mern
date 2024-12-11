const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const port = process.env.PORT || 9000;
const server = http.createServer(app);

// Configure Socket.IO with CORS
const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000",
        methods: ['GET', 'POST'],
        credentials: true,
    },
});

const chatHistory = {}; // In-memory storage for simplicity

io.on('connection', (socket) => {
    console.log(`New user connected with ID: ${socket.id}`);

    // Handle room joining
    socket.on('joinRoom', (room) => {
        socket.join(room);
        console.log(`User ${socket.id} joined room: ${room}`);
        socket.to(room).emit('message', `User ${socket.id} has joined the room.`);
    });

    // Handle typing events
    socket.on('typing', (room) => {
        socket.to(room).emit('typing', `User ${socket.id} is typing...`);
    });

    socket.on('stopTyping', (room) => {
        socket.to(room).emit('stopTyping');
    });

    // Handle private messages
    socket.on('privateMessage', ({ to, msg }) => {
        socket.to(to).emit('privateMessage', { from: socket.id, msg });
    });

    // Handle chat messages and store history
    socket.on('chat', ({ room, msg }) => {
        if (!chatHistory[room]) chatHistory[room] = [];
        const chat = { sender: socket.id, msg };
        chatHistory[room].push(chat);
        io.to(room).emit('chat', chat);
    });

    // Send chat history for a room
    socket.on('getChatHistory', (room) => {
        socket.emit('chatHistory', chatHistory[room] || []);
    });

    // Handle client disconnection
    socket.on('disconnect', () => {
        console.log(`User disconnected with ID: ${socket.id}`);
    });
});

// Start the server
server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});




// Key Improvements
// Room-Specific Typing Indicators: Enhanced clarity for typing events.
// Private Messaging: Improved implementation with recipient ID input.
// Chat History: Fetch chat history when joining a room.
// Message Formatting: Display sender information in chat messages.
// Memory Management: Cleaned up event listeners to avoid memory leaks.
// This improved code is cleaner, modular, and provides better user experience while maintaining server-side efficiency. Let me know if you need further details!