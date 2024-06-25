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

    socket.on("chatMessage", (message)=>{
      console.log(message);
      socket.broadcast.emit("sendMessage", message);
    })

    socket.on("movePiece", ({from, to})=>{
      console.log(from, "to", to);
      socket.broadcast.emit("makeMove", {fromCoord: from, toCoord: to});
    })

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
