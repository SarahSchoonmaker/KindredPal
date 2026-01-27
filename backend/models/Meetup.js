const mongoose = require("mongoose");

const meetupSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: String,
    dateTime: {
      type: Date,
      required: true,
    },
    location: {
      address: String,
      city: String,
      state: String,
      zipCode: String,
    },
    creator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    invitedUsers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    rsvps: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        status: {
          type: String,
          enum: ["going", "maybe", "not-going"],
          default: "going",
        },
      },
    ],
    maxAttendees: Number,
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("Meetup", meetupSchema);
