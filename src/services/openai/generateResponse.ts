import prompts from "../../common/config/promptTemplates";
import {
  replacePlaceholders,
  safeJSONParse,
} from "../CreateDesign/helpers/utils";

import { callOpenAI } from "../openai/index";

const checkFromInteruptHandler = async (object) => {
  const prompt = prompts.find((p) => p.name === "INTERRUPT_HANDLER");
  if (!prompt) throw new Error("INTERRUPT_HANDLER configuration not found.");
  const { system, user } = prompt;
  const { answers } = object;

  const lastAnswer = answers.at(-1);
  const context = {
    idea: object.idea,
    lastBotQuestion: lastAnswer?.question ?? "",
    userMessage: lastAnswer?.answer ?? "",
    answers: object.answers,
    currentTopic: lastAnswer?.topic ?? "",
  };
  const systemMessage = replacePlaceholders(system.message, context);
  const userMessage = replacePlaceholders(user.message, context);

  const messages = [
    { role: "system", content: systemMessage },
    { role: "user", content: userMessage },
  ];

  try {
    const rawResponse = await callOpenAI(messages);
    const response = safeJSONParse(rawResponse);

    if (["clarification", "unrelated"].includes(response?.type)) {
      const question = {
        topic: lastAnswer.topic,
        question: response?.response ?? "",
        example: null,
        status: "unanswered",
      };

      return {
        design_id: "design_id",
        greeting: "",
        question: question,
        topics: object.topics_covered,
      };
    }
    return null;
  } catch (err: any) {
    console.error(
      "Interrupt Handler Error:",
      err.response?.data || err.message
    );
    throw new Error("Failed to run interrupt handler.");
  }
};

export const generateNextResponse = async (object: any): Promise<string> => {
  const prompt = prompts.find((p) => p.name === "GET_NEXT_RESPONSE");
  if (!prompt) {
    throw new Error("GET_NEXT_RESPONSE configuration not found.");
  }
  if (object.answers.length) {
    const lastAnswerObject = object.answers?.at(-1);

    if (lastAnswerObject.status && lastAnswerObject.status !== "skipped") {
      const interruptResponse = await checkFromInteruptHandler(object);
      if (interruptResponse) return JSON.stringify(interruptResponse);
    }
  }
  const { system, user } = prompt;
  if (!system?.message || !user?.message) {
    throw new Error(
      "GET_NEXT_RESPONSE is missing 'system' or 'user' message template."
    );
  }
  const systemMessage = replacePlaceholders(system.message, object);

  const userMessage = replacePlaceholders(user.message, { object });

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
