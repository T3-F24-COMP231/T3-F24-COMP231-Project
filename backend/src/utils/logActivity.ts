import { Activity } from "../models";
import { LogActivityInput } from "../types";

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
    const newActivity = new Activity({
      event,
      description,
      actionBy,
      metaData,
    });

    await newActivity.save();
    console.log(`Activity logged: ${event}`);
  } catch (error) {
    console.error("Failed to log activity:", error);
  }
};
