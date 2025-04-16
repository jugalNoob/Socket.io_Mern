const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors=require('cors')
const shortid = require('shortid'); // Import shortid library
const mongoose = require('mongoose'); // Import mongoose
const Register = require('./model/student'); // Import your MongoDB model
require('./db/coon'); // MongoDB connection

const app = express();
const server = http.createServer(app);
const port = process.env.PORT || 9000;

const io = socketIo(server, {
  cors: {
    origin: 'http://localhost:3000', // React app origin
  
  },
});


const corsOption = {
  origin: "http://localhost:3000",
  methods: "GET,POST,PUT,DELETE,PATCH,HEAD",
  credentials: true
};

app.use(cors(corsOption));

const shortId = require('shortid');



io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  let lastRandomNumber = null; // Store the latest random number

  // Emit random number every 2 seconds
  const emitInterval = setInterval(() => {
    lastRandomNumber = Math.floor(Math.random() * 100);
    socket.emit('randomNumber', lastRandomNumber);
    console.log('Random number sent to client:', lastRandomNumber);
  }, 2000);

  // Save the last emitted number to MongoDB every 5 seconds
  const saveInterval = setInterval(async () => {
    if (lastRandomNumber !== null) {
      const generatedShortId = shortId.generate();

      try {
        const newEntry = new Register({
          value: lastRandomNumber,
          shortId: generatedShortId,
        });

        await newEntry.save();
        console.log('Random number saved to MongoDB:', lastRandomNumber);
      } catch (error) {
        console.error('Error saving to MongoDB:', error);
      }
    }
  }, 30000);

  socket.on('disconnect', () => {
    clearInterval(emitInterval);
    clearInterval(saveInterval);
    console.log('User disconnected:', socket.id);
  });
});




// Example route (if needed)
app.get('/home', async (req, res) => {
  try {
    const data = await Register.find(); // Retrieve all data from the database
    res.json(data);
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).send('Server Error');
  }
});

server.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
