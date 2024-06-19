"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// src/routes/index.ts
const express_1 = __importDefault(require("express"));
const game_1 = __importDefault(require("./game"));
const router = express_1.default.Router();
router.use('/game', game_1.default);
exports.default = router;
