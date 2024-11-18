import express from "express";
import { Signup, Login, Logout } from "../controllers";
import { protect } from "../middlewares";

const router = express.Router();

router.post("/register", Signup);
router.post("/login", Login);
router.post("/logout", protect, Logout);

export default router;
