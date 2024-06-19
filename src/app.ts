import "reflect-metadata";
import express from "express";
import { createServer } from "https"; // Use HTTPS from Node's built-in 'https' module
import { Server } from "socket.io";
import cors from "cors";
import { readFileSync } from "fs";
import handleSocketEvents from "./socketHandlers";
import AppDataSource from "./ormconfig";
import path from "path"; // Import path module for working with file paths
import http from "http";

const app = express();
const port = 8000;

// CORS configuration
app.use(cors({
  origin: "*",
  methods: ["GET", "POST"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

// HTTPS server setup using __dirname to construct the absolute path
const httpsOptions = {
  key: readFileSync(path.resolve(__dirname, './my_chess_server.pem')),
};

const httpServer = http.createServer(app);

// Socket.IO setup
const io = new Server(httpServer, {
  cors: {
    origin: "*",
  }
});

// Express route example
app.get('/', (req, res) => {
  console.log("Hello world!");
  res.json({ message: "hello world!" });
});

// Initialize database and start server
AppDataSource.initialize()
  .then(() => {
    console.log('Database connected successfully');
    handleSocketEvents(io);
    httpServer.listen(port, () => {
      console.log(`Server running on https://ec2-13-232-79-219.ap-south-1.compute.amazonaws.com:${port}/`);
    });
  })
  .catch((error) => {
    console.error('Database connection error', error);
  });
