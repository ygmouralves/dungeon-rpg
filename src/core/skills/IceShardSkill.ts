import { Skill, type SkillResult } from './Skill';
import { StunEffect } from './StatusEffect';
import type { Entity } from '../entities/Entity';

export class IceShardSkill extends Skill {
  constructor() {
    super('ICE_SHARD', 'Fragmento de Gelo', '1.5x dano e atordoa o alvo por 1 turno.', 30, 2);
  }

  protected execute(caster: Entity, target: Entity): SkillResult {
    const damage = Math.floor(caster.attack * 1.5);
    const dealt = target.takeDamage(damage);
    target.applyStatusEffect(new StunEffect(1));
    return {
      log: `❄️  ${caster.name} lança Fragmento de Gelo em ${target.name} causando ${dealt} de dano e atordoando!`,
      hit: true,
    };
  }
}
