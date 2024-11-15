import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import config from "../config/config";
import { sendError, sendSuccess } from "../utils";
import User from "../models/userModel";
import { ExpressHandler } from "../types";

export const Signup: ExpressHandler = async (req, res) => {
  const { name, email, password, role = "Finance Tracker" } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return sendError(res, "User already exists with this email", 400);
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      role,
    });

    await newUser.save();

    sendSuccess(res, newUser, "User created successfully as Finance Tracker");
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
    sendError(res, `Failed to create user: ${errorMessage}`, 500);
  }
};

export const Login: ExpressHandler = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return sendError(res, "Invalid email or password", 400);
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return sendError(res, "Invalid email or password", 400);
    }

    const token = jwt.sign(
      { userId: user._id, role: user.role },
      config.jwtSecret,
      { expiresIn: "1h" }
    );

    sendSuccess(res, { token, user }, "Login successful");
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
    sendError(res, `Failed to log in: ${errorMessage}`, 500);
  }
};
