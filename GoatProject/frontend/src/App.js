import React, { useEffect, useState } from 'react';
import "./chat.css"
import { io } from 'socket.io-client';

const socket = io('http://localhost:9000', {
    transports: ['websocket'], // Enforce WebSocket transport
});

function App() {
    const [chat, setChat] = useState('');
    const [message, setMessage] = useState(''); // State to hold input message
    const [senderread, SetSendRead] = useState([]); // Initialize as an empty array
    const [userCount, setUserCount] = useState()

    // Send custom message to server
    const sendChat = () => {
        if (message.trim()) {
            const newMessage = { sender: 'send  message', msg: message }; // Structure message
            console.log(`Sending message: ${message}`);
            socket.emit('chat', message); // Send to server
            SetSendRead((prevMessages) => [...prevMessages, newMessage]); // Append to state
            setMessage(''); // Clear input after sending
        }
    };

    let date=new Date();

    useEffect(() => {
        // Handle connection to the server

        socket.on('userCount', (count) => {

          // alert(`Total connected users: ${count}`)
          setUserCount(count)
        
        console.log(`Total connected users: ${count} Date ${date}`);
        });
        socket.on('connect', () => {
            console.log(`Connected to server with ID: ${socket.id}`);
        });

        // Receive chat messages from server
        socket.on('chat', (receivedMessage) => {
            const newMessage = { sender: '', msg: receivedMessage }; // Structure received message
            setChat(receivedMessage);
            SetSendRead((prevMessages) => [...prevMessages, newMessage]); // Append to state
            console.log('Received message:', receivedMessage);

          
        });

        // Clean up event listeners on unmount
        return () => {
            socket.off('connect');
            socket.off('chat');
            socket.off('userCount');
            socket.off('disconnect');
        };
    }, []);

    return (
        <div>
        <h1>{userCount}</h1>
            <h1>Jugal Sharma</h1>
            <ul>
                {senderread.map((msg, idx) => (
                    <li key={idx}>{`${msg.sender}: ${msg.msg}`}</li>
                ))}
            </ul>

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
