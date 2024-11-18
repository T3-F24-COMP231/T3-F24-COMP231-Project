import { Document } from "mongoose";

export interface IExpense extends Document {
  userId: string;
  title: string;
  amount: number;
  description: string;
  category: string;
  date: Date;
}
