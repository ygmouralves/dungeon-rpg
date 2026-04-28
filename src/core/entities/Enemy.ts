import { Entity, type EntityStats } from './Entity';
import type { Skill } from '../skills/Skill';

export type EnemyTier = 'MINION' | 'ELITE' | 'BOSS';

export interface EnemyRewards {
  experience: number;
  gold: number;
}

/** AI action decided each turn. */
export interface AIAction {
  type: 'ATTACK' | 'SKILL';
  skill?: Skill;
}

export class Enemy extends Entity {
  private readonly _tier: EnemyTier;
  private readonly _rewards: EnemyRewards;
  private readonly _skills: Skill[];
  private readonly _description: string;

  constructor(
    name: string,
    stats: EntityStats,
    tier: EnemyTier,
    rewards: EnemyRewards,
    skills: Skill[],
    description: string,
  ) {
    super(name, stats);
    this._tier = tier;
    this._rewards = rewards;
    this._skills = skills;
    this._description = description;
  }

  get tier(): EnemyTier { return this._tier; }
  get rewards(): EnemyRewards { return { ...this._rewards }; }

  decideAction(): AIAction {
    const usable = this._skills.filter(s => s.canUse(this));
    if (usable.length > 0 && Math.random() < 0.70) {
      const skill = usable[Math.floor(Math.random() * usable.length)]!;
      return { type: 'SKILL', skill };
    }
    return { type: 'ATTACK' };
  }

  tickSkillCooldowns(): void {
    for (const skill of this._skills) skill.tickCooldown();
  }

  describe(): string {
    const tier = this._tier === 'BOSS' ? '👑 BOSS' : this._tier === 'ELITE' ? '⚡ ELITE' : '';
    return `${tier} ${this._name} (Lv.${this._stats.level}) — ${this._description}`;
  }
}
