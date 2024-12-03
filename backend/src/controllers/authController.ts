import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import config from "../config/config";
import { extractDeviceInfo, logActivity, sendError, sendSuccess } from "../utils";
import User from "../models/userModel";
import { ExpressHandler } from "../types";

export const Signup: ExpressHandler = async (req, res) => {
  const { name, email, password, role = "Finance Tracker" } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      await logActivity({
        event: "USER_SIGNUP_FAILED",
        description: `Signup attempt failed. User already exists with email: ${email}`,
        actionBy: "SYSTEM",
        metaData: { email, ...extractDeviceInfo(req) },
      });
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

    await logActivity({
      event: "USER_SIGNUP",
      description: `New user signed up: ${name} as ${role}`,
      actionBy: newUser._id,
      metaData: { userId: newUser._id, role, ...extractDeviceInfo(req) },
    });

    sendSuccess(res, newUser, "User created successfully as Finance Tracker");
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
    await logActivity({
      event: "USER_SIGNUP_ERROR",
      description: `Signup failed for email: ${email}`,
      actionBy: "SYSTEM",
      metaData: { error: errorMessage, ...extractDeviceInfo(req) },
    });
    sendError(res, `Failed to create user: ${errorMessage}`, 500);
  }
};

export const Login: ExpressHandler = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      await logActivity({
        event: "USER_LOGIN_FAILED",
        description: `Login attempt failed for email: ${email}. User not found.`,
        actionBy: "SYSTEM",
        metaData: { email, ...extractDeviceInfo(req) },
      });
      return sendError(res, "Invalid email or password", 400);
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      await logActivity({
        event: "USER_LOGIN_FAILED",
        description: `Login attempt failed for email: ${email}. Incorrect password.`,
        actionBy: "SYSTEM",
        metaData: { email, ...extractDeviceInfo(req) },
      });
      return sendError(res, "Invalid email or password", 400);
    }

    const token = jwt.sign(
      { userId: user._id, role: user.role },
      config.jwtSecret,
      { expiresIn: "1h" }
    );

    await logActivity({
      event: "USER_LOGIN",
      description: `${user.name} logged in successfully.`,
      actionBy: user._id,
      metaData: { userId: user._id, ...extractDeviceInfo(req) },
    });

    sendSuccess(res, { token, user }, "Login successful");
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
    await logActivity({
      event: "USER_LOGIN_ERROR",
      description: `Login failed for email: ${email}`,
      actionBy: "SYSTEM",
      metaData: { error: errorMessage, ...extractDeviceInfo(req) },
    });
    sendError(res, `Failed to log in: ${errorMessage}`, 500);
  }
};


export const Logout: ExpressHandler = async (req, res) => {
  try {
    const { user } = req;

    await logActivity({
      event: "USER_LOGOUT",
      description: `${user?.name} logged out successfully.`,
      actionBy: user?._id || "SYSTEM",
      metaData: { userId: user?._id, ...extractDeviceInfo(req) },
    });

    sendSuccess(res, null, "User logged out successfully");
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
    await logActivity({
      event: "USER_LOGOUT_ERROR",
      description: `Logout failed for userId: ${req.user?._id}`,
      actionBy: "SYSTEM",
      metaData: { error: errorMessage, ...extractDeviceInfo(req) },
    });
    sendError(res, `Failed to log out: ${errorMessage}`, 500);
  }
};

