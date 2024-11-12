import express from "express";
import { addExpense, getExpenses, updateExpense } from "../controllers";

const router = express.Router();

router.route("/expense").post(addExpense);
router.route("/expense").get(getExpenses);
router.route("/expense/:id").put(updateExpense);

export default router;
