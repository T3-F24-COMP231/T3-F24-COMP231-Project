import { sendError, sendSuccess } from "../utils";
import { Income } from "../models";
import { ExpressHandler } from "../types";

export const addIncome: ExpressHandler = async (req, res) => {
  try {
    const { title, amount, description } = req.body;
    const { userId } = req.params;

    const income = await Income.create({ userId, title, amount, description });
    sendSuccess(res, income, "Income successfully added");
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
    sendError(res, `Failed to add income: ${errorMessage}`, 500);
  }
};

export const getIncomes: ExpressHandler = async (req, res) => {
  try {
    const { userId } = req.params;
    const incomes = await Income.find({ userId });

    if (!incomes.length) {
      return sendError(res, "No incomes found for this user", 404);
    }

    sendSuccess(res, incomes, "Incomes fetched successfully");
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
    sendError(res, `Failed to fetch incomes: ${errorMessage}`, 500);
  }
};

export const updateIncome: ExpressHandler = async (req, res) => {
  try {
    const { id, userId } = req.params;
    const updatedIncome = await Income.findOneAndUpdate({ _id: id, userId }, req.body, { new: true });

    if (!updatedIncome) {
      return sendError(res, "Income not found for this user", 404);
    }

    sendSuccess(res, updatedIncome, "Income successfully updated");
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
    sendError(res, `Failed to update income: ${errorMessage}`, 500);
  }
};

export const deleteIncome: ExpressHandler = async (req, res) => {
  try {
    const { id, userId } = req.params;
    const deletedIncome = await Income.findOneAndDelete({ _id: id, userId });

    if (!deletedIncome) {
      return sendError(res, "Income not found for this user", 404);
    }

    sendSuccess(res, deletedIncome, "Income successfully deleted");
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
    sendError(res, `Failed to delete income: ${errorMessage}`, 500);
  }
};
