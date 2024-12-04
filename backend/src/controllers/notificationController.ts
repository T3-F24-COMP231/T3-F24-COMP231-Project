import { Request, Response } from "express";
import { Notification } from "../models";
import { ExpressHandler } from "../types";
import { logActivity, sendError, sendSuccess } from "../utils";

export const getNotifications: ExpressHandler = async (req, res) => {
  try {
    const { userId } = req.params;

    const notifications = await Notification.find({ userId }).sort({
      createdAt: -1,
    });

    if (!notifications.length) {
      res.status(204).json({ message: "No notifications found" });
      return;
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

export const getUnreadNotificationCount = async (
  req: Request,
  res: Response
) => {
  const { userId } = req.params;

  try {
    const count = await Notification.countDocuments({ userId, status: "unread" });

    sendSuccess(
      res,
      { unreadCount: count },
      "Unread notification count fetched successfully"
    );
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error occurred";
    sendError(
      res,
      `Failed to fetch unread notification count: ${errorMessage}`,
      500
    );
  }
};

// Mark all notifications as read
export const markAllNotificationsAsRead = async (
  req: Request,
  res: Response
) => {
  const { userId } = req.params;

  try {
    await Notification.updateMany({ userId, status: "unread" }, { status: "read" });

    sendSuccess(res, null, "All notifications marked as read successfully");
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error occurred";
    sendError(
      res,
      `Failed to mark all notifications as read: ${errorMessage}`,
      500
    );
  }
};
