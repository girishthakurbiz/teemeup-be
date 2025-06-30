import { Request, Response } from "express";

export const utils = async (req: Request, res: Response) => {
  try {
    
    return res.json("Utils");
  } catch (error) {
    console.log("Error in Utils", error);
    return res
      .status(500)
      .json({ error: "Error in Utils.", data: error });
  }
};
