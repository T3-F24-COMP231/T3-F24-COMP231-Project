import { Request, Response, NextFunction } from "express";

interface CustomError extends Error {
  status?: number;
}

export const errorHandler = (err: CustomError, req: Request, res: Response, next: NextFunction) => {
  const statusCode = err.status || 500;
  const message = err.message || "Internal Server Error";
  console.error(`[Error] ${message}`);
  res.status(statusCode).json({ success: false, message });
};
