require("dotenv").config();
const mongoose = require("mongoose");
const User = require("./models/User");

const sampleUsers = [
  {
    email: "sarah@example.com",
    password: "password123",
    name: "Sarah Mitchell",
    age: 32,
    gender: "Female",
    city: "Portland",
    state: "OR",
    bio: "Passionate about sustainable living and building meaningful connections. Love hiking, reading philosophy, and volunteering at the local animal shelter.",
    profilePhoto:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop",
    politicalBeliefs: ["Liberal", "Progressive"],
    religion: "Spiritual but not religious",
    causes: [
      "Environment & Climate",
      "Animal Welfare",
      "Sustainability",
      "Mental Health",
      "Community Service",
    ],
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
    bio: "Dad of two wonderful kids, coffee enthusiast, and tech professional. Looking to expand my social circle and meet others who value work-life balance.",
    profilePhoto:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop",
    politicalBeliefs: ["Moderate", "Independent"],
    religion: "Agnostic",
    causes: [
      "Technology & Innovation",
      "Education",
      "Family & Parenting",
      "Entrepreneurship",
    ],
    lifeStage: ["Married", "Have children", "Working professional"],
    lookingFor: ["Friendship", "Networking"],
  },
  {
    email: "elena@example.com",
    password: "password123",
    name: "Elena Rodriguez",
    age: 45,
    gender: "Female",
    city: "Portland",
    state: "OR",
    bio: "Recently retired teacher finding new purpose through community service. Love gardening, cooking, and long conversations over tea.",
    profilePhoto:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop",
    politicalBeliefs: ["Moderate"],
    religion: "Catholic",
    causes: [
      "Education",
      "Community Service",
      "Arts & Culture",
      "Food & Nutrition",
    ],
    lifeStage: ["Widowed", "Retired", "Empty nester"],
    lookingFor: ["Friendship", "Community"],
  },
  {
    email: "david@example.com",
    password: "password123",
    name: "David Park",
    age: 28,
    gender: "Male",
    city: "Portland",
    state: "OR",
    bio: "Graduate student studying environmental science. Activist for climate action. Always up for outdoor adventures and deep discussions about making the world better.",
    profilePhoto:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop",
    politicalBeliefs: ["Progressive", "Liberal"],
    religion: "Atheist",
    causes: [
      "Environment & Climate",
      "Social Justice",
      "Sustainability",
      "Animal Welfare",
      "Racial Equality",
    ],
    lifeStage: ["Single", "Grad student", "Child-free by choice"],
    lookingFor: ["Friendship", "Romance", "Activity Partner"],
  },
  {
    email: "rachel@example.com",
    password: "password123",
    name: "Rachel Kim",
    age: 35,
    gender: "Female",
    city: "Portland",
    state: "OR",
    bio: "Yoga instructor and wellness coach. Believe in mindful living and creating authentic connections. Looking for like-minded souls who value growth and compassion.",
    profilePhoto:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=400&fit=crop",
    politicalBeliefs: ["Liberal"],
    religion: "Spiritual but not religious",
    causes: [
      "Health & Wellness",
      "Fitness & Active Living",
      "Mental Health",
      "Spirituality",
      "Environment & Climate",
    ],
    lifeStage: ["Divorced", "Working professional", "Child-free by choice"],
    lookingFor: ["Friendship", "Romance", "Community"],
  },
  {
    email: "james@example.com",
    password: "password123",
    name: "James Thompson",
    age: 52,
    gender: "Male",
    city: "Portland",
    state: "OR",
    bio: "Small business owner and community volunteer. Love jazz music, cooking, and mentoring young entrepreneurs. Looking for genuine friendships.",
    profilePhoto:
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=400&fit=crop",
    politicalBeliefs: ["Moderate", "Independent"],
    religion: "Christian",
    causes: [
      "Entrepreneurship",
      "Community Service",
      "Education",
      "Arts & Culture",
      "Economic Justice",
    ],
    lifeStage: ["Married", "Empty nester", "Working professional"],
    lookingFor: ["Friendship", "Networking", "Mentor"],
  },
];

async function seedDatabase() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ Connected to MongoDB");

    await User.deleteMany({});
    console.log("🗑️  Cleared existing users");

    const createdUsers = await User.insertMany(sampleUsers);
    console.log(`✅ Created ${createdUsers.length} sample users`);

    createdUsers.forEach((user) => {
      console.log(`   - ${user.name} (${user.email})`);
      console.log(`     Life Stage: ${user.lifeStage.join(", ")}`);
      console.log(`     Top Causes: ${user.causes.slice(0, 3).join(", ")}`);
    });

    console.log("\n📝 Test credentials:");
    console.log("   Email: sarah@example.com");
    console.log("   Password: password123");
    console.log("\n✨ Database seeded successfully!");

    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding database:", error);
    process.exit(1);
  }
}

seedDatabase();
