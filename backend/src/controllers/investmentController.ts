import { Request, Response } from "express";
import { sendError, sendSuccess, logActivity } from "../utils";
import { Investment, Notification, Transaction } from "../models";

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

    // Log transaction
    await Transaction.create({
      userId,
      type: "investment",
      title,
      amount,
      description,
      originalId: investment._id,
    });

    // Send notification
    await Notification.create({
      userId,
      message: `New investment added: ${title} with $${amount}`,
      type: "investment",
      resourceId: investment._id,
    });

    logActivity({
      event: "ADD_INVESTMENT_SUCCESS",
      description: "Investment successfully added",
      actionBy: req?.user?.id || "Unknown",
      metaData: { userId, investment },
    });

    sendSuccess(res, investment, "Investment successfully added");
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error occurred";

    logActivity({
      event: "ADD_INVESTMENT_ERROR",
      description: `Failed to add investment: ${errorMessage}`,
      actionBy: req?.user?.id || "Unknown",
      metaData: { userId: req.params.userId, body: req.body },
    });

    sendError(res, `Failed to add investment: ${errorMessage}`, 500);
  }
};

// Get all investments for a user
export const getInvestments = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const investments = await Investment.find({ userId });

    if (!investments.length) {
      logActivity({
        event: "GET_INVESTMENTS_SUCCESS",
        description: "No investments found for this user",
        actionBy: req?.user?.id || "Unknown",
        metaData: { userId },
      });

      return sendSuccess(res, [], "No investments found for this user");
    }

    logActivity({
      event: "GET_INVESTMENTS_SUCCESS",
      description: "Investments fetched successfully",
      actionBy: req?.user?.id || "Unknown",
      metaData: { userId, count: investments.length },
    });

    sendSuccess(res, investments, "Investments fetched successfully");
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error occurred";

    logActivity({
      event: "GET_INVESTMENTS_ERROR",
      description: `Failed to fetch investments: ${errorMessage}`,
      actionBy: req?.user?.id || "Unknown",
      metaData: { userId: req.params.userId },
    });

    sendError(res, `Failed to fetch investments: ${errorMessage}`, 500);
  }
};

// Get a single investment by ID
export const getInvestmentById = async (req: Request, res: Response) => {
  try {
    const { userId, id } = req.params;
    const investment = await Investment.findOne({ _id: id, userId });

    if (!investment) {
      logActivity({
        event: "GET_INVESTMENT_BY_ID_FAILED",
        description: "Investment not found",
        actionBy: req?.user?.id || "Unknown",
        metaData: { userId, id },
      });

      return sendError(res, "Investment not found", 404);
    }

    logActivity({
      event: "GET_INVESTMENT_BY_ID_SUCCESS",
      description: "Investment fetched successfully",
      actionBy: req?.user?.id || "Unknown",
      metaData: { userId, investment },
    });

    sendSuccess(res, investment, "Investment fetched successfully");
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error occurred";

    logActivity({
      event: "GET_INVESTMENT_BY_ID_ERROR",
      description: `Failed to fetch investment: ${errorMessage}`,
      actionBy: req?.user?.id || "Unknown",
      metaData: { userId: req.params.userId, id: req.params.id },
    });

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
      logActivity({
        event: "UPDATE_INVESTMENT_FAILED",
        description: "Investment not found",
        actionBy: req?.user?.id || "Unknown",
        metaData: { userId, id, updates: req.body },
      });

      return sendError(res, "Investment not found", 404);
    }

    // Update associated transaction
    await Transaction.findOneAndUpdate(
      { originalId: updatedInvestment._id, userId },
      {
        title: updatedInvestment.title,
        amount: updatedInvestment.amount,
        description: updatedInvestment.description,
      }
    );

    // Send notification
    await Notification.create({
      userId,
      message: `Investment updated: ${updatedInvestment.title} with new amount $${updatedInvestment.amount}`,
      type: "investment",
      resourceId: updatedInvestment._id,
    });

    logActivity({
      event: "UPDATE_INVESTMENT_SUCCESS",
      description: "Investment successfully updated",
      actionBy: req?.user?.id || "Unknown",
      metaData: { userId, updatedInvestment },
    });

    sendSuccess(res, updatedInvestment, "Investment successfully updated");
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error occurred";

    logActivity({
      event: "UPDATE_INVESTMENT_ERROR",
      description: `Failed to update investment: ${errorMessage}`,
      actionBy: req?.user?.id || "Unknown",
      metaData: { userId: req.params.userId, id: req.params.id, updates: req.body },
    });

    sendError(res, `Failed to update investment: ${errorMessage}`, 500);
  }
};

// Delete an investment
export const deleteInvestment = async (req: Request, res: Response) => {
  try {
    const { userId, id } = req.params;

    const deletedInvestment = await Investment.findOneAndDelete({
      _id: id,
      userId,
    });

    if (!deletedInvestment) {
      logActivity({
        event: "DELETE_INVESTMENT_FAILED",
        description: "Investment not found",
        actionBy: req?.user?.id || "Unknown",
        metaData: { userId, id },
      });

      return sendError(res, "Investment not found", 404);
    }

    // Mark transaction as deleted
    await Transaction.findOneAndUpdate(
      { originalId: deletedInvestment._id, userId },
      { deleted: true }
    );

    // Send notification
    await Notification.create({
      userId,
      message: `Investment deleted: ${deletedInvestment.title}`,
      type: "investment",
      resourceId: deletedInvestment._id,
    });

    logActivity({
      event: "DELETE_INVESTMENT_SUCCESS",
      description: "Investment successfully deleted",
      actionBy: req?.user?.id || "Unknown",
      metaData: { userId, deletedInvestment },
    });

    sendSuccess(res, deletedInvestment, "Investment successfully deleted");
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error occurred";

    logActivity({
      event: "DELETE_INVESTMENT_ERROR",
      description: `Failed to delete investment: ${errorMessage}`,
      actionBy: req?.user?.id || "Unknown",
      metaData: { userId: req.params.userId, id: req.params.id },
    });

    sendError(res, `Failed to delete investment: ${errorMessage}`, 500);
  }
};
