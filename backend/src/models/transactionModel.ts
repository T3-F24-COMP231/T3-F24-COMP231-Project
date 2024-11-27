import mongoose, { Schema, Document, Types } from "mongoose";
import { ITransaction } from "../types";

const TransactionSchema = new Schema<ITransaction>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    type: {
      type: String,
      enum: ["income", "debt", "expense", "investment"],
      required: true,
    },
    title: { type: String, required: true },
    amount: { type: Number, required: true },
    description: { type: String },
    originalId: { type: Schema.Types.ObjectId },
  },
  { timestamps: true }
);

export const Transaction = mongoose.model<ITransaction>(
  "Transaction",
  TransactionSchema
);
