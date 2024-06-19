"use strict";
// src/entities/Game.ts
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
exports.Game = void 0;
const typeorm_1 = require("typeorm");
const Room_1 = require("./Room");
const Move_1 = require("./Move");
const Player_1 = require("./Player"); // Make sure Player is correctly imported
let Game = class Game {
};
exports.Game = Game;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Game.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Game.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => Move_1.Move, move => move.game),
    __metadata("design:type", Array)
], Game.prototype, "moves", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Room_1.Room, room => room.games),
    __metadata("design:type", Room_1.Room)
], Game.prototype, "room", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => Player_1.Player, player => player.game) // Define players relation correctly
    ,
    __metadata("design:type", Array)
], Game.prototype, "players", void 0);
exports.Game = Game = __decorate([
    (0, typeorm_1.Entity)()
], Game);
