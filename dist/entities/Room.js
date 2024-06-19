"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Room = void 0;
// src/entities/Room.ts
const typeorm_1 = require("typeorm");
const Player_1 = require("./Player");
const Game_1 = require("./Game");
let Room = class Room {
};
exports.Room = Room;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Room.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Room.prototype, "code", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => Player_1.Player, player => player.room),
    __metadata("design:type", Array)
], Room.prototype, "players", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => Game_1.Game, game => game.room),
    __metadata("design:type", Array)
], Room.prototype, "games", void 0);
exports.Room = Room = __decorate([
    (0, typeorm_1.Entity)()
], Room);
