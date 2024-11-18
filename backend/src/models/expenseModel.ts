import mongoose, { Schema } from "mongoose";
import { IExpense } from "../types";

const expenseSchema = new Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: true },
    amount: { type: Number, required: true },
    description: { type: String, required: true },
    category: { type: String, required: true },
    date: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export const Expense = mongoose.model<IExpense>("Expense", expenseSchema);
