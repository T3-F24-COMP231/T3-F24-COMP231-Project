import { Request, Response } from "express";
import { Notification } from "../models";
import { ExpressHandler } from "../types";
import { sendError, sendSuccess } from "../utils";

export const getNotifications = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    // const notifications = await Notification.find({ userId });
    const notifications = await Notification.find({ userId }).sort({
      createdAt: -1,
    });
    if (!notifications.length) {
      sendSuccess(res, null, "No notifications found");
    }
    sendSuccess(res, notifications);
  } catch (error) {
    sendError(res, "Error fetching notifications", 500);
  }
};

export const markAsRead = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { userId, id } = req.params;

    if (!userId || !id) {
      sendError(res, "User ID and Notification ID are required", 400);
      return;
    }

    const notification = await Notification.findOneAndUpdate(
      { _id: id, userId },
      { status: "read" },
      { new: true }
    );

    if (!notification) {
      sendError(res, "Notification not found for this user", 404);
      return;
    }

    sendSuccess(res, notification, "Notification marked as read");
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error occurred";
    sendError(res, `Error updating notification status: ${errorMessage}`, 500);
  }
};
