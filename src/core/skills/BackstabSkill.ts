import { Skill, type SkillResult } from './Skill';
import type { Entity } from '../entities/Entity';

export class BackstabSkill extends Skill {
  constructor() {
    super('BACKSTAB', 'Golpe Traiçoeiro', 'Ataque preciso com 2.8x de dano crítico.', 20, 1);
  }

  protected execute(caster: Entity, target: Entity): SkillResult {
    const damage = Math.floor(caster.attack * 2.8);
    const dealt = target.takeDamage(damage);
    return {
      log: `🗡️  ${caster.name} aplica Golpe Traiçoeiro em ${target.name} causando ${dealt} de dano crítico!`,
      hit: true,
    };
  }
}
