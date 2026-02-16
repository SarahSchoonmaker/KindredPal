// Add to backend/routes/users.js
const logger = require("../utils/logger");

// Unmatch with a user
router.post("/unmatch/:userId", auth, async (req, res) => {
  try {
    const currentUser = await User.findById(req.userId);
    const targetUser = await User.findById(req.params.userId);

    if (!targetUser) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if they are matched
    if (!currentUser.matches.includes(targetUser._id)) {
      return res.status(400).json({ message: "Not matched with this user" });
    }

    // Remove from both users' matches
    currentUser.matches = currentUser.matches.filter(
      (id) => !id.equals(targetUser._id),
    );
    targetUser.matches = targetUser.matches.filter(
      (id) => !id.equals(currentUser._id),
    );

    // Also remove from likes if present
    currentUser.likes = currentUser.likes.filter(
      (id) => !id.equals(targetUser._id),
    );
    targetUser.likes = targetUser.likes.filter(
      (id) => !id.equals(currentUser._id),
    );

    await currentUser.save();
    await targetUser.save();

    logger.info("✅ Unmatched:", currentUser.name, "and", targetUser.name);

    res.json({
      message: "Successfully unmatched",
      unmatchedUser: {
        _id: targetUser._id,
        name: targetUser.name,
      },
    });
  } catch (error) {
    logger.error("Unmatch error:", error);
    res.status(500).json({ message: "Error unmatching user" });
  }
});
