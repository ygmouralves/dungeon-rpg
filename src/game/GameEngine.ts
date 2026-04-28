import type { Player } from '../core/entities/Player';
import type { ISaveService } from '../persistence/ISaveService';
import type { DungeonGenerator } from '../dungeon/DungeonGenerator';
import type { CombatEngine } from '../combat/CombatEngine';
import type { IRenderer } from '../ui/IRenderer';
import type { IInputHandler } from '../ui/IInputHandler';
import type { GameState } from './GameState';
import type { Room } from '../dungeon/Room';

const MAX_FLOORS = 7;

export class GameEngine {
  private _state!: GameState;

  constructor(
    private readonly _player: Player,
    private readonly _saveService: ISaveService,
    private readonly _dungeonGenerator: DungeonGenerator,
    private readonly _combatEngine: CombatEngine,
    private readonly _renderer: IRenderer,
    private readonly _input: IInputHandler,
  ) {}

  async start(): Promise<void> {
    this._renderer.banner();

    const hasSave = await this._saveService.hasSave();
    if (hasSave) {
      const resume = await this._input.confirm('💾 Save encontrado. Deseja continuar?');
      if (resume) {
        await this._loadGame();
      } else {
        await this._saveService.deleteSave();
        this._newGame();
      }
    } else {
      this._newGame();
    }

    await this._gameLoop();
  }

  private async _gameLoop(): Promise<void> {
    while (!this._state.isOver) {
      const room = this._state.rooms[this._state.currentRoomIndex];
      if (!room) {
        await this._advanceFloor();
        continue;
      }

      this._renderer.renderPlayerStatus(this._state.player);
      this._renderer.renderRoom(room);

      if (!room.visited) {
        room.visited = true;
        await this._enterRoom(room);
      } else {
        await this._showRoomMenu(room);
      }

      if (!this._state.player.isAlive()) {
        this._renderer.renderGameOver();
        await this._saveService.deleteSave();
        this._state.isOver = true;
        break;
      }

      if (this._state.player.floor > MAX_FLOORS) {
        this._renderer.renderVictory(this._state.player);
        await this._saveService.deleteSave();
        this._state.isOver = true;
        break;
      }
    }
  }

  private async _enterRoom(room: Room): Promise<void> {
    switch (room.type) {
      case 'COMBAT':
      case 'ELITE_COMBAT':
      case 'BOSS':
        await this._handleCombatRoom(room);
        break;
      case 'TREASURE':
        this._handleTreasureRoom(room);
        break;
      case 'REST':
        this._handleRestRoom(room);
        break;
      case 'SHOP':
        await this._handleShopRoom(room);
        break;
    }
  }

  private async _handleCombatRoom(room: Room): Promise<void> {
    const outcome = await this._combatEngine.run(this._state.player, room.enemies);

    if (outcome === 'VICTORY') {
      room.cleared = true;
      const player = this._state.player;

      for (const enemy of room.enemies) {
        const { experience, gold } = enemy.rewards;
        player.gainGold(gold);
        const leveledUp = player.gainExperience(experience);
        this._renderer.log(`\n+${experience} XP  +${gold}G`);
        if (leveledUp) this._renderer.renderLevelUp(player);
      }

      if (room.loot.length > 0) {
        this._renderer.renderLoot(room.loot);
        for (const item of room.loot) {
          if (!player.inventory.isFull) {
            player.inventory.add(item);
            this._renderer.log(`  ✅ ${item.name} adicionado ao inventário.`);
          } else {
            this._renderer.log(`  ❌ Inventário cheio. ${item.name} descartado.`);
          }
        }
      }

      await this._saveGame();
      await this._promptNextRoom();

    } else if (outcome === 'FLED') {
      this._renderer.log('Você voltou ao corredor...');
      await this._promptNextRoom();
    }
    // DEFEAT: game loop handles isAlive() check
  }

  private _handleTreasureRoom(room: Room): void {
    room.cleared = true;
    if (room.loot.length === 0) {
      this._renderer.log('😕 O baú estava vazio.');
    } else {
      this._renderer.renderLoot(room.loot);
      for (const item of room.loot) {
        if (!this._state.player.inventory.isFull) {
          this._state.player.inventory.add(item);
          this._renderer.log(`  ✅ ${item.name} adicionado.`);
        }
      }
    }
    this._promptNextRoomSync();
  }

  private _handleRestRoom(room: Room): void {
    room.cleared = true;
    this._state.player.fullRestore();
    this._renderer.log('🕯  Você descansou e recuperou todo HP e MP!');
    this._promptNextRoomSync();
  }

  private async _handleShopRoom(room: Room): Promise<void> {
    room.cleared = true;
    if (room.loot.length === 0) {
      this._renderer.log('🏪 O mercador não tem nada para vender hoje.');
    } else {
      const item = room.loot[0]!;
      const price = 30 + this._state.player.floor * 10;
      this._renderer.log(`\n🏪 O mercador oferece: ${item.toString()}`);
      this._renderer.log(`   Preço: ${price}G  |  Seu ouro: ${this._state.player.gold}G`);

      const buy = await this._input.confirm('Comprar?');
      if (buy) {
        if (this._state.player.spendGold(price)) {
          this._state.player.inventory.add(item);
          this._renderer.log(`✅ Comprou ${item.name}!`);
        } else {
          this._renderer.log('❌ Ouro insuficiente.');
        }
      }
    }
    await this._promptNextRoom();
  }

  private async _showRoomMenu(room: Room): Promise<void> {
    this._renderer.log(`\n[Sala já visitada — ${room.cleared ? 'limpa' : 'ativa'}]`);
    await this._promptNextRoom();
  }

  private async _promptNextRoom(): Promise<void> {
    const totalRooms = this._state.rooms.length;
    const nextIdx = this._state.currentRoomIndex + 1;

    if (nextIdx >= totalRooms) {
      this._renderer.log('\n🚪 Você alcançou as escadas. Próximo andar!');
      await this._input.ask('Pressione Enter para continuar...');
      await this._advanceFloor();
    } else {
      this._renderer.log(`\n📍 Próxima sala: ${nextIdx + 1}/${totalRooms}`);
      await this._input.ask('Pressione Enter para avançar...');
      this._state.currentRoomIndex = nextIdx;
    }
  }

  private _promptNextRoomSync(): void {
    // Fire-and-forget navigation used in sync room handlers —
    // the game loop re-checks currentRoomIndex next iteration.
    this._state.currentRoomIndex++;
  }

  private async _advanceFloor(): Promise<void> {
    this._state.player.advanceFloor();
    const floor = this._state.player.floor;

    if (floor > MAX_FLOORS) return;

    this._renderer.log(`\n🏰 Entrando no Andar ${floor}...`);
    this._state.rooms = this._dungeonGenerator.generate(floor);
    this._state.currentRoomIndex = 0;

    await this._saveGame();
  }

  private async _saveGame(): Promise<void> {
    await this._saveService.save({
      version: 1,
      savedAt: new Date().toISOString(),
      player: this._state.player.toSnapshot(),
    });
  }

  private async _loadGame(): Promise<void> {
    const data = await this._saveService.load();
    if (!data) { this._newGame(); return; }

    // Restore player stats from snapshot (skills/inventory stay as new-game defaults)
    Object.assign(this._player['_stats'], data.player.stats);
    (this._player as unknown as { _experience: number })['_experience'] = data.player.experience;
    (this._player as unknown as { _gold: number })['_gold'] = data.player.gold;
    (this._player as unknown as { _floor: number })['_floor'] = data.player.floor;

    this._state = {
      player: this._player,
      rooms: this._dungeonGenerator.generate(data.player.floor),
      currentRoomIndex: 0,
      isOver: false,
    };

    this._renderer.log(`\n✅ Jogo carregado. Bem-vindo de volta, ${this._player.name}!`);
  }

  private _newGame(): void {
    this._state = {
      player: this._player,
      rooms: this._dungeonGenerator.generate(1),
      currentRoomIndex: 0,
      isOver: false,
    };
  }
}
