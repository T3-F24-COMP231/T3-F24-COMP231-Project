import { Request } from "express";

declare global {
  namespace Express {
    export interface Request {
      user?: IUser;
      admin?: IAdmin;
    }
  }
}
export interface DecodedToken {
  userId: string;
  role: string;
}