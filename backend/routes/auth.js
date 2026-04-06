const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const auth = require("../middleware/auth");
const { body, validationResult } = require("express-validator");
const logger = require("../utils/logger");
const { Resend } = require("resend");

// Lazy require — called inside handlers to avoid circular dependency
// with the User model. This is safe because Node caches modules.
const getUser = () => require("../models/User");

const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

const FROM_EMAIL =
  process.env.FROM_EMAIL || "KindredPal <onboarding@resend.dev>";
const CLIENT_URL = process.env.CLIENT_URL || "https://kindredpal.com";

// ── Email helper ──────────────────────────────────────────────────
async function sendEmail({ to, subject, html }) {
  if (!resend) {
    logger.warn("⚠️ RESEND_API_KEY not set — skipping email to:", to);
    return;
  }
  try {
    await resend.emails.send({ from: FROM_EMAIL, to, subject, html });
    logger.info("✅ Email sent to:", to, "| Subject:", subject);
  } catch (err) {
    logger.error("❌ Email send error:", err?.message || err);
  }
}

// ── Welcome email template ────────────────────────────────────────
function welcomeEmailHtml(name) {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background: #f7fafc;">
      <div style="background-color: #2B6CB0; padding: 32px 24px; border-radius: 12px 12px 0 0; text-align: center;">
        <h1 style="color: white; margin: 0; font-size: 28px; font-weight: 800; letter-spacing: -0.5px;">KindredPal</h1>
        <p style="color: rgba(255,255,255,0.85); margin: 8px 0 0; font-size: 15px;">Community built on shared values</p>
      </div>
      <div style="background-color: #ffffff; padding: 36px 32px; border: 1px solid #E2E8F0; border-top: none; border-radius: 0 0 12px 12px;">
        <h2 style="color: #2D3748; margin-top: 0; font-size: 22px;">Welcome, ${name}! 🎉</h2>
        <p style="color: #4A5568; line-height: 1.7; font-size: 15px;">
          We're so glad you've joined KindredPal. This is a community built around real connections — people who share your values, life stage, and heart.
        </p>
        <p style="color: #4A5568; line-height: 1.7; font-size: 15px;">
          Whether you're looking for a support group, new friends, or just people who truly get where you're coming from, you're in the right place.
        </p>
        <div style="background: #EBF4FF; border-left: 4px solid #2B6CB0; padding: 16px 20px; border-radius: 4px; margin: 24px 0;">
          <p style="color: #2B6CB0; font-weight: 700; margin: 0 0 8px; font-size: 15px;">Here's how to get started:</p>
          <ul style="color: #2D3748; margin: 0; padding-left: 20px; line-height: 2; font-size: 14px;">
            <li>Complete your profile so others can find you</li>
            <li>Browse community groups that match your interests</li>
            <li>Send a connection request to someone who resonates with you</li>
            <li>Join a group and say hello 👋</li>
          </ul>
        </div>
        <div style="text-align: center; margin: 32px 0;">
          <a href="${CLIENT_URL}/groups"
            style="background-color: #2B6CB0; color: white; padding: 14px 36px; border-radius: 8px; text-decoration: none; font-size: 16px; font-weight: bold; display: inline-block;">
            Explore Groups
          </a>
        </div>
        <p style="color: #4A5568; line-height: 1.7; font-size: 15px;">
          We truly hope KindredPal brings meaningful connections and a sense of belonging into your life. We're rooting for you every step of the way.
        </p>
        <p style="color: #4A5568; font-size: 15px;">With warmth,<br/><strong>The KindredPal Team</strong></p>
      </div>
      <p style="text-align: center; color: #a0aec0; font-size: 12px; margin-top: 20px;">
        © ${new Date().getFullYear()} KindredPal · You received this because you created an account.
      </p>
    </div>
  `;
}

// ── Password reset email template ─────────────────────────────────
function resetEmailHtml(name, resetUrl) {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background: #f7fafc;">
      <div style="background-color: #2B6CB0; padding: 24px; border-radius: 12px 12px 0 0; text-align: center;">
        <h1 style="color: white; margin: 0; font-size: 24px; font-weight: 800;">KindredPal</h1>
      </div>
      <div style="background-color: #ffffff; padding: 32px; border: 1px solid #E2E8F0; border-top: none; border-radius: 0 0 12px 12px;">
        <h2 style="color: #2D3748; margin-top: 0;">Reset Your Password</h2>
        <p style="color: #4A5568; line-height: 1.7;">Hi ${name},</p>
        <p style="color: #4A5568; line-height: 1.7;">
          We received a request to reset your KindredPal password. Click the button below — this link expires in <strong>1 hour</strong>.
        </p>
        <div style="text-align: center; margin: 32px 0;">
          <a href="${resetUrl}"
            style="background-color: #2B6CB0; color: white; padding: 14px 32px; border-radius: 8px; text-decoration: none; font-size: 16px; font-weight: bold; display: inline-block;">
            Reset My Password
          </a>
        </div>
        <p style="color: #718096; font-size: 14px; line-height: 1.6;">
          If you didn't request a password reset, you can safely ignore this email.
        </p>
        <p style="color: #718096; font-size: 13px; margin-top: 24px; padding-top: 16px; border-top: 1px solid #E2E8F0;">
          Or copy this link:<br/>
          <a href="${resetUrl}" style="color: #2B6CB0; word-break: break-all;">${resetUrl}</a>
        </p>
      </div>
      <p style="text-align: center; color: #a0aec0; font-size: 12px; margin-top: 20px;">
        © ${new Date().getFullYear()} KindredPal
      </p>
    </div>
  `;
}

// ===== SIGNUP =====
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
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res
          .status(400)
          .json({ message: errors.array()[0].msg, errors: errors.array() });
      }

      const User = getUser();
      const userData = req.body;

      const existingUser = await User.findOne({ email: userData.email });
      if (existingUser) {
        return res
          .status(400)
          .json({ message: "User already exists with this email" });
      }

      const user = new User({
        email: userData.email,
        password: userData.password,
        name: userData.name,
        age: parseInt(userData.age),
        gender: userData.gender || "",
        city: userData.city,
        state: userData.state,
        bio: userData.bio || "",
        politicalBeliefs: userData.politicalBeliefs || "",
        religion: userData.religion || "",
        causes: userData.causes || [],
        lifeStage: userData.lifeStage || [],
        lookingFor: userData.lookingFor || "",
        profilePhoto: userData.profilePhoto || "",
        additionalPhotos: userData.additionalPhotos || [],
        onboardingComplete: false,
      });

      await user.save();
      logger.info("✅ User saved successfully:", user.email);

      // Send welcome email — non-blocking
      sendEmail({
        to: user.email,
        subject: "Welcome to KindredPal 🎉",
        html: welcomeEmailHtml(user.name),
      });

      const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
        expiresIn: "7d",
      });
      res.status(201).json({ token, user: buildUserResponse(user) });
    } catch (error) {
      logger.error("❌ SIGNUP ERROR:", error);
      res
        .status(500)
        .json({ message: error.message || "Error creating account" });
    }
  },
);

// ===== LOGIN =====
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
        return res.status(400).json({ message: errors.array()[0].msg });
      }

      const { email, password } = req.body;
      logger.info("\n========== LOGIN ATTEMPT ==========");
      logger.info("📧 Email:", email);

      const User = getUser();
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

      const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
        expiresIn: "7d",
      });
      logger.info("✅ Login successful:", email);
      res.json({ token, user: buildUserResponse(user) });
    } catch (error) {
      logger.error("❌ Login error:", error);
      res.status(500).json({ message: "Error logging in" });
    }
  },
);

// ===== GET PROFILE =====
router.get("/profile", auth, async (req, res) => {
  try {
    const User = getUser();
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
  [
    body("email")
      .isEmail()
      .normalizeEmail()
      .withMessage("Invalid email address"),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty())
        return res.status(400).json({ message: errors.array()[0].msg });

      const { email } = req.body;
      const User = getUser();
      const user = await User.findOne({ email });

      if (!user) {
        return res.status(200).json({
          message:
            "If an account exists, you will receive a password reset email",
        });
      }

      const resetToken = crypto.randomBytes(32).toString("hex");
      const hashedToken = crypto
        .createHash("sha256")
        .update(resetToken)
        .digest("hex");

      user.resetPasswordToken = hashedToken;
      user.resetPasswordExpires = Date.now() + 3600000;
      await user.save();

      const resetUrl = `${CLIENT_URL}/reset-password/${resetToken}`;

      await sendEmail({
        to: user.email,
        subject: "Reset Your KindredPal Password",
        html: resetEmailHtml(user.name, resetUrl),
      });

      res.status(200).json({
        message:
          "If an account exists, you will receive a password reset email",
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
    body("newPassword")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters"),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty())
        return res.status(400).json({ message: errors.array()[0].msg });

      const { token, newPassword } = req.body;
      const hashedToken = crypto
        .createHash("sha256")
        .update(token)
        .digest("hex");

      const User = getUser();
      const user = await User.findOne({
        resetPasswordToken: hashedToken,
        resetPasswordExpires: { $gt: Date.now() },
      });

      if (!user) {
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
        message:
          "Password has been reset successfully. You can now log in with your new password.",
      });
    } catch (error) {
      logger.error("❌ Reset password error:", error);
      res.status(500).json({ message: "Server error" });
    }
  },
);

// ── Helper ────────────────────────────────────────────────────────
function buildUserResponse(user) {
  return {
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
    familySituation: user.familySituation || [],
    coreValues: user.coreValues || [],
    lookingFor: user.lookingFor,
    locationPreference: user.locationPreference,
    filterPoliticalBeliefs: user.filterPoliticalBeliefs || [],
    filterReligions: user.filterReligions || [],
    filterLifeStages: user.filterLifeStages || [],
    onboardingComplete: user.onboardingComplete || false,
    matches: user.matches || [],
    likes: user.likes || [],
    createdAt: user.createdAt,
  };
}

module.exports = router;
