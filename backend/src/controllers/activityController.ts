import { Activity } from "../models";
import { ExpressHandler } from "../types";
import { sendError, sendSuccess } from "../utils";

export const getAllActivities: ExpressHandler = async (req, res) => {
  try {
    const activities = await Activity.find().sort({ timestamp: -1 });

    if (!activities.length) {
      res.status(204).json({ message: "No activities found." });
      return;
    }
    sendSuccess(res, activities);
  } catch (error) {
    sendError(res, "Server error", 500);
  }
};

export const getActivitiesByEventType: ExpressHandler = async (req, res) => {
  const { eventType } = req.params;

  try {
    const activities = await Activity.find({ event: eventType })
      .populate("actionBy", "name email")
      .sort({ timestamp: -1 });

    sendSuccess(res, activities);
  } catch (error) {
    console.error("Error fetching activities by event type:", error);
    sendError(res, "Server error", 500);
  }
};
