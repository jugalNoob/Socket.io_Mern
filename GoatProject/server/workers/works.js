const { Worker, Queue } = require('bullmq');


// Worker to process jobs
const worker = new Worker(
    'emailQueue',
    async (job) => {
      try {
        console.log(`Processing job ${job.id}`);
        console.log(`Job data:`, JSON.stringify(job.data));
  
        // Simulate a delay for sending email
        await new Promise((resolve) => setTimeout(resolve, 3000));
        console.log('Email sent successfully!');
      } catch (err) {
        console.error(`Error processing job ${job.id}:`, err.message);
        throw err; // Mark job as failed
      }
    },
    {
      connection: {
        host: 'localhost',
        port: 6379,
      },
    }
  );
  
// Event listeners

// Worker event listeners
worker.on('completed', (job) => {
    console.log(`[${new Date().toISOString()}] Job ${job.id} completed successfully`);
  });
  
  worker.on('failed', (job, err) => {
    console.error(`[${new Date().toISOString()}] Job ${job.id} failed with error: ${err.message}`);
  });