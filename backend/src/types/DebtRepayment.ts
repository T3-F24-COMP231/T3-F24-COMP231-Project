import { Document } from "mongoose";

export interface IRepayment extends Document {
  userId: string;
  title: string;
  amount: number;
  description: string;
}
