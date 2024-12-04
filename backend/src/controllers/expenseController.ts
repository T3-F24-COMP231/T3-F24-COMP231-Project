import { Category, Expense, Notification, Transaction } from "../models";
import { ExpressHandler } from "../types";
import { sendError, sendSuccess, logActivity } from "../utils";

export const addExpense: ExpressHandler = async (req, res) => {
  try {
    const { title, amount, description, category } = req.body;
    const { userId } = req.params;

    if (!category) {
      logActivity({
        event: "ADD_EXPENSE_FAILED",
        description: "Category field is missing",
        actionBy: req?.user?.id || "Unknown",
        metaData: { userId, title, amount, description },
      });
      return sendError(res, "Category field is required", 400);
    }

    let existingCategory = await Category.findOne({ name: category });
    if (!existingCategory) {
      existingCategory = await Category.create({ name: category });
    }

    const expense = await Expense.create({
      userId,
      title,
      amount,
      description,
      category: existingCategory.name,
    });

    // Log transaction
    await Transaction.create({
      userId,
      type: "expense",
      title,
      amount,
      description,
      originalId: expense._id,
    });

    // Send notification
    await Notification.create({
      userId,
      message: `New expense added: ${title} for $${amount}`,
      type: "expense",
      resourceId: expense._id,
    });

    logActivity({
      event: "ADD_EXPENSE_SUCCESS",
      description: "New expense added successfully",
      actionBy: req?.user?.id || "Unknown",
      metaData: { userId, expense },
    });

    sendSuccess(res, expense, "Expense successfully added");
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error occurred";

    logActivity({
      event: "ADD_EXPENSE_ERROR",
      description: `Failed to add expense: ${errorMessage}`,
      actionBy: req?.user?.id || "Unknown",
      metaData: { userId: req.params.userId, body: req.body },
    });

    sendError(res, `Failed to add expense: ${errorMessage}`, 500);
  }
};

export const getExpenses: ExpressHandler = async (req, res) => {
  try {
    const { userId } = req.params;
    const expenses = await Expense.find({ userId });

    if (!expenses.length) {
      logActivity({
        event: "GET_EXPENSES_SUCCESS",
        description: "No expenses found for this user",
        actionBy: req?.user?.id || "Unknown",
        metaData: { userId },
      });
      return sendSuccess(res, [], "No expenses found for this user");
    }

    logActivity({
      event: "GET_EXPENSES_SUCCESS",
      description: "Fetched expenses successfully",
      actionBy: req?.user?.id || "Unknown",
      metaData: { userId, count: expenses.length },
    });

    sendSuccess(res, expenses, "Expenses fetched successfully");
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error occurred";

    logActivity({
      event: "GET_EXPENSES_ERROR",
      description: `Failed to fetch expenses: ${errorMessage}`,
      actionBy: req?.user?.id || "Unknown",
      metaData: { userId: req.params.userId },
    });

    sendError(res, `Failed to fetch expenses: ${errorMessage}`, 500);
  }
};

export const updateExpense: ExpressHandler = async (req, res) => {
  try {
    const { id, userId } = req.params;

    const updatedExpense = await Expense.findOneAndUpdate(
      { _id: id, userId },
      req.body,
      { new: true }
    );

    if (!updatedExpense) {
      logActivity({
        event: "UPDATE_EXPENSE_FAILED",
        description: "Expense not found for this user",
        actionBy: req?.user?.id || "Unknown",
        metaData: { id, userId, updates: req.body },
      });
      return sendError(res, "Expense not found for this user", 404);
    }

    // Update associated transaction
    await Transaction.findOneAndUpdate(
      { originalId: updatedExpense._id, userId },
      {
        title: updatedExpense.title,
        amount: updatedExpense.amount,
        description: updatedExpense.description,
      }
    );

    // Send notification
    await Notification.create({
      userId,
      message: `Expense updated: ${updatedExpense.title} with new amount $${updatedExpense.amount}`,
      type: "expense",
      resourceId: updatedExpense._id,
    });

    logActivity({
      event: "UPDATE_EXPENSE_SUCCESS",
      description: "Expense updated successfully",
      actionBy: req?.user?.id || "Unknown",
      metaData: { userId, updatedExpense },
    });

    sendSuccess(res, updatedExpense, "Expense successfully updated");
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error occurred";

    logActivity({
      event: "UPDATE_EXPENSE_ERROR",
      description: `Failed to update expense: ${errorMessage}`,
      actionBy: req?.user?.id || "Unknown",
      metaData: { id: req.params.id, userId: req.params.userId, updates: req.body },
    });

    sendError(res, `Failed to update expense: ${errorMessage}`, 500);
  }
};

export const deleteExpense: ExpressHandler = async (req, res) => {
  try {
    const { id, userId } = req.params;

    const deletedExpense = await Expense.findOneAndDelete({
      _id: id,
      userId,
    });

    if (!deletedExpense) {
      logActivity({
        event: "DELETE_EXPENSE_FAILED",
        description: "Expense not found for this user",
        actionBy: req?.user?.id || "Unknown",
        metaData: { id, userId },
      });
      return sendError(res, "Expense not found for this user", 404);
    }

    // Mark transaction as deleted
    await Transaction.findOneAndUpdate(
      { originalId: deletedExpense._id, userId },
      { deleted: true }
    );

    // Send notification
    await Notification.create({
      userId,
      message: `Expense deleted: ${deletedExpense.title} for $${deletedExpense.amount}`,
      type: "expense",
      resourceId: deletedExpense._id,
    });

    logActivity({
      event: "DELETE_EXPENSE_SUCCESS",
      description: "Expense deleted successfully",
      actionBy: req?.user?.id || "Unknown",
      metaData: { userId, deletedExpense },
    });

    sendSuccess(res, deletedExpense, "Expense successfully deleted");
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error occurred";

    logActivity({
      event: "DELETE_EXPENSE_ERROR",
      description: `Failed to delete expense: ${errorMessage}`,
      actionBy: req?.user?.id || "Unknown",
      metaData: { id: req.params.id, userId: req.params.userId },
    });

    sendError(res, `Failed to delete expense: ${errorMessage}`, 500);
  }
};
