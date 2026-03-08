const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const User = require("../models/User");
const auth = require("../middleware/auth");
const { body, validationResult } = require("express-validator");
const logger = require("../utils/logger");
const { Resend } = require("resend");

const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

// ===== SIGNUP ROUTE =====
router.post(
  "/signup",
  [
    body("email").isEmail().normalizeEmail().withMessage("Invalid email address"),
    body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters"),
    body("name").trim().notEmpty().withMessage("Name is required"),
    body("age").isInt({ min: 18, max: 120 }).withMessage("Age must be between 18 and 120"),
    body("city").trim().notEmpty().withMessage("City is required"),
    body("state").trim().notEmpty().withMessage("State is required"),
    body("bio").trim().notEmpty().withMessage("Bio is required"),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        logger.info("❌ Validation errors:", errors.array());
        return res.status(400).json({ message: errors.array()[0].msg, errors: errors.array() });
      }

      logger.info("\n========== SIGNUP REQUEST ==========");
      logger.info("📥 Full request body:", JSON.stringify(req.body, null, 2));
      logger.info("====================================\n");

      const userData = req.body;

      const existingUser = await User.findOne({ email: userData.email });
      if (existingUser) {
        return res.status(400).json({ message: "User already exists with this email" });
      }

      if (!userData.religion) {
        return res.status(400).json({ message: "Religion/Spirituality is required" });
      }
      if (!userData.politicalBeliefs || userData.politicalBeliefs.length === 0) {
        return res.status(400).json({ message: "Political beliefs are required - please select at least one" });
      }
      if (!userData.lifeStage || userData.lifeStage.length === 0) {
        return res.status(400).json({ message: "Life stage is required" });
      }
      if (!userData.causes || userData.causes.length < 3) {
        return res.status(400).json({ message: "Please select at least 3 causes" });
      }

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

      logger.info("💾 Saving user...");
      await user.save();
      logger.info("✅ User saved successfully!");

      const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });

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

      res.status(201).json({ token, user: userResponse });
    } catch (error) {
      logger.error("\n❌ SIGNUP ERROR:", error);
      res.status(500).json({ message: error.message || "Error creating account" });
    }
  },
);

// ===== LOGIN ROUTE =====
router.post(
  "/login",
  [
    body("email").isEmail().normalizeEmail().withMessage("Invalid email address"),
    body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters"),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ message: errors.array()[0].msg, errors: errors.array() });
      }

      const { email, password } = req.body;
      logger.info("\n========== LOGIN ATTEMPT ==========");
      logger.info("📧 Email:", email);

      const user = await User.findOne({ email });
      if (!user) {
        logger.info("❌ User not found");
        return res.status(401).json({ message: "Invalid credentials" });
      }

      const isMatch = await user.comparePassword(password);
      if (!isMatch) {
        logger.info("❌ Password does NOT match");
        return res.status(401).json({ message: "Invalid credentials" });
      }

      const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });

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

      logger.info("✅ Login successful!");
      res.json({ token, user: userResponse });
    } catch (error) {
      logger.error("❌ Login error:", error);
      res.status(500).json({ message: "Error logging in" });
    }
  },
);

// ===== GET PROFILE ROUTE =====
router.get("/profile", auth, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    const userResponse = user.toObject();
    userResponse.id = userResponse._id.toString();
    res.json(userResponse);
  } catch (error) {
    logger.error("Profile fetch error:", error);
    res.status(500).json({ message: "Error fetching profile" });
  }
});

// ===== FORGOT PASSWORD =====
router.post(
  "/forgot-password",
  [body("email").isEmail().normalizeEmail().withMessage("Invalid email address")],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ message: errors.array()[0].msg });
      }

      const { email } = req.body;
      logger.info("\n========== FORGOT PASSWORD REQUEST ==========");
      logger.info("📧 Email:", email);

      const user = await User.findOne({ email });

      if (!user) {
        logger.info("⚠️ User not found, returning generic message");
        return res.status(200).json({
          message: "If an account exists, you will receive a password reset email",
        });
      }

      // Generate token
      const resetToken = crypto.randomBytes(32).toString("hex");
      const hashedToken = crypto.createHash("sha256").update(resetToken).digest("hex");

      user.resetPasswordToken = hashedToken;
      user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
      await user.save();

      const resetUrl = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;
      logger.info("🔗 Reset URL:", resetUrl);

      // ✅ Send email via Resend
      try {
        if (resend) {
          await resend.emails.send({
          from: process.env.FROM_EMAIL || "KindredPal <onboarding@resend.dev>",
          to: user.email,
          subject: "Reset Your KindredPal Password",
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
              <div style="background-color: #2B6CB0; padding: 24px; border-radius: 8px 8px 0 0; text-align: center;">
                <h1 style="color: white; margin: 0; font-size: 24px;">KindredPal</h1>
              </div>
              <div style="background-color: #ffffff; padding: 32px; border: 1px solid #E2E8F0; border-top: none; border-radius: 0 0 8px 8px;">
                <h2 style="color: #2D3748; margin-top: 0;">Reset Your Password</h2>
                <p style="color: #4A5568; font-size: 16px;">Hi ${user.name},</p>
                <p style="color: #4A5568; font-size: 16px;">
                  We received a request to reset your password. Click the button below to create a new password.
                  This link will expire in <strong>1 hour</strong>.
                </p>
                <div style="text-align: center; margin: 32px 0;">
                  <a href="${resetUrl}"
                    style="background-color: #2B6CB0; color: white; padding: 14px 32px; border-radius: 8px;
                    text-decoration: none; font-size: 16px; font-weight: bold; display: inline-block;">
                    Reset Password
                  </a>
                </div>
                <p style="color: #718096; font-size: 14px;">
                  If you didn't request a password reset, you can safely ignore this email.
                  Your password will not be changed.
                </p>
                <hr style="border: none; border-top: 1px solid #E2E8F0; margin: 24px 0;" />
                <p style="color: #A0AEC0; font-size: 12px; text-align: center;">
                  © ${new Date().getFullYear()} KindredPal. All rights reserved.
                </p>
              </div>
            </div>
          `,
        });
          logger.info("✅ Reset email sent to:", user.email);
        } else {
          logger.warn("⚠️ RESEND_API_KEY not set - email not sent. Reset URL:", resetUrl);
        }
      } catch (emailError) {
        logger.error("❌ Email send error:", emailError);
        // Don't fail the request if email fails — token is still saved
      }

      res.status(200).json({
        message: "If an account exists, you will receive a password reset email",
      });
    } catch (error) {
      logger.error("❌ Forgot password error:", error);
      res.status(500).json({ message: "Server error" });
    }
  },
);

// ===== RESET PASSWORD =====
router.post(
  "/reset-password",
  [
    body("token").notEmpty().withMessage("Reset token is required"),
    body("newPassword").isLength({ min: 6 }).withMessage("Password must be at least 6 characters"),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ message: errors.array()[0].msg });
      }

      const { token, newPassword } = req.body;
      logger.info("\n========== RESET PASSWORD REQUEST ==========");

      const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

      const user = await User.findOne({
        resetPasswordToken: hashedToken,
        resetPasswordExpires: { $gt: Date.now() },
      });

      if (!user) {
        logger.info("❌ Invalid or expired token");
        return res.status(400).json({
          message: "Invalid or expired reset token. Please request a new one.",
        });
      }

      user.password = newPassword;
      user.resetPasswordToken = undefined;
      user.resetPasswordExpires = undefined;
      await user.save();

      logger.info("✅ Password reset successful for:", user.email);

      res.status(200).json({
        message: "Password has been reset successfully. You can now log in with your new password.",
      });
    } catch (error) {
      logger.error("❌ Reset password error:", error);
      res.status(500).json({ message: "Server error" });
    }
  },
);

module.exports = router;