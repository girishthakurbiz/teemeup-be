import { NextFunction, Request, Response } from "express";
import { successHandler } from "../../../middlewares/resHandler";

export const getImage = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // const { design_id } = req.params;
  const { design_id } = req.body;
  try {
    if (!design_id) {
      res.status(400).json({ message: "Please provide a design id" });
    }
    // successHandler(
    //   {
    //     data: {
    //       design_link: "design_link",
    //     },
    //   },
    //   req,
    //   res,
    //   next
    // );
    return;
  } catch (error) {
    next(error);
  }
};