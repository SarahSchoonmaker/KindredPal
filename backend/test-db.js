require("dotenv").config();
const mongoose = require("mongoose");

console.log("Testing MongoDB connection...");
console.log("URI:", process.env.MONGODB_URI); // This will show what it's reading

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("✅ Connected successfully!");
    process.exit(0);
  })
  .catch((err) => {
    console.error("❌ Connection failed:", err);
    process.exit(1);
  });
