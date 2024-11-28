import { Document } from "mongoose";

export interface IInvestment extends Document {
  _id: string;
  userId: string;
  title: string;
  amount: number;
  description: string;
  category: string;
  returnPercentage: number;
  date: Date;
}
