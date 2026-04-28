'use strict';

/* ================================================================
   Dungeon RPG — browser client
   Communicates with the Node game-engine over WebSocket.
   All game logic stays on the server; this file only manages the UI.
   ================================================================ */

const ENEMY_SPRITES = {
  'Goblin':             '👺',
  'Aranha Gigante':     '🕷️',
  'Esqueleto Guerreiro':'💀',
  'Mago Sombrio':       '🧙',
  'Golem de Pedra':     '🗿',
  'Dragão das Sombras': '🐲',
};
const DEFAULT_SPRITE = '👾';

const ROOM_ICONS = {
  COMBAT:       '⚔️',
  ELITE_COMBAT: '⚡',
  TREASURE:     '💰',
  REST:         '🕯',
  SHOP:         '🏪',
  BOSS:         '👑',
};

const ROOM_CLASSES = {
  COMBAT:       'room-COMBAT',
  ELITE_COMBAT: 'room-ELITE_COMBAT',
  TREASURE:     'room-TREASURE',
  REST:         'room-REST',
  SHOP:         'room-SHOP',
  BOSS:         'room-BOSS',
};

// ── DOM refs ─────────────────────────────────────────────────────
const $ = id => document.getElementById(id);
const els = {
  connDot:      $('conn-dot'),
  floorDisplay: $('floor-display'),
  nameScreen:   $('name-screen'),
  gameScreen:   $('game-screen'),
  nameInput:    $('name-input'),
  nameBtn:      $('name-submit-btn'),
  roomDisplay:  $('room-display'),
  enemyArea:    $('enemy-area'),
  actionArea:   $('action-area'),
  playerName:   $('player-name'),
  playerLevel:  $('player-level'),
  charPortrait: $('char-portrait'),
  hpFill:       $('hp-bar-fill'),
  hpLabel:      $('hp-bar-label'),
  mpFill:       $('mp-bar-fill'),
  mpLabel:      $('mp-bar-label'),
  xpFill:       $('xp-bar-fill'),
  xpLabel:      $('xp-bar-label'),
  statAtk:      $('stat-atk'),
  statDef:      $('stat-def'),
  statGold:     $('stat-gold'),
  statFloor:    $('stat-floor'),
  statusArea:   $('status-effects'),
  battleLog:    $('battle-log'),
  overlay:      $('overlay'),
};

// ── State ─────────────────────────────────────────────────────────
const state = {
  phase: 'NAME_INPUT',  // NAME_INPUT | GAME | GAME_OVER | VICTORY
  ws: null,
  lastPlayer: null,
};

// ── WebSocket ─────────────────────────────────────────────────────
function connect() {
  const protocol = location.protocol === 'https:' ? 'wss:' : 'ws:';
  const ws = new WebSocket(`${protocol}//${location.host}`);
  state.ws = ws;

  ws.onopen = () => {
    els.connDot.classList.add('connected');
    els.connDot.title = 'Conectado';
  };

  ws.onmessage = ev => {
    try {
      handleMsg(JSON.parse(ev.data));
    } catch (e) {
      console.error('WS parse error', e);
    }
  };

  ws.onclose = () => {
    els.connDot.classList.remove('connected');
    els.connDot.title = 'Desconectado';
    addLog('🔌 Conexão encerrada.', 'system');
  };

  ws.onerror = () => {
    addLog('❌ Erro de WebSocket. Recarregue a página.', 'damage');
  };
}

function send(value) {
  if (state.ws && state.ws.readyState === WebSocket.OPEN) {
    state.ws.send(JSON.stringify({ value: String(value) }));
  }
}

// ── Message dispatch ──────────────────────────────────────────────
function handleMsg(msg) {
  switch (msg.type) {
    case 'LOG':    addLog(msg.text, msg.color); break;
    case 'STATE':  updateHUD(msg.player, msg.enemies); break;
    case 'ROOM':   showRoom(msg.roomType, msg.description); break;
    case 'PROMPT': showPrompt(msg); break;
    case 'GAME_OVER': showOverlay('game-over', '💀 GAME OVER 💀',
      'Você sucumbiu nas sombras da masmorra...'); break;
    case 'VICTORY':   showOverlay('victory',   '🏆 VITÓRIA! 🏆',
      'Você conquistou a masmorra! Lendário!'); break;
  }
}

// ── Battle log ────────────────────────────────────────────────────
function addLog(text, color = 'info') {
  const entry = document.createElement('div');
  entry.className = `log-entry log-${color}`;
  entry.textContent = text;
  els.battleLog.appendChild(entry);
  els.battleLog.scrollTop = els.battleLog.scrollHeight;
  // Keep at most 300 entries
  while (els.battleLog.children.length > 300) {
    els.battleLog.removeChild(els.battleLog.firstChild);
  }
}

function addLogSeparator() {
  const hr = document.createElement('hr');
  hr.className = 'log-separator';
  els.battleLog.appendChild(hr);
}

// ── HUD update ────────────────────────────────────────────────────
function updateHUD(player, enemies) {
  if (!player) return;
  const prev = state.lastPlayer;
  state.lastPlayer = player;

  els.playerName.textContent  = player.name;
  els.playerLevel.textContent = `Lv.${player.level}`;
  els.floorDisplay.textContent = player.floor;
  els.statAtk.textContent     = player.attack;
  els.statDef.textContent     = player.defense;
  els.statGold.textContent    = `${player.gold}G`;
  els.statFloor.textContent   = player.floor;

  updateBar('hp', player.hp, player.maxHp);
  updateBar('mp', player.mana, player.maxMana);
  updateBar('xp', player.experience, player.level * 100);

  // Low HP warning
  const hpTrack = els.hpFill.parentElement;
  if (player.hp / player.maxHp < 0.25) {
    hpTrack.parentElement.classList.add('hp-low');
  } else {
    hpTrack.parentElement.classList.remove('hp-low');
  }

  // Level-up flash
  if (prev && player.level > prev.level) {
    const sidebar = document.querySelector('.g-sidebar');
    sidebar.classList.remove('sidebar-levelup');
    void sidebar.offsetWidth; // reflow to restart animation
    sidebar.classList.add('sidebar-levelup');
    setTimeout(() => sidebar.classList.remove('sidebar-levelup'), 900);
  }

  // Status effects
  els.statusArea.innerHTML = '';
  (player.statusEffects || []).filter(Boolean).forEach(s => {
    const badge = document.createElement('span');
    badge.className = 'status-badge';
    badge.textContent = s;
    els.statusArea.appendChild(badge);
  });

  // Enemies
  updateEnemies(enemies || []);
}

function updateBar(type, current, max) {
  const fill  = $(`${type}-bar-fill`);
  const label = $(`${type}-bar-label`);
  if (!fill) return;
  const pct = max > 0 ? Math.max(0, Math.min(100, (current / max) * 100)) : 0;
  fill.style.width = `${pct}%`;
  if (label) label.textContent = `${current}/${max}`;
}

// ── Room ──────────────────────────────────────────────────────────
function showRoom(roomType, description) {
  addLogSeparator();

  const icon  = ROOM_ICONS[roomType]  ?? '🚪';
  const cls   = ROOM_CLASSES[roomType] ?? '';

  els.roomDisplay.className = `g-room ${cls}`;
  els.roomDisplay.innerHTML = `
    <span class="room-icon">${icon}</span>
    <span class="room-desc">${escHtml(description)}</span>
  `;
}

// ── Enemies ───────────────────────────────────────────────────────
function updateEnemies(enemies) {
  const alive = enemies.filter(e => e.hp > 0);
  if (alive.length === 0) {
    els.enemyArea.innerHTML = '';
    return;
  }
  showScreen('game');

  // Update existing cards or rebuild
  const existing = els.enemyArea.querySelectorAll('.ec');
  if (existing.length === alive.length) {
    alive.forEach((e, i) => updateEnemyCard(existing[i], e));
  } else {
    els.enemyArea.innerHTML = alive.map(buildEnemyCardHtml).join('');
  }
}

function buildEnemyCardHtml(enemy) {
  const pct    = Math.max(0, Math.min(100, (enemy.hp / enemy.maxHp) * 100));
  const sprite = ENEMY_SPRITES[enemy.name] ?? DEFAULT_SPRITE;
  const tier   = (enemy.tier || '').toLowerCase();
  const badge  = enemy.tier === 'BOSS'  ? '<div class="ec-badge">👑 BOSS</div>'
               : enemy.tier === 'ELITE' ? '<div class="ec-badge">⚡ ELITE</div>'
               : '';
  const status = (enemy.statusEffects || []).filter(Boolean).join(' ');

  return `
    <div class="ec ${tier}" data-name="${escHtml(enemy.name)}">
      <div class="ec-aura"></div>
      ${badge}
      <div class="ec-sprite">${sprite}</div>
      <div class="ec-name">${escHtml(enemy.name)}</div>
      <div class="ec-level">Lv.${enemy.level}</div>
      <div class="ec-hp-bar">
        <div class="ec-hp-fill" style="width:${pct}%"></div>
      </div>
      <div class="ec-hp-val">${enemy.hp}/${enemy.maxHp}</div>
      ${status ? `<div class="ec-status">${escHtml(status)}</div>` : ''}
    </div>
  `;
}

function updateEnemyCard(cardEl, enemy) {
  const pct = Math.max(0, Math.min(100, (enemy.hp / enemy.maxHp) * 100));
  const fill = cardEl.querySelector('.ec-hp-fill');
  const lbl  = cardEl.querySelector('.ec-hp-val');
  const sts  = cardEl.querySelector('.ec-status');

  const prevPct = parseFloat(fill.style.width || '100');
  if (pct < prevPct) {
    // Shake on damage
    cardEl.classList.remove('hit');
    void cardEl.offsetWidth;
    cardEl.classList.add('hit');
    setTimeout(() => cardEl.classList.remove('hit'), 400);
  }

  fill.style.width = `${pct}%`;
  if (lbl) lbl.textContent = `${enemy.hp}/${enemy.maxHp}`;
  if (sts) sts.textContent = (enemy.statusEffects || []).filter(Boolean).join(' ');
}

// ── Prompt ────────────────────────────────────────────────────────
function showPrompt(prompt) {
  els.actionArea.innerHTML = '';

  if (prompt.kind === 'choice') {
    const grid = document.createElement('div');
    grid.className = 'choice-grid';

    prompt.choices.forEach(choice => {
      const btn = document.createElement('button');
      btn.className = `choice-btn${choice.disabled ? ' disabled' : ''}`;
      btn.textContent = choice.label;
      btn.disabled = !!choice.disabled;
      btn.dataset.value = choice.value;

      btn.addEventListener('click', () => {
        if (!choice.disabled) {
          send(choice.value);
          clearActionArea();
        }
      });

      grid.appendChild(btn);
    });

    els.actionArea.appendChild(grid);
    showScreen('game');

  } else if (prompt.kind === 'text') {
    // First prompt = hero name, handled by name screen
    if (state.phase === 'NAME_INPUT') return;

    // "Pressione Enter para continuar" → show a simple button
    if (/Enter|continuar|avançar/i.test(prompt.placeholder)) {
      const btn = document.createElement('button');
      btn.className = 'choice-btn standalone';
      btn.textContent = '➡️  Continuar';
      btn.addEventListener('click', () => { send(' '); clearActionArea(); });
      els.actionArea.appendChild(btn);
    } else {
      renderTextInput(prompt.placeholder);
    }
  }
}

function renderTextInput(placeholder) {
  const wrap = document.createElement('div');
  wrap.className = 'text-prompt';

  const label = document.createElement('div');
  label.className = 'prompt-label';
  label.textContent = placeholder;

  const row = document.createElement('div');
  row.className = 'prompt-input-row';

  const input = document.createElement('input');
  input.type = 'text';
  input.className = 'prompt-input';
  input.placeholder = 'Resposta...';

  const btn = document.createElement('button');
  btn.className = 'choice-btn';
  btn.textContent = '✓';

  const submit = () => {
    const val = input.value.trim();
    if (val) { send(val); clearActionArea(); }
  };

  input.addEventListener('keydown', e => { if (e.key === 'Enter') submit(); });
  btn.addEventListener('click', submit);

  row.appendChild(input);
  row.appendChild(btn);
  wrap.appendChild(label);
  wrap.appendChild(row);
  els.actionArea.appendChild(wrap);
  setTimeout(() => input.focus(), 40);
}

function clearActionArea() {
  els.actionArea.innerHTML = '';
}

// ── Overlay ───────────────────────────────────────────────────────
function showOverlay(cls, title, sub) {
  state.phase = cls === 'game-over' ? 'GAME_OVER' : 'VICTORY';
  els.overlay.innerHTML = `
    <div class="ov-content ${cls}">
      <div class="ov-title">${title}</div>
      <div class="ov-sub">${escHtml(sub)}</div>
      <button class="choice-btn standalone" onclick="location.reload()">
        🔄 Jogar Novamente
      </button>
    </div>
  `;
  els.overlay.classList.remove('hidden');
}

// ── Screen switcher ───────────────────────────────────────────────
function showScreen(name) {
  document.querySelectorAll('.screen').forEach(s => s.classList.add('hidden'));
  const screen = document.getElementById(`${name}-screen`);
  if (screen) screen.classList.remove('hidden');
}

// ── Name screen ───────────────────────────────────────────────────
function submitName() {
  const name = els.nameInput.value.trim();
  if (!name) {
    els.nameInput.classList.remove('shake');
    void els.nameInput.offsetWidth;
    els.nameInput.classList.add('shake');
    return;
  }
  state.phase = 'GAME';
  showScreen('game');
  addLog(`🧝 ${name} adentra a masmorra...`, 'gold');
  send(name);
}

// ── Keyboard shortcuts ────────────────────────────────────────────
document.addEventListener('keydown', e => {
  // Number keys → click matching choice button
  if (e.key >= '1' && e.key <= '9') {
    const btn = els.actionArea.querySelector(`.choice-btn[data-value="${e.key}"]`);
    if (btn && !btn.disabled) btn.click();
  }
  // Enter → click "Continuar" or submit text prompt
  if (e.key === 'Enter') {
    const continueBtn = els.actionArea.querySelector('.choice-btn.standalone');
    if (continueBtn) { continueBtn.click(); return; }
    const input = els.actionArea.querySelector('.prompt-input');
    if (input) { input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true })); }
  }
});

// ── Helpers ───────────────────────────────────────────────────────
function escHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

// ── Boot ──────────────────────────────────────────────────────────
window.addEventListener('DOMContentLoaded', () => {
  connect();

  els.nameBtn.addEventListener('click', submitName);
  els.nameInput.addEventListener('keydown', e => { if (e.key === 'Enter') submitName(); });
  els.nameInput.focus();
});
