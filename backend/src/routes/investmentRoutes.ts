import express from "express";
import { protect } from "../middlewares";
import {
  addInvestment,
  getInvestments,
  getInvestmentById,
  updateInvestment,
  deleteInvestment,
} from "../controllers";

const router = express.Router();

router.post("/users/:userId/investments", protect, addInvestment);
router.get("/users/:userId/investments", protect, getInvestments);
router.get("/users/:userId/investments/:id", protect, getInvestmentById);
router.put("/users/:userId/investments/:id", protect, updateInvestment);
router.delete("/users/:userId/investments/:id", protect, deleteInvestment);

export default router;
