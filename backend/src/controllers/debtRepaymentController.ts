import { sendError, sendSuccess } from "../utils";
import { Repayment } from "../models";
import { ExpressHandler } from "../types";

export const addRepayment: ExpressHandler = async (req, res) => {
  try {
    const { title, amount, description } = req.body;
    const { userId } = req.params;

    const repayment = await Repayment.create({ userId, title, amount, description });
    sendSuccess(res, repayment, "Repayment information successfully added");
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
    sendError(res, `Failed to add repayment information: ${errorMessage}`, 500);
  }
};

export const getRepayments: ExpressHandler = async (req, res) => {
  try {
    const { userId } = req.params;
    const repayments = await Repayment.find({ userId });

    if (!repayments.length) {
      return sendError(res, "No repayments found for this user", 404);
    }

    sendSuccess(res, repayments, "Repayments fetched successfully");
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
    sendError(res, `Failed to fetch repayments: ${errorMessage}`, 500);
  }
};

export const updateRepayment: ExpressHandler = async (req, res) => {
  try {
    const { id, userId } = req.params;
    const updatedRepayment = await Repayment.findOneAndUpdate({ _id: id, userId }, req.body, { new: true });

    if (!updatedRepayment) {
      return sendError(res, "Repayment not found for this user", 404);
    }

    sendSuccess(res, updatedRepayment, "Repayment information successfully updated");
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
    sendError(res, `Failed to update repayment information: ${errorMessage}`, 500);
  }
};

export const deleteRepayment: ExpressHandler = async (req, res) => {
  try {
    const { id, userId } = req.params;
    const deletedRepayment = await Repayment.findOneAndDelete({ _id: id, userId });

    if (!deletedRepayment) {
      return sendError(res, "Repayment not found for this user", 404);
    }

    sendSuccess(res, deletedRepayment, "Repayment successfully deleted");
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
    sendError(res, `Failed to delete repayment: ${errorMessage}`, 500);
  }
};


//Repayment Repayment History API - mirroring Get repayments
export const getRepaymentHistory: ExpressHandler = async (req, res) => {
  try {
    const { userId } = req.params;
    const repayments = await Repayment.find({ userId });

    if (!repayments.length) {
      return sendError(res, "No repayments found for this user", 404);
    }

    sendSuccess(res, repayments, "Repayments fetched successfully");
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
    sendError(res, `Failed to fetch repayments: ${errorMessage}`, 500);
  }
};
