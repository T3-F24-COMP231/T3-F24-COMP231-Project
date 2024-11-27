import mongoose, { Schema, Document, Model } from "mongoose";

export interface IActivity extends Document {
  userId?: mongoose.Schema.Types.ObjectId;
  adminId?: mongoose.Schema.Types.ObjectId;
  action: string;
  entity?: string;
  entityId?: mongoose.Schema.Types.ObjectId;
  metadata?: Record<string, any>; 
  ipAddress?: string;
  userAgent?: string;
  timestamp: Date;
}

const ActivitySchema = new Schema<IActivity>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User" },
    adminId: { type: Schema.Types.ObjectId, ref: "Admin" },
    action: { type: String, required: true },
    entity: { type: String },
    entityId: { type: Schema.Types.ObjectId },
    metadata: { type: Schema.Types.Mixed },
    ipAddress: { type: String },
    userAgent: { type: String },
    timestamp: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export const Activity: Model<IActivity> = mongoose.model("Activity", ActivitySchema);
