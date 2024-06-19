import "reflect-metadata";
import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import cors from "cors";
import AppDataSource from "./ormconfig";
import handleSocketEvents from "./socketHandlers";

const app = express();
const port = 8000;

app.use(cors({
  origin: "*",
  methods: ["GET", "POST"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "*",
  }
});

app.get('/', (req, res) => {
  console.log("Hello world!");
  res.json({ message: "hello world!" });
});

AppDataSource.initialize()
  .then(() => {
    console.log('Database connected successfully');
    handleSocketEvents(io);
    httpServer.listen(port, '0.0.0.0', () => {
      console.log(`Server running on http://ec2-13-232-79-219.ap-south-1.compute.amazonaws.com:${port}/`);
    });
  })
  .catch((error) => {
    console.error('Database connection error', error);
  });
