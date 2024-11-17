import mongoose, { Schema } from "mongoose";
import { IInvestment } from "../types";

const investmentSchema: Schema = new Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: true },
    amount: { type: Number, required: true },
    description: { type: String },
  },
  { timestamps: true }
);

export const Investment = mongoose.model<IInvestment>("Investment", investmentSchema);
