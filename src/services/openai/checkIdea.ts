import { callOpenAI } from ".";
import prompts from "../../common/config/promptTemplates";
import { replacePlaceholders } from "../CreateDesign/helpers/utils";

export const CheckIdeaValidator = async (idea: any): Promise<string> => {
  const prompt = prompts.find((p) => p.name === "IDEA_VALIDATION");
  if (!prompt) {
    throw new Error("IDEA_VALIDATION configuration not found.");
  }
  const { system, user } = prompt;
  if (!system?.message || !user?.message) {
    throw new Error(
      "IDEA_VALIDATION is missing 'system' or 'user' message template."
    );
  }
  const systemMessage = replacePlaceholders(system.message, {idea});

  const userMessage = replacePlaceholders(user.message, { idea });
  const messages = [
    { role: "system", content: systemMessage },
    { role: "user", content: userMessage },
  ];

  try {
    const response = await callOpenAI(messages);
    return response;
  } catch (error: any) {
    throw new Error("Failed to generate enhanced prompt.");
  }
};
