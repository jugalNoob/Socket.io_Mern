// server.js
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const shortid = require('shortid');
const connectDB = require('./db/conn');
const { sendMessage } = require('./producer');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: { origin: 'http://localhost:3000' },
});
const port = 9000;

app.use(cors());
app.use(express.json());

(async () => {
  await connectDB();

  io.on('connection', (socket) => {
    console.log('User connected:', socket.id);
    let lastRandomNumber = null;

    const emitInterval = setInterval(() => {
      lastRandomNumber = Math.floor(Math.random() * 100);
      socket.emit('randomNumber', lastRandomNumber);
      console.log('🔁 Sent to client:', lastRandomNumber);
    }, 2000);

    const saveInterval = setInterval(async () => {
      if (lastRandomNumber !== null) {
        const payload = {
          value: lastRandomNumber,
          shortId: shortid.generate(),
          timestamp: new Date().toISOString(),
        };

        try {
          await sendMessage("random-numbers", payload);
        } catch (err) {
          console.error("❌ Kafka error:", err);
        }
      }
    }, 30000);

    socket.on('disconnect', () => {
      clearInterval(emitInterval);
      clearInterval(saveInterval);
      console.log('User disconnected:', socket.id);
    });
  });

  server.listen(port, () => {
    console.log(`🚀 Server running at http://localhost:${port}`);
  });
})();
