import { sendError, sendSuccess } from "../utils";
import { Debt, Notification, Transaction } from "../models";
import { ExpressHandler } from "../types";

export const addDebt: ExpressHandler = async (req, res) => {
  try {
    const { title, amount, description, paymentReminder } = req.body;
    const { userId } = req.params;

    if (!title || !amount) {
      return sendError(res, "Title and amount are required", 400);
    }

    const debt = await Debt.create({
      userId,
      title,
      amount,
      description,
      paymentReminder,
    });

    // Log transaction
    await Transaction.create({
      userId,
      type: "debt",
      title,
      amount,
      description,
      originalId: debt._id,
    });

    // Send notification
    await Notification.create({
      userId,
      message: `New debt added: ${title} for $${amount}`,
      type: "debt",
      resourceId: debt._id,
    });

    sendSuccess(res, debt, "Debt information successfully added");
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
    sendError(res, `Failed to add debt information: ${errorMessage}`, 500);
  }
};


export const getDebts: ExpressHandler = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return sendError(res, "User ID is required", 400);
    }

    const debts = await Debt.find({ userId });

    if (!debts.length) {
      return sendSuccess(res, [], "No debts found for this user");
    }

    sendSuccess(res, debts, "Debts fetched successfully");
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error occurred";
    sendError(res, `Failed to fetch debts: ${errorMessage}`, 500);
  }
};

export const updateDebt: ExpressHandler = async (req, res) => {
  try {
    const { id, userId } = req.params;
    const { paymentReminder, ...otherUpdates } = req.body;

    if (!id || !userId) {
      return sendError(res, "Debt ID and User ID are required", 400);
    }

    const updatedDebt = await Debt.findOneAndUpdate(
      { _id: id, userId },
      { ...otherUpdates, paymentReminder },
      { new: true }
    );

    if (!updatedDebt) {
      return sendError(res, "Debt not found for this user", 404);
    }

    // Update associated transaction
    await Transaction.findOneAndUpdate(
      { originalId: updatedDebt._id, userId },
      {
        title: updatedDebt.title,
        amount: updatedDebt.amount,
        description: updatedDebt.description,
      }
    );

    // Send notification
    await Notification.create({
      userId,
      message: `Debt updated: ${updatedDebt.title} with new amount $${updatedDebt.amount}`,
      type: "debt",
      resourceId: updatedDebt._id,
    });

    sendSuccess(res, updatedDebt, "Debt information successfully updated");
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
    sendError(res, `Failed to update debt information: ${errorMessage}`, 500);
  }
};


export const deleteDebt: ExpressHandler = async (req, res) => {
  try {
    const { id, userId } = req.params;

    if (!id || !userId) {
      return sendError(res, "Debt ID and User ID are required", 400);
    }

    const deletedDebt = await Debt.findOneAndDelete({ _id: id, userId });

    if (!deletedDebt) {
      return sendError(res, "Debt not found for this user", 404);
    }

    // Log transaction update (mark it as deleted)
    await Transaction.findOneAndUpdate(
      { originalId: deletedDebt._id, userId },
      { deleted: true }
    );

    // Send notification
    await Notification.create({
      userId,
      message: `Debt deleted: ${deletedDebt.title} for $${deletedDebt.amount}`,
      type: "debt",
      resourceId: deletedDebt._id,
    });

    sendSuccess(res, deletedDebt, "Debt successfully deleted");
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error occurred";
    sendError(res, `Failed to delete debt: ${errorMessage}`, 500);
  }
};

export const handlePaymentReminders = async () => {
  try {
    const now = new Date();

    // Find debts with reminders that are due
    const debtsWithReminders = await Debt.find({
      "paymentReminder.enabled": true,
      "paymentReminder.reminderDate": { $lte: now },
    });

    for (const debt of debtsWithReminders) {
      // Send notification
      await Notification.create({
        userId: debt.userId,
        message: `Payment reminder: You are due to pay $${debt.paymentReminder.amountToPay} for ${debt.title}`,
        type: "debt",
        resourceId: debt._id,
      });

      // Update next reminder date based on frequency
      const nextReminderDate = new Date(debt.paymentReminder.reminderDate);
      switch (debt.paymentReminder.reminderFrequency) {
        case "daily":
          nextReminderDate.setDate(nextReminderDate.getDate() + 1);
          break;
        case "weekly":
          nextReminderDate.setDate(nextReminderDate.getDate() + 7);
          break;
        case "monthly":
          nextReminderDate.setMonth(nextReminderDate.getMonth() + 1);
          break;
        default:
          break;
      }

      // Update the debt with the next reminder date
      debt.paymentReminder.reminderDate = nextReminderDate;
      await debt.save();
    }
  } catch (error) {
    console.error("Error handling payment reminders:", error);
  }
};

