// Test if bcrypt is working
const bcrypt = require("bcryptjs");

async function testBcrypt() {
  try {
    console.log("Testing bcrypt...\n");

    const plainPassword = "password123";
    console.log("Plain password:", plainPassword);

    const salt = await bcrypt.genSalt(10);
    console.log("Salt generated:", salt);

    const hashed = await bcrypt.hash(plainPassword, salt);
    console.log("Hashed password:", hashed);

    const isMatch = await bcrypt.compare(plainPassword, hashed);
    console.log("Password match:", isMatch);

    if (isMatch) {
      console.log("\n✅ Bcrypt is working correctly!");
    } else {
      console.log("\n❌ Bcrypt comparison failed!");
    }
  } catch (error) {
    console.error("❌ Bcrypt error:", error.message);
    console.log("\nTry installing bcryptjs:");
    console.log("  npm install bcryptjs");
  }
}

testBcrypt();
