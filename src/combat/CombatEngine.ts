import type { Player } from '../core/entities/Player';
import type { Enemy } from '../core/entities/Enemy';
import type { Skill } from '../core/skills/Skill';
import type { IInputHandler } from '../ui/IInputHandler';
import type { IRenderer } from '../ui/IRenderer';
import { EquipmentItem } from '../core/inventory/EquipmentItem';

export type CombatAction =
  | { type: 'ATTACK' }
  | { type: 'SKILL'; skill: Skill }
  | { type: 'ITEM'; itemId: string; equip: boolean }
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
      const aliveEnemies = enemies.filter(e => e.isAlive());

      // Pre-compute enemy intents for this round so they're visible during player's turn
      aliveEnemies.forEach(e => e.precomputeIntent());

      const order = this._buildTurnOrder(player, aliveEnemies);

      for (const actor of order) {
        if (!player.isAlive()) break;
        const stillAlive = enemies.filter(e => e.isAlive());
        if (stillAlive.length === 0) break;

        if (actor === 'PLAYER') {
          // Render with fresh intents before showing action menu
          this._renderer.renderCombatStatus(player, stillAlive);
          const action = await this._promptPlayerAction(player, stillAlive);

          if (action.type === 'FLEE') {
            this._renderer.log('Você fugiu do combate!');
            return 'FLED';
          }

          await this._executePlayerAction(action, player, stillAlive);

          const statusLogs = player.tickStatusEffects();
          statusLogs.forEach(l => this._renderer.log(l));

          if (!player.isAlive()) break;

        } else {
          const enemy = actor as Enemy;
          if (!enemy.isAlive()) continue;

          this._renderer.log(`\n-- Turno de ${enemy.name} --`);

          if (enemy.isStunned()) {
            this._renderer.log(`${enemy.name} está atordoado e perde o turno!`);
          } else {
            const action = enemy.decideAction();
            if (action.type === 'SKILL' && action.skill) {
              const result = action.skill.use(enemy, player);
              this._renderer.log(result.log);
            } else {
              const dmg = player.takeDamage(enemy.attack);
              this._renderer.log(`${enemy.name} ataca ${player.name} causando ${dmg} de dano!`);
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
      this._renderer.log('\nVocê foi derrotado...');
      return 'DEFEAT';
    }

    this._renderer.log('\nVitória! Todos os inimigos foram derrotados!');
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

      // Inventory card clicks: equip or use
      if (choice.startsWith('equip_')) {
        const itemId = choice.slice(6);
        const item = player.inventory.findById(itemId);
        if (item && item.getTypeLabel().startsWith('Equipamento')) {
          return { type: 'ITEM', itemId, equip: true };
        }
        this._renderer.log('Item não encontrado ou não é equipável.');
        this._renderer.renderActionMenu(player, enemies);
        continue;
      }

      if (choice.startsWith('use_')) {
        const itemId = choice.slice(4);
        const item = player.inventory.findById(itemId);
        if (item && item.getTypeLabel() === 'Consumível') {
          return { type: 'ITEM', itemId, equip: false };
        }
        this._renderer.log('Item não encontrado ou não é consumível.');
        this._renderer.renderActionMenu(player, enemies);
        continue;
      }

      // Inventory modal trigger (frontend handles opening; backend waits for actual item choice)
      if (choice === 'open_inventory') {
        // Frontend will re-render the inventory modal; loop continues waiting for use_/equip_ input
        continue;
      }

      // Direct skill selection
      if (choice.startsWith('skill_')) {
        const skillId = choice.slice(6);
        const skill = player.skills.find(s => s.id === skillId);
        if (skill && skill.canUse(player)) return { type: 'SKILL', skill };
        this._renderer.log('Habilidade indisponível no momento.');
        this._renderer.renderActionMenu(player, enemies);
        continue;
      }

      // Terminal fallbacks
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
        return { type: 'ITEM', itemId: id, equip: false };
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
      this._renderer.log(`${player.name} ataca ${target.name} causando ${dmg} de dano!`);
    }

    if (action.type === 'SKILL') {
      const result = action.skill.use(player, target);
      this._renderer.log(result.log);
      player.skills.forEach(s => s.tickCooldown());
    }

    if (action.type === 'ITEM') {
      const item = player.inventory.findById(action.itemId);
      if (!item) return;

      if (action.equip) {
        if (item instanceof EquipmentItem) {
          const prev = player.equip(item);
          player.inventory.remove(action.itemId);
          let msg = `◆ ${player.name} equipou ${item.name} [${item.tier}]!`;
          if (prev) {
            player.inventory.add(prev);
            msg += ` (${prev.name} desequipado)`;
          }
          this._renderer.log(msg);
        }
      } else {
        if (item.getTypeLabel() === 'Consumível') {
          const consumable = item as import('../core/inventory/ConsumableItem').ConsumableItem;
          const msg = consumable.use(player);
          player.inventory.remove(action.itemId);
          this._renderer.log(msg);
        }
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
