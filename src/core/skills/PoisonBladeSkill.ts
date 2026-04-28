import { Skill, type SkillResult } from './Skill';
import { PoisonEffect } from './StatusEffect';
import type { Entity } from '../entities/Entity';

export class PoisonBladeSkill extends Skill {
  constructor() {
    super('POISON_BLADE', 'Lâmina Envenenada', '1.3x dano e aplica Veneno por 3 turnos.', 15, 1);
  }

  protected execute(caster: Entity, target: Entity): SkillResult {
    const damage = Math.floor(caster.attack * 1.3);
    const dealt = target.takeDamage(damage);
    target.applyStatusEffect(new PoisonEffect(3));
    return {
      log: `☠️  ${caster.name} usa Lâmina Envenenada causando ${dealt} em ${target.name} e aplicando Veneno!`,
      hit: true,
    };
  }
}
