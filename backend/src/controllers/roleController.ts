import { Request, Response } from "express";
import { Role } from "../models";
import { ExpressHandler } from "../types";

// Add a new role
export const addRole: ExpressHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { name } = req.body;

    if (!name) {
      res
        .status(400)
        .json({ success: false, message: "Role name is required" });
      return;
    }

    const roleExists = await Role.findOne({ name });
    if (roleExists) {
      res.status(400).json({ success: false, message: "Role already exists" });
      return;
    }

    const role = await Role.create({ name });
    res.status(201).json({
      success: true,
      data: role,
      message: "Role created successfully",
    });
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({
        success: false,
        message: "Failed to create role",
        error: error.message,
      });
    }
  }
};

// Get all roles
export const getRoles: ExpressHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const roles = await Role.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: roles });
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({
        success: false,
        message: "Failed to fetch roles",
        error: error.message,
      });
    }
  }
};
