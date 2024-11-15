import mongoose, { Schema } from "mongoose";
import { ICategory, IUserCategoryBlacklist } from "../types";

const categorySchema = new Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    name: { type: String, required: true, unique: true },
    isDefault: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const Category = mongoose.model<ICategory>("Category", categorySchema);

const userCategoryBlacklistSchema = new Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    categoryName: { type: String, required: true },
  },
  { timestamps: true }
);

export const UserCategoryBlacklist = mongoose.model<IUserCategoryBlacklist>(
  "UserCategoryBlacklist",
  userCategoryBlacklistSchema
);
