

import express from "express";
import bodyParser from "body-parser";

import { errorHandler } from "./middlewares/resHandler";
import utilRouter from "./services/UtilService/router";
// import userImageRouter from "./services/GetDesign/router";
import createDesignRouter from "./services/CreateDesign/router";
import { fetchAndStoreModels } from "./utils/fetchAndStoreModels";
import { setupSocket } from "./services/sockets/socket"; // 👈 import socket handler
import { createServer } from "http";
import { Server } from "socket.io";
import dotenv from "dotenv";
dotenv.config();
const app = express();
const port = process.env.PORT || 8000;
const cors = require("cors");
const httpServer = createServer(app);

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
// Attach socket.io to server
const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});
// Setup socket.io handlers
setupSocket(io); // 👈 initialize socket logic
(async () => {
  try {
    // await fetchAndStoreModels(); // fetch from Leonardo and store in toolMap file
    console.log("Model data fetched and stored.");

    httpServer.listen(port, () => {
      console.log(`Server is running on http://localhost:${port}`);
    });
  } catch (err) {
    console.error("Error during server startup:", err);
    process.exit(1);
  }
})();
