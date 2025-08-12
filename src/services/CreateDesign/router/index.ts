import { Router } from "express";
import { createImage } from "../controller/createDesign";
import { getNextResponse } from "../controller/getNextResponse";

const createDesignRouter = Router(); 

createDesignRouter.post("/createImage", createImage); 
createDesignRouter.post("/getNextResponse", getNextResponse); 

export default createDesignRouter;
