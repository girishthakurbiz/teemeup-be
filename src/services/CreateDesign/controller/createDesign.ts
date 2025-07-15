import { Request, Response, NextFunction } from "express";
import {
  sendClientError,
  sendServerError,
  successHandler,
} from "../../../middlewares/resHandler";
import { generateEnhancedPrompt } from "../../openai/generatePrompt";
import { dispatchToolByCategory } from "../../../tools/dispatcher";

interface EnhancedPrompt {
  refined_description: string;
  audience_inference: string; // category
  design_type: "Visual" | "Text-Based" | "Hybrid";
  final_prompt: string;
}

export const createImage = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response> => {
  const { description } = req.body;

  if (typeof description !== "string" || !description.trim()) {
    return sendClientError(
      res,
      "Missing or invalid 'description' in request body."
    );
  }

  try {
    const rawOutput = await generateEnhancedPrompt(description);

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

    const category = enhancedPrompt.audience_inference;
    const finalPrompt = enhancedPrompt.final_prompt;

    let toolResult;
    try {
      toolResult = await dispatchToolByCategory(category, finalPrompt);
    } catch (toolErr) {
      return sendServerError(
        res,
        toolErr,
        "Failed to generate image using selected tool."
      );
    }

    return successHandler(res, {
      data: {
        design_id: "design_id", // Replace with real ID if available
        final_prompt: finalPrompt,
        generated_by: toolResult.provider,
        image_url: toolResult.imageUrl,
      },
    });
  } catch (error) {
    return sendServerError(res, error);
  }
};
