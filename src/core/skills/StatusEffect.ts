import type { Entity } from '../entities/Entity';

export abstract class StatusEffect {
  protected _duration: number;

  constructor(
    public readonly id: string,
    public readonly name: string,
    duration: number,
  ) {
    this._duration = duration;
  }

  get duration(): number { return this._duration; }

  refresh(newDuration: number): void { this._duration = newDuration; }
  isExpired(): boolean { return this._duration <= 0; }

  preventsAction(): boolean { return false; }
  modifyAttack(base: number): number { return base; }
  modifyDefense(base: number): number { return base; }
  onTurnEnd(target: Entity): string | null {
    this._duration--;
    return null;
  }

  abstract clone(): StatusEffect;
}

export class PoisonEffect extends StatusEffect {
  constructor(duration = 3) {
    super('POISON', 'Veneno', duration);
  }
  onTurnEnd(target: Entity): string | null {
    const dmg = Math.max(1, Math.floor(target.maxHp * 0.05));
    target.takeDamage(dmg + target.defense); // bypasses defense
    this._duration--;
    return `☠  ${target.name} sofre ${dmg} de dano de veneno. (${this._duration} turnos restantes)`;
  }
  clone(): PoisonEffect { return new PoisonEffect(this._duration); }
}

export class BurnEffect extends StatusEffect {
  constructor(duration = 2) {
    super('BURN', 'Queimadura', duration);
  }
  onTurnEnd(target: Entity): string | null {
    const dmg = Math.max(2, Math.floor(target.maxHp * 0.08));
    target.takeDamage(dmg + target.defense); // bypasses defense
    this._duration--;
    return `🔥 ${target.name} queima por ${dmg} de dano. (${this._duration} turnos restantes)`;
  }
  clone(): BurnEffect { return new BurnEffect(this._duration); }
}

export class StunEffect extends StatusEffect {
  constructor(duration = 1) {
    super('STUN', 'Atordoado', duration);
  }
  preventsAction(): boolean { return true; }
  onTurnEnd(target: Entity): string | null {
    this._duration--;
    return `💫 ${target.name} está atordoado e não pode agir!`;
  }
  clone(): StunEffect { return new StunEffect(this._duration); }
}

export class RegenerationEffect extends StatusEffect {
  private readonly _healPerTurn: number;
  constructor(healPerTurn: number, duration = 3) {
    super('REGEN', 'Regeneração', duration);
    this._healPerTurn = healPerTurn;
  }
  onTurnEnd(target: Entity): string | null {
    const healed = target.heal(this._healPerTurn);
    this._duration--;
    return `💚 ${target.name} regenera ${healed} HP. (${this._duration} turnos restantes)`;
  }
  clone(): RegenerationEffect { return new RegenerationEffect(this._healPerTurn, this._duration); }
}

export class WeaknessEffect extends StatusEffect {
  constructor(duration = 2) {
    super('WEAKNESS', 'Fraqueza', duration);
  }
  modifyAttack(base: number): number { return Math.floor(base * 0.6); }
  onTurnEnd(target: Entity): string | null {
    this._duration--;
    return null;
  }
  clone(): WeaknessEffect { return new WeaknessEffect(this._duration); }
}

export class FortifyEffect extends StatusEffect {
  private readonly _bonus: number;
  constructor(bonus: number, duration = 3) {
    super('FORTIFY', 'Fortalecido', duration);
    this._bonus = bonus;
  }
  modifyDefense(base: number): number { return base + this._bonus; }
  onTurnEnd(target: Entity): string | null {
    this._duration--;
    return null;
  }
  clone(): FortifyEffect { return new FortifyEffect(this._bonus, this._duration); }
}
