import { Document } from "mongoose";

export interface ICategory extends Document {
  userId?: string;
  name: string;
  isDefault: boolean;
}

export interface IUserCategoryBlacklist extends Document {
  userId: string;
  categoryName: string;
}