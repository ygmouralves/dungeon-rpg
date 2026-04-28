import { Item, type ItemTier } from './Item';

export type EquipmentSlot = 'WEAPON' | 'ARMOR' | 'ACCESSORY';

export class EquipmentItem extends Item {
  constructor(
    id: string,
    name: string,
    description: string,
    tier: ItemTier,
    public readonly slot: EquipmentSlot,
    public readonly attackBonus: number,
    public readonly defenseBonus: number,
  ) {
    super(id, name, description, tier);
  }

  getTypeLabel(): string {
    return `Equipamento (${this._slotLabel()})`;
  }

  private _slotLabel(): string {
    return { WEAPON: 'Arma', ARMOR: 'Armadura', ACCESSORY: 'Acessório' }[this.slot];
  }
}
