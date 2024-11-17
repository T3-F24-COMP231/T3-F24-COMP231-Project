import { sendError, sendSuccess } from "../utils";
import { Investment } from "../models";
import { ExpressHandler } from "../types";

export const addInvestment: ExpressHandler = async (req, res) => {
  try {
    const { title, amount, description } = req.body;
    const { userId } = req.params;

    const investment = await Investment.create({ userId, title, amount, description });
    sendSuccess(res, investment, "Investment information successfully added");
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
    sendError(res, `Failed to add investment information: ${errorMessage}`, 500);
  }
};

export const getInvestments: ExpressHandler = async (req, res) => {
  try {
    const { userId } = req.params;
    const investments = await Investment.find({ userId });

    if (!investments.length) {
      return sendError(res, "No investments found for this user", 404);
    }

    sendSuccess(res, investments, "Investments fetched successfully");
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
    sendError(res, `Failed to fetch investments: ${errorMessage}`, 500);
  }
};

export const updateInvestment: ExpressHandler = async (req, res) => {
  try {
    const { id, userId } = req.params;
    const updatedInvestment = await Investment.findOneAndUpdate({ _id: id, userId }, req.body, { new: true });

    if (!updatedInvestment) {
      return sendError(res, "Investment not found for this user", 404);
    }

    sendSuccess(res, updatedInvestment, "Investment information successfully updated");
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
    sendError(res, `Failed to update investment information: ${errorMessage}`, 500);
  }
};

export const deleteInvestment: ExpressHandler = async (req, res) => {
  try {
    const { id, userId } = req.params;
    const deletedInvestment = await Investment.findOneAndDelete({ _id: id, userId });

    if (!deletedInvestment) {
      return sendError(res, "Investment not found for this user", 404);
    }

    sendSuccess(res, deletedInvestment, "Investment successfully deleted");
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
    sendError(res, `Failed to delete investment: ${errorMessage}`, 500);
  }
};
