

// first Logic in notfy 

// let connectedUsers = 0; // Initial connected users count

// module.exports = connectedUsers;


// second Logic in server ...............................................

const connectionsQueue = require("../bullconnection/connection");

// Notify module to manage connected users and logs
let notify = {
    connectedUsers: 0, // Initial count
    logs: [], // To store connection/disconnection logs
  
    increment: function () {
      this.connectedUsers++;
      this.addLog(`User connected. Total users: ${this.connectedUsers}`);
      connectionsQueue.add("notify", { connectedUsers: this.connectedUsers });
    },
  
    decrement: function () {
      if (this.connectedUsers > 0) this.connectedUsers--;
      this.addLog(`User disconnected. Total users: ${this.connectedUsers}`);
      connectionsQueue.add("notify", { connectedUsers: this.connectedUsers });
    },
  
    addLog: function (message) {
      const timestamp = new Date().toISOString();
      this.logs.push(`[${timestamp}] ${message}`);
      if (this.logs.length > 100) this.logs.shift(); // Keep logs manageable
    },
  
    getLogs: function () {
      return this.logs;
    },
  };
  
  module.exports = notify;
  