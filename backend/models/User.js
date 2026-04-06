const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    // ── Core ──────────────────────────────────────────────────────
    name: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: { type: String, required: true, minlength: 6 },
    age: { type: Number, min: 18, max: 100 },
    bio: { type: String, maxlength: 500, default: "" },
    profilePhoto: { type: String, default: "" },
    additionalPhotos: [{ type: String }],

    // ── Location ──────────────────────────────────────────────────
    city: { type: String, default: "" },
    state: { type: String, default: "" },
    latitude: { type: Number },
    longitude: { type: Number },
    locationPreference: {
      type: String,
      enum: [
        "Same city",
        "Same state",
        "Anywhere",
        "25 miles",
        "50 miles",
        "100 miles",
      ],
      default: "Same state",
    },

    // ── Faith ─────────────────────────────────────────────────────
    religion: {
      type: String,
      enum: [
        "None",
        "Spiritual but not religious",
        "Christian (Catholic)",
        "Christian (Protestant)",
        "Christian (Evangelical)",
        "Christian (Orthodox)",
        "Jewish",
        "Muslim",
        "Hindu",
        "Buddhist",
        "Mormon / LDS",
        "Other",
        "",
      ],
      default: "",
    },

    // ── Politics ──────────────────────────────────────────────────
    politicalBeliefs: {
      type: String,
      enum: ["Conservative", "Moderate", "Liberal", "Prefer not to say", ""],
      default: "",
    },

    // ── Life Stage ────────────────────────────────────────────────
    lifeStage: {
      type: [String],
      enum: [
        "Single",
        "In a relationship",
        "Married",
        "Divorced",
        "Widowed",
        "Empty nester",
        "Retired",
        "Caregiver",
        "Aging Alone",
        "New Career",
        "New to Town",
      ],
      default: [],
    },

    // ── Family Situation ──────────────────────────────────────────
    familySituation: {
      type: [String],
      enum: [
        "No kids",
        "Expecting",
        "Kids under 5",
        "Kids 6-12",
        "Teenagers",
        "Adult children",
        "Grandchildren",
        "Homeschooling",
      ],
      default: [],
    },

    // ── Core Values (pick up to 3) ────────────────────────────────
    coreValues: {
      type: [String],
      enum: [
        "Faith & God",
        "Personal growth",
        "Health & wellness",
        "Community & service",
        "Adventure & outdoors",
        "Creativity & arts",
        "Lifelong learning",
        "Financial freedom",
        "Environmental stewardship",
        "Mental health & self-care",
        "Entrepreneurship",
        "Animal welfare",
        "Theology",
        "Philosophy",
        "Technology",
        "Sports & Athletics",
        "Fashion",
        "Design",
        "Real Estate",
        "Investing",
        "Reading",
        "Politics",
      ],
      validate: {
        validator: function (v) {
          return v.length <= 3;
        },
        message: "You can select up to 3 core values",
      },
      default: [],
    },

    // ── Causes / Interests (legacy) ───────────────────────────────
    causes: { type: [String], default: [] },

    // ── Verification ──────────────────────────────────────────────
    isVerified: { type: Boolean, default: false },
    onboardingComplete: { type: Boolean, default: false },
    verifiedAt: { type: Date },

    // ── Discover / Matching (legacy — kept for backwards compat) ──
    lookingFor: { type: String, default: "" },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    passed: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    matches: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    blockedUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],

    // ── Filter preferences ────────────────────────────────────────
    filterPoliticalBeliefs: { type: [String], default: [] },
    filterReligions: { type: [String], default: [] },
    filterLifeStages: { type: [String], default: [] },
    filterFamilySituations: { type: [String], default: [] },
    filterCoreValues: { type: [String], default: [] },

    // ── Push notifications ────────────────────────────────────────
    pushTokens: [
      {
        token: { type: String },
        device: { type: String, default: "unknown" },
        createdAt: { type: Date, default: Date.now },
      },
    ],
    emailNotifications: {
      newMessage: { type: Boolean, default: true },
      newConnection: { type: Boolean, default: true },
      groupUpdates: { type: Boolean, default: true },
    },

    // ── Account status ────────────────────────────────────────────
    isActive: { type: Boolean, default: true },
    isDeleted: { type: Boolean, default: false },
    deletedAt: { type: Date },
    lastSeen: { type: Date, default: Date.now },
  },
  { timestamps: true },
);

// ── Indexes ───────────────────────────────────────────────────────
userSchema.index({ city: 1, state: 1 });
userSchema.index({ state: 1 });
userSchema.index({ religion: 1 });
userSchema.index({ politicalBeliefs: 1 });
userSchema.index({ lifeStage: 1 });
userSchema.index({ familySituation: 1 });
userSchema.index({ coreValues: 1 });
// email index is defined inline with unique:true on the field — no duplicate needed

// ── Hash password before save ─────────────────────────────────────
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err);
  }
});

userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

userSchema.methods.softDelete = async function () {
  this.isDeleted = true;
  this.isActive = false;
  this.deletedAt = new Date();
  this.email = `deleted_${Date.now()}_${this.email}`;
  return this.save();
};

userSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  delete obj.pushTokens;
  delete obj.__v;
  obj.id = obj._id.toString();
  return obj;
};

const User = mongoose.models.User || mongoose.model("User", userSchema);
module.exports = User;
