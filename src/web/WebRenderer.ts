import type { IRenderer } from '../ui/IRenderer';
import type { Player } from '../core/entities/Player';
import type { Enemy } from '../core/entities/Enemy';
import type { Room } from '../dungeon/Room';
import type { Item } from '../core/inventory/Item';
import type { WebChannel, PlayerUI, EnemyUI } from './WebChannel';

export class WebRenderer implements IRenderer {
  private _currentEnemies: Enemy[] = [];

  constructor(private readonly _channel: WebChannel) {}

  clear(): void { /* no-op: browser manages its own DOM */ }

  log(msg: string): void {
    this._channel.send({ type: 'LOG', text: msg, color: this._colorFor(msg) });
  }

  banner(): void {
    this._channel.send({ type: 'LOG', text: '⚔️  Bem-vindo à Masmorra! Boa sorte, aventureiro.', color: 'gold' });
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
    this._channel.send({ type: 'LOG', text: '⚔️  COMBATE INICIADO!', color: 'red' });
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
    const usable = player.skills.filter(s => s.canUse(player));
    const hasItems = player.inventory.getConsumables().length > 0;

    this._channel.setPendingChoices([
      { value: '1', label: '⚔️  [1] Atacar' },
      { value: '2', label: `✨ [2] Habilidades${usable.length > 0 ? ` (${usable.length})` : ''}`, disabled: usable.length === 0 },
      { value: '3', label: '🎒 [3] Usar Item', disabled: !hasItems },
      { value: '4', label: '🏃 [4] Fugir' },
    ]);
  }

  renderLoot(items: Item[]): void {
    for (const item of items) {
      this._channel.send({ type: 'LOG', text: `💎 ${item.toString()}`, color: 'gold' });
    }
  }

  renderLevelUp(player: Player): void {
    this._channel.send({ type: 'LOG', text: `🌟 LEVEL UP! Nível ${player.level}!`, color: 'gold' });
    this._channel.send({
      type: 'STATE',
      player: this._toPlayerUI(player),
      enemies: [],
    });
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
      statusEffects: player.getStatusSummary() ? player.getStatusSummary().replace(/[\[\]]/g, '').split(', ') : [],
    };
  }

  private _toEnemyUI(enemy: Enemy): EnemyUI {
    return {
      name: enemy.name,
      tier: enemy.tier,
      hp: enemy.hp,
      maxHp: enemy.maxHp,
      level: enemy.level,
      statusEffects: enemy.getStatusSummary() ? enemy.getStatusSummary().replace(/[\[\]]/g, '').split(', ') : [],
    };
  }

  private _colorFor(msg: string): string {
    if (/dano|💢|ataca|Golpe|Bola de Fogo|💀/.test(msg)) return 'damage';
    if (/recupera|Cura|💚|regenera/.test(msg)) return 'heal';
    if (/usa |habilidade|🔥|☠|✨|⚔️/.test(msg)) return 'skill';
    if (/🏆|🌟|Vitória|LEVEL UP/.test(msg)) return 'gold';
    if (/atordoa|💫|Veneno|Queimadura|Fraqueza|Fortifi/.test(msg)) return 'status';
    if (/GAME OVER|derrotado|💀/.test(msg)) return 'red';
    return 'info';
  }
}
