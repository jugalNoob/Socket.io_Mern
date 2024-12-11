const express = require('express');
const http = require('http');
const axios = require('axios');
const socketIo = require('socket.io');

const app = express();
const port = process.env.PORT || 9000;
const server = http.createServer(app);

// Set up Socket.io
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:3000", // React app origin
    methods: ['GET', 'POST'],
    credentials: true,
  },
});


// Fetch Bitcoin price from CoinGecko
const fetchBitcoinPrice = async () => {
  try {
    const response = await axios.get('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd');
    console.log(response)
    return response.data.bitcoin.usd; // Return Bitcoin price in USD
  } catch (error) {
    console.error('Error fetching Bitcoin price:', error);
    return null;
  }
};

io.on('connection', (socket) => {
  console.log(`User connected: ${socket.id}`);

  // Emit the live Bitcoin price every 2 seconds
  const interval = setInterval(async () => {
    const price = await fetchBitcoinPrice();
    if (price !== null) {
      socket.emit('bitcoinPrice', price);
    }
  }, 2000);

  socket.on('disconnect', () => {
    clearInterval(interval); // Stop the interval when the user disconnects
    console.log('User disconnected');
  });
});

server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
