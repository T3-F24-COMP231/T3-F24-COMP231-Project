import express from "express";
import { addDebt, getDebts, updateDebt } from "../controllers";

const router = express.Router();

router.route("/debt").post(addDebt);
router.route("/debt").get(getDebts);
router.route("/debt/:id").put(updateDebt);
export default router;
