import express from "express";
import { Login, Signup  } from "../controllers";

const router = express.Router();

router.route("/register").post(Signup);
router.route("/login").post(Login);
export default router;