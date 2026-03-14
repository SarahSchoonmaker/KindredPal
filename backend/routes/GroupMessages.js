const express = require("express");
const router = express.Router({ mergeParams: true }); // gets :groupId
const auth = require("../middleware/auth");
const GroupMessage = require("../models/GroupMessage");
const Group = require("../models/Group");

const PAGE_SIZE = 40;

// ─── GET /api/groups/:groupId/messages ───────────────────────────
// Fetch messages for group chat or event thread
// ?eventId=xxx for event thread, omit for main chat
// ?before=ISO for pagination (load older)
router.get("/", auth, async (req, res) => {
  try {
    const { groupId } = req.params;
    const { eventId, before } = req.query;

    // Verify user is a member
    const group = await Group.findById(groupId).select("members isPrivate").lean();
    if (!group) return res.status(404).json({ message: "Group not found" });
    const isMember = group.members.some(m => m.toString() === req.user.id);
    if (!isMember && group.isPrivate) {
      return res.status(403).json({ message: "Join the group to see chat" });
    }

    const query = {
      group: groupId,
      event: eventId || null,
      isDeleted: false,
    };
    if (before) query.createdAt = { $lt: new Date(before) };

    const messages = await GroupMessage.find(query)
      .populate("sender", "name profilePhoto")
      .sort({ createdAt: -1 })
      .limit(PAGE_SIZE)
      .lean();

    // Return in chronological order
    res.json({ messages: messages.reverse() });
  } catch (err) {
    console.error("GET /group-messages error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// ─── POST /api/groups/:groupId/messages ──────────────────────────
// Send a message (REST fallback; socket is primary)
router.post("/", auth, async (req, res) => {
  try {
    const { groupId } = req.params;
    const { content, eventId } = req.body;

    if (!content?.trim()) return res.status(400).json({ message: "Message cannot be empty" });

    const group = await Group.findById(groupId).select("members isPrivate").lean();
    if (!group) return res.status(404).json({ message: "Group not found" });
    const isMember = group.members.some(m => m.toString() === req.user.id);
    if (!isMember) return res.status(403).json({ message: "Join the group to chat" });

    const msg = await GroupMessage.create({
      group: groupId,
      event: eventId || null,
      sender: req.user.id,
      content: content.trim(),
    });

    await msg.populate("sender", "name profilePhoto");

    res.status(201).json(msg);
  } catch (err) {
    console.error("POST /group-messages error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// ─── DELETE /api/groups/:groupId/messages/:msgId ─────────────────
router.delete("/:msgId", auth, async (req, res) => {
  try {
    const { groupId } = req.params;
    const msg = await GroupMessage.findById(req.params.msgId);
    if (!msg) return res.status(404).json({ message: "Message not found" });

    const group = await Group.findById(groupId).select("admins").lean();
    const isAdmin = group?.admins.some(a => a.toString() === req.user.id);
    const isOwner = msg.sender.toString() === req.user.id;

    if (!isAdmin && !isOwner) return res.status(403).json({ message: "Not authorized" });

    msg.isDeleted = true;
    await msg.save();

    res.json({ message: "Deleted" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;