import express from "express";
import { upgradeUserRole, getUser, getAllUsers } from "../controllers/userController";
import { protect, adminOnly } from "../middlewares";

const router = express.Router();

router.post("/users/:userId/upgrade-role", protect, upgradeUserRole);
router.get("/users/:userId", protect, getUser);
router.get("/users", protect, getAllUsers);

export default router;
