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
exports.Player = void 0;
// src/entities/Player.ts
const typeorm_1 = require("typeorm");
const Room_1 = require("./Room");
const Game_1 = require("./Game");
const Move_1 = require("./Move"); // Import the Move entity
let Player = class Player {
};
exports.Player = Player;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Player.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Player.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Room_1.Room, room => room.players),
    __metadata("design:type", Room_1.Room)
], Player.prototype, "room", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Game_1.Game, game => game.players),
    __metadata("design:type", Game_1.Game)
], Player.prototype, "game", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => Move_1.Move, move => move.player) // Define the OneToMany relationship to Move
    ,
    __metadata("design:type", Array)
], Player.prototype, "moves", void 0);
exports.Player = Player = __decorate([
    (0, typeorm_1.Entity)()
], Player);
