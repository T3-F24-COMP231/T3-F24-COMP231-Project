import express from "express";
import {
  upgradeUserRole,
  getUser,
  getAllUsers,
  getCurrentUser,
} from "../controllers";
import { protect } from "../middlewares";

const router = express.Router();

router.get("/users/me", protect, getCurrentUser);
router.get("/users/:userId", protect, getUser);
router.get("/users", protect, getAllUsers);
router.post("/users/:userId/upgrade-role", protect, upgradeUserRole);

export default router;
