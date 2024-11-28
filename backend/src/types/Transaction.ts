import { Types } from "mongoose";
import { Document } from "mongoose";

export interface ITransaction extends Document {
    userId: Types.ObjectId;
    type: "income" | "debt" | "expense" | "investment";
    title: string;
    amount: number;
    description?: string;
    originalId?: string;
    createdAt: Date;
  }