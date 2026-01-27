const express = require("express");
const router = express.Router();
const User = require("../models/User");
const auth = require("../middleware/auth");

// Get discover users (exclude logged-in user, already liked/passed users)
router.get("/discover", auth, async (req, res) => {
  try {
    console.log("📥 Discover request from user:", req.userId);

    const currentUser = await User.findById(req.userId);
    if (!currentUser) {
      return res.status(404).json({ message: "User not found" });
    }

    // Get users to exclude
    const excludeIds = [
      req.userId, // Exclude self
      ...currentUser.likes,
      ...currentUser.matches,
      ...currentUser.passed,
    ];

    console.log("🚫 Excluding user IDs:", excludeIds.length);

    // Find potential matches
    const users = await User.find({
      _id: { $nin: excludeIds },
      isActive: true,
    }).limit(20);

    console.log("✅ Found", users.length, "potential matches");

    // Calculate match scores
    const usersWithScores = users.map((user) => ({
      ...user.toObject(),
      matchScore: currentUser.calculateMatchScore(user),
    }));

    // Sort by match score
    usersWithScores.sort((a, b) => b.matchScore - a.matchScore);

    res.json({
      users: usersWithScores,
    });
  } catch (error) {
    console.error("Discover users error:", error);
    res.status(500).json({ message: "Error fetching users" });
  }
});

// Get matches
router.get("/matches", auth, async (req, res) => {
  try {
    const user = await User.findById(req.userId).populate(
      "matches",
      "-password",
    );
    res.json(user.matches);
  } catch (error) {
    console.error("Get matches error:", error);
    res.status(500).json({ message: "Error fetching matches" });
  }
});

// Get users who liked you
router.get("/likes-you", auth, async (req, res) => {
  try {
    console.log("📥 Getting users who liked:", req.userId);

    const currentUser = await User.findById(req.userId);
    if (!currentUser) {
      return res.status(404).json({ message: "User not found" });
    }

    // Find users who liked you (but you haven't liked back yet)
    const usersWhoLikedYou = await User.find({
      likes: currentUser._id, // They have you in their likes
      _id: {
        $nin: [
          ...currentUser.likes, // Exclude users you already liked
          ...currentUser.matches, // Exclude existing matches
          ...currentUser.passed, // Exclude users you passed on
        ],
      },
    }).select("-password");

    console.log("✅ Found", usersWhoLikedYou.length, "users who liked you");

    // Calculate match scores
    const usersWithScores = usersWhoLikedYou.map((user) => ({
      ...user.toObject(),
      matchScore: currentUser.calculateMatchScore(user),
    }));

    // Sort by match score
    usersWithScores.sort((a, b) => b.matchScore - a.matchScore);

    res.json({
      users: usersWithScores,
    });
  } catch (error) {
    console.error("❌ Get likes you error:", error);
    res.status(500).json({ message: "Error fetching likes" });
  }
});

// Get search preferences
router.get("/preferences", auth, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    res.json({
      searchPreferences: user.searchPreferences || {
        ageRange: { min: 35, max: 55 },
        maxDistance: 50,
        lifeStage: [],
        politics: [],
        religion: [],
        lookingFor: "either",
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// Get another user's profile (for viewing matches)
router.get("/profile/:userId", auth, async (req, res) => {
  try {
    console.log("📥 Getting profile for user:", req.params.userId);

    const currentUser = await User.findById(req.userId);
    const targetUser = await User.findById(req.params.userId).select(
      "-password",
    );

    if (!targetUser) {
      console.log("❌ Target user not found");
      return res.status(404).json({ message: "User not found" });
    }

    // Check if they're matched (only allow viewing matched profiles)
    const isMatch = currentUser.matches.includes(targetUser._id);

    if (!isMatch) {
      console.log("❌ Not matched - access denied");
      return res
        .status(403)
        .json({ message: "You can only view profiles of your matches" });
    }

    console.log("✅ Returning profile for:", targetUser.name);

    res.json(targetUser.toObject());
  } catch (error) {
    console.error("❌ Get user profile error:", error);
    res.status(500).json({ message: "Error fetching profile" });
  }
});

// Get user by ID (for viewing profiles) - MUST BE AFTER SPECIFIC ROUTES
router.get("/:userId", auth, async (req, res) => {
  try {
    console.log("📥 Getting user by ID:", req.params.userId);

    const user = await User.findById(req.params.userId).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    console.log("✅ Returning user:", user.name);
    res.json(user);
  } catch (error) {
    console.error("❌ Error fetching user:", error);
    res.status(500).json({ message: "Error fetching user" });
  }
});

// Like a user
router.post("/like/:userId", auth, async (req, res) => {
  try {
    const currentUser = await User.findById(req.userId);
    const targetUser = await User.findById(req.params.userId);

    if (!targetUser) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if already liked
    if (currentUser.likes.includes(targetUser._id)) {
      return res.json({
        message: "Already liked",
        dailyLikesRemaining: currentUser.dailyLikes.count,
        isMatch: false,
      });
    }

    // Add like
    currentUser.likes.push(targetUser._id);

    // Decrease daily likes count if not premium
    if (!currentUser.hasUnlimitedLikes()) {
      currentUser.dailyLikes.count -= 1;
    }

    // Check for match
    const isMatch = targetUser.likes.includes(currentUser._id);
    if (isMatch) {
      currentUser.matches.push(targetUser._id);
      targetUser.matches.push(currentUser._id);
      await targetUser.save();
    }

    await currentUser.save();

    res.json({
      message: isMatch ? "Match!" : "Liked",
      dailyLikesRemaining: currentUser.dailyLikes.count,
      isMatch,
      matchedUser: isMatch
        ? {
            _id: targetUser._id,
            name: targetUser.name,
            profilePhoto: targetUser.profilePhoto,
          }
        : null,
    });
  } catch (error) {
    console.error("Like user error:", error);
    res.status(500).json({ message: "Error liking user" });
  }
});

// Pass on a user
router.post("/pass/:userId", auth, async (req, res) => {
  try {
    const currentUser = await User.findById(req.userId);
    const targetUserId = req.params.userId;

    if (!currentUser.passed.includes(targetUserId)) {
      currentUser.passed.push(targetUserId);
      await currentUser.save();
    }

    res.json({ message: "Passed" });
  } catch (error) {
    console.error("Pass user error:", error);
    res.status(500).json({ message: "Error passing user" });
  }
});

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

    console.log("✅ Unmatched:", currentUser.name, "and", targetUser.name);

    res.json({
      message: "Successfully unmatched",
      unmatchedUser: {
        _id: targetUser._id,
        name: targetUser.name,
      },
    });
  } catch (error) {
    console.error("Unmatch error:", error);
    res.status(500).json({ message: "Error unmatching user" });
  }
});

// Update profile
router.put("/profile", auth, async (req, res) => {
  try {
    console.log("📥 Profile update request");
    console.log("Request body keys:", Object.keys(req.body));
    console.log("Has profilePhoto:", !!req.body.profilePhoto);
    console.log("Has additionalPhotos:", !!req.body.additionalPhotos);

    const allowedUpdates = [
      "name",
      "age",
      "city",
      "state",
      "bio",
      "politicalBeliefs",
      "religion",
      "causes",
      "lifeStage",
      "lookingFor",
      "profilePhoto",
      "additionalPhotos",
    ];

    const updates = {};
    Object.keys(req.body).forEach((key) => {
      if (allowedUpdates.includes(key)) {
        updates[key] = req.body[key];
      }
    });

    console.log("✅ Allowed updates:", {
      ...updates,
      profilePhoto: updates.profilePhoto
        ? `${updates.profilePhoto.substring(0, 30)}... (length: ${updates.profilePhoto.length})`
        : "none",
      additionalPhotos: updates.additionalPhotos
        ? `${updates.additionalPhotos.length} photos`
        : "none",
    });

    const user = await User.findByIdAndUpdate(
      req.userId,
      { $set: updates },
      { new: true, runValidators: true },
    ).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    console.log("✅ Profile updated successfully");
    console.log("User now has:", {
      profilePhoto: user.profilePhoto
        ? `${user.profilePhoto.substring(0, 30)}...`
        : "none",
      additionalPhotos: user.additionalPhotos?.length || 0,
    });

    res.json(user);
  } catch (error) {
    console.error("❌ Profile update error:", error);
    res.status(500).json({
      message: error.message || "Error updating profile",
    });
  }
});

// Update notification settings
router.put("/notification-settings", auth, async (req, res) => {
  try {
    const { newMatch, newMessage, weeklyDigest } = req.body;

    const user = await User.findByIdAndUpdate(
      req.userId,
      {
        $set: {
          "emailNotifications.newMatch": newMatch,
          "emailNotifications.newMessage": newMessage,
          "emailNotifications.weeklyDigest": weeklyDigest,
        },
      },
      { new: true },
    ).select("-password");

    console.log("✅ Notification settings updated for:", user.email);

    res.json(user);
  } catch (error) {
    console.error("❌ Update notification settings error:", error);
    res.status(500).json({ message: "Error updating notification settings" });
  }
});

// Delete account (soft delete)
router.delete("/account", auth, async (req, res) => {
  try {
    const user = await User.findById(req.userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Soft delete
    user.isDeleted = true;
    user.deletedAt = new Date();
    user.isActive = false;
    await user.save();

    console.log("✅ Account deleted (soft):", user.email);

    res.json({ message: "Account deleted successfully" });
  } catch (error) {
    console.error("❌ Delete account error:", error);
    res.status(500).json({ message: "Error deleting account" });
  }
});

module.exports = router;
