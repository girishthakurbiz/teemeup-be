import { Router } from "express";
import { createImage } from "../controller/createDesign"; 

const createDesignRouter = Router();
createDesignRouter.post("/createImage", createImage); 

export default createDesignRouter; 
