// ============================================================
// backend/routes/connections.js
// Connection request flow — replaces like/pass/match
// ============================================================
const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const User = require("../models/User");
const Connection = require("../models/Connection");

// ── GET /api/connections ─────────────────────────────────────
// My accepted connections (replaces /users/matches)
router.get("/", auth, async (req, res) => {
  try {
    const connections = await Connection.find({
      $or: [{ from: req.user.id }, { to: req.user.id }],
      status: "accepted",
    })
      .populate("from", "name profilePhoto city state lifeStage bio")
      .populate("to", "name profilePhoto city state lifeStage bio")
      .sort({ updatedAt: -1 });

    // Return the OTHER person in each connection
    const userId = req.user.id;
    const result = connections.map((c) => {
      const other = c.from._id.toString() === userId ? c.to : c.from;
      return { connectionId: c._id, user: other, connectedAt: c.updatedAt };
    });

    res.json({ connections: result });
  } catch (err) {
    console.error("GET /connections error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// ── GET /api/connections/requests ────────────────────────────
// Pending requests I've RECEIVED (need to respond to)
router.get("/requests", auth, async (req, res) => {
  try {
    const requests = await Connection.find({
      to: req.user.id,
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
// Requests I've SENT (pending outgoing)
router.get("/sent", auth, async (req, res) => {
  try {
    const sent = await Connection.find({
      from: req.user.id,
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
// Send a connection request to someone in a shared group
router.post("/request/:userId", auth, async (req, res) => {
  try {
    const fromId = req.user.id;
    const toId = req.params.userId;

    if (fromId === toId) {
      return res.status(400).json({ message: "Cannot connect with yourself" });
    }

    // Check they share at least one group
    const Group = require("../models/Group");
    const sharedGroup = await Group.findOne({
      members: { $all: [fromId, toId] },
      isActive: true,
    });

    if (!sharedGroup) {
      return res.status(403).json({
        message: "You must share a group to send a connection request",
      });
    }

    // Check no existing connection/request
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
        // Allow re-request after decline (update existing)
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
    const connection = await Connection.findById(req.params.connectionId);
    if (!connection)
      return res.status(404).json({ message: "Request not found" });

    if (connection.to.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized" });
    }
    if (connection.status !== "pending") {
      return res.status(400).json({ message: "Request already responded to" });
    }

    connection.status = "accepted";
    await connection.save();

    // Also keep User.matches in sync for messaging compatibility
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
    const connection = await Connection.findById(req.params.connectionId);
    if (!connection)
      return res.status(404).json({ message: "Request not found" });

    if (connection.to.toString() !== req.user.id) {
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
// Remove an accepted connection (unmatch)
router.delete("/:connectionId", auth, async (req, res) => {
  try {
    const connection = await Connection.findById(req.params.connectionId);
    if (!connection) return res.status(404).json({ message: "Not found" });

    const userId = req.user.id;
    if (
      connection.from.toString() !== userId &&
      connection.to.toString() !== userId
    ) {
      return res.status(403).json({ message: "Not authorized" });
    }

    const otherId =
      connection.from.toString() === userId ? connection.to : connection.from;

    await connection.deleteOne();

    // Keep User.matches in sync
    await User.findByIdAndUpdate(userId, { $pull: { matches: otherId } });
    await User.findByIdAndUpdate(otherId, { $pull: { matches: userId } });

    res.json({ message: "Connection removed" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// ── GET /api/connections/status/:userId ───────────────────────
// Check connection status with a specific user
router.get("/status/:userId", auth, async (req, res) => {
  try {
    const connection = await Connection.findOne({
      $or: [
        { from: req.user.id, to: req.params.userId },
        { from: req.params.userId, to: req.user.id },
      ],
    });

    if (!connection) return res.json({ status: "none" });

    res.json({
      status: connection.status,
      connectionId: connection._id,
      isSender: connection.from.toString() === req.user.id,
    });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
