"use strict";
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
const Game_1 = require("./entities/Game");
const Player_1 = require("./entities/Player");
const Room_1 = require("./entities/Room");
const ormconfig_1 = __importDefault(require("./ormconfig"));
function handleSocketEvents(io) {
    io.on("connection", (socket) => {
        console.log("New client connected");
        socket.on("joinRoom", (roomCode, playerName) => __awaiter(this, void 0, void 0, function* () {
            const roomRepository = ormconfig_1.default.getRepository(Room_1.Room);
            const playerRepository = ormconfig_1.default.getRepository(Player_1.Player);
            const gameRepository = ormconfig_1.default.getRepository(Game_1.Game);
            try {
                let room = yield roomRepository.findOne({ where: { code: roomCode }, relations: ["players", "games"] });
                if (!room) {
                    // Create a new room if it doesn't exist
                    room = new Room_1.Room();
                    room.code = roomCode;
                    room.players = [];
                    room.games = [];
                    yield roomRepository.save(room);
                }
                if (room.players.length >= 2) {
                    // Emit roomFull event if room is already full
                    socket.emit("roomFull");
                    return;
                }
                // Create new player
                const player = new Player_1.Player();
                player.name = playerName;
                player.room = room;
                yield playerRepository.save(player);
                // Update room with new player
                room.players.push(player);
                yield roomRepository.save(room);
                // Join the socket room
                socket.join(roomCode);
                // Notify other clients in the room about new player
                let playerColor = "white";
                if (room.players.length === 2) {
                    playerColor = "black";
                }
                io.to(roomCode).emit("playerJoined", playerName, playerColor);
                if (room.players.length === 2) {
                    // Initialize a new game when two players are present
                    const game = new Game_1.Game();
                    game.status = "ongoing";
                    game.moves = [];
                    game.board = initializeBoard(); // Initialize the board
                    game.room = room;
                    yield gameRepository.save(game);
                    // Emit startGame event to both players
                    io.to(roomCode).emit("startGame", { gameId: room.code, board: game.board });
                }
            }
            catch (error) {
                console.error("Error joining room:", error);
                // Handle error joining room
            }
        }));
        socket.on("movePiece", ({ from, to }) => {
            console.log(from, "to", to);
            socket.broadcast.emit("makeMove", { fromCoord: from, toCoord: to });
        });
        // socket.on("makeMove", async (roomId: string, from: string, to: string, playerName: string) => {
        //   const gameRepository = AppDataSource.getRepository(Game);
        //   const moveRepository = AppDataSource.getRepository(Move);
        //   const playerRepository = AppDataSource.getRepository(Player);
        //   const roomRepository = AppDataSource.getRepository(Room);
        //   try {
        //     const room = await roomRepository.findOne({ where: { code: roomId }, relations: ["games"] });
        //     if (!room) {
        //       console.error("Room not found.");
        //       socket.emit("error", "Room not found.");
        //       return;
        //     }
        //     const game = room.games.find(g => g.status === "ongoing");
        //     if (!game) {
        //       console.error("Game not found.");
        //       socket.emit("error", "Game not found.");
        //       return;
        //     }
        //     const player = await playerRepository.findOne({ where: { name: playerName } });
        //     if (!player) {
        //       console.error("Player not found.");
        //       socket.emit("error", "Player not found.");
        //       return;
        //     }
        //     const move = new Move();
        //     move.from = from;
        //     move.to = to;
        //     move.game = game;
        //     move.player = player;
        //     await moveRepository.save(move);
        //     // Handle move logic based on the piece type
        //     const piece = getPieceAtPosition(game, from);
        //     let highlight;
        //     switch (piece) {
        //       case "rook":
        //         highlight = rook(game, from, to);
        //         break;
        //       case "knight":
        //         highlight = knight(game, from, to);
        //         break;
        //       case "king":
        //         highlight = king(game, from, to);
        //         break;
        //       case "queen":
        //         highlight = queen(game, from, to);
        //         break;
        //       case "bishop":
        //         highlight = bishop(game, from, to);
        //         break;
        //       case "pawn":
        //         highlight = pawn(game, from, to);
        //         break;
        //       default:
        //         console.error("Invalid piece type.");
        //         return;
        //     }
        //     game.moves.push(move);
        //     await gameRepository.save(game);
        //     // Emit moveMade event to all clients in the room
        //     io.to(roomId).emit("moveMade", { moves: game.moves, highlight, board: game.board });
        //   } catch (error) {
        //     console.error("Error making move:", error);
        //     // Handle error making move
        //   }
        // });
        socket.on("disconnect", () => {
            console.log("Client disconnected");
            // Implement logic to handle player disconnects, remove player from game/room if necessary
        });
    });
}
exports.handleSocketEvents = handleSocketEvents;
const getPieceAtPosition = (game, position) => {
    var _a;
    const [x, y] = position.split("-").map(Number);
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
