// /backend/migrations/clearLikesAndPassed.js
// USE THIS FOR TESTING ONLY - clears likes and passed arrays

const mongoose = require("mongoose");
const User = require("../models/User");
const path = require("path");

require("dotenv").config({ path: path.join(__dirname, "..", ".env") });

async function clearLikesAndPassed() {
  try {
    if (!process.env.MONGODB_URI) {
      throw new Error("MONGODB_URI not found in environment variables");
    }

    console.log("🔗 Connecting to MongoDB...");
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ Connected to MongoDB");

    // OPTION 1: Clear for a specific user (for testing)
    const userEmail = "sarah1@gmail.com"; // Change this to your test user

    console.log(`\n🧹 Clearing likes and passed for ${userEmail}...`);

    const user = await User.findOne({ email: userEmail });

    if (user) {
      console.log(`   Current likes: ${user.likes.length}`);
      console.log(`   Current passed: ${user.passed.length}`);

      user.likes = [];
      user.passed = [];

      await user.save({ validateBeforeSave: false });

      console.log(`✅ Cleared likes and passed for ${userEmail}`);
    } else {
      console.log(`❌ User ${userEmail} not found`);
    }

    // OPTION 2: Clear for ALL users (uncomment if needed)
    /*
    console.log("\n🧹 Clearing likes and passed for ALL users...");
    
    const result = await User.updateMany(
      {},
      {
        $set: {
          likes: [],
          passed: [],
        },
      }
    );
    
    console.log(`✅ Updated ${result.modifiedCount} users`);
    */

    await mongoose.connection.close();
    console.log("\n🎉 Migration complete!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Migration error:", error);
    console.error("Stack:", error.stack);
    await mongoose.connection.close();
    process.exit(1);
  }
}

clearLikesAndPassed();
