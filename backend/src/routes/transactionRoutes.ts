import express from "express";
import { getAllTransactions } from "../controllers";
import { protect } from "../middlewares";

const router = express.Router();

router.get("/users/:userId/transactions", protect, getAllTransactions);

export default router;
