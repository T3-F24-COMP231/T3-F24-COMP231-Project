import { sendError, sendSuccess } from "../utils";
import { Category, UserCategoryBlacklist } from "../models";
import { ExpressHandler } from "../types";

export const defaultCategories = [
  { name: "Food & Dining", isDefault: true },
  { name: "Transportation", isDefault: true },
  { name: "Utilities", isDefault: true },
  { name: "Rent", isDefault: true },
  { name: "Health & Wellness", isDefault: true },
  { name: "Entertainment", isDefault: true },
  { name: "Groceries", isDefault: true },
  { name: "Shopping", isDefault: true },
  { name: "Travel", isDefault: true },
  { name: "Education", isDefault: true },
  { name: "Insurance", isDefault: true },
  { name: "Savings & Investments", isDefault: true },
  { name: "Gifts & Donations", isDefault: true },
  { name: "Personal Care", isDefault: true },
  { name: "Household Supplies", isDefault: true },
  { name: "Childcare", isDefault: true },
  { name: "Pets", isDefault: true },
  { name: "Fitness & Sports", isDefault: true },
  { name: "Subscriptions", isDefault: true },
  { name: "Miscellaneous", isDefault: true },
];

export const initializeDefaultCategories: ExpressHandler = async (req, res) => {
  try {
    const existingCategories = await Category.find({ isDefault: true });
    if (existingCategories.length === 0) {
      await Category.insertMany(defaultCategories);
    }
    sendSuccess(res, null, "Default categories initialized");
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error occurred";
    sendError(
      res,
      `Failed to initialize default categories: ${errorMessage}`,
      500
    );
  }
};

export const getCategories: ExpressHandler = async (req, res) => {
  try {
    const { userId } = req.params;
    const defaultCategories = await Category.find({ isDefault: true });
    const userCategories = await Category.find({ userId });
    const blacklistedCategories = await UserCategoryBlacklist.find({
      userId,
    }).select("categoryName");
    const blacklistedNames = blacklistedCategories.map(
      (item) => item.categoryName
    );

    const filteredDefaultCategories = defaultCategories.filter(
      (category) => !blacklistedNames.includes(category.name)
    );

    const allCategories = [...filteredDefaultCategories, ...userCategories];

    sendSuccess(res, allCategories, "Categories fetched successfully");
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error occurred";
    sendError(res, `Failed to fetch categories: ${errorMessage}`, 500);
  }
};

export const addCustomCategory: ExpressHandler = async (req, res) => {
  try {
    const { userId } = req.params;
    const { name } = req.body;

    const existingCategory = await Category.findOne({ name, userId });
    if (existingCategory) {
      return sendError(res, "Category already exists", 400);
    }

    const newCategory = await Category.create({
      userId,
      name,
      isDefault: false,
    });
    sendSuccess(res, newCategory, "Custom category added successfully");
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error occurred";
    sendError(res, `Failed to add custom category: ${errorMessage}`, 500);
  }
};

export const deleteCategory: ExpressHandler = async (req, res) => {
  try {
    const { userId } = req.params;
    const { name } = req.body;

    const defaultCategory = await Category.findOne({ name, isDefault: true });
    if (defaultCategory) {
      const existingBlacklist = await UserCategoryBlacklist.findOne({
        userId,
        categoryName: name,
      });
      if (existingBlacklist) {
        return sendError(res, "Category already removed from your list", 400);
      }

      await UserCategoryBlacklist.create({ userId, categoryName: name });
      return sendSuccess(res, null, "Category removed from your list");
    }

    const userCategory = await Category.findOneAndDelete({
      userId,
      name,
      isDefault: false,
    });
    if (!userCategory) {
      return sendError(res, "Category not found in your custom list", 404);
    }

    sendSuccess(res, userCategory, "Custom category deleted successfully");
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error occurred";
    sendError(res, `Failed to delete category: ${errorMessage}`, 500);
  }
};
