const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const auth = require("../middleware/auth");
const Group = require("../models/Group");
const User = require("../models/User");
const multer = require("multer");
const cloudinary = require("cloudinary").v2;

// Cloudinary config (uses env vars CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET)
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Multer — memory storage, 5MB limit, images only
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) cb(null, true);
    else cb(new Error("Only image files are allowed"), false);
  },
});

// ─── GET /api/groups ─────────────────────────────────────────────────────────
// List groups near user + nationwide groups
// Optional query: ?category=Faith&search=tennis&city=Poughkeepsie&state=NY
router.get("/", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("city state");
    const { category, search, page = 1, limit = 20 } = req.query;

    const query = { isActive: true };

    // Location: show groups in user's city/state OR nationwide
    if (!search) {
      query.$or = [{ state: user.state }, { isNationwide: true }];
    }

    if (category) query.category = category;

    if (search) {
      query.$text = { $search: search };
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const groups = await Group.find(query)
      .populate("createdBy", "name profilePhoto")
      .sort({ memberCount: -1, createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .lean();

    // Add isMember flag for each group
    const userId = req.user.id;
    const groupsWithMembership = groups.map((g) => ({
      ...g,
      isMember: g.members.some((m) => m.toString() === userId),
      isPending: g.pendingRequests?.some(
        (r) => r.userId?.toString() === userId,
      ),
    }));

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
// Groups the current user has joined
router.get("/my", auth, async (req, res) => {
  try {
    const groups = await Group.find({
      members: req.user.id,
      isActive: true,
    })
      .populate("createdBy", "name profilePhoto")
      .sort({ updatedAt: -1 })
      .lean();

    const userId = req.user.id;
    const result = groups.map((g) => ({ ...g, isMember: true }));
    res.json({ groups: result });
  } catch (err) {
    console.error("GET /groups/my error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// ─── GET /api/groups/:id ──────────────────────────────────────────────────────
// Get single group with members
router.get("/:id", auth, async (req, res) => {
  try {
    const group = await Group.findById(req.params.id)
      .populate("createdBy", "name profilePhoto")
      .populate("members", "name profilePhoto city state lifeStage bio")
      .lean();

    if (!group) return res.status(404).json({ message: "Group not found" });

    const userId = req.user.id;
    group.isMember = group.members.some((m) => m._id.toString() === userId);
    group.isAdmin = group.admins.some((a) => a.toString() === userId);
    group.isPending = group.pendingRequests?.some(
      (r) => r.userId?.toString() === userId,
    );

    // Hide pending requests from non-admins
    if (!group.isAdmin) delete group.pendingRequests;

    res.json(group);
  } catch (err) {
    console.error("GET /groups/:id error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// ─── POST /api/groups ─────────────────────────────────────────────────────────
// Create a new group
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
      createdBy: req.user.id,
      members: [req.user.id],
      admins: [req.user.id],
      memberCount: 1,
    });

    await group.save();
    await group.populate("createdBy", "name profilePhoto");

    res
      .status(201)
      .json({ ...group.toObject(), isMember: true, isAdmin: true });
  } catch (err) {
    console.error("POST /groups error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// ─── POST /api/groups/:id/join ────────────────────────────────────────────────
// Join a public group OR request to join a private group
router.post("/:id/join", auth, async (req, res) => {
  try {
    const group = await Group.findById(req.params.id);
    if (!group) return res.status(404).json({ message: "Group not found" });

    const userId = req.user.id;
    const isMember = group.members.some((m) => m.toString() === userId);
    if (isMember) return res.status(400).json({ message: "Already a member" });

    if (group.isPrivate) {
      // Add to pending requests
      const alreadyPending = group.pendingRequests.some(
        (r) => r.userId?.toString() === userId,
      );
      if (alreadyPending)
        return res.status(400).json({ message: "Request already pending" });

      group.pendingRequests.push({ userId });
      await group.save();
      return res.json({ message: "Join request sent", isPending: true });
    }

    // Public group — join immediately
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

    const userId = req.user.id;

    // Creator cannot leave their own group
    if (group.createdBy.toString() === userId) {
      return res.status(400).json({
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

// ─── POST /api/groups/:id/approve/:userId ─────────────────────────────────────
// Admin approves a join request for private group
router.post("/:id/approve/:userId", auth, async (req, res) => {
  try {
    const group = await Group.findById(req.params.id);
    if (!group) return res.status(404).json({ message: "Group not found" });

    const isAdmin = group.admins.some((a) => a.toString() === req.user.id);
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

// ─── POST /api/groups/:id/reject/:userId ──────────────────────────────────────
router.post("/:id/reject/:userId", auth, async (req, res) => {
  try {
    const group = await Group.findById(req.params.id);
    if (!group) return res.status(404).json({ message: "Group not found" });

    const isAdmin = group.admins.some((a) => a.toString() === req.user.id);
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
// Update group (admin only)
router.put("/:id", auth, async (req, res) => {
  try {
    const group = await Group.findById(req.params.id);
    if (!group) return res.status(404).json({ message: "Group not found" });

    const isAdmin = group.admins.some((a) => a.toString() === req.user.id);
    if (!isAdmin) return res.status(403).json({ message: "Not authorized" });

    const allowed = [
      "name",
      "description",
      "category",
      "city",
      "state",
      "isNationwide",
      "isPrivate",
      "coverPhoto",
      "tags",
    ];
    allowed.forEach((field) => {
      if (req.body[field] !== undefined) group[field] = req.body[field];
    });

    await group.save();
    res.json(group);
  } catch (err) {
    console.error("PUT /groups/:id error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// ─── DELETE /api/groups/:id ───────────────────────────────────────────────────
router.delete("/:id", auth, async (req, res) => {
  try {
    const group = await Group.findById(req.params.id);
    if (!group) return res.status(404).json({ message: "Group not found" });

    if (group.createdBy.toString() !== req.user.id) {
      return res
        .status(403)
        .json({ message: "Only the creator can delete this group" });
    }

    group.isActive = false;
    await group.save();

    res.json({ message: "Group deleted" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// ─── GET /api/groups/:id/members ─────────────────────────────────────────────
router.get("/:id/members", auth, async (req, res) => {
  try {
    const group = await Group.findById(req.params.id)
      .populate("members", "name profilePhoto city state lifeStage bio causes")
      .lean();

    if (!group) return res.status(404).json({ message: "Group not found" });

    // Must be a member to see members of private group
    if (group.isPrivate) {
      const isMember = group.members.some(
        (m) => m._id.toString() === req.user.id,
      );
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
// Seed default groups for a city/state (admin use)
router.post("/seed", auth, async (req, res) => {
  try {
    const { city, state } = req.body;
    if (!city || !state)
      return res.status(400).json({ message: "city and state required" });

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
        description: `Find your fitness accountability partner in ${city}. Gym, running, hiking — all welcome.`,
        category: "Sports & Fitness",
        tags: ["fitness", "gym", "workout", "running"],
      },
      {
        name: `Volunteers of ${city}`,
        description: `Connect with people who want to give back in ${city}. Find volunteer opportunities and meet like-minded people.`,
        category: "Volunteers & Causes",
        tags: ["volunteer", "community", "giving", "nonprofit"],
      },
      {
        name: `Book Club — ${city}`,
        description: `Monthly book discussions for readers in ${city}. All genres welcome.`,
        category: "Arts, Culture & Book Clubs",
        tags: ["books", "reading", "book club"],
      },
      {
        name: `New to ${city}`,
        description: `Just moved to ${city}? Meet other newcomers, discover the area, and build your social circle.`,
        category: "New to the Area",
        tags: ["new", "newcomer", "relocation"],
      },
      {
        name: `Outdoor Adventures — ${city}`,
        description: `Hiking, cycling, kayaking and more for outdoor lovers in ${city} and surrounding areas.`,
        category: "Outdoor & Adventure",
        tags: ["hiking", "outdoors", "nature", "cycling"],
      },
      {
        name: `Foodies of ${city}`,
        description: `Restaurant discoveries, cooking nights, and food adventures in ${city}. All cuisines welcome.`,
        category: "Food & Dining",
        tags: ["food", "restaurants", "cooking", "dining"],
      },
      {
        name: `Learning & Growth — ${city}`,
        description: `Skill sharing, language exchange, workshops and personal development for curious minds in ${city}.`,
        category: "Learning & Education",
        tags: ["learning", "skills", "education", "growth"],
      },
      {
        name: `Book Club — ${city}`,
        description: `Monthly book discussions for readers in ${city}. Fiction, non-fiction, all genres welcome — just bring your curiosity.`,
        category: "Arts, Culture & Book Clubs",
        tags: ["books", "reading", "book club", "fiction", "nonfiction"],
      },
      {
        name: `Business Owners of ${city}`,
        description: `A community for entrepreneurs, small business owners, and founders in ${city}. Share resources, get advice, and grow together.`,
        category: "Business Owners & Entrepreneurs",
        tags: [
          "business",
          "entrepreneur",
          "startup",
          "small business",
          "founder",
        ],
      },
      {
        name: `Sober Living — ${city}`,
        description: `A supportive, judgment-free community for people living sober or alcohol-free in ${city}. AA, NA, or just choosing clean living — all welcome.`,
        category: "Sober & Clean Living",
        tags: ["sober", "sobriety", "recovery", "clean living", "AA", "NA"],
      },
      {
        name: `Single Parents of ${city}`,
        description: `Support, community, and friendship for single moms and dads in ${city}. Playdates, advice, and real talk — you don't have to do it alone.`,
        category: "Single Parents",
        tags: [
          "single parent",
          "single mom",
          "single dad",
          "parenting",
          "kids",
        ],
      },
      {
        name: `Aging Gracefully — ${city}`,
        description: `A warm, welcoming community for older adults in ${city} who want connection, companionship, and friendship. No one should navigate this chapter alone.`,
        category: "Aging Gracefully",
        tags: [
          "seniors",
          "aging",
          "companionship",
          "older adults",
          "community",
        ],
      },
      {
        name: `Life Transitions — ${city}`,
        description: `Support for navigating life's big changes in ${city} — caregivers, divorce, relocation, loss, and starting over. You are not alone.`,
        category: "Life Transitions",
        tags: [
          "life transitions",
          "support",
          "caregivers",
          "divorce",
          "starting over",
        ],
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
          createdBy: req.user.id,
          members: [req.user.id],
          admins: [req.user.id],
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
// Upload group cover photo (admin only)
router.post("/:id/photo", auth, upload.single("photo"), async (req, res) => {
  try {
    const group = await Group.findById(req.params.id);
    if (!group) return res.status(404).json({ message: "Group not found" });

    const isAdmin = group.admins.some((a) => a.toString() === req.user.id);
    if (!isAdmin) return res.status(403).json({ message: "Not authorized" });

    if (!req.file) return res.status(400).json({ message: "No file uploaded" });

    // Upload to Cloudinary
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

    // Delete old photo from Cloudinary if exists
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
