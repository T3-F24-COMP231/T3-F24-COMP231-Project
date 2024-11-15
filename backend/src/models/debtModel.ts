import mongoose, { Schema } from "mongoose";
import { IDebt } from "../types";

const debtSchema: Schema = new Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: true },
    amount: { type: Number, required: true },
    description: { type: String },
  },
  { timestamps: true }
);

export const Debt = mongoose.model<IDebt>("Debt", debtSchema);
