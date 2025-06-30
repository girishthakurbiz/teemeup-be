import { NextFunction, Request, Response } from "express";
import Joi from "joi";

export const validateSchema = (schema: Joi.ObjectSchema<any>) => {
  return async function (req: Request, res: Response, next: NextFunction) {
    const { error } = schema.validate(req.body, { abortEarly: false });

    if (error) {
      const errorMessage = error.details.map((err) => err.message).join(", ");
      return res.status(400).json({ message: errorMessage });
    } else {
      next();
    }
  };
};
