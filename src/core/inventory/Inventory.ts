import type { Item } from './Item';
import type { ConsumableItem } from './ConsumableItem';
import type { EquipmentItem } from './EquipmentItem';

export class Inventory {
  private readonly _items: Item[] = [];

  constructor(public readonly maxSlots: number = 20) {}

  get items(): Item[] { return [...this._items]; }
  get size(): number { return this._items.length; }
  get isFull(): boolean { return this._items.length >= this.maxSlots; }

  add(item: Item): boolean {
    if (this.isFull) return false;
    this._items.push(item);
    return true;
  }

  remove(id: string): Item | null {
    const idx = this._items.findIndex(i => i.id === id);
    if (idx === -1) return null;
    return this._items.splice(idx, 1)[0] ?? null;
  }

  findById(id: string): Item | undefined {
    return this._items.find(i => i.id === id);
  }

  getConsumables(): ConsumableItem[] {
    return this._items.filter((i): i is ConsumableItem => i.getTypeLabel() === 'Consumível');
  }

  getEquipment(): EquipmentItem[] {
    return this._items.filter((i): i is EquipmentItem => i.getTypeLabel().startsWith('Equipamento'));
  }
}
