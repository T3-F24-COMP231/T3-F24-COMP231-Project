import mongoose, { Schema, Document } from "mongoose";

interface IExpense extends Document {
  title: string;
  amount: number;
  description: string;
  category: string;
  date: Date;
}

const expenseSchema = new Schema({
  title: { type: String, require: true },
  amount: { type: Number, required: true },
  description: { type: String, required: true },
  category: { type: String, required: true },
  date: { type: Date, default: Date.now },
});

export const Expense = mongoose.model<IExpense>("Expense", expenseSchema);
