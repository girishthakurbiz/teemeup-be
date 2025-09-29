import { Request, Response, NextFunction } from "express";
import {
  sendClientError,
  sendServerError,
  successHandler,
} from "../../../middlewares/resHandler";
import { generateEnhancedPrompt } from "../../openai/generatePrompt";

interface EnhancedPrompt {
  refined_description: string;
  audience_inference: string; // category
  design_type: "Visual" | "Text-Based" | "Hybrid";
  final_prompt: string;
  category_name: string; // Mapped category from predefined list
}

export const generateImagePrompt = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response> => {
  const { idea, answers, backgroundColor, productType, user_inputs } = req.body;

  if (typeof idea !== "string" || !idea.trim()) {
    return sendClientError(res, "Missing or invalid 'idea' in request body.");
  }
  try {
    const rawOutput = await generateEnhancedPrompt(idea, answers,backgroundColor, productType, user_inputs );

    let enhancedPrompt: EnhancedPrompt;
    try {
      enhancedPrompt = JSON.parse(rawOutput);
    } catch (parseErr) {
      console.error("Failed to parse OpenAI response:", parseErr);
      return sendServerError(
        res,
        parseErr,
        "Invalid response format from OpenAI."
      );
    }
    let toolResult;
    return successHandler(res, {
      data: {
        design_id: "design_id", // Replace with real ID if available
        enhancedPrompt : enhancedPrompt,
      },
    });
  } catch (error) {
    return sendServerError(res, error);
  }
};
