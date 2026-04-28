import express from 'express';
import { WebSocketServer } from 'ws';
import http from 'http';
import path from 'path';
import { WebChannel } from './WebChannel';
import { WebInputHandler } from './WebInputHandler';
import { WebRenderer } from './WebRenderer';
import { DungeonGenerator } from '../dungeon/DungeonGenerator';
import { CombatEngine } from '../combat/CombatEngine';
import { JsonSaveService } from '../persistence/JsonSaveService';
import { GameEngine } from '../game/GameEngine';
import { buildPlayerForClass, getClassesUI } from '../core/classes/CharacterClass';

const SAVES_DIR = path.join(process.cwd(), 'saves');
const PUBLIC_DIR = path.join(process.cwd(), 'public');

const VALID_CLASS_IDS = new Set(['vanguard', 'technomage', 'netcipher', 'warden']);

async function startGame(
  name: string,
  classId: string,
  input: WebInputHandler,
  renderer: WebRenderer,
): Promise<void> {
  const player = buildPlayerForClass(name, classId);
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

      // Step 1 — ask for hero name
      channel.send({ type: 'PROMPT', kind: 'text', placeholder: 'Nome do seu herói' });

      channel.once('input', (rawName: string) => {
        const heroName = rawName.trim();
        if (!heroName) {
          channel.send({ type: 'LOG', text: '❌ Nome inválido.', color: 'damage' });
          return;
        }

        // Step 2 — send class selection screen
        channel.send({ type: 'CLASS_SELECT', classes: getClassesUI() });

        // Step 3 — wait for class choice
        channel.once('input', (classId: string) => {
          const chosen = VALID_CLASS_IDS.has(classId) ? classId : 'vanguard';

          startGame(heroName, chosen, input, renderer).catch(err => {
            console.error(`[game:${heroName}]`, err);
            channel.send({ type: 'LOG', text: '❌ Erro interno no jogo.', color: 'damage' });
          });
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
