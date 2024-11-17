import { Document } from "mongoose";

export interface IInvestment extends Document {
  userId: string;
  title: string;
  amount: number;
  description: string;
}
