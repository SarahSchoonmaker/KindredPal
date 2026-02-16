const express = require("express");
const router = express.Router();
const User = require("../models/User");
const auth = require("../middleware/auth");
const { sendPushNotification } = require("../utils/pushNotifications");
const logger = require("../utils/logger");

// ===== DISCOVER ROUTE =====

// @route   GET /api/users/discover
// @desc    Get potential matches for discovery
// @access  Private
router.get("/discover", auth, async (req, res) => {
  try {
    const currentUser = await User.findById(req.userId);

    if (!currentUser) {
      logger.error("❌ Current user not found:", req.userId);
      return res.status(404).json({ message: "User not found" });
    }

    logger.info("\n========== DISCOVER REQUEST ==========");
    logger.info("👤 User:", currentUser.email);
    logger.info("📍 Location:", currentUser.city, currentUser.state);
    logger.info(
      "🎯 Location Preference:",
      currentUser.locationPreference || "Home state (default)",
    );

    // Get all users except current user, liked, passed, and blocked
    const excludedIds = [
      req.userId,
      ...(currentUser.likes || []),
      ...(currentUser.passed || []),
      ...(currentUser.blocked || []),
    ];

    logger.info("🚫 Excluding", excludedIds.length, "users");

    // Find potential matches
    let potentialMatches = await User.find({
      _id: { $nin: excludedIds },
      isDeleted: { $ne: true },
      isActive: { $ne: false },
    });

    logger.info("📊 Total users in database:", potentialMatches.length);

    // Filter by location preference
    const locationPref = currentUser.locationPreference || "Home state";
    logger.info("🔍 Applying location filter:", locationPref);

    potentialMatches = potentialMatches.filter((user) => {
      try {
        const meets = currentUser.meetsLocationPreference(user);
        if (!meets) {
          logger.info(
            `   ❌ ${user.name} (${user.city}, ${user.state}) - doesn't meet location preference`,
          );
        } else {
          logger.info(
            `   ✅ ${user.name} (${user.city}, ${user.state}) - meets location preference`,
          );
        }
        return meets;
      } catch (err) {
        logger.error(
          `   ⚠️ Error checking location for user ${user._id}:`,
          err.message,
        );
        return false;
      }
    });

    logger.info("📍 After location filter:", potentialMatches.length, "users");

    // Calculate match scores
    const matchesWithScores = potentialMatches
      .map((user) => {
        try {
          const score = currentUser.calculateMatchScore(user);
          logger.info(`   🎯 ${user.name}: ${score}% match`);
          return {
            ...user.toObject(),
            matchScore: score,
          };
        } catch (err) {
          logger.error(
            `   ⚠️ Error calculating score for user ${user._id}:`,
            err.message,
          );
          return null;
        }
      })
      .filter((user) => user && user.matchScore > 0);

    logger.info(
      "✨ After match score filter:",
      matchesWithScores.length,
      "users",
    );

    // Sort by match score (highest first)
    matchesWithScores.sort((a, b) => b.matchScore - a.matchScore);

    logger.info(
      "✅ Discover successful, returning",
      matchesWithScores.length,
      "users",
    );
    logger.info("====================================\n");

    res.json({
      users: matchesWithScores,
    });
  } catch (error) {
    logger.error("❌ Discover error:", error);
    res.status(500).json({ message: "Error fetching discover users" });
  }
});

// ===== LIKE USER =====

// @route   POST /api/users/like/:userId
// @desc    Like a user
// @access  Private
router.post("/like/:userId", auth, async (req, res) => {
  try {
    const currentUser = await User.findById(req.userId);
    const likedUser = await User.findById(req.params.userId);

    if (!likedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    // Add to likes
    if (!currentUser.likes.includes(likedUser._id)) {
      currentUser.likes.push(likedUser._id);
    }

    // Check if it's a match
    let isMatch = false;
    let matchedUser = null;

    if (likedUser.likes.includes(currentUser._id)) {
      isMatch = true;
      currentUser.matches.push(likedUser._id);
      likedUser.matches.push(currentUser._id);
      await likedUser.save();
      matchedUser = likedUser.toObject();

      // 🔔 Send push notification for match
      if (likedUser.pushTokens && likedUser.pushTokens.length > 0) {
        await sendPushNotification(
          likedUser.pushTokens,
          "🎉 It's a Match!",
          `You and ${currentUser.name} matched!`,
          { type: "match", userId: currentUser._id.toString() },
        );
      }
    }

    await currentUser.save();

    res.json({
      message: isMatch ? "It's a match!" : "User liked",
      isMatch,
      matchedUser,
    });
  } catch (error) {
    logger.error("Like user error:", error);
    res.status(500).json({ message: "Error liking user" });
  }
});

// ===== PASS USER =====

// @route   POST /api/users/pass/:userId
// @desc    Pass on a user
// @access  Private
router.post("/pass/:userId", auth, async (req, res) => {
  try {
    const currentUser = await User.findById(req.userId);
    const passedUserId = req.params.userId;

    if (!currentUser.passed.includes(passedUserId)) {
      currentUser.passed.push(passedUserId);
      await currentUser.save();
    }

    res.json({ message: "User passed" });
  } catch (error) {
    logger.error("Pass user error:", error);
    res.status(500).json({ message: "Error passing user" });
  }
});

// ===== GET MATCHES =====

// @route   GET /api/users/matches
// @desc    Get user's matches
// @access  Private
router.get("/matches", auth, async (req, res) => {
  try {
    const user = await User.findById(req.userId).populate(
      "matches",
      "name age city state profilePhoto bio causes lifeStage",
    );

    res.json(user.matches || []);
  } catch (error) {
    logger.error("Get matches error:", error);
    res.status(500).json({ message: "Error fetching matches" });
  }
});

// ===== GET LIKES YOU =====

// @route   GET /api/users/likes-you
// @desc    Get users who liked you
// @access  Private
router.get("/likes-you", auth, async (req, res) => {
  try {
    const currentUser = await User.findById(req.userId);

    const usersWhoLikedYou = await User.find({
      likes: currentUser._id,
      _id: { $nin: currentUser.matches },
    }).select("name age city state profilePhoto bio causes lifeStage");

    res.json(usersWhoLikedYou);
  } catch (error) {
    logger.error("Likes you error:", error);
    res.status(500).json({ message: "Error fetching likes" });
  }
});

// ===== UPDATE PROFILE =====

// @route   PUT /api/users/profile
// @desc    Update user profile
// @access  Private
router.put("/profile", auth, async (req, res) => {
  try {
    const updates = req.body;
    const user = await User.findById(req.userId);

    // Update allowed fields
    const allowedUpdates = [
      "name",
      "age",
      "city",
      "state",
      "bio",
      "profilePhoto",
      "additionalPhotos",
      "politicalBeliefs",
      "religion",
      "causes",
      "lifeStage",
      "lookingFor",
      "locationPreference",
    ];

    allowedUpdates.forEach((field) => {
      if (updates[field] !== undefined) {
        user[field] = updates[field];
      }
    });

    await user.save();

    const userResponse = user.toObject();
    userResponse.id = userResponse._id.toString();

    res.json(userResponse);
  } catch (error) {
    logger.error("Update profile error:", error);
    res.status(500).json({ message: "Error updating profile" });
  }
});

// ===== GET USER PROFILE =====

// @route   GET /api/users/profile/:userId
// @desc    Get another user's profile
// @access  Private
router.get("/profile/:userId", auth, async (req, res) => {
  try {
    const user = await User.findById(req.params.userId).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const userResponse = user.toObject();
    userResponse.id = userResponse._id.toString();

    res.json(userResponse);
  } catch (error) {
    logger.error("Get user profile error:", error);
    res.status(500).json({ message: "Error fetching profile" });
  }
});

// ===== UPDATE NOTIFICATION SETTINGS =====

// @route   PUT /api/users/notification-settings
// @desc    Update notification settings
// @access  Private
router.put("/notification-settings", auth, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    user.emailNotifications = {
      ...user.emailNotifications,
      ...req.body,
    };
    await user.save();
    res.json({ message: "Notification settings updated" });
  } catch (error) {
    logger.error("Update notifications error:", error);
    res.status(500).json({ message: "Error updating settings" });
  }
});

// ===== DELETE ACCOUNT =====

// @route   DELETE /api/users/account
// @desc    Delete user account (soft delete)
// @access  Private
router.delete("/account", auth, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    await user.softDelete();
    res.json({ message: "Account deleted successfully" });
  } catch (error) {
    logger.error("Delete account error:", error);
    res.status(500).json({ message: "Error deleting account" });
  }
});

// ===== REPORT USER =====

// @route   POST /api/users/:userId/report
// @desc    Report a user
// @access  Private
router.post("/:userId/report", auth, async (req, res) => {
  try {
    const { userId } = req.params;
    const { reason } = req.body;
    const reporterId = req.userId;

    logger.info("\n========== REPORT USER ==========");
    logger.info("Reporter:", reporterId);
    logger.info("Reported User:", userId);
    logger.info("Reason:", reason);

    if (!reason) {
      return res.status(400).json({ message: "Report reason is required" });
    }

    const reportedUser = await User.findById(userId);
    if (!reportedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    if (userId === reporterId) {
      return res.status(400).json({ message: "You cannot report yourself" });
    }

    // TODO: Store report in a Report model/collection
    logger.info("✅ Report logged successfully");
    logger.info("====================================\n");

    res.status(200).json({
      message: "Thank you for your report. Our team will review it shortly.",
    });
  } catch (error) {
    logger.error("❌ Report user error:", error);
    res.status(500).json({ message: "Error reporting user" });
  }
});

// ===== BLOCK USER =====

// @route   POST /api/users/:userId/block
// @desc    Block a user
// @access  Private
router.post("/:userId/block", auth, async (req, res) => {
  try {
    const { userId } = req.params;
    const blockerId = req.userId;

    logger.info("\n========== BLOCK USER ==========");
    logger.info("Blocker:", blockerId);
    logger.info("Blocked User:", userId);

    if (userId === blockerId) {
      return res.status(400).json({ message: "You cannot block yourself" });
    }

    const blocker = await User.findById(blockerId);
    const blockedUser = await User.findById(userId);

    if (!blockedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!blocker.blocked) {
      blocker.blocked = [];
    }

    if (blocker.blocked.includes(userId)) {
      return res.status(400).json({ message: "User is already blocked" });
    }

    blocker.blocked.push(userId);

    blocker.matches = blocker.matches.filter(
      (matchId) => matchId.toString() !== userId,
    );
    blockedUser.matches = blockedUser.matches.filter(
      (matchId) => matchId.toString() !== blockerId,
    );

    await blocker.save();
    await blockedUser.save();

    logger.info("✅ User blocked successfully");
    logger.info("====================================\n");

    res.status(200).json({ message: "User blocked successfully" });
  } catch (error) {
    logger.error("❌ Block user error:", error);
    res.status(500).json({ message: "Error blocking user" });
  }
});

// ===== UNBLOCK USER =====

// @route   DELETE /api/users/:userId/block
// @desc    Unblock a user
// @access  Private
router.delete("/:userId/block", auth, async (req, res) => {
  try {
    const { userId } = req.params;
    const unblockerId = req.userId;

    const unblocker = await User.findById(unblockerId);

    if (!unblocker.blocked || !unblocker.blocked.includes(userId)) {
      return res.status(400).json({ message: "User is not blocked" });
    }

    unblocker.blocked = unblocker.blocked.filter(
      (blockedId) => blockedId.toString() !== userId,
    );

    await unblocker.save();

    res.status(200).json({ message: "User unblocked successfully" });
  } catch (error) {
    logger.error("❌ Unblock user error:", error);
    res.status(500).json({ message: "Error unblocking user" });
  }
});

// ===== GET BLOCKED USERS =====

// @route   GET /api/users/blocked
// @desc    Get list of blocked users
// @access  Private
router.get("/blocked", auth, async (req, res) => {
  try {
    const user = await User.findById(req.userId).populate(
      "blocked",
      "name profilePhoto",
    );

    res.json(user.blocked || []);
  } catch (error) {
    logger.error("❌ Get blocked users error:", error);
    res.status(500).json({ message: "Error fetching blocked users" });
  }
});

// ===== SAVE PUSH TOKEN =====

// @route   POST /api/users/push-token
// @desc    Save push notification token
// @access  Private
router.post("/push-token", auth, async (req, res) => {
  try {
    const { token, device } = req.body;

    if (!token) {
      return res.status(400).json({ message: "Token is required" });
    }

    const user = await User.findById(req.userId);

    // Check if token already exists
    const existingToken = user.pushTokens.find((pt) => pt.token === token);

    if (!existingToken) {
      user.pushTokens.push({
        token,
        device: device || "unknown",
      });

      // Keep only last 3 tokens per user
      if (user.pushTokens.length > 3) {
        user.pushTokens = user.pushTokens.slice(-3);
      }

      await user.save();
      logger.info("✅ Push token saved for user:", user.email);
    }

    res.json({ message: "Push token saved successfully" });
  } catch (error) {
    logger.error("❌ Save push token error:", error);
    res.status(500).json({ message: "Error saving push token" });
  }
});

module.exports = router;
