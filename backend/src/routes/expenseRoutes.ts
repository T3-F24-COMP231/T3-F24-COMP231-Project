import express from "express";
import {
  addExpense,
  getExpenses,
  updateExpense,
  deleteExpense,
} from "../controllers";
import { protect } from "../middlewares";

const router = express.Router();

router.post("/users/:userId/expense", protect, addExpense);
router.get("/users/:userId/expenses", protect, getExpenses);
router.put("/users/:userId/expense/:id", protect, updateExpense);
router.delete("/users/:userId/expense/:id", protect, deleteExpense);

export default router;
