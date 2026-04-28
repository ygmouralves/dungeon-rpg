import { Enemy, type EnemyTier } from '../core/entities/Enemy';
import type { Skill } from '../core/skills/Skill';
import { FireballSkill } from '../core/skills/FireballSkill';
import { PowerStrikeSkill } from '../core/skills/PowerStrikeSkill';
import { PoisonEffect, StunEffect } from '../core/skills/StatusEffect';
import { Skill as SkillBase, type SkillResult } from '../core/skills/Skill';
import type { Entity } from '../core/entities/Entity';

class VenomBiteSkill extends SkillBase {
  constructor() {
    super('VENOM_BITE', 'Picada Venenosa', 'Causa dano e aplica Veneno.', 5, 2);
  }
  protected execute(caster: Entity, target: Entity): SkillResult {
    const dealt = target.takeDamage(Math.floor(caster.attack * 1.2));
    target.applyStatusEffect(new PoisonEffect(3));
    return { log: `🕷  ${caster.name} usa Picada Venenosa em ${target.name} causando ${dealt} de dano e aplicando Veneno!`, hit: true };
  }
}

class TailSweepSkill extends SkillBase {
  constructor() {
    super('TAIL_SWEEP', 'Varredura com Cauda', 'Atordoa o alvo por 1 turno.', 8, 3);
  }
  protected execute(caster: Entity, target: Entity): SkillResult {
    const dealt = target.takeDamage(Math.floor(caster.attack * 1.0));
    target.applyStatusEffect(new StunEffect(1));
    return { log: `💥 ${caster.name} usa Varredura com Cauda em ${target.name} causando ${dealt} de dano e atordoando!`, hit: true };
  }
}

type EnemyTemplate = {
  name: string;
  description: string;
  tier: EnemyTier;
  hpScale: number;
  mpScale: number;
  atkScale: number;
  defScale: number;
  speed: number;
  xpScale: number;
  goldScale: number;
  buildSkills: () => Skill[];
};

const TEMPLATES: EnemyTemplate[] = [
  {
    name: 'Goblin',
    description: 'Criatura verde e veloz, prefere atacar em grupos.',
    tier: 'MINION',
    hpScale: 0.7,
    mpScale: 0.5,
    atkScale: 0.8,
    defScale: 0.5,
    speed: 8,
    xpScale: 0.8,
    goldScale: 0.6,
    buildSkills: () => [],
  },
  {
    name: 'Aranha Gigante',
    description: 'Tece teias e injeta veneno paralisante.',
    tier: 'MINION',
    hpScale: 0.9,
    mpScale: 0.6,
    atkScale: 0.9,
    defScale: 0.4,
    speed: 7,
    xpScale: 1.0,
    goldScale: 0.8,
    buildSkills: () => [new VenomBiteSkill()],
  },
  {
    name: 'Esqueleto Guerreiro',
    description: 'Ossos animados por magia negra. Difícil de matar.',
    tier: 'MINION',
    hpScale: 1.1,
    mpScale: 0.3,
    atkScale: 1.0,
    defScale: 0.9,
    speed: 5,
    xpScale: 1.1,
    goldScale: 1.0,
    buildSkills: () => [],
  },
  {
    name: 'Mago Sombrio',
    description: 'Conjurador das trevas. Seu fogo negro queima a alma.',
    tier: 'ELITE',
    hpScale: 1.0,
    mpScale: 2.0,
    atkScale: 1.4,
    defScale: 0.7,
    speed: 6,
    xpScale: 1.8,
    goldScale: 1.5,
    buildSkills: () => [new FireballSkill()],
  },
  {
    name: 'Golem de Pedra',
    description: 'Construto massivo de rocha encantada.',
    tier: 'ELITE',
    hpScale: 2.2,
    mpScale: 0.5,
    atkScale: 1.3,
    defScale: 2.0,
    speed: 3,
    xpScale: 2.0,
    goldScale: 1.8,
    buildSkills: () => [new TailSweepSkill()],
  },
  {
    name: 'Dragão das Sombras',
    description: 'Senhor das trevas da masmorra. Sua presença enregela o sangue.',
    tier: 'BOSS',
    hpScale: 4.0,
    mpScale: 3.0,
    atkScale: 2.5,
    defScale: 2.5,
    speed: 7,
    xpScale: 5.0,
    goldScale: 5.0,
    buildSkills: () => [new FireballSkill(), new PowerStrikeSkill(), new TailSweepSkill()],
  },
];

export class EnemyFactory {
  static createForFloor(floor: number, tier: EnemyTier = 'MINION'): Enemy {
    const pool = TEMPLATES.filter(t => t.tier === tier);
    const template = pool[Math.floor(Math.random() * pool.length)]!;
    return EnemyFactory.fromTemplate(template, floor);
  }

  static createBoss(floor: number): Enemy {
    return EnemyFactory.fromTemplate(TEMPLATES[TEMPLATES.length - 1]!, floor);
  }

  private static fromTemplate(t: EnemyTemplate, floor: number): Enemy {
    const lvl = Math.max(1, floor + (t.tier === 'BOSS' ? 2 : t.tier === 'ELITE' ? 1 : 0));
    const base = 10 + lvl * 5;

    return new Enemy(
      t.name,
      {
        hp: Math.floor(base * t.hpScale),
        maxHp: Math.floor(base * t.hpScale),
        mana: Math.floor(base * t.mpScale * 0.5),
        maxMana: Math.floor(base * t.mpScale * 0.5),
        baseAttack: Math.floor((3 + lvl * 2) * t.atkScale),
        baseDefense: Math.floor((1 + lvl) * t.defScale),
        speed: t.speed,
        level: lvl,
      },
      t.tier,
      {
        experience: Math.floor((20 + lvl * 15) * t.xpScale),
        gold: Math.floor((5 + lvl * 8) * t.goldScale),
      },
      t.buildSkills(),
      t.description,
    );
  }
}
