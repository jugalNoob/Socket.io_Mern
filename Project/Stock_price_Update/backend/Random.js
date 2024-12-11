const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const port = process.env.PORT || 9000;
const server = http.createServer(app);



// Configure CORS for Socket.IO
const io = socketIo(server, {
    cors: {
        origin: "http://localhost:3000", // Client origin
        methods: ['GET', 'POST'],
        credentials: true,
    },
});





io.on('connection', (socket) => {

    console.log(`⚡: ${socket.id} user just connected`);

    // Emit the current color to the connected client
  
    let interval=setInterval(()=>{
      let randoms = Math.floor(Math.random() * 16777215); 
      socket.emit('currentColor', randoms);

    } , 2000)
 

  
  
    socket.on('disconnect', () => {
   

      clearInterval(interval);  // Clear the interval when user disconnects
      console.log(`User disconnected with ID: ${socket.id}`);
   
    
    });
  });

// Start the server
server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});


  // Emit the updated user count to all clients
  // io.emit('userCount', (message)=>{
  //   console.log(  message , "color changes" )
  // });

// socket.on('message', (data) => {
//     //sends the data to everyone except you.
// socket.broadcast.emit('response', data); 
// });
