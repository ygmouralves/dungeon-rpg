import type WebSocket from 'ws';
import { EventEmitter } from 'events';

export interface ChoiceItem {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface PlayerUI {
  name: string;
  level: number;
  hp: number;
  maxHp: number;
  mana: number;
  maxMana: number;
  attack: number;
  defense: number;
  gold: number;
  experience: number;
  floor: number;
  statusEffects: string[];
}

export interface EnemyUI {
  name: string;
  tier: string;
  hp: number;
  maxHp: number;
  level: number;
  statusEffects: string[];
}

export type ServerMsg =
  | { type: 'LOG'; text: string; color: string }
  | { type: 'STATE'; player: PlayerUI; enemies: EnemyUI[] }
  | { type: 'ROOM'; roomType: string; description: string }
  | { type: 'PROMPT'; kind: 'text'; placeholder: string }
  | { type: 'PROMPT'; kind: 'choice'; choices: ChoiceItem[] }
  | { type: 'GAME_OVER' }
  | { type: 'VICTORY' };

export class WebChannel extends EventEmitter {
  private _pendingChoices: ChoiceItem[] | null = null;

  constructor(private readonly _ws: WebSocket) {
    super();
    _ws.on('message', (raw: Buffer | string) => {
      try {
        const msg = JSON.parse(raw.toString()) as { value: string };
        this.emit('input', msg.value ?? '');
      } catch { /* ignore malformed frames */ }
    });
  }

  send(msg: ServerMsg): void {
    if ((this._ws.readyState as number) === 1 /* OPEN */) {
      this._ws.send(JSON.stringify(msg));
    }
  }

  setPendingChoices(choices: ChoiceItem[]): void {
    this._pendingChoices = choices;
  }

  consumePendingChoices(): ChoiceItem[] | null {
    const c = this._pendingChoices;
    this._pendingChoices = null;
    return c;
  }
}
