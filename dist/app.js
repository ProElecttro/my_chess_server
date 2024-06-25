"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const express_1 = __importDefault(require("express"));
const socket_io_1 = require("socket.io");
const cors_1 = __importDefault(require("cors"));
const socketHandlers_1 = __importDefault(require("./socketHandlers"));
const ormconfig_1 = __importDefault(require("./ormconfig"));
const http_1 = __importDefault(require("http"));
const app = (0, express_1.default)();
const port = 8000;
// CORS configuration
app.use((0, cors_1.default)({
    origin: "*",
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type", "Authorization"]
}));
const httpServer = http_1.default.createServer(app);
// Socket.IO setup
const io = new socket_io_1.Server(httpServer, {
    cors: {
        origin: "*",
    }
});
app.get('/', (req, res) => {
    console.log("Hello world!");
    res.json({ message: "hello world!" });
});
// Initialize database and start server
ormconfig_1.default.initialize()
    .then(() => {
    console.log('Database connected successfully');
    (0, socketHandlers_1.default)(io);
    httpServer.listen(port, () => {
        console.log(`Server running on http://13.232.79.219:${port}`);
    });
})
    .catch((error) => {
    console.error('Database connection error', error);
});
