import { sendError, sendSuccess } from "../utils";
import { Saving, Notification, Transaction } from "../models";
import { ExpressHandler } from "../types";

export const addSavings: ExpressHandler = async (req, res) => {
  try {
    const { purpose, goalAmount, savedAmount } = req.body;
    const { userId } = req.params;

    if (!purpose || !goalAmount) {
      return sendError(res, "Purpose and goal amount are required", 400);
    }

    // Create saving
    let savings;
    try {
      savings = await Saving.create({
        userId,
        purpose,
        goalAmount,
        savedAmount: savedAmount || 0,
      });
    } catch (error) {
      console.error("Error creating savings:", error);
      return sendError(res, "Failed to create savings", 500);
    }

    // Log transaction
    try {
      await Transaction.create({
        userId,
        type: "savings",
        title: purpose,
        amount: savedAmount || 0,
        originalId: savings._id,
      });
    } catch (error) {
      console.error("Error logging transaction:", error);
    }

    // Send notification
    try {
      await Notification.create({
        userId,
        message: `New savings created: "${purpose}" with a goal of $${goalAmount}`,
        type: "savings",
        resourceId: savings._id,
      });
    } catch (error) {
      console.error("Error sending notification:", error);
    }

    // Send success response
    sendSuccess(res, savings, "Savings successfully added");
  } catch (error) {
    console.error("Unexpected error in addSavings handler:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error occurred";
    sendError(res, `Failed to add savings: ${errorMessage}`, 500);
  }
};

export const getSavings: ExpressHandler = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return sendError(res, "User ID is required", 400);
    }

    const savings = await Saving.find({ userId });

    if (!savings.length) {
      return sendSuccess(res, [], "No savings found for this user");
    }

    sendSuccess(res, savings, "Savings fetched successfully");
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error occurred";
    sendError(res, `Failed to fetch savings: ${errorMessage}`, 500);
  }
};

export const updateSavings: ExpressHandler = async (req, res) => {
  try {
    const { id, userId } = req.params;
    const updates = req.body;

    if (!id || !userId) {
      return sendError(res, "Savings ID and User ID are required", 400);
    }

    const updatedSavings = await Saving.findOneAndUpdate(
      { _id: id, userId },
      updates,
      { new: true }
    );

    if (!updatedSavings) {
      return sendError(res, "Savings not found for this user", 404);
    }

    // Update associated transaction
    await Transaction.findOneAndUpdate(
      { originalId: updatedSavings._id, userId },
      {
        title: updatedSavings.purpose,
        amount: updatedSavings.savedAmount,
      }
    );

    // Send notification
    await Notification.create({
      userId,
      message: `Savings updated: "${updatedSavings.purpose}" with a new goal of $${updatedSavings.goalAmount}`,
      type: "savings",
      resourceId: updatedSavings._id,
    });

    sendSuccess(res, updatedSavings, "Savings successfully updated");
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error occurred";
    sendError(res, `Failed to update savings: ${errorMessage}`, 500);
  }
};

export const deleteSavings: ExpressHandler = async (req, res) => {
  try {
    const { id, userId } = req.params;

    if (!id || !userId) {
      return sendError(res, "Savings ID and User ID are required", 400);
    }

    const deletedSavings = await Saving.findOneAndDelete({ _id: id, userId });

    if (!deletedSavings) {
      return sendError(res, "Savings not found for this user", 404);
    }

    // Log transaction update (mark it as deleted)
    await Transaction.findOneAndUpdate(
      { originalId: deletedSavings._id, userId },
      { deleted: true }
    );

    // Send notification
    await Notification.create({
      userId,
      message: `Savings deleted: "${deletedSavings.purpose}" with a saved amount of $${deletedSavings.savedAmount}`,
      type: "savings",
      resourceId: deletedSavings._id,
    });

    sendSuccess(res, deletedSavings, "Savings successfully deleted");
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error occurred";
    sendError(res, `Failed to delete savings: ${errorMessage}`, 500);
  }
};
