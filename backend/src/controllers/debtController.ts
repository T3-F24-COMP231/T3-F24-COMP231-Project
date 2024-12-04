import { logActivity, sendError, sendSuccess } from "../utils";
import { Debt, Notification, Transaction } from "../models";
import { ExpressHandler } from "../types";

export const addDebt: ExpressHandler = async (req, res) => {
  try {
    const { title, amount, description, paymentReminder } = req.body;
    const { userId } = req.params;

    if (!title || !amount) {
      const errorMsg = "Title and amount are required";
      logActivity({
        event: "ADD_DEBT_FAILED",
        description: errorMsg,
        actionBy: req?.user?.id || "Unknown",
        metaData: { title, amount, userId },
      });
      return sendError(res, errorMsg, 400);
    }

    const debt = await Debt.create({
      userId,
      title,
      amount,
      description,
      paymentReminder,
    });

    // Log transaction
    await Transaction.create({
      userId,
      type: "debt",
      title,
      amount,
      description,
      originalId: debt._id,
    });

    // Send notification
    await Notification.create({
      userId,
      message: `New debt added: ${title} for $${amount}`,
      type: "debt",
      resourceId: debt._id,
    });

    // Log activity
    logActivity({
      event: "ADD_DEBT_SUCCESS",
      description: `Debt "${title}" added by ${req.user?.name}`,
      actionBy: req?.user?.id || "Unknown",
      metaData: { debtId: debt._id, amount },
    });

    sendSuccess(res, debt, "Debt information successfully added");
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
    logActivity({
      event: "ADD_DEBT_ERROR",
      description: `Error adding debt: ${errorMessage}`,
      actionBy: req?.user?.id || "Unknown",
      metaData: { userId: req.params.userId, error: errorMessage },
    });
    sendError(res, `Failed to add debt information: ${errorMessage}`, 500);
  }
};

export const updateDebt: ExpressHandler = async (req, res) => {
  try {
    const { id, userId } = req.params;
    const { paymentReminder, ...otherUpdates } = req.body;

    if (!id || !userId) {
      const errorMsg = "Debt ID and User ID are required";
      logActivity({
        event: "UPDATE_DEBT_FAILED",
        description: errorMsg,
        actionBy: req?.user?.id || "Unknown",
        metaData: { id, userId, updates: req.body },
      });
      return sendError(res, errorMsg, 400);
    }

    const updatedDebt = await Debt.findOneAndUpdate(
      { _id: id, userId },
      { ...otherUpdates, paymentReminder },
      { new: true }
    );

    if (!updatedDebt) {
      const errorMsg = "Debt not found for this user";
      logActivity({
        event: "UPDATE_DEBT_FAILED",
        description: errorMsg,
        actionBy: req?.user?.id || "Unknown",
        metaData: { id, userId },
      });
      return sendError(res, errorMsg, 404);
    }

    // Update associated transaction
    await Transaction.findOneAndUpdate(
      { originalId: updatedDebt._id, userId },
      {
        title: updatedDebt.title,
        amount: updatedDebt.amount,
        description: updatedDebt.description,
      }
    );

    // Send notification
    await Notification.create({
      userId,
      message: `Debt updated: ${updatedDebt.title} with new amount $${updatedDebt.amount}`,
      type: "debt",
      resourceId: updatedDebt._id,
    });

    // Log activity
    logActivity({
      event: "UPDATE_DEBT_SUCCESS",
      description: `Debt "${updatedDebt.title}" updated by ${req.user?.name}`,
      actionBy: req?.user?.id || "Unknown",
      metaData: { debtId: updatedDebt._id, newAmount: updatedDebt.amount },
    });

    sendSuccess(res, updatedDebt, "Debt information successfully updated");
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
    logActivity({
      event: "UPDATE_DEBT_ERROR",
      description: `Error updating debt: ${errorMessage}`,
      actionBy: req?.user?.id || "Unknown",
      metaData: { debtId: req.params.id, error: errorMessage },
    });
    sendError(res, `Failed to update debt information: ${errorMessage}`, 500);
  }
};

export const deleteDebt: ExpressHandler = async (req, res) => {
  try {
    const { id, userId } = req.params;

    if (!id || !userId) {
      const errorMsg = "Debt ID and User ID are required";
      logActivity({
        event: "DELETE_DEBT_FAILED",
        description: errorMsg,
        actionBy: req?.user?.id || "Unknown",
        metaData: { id, userId },
      });
      return sendError(res, errorMsg, 400);
    }

    const deletedDebt = await Debt.findOneAndDelete({ _id: id, userId });

    if (!deletedDebt) {
      const errorMsg = "Debt not found for this user";
      logActivity({
        event: "DELETE_DEBT_FAILED",
        description: errorMsg,
        actionBy: req?.user?.id || "Unknown",
        metaData: { id, userId },
      });
      return sendError(res, errorMsg, 404);
    }

    // Log transaction update (mark it as deleted)
    await Transaction.findOneAndUpdate(
      { originalId: deletedDebt._id, userId },
      { deleted: true }
    );

    // Send notification
    await Notification.create({
      userId,
      message: `Debt deleted: ${deletedDebt.title} for $${deletedDebt.amount}`,
      type: "debt",
      resourceId: deletedDebt._id,
    });

    // Log activity
    logActivity({
      event: "DELETE_DEBT_SUCCESS",
      description: `Debt "${deletedDebt.title}" deleted by ${req.user?.name}`,
      actionBy: req?.user?.id || "Unknown",
      metaData: { debtId: deletedDebt._id },
    });

    sendSuccess(res, deletedDebt, "Debt successfully deleted");
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
    logActivity({
      event: "DELETE_DEBT_ERROR",
      description: `Error deleting debt: ${errorMessage}`,
      actionBy: req?.user?.id || "Unknown",
      metaData: { debtId: req.params.id, error: errorMessage },
    });
    sendError(res, `Failed to delete debt: ${errorMessage}`, 500);
  }
};
export const getDebts: ExpressHandler = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      logActivity({
        event: "GET_DEBTS_FAILED",
        description: "User ID is required",
        actionBy: req?.user?.id || "Unknown",
      });
      return sendError(res, "User ID is required", 400);
    }

    const debts = await Debt.find({ userId });

    if (!debts.length) {
      logActivity({
        event: "GET_DEBTS_SUCCESS",
        description: "No debts found for the user",
        actionBy: req?.user?.id || "Unknown",
        metaData: { userId },
      });
      return sendSuccess(res, [], "No debts found for this user");
    }

    logActivity({
      event: "GET_DEBTS_SUCCESS",
      description: "Debts fetched successfully",
      actionBy: req?.user?.id || "Unknown",
      metaData: { userId, count: debts.length },
    });

    sendSuccess(res, debts, "Debts fetched successfully");
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error occurred";
    logActivity({
      event: "GET_DEBTS_ERROR",
      description: `Failed to fetch debts: ${errorMessage}`,
      actionBy: req?.user?.id || "Unknown",
      metaData: { userId: req.params.userId },
    });
    sendError(res, `Failed to fetch debts: ${errorMessage}`, 500);
  }
};
