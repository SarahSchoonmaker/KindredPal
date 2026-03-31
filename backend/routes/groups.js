const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const auth = require("../middleware/auth");
const Group = require("../models/Group");
const User = require("../models/User");
const { sendGroupInviteEmail } = require("../services/notificationService");

const multer = require("multer");
const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) cb(null, true);
    else cb(new Error("Only image files are allowed"), false);
  },
});

// ─── GET /api/groups ──────────────────────────────────────────────────────────
router.get("/", auth, async (req, res) => {
  try {
    const userId =
      req.user.id?.toString() || req.user._id?.toString() || req.userId;

    const {
      category,
      search,
      page = 1,
      limit = 20,
      city: filterCity,
      state: filterState,
      religion: filterReligion,
      lifeStage: filterLifeStage,
      distance,
    } = req.query;

    const query = { isActive: { $ne: false } };

    const searchCity = filterCity?.trim();
    const searchState = filterState?.trim();

    if (!search) {
      if (searchCity && searchState) {
        query.$or = [
          { isNationwide: true, isPrivate: false },
          {
            isPrivate: false,
            city: { $regex: new RegExp("^" + searchCity + "$", "i") },
            state: { $regex: new RegExp("^" + searchState + "$", "i") },
          },
        ];
      } else if (searchState) {
        query.$or = [
          { isNationwide: true, isPrivate: false },
          {
            isPrivate: false,
            state: { $regex: new RegExp("^" + searchState + "$", "i") },
          },
        ];
      } else if (searchCity) {
        query.$or = [
          { isNationwide: true, isPrivate: false },
          {
            isPrivate: false,
            city: { $regex: new RegExp("^" + searchCity + "$", "i") },
          },
        ];
      } else {
        query.isPrivate = false;
      }
    }

    if (category) query.category = category;
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        { category: { $regex: search, $options: "i" } },
        { city: { $regex: search, $options: "i" } },
      ];
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const groups = await Group.find(query)
      .populate("createdBy", "name profilePhoto")
      .populate(
        "members",
        "religion politicalBeliefs lifeStage familySituation",
      )
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .lean();

    const groupsWithMembership = groups.map((g) => {
      const members = g.members || [];
      const THRESHOLD = 3;
      const freq = (arr) =>
        arr.reduce((acc, v) => {
          if (v) acc[v] = (acc[v] || 0) + 1;
          return acc;
        }, {});
      const topByThreshold = (obj) =>
        Object.keys(obj).filter((k) => obj[k] >= THRESHOLD);
      const flatFreq = (arr) => {
        const obj = {};
        arr.forEach((v) => {
          if (v) obj[v] = (obj[v] || 0) + 1;
        });
        return topByThreshold(obj);
      };

      return {
        ...g,
        members: g.members.map((m) => m._id || m),
        isMember: g.members.some((m) => (m._id || m).toString() === userId),
        isPending: g.pendingRequests?.some(
          (r) => r.userId?.toString() === userId,
        ),
        memberValues: {
          religions: topByThreshold(freq(members.map((m) => m.religion))),
          politics: topByThreshold(
            freq(members.map((m) => m.politicalBeliefs)),
          ),
          lifeStages: flatFreq(members.flatMap((m) => m.lifeStage || [])),
          families: flatFreq(members.flatMap((m) => m.familySituation || [])),
        },
      };
    });

    const total = await Group.countDocuments(query);
    res.json({
      groups: groupsWithMembership,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / parseInt(limit)),
    });
  } catch (err) {
    console.error("GET /groups error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// ─── GET /api/groups/my ───────────────────────────────────────────────────────
router.get("/my", auth, async (req, res) => {
  try {
    // KEY FIX: req.user is a Mongoose document. req.user.id is a virtual getter
    // that returns _id as string — but in $or queries against ObjectId array
    // fields, Mongoose needs an actual ObjectId, not a string, to match reliably.
    // Explicit cast eliminates the mobile-vs-web inconsistency entirely.
    const rawId = req.user.id || req.user._id || req.userId;
    console.log("GET /groups/my rawId:", rawId, "type:", typeof rawId);

    if (!mongoose.Types.ObjectId.isValid(rawId)) {
      console.error("GET /groups/my invalid userId:", rawId);
      return res.status(400).json({ message: "Invalid user ID" });
    }
    const userId = new mongoose.Types.ObjectId(rawId);

    const groups = await Group.find({
      $or: [{ members: userId }, { createdBy: userId }],
      // $ne false catches docs where isActive is missing (seeded groups, old records)
      isActive: { $ne: false },
    })
      .populate("createdBy", "name profilePhoto")
      .populate("members", "_id")
      .sort({ updatedAt: -1 })
      .lean();

    console.log(
      "GET /groups/my found:",
      groups.length,
      "groups for user:",
      rawId,
    );

    const result = groups.map((g) => ({
      ...g,
      isMember: true,
      memberValues: {
        religions: [
          ...new Set((g.members || []).map((m) => m.religion).filter(Boolean)),
        ],
        politics: [
          ...new Set(
            (g.members || []).map((m) => m.politicalBeliefs).filter(Boolean),
          ),
        ],
        lifeStages: [
          ...new Set((g.members || []).flatMap((m) => m.lifeStage || [])),
        ],
        families: [
          ...new Set((g.members || []).flatMap((m) => m.familySituation || [])),
        ],
      },
    }));

    res.json({ groups: result });
  } catch (err) {
    console.error("GET /groups/my error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// ─── GET /api/groups/my-invites ──────────────────────────────────────────────
router.get("/my-invites", auth, async (req, res) => {
  try {
    const userId =
      req.user.id?.toString() || req.user._id?.toString() || req.userId;
    const groups = await Group.find({
      invitedUsers: userId,
      isActive: { $ne: false },
      members: { $ne: userId },
    })
      .populate("createdBy", "name profilePhoto")
      .lean();
    res.json({ groups });
  } catch (err) {
    console.error("GET /groups/my-invites error:", err.message);
    res.status(500).json({ message: err.message || "Server error" });
  }
});

// ─── GET /api/groups/:id ──────────────────────────────────────────────────────
router.get("/:id", auth, async (req, res) => {
  try {
    const reserved = ["my", "my-invites", "seed", "discover"];
    if (
      !req.params.id ||
      req.params.id === "undefined" ||
      reserved.includes(req.params.id) ||
      !mongoose.Types.ObjectId.isValid(req.params.id)
    ) {
      return res
        .status(400)
        .json({ message: "Invalid group ID: " + req.params.id });
    }

    const group = await Group.findById(req.params.id)
      .populate("createdBy", "name profilePhoto")
      .populate(
        "members",
        "name profilePhoto city state lifeStage familySituation religion politicalBeliefs bio",
      )
      .lean();

    if (!group) return res.status(404).json({ message: "Group not found" });

    const userId =
      req.user.id?.toString() || req.user._id?.toString() || req.userId;
    group.isMember = group.members.some((m) => m._id.toString() === userId);
    group.isAdmin =
      (group.admins || []).some((a) => a.toString() === userId) ||
      group.createdBy?._id?.toString() === userId ||
      group.createdBy?.toString() === userId;
    group.isCreator =
      group.createdBy?._id?.toString() === userId ||
      group.createdBy?.toString() === userId;
    group.isInvited = (group.invitedUsers || []).some(
      (u) => u.toString() === userId,
    );
    group.isPending = group.pendingRequests?.some(
      (r) => r.userId?.toString() === userId,
    );

    if (
      group.isPrivate &&
      !group.isMember &&
      !group.isAdmin &&
      !group.isCreator &&
      !group.isInvited
    ) {
      return res.status(403).json({ message: "This is a private group" });
    }

    group.memberCount = (group.members || []).length;
    if (!group.isAdmin) delete group.pendingRequests;

    res.json(group);
  } catch (err) {
    console.error("GET /groups/:id error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// ─── POST /api/groups ─────────────────────────────────────────────────────────
router.post("/", auth, async (req, res) => {
  try {
    const {
      name,
      description,
      category,
      city,
      state,
      isNationwide,
      isPrivate,
      coverPhoto,
      tags,
    } = req.body;

    if (!name || !description || !category) {
      return res
        .status(400)
        .json({ message: "Name, description, and category are required" });
    }

    const userId = req.user.id || req.user._id || req.userId;

    const group = new Group({
      name,
      description,
      category,
      city: city || "",
      state: state || "",
      isNationwide: isNationwide || false,
      isPrivate: isPrivate || false,
      coverPhoto: coverPhoto || "",
      tags: tags || [],
      address: req.body.address || "",
      zipCode: req.body.zipCode || "",
      createdBy: userId,
      members: [userId],
      admins: [userId],
      memberCount: 1,
      isActive: true,
    });

    await group.save();
    await group.populate("createdBy", "name profilePhoto");

    console.log("POST /groups created:", group._id, "by user:", userId);
    res
      .status(201)
      .json({
        ...group.toObject(),
        isMember: true,
        isAdmin: true,
        isCreator: true,
      });
  } catch (err) {
    console.error("POST /groups error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// ─── POST /api/groups/:id/join ────────────────────────────────────────────────
router.post("/:id/join", auth, async (req, res) => {
  try {
    const group = await Group.findById(req.params.id);
    if (!group) return res.status(404).json({ message: "Group not found" });

    const userId = req.user.id || req.user._id || req.userId;
    const isMember = group.members.some(
      (m) => m.toString() === userId.toString(),
    );
    if (isMember) return res.status(400).json({ message: "Already a member" });

    if (group.isPrivate) {
      const alreadyPending = group.pendingRequests.some(
        (r) => r.userId?.toString() === userId.toString(),
      );
      if (alreadyPending)
        return res.status(400).json({ message: "Request already pending" });
      group.pendingRequests.push({ userId });
      await group.save();
      return res.json({ message: "Join request sent", isPending: true });
    }

    group.members.push(userId);
    group.memberCount = group.members.length;
    await group.save();
    res.json({ message: "Joined group", isMember: true });
  } catch (err) {
    console.error("POST /groups/:id/join error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// ─── POST /api/groups/:id/leave ───────────────────────────────────────────────
router.post("/:id/leave", auth, async (req, res) => {
  try {
    const group = await Group.findById(req.params.id);
    if (!group) return res.status(404).json({ message: "Group not found" });

    const userId = (req.user.id || req.user._id || req.userId).toString();

    if (group.createdBy.toString() === userId) {
      return res
        .status(400)
        .json({
          message: "Group creator cannot leave. Delete the group instead.",
        });
    }

    group.members = group.members.filter((m) => m.toString() !== userId);
    group.admins = group.admins.filter((a) => a.toString() !== userId);
    group.memberCount = group.members.length;
    await group.save();
    res.json({ message: "Left group" });
  } catch (err) {
    console.error("POST /groups/:id/leave error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// ─── POST /api/groups/:id/approve/:userId ────────────────────────────────────
router.post("/:id/approve/:userId", auth, async (req, res) => {
  try {
    const group = await Group.findById(req.params.id);
    if (!group) return res.status(404).json({ message: "Group not found" });

    const requesterId = (req.user.id || req.user._id || req.userId).toString();
    const isAdmin =
      group.admins.some((a) => a.toString() === requesterId) ||
      group.createdBy?.toString() === requesterId;
    if (!isAdmin) return res.status(403).json({ message: "Not authorized" });

    const targetUserId = req.params.userId;
    group.pendingRequests = group.pendingRequests.filter(
      (r) => r.userId?.toString() !== targetUserId,
    );
    if (!group.members.some((m) => m.toString() === targetUserId)) {
      group.members.push(targetUserId);
      group.memberCount = group.members.length;
    }
    await group.save();
    res.json({ message: "User approved" });
  } catch (err) {
    console.error("POST /groups/:id/approve error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// ─── POST /api/groups/:id/reject/:userId ─────────────────────────────────────
router.post("/:id/reject/:userId", auth, async (req, res) => {
  try {
    const group = await Group.findById(req.params.id);
    if (!group) return res.status(404).json({ message: "Group not found" });

    const requesterId = (req.user.id || req.user._id || req.userId).toString();
    const isAdmin =
      group.admins.some((a) => a.toString() === requesterId) ||
      group.createdBy?.toString() === requesterId;
    if (!isAdmin) return res.status(403).json({ message: "Not authorized" });

    group.pendingRequests = group.pendingRequests.filter(
      (r) => r.userId?.toString() !== req.params.userId,
    );
    await group.save();
    res.json({ message: "Request rejected" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// ─── PUT /api/groups/:id ──────────────────────────────────────────────────────
router.put("/:id", auth, async (req, res) => {
  try {
    const userId = (req.user.id || req.user._id || req.userId)?.toString();
    const group = await Group.findById(req.params.id).lean();
    if (!group) return res.status(404).json({ message: "Group not found" });

    const createdById = group.createdBy?.toString();
    const isAdmin =
      createdById === userId ||
      (group.admins || []).some((a) => a.toString() === userId);

    if (!isAdmin)
      return res
        .status(403)
        .json({ message: "Not authorized to edit this group" });

    const allowed = [
      "name",
      "description",
      "category",
      "city",
      "state",
      "address",
      "zipCode",
      "isNationwide",
      "isPrivate",
      "coverPhoto",
      "tags",
    ];
    const updates = {};
    allowed.forEach((field) => {
      if (req.body[field] !== undefined) updates[field] = req.body[field];
    });

    const updated = await Group.findByIdAndUpdate(
      req.params.id,
      { $set: updates },
      { new: true, runValidators: false },
    ).populate("createdBy", "name profilePhoto");

    res.json(updated);
  } catch (err) {
    console.error("PUT /groups/:id error:", err.message);
    res.status(500).json({ message: err.message || "Server error" });
  }
});

// ─── DELETE /api/groups/:id ───────────────────────────────────────────────────
router.delete("/:id", auth, async (req, res) => {
  try {
    const userId = (req.user.id || req.user._id || req.userId)?.toString();

    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "Invalid group ID" });
    }

    const group = await Group.findById(req.params.id).lean();
    if (!group) return res.status(404).json({ message: "Group not found" });

    const createdById = group.createdBy?.toString();
    const isCreator = createdById === userId;
    const isAdmin =
      isCreator || (group.admins || []).some((a) => a.toString() === userId);

    console.log("DELETE /groups/:id", {
      userId,
      createdById,
      isCreator,
      isAdmin,
    });

    if (!isAdmin)
      return res
        .status(403)
        .json({ message: "Only the group creator can delete this group" });

    await Group.findByIdAndUpdate(
      req.params.id,
      { $set: { isActive: false } },
      { runValidators: false },
    );
    res.json({ message: "Group deleted successfully" });
  } catch (err) {
    console.error("DELETE /groups/:id error:", err.message);
    res.status(500).json({ message: err.message || "Server error" });
  }
});

// ─── POST /api/groups/:id/invite/:userId ─────────────────────────────────────
router.post("/:id/invite/:userId", auth, async (req, res) => {
  try {
    const adminId = (req.user.id || req.user._id || req.userId)?.toString();
    const group = await Group.findById(req.params.id);
    if (!group) return res.status(404).json({ message: "Group not found" });

    const isAdmin =
      group.createdBy?.toString() === adminId ||
      (group.admins || []).some((a) => a.toString() === adminId);
    if (!isAdmin) return res.status(403).json({ message: "Not authorized" });

    const targetId = req.params.userId;
    if (!mongoose.Types.ObjectId.isValid(targetId))
      return res.status(400).json({ message: "Invalid user ID" });
    const targetObjectId = new mongoose.Types.ObjectId(targetId);

    if (group.members.some((m) => m.toString() === targetId))
      return res.status(400).json({ message: "User is already a member" });

    if (!group.invitedUsers) group.invitedUsers = [];
    if (!group.invitedUsers.some((u) => u.toString() === targetId)) {
      await Group.findByIdAndUpdate(
        req.params.id,
        { $addToSet: { invitedUsers: targetObjectId } },
        { runValidators: false },
      );
    }

    try {
      const invitee = await User.findById(targetId).select("name email").lean();
      const inviter = await User.findById(adminId).select("name").lean();
      const updatedGroup = await Group.findById(req.params.id).lean();
      if (invitee?.email && typeof sendGroupInviteEmail === "function") {
        sendGroupInviteEmail({ invitee, inviter, group: updatedGroup }).catch(
          (e) => console.warn("Group invite email failed:", e.message),
        );
      }
    } catch (emailErr) {
      console.warn("Group invite email setup failed:", emailErr.message);
    }

    res.json({ message: "Invitation sent" });
  } catch (err) {
    console.error("POST /groups/:id/invite error:", err.message);
    res.status(500).json({ message: err.message || "Server error" });
  }
});

// ─── POST /api/groups/:id/rsvp-invite ────────────────────────────────────────
router.post("/:id/rsvp-invite", auth, async (req, res) => {
  try {
    const userId = (req.user.id || req.user._id || req.userId)?.toString();
    const { response } = req.body;

    if (!["accept", "maybe", "decline"].includes(response)) {
      return res
        .status(400)
        .json({ message: "Invalid response. Use accept, maybe, or decline." });
    }

    const group = await Group.findById(req.params.id);
    if (!group) return res.status(404).json({ message: "Group not found" });

    const isInvited = (group.invitedUsers || []).some(
      (u) => u.toString() === userId,
    );
    const isAlreadyMember = (group.members || []).some(
      (m) => m.toString() === userId,
    );

    if (!isInvited && !isAlreadyMember) {
      return res
        .status(403)
        .json({
          message: "No pending invite found. You may need to refresh the page.",
        });
    }

    if (isAlreadyMember && response === "accept")
      return res.json({ message: "You are already a member!", joined: true });

    if (response === "accept") {
      const userObjectId = new mongoose.Types.ObjectId(userId);
      const updated = await Group.findByIdAndUpdate(
        req.params.id,
        {
          $pull: { invitedUsers: userObjectId },
          $addToSet: { members: userObjectId },
        },
        { new: true, runValidators: false },
      );
      if (updated)
        await Group.findByIdAndUpdate(
          req.params.id,
          { $set: { memberCount: updated.members.length } },
          { runValidators: false },
        );
      return res.json({ message: "You have joined the group!", joined: true });
    }

    if (response === "maybe") {
      const userObjectId = new mongoose.Types.ObjectId(userId);
      await Group.findByIdAndUpdate(
        req.params.id,
        { $addToSet: { maybeUsers: userObjectId } },
        { runValidators: false },
      );
      return res.json({ message: "Marked as maybe.", joined: false });
    }

    if (response === "decline") {
      const userObjectId = new mongoose.Types.ObjectId(userId);
      await Group.findByIdAndUpdate(
        req.params.id,
        { $pull: { invitedUsers: userObjectId, maybeUsers: userObjectId } },
        { runValidators: false },
      );
      return res.json({ message: "Invitation declined.", joined: false });
    }
  } catch (err) {
    console.error("POST /groups/:id/rsvp-invite error:", err.message);
    res.status(500).json({ message: err.message || "Server error" });
  }
});

// ─── POST /api/groups/:id/accept-invite (legacy) ─────────────────────────────
router.post("/:id/accept-invite", auth, async (req, res) => {
  try {
    const userId = (req.user.id || req.user._id || req.userId)?.toString();
    await Group.findByIdAndUpdate(
      req.params.id,
      { $pull: { invitedUsers: userId }, $addToSet: { members: userId } },
      { runValidators: false },
    );
    res.json({ message: "You have joined the group", joined: true });
  } catch (err) {
    res.status(500).json({ message: err.message || "Server error" });
  }
});

// ─── POST /api/groups/:id/decline-invite ─────────────────────────────────────
router.post("/:id/decline-invite", auth, async (req, res) => {
  try {
    const userId = (req.user.id || req.user._id || req.userId)?.toString();
    await Group.findByIdAndUpdate(
      req.params.id,
      { $pull: { invitedUsers: userId } },
      { runValidators: false },
    );
    res.json({ message: "Invite declined" });
  } catch (err) {
    res.status(500).json({ message: err.message || "Server error" });
  }
});

// ─── GET /api/groups/:id/members ─────────────────────────────────────────────
router.get("/:id/members", auth, async (req, res) => {
  try {
    const group = await Group.findById(req.params.id)
      .populate(
        "members",
        "name profilePhoto city state lifeStage familySituation religion politicalBeliefs bio",
      )
      .lean();

    if (!group) return res.status(404).json({ message: "Group not found" });

    if (group.isPrivate) {
      const userId = (req.user.id || req.user._id || req.userId)?.toString();
      const isMember = group.members.some((m) => m._id.toString() === userId);
      if (!isMember)
        return res
          .status(403)
          .json({ message: "Join the group to see members" });
    }

    res.json({ members: group.members });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// ─── POST /api/groups/seed ────────────────────────────────────────────────────
router.post("/seed", auth, async (req, res) => {
  try {
    const { city, state } = req.body;
    if (!city || !state)
      return res.status(400).json({ message: "city and state required" });

    const userId = req.user.id || req.user._id || req.userId;

    const seedGroups = [
      {
        name: `Tennis Group — ${city}`,
        description: `Tennis players and enthusiasts in ${city}. All skill levels welcome!`,
        category: "Sports & Fitness",
        tags: ["tennis", "sports", "fitness"],
      },
      {
        name: `Christian Fellowship — ${city}`,
        description: `A welcoming Christian community group in ${city} for faith, friendship, and fellowship.`,
        category: "Faith & Spirituality",
        tags: ["christian", "faith", "church"],
      },
      {
        name: `Moms of ${city}`,
        description: `A supportive community for moms in ${city} — playdates, advice, friendship, and fun.`,
        category: "Parents",
        tags: ["moms", "parenting", "kids"],
      },
      {
        name: `Fitness Buddies — ${city}`,
        description: `Find your fitness accountability partner in ${city}.`,
        category: "Sports & Fitness",
        tags: ["fitness", "gym", "workout", "running"],
      },
      {
        name: `Volunteers of ${city}`,
        description: `Connect with people who want to give back in ${city}.`,
        category: "Volunteers & Causes",
        tags: ["volunteer", "community", "giving"],
      },
      {
        name: `Book Club — ${city}`,
        description: `Monthly book discussions for readers in ${city}. All genres welcome.`,
        category: "Arts, Culture & Book Clubs",
        tags: ["books", "reading", "book club"],
      },
      {
        name: `New to ${city}`,
        description: `Just moved to ${city}? Meet other newcomers and build your social circle.`,
        category: "New to the Area",
        tags: ["new", "newcomer", "relocation"],
      },
      {
        name: `Outdoor Adventures — ${city}`,
        description: `Hiking, cycling, kayaking and more for outdoor lovers in ${city}.`,
        category: "Outdoor & Adventure",
        tags: ["hiking", "outdoors", "nature"],
      },
      {
        name: `Foodies of ${city}`,
        description: `Restaurant discoveries, cooking nights, and food adventures in ${city}.`,
        category: "Food & Dining",
        tags: ["food", "restaurants", "cooking"],
      },
      {
        name: `Learning & Growth — ${city}`,
        description: `Skill sharing, language exchange, and personal development in ${city}.`,
        category: "Learning & Education",
        tags: ["learning", "skills", "education"],
      },
      {
        name: `Business Owners of ${city}`,
        description: `A community for entrepreneurs and founders in ${city}.`,
        category: "Business Owners & Entrepreneurs",
        tags: ["business", "entrepreneur", "startup"],
      },
      {
        name: `Sober Living — ${city}`,
        description: `A supportive community for people living sober in ${city}.`,
        category: "Sober & Clean Living",
        tags: ["sober", "sobriety", "recovery"],
      },
      {
        name: `Single Parents of ${city}`,
        description: `Support and community for single moms and dads in ${city}.`,
        category: "Single Parents",
        tags: ["single parent", "parenting"],
      },
      {
        name: `Aging Gracefully — ${city}`,
        description: `A welcoming community for older adults in ${city}.`,
        category: "Aging Gracefully",
        tags: ["seniors", "aging", "companionship"],
      },
      {
        name: `Life Transitions — ${city}`,
        description: `Support for navigating life's big changes in ${city}.`,
        category: "Life Transitions",
        tags: ["life transitions", "support", "caregivers"],
      },
    ];

    const created = [];
    for (const seed of seedGroups) {
      const exists = await Group.findOne({ name: seed.name, isActive: true });
      if (!exists) {
        const g = new Group({
          ...seed,
          city,
          state,
          createdBy: userId,
          members: [userId],
          admins: [userId],
          memberCount: 1,
          isSeeded: true,
        });
        await g.save();
        created.push(g.name);
      }
    }

    res.json({ message: `Seeded ${created.length} groups`, created });
  } catch (err) {
    console.error("POST /groups/seed error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// ─── POST /api/groups/:id/photo ──────────────────────────────────────────────
router.post("/:id/photo", auth, upload.single("photo"), async (req, res) => {
  try {
    const group = await Group.findById(req.params.id);
    if (!group) return res.status(404).json({ message: "Group not found" });

    const userId = (req.user.id || req.user._id || req.userId)?.toString();
    const isAdmin =
      group.admins.some((a) => a.toString() === userId) ||
      group.createdBy?.toString() === userId;
    if (!isAdmin) return res.status(403).json({ message: "Not authorized" });
    if (!req.file) return res.status(400).json({ message: "No file uploaded" });

    const result = await new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          {
            folder: "kindredpal/groups",
            transformation: [
              { width: 600, height: 600, crop: "fill", quality: "auto" },
            ],
          },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          },
        )
        .end(req.file.buffer);
    });

    if (group.coverPhoto && group.coverPhoto.includes("cloudinary")) {
      const publicId = group.coverPhoto.split("/").pop().split(".")[0];
      await cloudinary.uploader
        .destroy(`kindredpal/groups/${publicId}`)
        .catch(() => {});
    }

    group.coverPhoto = result.secure_url;
    await group.save();
    res.json({ coverPhoto: result.secure_url });
  } catch (err) {
    console.error("Photo upload error:", err);
    res.status(500).json({ message: "Photo upload failed" });
  }
});

module.exports = router;
