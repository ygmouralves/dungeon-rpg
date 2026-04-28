import { Skill, type SkillResult } from './Skill';
import { FortifyEffect } from './StatusEffect';
import type { Entity } from '../entities/Entity';

export class BattleCrySkill extends Skill {
  constructor() {
    super('BATTLE_CRY', 'Grito de Guerra', 'Fortalece a defesa por 3 turnos (+8 DEF).', 20, 2);
  }

  protected execute(caster: Entity, _target: Entity): SkillResult {
    caster.applyStatusEffect(new FortifyEffect(8, 3));
    return {
      log: `🛡️  ${caster.name} solta um Grito de Guerra e se fortalece! (+8 DEF por 3 turnos)`,
      hit: true,
    };
  }
}
