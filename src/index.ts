import dotenv from "dotenv";
dotenv.config();

import express from "express";
import bodyParser from "body-parser";

import { errorHandler } from "./middlewares/resHandler";
import utilRouter from "./services/UtilService/router";
import userImageRouter from "./services/GetDesign/router";
import { createImage } from "./services/CreateDesign/controller/createDesign";

const app = express();
const port = process.env.PORT || 8000;
const cors = require("cors");

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.get("/", (req, res) => {
  res.send("Welcome to the Teemeup App!");
});

app.use(errorHandler);
app.use("/createdesign",createImage);
app.use("/getdesign", userImageRouter);
app.use("/util", utilRouter);

app.listen(port, () => {
  console.log(`server is listening on http://localhost:${port}....`);
});
