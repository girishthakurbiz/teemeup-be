import { Request, Response } from "express";

export const createImage = async (req: Request, res: Response) => {
  try {
    
    return res.json("createImage");
  } catch (error) {
    console.log("Error in createImage", error);
    return res
      .status(500)
      .json({ error: "Error in createImage.", data: error });
  }
};
