import "reflect-metadata";
import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import cors from "cors"; // Import CORS middleware
import AppDataSource from "./ormconfig";
import handleSocketEvents from "./socketHandlers";

const app = express();
const port = 8000;
const httpServer = createServer(app);
const io = new Server(httpServer);

// Enable CORS middleware
// app.use(cors({
//   origin: "*"
// }));

// Example route with CORS enabled
app.get('/', (req, res) => {
  console.log("Hello world!");
  res.json({message: "hello world!"});
});

AppDataSource.initialize()
  .then(() => {
    console.log('Database connected successfully');
    handleSocketEvents(io);
    httpServer.listen(port, '0.0.0.0', () => {
      console.log(`Server running on http://13.232.79.219:8000/`);
    });
  })
  .catch((error) => {
    console.error('Database connection error', error);
  });
