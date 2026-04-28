import type { Room, RoomType } from './Room';
import { EnemyFactory } from './EnemyFactory';
import { ConsumableItem } from '../core/inventory/ConsumableItem';
import { EquipmentItem } from '../core/inventory/EquipmentItem';
import type { Item } from '../core/inventory/Item';
import type { Entity } from '../core/entities/Entity';

function buildLoot(floor: number): Item[] {
  const roll = Math.random();
  if (roll < 0.4) {
    const hp = 20 + floor * 5;
    return [
      new ConsumableItem(
        `potion_${Date.now()}`,
        'Poção de Cura',
        `Restaura ${hp} HP.`,
        'COMMON',
        (t: Entity) => { const h = t.heal(hp); return `💊 Usou Poção de Cura e recuperou ${h} HP.`; },
      ),
    ];
  }
  if (roll < 0.6) {
    const mp = 15 + floor * 3;
    return [
      new ConsumableItem(
        `ether_${Date.now()}`,
        'Éter',
        `Restaura ${mp} MP.`,
        'UNCOMMON',
        (t: Entity) => { t.restoreMana(mp); return `🔵 Usou Éter e recuperou ${mp} MP.`; },
      ),
    ];
  }
  if (roll < 0.75) {
    const atk = 2 + floor;
    return [
      new EquipmentItem(
        `sword_${Date.now()}`,
        `Espada +${atk}`,
        `Aumenta ATK em ${atk}.`,
        floor >= 5 ? 'RARE' : 'UNCOMMON',
        'WEAPON',
        atk,
        0,
      ),
    ];
  }
  if (roll < 0.88) {
    const def = 1 + Math.floor(floor * 0.8);
    return [
      new EquipmentItem(
        `armor_${Date.now()}`,
        `Armadura +${def}`,
        `Aumenta DEF em ${def}.`,
        floor >= 5 ? 'RARE' : 'UNCOMMON',
        'ARMOR',
        0,
        def,
      ),
    ];
  }
  return [];
}

function pickRoomType(floor: number, roomIndex: number, totalRooms: number): RoomType {
  if (roomIndex === totalRooms - 1) return 'BOSS';

  const weights: [RoomType, number][] = [
    ['COMBAT', 40],
    ['ELITE_COMBAT', floor >= 3 ? 15 : 5],
    ['TREASURE', 20],
    ['REST', 15],
    ['SHOP', 10],
  ];

  const total = weights.reduce((s, [, w]) => s + w, 0);
  let r = Math.random() * total;
  for (const [type, w] of weights) {
    r -= w;
    if (r <= 0) return type;
  }
  return 'COMBAT';
}

export class DungeonGenerator {
  generate(floor: number): Room[] {
    const roomCount = 4 + Math.floor(floor * 0.5) + Math.floor(Math.random() * 3);
    const rooms: Room[] = [];

    for (let i = 0; i < roomCount; i++) {
      const type = pickRoomType(floor, i, roomCount);
      rooms.push(this._buildRoom(i, type, floor));
    }

    return rooms;
  }

  private _buildRoom(id: number, type: RoomType, floor: number): Room {
    switch (type) {
      case 'COMBAT':
        return {
          id,
          type,
          description: this._combatDesc(),
          enemies: [EnemyFactory.createForFloor(floor, 'MINION')],
          loot: Math.random() < 0.5 ? buildLoot(floor) : [],
          visited: false,
          cleared: false,
        };

      case 'ELITE_COMBAT':
        return {
          id,
          type,
          description: '⚡ Uma aura ameaçadora paira no ar.',
          enemies: [EnemyFactory.createForFloor(floor, 'ELITE')],
          loot: buildLoot(floor),
          visited: false,
          cleared: false,
        };

      case 'TREASURE':
        return {
          id,
          type,
          description: '💰 Um baú coberto de poeira espera no centro da sala.',
          enemies: [],
          loot: [...buildLoot(floor), ...buildLoot(floor)],
          visited: false,
          cleared: false,
        };

      case 'REST':
        return {
          id,
          type,
          description: '🕯  Uma fogueira crepita. Você pode descansar aqui.',
          enemies: [],
          loot: [],
          visited: false,
          cleared: false,
        };

      case 'SHOP':
        return {
          id,
          type,
          description: '🏪 Um mercador misterioso aparece das sombras.',
          enemies: [],
          loot: buildLoot(floor).slice(0, 1),
          visited: false,
          cleared: false,
        };

      case 'BOSS':
        return {
          id,
          type,
          description: '💀 O chão treme. Uma presença colossal aguarda.',
          enemies: [EnemyFactory.createBoss(floor)],
          loot: [...buildLoot(floor), ...buildLoot(floor), ...buildLoot(floor)],
          visited: false,
          cleared: false,
        };
    }
  }

  private _combatDesc(): string {
    const descs = [
      '🦴 Ossos espalhados revelam batalhas passadas.',
      '🕸  Teias densas cobrem as paredes.',
      '🌑 Escuridão quase total. Algo se move.',
      '💧 Água goteja do teto úmido.',
      '🔥 Tochas apagadas fumegam nas paredes.',
    ];
    return descs[Math.floor(Math.random() * descs.length)]!;
  }
}
