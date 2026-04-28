import { Skill, type SkillResult } from './Skill';
import { BurnEffect } from './StatusEffect';
import type { Entity } from '../entities/Entity';

export class FireballSkill extends Skill {
  constructor() {
    super('FIREBALL', 'Bola de Fogo', 'Lança uma esfera flamejante. Causa dano e aplica Queimadura.', 20, 2);
  }

  protected execute(caster: Entity, target: Entity): SkillResult {
    const damage = Math.floor(caster.attack * 1.8);
    const dealt = target.takeDamage(damage);
    target.applyStatusEffect(new BurnEffect(2));
    return {
      log: `🔥 ${caster.name} usa Bola de Fogo em ${target.name} causando ${dealt} de dano e aplicando Queimadura!`,
      hit: true,
    };
  }
}
