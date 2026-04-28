import chalk from 'chalk';
import type { Player } from '../core/entities/Player';
import type { Enemy } from '../core/entities/Enemy';
import type { Room } from '../dungeon/Room';

const LINE = chalk.gray('─'.repeat(60));

export class TerminalRenderer {
  clear(): void { console.clear(); }

  log(msg: string): void { console.log(msg); }

  banner(): void {
    console.log(chalk.red.bold('\n' + '═'.repeat(60)));
    console.log(chalk.red.bold('   ⚔️  DUNGEON RPG  ⚔️   Terminal Roguelike'));
    console.log(chalk.gray('   OOP • SOLID • Clean Code • TypeScript'));
    console.log(chalk.red.bold('═'.repeat(60) + '\n'));
  }

  renderPlayerStatus(player: Player): void {
    console.log(LINE);
    console.log(
      chalk.yellow(`👤 ${player.name}`) +
      chalk.gray(` Lv.${player.level}`) +
      chalk.gray(`  |  Andar ${player.floor}`),
    );
    console.log(
      chalk.red(`❤  HP  ${this._bar(player.hp, player.maxHp, 20, chalk.red)}`) +
      chalk.gray(` ${player.hp}/${player.maxHp}`),
    );
    console.log(
      chalk.blue(`💧 MP  ${this._bar(player.mana, player.maxMana, 20, chalk.blue)}`) +
      chalk.gray(` ${player.mana}/${player.maxMana}`),
    );
    console.log(
      chalk.white(`⚔  ATK ${player.attack}`) +
      chalk.white(`  🛡  DEF ${player.defense}`) +
      chalk.yellow(`  💰 ${player.gold}G`) +
      chalk.cyan(`  XP ${player.experience}/${player.level * 100}`),
    );
    const status = player.getStatusSummary();
    if (status) console.log(chalk.magenta(`✨ Status: ${status}`));
    console.log(LINE);
  }

  renderRoom(room: Room): void {
    console.log(chalk.cyan(`\n📍 Sala ${room.id + 1} — ${this._roomLabel(room.type)}`));
    console.log(chalk.gray(room.description));
  }

  combatStart(player: Player, enemies: Enemy[]): void {
    console.log(chalk.red.bold('\n⚔️  COMBATE INICIADO! ⚔️'));
    enemies.forEach(e => console.log(chalk.red(`  👾 ${e.describe()}`)));
    console.log();
  }

  renderCombatStatus(player: Player, enemies: Enemy[]): void {
    console.log(LINE);
    console.log(
      chalk.yellow(`${player.name}`) +
      chalk.red(`  HP ${player.hp}/${player.maxHp}`) +
      chalk.blue(`  MP ${player.mana}/${player.maxMana}`) +
      (player.getStatusSummary() ? chalk.magenta(`  ${player.getStatusSummary()}`) : ''),
    );
    enemies.forEach(e => {
      console.log(
        chalk.red(`  ${e.name}`) +
        chalk.gray(` HP ${e.hp}/${e.maxHp}`) +
        (e.getStatusSummary() ? chalk.magenta(`  ${e.getStatusSummary()}`) : ''),
      );
    });
    console.log(LINE);
  }

  renderActionMenu(player: Player, enemies: Enemy[]): void {
    console.log(chalk.white.bold('\n🎮 Sua ação:'));
    console.log(chalk.white('  1. Atacar'));

    const usableSkills = player.skills.filter(s => s.canUse(player));
    if (usableSkills.length > 0) {
      console.log(chalk.cyan('  2. Habilidades') + chalk.gray(` (${usableSkills.length} disponível/is)`));
    } else {
      console.log(chalk.gray('  2. Habilidades (nenhuma disponível)'));
    }

    const consumables = player.inventory.getConsumables();
    console.log(
      consumables.length > 0
        ? chalk.green(`  3. Usar Item (${consumables.length} no inventário)`)
        : chalk.gray('  3. Usar Item (inventário vazio)'),
    );

    console.log(chalk.gray('  4. Fugir'));
  }

  renderLoot(items: import('../core/inventory/Item').Item[]): void {
    if (items.length === 0) return;
    console.log(chalk.yellow('\n💎 Itens encontrados:'));
    items.forEach(i => console.log(chalk.yellow(`  + ${i.toString()}`)));
  }

  async renderLevelUp(player: Player, points: number): Promise<void> {
    console.log(chalk.yellow.bold('\n★ LEVEL UP! Você chegou ao nível ' + player.level + '! ★'));
    console.log(chalk.green(`   +${points} pontos distribuídos automaticamente (HP).`));
    player.applyStatBonus(0, 0, 0, points);
  }

  renderGameOver(): void {
    console.log(chalk.red.bold('\n' + '═'.repeat(60)));
    console.log(chalk.red.bold('   💀  GAME OVER  💀'));
    console.log(chalk.red.bold('═'.repeat(60) + '\n'));
  }

  renderVictory(player: Player): void {
    console.log(chalk.yellow.bold('\n' + '═'.repeat(60)));
    console.log(chalk.yellow.bold('   🏆  VOCÊ CONQUISTOU A MASMORRA!  🏆'));
    console.log(chalk.white(`   ${player.name} — Lv.${player.level} | ${player.gold}G coletados`));
    console.log(chalk.yellow.bold('═'.repeat(60) + '\n'));
  }

  private _bar(current: number, max: number, width: number, color: chalk.Chalk): string {
    const filled = Math.round((current / max) * width);
    return color('█'.repeat(filled)) + chalk.gray('░'.repeat(width - filled));
  }

  private _roomLabel(type: import('../dungeon/Room').RoomType): string {
    return {
      COMBAT: 'Sala de Combate',
      ELITE_COMBAT: 'Sala de Elite',
      TREASURE: 'Sala do Tesouro',
      REST: 'Sala de Descanso',
      SHOP: 'Loja',
      BOSS: 'Sala do Chefão',
    }[type];
  }
}
