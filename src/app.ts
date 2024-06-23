import "reflect-metadata";
import express from "express";
import { Server } from "socket.io";
import cors from "cors";
import handleSocketEvents from "./socketHandlers";
import AppDataSource from "./ormconfig";
import http from "http";

const app = express();
const port = 8000;

// CORS configuration
app.use(cors({
  origin: "*",
  methods: ["GET", "POST"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));


const httpServer = http.createServer(app);

// Socket.IO setup
const io = new Server(httpServer, {
  cors: {
    origin: "*",
  }
});

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
      console.log(`Server running on http://13.232.79.219:${port}`);
    });
  })
  .catch((error) => {
    console.error('Database connection error', error);
  });