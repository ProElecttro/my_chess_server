// src/entities/Move.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { Game } from "./Game";
import { Player } from "./Player";

@Entity()
export class Move {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  from: string; // Define from property

  @Column()
  to: string; // Define to property

  @ManyToOne(() => Game, game => game.moves)
  game: Game;

  @ManyToOne(() => Player, player => player.moves)
  player: Player;
}
