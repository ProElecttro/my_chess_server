// src/services/gameService.ts
import { getRepository } from 'typeorm';
import { Game } from '../entities/Game';

const gameRepository = getRepository(Game);

export async function getAllGames() {
  return await gameRepository.find();
}

// Add more service functions as needed
