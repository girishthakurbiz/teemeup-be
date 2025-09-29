import { Request, Response, NextFunction } from "express";
import {
  sendClientError,
  sendServerError,
  successHandler,
} from "../../../middlewares/resHandler";
import { object } from "joi";
import { generateNextResponse } from "../../openai/generateResponse";
import { getTopicsCoveredFromIdea } from "../../openai/getTopicsCovered";
function getTopicsCovered(answers: any) {
  return answers.map((answer: any) => answer.topic);
}

export const getNextResponse = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response> => {
  const { idea, answers, topics, productType, color } = req.body;
  try {
    let topics_covered = topics;
    if (answers?.length > 0) {
 topics_covered = [
  ...new Set([
    ...topics_covered,
    ...getTopicsCovered(answers)
  ])
];    } else {
      const responseFromTopics = (await getTopicsCoveredFromIdea(idea)) as any;
      const parsedResponse = JSON.parse(responseFromTopics) || [];
      topics_covered = parsedResponse.topics_covered || [];

    }
    const objectToSend = {
      idea: idea,
      answers: answers,
      topics_covered: topics_covered,
      productType: productType,
      color: color,
    };

    const rawOutput = (await generateNextResponse(objectToSend)) as any;
    const response = JSON.parse(rawOutput);
    return successHandler(res, {
      design_id: "design_id", // Replace with real ID if available,
      greeting: response?.greeting,
      question: response?.questions,
      refinedDescription: response?.refinedDescription,
      finalPrompt: response?.finalPrompt,
      topics: topics_covered,
    });
  } catch (error) {
    return sendServerError(res, error);
  }
};
