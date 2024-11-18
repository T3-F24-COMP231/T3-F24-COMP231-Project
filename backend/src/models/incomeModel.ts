import mongoose, { Schema } from "mongoose";
import { IIncome } from "../types";

const incomeSchema = new Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: true },
    amount: { type: Number, required: true },
    description: { type: String, required: true },
    date: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export const Income = mongoose.model<IIncome>("Income", incomeSchema);
