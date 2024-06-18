// src/app.ts
import "reflect-metadata";
import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import AppDataSource from "./ormconfig";
import { handleSocketEvents } from "./socketHandlers";

const app = express();
const port = 3002;
const httpServer = createServer(app);
const io = new Server(httpServer);



AppDataSource.initialize()
  .then(() => {
    console.log('Database connected successfully');
    handleSocketEvents(io);
    httpServer.listen(port, () => {
      console.log(`Server running on http://localhost:${port}`);
    });
  })
  .catch((error) => {
    console.error('Database connection error', error);
  });
