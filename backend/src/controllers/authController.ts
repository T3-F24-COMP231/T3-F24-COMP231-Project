import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { extractDeviceInfo, logActivity, sendError, sendSuccess } from "../utils";
import User from "../models/userModel";
import { ExpressHandler } from "../types";
require('dotenv').config();

export const Signup: ExpressHandler = async (req, res) => {
  const { name, email, password, role = "Finance Tracker" } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      await logActivity({
        event: "USER_SIGNUP_FAILED",
        description: `Signup attempt failed. User already exists with email: ${email}`,
        actionBy: null,
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
      actionBy: req?.user?.id || null,
      metaData: { userId: newUser._id, role, ...extractDeviceInfo(req) },
    });

    sendSuccess(res, newUser, "User created successfully as Finance Tracker");
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
    await logActivity({
      event: "USER_SIGNUP_ERROR",
      description: `Signup failed for email: ${email}`,
      actionBy: req?.user?.id || null,
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
        actionBy: req?.user?.id || null,
        metaData: { email, ...extractDeviceInfo(req) },
      });
      return sendError(res, "Invalid email or password", 400);
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      await logActivity({
        event: "USER_LOGIN_FAILED",
        description: `Login attempt failed for email: ${email}. Incorrect password.`,
        actionBy: req?.user?.id || null,
        metaData: { email, ...extractDeviceInfo(req) },
      });
      return sendError(res, "Invalid email or password", 400);
    }

    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET as string,
      { expiresIn: "1h" }
    );

    await logActivity({
      event: "USER_LOGIN",
      description: `${user.name} logged in successfully.`,
      actionBy: req?.user?.id || null,
      metaData: { userId: user._id, ...extractDeviceInfo(req) },
    });

    sendSuccess(res, { token, user }, "Login successful");
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
    await logActivity({
      event: "USER_LOGIN_ERROR",
      description: `Login failed for email: ${email}`,
      actionBy: req?.user?.id || null,
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
      actionBy: user?.name || "SYSTEM",
      metaData: { user: user?.name, ...extractDeviceInfo(req) },
    });

    sendSuccess(res, null, "User logged out successfully");
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
    await logActivity({
      event: "USER_LOGOUT_ERROR",
      description: `Logout failed for ${req.user?.name}`,
      actionBy: req?.user?.id || null,
      metaData: { error: errorMessage, ...extractDeviceInfo(req) },
    });
    sendError(res, `Failed to log out: ${errorMessage}`, 500);
  }
};

