const { Queue } = require('bullmq');

// Initialize the queue
const connectionQueue = new Queue('emailQueue', {
    connection: {
        host: 'localhost',
        port: 6379,
    },
});




console.log("Connecting to")






module.exports = connectionQueue;