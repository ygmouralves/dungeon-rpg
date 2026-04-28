import { Skill, type SkillResult } from './Skill';
import type { Entity } from '../entities/Entity';

export class CleaveSkill extends Skill {
  constructor() {
    super('CLEAVE', 'Fendilhar', 'Golpe brutal com 2x de dano.', 25, 1);
  }

  protected execute(caster: Entity, target: Entity): SkillResult {
    const damage = Math.floor(caster.attack * 2.0);
    const dealt = target.takeDamage(damage);
    return {
      log: `🪓 ${caster.name} usa Fendilhar em ${target.name} causando ${dealt} de dano!`,
      hit: true,
    };
  }
}
