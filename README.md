# Projeto Éter ⚔️

Dungeon crawler RPG de turnos com estética **Aetherpunk** — tecnologia arcana, interfaces holográficas e monstros construídos em obsidiana ciano. Joga no navegador, zero instalação para o jogador.

## Demo rápida

```bash
pnpm install
pnpm dev        # http://localhost:3000
```

## Stack

| Camada | Tecnologia |
|--------|-----------|
| Runtime | Node.js + TypeScript (tsx watch) |
| Servidor | Express + WebSocket (ws) |
| Frontend | Vanilla JS + CSS custom properties |
| Persistência | JSON local (`saves/`) |
| Build | tsup |
| Testes | Vitest |

## Arquitetura

```
src/
  core/          # Entidades, skills, inventário, classes de personagem
  combat/        # CombatEngine — loop de turnos, ordens de ação, intents
  dungeon/       # DungeonGenerator + EnemyFactory (salas procedurais)
  game/          # GameEngine — máquina de estados do jogo
  persistence/   # JsonSaveService — snapshot do jogador em JSON
  web/           # WebSocket server, renderer, input handler
  ui/            # Interfaces IRenderer / IInputHandler
public/
  index.html     # SPA — telas de nome, classe e jogo
  game.js        # Lógica de UI (WebSocket client)
  style.css      # Design system Aetherpunk completo
assets/
  monster/       # Sprites e fichas JSON dos monstros
```

## Classes de personagem

| Classe | HP | MP | ATK | DEF | SPD | Estilo |
|--------|----|----|-----|-----|-----|--------|
| Vanguardista | 150 | 35 | 13 | 9 | 4 | Tank / controle |
| Tecnomago | 65 | 110 | 20 | 2 | 8 | Burst mágico |
| Netcipher | 80 | 55 | 17 | 4 | 11 | Crítico / veneno |
| Sentinela | 105 | 80 | 12 | 6 | 6 | Suporte / cura |

## Mecânicas principais

- **Combate por turnos** com ordem de ação baseada em velocidade (tiebreak aleatório justo quando ΔSpeed < 3)
- **Sistema de intenção de inimigos** — cada inimigo revela sua próxima ação antes do turno do jogador
- **Tiers de item** D → C → B → A → S → S+ com escala por andar
- **Equipamento em combate** com ataque de oportunidade do inimigo
- **Efeitos de status** — Veneno, Queimadura, Fraqueza, Atordoamento, Regeneração
- **Salvar/carregar** completo: HP/MP/EXP/Gold/andar + inventário + equipados + cooldowns de skill
- **7 andares** de dificuldade progressiva com 4–7 salas cada (combate, elite, boss, tesouro, descanso, loja)
- **3 monstros únicos** com assets locais: Tecelão do Éter, Sombra Abissal, Gárgula dos Éons

## Monstros

| Monstro | Tipo | Tier |
|---------|------|------|
| Tecelão do Éter | Combate padrão | Normal |
| Sombra Abissal | Elite | Ultravioleta |
| Gárgula dos Éons | Boss | Obsidiana ciano |

## Comandos

```bash
pnpm dev            # Servidor com hot reload
pnpm build          # Compila para dist/
pnpm type-check     # tsc --noEmit
pnpm test           # Testes unitários (Vitest)
```

## Licença

MIT
