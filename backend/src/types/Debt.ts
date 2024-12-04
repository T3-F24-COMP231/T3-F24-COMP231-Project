import { Document } from "mongoose";

export interface IDebt extends Document {
  userId: string;
  title: string;
  amount: number;
  description: string;
  date: Date;
  paymentReminder: {
    enabled: boolean;
    amountToPay: number;
    reminderFrequency: "daily" | "weekly" | "monthly";
    reminderDate: Date;
  };
}
