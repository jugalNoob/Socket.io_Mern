// const mongoose=require("mongoose")


//  const DB = "mongodb+srv://jugal786:jugal786@cluster0.sgg8t.mongodb.net/ones?retryWrites=true&w=majority";


// (async () => {
//   try {
//     if (!DB) {
//       throw new Error("Database URL not provided. Please set the DATAS environment variable.");
//     }

//     setTimeout(()=>{
//      mongoose.connect(DB, {
//             // useNewUrlParser: true,
//             // useUnifiedTopology: true
//           });
      
//           console.log("Connected to the database");
//     } , 3000)

  
//   } catch (err) {
//     console.error("Error connecting to the database:", err.message);
//   }
// })();


// db/conn.js
const mongoose = require('mongoose');

async function connectDB() {
  try {
    await mongoose.connect('mongodb+srv://jugal786:jugal786@cluster0.sgg8t.mongodb.net/ones?retryWrites=true&w=majority', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ MongoDB connected');
  } catch (err) {
    console.error('❌ MongoDB connection error:', err);
    process.exit(1);
  }
}

module.exports = connectDB;
