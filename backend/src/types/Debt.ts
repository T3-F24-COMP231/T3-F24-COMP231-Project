import { Document } from "mongoose";

export interface IDebt extends Document {
  userId: string;
  title: string;
  amount: number;
  description: string;
}