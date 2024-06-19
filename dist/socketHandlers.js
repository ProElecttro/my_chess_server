"use strict";
// src/socketHandlers.ts
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleSocketEvents = void 0;
const Move_1 = require("./entities/Move");
const Game_1 = require("./entities/Game");
const Player_1 = require("./entities/Player");
const Room_1 = require("./entities/Room");
const ormconfig_1 = __importDefault(require("./ormconfig"));
const chessLogic_1 = require("./chessLogic");
function handleSocketEvents(io) {
    io.on("connection", (socket) => {
        console.log("New client connected");
        socket.on("joinRoom", (roomCode, playerName) => __awaiter(this, void 0, void 0, function* () {
            const roomRepository = ormconfig_1.default.getRepository(Room_1.Room);
            const playerRepository = ormconfig_1.default.getRepository(Player_1.Player);
            const gameRepository = ormconfig_1.default.getRepository(Game_1.Game);
            let room = yield roomRepository.findOne({ where: { code: roomCode }, relations: ["players", "games"] });
            if (!room) {
                room = new Room_1.Room();
                room.code = roomCode;
                room.players = [];
                room.games = [];
                yield roomRepository.save(room);
            }
            if (room.players.length >= 2) {
                socket.emit("roomFull");
                return;
            }
            const player = new Player_1.Player();
            player.name = playerName;
            player.room = room;
            yield playerRepository.save(player);
            room.players.push(player);
            yield roomRepository.save(room);
            socket.join(roomCode);
            io.to(roomCode).emit("playerJoined", playerName);
            if (room.players.length === 2) {
                const game = new Game_1.Game();
                game.status = "ongoing";
                game.moves = [];
                game.board = initializeBoard(); // Function to initialize the board
                game.room = room;
                yield gameRepository.save(game);
                io.to(roomCode).emit("startGame", { gameId: game.id, board: game.board });
            }
        }));
        socket.on("makeMove", (gameId, from, to, playerName) => __awaiter(this, void 0, void 0, function* () {
            const gameRepository = ormconfig_1.default.getRepository(Game_1.Game);
            const moveRepository = ormconfig_1.default.getRepository(Move_1.Move);
            const playerRepository = ormconfig_1.default.getRepository(Player_1.Player);
            const game = yield gameRepository.findOne({ where: { id: gameId }, relations: ["moves", "room"] });
            if (!game)
                return;
            const player = yield playerRepository.findOne({ where: { name: playerName } });
            if (!player)
                return;
            const move = new Move_1.Move();
            move.from = from;
            move.to = to;
            move.game = game;
            move.player = player;
            yield moveRepository.save(move);
            // Call the appropriate function based on the piece
            const piece = getPieceAtPosition(game, from);
            let highlight;
            switch (piece) {
                case "rook":
                    highlight = (0, chessLogic_1.rook)(game, from, to);
                    break;
                case "knight":
                    highlight = (0, chessLogic_1.knight)(game, from, to);
                    break;
                case "king":
                    highlight = (0, chessLogic_1.king)(game, from, to);
                    break;
                case "queen":
                    highlight = (0, chessLogic_1.queen)(game, from, to);
                    break;
                case "bishop":
                    highlight = (0, chessLogic_1.bishop)(game, from, to);
                    break;
                case "pawn":
                    highlight = (0, chessLogic_1.pawn)(game, from, to);
                    break;
            }
            game.moves.push(move);
            yield gameRepository.save(game);
            io.to(game.room.code).emit("moveMade", { moves: game.moves, highlight, board: game.board });
        }));
        socket.on("disconnect", () => {
            console.log("Client disconnected");
            // Implement logic to handle player disconnects, remove player from game/room if necessary
        });
    });
}
exports.handleSocketEvents = handleSocketEvents;
const getPieceAtPosition = (game, position) => {
    var _a;
    const [x, y] = position.split("").map(Number);
    return (_a = game.board[x][y]) === null || _a === void 0 ? void 0 : _a.type; // Returns piece type or undefined if position is empty
};
const initializeBoard = () => {
    // Function to initialize the chess board
    const board = Array(8).fill(null).map(() => Array(8).fill(null));
    // Initialize pawns
    for (let i = 0; i < 8; i++) {
        board[1][i] = { type: "pawn", owner: "white" };
        board[6][i] = { type: "pawn", owner: "black" };
    }
    // Initialize other pieces
    const pieceTypes = ["rook", "knight", "bishop", "queen", "king", "bishop", "knight", "rook"];
    for (let i = 0; i < 8; i++) {
        board[0][i] = { type: pieceTypes[i], owner: "white" };
        board[7][i] = { type: pieceTypes[i], owner: "black" };
    }
    return board;
};
exports.default = handleSocketEvents;
