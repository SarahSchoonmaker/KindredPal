const express = require("express");
const router = express.Router();
const Meetup = require("../models/Meetup");
const auth = require("../middleware/auth");

router.get("/", auth, async (req, res) => {
  try {
    console.log("Getting meetups for user:", req.userId);

    const meetups = await Meetup.find({
      $or: [{ creator: req.userId }, { invitedUsers: req.userId }],
      isActive: true,
    })
      .populate("creator", "name profilePhoto")
      .populate("invitedUsers", "name profilePhoto")
      .populate("rsvps.user", "name profilePhoto")
      .sort({ dateTime: 1 });

    console.log("Found", meetups.length, "meetups");
    res.json(meetups);
  } catch (error) {
    console.error("Error fetching meetups:", error);
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
    console.error("Error fetching meetup:", error);
    res.status(500).json({ message: "Error fetching meetup" });
  }
});

router.post("/", auth, async (req, res) => {
  try {
    console.log("Creating meetup:", req.body);
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
      creator: req.userId,
      invitedUsers: invitedUsers || [],
      maxAttendees,
      rsvps: [{ user: req.userId, status: "going" }],
    });

    await meetup.save();

    await meetup.populate("creator", "name profilePhoto");
    await meetup.populate("invitedUsers", "name profilePhoto");
    await meetup.populate("rsvps.user", "name profilePhoto");

    console.log("Created meetup:", meetup.title);
    res.status(201).json(meetup);
  } catch (error) {
    console.error("Error creating meetup:", error);
    res
      .status(500)
      .json({ message: "Error creating meetup", error: error.message });
  }
});

router.post("/:meetupId/rsvp", auth, async (req, res) => {
  try {
    const { status } = req.body;
    const meetup = await Meetup.findById(req.params.meetupId);

    if (!meetup) {
      return res.status(404).json({ message: "Meetup not found" });
    }

    meetup.rsvps = meetup.rsvps.filter((r) => !r.user.equals(req.userId));

    if (status !== "not-going") {
      meetup.rsvps.push({ user: req.userId, status });
    }

    await meetup.save();

    await meetup.populate("creator", "name profilePhoto");
    await meetup.populate("invitedUsers", "name profilePhoto");
    await meetup.populate("rsvps.user", "name profilePhoto");

    res.json(meetup);
  } catch (error) {
    console.error("Error updating RSVP:", error);
    res.status(500).json({ message: "Error updating RSVP" });
  }
});

router.put("/:meetupId", auth, async (req, res) => {
  try {
    const meetup = await Meetup.findById(req.params.meetupId);

    if (!meetup) {
      return res.status(404).json({ message: "Meetup not found" });
    }

    if (!meetup.creator.equals(req.userId)) {
      return res.status(403).json({ message: "Not authorized" });
    }

    const { title, description, dateTime, location, maxAttendees } = req.body;

    meetup.title = title || meetup.title;
    meetup.description =
      description !== undefined ? description : meetup.description;
    meetup.dateTime = dateTime || meetup.dateTime;
    meetup.location = location || meetup.location;
    meetup.maxAttendees =
      maxAttendees !== undefined ? maxAttendees : meetup.maxAttendees;

    await meetup.save();

    await meetup.populate("creator", "name profilePhoto");
    await meetup.populate("invitedUsers", "name profilePhoto");
    await meetup.populate("rsvps.user", "name profilePhoto");

    res.json(meetup);
  } catch (error) {
    console.error("Error updating meetup:", error);
    res.status(500).json({ message: "Error updating meetup" });
  }
});

router.delete("/:meetupId", auth, async (req, res) => {
  try {
    const meetup = await Meetup.findById(req.params.meetupId);

    if (!meetup) {
      return res.status(404).json({ message: "Meetup not found" });
    }

    if (!meetup.creator.equals(req.userId)) {
      return res.status(403).json({ message: "Not authorized" });
    }

    await meetup.deleteOne();
    res.json({ message: "Meetup deleted" });
  } catch (error) {
    console.error("Error deleting meetup:", error);
    res.status(500).json({ message: "Error deleting meetup" });
  }
});

module.exports = router;
