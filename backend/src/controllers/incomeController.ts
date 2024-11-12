import { sendError, sendSuccess } from "../utils";
import { Income } from "../models";
import { ExpressHandler } from "../types";

export const addIncome: ExpressHandler = async (req, res) => {
  try {
    const { title, amount, description } = req.body;
    const income = await Income.create({ title, amount, description });
    sendSuccess(res, income, "Income successfully added");
  } catch (error) {
    sendError(res, "Failed to add income", 400);
  }
};

export const getIncomes: ExpressHandler = async (req, res) => {
  try {
    const incomes = await Income.find();
    sendSuccess(res, incomes);
  } catch (error) {
    sendError(res, "Failed to fetch incomes", 500);
  }
};

export const updateIncome: ExpressHandler = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedIncome = await Income.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    sendSuccess(res, updatedIncome, "Income successfully updated");
  } catch (error) {
    sendError(res, "Failed to update income", 500);
  }
};
