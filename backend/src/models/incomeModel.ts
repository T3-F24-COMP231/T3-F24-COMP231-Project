import mongoose, { Schema, Document } from "mongoose";

interface IIncome extends Document {
  title: string;
  amount: number;
  description: string;
  date: Date;
}

const incomeSchema = new Schema({
  title: { type: String, require: true },
  amount: { type: Number, required: true },
  description: { type: String, required: true },
  date: { type: Date, default: Date.now },
});

export const Income = mongoose.model<IIncome>("Income", incomeSchema);
