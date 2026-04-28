import { Skill, type SkillResult } from './Skill';
import { RegenerationEffect } from './StatusEffect';
import type { Entity } from '../entities/Entity';

export class HealSkill extends Skill {
  constructor() {
    super('HEAL', 'Cura Sagrada', 'Restaura HP e aplica Regeneração por 3 turnos.', 15, 3);
  }

  protected execute(caster: Entity, _target: Entity): SkillResult {
    const base = Math.floor(caster.maxHp * 0.25);
    const healed = caster.heal(base);
    caster.applyStatusEffect(new RegenerationEffect(Math.floor(base * 0.3), 3));
    return {
      log: `💚 ${caster.name} usa Cura Sagrada, recuperando ${healed} HP e ativando Regeneração!`,
      hit: true,
    };
  }
}
