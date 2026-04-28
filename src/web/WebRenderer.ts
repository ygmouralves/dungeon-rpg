import type { IRenderer } from '../ui/IRenderer';
import type { Player } from '../core/entities/Player';
import type { Enemy } from '../core/entities/Enemy';
import type { Room } from '../dungeon/Room';
import type { Item } from '../core/inventory/Item';
import type { WebChannel, PlayerUI, EnemyUI } from './WebChannel';

export class WebRenderer implements IRenderer {
  private _currentEnemies: Enemy[] = [];

  constructor(private readonly _channel: WebChannel) {}

  clear(): void { /* no-op */ }

  log(msg: string): void {
    this._channel.send({ type: 'LOG', text: msg, color: this._colorFor(msg) });
  }

  banner(): void {
    this._channel.send({ type: 'LOG', text: 'Bem-vindo ao Éter. Que a sombra não te alcance.', color: 'gold' });
  }

  renderPlayerStatus(player: Player): void {
    this._channel.send({
      type: 'STATE',
      player: this._toPlayerUI(player),
      enemies: this._currentEnemies.filter(e => e.isAlive()).map(e => this._toEnemyUI(e)),
    });
  }

  renderRoom(room: Room): void {
    this._channel.send({ type: 'ROOM', roomType: room.type, description: room.description });
  }

  combatStart(player: Player, enemies: Enemy[]): void {
    this._currentEnemies = enemies;
    this._channel.send({ type: 'LOG', text: 'COMBATE INICIADO', color: 'red' });
    this._channel.send({
      type: 'STATE',
      player: this._toPlayerUI(player),
      enemies: enemies.map(e => this._toEnemyUI(e)),
    });
  }

  renderCombatStatus(player: Player, enemies: Enemy[]): void {
    this._currentEnemies = enemies.filter(e => e.isAlive());
    this._channel.send({
      type: 'STATE',
      player: this._toPlayerUI(player),
      enemies: this._currentEnemies.map(e => this._toEnemyUI(e)),
    });
  }

  renderActionMenu(player: Player, _enemies: Enemy[]): void {
    const choices: import('./WebChannel').ChoiceItem[] = [
      { value: '1', label: 'ATACAR', description: 'Ataque físico básico', kind: 'attack' },
    ];

    for (const skill of player.skills) {
      const cd = skill.cooldownRemaining;
      const available = skill.canUse(player);
      choices.push({
        value: `skill_${skill.id}`,
        label: skill.name,
        description: `${skill.description}  ·  ${skill.manaCost} EP${cd > 0 ? `  ·  Recarga: ${cd}T` : ''}`,
        kind: 'skill',
        disabled: !available,
      });
    }

    const consumables = player.inventory.getConsumables();
    if (consumables.length > 0) {
      choices.push({
        value: '3',
        label: 'ITEM',
        description: `${consumables.length} item${consumables.length > 1 ? 's' : ''} disponível${consumables.length > 1 ? 'is' : ''}`,
        kind: 'item',
      });
    }

    choices.push({ value: '4', label: 'FUGIR', description: 'Abandonar o combate', kind: 'flee' });

    this._channel.setPendingChoices(choices);
  }

  renderLoot(items: Item[]): void {
    for (const item of items) {
      this._channel.send({ type: 'LOG', text: `◈ ${item.toString()}`, color: 'gold' });
    }
  }

  renderLevelUp(player: Player): void {
    this._channel.send({ type: 'LOG', text: `NÍVEL SUPERIOR — Lv.${player.level}`, color: 'gold' });
    this._channel.send({ type: 'STATE', player: this._toPlayerUI(player), enemies: [] });
  }

  renderGameOver(): void {
    this._channel.send({ type: 'GAME_OVER' });
  }

  renderVictory(_player: Player): void {
    this._channel.send({ type: 'VICTORY' });
  }

  private _toPlayerUI(player: Player): PlayerUI {
    return {
      name: player.name,
      level: player.level,
      hp: player.hp,
      maxHp: player.maxHp,
      mana: player.mana,
      maxMana: player.maxMana,
      attack: player.attack,
      defense: player.defense,
      gold: player.gold,
      experience: player.experience,
      floor: player.floor,
      statusEffects: player.getStatusSummary()
        ? player.getStatusSummary().replace(/[\[\]]/g, '').split(', ')
        : [],
    };
  }

  private _toEnemyUI(enemy: Enemy): EnemyUI {
    return {
      name: enemy.name,
      tier: enemy.tier,
      hp: enemy.hp,
      maxHp: enemy.maxHp,
      level: enemy.level,
      statusEffects: enemy.getStatusSummary()
        ? enemy.getStatusSummary().replace(/[\[\]]/g, '').split(', ')
        : [],
    };
  }

  private _colorFor(msg: string): string {
    if (/dano|ataca|Golpe|Fogo|Gelo|Surto|causando/.test(msg)) return 'damage';
    if (/recupera|Cura|regenera|HP/.test(msg)) return 'heal';
    if (/usa |Grito|Lâmina|Traiçoeiro|Sagrado|Arcano|Escudo/.test(msg)) return 'skill';
    if (/NÍVEL|Vitória|LEVEL UP/.test(msg)) return 'gold';
    if (/Veneno|Queimadura|atordoado|Fraqueza|Fortalec/.test(msg)) return 'status';
    if (/GAME OVER|derrotado/.test(msg)) return 'red';
    return 'info';
  }
}
