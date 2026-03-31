// ─────────────────────────────────────────────────────────────────────────────
// FILE 1: Replace the GET / handler at the TOP of backend/routes/meetups.js
// ─────────────────────────────────────────────────────────────────────────────

router.get("/", auth, async (req, res) => {
  try {
    // FIX: meetups.js uses req.userId but auth middleware may not always set it.
    // Use both sources with fallback so it works regardless of auth middleware version.
    const userId = req.userId || req.user?.id;
    logger.info("Getting meetups for user:", userId);

    const meetups = await Meetup.find({
      $or: [{ creator: userId }, { invitedUsers: userId }],
      isActive: true,
    })
      .populate("creator", "name profilePhoto")
      .populate("invitedUsers", "name profilePhoto")
      .populate("rsvps.user", "name profilePhoto")
      .sort({ dateTime: 1 });

    logger.info("Found", meetups.length, "meetups");
    res.json(meetups);
  } catch (error) {
    logger.error("Error fetching meetups:", error);
    res.status(500).json({ message: "Error fetching meetups" });
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// FILE 2: Replace the GET /counts handler in backend/routes/users.js
// ─────────────────────────────────────────────────────────────────────────────

router.get("/counts", auth, async (req, res) => {
  try {
    // FIX: normalize — users.js uses req.userId but groups/connections use req.user.id
    const userId = req.userId || req.user?.id;

    const unread = await Message.countDocuments({
      recipientId: userId,
      read: false,
    });

    const Meetup = require("../models/Meetup");
    const meetupInvites = await Meetup.find({
      invitedUsers: userId,
      isActive: true,
    }).select("_id rsvps");
    const pendingMeetups = meetupInvites.filter(
      (m) => !m.rsvps.some((r) => r.user.toString() === userId),
    );

    const Group = require("../models/Group");
    const pendingGroupInvites = await Group.find({
      invitedUsers: userId,
      isActive: { $ne: false },
      members: { $ne: userId },
    })
      .select("_id")
      .lean();

    const Connection = require("../models/Connection");
    const requestCount = await Connection.countDocuments({
      to: userId, // FIX: Connection model uses "to" not "recipient"
      status: "pending",
    });

    const groupInviteCount = pendingGroupInvites.length;

    res.json({
      unread,
      meetups: pendingMeetups.length + groupInviteCount,
      meetupInviteIds: pendingMeetups.map((m) => m._id.toString()),
      groupInviteIds: pendingGroupInvites.map((g) => g._id.toString()),
      groupInviteCount,
      requestCount,
    });
  } catch (error) {
    console.error("❌ Get counts error:", error);
    res.status(500).json({ message: "Error fetching counts" });
  }
});
