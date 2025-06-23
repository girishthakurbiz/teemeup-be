import { Request, Response, NextFunction } from 'express';

export class BadRequestError extends Error {
  constructor(message: string) {
    super(message);
    Object.setPrototypeOf(this, BadRequestError.prototype);
    this.name = 'BadRequestError';
  }
}

export class NotFoundRequestError extends Error {
  constructor(message: string) {
    super(message);
    Object.setPrototypeOf(this, NotFoundRequestError.prototype);
    this.name = 'NotFoundRequestError';
  }
}


// Custom error handler middleware
export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error(err.stack); // Log the error for debugging

  let statusCode = 500; // Default status code
  let errorMessage = 'Internal Server Error'; // Default error message

  if (err instanceof BadRequestError) {
    statusCode = 400;
    errorMessage = err.message;
  } else if(err instanceof NotFoundRequestError) {
    statusCode = 404;
    errorMessage = err.message;
  }

  // Send an error response
  res.status(statusCode).json({
    message: errorMessage,
    error: err.name // Optionally send the error name/type
  });
};