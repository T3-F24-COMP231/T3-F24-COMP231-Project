import { Activity } from "../models";
import { LogActivityInput } from "../types";
import User from "../models/userModel";
import { toObjectIdOrNull } from "./toObjectIdOrNull";

/**
 * Logs an activity to the Activity collection.
 *
 * @param {LogActivityInput} activityData - Details of the activity to log.
 * @returns {Promise<void>} A promise that resolves when the activity is logged.
 */
export const logActivity = async (
  activityData: LogActivityInput
): Promise<void> => {
  const { event, description, actionBy, metaData = {} } = activityData;

  try {
    const userId = toObjectIdOrNull(actionBy); // Ensure actionBy is valid or null
    const user = userId ? await User.findById(userId).select("name") : null;

    const newActivity = new Activity({
      event,
      description,
      actionBy: userId,
      metaData: {
        ...metaData,
        userName: user?.name || "Unknown User",
      },
    });

    await newActivity.save();
    console.log(`Activity logged: ${event}`);
  } catch (error) {
    console.error("Failed to log activity:", error);
  }
};
