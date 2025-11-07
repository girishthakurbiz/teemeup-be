import { Request, Response, NextFunction } from "express";
import {
  sendServerError,
  successHandler,
} from "../../../middlewares/resHandler";
import { generateNextResponse } from "../../openai/generateResponse";
import { getTopicsCoveredFromIdea } from "../../openai/getTopicsCovered";
import { CheckIdeaValidator } from "../../openai/checkIdea";
import { safeJSONParse } from "../helpers/utils";
function getTopicsCovered(answers: any) {
  return answers.map((answer: any) => answer.topic);
}

export const getNextResponse = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response> => {
  try {
    const { idea, answers = [], topics = [], productType, color,isIdeaValid } = req.body;
    let userIdea = idea;
    let topicsCovered = [...topics];
    let parsedIdeaResponse: any = null;


    // If it's not the first message and there are answers, update topics
    if (isIdeaValid && answers.length > 0) {
      topicsCovered = [...new Set([...topicsCovered, ...getTopicsCovered(answers)])];
    } else {
            // 🧠 If idea not valid yet → validate/refine it
      if (!isIdeaValid) {
        const lastAnswer = answers.at(-1)?.answer ?? idea;

        const ideaCheckerResponse = await CheckIdeaValidator(lastAnswer);
         parsedIdeaResponse = safeJSONParse(ideaCheckerResponse);

        if (parsedIdeaResponse?.validation === "invalid") {
          return successHandler(res, {
            design_id: "design_id",
            greeting: null,
            question: { question: parsedIdeaResponse.message },
            refinedDescription: userIdea,
            finalPrompt: null,
            topics: topicsCovered,
            idea_validation: "invalid",
          });
        } 

        userIdea = parsedIdeaResponse?.refinedIdea ?? userIdea;
      }

      // Update topics from idea
      const topicsResponse = await getTopicsCoveredFromIdea(userIdea);
      const parsedTopics = safeJSONParse(topicsResponse)
      topicsCovered = parsedTopics?.topics_covered ?? [];
    }

    const objectToSend = { idea: userIdea, answers, topics_covered: topicsCovered, productType, color , greeting: parsedIdeaResponse?.validation === 'valid'};
    const rawOutput = await generateNextResponse(objectToSend);
    const response = JSON.parse(rawOutput);

    return successHandler(res, {
      design_id: "design_id",
      greeting: response?.greeting,
      question: response?.questions || response?.question,
      refinedDescription: response?.refinedDescription,
      finalPrompt: response?.finalPrompt,
      topics: topicsCovered,
      idea_validation:'valid',
      idea: userIdea
    });
  } catch (error) {
    return sendServerError(res, error);
  }
};

