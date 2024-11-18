import { Document } from "mongoose";

export interface IIncome extends Document {
  userId: string;
  title: string;
  amount: number;
  description: string;
  date: Date;
}
