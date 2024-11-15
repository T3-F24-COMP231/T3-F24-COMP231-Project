import express from "express";
import { addDebt, getDebts, updateDebt, deleteDebt } from "../controllers";
import { protect } from "../middlewares";

const router = express.Router();

router.post("/users/:userId/debt", protect, addDebt);
router.get("/users/:userId/debts", protect, getDebts);
router.put("/users/:userId/debt/:id", protect, updateDebt);
router.delete("/users/:userId/debt/:id", protect, deleteDebt);

export default router;
