const mongoose = require("mongoose");

const groupSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },
    description: {
      type: String,
      required: true,
      maxlength: 500,
    },
    category: {
      type: String,
      required: true,
      enum: [
        "Caregiver Support",
        "Grief & Loss",
        "Sober & Clean Living",
        "New Parent Support",
        "Chronic Illness Support",
        "Anxiety & Mental Wellness",
        "Veteran Support",
        "Senior Wellness",
        "Loneliness & Social Connection",
        "Divorce Recovery",
        "Faith & Spiritual Support",
        "Life Transitions",
        "Trauma Recovery",
        "Cancer Support",
        "Single Parent Support",
        "Addiction Recovery",
        "Autism & Special Needs Families",
        "Singles Support",
        "Married No Kids",
        "Career Change Support",
        "Financial Recovery",
        "Singles Social Support",
        "Local Activity Groups",
        "Sports & Fitness",
      ],
    },
    // Location
    city: { type: String, trim: true },
    state: { type: String, trim: true },
    address: { type: String, trim: true }, // street address / venue name
    zipCode: { type: String, trim: true },
    isNationwide: { type: Boolean, default: false },

    // Public = anyone can join. Private = request required
    isPrivate: { type: Boolean, default: false },

    coverPhoto: {
      type: String,
      default: "",
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    members: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    // Pending join requests (for private groups)
    pendingRequests: [
      {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        requestedAt: { type: Date, default: Date.now },
      },
    ],

    // Admins (creator + any promoted members)
    admins: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    // Tags for searchability
    tags: [{ type: String, trim: true }],

    // Seeded groups created by platform (not users)
    isSeeded: { type: Boolean, default: false },

    isActive: { type: Boolean, default: true },
    memberCount: { type: Number, default: 0 },
  },
  { timestamps: true },
);

// Keep memberCount in sync
groupSchema.pre("save", function (next) {
  this.memberCount = this.members.length;
  next();
});

// Indexes
groupSchema.index({ state: 1, city: 1, isActive: 1 });
groupSchema.index({ category: 1, isActive: 1 });
groupSchema.index({ isNationwide: 1, isActive: 1 });
groupSchema.index({ name: "text", description: "text", tags: "text" });

const Group = mongoose.models.Group || mongoose.model("Group", groupSchema);
module.exports = Group;
