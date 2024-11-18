import mongoose from "mongoose";

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role: "Finance Tracker" | "Debt Repayer" | "Financial Expert" | "Investor" | "Administrator";
  assignedExpert?: mongoose.Types.ObjectId;
  assignedClients?: mongoose.Types.ObjectId[];
}
