const kafka = require('./kafka/client');
const Register = require('./model/student');
const connectDB = require('./db/coon');

async function runConsumer() {
  const consumer = kafka.consumer({ groupId: 'random-group' });

  await connectDB();
  await consumer.connect();
  await consumer.subscribe({ topic: 'random-numbers', fromBeginning: false });

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      const data = JSON.parse(message.value.toString());
      console.log("📥 Received from Kafka:", data);

      try {
        const newEntry = new Register({
          value: data.value,
          shortId: data.shortId,
          createdAt: data.timestamp,
        });

        await newEntry.save();
        console.log("✅ Saved to MongoDB:", newEntry);
      } catch (err) {
        console.error("❌ MongoDB save error:", err);
      }
    }
  });
}

runConsumer();
