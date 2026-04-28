import type { Room, RoomType } from './Room';
import { EnemyFactory } from './EnemyFactory';
import { ConsumableItem } from '../core/inventory/ConsumableItem';
import { EquipmentItem } from '../core/inventory/EquipmentItem';
import type { Item } from '../core/inventory/Item';
import type { ItemTier } from '../core/inventory/Item';
import type { Entity } from '../core/entities/Entity';

const TIER_MULT: Record<ItemTier, number> = {
  'D': 1.0, 'C': 1.2, 'B': 1.5, 'A': 2.0, 'S': 2.8, 'S+': 4.0,
};

function pickTier(floor: number): ItemTier {
  const r = Math.random();
  if (floor <= 2) return r < 0.65 ? 'D' : 'C';
  if (floor <= 3) return r < 0.45 ? 'D' : r < 0.85 ? 'C' : 'B';
  if (floor <= 4) return r < 0.35 ? 'C' : r < 0.80 ? 'B' : 'A';
  if (floor <= 5) return r < 0.35 ? 'B' : r < 0.78 ? 'A' : 'S';
  if (floor <= 6) return r < 0.30 ? 'A' : r < 0.75 ? 'S' : 'S+';
  return r < 0.35 ? 'S' : 'S+';
}

function buildLoot(floor: number): Item[] {
  const roll = Math.random();
  const tier = pickTier(floor);
  const mult = TIER_MULT[tier];

  if (roll < 0.35) {
    const hp = Math.floor((20 + floor * 5) * mult);
    return [
      new ConsumableItem(
        `potion_${Date.now()}`,
        tier === 'D' ? 'Frasco de Éter' : tier === 'C' ? 'Poção de Cura' : tier === 'B' ? 'Elixir Menor' : tier === 'A' ? 'Elixir Éter' : 'Frasco Lendário',
        `Restaura ${hp} HP.`,
        tier,
        (t: Entity) => { const h = t.heal(hp); return `Usou o item e recuperou ${h} HP.`; },
      ),
    ];
  }

  if (roll < 0.50) {
    const mp = Math.floor((15 + floor * 3) * mult);
    return [
      new ConsumableItem(
        `ether_${Date.now()}`,
        tier === 'D' ? 'Cristal de Éter' : tier === 'C' ? 'Éter Puro' : 'Éter Arcano',
        `Restaura ${mp} EP.`,
        tier,
        (t: Entity) => { t.restoreMana(mp); return `Usou o item e recuperou ${mp} EP.`; },
      ),
    ];
  }

  if (roll < 0.72) {
    const atk = Math.floor((2 + floor) * mult);
    const names: Record<ItemTier, string> = {
      'D': 'Lâmina Enferrujada', 'C': 'Espada de Ferro', 'B': 'Sabre Élfico',
      'A': 'Lâmina Arcana', 'S': 'Espada Lendária', 'S+': 'Fenda do Éter',
    };
    return [
      new EquipmentItem(
        `sword_${Date.now()}`,
        names[tier],
        `Aumenta ATK em ${atk}.`,
        tier,
        'WEAPON',
        atk,
        0,
      ),
    ];
  }

  if (roll < 0.88) {
    const def = Math.floor((1 + Math.floor(floor * 0.8)) * mult);
    const names: Record<ItemTier, string> = {
      'D': 'Escudo de Madeira', 'C': 'Malha de Ferro', 'B': 'Couraça Reforçada',
      'A': 'Armadura Arcana', 'S': 'Proteção Lendária', 'S+': 'Égide do Éter',
    };
    return [
      new EquipmentItem(
        `armor_${Date.now()}`,
        names[tier],
        `Aumenta DEF em ${def}.`,
        tier,
        'ARMOR',
        0,
        def,
      ),
    ];
  }

  if (roll < 0.96 && floor >= 3) {
    const atkBonus = Math.floor((1 + floor * 0.5) * mult);
    const defBonus = Math.floor((1 + floor * 0.3) * mult);
    const names: Record<ItemTier, string> = {
      'D': 'Amuleto Gasto', 'C': 'Amuleto de Couro', 'B': 'Anel Rúnico',
      'A': 'Coroa Arcana', 'S': 'Relíquia Lendária', 'S+': 'Artefato do Éter',
    };
    return [
      new EquipmentItem(
        `acc_${Date.now()}`,
        names[tier] ?? 'Acessório',
        `+${atkBonus} ATK, +${defBonus} DEF.`,
        tier,
        'ACCESSORY',
        atkBonus,
        defBonus,
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
          id, type,
          description: this._combatDesc(),
          enemies: [EnemyFactory.createForFloor(floor, 'MINION')],
          loot: Math.random() < 0.5 ? buildLoot(floor) : [],
          visited: false, cleared: false,
        };

      case 'ELITE_COMBAT':
        return {
          id, type,
          description: 'Uma aura ameaçadora paira no ar. Presença de elite detectada.',
          enemies: [EnemyFactory.createForFloor(floor, 'ELITE')],
          loot: buildLoot(floor),
          visited: false, cleared: false,
        };

      case 'TREASURE':
        return {
          id, type,
          description: 'Um baú coberto de poeira espera no centro da sala.',
          enemies: [],
          loot: [...buildLoot(floor), ...buildLoot(floor)],
          visited: false, cleared: false,
        };

      case 'REST':
        return {
          id, type,
          description: 'Uma fogueira crepita. Você pode descansar aqui.',
          enemies: [],
          loot: [],
          visited: false, cleared: false,
        };

      case 'SHOP':
        return {
          id, type,
          description: 'Um mercador misterioso aparece das sombras.',
          enemies: [],
          loot: buildLoot(floor).slice(0, 1),
          visited: false, cleared: false,
        };

      case 'BOSS':
        return {
          id, type,
          description: 'O chão treme. Uma presença colossal aguarda.',
          enemies: [EnemyFactory.createBoss(floor)],
          loot: [...buildLoot(floor), ...buildLoot(floor), ...buildLoot(floor)],
          visited: false, cleared: false,
        };
    }
  }

  private _combatDesc(): string {
    const descs = [
      'Ossos espalhados revelam batalhas passadas.',
      'Teias densas cobrem as paredes.',
      'Escuridão quase total. Algo se move.',
      'Água goteja do teto úmido.',
      'Tochas apagadas fumegam nas paredes.',
      'Um cheiro de enxofre permeia o ar.',
      'Rastros recentes no pó revelam presença próxima.',
    ];
    return descs[Math.floor(Math.random() * descs.length)]!;
  }
}
