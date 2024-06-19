"use strict";
// src/app.ts
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const express_1 = __importDefault(require("express"));
const http_1 = require("http");
const socket_io_1 = require("socket.io");
const ormconfig_1 = __importDefault(require("./ormconfig"));
const socketHandlers_1 = __importDefault(require("./socketHandlers"));
const app = (0, express_1.default)();
const port = 8000;
const httpServer = (0, http_1.createServer)(app);
const io = new socket_io_1.Server(httpServer);
app.get('/', (req, res) => {
    console.log("Hello world!");
    res.send("hello world!");
});
ormconfig_1.default.initialize()
    .then(() => {
    console.log('Database connected successfully');
    (0, socketHandlers_1.default)(io);
    httpServer.listen(port, '0.0.0.0', () => {
        console.log(`Server running on http://localhost:${port}`);
    });
})
    .catch((error) => {
    console.error('Database connection error', error);
});
