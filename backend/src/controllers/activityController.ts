import { Request, Response } from "express";
import { Activity } from "../models/activityModel";
import { sendSuccess, sendError } from "../utils";

// Get all activities (Admin only)
export const getActivities = async (req: Request, res: Response) => {
  try {
    const { userId, adminId, entity, action, startDate, endDate } = req.query;

    // Filter based on query parameters
    const filter: Record<string, any> = {};
    if (userId) filter.userId = userId;
    if (adminId) filter.adminId = adminId;
    if (entity) filter.entity = entity;
    if (action) filter.action = action;
    if (startDate && endDate) {
      filter.timestamp = {
        $gte: new Date(startDate as string),
        $lte: new Date(endDate as string),
      };
    }

    const activities = await Activity.find(filter)
      .sort({ timestamp: -1 })
      .populate("userId", "name email")
      .populate("adminId", "name email");

    sendSuccess(res, activities, "Activities fetched successfully");
  } catch (error) {
    sendError(res, "Failed to fetch activities", 500);
  }
};

// Add a new activity (for testing or manual logging)
export const addActivity = async (req: Request, res: Response) => {
  try {
    const { userId, adminId, action, entity, entityId, metadata, ipAddress, userAgent } = req.body;

    const activity = await Activity.create({
      userId,
      adminId,
      action,
      entity,
      entityId,
      metadata,
      ipAddress,
      userAgent,
    });

    sendSuccess(res, activity, "Activity logged successfully");
  } catch (error) {
    sendError(res, "Failed to log activity", 500);
  }
};
