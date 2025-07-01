import { NextFunction, Request, Response } from "express";
import { successHandler } from "../../../middlewares/resHandler";

export const createImage = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // const { prompt } = req.params;
  const { prompt } = req.body;
  try {
    if (!prompt) {
      res.status(400).json({ message: "Please provide a prompt" });
    }
    successHandler(
      {
        data: {
          design_id: "design_id",
        },
      },
      req,
      res,
      next
    );
    return;
  } catch (error) {
    next(error);
  }
};
