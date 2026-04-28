import type { PlayerSnapshot } from '../core/entities/Player';

export interface SaveData {
  version: number;
  savedAt: string;
  player: PlayerSnapshot;
}

export interface ISaveService {
  save(data: SaveData): Promise<void>;
  load(): Promise<SaveData | null>;
  hasSave(): Promise<boolean>;
  deleteSave(): Promise<void>;
}
