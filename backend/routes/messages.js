const express = require("express");
const router = express.Router();
const Message = require("../models/Message");
const User = require("../models/User");
const Connection = require("../models/Connection");
const auth = require("../middleware/auth");
const { sendPushNotification } = require("../utils/pushNotifications");
const logger = require("../utils/logger");

// Helper: check if two users are connected (accepted connection only)
async function areConnected(userIdA, userIdB) {
  const connection = await Connection.findOne({
    $or: [
      { from: userIdA, to: userIdB },
      { from: userIdB, to: userIdA },
    ],
    status: "accepted",
  });
  return !!connection;
}

// Helper: check if recipient has blocked the sender
async function isBlockedBy(recipientId, senderId) {
  const recipient = await User.findById(recipientId)
    .select("blockedUsers")
    .lean();
  if (!recipient) return false;
  return (recipient.blockedUsers || []).some(
    (id) => id.toString() === senderId.toString(),
  );
}

// Get all conversations — only accepted connections, no legacy matches
router.get("/conversations", auth, async (req, res) => {
  try {
    const userId = req.userId || req.user?.id;
    logger.info("📥 Getting conversations for user:", userId);

    const currentUser = await User.findById(userId)
      .select("blockedUsers")
      .lean();
    const blockedIds = new Set(
      (currentUser?.blockedUsers || []).map((id) => id.toString()),
    );

    // Get accepted connections only
    const connections = await Connection.find({
      $or: [{ from: userId }, { to: userId }],
      status: "accepted",
    })
      .populate("from", "_id name profilePhoto city state")
      .populate("to", "_id name profilePhoto city state")
      .lean();

    const messageableUsers = new Map();
    connections.forEach((c) => {
      const fromId = c.from?._id?.toString();
      const other = fromId === userId.toString() ? c.to : c.from;
      if (other?._id && !blockedIds.has(other._id.toString())) {
        messageableUsers.set(other._id.toString(), other);
      }
    });

    // Build conversation list with last message and unread count for each connection
    const allUsers = Array.from(messageableUsers.values());
    const conversationsWithMessages = await Promise.all(
      allUsers.map(async (otherUser) => {
        const otherId = otherUser._id.toString();
        const lastMessage = await Message.findOne({
          $or: [
            { senderId: userId, recipientId: otherId },
            { senderId: otherId, recipientId: userId },
          ],
        })
          .sort({ createdAt: -1 })
          .limit(1)
          .lean();

        const unreadCount = await Message.countDocuments({
          senderId: otherId,
          recipientId: userId,
          read: false,
        });

        return {
          _id: otherId,
          name: otherUser.name,
          profilePhoto: otherUser.profilePhoto || "",
          city: otherUser.city || "",
          state: otherUser.state || "",
          lastMessage: lastMessage || null,
          unreadCount,
        };
      }),
    );

    // Sort: most recent message first, then connections with no messages
    conversationsWithMessages.sort((a, b) => {
      const aTime = a.lastMessage?.createdAt
        ? new Date(a.lastMessage.createdAt).getTime()
        : 0;
      const bTime = b.lastMessage?.createdAt
        ? new Date(b.lastMessage.createdAt).getTime()
        : 0;
      return bTime - aTime;
    });

    logger.info(
      "📤 Returning",
      conversationsWithMessages.length,
      "conversations",
    );
    res.json(conversationsWithMessages);
  } catch (error) {
    logger.error("❌ Get conversations error:", error);
    res.status(500).json({ message: "Error fetching conversations" });
  }
});

// Get messages with a specific user
router.get("/:userId", auth, async (req, res) => {
  try {
    const currentUserId = req.userId || req.user?.id;
    const otherUserId = req.params.userId;

    logger.info(
      "📥 Getting messages between",
      currentUserId,
      "and",
      otherUserId,
    );

    const connected = await areConnected(currentUserId, otherUserId);
    if (!connected) {
      return res
        .status(403)
        .json({ message: "You can only message your connections" });
    }

    const messages = await Message.find({
      $or: [
        { senderId: currentUserId, recipientId: otherUserId },
        { senderId: otherUserId, recipientId: currentUserId },
      ],
    })
      .sort({ createdAt: 1 })
      .limit(100);

    await Message.updateMany(
      { senderId: otherUserId, recipientId: currentUserId, read: false },
      { $set: { read: true, readAt: new Date() } },
    );

    logger.info("✅ Found", messages.length, "messages");
    res.json(messages);
  } catch (error) {
    logger.error("❌ Get messages error:", error);
    res.status(500).json({ message: "Error fetching messages" });
  }
});

// Send a message
router.post("/", auth, async (req, res) => {
  try {
    const currentUserId = req.userId || req.user?.id;
    const { recipientId, content } = req.body;

    logger.info("📥 Sending message from", currentUserId, "to", recipientId);

    if (!content || content.trim().length === 0) {
      return res.status(400).json({ message: "Message content is required" });
    }
    if (content.length > 1000) {
      return res
        .status(400)
        .json({ message: "Message too long (max 1000 characters)" });
    }

    // Check if recipient has blocked the sender
    const blocked = await isBlockedBy(recipientId, currentUserId);
    if (blocked) {
      return res.status(403).json({ message: "You cannot message this user" });
    }

    // Check if sender has blocked the recipient
    const senderBlockedRecipient = await isBlockedBy(
      currentUserId,
      recipientId,
    );
    if (senderBlockedRecipient) {
      return res.status(403).json({ message: "You have blocked this user" });
    }

    // Check connection
    const connected = await areConnected(currentUserId, recipientId);
    if (!connected) {
      return res
        .status(403)
        .json({ message: "You can only message your connections" });
    }

    const message = new Message({
      senderId: currentUserId,
      recipientId,
      content: content.trim(),
    });

    await message.save();
    logger.info("✅ Message sent:", message._id);

    // Push notification
    const recipient = await User.findById(recipientId);
    if (recipient?.pushTokens?.length > 0) {
      const sender = await User.findById(currentUserId);
      await sendPushNotification(
        recipient.pushTokens,
        `New message from ${sender.name}`,
        content.substring(0, 100),
        { type: "message", userId: currentUserId },
      );
    }

    // Socket event
    const io = req.app.get("io");
    const userSockets = req.app.get("userSockets");
    if (io && userSockets) {
      const recipientSocketId = userSockets.get(recipientId);
      if (recipientSocketId) {
        logger.info("📨 Emitting new-message to:", recipientId);
        io.to(recipientSocketId).emit("new-message", message);
      }
    }

    res.status(201).json(message);
  } catch (error) {
    logger.error("❌ Send message error:", error);
    res.status(500).json({ message: "Error sending message" });
  }
});

// Mark message as read
router.put("/:messageId/read", auth, async (req, res) => {
  try {
    const userId = req.userId || req.user?.id;
    const message = await Message.findOne({
      _id: req.params.messageId,
      recipientId: userId,
    });
    if (!message) return res.status(404).json({ message: "Message not found" });
    message.read = true;
    message.readAt = new Date();
    await message.save();
    res.json(message);
  } catch (error) {
    logger.error("❌ Mark read error:", error);
    res.status(500).json({ message: "Error marking message as read" });
  }
});

// Get unread message count
router.get("/unread/count", auth, async (req, res) => {
  try {
    const userId = req.userId || req.user?.id;
    const count = await Message.countDocuments({
      recipientId: userId,
      read: false,
    });
    res.json({ count });
  } catch (error) {
    logger.error("❌ Get unread count error:", error);
    res.status(500).json({ message: "Error getting unread count" });
  }
});

// Get unread count for specific user
router.get("/unread/count/:userId", auth, async (req, res) => {
  try {
    const currentUserId = req.userId || req.user?.id;
    const count = await Message.countDocuments({
      senderId: req.params.userId,
      recipientId: currentUserId,
      read: false,
    });
    res.json({ count });
  } catch (error) {
    logger.error("❌ Get unread count for user error:", error);
    res.status(500).json({ message: "Error getting unread count" });
  }
});

module.exports = router;
