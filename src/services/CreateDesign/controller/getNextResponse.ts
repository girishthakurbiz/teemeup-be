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
  console.log("answersanswers", answers);
  console.log("ideaidea", idea);
  console.log("productType", productType);
  console.log("color", color);

  // const payload = {
  //   idea: "a cat",
  //   answers: [
  //     //   {
  //     //     topic: "visual style",
  //     //     question:
  //     //       "Would you say this fits more of a cute Cartoonish style or a more Realistic approach for the funny and quirky cat design?",
  //     //     example: "Cartoonish",
  //     //     status: "answered",
  //     //     answer: "cartoonish",
  //     //   },
  //     //   {
  //     //     topic: "theme",
  //     //     question:
  //     //       "For your cat design, would you prefer a Funny & Quirky theme or something more like a Streetwear vibe?",
  //     //     example: "Funny & Quirky",
  //     //     status: "skipped",
  //     //     answer: "null",
  //     //   },
  //     //   {
  //     //     topic: "scene or action",
  //     //     question:
  //     //       "What is the cat doing in your design? Is it playful, lounging, or maybe doing something quirky?",
  //     //     example: "Playful",
  //     //     status: "skipped",
  //     //     answer: "null",
  //     //   },
  //     //   {
  //     //     topic: "color mood",
  //     //     question:
  //     //       "How about the colors? Do you envision this cat being in a vibrant Neon palette or maybe a softer Pastel tone?",
  //     //     example: "Neon",
  //     //     status: "answered",
  //     //     answer: "Neon",
  //     //   },
  //     //   {
  //     //     topic: "text",
  //     //     question:
  //     //       "Would you like to include any fun phrase or quote with your cat design, or would you prefer it just showcasing the cat?",
  //     //     example: "Pawsitively Purrfect",
  //     //     status: "answered",
  //     //     answer: "no text",
  //     //   },
  //     //   {
  //     //     topic: "audience",
  //     //     question:
  //     //       "Is your cat design aimed at Kids, Adults, or perhaps Cat Lovers specifically?",
  //     //     example: "Cat Lovers",
  //     //     status: "skipped",
  //     //     answer: "null",
  //     //   },
  //   ],
  // };

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

      console.log("topics_covered_from_idea", topics_covered);
    }
    const objectToSend = {
      idea: idea,
      answers: answers,
      topics_covered: topics_covered,
    };
    console.log("topics_coveredtopics_covered", topics_covered);

    const rawOutput = (await generateNextResponse(objectToSend)) as any;
    console.log("rawOutput", rawOutput);
    const response = JSON.parse(rawOutput);
    console.log("rawOutputresponse111", response);
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
