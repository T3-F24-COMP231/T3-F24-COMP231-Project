import { Request, Response } from "express";
import { ExpressHandler } from "../types";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import config from "../config/config";
import { sendError, sendSuccess } from "../utils";
import User from "../models/User";

export const Signup: ExpressHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { name, email, password, role = "Finance Tracker" } = req.body;

  try {
    // Check if user already exists based on email
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(400).json({ message: "User already exists with this email" });
    }

    // Hash the password before storing
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user with the default role as 'Gym Member'
    const newUser = new User({
      name,
      email,
      role,
      password: hashedPassword,
    });

    // Save the user to the database
    await newUser.save();

    res.status(201).json({
      message: "User created successfully as Finance Tracker",
      user: newUser,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

export const Login: ExpressHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { email, password } = req.body;

  try {
    // Check if the user exists
    const user = await User.findOne({ email });
    if (!user) {
      res.status(400).json({ message: "Invalid email or password" });
      return;
    }

    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      res.status(400).json({ message: "Invalid email or password" });
      return;
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id, role: user.role },
      config.jwtSecret,
      {
        expiresIn: "1h", // Set token expiration as per your requirement
      }
    );

    sendSuccess(res, { token, user }, "Login successful");
  } catch (error) {
    sendError(res, "Server error", 500);
  }
};