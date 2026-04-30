import type { Entity } from '../entities/Entity';

export interface SkillResult {
  log: string;
  hit: boolean;
}

export abstract class Skill {
  protected _currentCooldown = 0;

  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly description: string,
    public readonly manaCost: number,
    public readonly cooldown: number,
  ) {}

  canUse(caster: Entity): boolean {
    return this._currentCooldown === 0 && caster.mana >= this.manaCost;
  }

  use(caster: Entity, target: Entity): SkillResult {
    if (!caster.consumeMana(this.manaCost)) {
      return { log: `${caster.name} não tem mana suficiente para usar ${this.name}!`, hit: false };
    }
    this._currentCooldown = this.cooldown;
    return this.execute(caster, target);
  }

  tickCooldown(): void {
    if (this._currentCooldown > 0) this._currentCooldown--;
  }

  get cooldownRemaining(): number { return this._currentCooldown; }

  setCooldown(n: number): void { this._currentCooldown = Math.max(0, n); }

  protected abstract execute(caster: Entity, target: Entity): SkillResult;
}
