const mongoose = require("mongoose");
const User = require("../models/User");
require("dotenv").config();

async function removeRomanceFromUsers() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ Connected to MongoDB");

    // Find all users with "Romance" in lookingFor
    const usersWithRomance = await User.find({
      lookingFor: "Romance",
    });

    console.log(
      `📊 Found ${usersWithRomance.length} users with Romance in lookingFor`,
    );

    // Update each user
    for (const user of usersWithRomance) {
      console.log(`🔧 Updating user: ${user.email}`);

      // Remove "Romance" from lookingFor array
      user.lookingFor = user.lookingFor.filter((item) => item !== "Romance");

      // If array is empty, add "Friendship" as default
      if (user.lookingFor.length === 0) {
        user.lookingFor = ["Friendship"];
      }

      await user.save({ validateBeforeSave: false }); // Skip validation
      console.log(`✅ Updated ${user.email}: ${user.lookingFor.join(", ")}`);
    }

    console.log("\n✅ Migration complete!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Migration error:", error);
    process.exit(1);
  }
}

removeRomanceFromUsers();
