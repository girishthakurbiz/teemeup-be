import { Router } from "express";
import { generateImagePrompt } from "../controller/createDesign";
import { getNextResponse } from "../controller/getNextResponse";

const createDesignRouter = Router(); 

createDesignRouter.post("/generateEnhancedPrompt", generateImagePrompt); 
createDesignRouter.post("/getNextResponse", getNextResponse); 

export default createDesignRouter;
