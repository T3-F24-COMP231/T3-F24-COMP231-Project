import mongoose, { Document } from "mongoose";

export interface IRole extends Document {
  name: string;
}
const RoleSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
  },
  { timestamps: true }
);

export const Role = mongoose.model<IRole>("Role", RoleSchema);
