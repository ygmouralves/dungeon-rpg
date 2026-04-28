import type { StatusEffect } from '../skills/StatusEffect';

export interface EntityStats {
  hp: number;
  maxHp: number;
  mana: number;
  maxMana: number;
  baseAttack: number;
  baseDefense: number;
  speed: number;
  level: number;
}

export abstract class Entity {
  protected readonly _name: string;
  protected _stats: EntityStats;
  protected _statusEffects = new Map<string, StatusEffect>();

  constructor(name: string, stats: EntityStats) {
    this._name = name;
    this._stats = { ...stats };
  }

  get name(): string { return this._name; }
  get hp(): number { return this._stats.hp; }
  get maxHp(): number { return this._stats.maxHp; }
  get mana(): number { return this._stats.mana; }
  get maxMana(): number { return this._stats.maxMana; }
  get level(): number { return this._stats.level; }
  get speed(): number { return this._stats.speed; }

  get attack(): number {
    return [...this._statusEffects.values()]
      .reduce((val, e) => e.modifyAttack(val), this._stats.baseAttack);
  }

  get defense(): number {
    return Math.max(
      0,
      [...this._statusEffects.values()]
        .reduce((val, e) => e.modifyDefense(val), this._stats.baseDefense),
    );
  }

  isAlive(): boolean { return this._stats.hp > 0; }

  isStunned(): boolean {
    return [...this._statusEffects.values()].some(e => e.preventsAction());
  }

  takeDamage(rawDamage: number): number {
    const damage = Math.max(1, rawDamage - this.defense);
    this._stats.hp = Math.max(0, this._stats.hp - damage);
    return damage;
  }

  heal(amount: number): number {
    const actual = Math.min(amount, this._stats.maxHp - this._stats.hp);
    this._stats.hp += actual;
    return actual;
  }

  consumeMana(amount: number): boolean {
    if (this._stats.mana < amount) return false;
    this._stats.mana -= amount;
    return true;
  }

  restoreMana(amount: number): void {
    this._stats.mana = Math.min(this._stats.maxMana, this._stats.mana + amount);
  }

  applyStatusEffect(effect: StatusEffect): void {
    const existing = this._statusEffects.get(effect.id);
    if (existing) {
      existing.refresh(effect.duration);
    } else {
      this._statusEffects.set(effect.id, effect.clone());
    }
  }

  tickStatusEffects(): string[] {
    const logs: string[] = [];
    for (const [id, effect] of this._statusEffects) {
      const msg = effect.onTurnEnd(this);
      if (msg) logs.push(msg);
      if (effect.isExpired()) this._statusEffects.delete(id);
    }
    return logs;
  }

  getStatusSummary(): string {
    if (this._statusEffects.size === 0) return '';
    return `[${[...this._statusEffects.keys()].join(', ')}]`;
  }

  abstract describe(): string;
}
