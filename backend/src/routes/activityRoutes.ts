import express from "express";
import { getActivitiesByEventType, getAllActivities } from "../controllers";
import { adminOnly, protect } from "../middlewares";

const router = express.Router();

router.get("/activities", protect, adminOnly, getAllActivities);

router.get(
  "/activities/event/:eventType",
  protect,
  adminOnly,
  getActivitiesByEventType
);

export default router;
