const express = require("express");
const router = express.Router();
const User = require("../models/User");
const auth = require("../middleware/auth");
const { sendPushNotification } = require("../utils/pushNotifications");
const logger = require("../utils/logger");
const Message = require("../models/Message");

// ===== DISCOVER ROUTE =====

// @route   GET /api/users/discover
// @desc    Get potential matches for discovery
// @access  Private
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

    // Get all users who have blocked the current user
    const usersWhoBlockedMe = await User.find({
      blockedUsers: currentUser._id,
    }).select("_id");
    const blockedMeIds = usersWhoBlockedMe.map(u => u._id);

    // Get all users except current user, liked, passed, blocked, and who blocked me
    const excludedIds = [
      req.userId,
      ...(currentUser.likes || []),
      ...(currentUser.passed || []),
      ...(currentUser.blockedUsers || []), // FIXED: was "blocked"
      ...blockedMeIds, // ADDED: exclude users who blocked me
    ];

    logger.info("🚫 Excluding", excludedIds.length, "users");

    // Find potential matches
    let potentialMatches = await User.find({
      _id: { $nin: excludedIds },
      isDeleted: { $ne: true },
      isActive: { $ne: false },
    })
      .select(
        "name age city state profilePhoto bio causes lifeStage politicalBeliefs religion lookingFor",
      )
      .lean();

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
            ...user,
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

    // Check if already liked (convert ObjectIds to strings for comparison)
    const alreadyLiked = currentUser.likes.some(
      id => id.toString() === likedUser._id.toString()
    );

    // Add to likes only if not already there
    if (!alreadyLiked) {
      currentUser.likes.push(likedUser._id);
      logger.info(`User ${currentUser.email} liked ${likedUser.email}`);
    } else {
      logger.info(`User ${currentUser.email} already liked ${likedUser.email}`);
    }

    // Check if it's a match
    let isMatch = false;
    let matchedUser = null;

    const otherUserLikesMe = likedUser.likes.some(
      id => id.toString() === currentUser._id.toString()
    );

    if (otherUserLikesMe) {
      // Check if already matched
      const alreadyMatched = currentUser.matches.some(
        id => id.toString() === likedUser._id.toString()
      );

      if (!alreadyMatched) {
        isMatch = true;
        currentUser.matches.push(likedUser._id);
        likedUser.matches.push(currentUser._id);
        await likedUser.save();
        matchedUser = likedUser.toObject();

        logger.info(`🎉 Match created between ${currentUser.email} and ${likedUser.email}`);

        // 🔔 Send push notification for match
        if (likedUser.pushTokens && likedUser.pushTokens.length > 0) {
          await sendPushNotification(
            likedUser.pushTokens,
            "🎉 It's a Match!",
            `You and ${currentUser.name} matched!`,
            { type: "match", userId: currentUser._id.toString() },
          );
        }
      } else {
        logger.info(`Already matched with ${likedUser.email}`);
        matchedUser = likedUser.toObject();
        isMatch = true; // Still return true since they're matched
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
    logger.error("Error stack:", error.stack);
    res.status(500).json({ message: "Error liking user", error: error.message });
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
    const user = await User.findById(req.userId)
      .populate(
        "matches",
        "name age city state profilePhoto bio causes lifeStage",
      )
      .lean(); // ← Added .lean()

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
    })
      .select("name age city state profilePhoto bio causes lifeStage")
      .lean(); // ← Added .lean()

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
    const user = await User.findById(req.params.userId)
      .select("-password")
      .lean(); // ← Added .lean()

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Add id field for compatibility
    user.id = user._id.toString();

    res.json(user);
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

    const reportedUser = await User.findById(userId).lean(); // ← Added .lean()
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
// ===== BLOCK USER =====
router.post("/:userId/block", auth, async (req, res) => {
  try {
    logger.info(`Attempting to block user. Current user ID: ${req.userId}, Target user: ${req.params.userId}`);
    
    const currentUser = await User.findById(req.userId);
    
    if (!currentUser) {
      logger.error(`Current user not found: ${req.userId}`);
      return res.status(404).json({ message: "User not found" });
    }
    
    const userToBlockId = req.params.userId;
    logger.info(`Current user blockedUsers array:`, currentUser.blockedUsers);

    if (!currentUser.blockedUsers.includes(userToBlockId)) {
      currentUser.blockedUsers.push(userToBlockId);
      logger.info(`Added ${userToBlockId} to blocked list`);
      await currentUser.save();
      logger.info(`User saved successfully`);
    }

    logger.info(`Attempting to delete messages between ${req.userId} and ${userToBlockId}`);
    const deleteResult = await Message.deleteMany({
      $or: [
        { sender: req.userId, recipient: userToBlockId },
        { sender: userToBlockId, recipient: req.userId }
      ]
    });
    
    logger.info(`Deleted ${deleteResult.deletedCount} messages`);
    logger.info(`User ${req.userId} blocked ${userToBlockId} and deleted message history`);
    
    res.json({ message: "User blocked and message history deleted" });
  } catch (error) {
    logger.error("Error blocking user - Full error:", error);
    logger.error("Error stack:", error.stack);
    res.status(500).json({ message: "Error blocking user", error: error.message });
  }
});

// ===== UNBLOCK USER =====
router.delete("/:userId/block", auth, async (req, res) => {
  try {
    logger.info(`Attempting to unblock user. Current user ID: ${req.userId}, Target user: ${req.params.userId}`);
    
    const currentUser = await User.findById(req.userId);
    
    if (!currentUser) {
      logger.error(`Current user not found: ${req.userId}`);
      return res.status(404).json({ message: "User not found" });
    }
    
    const userToUnblockId = req.params.userId;

    currentUser.blockedUsers = currentUser.blockedUsers.filter(
      id => id.toString() !== userToUnblockId
    );
    await currentUser.save();

    logger.info(`User ${req.userId} unblocked ${userToUnblockId}`);
    res.json({ message: "User unblocked successfully" });
  } catch (error) {
    logger.error("Error unblocking user - Full error:", error);
    logger.error("Error stack:", error.stack);
    res.status(500).json({ message: "Error unblocking user", error: error.message });
  }
});

// ===== GET BLOCKED USERS =====
router.get("/blocked", auth, async (req, res) => {
  try {
    const user = await User.findById(req.userId)
      .populate("blockedUsers", "name profilePhoto")  
      .lean();

    res.json(user.blockedUsers || []);  
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
