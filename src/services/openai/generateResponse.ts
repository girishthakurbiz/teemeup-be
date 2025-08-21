import prompts from "../../config/promptTemplates";
import { replacePlaceholders } from "../CreateDesign/helpers/utils";

import { callOpenAI } from "../openai/index";


export const generateNextResponse = async (object: any): Promise<string> => {
  const prompt = prompts.find((p) => p.name === "GET_NEXT_RESPONSE");
  if (!prompt) {
    throw new Error("GET_NEXT_RESPONSE configuration not found.");
  }

  const { system, user } = prompt;
  if (!system?.message || !user?.message) {
    throw new Error(
      "GET_NEXT_RESPONSE is missing 'system' or 'user' message template."
    );
  }
  console.log("object11", object);
  const systemMessage = replacePlaceholders(system.message, object);

  const userMessage = replacePlaceholders(user.message, { object }); // wrap in object if using {{object}}

  const messages = [
    { role: "system", content: systemMessage },
    { role: "user", content: userMessage },
  ];  
  console.log("objesystemMessagect11", systemMessage);

  console.log("userMessageuserMessage", userMessage);

  try {
    const response = await callOpenAI(messages);
    console.log("response1122", response);
    return response;
  } catch (error: any) {
    console.error("OpenAI API Error:", error.response?.data || error.message);
    throw new Error("Failed to generate enhanced prompt.");
  }
};
