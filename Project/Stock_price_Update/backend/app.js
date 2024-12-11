const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
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



const shortId = require('shortid');

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  const interval = setInterval(async () => {
    const randomNumber = Math.floor(Math.random() * 100);
     // Emit the random number to the client
     socket.emit('randomNumber', randomNumber);
    const generatedShortId = shortId.generate();

    // console.log(`Generated shortId: ${generatedShortId}`);

    try {
      const newEntry = new Register({
        value: randomNumber,
        shortId: generatedShortId,
      });

      await newEntry.save();
      console.log('Random number saved to MongoDB:', randomNumber);
    } catch (error) {
      console.error('Error saving to MongoDB:', error);
    }
  }, 2000);

  socket.on('disconnect', () => {
    clearInterval(interval);
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
