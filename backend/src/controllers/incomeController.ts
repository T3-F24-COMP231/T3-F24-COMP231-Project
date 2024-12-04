import { sendError, sendSuccess, logActivity } from "../utils";
import { Income, Notification, Transaction } from "../models";
import { ExpressHandler } from "../types";

export const addIncome: ExpressHandler = async (req, res) => {
  try {
    const { title, amount, description } = req.body;
    const { userId } = req.params;

    const income = await Income.create({ userId, title, amount, description });

    // Log transaction
    await Transaction.create({
      userId,
      type: "income",
      title,
      amount,
      description,
      originalId: income._id,
    });

    // Send notification
    await Notification.create({
      userId,
      message: `New income added: ${title} for $${amount}`,
      type: "income",
      resourceId: income._id,
    });

    logActivity({
      event: "ADD_INCOME_SUCCESS",
      description: "New income successfully added",
      actionBy: req?.user?.id || "Unknown",
      metaData: { userId, income },
    });

    sendSuccess(res, income, "Income successfully added");
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error occurred";

    logActivity({
      event: "ADD_INCOME_ERROR",
      description: `Failed to add income: ${errorMessage}`,
      actionBy: req?.user?.id || "Unknown",
      metaData: { userId: req.params.userId, body: req.body },
    });

    sendError(res, `Failed to add income: ${errorMessage}`, 500);
  }
};

export const getIncomes: ExpressHandler = async (req, res) => {
  try {
    const { userId } = req.params;
    const incomes = await Income.find({ userId });

    if (!incomes.length) {
      logActivity({
        event: "GET_INCOMES_SUCCESS",
        description: "No incomes found for this user",
        actionBy: req?.user?.id || "Unknown",
        metaData: { userId },
      });
      return sendSuccess(res, [], "No incomes found for this user");
    }

    logActivity({
      event: "GET_INCOMES_SUCCESS",
      description: "Fetched incomes successfully",
      actionBy: req?.user?.id || "Unknown",
      metaData: { userId, count: incomes.length },
    });

    sendSuccess(res, incomes, "Incomes fetched successfully");
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error occurred";

    logActivity({
      event: "GET_INCOMES_ERROR",
      description: `Failed to fetch incomes: ${errorMessage}`,
      actionBy: req?.user?.id || "Unknown",
      metaData: { userId: req.params.userId },
    });

    sendError(res, `Failed to fetch incomes: ${errorMessage}`, 500);
  }
};

export const updateIncome: ExpressHandler = async (req, res) => {
  try {
    const { id, userId } = req.params;

    const updatedIncome = await Income.findOneAndUpdate(
      { _id: id, userId },
      req.body,
      { new: true }
    );

    if (!updatedIncome) {
      logActivity({
        event: "UPDATE_INCOME_FAILED",
        description: "Income not found for this user",
        actionBy: req?.user?.id || "Unknown",
        metaData: { id, userId, updates: req.body },
      });
      return sendError(res, "Income not found for this user", 404);
    }

    // Update associated transaction
    await Transaction.findOneAndUpdate(
      { originalId: updatedIncome._id, userId },
      {
        title: updatedIncome.title,
        amount: updatedIncome.amount,
        description: updatedIncome.description,
      }
    );

    // Send notification
    await Notification.create({
      userId,
      message: `Income updated: ${updatedIncome.title} with new amount $${updatedIncome.amount}`,
      type: "income",
      resourceId: updatedIncome._id,
    });

    logActivity({
      event: "UPDATE_INCOME_SUCCESS",
      description: "Income updated successfully",
      actionBy: req?.user?.id || "Unknown",
      metaData: { userId, updatedIncome },
    });

    sendSuccess(res, updatedIncome, "Income successfully updated");
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error occurred";

    logActivity({
      event: "UPDATE_INCOME_ERROR",
      description: `Failed to update income: ${errorMessage}`,
      actionBy: req?.user?.id || "Unknown",
      metaData: { id: req.params.id, userId: req.params.userId, updates: req.body },
    });

    sendError(res, `Failed to update income: ${errorMessage}`, 500);
  }
};

export const deleteIncome: ExpressHandler = async (req, res) => {
  try {
    const { id, userId } = req.params;

    const deletedIncome = await Income.findOneAndDelete({
      _id: id,
      userId,
    });

    if (!deletedIncome) {
      logActivity({
        event: "DELETE_INCOME_FAILED",
        description: "Income not found for this user",
        actionBy: req?.user?.id || "Unknown",
        metaData: { id, userId },
      });
      return sendError(res, "Income not found for this user", 404);
    }

    // Mark transaction as deleted
    await Transaction.findOneAndUpdate(
      { originalId: deletedIncome._id, userId },
      { deleted: true }
    );

    // Send notification
    await Notification.create({
      userId,
      message: `Income deleted: ${deletedIncome.title} for $${deletedIncome.amount}`,
      type: "income",
      resourceId: deletedIncome._id,
    });

    logActivity({
      event: "DELETE_INCOME_SUCCESS",
      description: "Income deleted successfully",
      actionBy: req?.user?.id || "Unknown",
      metaData: { userId, deletedIncome },
    });

    sendSuccess(res, deletedIncome, "Income successfully deleted");
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error occurred";

    logActivity({
      event: "DELETE_INCOME_ERROR",
      description: `Failed to delete income: ${errorMessage}`,
      actionBy: req?.user?.id || "Unknown",
      metaData: { id: req.params.id, userId: req.params.userId },
    });

    sendError(res, `Failed to delete income: ${errorMessage}`, 500);
  }
};
