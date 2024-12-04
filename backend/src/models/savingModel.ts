import mongoose, { Schema, Document } from "mongoose";

// Interface for the Saving document
export interface ISaving extends Document {
  userId: mongoose.Types.ObjectId;
  purpose: string;
  goalAmount: number;
  savedAmount: number;
  createdAt: Date;
  updatedAt: Date;
}

// Define the schema
const SavingSchema: Schema = new Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    purpose: {
      type: String,
      required: true,
      trim: true,
    },
    goalAmount: {
      type: Number,
      required: true,
      min: [0, "Goal amount must be greater than or equal to 0"],
    },
    savedAmount: {
      type: Number,
      required: true,
      min: [0, "Saved amount must be greater than or equal to 0"],
    },
  },
  {
    timestamps: true, // Automatically adds `createdAt` and `updatedAt` fields
  }
);

// Create and export the model
export const Saving = mongoose.model<ISaving>("Saving", SavingSchema);
