import fs from 'fs/promises';
import path from 'path';
import type { ISaveService, SaveData } from './ISaveService';

const SAVE_VERSION = 1;

export class JsonSaveService implements ISaveService {
  private readonly _filePath: string;

  constructor(savesDir: string, slotName = 'hero') {
    this._filePath = path.join(savesDir, `${slotName}.json`);
  }

  async save(data: SaveData): Promise<void> {
    const payload: SaveData = { ...data, version: SAVE_VERSION, savedAt: new Date().toISOString() };
    await fs.mkdir(path.dirname(this._filePath), { recursive: true });
    await fs.writeFile(this._filePath, JSON.stringify(payload, null, 2), 'utf-8');
  }

  async load(): Promise<SaveData | null> {
    try {
      const raw = await fs.readFile(this._filePath, 'utf-8');
      const data = JSON.parse(raw) as SaveData;
      if (data.version !== SAVE_VERSION) return null;
      return data;
    } catch {
      return null;
    }
  }

  async hasSave(): Promise<boolean> {
    try {
      await fs.access(this._filePath);
      return true;
    } catch {
      return false;
    }
  }

  async deleteSave(): Promise<void> {
    try {
      await fs.unlink(this._filePath);
    } catch {
      // file didn't exist — no-op
    }
  }
}
