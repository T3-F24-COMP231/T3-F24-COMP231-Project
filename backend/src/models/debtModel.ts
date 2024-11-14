import mongoose, { Schema, Document } from "mongoose";

interface IDebt extends Document {
  title: string;
  amount: number;
  description: string;
  date: Date;
}

const debtSchema = new Schema({
  title: { type: String, require: true },
  amount: { type: Number, required: true },
  description: { type: String, required: true },
  date: { type: Date, default: Date.now },
});

export const Debt = mongoose.model<IDebt>("Debt", debtSchema);
