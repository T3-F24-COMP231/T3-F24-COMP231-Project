import express from "express";
import {
  addExpense,
  getExpenses,
  getExpenseSummary,
  updateExpense,
} from "../controllers";

const router = express.Router();

router.route("/expense").post(addExpense);
router.route("/expense").get(getExpenses);
router.route("/expense/:id").put(updateExpense);
router.route("/expense/summary/:userId").get(getExpenseSummary);

export default router;
