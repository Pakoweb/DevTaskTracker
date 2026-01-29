require("dotenv").config();
const mongoose = require("mongoose");

async function checkConnection() {
  try {
    console.log("Testing MongoDB Connection...");
    if (!process.env.MONGODB_URI) {
      throw new Error("MONGODB_URI is missing in .env");
    }
    console.log("URI found:", process.env.MONGODB_URI.replace(/:([^:@]+)@/, ":****@")); // Hide password
    
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ Connection Successful!");
    
    await mongoose.connection.close();
    console.log("Connection closed.");
  } catch (err) {
    console.error("❌ Connection Failed:", err.message);
  }
}

checkConnection();
