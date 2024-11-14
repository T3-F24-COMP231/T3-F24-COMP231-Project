import { Request, Response } from "express";
import User from "../models/User";
import mongoose from "mongoose";

// Utility function for sending responses
const sendError = (res: Response, message: string, status: number = 400) => {
  res.status(status).json({ status: "error", message });
};

const sendSuccess = (res: Response, data: any, message: string = "Success") => {
  res.status(200).json({ status: "success", data, message });
};

// Upgrade User Role
export const upgradeUserRole = async (req: Request, res: Response): Promise<void> => {
  const { newRole, userId } = req.body;

  // Validate new role
  const validRoles = ["Finance Tracker", "Debt Repayer", "Financial Expert", "Investor", "Administrator"];
  if (!validRoles.includes(newRole)) {
    return sendError(res, "Invalid role", 400);
  }

  try {
    // Find the user by ID
    const user = await User.findById(userId);
    if (!user) {
      return sendError(res, "User not found", 404);
    }

    // Upgrade the user's role
    user.role = newRole;

    // If upgrading to Financial Expert, assign clients
    if (newRole === "Financial Expert") {
      // Find unassigned Finance Tracker users
      const unassignedClients = await User.find({ role: "Finance Tracker", assignedExpert: null });

      if (unassignedClients.length === 0) {
        return sendError(res, "No available clients to assign", 404);
      }

      // Randomly select up to 5 clients
      const maxClients = 5;
      const assignedClients = unassignedClients
        .sort(() => 0.5 - Math.random()) // Shuffle array
        .slice(0, maxClients)
        .map((client) => client._id as mongoose.Types.ObjectId);

      // Assign clients to the Financial Expert
      user.assignedClients = assignedClients;

      // Update each assigned client to reference the new Financial Expert
      await User.updateMany(
        { _id: { $in: assignedClients } },
        { $set: { assignedExpert: user._id } }
      );
    }

    // Save the updated user
    await user.save();

    sendSuccess(res, user, `User upgraded to ${newRole}`);
  } catch (error) {
    sendError(res, "Server error", 500);
  }
};
