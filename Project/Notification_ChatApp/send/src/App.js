import React, { useEffect } from 'react';
import { io } from 'socket.io-client';

const socket = io('http://localhost:9000', {
  transports: ['websocket'], // Enforce WebSocket transport
});

function App() {

  let date=new Date();


  useEffect(() => {
    socket.on('connect', () => {
      console.log(`Connected to server with ID: ${socket.id}`);
    });
  
    socket.on('userCount', (count) => {

      alert(`Total connected users: ${count}`)
    
    console.log(`Total connected users: ${count} Date ${date}`);
    });
  
    socket.on('disconnect', () => {
      console.log('Disconnected from server');
    });
  
    return () => {
      socket.off('connect');
      socket.off('userCount');
      socket.off('disconnect');
    };
  }, []);

  return (
    <div>
      <h1>Socket.IO React Client</h1>
      {/* You can add input fields or a chat window here */}
    </div>
  );
}

export default App;

