import express from "express";
import { upgradeUserRole } from "../controllers/userController";

const router = express.Router();

router.route("/users/upgrade-role").post(upgradeUserRole);

export default router;