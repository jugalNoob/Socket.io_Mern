const kafka = require('./client');

let producer;

async function initProducer() {
  producer = kafka.producer();
  await producer.connect();
  console.log("✅ Kafka Producer connected");
}

async function sendMessage(topic, message) {
  if (!producer) await initProducer();

  await producer.send({
    topic,
    messages: [{ key: message.shortId, value: JSON.stringify(message) }]
  });
}

module.exports = { sendMessage };
