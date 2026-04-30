'use strict';

// ── SVG Portraits — Aetherpunk style ─────────────────────────────
const PORTRAITS = {
  vanguard: `<svg viewBox="0 0 80 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="80" height="100" fill="#0a0f1a"/>
    <ellipse cx="40" cy="72" rx="34" ry="26" fill="#1a3a5c" opacity="0.5"/>
    <!-- Body/chest armor -->
    <path d="M16 62 L20 48 L60 48 L64 62 L62 96 L18 96Z" fill="#1a3a5c"/>
    <path d="M20 48 L40 54 L60 48" stroke="#79c0ff" stroke-width="0.8" opacity="0.5" fill="none"/>
    <!-- Circuit lines on armor -->
    <line x1="40" y1="54" x2="40" y2="88" stroke="#388bfd" stroke-width="0.6" opacity="0.4"/>
    <line x1="28" y1="62" x2="52" y2="62" stroke="#388bfd" stroke-width="0.6" opacity="0.3"/>
    <line x1="24" y1="72" x2="56" y2="72" stroke="#388bfd" stroke-width="0.6" opacity="0.3"/>
    <!-- Energy core on chest -->
    <circle cx="40" cy="66" r="6" fill="#0d2b45" stroke="#79c0ff" stroke-width="1"/>
    <circle cx="40" cy="66" r="3" fill="#388bfd" opacity="0.8"/>
    <circle cx="40" cy="66" r="1.5" fill="#79c0ff"/>
    <!-- Left pauldron -->
    <path d="M8 58 L16 48 L22 60 L14 66Z" fill="#1e4d72"/>
    <line x1="8" y1="58" x2="16" y2="48" stroke="#79c0ff" stroke-width="0.6" opacity="0.4"/>
    <!-- Right pauldron -->
    <path d="M72 58 L64 48 L58 60 L66 66Z" fill="#1e4d72"/>
    <line x1="72" y1="58" x2="64" y2="48" stroke="#79c0ff" stroke-width="0.6" opacity="0.4"/>
    <!-- Neck -->
    <rect x="34" y="38" width="12" height="12" fill="#0d1f2e" rx="1"/>
    <!-- Helmet -->
    <path d="M22 38 L22 20 Q40 10 58 20 L58 38Z" fill="#1a3a5c"/>
    <path d="M22 28 Q31 16 40 12 Q49 16 58 28" stroke="#79c0ff" stroke-width="0.7" fill="none" opacity="0.4"/>
    <!-- Visor band -->
    <rect x="24" y="26" width="32" height="14" fill="#080f1a" rx="1"/>
    <!-- Visor HUD lines -->
    <line x1="26" y1="31" x2="54" y2="31" stroke="#388bfd" stroke-width="0.4" opacity="0.5"/>
    <line x1="26" y1="35" x2="48" y2="35" stroke="#388bfd" stroke-width="0.4" opacity="0.3"/>
    <!-- Cyan visor glow eyes -->
    <ellipse cx="32" cy="32" rx="5" ry="3" fill="#0d2b45"/>
    <ellipse cx="48" cy="32" rx="5" ry="3" fill="#0d2b45"/>
    <ellipse cx="32" cy="32" rx="3.5" ry="2" fill="#388bfd" opacity="0.9"/>
    <ellipse cx="48" cy="32" rx="3.5" ry="2" fill="#388bfd" opacity="0.9"/>
    <ellipse cx="32" cy="32" rx="2" ry="1.2" fill="#79c0ff"/>
    <ellipse cx="48" cy="32" rx="2" ry="1.2" fill="#79c0ff"/>
    <!-- Helmet ridge -->
    <rect x="38" y="10" width="4" height="14" fill="#388bfd" rx="1" opacity="0.7"/>
    <!-- Shield edge -->
    <path d="M8 62 L14 58 L14 84 L8 80 Z" fill="#132638" stroke="#388bfd" stroke-width="0.5" opacity="0.7"/>
    <line x1="11" y1="66" x2="11" y2="76" stroke="#79c0ff" stroke-width="0.6" opacity="0.5"/>
    <!-- Bottom bar -->
    <rect x="18" y="97" width="44" height="2" fill="#79c0ff" opacity="0.3" rx="1"/>
  </svg>`,

  technomage: `<svg viewBox="0 0 80 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="80" height="100" fill="#0f0a1e"/>
    <ellipse cx="40" cy="65" rx="33" ry="28" fill="#2d1b69" opacity="0.4"/>
    <!-- Robe body -->
    <path d="M14 64 L20 50 L60 50 L66 64 L70 96 L10 96Z" fill="#1a0f3a"/>
    <!-- Robe folds -->
    <line x1="24" y1="56" x2="18" y2="92" stroke="#3d1a78" stroke-width="1.2" opacity="0.5"/>
    <line x1="40" y1="54" x2="40" y2="93" stroke="#3d1a78" stroke-width="1.2" opacity="0.5"/>
    <line x1="56" y1="56" x2="62" y2="92" stroke="#3d1a78" stroke-width="1.2" opacity="0.5"/>
    <!-- Arcane circuit on robe -->
    <circle cx="40" cy="70" r="8" stroke="#8957e5" stroke-width="0.6" opacity="0.4" fill="none"/>
    <circle cx="40" cy="70" r="4" stroke="#bb86fc" stroke-width="0.5" opacity="0.3" fill="none"/>
    <line x1="32" y1="70" x2="48" y2="70" stroke="#8957e5" stroke-width="0.4" opacity="0.3"/>
    <line x1="40" y1="62" x2="40" y2="78" stroke="#8957e5" stroke-width="0.4" opacity="0.3"/>
    <!-- Collar -->
    <path d="M20 50 L40 56 L60 50" stroke="#8957e5" stroke-width="0.8" fill="none" opacity="0.5"/>
    <!-- Sleeves -->
    <path d="M8 68 L20 50 L26 62 L16 74Z" fill="#120b2e"/>
    <path d="M72 68 L60 50 L54 62 L64 74Z" fill="#120b2e"/>
    <!-- Neck -->
    <rect x="34" y="36" width="12" height="16" fill="#0f0a1e" rx="1"/>
    <!-- Head -->
    <ellipse cx="40" cy="30" rx="14" ry="16" fill="#1a1030"/>
    <!-- Face - minimal, mysterious -->
    <ellipse cx="35" cy="29" rx="3.5" ry="2.5" fill="#2d1b69"/>
    <ellipse cx="45" cy="29" rx="3.5" ry="2.5" fill="#2d1b69"/>
    <ellipse cx="35" cy="29" rx="2.5" ry="1.8" fill="#8957e5" opacity="0.9"/>
    <ellipse cx="45" cy="29" rx="2.5" ry="1.8" fill="#8957e5" opacity="0.9"/>
    <ellipse cx="35" cy="29" rx="1.2" ry="1.2" fill="#d8b4fe"/>
    <ellipse cx="45" cy="29" rx="1.2" ry="1.2" fill="#d8b4fe"/>
    <!-- Tall pointed hat -->
    <path d="M18 26 Q40 -10 62 26 L56 34 L24 34Z" fill="#1a0f3a"/>
    <!-- Hat brim -->
    <path d="M14 34 Q40 39 66 34 L62 30 Q40 35 18 30Z" fill="#2d1b69"/>
    <!-- Hat rune -->
    <circle cx="40" cy="8" r="4" fill="#8957e5" opacity="0.5"/>
    <circle cx="40" cy="8" r="2" fill="#bb86fc" opacity="0.8"/>
    <circle cx="40" cy="8" r="1" fill="#e9d5ff"/>
    <!-- Arcane data streams on hat -->
    <line x1="36" y1="16" x2="32" y2="30" stroke="#8957e5" stroke-width="0.4" opacity="0.4"/>
    <line x1="44" y1="16" x2="48" y2="30" stroke="#8957e5" stroke-width="0.4" opacity="0.4"/>
    <!-- Floating orb -->
    <circle cx="12" cy="70" r="8" fill="#0f0a1e" stroke="#8957e5" stroke-width="0.8"/>
    <circle cx="12" cy="70" r="5" fill="#2d1b69" opacity="0.8"/>
    <circle cx="12" cy="70" r="2.5" fill="#8957e5"/>
    <circle cx="12" cy="70" r="1" fill="#e9d5ff"/>
    <circle cx="10" cy="68" r="0.8" fill="white" opacity="0.7"/>
    <!-- Orb glow -->
    <circle cx="12" cy="70" r="10" fill="#8957e5" opacity="0.07"/>
    <!-- Bottom bar -->
    <rect x="18" y="97" width="44" height="2" fill="#bb86fc" opacity="0.3" rx="1"/>
  </svg>`,

  netcipher: `<svg viewBox="0 0 80 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="80" height="100" fill="#030d05"/>
    <ellipse cx="40" cy="68" rx="34" ry="26" fill="#052e16" opacity="0.5"/>
    <!-- Dark cloak -->
    <path d="M10 64 L18 48 L62 48 L70 64 L72 96 L8 96Z" fill="#0d1a0f"/>
    <path d="M18 48 L40 54 L62 48" stroke="#22c55e" stroke-width="0.5" fill="none" opacity="0.3"/>
    <!-- Cloak circuit lines -->
    <line x1="22" y1="54" x2="16" y2="90" stroke="#14532d" stroke-width="1" opacity="0.4"/>
    <line x1="58" y1="54" x2="64" y2="90" stroke="#14532d" stroke-width="1" opacity="0.4"/>
    <!-- Leather armor highlights -->
    <path d="M22 58 L24 50 L56 50 L58 58" stroke="#14532d" stroke-width="0.8" fill="none" opacity="0.5"/>
    <!-- Crossed daggers on chest -->
    <rect x="31" y="56" width="3" height="28" fill="#374151" rx="1" transform="rotate(-18 33 70)"/>
    <rect x="27" y="63" width="11" height="2.5" fill="#4b5563" rx="0.5" transform="rotate(-18 33 70)"/>
    <rect x="31" y="55" width="3" height="4" fill="#6b7280" rx="0.5" transform="rotate(-18 33 70)"/>
    <line x1="32" y1="60" x2="31" y2="74" stroke="#9ca3af" stroke-width="0.4" opacity="0.5" transform="rotate(-18 33 70)"/>
    <rect x="46" y="56" width="3" height="28" fill="#374151" rx="1" transform="rotate(18 49 70)"/>
    <rect x="42" y="63" width="11" height="2.5" fill="#4b5563" rx="0.5" transform="rotate(18 49 70)"/>
    <rect x="46" y="55" width="3" height="4" fill="#6b7280" rx="0.5" transform="rotate(18 49 70)"/>
    <line x1="50" y1="60" x2="51" y2="74" stroke="#9ca3af" stroke-width="0.4" opacity="0.5" transform="rotate(18 49 70)"/>
    <!-- Neck -->
    <rect x="34" y="38" width="12" height="12" fill="#080e09" rx="1"/>
    <!-- Deep hood outer -->
    <path d="M18 42 Q18 12 40 8 Q62 12 62 42 L62 48 L18 48Z" fill="#111a12"/>
    <!-- Hood shadow -->
    <path d="M22 42 Q22 16 40 12 Q58 16 58 42 L58 46 L22 46Z" fill="#040908"/>
    <!-- Hood rim glow -->
    <path d="M20 42 Q20 14 40 10 Q60 14 60 42" stroke="#22c55e" stroke-width="0.5" fill="none" opacity="0.25"/>
    <!-- Hood folds -->
    <path d="M18 48 Q22 36 26 32" stroke="#1a2e1b" stroke-width="1.5" fill="none"/>
    <path d="M62 48 Q58 36 54 32" stroke="#1a2e1b" stroke-width="1.5" fill="none"/>
    <!-- Visor lens left -->
    <ellipse cx="31" cy="30" rx="6" ry="4" fill="#091409"/>
    <ellipse cx="31" cy="30" rx="5" ry="3" fill="#052e16"/>
    <!-- Visor lens right -->
    <ellipse cx="49" cy="30" rx="6" ry="4" fill="#091409"/>
    <ellipse cx="49" cy="30" rx="5" ry="3" fill="#052e16"/>
    <!-- Visor bridge -->
    <rect x="36" y="29" width="8" height="2" fill="#0d1a0f" rx="1"/>
    <!-- EYES — the signature feature -->
    <ellipse cx="31" cy="30" rx="3.5" ry="2.5" fill="#14532d"/>
    <ellipse cx="49" cy="30" rx="3.5" ry="2.5" fill="#14532d"/>
    <ellipse cx="31" cy="30" rx="2.5" ry="1.8" fill="#16a34a"/>
    <ellipse cx="49" cy="30" rx="2.5" ry="1.8" fill="#16a34a"/>
    <ellipse cx="31" cy="30" rx="1.2" ry="1.2" fill="#4ade80"/>
    <ellipse cx="49" cy="30" rx="1.2" ry="1.2" fill="#4ade80"/>
    <ellipse cx="30.4" cy="29.4" rx="0.7" ry="0.7" fill="#bbf7d0" opacity="0.9"/>
    <ellipse cx="48.4" cy="29.4" rx="0.7" ry="0.7" fill="#bbf7d0" opacity="0.9"/>
    <!-- Eye aura -->
    <ellipse cx="31" cy="30" rx="7" ry="5" fill="#22c55e" opacity="0.08"/>
    <ellipse cx="49" cy="30" rx="7" ry="5" fill="#22c55e" opacity="0.08"/>
    <!-- Data stream lines near eyes -->
    <line x1="18" y1="29" x2="25" y2="29" stroke="#22c55e" stroke-width="0.4" opacity="0.3"/>
    <line x1="62" y1="29" x2="55" y2="29" stroke="#22c55e" stroke-width="0.4" opacity="0.3"/>
    <!-- Bottom bar -->
    <rect x="18" y="97" width="44" height="2" fill="#22c55e" opacity="0.3" rx="1"/>
  </svg>`,

  warden: `<svg viewBox="0 0 80 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="80" height="100" fill="#0e0c00"/>
    <ellipse cx="40" cy="68" rx="34" ry="26" fill="#451a03" opacity="0.4"/>
    <!-- Radial light behind figure -->
    <line x1="40" y1="58" x2="15" y2="85" stroke="#e3b341" stroke-width="0.4" opacity="0.15"/>
    <line x1="40" y1="58" x2="65" y2="85" stroke="#e3b341" stroke-width="0.4" opacity="0.15"/>
    <line x1="40" y1="58" x2="40" y2="90" stroke="#e3b341" stroke-width="0.4" opacity="0.15"/>
    <line x1="40" y1="58" x2="18" y2="70" stroke="#e3b341" stroke-width="0.4" opacity="0.15"/>
    <line x1="40" y1="58" x2="62" y2="70" stroke="#e3b341" stroke-width="0.4" opacity="0.15"/>
    <!-- Body armor -->
    <path d="M18 62 L22 48 L58 48 L62 62 L60 96 L20 96Z" fill="#2c1a00"/>
    <path d="M22 48 L40 54 L58 48" stroke="#e3b341" stroke-width="0.7" fill="none" opacity="0.4"/>
    <line x1="40" y1="52" x2="40" y2="90" stroke="#92400e" stroke-width="1.2" opacity="0.4"/>
    <!-- Cross emblem — balanced design -->
    <rect x="37" y="58" width="6" height="22" fill="#e3b341" opacity="0.5" rx="0.5"/>
    <rect x="30" y="66" width="20" height="6" fill="#e3b341" opacity="0.5" rx="0.5"/>
    <!-- Pauldrons -->
    <path d="M10 58 L18 48 L24 60 L16 66Z" fill="#3d2200"/>
    <path d="M70 58 L62 48 L56 60 L64 66Z" fill="#3d2200"/>
    <line x1="10" y1="58" x2="18" y2="48" stroke="#e3b341" stroke-width="0.6" opacity="0.4"/>
    <line x1="70" y1="58" x2="62" y2="48" stroke="#e3b341" stroke-width="0.6" opacity="0.4"/>
    <!-- Neck -->
    <rect x="34" y="38" width="12" height="12" fill="#1a0d00" rx="1"/>
    <!-- Helmet -->
    <path d="M22 38 L22 20 Q40 10 58 20 L58 38Z" fill="#3d2200"/>
    <path d="M22 28 Q31 17 40 13 Q49 17 58 28" stroke="#e3b341" stroke-width="0.7" fill="none" opacity="0.4"/>
    <!-- Face opening -->
    <ellipse cx="40" cy="30" rx="13" ry="11" fill="#1a0d00"/>
    <ellipse cx="40" cy="30" rx="10" ry="8" fill="#0e0c00"/>
    <!-- Golden eyes -->
    <ellipse cx="34" cy="29" rx="4" ry="3" fill="#451a03"/>
    <ellipse cx="46" cy="29" rx="4" ry="3" fill="#451a03"/>
    <ellipse cx="34" cy="29" rx="3" ry="2.2" fill="#d97706" opacity="0.9"/>
    <ellipse cx="46" cy="29" rx="3" ry="2.2" fill="#d97706" opacity="0.9"/>
    <ellipse cx="34" cy="29" rx="1.5" ry="1.5" fill="#fbbf24"/>
    <ellipse cx="46" cy="29" rx="1.5" ry="1.5" fill="#fbbf24"/>
    <ellipse cx="33.4" cy="28.4" rx="0.8" ry="0.8" fill="#fef3c7" opacity="0.9"/>
    <ellipse cx="45.4" cy="28.4" rx="0.8" ry="0.8" fill="#fef3c7" opacity="0.9"/>
    <!-- Helmet cross -->
    <rect x="38" y="12" width="4" height="14" fill="#e3b341" opacity="0.6" rx="0.5"/>
    <rect x="33" y="18" width="14" height="4" fill="#e3b341" opacity="0.6" rx="0.5"/>
    <!-- Halo ring -->
    <circle cx="40" cy="22" r="20" stroke="#e3b341" stroke-width="0.8" fill="none" opacity="0.3"/>
    <circle cx="40" cy="22" r="22" stroke="#fbbf24" stroke-width="0.4" fill="none" opacity="0.15"/>
    <!-- Bottom bar -->
    <rect x="18" y="97" width="44" height="2" fill="#e3b341" opacity="0.35" rx="1"/>
  </svg>`,
};

// Portrait displayed during gameplay (small, in sidebar)
const SIDEBAR_PORTRAITS = {
  vanguard:   PORTRAITS.vanguard,
  technomage: PORTRAITS.technomage,
  netcipher:  PORTRAITS.netcipher,
  warden:     PORTRAITS.warden,
};

// Generic enemy portrait per tier
const ENEMY_PORTRAIT = (color = '#ef4444') => `<svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
  <ellipse cx="40" cy="52" rx="30" ry="22" fill="${color}" opacity="0.06"/>
  <ellipse cx="40" cy="38" rx="18" ry="22" fill="${color}" opacity="0.12"/>
  <ellipse cx="40" cy="36" rx="14" ry="18" fill="${color}" opacity="0.2"/>
  <ellipse cx="35" cy="32" rx="4" ry="3" fill="${color}" opacity="0.8"/>
  <ellipse cx="45" cy="32" rx="4" ry="3" fill="${color}" opacity="0.8"/>
  <ellipse cx="35" cy="32" rx="2.5" ry="2" fill="#fff" opacity="0.7"/>
  <ellipse cx="45" cy="32" rx="2.5" ry="2" fill="#fff" opacity="0.7"/>
  <path d="M30 50 Q40 58 50 50" stroke="${color}" stroke-width="1.5" fill="none" opacity="0.5"/>
</svg>`;

const ROOM_ICONS = {
  COMBAT:       '⚔',
  ELITE_COMBAT: '◈',
  TREASURE:     '◇',
  REST:         '◉',
  SHOP:         '◎',
  BOSS:         '✦',
};

const $ = id => document.getElementById(id);

const els = {
  connDot:      $('conn-dot'),
  floorDisplay: $('floor-display'),
  nameScreen:   $('name-screen'),
  classScreen:  $('class-screen'),
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

const TIER_CSS = { 'D': 'tier-d', 'C': 'tier-c', 'B': 'tier-b', 'A': 'tier-a', 'S': 'tier-s', 'S+': 'tier-s-plus' };

const state = {
  phase:       'NAME_INPUT',
  ws:          null,
  classId:     null,
  lastPlayer:  null,
  prevHp:      {},   // tracks enemy HP for damage floats
  inventory:   [],   // cached from latest STATE message
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
    try { handleMsg(JSON.parse(ev.data)); } catch (e) { console.error('WS parse', e); }
  };

  ws.onclose = () => {
    els.connDot.classList.remove('connected');
    els.connDot.title = 'Desconectado';
    addLog('Conexão encerrada.', 'system');
  };

  ws.onerror = () => addLog('Erro de conexão. Recarregue a página.', 'red');
}

function send(value) {
  if (state.ws && state.ws.readyState === WebSocket.OPEN) {
    state.ws.send(JSON.stringify({ value: String(value) }));
  }
}

// ── Message dispatch ──────────────────────────────────────────────
function handleMsg(msg) {
  switch (msg.type) {
    case 'LOG':          addLog(msg.text, msg.color);            break;
    case 'STATE':        updateHUD(msg.player, msg.enemies);     break;
    case 'ROOM':         showRoom(msg.roomType, msg.description); break;
    case 'PROMPT':       showPrompt(msg);                        break;
    case 'CLASS_SELECT': showClassScreen(msg.classes);           break;
    case 'LEVEL_UP':     showLevelUpModal(msg.level, msg.points);break;
    case 'GAME_OVER':
      showOverlay('game-over', 'PROTOCOLO ENCERRADO', 'Você sucumbiu nas profundezas do Éter...');
      break;
    case 'VICTORY':
      showOverlay('victory', 'MISSÃO CONCLUÍDA', 'O Éter foi conquistado. Lenda registrada.');
      break;
  }
}

// ── Battle log ────────────────────────────────────────────────────
function addLog(text, color = 'info') {
  const entry = document.createElement('div');
  entry.className = `log-entry log-${color}`;
  entry.textContent = text;
  els.battleLog.appendChild(entry);
  els.battleLog.scrollTop = els.battleLog.scrollHeight;
  while (els.battleLog.children.length > 300) {
    els.battleLog.removeChild(els.battleLog.firstChild);
  }
}

function addLogSeparator() {
  const hr = document.createElement('hr');
  hr.className = 'log-separator';
  els.battleLog.appendChild(hr);
}

// ── HUD ───────────────────────────────────────────────────────────
function updateHUD(player, enemies) {
  if (!player) return;
  const prev = state.lastPlayer;
  state.lastPlayer = player;
  state.inventory = player.inventory || [];

  els.playerName.textContent  = player.name;
  els.playerLevel.textContent = `Lv.${player.level}`;
  els.floorDisplay.textContent = player.floor;
  els.statAtk.textContent     = player.attack;
  els.statDef.textContent     = player.defense;
  els.statGold.textContent    = `${player.gold}`;
  els.statFloor.textContent   = player.floor;

  updateBar('hp', player.hp, player.maxHp);
  updateBar('mp', player.mana, player.maxMana);
  updateBar('xp', player.experience, player.level * 100);

  const hpPct = player.hp / player.maxHp;
  els.hpFill.closest('.s-bar-row').classList.toggle('hp-low', hpPct < 0.25);

  // Screen shake when player takes damage
  if (prev && player.hp < prev.hp) {
    const arena = document.querySelector('.g-arena');
    arena.classList.remove('arena-shake');
    void arena.offsetWidth;
    arena.classList.add('arena-shake');
    setTimeout(() => arena.classList.remove('arena-shake'), 500);
  }

  if (prev && player.level > prev.level) {
    const sidebar = document.querySelector('.g-sidebar');
    sidebar.classList.remove('sidebar-levelup');
    void sidebar.offsetWidth;
    sidebar.classList.add('sidebar-levelup');
    setTimeout(() => sidebar.classList.remove('sidebar-levelup'), 900);
  }

  els.statusArea.innerHTML = '';
  (player.statusEffects || []).filter(Boolean).forEach(s => {
    const badge = document.createElement('span');
    badge.className = 'status-badge';
    badge.textContent = s;
    els.statusArea.appendChild(badge);
  });

  updateEnemies(enemies || []);
}

function updateBar(type, current, max) {
  const fill  = $(`${type}-bar-fill`);
  const label = $(`${type}-bar-label`);
  if (!fill) return;
  const pct = max > 0 ? Math.max(0, Math.min(100, (current / max) * 100)) : 0;
  fill.style.width = `${pct}%`;
  if (label) {
    if (type === 'xp') {
      const need = max - current;
      const nextLevel = Math.round(max / 100) + 1;
      label.textContent = need > 0 ? `Faltam ${need} XP ▸ Nv.${nextLevel}` : 'NÍVEL MÁXIMO';
    } else {
      label.textContent = `${current}/${max}`;
    }
  }
}

// ── Room ──────────────────────────────────────────────────────────
function showRoom(roomType, description) {
  addLogSeparator();
  const icon = ROOM_ICONS[roomType] ?? '▸';
  els.roomDisplay.className = `g-room room-${roomType}`;
  els.roomDisplay.innerHTML = `
    <span class="room-icon">${icon}</span>
    <span class="room-desc">${escHtml(description)}</span>
  `;
}

// ── Enemies ───────────────────────────────────────────────────────
function updateEnemies(enemies) {
  const alive = enemies.filter(e => e.hp > 0);
  if (alive.length === 0) { els.enemyArea.innerHTML = ''; return; }
  showScreen('game');

  const existing = els.enemyArea.querySelectorAll('.ec');
  if (existing.length === alive.length) {
    alive.forEach((e, i) => updateEnemyCard(existing[i], e));
  } else {
    const isCombatStart = existing.length === 0 && alive.length > 0;
    state.prevHp = {};
    alive.forEach(e => { state.prevHp[e.name] = e.hp; });
    els.enemyArea.innerHTML = alive.map(buildEnemyCardHtml).join('');
    if (isCombatStart) {
      els.enemyArea.classList.remove('combat-enter');
      void els.enemyArea.offsetWidth;
      els.enemyArea.classList.add('combat-enter');
      setTimeout(() => els.enemyArea.classList.remove('combat-enter'), 700);
    }
    // Attach 3D tilt to newly created enemy cards
    els.enemyArea.querySelectorAll('.ec').forEach(attachTilt);
  }
}

function buildIntentHtml(intent) {
  if (!intent) return '';
  const cls   = intent.type === 'ATTACK' ? 'attack' : 'skill';
  const icon  = intent.type === 'ATTACK' ? '⚔' : '✦';
  const label = intent.type === 'ATTACK' ? 'Ataque' : escHtml(intent.label);
  return `<div class="ec-intent ${cls}">${icon} ${label}</div>`;
}

function buildEnemyCardHtml(enemy) {
  const pct    = Math.max(0, Math.min(100, (enemy.hp / enemy.maxHp) * 100));
  const tier   = (enemy.tier || '').toLowerCase();
  const color  = tier === 'boss' ? '#ff7b72' : tier === 'elite' ? '#bb86fc' : '#8b949e';
  const badge  = enemy.tier === 'BOSS'  ? '<div class="ec-badge">✦ BOSS</div>'
               : enemy.tier === 'ELITE' ? '<div class="ec-badge">◈ ELITE</div>'
               : '';
  const status = (enemy.statusEffects || []).filter(Boolean).join(' · ');
  const desc   = enemy.description ? `<div class="ec-desc">${escHtml(enemy.description)}</div>` : '';

  return `
    <div class="ec ${tier}" data-name="${escHtml(enemy.name)}">
      <div class="ec-aura"></div>
      ${badge}
      ${buildIntentHtml(enemy.intent)}
      <div class="ec-sprite">${ENEMY_PORTRAIT(color)}</div>
      <div class="ec-name">${escHtml(enemy.name)}</div>
      <div class="ec-level">Lv.${enemy.level}</div>
      ${desc}
      <div class="ec-hp-bar"><div class="ec-hp-fill" style="width:${pct}%"></div></div>
      <div class="ec-hp-val">${enemy.hp}/${enemy.maxHp}</div>
      ${status ? `<div class="ec-status">${escHtml(status)}</div>` : ''}
    </div>
  `;
}

function updateEnemyCard(cardEl, enemy) {
  const pct      = Math.max(0, Math.min(100, (enemy.hp / enemy.maxHp) * 100));
  const fill     = cardEl.querySelector('.ec-hp-fill');
  const lbl      = cardEl.querySelector('.ec-hp-val');
  const sts      = cardEl.querySelector('.ec-status');
  const prevHp   = state.prevHp[enemy.name] ?? enemy.maxHp;
  const dmgDealt = prevHp - enemy.hp;

  if (dmgDealt > 0) {
    cardEl.classList.remove('hit');
    void cardEl.offsetWidth;
    cardEl.classList.add('hit');
    setTimeout(() => cardEl.classList.remove('hit'), 400);
    showFloatingDamage(cardEl, dmgDealt);
  }

  state.prevHp[enemy.name] = enemy.hp;
  if (fill) fill.style.width = `${pct}%`;
  if (lbl) lbl.textContent = `${enemy.hp}/${enemy.maxHp}`;
  if (sts) sts.textContent = (enemy.statusEffects || []).filter(Boolean).join(' · ');

  // Update intent badge
  const oldIntent = cardEl.querySelector('.ec-intent');
  const newIntentHtml = buildIntentHtml(enemy.intent);
  if (oldIntent) {
    oldIntent.outerHTML = newIntentHtml || '';
  } else if (newIntentHtml) {
    const sprite = cardEl.querySelector('.ec-sprite');
    if (sprite) sprite.insertAdjacentHTML('beforebegin', newIntentHtml);
  }
}

// ── 3D Card Tilt ──────────────────────────────────────────────────
function attachTilt(card) {
  card.addEventListener('mousemove', e => {
    const r  = card.getBoundingClientRect();
    const x  = (e.clientX - r.left) / r.width  - 0.5;
    const y  = (e.clientY - r.top)  / r.height - 0.5;
    card.style.setProperty('--rx', `${y * -10}deg`);
    card.style.setProperty('--ry', `${x *  10}deg`);
  });
  card.addEventListener('mouseleave', () => {
    card.style.setProperty('--rx', '0deg');
    card.style.setProperty('--ry', '0deg');
  });
}

function showFloatingDamage(cardEl, amount) {
  const num = document.createElement('div');
  if (amount <= 0) {
    num.className = 'dmg-float dmg-miss';
    num.textContent = 'MISS';
  } else {
    num.className = 'dmg-float';
    num.textContent = `-${amount}`;
  }
  cardEl.style.position = 'relative';
  cardEl.appendChild(num);
  setTimeout(() => num.remove(), 950);
}

function showPlayerDamage(amount) {
  const num = document.createElement('div');
  if (amount <= 0) {
    num.className = 'dmg-float player-dmg dmg-miss';
    num.textContent = 'BLOQUEADO';
  } else {
    num.className = 'dmg-float player-dmg';
    num.textContent = `-${amount}`;
  }
  const arena = document.querySelector('.g-arena');
  if (arena) {
    arena.style.position = 'relative';
    arena.appendChild(num);
    setTimeout(() => num.remove(), 950);
  }
}

// ── Class selection screen ────────────────────────────────────────
function showClassScreen(classes) {
  showScreen('class');
  const grid = $('class-grid');
  grid.innerHTML = '';

  const MAX = { hp: 160, mp: 120, atk: 22, def: 10, spd: 12 };
  let selectedCard = null;

  classes.forEach(cls => {
    const card = document.createElement('div');
    card.className = 'cc';
    card.dataset.class = cls.id;

    const statRows = [
      { k: 'HP',  v: cls.stats.hp,  max: MAX.hp },
      { k: 'EP',  v: cls.stats.mp,  max: MAX.mp },
      { k: 'ATK', v: cls.stats.atk, max: MAX.atk },
      { k: 'DEF', v: cls.stats.def, max: MAX.def },
      { k: 'VEL', v: cls.stats.spd, max: MAX.spd },
    ].map(s => `
      <div class="cc-stat-row">
        <span class="cc-stat-k">${s.k}</span>
        <div class="cc-stat-track">
          <div class="cc-stat-fill" style="width:${Math.round((s.v/s.max)*100)}%"></div>
        </div>
        <span class="cc-stat-v">${s.v}</span>
      </div>`).join('');

    const skillRows = cls.skills.map(s => `
      <div class="cc-skill">
        <span class="cc-skill-name">${escHtml(s.name)}</span>
        <span class="cc-skill-cost">${s.manaCost}ep</span>
      </div>`).join('');

    card.innerHTML = `
      <div class="cc-portrait-wrap">
        <div class="cc-aura"></div>
        ${PORTRAITS[cls.id] ?? ''}
      </div>
      <div class="cc-name">${escHtml(cls.name)}</div>
      <div class="cc-tagline">${escHtml(cls.tagline)}</div>
      <div class="cc-lore">${escHtml(cls.lore)}</div>
      <div class="cc-stats">${statRows}</div>
      <div class="cc-skills">${skillRows}</div>
    `;

    card.addEventListener('click', () => {
      if (selectedCard) selectedCard.classList.remove('selected');
      card.classList.add('selected');
      selectedCard = card;
    });

    card.addEventListener('dblclick', () => confirmClass(cls, grid));
    grid.appendChild(card);
  });

  // Enter to confirm selected class
  const handler = (e) => {
    if (e.key !== 'Enter' || !selectedCard) return;
    document.removeEventListener('keydown', handler);
    const cls = classes.find(c => c.id === selectedCard.dataset.class);
    if (cls) confirmClass(cls, grid);
  };
  document.addEventListener('keydown', handler);
}

function confirmClass(cls, grid) {
  state.classId = cls.id;
  state.phase = 'GAME';

  // Update sidebar portrait
  els.charPortrait.innerHTML = SIDEBAR_PORTRAITS[cls.id] ?? '';

  addLog(`Classe selecionada: ${cls.name}`, 'gold');

  // Dissolve animation
  const content = document.querySelector('.cs-content');
  if (content) {
    content.classList.add('cs-dissolving');
    setTimeout(() => { send(cls.id); }, 320);
  } else {
    send(cls.id);
  }
}

// ── Prompt ────────────────────────────────────────────────────────
function showPrompt(prompt) {
  els.actionArea.innerHTML = '';

  if (prompt.kind === 'choice') {
    if (state.phase === 'NAME_INPUT') return;

    const bar = document.createElement('div');
    bar.className = 'action-bar';

    prompt.choices.forEach(choice => {
      const card = document.createElement('button');
      const kind  = choice.kind || 'default';
      card.className = 'action-card';
      card.dataset.kind  = kind;
      card.dataset.value = choice.value;
      card.disabled = !!choice.disabled;

      // EP cost badge
      let costHtml = '';
      if (choice.description) {
        const epMatch = choice.description.match(/(\d+)\s*EP/);
        if (epMatch) {
          costHtml = `<span class="card-cost">${epMatch[1]} EP</span>`;
        } else if (kind === 'attack') {
          costHtml = `<span class="card-cost free">ATK</span>`;
        } else if (kind !== 'flee') {
          costHtml = `<span class="card-cost free">—</span>`;
        }
      }

      card.innerHTML = `
        <span class="card-icon">${escHtml(choice.icon || '◈')}</span>
        <span class="card-name">${escHtml(choice.label)}</span>
        ${costHtml}
      `;

      card.addEventListener('click', () => {
        if (choice.disabled) return;
        if (choice.value === 'open_inventory') {
          showInventoryModal();
        } else {
          send(choice.value);
          clearActionArea();
        }
      });

      attachTilt(card);
      bar.appendChild(card);
    });

    els.actionArea.appendChild(bar);
    showScreen('game');

  } else if (prompt.kind === 'text') {
    if (state.phase === 'NAME_INPUT') return;

    if (/Enter|continuar|avançar/i.test(prompt.placeholder || '')) {
      const btn = document.createElement('button');
      btn.className = 'continue-btn';
      btn.textContent = '▸  Continuar';
      btn.addEventListener('click', () => { send(' '); clearActionArea(); });
      els.actionArea.appendChild(btn);
    } else {
      renderTextInput(prompt.placeholder);
    }
  }
}

function renderTextInput(placeholder) {
  const wrap  = document.createElement('div');
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
  btn.className = 'action-btn';
  btn.dataset.kind = 'default';
  btn.innerHTML = '<span class="btn-label">OK</span>';

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

function clearActionArea() { els.actionArea.innerHTML = ''; }

// ── Inventory Modal ───────────────────────────────────────────────
function showInventoryModal() {
  const overlay = document.createElement('div');
  overlay.className = 'inv-overlay';

  const modal = document.createElement('div');
  modal.className = 'inv-modal';

  modal.innerHTML = `
    <div class="inv-header">
      <span class="inv-title">◎ INVENTÁRIO</span>
      <button class="inv-close" title="Fechar">✕</button>
    </div>
  `;

  const grid = document.createElement('div');
  grid.className = 'inv-grid';

  if (!state.inventory || state.inventory.length === 0) {
    grid.innerHTML = '<div class="inv-empty">Inventário vazio</div>';
  } else {
    state.inventory.forEach(item => {
      const tierCss  = TIER_CSS[item.tier] || 'tier-d';
      const isEquip  = item.slot !== null;
      const statLine = isEquip
        ? [item.attackBonus > 0 ? `+${item.attackBonus} ATK` : null, item.defenseBonus > 0 ? `+${item.defenseBonus} DEF` : null]
            .filter(Boolean).join('  ')
        : '';

      const card = document.createElement('div');
      card.className = `item-card ${tierCss}`;

      card.innerHTML = `
        <div class="card-tier-badge">${escHtml(item.tier)}</div>
        <div class="card-item-name">${escHtml(item.name)}</div>
        <div class="card-item-desc">${escHtml(item.description)}</div>
        ${statLine ? `<div class="card-item-stat">${escHtml(statLine)}</div>` : ''}
        <div class="card-item-actions">
          ${isEquip
            ? `<button class="card-action-btn equip" data-id="${escHtml(item.id)}">EQUIPAR</button>`
            : `<button class="card-action-btn use"   data-id="${escHtml(item.id)}">USAR</button>`}
        </div>
      `;

      attachTilt(card);
      grid.appendChild(card);
    });
  }

  modal.appendChild(grid);
  overlay.appendChild(modal);
  document.body.appendChild(overlay);

  const closeModal = () => overlay.remove();

  modal.querySelector('.inv-close').addEventListener('click', closeModal);
  overlay.addEventListener('click', e => { if (e.target === overlay) closeModal(); });

  grid.addEventListener('click', e => {
    const equipBtn = e.target.closest('.card-action-btn.equip');
    const useBtn   = e.target.closest('.card-action-btn.use');
    if (equipBtn) {
      const id = equipBtn.dataset.id;
      closeModal();
      clearActionArea();
      send(`equip_${id}`);
    } else if (useBtn) {
      const id = useBtn.dataset.id;
      closeModal();
      clearActionArea();
      send(`use_${id}`);
    }
  });
}

// ── Level Up Modal ────────────────────────────────────────────────
const CLASS_REC = {
  vanguard:   { str: 0.5, dex: 0.1, int: 0.0, vit: 0.4 },
  technomage: { str: 0.0, dex: 0.2, int: 0.6, vit: 0.2 },
  netcipher:  { str: 0.3, dex: 0.5, int: 0.1, vit: 0.1 },
  warden:     { str: 0.2, dex: 0.0, int: 0.4, vit: 0.4 },
};

const STAT_DEFS = [
  { key: 'str', abbr: 'FOR', desc: 'Força · +2 ATK por ponto' },
  { key: 'dex', abbr: 'DES', desc: 'Destreza · +1 VEL por ponto' },
  { key: 'int', abbr: 'INT', desc: 'Intelecto · +8 EP por ponto' },
  { key: 'vit', abbr: 'VIT', desc: 'Vitalidade · +8 HP por ponto' },
];

function showLevelUpModal(level, totalPoints) {
  addLog(`NÍVEL ${level} ATINGIDO — Distribua ${totalPoints} pontos!`, 'gold');

  const alloc = { str: 0, dex: 0, int: 0, vit: 0 };
  let remaining = totalPoints;

  const overlay = document.createElement('div');
  overlay.className = 'lu-overlay';

  const modal = document.createElement('div');
  modal.className = 'lu-modal';

  const ptsBadge = document.createElement('span');
  ptsBadge.className = 'lu-points-badge';

  function updateBadge() {
    ptsBadge.textContent = remaining === 0
      ? 'Todos os pontos distribuídos'
      : `${remaining} ponto${remaining !== 1 ? 's' : ''} restante${remaining !== 1 ? 's' : ''}`;
  }

  modal.innerHTML = `
    <div class="lu-header">
      <div class="lu-rune">✦</div>
      <div class="lu-title">NÍVEL ${level}</div>
      <div class="lu-subtitle">Distribua seus atributos</div>
    </div>
  `;
  modal.querySelector('.lu-header').appendChild(ptsBadge);

  // Stat rows
  const statsContainer = document.createElement('div');
  statsContainer.className = 'lu-stats';

  const valEls = {};

  STAT_DEFS.forEach(s => {
    const row = document.createElement('div');
    row.className = 'lu-stat-row';

    const valEl = document.createElement('span');
    valEl.className = 'lu-stat-val';
    valEl.textContent = '0';
    valEls[s.key] = valEl;

    const btnMinus = document.createElement('button');
    btnMinus.className = 'lu-stat-btn';
    btnMinus.textContent = '−';
    btnMinus.disabled = true;

    const btnPlus = document.createElement('button');
    btnPlus.className = 'lu-stat-btn';
    btnPlus.textContent = '+';

    btnPlus.addEventListener('click', () => {
      if (remaining <= 0) return;
      alloc[s.key]++;
      remaining--;
      valEl.textContent = alloc[s.key];
      valEl.classList.add('modified');
      btnMinus.disabled = alloc[s.key] <= 0;
      btnPlus.disabled  = remaining <= 0;
      updateBadge();
      confirmBtn.disabled = remaining > 0;
    });

    btnMinus.addEventListener('click', () => {
      if (alloc[s.key] <= 0) return;
      alloc[s.key]--;
      remaining++;
      valEl.textContent = alloc[s.key];
      if (alloc[s.key] === 0) valEl.classList.remove('modified');
      btnMinus.disabled = alloc[s.key] <= 0;
      btnPlus.disabled  = remaining <= 0;
      updateBadge();
      confirmBtn.disabled = remaining > 0;
    });

    row.innerHTML = `
      <span class="lu-stat-abbr">${s.abbr}</span>
      <span class="lu-stat-desc">${s.desc}</span>
    `;
    row.appendChild(valEl);
    row.appendChild(btnMinus);
    row.appendChild(btnPlus);
    statsContainer.appendChild(row);
  });

  modal.appendChild(statsContainer);

  // Buttons
  const actionsRow = document.createElement('div');
  actionsRow.className = 'lu-actions';

  const autoBtn = document.createElement('button');
  autoBtn.className = 'lu-btn-auto';
  autoBtn.textContent = '◈ Distribuição Automática';

  autoBtn.addEventListener('click', () => {
    // Reset
    STAT_DEFS.forEach(s => { alloc[s.key] = 0; });
    remaining = totalPoints;

    const rec = CLASS_REC[state.classId] || CLASS_REC.vanguard;
    let leftover = totalPoints;

    // Floor-distribute according to ratios
    const order = [...STAT_DEFS].sort((a, b) => (rec[b.key] || 0) - (rec[a.key] || 0));
    order.forEach((s, i) => {
      const pts = i < order.length - 1
        ? Math.round(totalPoints * (rec[s.key] || 0))
        : leftover;
      alloc[s.key] = Math.max(0, Math.min(pts, leftover));
      leftover -= alloc[s.key];
    });

    // Apply
    remaining = 0;
    STAT_DEFS.forEach(s => {
      valEls[s.key].textContent = alloc[s.key];
      if (alloc[s.key] > 0) {
        valEls[s.key].classList.add('modified');
      } else {
        valEls[s.key].classList.remove('modified');
      }
      // Update +/- buttons inside rows
      const row = statsContainer.querySelectorAll('.lu-stat-row')[STAT_DEFS.indexOf(s)];
      const [, , valEl2, btnM, btnP] = row.childNodes;
      if (btnM) btnM.disabled = alloc[s.key] <= 0;
      if (btnP) btnP.disabled = remaining <= 0;
    });
    updateBadge();
    confirmBtn.disabled = false;
  });

  const confirmBtn = document.createElement('button');
  confirmBtn.className = 'lu-btn-confirm';
  confirmBtn.textContent = 'CONFIRMAR';
  confirmBtn.disabled = true;

  confirmBtn.addEventListener('click', () => {
    overlay.remove();
    // Portrait glow
    els.charPortrait.classList.remove('portrait-levelup');
    void els.charPortrait.offsetWidth;
    els.charPortrait.classList.add('portrait-levelup');
    setTimeout(() => els.charPortrait.classList.remove('portrait-levelup'), 1000);

    send(JSON.stringify(alloc));
  });

  actionsRow.appendChild(autoBtn);
  actionsRow.appendChild(confirmBtn);
  modal.appendChild(actionsRow);

  overlay.appendChild(modal);
  document.body.appendChild(overlay);

  updateBadge();
}

// ── Overlay ───────────────────────────────────────────────────────
function showOverlay(cls, title, sub) {
  state.phase = cls === 'game-over' ? 'GAME_OVER' : 'VICTORY';
  els.overlay.innerHTML = `
    <div class="ov-content ${cls}">
      <div class="ov-title">${escHtml(title)}</div>
      <div class="ov-sub">${escHtml(sub)}</div>
      <button class="continue-btn" onclick="location.reload()" style="margin-top:8px">
        ↺  Jogar Novamente
      </button>
    </div>
  `;
  els.overlay.classList.remove('hidden');
}

// ── Screen switcher ───────────────────────────────────────────────
function showScreen(name) {
  document.querySelectorAll('.screen').forEach(s => s.classList.add('hidden'));
  const screen = $(`${name}-screen`);
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
  addLog(`Agente ${name} conectado ao Éter...`, 'gold');
  send(name);
}

// ── Keyboard shortcuts ────────────────────────────────────────────
document.addEventListener('keydown', e => {
  if (state.phase === 'GAME') {
    if (e.key >= '1' && e.key <= '9') {
      const btns = [...els.actionArea.querySelectorAll('.action-card:not(:disabled)')];
      const idx = parseInt(e.key, 10) - 1;
      if (btns[idx]) btns[idx].click();
    }
    if (e.key === 'Enter') {
      const cont = els.actionArea.querySelector('.continue-btn');
      if (cont) { cont.click(); return; }
    }
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
