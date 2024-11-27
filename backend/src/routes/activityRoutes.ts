import express from "express";
import { adminOnly, logActivity, protect } from "../middlewares";

const router = express.Router();

router.get("/activities", protect, adminOnly, logActivity);

export default router;
