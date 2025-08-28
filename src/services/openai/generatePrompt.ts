import prompts from "../../common/config/promptTemplates";
import { replacePlaceholders } from "../CreateDesign/helpers/utils";

import { callOpenAI } from "../openai/index";

export const generateEnhancedPrompt = async (
  idea: string,
  answers: any,
  backgroundColor: string,
  productType: string
): Promise<string> => {
  const prompt = prompts.find((p) => p.name === "REFINE_PROMPT");
  if (!prompt) {
    throw new Error("REFINE_PROMPT configuration not found.");
  }

  const { system, user } = prompt;
  if (!system?.message || !user?.message) {
    throw new Error(
      "REFINE_PROMPT is missing 'system' or 'user' message template."
    );
  }
  const objectToSend = {
    idea: idea,
    answers: answers,
    backgroundColor,
    productType,
  };
  console.log("objectToSend", objectToSend);
  console.log("user.message", user.message);
  const userMessage = replacePlaceholders(user.message, { objectToSend });

  const systemMessage = system.message;

  const messages = [
    { role: "system", content: systemMessage },
    { role: "user", content: userMessage },
  ];
  console.log("systemsystem", systemMessage);
  console.log("useruser", userMessage);
  try {
    const response = await callOpenAI(messages);
    return response;
  } catch (error: any) {
    console.error("OpenAI API Error:", error.response?.data || error.message);
    throw new Error("Failed to generate enhanced prompt.");
  }
};
