import { Types } from "mongoose";

export interface ActivityMetaData {
  ipAddress?: string;
  userAgent?: string;
  [key: string]: any;
}

export interface LogActivityInput {
  event: string;
  description: string;
  actionBy: Types.ObjectId | string | null;
  metaData?: ActivityMetaData;
}
