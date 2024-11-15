import express from "express";
import {
  addIncome,
  getIncomes,
  updateIncome,
  deleteIncome,
} from "../controllers";
import { protect } from "../middlewares";

const router = express.Router();

router.post("/users/:userId/income", protect, addIncome);
router.get("/users/:userId/incomes", protect, getIncomes);
router.put("/users/:userId/income/:id", protect, updateIncome);
router.delete("/users/:userId/income/:id", protect, deleteIncome);

export default router;
