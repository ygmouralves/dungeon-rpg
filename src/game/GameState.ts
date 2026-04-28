import type { Player } from '../core/entities/Player';
import type { Room } from '../dungeon/Room';

export interface GameState {
  player: Player;
  rooms: Room[];
  currentRoomIndex: number;
  isOver: boolean;
}
