import mongoose, { Schema } from "mongoose";
import { INotification } from "../types";

const NotificationSchema = new Schema<INotification>(
  {
    message: { type: String, required: true },
    type: { type: String, required: true },
    metadata: { type: Schema.Types.Mixed },
    resourceId: { type: Schema.Types.ObjectId, ref: "Resource", required: false }, // Optional ObjectId reference
    userId: {
      type: Schema.Types.ObjectId, // Explicitly define ObjectId
      ref: "User", // Reference to the User model
      required: true,
    },
    status: { type: String, enum: ["unread", "read"], default: "unread" },
  },
  { timestamps: true }
);

export const Notification = mongoose.model<INotification>(
  "Notification",
  NotificationSchema
);
