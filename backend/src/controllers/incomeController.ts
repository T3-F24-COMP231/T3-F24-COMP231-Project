import { sendError, sendSuccess } from "../utils";
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

    sendSuccess(res, income, "Income successfully added");
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error occurred";
    sendError(res, `Failed to add income: ${errorMessage}`, 500);
  }
};

export const getIncomes: ExpressHandler = async (req, res) => {
  try {
    const { userId } = req.params;
    const incomes = await Income.find({ userId });

    if (!incomes.length) {
      return sendSuccess(res, [], "No incomes found for this user");
    }

    sendSuccess(res, incomes, "Incomes fetched successfully");
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error occurred";
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

    sendSuccess(res, updatedIncome, "Income successfully updated");
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error occurred";
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

    sendSuccess(res, deletedIncome, "Income successfully deleted");
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error occurred";
    sendError(res, `Failed to delete income: ${errorMessage}`, 500);
  }
};
