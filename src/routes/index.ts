// src/routes/index.ts
import express from 'express';
import gameRouter from './game';

const router = express.Router();

router.use('/game', gameRouter);

export default router;
