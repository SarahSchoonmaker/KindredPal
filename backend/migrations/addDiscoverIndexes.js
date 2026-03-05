// /backend/migrations/addDiscoverIndexes.js
// This makes discover queries MUCH faster

const mongoose = require("mongoose");
const path = require("path");

require("dotenv").config({ path: path.join(__dirname, "..", ".env") });

async function addDiscoverIndexes() {
  try {
    if (!process.env.MONGODB_URI) {
      throw new Error("MONGODB_URI not found in environment variables");
    }

    console.log("🔗 Connecting to MongoDB...");
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ Connected to MongoDB");

    const db = mongoose.connection.db;
    const usersCollection = db.collection("users");

    console.log("\n📊 Creating indexes for fast discover queries...");

    // Index for location filtering (city + state)
    await usersCollection.createIndex(
      { city: 1, state: 1 },
      { name: "discover_location_idx" },
    );
    console.log("✅ Created index: city + state");

    // Index for active users filter
    await usersCollection.createIndex(
      { isDeleted: 1, isActive: 1 },
      { name: "discover_active_idx" },
    );
    console.log("✅ Created index: isDeleted + isActive");

    // Compound index for discover query optimization
    await usersCollection.createIndex(
      { isDeleted: 1, isActive: 1, state: 1 },
      { name: "discover_compound_idx" },
    );
    console.log("✅ Created compound index: isDeleted + isActive + state");

    // Index for political beliefs filtering
    await usersCollection.createIndex(
      { politicalBeliefs: 1 },
      { name: "discover_political_idx" },
    );
    console.log("✅ Created index: politicalBeliefs");

    // Index for religion filtering
    await usersCollection.createIndex(
      { religion: 1 },
      { name: "discover_religion_idx" },
    );
    console.log("✅ Created index: religion");

    // Index for life stage filtering
    await usersCollection.createIndex(
      { lifeStage: 1 },
      { name: "discover_lifestage_idx" },
    );
    console.log("✅ Created index: lifeStage");

    console.log("\n📋 Listing all indexes:");
    const indexes = await usersCollection.indexes();
    indexes.forEach((index) => {
      console.log(`   - ${index.name}: ${JSON.stringify(index.key)}`);
    });

    await mongoose.connection.close();
    console.log("\n🎉 Indexes created successfully!");
    console.log("💡 Discover queries will now be MUCH faster!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Migration error:", error);
    console.error("Stack:", error.stack);
    await mongoose.connection.close();
    process.exit(1);
  }
}

addDiscoverIndexes();
