const express = require("express");
const router = express.Router({ mergeParams: true }); // mergeParams for :groupId
const auth = require("../middleware/auth");
const Event = require("../models/Event");
const Group = require("../models/Group");

// ─── GET /api/groups/:groupId/events ─────────────────────────────
// List all upcoming events for a group
router.get("/", auth, async (req, res) => {
  try {
    const { groupId } = req.params;
    const now = new Date();

    const events = await Event.find({
      group: groupId,
      isActive: true,
      date: { $gte: now },
    })
      .populate("createdBy", "name profilePhoto")
      .populate("rsvps.user", "name profilePhoto lifeStage religion")
      .sort({ date: 1 })
      .lean();

    // Add isGoing flag and attendee preview for each event
    const userId = req.user.id;
    const result = events.map((e) => {
      const goingRsvps = e.rsvps.filter((r) => r.status === "going");
      const goingPreview = goingRsvps
        .filter(r => r.user && r.user._id)
        .slice(0, 5)
        .map(r => ({
          _id: r.user._id,
          name: r.user.name,
          profilePhoto: r.user.profilePhoto,
          lifeStage: r.user.lifeStage,
          religion: r.user.religion,
        }));
      return {
        ...e,
        isGoing: e.rsvps.some((r) => r.user?._id?.toString() === userId && r.status === "going"),
        isMaybe: e.rsvps.some((r) => r.user?._id?.toString() === userId && r.status === "maybe"),
        goingCount: goingRsvps.length,
        maybeCount: e.rsvps.filter((r) => r.status === "maybe").length,
        goingPreview,
      };
    });

    res.json({ events: result });
  } catch (err) {
    console.error("GET /events error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// ─── POST /api/groups/:groupId/events ────────────────────────────
// Create a new event (group admins only)
router.post("/", auth, async (req, res) => {
  try {
    const { groupId } = req.params;
    const group = await Group.findById(groupId);
    if (!group) return res.status(404).json({ message: "Group not found" });

    const isAdmin = group.admins.some((a) => a.toString() === req.user.id);
    if (!isAdmin) return res.status(403).json({ message: "Only group admins can create events" });

    const {
      title, description, date, endDate,
      address, city, state, isVirtual, virtualLink, maxAttendees,
    } = req.body;

    if (!title || !date) {
      return res.status(400).json({ message: "Title and date are required" });
    }

    const event = new Event({
      group: groupId,
      createdBy: req.user.id,
      title,
      description: description || "",
      date: new Date(date),
      endDate: endDate ? new Date(endDate) : null,
      address: address || "",
      city: city || "",
      state: state || "",
      isVirtual: isVirtual || false,
      virtualLink: virtualLink || "",
      maxAttendees: maxAttendees || null,
      // Creator auto-RSVPs as going
      rsvps: [{ user: req.user.id, status: "going" }],
    });

    await event.save();
    await event.populate("createdBy", "name profilePhoto");

    res.status(201).json({
      ...event.toObject(),
      isGoing: true,
      goingCount: 1,
      maybeCount: 0,
    });
  } catch (err) {
    console.error("POST /events error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// ─── POST /api/groups/:groupId/events/:eventId/rsvp ──────────────
// RSVP to an event
router.post("/:eventId/rsvp", auth, async (req, res) => {
  try {
    const { eventId } = req.params;
    const { status } = req.body; // "going" | "maybe" | "not_going"
    const userId = req.user.id;

    const event = await Event.findById(eventId);
    if (!event || !event.isActive) {
      return res.status(404).json({ message: "Event not found" });
    }

    // Check capacity
    if (status === "going" && event.maxAttendees) {
      const goingCount = event.rsvps.filter((r) => r.status === "going").length;
      const alreadyGoing = event.rsvps.some(
        (r) => r.user.toString() === userId && r.status === "going"
      );
      if (!alreadyGoing && goingCount >= event.maxAttendees) {
        return res.status(400).json({ message: "This event is full" });
      }
    }

    // Update or add RSVP
    const existingIdx = event.rsvps.findIndex((r) => r.user.toString() === userId);
    if (existingIdx >= 0) {
      if (status === "not_going") {
        event.rsvps.splice(existingIdx, 1); // remove entirely
      } else {
        event.rsvps[existingIdx].status = status;
      }
    } else if (status !== "not_going") {
      event.rsvps.push({ user: userId, status });
    }

    await event.save();

    res.json({
      message: "RSVP updated",
      isGoing: event.rsvps.some((r) => r.user.toString() === userId && r.status === "going"),
      isMaybe: event.rsvps.some((r) => r.user.toString() === userId && r.status === "maybe"),
      goingCount: event.rsvps.filter((r) => r.status === "going").length,
      maybeCount: event.rsvps.filter((r) => r.status === "maybe").length,
    });
  } catch (err) {
    console.error("RSVP error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// ─── DELETE /api/groups/:groupId/events/:eventId ─────────────────
// Delete event (admin or creator)
router.delete("/:eventId", auth, async (req, res) => {
  try {
    const { groupId, eventId } = req.params;
    const event = await Event.findById(eventId);
    if (!event) return res.status(404).json({ message: "Event not found" });

    const group = await Group.findById(groupId);
    const isAdmin = group?.admins.some((a) => a.toString() === req.user.id);
    const isCreator = event.createdBy.toString() === req.user.id;

    if (!isAdmin && !isCreator) {
      return res.status(403).json({ message: "Not authorized" });
    }

    event.isActive = false;
    await event.save();

    res.json({ message: "Event deleted" });
  } catch (err) {
    console.error("DELETE /events error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;