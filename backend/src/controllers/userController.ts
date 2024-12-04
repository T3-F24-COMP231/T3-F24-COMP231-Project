import User from "../models/userModel";
import { sendError, sendSuccess, logActivity } from "../utils";
import { ExpressHandler } from "../types";

export const upgradeUserRole: ExpressHandler = async (req, res) => {
  const { newRole } = req.body;
  const { userId } = req.params;

  const validRoles = ["Finance Tracker", "Debt Repayer", "Financial Expert", "Investor", "Administrator"];
  if (!validRoles.includes(newRole)) {
    logActivity({
      event: "UPGRADE_ROLE_FAILED",
      description: `Invalid role: ${newRole}`,
      actionBy: req?.user?.id || "Unknown",
      metaData: { userId, newRole },
    });
    return sendError(res, "Invalid role", 400);
  }

  try {
    const user = await User.findById(userId);
    if (!user) {
      logActivity({
        event: "UPGRADE_ROLE_FAILED",
        description: "User not found",
        actionBy: req?.user?.id || "Unknown",
        metaData: { userId },
      });
      return sendError(res, "User not found", 404);
    }

    user.role = newRole;

    if (newRole === "Financial Expert") {
      const unassignedClients = await User.find({ role: "Finance Tracker", assignedExpert: null });

      if (unassignedClients.length === 0) {
        logActivity({
          event: "ASSIGN_CLIENTS_FAILED",
          description: "No available clients to assign",
          actionBy: req?.user?.id || "Unknown",
          metaData: { userId },
        });
        return sendError(res, "No available clients to assign", 404);
      }

      const maxClients = 3;
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

    logActivity({
      event: "UPGRADE_ROLE_SUCCESS",
      description: `User upgraded to ${newRole}`,
      actionBy: req?.user?.id || "Unknown",
      metaData: { userId, newRole, assignedClients: user.assignedClients || [] },
    });

    sendSuccess(res, user, `User upgraded to ${newRole}`);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
    logActivity({
      event: "UPGRADE_ROLE_ERROR",
      description: `Failed to upgrade user role: ${errorMessage}`,
      actionBy: req?.user?.id || "Unknown",
      metaData: { userId, newRole },
    });
    sendError(res, `Failed to upgrade user role: ${errorMessage}`, 500);
  }
};

export const getUser: ExpressHandler = async (req, res) => {
  const { userId } = req.params;

  try {
    const user = await User.findById(userId).select("-password");
    if (!user) {
      logActivity({
        event: "GET_USER_FAILED",
        description: "User not found",
        actionBy: req?.user?.id || "Unknown",
        metaData: { userId },
      });
      return sendError(res, "User not found", 404);
    }

    logActivity({
      event: "GET_USER_SUCCESS",
      description: "User fetched successfully",
      actionBy: req?.user?.id || "Unknown",
      metaData: { userId, user },
    });

    sendSuccess(res, user, "User fetched successfully");
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
    logActivity({
      event: "GET_USER_ERROR",
      description: `Failed to fetch user: ${errorMessage}`,
      actionBy: req?.user?.id || "Unknown",
      metaData: { userId },
    });
    sendError(res, `Failed to fetch user: ${errorMessage}`, 500);
  }
};

export const getAllUsers: ExpressHandler = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    if (!users.length) {
      logActivity({
        event: "GET_ALL_USERS_FAILED",
        description: "No users found",
        actionBy: req?.user?.id || "Unknown",
      });
      return sendError(res, "No users found", 404);
    }

    logActivity({
      event: "GET_ALL_USERS_SUCCESS",
      description: "Users fetched successfully",
      actionBy: req?.user?.id || "Unknown",
      metaData: { count: users.length },
    });

    sendSuccess(res, users, "Users fetched successfully");
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
    logActivity({
      event: "GET_ALL_USERS_ERROR",
      description: `Failed to fetch users: ${errorMessage}`,
      actionBy: req?.user?.id || "Unknown",
    });
    sendError(res, `Failed to fetch users: ${errorMessage}`, 500);
  }
};

export const getCurrentUser: ExpressHandler = async (req, res) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      logActivity({
        event: "GET_CURRENT_USER_FAILED",
        description: "User not found",
        actionBy: req?.user?.id || "Unknown",
      });
      return sendError(res, "User not found", 404);
    }

    const user = await User.findById(userId).select("-password");

    if (!user) {
      logActivity({
        event: "GET_CURRENT_USER_FAILED",
        description: "User not found",
        actionBy: req?.user?.id || "Unknown",
      });
      return sendError(res, "User not found", 404);
    }

    logActivity({
      event: "GET_CURRENT_USER_SUCCESS",
      description: "Current user fetched successfully",
      actionBy: req?.user?.id || "Unknown",
      metaData: { userId, user },
    });

    sendSuccess(res, user, "Current user fetched successfully");
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
    logActivity({
      event: "GET_CURRENT_USER_ERROR",
      description: `Failed to fetch current user: ${errorMessage}`,
      actionBy: req?.user?.id || "Unknown",
    });
    sendError(res, `Failed to fetch current user: ${errorMessage}`, 500);
  }
};
