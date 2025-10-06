import prompts from "../../common/config/promptTemplates";
import { replacePlaceholders } from "../CreateDesign/helpers/utils";

import { callOpenAI } from "../openai/index";

const checkFromInteruptHandler = async (object) => {
  const prompt = prompts.find((p) => p.name === "INTERRUPT_HANDLER");
  if (!prompt) throw new Error("INTERRUPT_HANDLER configuration not found.");

  const { system, user } = prompt;

  const { answers } = object;

  const context = {
    idea: object.idea,
    lastBotQuestion: answers.length ? answers[answers.length - 1].question : "",
    userMessage: answers.length ? answers[answers.length - 1].answer : "",
    answers: object.answers,
    currentTopic: answers.length ? answers[answers.length - 1].topic : "",
  };
  const systemMessage = replacePlaceholders(system.message, context);
  const userMessage = replacePlaceholders(user.message, context);

  const messages = [
    { role: "system", content: systemMessage },
    { role: "user", content: userMessage },
  ];

  try {
    const res = await callOpenAI(messages);
    const response = JSON.parse(res);
    console.log("response", response);

    if (response.type === "clarification" || response.type === "unrelated") {
      const question = {
        topic: answers[answers.length - 1].topic,
        question: response.response,
        example: null,
        status: "unanswered",
      };

      return {
        design_id: "design_id",
        greeting: "",
        question: question,
        topics: object.topics_covered,
      };
    } else {
      return null;
    }
    return JSON.parse(response); // ensure handler returns parsed JSON
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
    const lastObject = object.answers[object.answers.length - 1];
    if (lastObject.status && lastObject.status !== "skipped") {
      const answersCheck = await checkFromInteruptHandler(object);
      console.log("answersCheckanswersCheck", answersCheck);
      if (answersCheck) {
        return JSON.stringify(answersCheck);
      }
    }
  }
  const { system, user } = prompt;
  if (!system?.message || !user?.message) {
    throw new Error(
      "GET_NEXT_RESPONSE is missing 'system' or 'user' message template."
    );
  }
  const systemMessage = replacePlaceholders(system.message, object);

  const userMessage = replacePlaceholders(user.message, { object }); // wrap in object if using {{object}}

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
