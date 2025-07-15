import { Request, Response, NextFunction } from 'express';

export const successHandler = (
  res: Response,
  data: any,
  message = "Request successful",
  statusCode = 200
) => {
  return res.status(statusCode).json({ success: true, message, data });
};

export const sendClientError = (
  res: Response,
  message = "Bad request",
  statusCode = 400
) => {
  return res.status(statusCode).json({ success: false, message });
};

export const sendServerError = (
  res: Response,
  error: any,
  message = "Internal server error",
  statusCode = 500
) => {
  console.error("Server error:", error);
  return res.status(statusCode).json({
    success: false,
    message,
    error: error?.message || error,
  });
};
