import { Player } from '../entities/Player';
import { Inventory } from '../inventory/Inventory';
import { ConsumableItem } from '../inventory/ConsumableItem';
import { PowerStrikeSkill } from '../skills/PowerStrikeSkill';
import { FireballSkill } from '../skills/FireballSkill';
import { HealSkill } from '../skills/HealSkill';
import { BattleCrySkill } from '../skills/BattleCrySkill';
import { CleaveSkill } from '../skills/CleaveSkill';
import { IceShardSkill } from '../skills/IceShardSkill';
import { ArcaneSurgeSkill } from '../skills/ArcaneSurgeSkill';
import { HolyStrikeSkill } from '../skills/HolyStrikeSkill';
import { DivineShieldSkill } from '../skills/DivineShieldSkill';
import { BackstabSkill } from '../skills/BackstabSkill';
import { PoisonBladeSkill } from '../skills/PoisonBladeSkill';
import type { Entity } from '../entities/Entity';

export interface ClassSkillUI {
  name: string;
  description: string;
  manaCost: number;
}

export interface ClassUI {
  id: string;
  name: string;
  portrait: string;
  tagline: string;
  lore: string;
  color: string;
  stats: { hp: number; mp: number; atk: number; def: number; spd: number };
  skills: ClassSkillUI[];
}

interface ClassDef extends ClassUI {
  buildPlayer: (name: string) => Player;
}

function makeStartingPotion(): ConsumableItem {
  return new ConsumableItem(
    'potion_start',
    'Poção de Cura',
    'Restaura 30 HP.',
    'COMMON',
    (t: Entity) => { const h = t.heal(30); return `💊 Usou Poção de Cura e recuperou ${h} HP.`; },
  );
}

const CLASS_DEFS: ClassDef[] = [
  {
    id: 'warrior',
    name: 'GUERREIRO',
    portrait: '⚔️',
    tagline: 'Tanque implacável',
    lore: 'Forjado em batalha, o Guerreiro suporta o que outros não conseguem. Cada cicatriz é uma medalha.',
    color: '#ef4444',
    stats: { hp: 140, mp: 40, atk: 14, def: 8, spd: 5 },
    skills: [
      { name: 'Golpe Poderoso', description: '2.2× dano + Fraqueza', manaCost: 10 },
      { name: 'Grito de Guerra', description: '+8 DEF por 3 turnos', manaCost: 20 },
      { name: 'Fendilhar', description: '2× dano brutal', manaCost: 25 },
    ],
    buildPlayer: (name) => {
      const inv = new Inventory(20);
      inv.add(makeStartingPotion());
      return new Player(
        name,
        { hp: 140, maxHp: 140, mana: 40, maxMana: 40, baseAttack: 14, baseDefense: 8, speed: 5, level: 1 },
        [new PowerStrikeSkill(), new BattleCrySkill(), new CleaveSkill()],
        inv,
      );
    },
  },
  {
    id: 'mage',
    name: 'MAGO',
    portrait: '🔮',
    tagline: 'Devastação arcana',
    lore: 'Canaliza energias proibidas para aniquilar inimigos. Frágil como vidro, poderoso como uma tempestade.',
    color: '#3b82f6',
    stats: { hp: 70, mp: 100, atk: 18, def: 2, spd: 7 },
    skills: [
      { name: 'Bola de Fogo', description: '1.8× dano + Queimadura', manaCost: 20 },
      { name: 'Fragmento de Gelo', description: '1.5× dano + Atordoa', manaCost: 30 },
      { name: 'Surto Arcano', description: '3× dano devastador', manaCost: 50 },
    ],
    buildPlayer: (name) => {
      const inv = new Inventory(20);
      inv.add(makeStartingPotion());
      return new Player(
        name,
        { hp: 70, maxHp: 70, mana: 100, maxMana: 100, baseAttack: 18, baseDefense: 2, speed: 7, level: 1 },
        [new FireballSkill(), new IceShardSkill(), new ArcaneSurgeSkill()],
        inv,
      );
    },
  },
  {
    id: 'paladin',
    name: 'PALADINO',
    portrait: '🛡️',
    tagline: 'Guerreiro sagrado',
    lore: 'Abençoado pelos deuses antigos, equilibra lâmina e oração. Sustenta aliados e pune os ímpios.',
    color: '#f59e0b',
    stats: { hp: 110, mp: 70, atk: 11, def: 7, spd: 5 },
    skills: [
      { name: 'Cura Sagrada', description: 'Cura 25% HP + Regen', manaCost: 25 },
      { name: 'Golpe Sagrado', description: '1.6× dano + cura própria', manaCost: 35 },
      { name: 'Escudo Divino', description: '+10 DEF + Regen 3 turnos', manaCost: 30 },
    ],
    buildPlayer: (name) => {
      const inv = new Inventory(20);
      inv.add(makeStartingPotion());
      return new Player(
        name,
        { hp: 110, maxHp: 110, mana: 70, maxMana: 70, baseAttack: 11, baseDefense: 7, speed: 5, level: 1 },
        [new HealSkill(), new HolyStrikeSkill(), new DivineShieldSkill()],
        inv,
      );
    },
  },
  {
    id: 'rogue',
    name: 'LADINO',
    portrait: '🗡️',
    tagline: 'Veloz e letal',
    lore: 'Age nas sombras. Cada golpe é calculado para máxima devastação antes que o inimigo reaja.',
    color: '#22c55e',
    stats: { hp: 85, mp: 50, atk: 16, def: 4, spd: 10 },
    skills: [
      { name: 'Golpe Traiçoeiro', description: '2.8× dano crítico', manaCost: 20 },
      { name: 'Lâmina Envenenada', description: 'Dano + Veneno 3 turnos', manaCost: 15 },
      { name: 'Golpe Poderoso', description: '2.2× dano + Fraqueza', manaCost: 10 },
    ],
    buildPlayer: (name) => {
      const inv = new Inventory(20);
      inv.add(makeStartingPotion());
      return new Player(
        name,
        { hp: 85, maxHp: 85, mana: 50, maxMana: 50, baseAttack: 16, baseDefense: 4, speed: 10, level: 1 },
        [new BackstabSkill(), new PoisonBladeSkill(), new PowerStrikeSkill()],
        inv,
      );
    },
  },
];

export function buildPlayerForClass(name: string, classId: string): Player {
  const def = CLASS_DEFS.find(c => c.id === classId) ?? CLASS_DEFS[0]!;
  return def.buildPlayer(name);
}

export function getClassesUI(): ClassUI[] {
  return CLASS_DEFS.map(({ buildPlayer: _, ...ui }) => ui);
}
