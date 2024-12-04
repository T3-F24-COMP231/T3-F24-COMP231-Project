import express from "express";
import { getNotifications, getUnreadNotificationCount, markAllNotificationsAsRead, markAsRead } from "../controllers";
import { protect } from "../middlewares";

const router = express.Router();

router.get("/users/:userId/notifications", protect, getNotifications);
router.put("/users/:userId/notifications/:id/mark-read", protect, markAsRead);
router.get("/users/:userId/notifications/unread-count", protect, getUnreadNotificationCount);
router.post("/users/:userId/notifications/mark-all-read", protect, markAllNotificationsAsRead);
export default router;
