import { Skill, type SkillResult } from './Skill';
import { WeaknessEffect } from './StatusEffect';
import type { Entity } from '../entities/Entity';

export class PowerStrikeSkill extends Skill {
  constructor() {
    super(
      'POWER_STRIKE',
      'Golpe Poderoso',
      'Um golpe devastador que aplica Fraqueza no alvo por 2 turnos.',
      10,
      1,
    );
  }

  protected execute(caster: Entity, target: Entity): SkillResult {
    const damage = Math.floor(caster.attack * 2.2);
    const dealt = target.takeDamage(damage);
    target.applyStatusEffect(new WeaknessEffect(2));
    return {
      log: `⚔️  ${caster.name} usa Golpe Poderoso em ${target.name} causando ${dealt} de dano e aplicando Fraqueza!`,
      hit: true,
    };
  }
}
