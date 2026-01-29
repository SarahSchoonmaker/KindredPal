// FIXED version - saves users one by one to trigger password hashing
require("dotenv").config();
const mongoose = require("mongoose");
const User = require("./models/User");

const testUsers = [
  {
    email: "test@test.com",
    password: "password123",
    name: "Test User",
    age: 30,
    gender: "Female",
    city: "Portland",
    state: "OR",
    bio: "Test user for login",
    profilePhoto:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop",
    politicalBeliefs: ["Moderate"],
    religion: "Agnostic",
    causes: [
      "Health & Wellness",
      "Education & Continuous Learning",
      "Community Service",
    ],
    lifeStage: ["Single", "Working professional"],
    lookingFor: ["Friendship"],
  },
  {
    email: "sarah@example.com",
    password: "password123",
    name: "Sarah Mitchell",
    age: 32,
    gender: "Female",
    city: "Portland",
    state: "OR",
    bio: "Passionate about sustainable living and building meaningful connections.",
    profilePhoto:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop",
    politicalBeliefs: ["Liberal", "Progressive"],
    religion: "Spiritual but not religious",
    causes: ["Environment & Climate", "Animal Welfare", "Sustainability"],
    lifeStage: ["Single", "Working professional", "Child-free by choice"],
    lookingFor: ["Friendship", "Romance"],
  },
  {
    email: "marcus@example.com",
    password: "password123",
    name: "Marcus Chen",
    age: 38,
    gender: "Male",
    city: "Portland",
    state: "OR",
    bio: "Dad of two, tech professional, looking to expand my social circle.",
    profilePhoto:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop",
    politicalBeliefs: ["Moderate", "Independent"],
    religion: "Agnostic",
    causes: [
      "Technology & Innovation",
      "Education & Continuous Learning",
      "Family & Parenting",
    ],
    lifeStage: ["Married", "Have children", "Working professional"],
    lookingFor: ["Friendship", "Networking"],
  },
];

async function resetDatabase() {
  try {
    console.log("🔌 Connecting to MongoDB...");
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ Connected to MongoDB");

    // DELETE EVERYTHING
    console.log("🗑️  Deleting ALL users...");
    const deleteResult = await User.deleteMany({});
    console.log(`   Deleted ${deleteResult.deletedCount} users`);

    // CREATE NEW TEST USERS - ONE BY ONE to trigger pre-save hook
    console.log("📝 Creating test users (with password hashing)...\n");

    for (const userData of testUsers) {
      const user = new User(userData);
      await user.save(); // This triggers the pre-save hook!
      console.log(`✅ Created: ${user.name} (${user.email})`);
      console.log(`   Password hashed: ${user.password.substring(0, 20)}...`);
    }

    console.log("\n📋 Test Accounts:");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    testUsers.forEach((user) => {
      console.log(`📧 Email: ${user.email}`);
      console.log(`🔑 Password: password123`);
      console.log(`👤 Name: ${user.name}`);
      console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    });

    console.log("\n✨ Database reset complete with HASHED passwords!");
    console.log("🚀 You can now login with any of the emails above\n");

    process.exit(0);
  } catch (error) {
    console.error("❌ Error:", error);
    process.exit(1);
  }
}

resetDatabase();
