const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema(
  {
    group: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Group",
      required: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },
    description: {
      type: String,
      maxlength: 1000,
      default: "",
    },
    date: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date, // optional end time
    },
    address: {
      type: String,
      trim: true,
      default: "",
    },
    city: {
      type: String,
      trim: true,
      default: "",
    },
    state: {
      type: String,
      trim: true,
      default: "",
    },
    isVirtual: {
      type: Boolean,
      default: false,
    },
    virtualLink: {
      type: String,
      default: "",
    },
    rsvps: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        status: {
          type: String,
          enum: ["going", "maybe", "not_going"],
          default: "going",
        },
        rsvpedAt: { type: Date, default: Date.now },
      },
    ],
    maxAttendees: {
      type: Number,
      default: null, // null = unlimited
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

eventSchema.index({ group: 1, date: 1 });
eventSchema.index({ date: 1 });

const Event = mongoose.models.Event || mongoose.model("Event", eventSchema);
module.exports = Event;