# ⚔️ Dungeon RPG

A turn-based dungeon crawler playable in the **browser** or **terminal** — built with TypeScript and no external game frameworks.

Every run is procedurally generated: room layout, enemy encounters, and loot drops are randomized each session. Progress is auto-saved after each floor.

---

## Quick start

```bash
npm install

# Browser UI (recommended)
npm run web         # → http://localhost:3000

# Classic terminal
npm run dev
```

**Docker — zero local setup:**

```bash
docker compose up --build   # web UI at localhost:3000
```

---

## Gameplay

Navigate through **7 floors** of increasingly dangerous rooms, each generated fresh every run.

| Room type | What happens |
|---|---|
| ⚔️ Combat | Fight 1 enemy, 50% loot drop |
| ⚡ Elite | Tougher enemy, guaranteed loot |
| 💰 Treasure | Two loot rolls, no combat |
| 🕯 Rest | Full HP + MP restore |
| 🏪 Shop | Buy an item with gold |
| 👑 Boss | Floor boss + 3× loot (last room) |

**Skills**: Power Strike · Fireball · Sacred Heal  
**Status effects**: Poison · Burn · Stun · Regeneration · Weakness · Fortify  
**Enemies**: Goblin · Giant Spider · Skeleton Warrior · Shadow Mage · Stone Golem · Shadow Dragon

Combat is turn-ordered by speed. Enemies use a weighted AI that prefers skills when available and adapts as the floor scales.

---

## Architecture

```
src/
├── core/
│   ├── entities/       Entity (abstract) → Player, Enemy
│   ├── skills/         Skill (abstract) + StatusEffect (abstract + 6 effects)
│   └── inventory/      Item (abstract) → ConsumableItem, EquipmentItem
├── dungeon/            DungeonGenerator (procedural) + EnemyFactory
├── combat/             CombatEngine (turn-based loop)
├── persistence/        ISaveService interface + JsonSaveService
├── ui/
│   ├── IInputHandler   Interface — readline or WebSocket
│   ├── IRenderer       Interface — terminal or browser
│   └── web/            WebChannel · WebInputHandler · WebRenderer · GameServer
├── di/                 Lightweight DI container (singleton + transient)
└── game/               GameEngine orchestrator
```

The game engine never knows whether it's running in a terminal or a browser. The rendering target is decided entirely at the composition root (`main.ts` vs `web-main.ts`).

New enemy types: add a template to `EnemyFactory`.  
New skills: create a class extending `Skill`.  
New persistence: implement `ISaveService`.

---

## Tech

| | |
|---|---|
| Language | TypeScript 5 (strict) |
| Runtime | Node.js 20 |
| Web server | Express + ws |
| Terminal output | chalk |
| Font | Press Start 2P (Google Fonts) |
| Build | tsc |

No game engine. No frontend framework. No ORM.

---

## Save system

State is persisted to `saves/<hero_name>.json` after each combat victory and floor transition. On restart, the game offers to resume from the last save.

---

## License

MIT
