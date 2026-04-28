import { Skill, type SkillResult } from './Skill';
import { FortifyEffect, RegenerationEffect } from './StatusEffect';
import type { Entity } from '../entities/Entity';

export class DivineShieldSkill extends Skill {
  constructor() {
    super('DIVINE_SHIELD', 'Escudo Divino', '+10 DEF e regeneração por 3 turnos.', 30, 3);
  }

  protected execute(caster: Entity, _target: Entity): SkillResult {
    caster.applyStatusEffect(new FortifyEffect(10, 3));
    caster.applyStatusEffect(new RegenerationEffect(Math.floor(caster.maxHp * 0.05), 3));
    return {
      log: `🌟 ${caster.name} evoca o Escudo Divino! (+10 DEF e regeneração por 3 turnos)`,
      hit: true,
    };
  }
}
