import { sendError, sendSuccess, logActivity } from "../utils";
import { Saving, Notification, Transaction } from "../models";
import { ExpressHandler } from "../types";

// Add new savings
export const addSavings: ExpressHandler = async (req, res) => {
  try {
    const { purpose, goalAmount, savedAmount } = req.body;
    const { userId } = req.params;

    if (!purpose || !goalAmount) {
      logActivity({
        event: "ADD_SAVINGS_FAILED",
        description: "Purpose and goal amount are required",
        actionBy: req?.user?.id || "Unknown",
        metaData: { userId, body: req.body },
      });

      return sendError(res, "Purpose and goal amount are required", 400);
    }

    const savings = await Saving.create({
      userId,
      purpose,
      goalAmount,
      savedAmount: savedAmount || 0,
    });

    try {
      await Transaction.create({
        userId,
        type: "savings",
        title: purpose,
        amount: savedAmount || 0,
        originalId: savings._id,
      });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error occurred";
      logActivity({
        event: "ADD_TRANSACTION_ERROR",
        description: `Failed to log transaction: ${errorMessage}`,
        actionBy: req?.user?.id || "Unknown",
        metaData: { userId, savingsId: savings._id },
      });
    }

    try {
      await Notification.create({
        userId,
        message: `New savings created: "${purpose}" with a goal of $${goalAmount}`,
        type: "savings",
        resourceId: savings._id,
      });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error occurred";
      logActivity({
        event: "ADD_NOTIFICATION_ERROR",
        description: `Failed to send notification: ${errorMessage}`,
        actionBy: req?.user?.id || "Unknown",
        metaData: { userId, savingsId: savings._id },
      });
    }

    logActivity({
      event: "ADD_SAVINGS_SUCCESS",
      description: "Savings successfully added",
      actionBy: req?.user?.id || "Unknown",
      metaData: { userId, savings },
    });

    sendSuccess(res, savings, "Savings successfully added");
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error occurred";
    const errorStack =
      error instanceof Error ? error.stack : "Unknown error occurred";
    logActivity({
      event: "ADD_SAVINGS_ERROR",

      description: `Failed to add savings: ${errorStack || errorMessage}`,
      actionBy: req?.user?.id || "Unknown",
      metaData: { userId: req.params.userId, body: req.body },
    });

    sendError(res, `Failed to add savings: ${errorMessage}`, 500);
  }
};

// Fetch all savings
export const getSavings: ExpressHandler = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return sendError(res, "User ID is required", 400);
    }

    const savings = await Saving.find({ userId });

    if (!savings.length) {
      logActivity({
        event: "GET_SAVINGS_SUCCESS",
        description: "No savings found for this user",
        actionBy: req?.user?.id || "Unknown",
        metaData: { userId },
      });

      return sendSuccess(res, [], "No savings found for this user");
    }

    logActivity({
      event: "GET_SAVINGS_SUCCESS",
      description: "Savings fetched successfully",
      actionBy: req?.user?.id || "Unknown",
      metaData: { userId, count: savings.length },
    });

    sendSuccess(res, savings, "Savings fetched successfully");
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error occurred";

    logActivity({
      event: "GET_SAVINGS_ERROR",
      description: `Failed to fetch savings: ${errorMessage}`,
      actionBy: req?.user?.id || "Unknown",
      metaData: { userId: req.params.userId },
    });

    sendError(res, `Failed to fetch savings: ${errorMessage}`, 500);
  }
};

// Update savings
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
      logActivity({
        event: "UPDATE_SAVINGS_FAILED",
        description: "Savings not found",
        actionBy: req?.user?.id || "Unknown",
        metaData: { userId, id, updates },
      });

      return sendError(res, "Savings not found for this user", 404);
    }

    await Transaction.findOneAndUpdate(
      { originalId: updatedSavings._id, userId },
      {
        title: updatedSavings.purpose,
        amount: updatedSavings.savedAmount,
      }
    );

    await Notification.create({
      userId,
      message: `Savings updated: "${updatedSavings.purpose}" with a new goal of $${updatedSavings.goalAmount}`,
      type: "savings",
      resourceId: updatedSavings._id,
    });

    logActivity({
      event: "UPDATE_SAVINGS_SUCCESS",
      description: "Savings successfully updated",
      actionBy: req?.user?.id || "Unknown",
      metaData: { userId, updatedSavings },
    });

    sendSuccess(res, updatedSavings, "Savings successfully updated");
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error occurred";

    logActivity({
      event: "UPDATE_SAVINGS_ERROR",
      description: `Failed to update savings: ${errorMessage}`,
      actionBy: req?.user?.id || "Unknown",
      metaData: {
        userId: req.params.userId,
        id: req.params.id,
        updates: req.body,
      },
    });

    sendError(res, `Failed to update savings: ${errorMessage}`, 500);
  }
};

// Delete savings
export const deleteSavings: ExpressHandler = async (req, res) => {
  try {
    const { id, userId } = req.params;

    if (!id || !userId) {
      return sendError(res, "Savings ID and User ID are required", 400);
    }

    const deletedSavings = await Saving.findOneAndDelete({ _id: id, userId });

    if (!deletedSavings) {
      logActivity({
        event: "DELETE_SAVINGS_FAILED",
        description: "Savings not found",
        actionBy: req?.user?.id || "Unknown",
        metaData: { userId, id },
      });

      return sendError(res, "Savings not found for this user", 404);
    }

    await Transaction.findOneAndUpdate(
      { originalId: deletedSavings._id, userId },
      { deleted: true }
    );

    await Notification.create({
      userId,
      message: `Savings deleted: "${deletedSavings.purpose}"`,
      type: "savings",
      resourceId: deletedSavings._id,
    });

    logActivity({
      event: "DELETE_SAVINGS_SUCCESS",
      description: "Savings successfully deleted",
      actionBy: req?.user?.id || "Unknown",
      metaData: { userId, deletedSavings },
    });

    sendSuccess(res, deletedSavings, "Savings successfully deleted");
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error occurred";

    logActivity({
      event: "DELETE_SAVINGS_ERROR",
      description: `Failed to delete savings: ${errorMessage}`,
      actionBy: req?.user?.id || "Unknown",
      metaData: { userId: req.params.userId, id: req.params.id },
    });

    sendError(res, `Failed to delete savings: ${errorMessage}`, 500);
  }
};
