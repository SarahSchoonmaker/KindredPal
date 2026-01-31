const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const auth = require("../middleware/auth");
const { body, validationResult } = require("express-validator");

// Signup with validation and detailed logging
router.post(
  "/signup",
  [
    // Input validation
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
      // Check validation errors
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

      // Log each field individually
      console.log("Email:", userData.email);
      console.log("Name:", userData.name);
      console.log("Age:", userData.age);
      console.log("Religion:", userData.religion);
      console.log("Political Beliefs:", userData.politicalBeliefs);
      console.log("Causes:", userData.causes);
      console.log("Life Stage:", userData.lifeStage);
      console.log("Looking For:", userData.lookingFor);

      // Check if user already exists
      const existingUser = await User.findOne({ email: userData.email });
      if (existingUser) {
        return res
          .status(400)
          .json({ message: "User already exists with this email" });
      }

      // Validate required fields before creating user
      if (!userData.religion) {
        console.log("❌ MISSING: religion");
        return res
          .status(400)
          .json({ message: "Religion/Spirituality is required" });
      }

      if (
        !userData.politicalBeliefs ||
        userData.politicalBeliefs.length === 0
      ) {
        console.log("❌ MISSING: politicalBeliefs");
        return res.status(400).json({
          message:
            "Political beliefs are required - please select at least one",
        });
      }

      if (!userData.lifeStage || userData.lifeStage.length === 0) {
        console.log("❌ MISSING: lifeStage");
        return res.status(400).json({ message: "Life stage is required" });
      }

      if (!userData.causes || userData.causes.length < 3) {
        console.log("❌ MISSING: causes (need 3+)");
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

      // Return complete user object with all fields - FIXED: _id → id
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

      console.log("📤 Sending complete user data:", userResponse);

      res.status(201).json({
        token,
        user: userResponse,
      });
    } catch (error) {
      console.error("\n❌ SIGNUP ERROR:", error);
      console.error("Error message:", error.message);
      if (error.errors) {
        console.error("Validation errors:", Object.keys(error.errors));
      }
      res.status(500).json({
        message: error.message || "Error creating account",
      });
    }
  },
);

// Login with validation
router.post(
  "/login",
  [
    // Input validation
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
      // Check validation errors
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

      // Return complete user object with all fields - FIXED: _id → id
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

// Get current user profile
router.get("/profile", auth, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    console.log("📤 Sending profile for:", user.email);
    console.log("Profile includes:", {
      politicalBeliefs: user.politicalBeliefs?.length || 0,
      religion: user.religion,
      causes: user.causes?.length || 0,
      lifeStage: user.lifeStage?.length || 0,
      lookingFor: user.lookingFor?.length || 0,
    });

    // FIXED: Return user with id field
    const userResponse = user.toObject();
    userResponse.id = userResponse._id.toString();

    res.json(userResponse);
  } catch (error) {
    console.error("Profile fetch error:", error);
    res.status(500).json({ message: "Error fetching profile" });
  }
});

module.exports = router;
