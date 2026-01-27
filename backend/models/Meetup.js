// backend/models/Meetup.js
const mongoose = require("mongoose");

const meetupSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    location: {
      address: String,
      city: String,
      state: String,
      coordinates: {
        lat: Number,
        lng: Number,
      },
    },
    dateTime: {
      type: Date,
      required: true,
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
          default: "maybe",
        },
        respondedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    maxAttendees: {
      type: Number,
      default: null,
    },
    isPrivate: {
      type: Boolean,
      default: false,
    },
    tags: [String],
    status: {
      type: String,
      enum: ["upcoming", "cancelled", "completed"],
      default: "upcoming",
    },
  },
  {
    timestamps: true,
  },
);

// Virtual for attendee count
meetupSchema.virtual("attendeeCount").get(function () {
  return this.rsvps.filter((rsvp) => rsvp.status === "going").length;
});

// Method to check if user can RSVP
meetupSchema.methods.canRSVP = function (userId) {
  return (
    this.creator.equals(userId) ||
    this.invitedUsers.some((id) => id.equals(userId))
  );
};

// Method to get user's RSVP status
meetupSchema.methods.getUserRSVP = function (userId) {
  const rsvp = this.rsvps.find((r) => r.user.equals(userId));
  return rsvp ? rsvp.status : null;
};

module.exports = mongoose.model("Meetup", meetupSchema);
