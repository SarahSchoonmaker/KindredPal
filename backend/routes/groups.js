// Replace the GET /api/groups/my handler in backend/routes/groups.js
// with this fixed version.

router.get("/my", auth, async (req, res) => {
  try {
    // FIX: Use req.user.id (consistent with the rest of groups.js) and
    // cast to ObjectId explicitly so Mongoose queries ObjectId fields correctly.
    // Without the cast, a string userId compared to ObjectId members/createdBy
    // fields returns 0 results even when matches exist.
    const rawId = req.user.id || req.user._id;

    if (!mongoose.Types.ObjectId.isValid(rawId)) {
      return res.status(400).json({ message: "Invalid user ID in token" });
    }
    const userId = new mongoose.Types.ObjectId(rawId);

    const groups = await Group.find({
      $or: [{ members: userId }, { createdBy: userId }],
      isActive: { $ne: false }, // $ne false catches missing field AND false
    })
      .populate("createdBy", "name profilePhoto")
      .populate("members", "_id")
      .sort({ updatedAt: -1 })
      .lean();

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
