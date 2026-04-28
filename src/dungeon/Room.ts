import type { Enemy } from '../core/entities/Enemy';
import type { Item } from '../core/inventory/Item';

export type RoomType = 'COMBAT' | 'ELITE_COMBAT' | 'TREASURE' | 'REST' | 'SHOP' | 'BOSS';

export interface Room {
  id: number;
  type: RoomType;
  description: string;
  enemies: Enemy[];
  loot: Item[];
  visited: boolean;
  cleared: boolean;
}
