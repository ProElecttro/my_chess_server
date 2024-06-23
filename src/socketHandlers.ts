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
        let room = await roomRepository.findOne({ where: { code: roomCode }, relations: ["players", "games"] });
        
        if (!room) {
          // Create a new room if it doesn't exist
          room = new Room();
          room.code = roomCode;
          room.players = [];
          room.games = [];
          await roomRepository.save(room);
        }

        if (room.players.length >= 2) {
          // Emit roomFull event if room is already full
          socket.emit("roomFull");
          return;
        }

        // Create new player
        const player = new Player();
        player.name = playerName;
        player.room = room;
        await playerRepository.save(player);

        // Update room with new player
        room.players.push(player);
        await roomRepository.save(room);

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
          const game = new Game();
          game.status = "ongoing";
          game.moves = [];
          game.board = initializeBoard(); // Initialize the board
          game.room = room;
          await gameRepository.save(game);

          // Emit startGame event to both players
          io.to(roomCode).emit("startGame", { gameId: room.code, board: game.board });
        }
      } catch (error) {
        console.error("Error joining room:", error);
        // Handle error joining room
      }
    });

    socket.on("movePiece", ({from, to})=>{
      console.log(from, "to", to);
      socket.broadcast.emit("makeMove", {fromCoord: from, toCoord: to});
    })

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

const getPieceAtPosition = (game: Game, position: string) => {
  const [x, y] = position.split("-").map(Number);
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
