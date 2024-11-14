import mongoose, { Schema, Document } from "mongoose";
import { IUser } from "../types";

const userSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: {
      type: String,
      required: true,
      enum: ["Finance Tracker", "Debt Repayer", "Financial Expert", "Investor", "Administrator"],
      default: "Finance Tracker",
    },
    assignedExpert: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    assignedClients: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  },
  { timestamps: true }
);

const User = mongoose.model<IUser>("User", userSchema);
export default User;
