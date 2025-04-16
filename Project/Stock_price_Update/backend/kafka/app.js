const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors=require('cors')
const shortid = require('shortid'); // Import shortid library
const mongoose = require('mongoose'); // Import mongoose
const Register = require('./model/student'); // Import your MongoDB model
require('./db/coon'); // MongoDB connection









const { sendMessage } = require('./kafka/producer'); // Your Kafka producer util

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);
  let lastRandomNumber = null;

  const emitInterval = setInterval(() => {
    lastRandomNumber = Math.floor(Math.random() * 100);
    socket.emit('randomNumber', lastRandomNumber);
    console.log('Random number sent to client:', lastRandomNumber);
  }, 2000);

  const saveInterval = setInterval(async () => {
    if (lastRandomNumber !== null) {
      const payload = {
        value: lastRandomNumber,
        shortId: shortid.generate(),
        timestamp: new Date().toISOString()
      };

      try {
        await sendMessage("random-numbers", payload);
        console.log("📤 Random number sent to Kafka:", payload);
      } catch (err) {
        console.error("❌ Failed to send to Kafka:", err);
      }
    }
  }, 30000);

  socket.on('disconnect', () => {
    clearInterval(emitInterval);
    clearInterval(saveInterval);
    console.log('User disconnected:', socket.id);
  });
});
