// ============================================================
// backend/routes/connections.js
// ============================================================
const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const User = require("../models/User");
const Connection = require("../models/Connection");

// ── GET /api/connections ─────────────────────────────────────
router.get("/", auth, async (req, res) => {
  try {
    const userId = (req.user.id || req.user._id || req.userId).toString();

    const connections = await Connection.find({
      $or: [{ from: userId }, { to: userId }],
      status: "accepted",
    })
      .populate("from", "_id name city state lifeStage bio")
      .populate("to", "_id name city state lifeStage bio")
      .sort({ updatedAt: -1 })
      .lean(); // FIX: use .lean() so _id fields are plain ObjectIds, not Mongoose docs

    // Build list of the "other" user for each connection
    // FIX: compare _id.toString() explicitly — populated docs need _id extracted first
    const otherIds = [];
    const otherUserMap = {};

    connections.forEach((c) => {
      const fromId = c.from?._id?.toString();
      const toId = c.to?._id?.toString();
      const otherId = fromId === userId ? toId : fromId;
      const otherUser = fromId === userId ? c.to : c.from;
      if (otherId && otherUser) {
        otherIds.push(otherId);
        otherUserMap[otherId] = otherUser;
      }
    });

    // Batch fetch fresh profilePhotos from User collection
    const freshUsers = await User.find({
      _id: { $in: otherIds },
    })
      .select("_id profilePhoto")
      .lean();

    const photoMap = {};
    freshUsers.forEach((u) => {
      photoMap[u._id.toString()] = u.profilePhoto || "";
    });

    const result = connections.map((c) => {
      const fromId = c.from?._id?.toString();
      const otherId = fromId === userId ? c.to?._id?.toString() : fromId;
      const other = otherUserMap[otherId];

      return {
        connectionId: c._id,
        user: {
          _id: otherId,
          id: otherId,
          name: other?.name || "",
          profilePhoto: photoMap[otherId] || other?.profilePhoto || "",
          city: other?.city || "",
          state: other?.state || "",
          bio: other?.bio || "",
          lifeStage: other?.lifeStage || [],
        },
        connectedAt: c.updatedAt,
      };
    });

    res.json({ connections: result });
  } catch (err) {
    console.error("GET /connections error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// ── GET /api/connections/requests ────────────────────────────
router.get("/requests", auth, async (req, res) => {
  try {
    const userId = (req.user.id || req.user._id || req.userId).toString();

    const requests = await Connection.find({
      to: userId,
      status: "pending",
    })
      .populate(
        "from",
        "name profilePhoto city state lifeStage bio causes religion politicalBeliefs",
      )
      .sort({ createdAt: -1 });

    res.json({ requests });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// ── GET /api/connections/sent ─────────────────────────────────
router.get("/sent", auth, async (req, res) => {
  try {
    const userId = (req.user.id || req.user._id || req.userId).toString();

    const sent = await Connection.find({
      from: userId,
      status: "pending",
    })
      .populate("to", "name profilePhoto city state")
      .sort({ createdAt: -1 });

    res.json({ sent });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// ── POST /api/connections/request/:userId ─────────────────────
router.post("/request/:userId", auth, async (req, res) => {
  try {
    const fromId = (req.user.id || req.user._id || req.userId).toString();
    const toId = req.params.userId;

    if (fromId === toId) {
      return res.status(400).json({ message: "Cannot connect with yourself" });
    }

    const Group = require("../models/Group");
    const sharedGroup = await Group.findOne({
      members: { $all: [fromId, toId] },
      isActive: { $ne: false },
    });

    if (!sharedGroup) {
      return res.status(403).json({
        message: "You must share a group to send a connection request",
      });
    }

    const existing = await Connection.findOne({
      $or: [
        { from: fromId, to: toId },
        { from: toId, to: fromId },
      ],
    });

    if (existing) {
      if (existing.status === "accepted") {
        return res.status(400).json({ message: "Already connected" });
      }
      if (existing.status === "pending") {
        return res.status(400).json({ message: "Request already pending" });
      }
      if (existing.status === "declined") {
        existing.status = "pending";
        existing.from = fromId;
        existing.to = toId;
        existing.message = req.body.message || "";
        existing.sharedGroupId = sharedGroup._id;
        await existing.save();
        return res.json({
          message: "Connection request sent",
          request: existing,
        });
      }
    }

    const connection = new Connection({
      from: fromId,
      to: toId,
      status: "pending",
      message: req.body.message || "",
      sharedGroupId: sharedGroup._id,
    });

    await connection.save();
    res
      .status(201)
      .json({ message: "Connection request sent", request: connection });
  } catch (err) {
    console.error("POST /connections/request error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// ── POST /api/connections/accept/:connectionId ────────────────
router.post("/accept/:connectionId", auth, async (req, res) => {
  try {
    const userId = (req.user.id || req.user._id || req.userId).toString();
    const connection = await Connection.findById(req.params.connectionId);
    if (!connection)
      return res.status(404).json({ message: "Request not found" });

    if (connection.to.toString() !== userId) {
      return res.status(403).json({ message: "Not authorized" });
    }
    if (connection.status !== "pending") {
      return res.status(400).json({ message: "Request already responded to" });
    }

    connection.status = "accepted";
    await connection.save();

    await User.findByIdAndUpdate(connection.from, {
      $addToSet: { matches: connection.to },
    });
    await User.findByIdAndUpdate(connection.to, {
      $addToSet: { matches: connection.from },
    });

    res.json({ message: "Connection accepted" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// ── POST /api/connections/decline/:connectionId ───────────────
router.post("/decline/:connectionId", auth, async (req, res) => {
  try {
    const userId = (req.user.id || req.user._id || req.userId).toString();
    const connection = await Connection.findById(req.params.connectionId);
    if (!connection)
      return res.status(404).json({ message: "Request not found" });

    if (connection.to.toString() !== userId) {
      return res.status(403).json({ message: "Not authorized" });
    }

    connection.status = "declined";
    await connection.save();
    res.json({ message: "Connection declined" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// ── DELETE /api/connections/:connectionId ─────────────────────
router.delete("/:connectionId", auth, async (req, res) => {
  try {
    const userId = (req.user.id || req.user._id || req.userId).toString();
    const connection = await Connection.findById(req.params.connectionId);
    if (!connection) return res.status(404).json({ message: "Not found" });

    if (
      connection.from.toString() !== userId &&
      connection.to.toString() !== userId
    ) {
      return res.status(403).json({ message: "Not authorized" });
    }

    const otherId =
      connection.from.toString() === userId ? connection.to : connection.from;

    await connection.deleteOne();

    await User.findByIdAndUpdate(userId, { $pull: { matches: otherId } });
    await User.findByIdAndUpdate(otherId, { $pull: { matches: userId } });

    res.json({ message: "Connection removed" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// ── GET /api/connections/status/:userId ───────────────────────
router.get("/status/:userId", auth, async (req, res) => {
  try {
    const userId = (req.user.id || req.user._id || req.userId).toString();

    const connection = await Connection.findOne({
      $or: [
        { from: userId, to: req.params.userId },
        { from: req.params.userId, to: userId },
      ],
    });

    if (!connection) return res.json({ status: "none" });

    res.json({
      status: connection.status,
      connectionId: connection._id,
      isSender: connection.from.toString() === userId,
    });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
