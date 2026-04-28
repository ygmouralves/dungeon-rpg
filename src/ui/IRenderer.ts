import type { Player } from '../core/entities/Player';
import type { Enemy } from '../core/entities/Enemy';
import type { Room } from '../dungeon/Room';
import type { Item } from '../core/inventory/Item';

export interface IRenderer {
  clear(): void;
  log(msg: string): void;
  banner(): void;
  renderPlayerStatus(player: Player): void;
  renderRoom(room: Room): void;
  combatStart(player: Player, enemies: Enemy[]): void;
  renderCombatStatus(player: Player, enemies: Enemy[]): void;
  renderActionMenu(player: Player, enemies: Enemy[]): void;
  renderLoot(items: Item[]): void;
  renderLevelUp(player: Player, points: number): Promise<void>;
  renderGameOver(): void;
  renderVictory(player: Player): void;
}
