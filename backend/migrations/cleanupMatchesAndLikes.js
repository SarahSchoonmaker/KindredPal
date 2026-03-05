const mongoose = require("mongoose");
const User = require("../models/User");
const path = require("path");

require("dotenv").config({ path: path.join(__dirname, "..", ".env") });

async function cleanupMatchesAndLikes() {
  try {
    if (!process.env.MONGODB_URI) {
      throw new Error("MONGODB_URI not found in environment variables");
    }

    console.log("🔗 Connecting to MongoDB...");
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ Connected to MongoDB");

    const users = await User.find({});
    console.log(`📊 Found ${users.length} users`);

    let fixedCount = 0;

    for (const user of users) {
      let needsSave = false;

      console.log(`\n🔧 Checking user: ${user.email}`);

      // 1. Remove self from likes array
      const likesBeforeLength = user.likes.length;
      user.likes = user.likes.filter(
        (id) => id.toString() !== user._id.toString(),
      );
      if (user.likes.length < likesBeforeLength) {
        console.log(
          `   ✅ Removed self from likes (had ${likesBeforeLength}, now ${user.likes.length})`,
        );
        needsSave = true;
      }

      // 2. Remove self from matches array
      const matchesBeforeLength = user.matches.length;
      user.matches = user.matches.filter(
        (id) => id.toString() !== user._id.toString(),
      );
      if (user.matches.length < matchesBeforeLength) {
        console.log(
          `   ✅ Removed self from matches (had ${matchesBeforeLength}, now ${user.matches.length})`,
        );
        needsSave = true;
      }

      // 3. Remove duplicates from likes
      const uniqueLikes = [...new Set(user.likes.map((id) => id.toString()))];
      if (uniqueLikes.length < user.likes.length) {
        console.log(
          `   ✅ Removed duplicate likes (had ${user.likes.length}, now ${uniqueLikes.length})`,
        );
        user.likes = uniqueLikes.map((id) => new mongoose.Types.ObjectId(id));
        needsSave = true;
      }

      // 4. Remove duplicates from matches
      const uniqueMatches = [
        ...new Set(user.matches.map((id) => id.toString())),
      ];
      if (uniqueMatches.length < user.matches.length) {
        console.log(
          `   ✅ Removed duplicate matches (had ${user.matches.length}, now ${uniqueMatches.length})`,
        );
        user.matches = uniqueMatches.map(
          (id) => new mongoose.Types.ObjectId(id),
        );
        needsSave = true;
      }

      // 5. Remove duplicates from passed
      const uniquePassed = [...new Set(user.passed.map((id) => id.toString()))];
      if (uniquePassed.length < user.passed.length) {
        console.log(
          `   ✅ Removed duplicate passed (had ${user.passed.length}, now ${uniquePassed.length})`,
        );
        user.passed = uniquePassed.map((id) => new mongoose.Types.ObjectId(id));
        needsSave = true;
      }

      // 6. Verify matches are mutual
      for (const matchId of user.matches) {
        const otherUser = await User.findById(matchId);
        if (!otherUser) {
          console.log(`   ⚠️ Match ${matchId} doesn't exist - removing`);
          user.matches = user.matches.filter(
            (id) => id.toString() !== matchId.toString(),
          );
          needsSave = true;
          continue;
        }

        const isMutual = otherUser.matches.some(
          (id) => id.toString() === user._id.toString(),
        );

        if (!isMutual) {
          console.log(
            `   ⚠️ Non-mutual match with ${otherUser.email} - removing`,
          );
          user.matches = user.matches.filter(
            (id) => id.toString() !== matchId.toString(),
          );
          needsSave = true;
        }
      }

      if (needsSave) {
        await user.save({ validateBeforeSave: false });
        console.log(`   💾 Saved changes for ${user.email}`);
        fixedCount++;
      } else {
        console.log(`   ✓ No issues found for ${user.email}`);
      }
    }

    console.log(`\n✅ Cleanup complete! Fixed ${fixedCount} users`);
    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error("❌ Migration error:", error);
    console.error("Stack:", error.stack);
    await mongoose.connection.close();
    process.exit(1);
  }
}

cleanupMatchesAndLikes();
