import { Transaction } from "../models";
import { ExpressHandler } from "../types";
import { sendError, sendSuccess } from "../utils";

export const getAllTransactions: ExpressHandler = async (req, res) => {
  try {
    const { userId } = req.params;

    const transactions = await Transaction.find({ userId }).sort({
      createdAt: -1,
    });

    sendSuccess(res, transactions, "Transactions fetched successfully");
  } catch (error) {
    sendError(res, "Failed to fetch transactions", 500);
  }
};
