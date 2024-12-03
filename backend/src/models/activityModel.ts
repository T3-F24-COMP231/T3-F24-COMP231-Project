const mongoose = require("mongoose");

const activitySchema = new mongoose.Schema(
  {
    event: {
      type: String,
      required: true,
      enum: [
        // User-related events
        "USER_SIGNUP",
        "USER_SIGNUP_FAILED",
        "USER_SIGNUP_ERROR",
        "USER_LOGIN",
        "USER_LOGIN_FAILED",
        "USER_LOGIN_ERROR",
        "USER_LOGOUT",
        "USER_LOGOUT_ERROR",
        "USER_DELETE_ACCOUNT",
      ],
    },
    description: {
      type: String,
      required: true,
    },
    actionBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false, // Optional for system-wide activities
    },
    metaData: {
      type: Object,
      default: {},
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

export const Activity = mongoose.model("Activity", activitySchema);
