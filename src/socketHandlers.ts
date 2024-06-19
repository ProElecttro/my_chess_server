// src/socketHandlers.ts

import { Server, Socket } from "socket.io";
import { Move } from "./entities/Move";
import { Game } from "./entities/Game";
import { Player } from "./entities/Player";
import { Room } from "./entities/Room";
import AppDataSource from "./ormconfig";
import { rook, knight, king, queen, bishop, pawn } from "./chessLogic";

export function handleSocketEvents(io: Server) {
  io.on("connection", (socket: Socket) => {
    console.log("New client connected");

    socket.on("joinRoom", async (roomCode: string, playerName: string) => {
      const roomRepository = AppDataSource.getRepository(Room);
      const playerRepository = AppDataSource.getRepository(Player);
      const gameRepository = AppDataSource.getRepository(Game);

      let room = await roomRepository.findOne({ where: { code: roomCode }, relations: ["players", "games"] });
      if (!room) {
        room = new Room();
        room.code = roomCode;
        room.players = [];
        room.games = [];
        await roomRepository.save(room);
      }

      if (room.players.length >= 2) {
        socket.emit("roomFull");
        return;
      }

      const player = new Player();
      player.name = playerName;
      player.room = room;
      await playerRepository.save(player);

      room.players.push(player);
      await roomRepository.save(room);

      socket.join(roomCode);
      io.to(roomCode).emit("playerJoined", playerName);

      if (room.players.length === 2) {
        const game = new Game();
        game.status = "ongoing";
        game.moves = [];
        game.board = initializeBoard(); // Function to initialize the board
        game.room = room;
        await gameRepository.save(game);
        io.to(roomCode).emit("startGame", { gameId: game.id, board: game.board });
      }
    });

    socket.on("makeMove", async (gameId: number, from: string, to: string, playerName: string) => {
      const gameRepository = AppDataSource.getRepository(Game);
      const moveRepository = AppDataSource.getRepository(Move);
      const playerRepository = AppDataSource.getRepository(Player);

      const game = await gameRepository.findOne({ where: { id: gameId }, relations: ["moves", "room"] });
      if (!game) return;

      const player = await playerRepository.findOne({ where: { name: playerName } });
      if (!player) return;

      const move = new Move();
      move.from = from;
      move.to = to;
      move.game = game;
      move.player = player;
      await moveRepository.save(move);

      // Call the appropriate function based on the piece
      const piece = getPieceAtPosition(game, from);
      let highlight;
      switch (piece) {
        case "rook":
          highlight = rook(game, from, to);
          break;
        case "knight":
          highlight = knight(game, from, to);
          break;
        case "king":
          highlight = king(game, from, to);
          break;
        case "queen":
          highlight = queen(game, from, to);
          break;
        case "bishop":
          highlight = bishop(game, from, to);
          break;
        case "pawn":
          highlight = pawn(game, from, to);
          break;
      }

      game.moves.push(move);
      await gameRepository.save(game);

      io.to(game.room.code).emit("moveMade", { moves: game.moves, highlight, board: game.board });
    });

    socket.on("disconnect", () => {
      console.log("Client disconnected");
      // Implement logic to handle player disconnects, remove player from game/room if necessary
    });
  });
}

const getPieceAtPosition = (game: Game, position: string) => {
  const [x, y] = position.split("").map(Number);
  return game.board[x][y]?.type; // Returns piece type or undefined if position is empty
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

export default handleSocketEvents;
