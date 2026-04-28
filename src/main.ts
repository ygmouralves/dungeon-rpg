import path from 'path';
import { Player } from './core/entities/Player';
import { Inventory } from './core/inventory/Inventory';
import { FireballSkill } from './core/skills/FireballSkill';
import { HealSkill } from './core/skills/HealSkill';
import { PowerStrikeSkill } from './core/skills/PowerStrikeSkill';
import { ConsumableItem } from './core/inventory/ConsumableItem';
import { DungeonGenerator } from './dungeon/DungeonGenerator';
import { CombatEngine } from './combat/CombatEngine';
import { JsonSaveService } from './persistence/JsonSaveService';
import { TerminalRenderer } from './ui/TerminalRenderer';
import { InputHandler } from './ui/InputHandler';
import { GameEngine } from './game/GameEngine';

const SAVES_DIR = path.join(process.cwd(), 'saves');

function buildPlayer(name: string): Player {
  const inventory = new Inventory(20);
  inventory.add(
    new ConsumableItem(
      'potion_start',
      'Poção de Cura',
      'Restaura 30 HP.',
      'D',
      t => { const h = t.heal(30); return `💊 Usou Poção de Cura e recuperou ${h} HP.`; },
    ),
  );

  return new Player(
    name,
    { hp: 100, maxHp: 100, mana: 60, maxMana: 60, baseAttack: 12, baseDefense: 5, speed: 6, level: 1 },
    [new PowerStrikeSkill(), new FireballSkill(), new HealSkill()],
    inventory,
  );
}

async function main(): Promise<void> {
  const input = new InputHandler();
  const renderer = new TerminalRenderer();

  renderer.banner();

  const playerName = await input.ask('🧙 Nome do seu herói: ');
  if (!playerName) {
    renderer.log('Nome inválido. Saindo.');
    input.close();
    return;
  }

  // ── Composition root — manual DI wiring ───────────────────────────────────
  const player        = buildPlayer(playerName);
  const saveService   = new JsonSaveService(SAVES_DIR, playerName.toLowerCase());
  const generator     = new DungeonGenerator();
  const combatEngine  = new CombatEngine(input, renderer);
  const engine        = new GameEngine(player, saveService, generator, combatEngine, renderer, input);

  try {
    await engine.start();
  } finally {
    input.close();
  }
}

main().catch(err => {
  console.error('Erro fatal:', err);
  process.exit(1);
});
