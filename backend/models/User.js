const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
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

    // PASSWORD RESET FIELDS
    resetPasswordToken: {
      type: String,
    },
    resetPasswordExpires: {
      type: Date,
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
          "Prefer not to say",
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
        "Seeking/Undecided",
        "Agnostic",
        "Atheist",
        "Other",
        "Prefer not to say",
      ],
      required: true,
    },

    causes: {
      type: [String],
      enum: [
        "Environment",
        "Travel & Adventure",
        "Health & Wellness",
        "Healthcare & Medical Causes",
        "Education & Continuous Learning",
        "Art & Design",
        "Theater & Performing Arts",
        "Film & Cinema",
        "Music",
        "Books & Literature",
        "Museums & History",
        "Poetry & Writing",
        "Comedy & Entertainment",
        "Fashion & Style",
        "Video Games & Gaming",
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
        "Food & Cooking",
        "Photography",
        "Outdoor Activities",
      ],
      validate: {
        validator: function (v) {
          return v.length >= 3 && v.length <= 10;
        },
        message: "Please select between 3 and 10 causes",
      },
    },

    lifeStage: [
      {
        type: String,
        required: true,
        enum: [
          "Single",
          "In a Relationship",
          "Engaged",
          "Married",
          "Divorced",
          "Widowed",
          "It's Complicated",
          "Single Parent",
          "Have Children",
          "Child-free by Choice",
          "Want Children Someday",
          "Empty Nester",
          "Stay-at-Home Parent",
          "Caregiver",
          "College Student",
          "Graduate Student",
          "Recent Graduate",
          "Working Professional",
          "Career Focused",
          "Entrepreneur",
          "Career Transition",
          "Retired",
          "Semi-Retired",
        ],
      },
    ],

    lookingFor: [
      {
        type: String,
        enum: [
          "Friendship",
          "Networking",
          "Activity Partner",
          "Mentor",
          "Community",
        ],
      },
    ],

    filterPoliticalBeliefs: [
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
          "Prefer not to say",
        ],
      },
    ],
    filterReligions: [
      {
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
          "Seeking/Undecided",
          "Agnostic",
          "Atheist",
          "Other",
          "Prefer not to say",
        ],
      },
    ],
    filterLifeStages: [
      {
        type: String,
        enum: [
          "Single",
          "In a Relationship",
          "Engaged",
          "Married",
          "Divorced",
          "Widowed",
          "It's Complicated",
          "Single Parent",
          "Have Children",
          "Child-free by Choice",
          "Want Children Someday",
          "Empty Nester",
          "Stay-at-Home Parent",
          "Caregiver",
          "College Student",
          "Graduate Student",
          "Recent Graduate",
          "Working Professional",
          "Career Focused",
          "Entrepreneur",
          "Career Transition",
          "Retired",
          "Semi-Retired",
        ],
      },
    ],

    emailNotifications: {
      newMatch: { type: Boolean, default: true },
      newMessage: { type: Boolean, default: true },
      weeklyDigest: { type: Boolean, default: false },
    },

    isDeleted: { type: Boolean, default: false },
    deletedAt: { type: Date, default: null },

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
          priority: { type: String, enum: ["High", "Medium", "Low"] },
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

    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    matches: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    passed: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    blockedUsers: [
      { type: mongoose.Schema.Types.ObjectId, ref: "User", default: [] },
    ],

    pushTokens: [
      {
        token: { type: String, required: true },
        device: { type: String, default: "unknown" },
        createdAt: { type: Date, default: Date.now },
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

    isActive: { type: Boolean, default: true },
    lastSeen: { type: Date, default: Date.now },
  },
  { timestamps: true },
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

userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

userSchema.methods.softDelete = function () {
  this.isDeleted = true;
  this.deletedAt = new Date();
  this.isActive = false;
  return this.save();
};

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
  if (!this.canRequestMatchmaking())
    throw new Error("No matchmaking sessions available");
  this.subscription.manualMatchmakingSessions.used += 1;
  this.subscription.manualMatchmakingSessions.lastSessionDate = new Date();
};
userSchema.methods.resetMatchmakingSessions = function () {
  if (this.subscription.tier === "lifetime") {
    this.subscription.manualMatchmakingSessions.total = 2;
    this.subscription.manualMatchmakingSessions.used = 0;
  }
};

userSchema.methods.meetsLocationPreference = function (otherUser) {
  const pref = this.locationPreference;
  if (pref === "Anywhere") return true;
  if (pref === "Same city")
    return this.city.toLowerCase() === otherUser.city.toLowerCase();
  if (pref === "Same state" || pref === "Home state")
    return this.state === otherUser.state;
  if (pref.includes("miles")) return this.state === otherUser.state;
  return true;
};

userSchema.methods.calculateMatchScore = function (otherUser) {
  if (!this.meetsLocationPreference(otherUser)) return 0;

  let score = 0;
  let totalWeight = 0;
  const weights = {
    lifeStage: 35,
    location: 25,
    age: 15,
    causes: 10,
    politicalBeliefs: 10,
    religion: 5,
  };

  const commonLifeStages = this.lifeStage.filter((stage) =>
    otherUser.lifeStage.includes(stage),
  );
  if (this.lifeStage.length > 0 && otherUser.lifeStage.length > 0) {
    score +=
      (commonLifeStages.length /
        Math.max(this.lifeStage.length, otherUser.lifeStage.length)) *
      weights.lifeStage;
    totalWeight += weights.lifeStage;
  }

  if (this.state === otherUser.state) {
    score += weights.location;
    if (this.city.toLowerCase() === otherUser.city.toLowerCase()) score += 5;
    totalWeight += weights.location;
  }

  const ageDiff = Math.abs(this.age - otherUser.age);
  score +=
    ageDiff <= 5
      ? weights.age
      : ageDiff <= 10
        ? weights.age * 0.7
        : ageDiff <= 15
          ? weights.age * 0.4
          : 0;
  totalWeight += weights.age;

  if (this.causes.length > 0 && otherUser.causes.length > 0) {
    const commonCauses = this.causes.filter((cause) =>
      otherUser.causes.includes(cause),
    );
    score +=
      (commonCauses.length /
        Math.max(this.causes.length, otherUser.causes.length)) *
      weights.causes;
    totalWeight += weights.causes;
  }

  if (
    this.politicalBeliefs.length > 0 &&
    otherUser.politicalBeliefs.length > 0
  ) {
    const commonPolitics = this.politicalBeliefs.filter((b) =>
      otherUser.politicalBeliefs.includes(b),
    );
    if (commonPolitics.length > 0) {
      score += weights.politicalBeliefs;
    } else {
      const moderateBeliefs = ["Moderate", "Independent", "Apolitical"];
      const hasModerate =
        this.politicalBeliefs.some((b) => moderateBeliefs.includes(b)) ||
        otherUser.politicalBeliefs.some((b) => moderateBeliefs.includes(b));
      if (hasModerate) score += weights.politicalBeliefs * 0.5;
    }
    totalWeight += weights.politicalBeliefs;
  }

  if (this.religion && otherUser.religion) {
    if (this.religion === otherUser.religion) {
      score += weights.religion;
    } else {
      const openMinded = ["Seeking/Undecided", "Agnostic", "Prefer not to say"];
      if (
        openMinded.includes(this.religion) ||
        openMinded.includes(otherUser.religion)
      )
        score += weights.religion * 0.5;
    }
    totalWeight += weights.religion;
  }

  return totalWeight > 0 ? Math.round((score / totalWeight) * 100) : 0;
};

userSchema.methods.toJSON = function () {
  const user = this.toObject();
  delete user.password;
  if (user.subscription) {
    delete user.subscription.stripeCustomerId;
    delete user.subscription.stripeSubscriptionId;
  }
  return user;
};

// Indexes
userSchema.index({ email: 1 }, { unique: true });
userSchema.index({ isDeleted: 1 });
userSchema.index({ state: 1, isDeleted: 1 });
userSchema.index({ state: 1, city: 1, isDeleted: 1 });
userSchema.index({ politicalBeliefs: 1, isDeleted: 1 });
userSchema.index({ religion: 1, isDeleted: 1 });
userSchema.index({ lifeStage: 1, isDeleted: 1 });
userSchema.index({ state: 1, politicalBeliefs: 1, isDeleted: 1 });
userSchema.index({ state: 1, religion: 1, isDeleted: 1 });
userSchema.index({ state: 1, lifeStage: 1, isDeleted: 1 });
userSchema.index({ name: "text", bio: "text" });

module.exports = mongoose.model("User", userSchema);
