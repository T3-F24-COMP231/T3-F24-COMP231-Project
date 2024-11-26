import { Request, Response } from "express";
import { sendError, sendSuccess } from "../utils";
import { Investment } from "../models";

// Add a new investment
export const addInvestment = async (req: Request, res: Response) => {
  try {
    const { title, amount, returnPercentage, description } = req.body;
    const { userId } = req.params;

    const investment = await Investment.create({
      userId,
      title,
      amount,
      returnPercentage,
      description,
    });

    sendSuccess(res, investment, "Investment successfully added");
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
    sendError(res, `Failed to add investment: ${errorMessage}`, 500);
  }
};

// Get all investments for a user
export const getInvestments = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const investments = await Investment.find({ userId });

    if (!investments.length) {
      return sendError(res, "No investments found for this user", 204);
    }

    sendSuccess(res, investments, "Investments fetched successfully");
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
    sendError(res, `Failed to fetch investments: ${errorMessage}`, 500);
  }
};

// Get a single investment by ID
export const getInvestmentById = async (req: Request, res: Response) => {
  try {
    const { userId, id } = req.params;
    const investment = await Investment.findOne({ _id: id, userId });

    if (!investment) {
      return sendError(res, "Investment not found", 404);
    }

    sendSuccess(res, investment, "Investment fetched successfully");
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
    sendError(res, `Failed to fetch investment: ${errorMessage}`, 500);
  }
};

// Update an investment
export const updateInvestment = async (req: Request, res: Response) => {
  try {
    const { userId, id } = req.params;
    const updatedInvestment = await Investment.findOneAndUpdate(
      { userId, _id: id },
      req.body,
      { new: true }
    );

    if (!updatedInvestment) {
      return sendError(res, "Investment not found", 404);
    }

    sendSuccess(res, updatedInvestment, "Investment successfully updated");
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
    sendError(res, `Failed to update investment: ${errorMessage}`, 500);
  }
};

// Delete an investment
export const deleteInvestment = async (req: Request, res: Response) => {
  try {
    const { userId, id } = req.params;
    const deletedInvestment = await Investment.findOneAndDelete({ _id: id, userId });

    if (!deletedInvestment) {
      return sendError(res, "Investment not found", 404);
    }

    sendSuccess(res, deletedInvestment, "Investment successfully deleted");
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
    sendError(res, `Failed to delete investment: ${errorMessage}`, 500);
  }
};
