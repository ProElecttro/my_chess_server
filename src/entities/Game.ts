// src/entities/Game.ts

import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne } from "typeorm";
import { Room } from "./Room";
import { Move } from "./Move";
import { Player } from "./Player"; // Make sure Player is correctly imported

@Entity()
export class Game {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  status: string; // Define status property

  @OneToMany(() => Move, move => move.game)
  moves: Move[];

  @ManyToOne(() => Room, room => room.games)
  room: Room;

  @OneToMany(() => Player, player => player.game) // Define players relation correctly
  players: Player[]; // Ensure players property is defined

  // Define board property or initialize it elsewhere
  board: any; // Replace 'any' with your actual board type or initialization
}
