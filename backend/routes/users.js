const express = require("express");
const router = express.Router();
const User = require("../models/User");
const auth = require("../middleware/auth");
const { sendPushNotification } = require("../utils/pushNotifications");
const logger = require("../utils/logger");
const Message = require("../models/Message");
const mongoose = require("mongoose");

// ===== TEST ENDPOINTS =====
router.get("/test/db", async (req, res) => {
  try {
    const dbState = mongoose.connection.readyState;
    const stateMap = {
      0: "disconnected",
      1: "connected",
      2: "connecting",
      3: "disconnecting",
    };

    const userCount = await User.countDocuments();
    const oneUser = await User.findOne().select("name email").lean();

    res.json({
      mongooseState: stateMap[dbState],
      database: mongoose.connection.name,
      host: mongoose.connection.host,
      totalUsers: userCount,
      sampleUser: oneUser,
      success: true,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

router.get("/test/databases", async (req, res) => {
  try {
    const admin = mongoose.connection.db.admin();
    const { databases } = await admin.listDatabases();
    const currentDB = mongoose.connection.db.databaseName;
    const collections = await mongoose.connection.db
      .listCollections()
      .toArray();
    const userCount = await User.countDocuments();
    const allUsers = await User.find().select("name email city state").lean();

    res.json({
      currentConnection: {
        database: currentDB,
        host: mongoose.connection.host,
      },
      allDatabases: databases,
      collectionsInCurrentDB: collections.map((c) => c.name),
      usersInCurrentDB: {
        count: userCount,
        users: allUsers.map((u) => ({
          name: u.name,
          email: u.email,
          location: `${u.city}, ${u.state}`,
        })),
      },
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
});

// ==========================================
// COMPLETE WORKING DISCOVER ROUTE WITH ALL FILTERS
// Replace the discover route in /backend/routes/users.js
// ==========================================

router.get("/discover", auth, async (req, res) => {
  try {
    console.log("\n===== DISCOVER CALLED =====");
    console.log("User ID:", req.userId);
    console.log("Query params:", req.query);
    
    // Get current user
    const currentUser = await User.findById(req.userId)
      .select("_id email city state latitude longitude locationPreference filterPoliticalBeliefs filterReligions filterLifeStages matches likes passed blockedUsers")
      .lean();
    
    console.log("Current user found:", currentUser ? currentUser.email : "NOT FOUND");
    
    if (!currentUser) {
      console.log("ERROR: User not found");
      return res.status(404).json({ message: "User not found" });
    }

    // Get filter preferences (from query OR user profile)
    const locationPref = req.query.locationPreference || currentUser.locationPreference || "Same state";
    
    const filterPolitical = req.query.filterPoliticalBeliefs 
      ? JSON.parse(req.query.filterPoliticalBeliefs) 
      : (currentUser.filterPoliticalBeliefs || []);
    
    const filterReligions = req.query.filterReligions 
      ? JSON.parse(req.query.filterReligions) 
      : (currentUser.filterReligions || []);
    
    const filterLifeStages = req.query.filterLifeStages 
      ? JSON.parse(req.query.filterLifeStages) 
      : (currentUser.filterLifeStages || []);

    console.log("📍 Active filters:");
    console.log("   Location:", locationPref);
    if (filterPolitical.length > 0) console.log("   Political:", filterPolitical);
    if (filterReligions.length > 0) console.log("   Religion:", filterReligions);
    if (filterLifeStages.length > 0) console.log("   Life Stage:", filterLifeStages);

    // Build exclusion list
    const excludedIds = [
      currentUser._id,
      ...(currentUser.matches || []),
      ...(currentUser.likes || []),
      ...(currentUser.passed || []),
      ...(currentUser.blockedUsers || []),
    ];
    console.log("🚫 Excluding:", excludedIds.length, "users");

    // Build base query
    let query = {
      _id: { $nin: excludedIds },
      isDeleted: { $ne: true },
    };

    // LOCATION FILTER (apply to database when possible)
    const needsDistanceCalc = locationPref.includes("miles");
    
    if (!needsDistanceCalc) {
      if (locationPref === "Same city") {
        query.city = currentUser.city;
        query.state = currentUser.state;
        console.log("🏙️ Filter: Same city");
      } else if (locationPref === "Same state") {
        query.state = currentUser.state;
        console.log("🗺️ Filter: Same state");
      } else if (locationPref === "Anywhere") {
        console.log("🌍 Filter: Anywhere (no restriction)");
      }
    }

    // POLITICAL BELIEFS FILTER
    if (filterPolitical && filterPolitical.length > 0) {
      query.politicalBeliefs = { $in: filterPolitical };
      console.log("🗳️ Political filter applied");
    }

    // RELIGION FILTER
    if (filterReligions && filterReligions.length > 0) {
      query.religion = { $in: filterReligions };
      console.log("⛪ Religion filter applied");
    }

    // LIFE STAGE FILTER
    if (filterLifeStages && filterLifeStages.length > 0) {
      query.lifeStage = { $in: filterLifeStages };
      console.log("👨‍👩‍👧‍👦 Life stage filter applied");
    }

    console.log("🔎 Final query:", JSON.stringify(query, null, 2));

    // Execute query
    console.log("Fetching users...");
    let users = await User.find(query)
      .select("name age city state profilePhoto bio causes latitude longitude politicalBeliefs religion lifeStage")
      .lean();
    
    console.log(`✅ Database returned ${users.length} users`);

    // DISTANCE FILTERING (if mile-based)
    if (needsDistanceCalc) {
      const miles = parseInt(locationPref.match(/\d+/)[0]);
      console.log(`📏 Applying ${miles} mile filter...`);
      
      if (!currentUser.latitude || !currentUser.longitude) {
        console.log("⚠️ User missing coordinates - falling back to same state");
        users = users.filter(u => u.state === currentUser.state);
      } else {
        users = users.filter(user => {
          if (!user.latitude || !user.longitude) return false;
          
          const distance = calculateDistance(
            currentUser.latitude,
            currentUser.longitude,
            user.latitude,
            user.longitude
          );
          
          return distance <= miles;
        });
      }
      
      console.log(`📍 After distance filter: ${users.length} users`);
    }

    // Remove coordinates from response (privacy)
    users.forEach(user => {
      delete user.latitude;
      delete user.longitude;
    });

    // Pagination
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;
    
    const totalCount = users.length;
    const paginatedUsers = users.slice(skip, skip + limit);

    console.log(`✅ Returning ${paginatedUsers.length}/${totalCount} users (page ${page})`);
    console.log("===== DISCOVER COMPLETE =====\n");
    
    return res.json({
      users: paginatedUsers,
      pagination: {
        page,
        limit,
        totalUsers: totalCount,
        totalPages: Math.ceil(totalCount / limit),
        hasMore: page * limit < totalCount,
      },
    });
    
  } catch (error) {
    console.error("===== DISCOVER ERROR =====");
    console.error("Error:", error.message);
    console.error("Stack:", error.stack);
    console.error("===========================\n");
    return res.status(500).json({ message: error.message });
  }
});

// Helper: Calculate distance between coordinates
function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 3959; // Earth's radius in miles
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  
  return R * c;
}

function toRad(degrees) {
  return degrees * (Math.PI / 180);
}


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
    logger.info(`📬 Get matches request for user: ${req.userId}`);

    // First, get the raw user to see what's in matches array
    const rawUser = await User.findById(req.userId);
    logger.info(`   Raw matches array length: ${rawUser.matches.length}`);
    logger.info(
      `   Raw matches IDs: ${rawUser.matches.map((id) => id.toString()).join(", ")}`,
    );

    // Now populate
    const user = await User.findById(req.userId).populate(
      "matches",
      "name age city state profilePhoto bio causes lifeStage",
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    logger.info(`   Populated matches length: ${user.matches.length}`);
    logger.info(
      `   Populated matches: ${user.matches.map((m) => `${m.name} (${m._id})`).join(", ")}`,
    );

    const matches = user.matches.map((match) => match.toObject());

    res.json(matches);
  } catch (error) {
    logger.error("❌ Get matches error:", error);
    logger.error("❌ Error stack:", error.stack);
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

    if (!currentUser) {
      logger.error("❌ Current user not found:", req.userId);
      return res.status(404).json({ message: "User not found" });
    }

    logger.info(`📬 Likes-You request for ${currentUser.email}`);
    logger.info(`   Matches: ${currentUser.matches?.length || 0}`);
    logger.info(`   Blocked: ${currentUser.blockedUsers?.length || 0}`);

    // Build exclusion list with safety checks
    const excludedIds = [
      req.userId, // Exclude yourself
      ...(currentUser.matches || []),
      ...(currentUser.blockedUsers || []),
    ];

    logger.info(`   Excluding ${excludedIds.length} total users`);

    // Find users who have liked the current user but are NOT yet matched or blocked
    const usersWhoLikedYou = await User.find({
      likes: currentUser._id,
      _id: { $nin: excludedIds },
      isDeleted: { $ne: true },
      isActive: { $ne: false },
    })
      .select(
        "name age city state profilePhoto bio causes lifeStage politicalBeliefs religion lookingFor",
      )
      .lean();

    logger.info(`   Found ${usersWhoLikedYou.length} users who liked you`);

    res.json({
      users: usersWhoLikedYou,
      dailyLikesRemaining: 10,
    });
  } catch (error) {
    logger.error("❌ Likes you error:", error);
    logger.error("❌ Error message:", error.message);
    logger.error("❌ Error stack:", error.stack);
    res.status(500).json({
      message: "Error fetching likes",
      error: error.message,
    });
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

    logger.info("\n========== PROFILE UPDATE ==========");
    logger.info("User:", user.email);
    logger.info("Updates received:", JSON.stringify(updates, null, 2));

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
      "filterPoliticalBeliefs",
      "filterReligions",
      "filterLifeStages",
    ];

    allowedUpdates.forEach((field) => {
      if (updates[field] !== undefined) {
        user[field] = updates[field];
        logger.info(`   ✅ Updated ${field}:`, updates[field]);
      }
    });

    await user.save();

    logger.info("✅ Profile saved successfully");
    logger.info("   Location Preference:", user.locationPreference);
    logger.info("   Political Filters:", user.filterPoliticalBeliefs);
    logger.info("   Religion Filters:", user.filterReligions);
    logger.info("   Life Stage Filters:", user.filterLifeStages);
    logger.info("====================================\n");

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
      .lean();

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

// ===== UNMATCH USER =====

// @route   POST /api/users/unmatch/:userId
// @desc    Unmatch with a user
// @access  Private
router.post("/unmatch/:userId", auth, async (req, res) => {
  try {
    const currentUser = await User.findById(req.userId);
    const targetUser = await User.findById(req.params.userId);

    if (!targetUser) {
      logger.error(`❌ Target user not found: ${req.params.userId}`);
      return res.status(404).json({ message: "User not found" });
    }

    // Check if they are matched
    const isMatched = currentUser.matches.some(
      (id) => id.toString() === targetUser._id.toString(),
    );

    if (!isMatched) {
      logger.warn(
        `⚠️ Users not matched: ${req.userId} and ${req.params.userId}`,
      );
      return res.status(400).json({ message: "Not matched with this user" });
    }

    logger.info(`🔓 Unmatching ${currentUser.email} and ${targetUser.email}`);
    logger.info(`Before - Current user matches: ${currentUser.matches.length}`);
    logger.info(`Before - Target user matches: ${targetUser.matches.length}`);

    // Remove from both users' matches
    currentUser.matches = currentUser.matches.filter(
      (id) => id.toString() !== targetUser._id.toString(),
    );
    targetUser.matches = targetUser.matches.filter(
      (id) => id.toString() !== currentUser._id.toString(),
    );

    // Also remove from likes if present
    currentUser.likes = currentUser.likes.filter(
      (id) => id.toString() !== targetUser._id.toString(),
    );
    targetUser.likes = targetUser.likes.filter(
      (id) => id.toString() !== currentUser._id.toString(),
    );

    logger.info(`After - Current user matches: ${currentUser.matches.length}`);
    logger.info(`After - Target user matches: ${targetUser.matches.length}`);

    // Save with validation skipped
    await currentUser.save({ validateBeforeSave: false });
    logger.info(`✅ Current user saved`);

    await targetUser.save({ validateBeforeSave: false });
    logger.info(`✅ Target user saved`);

    logger.info("✅ Unmatched successfully");

    res.json({
      message: "Successfully unmatched",
      unmatchedUser: {
        _id: targetUser._id,
        name: targetUser.name,
      },
    });
  } catch (error) {
    logger.error("❌ Unmatch error:", error);
    logger.error("❌ Error stack:", error.stack);
    res.status(500).json({ message: "Error unmatching user" });
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

    const reportedUser = await User.findById(userId).lean();
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
    logger.info(
      `Attempting to block user. Current user ID: ${req.userId}, Target user: ${req.params.userId}`,
    );

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

    logger.info(
      `Attempting to delete messages between ${req.userId} and ${userToBlockId}`,
    );
    const deleteResult = await Message.deleteMany({
      $or: [
        { sender: req.userId, recipient: userToBlockId },
        { sender: userToBlockId, recipient: req.userId },
      ],
    });

    logger.info(`Deleted ${deleteResult.deletedCount} messages`);
    logger.info(
      `User ${req.userId} blocked ${userToBlockId} and deleted message history`,
    );

    res.json({ message: "User blocked and message history deleted" });
  } catch (error) {
    logger.error("Error blocking user - Full error:", error);
    logger.error("Error stack:", error.stack);
    res
      .status(500)
      .json({ message: "Error blocking user", error: error.message });
  }
});

// ===== UNBLOCK USER =====

// @route   DELETE /api/users/:userId/block
// @desc    Unblock a user
// @access  Private
router.delete("/:userId/block", auth, async (req, res) => {
  try {
    logger.info(
      `Attempting to unblock user. Current user ID: ${req.userId}, Target user: ${req.params.userId}`,
    );

    const currentUser = await User.findById(req.userId);

    if (!currentUser) {
      logger.error(`Current user not found: ${req.userId}`);
      return res.status(404).json({ message: "User not found" });
    }

    const userToUnblockId = req.params.userId;

    currentUser.blockedUsers = currentUser.blockedUsers.filter(
      (id) => id.toString() !== userToUnblockId,
    );
    await currentUser.save();

    logger.info(`User ${req.userId} unblocked ${userToUnblockId}`);
    res.json({ message: "User unblocked successfully" });
  } catch (error) {
    logger.error("Error unblocking user - Full error:", error);
    logger.error("Error stack:", error.stack);
    res
      .status(500)
      .json({ message: "Error unblocking user", error: error.message });
  }
});

// ===== GET BLOCKED USERS =====

// @route   GET /api/users/blocked
// @desc    Get blocked users
// @access  Private
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
