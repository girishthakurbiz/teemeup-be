import dotenv from "dotenv";
dotenv.config();

import express from "express";
import bodyParser from "body-parser";

import { errorHandler } from "./middlewares/resHandler";
import utilRouter from "./services/UtilService/router";
// import userImageRouter from "./services/GetDesign/router";
import createDesignRouter from "./services/CreateDesign/router";

const app = express();
const port = process.env.PORT || 8000;
const cors = require("cors");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

app.get("/", (req, res) => {
  res.send("Welcome to the Teemeup App!");
});

app.use("/createdesign", createDesignRouter);
app.use("/getdesign", userImageRouter);
app.use("/util", utilRouter);
app.use(errorHandler);

app.listen(port, () => {
  console.log(`server is listening on http://localhost:${port}....`);
});
