import prompts from "../../config/promptTemplates";

import { callOpenAI } from "../openai/index";

export const generateEnhancedPrompt = async (
  description: string
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
  const userMessage = user.message.replace("{{description}}", description);
  const systemMessage = system.message;

  const messages = [
    { role: "system", content: systemMessage },
    { role: "user", content: userMessage },
  ];

  try {
    const response = await callOpenAI(messages);
    return response;
  } catch (error: any) {
    console.error("OpenAI API Error:", error.response?.data || error.message);
    throw new Error("Failed to generate enhanced prompt.");
  }
};
