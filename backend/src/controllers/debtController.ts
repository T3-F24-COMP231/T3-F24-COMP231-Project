import { sendError, sendSuccess } from "../utils";
import { Debt } from "../models";
import { ExpressHandler } from "../types";

export const addDebt: ExpressHandler = async (req, res) => {
  try {
    const { title, amount, description } = req.body;
    const debt = await Debt.create({ title, amount, description });
    sendSuccess(res, debt, "Debt information successfully added");
  } catch (error) {
    sendError(res, "Failed to add debt information", 400);
  }
};

export const getDebts: ExpressHandler = async (req, res) => {
  try {
    const debts = await Debt.find();
    sendSuccess(res, debts);
  } catch (error) {
    sendError(res, "Failed to fetch debts", 500);
  }
};

export const updateDebt: ExpressHandler = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedDebt = await Debt.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    sendSuccess(res, updatedDebt, "Debt information successfully updated");
  } catch (error) {
    sendError(res, "Failed to update debt information", 500);
  }
};
