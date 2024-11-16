import User from "../models/userModel";
import { sendError, sendSuccess } from "../utils";
import { ExpressHandler } from "../types";

export const upgradeUserRole: ExpressHandler = async (req, res) => {
  const { newRole } = req.body;
  const { userId } = req.params;

  const validRoles = ["Finance Tracker", "Debt Repayer", "Financial Expert", "Investor", "Administrator"];
  if (!validRoles.includes(newRole)) {
    return sendError(res, "Invalid role", 400);
  }

  try {
    const user = await User.findById(userId);
    if (!user) {
      return sendError(res, "User not found", 404);
    }

    user.role = newRole;

    if (newRole === "Financial Expert") {
      const unassignedClients = await User.find({ role: "Finance Tracker", assignedExpert: null });

      if (unassignedClients.length === 0) {
        return sendError(res, "No available clients to assign", 404);
      }

      const maxClients = 5;
      const assignedClients = unassignedClients
        .sort(() => 0.5 - Math.random())
        .slice(0, maxClients)
        .map((client) => client._id);

      user.assignedClients = assignedClients;

      await User.updateMany(
        { _id: { $in: assignedClients } },
        { $set: { assignedExpert: user._id } }
      );
    }

    await user.save();
    sendSuccess(res, user, `User upgraded to ${newRole}`);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
    sendError(res, `Failed to upgrade user role: ${errorMessage}`, 500);
  }
};

export const getUser: ExpressHandler = async (req, res) => {
  const { userId } = req.params;

  try {
    const user = await User.findById(userId).select("-password");
    if (!user) {
      return sendError(res, "User not found", 404);
    }

    sendSuccess(res, user, "User fetched successfully");
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
    sendError(res, `Failed to fetch user: ${errorMessage}`, 500);
  }
};

export const getAllUsers: ExpressHandler = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    if (!users.length) {
      return sendError(res, "No users found", 404);
    }

    sendSuccess(res, users, "Users fetched successfully");
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
    sendError(res, `Failed to fetch users: ${errorMessage}`, 500);
  }
};

export const getCurrentUser: ExpressHandler = async (req, res) => {
  try {
    const user = req.user;

    if (!user) {
      return sendError(res, "User not found", 404);
    }

    sendSuccess(res, user, "Current user fetched successfully");
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
    sendError(res, `Failed to fetch current user: ${errorMessage}`, 500);
  }
};