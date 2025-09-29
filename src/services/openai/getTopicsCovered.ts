import { callOpenAI } from ".";
import prompts from "../../common/config/promptTemplates";
import { replacePlaceholders } from "../CreateDesign/helpers/utils";

export const getTopicsCoveredFromIdea = async (idea: any): Promise<string> => {
  const prompt = prompts.find((p) => p.name === "CHECK_TOPICS_COVERED");
  if (!prompt) {
    throw new Error("CHECK_TOPICS_COVERED configuration not found.");
  }

  const { system, user } = prompt;
  if (!system?.message || !user?.message) {
    throw new Error(
      "CHECK_TOPICS_COVERED is missing 'system' or 'user' message template."
    );
  }
 const systemMessage = replacePlaceholders(system.message, idea);

  const userMessage = replacePlaceholders(user.message, { idea }); // wrap in object if using {{object}}

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