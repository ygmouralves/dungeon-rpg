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
    'Frasco de Éter',
    'Restaura 30 HP.',
    'D',
    (t: Entity) => { const h = t.heal(30); return `◈ Usou Frasco de Éter e recuperou ${h} HP.`; },
  );
}

const CLASS_DEFS: ClassDef[] = [
  {
    id: 'vanguard',
    name: 'VANGUARDISTA',
    tagline: 'Escudo do Éter',
    lore: 'O escudo que separa a civilização do caos. Forjado em batalha, resiste onde outros recuam.',
    color: '#79c0ff',
    stats: { hp: 150, mp: 35, atk: 13, def: 9, spd: 4 },
    skills: [
      { name: 'Golpe Poderoso',  description: '2.2× dano + Fraqueza',   manaCost: 10 },
      { name: 'Grito de Guerra', description: '+8 DEF por 3 turnos',    manaCost: 20 },
      { name: 'Fendilhar',       description: '2× dano brutal',         manaCost: 25 },
    ],
    buildPlayer: (name) => {
      const inv = new Inventory(20);
      inv.add(makeStartingPotion());
      return new Player(
        name,
        { hp: 150, maxHp: 150, mana: 35, maxMana: 35, baseAttack: 13, baseDefense: 9, speed: 4, level: 1 },
        [new PowerStrikeSkill(), new BattleCrySkill(), new CleaveSkill()],
        inv,
      );
    },
  },
  {
    id: 'technomage',
    name: 'TECNOMAGO',
    tagline: 'Arquiteto do Caos',
    lore: 'Manipula o fluxo de dados do Éter para dobrar a realidade. Frágil como vidro, letal como raio.',
    color: '#bb86fc',
    stats: { hp: 65, mp: 110, atk: 20, def: 2, spd: 8 },
    skills: [
      { name: 'Bola de Fogo',    description: '1.8× dano + Queimadura', manaCost: 20 },
      { name: 'Fragmento de Gelo', description: '1.5× dano + Atordoa',  manaCost: 30 },
      { name: 'Surto Arcano',    description: '3× dano devastador',     manaCost: 50 },
    ],
    buildPlayer: (name) => {
      const inv = new Inventory(20);
      inv.add(makeStartingPotion());
      return new Player(
        name,
        { hp: 65, maxHp: 65, mana: 110, maxMana: 110, baseAttack: 20, baseDefense: 2, speed: 8, level: 1 },
        [new FireballSkill(), new IceShardSkill(), new ArcaneSurgeSkill()],
        inv,
      );
    },
  },
  {
    id: 'netcipher',
    name: 'NETCIPHER',
    tagline: 'Sombra do Éter',
    lore: 'Especialista em infiltração e ataques de precisão rápida. Age antes que o inimigo perceba.',
    color: '#22c55e',
    stats: { hp: 80, mp: 55, atk: 17, def: 4, spd: 11 },
    skills: [
      { name: 'Golpe Traiçoeiro',   description: '2.8× dano crítico',        manaCost: 20 },
      { name: 'Lâmina Envenenada',  description: 'Dano + Veneno por 3 turnos', manaCost: 15 },
      { name: 'Golpe Poderoso',     description: '2.2× dano + Fraqueza',      manaCost: 10 },
    ],
    buildPlayer: (name) => {
      const inv = new Inventory(20);
      inv.add(makeStartingPotion());
      return new Player(
        name,
        { hp: 80, maxHp: 80, mana: 55, maxMana: 55, baseAttack: 17, baseDefense: 4, speed: 11, level: 1 },
        [new BackstabSkill(), new PoisonBladeSkill(), new PowerStrikeSkill()],
        inv,
      );
    },
  },
  {
    id: 'warden',
    name: 'SENTINELA',
    tagline: 'Guardião do Éter',
    lore: 'Versátil e resiliente, utiliza tecnologia antiga para suporte e combate. Nunca cede terreno.',
    color: '#f59e0b',
    stats: { hp: 105, mp: 80, atk: 12, def: 6, spd: 6 },
    skills: [
      { name: 'Cura Sagrada',   description: 'Cura 25% HP + Regen',         manaCost: 25 },
      { name: 'Golpe Sagrado',  description: '1.6× dano + cura própria',     manaCost: 35 },
      { name: 'Escudo Divino',  description: '+10 DEF + Regen por 3 turnos', manaCost: 30 },
    ],
    buildPlayer: (name) => {
      const inv = new Inventory(20);
      inv.add(makeStartingPotion());
      return new Player(
        name,
        { hp: 105, maxHp: 105, mana: 80, maxMana: 80, baseAttack: 12, baseDefense: 6, speed: 6, level: 1 },
        [new HealSkill(), new HolyStrikeSkill(), new DivineShieldSkill()],
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
