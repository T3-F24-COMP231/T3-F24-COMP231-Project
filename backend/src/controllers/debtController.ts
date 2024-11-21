import { sendError, sendSuccess } from "../utils";
import { Debt } from "../models";
import { ExpressHandler } from "../types";

export const addDebt: ExpressHandler = async (req, res) => {
  try {
    const { title, amount, description } = req.body;
    const { userId } = req.params;

    if (!title || !amount) {
      return sendError(res, "Title and amount are required", 400);
    }

    const debt = await Debt.create({ userId, title, amount, description });
    sendSuccess(res, debt, "Debt information successfully added");
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
    sendError(res, `Failed to add debt information: ${errorMessage}`, 500);
  }
};

export const getDebts: ExpressHandler = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return sendError(res, "User ID is required", 400);
    }

    const debts = await Debt.find({ userId });

    if (!debts.length) {
      return sendSuccess(res, [], "No expenses found for this user");
    }

    sendSuccess(res, debts, "Debts fetched successfully");
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
    sendError(res, `Failed to fetch debts: ${errorMessage}`, 500);
  }
};

export const updateDebt: ExpressHandler = async (req, res) => {
  try {
    const { id, userId } = req.params;

    if (!id || !userId) {
      return sendError(res, "Debt ID and User ID are required", 400);
    }

    const updatedDebt = await Debt.findOneAndUpdate({ _id: id, userId }, req.body, { new: true });

    if (!updatedDebt) {
      return sendError(res, "Debt not found for this user", 404);
    }

    sendSuccess(res, updatedDebt, "Debt information successfully updated");
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
    sendError(res, `Failed to update debt information: ${errorMessage}`, 500);
  }
};

export const deleteDebt: ExpressHandler = async (req, res) => {
  try {
    const { id, userId } = req.params;

    if (!id || !userId) {
      return sendError(res, "Debt ID and User ID are required", 400);
    }

    const deletedDebt = await Debt.findOneAndDelete({ _id: id, userId });

    if (!deletedDebt) {
      return sendError(res, "Debt not found for this user", 404);
    }

    sendSuccess(res, deletedDebt, "Debt successfully deleted");
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
    sendError(res, `Failed to delete debt: ${errorMessage}`, 500);
  }
};
