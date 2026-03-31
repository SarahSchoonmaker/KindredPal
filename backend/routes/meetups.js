const express = require("express");
const router = express.Router();
const Meetup = require("../models/Meetup");
const User = require("../models/User");
const auth = require("../middleware/auth");
const logger = require("../utils/logger");
const {
  sendMeetupInviteEmail,
  sendMeetupInvitePush,
} = require("../services/notificationService");

router.get("/", auth, async (req, res) => {
  try {
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

router.get("/:meetupId", auth, async (req, res) => {
  try {
    const meetup = await Meetup.findById(req.params.meetupId)
      .populate("creator", "name profilePhoto")
      .populate("invitedUsers", "name profilePhoto")
      .populate("rsvps.user", "name profilePhoto");

    if (!meetup) {
      return res.status(404).json({ message: "Meetup not found" });
    }

    res.json(meetup);
  } catch (error) {
    logger.error("Error fetching meetup:", error);
    res.status(500).json({ message: "Error fetching meetup" });
  }
});

router.post("/", auth, async (req, res) => {
  try {
    const userId = req.userId || req.user?.id;
    logger.info("Creating meetup:", req.body);
    const {
      title,
      description,
      dateTime,
      location,
      invitedUsers,
      maxAttendees,
    } = req.body;

    const meetup = new Meetup({
      title,
      description,
      dateTime,
      location,
      creator: userId,
      invitedUsers: invitedUsers || [],
      maxAttendees,
      rsvps: [{ user: userId, status: "going" }],
    });

    await meetup.save();

    await meetup.populate("creator", "name profilePhoto");
    await meetup.populate("invitedUsers", "name profilePhoto");
    await meetup.populate("rsvps.user", "name profilePhoto");

    logger.info("Created meetup:", meetup.title);

    // Send notifications to all invited users
    if (invitedUsers && invitedUsers.length > 0) {
      const creator = await User.findById(userId).select(
        "name email pushTokens",
      );
      const invitees = await User.find({ _id: { $in: invitedUsers } }).select(
        "name email pushTokens emailNotifications",
      );

      Promise.all(
        invitees.map(async (invitee) => {
          try {
            await sendMeetupInviteEmail({ invitee, creator, meetup });
            await sendMeetupInvitePush({ invitee, creator, meetup });
          } catch (err) {
            logger.error("Failed to notify invitee:", invitee._id, err);
          }
        }),
      ).catch((err) => logger.error("Notification batch error:", err));
    }

    res.status(201).json(meetup);
  } catch (error) {
    logger.error("Error creating meetup:", error);
    res
      .status(500)
      .json({ message: "Error creating meetup", error: error.message });
  }
});

router.post("/:meetupId/rsvp", auth, async (req, res) => {
  try {
    const userId = req.userId || req.user?.id;
    const { status } = req.body;
    const meetup = await Meetup.findById(req.params.meetupId);

    if (!meetup) {
      return res.status(404).json({ message: "Meetup not found" });
    }

    meetup.rsvps = meetup.rsvps.filter((r) => !r.user.equals(userId));

    if (status !== "not-going") {
      meetup.rsvps.push({ user: userId, status });
    }

    await meetup.save();

    await meetup.populate("creator", "name profilePhoto");
    await meetup.populate("invitedUsers", "name profilePhoto");
    await meetup.populate("rsvps.user", "name profilePhoto");

    res.json(meetup);
  } catch (error) {
    logger.error("Error updating RSVP:", error);
    res.status(500).json({ message: "Error updating RSVP" });
  }
});

router.put("/:meetupId", auth, async (req, res) => {
  try {
    const userId = req.userId || req.user?.id;
    const meetup = await Meetup.findById(req.params.meetupId);

    if (!meetup) {
      return res.status(404).json({ message: "Meetup not found" });
    }

    if (!meetup.creator.equals(userId)) {
      return res.status(403).json({ message: "Not authorized" });
    }

    const {
      title,
      description,
      dateTime,
      location,
      maxAttendees,
      invitedUsers,
    } = req.body;

    const existingInviteIds = (meetup.invitedUsers || []).map((id) =>
      id.toString(),
    );
    const newInviteeIds = invitedUsers
      ? invitedUsers.filter((id) => !existingInviteIds.includes(id.toString()))
      : [];

    meetup.title = title || meetup.title;
    meetup.description =
      description !== undefined ? description : meetup.description;
    meetup.dateTime = dateTime || meetup.dateTime;
    meetup.location = location || meetup.location;
    meetup.maxAttendees =
      maxAttendees !== undefined ? maxAttendees : meetup.maxAttendees;
    if (invitedUsers) {
      meetup.invitedUsers = [
        ...new Set([
          ...existingInviteIds,
          ...invitedUsers.map((id) => id.toString()),
        ]),
      ];
    }

    await meetup.save();

    await meetup.populate("creator", "name profilePhoto");
    await meetup.populate("invitedUsers", "name profilePhoto");
    await meetup.populate("rsvps.user", "name profilePhoto");

    if (newInviteeIds.length > 0) {
      const creator = await User.findById(userId).select("name email");
      const newInvitees = await User.find({
        _id: { $in: newInviteeIds },
      }).select("name email pushTokens emailNotifications");

      Promise.all(
        newInvitees.map(async (invitee) => {
          try {
            await sendMeetupInviteEmail({ invitee, creator, meetup });
            await sendMeetupInvitePush({ invitee, creator, meetup });
          } catch (err) {
            logger.error(
              "Failed to notify new invitee on edit:",
              invitee._id,
              err,
            );
          }
        }),
      ).catch((err) => logger.error("Edit invite notification error:", err));
    }

    res.json(meetup);
  } catch (error) {
    logger.error("Error updating meetup:", error);
    res.status(500).json({ message: "Error updating meetup" });
  }
});

router.delete("/:meetupId", auth, async (req, res) => {
  try {
    const userId = req.userId || req.user?.id;
    const meetup = await Meetup.findById(req.params.meetupId);

    if (!meetup) {
      return res.status(404).json({ message: "Meetup not found" });
    }

    if (!meetup.creator.equals(userId)) {
      return res.status(403).json({ message: "Not authorized" });
    }

    await meetup.deleteOne();
    res.json({ message: "Meetup deleted" });
  } catch (error) {
    logger.error("Error deleting meetup:", error);
    res.status(500).json({ message: "Error deleting meetup" });
  }
});

module.exports = router;
