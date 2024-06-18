// src/routes/game.ts
import express from 'express';
import * as gameService from '../services/gameService';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const games = await gameService.getAllGames();
    res.json(games);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

export default router;
