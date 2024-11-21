import { Category, Expense } from "../models";
import { ExpressHandler } from "../types";
import { getStartOfMonth, getStartOfWeek, sendError, sendSuccess } from "../utils";

export const addExpense: ExpressHandler = async (req, res) => {
  try {
    const { title, amount, description, category } = req.body;
    const { userId } = req.params;

    if (!category) {
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

    sendSuccess(res, expense, "Expense successfully added");
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error occurred";
    sendError(res, `Failed to add expense: ${errorMessage}`, 500);
  }
};

export const getExpenses: ExpressHandler = async (req, res) => {
  try {
    const { userId } = req.params;
    const expenses = await Expense.find({ userId });

    if (!expenses.length) {
      return sendSuccess(res, [], "No expenses found for this user");
    }

    sendSuccess(res, expenses, "Expenses fetched successfully");
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error occurred";
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
      return sendError(res, "Expense not found for this user", 404);
    }

    sendSuccess(res, updatedExpense, "Expense successfully updated");
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error occurred";
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
      return sendError(res, "Expense not found for this user", 404);
    }

    sendSuccess(res, deletedExpense, "Expense successfully deleted");
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error occurred";
    sendError(res, `Failed to delete expense: ${errorMessage}`, 500);
  }
};

export const getExpenseSummary: ExpressHandler = async (req, res) => {
  try {
    const { userId } = req.params;
    const period =
      typeof req.query.period === "string" ? req.query.period : "";

    if (!period || !["weekly", "monthly"].includes(period)) {
      return sendError(
        res,
        "Invalid period. Please use 'weekly' or 'monthly'.",
        400
      );
    }

    const startDate =
      period === "weekly" ? getStartOfWeek() : getStartOfMonth();
    const endDate = new Date();

    const summary = await Expense.aggregate([
      {
        $match: { userId, createdAt: { $gte: startDate, $lte: endDate } },
      },
      {
        $group: {
          _id: "$category",
          totalAmount: { $sum: "$amount" },
          count: { $sum: 1 },
        },
      },
      { $project: { _id: 0, category: "$_id", totalAmount: 1, count: 1 } },
    ]);

    sendSuccess(res, summary, `Expense summary for the ${period}`);
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error occurred";
    sendError(res, `Failed to fetch expense summary: ${errorMessage}`, 500);
  }
};
