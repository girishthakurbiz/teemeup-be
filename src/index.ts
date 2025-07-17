import dotenv from "dotenv";
dotenv.config();

import express from "express";
import bodyParser from "body-parser";

import { errorHandler } from "./middlewares/resHandler";
import utilRouter from "./services/UtilService/router";
// import userImageRouter from "./services/GetDesign/router";
import createDesignRouter from "./services/CreateDesign/router";
import { fetchAndStoreModels } from "./utils/fetchAndStoreModels";

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
// app.use("/getdesign", userImageRouter);
app.use("/util", utilRouter);
app.use(errorHandler);

(async () => {
  try {
    // await fetchAndStoreModels(); // fetch from Leonardo and store in toolMap file
    console.log("Model data fetched and stored.");

    app.listen(port, () => {
      console.log(`Server is running on http://localhost:${port}`);
    });
  } catch (err) {
    console.error("Error during server startup:", err);
    process.exit(1);
  }
})();
