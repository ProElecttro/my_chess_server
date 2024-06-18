// src/entities/Player.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from "typeorm";
import { Room } from "./Room";
import { Game } from "./Game";
import { Move } from "./Move"; // Import the Move entity

@Entity()
export class Player {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @ManyToOne(() => Room, room => room.players)
  room: Room;

  @ManyToOne(() => Game, game => game.players)
  game: Game;

  @OneToMany(() => Move, move => move.player) // Define the OneToMany relationship to Move
  moves: Move[]; // This property represents all moves made by this player

  // Other player properties as needed
}
