// Handle socket.io connections
io.on('connection', socket => {
    console.log('New client connected');
  
    // Handle signaling data
    socket.on('signal', data => {
      socket.broadcast.emit('signal', data);
    });
  
    // Handle client disconnection
    socket.on('disconnect', () => {
      console.log('Client disconnected');
    });
  });
  Key Improvements and Explanation
Enhanced Console Logs:

Added socket.id to the logs to clarify which user is sending or disconnecting.
Distinguish between messages sent by the client (Sending message: ${message}) and messages received (Received message:).
Organized Event Handling:

Broadcast messages only to other clients using socket.broadcast.emit, ensuring the sender does not receive their own message back.
Clearer Commenting:

Added comments to each part of the connection process and event handling to enhance readability.
This setup provides detailed tracking of user actions and message flow, ideal for debugging and monitoring sender/receiver interactions.

1----<><><><>::::::::::::   Code with chat function   ::::::::::

io.emit('chat', ` all user message Server received: ${msg}`);

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


io.on('connection', (socket) => {

    // socket check connection
    console.log('New user connected', socket.id);


    // socket.broadcast.emit

  // Handle incoming chat messages
  socket.on('chat', (msg) => {
    console.log(`Message received: ${msg}`);
    // socket.broadcast.emit('chat', ` all user message Server received: ${msg}`)
    io.emit('chat', ` all user message Server received: ${msg}`);
});




    socket.on('disconnect', () => {
        console.log('User disconnected');
    });
});

server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

///React code example
import React, { useEffect, useState } from 'react';
import { io } from 'socket.io-client';

const socket = io('http://localhost:9000', {
    transports: ['websocket'], // Enforce WebSocket transport
});

function App() {
    const [chat, setChat] = useState('');
    const [message, setMessage] = useState(''); // State to hold input message

    // Send custom message to server
    const sendChat = () => {
        if (message.trim()) {
            console.log(`Sending message: ${message}`);
            socket.emit('chat', message);
            setMessage(''); // Clear input after sending
        }
    };

    useEffect(() => {
        // Handle connection to the server
        socket.on('connect', () => {
            console.log(`Connected to server with ID: ${socket.id}`);
        });

        // Receive chat messages from server
        socket.on('chat', (receivedMessage) => {
            setChat(receivedMessage);
            console.log('Received message:', receivedMessage);
        });

        // Clean up event listeners on unmount
        return () => {
            socket.off('connect');
            socket.off('chat');
        };
    }, []);

    return (
        <div>
            <h1>Jugal Sharma</h1>
            <p>Message from server: {chat}</p>

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


2 ;;;;;:::::::::::::::  // socket.broadcast.emit  ??????????

with sender and reciver  ::


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

    // Handle incoming chat messages
    socket.on('chat', (msg) => {
        console.log(`Message from ${socket.id}: ${msg}`);
        
        // Broadcast message to all other clients except the sender
        socket.broadcast.emit('chat', `Message from another user: ${msg}`);
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



2:::import React, { useEffect, useState } from 'react';
import { io } from 'socket.io-client';

const socket = io('http://localhost:9000', {
    transports: ['websocket'], // Enforce WebSocket transport
});

function App() {
    const [chat, setChat] = useState('');
    const [message, setMessage] = useState(''); // State to hold input message

    // Send custom message to server
    const sendChat = () => {
        if (message.trim()) {
            console.log(`Sending message: ${message}`);
            socket.emit('chat', message);
            setMessage(''); // Clear input after sending
        }
    };

    useEffect(() => {
        // Handle connection to the server
        socket.on('connect', () => {
            console.log(`Connected to server with ID: ${socket.id}`);
        });

        // Receive chat messages from server
        socket.on('chat', (receivedMessage) => {
            setChat(receivedMessage);
            console.log('Received message:', receivedMessage);
        });

        // Clean up event listeners on unmount
        return () => {
            socket.off('connect');
            socket.off('chat');
        };
    }, []);

    return (
        <div>
            <h1>Jugal Sharma</h1>
            <p>Message from server: {chat}</p>

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
