// /backend/migrations/removeFinancialLifeStages.js
const mongoose = require("mongoose");
const User = require("../models/User");
require("dotenv").config();

async function removeFinancialLifeStages() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ Connected to MongoDB");

    const financialStages = [
      "Single Income No Kids (SINK)",
      "Dual-Income No Kids (DINK)",
    ];

    const usersWithFinancial = await User.find({
      lifeStage: { $in: financialStages },
    });

    console.log(
      `📊 Found ${usersWithFinancial.length} users with financial life stages`,
    );

    for (const user of usersWithFinancial) {
      console.log(`🔧 Updating user: ${user.email}`);

      // Remove financial stages
      user.lifeStage = user.lifeStage.filter(
        (stage) => !financialStages.includes(stage),
      );

      // If array is empty, add default
      if (user.lifeStage.length === 0) {
        user.lifeStage = ["Working Professional"];
      }

      await user.save({ validateBeforeSave: false });
      console.log(`✅ Updated ${user.email}: ${user.lifeStage.join(", ")}`);
    }

    console.log("\n✅ Migration complete!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Migration error:", error);
    process.exit(1);
  }
}

removeFinancialLifeStages();
