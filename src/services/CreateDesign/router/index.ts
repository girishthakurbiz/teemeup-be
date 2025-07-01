import { Router } from "express";
import { createImage } from "../controller/createDesign";

const createDesignRouter = Router();

createDesignRouter.get("/createImage", createImage);

export default createDesignRouter;
