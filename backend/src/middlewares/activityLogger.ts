import { Request, Response, NextFunction } from "express";
import { Activity } from "../models";

export const logActivity = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?._id;
    const adminId = req.admin?._id;
    const ipAddress = req.ip;
    const userAgent = req.headers["user-agent"];
    const { originalUrl: action } = req;

    console.log("Logging activity with details:", {
      userId,
      adminId,
      action,
      ipAddress,
      userAgent,
      metadata: { body: req.body, params: req.params },
    });

    const activity = await Activity.create({
      userId,
      adminId,
      action,
      ipAddress,
      userAgent,
      metadata: { body: req.body, params: req.params },
    });

    console.log("Activity successfully logged:", activity);
    next();
  } catch (error) {
    console.error("Failed to log activity:", error);
    next();
  }
};
