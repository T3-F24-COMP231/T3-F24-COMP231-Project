import { Types } from "mongoose";

export interface INotification {
  _id?: Types.ObjectId;
  message: string;
  type: string;
  metadata?: Record<string, any>;
  resourceId?: Types.ObjectId;
  userId: Types.ObjectId;
  status: "unread" | "read";
  createdAt?: Date;
  updatedAt?: Date;
}
