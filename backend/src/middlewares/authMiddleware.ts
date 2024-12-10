import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import User from "../models/userModel";
import { DecodedToken } from "../types";
import { sendError } from "../utils";
require('dotenv').config();

export const protect = async (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return sendError(res,"Not authorized, no token", 401);
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "") as DecodedToken;
    const user = await User.findById(decoded.userId).select("-password");

    if (!user) {
      return sendError(res, "User not found", 404);
    }

    req.user = { id: user._id.toString(), name: user.name, role: user.role };
    next();
  } catch (error) {
    sendError(res, "Not authorized, token failed", 401);
  }
};

export const adminOnly = (req: Request, res: Response, next: NextFunction) => {
  if (req.user?.role !== "Administrator") {
    return sendError(res,  "Access denied, admin only", 403);
  }
  next();
};
