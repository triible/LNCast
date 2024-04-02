import Express from "express";
import cors from "cors";
import dotenv from "dotenv"
import Router from "./src/router/index.js";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import config from "./src/config.js";
import http from "http";
import webSocket from "./src/websocket/index.js";
import { Server } from 'socket.io';

const app = Express();
const server = http.createServer(app);
const serverIO = new Server(server, {cors: {origin: '*'}})

export { serverIO };

webSocket(serverIO);

dotenv.config();

app.use(cors({ origin: "*" }));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));



app.use("/api", Router);


const PORT = process.env.PORT;

mongoose
  .connect(config.MONGODB_URL)
  .then(() => {
    server.listen(PORT, () => {
        console.log("Messenger is running on: " + config.PORT);
    });
  })
  .catch((err) => {
    console.log(err);
  });
