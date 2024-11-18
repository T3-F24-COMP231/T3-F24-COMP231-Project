import express from "express";
import {
  addExpense,
  getExpenses,
  updateExpense,
  deleteExpense,
  getExpenseSummary,
} from "../controllers";
import { protect } from "../middlewares";

const router = express.Router();

router.post("/users/:userId/expense", protect, addExpense);
router.get("/users/:userId/expenses", protect, getExpenses);
router.put("/users/:userId/expense/:id", protect, updateExpense);
router.delete("/users/:userId/expense/:id", protect, deleteExpense);
router.get("/users/:userId/expense/summary", protect, getExpenseSummary);

export default router;
