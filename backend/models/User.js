const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    age: {
      type: Number,
      required: true,
      min: 18,
    },
    gender: {
      type: String,
      required: true,
      enum: ["Male", "Female", "Non-binary", "Other", "Prefer not to say"],
    },
    city: {
      type: String,
      required: true,
      trim: true,
    },
    state: {
      type: String,
      required: true,
      trim: true,
    },
    bio: {
      type: String,
      required: true,
      maxlength: 500,
    },

    // Photos
    profilePhoto: {
      type: String,
      default:
        "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&h=400&fit=crop",
    },
    additionalPhotos: {
      type: [String],
      default: [],
      validate: {
        validator: function (v) {
          return !v || v.length <= 2;
        },
        message: "You can upload maximum 2 additional photos",
      },
    },

    // Location preference for matching
    locationPreference: {
      type: String,
      enum: [
        "Same city",
        "Same state",
        "Within 50 miles",
        "Within 100 miles",
        "Within 200 miles",
        "Anywhere",
      ],
      default: "Same state",
    },

    politicalBeliefs: [
      {
        type: String,
        enum: [
          "Liberal",
          "Conservative",
          "Republican",
          "Democrat",
          "Libertarian",
          "Moderate",
          "Progressive",
          "Independent",
          "Apolitical",
        ],
      },
    ],

    religion: {
      type: String,
      enum: [
        "Christian",
        "Catholic",
        "Protestant",
        "Muslim",
        "Jewish",
        "Hindu",
        "Buddhist",
        "Sikh",
        "Spiritual but not religious",
        "Agnostic",
        "Atheist",
        "Other",
        "Prefer not to say",
      ],
      required: true,
    },

    causes: [
      {
        type: String,
        enum: [
          "Environment",
          "Travel & Adventure",
          "Health & Wellness",
          "Healthcare & Medical Causes",
          "Education & Continuous Learning",
          "Arts & Culture",
          "Community Service",
          "Animal Welfare",
          "Social Justice",
          "Technology & Innovation",
          "Entrepreneurship",
          "Fitness & Active Living",
          "Skilled Trades & Craftsmanship",
          "Ministry",
          "Psychology & Mental Health",
          "Philosophy",
        ],
      },
    ],

    lifeStage: [
      {
        type: String,
        required: true,
        enum: [
          // Relationship Status
          "Single",
          "In a Relationship",
          "Engaged",
          "Married",
          "Divorced",
          "Widowed",

          // Family Status
          "Single Parent",
          "Have Children",
          "Child-free by Choice",
          "Want Children Someday",
          "Empty Nester",
          "Stay-at-Home Parent",
          "Caregiver",

          // Education
          "College Student",
          "Graduate Student",
          "Recent Graduate",

          // Career
          "Working Professional",
          "Career Focused",
          "Entrepreneur",
          "Career Transition",
          "Retired",
          "Semi-Retired",

          // Financial
          "Single Income No Kids (SINK)",
          "Dual-Income No Kids (DINK)",
        ],
      },
    ],

    lookingFor: [
      {
        type: String,
        enum: [
          "Friendship",
          "Romance",
          "Networking",
          "Activity Partner",
          "Mentor",
          "Community",
        ],
      },
    ],

    // ✅ NEW: Email Notification Settings
    emailNotifications: {
      newMatch: {
        type: Boolean,
        default: true,
      },
      newMessage: {
        type: Boolean,
        default: true,
      },
      weeklyDigest: {
        type: Boolean,
        default: false,
      },
    },

    // ✅ NEW: Account Deletion (Soft Delete)
    isDeleted: {
      type: Boolean,
      default: false,
    },
    deletedAt: {
      type: Date,
      default: null,
    },

    subscription: {
      tier: {
        type: String,
        enum: ["free", "quarterly", "annual", "lifetime"],
        default: "free",
      },
      startDate: Date,
      expiresAt: Date,
      stripeCustomerId: String,
      stripeSubscriptionId: String,
      manualMatchmakingSessions: {
        total: { type: Number, default: 0 },
        used: { type: Number, default: 0 },
        lastSessionDate: Date,
      },
      goals: [
        {
          category: {
            type: String,
            enum: [
              "Career",
              "Relationship",
              "Health",
              "Personal Growth",
              "Financial",
              "Other",
            ],
          },
          description: String,
          priority: {
            type: String,
            enum: ["High", "Medium", "Low"],
          },
          status: {
            type: String,
            enum: ["Active", "Completed", "Paused"],
            default: "Active",
          },
          createdAt: { type: Date, default: Date.now },
          completedAt: Date,
        },
      ],
    },

    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    matches: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    passed: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    dailyLikes: {
      count: { type: Number, default: 10 },
      lastReset: { type: Date, default: Date.now },
    },
    eventsAttended: [
      {
        eventId: String,
        eventName: String,
        eventDate: Date,
        location: String,
      },
    ],
    isActive: {
      type: Boolean,
      default: true,
    },
    lastSeen: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  },
);

// Hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Compare password method
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// ✅ NEW: Soft delete method
userSchema.methods.softDelete = function () {
  this.isDeleted = true;
  this.deletedAt = new Date();
  this.isActive = false;
  return this.save();
};

// Check if user is premium
userSchema.methods.isPremium = function () {
  if (this.subscription.tier === "lifetime") return true;
  if (this.subscription.tier === "free") return false;
  return (
    this.subscription.expiresAt && this.subscription.expiresAt > new Date()
  );
};

userSchema.methods.hasUnlimitedLikes = function () {
  return this.isPremium();
};

userSchema.methods.canAccessEvents = function () {
  return (
    ["annual", "lifetime"].includes(this.subscription.tier) && this.isPremium()
  );
};

userSchema.methods.canRequestMatchmaking = function () {
  if (this.subscription.tier !== "lifetime") return false;
  const sessions = this.subscription.manualMatchmakingSessions;
  return sessions.used < sessions.total;
};

userSchema.methods.useMatchmakingSession = function () {
  if (!this.canRequestMatchmaking()) {
    throw new Error("No matchmaking sessions available");
  }
  this.subscription.manualMatchmakingSessions.used += 1;
  this.subscription.manualMatchmakingSessions.lastSessionDate = new Date();
};

userSchema.methods.resetMatchmakingSessions = function () {
  if (this.subscription.tier === "lifetime") {
    this.subscription.manualMatchmakingSessions.total = 2;
    this.subscription.manualMatchmakingSessions.used = 0;
  }
};

// Check if user matches location preference
userSchema.methods.meetsLocationPreference = function (otherUser) {
  const pref = this.locationPreference;

  if (pref === "Anywhere") return true;
  if (pref === "Same city")
    return this.city.toLowerCase() === otherUser.city.toLowerCase();
  if (pref === "Same state") return this.state === otherUser.state;

  // For mile-based preferences, would need geocoding (future feature)
  // For now, treat as "same state" if within miles preference
  if (pref.includes("miles")) return this.state === otherUser.state;

  return true;
};

// Calculate match score with location preference
userSchema.methods.calculateMatchScore = function (otherUser) {
  // First check location preference
  if (!this.meetsLocationPreference(otherUser)) {
    return 0; // Don't show users outside location preference
  }

  let score = 0;
  let totalWeight = 0;

  // Weight distribution
  const weights = {
    lifeStage: 35, // Most important
    location: 25, // Very important (same city/state)
    age: 15, // Important
    causes: 10, // Moderate
    politicalBeliefs: 10, // Moderate
    religion: 5, // Less important (more about tolerance)
  };

  // 1. Life Stage Matching (35%) - MOST IMPORTANT
  const commonLifeStages = this.lifeStage.filter((stage) =>
    otherUser.lifeStage.includes(stage),
  );
  if (this.lifeStage.length > 0 && otherUser.lifeStage.length > 0) {
    const lifeStageScore =
      commonLifeStages.length /
      Math.max(this.lifeStage.length, otherUser.lifeStage.length);
    score += lifeStageScore * weights.lifeStage;
    totalWeight += weights.lifeStage;
  }

  // 2. Location Matching (25%)
  if (this.state === otherUser.state) {
    score += weights.location; // Same state
    if (this.city.toLowerCase() === otherUser.city.toLowerCase()) {
      score += 5; // Bonus for same city
    }
    totalWeight += weights.location;
  }

  // 3. Age Compatibility (15%)
  const ageDiff = Math.abs(this.age - otherUser.age);
  if (ageDiff <= 5) {
    score += weights.age;
  } else if (ageDiff <= 10) {
    score += weights.age * 0.7;
  } else if (ageDiff <= 15) {
    score += weights.age * 0.4;
  }
  totalWeight += weights.age;

  // 4. Causes/Interests Matching (10%)
  if (this.causes.length > 0 && otherUser.causes.length > 0) {
    const commonCauses = this.causes.filter((cause) =>
      otherUser.causes.includes(cause),
    );
    const causesScore =
      commonCauses.length /
      Math.max(this.causes.length, otherUser.causes.length);
    score += causesScore * weights.causes;
    totalWeight += weights.causes;
  }

  // 5. Political Beliefs (10%)
  if (
    this.politicalBeliefs.length > 0 &&
    otherUser.politicalBeliefs.length > 0
  ) {
    const commonPolitics = this.politicalBeliefs.filter((belief) =>
      otherUser.politicalBeliefs.includes(belief),
    );
    if (commonPolitics.length > 0) {
      score += weights.politicalBeliefs;
    } else {
      // Check for compatible moderate positions
      const moderateBeliefs = ["Moderate", "Independent", "Apolitical"];
      const hasModerate =
        this.politicalBeliefs.some((b) => moderateBeliefs.includes(b)) ||
        otherUser.politicalBeliefs.some((b) => moderateBeliefs.includes(b));
      if (hasModerate) {
        score += weights.politicalBeliefs * 0.5; // Partial credit for moderation
      }
    }
    totalWeight += weights.politicalBeliefs;
  }

  // 6. Religion (5%) - More about tolerance than exact match
  if (this.religion && otherUser.religion) {
    if (this.religion === otherUser.religion) {
      score += weights.religion;
    } else {
      // Open-minded religions get partial credit
      const openMinded = [
        "Spiritual but not religious",
        "Agnostic",
        "Prefer not to say",
      ];
      const eitherOpenMinded =
        openMinded.includes(this.religion) ||
        openMinded.includes(otherUser.religion);
      if (eitherOpenMinded) {
        score += weights.religion * 0.5;
      }
    }
    totalWeight += weights.religion;
  }

  // Normalize score to 0-100
  return totalWeight > 0 ? Math.round((score / totalWeight) * 100) : 0;
};

// Remove sensitive data from JSON response
userSchema.methods.toJSON = function () {
  const user = this.toObject();
  delete user.password;

  // Safely delete stripe data if subscription exists
  if (user.subscription) {
    delete user.subscription.stripeCustomerId;
    delete user.subscription.stripeSubscriptionId;
  }

  return user;
};

module.exports = mongoose.model("User", userSchema);
