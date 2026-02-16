const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const User = require("../models/User");
const auth = require("../middleware/auth");
const { body, validationResult } = require("express-validator");

// ===== SIGNUP ROUTE =====

// @route   POST /api/auth/signup
// @desc    Register a new user
// @access  Public
router.post(
  "/signup",
  [
    body("email")
      .isEmail()
      .normalizeEmail()
      .withMessage("Invalid email address"),
    body("password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters"),
    body("name").trim().notEmpty().withMessage("Name is required"),
    body("age")
      .isInt({ min: 18, max: 120 })
      .withMessage("Age must be between 18 and 120"),
    body("city").trim().notEmpty().withMessage("City is required"),
    body("state").trim().notEmpty().withMessage("State is required"),
    body("bio").trim().notEmpty().withMessage("Bio is required"),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        console.log("❌ Validation errors:", errors.array());
        return res.status(400).json({
          message: errors.array()[0].msg,
          errors: errors.array(),
        });
      }

      console.log("\n========== SIGNUP REQUEST ==========");
      console.log("📥 Full request body:", JSON.stringify(req.body, null, 2));
      console.log("====================================\n");

      const userData = req.body;

      // Check if user already exists
      const existingUser = await User.findOne({ email: userData.email });
      if (existingUser) {
        return res
          .status(400)
          .json({ message: "User already exists with this email" });
      }

      // Validate required fields
      if (!userData.religion) {
        return res
          .status(400)
          .json({ message: "Religion/Spirituality is required" });
      }

      if (
        !userData.politicalBeliefs ||
        userData.politicalBeliefs.length === 0
      ) {
        return res.status(400).json({
          message:
            "Political beliefs are required - please select at least one",
        });
      }

      if (!userData.lifeStage || userData.lifeStage.length === 0) {
        return res.status(400).json({ message: "Life stage is required" });
      }

      if (!userData.causes || userData.causes.length < 3) {
        return res
          .status(400)
          .json({ message: "Please select at least 3 causes" });
      }

      // Create user
      const user = new User({
        email: userData.email,
        password: userData.password,
        name: userData.name,
        age: parseInt(userData.age),
        gender: userData.gender,
        city: userData.city,
        state: userData.state,
        bio: userData.bio,
        politicalBeliefs: userData.politicalBeliefs,
        religion: userData.religion,
        causes: userData.causes,
        lifeStage: userData.lifeStage,
        lookingFor: userData.lookingFor || [],
        profilePhoto: userData.profilePhoto || "",
        additionalPhotos: userData.additionalPhotos || [],
      });

      console.log("💾 Saving user...");
      await user.save();
      console.log("✅ User saved successfully!");

      // Generate JWT token
      const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
        expiresIn: "7d",
      });

      const userResponse = {
        id: user._id.toString(),
        _id: user._id,
        email: user.email,
        name: user.name,
        age: user.age,
        gender: user.gender,
        city: user.city,
        state: user.state,
        bio: user.bio,
        profilePhoto: user.profilePhoto,
        additionalPhotos: user.additionalPhotos,
        politicalBeliefs: user.politicalBeliefs,
        religion: user.religion,
        causes: user.causes,
        lifeStage: user.lifeStage,
        lookingFor: user.lookingFor,
        createdAt: user.createdAt,
      };

      res.status(201).json({
        token,
        user: userResponse,
      });
    } catch (error) {
      console.error("\n❌ SIGNUP ERROR:", error);
      console.error("Error message:", error.message);
      res.status(500).json({
        message: error.message || "Error creating account",
      });
    }
  },
);

// ===== LOGIN ROUTE =====

// @route   POST /api/auth/login
// @desc    Login user
// @access  Public
router.post(
  "/login",
  [
    body("email")
      .isEmail()
      .normalizeEmail()
      .withMessage("Invalid email address"),
    body("password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters"),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        console.log("❌ Validation errors:", errors.array());
        return res.status(400).json({
          message: errors.array()[0].msg,
          errors: errors.array(),
        });
      }

      const { email, password } = req.body;

      console.log("\n========== LOGIN ATTEMPT ==========");
      console.log("📧 Email:", email);

      const user = await User.findOne({ email });
      if (!user) {
        console.log("❌ User not found");
        return res.status(401).json({ message: "Invalid credentials" });
      }

      console.log("✅ User found:", user.email);

      const isMatch = await user.comparePassword(password);
      console.log("🔍 Password match result:", isMatch);

      if (!isMatch) {
        console.log("❌ Password does NOT match");
        return res.status(401).json({ message: "Invalid credentials" });
      }

      console.log("✅ Password matches! Generating token...");

      const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
        expiresIn: "7d",
      });

      const userResponse = {
        id: user._id.toString(),
        _id: user._id,
        email: user.email,
        name: user.name,
        age: user.age,
        gender: user.gender,
        city: user.city,
        state: user.state,
        bio: user.bio,
        profilePhoto: user.profilePhoto,
        additionalPhotos: user.additionalPhotos,
        politicalBeliefs: user.politicalBeliefs,
        religion: user.religion,
        causes: user.causes,
        lifeStage: user.lifeStage,
        lookingFor: user.lookingFor,
        createdAt: user.createdAt,
      };

      console.log("✅ Login successful!");
      console.log("====================================\n");

      res.json({
        token,
        user: userResponse,
      });
    } catch (error) {
      console.error("❌ Login error:", error);
      res.status(500).json({ message: "Error logging in" });
    }
  },
);

// ===== GET PROFILE ROUTE =====

// @route   GET /api/auth/profile
// @desc    Get current user profile
// @access  Private
router.get("/profile", auth, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    console.log("📤 Sending profile for:", user.email);

    const userResponse = user.toObject();
    userResponse.id = userResponse._id.toString();

    res.json(userResponse);
  } catch (error) {
    console.error("Profile fetch error:", error);
    res.status(500).json({ message: "Error fetching profile" });
  }
});

// ===== PASSWORD RESET ROUTES =====

// @route   POST /api/auth/forgot-password
// @desc    Send password reset email
// @access  Public
router.post(
  "/forgot-password",
  [
    body("email")
      .isEmail()
      .normalizeEmail()
      .withMessage("Invalid email address"),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          message: errors.array()[0].msg,
        });
      }

      const { email } = req.body;

      console.log("\n========== FORGOT PASSWORD REQUEST ==========");
      console.log("📧 Email:", email);

      const user = await User.findOne({ email });

      if (!user) {
        console.log("⚠️ User not found, but returning success message");
        return res.status(200).json({
          message:
            "If an account exists, you will receive a password reset email",
        });
      }

      console.log("✅ User found:", user.email);

      const resetToken = crypto.randomBytes(32).toString("hex");
      const hashedToken = crypto
        .createHash("sha256")
        .update(resetToken)
        .digest("hex");

      user.resetPasswordToken = hashedToken;
      user.resetPasswordExpires = Date.now() + 3600000;
      await user.save();

      const resetUrl = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;

      if (process.env.NODE_ENV !== "production") {
        console.log("🔗 Reset URL (DEV ONLY):", resetUrl);
      }

      console.log("✅ Password reset request processed");
      console.log("====================================\n");

      res.status(200).json({
        message:
          "If an account exists, you will receive a password reset email",
      });
    } catch (error) {
      console.error("❌ Forgot password error:", error);
      res.status(500).json({ message: "Server error" });
    }
  },
);

// @route   POST /api/auth/reset-password
// @desc    Reset password with token
// @access  Public
router.post(
  "/reset-password",
  [
    body("token").notEmpty().withMessage("Reset token is required"),
    body("newPassword")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters"),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          message: errors.array()[0].msg,
        });
      }

      const { token, newPassword } = req.body;

      console.log("\n========== RESET PASSWORD REQUEST ==========");

      const hashedToken = crypto
        .createHash("sha256")
        .update(token)
        .digest("hex");

      const user = await User.findOne({
        resetPasswordToken: hashedToken,
        resetPasswordExpires: { $gt: Date.now() },
      });

      if (!user) {
        console.log("❌ Invalid or expired token");
        return res.status(400).json({
          message: "Invalid or expired reset token. Please request a new one.",
        });
      }

      console.log("✅ Valid token found for user:", user.email);

      user.password = newPassword;
      user.resetPasswordToken = undefined;
      user.resetPasswordExpires = undefined;

      await user.save();

      console.log("✅ Password reset successful");
      console.log("====================================\n");

      res.status(200).json({
        message:
          "Password has been reset successfully. You can now log in with your new password.",
      });
    } catch (error) {
      console.error("❌ Reset password error:", error);
      res.status(500).json({ message: "Server error" });
    }
  },
);

module.exports = router;
