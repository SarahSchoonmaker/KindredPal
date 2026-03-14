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
    const stateMap = { 0: "disconnected", 1: "connected", 2: "connecting", 3: "disconnecting" };
    const userCount = await User.countDocuments();
    const oneUser = await User.findOne().select("name email").lean();
    res.json({ mongooseState: stateMap[dbState], database: mongoose.connection.name, host: mongoose.connection.host, totalUsers: userCount, sampleUser: oneUser, success: true });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.get("/test/databases", async (req, res) => {
  try {
    const admin = mongoose.connection.db.admin();
    const { databases } = await admin.listDatabases();
    const currentDB = mongoose.connection.db.databaseName;
    const collections = await mongoose.connection.db.listCollections().toArray();
    const userCount = await User.countDocuments();
    const allUsers = await User.find().select("name email city state").lean();
    res.json({
      currentConnection: { database: currentDB, host: mongoose.connection.host },
      allDatabases: databases,
      collectionsInCurrentDB: collections.map((c) => c.name),
      usersInCurrentDB: { count: userCount, users: allUsers.map((u) => ({ name: u.name, email: u.email, location: `${u.city}, ${u.state}` })) },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


// ===== DEBUG: See exactly what's stored for current user + state mismatches =====
router.get("/debug/discover", auth, async (req, res) => {
  try {
    const currentUser = await User.findById(req.userId)
      .select("name email city state locationPreference likes passed matches blockedUsers")
      .lean();

    const allUsers = await User.find({
      _id: { $ne: req.userId },
      isDeleted: { $ne: true },
    }).select("name city state _id").lean();

    const likedIds = (currentUser.likes || []).map(id => id.toString());
    const passedIds = (currentUser.passed || []).map(id => id.toString());
    const matchedIds = (currentUser.matches || []).map(id => id.toString());
    const blockedIds = (currentUser.blockedUsers || []).map(id => id.toString());

    const breakdown = allUsers.map(u => {
      const id = u._id.toString();
      let excludedReason = null;
      if (likedIds.includes(id)) excludedReason = "liked";
      else if (passedIds.includes(id)) excludedReason = "passed";
      else if (matchedIds.includes(id)) excludedReason = "matched";
      else if (blockedIds.includes(id)) excludedReason = "blocked";
      return {
        name: u.name,
        city: u.city,
        state: u.state,
        excluded: !!excludedReason,
        reason: excludedReason || "visible",
        stateMatch: u.state?.toLowerCase().trim() === currentUser.state?.toLowerCase().trim(),
      };
    });

    res.json({
      currentUser: {
        name: currentUser.name,
        city: currentUser.city,
        state: currentUser.state,
        locationPreference: currentUser.locationPreference,
        likedCount: likedIds.length,
        passedCount: passedIds.length,
        matchedCount: matchedIds.length,
        blockedCount: blockedIds.length,
      },
      totalOtherUsers: allUsers.length,
      visibleToYou: breakdown.filter(u => !u.excluded).length,
      excludedFromDiscover: breakdown.filter(u => u.excluded).length,
      breakdown,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ==========================================
//  Discover Route
// ==========================================

router.get("/discover", auth, async (req, res) => {
  try {
    console.log("\n===== DISCOVER CALLED =====");
    console.log("User ID:", req.userId);
    console.log("Query params:", req.query);

    const currentUser = await User.findById(req.userId)
      .select("_id email city state latitude longitude locationPreference filterPoliticalBeliefs filterReligions filterLifeStages matches likes passed blockedUsers")
      .lean();

    console.log("Current user found:", currentUser ? currentUser.email : "NOT FOUND");

    if (!currentUser) {
      return res.status(404).json({ message: "User not found" });
    }

    const locationPref = req.query.locationPreference || currentUser.locationPreference || "Same state";

    const filterPolitical = req.query.filterPoliticalBeliefs
      ? JSON.parse(req.query.filterPoliticalBeliefs)
      : currentUser.filterPoliticalBeliefs || [];
    const filterReligions = req.query.filterReligions
      ? JSON.parse(req.query.filterReligions)
      : currentUser.filterReligions || [];
    const filterLifeStages = req.query.filterLifeStages
      ? JSON.parse(req.query.filterLifeStages)
      : currentUser.filterLifeStages || [];

    console.log("📍 Active filters:");
    console.log("   Location:", locationPref);

    const excludedIds = [
      currentUser._id,
      ...(currentUser.matches || []),
      ...(currentUser.likes || []),
      ...(currentUser.passed || []),
      ...(currentUser.blockedUsers || []),
    ];
    console.log("🚫 Excluding:", excludedIds.length, "users");

    let query = {
      _id: { $nin: excludedIds },
      isDeleted: { $ne: true },
    };

    // ✅ LOCATION FILTER — guard against empty state/city
    const needsDistanceCalc = locationPref.includes("miles");

    if (!needsDistanceCalc) {
      if (locationPref === "Same city") {
        if (currentUser.city && currentUser.state) {
          // ✅ Case-insensitive match for both city and state
          query.city = { $regex: new RegExp(`^${currentUser.city.trim()}$`, "i") };
          query.state = { $regex: new RegExp(`^${currentUser.state.trim()}$`, "i") };
          console.log("🏙️ Filter: Same city -", currentUser.city, currentUser.state);
        } else {
          console.log("⚠️ Same city requested but user missing city/state — showing Anywhere");
        }
      } else if (locationPref === "Same state") {
        if (currentUser.state) {
          // ✅ Case-insensitive match — handles "FL" vs "fl" vs "Florida" inconsistency
          query.state = { $regex: new RegExp(`^${currentUser.state.trim()}$`, "i") };
          console.log("🗺️ Filter: Same state -", currentUser.state);
        } else {
          console.log("⚠️ Same state requested but user missing state — showing Anywhere");
        }
      } else {
        console.log("🌍 Filter: Anywhere (no restriction)");
      }
    }

    if (filterPolitical && filterPolitical.length > 0) {
      query.politicalBeliefs = { $in: filterPolitical };
    }
    if (filterReligions && filterReligions.length > 0) {
      query.religion = { $in: filterReligions };
    }
    if (filterLifeStages && filterLifeStages.length > 0) {
      query.lifeStage = { $in: filterLifeStages };
    }

    console.log("🔎 Final query:", JSON.stringify(query, null, 2));

    let users = await User.find(query)
      .select("name age city state profilePhoto bio causes latitude longitude politicalBeliefs religion lifeStage familySituation coreValues isVerified")
      .lean();

    console.log(`✅ Database returned ${users.length} users`);

    if (needsDistanceCalc) {
      const miles = parseInt(locationPref.match(/\d+/)[0]);
      if (!currentUser.latitude || !currentUser.longitude) {
        console.log("⚠️ User missing coordinates - falling back to same state");
        if (currentUser.state) {
          users = users.filter((u) => u.state === currentUser.state);
        }
      } else {
        users = users.filter((user) => {
          if (!user.latitude || !user.longitude) return false;
          return calculateDistance(currentUser.latitude, currentUser.longitude, user.latitude, user.longitude) <= miles;
        });
      }
      console.log(`📍 After distance filter: ${users.length} users`);
    }

    users.forEach((user) => { delete user.latitude; delete user.longitude; });

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;
    const totalCount = users.length;
    const paginatedUsers = users.slice(skip, skip + limit);

    console.log(`✅ Returning ${paginatedUsers.length}/${totalCount} users (page ${page})`);
    console.log("===== DISCOVER COMPLETE =====\n");

    return res.json({
      users: paginatedUsers,
      pagination: { page, limit, totalUsers: totalCount, totalPages: Math.ceil(totalCount / limit), hasMore: page * limit < totalCount },
    });
  } catch (error) {
    console.error("===== DISCOVER ERROR =====", error.message);
    return res.status(500).json({ message: error.message });
  }
});

function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 3959;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}
function toRad(degrees) { return degrees * (Math.PI / 180); }

// ===== LIKE USER =====
router.post("/like/:userId", auth, async (req, res) => {
  try {
    const currentUser = await User.findById(req.userId);
    const likedUserId = req.params.userId;
    const likedUser = await User.findById(likedUserId);
    if (!likedUser) return res.status(404).json({ message: "User not found" });

    if (!currentUser.likes.includes(likedUserId)) {
      currentUser.likes.push(likedUserId);
      await currentUser.save();
    }

    const isMatch = likedUser.likes.includes(req.userId);
    if (isMatch) {
      if (!currentUser.matches.includes(likedUserId)) currentUser.matches.push(likedUserId);
      if (!likedUser.matches.includes(req.userId)) likedUser.matches.push(req.userId);
      await currentUser.save();
      await likedUser.save();

      // Emit socket events for real-time badge updates
      const io = req.app.get("io");
      if (io) {
        io.to(likedUserId).emit("new-match");
        io.to(req.userId).emit("new-match");
      }

      return res.json({ isMatch: true, matchedUser: { _id: likedUser._id, name: likedUser.name, profilePhoto: likedUser.profilePhoto } });
    }

    // Emit new-like event so their badge updates
    const io = req.app.get("io");
    if (io) io.to(likedUserId).emit("new-like");

    res.json({ isMatch: false });
  } catch (error) {
    logger.error("Like user error:", error);
    res.status(500).json({ message: "Error liking user" });
  }
});

// ===== PASS USER =====
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

// ===== CLEAR PASSED (for testing / admin reset) =====
router.delete("/passed", auth, async (req, res) => {
  try {
    await User.findByIdAndUpdate(req.userId, { $set: { passed: [] } });
    res.json({ message: "Passed list cleared" });
  } catch (error) {
    res.status(500).json({ message: "Error clearing passed list" });
  }
});

// ===== GET MATCHES =====
router.get("/matches", auth, async (req, res) => {
  try {
    const user = await User.findById(req.userId).populate("matches", "name age city state profilePhoto bio causes lifeStage");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user.matches.map((match) => match.toObject()));
  } catch (error) {
    logger.error("❌ Get matches error:", error);
    res.status(500).json({ message: "Error fetching matches" });
  }
});

// ===== GET LIKES YOU =====
router.get("/likes-you", auth, async (req, res) => {
  try {
    const currentUser = await User.findById(req.userId);
    if (!currentUser) return res.status(404).json({ message: "User not found" });

    const excludedIds = [req.userId, ...(currentUser.matches || []), ...(currentUser.blockedUsers || [])];

    const usersWhoLikedYou = await User.find({
      likes: currentUser._id,
      _id: { $nin: excludedIds },
      isDeleted: { $ne: true },
      isActive: { $ne: false },
    }).select("name age city state profilePhoto bio causes lifeStage familySituation coreValues politicalBeliefs religion lookingFor isVerified").lean();

    res.json({ users: usersWhoLikedYou, dailyLikesRemaining: 10 });
  } catch (error) {
    logger.error("❌ Likes you error:", error);
    res.status(500).json({ message: "Error fetching likes", error: error.message });
  }
});

// ===== UPDATE PROFILE =====
router.put("/profile", auth, async (req, res) => {
  try {
    const updates = req.body;
    const user = await User.findById(req.userId);
    const allowedUpdates = [
      "name", "age", "city", "state", "bio", "profilePhoto", "additionalPhotos",
      "politicalBeliefs", "religion", "causes",
      "lifeStage", "familySituation", "coreValues",
      "lookingFor", "locationPreference",
      "filterPoliticalBeliefs", "filterReligions", "filterLifeStages",
      "filterFamilySituations", "filterCoreValues", "onboardingComplete",
      "isVerified",
    ];
    allowedUpdates.forEach((field) => { if (updates[field] !== undefined) user[field] = updates[field]; });
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
router.get("/profile/:userId", auth, async (req, res) => {
  try {
    const user = await User.findById(req.params.userId).select("-password").lean();
    if (!user) return res.status(404).json({ message: "User not found" });
    user.id = user._id.toString();
    res.json(user);
  } catch (error) {
    logger.error("Get user profile error:", error);
    res.status(500).json({ message: "Error fetching profile" });
  }
});

// ===== UPDATE NOTIFICATION SETTINGS =====
router.put("/notification-settings", auth, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    user.emailNotifications = { ...user.emailNotifications, ...req.body };
    await user.save();
    res.json({ message: "Notification settings updated" });
  } catch (error) {
    logger.error("Update notifications error:", error);
    res.status(500).json({ message: "Error updating settings" });
  }
});

// ===== UNMATCH USER =====
router.post("/unmatch/:userId", auth, async (req, res) => {
  try {
    const currentUser = await User.findById(req.userId);
    const targetUser = await User.findById(req.params.userId);
    if (!targetUser) return res.status(404).json({ message: "User not found" });

    const isMatched = currentUser.matches.some((id) => id.toString() === targetUser._id.toString());
    if (!isMatched) return res.status(400).json({ message: "Not matched with this user" });

    currentUser.matches = currentUser.matches.filter((id) => id.toString() !== targetUser._id.toString());
    targetUser.matches = targetUser.matches.filter((id) => id.toString() !== currentUser._id.toString());
    currentUser.likes = currentUser.likes.filter((id) => id.toString() !== targetUser._id.toString());
    targetUser.likes = targetUser.likes.filter((id) => id.toString() !== currentUser._id.toString());

    await currentUser.save({ validateBeforeSave: false });
    await targetUser.save({ validateBeforeSave: false });

    res.json({ message: "Successfully unmatched", unmatchedUser: { _id: targetUser._id, name: targetUser.name } });
  } catch (error) {
    logger.error("❌ Unmatch error:", error);
    res.status(500).json({ message: "Error unmatching user" });
  }
});

// ===== DELETE ACCOUNT =====
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
router.post("/:userId/report", auth, async (req, res) => {
  try {
    const { userId } = req.params;
    const { reason } = req.body;
    if (!reason) return res.status(400).json({ message: "Report reason is required" });
    const reportedUser = await User.findById(userId).lean();
    if (!reportedUser) return res.status(404).json({ message: "User not found" });
    if (userId === req.userId) return res.status(400).json({ message: "You cannot report yourself" });
    res.status(200).json({ message: "Thank you for your report. Our team will review it shortly." });
  } catch (error) {
    logger.error("❌ Report user error:", error);
    res.status(500).json({ message: "Error reporting user" });
  }
});

// ===== BLOCK USER =====
router.post("/:userId/block", auth, async (req, res) => {
  try {
    const currentUser = await User.findById(req.userId);
    if (!currentUser) return res.status(404).json({ message: "User not found" });
    const userToBlockId = req.params.userId;
    if (!currentUser.blockedUsers.includes(userToBlockId)) {
      currentUser.blockedUsers.push(userToBlockId);
      await currentUser.save();
    }
    await Message.deleteMany({ $or: [{ sender: req.userId, recipient: userToBlockId }, { sender: userToBlockId, recipient: req.userId }] });
    res.json({ message: "User blocked and message history deleted" });
  } catch (error) {
    logger.error("Error blocking user:", error);
    res.status(500).json({ message: "Error blocking user", error: error.message });
  }
});

// ===== UNBLOCK USER =====
router.delete("/:userId/block", auth, async (req, res) => {
  try {
    const currentUser = await User.findById(req.userId);
    if (!currentUser) return res.status(404).json({ message: "User not found" });
    currentUser.blockedUsers = currentUser.blockedUsers.filter((id) => id.toString() !== req.params.userId);
    await currentUser.save();
    res.json({ message: "User unblocked successfully" });
  } catch (error) {
    logger.error("Error unblocking user:", error);
    res.status(500).json({ message: "Error unblocking user", error: error.message });
  }
});

// ===== GET BLOCKED USERS =====
router.get("/blocked", auth, async (req, res) => {
  try {
    const user = await User.findById(req.userId).populate("blockedUsers", "name profilePhoto").lean();
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json((user.blockedUsers || []).filter(Boolean));
  } catch (error) {
    logger.error("❌ Get blocked users error:", error);
    res.status(500).json({ message: "Error fetching blocked users" });
  }
});

// ===== SAVE PUSH TOKEN =====
router.post("/push-token", auth, async (req, res) => {
  try {
    const { token, device } = req.body;
    if (!token) return res.status(400).json({ message: "Token is required" });
    const user = await User.findById(req.userId);
    if (!user.pushTokens.find((pt) => pt.token === token)) {
      user.pushTokens.push({ token, device: device || "unknown" });
      if (user.pushTokens.length > 3) user.pushTokens = user.pushTokens.slice(-3);
      await user.save();
    }
    res.json({ message: "Push token saved successfully" });
  } catch (error) {
    logger.error("❌ Save push token error:", error);
    res.status(500).json({ message: "Error saving push token" });
  }
});

// ===== GET ALL BADGE COUNTS =====
router.get("/counts", auth, async (req, res) => {
  try {
    const userId = req.user.id;

    const unread = await Message.countDocuments({ recipient: userId, read: false });

    const Meetup = require("../models/Meetup");
    const meetupInvites = await Meetup.find({ invitedUsers: userId, isActive: true }).select("_id rsvps");
    const pendingMeetups = meetupInvites.filter(
      (m) => !m.rsvps.some((r) => r.user.toString() === userId)
    );

    const Connection = require("../models/Connection");
    const requestCount = await Connection.countDocuments({
      recipient: userId,
      status: "pending",
    });

    res.json({
      unread,
      meetups: pendingMeetups.length,
      meetupInviteIds: pendingMeetups.map((m) => m._id.toString()),
      requestCount,
    });
  } catch (error) {
    console.error("❌ Get counts error:", error);
    res.status(500).json({ message: "Error fetching counts" });
  }
});

module.exports = router;