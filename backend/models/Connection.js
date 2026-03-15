// backend/models/Connection.js
const mongoose = require("mongoose");

const connectionSchema = new mongoose.Schema(
  {
    from: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    to: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "accepted", "declined"],
      default: "pending",
    },
    // Optional message with the request
    message: {
      type: String,
      maxlength: 200,
      default: "",
    },
    // Which group they met through
    sharedGroupId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Group",
    },
  },
  { timestamps: true }
);

// Prevent duplicate pairs
connectionSchema.index({ from: 1, to: 1 }, { unique: true });
connectionSchema.index({ to: 1, status: 1 });
connectionSchema.index({ from: 1, status: 1 });

const Connection = mongoose.models.Connection || mongoose.model("Connection", connectionSchema);
module.exports = Connection;