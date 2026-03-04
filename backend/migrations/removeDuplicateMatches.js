const mongoose = require("mongoose");
const User = require("../models/User");
const path = require("path");

require("dotenv").config({ path: path.join(__dirname, "..", ".env") });

async function removeDuplicateMatches() {
  try {
    if (!process.env.MONGODB_URI) {
      throw new Error("MONGODB_URI not found in environment variables");
    }

    console.log("🔗 Connecting to MongoDB...");
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ Connected to MongoDB");

    const users = await User.find({});
    console.log(`📊 Checking ${users.length} users for duplicate matches`);

    let fixedCount = 0;

    for (const user of users) {
      let changed = false;

      // Remove duplicates from matches array
      const uniqueMatches = [
        ...new Set(user.matches.map((id) => id.toString())),
      ];

      if (uniqueMatches.length < user.matches.length) {
        console.log(`🔧 Fixing duplicates for ${user.email}`);
        console.log(`   Before: ${user.matches.length} matches`);
        console.log(`   After: ${uniqueMatches.length} matches`);

        // FIX: Use 'new' keyword
        user.matches = uniqueMatches.map(
          (id) => new mongoose.Types.ObjectId(id),
        );
        changed = true;
        fixedCount++;
      }

      // Also check likes array
      const uniqueLikes = [...new Set(user.likes.map((id) => id.toString()))];

      if (uniqueLikes.length < user.likes.length) {
        console.log(`   Fixed duplicate likes for ${user.email}`);
        user.likes = uniqueLikes.map((id) => new mongoose.Types.ObjectId(id));
        changed = true;
      }

      // Also check passed array
      const uniquePassed = [...new Set(user.passed.map((id) => id.toString()))];

      if (uniquePassed.length < user.passed.length) {
        console.log(`   Fixed duplicate passed for ${user.email}`);
        user.passed = uniquePassed.map((id) => new mongoose.Types.ObjectId(id));
        changed = true;
      }

      if (changed) {
        await user.save({ validateBeforeSave: false });
        console.log(`✅ Saved ${user.email}`);
      }
    }

    console.log(`\n✅ Fixed ${fixedCount} users with duplicate matches`);
    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error("❌ Migration error:", error);
    console.error("Stack:", error.stack);
    await mongoose.connection.close();
    process.exit(1);
  }
}

removeDuplicateMatches();
