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
