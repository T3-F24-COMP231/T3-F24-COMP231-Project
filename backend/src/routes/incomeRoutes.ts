import express from "express";
import { addIncome, getIncomes, updateIncome } from "../controllers";

const router = express.Router();

router.route("/income").post(addIncome);
router.route("/income").get(getIncomes);
router.route("/income/:id").put(updateIncome);
export default router;
