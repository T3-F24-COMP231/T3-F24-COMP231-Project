import express from "express";
import { addRole, getRoles } from "../controllers";
import { protect, adminOnly } from "../middlewares";

const router = express.Router();

// Route to create a role (protected, admin only)
router.post("/roles", protect, addRole);

// Route to fetch all roles
router.get("/roles", protect, getRoles);

export default router;
