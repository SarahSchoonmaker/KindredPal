const mongoose = require("mongoose");
const User = require("../models/User");
const path = require("path");

require("dotenv").config({ path: path.join(__dirname, "..", ".env") });

async function fixLocationPreference() {
  try {
    if (!process.env.MONGODB_URI) {
      throw new Error("MONGODB_URI not found in environment variables");
    }

    console.log("🔗 Connecting to MongoDB...");
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ Connected to MongoDB");

    // Find users with "Home state"
    const result = await User.updateMany(
      { locationPreference: "Home state" },
      { $set: { locationPreference: "Same state" } },
    );

    console.log(
      `✅ Updated ${result.modifiedCount} users from "Home state" to "Same state"`,
    );

    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error("❌ Migration error:", error);
    await mongoose.connection.close();
    process.exit(1);
  }
}

fixLocationPreference();
