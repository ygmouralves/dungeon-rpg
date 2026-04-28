import { Skill, type SkillResult } from './Skill';
import type { Entity } from '../entities/Entity';

export class ArcaneSurgeSkill extends Skill {
  constructor() {
    super('ARCANE_SURGE', 'Surto Arcano', 'Explosão mágica com 3x de dano devastador.', 50, 3);
  }

  protected execute(caster: Entity, target: Entity): SkillResult {
    const damage = Math.floor(caster.attack * 3.0);
    const dealt = target.takeDamage(damage);
    return {
      log: `✨ ${caster.name} desencadeia um Surto Arcano em ${target.name} causando ${dealt} de dano massivo!`,
      hit: true,
    };
  }
}
