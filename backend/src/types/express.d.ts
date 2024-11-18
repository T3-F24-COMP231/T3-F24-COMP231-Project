import { Request } from "express";

declare module "express" {
  export interface Request {
    user?: {
      id: string;
      role: string;
    };
  }
}

export interface DecodedToken {
  userId: string;
  role: string;
}