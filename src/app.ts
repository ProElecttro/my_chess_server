// src/app.ts

import "reflect-metadata";
import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import AppDataSouce from "./ormconfig";
import handleSocketEvents from "./socketHandlers";

const app = express();
const port = 8000;
const httpServer = createServer(app);
const io = new Server(httpServer);

app.get('/', (req, res) => {
  console.log("Hello world!");
  res.send("hello world!");
})

AppDataSource.initialize()
  .then(() => {
    console.log('Database connected successfully');
    handleSocketEvents(io);
    httpServer.listen(port, '0.0.0.0', () => {
      console.log(`Server running on http://localhost:${port}`);
    });
    
  })
  .catch((error) => {
    console.error('Database connection error', error);
  });
