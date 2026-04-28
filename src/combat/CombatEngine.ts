import type { Player } from '../core/entities/Player';
import type { Enemy } from '../core/entities/Enemy';
import type { Skill } from '../core/skills/Skill';
import type { IInputHandler } from '../ui/IInputHandler';
import type { IRenderer } from '../ui/IRenderer';

export type CombatAction =
  | { type: 'ATTACK' }
  | { type: 'SKILL'; skill: Skill }
  | { type: 'ITEM'; itemId: string }
  | { type: 'FLEE' };

export type CombatOutcome = 'VICTORY' | 'DEFEAT' | 'FLED';

export class CombatEngine {
  constructor(
    private readonly _input: IInputHandler,
    private readonly _renderer: IRenderer,
  ) {}

  async run(player: Player, enemies: Enemy[]): Promise<CombatOutcome> {
    this._renderer.combatStart(player, enemies);

    while (enemies.some(e => e.isAlive()) && player.isAlive()) {
      const order = this._buildTurnOrder(player, enemies.filter(e => e.isAlive()));

      for (const actor of order) {
        if (!player.isAlive()) break;
        const aliveEnemies = enemies.filter(e => e.isAlive());
        if (aliveEnemies.length === 0) break;

        if (actor === 'PLAYER') {
          const action = await this._promptPlayerAction(player, aliveEnemies);

          if (action.type === 'FLEE') {
            this._renderer.log('🏃 Você fugiu do combate!');
            return 'FLED';
          }

          await this._executePlayerAction(action, player, aliveEnemies);

          const statusLogs = player.tickStatusEffects();
          statusLogs.forEach(l => this._renderer.log(l));

          if (!player.isAlive()) break;

        } else {
          const enemy = actor as Enemy;
          if (!enemy.isAlive()) continue;

          this._renderer.log(`\n-- Turno de ${enemy.name} --`);

          if (enemy.isStunned()) {
            this._renderer.log(`💫 ${enemy.name} está atordoado e perde o turno!`);
          } else {
            const action = enemy.decideAction();
            if (action.type === 'SKILL' && action.skill) {
              const result = action.skill.use(enemy, player);
              this._renderer.log(result.log);
            } else {
              const dmg = player.takeDamage(enemy.attack);
              this._renderer.log(`💢 ${enemy.name} ataca ${player.name} causando ${dmg} de dano!`);
            }
          }

          const enemyStatusLogs = enemy.tickStatusEffects();
          enemyStatusLogs.forEach(l => this._renderer.log(l));
          enemy.tickSkillCooldowns();
        }

        this._renderer.renderCombatStatus(player, enemies.filter(e => e.isAlive()));
      }
    }

    if (!player.isAlive()) {
      this._renderer.log('\n💀 Você foi derrotado...');
      return 'DEFEAT';
    }

    this._renderer.log('\n🏆 Vitória! Todos os inimigos foram derrotados!');
    return 'VICTORY';
  }

  private _buildTurnOrder(player: Player, enemies: Enemy[]): Array<'PLAYER' | Enemy> {
    const all: Array<{ speed: number; actor: 'PLAYER' | Enemy }> = [
      { speed: player.speed, actor: 'PLAYER' },
      ...enemies.map(e => ({ speed: e.speed, actor: e as Enemy })),
    ];
    return all
      .sort((a, b) => b.speed - a.speed + (Math.random() * 2 - 1))
      .map(x => x.actor);
  }

  private async _promptPlayerAction(player: Player, enemies: Enemy[]): Promise<CombatAction> {
    this._renderer.renderActionMenu(player, enemies);

    while (true) {
      const choice = await this._input.ask('> ');

      if (choice === '1') return { type: 'ATTACK' };

      if (choice === '2') {
        const usable = player.skills.filter(s => s.canUse(player));
        if (usable.length === 0) {
          this._renderer.log('Nenhuma habilidade disponível no momento.');
          this._renderer.renderActionMenu(player, enemies);
          continue;
        }
        const skill = await this._pickSkill(player, usable);
        if (!skill) { this._renderer.renderActionMenu(player, enemies); continue; }
        return { type: 'SKILL', skill };
      }

      if (choice === '3') {
        const consumables = player.inventory.getConsumables();
        if (consumables.length === 0) {
          this._renderer.log('Inventário vazio.');
          this._renderer.renderActionMenu(player, enemies);
          continue;
        }
        const id = await this._pickItem(consumables);
        if (!id) { this._renderer.renderActionMenu(player, enemies); continue; }
        return { type: 'ITEM', itemId: id };
      }

      if (choice === '4') return { type: 'FLEE' };

      this._renderer.log('Opção inválida. Tente novamente.');
    }
  }

  private async _executePlayerAction(
    action: CombatAction,
    player: Player,
    enemies: Enemy[],
  ): Promise<void> {
    const target = enemies[0]!;

    if (action.type === 'ATTACK') {
      const dmg = target.takeDamage(player.attack);
      this._renderer.log(`⚔️  ${player.name} ataca ${target.name} causando ${dmg} de dano!`);
    }

    if (action.type === 'SKILL') {
      const result = action.skill.use(player, target);
      this._renderer.log(result.log);
      player.skills.forEach(s => s.tickCooldown());
    }

    if (action.type === 'ITEM') {
      const item = player.inventory.findById(action.itemId);
      if (item && item.getTypeLabel() === 'Consumível') {
        const consumable = item as import('../core/inventory/ConsumableItem').ConsumableItem;
        const msg = consumable.use(player);
        player.inventory.remove(action.itemId);
        this._renderer.log(msg);
      }
    }
  }

  private async _pickSkill(player: Player, usable: Skill[]): Promise<Skill | null> {
    this._renderer.log('\nEscolha uma habilidade:');
    usable.forEach((s, i) => {
      this._renderer.log(`  ${i + 1}. ${s.name} — ${s.description} (MP: ${s.manaCost})`);
    });
    this._renderer.log('  0. Voltar');
    const idx = parseInt(await this._input.ask('> '), 10) - 1;
    return idx >= 0 ? (usable[idx] ?? null) : null;
  }

  private async _pickItem(
    items: import('../core/inventory/ConsumableItem').ConsumableItem[],
  ): Promise<string | null> {
    this._renderer.log('\nEscolha um item:');
    items.forEach((item, i) => this._renderer.log(`  ${i + 1}. ${item.toString()}`));
    this._renderer.log('  0. Voltar');
    const idx = parseInt(await this._input.ask('> '), 10) - 1;
    return idx >= 0 ? (items[idx]?.id ?? null) : null;
  }
}
