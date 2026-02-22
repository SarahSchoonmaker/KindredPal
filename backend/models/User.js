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

    // PASSWORD RESET FIELDS - MOVED HERE (outside additionalPhotos)
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
    "Home state",
    "Within 50 miles",
    "Within 100 miles",
    "Within 200 miles",
    "Anywhere",
  ],
  default: "Home state",
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
          // Relationship Status
          "Single",
          "In a Relationship",
          "Engaged",
          "Married",
          "Divorced",
          "Widowed",
          "Separated",

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

 blockedUsers: [
  { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User" 
  }
],

    pushTokens: [
      {
        token: {
          type: String,
          required: true,
        },
        device: {
          type: String,
          enum: ["ios", "android"],
        },
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],

    // Email Notification Settings
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

    // Account Deletion (Soft Delete)
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

// Soft delete method
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
  if (pref === "Home state") return this.state === otherUser.state;

  // For mile-based preferences, would need geocoding (future feature)
  if (pref.includes("miles")) return this.state === otherUser.state;

  return true;
};

// Calculate match score with location preference
// Calculate match score with location preference
userSchema.methods.calculateMatchScore = function (otherUser) {
  // First check location preference
  if (!this.meetsLocationPreference(otherUser)) {
    return 0;
  }

  let totalPoints = 0;
  let matchedPoints = 0;

  // Political Beliefs (20 points)
  totalPoints += 20;
  const user1Political = Array.isArray(this.politicalBeliefs)
    ? this.politicalBeliefs
    : [this.politicalBeliefs];
  const user2Political = Array.isArray(otherUser.politicalBeliefs)
    ? otherUser.politicalBeliefs
    : [otherUser.politicalBeliefs];

  const politicalMatch = user1Political.some((belief) =>
    user2Political.includes(belief),
  );
  if (politicalMatch) matchedPoints += 20;

  // Religion (20 points)
  totalPoints += 20;
  if (this.religion === otherUser.religion) {
    matchedPoints += 20;
  }

  // Life Stage (30 points) - MOST IMPORTANT
  totalPoints += 30;
  const user1LifeStage = Array.isArray(this.lifeStage)
    ? this.lifeStage
    : [this.lifeStage];
  const user2LifeStage = Array.isArray(otherUser.lifeStage)
    ? otherUser.lifeStage
    : [otherUser.lifeStage];

  const lifeStageMatches = user1LifeStage.filter((stage) =>
    user2LifeStage.includes(stage),
  ).length;

  if (lifeStageMatches > 0) {
    matchedPoints += Math.min(30, lifeStageMatches * 10);
  }

  // Causes (20 points)
  totalPoints += 20;
  const causesMatches = (this.causes || []).filter((cause) =>
    (otherUser.causes || []).includes(cause),
  ).length;

  if (causesMatches > 0) {
    matchedPoints += Math.min(20, causesMatches * 4);
  }

  // Looking For (10 points)
  totalPoints += 10;
  const user1LookingFor = Array.isArray(this.lookingFor)
    ? this.lookingFor
    : [this.lookingFor];
  const user2LookingFor = Array.isArray(otherUser.lookingFor)
    ? otherUser.lookingFor
    : [otherUser.lookingFor];

  const lookingForMatch = user1LookingFor.some((goal) =>
    user2LookingFor.includes(goal),
  );
  if (lookingForMatch) matchedPoints += 10;

  // Calculate percentage
  return Math.round((matchedPoints / totalPoints) * 100);
};

// Remove sensitive data from JSON response
userSchema.methods.toJSON = function () {
  const user = this.toObject();
  delete user.password;

  if (user.subscription) {
    delete user.subscription.stripeCustomerId;
    delete user.subscription.stripeSubscriptionId;
  }

  return user;
};

module.exports = mongoose.model("User", userSchema);
