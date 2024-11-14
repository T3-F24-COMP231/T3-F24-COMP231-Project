import { Category, Expense } from "../models";
import { ExpressHandler } from "../types";
import { getStartOfMonth, getStartOfWeek, sendError, sendSuccess } from "../utils";

export const addExpense: ExpressHandler = async (req, res) => {
  try {
    const { title, amount, description, category } = req.body;
    if (!category) {
      sendError(res, "category field is required", 400);
    }
    // Check if the category exists or add a new one
    let existingCategory = await Category.findOne({ name: category });
    if (!existingCategory) {
      existingCategory = await Category.create({ name: category });
    }

    const expense = await Expense.create({
      title,
      amount,
      description,
      category: existingCategory.name,
    });
    sendSuccess(res, expense, "Expense successfully added");
  } catch (error) {
    sendError(res, "Failed to add expense", 501);
  }
};

export const getExpenses: ExpressHandler = async (req, res) => {
  try {
    const expenses = await Expense.find();
    sendSuccess(res, expenses);
  } catch (error) {
    sendError(res, "Failed to fetch expenses", 500);
  }
};

export const updateExpense: ExpressHandler = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedExpense = await Expense.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    sendSuccess(res, updatedExpense, "Expense successfully updated");
  } catch (error) {
    sendError(res, "Failed to update expense", 500);
  }
};


export const getExpenseSummary: ExpressHandler = async (req, res) => {
  try {
    const period = req.query.period as string;
    const { userId } = req.params;

    if (!period || !['weekly', 'monthly'].includes(period)) {
      return sendError(res, "Invalid period. Please use 'weekly' or 'monthly'.", 400);
    }

    // Determine date range based on the period
    const startDate = period === 'weekly' ? getStartOfWeek() : getStartOfMonth();
    const endDate = new Date();

    // Aggregate expenses based on the date range
    const summary = await Expense.aggregate([
      { $match: { userId, createdAt: { $gte: startDate, $lte: endDate } } },
      {
        $group: {
          _id: "$category",
          totalAmount: { $sum: "$amount" },
          count: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          category: "$_id",
          totalAmount: 1,
          count: 1,
        },
      },
    ]);

    sendSuccess(res, summary, `Expense summary for the ${period}`);
  } catch (error) {
    sendError(res, "Failed to fetch expense summary", 500);
  }
};
