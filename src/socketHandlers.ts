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

      try {
        // Find or create the room based on roomCode
        let room = await roomRepository.findOne({ where: { code: roomCode }, relations: ["players", "games"] });
        if (!room) {
          room = new Room();
          room.code = roomCode;
          room.players = [];
          room.games = [];
          await roomRepository.save(room);
        }

        // Check if room is already full
        if (room.players.length >= 2) {
          socket.emit("roomFull");
          return;
        }

        // Create a new player
        const player = new Player();
        player.name = playerName;
        player.room = room;
        await playerRepository.save(player);

        // Update room and notify other players
        room.players.push(player);
        await roomRepository.save(room);

        socket.join(roomCode);
        io.to(roomCode).emit("playerJoined", playerName);

        // If room is now full, start the game
        if (room.players.length === 2) {
          const game = new Game();
          game.status = "ongoing";
          game.moves = [];
          game.board = initializeBoard(); // Initialize the chess board
          game.room = room;
          await gameRepository.save(game);

          io.to(roomCode).emit("startGame", { gameId: game.id, board: game.board });
        }
      } catch (error) {
        console.error("Error joining room:", error);
      }
    });

    socket.on("makeMove", async (gameId: number, from: string, to: string, playerName: string) => {
      const gameRepository = AppDataSource.getRepository(Game);
      const moveRepository = AppDataSource.getRepository(Move);
      const playerRepository = AppDataSource.getRepository(Player);

      try {
        // Find the game and player
        const game = await gameRepository.findOne({ where: { id: gameId }, relations: ["moves", "room"] });
        const player = await playerRepository.findOne({ where: { name: playerName } });

        if (!game || !player) {
          console.error("Game or player not found");
          return;
        }

        // Create a new move
        const move = new Move();
        move.from = from;
        move.to = to;
        move.game = game;
        move.player = player;
        await moveRepository.save(move);

        // Validate and process the move
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
          default:
            console.error("Invalid piece type");
            return;
        }

        // Update game state with the move and emit to all players
        game.moves.push(move);
        await gameRepository.save(game);

        io.to(game.room.code).emit("moveMade", { moves: game.moves, highlight, board: game.board });
      } catch (error) {
        console.error("Error making move:", error);
      }
    });

    socket.on("disconnect", () => {
      console.log("Client disconnected");
    });
  });
}

const getPieceAtPosition = (game: Game, position: string) => {
  const [x, y] = position.split("").map(Number);
  return game.board[x][y]?.type; // Returns piece type or undefined if position is empty
};

const initializeBoard = () => {
  // Initialize an 8x8 chess board with initial piece positions
  const board = Array.from({ length: 8 }, () => Array(8).fill(null));

  // Initialize pawns
  board[1] = board[1].map(() => ({ type: "pawn", owner: "white" }));
  board[6] = board[6].map(() => ({ type: "pawn", owner: "black" }));

  // Initialize other pieces
  const pieceTypes = ["rook", "knight", "bishop", "queen", "king", "bishop", "knight", "rook"];
  for (let i = 0; i < 8; i++) {
    board[0][i] = { type: pieceTypes[i], owner: "white" };
    board[7][i] = { type: pieceTypes[i], owner: "black" };
  }

  return board;
};

export default handleSocketEvents;
