import mongoose, { Schema } from "mongoose";
import { IRepayment } from "../types";

const repaymentSchema: Schema = new Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: true },
    amount: { type: Number, required: true },
    description: { type: String },
  },
  { timestamps: true }
);

export const Repayment = mongoose.model<IRepayment>("Repayment", repaymentSchema);
