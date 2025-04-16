const { Kafka } = require('kafkajs');

const kafka = new Kafka({
  clientId: 'random-number-app',
  brokers: ['localhost:9092'], // Update if using Docker or remote broker
});

module.exports = kafka;
