import express from 'express';
import { WebSocketServer } from 'ws';
import http from 'http';
import path from 'path';
import { WebChannel } from './WebChannel';
import { WebInputHandler } from './WebInputHandler';
import { WebRenderer } from './WebRenderer';
import { Player } from '../core/entities/Player';
import { Inventory } from '../core/inventory/Inventory';
import { FireballSkill } from '../core/skills/FireballSkill';
import { HealSkill } from '../core/skills/HealSkill';
import { PowerStrikeSkill } from '../core/skills/PowerStrikeSkill';
import { ConsumableItem } from '../core/inventory/ConsumableItem';
import { DungeonGenerator } from '../dungeon/DungeonGenerator';
import { CombatEngine } from '../combat/CombatEngine';
import { JsonSaveService } from '../persistence/JsonSaveService';
import { GameEngine } from '../game/GameEngine';
import type { Entity } from '../core/entities/Entity';

const SAVES_DIR = path.join(process.cwd(), 'saves');
const PUBLIC_DIR = path.join(process.cwd(), 'public');

function buildPlayer(name: string): Player {
  const inventory = new Inventory(20);
  inventory.add(
    new ConsumableItem(
      'potion_start',
      'Poção de Cura',
      'Restaura 30 HP.',
      'COMMON',
      (t: Entity) => { const h = t.heal(30); return `💊 Usou Poção de Cura e recuperou ${h} HP.`; },
    ),
  );
  return new Player(
    name,
    { hp: 100, maxHp: 100, mana: 60, maxMana: 60, baseAttack: 12, baseDefense: 5, speed: 6, level: 1 },
    [new PowerStrikeSkill(), new FireballSkill(), new HealSkill()],
    inventory,
  );
}

async function startGame(
  name: string,
  input: WebInputHandler,
  renderer: WebRenderer,
): Promise<void> {
  const player = buildPlayer(name);
  const saveService = new JsonSaveService(SAVES_DIR, name.toLowerCase().replace(/\s+/g, '_'));
  const generator = new DungeonGenerator();
  const combatEngine = new CombatEngine(input, renderer);
  const engine = new GameEngine(player, saveService, generator, combatEngine, renderer, input);
  await engine.start();
}

export class GameServer {
  private readonly _app = express();
  private readonly _server = http.createServer(this._app);
  private readonly _wss = new WebSocketServer({ server: this._server });

  constructor(private readonly _port: number = 3000) {
    this._app.use(express.static(PUBLIC_DIR));

    this._wss.on('connection', ws => {
      const channel = new WebChannel(ws);
      const input = new WebInputHandler(channel);
      const renderer = new WebRenderer(channel);

      // First ask: hero name (browser renders it on the name-screen)
      channel.send({ type: 'PROMPT', kind: 'text', placeholder: 'Nome do seu herói' });

      channel.once('input', (name: string) => {
        const heroName = name.trim();
        if (!heroName) {
          channel.send({ type: 'LOG', text: '❌ Nome inválido.', color: 'damage' });
          return;
        }

        startGame(heroName, input, renderer).catch(err => {
          console.error(`[game:${heroName}]`, err);
          channel.send({ type: 'LOG', text: '❌ Erro interno no jogo.', color: 'damage' });
        });
      });

      ws.on('close', () => {
        console.log('[ws] client disconnected');
      });
    });
  }

  start(): void {
    this._server.listen(this._port, () => {
      console.log(`\n⚔️  Dungeon RPG rodando em http://localhost:${this._port}`);
      console.log('   Abra o navegador para jogar!\n');
    });
  }
}
