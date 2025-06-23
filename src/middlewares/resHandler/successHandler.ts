import { Request, Response, NextFunction } from 'express';

// Generic success handler middleware
export const successHandler = (
  data: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  res.status(200).json(data);
};