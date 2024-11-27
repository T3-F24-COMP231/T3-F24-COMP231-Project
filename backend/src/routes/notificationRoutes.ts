import express from "express";
import { getNotifications, markAsRead } from "../controllers";
import { protect } from "../middlewares";

const router = express.Router();

router.get("/users/:userId/notifications", protect, getNotifications);
router.put("/users/:userId/notifications/:id/mark-read", protect, markAsRead);

export default router;
