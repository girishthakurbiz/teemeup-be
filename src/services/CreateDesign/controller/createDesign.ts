import { NextFunction, Request, Response } from "express";
import { successHandler } from "../../../middlewares/resHandler";
import { generateEnhancedPrompt } from "../../openai/generatePrompt";

interface EnhancedPrompt {
  refined_description: string;
  audience_inference: string;
  design_type: "Visual" | "Text-Based" | "Hybrid";
  final_prompt: string;
}
export const createImage = async (req: any, res: any, next: any) => {
  const { description } = req.body;
  console.log("description", description);

  try {
    if (!description || typeof description !== "string") {
      return res
        .status(400)
        .json({ error: "Missing or invalid description in request body." });
    }
    const rawOutput = await generateEnhancedPrompt(description);
    let enhancedPrompt: EnhancedPrompt;

    try {
      enhancedPrompt = JSON.parse(rawOutput);
    } catch (err) {
      console.error("Failed to parse OpenAI response:", err);
      res.status(500).json({ error: "Invalid response format from OpenAI." });
      return;
    }

    console.log("enhancedPrompt", enhancedPrompt?.final_prompt);

    successHandler(
      {
        data: {
          design_id: "design_id",
          final_prompt: enhancedPrompt.final_prompt,
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
