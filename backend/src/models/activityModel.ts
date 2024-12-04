import mongoose, { Schema, Document, Types } from "mongoose";

export interface IActivity extends Document {
  event: string;
  description: string;
  actionBy: Types.ObjectId | null;
  metaData: Record<string, any>;
  timestamp: Date;
}

const activitySchema = new Schema<IActivity>(
  {
    event: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    actionBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: false,
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

export const Activity = mongoose.model<IActivity>("Activity", activitySchema);
