"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// src/ormconfig.ts
const typeorm_1 = require("typeorm");
const Game_1 = require("./entities/Game");
const Move_1 = require("./entities/Move");
const Player_1 = require("./entities/Player");
const Room_1 = require("./entities/Room");
const AppDataSource = new typeorm_1.DataSource({
    type: "postgres",
    host: "localhost",
    port: 5432,
    username: "postgres",
    password: "Vms@#8843",
    database: "chess_game",
    synchronize: true,
    entities: [Game_1.Game, Move_1.Move, Player_1.Player, Room_1.Room],
    logging: true
});
exports.default = AppDataSource;
