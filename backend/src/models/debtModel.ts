import mongoose, { Schema } from "mongoose";
import { IDebt } from "../types";

const debtSchema: Schema = new Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: true },
    amount: { type: Number, required: true },
    description: { type: String },
    date: { type: Date, default: Date.now },
    paymentReminder: {
      enabled: { type: Boolean, default: false },
      amountToPay: { type: Number },
      reminderFrequency: { type: String, enum: ["daily", "weekly", "monthly"], default: "monthly" },
      reminderDate: { type: Date },
    },
  },
  { timestamps: true }
);

export const Debt = mongoose.model<IDebt>("Debt", debtSchema);
