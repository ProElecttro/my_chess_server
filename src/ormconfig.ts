// src/ormconfig.ts
import { DataSource } from "typeorm";
import { Game } from "./entities/Game";
import { Move } from "./entities/Move";
import { Player } from "./entities/Player";
import { Room } from "./entities/Room";

const AppDataSource = new DataSource({
  type: "postgres",
  host: "localhost",
  port: 5432,
  username: "postgres",
  password: "Vms@#8843",
  database: "chess_game",
  synchronize: true,
  entities: [Game, Move, Player, Room],
  logging: true
});

export default AppDataSource;
