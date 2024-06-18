// src/entities/Room.ts
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { Player } from "./Player";
import { Game } from "./Game";

@Entity()
export class Room {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  code: string;

  @OneToMany(() => Player, player => player.room)
  players: Player[];

  @OneToMany(() => Game, game => game.room)
  games: Game[];
}
