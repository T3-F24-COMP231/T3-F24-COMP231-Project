import { Request } from "express";
import { ActivityMetaData } from "../types";

/**
 * Extracts device information from the request.
 *
 * @param {Request} req - The Express request object.
 * @returns {ActivityMetaData} Device information metadata.
 */
export const extractDeviceInfo = (req: Request): ActivityMetaData => {
  const ipAddress = req.headers["x-forwarded-for"] || req.connection.remoteAddress;
  const userAgent = req.headers["user-agent"] || "Unknown";

  return {
    ipAddress: typeof ipAddress === "string" ? ipAddress : ipAddress?.[0],
    userAgent,
  };
};