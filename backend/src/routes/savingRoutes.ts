import express from "express";
import { addSavings, getSavings, updateSavings, deleteSavings } from "../controllers";
import { protect } from "../middlewares";

const router = express.Router();

router.post("/users/:userId/savings", protect, addSavings);
router.get("/users/:userId/savings", protect, getSavings);
router.put("/users/:userId/savings/:id", protect, updateSavings);
router.delete("/users/:userId/savings/:id", protect, deleteSavings);

export default router;
