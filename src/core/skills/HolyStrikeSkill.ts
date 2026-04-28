import { Skill, type SkillResult } from './Skill';
import type { Entity } from '../entities/Entity';

export class HolyStrikeSkill extends Skill {
  constructor() {
    super('HOLY_STRIKE', 'Golpe Sagrado', '1.6x dano abençoado e cura 15% do HP máximo.', 35, 2);
  }

  protected execute(caster: Entity, target: Entity): SkillResult {
    const damage = Math.floor(caster.attack * 1.6);
    const dealt = target.takeDamage(damage);
    const healed = caster.heal(Math.floor(caster.maxHp * 0.15));
    return {
      log: `✝️  ${caster.name} usa Golpe Sagrado causando ${dealt} em ${target.name} e recuperando ${healed} HP!`,
      hit: true,
    };
  }
}
