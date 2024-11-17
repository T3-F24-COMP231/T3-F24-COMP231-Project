import express from "express";
import { addInvestment, getInvestments, updateInvestment, deleteInvestment } from "../controllers";
import { protect } from "../middlewares";

const router = express.Router();

router.post("/users/:userId/investment", protect, addInvestment);
router.get("/users/:userId/investments", protect, getInvestments);
router.put("/users/:userId/investment/:id", protect, updateInvestment);
router.delete("/users/:userId/investment/:id", protect, deleteInvestment);

export default router;
