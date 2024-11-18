import express from "express";
import {
  initializeDefaultCategories,
  getCategories,
  addCustomCategory,
  deleteCategory,
} from "../controllers/categoryController";
import { protect } from "../middlewares";

const router = express.Router();

router.post("/categories/init", initializeDefaultCategories);
router.get("/users/:userId/categories", protect, getCategories);
router.post("/users/:userId/category", protect, addCustomCategory);
router.delete("/users/:userId/category", protect, deleteCategory);

export default router;
