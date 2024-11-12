import { Category, Expense } from "../models";
import { ExpressHandler } from "../types";
import { sendError, sendSuccess } from "../utils";

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
