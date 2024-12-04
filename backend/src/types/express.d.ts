import { Request } from "express";

declare global {
  namespace Express {
    export interface Request {
      user?: {
        id: string;
        role: string;
        name: string;
      };
    }
  }
}
export interface DecodedToken {
  userId: string;
  role: string;
}