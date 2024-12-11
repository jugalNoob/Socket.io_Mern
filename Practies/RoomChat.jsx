1:::::::::::::::::::: Simple Room create  ::::::::::::::::::::::::

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

    // Handle joining a room
    socket.on('joinRoom', (room) => {
        socket.join(room);
        console.log(`User ${socket.id} joined room: ${room}`);
        socket.to(room).emit('message', `User ${socket.id} has joined the room.`);
    });

    // Handle leaving a room
    socket.on('leaveRoom', (room) => {
        socket.leave(room);
        console.log(`User ${socket.id} left room: ${room}`);
        socket.to(room).emit('message', `User ${socket.id} has left the room.`);
    });

    // Handle incoming chat messages for a specific room
    socket.on('chat', ({ room, msg }) => {
        console.log(`Message from ${socket.id} in room ${room}: ${msg}`);
        io.to(room).emit('chat', `Message from ${socket.id}: ${msg}`);
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

..Client  exmaple 

import React, { useEffect, useState } from 'react';
import { io } from 'socket.io-client';

const socket = io('http://localhost:9000', {
    transports: ['websocket'],
});

function App() {
    const [room, setRoom] = useState('');
    const [chatMessages, setChatMessages] = useState([]);
    const [message, setMessage] = useState('');

    const joinRoom = () => {
        if (room.trim()) {
            socket.emit('joinRoom', room.trim());
            console.log(`Joined room: ${room}`);
        }
    };

    const sendChat = () => {
        if (message.trim()) {
            socket.emit('chat', { room, msg: message.trim() });
            setMessage('');
        }
    };

    useEffect(() => {
        socket.on('connect', () => {
            console.log(`Connected to server with ID: ${socket.id}`);
        });

        socket.on('chat', (receivedMessage) => {
            setChatMessages((prevMessages) => [...prevMessages, receivedMessage]);
        });

        return () => {
            socket.off('connect');
            socket.off('chat');
        };
    }, []);

    return (
        <div>
            <h1>Jugal Sharma</h1>

            <div>
                <input
                    type="text"
                    value={room}
                    onChange={(e) => setRoom(e.target.value)}
                    placeholder="Enter room name"
                />
                <button onClick={joinRoom}>Join Room</button>
            </div>

            <div>
                <h3>Chat Messages</h3>
                <ul>
                    {chatMessages.map((msg, idx) => (
                        <li key={idx}>{msg}</li>
                    ))}
                </ul>
            </div>

            <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type your message"
            />
            <button onClick={sendChat}>Send Message</button>
        </div>
    );
}

export default App;

::::::::::::::::::::::: Advance  Room  Cretae ::::::::::::::::::::::::::::::::::::::::::::

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



::: ........ Client exmaple Chat ::::::

import React, { useEffect, useState } from 'react';
import { io } from 'socket.io-client';

const socket = io('http://localhost:9000', {
    transports: ['websocket'],
});

function App() {
    const [room, setRoom] = useState('');
    const [chatMessages, setChatMessages] = useState([]);
    const [message, setMessage] = useState('');
    const [typingMessage, setTypingMessage] = useState('');
    const [recipientId, setRecipientId] = useState('');

    // Join a room
    const joinRoom = () => {
        if (room.trim()) {
            socket.emit('joinRoom', room.trim());
            console.log(`Joined room: ${room}`);
        }
    };

    // Send a chat message to the current room
    const sendChat = () => {
        if (message.trim()) {
            socket.emit('chat', { room, msg: message.trim() });
            setMessage('');
        }
    };

    // Notify server about typing activity
    const handleTyping = () => {
        socket.emit('typing', room);
        setTimeout(() => socket.emit('stopTyping', room), 1000);
    };

    // Send a private message
    const sendPrivateMessage = () => {
        if (recipientId.trim() && message.trim()) {
            socket.emit('privateMessage', { to: recipientId.trim(), msg: message.trim() });
            setMessage('');
        }
    };

    useEffect(() => {
        // Socket listeners
        socket.on('chat', (receivedMessage) => {
            setChatMessages((prevMessages) => [...prevMessages, receivedMessage]);
        });

        socket.on('typing', (message) => setTypingMessage(message));
        socket.on('stopTyping', () => setTypingMessage(''));
        socket.on('privateMessage', ({ from, msg }) => {
            alert(`Private message from ${from}: ${msg}`);
        });

        socket.on('chatHistory', (history) => setChatMessages(history));

        return () => {
            // Cleanup listeners on component unmount
            socket.off('chat');
            socket.off('typing');
            socket.off('stopTyping');
            socket.off('privateMessage');
            socket.off('chatHistory');
        };
    }, []);

    useEffect(() => {
        // Fetch chat history when room changes
        if (room.trim()) {
            socket.emit('getChatHistory', room);
        }
    }, [room]);

    return (
        <div>
            <h1>Chat Application</h1>

            {/* Room Input */}
            <div>
                <input
                    type="text"
                    value={room}
                    onChange={(e) => setRoom(e.target.value)}
                    placeholder="Enter room name"
                />
                <button onClick={joinRoom}>Join Room</button>
            </div>

            {/* Typing Indicator */}
            {typingMessage && <p>{typingMessage}</p>}

            {/* Chat Messages */}
            <div>
                <h3>Chat Messages</h3>
                <ul>
                    {chatMessages.map((msg, idx) => (
                        <li key={idx}>{`${msg.sender || 'Anonymous'}: ${msg.msg}`}</li>
                    ))}
                </ul>
            </div>

            {/* Message Input */}
            <input
                type="text"
                value={message}
                onChange={(e) => {
                    setMessage(e.target.value);
                    handleTyping();
                }}
                placeholder="Type your message"
            />
            <button onClick={sendChat}>Send Message</button>

            {/* Private Message */}
            <div>
                <input
                    type="text"
                    value={recipientId}
                    onChange={(e) => setRecipientId(e.target.value)}
                    placeholder="Recipient ID"
                />
                <button onClick={sendPrivateMessage}>Send Private Message</button>
            </div>
        </div>
    );
}

export default App;
