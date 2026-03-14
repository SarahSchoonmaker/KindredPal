const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const logger = require("../utils/logger");

const auth = async (req, res, next) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      return res.status(401).json({ message: "No authentication token, access denied" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Support both 'userId' and 'id' in JWT payload
    const userId = decoded.userId || decoded.id;
    if (!userId) {
      return res.status(401).json({ message: "Invalid token payload" });
    }

    // Use mongoose.model() to avoid circular dependency
    const User = mongoose.model("User");
    const user = await User.findById(userId).select("-password");

    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    req.user = user;
    req.userId = userId;

    next();
  } catch (error) {
    logger.error("Auth middleware error:", error);
    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({ message: "Invalid token" });
    }
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Token expired, please log in again" });
    }
    res.status(401).json({ message: "Invalid token" });
  }
};

module.exports = auth;