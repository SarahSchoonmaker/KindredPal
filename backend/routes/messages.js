const express = require("express");
const router = express.Router();
const Message = require("../models/Message");
const User = require("../models/User");
const auth = require("../middleware/auth");
const { sendPushNotification } = require("../utils/PushNotifications");
const logger = require("../utils/logger");

// Get all conversations (users you've messaged with)
router.get("/conversations", auth, async (req, res) => {
  try {
    logger.info("📥 Getting conversations for user:", req.userId);

    const currentUser = await User.findById(req.userId);

    // Get all matches (only matched users can message)
    const matchedUsers = await User.find({
      _id: { $in: currentUser.matches },
    }).select("name profilePhoto city state");

    logger.info("✅ Found", matchedUsers.length, "matched users");

    // Get last message with each match
    const conversationsWithMessages = await Promise.all(
      matchedUsers.map(async (user) => {
        const lastMessage = await Message.findOne({
          $or: [
            { senderId: req.userId, recipientId: user._id },
            { senderId: user._id, recipientId: req.userId },
          ],
        })
          .sort({ createdAt: -1 })
          .limit(1);

        const unreadCount = await Message.countDocuments({
          senderId: user._id,
          recipientId: req.userId,
          read: false,
        });

        return {
          otherUser: user.toObject(),
          lastMessage: lastMessage || null,
          unreadCount,
        };
      }),
    );

    // Sort by most recent message
    conversationsWithMessages.sort((a, b) => {
      const aTime = a.lastMessage?.createdAt || 0;
      const bTime = b.lastMessage?.createdAt || 0;
      return bTime - aTime;
    });

    res.json(conversationsWithMessages);
  } catch (error) {
    logger.error("❌ Get conversations error:", error);
    res.status(500).json({ message: "Error fetching conversations" });
  }
});

// Get messages with a specific user
router.get("/:userId", auth, async (req, res) => {
  try {
    logger.info(
      "📥 Getting messages between",
      req.userId,
      "and",
      req.params.userId,
    );

    // Verify they're matched
    const currentUser = await User.findById(req.userId);
    if (!currentUser.matches.includes(req.params.userId)) {
      return res
        .status(403)
        .json({ message: "You can only message your matches" });
    }

    const messages = await Message.find({
      $or: [
        { senderId: req.userId, recipientId: req.params.userId },
        { senderId: req.params.userId, recipientId: req.userId },
      ],
    })
      .sort({ createdAt: 1 })
      .limit(100); // Last 100 messages

    // Mark messages as read
    await Message.updateMany(
      {
        senderId: req.params.userId,
        recipientId: req.userId,
        read: false,
      },
      {
        $set: { read: true, readAt: new Date() },
      },
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
    const { recipientId, content } = req.body;

    logger.info("📥 Sending message from", req.userId, "to", recipientId);

    if (!content || content.trim().length === 0) {
      return res.status(400).json({ message: "Message content is required" });
    }

    if (content.length > 1000) {
      return res
        .status(400)
        .json({ message: "Message too long (max 1000 characters)" });
    }

    // Verify they're matched
    const currentUser = await User.findById(req.userId);
    if (!currentUser.matches.includes(recipientId)) {
      return res
        .status(403)
        .json({ message: "You can only message your matches" });
    }

    const message = new Message({
      senderId: req.userId,
      recipientId,
      content: content.trim(),
    });

    await message.save();

    logger.info("✅ Message sent:", message._id);

    // 🔔 Send push notification
    const recipient = await User.findById(recipientId);
    if (recipient.pushTokens && recipient.pushTokens.length > 0) {
      const sender = await User.findById(req.userId);
      await sendPushNotification(
        recipient.pushTokens,
        `New message from ${sender.name}`,
        content.substring(0, 100),
        { type: "message", userId: req.userId },
      );
    }

    // ✅ EMIT SOCKET EVENT
    const io = req.app.get("io");
    const userSockets = req.app.get("userSockets");

    if (io && userSockets) {
      const recipientSocketId = userSockets.get(recipientId);

      if (recipientSocketId) {
        logger.info("📨 Emitting new-message event to recipient:", recipientId);
        io.to(recipientSocketId).emit("new-message", message);
      } else {
        logger.info("⚠️ Recipient not currently online:", recipientId);
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
    const message = await Message.findOne({
      _id: req.params.messageId,
      recipientId: req.userId,
    });

    if (!message) {
      return res.status(404).json({ message: "Message not found" });
    }

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
    const count = await Message.countDocuments({
      recipientId: req.userId,
      read: false,
    });

    res.json({ count });
  } catch (error) {
    logger.error("❌ Get unread count error:", error);
    res.status(500).json({ message: "Error getting unread count" });
  }
});

// Get unread message count for specific user
router.get("/unread/count/:userId", auth, async (req, res) => {
  try {
    const count = await Message.countDocuments({
      senderId: req.params.userId,
      recipientId: req.userId,
      read: false,
    });

    res.json({ count });
  } catch (error) {
    logger.error("❌ Get unread count for user error:", error);
    res.status(500).json({ message: "Error getting unread count" });
  }
});

module.exports = router;
